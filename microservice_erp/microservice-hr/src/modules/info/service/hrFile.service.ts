import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';

import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class HrFileService {
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


    HrFileQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }


        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder()
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.UserId as "UserId"',
                        'q.Filename as "Filename"',
                        'q.Type as "Type"',
                        'q.IsAvatar as "IsAvatar"',
                        'q.Path as "Path"',
                        'q.Size as "Size"',
                        'q.IdxNo as "IdxNo"',
                        'q.Originalname as "Originalname"',
                        'q.CreatedAt as "CreatedAt"',
                    ])
                    .from('_ERPUploadsUserFile', 'q')


                if (result.KeyItem1) {
                    queryBuilder.andWhere('q.UserId = :KeyItem1', { KeyItem1: result.KeyItem1 });
                }
                if (result.KeyItem2) {
                    queryBuilder.andWhere('q.Type = :KeyItem2', { KeyItem2: result.KeyItem2 });
                }
                if (result.KeyItem3) {
                    queryBuilder.andWhere('q.IsAvatar = :KeyItem3', { KeyItem3: result.KeyItem3 });
                }
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
    HrFileD(records: any[]): Observable<any> {
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



                const result = await manager.delete('_ERPUploadsUserFile', { IdSeq: In(ids) });

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
                    message: 79,
                    data: [],
                    error: error.message,
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
