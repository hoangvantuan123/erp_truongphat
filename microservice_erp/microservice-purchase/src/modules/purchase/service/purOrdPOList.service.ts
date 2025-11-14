import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

@Injectable()
export class PurOrdPOListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  async SPUORDPOListQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUORDPOListQueryWEB(result);
    const query = `
  EXEC _SPUORDPOListQuery_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 2135,
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

  async SCOMConfirmWEBPO(
    result: any[],
    companySeq: number,
    userSeq: number,
    workingTag: string,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2609;
    const languageSeq = 6;
    const pgmSeq = 1132;

    const generateQuery = (xmlDocument: string, procedure: string) => `
      EXEC ${procedure}
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = ${xmlFlags},
        @ServiceSeq = ${serviceSeq},
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = ${languageSeq},
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq},
        @Reason = N'${result[0].Reason}';
    `;

    const checkResult = async () => {
      try {
        const xmlDocumentCheck =
          await this.generateXmlService.generateXMLSCOMConfirmWEBPO(result);
        const queryCheck = generateQuery(xmlDocumentCheck, '_SCOMConfirm_WEB');
        const resultCheck = await this.databaseService.executeQuery(queryCheck);
        const invalidStatuses = resultCheck.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidStatuses) {
          const errorMessages = resultCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.CfmSeq,
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

    try {
      const check = await checkResult();
      return check;
      //return await saveResult(check.data);
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }

  async SPOStopWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    workingTag: string,
  ): Promise<SimpleQueryResult2> {
    const xmlFlags = 2;
    const serviceSeq = 2135;
    const languageSeq = 6;
    const pgmSeq = 1132;

    const generateQuery = (xmlDocument: string, procedure: string) => `
      EXEC ${procedure}
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = ${xmlFlags},
        @ServiceSeq = ${serviceSeq},
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = ${languageSeq},
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq},
        @Reason = N'${result[0].Reason}';
        
    `;

    const checkResult = async () => {
      try {
        const xmlDocumentCheck =
          await this.generateXmlService.generateXMLPOStopWEB(result);
        const queryCheck = generateQuery(
          xmlDocumentCheck,
          '_SPUORDPOStop_WEB',
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
              Name: item.LotNo,
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

    try {
      const check = await checkResult();
      return check;
    } catch (error) {
      return {
        success: false,
        errors: [error.message || ERROR_MESSAGES.DATABASE_ERROR],
      };
    }
  }
}
