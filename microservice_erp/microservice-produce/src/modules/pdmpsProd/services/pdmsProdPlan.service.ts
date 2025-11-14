import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { SimpleQueryResult2, SimpleQueryResult } from '../interface/request';
@Injectable()
export class PdmsProdPlanService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }



    SPDMPSProdPlanStockQuery(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDMPSProdPlanStockQuery(result);
        const query = `
            EXEC _SPDMPSProdPlanStockQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 5295,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 5987;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }
    SPDMPSProdPlanQuery(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument1 = this.generateXmlService.generateXMLSPDMPSProdPlanQuery(result);
        const query1 = this.buildQuery('_SPDMPSProdPlanQuery_WEB', xmlDocument1, companySeq, userSeq, 5295);

        return this.databaseService.executeQueryVer02(query1).pipe(
            switchMap(resultQuery1 => this.runSupplementQueries(resultQuery1, companySeq, userSeq)),
            catchError(error => of({
                success: false,
                message: error.message || ERROR_MESSAGES.DATABASE_ERROR
            }))
        );
    }

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
            @PgmSeq = 5987;
        `;
    }

    private runSupplementQueries(
        resultQuery1: any[],
        companySeq: number,
        userSeq: number
    ): Observable<SimpleQueryResult> {
        const xmlDocument2 = this.generateXmlService.generateXMLSCOMConfirmQuery(resultQuery1);
        const xmlDocument3 = this.generateXmlService.generateXMLSCOMSourceDailyQuery(resultQuery1);

        const query2 = this.buildQuery('_SCOMConfirmQuery_WEB', xmlDocument2, companySeq, userSeq, 2609);
        const query3 = this.buildQuery('_SCOMSourceDailyQuery_WEB', xmlDocument3, companySeq, userSeq, 3181);

        return forkJoin([
            of(resultQuery1),
            this.databaseService.executeQueryVer02(query2),
            this.databaseService.executeQueryVer02(query3),
        ]).pipe(
            map(([data1, data2, data3]) => {
                const merged = this.mergeData(data1, data2, data3);
                return { success: true, data: merged };
            })
        );
    }

    private mergeData(
        data1: any[],
        data2: any[],
        data3: any[]
    ): any[] {
        return data1.map(item1 => {
            const prodPlanSeq = item1.ProdPlanSeq;
            const item2 = data2.find(d => d.CfmSeq === prodPlanSeq) || {};
            const item3 = data3.find(d => d.ToSeq === prodPlanSeq) || {};

            return {
                ...item1,
                ...item2,
                ...item3,
                IsSaved: item2?.CfmCode ?? null,
            };
        });
    }






    private SPDMPSProdPlanConfirm(
        result: any,
        companySeq: number,
        userSeq: number,
        deptSeq: number,
        workingTag: string
    ): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const pgmSeq = 5987;

        const xml1 = this.generateXmlService.generateXMLSCOMConfirm(result, workingTag);

        const query = `
            EXEC _SCOMConfirm_WEB2
                @xmlDocument = N'${xml1}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2609,
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map((res: any[]) => {
                const errors = res.filter(r => r.Status !== 0);
                if (errors.length > 0) {
                    throw {
                        success: false,
                        step: 'Confirm',
                        errors: errors.map(e => ({
                            IDX_NO: e.IDX_NO,
                            Name: e.LotNo,
                            result: e.Result,
                        }))
                    };
                }

                return {
                    success: true,
                    message: 'Xác nhận thành công!',
                    data: res
                };
            }),
            catchError((err) => of(err))
        );
    }


    private AutoCheck(
        result: any,
        companySeq: number,
        userSeq: number,
        deptSeq: number,
        workingTag: string
    ): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const pgmSeq = 5987;
        const xml1 = this.generateXmlService.generateXMLSCOMGetCloseType(result, workingTag);

        const query1 = `
                EXEC _SCOMGetCloseTypeQuery_WEB
                @xmlDocument = N'${xml1}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 4960,
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;

        const xml2 = this.generateXmlService.generateXMLSCOMCloseCheck(result, workingTag);
        const query2 = `
                EXEC _SCOMCloseCheck_WEB
                @xmlDocument = N'${xml2}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2639,
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;

        const xml3 = this.generateXmlService.generateXMLSCOMConfirmDelete(result, workingTag);
        const query3 = `
                EXEC _SCOMConfirmDelete_WEB
                @xmlDocument = N'${xml3}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2609,
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;

        const xml4 = this.generateXmlService.generateXMLSPDMPSProdPlan(result, workingTag);
        const query4 = `
                EXEC _SPDMPSProdPlanCheck_WEB
                @xmlDocument = N'${xml4}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 5295,
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;
        let stepResults: { step: string; data: any[] }[] = [];
        return this.databaseService.executeQueryVer02(query1).pipe(
            switchMap((res1: any[]) => {
                console.log('⛳ Step 1 - Kết quả query1:', res1);
                stepResults.push({ step: 'Step 1', data: res1 });
                const err1 = res1.filter(r => r.Status !== 0);
                if (err1.length > 0) {
                    return throwError(() => ({
                        success: false,
                        step: 'Step 1',
                        errors: err1.map(e => ({
                            IDX_NO: e.IDX_NO,
                            Name: e.LotNo,
                            result: e.Result,
                        }))
                    }));
                }

                return this.databaseService.executeQueryVer02(query2);
            }),
            switchMap((res2: any[]) => {
                const err2 = res2.filter(r => r.Status !== 0);
                if (err2.length > 0) {
                    return throwError(() => ({
                        success: false,
                        step: 'Step 2',
                        errors: err2.map(e => ({
                            IDX_NO: e.IDX_NO,
                            Name: e.LotNo,
                            result: e.Result,
                        }))
                    }));
                }

                return this.databaseService.executeQueryVer02(query3);
            }),
            switchMap((res3: any[]) => {
                const err3 = res3.filter(r => r.Status !== 0);
                if (err3.length > 0) {
                    return throwError(() => ({
                        success: false,
                        step: 'Step 3',
                        errors: err3.map(e => ({
                            IDX_NO: e.IDX_NO,
                            Name: e.LotNo,
                            result: e.Result,
                        }))
                    }));
                }

                return this.databaseService.executeQueryVer02(query4);
            }),
            switchMap((res4: any[]) => {
                const err4 = res4.filter(r => r.Status !== 0);
                if (err4.length > 0) {
                    return throwError(() => ({
                        success: false,
                        step: 'Step 4',
                        errors: err4.map(e => ({
                            IDX_NO: e.IDX_NO,
                            Name: e.LotNo,
                            result: e.Result,
                        }))
                    }));
                }

                const xmlSave1 = this.generateXmlService.generateXMLSPDMPSProdPlan(res4, workingTag);
                const querySave1 = `
                        EXEC _SPDMPSProdPlanSave_WEB
                        @xmlDocument = N'${xmlSave1}',
                        @xmlFlags = ${xmlFlags},
                        @ServiceSeq = 5295,
                        @WorkingTag = N'${workingTag}',
                        @CompanySeq = ${companySeq},
                        @LanguageSeq = ${languageSeq},
                        @UserSeq = ${userSeq},
                        @PgmSeq = ${pgmSeq};
                    `;

                const xmlSave2 = this.generateXmlService.generateXMLSCOMSourceDailySave(res4, workingTag);
                const querySave2 = `
                        EXEC _SCOMSourceDailySave_WEB
                        @xmlDocument = N'${xmlSave2}',
                        @xmlFlags = ${xmlFlags},
                        @ServiceSeq = 5295,
                        @WorkingTag = N'${workingTag}',
                        @CompanySeq = ${companySeq},
                        @LanguageSeq = ${languageSeq},
                        @UserSeq = ${userSeq},
                        @PgmSeq = ${pgmSeq};
                    `;

                const xmlSave3 = this.generateXmlService.generateXMLSPDMPSProdPlanWorkOrderSaveNotCapa(res4, workingTag);
                const querySave3 = `
                        EXEC _SPDMPSProdPlanWorkOrderSaveNotCapa_WEB
                        @xmlDocument = N'${xmlSave3}',
                        @xmlFlags = ${xmlFlags},
                        @ServiceSeq = 5295,
                        @WorkingTag = N'${workingTag}',
                        @CompanySeq = ${companySeq},
                        @LanguageSeq = ${languageSeq},
                        @UserSeq = ${userSeq},
                        @PgmSeq = ${pgmSeq};
                    `;

                const xmlSave4 = this.generateXmlService.generateXMLConfirmCreate(res4, workingTag);
                const querySave4 = `
                        EXEC _SCOMConfirmCreate_WEB
                        @xmlDocument = N'${xmlSave4}',
                        @xmlFlags = ${xmlFlags},
                        @ServiceSeq = 2609,
                        @WorkingTag = N'${workingTag}',
                        @CompanySeq = ${companySeq},
                        @LanguageSeq = ${languageSeq},
                        @UserSeq = ${userSeq},
                        @PgmSeq = ${pgmSeq};
                    `;

                return this.databaseService.executeQueryVer02(querySave1).pipe(
                    switchMap(resSave1 => {
                        return this.databaseService.executeQueryVer02(querySave2).pipe(
                            switchMap(resSave2 => {
                                return this.databaseService.executeQueryVer02(querySave3).pipe(
                                    switchMap(resSave3 => {
                                        return this.databaseService.executeQueryVer02(querySave4).pipe(
                                            map(resSave4 => ({
                                                success: true,
                                                message: 'Tất cả các bước kiểm tra đều thành công và các bước lưu dữ liệu đã được thực hiện.',
                                                data: [
                                                    resSave1,
                                                    resSave2,
                                                    resSave3,
                                                    resSave4
                                                ]
                                            }))
                                        );
                                    })
                                );
                            })
                        );
                    })
                );
            }),
            catchError((err) => {
                return of(err);
            })
        );
    }



    private SPDMPSProdPlanSemiGoodCrt(
        result: any,
        companySeq: number,
        userSeq: number,
        deptSeq: number,
        workingTag: string
    ): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const pgmSeq = 5987;

        const xml1 = this.generateXmlService.generateXMLSPDMPSProdPlanSemiGoodCrt(result, workingTag);

        const query = `
            EXEC _SPDMPSProdPlanSemiGoodCrt_WEB
                @xmlDocument = N'${xml1}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 5295,
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            switchMap((res: any[]) => {
                const updatedRes = res.map((item, index) => ({
                    ...item,
                    IDX_NO: item.IDX_NO ?? index + 1
                }));

                const hasStatus = res.some(r => r.hasOwnProperty('Status'));

                if (hasStatus) {
                    const errors = res.filter(r => r.Status !== 0);
                    if (errors.length > 0) {
                        return throwError(() => ({
                            success: false,
                            step: 'Confirm',
                            errors: errors.map(e => ({
                                IDX_NO: e.IDX_NO,
                                Name: e.LotNo,
                                result: e.Result,
                            }))
                        }));
                    }
                }


                return this.AutoCheck(updatedRes, companySeq, userSeq, deptSeq, 'A').pipe(
                    map(autoCheckedResult => ({
                        success: true,
                        message: 'success',
                        data: updatedRes
                    }))
                );
            }),
            catchError((err) => {
                
                return of(err);
            })
        );

    }


    AutoCheckA(result: any, companySeq: number, userSeq: number, deptSeq: number): Observable<SimpleQueryResult2> {
        return this.AutoCheck(result, companySeq, userSeq, deptSeq, 'A');
    }

    AutoCheckD(result: any, companySeq: number, userSeq: number, deptSeq: number): Observable<SimpleQueryResult2> {
        return this.AutoCheck(result, companySeq, userSeq, deptSeq, 'D');
    }
    AutoCheckU(result: any, companySeq: number, userSeq: number, deptSeq: number): Observable<SimpleQueryResult2> {
        return this.AutoCheck(result, companySeq, userSeq, deptSeq, 'U');
    }


    SPDMPSProdPlanConfirmCheck(result: any, companySeq: number, userSeq: number, deptSeq: number): Observable<SimpleQueryResult2> {
        return this.SPDMPSProdPlanConfirm(result, companySeq, userSeq, deptSeq, 'A');
    }
    SPDMPSProdPlanSemiGoodCrtCheck(result: any, companySeq: number, userSeq: number, deptSeq: number): Observable<SimpleQueryResult2> {
        return this.SPDMPSProdPlanSemiGoodCrt(result, companySeq, userSeq, deptSeq, 'A');
    }



}
