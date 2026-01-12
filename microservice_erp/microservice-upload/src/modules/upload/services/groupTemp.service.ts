import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ERPGroupsTemp } from '../entities/groupTemp.entity';
@Injectable()
export class ErpGroupsTempService {
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

    GroupsTempA(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'No records provided for insertion' });
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
                            .into(ERPGroupsTemp)
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
    GroupsTempU(result: any[]): Observable<any> {
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
                            const { IdSeq, ...updateData } = record;

                            await manager
                                .createQueryBuilder()
                                .update(ERPGroupsTemp)
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

    GroupsTempD(records: any[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({ success: false, message: 'No records provided for deletion', data: [] });
        }

        const ids = records.map(r => r.IdSeq);

        return from(this.dataSource.transaction(async (manager) => {
            try {

                const constraints = [
                    { tableName: '_ERPTempFile', columnName: 'GroupsTempSeq' },
                ];

                for (const { tableName, columnName } of constraints) {
                    const placeholders = ids.map((_, idx) => `@${idx}`).join(', ');
                    const sql = `
                            SELECT TOP 1 1 AS existsCheck 
                            FROM ${tableName} 
                            WHERE ${columnName} IN (${placeholders})
                        `;

                    const result = await manager.query(sql, ids);
                    if (result.length > 0) {
                        return {
                            success: false,
                            message: `Dữ liệu đã được sử dụng, không thể xóa.`,
                            data: [],
                        };
                    }
                }


                const deleteResult = await manager
                    .createQueryBuilder()
                    .delete()
                    .from(ERPGroupsTemp)
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
    GroupsTempQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ERPGroupsTemp, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.CreatedBy as "CreatedBy"',
                        'q.CreatedAt as "CreatedAt"',
                        'q.UpdatedBy as "UpdatedBy"',
                        'q.UpdatedAt as "UpdatedAt"',
                        'q.GroupsName as "GroupsName"',
                        'q.Description as "Description"',
                        'q.IsActive as "IsActive"',
                        'q.Code as "Code"',
                    ])

                    ;

                queryBuilder.orderBy('q.IdSeq', 'DESC');
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
