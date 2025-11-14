import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
import { GenerateXmlEqpInspect } from '../generate-xml/generate-xml-eqp-inspect.service';
@Injectable()
export class PdEquiptInspectService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlEqpInspect,
  ) {}

  searchEquiptInspect(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchEquiptInspect(result);
    const query = `
      EXEC _SPDToolDetailInspectQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2287,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6847;
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

  async createOrUpdatePdEquipInspect(
    dataInspect: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 6847;

    const xmlDocumentCheckTool =
      await this.generateXmlService.checkCreateOrUpdatePdEqpInspect(dataInspect);
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
          message:
            dataCheck[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentTool =
        await this.generateXmlService.saveEqpInspect(dataCheck);
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
      console.log(error);
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deletePdEquipInspect(
    dataInspect: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      const pgmSeq = 6847;
      const xmlDocumentTool =
        await this.generateXmlService.checkCreateOrUpdatePdEqpInspect(dataInspect);
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
          message:
            dataCheck[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveToolAssy =
        await this.generateXmlService.saveEqpInspect(dataCheck);
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
