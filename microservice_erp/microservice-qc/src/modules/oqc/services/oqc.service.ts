import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, catchError, map, of } from 'rxjs';
@Injectable()
export class OqcService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchOqcReqPage(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchBy(result);
    const query = `
      EXEC _SPDQCFinListQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 4533,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  GetOQCSeq(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.GetOQCSeq(result);
    const query = `
      EXEC _SPDQCGetQCSeq_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 4533,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  async createOqc(
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

      const xmlDocumentSaveInOutDaiLyBatch =
        await this.generateXmlService.saveInOutDailyBatch(resultCheck[0]);

      const querySaveInOutDaiLyBatch = `
    EXEC _SLGInOutDailyBatch_Web
      @xmlDocument = N'${xmlDocumentSaveInOutDaiLyBatch}',
      @xmlFlags = 2,
      @ServiceSeq = 2619,
      @WorkingTag = N'',
      @CompanySeq = ${companySeq},
      @LanguageSeq = 6,
      @UserSeq = ${userSeq},
      @PgmSeq = ${pgmSeq};
  `;

      const xmlDocumentAutoGoodInSave =
        await this.generateXmlService.saveAutoGoodInSave(resultCheck);

      const queryAutoGoodInSave = `
  EXEC _SPDSFCAutoGoodInSave_Web
    @xmlDocument = N'${xmlDocumentAutoGoodInSave}',
    @xmlFlags = 2,
    @ServiceSeq = 2961,
    @WorkingTag = N'',
    @CompanySeq = ${companySeq},
    @LanguageSeq = 6,
    @UserSeq = ${userSeq},
    @PgmSeq = ${pgmSeq};
`;

      const resultSave = await this.databaseService.executeQuery(querySave);
      await this.databaseService.executeQuery(querySaveInOutDaiLyBatch);
      await this.databaseService.executeQuery(queryAutoGoodInSave);
      return { success: true, data: resultSave };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteOqcTestReport(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocumentCheck =
      await this.generateXmlService.checkDeleteOqcTestReport(result);
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

      await this.databaseService.executeQuery(queryInOutDailyBatch);

      const resultSave = await this.databaseService.executeQuery(querySave);
      return { success: true, data: resultSave };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  QcTestReportBatchFin(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.QcTestReportBatchFin(result);
    const query = `
      EXEC _SPDQcTestReportBatchFinQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 4533,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => {
        const updatedData = resultQuery.map((item: any) => ({
          ...item,
          ReqInQty: item.Qty,
          PassedQty: item.OKQty,
        }));

        return {
          success: true,
          data: updatedData,
        };
      }),
      catchError((error) =>
        of({
          success: false,
          message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  async QcTestReportBatchFinSave(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      const xmlDocumentCheck =
        await this.generateXmlService.QcTestReportBatchFinSaveCheck(result);
      const queryCheck = `
      EXEC _SPDQcTestReportCheck_Web
        @xmlDocument = N'${xmlDocumentCheck}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
      const resultCheck = await this.databaseService.executeQuery(queryCheck);

      if (resultCheck[0]?.Status !== 0) {
        return {
          success: false,
          message: resultCheck[0]?.Result,
        };
      }

      const xmlDocumentSave =
        await this.generateXmlService.QcTestReportBatchFinSave(resultCheck);

      const querySave = `
      EXEC _SPDQcTestReportSave_Web
        @xmlDocument = N'${xmlDocumentSave}',
        @xmlFlags = 2,
        @ServiceSeq = 5202,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

      const xmlDocumentInOutDailyBatch =
        await this.generateXmlService.getInOutDailyBatch(resultCheck);
      const queryInOutDailyBatch = `
        EXEC _SLGInOutDailyBatch_Web
          @xmlDocument = N'${xmlDocumentInOutDailyBatch}',
          @xmlFlags = 2,
          @ServiceSeq = 2619,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const xmlDocumentAutoGoodInSave =
        await this.generateXmlService.saveAutoGoodInSave(resultCheck);

      const queryAutoGoodInSave = `
        EXEC _SPDSFCAutoGoodInSave_Web
          @xmlDocument = N'${xmlDocumentAutoGoodInSave}',
          @xmlFlags = 2,
          @ServiceSeq = 2961,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const resultSave = await this.databaseService.executeQuery(querySave);
      await this.databaseService.executeQuery(queryInOutDailyBatch);
      await this.databaseService.executeQuery(queryAutoGoodInSave);

      return { success: true, data: resultSave };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  searchFinResultList(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchFinResultList(result);
    const query = `
      EXEC _SPDQCFinResultListQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5787,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  searchQcFinalBadQtyResultList(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchQcFinalBadQtyResultList(result);
    const query = `
      EXEC _SPDQCFinalBadQtyListQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 6005,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }
}
