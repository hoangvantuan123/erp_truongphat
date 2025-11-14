import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { SimpleQueryResult2, SimpleQueryResult } from '../interface/request';
@Injectable()
export class PdsfcWorkReportService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }
    private buildQuery(
        procName: string,
        xml: string,
        companySeq: number,
        userSeq: number,
        serviceSeq: number
    ): string {
        return `
            EXEC ${procName}
            @xmlDocument = N'${xml}',
            @xmlFlags = 2,
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;
    }

    private runSupplementQueries(
        resultQuery1: any[],
        companySeq: number,
        userSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument2 = this.generateXmlService.generateXMLSCOMSourceDailyQ(resultQuery1);

        const query2 = this.buildQuery('_SCOMSourceDailyQuery_WEB', xmlDocument2, companySeq, userSeq, 3181);

        return forkJoin([
            of(resultQuery1),
            this.databaseService.executeQueryVer02(query2),
        ]).pipe(
            map(([data1, data2]) => {
                const merged = this.mergeData(data1, data2);
                return { success: true, data: merged };
            })
        );
    }

    private mergeData(
        data1: any[],
        data2: any[],
    ): any[] {
        return data1.map(item1 => {
            const workReportSeq = item1.WorkReportSeq;
            const item2 = data2.find(d => d.ToSeq === workReportSeq) || {};

            return {
                ...item1,
                ...item2,
            };
        });
    }
    SPDSFCWorkReportQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument1 = this.generateXmlService.generateXMLSCOMSourceDailyQ2(result);
        const query1 = this.buildQuery('_SPDSFCWorkReportQuery_WEB', xmlDocument1, companySeq, userSeq, 2909);

        return this.databaseService.executeQueryVer02(query1).pipe(
            switchMap(resultQuery1 => this.runSupplementQueries(resultQuery1, companySeq, userSeq)),
            catchError(error => of({
                success: false,
                message: error.message || ERROR_MESSAGES.DATABASE_ERROR
            }))
        );
    }





    SCOMSourceDailyQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSCOMSourceDailyQ(result);
        const query = `
            EXEC _SCOMSourceDailyQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 3181,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }
    SPDSFCWorkReportMatQCheck(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        console.log('result', result)
        const xmlDocument = this.generateXmlService.generateXMLSPDSFCWorkReportMatQCheck(result);
        const query = `
            EXEC _SPDSFCWorkReportMatQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2909,
            @WorkingTag = N'S',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }
    SPDSFCWorkReportMatQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDSFCWorkReportMatQ(result);
        const query = `
            EXEC _SPDSFCWorkReportMatQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2909,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }
    SPDSFCWorkReportToolQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDSFCWorkReportToolQ(result);
        const query = `
            EXEC _SPDSFCWorkReportToolQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2909,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }
    SPDSFCWorkReportWorkEmpQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDSFCWorkReportWorkEmpQuery(result);

        const queryMain = `
            EXEC _SPDSFCWorkReportWorkEmpQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2909,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;

        const queryHelp = `
            EXEC dbo._SCACodeHelpComboQuery_WEB
            @WorkingTag = '',
            @LanguageSeq = 6,
            @CodeHelpSeq = 19999,
            @CompanySeq = ${companySeq},
            @Keyword = '%',
            @Param1 = '6015',
            @Param2 = '',
            @Param3 = '',
            @Param4 = '';
        `;

        return forkJoin([
            this.databaseService.executeQueryVer02(queryMain),
            this.databaseService.executeQueryVer02(queryHelp)
        ]).pipe(
            map(([mainData, helpData]) => {
                const helpDataMap = new Map(helpData.map(item => [item.Value, item.MinorName]));

                const enrichedData = mainData.map(row => {
                    const code = row.UMWorkCenterEmpType;
                    row.UMWorkCenterEmpName = code ? helpDataMap.get(code) || '' : '';
                    return row;
                });

                return { success: true, data: enrichedData };
            }),
            catchError(error => of({
                success: false,
                message: error.message || ERROR_MESSAGES.DATABASE_ERROR
            }))
        );
    }

    SPDSFCWorkReportNonWorkQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDSFCWorkReportNonWorkQ(result);
        const query = `
            EXEC _SPDSFCWorkReportNonWorkQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2909,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }
    SLGInOutDailyQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSLGInOutDailyQuery(result);
        const query = `
            EXEC _SLGInOutDailyQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2619,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }

    SLGInOutDailyItemQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSLGInOutDailyItemQ(result);
        const query = `
            EXEC _SLGInOutDailyItemQuery_WEB2
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2619,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1015;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }



    private AutoCheck(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;

        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
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

        const xmlDoc1 = this.generateXmlService.generateXMLSCOMCloseCheck(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SCOMCloseCheck', 2639, 1015);

        const xmlDoc2 = this.generateXmlService.generateXMLSCOMCloseItemCheck(result, workingTag);
        const query2 = generateQuery(xmlDoc2, '_SCOMCloseItemCheck', 2639, 1015);

        const xmlDoc3 = this.generateXmlService.generateXMLSPDSFCWorkReportCheck(result, workingTag);
        const query3 = generateQuery(xmlDoc3, '_SPDSFCWorkReportCheck', 2909, 1015);

        const xmlDoc4 = this.generateXmlService.generateXMLSLGLotNoMasterCheck(result, workingTag);
        const query4 = generateQuery(xmlDoc4, '_SLGLotNoMasterCheck2', 4422, 1015);

        return forkJoin([
            from(this.databaseService.executeQuery(query1)),
            from(this.databaseService.executeQuery(query2)),
            from(this.databaseService.executeQuery(query3)),
            from(this.databaseService.executeQuery(query4))
        ]).pipe(
            switchMap(([data1, data2, data3, data4]) => {
                const results = [data1, data2, data3, data4];

                for (const data of results) {
                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            errors: data
                                .filter((item: any) => item.Status !== 0)
                                .map((item: any) => ({
                                    IDX_NO: item.IDX_NO,
                                    Name: item.ItemName,
                                    result: item.Result,
                                })),
                        });
                    }
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSLGLotNoMasterCheck(data4, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SLGLotNoMasterSave2', 4422, 1015);

                const saveXmlDoc2 = this.generateXmlService.generateXMLSPDSFCWorkReportCheck(data3, workingTag);
                const saveQuery2 = generateQuery(saveXmlDoc2, '_SPDSFCWorkReportSave', 2909, 1015);

                const saveXmlDoc3 = this.generateXmlService.generateXMLSCOMSourceDailySave(result, workingTag);
                const saveQuery3 = generateQuery(saveXmlDoc3, '_SCOMSourceDailySave', 3181, 1015);

                const saveXmlDoc4 = this.generateXmlService.generateXMLSLGInOutDailyBatch(data3, workingTag);
                const saveQuery4 = generateQuery(saveXmlDoc4, '_SLGInOutDailyBatch', 2619, 1015);

                return forkJoin([
                    from(this.databaseService.executeQuery(saveQuery1)),
                    from(this.databaseService.executeQuery(saveQuery2)),
                    from(this.databaseService.executeQuery(saveQuery3)),
                    from(this.databaseService.executeQuery(saveQuery4))
                ]).pipe(
                    map(([saveData1, saveData2, saveData3, saveData4]) => {
                        const saveResults = [saveData1, saveData2, saveData3, saveData4];

                        for (const data of saveResults) {
                            const hasInvalid = data.some((item: any) => item.Status !== 0);
                            if (hasInvalid) {
                                return {
                                    success: false,
                                    errors: data
                                        .filter((item: any) => item.Status !== 0)
                                        .map((item: any) => ({
                                            IDX_NO: item.IDX_NO,
                                            Name: item.ItemName,
                                            result: item.Result,
                                        })),
                                };
                            }
                        }

                        return {
                            success: true,
                            data: {
                                logs1: saveData1,
                                logs2: saveData2,
                                logs3: saveData3,
                                logs4: saveData4,
                            }
                        };
                    })
                );
            }),
            catchError((err) => {
                return of(err);
            })
        );
    }



    AutoCheckAUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheck(result, companySeq, userSeq, result[0].WorkingTag);
    }


    private AutoCheck2(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
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

        const xmlDoc1 = this.generateXmlService.generateXMLSCOMCloseItemSub(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SCOMCloseItemSubCheck', 2639, 1015);

        const xmlDoc2 = this.generateXmlService.generateXMLSPDSFCWorkReportMat(result, workingTag);
        const query2 = generateQuery(xmlDoc2, '_SPDSFCWorkReportMatCheck', 2909, 1015);


        return forkJoin([
            from(this.databaseService.executeQuery(query1)),
            from(this.databaseService.executeQuery(query2)),
        ]).pipe(
            switchMap(([data1, data2]) => {
                const results = [data1, data2];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra đơn hàng"] });
                    }

                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            errors: data.filter((item: any) => item.Status !== 0).map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                            })),
                        });
                    }
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSPDSFCWorkReportMat(data2, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SPDSFCWorkReportMatSave', 2909, 1015);

                const saveXmlDoc2 = this.generateXmlService.generateXMLSLGInOutDailyItemSubSave(data2, workingTag);
                const saveQuery2 = generateQuery(saveXmlDoc2, '_SLGInOutDailyItemSubSave', 2619, 1015);


                return forkJoin([
                    from(this.databaseService.executeQuery(saveQuery1)),
                    from(this.databaseService.executeQuery(saveQuery2)),

                ]).pipe(
                    map(([saveData1, saveData2]) => {
                        for (const data of [saveData1, saveData2]) {
                            const invalidItems = data?.filter((item: any) => item.Status !== 0) || [];

                            if (invalidItems.length) {
                                const isInvalidFormat = invalidItems.some(
                                    (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                                );

                                if (isInvalidFormat) {
                                    return {
                                        success: false,
                                        errors: [{
                                            IDX_NO: 1,
                                            Name: 'Lỗi',
                                            result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                        }],
                                    };
                                }

                                return {
                                    success: false,
                                    errors: invalidItems.map((item: any) => ({
                                        IDX_NO: item.IDX_NO,
                                        Name: item.ItemName,
                                        result: item.Result,
                                    })),
                                };
                            }
                        }

                        return {
                            success: true,
                            data: {
                                logs1: saveData1,
                                logs2: saveData2,

                            }
                        };
                    })
                );
            }),
            catchError((err) => of({ success: false, error: err.message || err }))
        );
    }

    AutoCheck2AUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheck2(result, companySeq, userSeq, result[0].WorkingTag);
    }



    private AutoCheck3(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
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

        const xmlDoc1 = this.generateXmlService.generateXMLSPDSFCWorkReportWorkEmp(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SPDSFCWorkReportWorkEmpCheck', 2909, 1015);

        return forkJoin([
            from(this.databaseService.executeQuery(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra đơn hàng"] });
                    }

                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            errors: data.filter((item: any) => item.Status !== 0).map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                            })),
                        });
                    }
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSPDSFCWorkReportWorkEmp(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SPDSFCWorkReportWorkEmpSave', 2909, 1015);



                return forkJoin([
                    from(this.databaseService.executeQuery(saveQuery1)),

                ]).pipe(
                    map(([saveData1]) => {
                        for (const data of [saveData1]) {
                            const invalidItems = data?.filter((item: any) => item.Status !== 0) || [];

                            if (invalidItems.length) {
                                const isInvalidFormat = invalidItems.some(
                                    (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                                );

                                if (isInvalidFormat) {
                                    return {
                                        success: false,
                                        errors: [{
                                            IDX_NO: 1,
                                            Name: 'Lỗi',
                                            result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                        }],
                                    };
                                }

                                return {
                                    success: false,
                                    errors: invalidItems.map((item: any) => ({
                                        IDX_NO: item.IDX_NO,
                                        Name: item.ItemName,
                                        result: item.Result,
                                    })),
                                };
                            }
                        }
                        return {
                            success: true,
                            data: {
                                logs1: saveData1,

                            }
                        };
                    })
                );
            }),
            catchError((err) => {
                return of(err);
            })
        );
    }

    AutoCheck3AUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheck3(result, companySeq, userSeq, result[0].WorkingTag);
    }



    private AutoCheck4(result: any[], header: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlCheckLotNo = this.generateXmlService.generateXMLSLGLotNoMaster(result, workingTag);
        const queryCheckLotNo = generateQuery(xmlCheckLotNo, '_SLGLotNoMasterCheck2', 9326, 1015);

        return from(this.databaseService.executeQuery(queryCheckLotNo)).pipe(
            switchMap((data1) => {
                if (!data1?.length) {
                    return of({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra đơn hàng"] });
                }

                const saveXmlLotNo = this.generateXmlService.generateXMLSLGLotNoMaster(data1, workingTag);
                const saveQueryLotNo = generateQuery(saveXmlLotNo, '_SLGLotNoMasterSave', 9326, 1015);

                return from(this.databaseService.executeQuery(saveQueryLotNo)).pipe(
                    switchMap((saveLotNoResult) => {
                        const xmlCheckInOut = this.generateXmlService.generateXMLSLGInOutDaily2([header], header?.WorkingTag);
                        const queryCheckInOut = generateQuery(xmlCheckInOut, '_SLGInOutDailyCheck', 2619, 1015);

                        return from(this.databaseService.executeQuery(queryCheckInOut)).pipe(
                            switchMap((data2) => {
                                if (!data2?.length) {
                                    return of({ success: false, errors: ["Không có dữ liệu trả về _SLGInOutDailyCheck."] });
                                }

                                const xmlCheckItem = this.generateXmlService.generateXMLSLGInOutDailyItem2(result, workingTag, data2[0], header);
                                const queryCheckItem = generateQuery(xmlCheckItem, '_SLGInOutDailyItemCheck', 2619, 1015);

                                return from(this.databaseService.executeQuery(queryCheckItem)).pipe(
                                    switchMap((data3) => {
                                        const results = [data1, data2, data3];

                                        for (const data of results) {
                                            if (!data?.length) {
                                                return of({ success: false, errors: ["Không có dữ liệu trả về _SLGInOutDailyItemCheck"] });
                                            }

                                            const invalidItems = data.filter((item: any) => item.Status !== 0);
                                            if (invalidItems.length > 0) {
                                                return of({
                                                    success: false,
                                                    errors: invalidItems.map((item: any) => ({
                                                        IDX_NO: item.IDX_NO,
                                                        Name: item.ItemName,
                                                        result: item.Result,
                                                    })),
                                                });
                                            }
                                        }

                                        const saveXmlInOut = this.generateXmlService.generateXMLSLGInOutDaily2(data2, header?.WorkingTag);
                                        const saveQueryInOut = generateQuery(saveXmlInOut, '_SLGInOutDailySave', 2619, 1015);

                                        return from(this.databaseService.executeQuery(saveQueryInOut)).pipe(
                                            switchMap((saveInOutResult) => {
                                                const saveXmlItem = this.generateXmlService.generateXMLSLGInOutDailySave2(data3, workingTag);
                                                const saveQueryItem = generateQuery(saveXmlItem, '_SLGInOutDailyItemSave', 2619, 1015);

                                                return from(this.databaseService.executeQuery(saveQueryItem)).pipe(
                                                    switchMap((saveItemResult) => {
                                                        const saveXmlEtc = this.generateXmlService.generateXMLSPDSFCWorkReportSubEtcSave(data3, header?.WorkingTag, result[0]?.WorkReportSeq);
                                                        const saveQueryEtc = generateQuery(saveXmlEtc, '_SPDSFCWorkReportSubEtcSave', 2909, 1015);

                                                        return from(this.databaseService.executeQuery(saveQueryEtc)).pipe(
                                                            map((saveEtcResult) => {
                                                                for (const data of [saveInOutResult, saveItemResult, saveEtcResult]) {
                                                                    const invalidItems = data?.filter((item: any) => item.Status !== 0) || [];

                                                                    if (invalidItems.length) {
                                                                        const isInvalidFormat = invalidItems.some(
                                                                            (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                                                                        );

                                                                        if (isInvalidFormat) {
                                                                            return {
                                                                                success: false,
                                                                                errors: [{
                                                                                    IDX_NO: 1,
                                                                                    Name: 'Lỗi',
                                                                                    result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                                                                }],
                                                                            };
                                                                        }

                                                                        return {
                                                                            success: false,
                                                                            errors: invalidItems.map((item: any) => ({
                                                                                IDX_NO: item.IDX_NO,
                                                                                Name: item.ItemName,
                                                                                result: item.Result,
                                                                            })),
                                                                        };
                                                                    }
                                                                }

                                                                return {
                                                                    success: true,
                                                                    data: {
                                                                        logs1: saveInOutResult,
                                                                        logs2: saveItemResult,
                                                                        logs3: saveEtcResult,
                                                                    }
                                                                };
                                                            })
                                                        );
                                                    })
                                                );
                                            })
                                        );
                                    })
                                );
                            })
                        );
                    })
                );
            }),
            catchError((err) => {
                return of({ success: false, errors: ['Đã xảy ra lỗi trong quá trình xử lý'], details: err });
            })
        );
    }



    AutoCheck4AUD(result: any, header: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheck4(result, header, companySeq, userSeq, result[0].WorkingTag);
    }


    private AutoCheck5(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
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

        const xmlDoc1 = this.generateXmlService.generateXMLSPDSFCWorkReportNonWork(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SPDSFCWorkReportNonWorkCheck', 2909, 1015);


        return forkJoin([
            from(this.databaseService.executeQuery(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra đơn hàng"] });
                    }

                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            errors: data.filter((item: any) => item.Status !== 0).map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                            })),
                        });
                    }
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSPDSFCWorkReportNonWork(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SPDSFCWorkReportNonWorkSave', 2909, 1015);



                return forkJoin([
                    from(this.databaseService.executeQuery(saveQuery1)),

                ]).pipe(
                    map(([saveData1]) => {

                        return {
                            success: true,
                            data: {
                                logs1: saveData1,

                            }
                        };
                    })
                );
            }),
            catchError((err) => {
                return of(err);
            })
        );
    }

    AutoCheck5AUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheck5(result, companySeq, userSeq, result[0].WorkingTag);
    }


    private AutoCheck4D(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlCheckInOut = this.generateXmlService.generateXMLSLGInOutDaily2(result, workingTag);
        const queryCheckInOut = generateQuery(xmlCheckInOut, '_SLGInOutDailyCheck', 2619, 1015);

        return from(this.databaseService.executeQuery(queryCheckInOut)).pipe(
            switchMap((data2) => {
                if (!data2?.length) {
                    return of({ success: false, errors: ["Không có dữ liệu trả về từ _SLGInOutDailyCheck"] });
                }

                const xmlCheckItem = this.generateXmlService.generateXMLSLGInOutDailyItemD(result, workingTag);
                const queryCheckItem = generateQuery(xmlCheckItem, '_SLGInOutDailyItemCheck', 2619, 1015);

                return from(this.databaseService.executeQuery(queryCheckItem)).pipe(
                    switchMap((data3) => {
                        const results = [data2, data3];
                        // Bước 5: Save In/Out
                        const saveXmlInOut = this.generateXmlService.generateXMLSLGInOutDaily2(data2, 'D');
                        const saveQueryInOut = generateQuery(saveXmlInOut, '_SLGInOutDailySave', 2619, 1015);

                        return from(this.databaseService.executeQuery(saveQueryInOut)).pipe(
                            switchMap((saveInOutResult) => {
                                // Bước 6: Save Item
                                const saveXmlItem = this.generateXmlService.generateXMLSLGInOutDailyItemSave();
                                const saveQueryItem = generateQuery(saveXmlItem, '_SLGInOutDailyItemSave', 2619, 1015);

                                return from(this.databaseService.executeQuery(saveQueryItem)).pipe(
                                    switchMap((saveItemResult) => {
                                        // Bước 7: Save ETC
                                        const saveXmlEtc = this.generateXmlService.generateXMLSPDSFCWorkReportSubEtcSave(data3, workingTag, result[0]?.WorkReportSeq);
                                        const saveQueryEtc = generateQuery(saveXmlEtc, '_SPDSFCWorkReportSubEtcSave', 2909, 1015);

                                        return from(this.databaseService.executeQuery(saveQueryEtc)).pipe(
                                            map((saveEtcResult) => {
                                                // Tổng kiểm tra lỗi sau cùng
                                                for (const data of [saveInOutResult, saveItemResult, saveEtcResult]) {
                                                    const invalidItems = data?.filter((item: any) => item.Status !== 0) || [];
                                                    if (invalidItems.length) {
                                                        return {
                                                            success: false,
                                                            errors: invalidItems.map((item: any) => ({
                                                                IDX_NO: item.IDX_NO,
                                                                Name: item.ItemName || 'N/A',
                                                                result: item.Result,
                                                            })),
                                                        };
                                                    }
                                                }

                                                return {
                                                    success: true,
                                                    data: {
                                                        logs1: saveInOutResult,
                                                        logs2: saveItemResult,
                                                        logs3: saveEtcResult,
                                                    }
                                                };
                                            })
                                        );
                                    })
                                );
                            })
                        );
                    })
                );
            }),
            catchError((err) => {
                console.error('AutoCheck4 Error:', err);
                return of({ success: false, errors: ['Đã xảy ra lỗi trong quá trình xử lý'], details: err });
            })
        );
    }
    private AutoCheck4DItem(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
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

        const xmlDoc1 = this.generateXmlService.generateXMLSLGInOutDailySave2(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SLGInOutDailyItemCheck', 2619, 1015);


        return forkJoin([
            from(this.databaseService.executeQuery(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra đơn hàng"] });
                    }

                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            errors: data.filter((item: any) => item.Status !== 0).map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                            })),
                        });
                    }
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSLGInOutDailySave2(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SLGInOutDailyItemSave', 2619, 1015);



                return forkJoin([
                    from(this.databaseService.executeQuery(saveQuery1)),

                ]).pipe(
                    map(([saveData1]) => {

                        return {
                            success: true,
                            data: {
                                logs1: saveData1,

                            }
                        };
                    })
                );
            }),
            catchError((err) => {
                return of(err);
            })
        );
    }
    AutoCheck4DD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheck4D(result, companySeq, userSeq, result[0].WorkingTag);
    }
    AutoCheck4DDItem(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheck4DItem(result, companySeq, userSeq, result[0].WorkingTag);
    }


}
