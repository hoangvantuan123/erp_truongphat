import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ItemPrintHistory } from '../entities/itemPrintHistory.entity';

@Injectable()
export class ItemPrintHistoryService {
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

    ItemPrintHistoryA(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'Không có bản ghi nào được cung cấp.' });
        }

        const batchSize = 1000;
        const batches = this.chunkArray(result, batchSize);
        let resultCache: any[] = [];

        return from(batches).pipe(
            mergeMap((batch) =>
                from(this.dataSource.transaction(async (manager) => {
                    try {
                        const batchWithId = batch.map(item => ({
                            ...item,
                            IdSeq: uuidv7(),
                        }));

                        const insertResult = await manager
                            .createQueryBuilder()
                            .insert()
                            .into(ItemPrintHistory)
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
                            friendlyMessage = 'Dữ liệu này đã tồn tại, vui lòng nhập giá trị khác. ';
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


    ItemPrintHistoryU(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'Vui lòng chọn hoặc nhập dữ liệu cần cập nhật.' });
        }

        const batchSize = 1000;
        const batches = this.chunkArray(result, batchSize);
        let resultCache: any[] = [];

        return from(batches).pipe(
            mergeMap((batch) =>
                from(this.dataSource.transaction(async (manager) => {
                    try {
                        for (const record of batch) {
                            const { IdSeq, ...updateData } = record;

                            await manager
                                .createQueryBuilder()
                                .update(ItemPrintHistory)
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


    ItemPrintHistoryD(records: any[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({
                success: false,
                message: 'No records provided for deletion',
                data: [],
            });
        }

        const ids = records.map(record => record.IdSeq);

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const constraints = [
                ];

                for (const { tableName, columnName } of constraints) {
                    const sql = `
                          SELECT EXISTS (
                            SELECT 1 FROM "${tableName}" WHERE "${columnName}" = ANY($1)
                          ) AS "exists"
                        `;
                    const result = await manager.query(sql, [ids]);
                    if (result[0].exists) {
                        return {
                            success: false,
                            message: `Dữ liệu đã được sử dụng không thể xóa`,
                            data: [],
                        };
                    }
                }


                const result = await manager.delete(ItemPrintHistory, { IdSeq: In(ids) });

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

    ItemPrintHistoryQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ItemPrintHistory, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                      
                    ])
                    
                    ;


              
                queryBuilder.orderBy('q.IdSeq', 'ASC');
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

}
