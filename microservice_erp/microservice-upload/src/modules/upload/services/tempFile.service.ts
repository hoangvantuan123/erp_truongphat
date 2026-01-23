import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ERPTempFile } from '../entities/tempFile.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ERPTempFileService {
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

    TempFileA(result: any[]): Observable<any> {
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
                            .into(ERPTempFile)
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

    TempFileD(records: any[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({ success: false, message: 'No records provided for deletion', data: [] });
        }

        const ids = records.map(r => r.IdSeq);

        return from(this.dataSource.transaction(async (manager) => {
            try {

                const deleteResult = await manager
                    .createQueryBuilder()
                    .delete()
                    .from(ERPTempFile)
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
    TempFileQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ERPTempFile, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.IsActive as "IsActive"',
                        'q.FieldName as "FieldName"',
                        'q.Size as "Size"',
                        'q.Encoding as "Encoding"',
                        'q.OriginalName as "OriginalName"',
                        'q.Filename as "Filename"',
                        'q.Path as "Path"',
                        'q.PathRoot as "PathRoot"',
                        'q.SupplyContSeq as "SupplyContSeq"',
                    ])

                    ;
                if (result.KeyItem1) {
                    queryBuilder.andWhere('q.SupplyContSeq =  :KeyItem1', { KeyItem1: result.KeyItem1 });
                }
                if (result.KeyItem2) {
                    queryBuilder.andWhere('q.GroupsTempCode =  :KeyItem2', { KeyItem2: result.KeyItem2 });
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
    TempFileU(result: any[]): Observable<any> {
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
                                .update(ERPTempFile)
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

    TempFileP(
        files: any[],
        result: { IdSeq: number; Time: string; CreatedBy: string, GroupsTempCode: string }
    ): Observable<any> {
        const STORAGE_ROOT = process.env.STORAGE_ROOT;
        if (!STORAGE_ROOT) {
            return of({
                success: false,
                message: 'STORAGE_ROOT environment variable is not defined',
            });
        }

        const { IdSeq, Time, CreatedBy, GroupsTempCode } = result;

        if (!IdSeq || !Time) {
            return of({
                success: false,
                message: 'Both IdSeq and Time are required in result object',
            });
        }

        const targetDir = path.join(STORAGE_ROOT, 'system', 'temp', String(IdSeq), String(Time));

        try {
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const savedFiles = files.map(file => {
                const { filename, content } = file;
                const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                const generatedFilename = `${Date.now()}-${safeFilename}`;
                const fullPath = path.join(targetDir, generatedFilename);

                fs.writeFileSync(fullPath, content);

                file.savedPath = fullPath;
                file.generatedFilename = generatedFilename;

                return file;
            });

            const records: Partial<any>[] = savedFiles.map(file => ({
                SupplyContSeq: IdSeq,
                GroupsTempCode: "HĐ",
                FieldName: file.fieldname,
                Size: file.size,
                Encoding: file.encoding,
                Mimetype: file.mimetype,
                OriginalName: file.filename,
                Filename: file.generatedFilename,
                CreatedBy,
                UpdatedBy: CreatedBy,
                Path: file.savedPath.replace(/\\/g, '/'),
                PathRoot: file.savedPath,
            }));

            return this.TempFileA(records).pipe(
                map(res => ({
                    success: res.success,
                    data: res.data,
                    path: targetDir,
                    message: res.message || null,
                })),
                catchError(error => of({
                    success: false,
                    message: error.message || '❌ Lỗi hệ thống khi lưu DB',
                    path: targetDir,
                    data: [],
                }))
            );
        } catch (error) {
            return of({
                success: false,
                message: '❌ Failed to save files',
                error: error.message,
            });
        }
    }
}
