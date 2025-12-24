import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { NotificationReadStatus } from '../entities/notificationReadStatus.entity';

import { uuidv7 } from 'uuidv7';
@Injectable()
export class NotificationReadStatusDataService {
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

    NotificationReadStatusA(result: any[]): Observable<any> {
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
                            IdSeq: uuidv7()

                        }));

                        const insertResult = await manager
                            .createQueryBuilder()
                            .insert()
                            .into(NotificationReadStatus)
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




}
