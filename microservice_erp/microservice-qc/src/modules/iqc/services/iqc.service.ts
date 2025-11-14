import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMV_COMMON/database.service';
@Injectable()
export class IqcService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly databaseServiceCommon: DatabaseServiceCommon,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  async searchPage(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.searchBy(result);
    const query = `
      EXEC _SPDQCImpBLItemListQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 6925,
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

  async getById(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.getById(result);
    const query = `
      EXEC _SPDQcTestReportQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
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

  async getQcListItemBy(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.getQcListItemBy(result);
    const query = `
      EXEC _SPDQcTestReportItemQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
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

  async getQcTestReportResult(
    QCSeq: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.getQcTestReportResult(QCSeq);
    const query = `
      EXEC _SPDQcTestReportResultQuery
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
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

  async getQcTestFile(
    FileSeq: number,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const query = `
      EXEC _SCAAttachFileQuery ${FileSeq}
    `;
    try {
      const result = await this.databaseServiceCommon.executeQuery(query);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async saveQcTestReport(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocumentCheck =
      await this.generateXmlService.checkQcTestReport(result);
    const queryCheck = `
      EXEC _SPDQcTestReportCheck
        @xmlDocument = N'${xmlDocumentCheck}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const resultCheck = await this.databaseService.executeQuery(queryCheck);

      if (resultCheck[0]?.Status !== 0) {
        return {
          success: false,
          message: resultCheck[0]?.Result,
        };
      }

      const xmlDocumentSave = await this.generateXmlService.saveQcTestReport(
        resultCheck[0],
      );

      const querySave = `
      EXEC _SPDQcTestReportSave
        @xmlDocument = N'${xmlDocumentSave}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

      const resultSave = await this.databaseService.executeQuery(querySave);

      const xmlDocumentInOutDailyBatch = await this.generateXmlService.saveQcTestFile(
        result,
        resultCheck[0],
      );
      // const querySaveFile = `
      //   EXEC _SPDQCFileSave
      //     @xmlDocument = N'${xmlDocumentSaveFile}',
      //     @xmlFlags = 2,
      //     @ServiceSeq = 5202,
      //     @WorkingTag = N'',
      //     @CompanySeq = ${companySeq},
      //     @LanguageSeq = 6,
      //     @UserSeq = ${userSeq},
      //     @PgmSeq = ${pgmSeq};
      // `;

      // const resultSaveFile = await this.databaseService.executeQuery(querySaveFile);

      return { success: true, data: resultSave };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async QcTestReportItemSaveOrDelete(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {

    const xmlDocumentQcTestReportItemSave =
      await this.generateXmlService.saveQcTestReportItemSave(result);
    const query = `
      EXEC _SPDQcTestReportItemSave
        @xmlDocument = N'${xmlDocumentQcTestReportItemSave}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
    try {
      const resultQcTestReportItem =
        await this.databaseService.executeQuery(query);
      return { success: true, data: resultQcTestReportItem };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async getListQcTestReportBatch(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.getQcListTestBatch(result);
    const query = `
      EXEC _SPDQcTestReportBatchQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 3000,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
    try {
      const result = await this.databaseService.executeQuery(query);
      const dataResult = result.map((item: any) => ({
        ...item,
        ReqQty: item.Qty || 0,
      }));
      return { success: true, data: dataResult };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async saveQcTestList(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocumentCheck =
      await this.generateXmlService.getQcListTestReportCheck(result);
    const queryCheck = `
      EXEC _SPDQcTestReportCheck
        @xmlDocument = N'${xmlDocumentCheck}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const resultCheck = await this.databaseService.executeQuery(queryCheck);

      const hasNonZeroResult = resultCheck.find((item: any) => item.Result !== null);
      if (hasNonZeroResult) {
        return { 
          success: false, 
          data: resultCheck 
        };
      }
      
      const xmlDocumentSave =
        await this.generateXmlService.saveQcListTestReport(resultCheck, result);

      const querySave = `
      EXEC _SPDQcTestReportSave
        @xmlDocument = N'${xmlDocumentSave}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

      const xmlDocumentSaveFile = await this.generateXmlService.saveQcTestFile(
        result,
        resultCheck,
      );
      const querySaveFile = `
        EXEC _SPDQCFileSave
          @xmlDocument = N'${xmlDocumentSaveFile}',
          @xmlFlags = 2,
          @ServiceSeq = 5202,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;
      const resultSaveFile =
        await this.databaseService.executeQuery(querySaveFile);

      const resultSave = await this.databaseService.executeQuery(querySave);

      const xmlDocumentInOutDailyBatch =
        await this.generateXmlService.getInOutDailyBatch(resultSave[0].QCSeq);
      const queryInOutDailyBatch = `
        EXEC _SLGInOutDailyBatch
          @xmlDocument = N'${xmlDocumentInOutDailyBatch}',
          @xmlFlags = 2,
          @ServiceSeq = 2619,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;
      const resultInOutDailyBatch =
        await this.databaseService.executeQuery(queryInOutDailyBatch);
      return { success: true, data: resultSave };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async QcTestReportSampleReq(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocumentQcTestSampleReq =
      await this.generateXmlService.QcTestReportSampleReq(result);
    const queryCheck = `
      EXEC _SPDQcTestReportSampleReg_Web
        @xmlDocument = N'${xmlDocumentQcTestSampleReq}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const resultQcTestReportSampleReg =
        await this.databaseService.executeQuery(queryCheck);

      return { success: true, data: resultQcTestReportSampleReg };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async QcTestFileSave(
    result: any[],
    companySeq: number,
    userSeq: number,
    UserId: any,
    EmpSeq: any,
  ): Promise<SimpleQueryResult> {
    const queryFileQc = `
    exec _SCAAttachFileConstQuery 25,1,0
    `;
    const resultFileQc =
      await this.databaseServiceCommon.executeQuery(queryFileQc);

    const xmlDocumentQcTestFileSave =
      await this.generateXmlService.QcTestFileSave(
        result[0].fileList,
        result[0].FileSeq,
        UserId,
        EmpSeq,
        resultFileQc[0],
      );
    const queryCheck = `
      EXEC _SCAAttachFileSave
        N'${xmlDocumentQcTestFileSave}',
        N'${userSeq}';
    `;

    try {
      const resultQcTestFileSave =
        await this.databaseServiceCommon.executeQuery(queryCheck);

      return { success: true, data: resultQcTestFileSave };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async QcCheckStatusList(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocumentQcCheckStatus =
      await this.generateXmlService.QcCheckStatusList(result);
    const queryCheck = `
      EXEC _SPDQCImpResultListQuery_Web
        @xmlDocument = N'${xmlDocumentQcCheckStatus}',
        @xmlFlags = 2,
        @ServiceSeq = 1520753,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const resultQcCheckStatus =
        await this.databaseService.executeQuery(queryCheck);

      return { success: true, data: resultQcCheckStatus };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteImportTestReport(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocumentCheck =
      await this.generateXmlService.checkDeleteQcImportTestReport(result);
    const queryCheck = `
      EXEC _SPDQcTestReportCheck
        @xmlDocument = N'${xmlDocumentCheck}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'D',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const resultCheck = await this.databaseService.executeQuery(queryCheck);

      if (resultCheck[0]?.Status !== 0) {
        return {
          success: false,
          message: resultCheck[0]?.Result,
        };
      }

      const xmlDocumentSave = await this.generateXmlService.saveQcTestReport(
        resultCheck[0],
      );

      const querySave = `
      EXEC _SPDQcTestReportSave
        @xmlDocument = N'${xmlDocumentSave}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'D',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    const xmlDocumentInOutDailyBatch =
        await this.generateXmlService.getInOutDailyBatch(resultCheck);
      const queryInOutDailyBatch = `
        EXEC _SLGInOutDailyBatch
          @xmlDocument = N'${xmlDocumentInOutDailyBatch}',
          @xmlFlags = 2,
          @ServiceSeq = 2619,
          @WorkingTag = N'D',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;
      const resultInOutDailyBatch =
        await this.databaseService.executeQuery(queryInOutDailyBatch);

      const resultSave = await this.databaseService.executeQuery(querySave);
      return { success: true, data: resultSave };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }
}
