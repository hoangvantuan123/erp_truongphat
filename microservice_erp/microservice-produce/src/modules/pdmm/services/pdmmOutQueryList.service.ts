import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class PdmmOutQueryListService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }

    _SPDMMOutReqListQuery_WEB(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDMMOutReqListQuery(result);
        const query = `
            EXEC _SPDMMOutReqListQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 4594,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1571;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }

    SCOMConfirm(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSCOMConfirm(result);
        const query = `
            EXEC _SCOMConfirm_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2609,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 5369,
            @Reason = N'${result?.Reason || 'null'}'
        `;
        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }

    _SPDMMOutReqCancel(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDMMOutReqCancel(result);
        const query = `
            EXEC _SPDMMOutReqCancel_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 4594,
            @WorkingTag = N'M',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 5369;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }

}
