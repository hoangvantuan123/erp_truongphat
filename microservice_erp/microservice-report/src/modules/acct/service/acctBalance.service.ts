import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';

@Injectable()
export class AcctBalanceService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }

    SACLedgerQueryAccBalanceQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSACLedgerQueryAccBalanceQ(result);

        const query = `
            EXEC _SACLedgerQueryAccBalance_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1291,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = N'${result[0].LanguageSeq || 6}',
            @UserSeq = ${userSeq},
            @PgmSeq = 300191;
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
    SACLedgerQueryDetaBalanceQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSACLedgerQueryDetaBalanceQ(result);

        const query = `
            EXEC _SACLedgerQueryDetailedBalance_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1291,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = N'${result[0].LanguageSeq || 6}',
            @UserSeq = ${userSeq},
            @PgmSeq = 300197;
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
    SACSlipRowSRemDetaBalanceQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSACSlipRowSRemDetaBalanceQ(result);

        const query = `
            EXEC _SACSlipRowSearchRemQueryDetailedBalance_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1817,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = N'${result[0].LanguageSeq || 6}',
            @UserSeq = ${userSeq},
            @PgmSeq = 300197;
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
    SACLedgerQueryAccRemBalanceQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSACLedgerQueryAccRemBalanceQ(result);

        const query = `
            EXEC _SACLedgerQueryAccRemBalance_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1291,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = N'${result[0].LanguageSeq || 6}',
            @UserSeq = ${userSeq},
            @PgmSeq = 300195;
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
