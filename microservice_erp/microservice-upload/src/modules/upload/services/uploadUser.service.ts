// src/modules/upload/services/upload.service.ts
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { ERPUploadsUserFile } from '../entities/uploadUserFile.entity';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class UploadUserService {

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
    UploadsUserFileA(result: any[]): Observable<any> {
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
                        const insertResult = await manager
                            .createQueryBuilder()
                            .insert()
                            .into(ERPUploadsUserFile)
                            .values(batch)
                            .execute();

                        const inserted = insertResult.identifiers.map((idObj, i) => ({
                            ...batch[i],
                            IdSeq: idObj.IdSeq,
                            Path: idObj.Path
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
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
                });
            })
        );
    }
    handleUploadResult(file: Express.Multer.File): Observable<any> {
        return of({
            success: true,
            message: 'File uploaded successfully',
            filePath: file.path.replace(/\\/g, '/'),
        });
    }
    saveUserFile(fileData: Partial<ERPUploadsUserFile>, userId?: number): Observable<any> {
        return from(
            this.dataSource.transaction(async (manager) => {
                try {
                    if (userId) {
                        await manager.createQueryBuilder()
                            .delete()
                            .from(ERPUploadsUserFile)
                            .where("UserID = :userId AND IsAvatar = 1 AND Type = 'AVATAR'", { userId: userId })
                            .execute();
                    }

                    const insertResult = await manager.createQueryBuilder()
                        .insert()
                        .into(ERPUploadsUserFile)
                        .values(fileData)
                        .execute();


                    return {
                        success: true,
                        data: [{
                            IdSeq: insertResult.identifiers[0].IdSeq,
                            Path: fileData.Path,
                            Filename: fileData.Filename,
                            Originalname: fileData.Originalname,
                            Size: fileData.Size,
                        }]
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error.message,
                    };
                }
            })
        ).pipe(
            catchError(err => of({
                success: false,
                message: err.message || 'Database error',
            }))
        );
    }

    saveImgFile(fileData: Partial<ERPUploadsUserFile>, userId?: number, IdSeqAvatar?: number): Observable<any> {
        return from(
            this.dataSource.transaction(async (manager) => {
                try {
                    if (userId && IdSeqAvatar) {
                        await manager.createQueryBuilder()
                            .delete()
                            .from(ERPUploadsUserFile)
                            .where("UserID = :userId AND IdSeq = :IdSeqAvatar AND IsAvatar = 1 AND Type = 'ASSET'", 
                                { userId: userId, IdSeqAvatar: IdSeqAvatar })
                            .execute();
                    }else{
                        
                    }

                    const insertResult = await manager.createQueryBuilder()
                        .insert()
                        .into(ERPUploadsUserFile)
                        .values(fileData)
                        .execute();


                    return {
                        success: true,
                        data: [{
                            IdSeq: insertResult.identifiers[0].IdSeq,
                            Path: fileData.Path,
                            Filename: fileData.Filename,
                            Originalname: fileData.Originalname,
                            Size: fileData.Size,
                        }]
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error.message,
                    };
                }
            })
        ).pipe(
            catchError(err => of({
                success: false,
                message: err.message || 'Database error',
            }))
        );
    }

    handleMultipleUpload(fileData: Partial<ERPUploadsUserFile>): Observable<any> {
        return from(
            this.dataSource.transaction(async (manager) => {
                try {

                    const insertResult = await manager.createQueryBuilder()
                        .insert()
                        .into(ERPUploadsUserFile)
                        .values(fileData)
                        .execute();


                    return {
                        success: true,
                        data: [{
                            IdSeq: insertResult.identifiers[0].IdSeq,
                            Path: fileData.Path,
                            Filename: fileData.Filename,
                            Originalname: fileData.Originalname,
                            Size: fileData.Size,
                        }]
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error.message,
                    };
                }
            })
        ).pipe(
            catchError(err => of({
                success: false,
                message: err.message || 'Database error',
            }))
        );
    }
}
