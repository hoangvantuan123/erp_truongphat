import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
import { GenerateXmlLaborContractPrintService } from '../generate-xml/generate-xml-labor-contract-print.service';
@Injectable()
export class HrLaborContractPrintService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlLaborContractPrintService,
  ) {}

  searchLaborContractPrint(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument =
      this.generateXmlService.searchLaborContractPrint(result);
    const query = `
      EXEC VTN_SDALabourContractPrint_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 9941,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1019401;
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

  searchCertificateIssue(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchCertificateIssue(result);
    const query = `
      EXEC _SHRBasCertificateQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2113,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1819;
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

  async auCertificateIssue(
    data: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1819;

    const xmlDocument = await this.generateXmlService.checkBasCertificate(data);
    const query = `
      EXEC _SHRBasCertificateCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2113,
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
          message: dataCheck[0]?.Result ?? 'Error occurred during the check.',
        };
      }
      const xmlDocumentSave =
        await this.generateXmlService.auBasCertificate(dataCheck);

      const querySave = `
          EXEC _SHRBasCertificateSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 2113,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataSave = await this.databaseService.executeQuery(querySave);

      return {
        success: true,
        data: { dataSave },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteCertificateIssue(
    data: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1819;

    const xmlDocument = await this.generateXmlService.checkBasCertificate(data);
    const query = `
      EXEC _SHRBasCertificateCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2113,
        @WorkingTag = N'D',
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
          message: dataCheck[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentConfirmDelete =
        await this.generateXmlService.confirmDelete(dataCheck);

      const queryConfirmDelete = `
          EXEC _SCOMConfirmDelete_Web
            @xmlDocument = N'${xmlDocumentConfirmDelete}',
            @xmlFlags = 2,
            @ServiceSeq = 2609,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      await this.databaseService.executeQuery(queryConfirmDelete);

      const xmlDocumentSave =
        await this.generateXmlService.auBasCertificate(dataCheck);

      const querySave = `
          EXEC _SHRBasCertificateSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 2113,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataSave = await this.databaseService.executeQuery(querySave);

      return {
        success: true,
        data: { dataSave },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }


  searchCertificateIssueList(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchCertificateIssueList(result);
    const query = `
      EXEC _SHRBasCertificateListQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 2113,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 3256;
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
}
