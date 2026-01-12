import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ItemPrint } from '../entities/itemPrint.entity';
import { ItemPrintHistory } from '../entities/itemPrintHistory.entity';

@Injectable()
export class ItemPrintService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    private chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    private buildQrCode(item: any): string {
        const safeValue = (val: any) => {
            if (val === null || val === undefined || String(val).trim() === "") {
                return "_";
            }
            return String(val).trim();
        };

        const itemNo = safeValue(item.ItemNo);
        const lotNo = safeValue(item.LotNo);
        const ProduDate = safeValue(item.ProduDate);
        const qty = safeValue(item.Qty);
        const ReelNo = safeValue(item.ReelNo);

        return [itemNo, lotNo, qty, ProduDate, ReelNo].join("/");
    }

    private buildQrCodeNew(item: any): string {
        const safeValue = (val: any) => {
            if (val === null || val === undefined || String(val).trim() === "") {
                return "_";
            }
            return String(val).trim();
        };

        const itemNo = safeValue(item.ItemNo);
        const lotNo = safeValue(item.LotNo);
        const ProduDate = safeValue(item.ProduDate);
        const qty = safeValue(item.QtyNew ?? item.Qty);
        const ReelNo = safeValue(item.ReelNo);

        return [itemNo, lotNo, qty, ProduDate, ReelNo].join("/");
    }
    private buildLotNoFull(item: any): string {
        const safeValue = (val: any) => {
            if (val === null || val === undefined || String(val).trim() === "") {
                return "_";
            }
            return String(val).trim();
        };
        const lotNo = safeValue(item.LotNo);
        const ProduDate = safeValue(item.ProduDate);
        const ReelNo = safeValue(item.ReelNo);

        return [lotNo, ProduDate, ReelNo].join("/");
    }

    ItemPrintA(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'No records provided for insertion' });
        }

        const batchSize = 50;
        const batches = this.chunkArray(result, batchSize);
        let resultCache: any[] = [];

        return from(batches).pipe(
            mergeMap((batch) =>
                from(this.dataSource.transaction(async (manager) => {
                    try {
                        // Tạo batch với IdSeq và QR Codes
                        const batchWithId = batch.map(item => {
                            const qr = this.buildQrCode(item);
                            return {
                                ...item,
                                IdSeq: uuidv7(),
                                QtyOld: item.Qty,
                                QrCode: qr,
                                QrCodeOld: qr,
                                LotNoFull: this.buildLotNoFull(item),
                            };
                        });

                        // Lấy danh sách QRCode cần check trong batch
                        const qrCodesToCheck = batchWithId.map(i => i.QrCode);
                        const itemLotPairs = batchWithId.map(i => ({ ItemSeq: i.ItemSeq, LotNoFull: i.LotNoFull }));

                        // Kiểm tra QRCode trùng trong DB
                        const existingQRCodes = await manager
                            .getRepository(ItemPrint)
                            .createQueryBuilder('ip')
                            .where('ip.QrCode IN (:...codes) OR ip.QrCodeNew IN (:...codes) OR ip.QrCodeOld IN (:...codes)', { codes: qrCodesToCheck })
                            .getMany();

                        if (existingQRCodes.length > 0) {
                            const duplicatedCodes = existingQRCodes.map(e => e.QrCode).join(', ');

                            resultCache.push({
                                success: false,
                                message: `Các QRCode đã tồn tại: ${duplicatedCodes}`,
                                data: batchWithId.filter(i => existingQRCodes.some(e => e.QrCode === i.QrCode))
                            });

                            // Trả về object lỗi để mergeMap tiếp tục xử lý
                            return {
                                success: false,
                                message: `Các QRCode đã tồn tại: ${duplicatedCodes}`,
                                data: batchWithId.filter(i => existingQRCodes.some(e => e.QrCode === i.QrCode))
                            };
                        }
                        // Kiểm tra ItemSeq + LotNoFull trùng trong DB (SQL Server)
                        const existingItemLotsQuery = manager.getRepository(ItemPrint).createQueryBuilder('ip');

                        itemLotPairs.forEach((p, index) => {
                            if (index === 0) {
                                existingItemLotsQuery.where('ip.ItemSeq = :itemSeq0 AND ip.LotNoFull = :lotNo0', {
                                    itemSeq0: p.ItemSeq,
                                    lotNo0: p.LotNoFull,
                                });
                            } else {
                                existingItemLotsQuery.orWhere(`ip.ItemSeq = :itemSeq${index} AND ip.LotNoFull = :lotNo${index}`, {
                                    [`itemSeq${index}`]: p.ItemSeq,
                                    [`lotNo${index}`]: p.LotNoFull,
                                });
                            }
                        });

                        const existingItemLots = await existingItemLotsQuery.getMany();

                        if (existingItemLots.length > 0) {
                            const duplicatedItems = existingItemLots
                                .map(e => `${e.ItemSeq}-${e.LotNoFull}`)
                                .join(', ');

                            // Báo lỗi ra và trả về batch trùng
                            resultCache.push({
                                success: false,
                                message: `NVL và LotNoFull đã tồn tại: ${duplicatedItems}`,
                                data: batchWithId.filter(i =>
                                    existingItemLots.some(e => e.ItemSeq === i.ItemSeq && e.LotNoFull === i.LotNoFull)
                                ),
                            });

                            return {
                                success: false,
                                message: `NVL và LotNoFull đã tồn tại: ${duplicatedItems}`,
                                data: batchWithId.filter(i =>
                                    existingItemLots.some(e => e.ItemSeq === i.ItemSeq && e.LotNoFull === i.LotNoFull)
                                ),
                            };
                        }

                        // Insert batch nếu không có trùng
                        const insertResult = await manager
                            .createQueryBuilder()
                            .insert()
                            .into(ItemPrint)
                            .values(batchWithId)
                            .execute();

                        const inserted = insertResult.identifiers.map((idObj, i) => ({
                            ...batchWithId[i],
                            IdSeq: idObj.IdSeq,
                        }));

                        resultCache.push({
                            success: true,
                            data: inserted,
                        });

                        return {
                            success: true,
                            data: inserted,
                        };
                    } catch (err) {
                        let friendlyMessage = 'Lỗi hệ thống khi chèn dữ liệu';

                        if (err?.code === '23505') {
                            friendlyMessage = err.message || 'Dữ liệu QRCode đã tồn tại, vui lòng nhập giá trị khác.';
                        }

                        resultCache.push({
                            success: false,
                            message: friendlyMessage,
                            data: [],
                        });

                        return {
                            success: false,
                            message: friendlyMessage,
                            data: [],
                        };
                    }
                }))
            ),
            toArray(),
            map(() => {
                const hasError = resultCache.some(item => !item.success);
                if (hasError) {
                    const firstError = resultCache.find(item => !item.success);
                    return {
                        success: false,
                        message: firstError?.message || 'Lỗi khi xử lý dữ liệu',
                        data: [],
                    };
                }

                return {
                    success: true,
                    data: resultCache.flatMap(item => item.data),
                };
            }),
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Lỗi hệ thống',
                    data: [],
                });
            })
        );
    }



    /* ItemPrintU(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'Vui lòng chọn hoặc nhập dữ liệu cần cập nhật.' });
        }

        const batchSize = 25;
        const batches = this.chunkArray(result, batchSize);
        let resultCache: any[] = [];

        return from(batches).pipe(
            mergeMap((batch) =>
                from(this.dataSource.transaction(async (manager) => {
                    try {
                        for (const record of batch) {
                            const { IdSeq, ...rawUpdateData } = record;
                            const updateData: any = {
                                ...rawUpdateData,
                                QrCode: this.buildQrCode(rawUpdateData),
                                LotNoFull: this.buildLotNoFull(rawUpdateData),
                            };

                            // Logic Qty theo StatusItem
                            if (rawUpdateData.StatusItem === 'U') {
                                updateData.QtyOld = rawUpdateData.Qty;
                                updateData.Qty = rawUpdateData.Qty;
                                updateData.QrCodeOld = this.buildQrCode(rawUpdateData);
                            } else if (rawUpdateData.StatusItem === 'N') {
                                updateData.QtyNew = rawUpdateData.Qty;
                                updateData.Qty = rawUpdateData.Qty;
                                updateData.QrCodeNew = this.buildQrCode(rawUpdateData);
                            }


                            await manager
                                .createQueryBuilder()
                                .update(ItemPrint)
                                .set(updateData)
                                .where('IdSeq = :id', { id: IdSeq })
                                .execute();
                        }

                        resultCache.push({
                            success: true,
                            data: batch,
                        });

                        return {
                            success: true,
                            data: batch,
                        };
                    } catch (err) {
                        resultCache.push({
                            success: false,
                            message: err.message || 'Database error',
                            data: [],
                        });

                        return {
                            success: false,
                            message: err.message || 'Database error',
                            data: [],
                        };
                    }
                }))
            ),
            toArray(),
            map(() => {
                const hasError = resultCache.some(item => item.success === false);
                if (hasError) {
                    const firstError = resultCache.find(item => item.success === false);
                    return {
                        success: false,
                        message: firstError?.message || 'Lỗi trong quá trình cập nhật',
                        data: [],
                    };
                }
                return {
                    success: true,
                    data: resultCache.flatMap(item => item.data),
                };
            }),
            catchError((error) => of({
                success: false,
                message: error.message || 'Lỗi hệ thống',
                data: [],
            }))
        );
    }
 */







    /*   ItemPrintU(result: any[]): Observable<any> {
          if (!result || result.length === 0) {
              throw new RpcException({ code: 5, message: 'Vui lòng chọn hoặc nhập dữ liệu cần cập nhật.' });
          }
  
          const batchSize = 25;
          const batches = this.chunkArray(result, batchSize);
          let updatedBatch = [];
  
          return from(batches).pipe(
              mergeMap(batch =>
                  from(this.dataSource.transaction(async (manager) => {
             
                      const batchWithId = batch.filter(record => record.IdSeq);
                      if (batchWithId.length === 0) {
                          throw new Error('Không có bản ghi nào có IdSeq hợp lệ.');
                      }
  
                      const existingRecords = await manager.getRepository(ItemPrint)
                          .createQueryBuilder('ip')
                          .where('ip.IdSeq IN (:...ids)', { ids: batchWithId.map(i => i.IdSeq) })
                          .getMany();
  
                      const existingIds = existingRecords.map(r => r.IdSeq);
                      const missingIds = batchWithId.filter(i => !existingIds.includes(i.IdSeq));
  
                      if (missingIds.length > 0) {
                          throw new Error(`Các bản ghi không tồn tại: ${missingIds.map(i => i.IdSeq).join(', ')}`);
                      }
  
            
                      const newQrCodes = batchWithId.map(record => this.buildQrCode(record));
  
                  
                      const existingQRCodes = await manager
                          .getRepository(ItemPrint)
                          .createQueryBuilder('ip')
                          .select(['ip.QrCode', 'ip.QrCodeNew', 'ip.QrCodeOld'])
                          .where('ip.QrCode IN (:...codes) OR ip.QrCodeNew IN (:...codes) OR ip.QrCodeOld IN (:...codes)',
                              { codes: newQrCodes })
                          .andWhere('ip.IdSeq NOT IN (:...ids)', { ids: batchWithId.map(i => i.IdSeq) })
                          .getMany();
  
                      if (existingQRCodes.length > 0) {
                
                          const allDuplicatedCodes = [
                              ...existingQRCodes.map(e => e.QrCode),
                              ...existingQRCodes.map(e => e.QrCodeNew),
                              ...existingQRCodes.map(e => e.QrCodeOld)
                          ].filter(code => code && newQrCodes.includes(code));
  
                          const uniqueDuplicatedCodes = [...new Set(allDuplicatedCodes)];
  
                          throw new Error(`Các QRCode đã tồn tại trong bản ghi khác: ${uniqueDuplicatedCodes.join(', ')}`);
                      }
  
                      
                      for (const record of batchWithId) {
                          const { IdSeq, StatusItem, Qty, ...updateData } = record;
                          const newQrCode = this.buildQrCode(record);
                          const lotNoFull = this.buildLotNoFull(record);
                        
                          if (StatusItem === 'U') {
                              updateData.QtyOld = Qty;
                              updateData.Qty = Qty;
                              updateData.QrCodeOld = newQrCode;
                          } else if (StatusItem === 'N') {
                              updateData.QtyNew = Qty;
                              updateData.Qty = Qty;
                              updateData.QrCodeNew = newQrCode;
                          }
  
                          updateData.QrCode = newQrCode;
                          updateData.LotNoFull = lotNoFull;
  
                     
                          await manager.createQueryBuilder()
                              .update(ItemPrint)
                              .set(updateData)
                              .where('IdSeq = :id', { id: IdSeq })
                              .execute();
  
                          const updatedRecord = {
                              ...record,
                              QrCode: newQrCode,
                              QrCodeOld: newQrCode,
                              QrCodeNew: newQrCode,
                              LotNoFull: lotNoFull,
                              Qty: Qty
                          };
  
                          updatedBatch.push(updatedRecord);
                      }
                      return { success: true, data: updatedBatch };
                  }))
              ),
              toArray(),
              map(results => {
                  const successfulResults = results.filter(r => r.success);
                  const failedResults = results.filter(r => !r.success);
  
                  return {
                      success: failedResults.length === 0,
                      data: successfulResults.flatMap(r => r.data),
                      errors: failedResults.map((r: any) => ({ message: r.message, data: r.data })),
                      totalProcessed: results.length,
                      successful: successfulResults.length,
                      failed: failedResults.length
                  };
              }),
              catchError(error => of({
                  success: false,
                  message: error.message || 'Lỗi hệ thống, toàn bộ batch không được lưu.',
                  data: [],
                  errors: [{ message: error.message }]
              }))
          );
      } */


    ItemPrintU(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'Vui lòng chọn hoặc nhập dữ liệu cần cập nhật.' });
        }

        const batchSize = 25;
        const batches = this.chunkArray(result, batchSize);
        let updatedBatch: any[] = [];

        return from(batches).pipe(
            mergeMap(batch =>
                from(this.dataSource.transaction(async (manager) => {

                    const batchWithId = batch.filter(record => record.IdSeq);
                    if (batchWithId.length === 0) {
                        throw new Error('Không có bản ghi nào có IdSeq hợp lệ.');
                    }

                    const existingRecords = await manager.getRepository(ItemPrint)
                        .createQueryBuilder('ip')
                        .where('ip.IdSeq IN (:...ids)', { ids: batchWithId.map(i => i.IdSeq) })
                        .getMany();

                    const existingIds = existingRecords.map(r => r.IdSeq);
                    const missingIds = batchWithId.filter(i => !existingIds.includes(i.IdSeq));
                    const updateIds = batchWithId
                        .filter(i => i.StatusItem === 'U')
                        .map(i => `'${i.IdSeq}'`);

                    if (updateIds.length > 0) {
                        const idsToCheck = updateIds.join(',');

                        const checkSql = `
                    SELECT 1
                    FROM _TLGLotMaster A
                    JOIN ItemPrint B
                        ON A.ItemSeq = B.ItemSeq
                        AND A.LotNo = B.LotNoFull
                    WHERE B.IdSeq IN (${idsToCheck})
                `;

                        const checkResult = await manager.query(checkSql);

                        if (checkResult.length > 0) {
                            throw new Error('Dữ liệu đã được sử dụng để nhập kho, không thể cập nhật.');
                        }
                    }

                    if (missingIds.length > 0) {
                        throw new Error(`Các bản ghi không tồn tại: ${missingIds.map(i => i.IdSeq).join(', ')}`);
                    }


                    const recordsNeedQrCheck = batchWithId.filter(r => {
                        const newQr = this.buildQrCode(r);
                        const oldRecord = existingRecords.find(er => er.IdSeq === r.IdSeq);
                        return !oldRecord || newQr !== oldRecord.QrCode;
                    });

                    const newQrCodes = recordsNeedQrCheck.map(r => this.buildQrCode(r));

                    if (newQrCodes.length > 0) {
                        const existingQRCodes = await manager.getRepository(ItemPrint)
                            .createQueryBuilder('ip')
                            .select(['ip.QrCode', 'ip.QrCodeNew', 'ip.QrCodeOld'])
                            .where('ip.IdSeq NOT IN (:...ids)', { ids: batchWithId.map(i => i.IdSeq) })
                            .andWhere('ip.QrCode IN (:...codes) OR ip.QrCodeNew IN (:...codes) OR ip.QrCodeOld IN (:...codes)', { codes: newQrCodes })
                            .getMany();

                        if (existingQRCodes.length > 0) {
                            const duplicatedQr = [
                                ...existingQRCodes.map(e => e.QrCode),
                                ...existingQRCodes.map(e => e.QrCodeNew),
                                ...existingQRCodes.map(e => e.QrCodeOld)
                            ].filter(code => code && newQrCodes.includes(code));

                            throw new Error(`Các QRCode đã tồn tại trong bản ghi khác: ${[...new Set(duplicatedQr)].join(', ')}`);
                        }
                    }


                    const itemLotPairs = batchWithId.map(r => ({ ItemSeq: r.ItemSeq, IdSeq: r.IdSeq, LotNoFull: this.buildLotNoFull(r) }));

                    if (itemLotPairs.length > 0) {
                        const existingItemLotsQuery = manager.getRepository(ItemPrint).createQueryBuilder('ip');

                        itemLotPairs.forEach((p, index) => {
                            const paramNameItem = `itemSeq${index}`;
                            const paramNameLot = `lotNo${index}`;
                            const paramNameId = `idSeq${index}`;

                            if (index === 0) {
                                existingItemLotsQuery.where(
                                    `ip.ItemSeq = :${paramNameItem} AND ip.LotNoFull = :${paramNameLot} AND ip.IdSeq <> :${paramNameId}`,
                                    { [paramNameItem]: p.ItemSeq, [paramNameLot]: p.LotNoFull, [paramNameId]: p.IdSeq }
                                );
                            } else {
                                existingItemLotsQuery.orWhere(
                                    `ip.ItemSeq = :${paramNameItem} AND ip.LotNoFull = :${paramNameLot} AND ip.IdSeq <> :${paramNameId}`,
                                    { [paramNameItem]: p.ItemSeq, [paramNameLot]: p.LotNoFull, [paramNameId]: p.IdSeq }
                                );
                            }
                        });


                        const existingItemLots = await existingItemLotsQuery.getMany();

                        if (existingItemLots.length > 0) {
                            const duplicatedItems = existingItemLots.map(e => `${e.LotNoFull}`).join(', ');
                            throw new Error(`LotNoFull đã tồn tại: ${duplicatedItems}`);
                        }
                    }

                    // 🔹 Tiến hành cập nhật
                    for (const record of batchWithId) {
                        const { IdSeq, StatusItem, Qty, ...updateData } = record;
                        const newQrCode = this.buildQrCode(record);
                        const newQrCodeOld = this.buildQrCodeNew(record);
                        const lotNoFull = this.buildLotNoFull(record);

                        const existingRecord = existingRecords.find(er => er.IdSeq === IdSeq);

                        if (StatusItem === 'U') {
                            updateData.QtyOld = Qty;
                            updateData.Qty = Qty;

                            if (existingRecord && newQrCode === existingRecord.QrCode) {
                                updateData.QrCode = existingRecord.QrCode;
                                updateData.QrCodeOld = existingRecord.QrCodeOld;
                                updateData.QrCodeNew = existingRecord.QrCodeNew;
                            } else {
                                updateData.QrCodeOld = newQrCode;
                                updateData.QrCode = newQrCode;
                            }
                        } else if (StatusItem === 'N') {


                            // Lấy số lượng tham chiếu: nếu QtyNew có giá trị dùng nó, không thì dùng QtyOld
                            const referenceQty = (existingRecord.QtyNew !== null && existingRecord.QtyNew !== undefined)
                                ? existingRecord.QtyNew
                                : existingRecord.QtyOld || 0;

                            // Kiểm tra số lượng mới
                            if (Qty < 0) {
                                throw new Error(`Số lượng mới (${Qty}) phải lớn hơn 0 cho QR ${existingRecord.QrCode}`);
                            }

                            if (Qty === referenceQty) {
                                throw new Error(`Số lượng mới (${Qty}) không được bằng số lượng hiện tại (${referenceQty}) cho QR ${existingRecord.QrCode}`);
                            }

                            if (Qty > referenceQty) {
                                throw new Error(`Số lượng mới (${Qty}) phải nhỏ hơn số lượng hiện tại (${referenceQty}) cho QR ${existingRecord.QrCode}`);
                            }


                            updateData.QtyNew = Qty;
                            updateData.Qty = Qty;
                            updateData.QrCodeNew = newQrCode;
                            updateData.QrCode = newQrCode;
                            updateData.QrCodeOld = existingRecord.QrCodeNew || existingRecord.QrCodeOld;



                            await manager.getRepository(ItemPrintHistory).insert({
                                IdSeq: uuidv7(),
                                ItemPrintSeq: IdSeq,
                                OldQty: existingRecord.QtyNew || existingRecord.QtyOld,
                                QrcodeOld: existingRecord.QrCodeNew || existingRecord.QrCodeOld,
                                NewQty: Qty,
                                UpdatedBy: updateData.UpdatedBy || 0,
                                CreatedBy: updateData.CreatedBy || 0,
                            });
                        }

                        updateData.LotNoFull = lotNoFull;

                        await manager.createQueryBuilder()
                            .update(ItemPrint)
                            .set(updateData)
                            .where('IdSeq = :id', { id: IdSeq })
                            .execute();

                        updatedBatch.push({
                            ...record,
                            QrCode: updateData.QrCode,
                            QrCodeOld: updateData.QrCodeOld,
                            QrCodeNew: updateData.QrCodeNew,
                            LotNoFull: lotNoFull,
                            Qty: Qty
                        });
                    }

                    return { success: true, data: updatedBatch };
                }))
            ),
            toArray(),
            map(results => {
                const successfulResults = results.filter(r => r.success);
                const failedResults = results.filter(r => !r.success);

                return {
                    success: failedResults.length === 0,
                    data: successfulResults.flatMap(r => r.data),
                    errors: failedResults.map((r: any) => ({ message: r.message, data: r.data })),
                    totalProcessed: results.length,
                    successful: successfulResults.length,
                    failed: failedResults.length
                };
            }),
            catchError(error => of({
                success: false,
                message: error.message || 'Lỗi hệ thống, toàn bộ batch không được lưu.',
                data: [],
                errors: [{ message: error.message }]
            }))
        );
    }

    ItemPrintD(records: any[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({
                success: false,
                message: 'No records provided for deletion',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const ids = records.map(r => r.IdSeq);

                if (ids.length === 0) {
                    return {
                        success: false,
                        message: 'No valid IdSeq to delete',
                        data: [],
                    };
                }

                const idsString = ids.map(id => `'${id}'`).join(',');
                const checkSql = `
                    SELECT 1
                    FROM _TLGLotMaster A
                    JOIN ItemPrint B
                    ON A.ItemSeq = B.ItemSeq
                    AND A.LotNo = B.LotNoFull
                    WHERE B.IdSeq IN (${idsString})
                `;
                const checkResult = await manager.query(checkSql);

                if (checkResult.length > 0) {
                    return {
                        success: false,
                        message: 'Dữ liệu đã được sử dụng để nhập kho, không thể xóa',
                        data: [],
                    };
                }

                const result = await manager.delete(ItemPrint, { IdSeq: In(ids) });

                if ((result.affected ?? 0) > 0) {
                    return {
                        success: true,
                        message: `${result.affected} record(s) deleted successfully`,
                        data: [],
                    };
                } else {
                    return {
                        success: false,
                        message: 'No records found to delete',
                        data: [],
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Lỗi trong quá trình xóa dữ liệu',
                    data: [],
                };
            }
        })).pipe(
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.',
                    data: [],
                });
            })
        );
    }


    ItemPrintQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const keyItem8 = result.KeyItem8;

                const queryBuilder = manager.createQueryBuilder(ItemPrint, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.IdxNo as "IdxNo"',
                        'q.CreatedBy as "CreatedBy"',
                        'q.CreatedAt as "CreatedAt"',
                        'q.UpdatedBy as "UpdatedBy"',
                        'q.UpdatedAt as "UpdatedAt"',

                        'q.ItemSeq as "ItemSeq"',
                        'q.QrCode as "QrCode"',
                        'q.QrCodeNew as "QrCodeNew"',
                        'q.QrCodeOld as "QrCodeOld"',

                        'q.CustSeq as "CustSeq"',
                        'q.Color as "Color"',
                        'q.QtyOld as "QtyOld"',

                        `(CASE 
                        WHEN q."QtyNew" IS NULL OR q."QtyNew" = 0 THEN q."Qty"
                            ELSE q."QtyNew"
                     END) as "QtyNew"`,

                        `(CASE 
                            WHEN :keyItem8 = 'N' THEN  0
                            WHEN :keyItem8 = 'U' THEN q."QtyOld"
                            ELSE q."Qty"
                         END) as "Qty"`,

                        'q.LotNo as "LotNo"',
                        'q.BagType as "BagType"',
                        'q.BagTypeName as "BagTypeName"',

                        'q.StockInDate as "StockInDate"',
                        'q.ProduDate as "ProduDate"',
                        'q.ProductType as "ProductType"',

                        'q.ReelNo as "ReelNo"',
                        'q.UserSeq as "UserSeq"',
                        'q.Location as "Location"',

                        'q.Remark as "Remark"',
                        'q.Pallet as "Pallet"',
                        'q.LotNoFull as "LotNoFull"',

                        'q.Memo01 as "Memo01"',
                        'q.Memo02 as "Memo02"',
                        'q.Memo03 as "Memo03"',
                        'q.Memo04 as "Memo04"',
                        'q.Memo05 as "Memo05"',

                        's1."ItemName" as "ItemName"',
                        's1."ItemNo" as "ItemNo"',
                        's1."Spec" as "Spec"',
                        's2."CustName" as "CustName"',
                        's2."CustNo" as "CustNo"',
                        's3."EmpName" as "CreateName"',
                        's4."UnitName" as "UnitName"',
                    ])
                    .setParameter('keyItem8', keyItem8)
                    .leftJoin("_TDAItem", 's1', 'q."ItemSeq" = s1."ItemSeq"')
                    .leftJoin("_TDACust", 's2', 'q."CustSeq" = s2."CustSeq"')
                    .leftJoin("_TDAEmp", 's3', 'q."CreatedBy" = s3."EmpSeq"')
                    .leftJoin("_TDAUnit", 's4', 's1."UnitSeq" = s4."UnitSeq"')

                    ;

                // 🔹 Các filter cũ
                const startDate = result.KeyItem1;
                const endDate = result.KeyItem2;
                if (keyItem8 === 'U') {
                    queryBuilder.andWhere('q."QrCodeNew" IS NULL');
                    queryBuilder.andWhere('q."QtyNew" IS NULL');
                }

                if (startDate && endDate) {
                    queryBuilder.andWhere(
                        'q.ProduDate >= :startDate AND q.ProduDate <= :endDate',
                        { startDate, endDate }
                    );
                } else if (startDate) {
                    queryBuilder.andWhere('q.ProduDate >= :startDate', { startDate });
                } else if (endDate) {
                    queryBuilder.andWhere('q.ProduDate <= :endDate', { endDate });
                }
                if (result.KeyItem3) {
                    queryBuilder.andWhere(
                        's1.ItemName LIKE :KeyItem3 COLLATE SQL_Latin1_General_CP1_CI_AS',
                        { KeyItem3: `%${result.KeyItem3}%` }
                    );
                }
                if (result.KeyItem4) {
                    queryBuilder.andWhere(
                        's1.ItemNo LIKE :KeyItem4 COLLATE SQL_Latin1_General_CP1_CI_AS',
                        { KeyItem4: `%${result.KeyItem4}%` }
                    );
                }
                if (result.KeyItem5) {
                    queryBuilder.andWhere('q.CustSeq = :KeyItem5', { KeyItem5: result.KeyItem5 });
                }
                if (result.KeyItem6) {
                    queryBuilder.andWhere(
                        'q.LotNo LIKE :KeyItem6 COLLATE SQL_Latin1_General_CP1_CI_AS',
                        { KeyItem6: `%${result.KeyItem6}%` }
                    );
                }
                if (result.KeyItem7) {
                    queryBuilder.andWhere('q.BagType = :KeyItem7', { KeyItem7: result.KeyItem7 });
                }

                if (result.KeyItem9) {
                    queryBuilder.andWhere(
                        'q.QrCodeOld = :KeyItem9 COLLATE SQL_Latin1_General_CP1_CI_AS',
                        { KeyItem9: result.KeyItem9 }
                    );
                }
                if (result.KeyItem10) {
                    queryBuilder.andWhere(
                        'q.QrCodeNew = :KeyItem10 COLLATE SQL_Latin1_General_CP1_CI_AS',
                        { KeyItem10: result.KeyItem10 }
                    );
                }

                queryBuilder
                    .orderBy('q.LotNo', 'ASC')
                    .addOrderBy(
                        `CASE 
                            WHEN ISNUMERIC(q."ReelNo") = 1 
                                THEN CAST(q."ReelNo" AS INT)
                            ELSE 999999
                        END`,
                        'ASC'
                    );


                const queryResult = await queryBuilder.getRawMany();

                return {
                    success: true,
                    data: queryResult,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.',
                    data: [],
                };
            }
        })).pipe(
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.',
                    data: [],
                });
            })
        );
    }



    ItemPrintCheckQRQ(result: any): Observable<any> {
        if (!result?.KeyItem1) {
            return of({ success: false, message: 'No QR code provided', data: [] });
        }

        const qrCode = result.KeyItem1;

        return from((async () => {
            try {
                const itemPrint = await this.dataSource.manager.createQueryBuilder(ItemPrint, 'q')
                    .select([
                        'q.LotNoFull',
                        's1.ItemNo',
                        'q.IdSeq',
                        'q.QrCode',
                        'q.ItemSeq',
                        'q.QrCodeNew',
                        'q.QrCodeOld',
                        'q.Qty',


                    ])
                    .leftJoin("_TDAItem", 's1', 'q."ItemSeq" = s1."ItemSeq"')
                    .where(
                        '(q."QrCodeOld" = :qrCode COLLATE SQL_Latin1_General_CP1_CI_AS OR q."QrCodeNew" = :qrCode COLLATE SQL_Latin1_General_CP1_CI_AS)',
                        { qrCode }
                    )
                    .getOne();

                if (!itemPrint) {
                    return { success: false, message: 'Không tìm thấy thông tin lô hàng hóa!', data: [] };
                }

                const { LotNoFull, ItemSeq, Qty } = itemPrint;

                const lotMasterData = await this.dataSource.manager.createQueryBuilder()
                    .select([
                        'l."CompanySeq"',
                        'l."LotNo"',
                        'l."ItemSeq"',
                        'l."SourceLotNo"',
                        'l."UnitSeq"',
                        'l."Qty"',
                        'l."CreateDate"',
                        'l."CreateTime"',
                        'l."ValiDate"',
                        'l."ValidTime"',
                        'l."RegDate"',
                        'l."RegUserSeq"',
                        'l."CustSeq"',
                        'l."Remark"',
                        'l."OriLotNo"',
                        'l."OriItemSeq"',
                        'l."LastUserSeq"',
                        'l."LastDateTime"',
                        'l."InNo"',
                        'l."SupplyCustSeq"',
                        'l."PgmSeqModifying"',
                        'l."StdPrice"',
                        'l."Dummy1"',
                        'l."Dummy2"',
                        'l."Dummy3"',
                        'l."Dummy4"',
                        'l."Dummy5"',
                        'l."Dummy6"',
                        'l."Dummy7"',
                        'l."PgmSeq"',
                        'l."Dummy8"',
                        'l."Dummy9"',
                        'l."Dummy10"',

                        // --- Cột bổ sung từ _TDAItem ---
                        's1."ItemName" as "ItemName"',
                        's1."ItemNo" as "ItemNo"',
                        's1."Spec" as "Spec"',
                        's2."CustName" as "CustName"',
                        's2."CustNo" as "CustNo"',
                        's3."EmpName" as "RegUserName"',
                        's4."UnitName" as "UnitName"',
                    ])
                    .from('_TLGLotMaster', 'l')
                    .leftJoin('_TDAItem', 's1', 'l."ItemSeq" = s1."ItemSeq"')
                    .leftJoin("_TDACust", 's2', 'l."SupplyCustSeq" = s2."CustSeq"')
                    .leftJoin("_TDAEmp", 's3', 'l."RegUserSeq" = s3."EmpSeq"')
                    .leftJoin("_TDAUnit", 's4', 's1."UnitSeq" = s4."UnitSeq"')
                    .where('l."LotNo" = :lotNo AND l."ItemSeq" = :itemSeq', { lotNo: LotNoFull, itemSeq: ItemSeq })
                    .getRawMany();


                if (!lotMasterData) {
                    return { success: false, message: 'Không tìm thấy LotMaster tương ứng', data: [] };
                }

                if (!lotMasterData || lotMasterData.length === 0) {
                    return { success: false, message: 'Không tìm thấy LotMaster tương ứng', data: null };
                }
                return {
                    success: true,
                    data: lotMasterData.map(item => ({
                        ...item,
                        ItemPrintQty: itemPrint.Qty || 0,
                    }))
                };


            } catch (error) {
                return { success: false, message: error.message || 'Error processing request', data: [] };
            }
        })()).pipe(
            catchError(err => of({ success: false, message: err.message || 'Error', data: [] }))
        );
    }

    ItemPrintCheckQRU(result: any): Observable<any> {
        if (!result?.LotNo || !result?.ItemSeq) {
            return of({ success: false, message: 'Thiếu thông tin khóa!', data: [] });
        }

        const { LotNo, ItemSeq, Dummy1, Dummy2, UpdatedBy } = result;

        return from(
            (async () => {
                try {
                    const exist = await this.dataSource.manager.createQueryBuilder()
                        .select('1')
                        .from('_TLGLotMaster', 'l')
                        .where('l."LotNo" = :lotNo AND l."ItemSeq" = :itemSeq', { lotNo: LotNo, itemSeq: ItemSeq })
                        .getRawOne();

                    if (!exist) {
                        return { success: false, message: 'Không tìm thấy LotMaster để cập nhật', data: [] };
                    }


                    await this.dataSource.manager.createQueryBuilder()
                        .update('_TLGLotMaster')
                        .set({
                            Dummy1: Dummy1 ?? null,
                            Dummy2: Dummy2 ?? null,
                            LastDateTime: () => 'GETDATE()',
                            LastUserSeq: UpdatedBy ?? null
                        })
                        .where('"LotNo" = :lotNo AND "ItemSeq" = :itemSeq', { lotNo: LotNo, itemSeq: ItemSeq })
                        .execute();

                    return { success: true, message: 'Cập nhật thành công', data: { LotNo, ItemSeq, Dummy1, Dummy2 } };
                } catch (error) {
                    return { success: false, message: error.message || 'Lỗi khi cập nhật dữ liệu', data: [] };
                }
            })()
        ).pipe(
            catchError(err => of({ success: false, message: err.message || 'Error', data: [] }))
        );
    }

}
