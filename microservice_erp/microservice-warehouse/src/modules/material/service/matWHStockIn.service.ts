import { ConsoleLogger, Injectable } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

@Injectable()
export class MatWHStockInService {
  constructor(private readonly databaseService: DatabaseService, private readonly generateXmlService: GenerateXmlService) { }

  async ITM_SPDMatWHStockInList_WEB(blSeq: number, blSerl: number): Promise<SimpleQueryResult> {
    const query = `
      EXEC ITM_SPDMatWHStockInList_WEB 
        @pBLSeq = ${blSeq},
        @pBLSerl = '${blSerl}';
    `;
    try {
      const result = await this.databaseService.executeQuery(query);

      if (result.length !== 0) {
        return { success: true, data: result };
      } else {
        return { success: false, message: ERROR_MESSAGES.WARNING_HOLD_BARCODE };
      }
    } catch (error) {
      return { success: false, message: ERROR_MESSAGES.DATABASE_ERROR };
    }
  }

  /* ĐẦU API CHECK ALL cho _SCOMCloseCheck_WEB  && _SCOMCloseItemCheck_WEB && _SSLImpDelvMasterCheck_WEB  && _SSLImpDelvSheetCheck_WEB */
  private async _executeProcedure(
        procedureName: string,
        xmlDocument: string,
        xmlFlags: number,
        serviceSeq: number,
        workingTag: string,
        companySeq: number,
        languageSeq: number,
        userSeq: number,
        pgmSeq: number
    ): Promise<any[]> {
        const escapedXmlDocument = xmlDocument.replace(/'/g, "''");
        const query = `
            EXEC ${procedureName} 
                @xmlDocument = N'<ROOT> ${escapedXmlDocument} </ROOT>',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = ${serviceSeq},
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
        `;
        return await this.databaseService.executeQuery(query);
    }


  /* SAVE */

  async checkAllProceduresMatWHStockIn(
    procedureData: { name: string; xmlDocument: string; serviceSeq: number }[],
    xmlFlags: number,
    workingTag: string,
    languageSeq: number,
    pgmSeq: number,
    dataSave: any[],
    decodedToken: any
  ): Promise<SimpleQueryResult> {
    try {
      const userCheck = await this.databaseService.findAuthCheckUser(
        decodedToken?.UserId,
        decodedToken?.EmpSeq,
        decodedToken?.UserSeq
    );

    if (!userCheck || userCheck.length === 0) {
        return { success: false, message: `User not found.` };
    }
      const errors: string[] = [];
      const data: any[] = [];
      let masterCheckResult: any[] | null = null;

      const executeProcedure = async (
        name: string,
        xmlDocument: string,
        serviceSeq: number
    ): Promise<any> => {
        try {
            const result = await this._executeProcedure(
                name,
                xmlDocument,
                xmlFlags,
                serviceSeq,
                workingTag,
                decodedToken.CompanySeq,
                languageSeq,
                decodedToken.UserSeq,
                pgmSeq
            );

            if (result.some((item: any) => item.Status !== 0)) {
                errors.push(result.map((item: any) => `${item.Result}`).join('; '));
            }
            return result;
        } catch (err) {
            const errorMessage = `Error executing procedure ${name}: ${err.message}`;
            errors.push(errorMessage);
            throw err;
        }
    };

      for (const { name, xmlDocument, serviceSeq } of procedureData) {
        try {
        let result: any;
        if (name === '_SLGInOutDailyCheck_WEB') {
          result = await executeProcedure(name, xmlDocument, serviceSeq);
          masterCheckResult = result;
        } else if (name === '_SLGInOutDailyItemCheck_WEB' && masterCheckResult) {
          const inOutSeq = masterCheckResult[0]?.InOutSeq;

          const updatedXmlDocument = xmlDocument.replace(
            /<DataBlock2>(.*?)<\/DataBlock2>/gs,
            (match) => match.replace(/<InOutSeq><\/InOutSeq>/, `<InOutSeq>${inOutSeq}</InOutSeq>`)
          );
        result = await executeProcedure(name, updatedXmlDocument, serviceSeq);
        } else {
          result = await executeProcedure(name, xmlDocument, serviceSeq);
        }
        data.push({ name, result });
      }
      catch (err) {
      console.error(`Failed to process procedure ${name}: ${err.message}`);
  }
      }

      if (errors.length > 0) {
        return { success: false, message: errors.join('; '), data };
      }

      const saveProcedure = async (name: string, result: any) => {
        switch (name) {
          case '_SLGInOutDailyCheck_WEB':
            return this._SLGInOutDailySave_WEB(
              result,
              xmlFlags,
              2619,
              workingTag,
              decodedToken.CompanySeq,
              languageSeq,
              decodedToken.UserSeq,
              pgmSeq,
              result[0]?.InOutNo
            );
          case '_SLGInOutDailyItemCheck_WEB': {
            const inOutSeq = result[0]?.InOutSeq;
            return Promise.all([
              this._SLGInOutDailyItemSave_WEB(
                dataSave,
                xmlFlags,
                2619,
                workingTag,
                decodedToken.CompanySeq,
                languageSeq,
                decodedToken.UserSeq,
                pgmSeq,
                inOutSeq
              ),
            ]);
          }
          default:
            return null;
        }
      };

      const saveResults = await Promise.all(
        data.map(async ({ name, result }) => {
          const saveResult = await saveProcedure(name, result);
          if (saveResult && !Array.isArray(saveResult) && !saveResult.success) {
            console.error(`Save procedure for ${name} failed: ${saveResult.message}`);
          }
          return saveResult;
        })
      );

      if (saveResults.some((res) => res && !Array.isArray(res) && !res.success)) {
        return { success: false, message: 'Some save procedures failed.', data };
      }
      return { success: true, message: 'All procedures executed successfully.', data };
    } catch (error) {
      return { success: false, message: ERROR_MESSAGES.DATABASE_ERROR, data: [] };
    }
  }

  /*_SSLImpDelvMasterSave_WEB  */
  async _SLGInOutDailySave_WEB(result: any[], xmlFlags: number, serviceSeq: number, workingTag: string, companySeq: number, languageSeq: number, userSeq: number, pgmSeq: number, SPInOutNo: any): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.generateXMLSLGInOutDailySave_WEB(result, SPInOutNo);
    const query = `
      EXEC _SLGInOutDailySave_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = ${xmlFlags},
        @ServiceSeq = ${serviceSeq},
        @WorkingTag = N'${workingTag}',
        @CompanySeq = ${companySeq},
        @LanguageSeq = ${languageSeq},
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
    `;
    try {
      const result = await this.databaseService.executeQuery(query);
      return { success: true, data: query };
    } catch (error) {
      return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
    }
  }
  /*  _SSLImpDelvSheetSave_WEB*/
  async _SLGInOutDailyItemSave_WEB(result: any[], xmlFlags: number, serviceSeq: number, workingTag: string, companySeq: number, languageSeq: number, userSeq: number, pgmSeq: number, SPInOutSeq: any): Promise<SimpleQueryResult> {
    const xmlDocument = await this.generateXmlService.generateXMLSLGInOutDailyItemSave_WEB(result, SPInOutSeq);
    const query = `
      EXEC _SLGInOutDailyItemSave_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = ${xmlFlags},
        @ServiceSeq = ${serviceSeq},
        @WorkingTag = N'${workingTag}',
        @CompanySeq = ${companySeq},
        @LanguageSeq = ${languageSeq},
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq},
        @pBlSeq = ${result[0]?.BLSeq},
        @pBLSerl = ${result[0]?.BLSerl};
    `;
    try {
      const result = await this.databaseService.executeQuery(query);
      return { success: true, data: query };
    } catch (error) {
      return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
    }
  }

}
