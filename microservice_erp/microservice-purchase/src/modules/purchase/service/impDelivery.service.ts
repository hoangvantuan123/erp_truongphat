import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

@Injectable()
export class ImpDeliveryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  async SSLImpPermitMasterQueryWEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSSLImpPermitMasterQueryWEB(
        result,
      );
    const query = `
      EXEC _SSLImpPermitMasterQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 4434,
        @WorkingTag = N'OrderInv',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 5559;
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

  async SSLImpPermitSheetQueryWEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSSLImpPermitSheetJumpQueryWEB(
        result,
      );
    const query = `
  EXEC _SSLImpPermitSheetJumpQuery_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 3185,
    @WorkingTag = N'',
    @CompanySeq = ${companySeq},
    @LanguageSeq = 6,
    @UserSeq = ${userSeq},
    @PgmSeq = 5559;
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

  async SSLImpDelvMasterQueryWEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSSLImpDelvMasterQueryWEB(result);
    const query = `
  EXEC _SSLImpDelvMasterQuery_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 4493,
    @WorkingTag = N'',
    @CompanySeq = ${companySeq},
    @LanguageSeq = 6,
    @UserSeq = ${userSeq},
    @PgmSeq = 1036085;
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

  async SSLImpDelvSheetQueryWEB(
    result: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSSLImpDelvSheetQueryWEB(result);
    const query = `
EXEC _SSLImpDelvSheetQuery_WEB
@xmlDocument = N'${xmlDocument}',
@xmlFlags = 2,
@ServiceSeq = 4493,
@WorkingTag = N'',
@CompanySeq = ${companySeq},
@LanguageSeq = 6,
@UserSeq = ${userSeq},
@PgmSeq = 1036085;
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

  async SImpDeliveryQRCheckWEB(
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
          await this.generateXmlService.generateXMLSIpmDeliveryQRCheckWEB(
            result,
          );
        const queryCheck = generateQuery(
          xmlDocumentCheck,
          '_SIpmDeliveryQRCheck_WEB',
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

  async SImpDeliverySave(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 4493;
    const languageSeq = 6;
    const pgmSeq = 1036085;

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
          await this.generateXmlService.generateXMLSSLImpDelvMasterCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SSLImpDelvMasterCheck_WEB',
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
              DelvDate: resultMasterCheck[0].DelvDate,
              BizUnit: resultMasterCheck[0].BizUnit,
              DelvNo: resultMasterCheck[0].DelvNo,
              CustSeq: resultMasterCheck[0].CustSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSSLImpDelvSheetCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SSLImpDelvSheetCheck_WEB',
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
                Name: item.DelvNo,
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
            await this.generateXmlService.generateXMLSSLImpDelvMasterSaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SSLImpDelvMasterSave_WEB',
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
                Name: item.DelvNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSSLImpDelvSheetSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SSLImpDelvSheetSave_WEB',
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
                Name: item.DelvSerl,
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

          const dataResultSheetSave = resultSheetSave.map((item) => {
            const matchingResult = dataSheetAUDUpdate.find(
              (data) => data.IdxNo === item.IDX_NO,
            );
            return {
              ...item,
              DelvNo: resultMasterSave[0].DelvNo,
              PermitSeq: matchingResult
                ? matchingResult.PermitSeq
                : item.PermitSeq,
              PermitSerl: matchingResult
                ? matchingResult.PermitSerl
                : item.PermitSerl,
              PermitQty: matchingResult
                ? matchingResult.PermitQty
                : item.PermitQty,
              PermitAmt: matchingResult
                ? matchingResult.PermitAmt
                : item.PermitAmt,
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
              await this.generateXmlService.generateXMLSSLImpDelvMasterSaveWEB(
                resultMasterCheck,
              );
            const queryMasterSave = generateQuery(
              xmlDocumentMasterSave,
              '_SSLImpDelvMasterSave_WEB',
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
                  Name: item.DelvNo,
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

  async SImpDeliverySheetDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 4493;
    const languageSeq = 6;
    const pgmSeq = 1036085;

    const generateClose = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2639,
            @WorkingTag = N'U',
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
          @WorkingTag = N'U',
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
        @WorkingTag = N'U',
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
            @WorkingTag = N'U',
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
          await this.generateXmlService.generateXMLSSLImpDelvMasterCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SSLImpDelvMasterCheck_WEB',
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
              DelvDate: resultMasterCheck[0].DelvDate,
              BizUnit: resultMasterCheck[0].BizUnit,
              DelvNo: resultMasterCheck[0].DelvNo,
              CustSeq: resultMasterCheck[0].CustSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSSLImpDelvSheetCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SSLImpDelvSheetCheck_WEB',
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
                Name: item.DelvNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

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
            await this.generateXmlService.generateXMLSSLImpDelvMasterSaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SSLImpDelvMasterSave_WEB',
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
                Name: item.DelvNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSSLImpDelvSheetSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SSLImpDelvSheetSave_WEB',
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
                Name: item.DelvSerl,
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

          const dataResultSheetSave = resultSheetSave.map((item) => {
            return {
              ...item,
              DelvNo: resultMasterSave[0].DelvNo,
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

  async SImpDeliveryMasterDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 4493;
    const languageSeq = 6;
    const pgmSeq = 1036085;

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
              Name: item.Date,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSSLImpDelvMasterCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SSLImpDelvMasterCheck_WEB',
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
              DelvDate: resultMasterCheck[0].DelvDate,
              BizUnit: resultMasterCheck[0].BizUnit,
              DelvNo: resultMasterCheck[0].DelvNo,
              CustSeq: resultMasterCheck[0].CustSeq,
            };
          });

          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSSLImpDelvSheetCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SSLImpDelvSheetCheck_WEB',
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
                Name: item.DelvNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

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
            await this.generateXmlService.generateXMLSSLImpDelvMasterSaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SSLImpDelvMasterSave_WEB',
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
                Name: item.DelvNo,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSSLImpDelvSheetSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SSLImpDelvSheetSave_WEB',
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
                Name: item.DelvSerl,
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

          const dataResultSheetSave = resultSheetSave.map((item) => {
            return {
              ...item,
              DelvNo: resultMasterSave[0].DelvNo,
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
