import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ERPDefine } from '../entities/define.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ERPDefineItem } from '../entities/defineItem.entity';
@Injectable()
export class DefineService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(ERPDefine)
    private readonly ERPDefineRepository: Repository<ERPDefine>,
  ) { }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }


  DefineA(result: any[]): Observable<any> {
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
              .into(ERPDefine)
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
  DefineU(result: any[], userSeq: any): Observable<any> {
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
                .update(ERPDefine)
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

  DefineD(records: any[]): Observable<any> {
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

        const existingRecords = await manager.find(ERPDefineItem, {
          where: {
            DefineSeq: In(ids),
          },
        });

        if (existingRecords.length > 0) {
          return {
            success: false,
            message: 77,
            data: records,
          };
        }

        const result = await manager.delete(ERPDefine, { IdSeq: In(ids) });

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
  DefineQ(result: any): Observable<any> {
    if (!result) {
      return of({
        success: false,
        message: 'No query parameters provided',
        data: [],
      });
    }

    return from(this.dataSource.transaction(async (manager) => {
      try {
        const queryBuilder = manager.createQueryBuilder(ERPDefine, 'q')
          .select([
            'q.IdSeq as "IdSeq"',
            'q.DefineName as "DefineName"',
            'q.DefineKey as "DefineKey"',
            'q.IsActive as "IsActive"',
            'q.Description as "Description"',
            'q.CreatedBy as "CreatedBy"',
            'q.CreatedAt as "CreatedAt"',
            'q.UpdatedBy as "UpdatedBy"',
            'q.UpdatedAt as "UpdatedAt"',
          ])



        if (result.KeyItem1) {
          queryBuilder.andWhere('q.DefineName = :KeyItem1', { KeyItem1: result.KeyItem1 });
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
