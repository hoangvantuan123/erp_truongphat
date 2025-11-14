import { Injectable } from '@nestjs/common';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlLotMasterService } from '../generate-xml/generate-xml-lot-master.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';


@Injectable()
export class LotMasterService {
    constructor(private readonly databaseService: DatabaseService, private readonly generateXmlService: GenerateXmlLotMasterService) { }

    async SLGLotNoMasterQueryWEB(result: any[], companySeq: number, userSeq: number, pgmSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSLGLotNoMasterQueryWEB(result);
        const query = `
      EXEC _SLGLotNoMasterQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 4422,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
        try {
            console.log('query',query)
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }

/* A-U-D */
async SLGLotNoMasterAUD(result: any[], companySeq: number, userSeq: number, workingTag: string): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 4422;
    const languageSeq = 6;
    const pgmSeq = 5020;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'LotNoMSave',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const checkResult = async () => {
        try {
            const xmlDocumentCheck = await this.generateXmlService.generateXMLSLGLotNoMasterCheckWEB(result);
            const queryCheck = generateQuery(xmlDocumentCheck, '_SLGLotNoMasterCheck_WEB');
            const resultCheck = await this.databaseService.executeQuery(queryCheck);
            const invalidStatuses = resultCheck.some((item: any) => item.Status !== 0);
            if (invalidStatuses) {
                const errorMessages = resultCheck
                    .filter((item: any) => item.Status !== 0)
                    .map((item: any) => ({
                        IDX_NO: item.IDX_NO,
                        Name: item.LotNo,
                        result: item.Result,
                    }));
                return { success: false, errors: errorMessages };
            }
            return { success: true, data: resultCheck };
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    };

    const saveResult = async (checkData: any[]) => {
        try {
            const xmlDocumentSave = await this.generateXmlService.generateXMLSLGLotNoMasterSaveWEB(checkData);
            const querySave = generateQuery(xmlDocumentSave, '_SLGLotNoMasterSave_WEB');
            const resultSave = await this.databaseService.executeQuery(querySave);
            return { success: true, data: resultSave };
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    };

    try {
        const check = await checkResult();
        if (!check.success) {
            return check;
        }
        return await saveResult(check.data);
    } catch (error) {
        return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
    }
}
}
