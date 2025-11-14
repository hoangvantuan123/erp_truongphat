import { Injectable } from '@nestjs/common';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';

@Injectable()
export class LGWHItemService {
    constructor(private readonly databaseService: DatabaseService, private readonly generateXmlService: GenerateXmlService) { }



    async SDAWHCaseItemQuery(result: any[], companySeq: number, userSeq: number, pgmSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSDAWHCaseItemQuery(result);
        const query = `
      EXEC _SDAWHCaseItemQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 877,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
        try {
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }

    async SDAWHItemQuery(result: any[], companySeq: number, userSeq: number, pgmSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSDAWHItemQuery(result);
        const query = `
      EXEC _SDAWHItemQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 913,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
        try {
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }


    /* A-U-D */
    private async SDAWHAutoCheck(result: any[], companySeq: number, userSeq: number, workingTag: string): Promise<SimpleQueryResult2> {
        const xmlFlags = 2;
        const serviceSeq = 913;
        const languageSeq = 6;
        const pgmSeq = 124;

        const generateQuery = (xmlDocument: string, procedure: string) => `
              EXEC ${procedure}_WEB
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = ${serviceSeq},
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;

        const checkResult = async () => {
            try {
                const xmlDocumentCheck = await this.generateXmlService.generateXMLSDAWHItem(result, workingTag);
                const queryCheck = generateQuery(xmlDocumentCheck, '_SDAWHItemCheck');
                const resultCheck = await this.databaseService.executeQuery(queryCheck);

                const invalidStatuses = resultCheck.some((item: any) => item.Status !== 0);
                if (invalidStatuses) {
                    const errorMessages = resultCheck
                        .filter((item: any) => item.Status !== 0)
                        .map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.ItemName,
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
                const xmlDocumentSave = await this.generateXmlService.generateXMLSDAWHItem(checkData, workingTag);
                const querySave = generateQuery(xmlDocumentSave, '_SDAWHItemSave');
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

    async SDAWHAutoCheckA(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.SDAWHAutoCheck(result, companySeq, userSeq, 'A');
    }

    async SDAWHAutoCheckU(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.SDAWHAutoCheck(result, companySeq, userSeq, 'U');
    }

    async SDAWHAutoCheckD(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.SDAWHAutoCheck(result, companySeq, userSeq, 'D');
    }
}
