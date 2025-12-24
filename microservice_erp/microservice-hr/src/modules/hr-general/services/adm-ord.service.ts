import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMVCOMMON/database.service';
@Injectable()
export class HrAdmGeneralService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
    private readonly databaseServiceCommon: DatabaseServiceCommon,
  ) {}

  searchAdmOrd(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchAdmOrd(result);
    const query = `
      EXEC _SHRAdmOrdQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1631,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1825;
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

  async saveAdmOrd(
    data: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1825;

    const xmlDocument = await this.generateXmlService.checkHrAdmOrd(data);
    const query = `
      EXEC _SHRAdmOrdCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1631,
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
        await this.generateXmlService.saveHrAdmOrd(dataCheck);

      const querySave = `
          EXEC _SHRAdmOrdSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 1631,
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

  async deleteAdmOrd(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1825;

    const xmlDocument = await this.generateXmlService.checkHrAdmOrd(result);
    const query = `
      EXEC _SHRAdmOrdCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1631,
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
      const xmlDocumentSave =
        await this.generateXmlService.saveHrAdmOrd(dataCheck);

      const querySave = `
          EXEC _SHRAdmOrdSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 1631,
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

  searchAdmMultiOrd(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchAdmMultiOrd(result);
    const query = `
      EXEC _SHRAdmOrdEmpQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1879,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1831;
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

  searchAdmMultiOrdObj(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchAdmMultiOrdObj(result);
    const query = `
      EXEC _SHRAdmOrdMultiObjQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1888,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1831;
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

  getAdmOrdByOrdDate(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getAdmOrdByOrdDate(result);
    const query = `
      EXEC _SHRAdmOrdByOrdDateQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1888,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1831;
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

  async saveAdmMultiOrd(
    data: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1831;

    const xmlDocument = await this.generateXmlService.saveHrAdmMultiOrd(data);
    const query = `
      EXEC _SHRAdmOrdEmpSave_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1879,
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
        await this.generateXmlService.synchHrAdmMultiOrd(dataCheck);

      const querySave = `
          EXEC _SHRAdmEmpOrdSythnc_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 5348,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataSave = await this.databaseServiceCommon.executeQuery(querySave);

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

  async deleteAdmMultiOrd(
    data: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1831;

    const xmlDocument = await this.generateXmlService.saveHrAdmMultiOrd(data);
    const query = `
      EXEC _SHRAdmOrdEmpSave_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1879,
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
      const xmlDocumentSave =
        await this.generateXmlService.synchHrAdmMultiOrd(dataCheck);

      const querySave = `
          EXEC _SHRAdmEmpOrdSythnc_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 5348,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataSave = await this.databaseServiceCommon.executeQuery(querySave);

      return {
        success: true,
        data: { dataCheck },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }
}
