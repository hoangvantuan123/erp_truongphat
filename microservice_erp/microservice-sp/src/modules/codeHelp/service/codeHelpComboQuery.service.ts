import { Injectable } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of } from 'rxjs';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
@Injectable()
export class CodeHelpComboQueryService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    _SCACodeHelpComboQuery(
        workingTag: string,
        languageSeq: number,
        codeHelpSeq: number,
        companySeq: number,
        keyword: string,
        param1: string,
        param2: string,
        param3: string,
        param4: string
    ): Observable<SimpleQueryResult> {
        const query = `
          EXEC dbo._SCACodeHelpComboQuery_WEB 
            @WorkingTag = '${workingTag}',
            @LanguageSeq = ${languageSeq},
            @CodeHelpSeq = ${codeHelpSeq},
            @CompanySeq = ${companySeq},
            @Keyword = '${keyword}',
            @Param1 = '${param1}',
            @Param2 = '${param2}',
            @Param3 = '${param3}',
            @Param4 = '${param4}';
        `.trim();

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }

}
