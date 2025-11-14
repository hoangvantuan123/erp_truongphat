import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import {
  Observable,
  from,
  catchError,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
@Injectable()
export class QaQcTitleService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchQaQaTitlePage(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const query = `
      EXEC _SPDQAQCTitleQuery_Web
        @xmlDocument = N'<ROOT></ROOT>',
        @xmlFlags = 2,
        @ServiceSeq = 1659,
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
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  getQaItemBad(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getQaItemBad(result);
    const query = `
      EXEC _SPDQABadItemQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1659,
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
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  async cudQaQcTitle(
    dataQaQcTitle: any[],
    dataQaItemBad: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.checkCudQaQcTitle(dataQaQcTitle);
    const query = `
      EXEC _SPDQAQCTitleCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1659,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const dataCheckQaQcTitle = await this.databaseService.executeQuery(query);

      if (
        dataCheckQaQcTitle.length !== 0 &&
        dataCheckQaQcTitle[0]?.Status !== 0
      ) {
        return {
          success: false,
          message:
            dataCheckQaQcTitle[0]?.Result || 'Error occurred during the check.',
        };
      }

      const xmlDocumentQaItemBadCheck =
        await this.generateXmlService.checkCudQaItemBad(
          dataQaItemBad,
          dataCheckQaQcTitle[0].UMQcTitleSeq,
        );

      const queryCheckQaItemBad = `
          EXEC _SPDQABadItemCheck_Web
            @xmlDocument = N'${xmlDocumentQaItemBadCheck}',
            @xmlFlags = 2,
            @ServiceSeq = 1659,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataCheckQaItemBad =
        await this.databaseService.executeQuery(queryCheckQaItemBad);

      if (
        dataCheckQaItemBad.length !== 0 &&
        dataCheckQaItemBad[0]?.Status !== 0
      ) {
        return {
          success: false,
          message:
            dataCheckQaItemBad[0]?.Result || 'Error occurred during the check.',
        };
      }

      const xmlDocumentSave =
        await this.generateXmlService.CUDQaQcTitle(dataCheckQaQcTitle);
      const querySave = `
          EXEC _SPDQAQCTitleSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 1659,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const xmlDocumentQaItemBadSave =
        await this.generateXmlService.CudQaItemBad(dataCheckQaItemBad);

      const queryQaItemBadSave = `
          EXEC _SPDQABadItemSave_Web
            @xmlDocument = N'${xmlDocumentQaItemBadSave}',
            @xmlFlags = 2,
            @ServiceSeq = 1659,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      let dataSaveQaQcTitle = [];
      let dataSaveQcItemBad = [];

      if (dataCheckQaQcTitle.length > 0) {
        dataSaveQaQcTitle = await this.databaseService.executeQuery(querySave);
      }

      if (dataCheckQaItemBad.length > 0) {
        dataSaveQcItemBad =
          await this.databaseService.executeQuery(queryQaItemBadSave);
      }

      return {
        success: true,
        data: { dataSaveQaQcTitle, dataSaveQcItemBad },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteQaQcTitle(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.checkCudQaQcTitle(result);
    const query = `
      EXEC _SPDQAQCTitleCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1659,
        @WorkingTag = N'D',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
    const checkQaItemQcTitle = await this.databaseService.executeQuery(query);

    if (checkQaItemQcTitle.length > 0 && checkQaItemQcTitle[0]?.Status !== 0) {
      return {
        success: false,
        message:
          checkQaItemQcTitle[0]?.Result || 'Error occurred during the check.',
      };
    }

    const xmlDocumentSave =
      await this.generateXmlService.CUDQaQcTitle(checkQaItemQcTitle);
    const querySave = `
          EXEC _SPDQAQCTitleSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 1659,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const dataDelete = await this.databaseService.executeQuery(querySave);
    return {
      success: true,
      data: dataDelete,
    };
  }

  async deleteQcItemBad(
    result: any[],
    UMQCTitleSeq: any,
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.checkCudQaItemBad(
      result,
      UMQCTitleSeq,
    );
    const query = `
      EXEC _SPDQABadItemCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1659,
        @WorkingTag = N'D',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    const checkQaItemBad = await this.databaseService.executeQuery(query);

    if (checkQaItemBad[0]?.Status !== 0) {
      return {
        success: false,
        message:
          checkQaItemBad[0]?.Result || 'Error occurred during the check.',
      };
    }
    const xmlDocumentSave =
      await this.generateXmlService.CudQaItemBad(checkQaItemBad);
    const querySave = `
    EXEC _SPDQABadItemSave_Web
      @xmlDocument = N'${xmlDocumentSave}',
      @xmlFlags = 2,
      @ServiceSeq = 1659,
      @WorkingTag = N'D',
      @CompanySeq = ${companySeq},
      @LanguageSeq = 6,
      @UserSeq = ${userSeq},
      @PgmSeq = ${pgmSeq};
  `;
    const dataDelete = await this.databaseService.executeQuery(querySave);

    return {
      success: true,
      data: dataDelete,
    };
  }
}
