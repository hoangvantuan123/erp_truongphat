import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

@Injectable()
export class PurOrdApprovalReqService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  async SPUORDApprovalReqMasterQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUORDApprovalReqMasterQueryWEB(
        result,
      );
    const query = `
  EXEC _SPUORDApprovalReqQuery_WEB
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

  async SPUORDApprovalReqSheetQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUORDApprovalReqSheetQueryWEB(
        result,
      );
    const query = `
  EXEC _SPUORDApprovalReqItemQuery_WEB
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

  async SOrdApprovalReqSave(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010006;
    const languageSeq = 6;
    const pgmSeq = 1129;

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
        if (dataMaster[0].ApproReqSeq > 0) {
          workingTag = 'U';
        } else {
          workingTag = 'A';
        }

        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUORDApprovalReqCheckWEB(
            dataMaster,
            workingTag,
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUORDApprovalReqCheck_WEB',
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
              Name: item.ApproReqNo,
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
              ApproReqSeq:
                item.ApproReqSeq === ''
                  ? resultMasterCheck[0].ApproReqSeq
                  : item.ApproReqSeq,
              ApproReqDate: resultMasterCheck[0].ApproReqDate,
              SMImpType: dataMaster[0].SMImpType,
              CustSeq: dataMaster[0].CustSeq,
              CustName: dataMaster[0].CustName,
              WHSeq: dataMaster[0].WHSeq,
              WHName: dataMaster[0].WHName,
            };
          });
          const xmlDocumentSheetCheck =
            await this.generateXmlService.generateXMLSPUORDApprovalReqItemCheckWEB(
              dataSheetAUDUpdate,
            );
          const querySheetCheck = generateQuery(
            xmlDocumentSheetCheck,
            '_SPUORDApprovalReqItemCheck_WEB',
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
                Name: item.ApproReqSeq,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }
          const xmlDocumentMasterSave =
            await this.generateXmlService.generateXMLSPUORDApprovalReqSaveWEB(
              resultMasterCheck,
            );
          const queryMasterSave = generateQuery(
            xmlDocumentMasterSave,
            '_SPUORDApprovalReqSave_WEB',
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
                Name: item.ApproReqSeq,
                result: item.Result,
              }));
            return { success: false, errors: errorMessages };
          }

          const xmlDocumentSheetSave =
            await this.generateXmlService.generateXMLSPUORDApprovalReqItemSaveWEB(
              resultSheetCheck,
            );
          const querySheetSave = generateQuery(
            xmlDocumentSheetSave,
            '_SPUORDApprovalReqItemSave_WEB',
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
                Name: item.ApproReqSeq,
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
          const resultSheetSaveUpdate = resultSheetSave.map((item) => {
            return {
              ...item,
              ApproReqNo: resultMasterSave[0].ApproReqNo,
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
              await this.generateXmlService.generateXMLSPUORDApprovalReqSaveWEB(
                resultMasterCheck,
              );
            const queryMasterSave = generateQuery(
              xmlDocumentMasterSave,
              '_SPUORDApprovalReqSave_WEB',
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
                  Name: item.ApproReqSeq,
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

  async SOrdApprovalReqDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010006;
    const languageSeq = 6;
    const pgmSeq = 1129;

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

    const saveResult = async () => {
      try {
        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUORDApprovalReqCheckWEB(
            dataMaster,
            'D',
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUORDApprovalReqCheck_WEB',
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
              Name: item.ApproReqNo,
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
        const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
          return {
            ...item,
            ApproReqSeq:
              item.ApproReqSeq === ''
                ? dataMaster[0].ApproReqSeq
                : item.ApproReqSeq,
            SMImpType:
              item.SMImpType === '' ? dataMaster[0].SMImpType : item.SMImpType,
            CustSeq: item.CustSeq === '' ? dataMaster[0].CustSeq : item.CustSeq,
            CustName:
              item.CustName === '' ? dataMaster[0].CustName : item.CustName,
            WHSeq: item.WHSeq === '' ? dataMaster[0].WHSeq : item.WHSeq,
            WHName: item.WHName === '' ? dataMaster[0].WHName : item.WHName,
          };
        });

        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSPUORDApprovalReqItemCheckWEB(
            dataSheetAUDUpdate,
          );
        const querySheetCheck = generateQuery(
          xmlDocumentSheetCheck,
          '_SPUORDApprovalReqItemCheck_WEB',
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
              Name: item.ApproReqSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSPUORDApprovalReqSaveWEB(
            resultMasterCheck,
          );
        const queryMasterSave = generateQuery(
          xmlDocumentMasterSave,
          '_SPUORDApprovalReqSave_WEB',
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
              Name: item.ApproReqSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentSheetSave =
          await this.generateXmlService.generateXMLSPUORDApprovalReqItemSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateQuery(
          xmlDocumentSheetSave,
          '_SPUORDApprovalReqItemSave_WEB',
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
              Name: item.ApproReqSeq,
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

  async SOrdApprovalReqSheetDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 60010006;
    const languageSeq = 6;
    const pgmSeq = 1129;

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
        const xmlDocumentMasterCheck =
          await this.generateXmlService.generateXMLSPUORDApprovalReqCheckWEB(
            dataMaster,
            'U',
          );
        const queryMasterCheck = generateQuery(
          xmlDocumentMasterCheck,
          '_SPUORDApprovalReqCheck_WEB',
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
              Name: item.ApproReqNo,
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
        const dataSheetAUDUpdate = dataSheetAUD.map((item) => {
          return {
            ...item,
            ApproReqSeq:
              item.ApproReqSeq === ''
                ? resultMasterCheck[0].ApproReqSeq
                : item.ApproReqSeq,
            ApproReqDate: resultMasterCheck[0].ApproReqDate,
            SMImpType: dataMaster[0].SMImpType,
            CustSeq: dataMaster[0].CustSeq,
            CustName: dataMaster[0].CustName,
            WHSeq: dataMaster[0].WHSeq,
            WHName: dataMaster[0].WHName,
          };
        });
        console.log('dataSheetAUDUpdate', dataSheetAUDUpdate);
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSPUORDApprovalReqItemCheckWEB(
            dataSheetAUDUpdate,
          );
        const querySheetCheck = generateQuery(
          xmlDocumentSheetCheck,
          '_SPUORDApprovalReqItemCheck_WEB',
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
              Name: item.ApproReqSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSPUORDApprovalReqSaveWEB(
            resultMasterCheck,
          );
        const queryMasterSave = generateQuery(
          xmlDocumentMasterSave,
          '_SPUORDApprovalReqSave_WEB',
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
              Name: item.ApproReqSeq,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }

        const xmlDocumentSheetSave =
          await this.generateXmlService.generateXMLSPUORDApprovalReqItemSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateQuery(
          xmlDocumentSheetSave,
          '_SPUORDApprovalReqItemSave_WEB',
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
              Name: item.ApproReqSeq,
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
