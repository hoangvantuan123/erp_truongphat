import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';
import { DataSource } from 'typeorm';
@Injectable()
export class HrEmpDateService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }



    HrEmpDateQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSHREmpDateQ(result);
        const query = `
             EXEC dbo._SHREmpDateQuery_WEB2
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1620,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1793;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => {
                console.log('[DEBUG] Raw DB result:', resultQuery);
                return { success: true, data: resultQuery };
            }),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }



}
