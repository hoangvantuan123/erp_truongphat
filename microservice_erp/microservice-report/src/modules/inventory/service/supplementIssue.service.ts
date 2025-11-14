import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';

@Injectable()
export class SupplementIssueService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }

    SupplementIssueQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSupplementIssueQ(result);

        const query = `
            EXEC _SESMZAdjStockEtcOutAmt_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 3132,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 8018;
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
    StockMonthlyAmtQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLStockMonthlyAmtQ(result);

        const query = `
            EXEC _SESMZStockMonthlyAmt_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 3132,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 5718;
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
