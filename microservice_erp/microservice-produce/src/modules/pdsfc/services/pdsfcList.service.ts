import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { SimpleQueryResult2, SimpleQueryResult } from '../interface/request';
@Injectable()
export class PdsfcListService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }



    SPDSFCWorkOrderQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDSFCWorkOrderQ(result);
        const query = `
            EXEC _SPDSFCWorkOrderQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2875,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 3512;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }

    SPDSFCMatProgressListQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDSFCMatProgressListQ(result);
        const query = `
            EXEC _SPDSFCMatProgressListQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 4111,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 4544;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }
    SPDSFCWorkReportQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDSFCWorkReportQ(result);
        const query = `
            EXEC _SPDSFCWorkReportQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2909,
            @WorkingTag = N'S',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1016;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }




}
