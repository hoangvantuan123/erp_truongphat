import { Injectable } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

@Injectable()
export class PrintLgEtcOutService {
    constructor(private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }


    async _SLGInOutReqPrintQuery_WEB(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSLGInOutReqPrintQuery(result);
        const query = `
      EXEC _SLGInOutReqPrintQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5660,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6885;
    `;
        try {
            const result = await this.databaseService.executeQuery(query);
            const data = {
                ...result[0],
                DataSheets: result
            }

            return { success: true, data: data };
        } catch (error) {
            console.log('error', error)
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }



}
