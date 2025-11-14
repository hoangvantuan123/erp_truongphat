import { IsString } from 'class-validator';
import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlStockClosingService } from '../generate-xml/generate-xml-stock-closing.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';

@Injectable()
export class LGWHStockClosingService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlStockClosingService,
  ) {}

  async SLGReInOutStockQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGReInOutStockQueryWEB(result);
    const query = `
      EXEC _SLGReInOutStockQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5248,
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

  async SCOMClosingDateDynamicQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSCOMClosingDateDynamicQueryWEB(
        result,
      );
    const query = `
      EXEC _SCOMClosingDateDynamicQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 3436,
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
  async SCOMClosingYMDynamicQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSCOMClosingYMDynamicQueryWEB(
        result,
      );
    const query = `
      EXEC _SCOMClosingYMDymnamicQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 3436,
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

  async SLGReInOutStockSumSave(
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 7583;
    const serviceSaveSeq = 5248;
    const languageSeq = 6;
    const pgmSeq = 5956;
    const generateCheck = (xmlDocument: string, procedure: string) => `
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

    const generateSave = (xmlDocument: string, procedure: string) => `
          EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSaveSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const saveResult = async () => {
      try {
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSLGReInOutStockCheckWEB(
            dataSheetAUD,
            userSeq,
          );
        const querySheetCheck = generateCheck(
          xmlDocumentSheetCheck,
          '_SLGReInOutStockCheck_WEB',
        );
        const resultSheetCheck =
          await this.databaseService.executeQuery(querySheetCheck);
        const saveSheetCheckStatuses = resultSheetCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (saveSheetCheckStatuses) {
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
          await this.generateXmlService.generateXMLSLGReInOutStockSumWEB(
            dataSheetAUD,
            userSeq,
          );
        const querySheetSave = generateSave(
          xmlDocumentSheetSave,
          '_SLGReInOutStockSum_WEB',
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
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SCOMClosingDateSave(
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 3436;
    const languageSeq = 6;
    const pgmSeq = 200863;
    const generateCheck = (xmlDocument: string, procedure: string) => `
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
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSCOMClosingDateCheckWEB(
            dataSheetAUD,
          );
        const querySheetCheck = generateCheck(
          xmlDocumentSheetCheck,
          '_SCOMClosingDateCheck_WEB',
        );
        const resultSheetCheck =
          await this.databaseService.executeQuery(querySheetCheck);
        const saveSheetCheckStatuses = resultSheetCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (saveSheetCheckStatuses) {
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
          await this.generateXmlService.generateXMLSCOMClosingDateSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateCheck(
          xmlDocumentSheetSave,
          '_SCOMClosingDateSave_WEB',
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
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SCOMClosingYMSave(
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 3436;
    const languageSeq = 6;
    const pgmSeq = 200857;
    const generateCheck = (xmlDocument: string, procedure: string) => `
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
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSCOMClosingYMCheckWEB(
            dataSheetAUD,
          );
        const querySheetCheck = generateCheck(
          xmlDocumentSheetCheck,
          '_SCOMClosingYMCheck_WEB',
        );
        const resultSheetCheck =
          await this.databaseService.executeQuery(querySheetCheck);
        const saveSheetCheckStatuses = resultSheetCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (saveSheetCheckStatuses) {
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
          await this.generateXmlService.generateXMLSCOMClosingYMSaveWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateCheck(
          xmlDocumentSheetSave,
          '_SCOMClosingYMSave_WEB',
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
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }
  async SLGStockNextCalcHistQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSLGStockNextCalcHistQueryWEB(
        result,
      );
    const query = `
  EXEC _SLGStockNextCalcHistQuery_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 5877,
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

  async SLGStockNextCalcHistSave(
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 5877;
    const languageSeq = 6;
    const pgmSeq = 7054;
    const generateCheck = (xmlDocument: string, procedure: string) => `
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
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSLGStockNextCalcCheckWEB(
            dataSheetAUD,
          );
        const querySheetCheck = generateCheck(
          xmlDocumentSheetCheck,
          '_SLGStockNextCalcCheck_WEB',
        );
        const resultSheetCheck =
          await this.databaseService.executeQuery(querySheetCheck);
        const saveSheetCheckStatuses = resultSheetCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (saveSheetCheckStatuses) {
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
          await this.generateXmlService.generateXMLSLGStockNextCalcWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateCheck(
          xmlDocumentSheetSave,
          '_SLGStockNextCalc_WEB',
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
        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSLGStockNextCalcHistSaveWEB(
            resultSheetSave,
          );
        const queryMasterSave = generateCheck(
          xmlDocumentMasterSave,
          '_SLGStockNextCalcHistSave_WEB',
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
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SLGStockNextCalcHistDelete(
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 5877;
    const languageSeq = 6;
    const pgmSeq = 7054;
    const generateCheck = (xmlDocument: string, procedure: string) => `
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
        const xmlDocumentSheetCheck =
          await this.generateXmlService.generateXMLSLGStockNextCalcCheckWEB(
            dataSheetAUD,
          );
        const querySheetCheck = generateCheck(
          xmlDocumentSheetCheck,
          '_SLGStockNextCalcCheck_WEB',
        );
        const resultSheetCheck =
          await this.databaseService.executeQuery(querySheetCheck);
        const saveSheetCheckStatuses = resultSheetCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (saveSheetCheckStatuses) {
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
          await this.generateXmlService.generateXMLSLGStockNextCalcWEB(
            resultSheetCheck,
          );
        const querySheetSave = generateCheck(
          xmlDocumentSheetSave,
          '_SLGStockNextCalc_WEB',
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
        const xmlDocumentMasterSave =
          await this.generateXmlService.generateXMLSLGStockNextCalcHistSaveWEB(
            resultSheetSave,
          );
        const queryMasterSave = generateCheck(
          xmlDocumentMasterSave,
          '_SLGStockNextCalcHistSave_WEB',
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
      return await saveResult();
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }
}
