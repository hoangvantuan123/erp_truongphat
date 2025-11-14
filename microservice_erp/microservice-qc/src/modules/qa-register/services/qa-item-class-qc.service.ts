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
export class QaItemClassQcService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchQaItemClassQcPage(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {

    const xmlDocument = this.generateXmlService.getQaItemClassQc(result);
    const query = `
      EXEC _SPDQAItemClassQCQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2031,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => {

        const dataWithIndex = resultQuery.map((item: any, index: any) => ({
          ...item,
          IDX_NO: index + 1
        }));
        return {
          success: true, data: dataWithIndex
        }


      }),
      catchError((error) =>
        of({
          success: false,
          message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  getQaItemClassSub(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getQaItemClassSub(result);
    const query = `
      EXEC _SPDQAItemClassQCSubQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2031,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => {

        const dataWithIndex = resultQuery.map((item: any, index: any) => ({
          ...item,
          IDX_NO: index + 1
        }));
        return { success: true, data: dataWithIndex }

      }),
      catchError((error) =>
        of({
          success: false,
          message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  async cudQaItemClass(
    dataQaItemClass: any[],
    dataQaItemClassSub: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.qaItemClassQcSave(dataQaItemClass);
    const query = `
      EXEC _SPDQAItemClassQCSave_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2031,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      
      const dataQAItemClassQCSave = await this.databaseService.executeQuery(query);
      const xmlDocumentQaItemClassSubCheck =
        await this.generateXmlService.checkQaItemClassSub(
          dataQaItemClassSub,
          dataQAItemClassQCSave[0].UMItemClass,
        );

      const queryCheckQaItemClassQcSub = `
          EXEC _SPDQAItemClassQCSubCheck_Web
            @xmlDocument = N'${xmlDocumentQaItemClassSubCheck}',
            @xmlFlags = 2,
            @ServiceSeq = 2031,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataCheckQaItemClass =
        await this.databaseService.executeQuery(queryCheckQaItemClassQcSub);

      if (
        dataCheckQaItemClass.length !== 0 &&
        dataCheckQaItemClass[0]?.Status !== 0
      ) {
        return {
          success: false,
          message:
          dataCheckQaItemClass[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSave =
        await this.generateXmlService.CUDQaItemClassSubSave(dataCheckQaItemClass);
      const querySave = `
          EXEC _SPDQAItemClassQCSubSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 2031,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      
      let dataSaveQaItemClassSub = [];

      if (dataQAItemClassQCSave.length > 0) {
        dataSaveQaItemClassSub = await this.databaseService.executeQuery(querySave);
      }

      return {
        success: true,
        data: { dataQAItemClassQCSave, dataSaveQaItemClassSub },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteQaItemClassSub(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.checkQaItemClassSub(result, "");
    const queryCheckDelete = `
      EXEC _SPDQAItemClassQCSubCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2031,
        @WorkingTag = N'D',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
    const checkQaItemClassSub = await this.databaseService.executeQuery(queryCheckDelete);

    if (checkQaItemClassSub.length > 0 && checkQaItemClassSub[0]?.Status !== 0) {
      return {
        success: false,
        message:
        checkQaItemClassSub[0]?.Result ?? 'Error occurred during the check.',
      };
    }

    const xmlDocumentSave =
      await this.generateXmlService.CUDQaItemClassSubSave(checkQaItemClassSub);
    const queryDelete = `
          EXEC _SPDQAItemClassQCSubSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 2031,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const dataDelete = await this.databaseService.executeQuery(queryDelete);
    return {
      success: true,
      data: dataDelete,
    };
  }

  async deleteQaItemClass(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.deleteQaItemClass(
      result,
    );
    const query = `
      EXEC _SPDQAItemClassQCSave_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2031,
        @WorkingTag = N'D',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    const dataDelete = await this.databaseService.executeQuery(query);

    return {
      success: true,
      data: dataDelete,
    };
  }
}
