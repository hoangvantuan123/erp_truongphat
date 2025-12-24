import { IsString } from 'class-validator';
import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlEtcInService } from '../generate-xml/generate-xml-etc-in.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';

@Injectable()
export class EtcInReqService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlEtcInService,
  ) {}

  async SLGInOutReqListQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGInOutReqListQueryWEB(result);
    const query = `
      EXEC _SLGInOutReqListQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2670,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async SLGInOutReqItemListQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGInOutReqItemListQueryWEB(
        result,
      );
    const query = `
      EXEC _SLGEtcInReqItemListQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2670,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async SLGInOutItemListQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGInOutItemListQueryWEB(result);
    const query = `
      EXEC _SLGInOutDailyItemListQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2931,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async SLGInOutReqItemQueryWEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGInOutReqItemQueryWEB(result);
    const query = `
      EXEC _SLGEtcInReqItemQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 60010004,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async SLGInOutReqQueryWEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGInOutReqQueryWEB(result);
    const query = `
      EXEC _SLGEtcInReqQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 60010004,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  /* A-U-D */
  async SCOMConfirmWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    workingTag: string,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2609;
    const languageSeq = 6;
    const pgmSeq = 3329;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq},
            @Reason = N'${result[0].Reason}';
        `;

    const checkResult = async () => {
      try {
        const xmlDocumentCheck =
          await this.generateXmlService.generateXMLSCOMConfirmWEB(result);
        const queryCheck = generateQuery(xmlDocumentCheck, '_SCOMConfirm_WEB');
        const resultCheck = await this.databaseService.executeQuery(queryCheck);
        const invalidStatuses = resultCheck.some(
          (item: any) => item.Status !== 0,
        );
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
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      const check = await checkResult();
      return check;
      //return await saveResult(check.data);
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGInOutReqStopSaveWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    workingTag: string,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2670;
    const languageSeq = 6;
    const pgmSeq = 3329;

    const generateQuery = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq},
            @Reason = N'${result[0].Reason}';
            
        `;

    const checkResult = async () => {
      try {
        const xmlDocumentCheck =
          await this.generateXmlService.generateXMLSLGInOutReqStopSaveWEB(
            result,
          );
        const queryCheck = generateQuery(
          xmlDocumentCheck,
          '_SLGInOutReqStopSave_WEB',
        );
        const resultCheck = await this.databaseService.executeQuery(queryCheck);
        const invalidStatuses = resultCheck.some(
          (item: any) => item.Status !== 0,
        );
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
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      const check = await checkResult();
      return check;
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  //ETC_IN_REQ
  async SLGInOutReqSave(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010004;
    const languageSeq = 6;
    const pgmSeq = 3317;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateComfirm = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2609,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
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
        if (dataMaster[0].ReqSeq > 0) {
          workingTag = 'U';
        } else {
          workingTag = 'A';
        }

        const xmlDocumentCloseCheck =
          await this.generateXmlService.generateXMLSCOMCloseCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryCloseCheck = generateClose(
          xmlDocumentCloseCheck,
          '_SCOMCloseCheck_WEB',
        );
        const resultCloseCheck =
          await this.databaseService.executeQuery(queryCloseCheck);
        const invalidCloseStatuses = resultCloseCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidCloseStatuses) {
          const errorMessages = resultCloseCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSLGInOutReqCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SLGInOutReqCheck_WEB',
        );
        const resultMasterCheck =
          await this.databaseService.executeQuery(queryMasterCheck);
        const invalidMasterStatuses = resultMasterCheck.some(
          (item: any) => item.Status !== 0,
        );

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

        const xmlDocumentConfirmDCheck =
          await this.generateXmlService.generateXMLSCOMConfirmDeleteWEB(
            resultMasterCheck,
          );
        const queryConfirmDCheck = generateComfirm(
          xmlDocumentConfirmDCheck,
          '_SCOMConfirmDelete_WEB',
        );
        const resultConfirmDCheck =
          await this.databaseService.executeQuery(queryConfirmDCheck);
        const invalidConfirmDStatuses = resultConfirmDCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidConfirmDStatuses) {
          const errorMessages = resultConfirmDCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.CfmSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        if (dataSheetAUD.length > 0) {
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              ReqSeq:
                item.ReqSeq === '' ? resultMasterCheck[0].ReqSeq : item.ReqSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSLGInOutReqItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SLGInOutReqItemCheck_WEB',
          );
          const resultSheetCheck =
            await this.databaseService.executeQuery(querySheetCheck);
          const invalidSheetStatuses = resultSheetCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidSheetStatuses) {
            const errorMessages = resultSheetCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.ReqNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }
          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSLGInOutReqSaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SLGInOutReqSave_WEB',
          );
          const resultMasterSave =
            await this.databaseService.executeQuery(queryMasterSave);
          const saveMasterStatuses = resultMasterSave.some(
            (item: any) => item.Status !== 0,
          );
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

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSLGInOutReqItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SLGInOutReqItemSave_WEB',
          );
          const resultSheetSave =
            await this.databaseService.executeQuery(querySheetSave);
          const saveSheetStatuses = resultSheetSave.some(
            (item: any) => item.Status !== 0,
          );
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

          const xmlDocumentConfirmCCheck =
            await this.generateXmlService.generateXMLSCOMConfirmDeleteWEB(
              resultMasterCheck,
            );
          const queryConfirmCCheck = generateComfirm(
            xmlDocumentConfirmCCheck,
            '_SCOMConfirmCreate_WEB',
          );
          const resultConfirmCCheck =
            await this.databaseService.executeQuery(queryConfirmCCheck);
          const invalidConfirmCStatuses = resultConfirmCCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidConfirmCStatuses) {
            const errorMessages = resultConfirmCCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.CfmSeq,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }
          return { success: true, data: resultSheetSave };
        } else {
          if (workingTag === 'A') {
            const errorMessages = [
              {
                IDX_NO: 0,
                Name: 'Sheet',
                result: 'Bạn chưa nhập thông tin sheet',
              },
            ];
            return { success: false, errors: errorMessages };
          } else {
            const xmlDocumentMasterSave =
              await this.generateXmlService.generateXMLSLGInOutReqSaveWEB(
                resultMasterCheck,
              );
            const queryMasterSave = generateQuery(
              xmlDocumentMasterSave,
              '_SLGInOutReqSave_WEB',
            );
            const resultMasterSave =
              await this.databaseService.executeQuery(queryMasterSave);
            const saveMasterStatuses = resultMasterSave.some(
              (item: any) => item.Status !== 0,
            );
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
            const xmlDocumentConfirmCCheck =
              await this.generateXmlService.generateXMLSCOMConfirmDeleteWEB(
                resultMasterCheck,
              );
            const queryConfirmCCheck = generateComfirm(
              xmlDocumentConfirmCCheck,
              '_SCOMConfirmCreate_WEB',
            );
            const resultConfirmCCheck =
              await this.databaseService.executeQuery(queryConfirmCCheck);
            const invalidConfirmCStatuses = resultConfirmCCheck.some(
              (item: any) => item.Status !== 0,
            );
            if (invalidConfirmCStatuses) {
              const errorMessages = resultConfirmCCheck
                .filter((item: any) => item.Status !== 0)
                .map((item: any) => ({
                  IDX_NO: item.IDX_NO,
                  Name: item.CfmSeq,
                  result: item.Result,
                }));
              return { success: false, errors: errorMessages };
            }
            return { success: true, data: resultMasterSave };
          }
        }
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGInOutReqDelete(
    dataMaster: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010004;
    const languageSeq = 6;
    const pgmSeq = 3317;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateComfirm = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2609,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
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
        const xmlDocumentCloseCheck =
          await this.generateXmlService.generateXMLSCOMCloseCheckWEB(
            dataMaster,
            'D',
          );
        const queryCloseCheck = generateClose(
          xmlDocumentCloseCheck,
          '_SCOMCloseCheck_WEB',
        );
        const resultCloseCheck =
          await this.databaseService.executeQuery(queryCloseCheck);
        const invalidCloseStatuses = resultCloseCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidCloseStatuses) {
          const errorMessages = resultCloseCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSLGInOutReqCheckWEB(
            dataMaster,
            'D',
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SLGInOutReqCheck_WEB',
        );
        const resultMasterCheck =
          await this.databaseService.executeQuery(queryMasterCheck);
        const invalidMasterStatuses = resultMasterCheck.some(
          (item: any) => item.Status !== 0,
        );

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

        const xmlDocumentConfirmDCheck =
          await this.generateXmlService.generateXMLSCOMConfirmDeleteWEB(
            resultMasterCheck,
          );
        const queryConfirmDCheck = generateComfirm(
          xmlDocumentConfirmDCheck,
          '_SCOMConfirmDelete_WEB',
        );
        const resultConfirmDCheck =
          await this.databaseService.executeQuery(queryConfirmDCheck);
        const invalidConfirmDStatuses = resultConfirmDCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidConfirmDStatuses) {
          const errorMessages = resultConfirmDCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.CfmSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSLGInOutReqSaveWEB(
            resultMasterCheck,
          );
        const queryMasterSave = generateQuery(
          xmlDocumentMasterSave,
          '_SLGInOutReqSave_WEB',
        );
        const resultMasterSave =
          await this.databaseService.executeQuery(queryMasterSave);
        const saveMasterStatuses = resultMasterSave.some(
          (item: any) => item.Status !== 0,
        );
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
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await deleteResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGInOutReqSheetDelete(
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010004;
    const languageSeq = 6;
    const pgmSeq = 3317;

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

    const deleteSheetResult = async () => {
      try {
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSLGInOutReqItemCheckWEB(
            dataSheetAUD,
          );
        const querySheetCheck = generateQuery(
          xmlDocumentSheetCheck,
          '_SLGInOutReqItemCheck_WEB',
        );
        const resultSheetCheck =
          await this.databaseService.executeQuery(querySheetCheck);
        const invalidSheetStatuses = resultSheetCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidSheetStatuses) {
          const errorMessages = resultSheetCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        const xmlDocumentSheetSave =
          await this.generateXmlService.generateXMLSLGInOutReqItemSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateQuery(
          xmlDocumentSheetSave,
          '_SLGInOutReqItemSave_WEB',
        );
        const resultSheetSave =
          await this.databaseService.executeQuery(querySheetSave);
        const saveSheetStatuses = resultSheetSave.some(
          (item: any) => item.Status !== 0,
        );
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
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await deleteSheetResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  //FrmEtcIn
  async SLGEtcInReqQuery2WEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGEtcInReqQuery2WEB(result);
    const query = `
  EXEC _SLGEtcInReqQuery2_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 60010004,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async SLGEtcInSheetQueryWEB(
    result: number = 0,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGEtcInSheetQueryWEB(result);
    const query = `
  EXEC _SLGInOutDailyItemQuery_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 2931,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async SEtcInQRCheckWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    workingTag: string,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010003;
    const languageSeq = 6;
    const pgmSeq = 3317;

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
        const xmlDocumentCheck =
          await this.generateXmlService.generateXMLSEtcInQRCheckWEB(result);
        const queryCheck = generateQuery(
          xmlDocumentCheck,
          '_SEtcInQRCheck_WEB',
        );
        const resultCheck = await this.databaseService.executeQuery(queryCheck);
        const invalidStatuses = resultCheck.some(
          (item: any) => item.Status !== 0,
        );
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
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      const check = await checkResult();
      return check;
      //return await saveResult(check.data);
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGInOutSave(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2619;
    const languageSeq = 6;
    const pgmSeq = 1365;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateLotMaster = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 4422,
            @WorkingTag = N'LotNoMSave',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateSourceDaily = (xmlDocument: string, procedure: string) => `
        EXEC ${procedure}
          @xmlDocument = N'${xmlDocument}',
          @xmlFlags = ${xmlFlags},
          @ServiceSeq = 3181,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = ${languageSeq},
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

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
        if (dataMaster[0].InOutSeq > 0) {
          workingTag = 'U';
        } else {
          workingTag = 'A';
        }

        const xmlDocumentCloseCheck =
          await this.generateXmlService.generateXMLSCOMCloseItemCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryCloseCheck = generateClose(
          xmlDocumentCloseCheck,
          '_SCOMCloseCheck_WEB',
        );
        const resultCloseCheck =
          await this.databaseService.executeQuery(queryCloseCheck);
        const invalidCloseStatuses = resultCloseCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidCloseStatuses) {
          const errorMessages = resultCloseCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSLGInOutDailyCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SLGInOutDailyCheck_WEB',
        );
        const resultMasterCheck =
          await this.databaseService.executeQuery(queryMasterCheck);
        const invalidMasterStatuses = resultMasterCheck.some(
          (item: any) => item.Status !== 0,
        );

        if (invalidMasterStatuses) {
          const errorMessages = resultMasterCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.InOutNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        if (dataSheetAUD.length > 0) {
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              InOutSeq:
                item.InOutSeq === '0'
                  ? resultMasterCheck[0].InOutSeq
                  : item.InOutSeq,
              InWHSeq: resultMasterCheck[0].InWHSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSLGInOutDailyItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SLGInOutDailyItemCheck_WEB',
          );
          const resultSheetCheck =
            await this.databaseService.executeQuery(querySheetCheck);
          const invalidSheetStatuses = resultSheetCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidSheetStatuses) {
            const errorMessages = resultSheetCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentLotMasterCheck =
            await this.generateXmlService.generateXMLSLGLotNoMasterCheckWEB(
              dataSheetAUDUpdate,
            );
          const queryLotMasterCheck = generateLotMaster(
            xmlDocumentLotMasterCheck,
            '_SLGLotNoMasterCheck_WEB',
          );
          const resultLotMasterCheck =
            await this.databaseService.executeQuery(queryLotMasterCheck);
          const invalidLotMasterStatuses = resultLotMasterCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidLotMasterStatuses) {
            const errorMessages = resultLotMasterCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.LotNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentLotMasterSave =
            await this.generateXmlService.generateXMLSLGLotNoMasterSaveWEB(
              resultLotMasterCheck,
            );
          const queryLotMasterSave = generateLotMaster(
            xmlDocumentLotMasterSave,
            '_SLGLotNoMasterSave_WEB',
          );
          const resultLotMasterSave =
            await this.databaseService.executeQuery(queryLotMasterSave);
          const saveLotMasterStatuses = resultLotMasterSave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveLotMasterStatuses) {
            const errorMessages = resultLotMasterSave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.LotNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSLGInOutDailySaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SLGInOutDailySave_WEB',
          );
          const resultMasterSave =
            await this.databaseService.executeQuery(queryMasterSave);
          const saveMasterStatuses = resultMasterSave.some(
            (item: any) => item.Status !== 0,
          );
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

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSLGInOutDailyItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SLGInOutDailyItemSaveIn_WEB',
          );
          const resultSheetSave =
            await this.databaseService.executeQuery(querySheetSave);
          const saveSheetStatuses = resultSheetSave.some(
            (item: any) => item.Status !== 0,
          );
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
          const dataSheetAUDUpdateSerl = dataSheetAUDUpdate.map((item) => {
            const matchingResult = resultSheetCheck.find(
              (data) => data.IDX_NO === item.IdxNo,
            );
            return {
              ...item,
              InOutSerl: matchingResult
                ? matchingResult.InOutSerl
                : item.InOutSerl,
            };
          });

          const xmlDocumentSourceDailySave =
            await this.generateXmlService.generateXMLSCOMSourceDailySaveWEB(
              dataSheetAUDUpdateSerl,
            );
          const querySourceDailySave = generateSourceDaily(
            xmlDocumentSourceDailySave,
            '_SCOMSourceDailySave_WEB',
          );
          const resultSourceDailySave =
            await this.databaseService.executeQuery(querySourceDailySave);
          const saveSourceDailyStatuses = resultSourceDailySave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveSourceDailyStatuses) {
            const errorMessages = resultSourceDailySave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const dataResultSheetSave = resultSheetSave.map((item) => {
            const matchingResult = dataSheetAUDUpdate.find(
              (data) => data.IdxNo === item.IDX_NO,
            );
            return {
              ...item,
              InOutNo: resultMasterSave[0].InOutNo,
              ReqSeq: matchingResult ? matchingResult.ReqSeq : item.ReqSeq,
              ReqSerl: matchingResult ? matchingResult.ReqSerl : item.ReqSerl,
              ReqQty: matchingResult ? matchingResult.ReqQty : item.ReqQty,
              CreateDate: matchingResult
                ? matchingResult.CreateDate
                : item.CreateDate,
              RegDate: matchingResult ? matchingResult.RegDate : item.RegDate,
            };
          });

          return { success: true, data: dataResultSheetSave };
        } else {
          if (workingTag === 'A') {
            const errorMessages = [
              {
                IDX_NO: 0,
                Name: 'Sheet',
                result: 'Bạn chưa nhập thông tin sheet',
              },
            ];
            return { success: false, errors: errorMessages };
          } else {
            const xmlDocumentMasterSave =
              await this.generateXmlService.generateXMLSLGInOutDailySaveWEB(
                resultMasterCheck,
              );
            const queryMasterSave = generateQuery(
              xmlDocumentMasterSave,
              '_SLGInOutDailySave_WEB',
            );
            const resultMasterSave =
              await this.databaseService.executeQuery(queryMasterSave);
            const saveMasterStatuses = resultMasterSave.some(
              (item: any) => item.Status !== 0,
            );
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
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGInOutSheetDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2619;
    const languageSeq = 6;
    const pgmSeq = 1365;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateLotMaster = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 4422,
            @WorkingTag = N'LotNoMSave',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateSourceDaily = (xmlDocument: string, procedure: string) => `
        EXEC ${procedure}
          @xmlDocument = N'${xmlDocument}',
          @xmlFlags = ${xmlFlags},
          @ServiceSeq = 3181,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = ${languageSeq},
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

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
        workingTag = 'U';

        const xmlDocumentCloseCheck =
          await this.generateXmlService.generateXMLSCOMCloseItemCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryCloseCheck = generateClose(
          xmlDocumentCloseCheck,
          '_SCOMCloseCheck_WEB',
        );
        const resultCloseCheck =
          await this.databaseService.executeQuery(queryCloseCheck);
        const invalidCloseStatuses = resultCloseCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidCloseStatuses) {
          const errorMessages = resultCloseCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSLGInOutDailyCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SLGInOutDailyCheck_WEB',
        );
        const resultMasterCheck =
          await this.databaseService.executeQuery(queryMasterCheck);
        const invalidMasterStatuses = resultMasterCheck.some(
          (item: any) => item.Status !== 0,
        );

        if (invalidMasterStatuses) {
          const errorMessages = resultMasterCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.InOutNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        if (dataSheetAUD.length > 0) {
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              InOutSeq:
                item.InOutSeq === '0'
                  ? resultMasterCheck[0].InOutSeq
                  : item.InOutSeq,
              InWHSeq: resultMasterCheck[0].InWHSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSLGInOutDailyItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SLGInOutDailyItemCheck_WEB',
          );
          const resultSheetCheck =
            await this.databaseService.executeQuery(querySheetCheck);
          const invalidSheetStatuses = resultSheetCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidSheetStatuses) {
            const errorMessages = resultSheetCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          // const xmlDocumentLotMasterCheck = await this.generateXmlService.generateXMLSLGLotNoMasterCheckWEB(dataSheetAUDUpdate);
          // const queryLotMasterCheck = generateLotMaster(xmlDocumentLotMasterCheck, '_SLGLotNoMasterCheck_WEB');
          // const resultLotMasterCheck = await this.databaseService.executeQuery(queryLotMasterCheck);
          // const invalidLotMasterStatuses = resultLotMasterCheck.some((item: any) => item.Status !== 0);
          // if (invalidLotMasterStatuses) {
          //     const errorMessages = resultLotMasterCheck
          //         .filter((item: any) => item.Status !== 0)
          //         .map((item: any) => ({
          //             IDX_NO: item.IDX_NO,
          //             Name: item.LotNo,
          //             result: item.Result,
          //         }));
          //     return { success: false, errors: errorMessages };
          // }

          const xmlDocumentLotMasterSave =
            await this.generateXmlService.generateXMLSLGLotNoMasterDeleteWEB(
              dataSheetAUDUpdate,
            );
          const queryLotMasterSave = generateLotMaster(
            xmlDocumentLotMasterSave,
            '_SLGLotNoMasterSave_WEB',
          );
          const resultLotMasterSave =
            await this.databaseService.executeQuery(queryLotMasterSave);
          const saveLotMasterStatuses = resultLotMasterSave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveLotMasterStatuses) {
            const errorMessages = resultLotMasterSave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.LotNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSLGInOutDailySaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SLGInOutDailySave_WEB',
          );
          const resultMasterSave =
            await this.databaseService.executeQuery(queryMasterSave);
          const saveMasterStatuses = resultMasterSave.some(
            (item: any) => item.Status !== 0,
          );
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

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSLGInOutDailyItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SLGInOutDailyItemSaveIn_WEB',
          );
          const resultSheetSave =
            await this.databaseService.executeQuery(querySheetSave);
          const saveSheetStatuses = resultSheetSave.some(
            (item: any) => item.Status !== 0,
          );
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
          const dataSheetAUDUpdateSerl = dataSheetAUDUpdate.map((item) => {
            const matchingResult = resultSheetCheck.find(
              (data) => data.IDX_NO === item.IdxNo,
            );
            return {
              ...item,
              InOutSerl: matchingResult
                ? matchingResult.InOutSerl
                : item.InOutSerl,
            };
          });

          const xmlDocumentSourceDailySave =
            await this.generateXmlService.generateXMLSCOMSourceDailySaveWEB(
              dataSheetAUDUpdateSerl,
            );
          const querySourceDailySave = generateSourceDaily(
            xmlDocumentSourceDailySave,
            '_SCOMSourceDailySave_WEB',
          );
          const resultSourceDailySave =
            await this.databaseService.executeQuery(querySourceDailySave);
          const saveSourceDailyStatuses = resultSourceDailySave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveSourceDailyStatuses) {
            const errorMessages = resultSourceDailySave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const dataResultSheetSave = resultSheetSave.map((item) => {
            return {
              ...item,
              InOutNo: resultMasterSave[0].InOutNo,
            };
          });

          return { success: true, data: dataResultSheetSave };
        } else {
          const errorMessages = [
            {
              IDX_NO: 0,
              Name: 'Sheet',
              result: 'Bạn chưa chọn dòng để xóa!',
            },
          ];
          return { success: false, errors: errorMessages };
        }
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGInOutMasterDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2619;
    const languageSeq = 6;
    const pgmSeq = 1365;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateLotMaster = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 4422,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateSourceDaily = (xmlDocument: string, procedure: string) => `
        EXEC ${procedure}
          @xmlDocument = N'${xmlDocument}',
          @xmlFlags = ${xmlFlags},
          @ServiceSeq = 3181,
          @WorkingTag = N'D',
          @CompanySeq = ${companySeq},
          @LanguageSeq = ${languageSeq},
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

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
        let workingTag: string;
        workingTag = 'D';

        const xmlDocumentCloseCheck =
          await this.generateXmlService.generateXMLSCOMCloseItemCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryCloseCheck = generateClose(
          xmlDocumentCloseCheck,
          '_SCOMCloseCheck_WEB',
        );
        const resultCloseCheck =
          await this.databaseService.executeQuery(queryCloseCheck);
        const invalidCloseStatuses = resultCloseCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidCloseStatuses) {
          const errorMessages = resultCloseCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSLGInOutDailyCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SLGInOutDailyCheck_WEB',
        );
        const resultMasterCheck =
          await this.databaseService.executeQuery(queryMasterCheck);
        const invalidMasterStatuses = resultMasterCheck.some(
          (item: any) => item.Status !== 0,
        );

        if (invalidMasterStatuses) {
          const errorMessages = resultMasterCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.InOutNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        if (dataSheetAUD.length > 0) {
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              InOutSeq:
                item.InOutSeq === '0'
                  ? resultMasterCheck[0].InOutSeq
                  : item.InOutSeq,
              InWHSeq: resultMasterCheck[0].InWHSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSLGInOutDailyItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SLGInOutDailyItemCheck_WEB',
          );
          const resultSheetCheck =
            await this.databaseService.executeQuery(querySheetCheck);
          const invalidSheetStatuses = resultSheetCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidSheetStatuses) {
            const errorMessages = resultSheetCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          // const xmlDocumentLotMasterCheck = await this.generateXmlService.generateXMLSLGLotNoMasterCheckWEB(dataSheetAUDUpdate);
          // const queryLotMasterCheck = generateLotMaster(xmlDocumentLotMasterCheck, '_SLGLotNoMasterCheck_WEB');
          // const resultLotMasterCheck = await this.databaseService.executeQuery(queryLotMasterCheck);
          // const invalidLotMasterStatuses = resultLotMasterCheck.some((item: any) => item.Status !== 0);
          // if (invalidLotMasterStatuses) {
          //     const errorMessages = resultLotMasterCheck
          //         .filter((item: any) => item.Status !== 0)
          //         .map((item: any) => ({
          //             IDX_NO: item.IDX_NO,
          //             Name: item.LotNo,
          //             result: item.Result,
          //         }));
          //     return { success: false, errors: errorMessages };
          // }

          const xmlDocumentLotMasterSave =
            await this.generateXmlService.generateXMLSLGLotNoMasterDeleteWEB(
              dataSheetAUDUpdate,
            );
          const queryLotMasterSave = generateLotMaster(
            xmlDocumentLotMasterSave,
            '_SLGLotNoMasterSave_WEB',
          );
          const resultLotMasterSave =
            await this.databaseService.executeQuery(queryLotMasterSave);
          const saveLotMasterStatuses = resultLotMasterSave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveLotMasterStatuses) {
            const errorMessages = resultLotMasterSave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.LotNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSLGInOutDailySaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SLGInOutDailySave_WEB',
          );
          const resultMasterSave =
            await this.databaseService.executeQuery(queryMasterSave);
          const saveMasterStatuses = resultMasterSave.some(
            (item: any) => item.Status !== 0,
          );
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

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSLGInOutDailyItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SLGInOutDailyItemSaveIn_WEB',
          );
          const resultSheetSave =
            await this.databaseService.executeQuery(querySheetSave);
          const saveSheetStatuses = resultSheetSave.some(
            (item: any) => item.Status !== 0,
          );
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
          const dataSheetAUDUpdateSerl = dataSheetAUDUpdate.map((item) => {
            const matchingResult = resultSheetCheck.find(
              (data) => data.IDX_NO === item.IdxNo,
            );
            return {
              ...item,
              InOutSerl: matchingResult
                ? matchingResult.InOutSerl
                : item.InOutSerl,
            };
          });

          const xmlDocumentSourceDailySave =
            await this.generateXmlService.generateXMLSCOMSourceDailySaveWEB(
              dataSheetAUDUpdateSerl,
            );
          const querySourceDailySave = generateSourceDaily(
            xmlDocumentSourceDailySave,
            '_SCOMSourceDailySave_WEB',
          );
          const resultSourceDailySave =
            await this.databaseService.executeQuery(querySourceDailySave);
          const saveSourceDailyStatuses = resultSourceDailySave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveSourceDailyStatuses) {
            const errorMessages = resultSourceDailySave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const dataResultSheetSave = resultSheetSave.map((item) => {
            return {
              ...item,
              InOutNo: resultMasterSave[0].InOutNo,
            };
          });

          return { success: true, data: dataResultSheetSave };
        } else {
          const errorMessages = [
            {
              IDX_NO: 0,
              Name: 'Sheet',
              result: 'Bạn chưa chọn dòng để xóa!',
            },
          ];
          return { success: false, errors: errorMessages };
        }
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }
  //TP Begin
  async SLGInOutTPItemQueryWEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGInOutTPItemQueryWEB(result);
    const query = `
      EXEC _SLGInOutDailyItemQueryTP_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2619,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async SLGInOutTPQueryWEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGInOutTPQueryWEB(result);
    const query = `
      EXEC _SLGInOutDailyQueryTP_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2619,
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
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async SLGInOutTPSave(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2619;
    const languageSeq = 6;
    const pgmSeq = 1365;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateSourceDaily = (xmlDocument: string, procedure: string) => `
        EXEC ${procedure}
          @xmlDocument = N'${xmlDocument}',
          @xmlFlags = ${xmlFlags},
          @ServiceSeq = 3181,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = ${languageSeq},
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

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
        if (dataMaster[0].InOutSeq > 0) {
          workingTag = 'U';
        } else {
          workingTag = 'A';
        }

        const xmlDocumentCloseCheck =
          await this.generateXmlService.generateXMLSCOMCloseItemCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryCloseCheck = generateClose(
          xmlDocumentCloseCheck,
          '_SCOMCloseCheck_WEB',
        );
        const resultCloseCheck =
          await this.databaseService.executeQuery(queryCloseCheck);
        const invalidCloseStatuses = resultCloseCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidCloseStatuses) {
          const errorMessages = resultCloseCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSLGInOutDailyCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SLGInOutDailyCheck_WEB',
        );
        const resultMasterCheck =
          await this.databaseService.executeQuery(queryMasterCheck);
        const invalidMasterStatuses = resultMasterCheck.some(
          (item: any) => item.Status !== 0,
        );

        if (invalidMasterStatuses) {
          const errorMessages = resultMasterCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.InOutNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        if (dataSheetAUD.length > 0) {
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              InOutSeq:
                item.InOutSeq === '0'
                  ? resultMasterCheck[0].InOutSeq
                  : resultMasterCheck[0].InOutSeq,
              InWHSeq: resultMasterCheck[0].InWHSeq,
              InOutType: resultMasterCheck[0].InOutType,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSLGInOutDailyItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SLGInOutDailyItemCheck_WEB',
          );
          const resultSheetCheck =
            await this.databaseService.executeQuery(querySheetCheck);
          const invalidSheetStatuses = resultSheetCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidSheetStatuses) {
            const errorMessages = resultSheetCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSLGInOutDailySaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SLGInOutDailySave_WEB',
          );
          const resultMasterSave =
            await this.databaseService.executeQuery(queryMasterSave);
          const saveMasterStatuses = resultMasterSave.some(
            (item: any) => item.Status !== 0,
          );
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

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSLGInOutDailyItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SLGInOutDailyItemSaveIn_WEB',
          );
          const resultSheetSave =
            await this.databaseService.executeQuery(querySheetSave);
          const saveSheetStatuses = resultSheetSave.some(
            (item: any) => item.Status !== 0,
          );
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
          const dataSheetAUDUpdateSerl = dataSheetAUDUpdate.map((item) => {
            const matchingResult = resultSheetCheck.find(
              (data) => data.IDX_NO === item.IdxNo,
            );
            return {
              ...item,
              InOutSerl: matchingResult
                ? matchingResult.InOutSerl
                : item.InOutSerl,
            };
          });

          const xmlDocumentSourceDailySave =
            await this.generateXmlService.generateXMLSCOMSourceDailySaveWEB(
              dataSheetAUDUpdateSerl,
            );
          const querySourceDailySave = generateSourceDaily(
            xmlDocumentSourceDailySave,
            '_SCOMSourceDailySave_WEB',
          );
          const resultSourceDailySave =
            await this.databaseService.executeQuery(querySourceDailySave);
          const saveSourceDailyStatuses = resultSourceDailySave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveSourceDailyStatuses) {
            const errorMessages = resultSourceDailySave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const dataResultSheetSave = resultSheetSave.map((item) => {
            const matchingResult = dataSheetAUDUpdate.find(
              (data) => data.IdxNo === item.IDX_NO,
            );
            return {
              ...item,
              InOutNo: resultMasterSave[0].InOutNo,
              ReqSeq: matchingResult ? matchingResult.ReqSeq : item.ReqSeq,
              ReqSerl: matchingResult ? matchingResult.ReqSerl : item.ReqSerl,
              ReqQty: matchingResult ? matchingResult.ReqQty : item.ReqQty,
              CreateDate: matchingResult
                ? matchingResult.CreateDate
                : item.CreateDate,
              RegDate: matchingResult ? matchingResult.RegDate : item.RegDate,
            };
          });

          return { success: true, data: dataResultSheetSave };
        } else {
          if (workingTag === 'A') {
            const errorMessages = [
              {
                IDX_NO: 0,
                Name: 'Sheet',
                result: 'Bạn chưa nhập thông tin sheet',
              },
            ];
            return { success: false, errors: errorMessages };
          } else {
            const xmlDocumentMasterSave =
              await this.generateXmlService.generateXMLSLGInOutDailySaveWEB(
                resultMasterCheck,
              );
            const queryMasterSave = generateQuery(
              xmlDocumentMasterSave,
              '_SLGInOutDailySave_WEB',
            );
            const resultMasterSave =
              await this.databaseService.executeQuery(queryMasterSave);
            const saveMasterStatuses = resultMasterSave.some(
              (item: any) => item.Status !== 0,
            );
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
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGInOutTPSheetDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2619;
    const languageSeq = 6;
    const pgmSeq = 1365;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateSourceDaily = (xmlDocument: string, procedure: string) => `
        EXEC ${procedure}
          @xmlDocument = N'${xmlDocument}',
          @xmlFlags = ${xmlFlags},
          @ServiceSeq = 3181,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = ${languageSeq},
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

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
        workingTag = 'U';

        const xmlDocumentCloseCheck =
          await this.generateXmlService.generateXMLSCOMCloseItemCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryCloseCheck = generateClose(
          xmlDocumentCloseCheck,
          '_SCOMCloseCheck_WEB',
        );
        const resultCloseCheck =
          await this.databaseService.executeQuery(queryCloseCheck);
        const invalidCloseStatuses = resultCloseCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidCloseStatuses) {
          const errorMessages = resultCloseCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSLGInOutDailyCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SLGInOutDailyCheck_WEB',
        );
        const resultMasterCheck =
          await this.databaseService.executeQuery(queryMasterCheck);
        const invalidMasterStatuses = resultMasterCheck.some(
          (item: any) => item.Status !== 0,
        );

        if (invalidMasterStatuses) {
          const errorMessages = resultMasterCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.InOutNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        if (dataSheetAUD.length > 0) {
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              InOutSeq:
                item.InOutSeq === '0'
                  ? resultMasterCheck[0].InOutSeq
                  : item.InOutSeq,
              InWHSeq: resultMasterCheck[0].InWHSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSLGInOutDailyItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SLGInOutDailyItemCheck_WEB',
          );
          const resultSheetCheck =
            await this.databaseService.executeQuery(querySheetCheck);
          const invalidSheetStatuses = resultSheetCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidSheetStatuses) {
            const errorMessages = resultSheetCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSLGInOutDailySaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SLGInOutDailySave_WEB',
          );
          const resultMasterSave =
            await this.databaseService.executeQuery(queryMasterSave);
          const saveMasterStatuses = resultMasterSave.some(
            (item: any) => item.Status !== 0,
          );
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

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSLGInOutDailyItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SLGInOutDailyItemSaveIn_WEB',
          );
          const resultSheetSave =
            await this.databaseService.executeQuery(querySheetSave);
          const saveSheetStatuses = resultSheetSave.some(
            (item: any) => item.Status !== 0,
          );
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
          const dataSheetAUDUpdateSerl = dataSheetAUDUpdate.map((item) => {
            const matchingResult = resultSheetCheck.find(
              (data) => data.IDX_NO === item.IdxNo,
            );
            return {
              ...item,
              InOutSerl: matchingResult
                ? matchingResult.InOutSerl
                : item.InOutSerl,
            };
          });

          const xmlDocumentSourceDailySave =
            await this.generateXmlService.generateXMLSCOMSourceDailySaveWEB(
              dataSheetAUDUpdateSerl,
            );
          const querySourceDailySave = generateSourceDaily(
            xmlDocumentSourceDailySave,
            '_SCOMSourceDailySave_WEB',
          );
          const resultSourceDailySave =
            await this.databaseService.executeQuery(querySourceDailySave);
          const saveSourceDailyStatuses = resultSourceDailySave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveSourceDailyStatuses) {
            const errorMessages = resultSourceDailySave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const dataResultSheetSave = resultSheetSave.map((item) => {
            return {
              ...item,
              InOutNo: resultMasterSave[0].InOutNo,
            };
          });

          return { success: true, data: dataResultSheetSave };
        } else {
          const errorMessages = [
            {
              IDX_NO: 0,
              Name: 'Sheet',
              result: 'Bạn chưa chọn dòng để xóa!',
            },
          ];
          return { success: false, errors: errorMessages };
        }
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGInOutTPMasterDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2619;
    const languageSeq = 6;
    const pgmSeq = 1365;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

    const generateSourceDaily = (xmlDocument: string, procedure: string) => `
        EXEC ${procedure}
          @xmlDocument = N'${xmlDocument}',
          @xmlFlags = ${xmlFlags},
          @ServiceSeq = 3181,
          @WorkingTag = N'D',
          @CompanySeq = ${companySeq},
          @LanguageSeq = ${languageSeq},
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

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
        let workingTag: string;
        workingTag = 'D';

        const xmlDocumentCloseCheck =
          await this.generateXmlService.generateXMLSCOMCloseItemCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryCloseCheck = generateClose(
          xmlDocumentCloseCheck,
          '_SCOMCloseCheck_WEB',
        );
        const resultCloseCheck =
          await this.databaseService.executeQuery(queryCloseCheck);
        const invalidCloseStatuses = resultCloseCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidCloseStatuses) {
          const errorMessages = resultCloseCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ReqNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSLGInOutDailyCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SLGInOutDailyCheck_WEB',
        );
        const resultMasterCheck =
          await this.databaseService.executeQuery(queryMasterCheck);
        const invalidMasterStatuses = resultMasterCheck.some(
          (item: any) => item.Status !== 0,
        );

        if (invalidMasterStatuses) {
          const errorMessages = resultMasterCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.InOutNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        if (dataSheetAUD.length > 0) {
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              InOutSeq:
                item.InOutSeq === '0'
                  ? resultMasterCheck[0].InOutSeq
                  : resultMasterCheck[0].InOutSeq,
              InWHSeq: resultMasterCheck[0].InWHSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSLGInOutDailyItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SLGInOutDailyItemCheck_WEB',
          );
          const resultSheetCheck =
            await this.databaseService.executeQuery(querySheetCheck);
          const invalidSheetStatuses = resultSheetCheck.some(
            (item: any) => item.Status !== 0,
          );
          if (invalidSheetStatuses) {
            const errorMessages = resultSheetCheck
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSLGInOutDailySaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SLGInOutDailySave_WEB',
          );
          const resultMasterSave =
            await this.databaseService.executeQuery(queryMasterSave);
          const saveMasterStatuses = resultMasterSave.some(
            (item: any) => item.Status !== 0,
          );
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

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSLGInOutDailyItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SLGInOutDailyItemSaveIn_WEB',
          );
          const resultSheetSave =
            await this.databaseService.executeQuery(querySheetSave);
          const saveSheetStatuses = resultSheetSave.some(
            (item: any) => item.Status !== 0,
          );
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
          const dataSheetAUDUpdateSerl = dataSheetAUDUpdate.map((item) => {
            const matchingResult = resultSheetCheck.find(
              (data) => data.IDX_NO === item.IdxNo,
            );
            return {
              ...item,
              InOutSerl: matchingResult
                ? matchingResult.InOutSerl
                : item.InOutSerl,
            };
          });

          const xmlDocumentSourceDailySave =
            await this.generateXmlService.generateXMLSCOMSourceDailySaveWEB(
              dataSheetAUDUpdateSerl,
            );
          const querySourceDailySave = generateSourceDaily(
            xmlDocumentSourceDailySave,
            '_SCOMSourceDailySave_WEB',
          );
          const resultSourceDailySave =
            await this.databaseService.executeQuery(querySourceDailySave);
          const saveSourceDailyStatuses = resultSourceDailySave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveSourceDailyStatuses) {
            const errorMessages = resultSourceDailySave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.InOutNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const dataResultSheetSave = resultSheetSave.map((item) => {
            return {
              ...item,
              InOutNo: resultMasterSave[0].InOutNo,
            };
          });

          return { success: true, data: dataResultSheetSave };
        } else {
          const errorMessages = [
            {
              IDX_NO: 0,
              Name: 'Sheet',
              result: 'Bạn chưa chọn dòng để xóa!',
            },
          ];
          return { success: false, errors: errorMessages };
        }
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }
}
