import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ERPPrintFile } from '../entities/filePrint.entity';
@Injectable()
export class ERPPrintFileService {
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

    FilePrintA(result: any[]): Observable<any> {
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
                            .into(ERPPrintFile)
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
    FilePrintU(result: any[]): Observable<any> {
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
                                .update(ERPPrintFile)
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

    FilePrintD(records: { IdSeq: string, FileSeq?: string, PathFile?: string }[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({ success: false, message: 'No records provided for deletion', data: [] });
        }

        // Lấy tất cả FileSeq từ records
        const fileSeqs = Array.from(new Set(records.map(r => r.FileSeq).filter(Boolean)));
        if (fileSeqs.length === 0) {
            return of({ success: false, message: 'No valid FileSeq to delete', data: [] });
        }

        // Tạo chuỗi FileSeq cho SQL Server
        const fileSeqsString = fileSeqs.map(f => `'${f}'`).join(',');

        return from(this.dataSource.transaction(async (manager) => {
            try {
                // Lấy tất cả PathFile của các FileSeq trước khi xóa
                const filesToDelete: { PathFile: string }[] = await manager.query(
                    `SELECT DISTINCT PathFile FROM _ERPPrintFile WHERE FileSeq IN (${fileSeqsString})`
                );

                // Xóa tất cả bản ghi có FileSeq trong DB
                await manager.query(
                    `DELETE FROM _ERPPrintFile WHERE FileSeq IN (${fileSeqsString})`
                );

                // Xóa file vật lý (mỗi path chỉ xóa 1 lần)
                const uniquePaths = Array.from(new Set(filesToDelete.map(f => f.PathFile).filter(Boolean)));

                const fs = require('fs');
                for (const pathFile of uniquePaths) {
                    if (fs.existsSync(pathFile)) {
                        try {
                            fs.unlinkSync(pathFile);
                        } catch (err) {
                            console.warn(`Không thể xóa file: ${pathFile}`, err);
                        }
                    }
                }

                return {
                    success: uniquePaths.length > 0,
                    message: uniquePaths.length > 0
                        ? `${uniquePaths.length} file(s) deleted successfully`
                        : 'No files found to delete',
                    data: [],
                };
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
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


    FilePrintQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ERPPrintFile, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.PrintSeq as "PrintSeq"',
                        'q.TypeFile as "TypeFile"',
                        'q.Module as "Module"',
                        'q.PathFile as "PathFile"',
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
