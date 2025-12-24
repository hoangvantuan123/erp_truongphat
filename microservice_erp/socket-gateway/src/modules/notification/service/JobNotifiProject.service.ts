
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class JobNotifiProjectService {
    constructor(
        private readonly dataSource: DataSource,

    ) { }



    NotifiProjectQ(
    ): Observable<any> {
        const query = `
           EXEC NotifiProjectQ;
         `;

        return from(this.dataSource.query(query)).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error =>
                of({
                    success: false,
                    message: error.message || ERROR_MESSAGES.DATABASE_ERROR
                })
            )
        );
    }








}
