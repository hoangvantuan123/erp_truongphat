import { IsString } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlStockRealService } from '../generate-xml/generate-xml-stock-real.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';


@Injectable()
export class LGWHStockRealService {
    constructor(private readonly databaseService: DatabaseService, private readonly generateXmlService: GenerateXmlStockRealService) { }

    async SLGWHStockRealOpenListQueryWEB(result: any[], companySeq: number, userSeq: number, pgmSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSLGWHStockRealOpenListQueryWEB(result);
        const query = `
      EXEC _SLGWHStockRealOpenListQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 6687,
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
    async SLGWHStockRealOpenResultListQueryWEB(result: any[], companySeq: number, userSeq: number, pgmSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSLGWHStockRealOpenResultListQueryWEB(result);
        const query = `
      EXEC _SLGWHStockRealOpenResultListQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 6687,
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

    async SLGWHStockRealOpenQueryWEB(result: number, companySeq: number, userSeq: number, pgmSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSLGWHStockRealOpenQueryWEB(result);
        const query = `
      EXEC _SLGWHStockRealOpenQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 6687,
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

    async SLGWHStockRealOpenItemQueryWEB(result: number, companySeq: number, userSeq: number, pgmSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSLGWHStockRealOpenItemQueryWEB(result);
        const query = `
      EXEC _SLGWHStockRealOpenItemQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 6687,
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

    async SLGWHStockRealOpenItem2QueryWEB(result: number, companySeq: number, userSeq: number, pgmSeq: number): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSLGWHStockRealOpenItemQueryWEB(result);
        const query = `
      EXEC _SLGWHStockRealOpenItem2Query_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 6687,
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
async SLGWHStockRealOpenSave(dataMaster: any[], dataSheetAUD: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010005;
    const languageSeq = 6;
    const pgmSeq = 8160;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const saveResult = async () => {
        try {
            let workingTag: string;
            if(dataMaster[0].StkMngSeq > 0)
            {
                workingTag ='U'
            }
            else
            {
                workingTag ='A'
            }

            const xmlDocumentMasterCheck = await this.generateXmlService.generateXMLSLGWHStockRealOpenCheckWEB(dataMaster,workingTag);
            const queryMasterCheck = generateQuery(xmlDocumentMasterCheck, '_SLGWHStockRealOpenCheck_WEB');
            const resultMasterCheck = await this.databaseService.executeQuery(queryMasterCheck);
            const invalidMasterStatuses = resultMasterCheck.some((item: any) => item.Status !== 0);

            if (invalidMasterStatuses) {
                const errorMessages = resultMasterCheck
                    .filter((item: any) => item.Status !== 0)
                    .map((item: any) => ({
                        IDX_NO: item.IDX_NO,
                        Name: item.ReqNo,
                        result: item.Result,
                    }));
                return { success: false, errors: errorMessages };
            }
            if(dataSheetAUD.length > 0)
            {
                    const dataSheetAUDUpdate = dataSheetAUD.map(item => {
                        return {
                          ...item, 
                          StkMngSeq: resultMasterCheck[0].StkMngSeq,
                        };
                      });

                    const xmlDocumentMasterSave = await this.generateXmlService.generateXMLSLGWHStockRealOpenSaveWEB(resultMasterCheck);
                    const queryMasterSave = generateQuery(xmlDocumentMasterSave, '_SLGWHStockRealOpenSave_WEB');
                    const resultMasterSave = await this.databaseService.executeQuery(queryMasterSave);
                    const saveMasterStatuses = resultMasterSave.some((item: any) => item.Status !== 0);
                    if (saveMasterStatuses) {
                        const errorMessages = resultMasterSave
                            .filter((item: any) => item.Status !== 0)
                            .map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ReqNo,
                                result: item.Result,
                            }));
                        return { success: false, errors: errorMessages };
                    }

                    const xmlDocumentSheetSave = await this.generateXmlService.generateXMLSLGWHStockRealOpenItemSaveWEB(dataSheetAUDUpdate,workingTag);
                    const querySheetSave = generateQuery(xmlDocumentSheetSave, '_SLGWHStockRealOpenItemSave_WEB');
                    const resultSheetSave = await this.databaseService.executeQuery(querySheetSave);
                    const saveSheetStatuses = resultSheetSave.some((item: any) => item.Status !== 0);
                    if (saveSheetStatuses) {
                        const errorMessages = resultSheetSave
                            .filter((item: any) => item.Status !== 0)
                            .map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ReqNo,
                                result: item.Result,
                            }));
                        return { success: false, errors: errorMessages };
                    }
                    return { success: true, data: resultSheetSave };
                    
            }
            else
            {
                if(workingTag==='A')
                {
                    const errorMessages = [{
                        IDX_NO: 0,
                        Name: 'Sheet',
                        result: 'Bạn chưa nhập thông tin sheet',
                    }]
                    return { success: false, errors: errorMessages };
                }
                else
                {
                    const xmlDocumentMasterSave = await this.generateXmlService.generateXMLSLGWHStockRealOpenSaveWEB(resultMasterCheck);
                    const queryMasterSave = generateQuery(xmlDocumentMasterSave, '_SLGWHStockRealOpenSave_WEB');
                    const resultMasterSave = await this.databaseService.executeQuery(queryMasterSave);
                    const saveMasterStatuses = resultMasterSave.some((item: any) => item.Status !== 0);
                    if (saveMasterStatuses) {
                        const errorMessages = resultMasterSave
                            .filter((item: any) => item.Status !== 0)
                            .map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ReqNo,
                                result: item.Result,
                            }));
                        return { success: false, errors: errorMessages };
                    }

                    return { success: true, data: resultMasterSave };
                }
            }

            
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    };

    try {
        return await saveResult();
    } catch (error) {
        return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
    }
}

async SLGWHStockRealOpenDelete(dataMaster: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010005;
    const languageSeq = 6;
    const pgmSeq = 8160;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const deleteResult = async () => {
        try {
            const xmlDocumentMasterCheck = await this.generateXmlService.generateXMLSLGWHStockRealOpenDeleteWEB(dataMaster);
            const queryMasterCheck = generateQuery(xmlDocumentMasterCheck, '_SLGWHStockRealOpenDelete_WEB');
            const resultMasterCheck = await this.databaseService.executeQuery(queryMasterCheck);
            const invalidMasterStatuses = resultMasterCheck.some((item: any) => item.Status !== 0);

            if (invalidMasterStatuses) {
                const errorMessages = resultMasterCheck
                    .filter((item: any) => item.Status !== 0)
                    .map((item: any) => ({
                        IDX_NO: item.IDX_NO,
                        Name: item.ReqNo,
                        result: item.Result,
                    }));
                return { success: false, errors: errorMessages };
            }
            return { success: true, data: resultMasterCheck };
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    };

    try {
        return await deleteResult();
    } catch (error) {
        return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
    }
}

async SStockRealQRCheckWEB(result: any[], companySeq: number, userSeq: number, workingTag: string): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010003;
    const languageSeq = 6;
    const pgmSeq = 8176;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq}
        `;

    const checkResult = async () => {
        try {
            const xmlDocumentCheck = await this.generateXmlService.generateXMLSStockRealQRCheckWEB(result);
            const queryCheck = generateQuery(xmlDocumentCheck, '_SStockRealQRCheck_WEB');
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

    try {
        const check = await checkResult();
        return check;
        //return await saveResult(check.data);
    } catch (error) {
        return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
    }
}

async SLGGetWHStockQueryWEB(result: any[], companySeq: number, userSeq: number, workingTag: string): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 6687;
    const languageSeq = 6;
    const pgmSeq = 8160;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq}
        `;

    const checkResult = async () => {
        try {
            const xmlDocumentCheck = await this.generateXmlService.generateXMLSLGGetWHStockQueryWEB(result);
            const queryCheck = generateQuery(xmlDocumentCheck, '_SLGGetWHStockQuery_WEB');
            const resultCheck = await this.databaseService.executeQuery(queryCheck);
            return { success: true, data: resultCheck };
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    };

    try {
        const check = await checkResult();
        return check;
        //return await saveResult(check.data);
    } catch (error) {
        return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
    }
}

async SLGWHStockRealOpenResultSave(dataMaster: any[], gridData: any[], dataSheetAUD: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 6687;
    const languageSeq = 6;
    const pgmSeq = 8176;
    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const saveResult = async () => {
        try {

            const xmlDocumentSheetSave = await this.generateXmlService.generateXMLSLGWHStockRealRegSaveWEB(gridData);
            const querySheetSave = generateQuery(xmlDocumentSheetSave, '_SLGWHStockRealRegSave_WEB');
            const resultSheetSave = await this.databaseService.executeQuery(querySheetSave);
            const saveSheetStatuses = resultSheetSave.some((item: any) => item.Status !== 0);
            if (saveSheetStatuses) {
                const errorMessages = resultSheetSave
                    .filter((item: any) => item.Status !== 0)
                    .map((item: any) => ({
                        IDX_NO: item.IDX_NO,
                        Name: item.ReqNo,
                        result: item.Result,
                    }));
                return { success: false, errors: errorMessages };
                }
            const xmlDocumentSheetItemSave = await this.generateXmlService.generateXMLSLGWHStockRealRegSaveWEB(dataSheetAUD);
            const querySheetItemSave = generateQuery(xmlDocumentSheetItemSave, '_SLGWHStockRealRegItemSave_WEB');
            const resultSheetItemSave = await this.databaseService.executeQuery(querySheetItemSave);
            const saveSheetItemStatuses = resultSheetItemSave.some((item: any) => item.Status !== 0);
            if (saveSheetItemStatuses) {
             const errorMessages = saveSheetItemStatuses
                        .filter((item: any) => item.Status !== 0)
                        .map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.ReqNo,
                            result: item.Result,
                        }));
                    return { success: false, errors: errorMessages };
                    }

            return { success: true, data: resultSheetSave };
            
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    };

    try {
        return await saveResult();
    } catch (error) {
        return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
    }
}

async SLGWHStockRealRegDelete(dataMaster: any[], dataSheetAUD: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 6687;
    const languageSeq = 6;
    const pgmSeq = 8176;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const saveResult = async () => {
        try {
            const xmlDocumentSheetSave = await this.generateXmlService.generateXMLSLGWHStockRealRegDeleteWEB(dataSheetAUD);
            const querySheetSave = generateQuery(xmlDocumentSheetSave, '_SLGWHStockRealRegItemSave_WEB');
            const resultSheetSave = await this.databaseService.executeQuery(querySheetSave);
            const saveSheetStatuses = resultSheetSave.some((item: any) => item.Status !== 0);
            if (saveSheetStatuses) {
                const errorMessages = resultSheetSave
                    .filter((item: any) => item.Status !== 0)
                    .map((item: any) => ({
                        IDX_NO: item.IDX_NO,
                        Name: item.ReqNo,
                        result: item.Result,
                    }));
                return { success: false, errors: errorMessages };
                }
                    return { success: true, data: resultSheetSave };
            
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    };

    try {
        return await saveResult();
    } catch (error) {
        return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
    }
}

async SLGWHStockRealRegMasterDelete(dataMaster: any[], companySeq: number, userSeq: number): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 6687;
    const languageSeq = 6;
    const pgmSeq = 8176;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const saveResult = async () => {
        try {
            const xmlDocumentSheetSave = await this.generateXmlService.generateXMLSLGWHStockRealRegMasterDeleteWEB(dataMaster);
            const querySheetSave = generateQuery(xmlDocumentSheetSave, '_SLGWHStockRealRegSave_WEB');
            const resultSheetSave = await this.databaseService.executeQuery(querySheetSave);
            const saveSheetStatuses = resultSheetSave.some((item: any) => item.Status !== 0);
            if (saveSheetStatuses) {
                const errorMessages = resultSheetSave
                    .filter((item: any) => item.Status !== 0)
                    .map((item: any) => ({
                        IDX_NO: item.IDX_NO,
                        Name: item.ReqNo,
                        result: item.Result,
                    }));
                return { success: false, errors: errorMessages };
                }
                    return { success: true, data: resultSheetSave };
            
        } catch (error) {
            return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
        }
    };

    try {
        return await saveResult();
    } catch (error) {
        return { success: false, errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR] };
    }
}

}
