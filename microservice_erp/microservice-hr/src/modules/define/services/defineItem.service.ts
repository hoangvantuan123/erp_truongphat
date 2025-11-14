import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ERPDefineItem } from '../entities/defineItem.entity';
import { ERPDefine } from '../entities/define.entity';


import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class DefineItemService {
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

  DefineItemA(result: any[]): Observable<any> {
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
              .into(ERPDefineItem)
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
  DefineItemU(result: any[], userSeq: any): Observable<any> {
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
                .update(ERPDefineItem)
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


  DefineItemD(records: any[]): Observable<any> {
    if (!records || records.length === 0) {
      return of({
        success: false,
        message: 'No records provided for deletion',
        data: [],
      });
    }

    const ids = records.map(r => r.IdSeq);         // [43]
    const idList = ids.join(',');                  // "43"

    return from(this.dataSource.transaction(async (manager) => {
      try {
        const deleteSql = `
          DELETE FROM _ERPDefineItem
          OUTPUT DELETED.IdSeq
          WHERE IdSeq IN (${idList})
        `;

        const deleteResult = await manager.query(deleteSql);

        if (deleteResult.length > 0) {
          return {
            success: true,
            message: `${deleteResult.length} record(s) deleted successfully`,
            data: deleteResult.map(r => r.IdSeq),
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

  DefineItemQ(result: any): Observable<any> {
    if (!result) {
      return of({
        success: false,
        message: 'No query parameters provided',
        data: [],
      });
    }

    return from(this.dataSource.transaction(async (manager) => {
      try {
        const queryBuilder = manager.createQueryBuilder(ERPDefineItem, 'q')
          .select([
            'q.IdSeq as "IdSeq"',
            'q.DefineSeq as "DefineSeq"',
            'q.DefineItemName as "DefineItemName"',
            'q.Value as "Value"',
            'q.IsActive as "IsActive"',
            'q.CreatedBy as "CreatedBy"',
            'q.CreatedAt as "CreatedAt"',
            'q.UpdatedBy as "UpdatedBy"',
            'q.UpdatedAt as "UpdatedAt"',
            's.DefineName as "DefineName"',
            's.DefineKey as "DefineKey"',
          ])
          .leftJoin(
            ERPDefine,
            's',
            'q."DefineSeq" = s."IdSeq"',
          );


        if (result.KeyItem1) {
          queryBuilder.andWhere('q.DefineItemName = :KeyItem1', { KeyItem1: result.KeyItem1 });
        }

        if (result.KeyItem2) {
          queryBuilder.andWhere('q.DefineSeq = :KeyItem2', { KeyItem2: result.KeyItem2 });
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
