import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';

@Injectable()
export class FinQueryCmpService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }

    FinQueryCmpQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLFinQueryCmpQ(result);

        const query = `
            EXEC _SACFinancialStatementQueryTermCmp_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2868,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 4599;
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
    FSQueryTermByMonthQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLFSQueryTermByMonthQ(result);

        const query = `
            EXEC _SACFinancialStatementQueryTermByMonth_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 5687,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 6902;
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
    FSMonthlyProdCostQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLFSMonthlyProdCostQ(result);

        const query = `
            EXEC _SACFinancialStatementQueryTermByMonth_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 5687,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 6896;
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
    FinancialReportQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLFinancialReportQ(result);

        const query = `
            EXEC _SACFinancialStatementQueryTermCmp_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2868,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 4600;
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
    MonthlyFinancialReportQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLMonthlyFinancialReportQ(result);

        const query = `
            EXEC _SACFinancialStatementQueryTermByMonth_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 5687,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 9402;
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
