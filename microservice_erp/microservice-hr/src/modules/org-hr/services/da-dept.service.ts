import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
@Injectable()
export class DaDeptService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchDaDept(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchBy(result);
    const query = `
      EXEC _SHRDeptQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 888,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 134;
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

  async createOrUpdateDaDept(
    dataDept: any[],  
    dataDeptHis: any[],
    dataOrgCCtr: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 134;

    const xmlDocument =
      await this.generateXmlService.checkCreateOrUpdateDaDept(dataDept);
    const query = `
      EXEC _SHRDeptCheck_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 888,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;

    try {
      const dataCheckDaDept = await this.databaseService.executeQuery(query);

      if (dataCheckDaDept.length !== 0 && dataCheckDaDept[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckDaDept[0]?.Result ?? 'Error occurred during the check.',
        };
      }
      const xmlDocumentCreateDaDept =
        await this.generateXmlService.createOrUpdateDaDept(dataCheckDaDept);

      const querySaveDaDept = `
          EXEC _SHRDeptSave_Web
            @xmlDocument = N'${xmlDocumentCreateDaDept}',
            @xmlFlags = 2,
            @ServiceSeq = 888,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataSaveDaDept =
        await this.databaseService.executeQuery(querySaveDaDept);

      const xmlDocumentDeptHis = await this.generateXmlService.checkDeptHis(
        dataDeptHis,
        dataSaveDaDept[0]?.DeptSeq,
      );
      const queryCheckDeptHis = `
          EXEC _SHRDeptHistCheck_Web
            @xmlDocument = N'${xmlDocumentDeptHis}',
            @xmlFlags = 2,
            @ServiceSeq = 937,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataCheckDeptHis =
        await this.databaseService.executeQuery(queryCheckDeptHis);

      if (dataCheckDeptHis.length !== 0 && dataCheckDeptHis[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckDeptHis[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveDeptHis =
        await this.generateXmlService.saveDeptHis(dataCheckDeptHis);
      const querySaveDeptHis = `
          EXEC _SHRDeptHistSave_Web
            @xmlDocument = N'${xmlDocumentSaveDeptHis}',
            @xmlFlags = 2,
            @ServiceSeq = 937,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataSaveDeptHis =
        await this.databaseService.executeQuery(querySaveDeptHis);

      const xmlDocumentOrgDept = await this.generateXmlService.checkOrgDeptCCtr(
        dataOrgCCtr,
        dataSaveDaDept[0]?.DeptSeq,
      );
      const queryCheckOrgDept = `
          EXEC _SHROrgDeptCCtrCheck_Web
            @xmlDocument = N'${xmlDocumentOrgDept}',
            @xmlFlags = 2,
            @ServiceSeq = 943,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataCheckOrgDept =
        await this.databaseService.executeQuery(queryCheckOrgDept);

      if (dataCheckOrgDept.length !== 0 && dataCheckOrgDept[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckOrgDept[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveOrgDept =
        await this.generateXmlService.saveOrgDeptCCtr(dataCheckOrgDept);
      const querySaveOrgDept = `
          EXEC _SHROrgDeptCCtrSave_Web
            @xmlDocument = N'${xmlDocumentSaveOrgDept}',
            @xmlFlags = 2,
            @ServiceSeq = 943,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataSaveOrgDept =
        await this.databaseService.executeQuery(querySaveOrgDept);

      return {
        success: true,
        data: { dataSaveDaDept, dataSaveDeptHis, dataSaveOrgDept },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  getDeptHis(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getDeptHis(result);
    const query = `
      EXEC _SHRDeptHistQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 937,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 134;
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

  getDeptCCtr(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getDeptCCtr(result);
    const query = `
      EXEC _SHROrgDeptCCtrQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 943,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 134;
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

  async deleteDeptHis(
    dataDeptHis: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      const pgmSeq = 134;
      const xmlDocumentDeptHis = await this.generateXmlService.checkDeptHis(
        dataDeptHis,
        '',
      );
      const queryCheckDeptHis = `
        EXEC _SHRDeptHistCheck_Web
          @xmlDocument = N'${xmlDocumentDeptHis}',
          @xmlFlags = 2,
          @ServiceSeq = 937,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const dataCheckDeptHis =
        await this.databaseService.executeQuery(queryCheckDeptHis);

      if (dataCheckDeptHis.length !== 0 && dataCheckDeptHis[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckDeptHis[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveDeptHis =
        await this.generateXmlService.saveDeptHis(dataCheckDeptHis);
      const querySaveDeptHis = `
        EXEC _SHRDeptHistSave_Web
          @xmlDocument = N'${xmlDocumentSaveDeptHis}',
          @xmlFlags = 2,
          @ServiceSeq = 937,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const dataSaveDeptHis =
        await this.databaseService.executeQuery(querySaveDeptHis);

      return {
        success: true,
        data: { dataSaveDeptHis },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteDeptOrg(
    dataOrgCCtr: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      const pgmSeq = 134;
      const xmlDocumentOrgDept = await this.generateXmlService.checkOrgDeptCCtr(
        dataOrgCCtr,
        '',
      );
      const queryCheckOrgDept = `
          EXEC _SHROrgDeptCCtrCheck_Web
            @xmlDocument = N'${xmlDocumentOrgDept}',
            @xmlFlags = 2,
            @ServiceSeq = 943,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataCheckOrgDept =
        await this.databaseService.executeQuery(queryCheckOrgDept);

      if (dataCheckOrgDept.length !== 0 && dataCheckOrgDept[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckOrgDept[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveOrgDept =
        await this.generateXmlService.saveOrgDeptCCtr(dataCheckOrgDept);
      const querySaveOrgDept = `
          EXEC _SHROrgDeptCCtrSave_Web
            @xmlDocument = N'${xmlDocumentSaveOrgDept}',
            @xmlFlags = 2,
            @ServiceSeq = 943,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataSaveOrgDept =
        await this.databaseService.executeQuery(querySaveOrgDept);
      return {
        success: true,
        data: { dataSaveOrgDept },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }
}
