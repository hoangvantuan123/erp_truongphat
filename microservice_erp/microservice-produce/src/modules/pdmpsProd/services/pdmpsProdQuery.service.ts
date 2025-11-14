import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';

@Injectable()
export class PdmpsProdQueryService {
    constructor(private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }


    async _SPDMPSProdReqListQuery(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSPDMPSProdReqListQuery(result);
        const query = `
      EXEC _SPDMPSProdReqListQuery_TEST_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5245,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6885,
        @Page = 1,
         @Limit  = 10;
    `;
        try {
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }



    private async AutoCheck(result: any[], resultItem: any[], companySeq: number, userSeq: number, workingTag: string): Promise<any> {
        const xmlFlags = 2;
        const serviceSeq = 1769;
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
                const xmlDocumentCheck = await this.generateXmlService.generateXMLSPDMPSProdReq(result, workingTag);
                const queryCheck = generateQuery(xmlDocumentCheck, '_SPDMPSProdReqCheck');
                const resultCheck = await this.databaseService.executeQuery(queryCheck);

                if (!resultCheck?.length) {
                    return { success: false, errors: ["Không có dữ liệu trả về từ kiểm tra đơn hàng"] };
                }

                const invalidStatuses = resultCheck.some((item: any) => item.Status !== 0);
                if (invalidStatuses) {
                    return {
                        success: false,
                        errors: resultCheck.filter((item: any) => item.Status !== 0).map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.ItemName,
                            result: item.Result,
                        })),
                    };
                }

                return { success: true, data: resultCheck };
            } catch (error) {
                return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
            }
        };

        const checkResultItem = async (ProdReqSeq: number) => {
            try {
                const xmlDocumentCheck = await this.generateXmlService.generateXMLSPDMPSProdReqItemCheck(resultItem, ProdReqSeq, workingTag);
                const queryCheck = generateQuery(xmlDocumentCheck, '_SPDMPSProdReqItemCheck');
                const resultCheck = await this.databaseService.executeQuery(queryCheck);

                if (!resultCheck?.length) {
                    return { success: false, errors: ["Không có dữ liệu trả về từ kiểm tra sản phẩm"] };
                }

                const invalidStatuses = resultCheck.some((item: any) => item.Status !== 0);
                if (invalidStatuses) {
                    return {
                        success: false,
                        errors: resultCheck.filter((item: any) => item.Status !== 0).map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.ItemName,
                            result: item.Result,
                        })),
                    };
                }

                return { success: true, data: resultCheck };
            } catch (error) {
                return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
            }
        };

        const saveResult = async (checkData: any[], ProdReqSeq: number) => {
            try {
                const xmlDocumentSave = await this.generateXmlService.generateXMLSPDMPSProdReq(checkData, workingTag);
                const querySave = generateQuery(xmlDocumentSave, '_SPDMPSProdReqSave');
                const resultSave = await this.databaseService.executeQuery(querySave);
                return { success: true, data: resultSave };
            } catch (error) {
                return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
            }
        };

        const saveResultItem = async (checkData: any[], ProdReqSeq: number) => {
            try {
                const xmlDocumentSave = await this.generateXmlService.generateXMLSPDMPSProdReqItemCheck(checkData, ProdReqSeq, workingTag);
                const querySave = generateQuery(xmlDocumentSave, '_SPDMPSProdReqItemSave');
                const resultSave = await this.databaseService.executeQuery(querySave);
                return { success: true, data: resultSave };
            } catch (error) {
                return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
            }
        };

        try {
            const check = await checkResult();
            if (!check.success) return check;

            const prodReqSeq = check.data?.[0]?.ProdReqSeq;
            if (!prodReqSeq) return { success: false, errors: ["Không tìm thấy ProdReqSeq"] };
    
            const checkItem = await checkResultItem(prodReqSeq);
            if (!checkItem.success) return checkItem;

            const [save, save1] = await Promise.all([
                saveResult(check.data[0], prodReqSeq),
                saveResultItem(resultItem, prodReqSeq),
            ]);

            if (save.success && save1.success) {
                return {
                    success: true,
                    message: "Lưu thành công",
                    data: {
                        saveResult: save.data,
                        saveResultItem: save1.data,
                    },
                };
            }

            return { success: false, errors: [...(save.errors || []), ...(save1.errors || [])] };

        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    }

    async AutoCheckA(result: any[], resultItem: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.AutoCheck(result, resultItem, companySeq, userSeq, 'A');
    }

    async AutoCheckU(result: any[], resultItem: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.AutoCheck(result, resultItem, companySeq, userSeq, 'U');
    }



    private async AutoCheckItem(result: any[], companySeq: number, userSeq: number, workingTag: string): Promise<SimpleQueryResult2> {
        const xmlFlags = 2;
        const serviceSeq = 1769;
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
                const xmlDocumentCheck = await this.generateXmlService.generateXMLSPDMPSProdReqItemCheck2(result, workingTag);
                const queryCheck = generateQuery(xmlDocumentCheck, '_SPDMPSProdReqItemCheck');
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
                const xmlDocumentSave = await this.generateXmlService.generateXMLSPDMPSProdReqItemCheck2(checkData, workingTag);
                const querySave = generateQuery(xmlDocumentSave, '_SPDMPSProdReqItemSave');
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
    async AutoCheckItemA(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.AutoCheckItem(result, companySeq, userSeq, 'A');
    }

    async AutoCheckD(result: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
        return this.AutoCheckItem(result, companySeq, userSeq, 'D');
    }
}
