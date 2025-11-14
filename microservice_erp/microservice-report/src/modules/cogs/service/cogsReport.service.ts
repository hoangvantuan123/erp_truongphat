import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';

@Injectable()
export class CogsReportService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }

    SESMCFProfitAmtQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSESMCFProfitAmtQ(result);

        const query = `
            EXEC ITMV_SESMCFProfitAmtQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1519637,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1031344;
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

    SESMCFMnfcostasQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSESMCFMnfcostasQ(result);

        const query = `
            EXEC ITM_SESMCFMnfcostasQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1517523,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1038258;
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
    VTNSESMZProdCostMonListQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLVTNSESMZProdCostMonListQ(result);

        const query = `
            EXEC VTN_SESMZProdCostMonListQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1512630,
             @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = N'${result[0].LanguageSeq || 6}',
            @UserSeq = ${userSeq},
            @PgmSeq = 1033932;
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
    SBAZProdCostItemListQ(
        result: any,
        userSeq: number,
        companySeq: number,
        languageSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSBAZProdCostItemListQ(result);

        const query = `
            EXEC ITMV_SBAZProdCostItemListQuery
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1519550,
             @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = N'${result[0].LanguageSeq || 6}',
            @UserSeq = ${userSeq},
            @PgmSeq = 1040236;
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
