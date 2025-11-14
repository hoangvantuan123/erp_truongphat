import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { query } from 'express';

@Injectable()
export class CustomersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  async searchPage(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    console.log('result', result)
    const xmlDocument = await this.generateXmlService.searchBy(result);
    const query = `
      EXEC _SDACustInfoQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1599,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
    try {
      const result = await this.databaseService.executeQuery(query);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  /* A-U-D */
  private async AutoCheck(
    result: any[],
    companySeq: number,
    userSeq: number,
    workingTag: string,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 5199;
    const languageSeq = 6;
    const pgmSeq = 124;

    const generateQuery = (xmlDocument: string, procedure: string) => `
              EXEC ${procedure}_WEB
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = ${serviceSeq},
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;

    const checkResult = async () => {
      try {
        // const xmlDocumentCheck = await this.generateXmlService.generateXMLItem(result, workingTag);
        const queryCheck = generateQuery(
          'xmlDocumentCheck',
          '_SDAItemUploadCheck',
        );
        const resultCheck = await this.databaseService.executeQuery(queryCheck);

        const invalidStatuses = resultCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidStatuses) {
          const errorMessages = resultCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ItemName,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        return { success: true, data: resultCheck };
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    const saveResult = async (checkData: any[]) => {
      try {
        // const xmlDocumentSave = await this.generateXmlService.generateXMLItem(checkData, workingTag);
        const querySave = generateQuery(
          'xmlDocumentSave',
          '_SDAItemUploadSave',
        );
        const resultSave = await this.databaseService.executeQuery(querySave);
        return { success: true, data: resultSave };
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      const check = await checkResult();
      if (!check.success) {
        return check;
      }
      return await saveResult(check.data);
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }
  private async AutoCheckUpdate(
    result: any[],
    companySeq: number,
    userSeq: number,
    workingTag: string,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 7969;
    const languageSeq = 6;
    const pgmSeq = 124;

    const generateQuery = (xmlDocument: string, procedure: string) => `
              EXEC ${procedure}_WEB
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = ${serviceSeq},
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;

    const checkResult = async () => {
      try {
        const xmlDocumentCheck =
          await this.generateXmlService.generateXMLItemUpdate(
            result,
            workingTag,
          );
        const queryCheck = generateQuery(
          xmlDocumentCheck,
          '_SDAItemUpdateCheck',
        );
        const resultCheck = await this.databaseService.executeQuery(queryCheck);

        const invalidStatuses = resultCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidStatuses) {
          const errorMessages = resultCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ItemName,
              result: item.Result,
            }));
          return { success: false, errors: errorMessages };
        }
        return { success: true, data: resultCheck };
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    const saveResult = async (checkData: any[]) => {
      try {
        const xmlDocumentSave =
          await this.generateXmlService.generateXMLItemUpdate(
            checkData,
            workingTag,
          );
        const querySave = generateQuery(xmlDocumentSave, '_SDAItemUpdateSave');
        const resultSave = await this.databaseService.executeQuery(querySave);
        return { success: true, data: resultSave };
      } catch (error) {
        return {
          success: false,
          errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
        };
      }
    };

    try {
      const check = await checkResult();
      if (!check.success) {
        return check;
      }
      return await saveResult(check.data);
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async AutoCheckA(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    return this.AutoCheck(result, companySeq, userSeq, 'A');
  }

  async AutoCheckU(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    return this.AutoCheckUpdate(result, companySeq, userSeq, 'U');
  }

  async AutoCheckD(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    return this.AutoCheck(result, companySeq, userSeq, 'D');
  }

  async createdOrUpdateCustomers(
    result: any[],
    companySeq: number,
    userSeq: number,
    workingTag: any,
  ): Promise<SimpleQueryResult2> {
    try {
      const xmlDocumentCustCheck =
        await this.generateXmlService.generateXMLCustCheck(result, workingTag);

      const queryCustCheck = `
        exec _SDACustCheck_Web 
            @xmlDocument=N'${xmlDocumentCustCheck}',
            @xmlFlags=2,
            @ServiceSeq=1856,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;

      const resultCustCheck =
        await this.databaseService.executeQuery(queryCustCheck);

      // if (resultCustCheck[0].Status !== 0) {
      //   return { success: false, errors: [resultCustCheck[0].Result] };
      // }

      const xmlDocumentCustAddCheck =
        await this.generateXmlService.generateXMLCustAddCheck(
          resultCustCheck,
          workingTag,
        );

      const queryCustAddCheck = `
        exec _SDACustAddCheck_Web 
            @xmlDocument=N'${xmlDocumentCustAddCheck}',
            @xmlFlags=2,
            @ServiceSeq=1863,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustAddCheck =
        await this.databaseService.executeQuery(queryCustAddCheck);

      // if (resultCustAddCheck[0].Status !== 0) {
      //   return { success: false, errors: [resultCustAddCheck[0].Result] };
      // }

      const xmlDocumentCustClassCheck =
        await this.generateXmlService.generateXMLCustClassCheck(
          resultCustAddCheck,
          result,
          workingTag,
        );

      const queryCheckCustClassCheck = `
        EXEC _SDACustClassCheck_Web
            @xmlDocument=N'${xmlDocumentCustClassCheck}',
            @xmlFlags=2,
            @ServiceSeq=1865,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;

      const resultCustClassCheck = await this.databaseService.executeQuery(
        queryCheckCustClassCheck,
      );

      // if (resultCustClassCheck[0].Status !== 0) {
      //   return { success: false, errors: [resultCustClassCheck[0].Result] };
      // }

      const xmlDocumentCustUserDefineCheck =
        await this.generateXmlService.generateXMLCustUserDefineCheck(
          result,
          resultCustAddCheck,
          workingTag,
        );
      const queryCheckCustUserDefine = `
        EXEC _SDACustUserDefineCheck_Web 
            @xmlDocument=N'${xmlDocumentCustUserDefineCheck}',
            @xmlFlags=2,
            @ServiceSeq=5792,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213

        `;
      const resultCustUserDefineCheck = await this.databaseService.executeQuery(
        queryCheckCustUserDefine,
      );

      // if (resultCustUserDefineCheck[0].Status !== 0) {
      //   return {
      //     success: false,
      //     errors: [resultCustUserDefineCheck[0].Result],
      //   };
      // }

      const xmlDocumentCustKindSave =
        await this.generateXmlService.generateXMLCustKindSave(
          result,
          resultCustAddCheck,
          workingTag,
        );
      const queryCustKindSave = `
        exec _SDACustKindSave_Web 
            @xmlDocument=N'${xmlDocumentCustKindSave}',
            @xmlFlags=2,
            @ServiceSeq=1864,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;

      const resultCustKindSave =
        await this.databaseService.executeQuery(queryCustKindSave);

      const xmlDocumentCustActInfoSave =
        await this.generateXmlService.generateXMLCustActInfoSave(
          result,
          resultCustAddCheck,
          workingTag,
        );

      const queryCustActInfoSave = `
        exec _SDACustActInfoSave_Web 
            @xmlDocument=N'${xmlDocumentCustActInfoSave}',
            @xmlFlags=2,
            @ServiceSeq=1898,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustActInfoSave =
        await this.databaseService.executeQuery(queryCustActInfoSave);

      const xmlDocumentCustFileSave =
        await this.generateXmlService.generateXMLCustFileSave(
          result,
          resultCustAddCheck,
          workingTag,
        );
      const queryCustFileSave = `
        exec _SDACustFileSave_Web
            @xmlDocument=N'${xmlDocumentCustFileSave}',
            @xmlFlags=2,
            @ServiceSeq=8496,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;

      const resultCustFileSave =
        await this.databaseService.executeQuery(queryCustFileSave);

      const xmlDocumentCustRemarkSave =
        await this.generateXmlService.generateXMLCustRemarkSave(
          result,
          resultCustAddCheck,
          workingTag,
        );
      const queryCustRemarkSave = `
        exec _SDACustRemarkSave_Web 
            @xmlDocument=N'${xmlDocumentCustRemarkSave}',
            @xmlFlags=2,
            @ServiceSeq=1892,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;

      const resultCustRemarkSave =
        await this.databaseService.executeQuery(queryCustRemarkSave);

      const xmlDocumentCustSave =
        await this.generateXmlService.generateXMLCustSave(
          result,
          resultCustAddCheck,
          workingTag,
        );
      const queryCustSave = `
        exec _SDACustSave_Web 
            @xmlDocument=N'${xmlDocumentCustSave}',
            @xmlFlags=2,
            @ServiceSeq=1856,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;

      const resultCustSave =
        await this.databaseService.executeQuery(queryCustSave);

      const xmlDocumentCustAddSave =
        await this.generateXmlService.generateXMLCustAddSave(
          result,
          resultCustAddCheck,
          workingTag,
        );
      const queryCustAddSave = `
        exec _SDACustAddSave_Web 
            @xmlDocument=N'${xmlDocumentCustAddSave}',
            @xmlFlags=2,
            @ServiceSeq=1863,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;

      const resultCustAddSave =
        await this.databaseService.executeQuery(queryCustAddSave);

      const queryCustEmpInfoSave = `
        exec _SDACustEmpInfoSave_Web 
            @xmlDocument=N'<ROOT></ROOT>',
            @xmlFlags=2,
            @ServiceSeq=1893,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustEmpInfoSave =
        await this.databaseService.executeQuery(queryCustEmpInfoSave);

      const xmlDocumentCustClassSave =
        await this.generateXmlService.generateXMLCustClassSave(
          result,
          resultCustAddCheck,
          workingTag,
        );
      const queryCustClassSave = `
        exec _SDACustClassSave_Web 
            @xmlDocument=N'${xmlDocumentCustClassSave}',
            @xmlFlags=2,
            @ServiceSeq=1865,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustClassSave =
        await this.databaseService.executeQuery(queryCustClassSave);

      const xmlDocumentCustUserDefineSave =
        await this.generateXmlService.generateXMLCustUserDefineSave(
          result,
          resultCustAddCheck,
          workingTag,
        );
      const queryCustUserDefineSave = `
        exec _SDACustUserDefineSave_Web 
            @xmlDocument=N'${xmlDocumentCustUserDefineSave}',
            @xmlFlags=2,
            @ServiceSeq=5792,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustUserDefineSave = await this.databaseService.executeQuery(
        queryCustUserDefineSave,
      );

      return { success: true, data: resultCustSave };
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async getMasterInfo(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    try {
      const xmlDocumentCustCheck =
        await this.generateXmlService.generateXMLGetMasterInfo(
          result[0]?.CustSeq,
        );
      const queryCustCheck = `
        exec _SDACustQuery_Web 
            @xmlDocument=N'${xmlDocumentCustCheck}',
            @xmlFlags=2,
            @ServiceSeq=1856,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultMasterInfo =
        await this.databaseService.executeQuery(queryCustCheck);
      return { success: true, data: resultMasterInfo };
    } catch (exception) {
      return {
        success: false,
        errors: [exception.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async getCustBasicInfo(
    custSeq: any,
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    try {
      const xmlDocumentCustBasicInfo =
        await this.generateXmlService.generateXMLGetBasicInfo(custSeq);
      const queryCustBasicInfo = `
        exec _SDACustAddQuery 
            @xmlDocument=N'${xmlDocumentCustBasicInfo}',
            @xmlFlags=2,
            @ServiceSeq=1863,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustBasicInfo =
        await this.databaseService.executeQuery(queryCustBasicInfo);
      return { success: true, data: resultCustBasicInfo };
    } catch (exception) {
      return {
        success: false,
        errors: [exception.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async getCustBankInfo(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    try {
      const xmlDocumentCustBankInfo =
        await this.generateXmlService.generateXMLGetBankInfo(
          result[0]?.CustSeq,
        );
      const queryCustBankInfo = `
        exec _SDACustUserDefineQuery 
            @xmlDocument=N'${xmlDocumentCustBankInfo}',
            @xmlFlags=2,
            @ServiceSeq=5792,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustBasicInfo =
        await this.databaseService.executeQuery(queryCustBankInfo);
      return { success: true, data: resultCustBasicInfo };
    } catch (exception) {
      return {
        success: false,
        errors: [exception.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async getCustAddInfo(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    try {
      const xmlDocumentCustAddInfo =
        await this.generateXmlService.generateXMLGetCustAddInfo(
          result[0].CustSeq,
        );
      const queryCustAddInfo = `
        exec _SDACustAddQuery 
            @xmlDocument=N'${xmlDocumentCustAddInfo}',
            @xmlFlags=2,
            @ServiceSeq=1863,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustBasicInfo =
        await this.databaseService.executeQuery(queryCustAddInfo);
      return { success: true, data: resultCustBasicInfo };
    } catch (exception) {
      return {
        success: false,
        errors: [exception.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async getCustKindInfo(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    try {
      const xmlDocumentCustAddInfo =
        await this.generateXmlService.generateXMLGetCustKindInfo(
          result[0].CustSeq,
        );
      const queryCustAddInfo = `
        exec _SDACustKindQuery 
            @xmlDocument=N'${xmlDocumentCustAddInfo}',
            @xmlFlags=2,
            @ServiceSeq=1864,
            @WorkingTag=N'',
            @CompanySeq=${companySeq},
            @LanguageSeq=6,
            @UserSeq=${userSeq},
            @PgmSeq=1213
        `;
      const resultCustBasicInfo =
        await this.databaseService.executeQuery(queryCustAddInfo);
      return { success: true, data: resultCustBasicInfo };
    } catch (exception) {
      return {
        success: false,
        errors: [exception.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async getCustInfoQuery(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    try {
      const queryCustInfoQuery = `
        exec _SDACustInfoQuery @xmlDocument=N'<ROOT>
            <DataBlock1>
              <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <CustName />
              <CustNo />
              <BizNo />
              <MinorBizNo />
              <SMCustStatus />
              <UMCustKind />
              <Owner />
              <ChannelSeq />
              <PersonId2 />
              <Email />
            </DataBlock1>
          </ROOT>',
          @xmlFlags=2,
          @ServiceSeq=1599,
          @WorkingTag=N'',
          @CompanySeq=${companySeq},
          @LanguageSeq=6,
          @UserSeq=${userSeq},
          @PgmSeq=1217
        `;
      const resultCustInfoQuery =
        await this.databaseService.executeQuery(queryCustInfoQuery);

      return { success: true, data: resultCustInfoQuery };
    } catch (exception) {
      return {
        success: false,
        errors: [exception.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async getCustRemarkQuery(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult2> {
    try {
      const queryCustInfoQuery = `
        exec _SDACustRemarkQuery @xmlDocument=N'<ROOT>
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <CustSeq>${result[0]?.CustSeq}</CustSeq>
          </DataBlock1>
        </ROOT>',
        @xmlFlags=2,
        @ServiceSeq=1892,
        @WorkingTag=N'Q',
        @CompanySeq=${companySeq},
        @LanguageSeq=6,
        @UserSeq=${userSeq},
        @PgmSeq=1213
        `;
      const resultCustInfoQuery =
        await this.databaseService.executeQuery(queryCustInfoQuery);

      // console.log('resultCustInfoQuery0', resultCustInfoQuery[0]);
      // console.log('resultCustInfoQuery1', resultCustInfoQuery[1]);
      return { success: true, data: resultCustInfoQuery };
    } catch (exception) {
      return {
        success: false,
        errors: [exception.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }
}
