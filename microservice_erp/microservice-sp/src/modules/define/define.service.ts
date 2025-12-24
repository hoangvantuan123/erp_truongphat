import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { from, Observable, map, catchError, throwError, of } from 'rxjs';
import {
    GET_ALL_DEFINE, GET_ALL_DEFINE_ITEM,
    GET_ALL_DEFINE_ITEM_SEQ,
    GET_ALL_ITEM_SEQ,
    GET_ALL_CUST_SEQ
} from './queries/define.query';



@Injectable()
export class DefineService {
    constructor(private readonly dataSource: DataSource) { }

    ItemAllH(): Observable<any> {
        return from(this.dataSource.query(GET_ALL_ITEM_SEQ)).pipe(
            map((result) => ({
                success: true,
                message: 'success',
                data: result,
            })),
            catchError((error) => {
                return throwError(() => new InternalServerErrorException({
                    success: false,
                    message: 'failed',
                    data: [],
                }));
            }),
        );
    }
    CustAllH(): Observable<any> {
        return from(this.dataSource.query(GET_ALL_CUST_SEQ)).pipe(
            map((result) => ({
                success: true,
                message: 'success',
                data: result,
            })),
            catchError((error) => {
                return throwError(() => new InternalServerErrorException({
                    success: false,
                    message: 'failed',
                    data: [],
                }));
            }),
        );
    }

    OrgDefineH(): Observable<any> {
        return from(this.dataSource.query(GET_ALL_DEFINE)).pipe(
            map((result) => ({
                success: true,
                message: 'success',
                data: result,
            })),
            catchError((error) => {
                return throwError(() => new InternalServerErrorException({
                    success: false,
                    message: 'failed',
                    data: [],
                }));
            }),
        );
    }
    OrgDefineItemH(): Observable<any> {
        return from(this.dataSource.query(GET_ALL_DEFINE_ITEM)).pipe(
            map((result) => ({
                success: true,
                message: 'success',
                data: result,
            })),
            catchError((error) => {
                return throwError(() => new InternalServerErrorException({
                    success: false,
                    message: 'failed',
                    data: [],
                }));
            }),
        );
    }
    OrgCodeHelpDefineItemH(result: any) {
        const type1 = result.KeyItem1 || '';

        if (!type1) {
            return of({
                success: false,
                message: 'Missing KeyItem1',
                data: [],
            });
        }

        return from(
            this.dataSource
                .createQueryBuilder()
                .select([
                    'dfi.IdSeq AS IdSeq',
                    'dfi.DefineSeq AS DefineSeq',
                    'dfi.DefineKey AS DefineKey',
                    'dfi.DefineItemName AS DefineItemName',
                    'dfi.Value AS Value',
                    'dfi.IdxNo AS IdxNo',
                    'dfi.IsActive AS IsActive',
                    'df.DefineName AS DefineName',
                ])
                .from('_ERPDefineItem', 'dfi')
                .leftJoin('_ERPDefine', 'df', 'dfi.DefineSeq = df.IdSeq')
                .where('dfi.DefineKey = :DefineKey', { DefineKey: type1 })
                .andWhere('dfi.IsActive = 1')
                .orderBy('dfi.IdSeq', 'ASC')
                .getRawMany()
        ).pipe(
            map((data) => ({
                success: true,
                message: 'success',
                data: data,
            })),
            catchError((error) =>
                throwError(() =>
                    new InternalServerErrorException({
                        success: false,
                        message: 'failed',
                        data: [],
                    })
                )
            )
        );
    }

}
