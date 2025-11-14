import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
@Injectable()
export class PdMultiEquiptService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchMultiEquipt(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchMultiEquipt(result);
    const query = `
      EXEC _SPDToolQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2213,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6864;
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

  async createOrUpdatePdMultiEquip(
    dataPdEquip: any[],
    dataAssyTool: any[],
    dataMng: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 6864;
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
          await this.generateXmlService.checkAssyTool(
            dataAssyTool,
            dataTool[0]?.ToolSeq,
          );

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
          await this.generateXmlService.checkToolUserDefine(
            dataMng,
            dataTool[0]?.ToolSeq,
          );
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

  async deletePdMultiEquip(
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
          await this.generateXmlService.checkAssyTool(
            dataAssyTool,
            dataTool[0]?.ToolSeq,
          );

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
          await this.generateXmlService.checkToolUserDefine(
            dataMng,
            dataTool[0]?.ToolSeq,
          );
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
