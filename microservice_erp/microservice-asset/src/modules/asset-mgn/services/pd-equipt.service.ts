import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
@Injectable()
export class PdEquiptService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchAssetEquipt(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchAssetEquipt(result);
    const query = `
      EXEC _SPDToolListQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5717,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1081;
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

  getToolQuery(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getToolQuery(result);
    const query = `
      EXEC _SPDToolQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2213,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1080;
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

  getToolAssyQuery(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getToolAssyQuery(result);
    const query = `
      EXEC _SPDToolAssyQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2213,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1080;
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

  getToolRepairQuery(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getToolRepairQuery(result);
    const query = `
      EXEC _SPDToolRepairQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2289,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1080;
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

  getUserDefineQuery(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getUserDefineQuery(result);
    const query = `
      EXEC _SPDToolUserDefineInfoQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5692,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1080;
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

  async createOrUpdatePdEquip(
    dataPdEquip: any[],
    dataAssyTool: any[],
    dataMng: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1080;
    let dataAssy = [];
    let dataMngTool = [];

    const xmlDocumentCheckTool =
      await this.generateXmlService.checkCreateOrUpdatePdEquip(dataPdEquip);
    const query = `
      EXEC _SPDToolCheck_Web
        @xmlDocument = N'${xmlDocumentCheckTool}',
        @xmlFlags = 2,
        @ServiceSeq = 2213,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const dataCheckTool = await this.databaseService.executeQuery(query);

      if (dataCheckTool.length !== 0 && dataCheckTool[0]?.Status !== 0) {
        return {
          success: false,
          errors: dataCheckTool[0]?.Result,
          message:
            dataCheckTool[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentTool =
        await this.generateXmlService.saveTool(dataCheckTool);
      const querySaveTool = `
          EXEC _SPDToolSave_Web
            @xmlDocument = N'${xmlDocumentTool}',
            @xmlFlags = 2,
            @ServiceSeq = 2213,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataTool = await this.databaseService.executeQuery(querySaveTool);

      if (dataAssyTool.length !== 0) {
        const xmlDocumentCheckAssyTool =
          await this.generateXmlService.checkAssyTool(dataAssyTool, dataTool[0]?.ToolSeq);

        const queryCheckAssyTool = `
          EXEC _SPDToolAssyCheck_Web
            @xmlDocument = N'${xmlDocumentCheckAssyTool}',
            @xmlFlags = 2,
            @ServiceSeq = 2213,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const dataCheckAssyTool =
          await this.databaseService.executeQuery(queryCheckAssyTool);

        if (
          dataCheckAssyTool.length !== 0 &&
          dataCheckAssyTool[0]?.Status !== 0
        ) {
          return {
            success: false,
            message:
              dataCheckAssyTool[0]?.Result ??
              'Error occurred during the check.',
          };
        }

        const xmlDocumentSaveAssyTool =
          await this.generateXmlService.saveAssyTool(dataCheckAssyTool);
        const querySaveAssyTool = `
          EXEC _SPDToolAssySave_Web
            @xmlDocument = N'${xmlDocumentSaveAssyTool}',
            @xmlFlags = 2,
            @ServiceSeq = 2213,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        dataAssy = await this.databaseService.executeQuery(querySaveAssyTool);
      }

      

      if (dataMng.length > 0) {
        const xmlDocumentCheckToolUserDefine =
          await this.generateXmlService.checkToolUserDefine(dataMng, dataTool[0]?.ToolSeq);
        const queryCheckToolUserDefine = `
          EXEC _SPDToolUserDefineInfoCheck_Web
            @xmlDocument = N'${xmlDocumentCheckToolUserDefine}',
            @xmlFlags = 2,
            @ServiceSeq = 5692,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const dataCheckToolUserDefine = await this.databaseService.executeQuery(
          queryCheckToolUserDefine,
        );

        if (
          dataCheckToolUserDefine.length !== 0 &&
          dataCheckToolUserDefine[0]?.Status !== 0
        ) {
          return {
            success: false,
            message:
              dataCheckToolUserDefine[0]?.Result ??
              'Error occurred during the check.',
          };
        }

        const xmlDocumentSaveToolUserDefine =
          await this.generateXmlService.saveToolUserDefine(
            dataCheckToolUserDefine,
          );
        const querySaveToolUserDefine = `
          EXEC _SPDToolUserDefineInfoSave_Web
            @xmlDocument = N'${xmlDocumentSaveToolUserDefine}',
            @xmlFlags = 2,
            @ServiceSeq = 5692,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        dataMngTool = await this.databaseService.executeQuery(
          querySaveToolUserDefine,
        );
      }

      return {
        success: true,
        data: { dataTool, dataAssy, dataMngTool },
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteMold(
    dataMold: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      console.log('dataMold', dataMold);
      const pgmSeq = 1080;
      const xmlDocumentTool =
        await this.generateXmlService.checkAssyTool(dataMold, dataMold[0]?.ToolSeq || 0);
      const queryToolAssyCheck = `
        EXEC _SPDToolAssyCheck_Web
          @xmlDocument = N'${xmlDocumentTool}',
          @xmlFlags = 2,
          @ServiceSeq = 2213,
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
          message:
            dataCheck[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveToolAssy =
        await this.generateXmlService.saveAssyTool(dataCheck);
      const querySaveAssyTool = `
        EXEC _SPDToolAssySave_Web
          @xmlDocument = N'${xmlDocumentSaveToolAssy}',
          @xmlFlags = 2,
          @ServiceSeq = 2213,
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

    async deletePdEquip(
    dataPdEquip: any[],
    dataAssyTool: any[],
    dataMng: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1080;
    let dataAssy = [];
    let dataMngTool = [];

    const xmlDocumentCheckTool =
      await this.generateXmlService.checkCreateOrUpdatePdEquip(dataPdEquip);
    const query = `
      EXEC _SPDToolCheck_Web
        @xmlDocument = N'${xmlDocumentCheckTool}',
        @xmlFlags = 2,
        @ServiceSeq = 2213,
        @WorkingTag = N'D',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const dataCheckTool = await this.databaseService.executeQuery(query);

      if (dataCheckTool.length !== 0 && dataCheckTool[0]?.Status !== 0) {
        return {
          success: false,
          errors: dataCheckTool[0]?.Result,
          message:
            dataCheckTool[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentTool =
        await this.generateXmlService.saveTool(dataCheckTool);
      const querySaveTool = `
          EXEC _SPDToolSave_Web
            @xmlDocument = N'${xmlDocumentTool}',
            @xmlFlags = 2,
            @ServiceSeq = 2213,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataTool = await this.databaseService.executeQuery(querySaveTool);

      if (dataAssyTool.length !== 0) {
        const xmlDocumentCheckAssyTool =
          await this.generateXmlService.checkAssyTool(dataAssyTool, dataTool[0]?.ToolSeq);

        const queryCheckAssyTool = `
          EXEC _SPDToolAssyCheck_Web
            @xmlDocument = N'${xmlDocumentCheckAssyTool}',
            @xmlFlags = 2,
            @ServiceSeq = 2213,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const dataCheckAssyTool =
          await this.databaseService.executeQuery(queryCheckAssyTool);

        if (
          dataCheckAssyTool.length !== 0 &&
          dataCheckAssyTool[0]?.Status !== 0
        ) {
          return {
            success: false,
            message:
              dataCheckAssyTool[0]?.Result ??
              'Error occurred during the check.',
          };
        }

        const xmlDocumentSaveAssyTool =
          await this.generateXmlService.saveAssyTool(dataCheckAssyTool);
        const querySaveAssyTool = `
          EXEC _SPDToolAssySave_Web
            @xmlDocument = N'${xmlDocumentSaveAssyTool}',
            @xmlFlags = 2,
            @ServiceSeq = 2213,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        dataAssy = await this.databaseService.executeQuery(querySaveAssyTool);
      }

      

      if (dataMng.length > 0) {
        const xmlDocumentCheckToolUserDefine =
          await this.generateXmlService.checkToolUserDefine(dataMng, dataTool[0]?.ToolSeq);
        const queryCheckToolUserDefine = `
          EXEC _SPDToolUserDefineInfoCheck_Web
            @xmlDocument = N'${xmlDocumentCheckToolUserDefine}',
            @xmlFlags = 2,
            @ServiceSeq = 5692,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const dataCheckToolUserDefine = await this.databaseService.executeQuery(
          queryCheckToolUserDefine,
        );

        if (
          dataCheckToolUserDefine.length !== 0 &&
          dataCheckToolUserDefine[0]?.Status !== 0
        ) {
          return {
            success: false,
            message:
              dataCheckToolUserDefine[0]?.Result ??
              'Error occurred during the check.',
          };
        }

        const xmlDocumentSaveToolUserDefine =
          await this.generateXmlService.saveToolUserDefine(
            dataCheckToolUserDefine,
          );
        const querySaveToolUserDefine = `
          EXEC _SPDToolUserDefineInfoSave_Web
            @xmlDocument = N'${xmlDocumentSaveToolUserDefine}',
            @xmlFlags = 2,
            @ServiceSeq = 5692,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        dataMngTool = await this.databaseService.executeQuery(
          querySaveToolUserDefine,
        );
      }

      return {
        success: true,
        data: { dataTool, dataAssy, dataMngTool },
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }


}
