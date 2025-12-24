import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { from, Observable, map, catchError, throwError, of } from 'rxjs';


@Injectable()
export class EmpSPService {
    constructor(private readonly dataSource: DataSource) { }
    EmpSPH(result: any) {
        return from(
            this.dataSource
                .createQueryBuilder()
                .select([
                    'q.EmpSeq AS EmpSeq',
                    'q.EmpName AS EmpName',
                    'q.Empid AS Empid',
                    'q.Empid AS EmpID',
                ])
                .from('_TDAEmp', 'q')
                .orderBy('q.EmpSeq', 'ASC')
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
    EmpSPInterviewH(result: any) {
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
                    'q.IdSeq AS IdSeq',
                    'q.EmpName AS EmpName',
                    'q.EmpID AS EmpID',
                    'q.ResidID AS ResidID',
                    'q.InterviewDate AS InterviewDate',
                    'q.SMSexSeq AS SMSexSeq',
                    's1.DefineItemName as "SMSexName"',
                ])
                .from('_ERPEmpRecruit', 'q')
                .where('q.StatusSync = :statusSync', { statusSync: type1 })
                .leftJoin(
                    "_ERPDefineItem",
                    's1',
                    'q."SMSexSeq" = s1."IdSeq"'
                )

                .orderBy('q.IdSeq', 'ASC')
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
