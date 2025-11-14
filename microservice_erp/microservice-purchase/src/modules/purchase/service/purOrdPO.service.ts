import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

@Injectable()
export class PurOrdPOService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  async SPUORDPOMasterQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUORDPOMasterQueryWEB(result);
    const query = `
  EXEC _SPUORDPOQuery_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 1518325,
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

  async SPUORDPOSheetQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUORDPOSheetQueryWEB(result);
    const query = `
  EXEC _SPUORDPOItemQuery_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 1518325,
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

  async SPUORDPOMasterLinkQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUORDPOMasterLinkQueryWEB(
        result,
      );
    const query = `
  EXEC _SPUORDPOQueryLink_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 2656,
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

  async SPUORDPOSheetLinkQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUORDPOSheetLinkQueryWEB(
        result,
      );
    const query = `
  EXEC _SPUORDPOItemQueryLink_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 2656,
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

  async SOrdPOSave(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2656;
    const languageSeq = 6;
    const pgmSeq = 1131;

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
    const saveResult = async () => {
      try {
        let workingTag: string;
        if (dataMaster[0].POSeq > 0) {
          workingTag = 'U';
        } else {
          workingTag = 'A';
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUORDPOCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUORDPOCheck_WEB',
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
              Name: item.PONo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentConfirmDCheck =
          await this.generateXmlService.generateXMLSCOMConfirmDeleteWEBPO(
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
          console.log('dataSheetAUD', dataSheetAUD);
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              POSeq:
                item.POSeq === '0' ? resultMasterCheck[0].POSeq : item.POSeq,
              WHSeq: dataMaster[0].WHSeq,
              WHName: dataMaster[0].WHName,
            };
          });
          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSPUORDPOItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SPUORDPOItemCheck_WEB',
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
                Name: item.POSeq,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSPUORDPOSaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SPUORDPOSave_WEB',
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
                Name: item.POSeq,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSPUORDPOItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SPUORDPOItemSave_WEB',
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
                Name: item.POSeq,
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
              POSerl: matchingResult ? matchingResult.POSerl : item.POSerl,
            };
          });
          const xmlDocumentSourceDailySave =
            await this.generateXmlService.generateXMLSCOMSourceDailySaveWEBPO(
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
                Name: item.ToSeq,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentConfirmCCheck =
            await this.generateXmlService.generateXMLSCOMConfirmDeleteWEBPO(
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
          const resultSheetSaveUpdate = resultSheetSave.map((item) => {
            const matchingDataSheet = dataSheetAUDUpdate.find(
              (data) => data.IdxNo === item.IDX_NO,
            );
            return {
              ...item,
              PONo: resultMasterSave[0].PONo,
              ApprovalReqQty: matchingDataSheet
                ? matchingDataSheet.ApprovalReqQty
                : item.ApprovalReqQty,
              ApprovalReqCurAmt: matchingDataSheet
                ? matchingDataSheet.ApprovalReqCurAmt
                : item.ApprovalReqCurAmt,
              ApproReqSeq: matchingDataSheet
                ? matchingDataSheet.ApproReqSeq
                : item.ApproReqSeq,
              ApproReqSerl: matchingDataSheet
                ? matchingDataSheet.ApproReqSerl
                : item.ApproReqSerl,
            };
          });
          return { success: true, data: resultSheetSaveUpdate };
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
              await this.generateXmlService.generateXMLSPUORDPOSaveWEB(
                resultMasterCheck,
              );
            const queryMasterSave = generateQuery(
              xmlDocumentMasterSave,
              '_SPUORDPOSave_WEB',
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
                  Name: item.POSeq,
                  result: item.Result,
                }));
              return { success: false, errors: errorMessages };
            }
            const xmlDocumentConfirmCCheck =
              await this.generateXmlService.generateXMLSCOMConfirmDeleteWEBPO(
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

  async SOrdPODelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2656;
    const languageSeq = 6;
    const pgmSeq = 1131;

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

    const saveResult = async () => {
      try {
        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUORDPOCheckWEB(
            dataMaster,
            'D',
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUORDPOCheck_WEB',
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
              Name: item.PONo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentConfirmDCheck =
          await this.generateXmlService.generateXMLSCOMConfirmDeleteWEBPO(
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
        const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
          return {
            ...item,
            POSeq: item.POSeq === '' ? resultMasterCheck[0].POSeq : item.POSeq,
            WHSeq: dataMaster[0].WHSeq,
            WHName: dataMaster[0].WHName,
          };
        });
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSPUORDPOItemCheckWEB(
            dataSheetAUDUpdate,
          );
        const querySheetCheck = generateQuery(
          xmlDocumentSheetCheck,
          '_SPUORDPOItemCheck_WEB',
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
              Name: item.POSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSPUORDPOSaveWEB(
            resultMasterCheck,
          );
        const queryMasterSave = generateQuery(
          xmlDocumentMasterSave,
          '_SPUORDPOSave_WEB',
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
              Name: item.POSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentSheetSave =
          await this.generateXmlService.generateXMLSPUORDPOItemSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateQuery(
          xmlDocumentSheetSave,
          '_SPUORDPOItemSave_WEB',
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
              Name: item.POSeq,
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
            POSerl: matchingResult ? matchingResult.POSerl : item.POSerl,
          };
        });
        const xmlDocumentSourceDailySave =
          await this.generateXmlService.generateXMLSCOMSourceDailySaveWEBPO(
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
              Name: item.ToSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentConfirmCCheck =
          await this.generateXmlService.generateXMLSCOMConfirmDeleteWEBPO(
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
        const resultSheetSaveUpdate = resultSheetSave.map((item) => {
          return {
            ...item,
            PONo: resultMasterSave[0].PONo,
          };
        });
        return { success: true, data: resultSheetSaveUpdate };
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

  async SOrdPOSheetDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2656;
    const languageSeq = 6;
    const pgmSeq = 1131;

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

    const saveResult = async () => {
      try {
        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUORDPOCheckWEB(
            dataMaster,
            'U',
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUORDPOCheck_WEB',
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
              Name: item.PONo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentConfirmDCheck =
          await this.generateXmlService.generateXMLSCOMConfirmDeleteWEBPO(
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
        const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
          return {
            ...item,
            POSeq: item.POSeq === '' ? resultMasterCheck[0].POSeq : item.POSeq,
            WHSeq: dataMaster[0].WHSeq,
            WHName: dataMaster[0].WHName,
          };
        });
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSPUORDPOItemCheckWEB(
            dataSheetAUDUpdate,
          );
        const querySheetCheck = generateQuery(
          xmlDocumentSheetCheck,
          '_SPUORDPOItemCheck_WEB',
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
              Name: item.POSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSPUORDPOSaveWEB(
            resultMasterCheck,
          );
        const queryMasterSave = generateQuery(
          xmlDocumentMasterSave,
          '_SPUORDPOSave_WEB',
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
              Name: item.POSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentSheetSave =
          await this.generateXmlService.generateXMLSPUORDPOItemSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateQuery(
          xmlDocumentSheetSave,
          '_SPUORDPOItemSave_WEB',
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
              Name: item.POSeq,
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
            POSerl: matchingResult ? matchingResult.POSerl : item.POSerl,
          };
        });
        const xmlDocumentSourceDailySave =
          await this.generateXmlService.generateXMLSCOMSourceDailySaveWEBPO(
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
              Name: item.ToSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentConfirmCCheck =
          await this.generateXmlService.generateXMLSCOMConfirmDeleteWEBPO(
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
        const resultSheetSaveUpdate = resultSheetSave.map((item) => {
          return {
            ...item,
            PONo: resultMasterSave[0].PONo,
          };
        });
        return { success: true, data: resultSheetSaveUpdate };
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
