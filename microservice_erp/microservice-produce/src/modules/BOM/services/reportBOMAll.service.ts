import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';

import { from, Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class BOMReportAllService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService,
    ) { }



    _SPDBOMReportAllQuery(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDBOMReportAllQuery(result);
        const query = `
            EXEC _SPDBOMReportAllQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 9670,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = 1,
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 6885;
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
