import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, catchError, map, of } from 'rxjs';
@Injectable()
export class QaCustQcTitleService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchQaCustQCTitlePage(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchQaCustQcTitle(result);

    const query = `
      EXEC _SPDQACustQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 3324,
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

  getQaItemByCust(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getQaItemByCust(result);
    const query = `
      EXEC _SPDQACustItemQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 3324,
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

  getUMQCByItem(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getUMQCByItem(result);
    const query = `
      EXEC _SPDQACustItemQCTitleQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 3324,
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

  async cudQaCustQcTitle(
    dataCust: any[],
    dataQaItem: any[],
    dataUMQc: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.checkQaCust(dataCust);

    const query = `
      EXEC _SPDQACustCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 3324,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const dataCheckQaCust = await this.databaseService.executeQuery(query);

      if (dataCheckQaCust.length !== 0 && dataCheckQaCust[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckQaCust[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentQaItemCheck = await this.generateXmlService.checkCudItem(
        dataQaItem,
        dataCust[0]?.CustSeq,
        dataCust[0]?.SMQCType,
      );

      const queryCheckQaItem = `
          EXEC _SPDQACustItemCheck_Web
            @xmlDocument = N'${xmlDocumentQaItemCheck}',
            @xmlFlags = 2,
            @ServiceSeq = 3324,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataCheckQaItem =
        await this.databaseService.executeQuery(queryCheckQaItem);
        console.log('dataCheckQaItem', dataCheckQaItem);
      

      if (dataCheckQaItem.length !== 0 && dataCheckQaItem[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckQaItem[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentCheckUmQc = await this.generateXmlService.checkUmQc(
        dataUMQc,
        dataCheckQaCust[0]?.CustSeq,
        dataCheckQaCust[0]?.SMQCType,
      );

      const queryCheckUmQc = `
          EXEC _SPDQACustItemQCTitleCheck_Web
            @xmlDocument = N'${xmlDocumentCheckUmQc}',
            @xmlFlags = 2,
            @ServiceSeq = 3324,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataCheckUMQC =
        await this.databaseService.executeQuery(queryCheckUmQc);

      // if (dataCheckUMQC.length !== 0 && dataCheckUMQC[0]?.Status !== 0) {
      //   return {
      //     success: false,
      //     message:
      //       dataCheckUMQC[0]?.Result ?? 'Error occurred during the check.',
      //   };
      // }
      const xmlDocumentSave =
        await this.generateXmlService.checkQaCust(dataCheckQaCust);
      const queryCustSave = `
          EXEC _SPDQACustSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 3324,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const xmlDocumentQaItemSave = await this.generateXmlService.checkCudItem(
        dataCheckQaItem,
        dataCheckQaCust[0]?.CustSeq,
        dataCheckQaCust[0]?.SMQCType,
      );

      const queryCustItem = `
          EXEC _SPDQACustItemSave_Web
            @xmlDocument = N'${xmlDocumentQaItemSave}',
            @xmlFlags = 2,
            @ServiceSeq = 3324,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const xmlDocumentQaCustItemQcSave =
        await this.generateXmlService.checkUmQc(
          dataCheckUMQC, 
          dataCheckQaCust[0]?.CustSeq,
          dataCheckQaCust[0]?.SMQCType,
        );

      const queryCustItemQcTitle = `
          EXEC _SPDQACustItemQCTitleSave_Web
            @xmlDocument = N'${xmlDocumentQaCustItemQcSave}',
            @xmlFlags = 2,
            @ServiceSeq = 3324,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataQaQcTitle =
        await this.databaseService.executeQuery(queryCustSave);
      const dataSaveQcItem =
        await this.databaseService.executeQuery(queryCustItem);
      const dataSaveQaCustQcItem =
        await this.databaseService.executeQuery(queryCustItemQcTitle);

      return {
        success: true,
        data: { dataQaQcTitle, dataSaveQcItem, dataSaveQaCustQcItem },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

}
