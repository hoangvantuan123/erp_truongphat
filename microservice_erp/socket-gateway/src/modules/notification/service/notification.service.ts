import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Notification } from '../entities/notification.entity';
import { NotificationReadStatus } from '../entities/notificationReadStatus.entity';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class NotificationDataService {
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

    NotificationA(result: any[]): Observable<any> {
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

                        }));

                        const insertResult = await manager
                            .createQueryBuilder()
                            .insert()
                            .into(Notification)
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
    NotificationU(result: any[]): Observable<any> {

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
                                .update(Notification)
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

    NotificationD(records: any[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({ success: false, message: 'No records provided for deletion', data: [] });
        }

        const ids = records.map(r => r.IdSeq);

        return from(this.dataSource.transaction(async (manager) => {
            try {

                const deleteResult = await manager
                    .createQueryBuilder()
                    .delete()
                    .from(Notification)
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
    NotificationQ(result: any): Observable<any> {
        if (!result || !result.UserId) {
            return of({
                success: false,
                message: 'UserId is required',
                data: [],
            });
        }

        const page = result.Page && result.Page > 0 ? result.Page : 1;
        const pageSize = result.PageSize && result.PageSize > 0 ? result.PageSize : 20;

        const startRow = (page - 1) * pageSize + 1;
        const endRow = page * pageSize;

        return from(
            this.dataSource.transaction(async (manager) => {
                try {
              
                    const dataSql = `
               SELECT *
FROM (
    SELECT
        ROW_NUMBER() OVER (ORDER BY q.CreatedAt DESC) AS RowNum,
        q.IdSeq,
        q.IdxNo,
        q.CreatedBy,
        q.CreatedAt,
        q.UpdatedBy,
        q.UpdatedAt,
        q.NotificationType,
        q.Title,
        q.Title2,
        q.Title3,
        q.Content,
        q.Status,
        q.JobScanIdSeq,
        ISNULL(r.IsRead, 0) AS IsRead,
        r.IdSeq AS ReadStatusIdSeq
    FROM Notification q
    LEFT JOIN NotificationReadStatus r
        ON r.NotificationIdSeq = q.IdSeq
       AND r.UserId = @0
   WHERE q.UserSeq = @0


) T
WHERE T.RowNum BETWEEN @1 AND @2
ORDER BY T.CreatedAt DESC;



                `;


                    const dataParams = result.KeyItem1
                        ? [
                            result.UserId,
                            result.KeyItem1,
                            startRow,
                            endRow,
                        ]
                        : [
                            result.UserId,
                            startRow,
                            endRow,
                        ];

                    const data = await manager.query(dataSql, dataParams);

                    // ============================
                    // 2️⃣ COUNT QUERY
                    // ============================
                    const countSql = `
                       SELECT
    COUNT(1) AS TotalCount,
    SUM(CASE WHEN ISNULL(r.IsRead, 0) = 0 THEN 1 ELSE 0 END) AS UnreadCount
FROM Notification q
LEFT JOIN NotificationReadStatus r
    ON r.NotificationIdSeq = q.IdSeq
   AND r.UserId = @0
WHERE q.UserSeq = @0;


                    `;

                    const countParams = result.KeyItem1
                        ? [result.UserId, result.KeyItem1]
                        : [result.UserId];

                    const [count] = await manager.query(countSql, countParams);

                    const totalCount = count.TotalCount || 0;
                    const unreadCount = count.UnreadCount || 0;
                    const readCount = totalCount - unreadCount;

                    return {
                        success: true,
                        data: [
                            {
                                page,
                                pageSize,
                                totalCount,
                                unreadCount,
                                readCount,
                                data,
                            },
                        ],
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error.message || 'Internal server error',
                        data: [],
                    };
                }
            })
        ).pipe(
            catchError((error) =>
                of({
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
                })
            )
        );
    }




}
