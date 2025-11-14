import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlPurchaseService } from '../generate-xml/generate-xml-purchase.service';

@Injectable()
export class PurDelvService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlPurchaseService,
  ) {}

  async SPUDelvMasterQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUDelvMasterQueryWEB(result);
    const query = `
  EXEC _SPUORDDelvQuery_WEB
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

  async SPUDelvSheetQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUDelvSheetQueryWEB(result);
    const query = `
  EXEC _SPUORDDelvItemQuery_WEB
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

  async SPUDelvMasterLinkQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUDelvMasterLinkQueryWEB(
        result,
      );
    const query = `
  EXEC _SPUDelvQueryLink_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 2548,
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

  async SPUDelvSheetLinkQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUDelvSheetLinkQueryWEB(result);
    const query = `
  EXEC _SPUDelvItemQueryLink_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 2548,
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

  async SDelvSave(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2548;
    const languageSeq = 6;
    const pgmSeq = 1134;

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

    const generateInOutBatch = (xmlDocument: string, procedure: string) => `
      EXEC ${procedure}
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = ${xmlFlags},
        @ServiceSeq = 2619,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = ${languageSeq},
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    const saveResult = async () => {
      try {
        let workingTag: string;
        if (dataMaster[0].DelvSeq > 0) {
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
              Name: item.Date,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUDelvCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUDelvCheck_WEB',
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
              Name: item.DelvNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        if (dataSheetAUD.length > 0) {
          const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
            return {
              ...item,
              DelvSeq:
                item.DelvSeq === '0'
                  ? resultMasterCheck[0].DelvSeq
                  : item.DelvSeq,
              WHSeq: dataMaster[0].WHSeq,
              WHName: dataMaster[0].WHName,
              BizUnit: resultMasterCheck[0].BizUnit,
              DelvDate: resultMasterCheck[0].DelvDate,
              DelvNo: resultMasterCheck[0].DelvNo,
            };
          });
          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSPUDelvItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SPUDelvItemCheck_WEB',
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
                Name: item.DelvSeq,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSPUDelvSaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SPUDelvSave_WEB',
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
                Name: item.DelvSeq,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSPUDelvItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SPUDelvItemSave_WEB',
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
                Name: item.DelvSeq,
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
              DelvSerl: matchingResult
                ? matchingResult.DelvSerl
                : item.DelvSerl,
            };
          });
          const xmlDocumentSourceDailySave =
            await this.generateXmlService.generateXMLSCOMSourceDailySaveWEBDelv(
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

          const xmlDocumentDailyBatchSave =
            await this.generateXmlService.generateXMLSLGInOutDailyBatchWEB(
              resultMasterSave,
            );
          const queryDailyBatchSave = generateInOutBatch(
            xmlDocumentDailyBatchSave,
            '_SLGInOutDailyBatch_WEB',
          );
          const resultDailyBatchSave =
            await this.databaseService.executeQuery(queryDailyBatchSave);
          const saveDailyBatchStatuses = resultDailyBatchSave.some(
            (item: any) => item.Status !== 0,
          );
          if (saveDailyBatchStatuses) {
            const errorMessages = resultDailyBatchSave
              .filter((item: any) => item.Status !== 0)
              .map((item: any) => ({
                IDX_NO: item.IDX_NO,
                Name: item.ToSeq,
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
              DelvNo: resultMasterSave[0].DelvNo,
              POQty: matchingDataSheet ? matchingDataSheet.POQty : item.POQty,
              POAmt: matchingDataSheet ? matchingDataSheet.POAmt : item.POAmt,
              POSeq: matchingDataSheet ? matchingDataSheet.POSeq : item.POSeq,
              POSerl: matchingDataSheet
                ? matchingDataSheet.POSerl
                : item.POSerl,
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
              await this.generateXmlService.generateXMLSPUDelvSaveWEB(
                resultMasterCheck,
              );
            const queryMasterSave = generateQuery(
              xmlDocumentMasterSave,
              '_SPUDelvSave_WEB',
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
                  Name: item.DelvSeq,
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

  async SDelvDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2548;
    const languageSeq = 6;
    const pgmSeq = 1134;

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

    const generateInOutBatch = (xmlDocument: string, procedure: string) => `
      EXEC ${procedure}
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = ${xmlFlags},
        @ServiceSeq = 2619,
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
              Name: item.Date,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUDelvCheckWEB(
            dataMaster,
            'D',
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUDelvCheck_WEB',
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
              Name: item.DelvNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
          return {
            ...item,
            DelvSeq:
              item.DelvSeq === '0'
                ? resultMasterCheck[0].DelvSeq
                : item.DelvSeq,
            WHSeq: dataMaster[0].WHSeq,
            WHName: dataMaster[0].WHName,
            BizUnit: resultMasterCheck[0].BizUnit,
            DelvDate: resultMasterCheck[0].DelvDate,
            DelvNo: resultMasterCheck[0].DelvNo,
          };
        });
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSPUDelvItemCheckWEB(
            dataSheetAUDUpdate,
          );
        const querySheetCheck = generateQuery(
          xmlDocumentSheetCheck,
          '_SPUDelvItemCheck_WEB',
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
              Name: item.DelvSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSPUDelvSaveWEB(
            resultMasterCheck,
          );
        const queryMasterSave = generateQuery(
          xmlDocumentMasterSave,
          '_SPUDelvSave_WEB',
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
              Name: item.DelvSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentSheetSave =
          await this.generateXmlService.generateXMLSPUDelvItemSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateQuery(
          xmlDocumentSheetSave,
          '_SPUDelvItemSave_WEB',
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
              Name: item.DelvSeq,
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
            DelvSerl: matchingResult ? matchingResult.DelvSerl : item.DelvSerl,
          };
        });
        const xmlDocumentSourceDailySave =
          await this.generateXmlService.generateXMLSCOMSourceDailySaveWEBDelv(
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

        const xmlDocumentDailyBatchSave =
          await this.generateXmlService.generateXMLSLGInOutDailyBatchWEB(
            resultMasterSave,
          );
        const queryDailyBatchSave = generateInOutBatch(
          xmlDocumentDailyBatchSave,
          '_SLGInOutDailyBatch_WEB',
        );
        const resultDailyBatchSave =
          await this.databaseService.executeQuery(queryDailyBatchSave);
        const saveDailyBatchStatuses = resultDailyBatchSave.some(
          (item: any) => item.Status !== 0,
        );
        if (saveDailyBatchStatuses) {
          const errorMessages = resultDailyBatchSave
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ToSeq,
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
            DelvNo: resultMasterSave[0].DelvNo,
            POQty: matchingDataSheet ? matchingDataSheet.POQty : item.POQty,
            POAmt: matchingDataSheet ? matchingDataSheet.POAmt : item.POAmt,
            POSeq: matchingDataSheet ? matchingDataSheet.POSeq : item.POSeq,
            POSerl: matchingDataSheet ? matchingDataSheet.POSerl : item.POSerl,
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

  async SDelvSheetDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2548;
    const languageSeq = 6;
    const pgmSeq = 1134;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'SD',
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
        @WorkingTag = N'SD',
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
      @WorkingTag = N'SD',
      @CompanySeq = ${companySeq},
      @LanguageSeq = ${languageSeq},
      @UserSeq = ${userSeq},
      @PgmSeq = ${pgmSeq};
  `;

    const generateInOutBatch = (xmlDocument: string, procedure: string) => `
      EXEC ${procedure}
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = ${xmlFlags},
        @ServiceSeq = 2619,
        @WorkingTag = N'SD',
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
              Name: item.Date,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUDelvCheckWEB(
            dataMaster,
            'U',
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUDelvCheck_WEB',
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
              Name: item.DelvNo,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
          return {
            ...item,
            DelvSeq:
              item.DelvSeq === '0'
                ? resultMasterCheck[0].DelvSeq
                : item.DelvSeq,
            WHSeq: dataMaster[0].WHSeq,
            WHName: dataMaster[0].WHName,
            BizUnit: resultMasterCheck[0].BizUnit,
            DelvDate: resultMasterCheck[0].DelvDate,
            DelvNo: resultMasterCheck[0].DelvNo,
          };
        });
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSPUDelvItemCheckWEB(
            dataSheetAUDUpdate,
          );
        const querySheetCheck = generateQuery(
          xmlDocumentSheetCheck,
          '_SPUDelvItemCheck_WEB',
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
              Name: item.DelvSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSPUDelvSaveWEB(
            resultMasterCheck,
          );
        const queryMasterSave = generateQuery(
          xmlDocumentMasterSave,
          '_SPUDelvSave_WEB',
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
              Name: item.DelvSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentSheetSave =
          await this.generateXmlService.generateXMLSPUDelvItemSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateQuery(
          xmlDocumentSheetSave,
          '_SPUDelvItemSave_WEB',
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
              Name: item.DelvSeq,
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
            DelvSerl: matchingResult ? matchingResult.DelvSerl : item.DelvSerl,
          };
        });
        const xmlDocumentSourceDailySave =
          await this.generateXmlService.generateXMLSCOMSourceDailySaveWEBDelv(
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

        const xmlDocumentDailyBatchSave =
          await this.generateXmlService.generateXMLSLGInOutDailyBatchWEB(
            resultMasterSave,
          );
        const queryDailyBatchSave = generateInOutBatch(
          xmlDocumentDailyBatchSave,
          '_SLGInOutDailyBatch_WEB',
        );
        const resultDailyBatchSave =
          await this.databaseService.executeQuery(queryDailyBatchSave);
        const saveDailyBatchStatuses = resultDailyBatchSave.some(
          (item: any) => item.Status !== 0,
        );
        if (saveDailyBatchStatuses) {
          const errorMessages = resultDailyBatchSave
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ToSeq,
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
            DelvNo: resultMasterSave[0].DelvNo,
            POQty: matchingDataSheet ? matchingDataSheet.POQty : item.POQty,
            POAmt: matchingDataSheet ? matchingDataSheet.POAmt : item.POAmt,
            POSeq: matchingDataSheet ? matchingDataSheet.POSeq : item.POSeq,
            POSerl: matchingDataSheet ? matchingDataSheet.POSerl : item.POSerl,
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
