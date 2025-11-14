import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class ScanPdmmOutProcService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) { }

  _SCOMSourceDailyJumpQuery(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument =
      this.generateXmlService.generateXMLSCOMSourceDailyJumpQuery(result);

    // Query 1
    const query = `
            EXEC _SCOMSourceDailyJumpQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 3185,
            @WorkingTag = N'L',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1571;
        `;

    // Chạy query 1 trước
    return this.databaseService.executeQueryVer02(query).pipe(
      switchMap((resultQuery) => {
        // Tạo XML từ kết quả query 1
        const xmlDocument2 =
          this.generateXmlService.generateXMLSPDMMOutProcItemQuery(resultQuery);

        // Query 2
        const query2 = `
                    EXEC _SPDMMOutProcItemQuery_WEB
                    @xmlDocument = N'${xmlDocument2}',
                    @xmlFlags = 2,
                    @ServiceSeq = 60010007,
                    @WorkingTag = N'L',
                    @CompanySeq = ${companySeq},
                    @LanguageSeq = 6,
                    @UserSeq = ${userSeq},
                    @PgmSeq = 1571;
                `;

        // Chạy query 2
        return this.databaseService.executeQueryVer02(query2);
      }),

      map((finalResult) => ({ success: true, data: finalResult })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  SPDMMOutReqItemList(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument =
      this.generateXmlService.generateXMLSPDMMOutReqItemList(result);
    const query = `
        EXEC _SPDMMOutReqSheetQuery_WEB 
          @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 3027,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1571;
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
  SPDMMOutProcItemQuery(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument =
      this.generateXmlService.generateXMLSPDMMOutProcItemQueryQ(result);
    const query = `
        EXEC _SPDMMOutProcItemQuery_WEB 
          @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 60010007,
            @WorkingTag = N'Q',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 5671;
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

  SMaterialQRStockOutCheck(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlDocument =
      this.generateXmlService.generateXMLSMaterialQRStockOutCheck(result);
    const query = `
            EXEC _SMaterialStockOutQRCheck_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 60010003,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1036085;
        `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery: any) => {
        if (!resultQuery || resultQuery.length === 0) {
          return { success: false, message: 'No data returned' };
        }

        const invalidStatuses = resultQuery.some(
          (item: any) => item.Status !== 0,
        );
        if (invalidStatuses) {
          const errorMessages = resultQuery
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.LotNo,
              result: item.Result,
            }));

          return { success: false, errors: errorMessages };
        }
        return { success: true, data: resultQuery };
      }),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }
  CheckLogsTFIFOTemp(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const query = `
            EXEC GetTFIFOTempData_WEB
            @OutReqSeq = ${result.OutReqSeq},
            @LotNo = N'${result.LotNo}',
            @ItemSeq = ${result.ItemSeq};
           
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
  DCheckLogsTFIFOTemp(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {

    console.log('result', result)
    const query = `
            EXEC DeleteTFIFOTempData_WEB
            @SeqList = N'${result}'
        `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: result })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  /* SAVE */
  async SLGStockOutSave(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<any> {

    console.log('dataMaster', dataMaster)
    const xmlFlags = 2;
    const languageSeq = 6;
    const tempArray = dataSheetAUD.map((item) => item.TempSeq);

    const generateClose = (xmlDocument: string, procedure: string) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2639,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;

    const generateSPDMMOutProc = (xmlDocument: string, procedure: string) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 60010007,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038,
                @IsStop= ${dataMaster[0].IsStop},
                @OutReqSeq = ${dataMaster[0].OutReqSeq};
        `;
    const generateSPDMMOutProcCheck = (
      xmlDocument: string,
      procedure: string,
    ) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 60010007,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;
    const generateInOutDailyBatch = (
      xmlDocument: string,
      procedure: string,
    ) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2619,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;
    const generateSourceDailySave = (
      xmlDocument: string,
      procedure: string,
    ) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 3181,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;

    // Function to handle the check for invalid statuses
    const checkInvalidStatus = (resultCheck: any[], procedureName: string) => {
      const invalidStatuses = resultCheck.some(
        (item: any) => item.Status !== 0,
      );
      if (invalidStatuses) {
        return {
          success: false,
          procedure: procedureName,
          errors: resultCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ItemName,
              result: item.Result,
            })),
        };
      }
      return { success: true, resultCheck };
    };

    try {
      const xmlDocumentCloseCheck =
        await this.generateXmlService.generateSCOMCloseCheck(
          dataMaster[0],
          'A',
        );
      const queryCloseCheck = generateClose(
        xmlDocumentCloseCheck,
        '_SCOMCloseCheck_WEB',
      );
      const resultCloseCheck =
        await this.databaseService.executeQuery(queryCloseCheck);

      const checkCloseCheck = checkInvalidStatus(
        resultCloseCheck,
        '_SCOMCloseCheck_WEB',
      );
      if (!checkCloseCheck.success) {
        return checkCloseCheck;
      }

      if (
        !checkCloseCheck.resultCheck ||
        checkCloseCheck.resultCheck.length === 0
      ) {
        return {
          success: false,
          errors: [{ message: 'No results found in SPDMMOutProcCheck.' }],
        };
      }
      const statusFlag =
        dataMaster[0]?.MatOutNo && dataMaster[0]?.MatOutSeq ? 'U' : 'A';
      const xmlDocumentSPDMMOutProcCheck =
        await this.generateXmlService.generateSPDMMOutProcCheck(
          dataMaster[0],
          checkCloseCheck.resultCheck[0],
          statusFlag,
        );
      const querySPDMMOutProcCheck = generateSPDMMOutProcCheck(
        xmlDocumentSPDMMOutProcCheck,
        '_SPDMMOutProcCheck_WEB',
      );
      const resultSPDMMOutProcCheck = await this.databaseService.executeQuery(
        querySPDMMOutProcCheck,
      );

      const checkSPDMMOutProcCheck = checkInvalidStatus(
        resultSPDMMOutProcCheck,
        '_SPDMMOutProcCheck_WEB',
      );
      if (!checkSPDMMOutProcCheck.success) {
        return checkSPDMMOutProcCheck;
      }
      if (
        !checkSPDMMOutProcCheck.resultCheck ||
        checkSPDMMOutProcCheck.resultCheck.length === 0
      ) {
        return {
          success: false,
          errors: [{ message: 'No results found in SPDMMOutProcCheck.' }],
        };
      }
      const xmlDocumentSPDMMOutProcItemCheck =
        await this.generateXmlService.generateSPDMMOutProcItemCheck(
          dataSheetAUD,
          checkSPDMMOutProcCheck.resultCheck[0],
          'A',
        );
      const querySPDMMOutProcItemCheck = generateSPDMMOutProcCheck(
        xmlDocumentSPDMMOutProcItemCheck,
        '_SPDMMOutProcItemCheck_WEB',
      );
      const resultSPDMMOutProcItemCheck =
        await this.databaseService.executeQuery(querySPDMMOutProcItemCheck);

      const checkSPDMMOutProcItemCheck = checkInvalidStatus(
        resultSPDMMOutProcItemCheck,
        '_SPDMMOutProcItemCheck_WEB',
      );
      if (!checkSPDMMOutProcItemCheck.success) {
        return checkSPDMMOutProcItemCheck;
      }

      /* SAVE */

      if (
        !checkSPDMMOutProcItemCheck.resultCheck ||
        checkSPDMMOutProcItemCheck.resultCheck.length === 0
      ) {
        return {
          success: false,
          errors: [{ message: 'No results found in SPDMMOutProcCheck.' }],
        };
      }
      const xmlDocumentSPDMMOutProcSave =
        await this.generateXmlService.generateSPDMMOutProcCheck(
          dataMaster[0],
          checkSPDMMOutProcCheck.resultCheck[0],
          statusFlag,
        );
      const querySPDMMOutProcSave = generateSPDMMOutProc(
        xmlDocumentSPDMMOutProcSave,
        '_SPDMMOutProcSave_WEB',
      );
      const resultSPDMMOutProcSave = await this.databaseService.executeQuery(
        querySPDMMOutProcSave,
      );

      const checkSPDMMOutProcSave = checkInvalidStatus(
        resultSPDMMOutProcSave,
        '_SPDMMOutProcSave_WEB',
      );
      if (!checkSPDMMOutProcSave.success) {
        return checkSPDMMOutProcSave;
      }
      const xmlDocumentSPDMMOutProcItemSave =
        await this.generateXmlService.generateSPDMMOutProcItemSave(
          checkSPDMMOutProcItemCheck.resultCheck,
          checkSPDMMOutProcCheck.resultCheck[0],
          'A',
        );
      const querySPDMMOutProcItemSave = generateSPDMMOutProcCheck(
        xmlDocumentSPDMMOutProcItemSave,
        '_SPDMMOutProcItemSave_WEB',
      );
      const resultSPDMMOutProcItemSave =
        await this.databaseService.executeQuery(querySPDMMOutProcItemSave);

      const checkSPDMMOutProcItemSave = checkInvalidStatus(
        resultSPDMMOutProcItemSave,
        '_SPDMMOutProcItemSave_WEB',
      );
      if (!checkSPDMMOutProcItemSave.success) {
        return checkSPDMMOutProcItemSave;
      }

      const xmlDocumentSLGInOutDailyBatchSave =
        await this.generateXmlService.generateSLGInOutDailyBatch(
          checkSPDMMOutProcCheck.resultCheck[0],
          statusFlag,
        );
      const querySLGInOutDailyBatchSave = generateInOutDailyBatch(
        xmlDocumentSLGInOutDailyBatchSave,
        '_SLGInOutDailyBatch_WEB',
      );
      const resultSLGInOutDailyBatchSave =
        await this.databaseService.executeQuery(querySLGInOutDailyBatchSave);

      const checkSLGInOutDailyBatchSave = checkInvalidStatus(
        resultSLGInOutDailyBatchSave,
        '_SLGInOutDailyBatch_WEB',
      );
      if (!checkSLGInOutDailyBatchSave.success) {
        return checkSLGInOutDailyBatchSave;
      }

      const dataSheetAUDUpdateSerl = checkSPDMMOutProcItemCheck.resultCheck.map(
        (item) => {
          const matchingResult = dataSheetAUD.find(
            (data) => data.IDX_NO === item.IdxNo,
          );
          return {
            ...item,
            InOutReqItemSerl: matchingResult
              ? matchingResult.InOutReqItemSerl
              : item.InOutReqItemSerl,
          };
        },
      );
      const xmlDocumentSCOMSourceDailySave =
        await this.generateXmlService.generateSCOMSourceDailySave(
          dataSheetAUDUpdateSerl,
          'A',
        );
      const querySCOMSourceDailySave = generateSourceDailySave(
        xmlDocumentSCOMSourceDailySave,
        '_SCOMSourceDailySave_WEB',
      );
      const resultSCOMSourceDailySave = await this.databaseService.executeQuery(
        querySCOMSourceDailySave,
      );

      const checkSCOMSourceDailySave = checkInvalidStatus(
        resultSCOMSourceDailySave,
        '_SCOMSourceDailySave_WEB',
      );
      if (!checkSCOMSourceDailySave.success) {
        return checkSCOMSourceDailySave;
      }
      const DCheckLogsTFIFOTemp = await this.DCheckLogsTFIFOTemp(
        tempArray,
        companySeq,
        userSeq,
      ).toPromise();
      if (!DCheckLogsTFIFOTemp.success) {
        return DCheckLogsTFIFOTemp;
      }
      return {
        success: true,
        results: {
          closeCheck: checkCloseCheck.resultCheck,
          spdmmOutProcCheck: checkSPDMMOutProcCheck.resultCheck,
          spdmmOutProcItemCheck: checkSPDMMOutProcItemCheck.resultCheck,
          spdmmOutProcSave: checkSPDMMOutProcSave.resultCheck,
          slgInOutDailyBatch: checkSLGInOutDailyBatchSave.resultCheck,
          SCOMSourceDailySave: checkSCOMSourceDailySave.resultCheck,
          checkSPDMMOutProcItem: checkSPDMMOutProcItemSave.resultCheck,
          DCheckLogsTFIFOTemp: DCheckLogsTFIFOTemp.data,
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ message: 'An error occurred during the process.' }],
      };
    }
  }

  async SLGStockOutDelete(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const generateClose = (xmlDocument: string, procedure: string) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2639,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;

    const generateSPDMMOutProc = (xmlDocument: string, procedure: string) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 60010007,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038,
                @IsStop= ${dataMaster[0].IsStop},
                @OutReqSeq = ${dataMaster[0].OutReqSeq};
        `;
    const generateSPDMMOutProcCheck = (
      xmlDocument: string,
      procedure: string,
    ) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 60010007,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;
    const generateInOutDailyItem = (xmlDocument: string, procedure: string) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2619,
                @WorkingTag = N'D',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;
    const generateSourceDailySave = (
      xmlDocument: string,
      procedure: string,
    ) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 3181,
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;

    // Function to handle the check for invalid statuses
    const checkInvalidStatus = (resultCheck: any[], procedureName: string) => {
      const invalidStatuses = resultCheck.some(
        (item: any) => item.Status !== 0,
      );
      if (invalidStatuses) {
        return {
          success: false,
          procedure: procedureName,
          errors: resultCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ItemName,
              result: item.Result,
            })),
        };
      }
      return { success: true, resultCheck };
    };

    try {
      const xmlDocumentCloseCheck =
        await this.generateXmlService.generateSCOMCloseCheckD(
          dataMaster[0],
          'U',
        );
      const queryCloseCheck = generateClose(
        xmlDocumentCloseCheck,
        '_SCOMCloseCheck_WEB',
      );
      const resultCloseCheck =
        await this.databaseService.executeQuery(queryCloseCheck);

      const checkCloseCheck = checkInvalidStatus(
        resultCloseCheck,
        '_SCOMCloseCheck_WEB',
      );
      if (!checkCloseCheck.success) {
        return checkCloseCheck;
      }

      if (
        !checkCloseCheck.resultCheck ||
        checkCloseCheck.resultCheck.length === 0
      ) {
        return {
          success: false,
          errors: [{ message: 'No results found in SPDMMOutProcCheck.' }],
        };
      }

      const xmlDocumentSPDMMOutProcItemCheck =
        await this.generateXmlService.generateSPDMMOutProcItemCheckD(
          dataSheetAUD,
          'D',
        );
      const querySPDMMOutProcItemCheck = generateSPDMMOutProcCheck(
        xmlDocumentSPDMMOutProcItemCheck,
        '_SPDMMOutProcItemCheck_WEB',
      );
      const resultSPDMMOutProcItemCheck =
        await this.databaseService.executeQuery(querySPDMMOutProcItemCheck);

      const checkSPDMMOutProcItemCheck = checkInvalidStatus(
        resultSPDMMOutProcItemCheck,
        '_SPDMMOutProcItemCheck_WEB',
      );
      if (!checkSPDMMOutProcItemCheck.success) {
        return checkSPDMMOutProcItemCheck;
      }

      /* SAVE */

      if (
        !checkSPDMMOutProcItemCheck.resultCheck ||
        checkSPDMMOutProcItemCheck.resultCheck.length === 0
      ) {
        return {
          success: false,
          errors: [{ message: 'No results found in SPDMMOutProcCheck.' }],
        };
      }

      const xmlDocumentSPDMMOutProcItemSave =
        await this.generateXmlService.generateSPDMMOutProcItemSaveD(
          checkSPDMMOutProcItemCheck.resultCheck,
          'D',
        );
      const querySPDMMOutProcItemSave = generateSPDMMOutProcCheck(
        xmlDocumentSPDMMOutProcItemSave,
        '_SPDMMOutProcItemSave_WEB',
      );
      const resultSPDMMOutProcItemSave =
        await this.databaseService.executeQuery(querySPDMMOutProcItemSave);

      const checkSPDMMOutProcItemSave = checkInvalidStatus(
        resultSPDMMOutProcItemSave,
        '_SPDMMOutProcItemSave_WEB',
      );
      if (!checkSPDMMOutProcItemSave.success) {
        return checkSPDMMOutProcItemSave;
      }

      const xmlDocumentSLGInOutDailyItemSave =
        await this.generateXmlService.generateSLGInOutDailyItemSave(
          dataSheetAUD,
          'D',
        );
      const querySLGInOutDailyItemSave = generateInOutDailyItem(
        xmlDocumentSLGInOutDailyItemSave,
        '_SLGInOutDailyItemSave_WEB',
      );
      const resultSLGInOutDailyItemSave =
        await this.databaseService.executeQuery(querySLGInOutDailyItemSave);

      const checkSLGInOutDailyItemSave = checkInvalidStatus(
        resultSLGInOutDailyItemSave,
        '_SLGInOutDailyItemSave_WEB',
      );
      if (!checkSLGInOutDailyItemSave.success) {
        return checkSLGInOutDailyItemSave;
      }

      const xmlDocumentSCOMSourceDailySave =
        await this.generateXmlService.generateSCOMSourceDailySaveD(
          dataSheetAUD,
          'D',
        );
      const querySCOMSourceDailySave = generateSourceDailySave(
        xmlDocumentSCOMSourceDailySave,
        '_SCOMSourceDailySave_WEB',
      );
      const resultSCOMSourceDailySave = await this.databaseService.executeQuery(
        querySCOMSourceDailySave,
      );

      const checkSCOMSourceDailySave = checkInvalidStatus(
        resultSCOMSourceDailySave,
        '_SCOMSourceDailySave_WEB',
      );
      if (!checkSCOMSourceDailySave.success) {
        return checkSCOMSourceDailySave;
      }

      return {
        success: true,
        results: {
          closeCheck: checkCloseCheck.resultCheck,
          spdmmOutProcItemCheck: checkSPDMMOutProcItemCheck.resultCheck,
          slgInOutDailyItem: checkSLGInOutDailyItemSave.resultCheck,
          SCOMSourceDailySave: checkSCOMSourceDailySave.resultCheck,
          checkSPDMMOutProcItem: checkSPDMMOutProcItemSave.resultCheck,
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ message: 'An error occurred during the process.' }],
      };
    }
  }

  async SLGStockOutMaster(
    dataMaster: any[],
    dataSheetAUD: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const generateClose = (xmlDocument: string, procedure: string) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2639,
                @WorkingTag = N'D',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;

    const generateSPDMMOutProc = (xmlDocument: string, procedure: string) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 60010007,
                @WorkingTag = N'D',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038,
                @IsStop= ${dataMaster[0].IsStop},
                @OutReqSeq = ${dataMaster[0].OutReqSeq};
        `;
    const generateSPDMMOutProcCheck = (
      xmlDocument: string,
      procedure: string,
    ) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 60010007,
                @WorkingTag = N'D',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;
    const generateInOutDailyBatch = (
      xmlDocument: string,
      procedure: string,
    ) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2619,
                @WorkingTag = N'D',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;
    const generateSourceDailySave = (
      xmlDocument: string,
      procedure: string,
    ) => `
            EXEC ${procedure}
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 3181,
                @WorkingTag = N'D',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = 1038;
        `;

    // Function to handle the check for invalid statuses
    const checkInvalidStatus = (resultCheck: any[], procedureName: string) => {
      const invalidStatuses = resultCheck.some(
        (item: any) => item.Status !== 0,
      );
      if (invalidStatuses) {
        return {
          success: false,
          procedure: procedureName,
          errors: resultCheck
            .filter((item: any) => item.Status !== 0)
            .map((item: any) => ({
              IDX_NO: item.IDX_NO,
              Name: item.ItemName,
              result: item.Result,
            })),
        };
      }
      return { success: true, resultCheck };
    };

    try {
      const xmlDocumentCloseCheck =
        await this.generateXmlService.generateSCOMCloseCheckD(
          dataMaster[0],
          'D',
        );
      const queryCloseCheck = generateClose(
        xmlDocumentCloseCheck,
        '_SCOMCloseCheck_WEB',
      );
      const resultCloseCheck =
        await this.databaseService.executeQuery(queryCloseCheck);

      const checkCloseCheck = checkInvalidStatus(
        resultCloseCheck,
        '_SCOMCloseCheck_WEB',
      );
      if (!checkCloseCheck.success) {
        return checkCloseCheck;
      }

      if (
        !checkCloseCheck.resultCheck ||
        checkCloseCheck.resultCheck.length === 0
      ) {
        return {
          success: false,
          errors: [{ message: 'No results found in SPDMMOutProcCheck.' }],
        };
      }


      const xmlDocumentSPDMMOutProcCheck =
        await this.generateXmlService.generateSPDMMOutProcCheckD(
          dataMaster[0],
          'D',
        );
      const querySPDMMOutProcCheck = generateSPDMMOutProcCheck(
        xmlDocumentSPDMMOutProcCheck,
        '_SPDMMOutProcCheck_WEB',
      );
      const resultSPDMMOutProcCheck = await this.databaseService.executeQuery(
        querySPDMMOutProcCheck,
      );

      const checkSPDMMOutProcCheck = checkInvalidStatus(
        resultSPDMMOutProcCheck,
        '_SPDMMOutProcCheck_WEB',
      );
      if (!checkSPDMMOutProcCheck.success) {
        return checkSPDMMOutProcCheck;
      }
      if (
        !checkSPDMMOutProcCheck.resultCheck ||
        checkSPDMMOutProcCheck.resultCheck.length === 0
      ) {
        return {
          success: false,
          errors: [{ message: 'No results found in SPDMMOutProcCheck.' }],
        };
      }
      const xmlDocumentSPDMMOutProcItemCheck =
        await this.generateXmlService.generateSPDMMOutProcItemCheckD(
          dataSheetAUD,
          'D',
        );
      const querySPDMMOutProcItemCheck = generateSPDMMOutProcCheck(
        xmlDocumentSPDMMOutProcItemCheck,
        '_SPDMMOutProcItemCheck_WEB',
      );
      const resultSPDMMOutProcItemCheck =
        await this.databaseService.executeQuery(querySPDMMOutProcItemCheck);

      const checkSPDMMOutProcItemCheck = checkInvalidStatus(
        resultSPDMMOutProcItemCheck,
        '_SPDMMOutProcItemCheck_WEB',
      );
      if (!checkSPDMMOutProcItemCheck.success) {
        return checkSPDMMOutProcItemCheck;
      }

      /* SAVE */

      if (
        !checkSPDMMOutProcItemCheck.resultCheck ||
        checkSPDMMOutProcItemCheck.resultCheck.length === 0
      ) {
        return {
          success: false,
          errors: [{ message: 'No results found in SPDMMOutProcCheck.' }],
        };
      }
      const xmlDocumentSPDMMOutProcSave =
        await this.generateXmlService.generateSPDMMOutProcCheckD(
          dataMaster[0],
          'D',
        );
      const querySPDMMOutProcSave = generateSPDMMOutProc(
        xmlDocumentSPDMMOutProcSave,
        '_SPDMMOutProcSave_WEB',
      );
      const resultSPDMMOutProcSave = await this.databaseService.executeQuery(
        querySPDMMOutProcSave,
      );

      const checkSPDMMOutProcSave = checkInvalidStatus(
        resultSPDMMOutProcSave,
        '_SPDMMOutProcSave_WEB',
      );
      if (!checkSPDMMOutProcSave.success) {
        return checkSPDMMOutProcSave;
      }
      const xmlDocumentSPDMMOutProcItemSave =
        await this.generateXmlService.generateSPDMMOutProcItemSaveD(
          checkSPDMMOutProcItemCheck.resultCheck,
          'D',
        );
      const querySPDMMOutProcItemSave = generateSPDMMOutProcCheck(
        xmlDocumentSPDMMOutProcItemSave,
        '_SPDMMOutProcItemSave_WEB',
      );
      const resultSPDMMOutProcItemSave =
        await this.databaseService.executeQuery(querySPDMMOutProcItemSave);

      const checkSPDMMOutProcItemSave = checkInvalidStatus(
        resultSPDMMOutProcItemSave,
        '_SPDMMOutProcItemSave_WEB',
      );
      if (!checkSPDMMOutProcItemSave.success) {
        return checkSPDMMOutProcItemSave;
      }

      const xmlDocumentSLGInOutDailyBatchSave =
        await this.generateXmlService.generateSLGInOutDailyBatch(
          checkSPDMMOutProcCheck.resultCheck[0],
          'D',
        );
      const querySLGInOutDailyBatchSave = generateInOutDailyBatch(
        xmlDocumentSLGInOutDailyBatchSave,
        '_SLGInOutDailyBatch_WEB',
      );
      const resultSLGInOutDailyBatchSave =
        await this.databaseService.executeQuery(querySLGInOutDailyBatchSave);

      const checkSLGInOutDailyBatchSave = checkInvalidStatus(
        resultSLGInOutDailyBatchSave,
        '_SLGInOutDailyBatch_WEB',
      );
      if (!checkSLGInOutDailyBatchSave.success) {
        return checkSLGInOutDailyBatchSave;
      }

      const xmlDocumentSCOMSourceDailySave =
        await this.generateXmlService.generateSCOMSourceDailySaveD(
          dataSheetAUD,
          'D',
        );
      const querySCOMSourceDailySave = generateSourceDailySave(
        xmlDocumentSCOMSourceDailySave,
        '_SCOMSourceDailySave_WEB',
      );
      const resultSCOMSourceDailySave = await this.databaseService.executeQuery(
        querySCOMSourceDailySave,
      );

      const checkSCOMSourceDailySave = checkInvalidStatus(
        resultSCOMSourceDailySave,
        '_SCOMSourceDailySave_WEB',
      );
      if (!checkSCOMSourceDailySave.success) {
        return checkSCOMSourceDailySave;
      }

      return {
        success: true,
        results: {
          closeCheck: checkCloseCheck.resultCheck,
          spdmmOutProcCheck: checkSPDMMOutProcCheck.resultCheck,
          spdmmOutProcItemCheck: checkSPDMMOutProcItemCheck.resultCheck,
          spdmmOutProcSave: checkSPDMMOutProcSave.resultCheck,
          slgInOutDailyBatch: checkSLGInOutDailyBatchSave.resultCheck,
          SCOMSourceDailySave: checkSCOMSourceDailySave.resultCheck,
          checkSPDMMOutProcItem: checkSPDMMOutProcItemSave.resultCheck,
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ message: 'An error occurred during the process.' }],
      };
    }
  }
}
