import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
@Injectable()
export class WarehouseService {
    constructor(private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
        ,
    ) { }



    async SDAWHMainQueryWEB(
        result: any[],
        companySeq: number,
        userSeq: number,
        pgmSeq: number
    ): Promise<SimpleQueryResult> {
        try {
            const xmlDocument = await this.generateXmlService.generateXMLSDAWHMainQueryWEB(result);

            const query = `
              EXEC _SDAWHMainQuery_WEB
                @xmlDocument = N'${xmlDocument}', -- Cẩn thận với dữ liệu đầu vào
                @xmlFlags = 2,
                @ServiceSeq = 877,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = 6,
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;

            const dbResult = await this.databaseService.executeQuery(query);

            return { success: true, data: dbResult };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }

    async SDAWHSubAutoCreate(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        const xmlFlags = 2;
        const serviceSeq = 877;
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
                const xmlDocumentCheck = await this.generateXmlService.generateXMLSDAWHMainCheck(result);
                const queryCheck = generateQuery(xmlDocumentCheck, '_SDAWHMainCheck');
                const resultCheck = await this.databaseService.executeQuery(queryCheck);

                const invalidStatuses = resultCheck.some((item: any) => item.Status !== 0);
                if (invalidStatuses) {
                    const errorMessages = resultCheck
                        .filter((item: any) => item.Status !== 0)
                        .map((item: any) => ({
                            whName: item.WHName,
                            bizUnitName: item.BizUnitName,
                            factUnitName: item.FactUnitName,
                            mngDeptName: item.MngDeptName,
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

                const xmlDocumentSave = await this.generateXmlService.generateXMLSDAWHMainSave(checkData);
                const querySave = generateQuery(xmlDocumentSave, '_SDAWHMainSave');
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


    async SDAWHCheckDelete(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        const xmlFlags = 2;
        const serviceSeq = 877;
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
                const xmlDocumentCheck = await this.generateXmlService.generateXMLSDAWHMainCheckDorU(result, 'D');
                const queryCheck = generateQuery(xmlDocumentCheck, '_SDAWHMainCheck');
                const resultCheck = await this.databaseService.executeQuery(queryCheck);

                const invalidStatuses = resultCheck.some((item: any) => item.Status !== 0);
                if (invalidStatuses) {
                    const errorMessages = resultCheck
                        .filter((item: any) => item.Status !== 0)
                        .map((item: any) => ({
                            whName: item.WHName,
                            bizUnitName: item.BizUnitName,
                            factUnitName: item.FactUnitName,
                            mngDeptName: item.MngDeptName,
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
                const xmlDocumentSave = await this.generateXmlService.generateXMLSDAWHMainDorU(checkData, 'D');
                const querySave = generateQuery(xmlDocumentSave, '_SDAWHMainSave');
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


    async SDAWHCheckUpdate(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        const xmlFlags = 2;
        const serviceSeq = 877;
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
                const xmlDocumentCheck = await this.generateXmlService.generateXMLSDAWHMainCheckDorU(result, 'U');
                const queryCheck = generateQuery(xmlDocumentCheck, '_SDAWHMainCheck');
                const resultCheck = await this.databaseService.executeQuery(queryCheck);

                const invalidStatuses = resultCheck.some((item: any) => item.Status !== 0);
                if (invalidStatuses) {
                    const errorMessages = resultCheck
                        .filter((item: any) => item.Status !== 0)
                        .map((item: any) => ({
                            whName: item.WHName,
                            bizUnitName: item.BizUnitName,
                            factUnitName: item.FactUnitName,
                            mngDeptName: item.MngDeptName,
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
                const xmlDocumentSave = await this.generateXmlService.generateXMLSDAWHMainDorU(checkData, 'U');
                const querySave = generateQuery(xmlDocumentSave, '_SDAWHMainSave');
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
            console.log('check', check)
            return await saveResult(check.data);
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    }


}
