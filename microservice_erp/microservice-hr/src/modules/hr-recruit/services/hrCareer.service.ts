import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ERPCareerRecruit } from '../entities/hr.career.recruit.entity';
@Injectable()
export class ErpHrCareerRecruitService {
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

    HrCareerRecruitA(result: any[]): Observable<any> {
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
                            .into(ERPCareerRecruit)
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


    HrCareerRecruitU(result: any[]): Observable<any> {
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
                                .update(ERPCareerRecruit)
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


    /*   HrCareerRecruitD(records: any[]): Observable<any> {
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
  
                  const result = await manager.delete(ERPCareerRecruit, { IdSeq: In(ids) });
  
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
                      message: error.message || 'Internal server error',
                      data: [],
                  });
              })
          );
      } */
    HrCareerRecruitD(records: any[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({ success: false, message: 'No records provided for deletion', data: [] });
        }

        const ids = records.map(r => r.IdSeq);

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const constraints = [
                    { tableName: '_ERPCareerItemRecruit', columnName: 'CareerRecruitSeq' },
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
                    .from(ERPCareerRecruit)
                    .where('IdSeq IN (:...ids)', { ids })
                    .returning('deleted.IdSeq')
                    .execute();

                if (deleteResult.affected && deleteResult.affected > 0) {
                    return {
                        success: true,
                        message: `${deleteResult.affected} record(s) deleted successfully`,
                        data: deleteResult.raw, // hoặc [] nếu bạn không cần trả ID
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

    HrCareerRecruitQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ERPCareerRecruit, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.CreatedBy as "CreatedBy"',
                        'q.CreatedAt as "CreatedAt"',
                        'q.UpdatedBy as "UpdatedBy"',
                        'q.UpdatedAt as "UpdatedAt"',
                        'q.CompanyName as "CompanyName"',
                        'q.Position as "Position"',
                        'q.LaborScale as "LaborScale"',
                        'q.JoinDate as "JoinDate"',
                        'q.ResignDate as "ResignDate"',
                        'q.JobDescription as "JobDescription"',
                        'q.Salary as "Salary"',
                        'q.ReasonForLeaving as "ReasonForLeaving"',
                        'q.EmpSeq as "EmpSeq"',
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
                    ;
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
