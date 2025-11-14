import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';

@Injectable()
export class BOMService {
    constructor(private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }


    async _SPDBOMTreeQuery(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSPDBOMTreeQuery(result);
        const query = `
      EXEC _SPDBOMTreeQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1874,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6885;
    `;
        try {
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }
    async _SPDBOMItemInfoQuery(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSPDBOMItemInfoQuery(result);
        const query = `
      EXEC _SPDBOMItemInfoQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1861,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6885;
    `;
        try {
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }
    async _BOMVerMngQuery(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateSPDBOMVerMngQuery(result);
        const query = `
      EXEC _SPDBOMVerMngQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1861,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6885;
    `;
        try {
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }
    async _SPDBOMSubItemQuery(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSPDBOMSubItemQuery(result);
        const query = `
      EXEC _SPDBOMSubItemQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1861,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6885;
    `;
        try {
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }

    async SPDBOMSubItemCreate(result: any[], companySeq: number, userSeq: number): Promise<any> {
        const xmlFlags = 2;
        const serviceSeq = 1861;
        const languageSeq = 6;
        const workingTag = '';
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
                const xmlDocumentCheck = await this.generateXmlService.generateXMLSPDBOMSubItemCheck(result);
                const queryCheck = generateQuery(xmlDocumentCheck, '_SPDBOMSubItemCheck');
                const resultCheck = await this.databaseService.executeQuery(queryCheck);

                const invalidStatuses = resultCheck.some((item: any) => item.Status !== 0);
                if (invalidStatuses) {
                    const errorMessages = resultCheck
                        .filter((item: any) => item.Status !== 0)
                        .map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.ReqNo,
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

                const xmlDocumentSave = await this.generateXmlService.generateXMLSPDBOMSubItemCheck(checkData);
                const querySave = generateQuery(xmlDocumentSave, '_SPDBOMSubItemSave');
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






    private async AutoCheck(result: any[], companySeq: number, userSeq: number, workingTag: string): Promise<SimpleQueryResult2> {
        const xmlFlags = 2;
        const serviceSeq = 1861;
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
                const xmlDocumentCheck = await this.generateXmlService.generateXMLItem(result, workingTag);
                const queryCheck = generateQuery(xmlDocumentCheck, '_SPDBOMSubItemCheck');
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
                const xmlDocumentSave = await this.generateXmlService.generateXMLItem(checkData, workingTag);
                const querySave = generateQuery(xmlDocumentSave, '_SPDBOMSubItemSave');
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
    async AutoCheckA(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.AutoCheck(result, companySeq, userSeq, 'A');
    }
    async AutoCheckU(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.AutoCheck(result, companySeq, userSeq, 'U');
    }


    async AutoCheckD(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.AutoCheck(result, companySeq, userSeq, 'D');
    }

}
