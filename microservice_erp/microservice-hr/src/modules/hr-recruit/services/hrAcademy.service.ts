import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { HrAcademyRecruit } from '../entities/hr.academy.recruit.entity';
@Injectable()
export class ErpHrAcademyRecruitService {
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
    HrAcademyRecruitA(result: any[]): Observable<any> {
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
                            .into(HrAcademyRecruit)
                            .values(batch)
                            .execute();

                        const inserted = insertResult.identifiers.map((idObj, i) => ({
                            ...batch[i],
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
                const hasError = resultCache.some(item => item.success === false);
                if (hasError) {
                    const firstError = resultCache.find(item => item.success === false);
                    return {
                        success: false,
                        message: firstError?.message || 'Error occurred during processing',
                        data: firstError?.data || [],
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


    HrAcademyRecruitU(result: any[]): Observable<any> {
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
                                .update(HrAcademyRecruit)
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
                        message: firstError?.message || 'Error occurred during processing',
                        data: firstError?.data || [],
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


    HrAcademyRecruitD(records: any[]): Observable<any> {
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


                const result = await manager.delete(HrAcademyRecruit, { IdSeq: In(ids) });

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
    HrAcademyRecruitQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(HrAcademyRecruit, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.IdxNo as "IdxNo"',
                        'q.EmpSeq as "EmpSeq"',
                        'q.CreatedBy as "CreatedBy"',
                        'q.UpdatedBy as "UpdatedBy"',
                        'q.SchoolName as "SchoolName"',
                        'q.Major as "Major"',
                        'q.Years as "Years"',
                        'q.StartYear as "StartYear"',
                        'q.GraduationYear as "GraduationYear"',
                        'q.GraduationRank as "GraduationRank"',
                        's.EmpName as "EmpName"',
                        's.ResidID as "ResidID"',
                        's.EmpID as "EmpID"',
                        's.SMSexSeq as "SMSexSeq"',
                        's.InterviewDate as "InterviewDate"',
                        's1.DefineItemName as "SMSexName"',
                    ])

                    .leftJoin(
                        "_ERPEmpRecruit",
                        's',
                        'q."EmpSeq" = s."IdSeq"',
                    )
                    .leftJoin(
                        "_ERPDefineItem",
                        's1',
                        's."SMSexSeq" = s1."IdSeq"',
                    )

                const startDate = result.KeyItem1 || null;
                const endDate = result.KeyItem2 || null;

                if (startDate && endDate) {
                    queryBuilder.andWhere('s.InterviewDate BETWEEN :start AND :end', {
                        start: startDate,
                        end: endDate,
                    });
                } else if (startDate) {
                    queryBuilder.andWhere('s.InterviewDate >= :start', { start: startDate });
                } else if (endDate) {
                    queryBuilder.andWhere('s.InterviewDate <= :end', { end: endDate });
                }
                if (result.KeyItem3) {
                    queryBuilder.andWhere('s.EmpName LIKE :KeyItem3', {
                        KeyItem3: `%${result.KeyItem3}%`,
                    });
                }

                if (result.KeyItem4) {
                    queryBuilder.andWhere('s.EmpID LIKE :KeyItem4', {
                        KeyItem4: `%${result.KeyItem4}%`,
                    });
                }
                if (result.KeyItem5) {
                    queryBuilder.andWhere('s.StatusSync = :KeyItem5', { KeyItem5: result.KeyItem5 });
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
