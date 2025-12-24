import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { PayCondition } from '../entities/payCondition.entity';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class PayConditionService {
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
    private emptyToNull(value: any): any {
        return typeof value === 'string' && value.trim() === '' ? null : value;
    }

    PayConditionA(result: any[]): Observable<any> {
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
                            PayCondStatusSeq: this.emptyToNull(item.PayCondStatusSeq),
                        }));

                        const insertResult = await manager
                            .createQueryBuilder()
                            .insert()
                            .into(PayCondition)
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
    PayConditionU(result: any[]): Observable<any> {
        console.log('result', result)
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'No records provided for update' });
        }

        const batchSize = 1000;
        const batches = this.chunkArray(result, batchSize);

        let resultCache: any[] = [];

        return from(batches).pipe(
            mergeMap((batch) =>
                from(this.dataSource.transaction(async (manager) => {
                    try {
                        for (const record of batch) {
                            const { IdSeq, ...rawUpdateData } = record;
                            const updateData = {
                                ...rawUpdateData,
                                PayCondStatusSeq: this.emptyToNull(rawUpdateData.PayCondStatusSeq),
                            };

                            await manager
                                .createQueryBuilder()
                                .update(PayCondition)
                                .set(updateData)
                                .where('IdSeq = :id', { id: IdSeq })
                                .execute();
                        }

                        const updatedBatch = batch;

                        resultCache.push({
                            success: true,
                            data: updatedBatch,
                        });

                        return {
                            success: true,
                            data: updatedBatch,
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
                        message: firstError?.message || 'Error occurred during processing',
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
                message: error.message || 'Internal server error',
                data: [],
            }))
        );
    }

    PayConditionD(records: any[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({ success: false, message: 'No records provided for deletion', data: [] });
        }

        const ids = records.map(r => r.IdSeq);

        return from(this.dataSource.transaction(async (manager) => {
            try {

                const deleteResult = await manager
                    .createQueryBuilder()
                    .delete()
                    .from(PayCondition)
                    .where('IdSeq IN (:...ids)', { ids })
                    .returning('deleted.IdSeq')
                    .execute();

                if (deleteResult.affected && deleteResult.affected > 0) {
                    return {
                        success: true,
                        message: `${deleteResult.affected} record(s) deleted successfully`,
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
                    message: error.message || 'Internal server error',
                    data: [],
                    error: error.message,
                };
            }
        })).pipe(
            catchError(error => of({
                success: false,
                message: error.message || 'Internal server error',
                data: [],
            }))
        );
    }
    PayConditionQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(PayCondition, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.SupplyContSeq as "SupplyContSeq"',
                        'q.PayRate as "PayRate"',
                        'q.UMPayCondSeq as "UMPayCondSeq"',
                        'q.PayAmt as "PayAmt"',
                        'q.DomPayAmt as "DomPayAmt"',
                        'q.PayVATAmt as "PayVATAmt"',
                        'q.DomPayVATAmt as "DomPayVATAmt"',
                        'q.SumPayAmt as "SumPayAmt"',
                        'q.DomSumPayAmt as "DomSumPayAmt"',
                        'q.PayPlanDate as "PayPlanDate"',
                        'q.PayRepeatDate as "PayRepeatDate"',
                        'q.VATAmt as "VATAmt"',
                        'q.PayCondRemark as "PayCondRemark"',
                        'q.PayCondStatusSeq as "PayCondStatusSeq"',
                        's1.MinorName as "UMPayCondName"',
                        's2.MinorName as "PayCondStatus"',
                    ])
                    .leftJoin('_TDAUMinor', 's1', 'q."UMPayCondSeq" = s1."MinorSeq"')
                    .leftJoin('_TDAUMinor', 's2', 'q."PayCondStatusSeq" = s2."MinorSeq"')


                if (result.KeyItem1) {
                    queryBuilder.andWhere('q.SupplyContSeq = :KeyItem1', { KeyItem1: result.KeyItem1 });
                }

                queryBuilder.orderBy('q.IdSeq', 'ASC');
                const queryResult = await queryBuilder.getRawMany();

                return {
                    success: true,
                    data: queryResult,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
                };
            }
        })).pipe(
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
                });
            })
        );
    }

}
