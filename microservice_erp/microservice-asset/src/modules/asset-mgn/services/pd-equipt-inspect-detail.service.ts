import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
import { GenerateXmlEqpInspectDetail } from '../generate-xml/generate-xml-eqp-inspect-detail.service';
@Injectable()
export class PdEquiptInspectDetailService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlEqpInspectDetail,
  ) {}

  searchEquiptInspectDetail(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument =
      this.generateXmlService.searchEquiptInspectDetail(result);
    const query = `
      EXEC _SPDToolDetailInspectQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2287,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1082;
    `;
    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  getToolDetailMatByTermSerl(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument =
      this.generateXmlService.getToolDetailMatByTermSerl(result);
    const query = `
      EXEC _SPDToolDetailMatQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2287,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1082;
    `;
    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  async createOrUpdateInspectDetail(
    dataInspectDetail: any[],
    dataDetailMat: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1082;

    const xmlDocumentCheckTool =
      await this.generateXmlService.checkToolDetailInspect(dataInspectDetail);
    const query = `
      EXEC _SPDToolDetailInspectCheck_Web
        @xmlDocument = N'${xmlDocumentCheckTool}',
        @xmlFlags = 2,
        @ServiceSeq = 2287,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const dataCheck = await this.databaseService.executeQuery(query);

      if (dataCheck.length !== 0 && dataCheck[0]?.Status !== 0) {
        return {
          success: false,
          errors: dataCheck[0]?.Result,
          message: dataCheck[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentTool =
        await this.generateXmlService.saveToolDetailInspect(dataCheck);
      const querySaveTool = `
          EXEC _SPDToolDetailInspectSave_Web
            @xmlDocument = N'${xmlDocumentTool}',
            @xmlFlags = 2,
            @ServiceSeq = 2287,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataTool = await this.databaseService.executeQuery(querySaveTool);

      const xmlDocumentToolDetailMat =
        await this.generateXmlService.saveToolDetailMat(
          dataDetailMat,
          dataTool,
        );
      const querySaveToolDetailMat = `
          EXEC _SPDToolDetailMatSave_Web
            @xmlDocument = N'${xmlDocumentToolDetailMat}',
            @xmlFlags = 2,
            @ServiceSeq = 2287,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataToolMat = await this.databaseService.executeQuery(
        querySaveToolDetailMat,
      );

      return {
        success: true,
        data: { dataTool, dataToolMat },
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteInspectMat(
    dataMat: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      const pgmSeq = 1082;
      const xmlDocumentTool = await this.generateXmlService.saveToolDetailMat(
        dataMat,
        '',
      );
      const queryInspectDelete = `
        EXEC _SPDToolDetailMatSave_Web
          @xmlDocument = N'${xmlDocumentTool}',
          @xmlFlags = 2,
          @ServiceSeq = 2287,
          @WorkingTag = N'D',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const dataDelete =
        await this.databaseService.executeQuery(queryInspectDelete);
      return {
        success: true,
        data: { dataDelete },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteInspect(
    dataInspect: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1082;

    const xmlDocumentCheckTool =
      await this.generateXmlService.checkToolDetailInspect(dataInspect);
    const query = `
      EXEC _SPDToolDetailInspectCheck_Web
        @xmlDocument = N'${xmlDocumentCheckTool}',
        @xmlFlags = 2,
        @ServiceSeq = 2287,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const dataCheck = await this.databaseService.executeQuery(query);

      if (dataCheck.length !== 0 && dataCheck[0]?.Status !== 0) {
        return {
          success: false,
          errors: dataCheck[0]?.Result,
          message: dataCheck[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentTool =
        await this.generateXmlService.saveToolDetailInspect(dataCheck);
      const querySaveTool = `
          EXEC _SPDToolDetailInspectSave_Web
            @xmlDocument = N'${xmlDocumentTool}',
            @xmlFlags = 2,
            @ServiceSeq = 2287,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataTool = await this.databaseService.executeQuery(querySaveTool);

      return {
        success: true,
        data: { dataTool },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteDetail(
    dataInspect: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      const pgmSeq = 6847;
      const xmlDocumentTool =
        await this.generateXmlService.checkToolDetailInspect(dataInspect);
      const queryToolAssyCheck = `
        EXEC _SPDToolDetailInspectCheck_Web
          @xmlDocument = N'${xmlDocumentTool}',
          @xmlFlags = 2,
          @ServiceSeq = 2287,
          @WorkingTag = N'D',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const dataCheck =
        await this.databaseService.executeQuery(queryToolAssyCheck);

      if (dataCheck.length !== 0 && dataCheck[0]?.Status !== 0) {
        return {
          success: false,
          message: dataCheck[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveToolAssy =
        await this.generateXmlService.saveToolDetailInspect(dataCheck);
      const querySaveAssyTool = `
        EXEC _SPDToolDetailInspectSave_Web
          @xmlDocument = N'${xmlDocumentSaveToolAssy}',
          @xmlFlags = 2,
          @ServiceSeq = 2287,
          @WorkingTag = N'D',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const dataSaveToolAssy =
        await this.databaseService.executeQuery(querySaveAssyTool);

      return {
        success: true,
        data: { dataSaveToolAssy },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }
}
