
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';
import { PayConditionService } from './payCondition.service';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class ProjectMgmtService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService,
        private readonly payConditionService: PayConditionService
    ) { }


    SPJTSupplyContractListQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPJTSupplyContractListQ(result);

        const query = `
             EXEC _SPJTSupplyContractListQuery
             @xmlDocument = N'${xmlDocument}',
             @xmlFlags = 2,
             @ServiceSeq = 2364,
             @WorkingTag = N'',
             @CompanySeq = 1,
             @LanguageSeq = 6,
             @UserSeq = ${userSeq},
             @PgmSeq = 2043;
         `;

        return from(this.dataSource.query(query)).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error =>
                of({
                    success: false,
                    message: error.message || ERROR_MESSAGES.DATABASE_ERROR
                })
            )
        );
    }
    SPJTSupplyContractQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPJTSupplyContractQ(result);

        const query = `
             EXEC _SPJTSupplyContractQuery
             @xmlDocument = N'${xmlDocument}',
             @xmlFlags = 2,
             @ServiceSeq = 2364,
             @WorkingTag = N'',
             @CompanySeq = 1,
             @LanguageSeq = 6,
             @UserSeq = ${userSeq},
             @PgmSeq = 2042;
         `;

        return from(this.dataSource.query(query)).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error =>
                of({
                    success: false,
                    message: error.message || ERROR_MESSAGES.DATABASE_ERROR
                })
            )
        );
    }
    SPJTSupplyContractResQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPJTSupplyContractResQ(result);

        const query = `
             EXEC _SPJTSupplyContractResQuery
             @xmlDocument = N'${xmlDocument}',
             @xmlFlags = 2,
             @ServiceSeq = 2372,
             @WorkingTag = N'',
             @CompanySeq = 1,
             @LanguageSeq = 6,
             @UserSeq = ${userSeq},
             @PgmSeq = 2042;
         `;

        return from(this.dataSource.query(query)).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error =>
                of({
                    success: false,
                    message: error.message || ERROR_MESSAGES.DATABASE_ERROR
                })
            )
        );
    }
    NotifiProjectQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const query = `
           EXEC NotifiProjectQ;
         `;

        return from(this.dataSource.query(query)).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error =>
                of({
                    success: false,
                    message: error.message || ERROR_MESSAGES.DATABASE_ERROR
                })
            )
        );
    }
    SPJTSupplyContractAmtListQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPJTSupplyContractAmtListQ(result);

        const query = `
             EXEC _SPJTSupplyContractAmtListQuery_WEB
             @xmlDocument = N'${xmlDocument}',
             @xmlFlags = 2,
             @ServiceSeq = 2364,
             @WorkingTag = N'',
             @CompanySeq = 1,
             @LanguageSeq = 6,
             @UserSeq = ${userSeq},
             @PgmSeq = 2043;
         `;

        return from(this.dataSource.query(query)).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error =>
                of({
                    success: false,
                    message: error.message || ERROR_MESSAGES.DATABASE_ERROR
                })
            )
        );
    }
    SPJTSupplyContractRemarkQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPJTSupplyContractRemarkQ(result);

        const query = `
             EXEC _SPJTSupplyContractRemarkQuery
             @xmlDocument = N'${xmlDocument}',
             @xmlFlags = 2,
             @ServiceSeq = 2371,
             @WorkingTag = N'',
             @CompanySeq = 1,
             @LanguageSeq = 6,
             @UserSeq = ${userSeq},
             @PgmSeq = 2042;
         `;

        return from(this.dataSource.query(query)).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error =>
                of({
                    success: false,
                    message: error.message || ERROR_MESSAGES.DATABASE_ERROR
                })
            )
        );
    }
    private validateResult(data: any[]): any | null {
        if (!data || !data.length) {
            return { success: false, errors: ["Không có dữ liệu trả về"] };
        }

        const invalidItems = data.filter((item) => item.Status !== 0);

        if (!invalidItems.length) return null;

        const formatted = invalidItems.map((item) => ({
            IDX_NO: item.IDX_NO || 1,
            Name: item.ItemName || "Unknown",
            result: item.Result || "Không rõ lỗi"
        }));

        return { success: false, errors: formatted };
    }


    private AutoCheckProjectMgmt(
        result: any[],
        result2: any[],
        result3: any[],
        result4: any[],
        userSeq: number,
        companySeq: number,
        workingTag: string
    ): Observable<any> {

        const xmlFlags = 2;
        const languageSeq = 6;

        const generateQuery = (
            xmlDocument: string,
            procedure: string,
            serviceSeq: number,
            pgmSeq: number
        ) => `
            EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = 1,
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        /** ----------------------------------------------------
         * STEP 1 — Check Master
         -----------------------------------------------------*/
        const xmlCheck1 = this.generateXmlService.generateXMLProjectMgmtAUD(result, workingTag);
        const queryCheck1 = generateQuery(xmlCheck1, '_SPJTSupplyContractCheck', 2364, 2042);

        return from(this.dataSource.query(queryCheck1)).pipe(
            switchMap((check1) => {
                const error = this.validateResult(check1);
                if (error) return of({ success: false, step: 'Check Master', error });

                /** ----------------------------------------------------
                 * STEP 2 — Save Master
                 -----------------------------------------------------*/
                const xmlSave1 = this.generateXmlService.generateXMLProjectMgmtAUD(check1, workingTag);
                const querySave1 = generateQuery(xmlSave1, '_SPJTSupplyContractSave', 2364, 2042);

                return from(this.dataSource.query(querySave1)).pipe(
                    switchMap((save1) => {
                        const error2 = this.validateResult(save1);
                        if (error2) return of({ success: false, step: 'Save Master', error: error2 });

                        const supplyContSeq = save1?.[0]?.SupplyContSeq;

                        /** ----------------------------------------------------
                         * STEP 3 — RECORD A / U (PayCondition)
                         -----------------------------------------------------*/
                        const recordsA = result4
                            .filter(r => r.Status === 'A')
                            .map(r => ({ ...r, IdSeq: uuidv7(), SupplyContSeq: supplyContSeq }));

                        const recordsU = result4.filter(r => r.Status === 'U');

                        /** ----------------------------------------------------
                         * STEP 3.1 — ResCheck (CHỈ KHI CÓ result2)
                         -----------------------------------------------------*/
                        const taskResCheck = result2.length
                            ? from(
                                this.dataSource.query(
                                    generateQuery(
                                        this.generateXmlService.generateXMLSupplyContractResAUD(result2, supplyContSeq),
                                        '_SPJTSupplyContractResCheck',
                                        2372,
                                        2042
                                    )
                                )
                            ).pipe(catchError(err => of({ success: false, step: 'Check Item', error: err })))
                            : of(null);

                        /** ----------------------------------------------------
                         * STEP 3.2 — RemarkSave (CHỈ KHI CÓ result3)
                         -----------------------------------------------------*/
                        const taskRemarkSave = result3.length
                            ? from(
                                this.dataSource.query(
                                    generateQuery(
                                        this.generateXmlService.generateXMLSupplyContractRemarkAUD(result3, supplyContSeq),
                                        '_SPJTSupplyContractRemarkSave',
                                        2371,
                                        2042
                                    )
                                )
                            ).pipe(catchError(err => of({ success: false, step: 'Save Remark', error: err })))
                            : of(null);

                        /** ----------------------------------------------------
                         * STEP 3.3 — PayCondition A
                         -----------------------------------------------------*/
                        const taskPayA = recordsA.length
                            ? this.payConditionService.PayConditionA(recordsA).pipe(
                                catchError(err => of({ success: false, step: 'PayCondition A', error: err }))
                            )
                            : of(null);

                        /** ----------------------------------------------------
                         * STEP 3.4 — PayCondition U
                         -----------------------------------------------------*/
                        const taskPayU = recordsU.length
                            ? this.payConditionService.PayConditionU(recordsU).pipe(
                                catchError(err => of({ success: false, step: 'PayCondition U', error: err }))
                            )
                            : of(null);

                        /** ----------------------------------------------------
                         * 🚀 RUN STEP 3 SONG SONG
                         -----------------------------------------------------*/
                        return forkJoin([taskResCheck, taskRemarkSave, taskPayA, taskPayU]).pipe(
                            switchMap(([check2Result, remarkSaveResult, payAResult, payUResult]) => {

                                /** ----------------------------------------------------
                                 * STEP 4 — Save Item (CHỈ KHI CÓ result2)
                                 -----------------------------------------------------*/
                                if (!result2.length) {
                                    return of({
                                        success: true,
                                        data: [{
                                            save1,
                                            check2: check2Result,
                                            remarkSave: remarkSaveResult,
                                            payConditionA: payAResult,
                                            payConditionU: payUResult,
                                            resSave: null,
                                        }]
                                    });
                                }

                                const xmlSave2 = this.generateXmlService.generateXMLSupplyContractResAUD(result2, supplyContSeq);
                                const querySave2 = generateQuery(xmlSave2, '_SPJTSupplyContractResSave', 2372, 2042);

                                return from(this.dataSource.query(querySave2)).pipe(
                                    catchError(err => of({ success: false, step: 'Save Item', error: err })),
                                    map((saveResResult) => ({
                                        success: true,
                                        data: [{
                                            save1,
                                            check2: check2Result,
                                            remarkSave: remarkSaveResult,
                                            payConditionA: payAResult,
                                            payConditionU: payUResult,
                                            resSave: saveResResult,
                                        }]
                                    }))
                                );
                            })
                        );
                    })
                );
            }),

            catchError((err) => of({ success: false, step: 'Pipeline Error', error: err }))
        );
    }


    private AutoSupplyContractRes(
        result: any[],
        userSeq: number,
        companySeq: number,
        workingTag: string
    ): Observable<any> {

        const xmlFlags = 2;
        const languageSeq = 6;

        const generateQuery = (
            xmlDocument: string,
            procedure: string,
            serviceSeq: number,
            pgmSeq: number
        ) => `
            EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = 1,
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlCheck = this.generateXmlService.generateXMLSupplyContractResAUD(result, result?.[0]?.SupplyContSeq);
        const queryCheck = generateQuery(xmlCheck, '_SPJTSupplyContractResCheck', 2372, 2042);

        return from(this.dataSource.query(queryCheck)).pipe(
            switchMap((checkRes) => {
                const error = this.validateResult(checkRes);
                if (error) return of({ success: false, step: 'Check _SPJTSupplyContractResCheck', error });

                const xmlSave = this.generateXmlService.generateXMLSupplyContractResAUD(checkRes, result?.[0]?.SupplyContSeq);
                const querySave = generateQuery(xmlSave, '_SPJTSupplyContractResSave', 2372, 2042);

                return from(this.dataSource.query(querySave)).pipe(
                    map((saveRes) => {
                        const error2 = this.validateResult(saveRes);
                        if (error2) return { success: false, step: 'Save _SPJTSupplyContractResSave', error: error2 };

                        return { success: true, data: saveRes };
                    })
                );
            }),

            catchError((err) => of({ success: false, step: 'Pipeline Error', error: err }))
        );
    }
    private AutoSupplyContract(
        result: any[],
        userSeq: number,
        companySeq: number,
        workingTag: string
    ): Observable<any> {

        const xmlFlags = 2;
        const languageSeq = 6;

        const generateQuery = (
            xmlDocument: string,
            procedure: string,
            serviceSeq: number,
            pgmSeq: number
        ) => `
            EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'D',
            @CompanySeq = 1,
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlCheck = this.generateXmlService.generateXMLProjectMgmtAUD(result, 'D');
        const queryCheck = generateQuery(xmlCheck, '_SPJTSupplyContractCheck', 2364, 2042);

        return from(this.dataSource.query(queryCheck)).pipe(
            switchMap((checkRes) => {
                const error = this.validateResult(checkRes);
                if (error) return of({ success: false, step: 'Check _SPJTSupplyContractCheck', error });

                const xmlSave = this.generateXmlService.generateXMLProjectMgmtAUD(checkRes, 'D');
                const querySave = generateQuery(xmlSave, '_SPJTSupplyContractSave', 2364, 2042);

                return from(this.dataSource.query(querySave)).pipe(
                    map((saveRes) => {
                        const error2 = this.validateResult(saveRes);
                        if (error2) return { success: false, step: 'Save _SPJTSupplyContractSave', error: error2 };

                        return { success: true, data: saveRes };
                    })
                );
            }),

            catchError((err) => of({ success: false, step: 'Pipeline Error', error: err }))
        );
    }
    private AutoSPJTSupplyContractRemark(
        result: any[],
        userSeq: number,
        companySeq: number,
        workingTag: string
    ): Observable<any> {

        const xmlFlags = 2;
        const languageSeq = 6;

        const generateQuery = (
            xmlDocument: string,
            procedure: string,
            serviceSeq: number,
            pgmSeq: number
        ) => `
            EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = 1,
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlCheck = this.generateXmlService.generateXMLSupplyContractRemarkAUD(result, result?.[0]?.SupplyContSeq);
        const query = generateQuery(xmlCheck, '_SPJTSupplyContractRemarkSave', 2371, 2042);

        return from(this.dataSource.query(query)).pipe(
            map(res => {
                const error = this.validateResult(res);
                if (error) return { success: false, step: '_SPJTSupplyContractRemarkSave', error };
                return { success: true, data: res };
            }),
            catchError(err => of({ success: false, step: '_SPJTSupplyContractRemarkSave', error: err }))
        );
    }

    ProjectMgmtAUD(result: any, result2: any, result3: any, result4: any, companySeq: number, userSeq: number): Observable<any> {
        return this.AutoCheckProjectMgmt(result, result2, result3, result4, companySeq, userSeq, result[0].WorkingTag);
    }
    SPJTSupplyContractResAUD(result: any, companySeq: number, userSeq: number): Observable<any> {
        return this.AutoSupplyContractRes(result, companySeq, userSeq, result[0].WorkingTag);
    }
    SupplyContractRemarkAUD(result: any, companySeq: number, userSeq: number): Observable<any> {
        return this.AutoSPJTSupplyContractRemark(result, companySeq, userSeq, result[0].WorkingTag);
    }
    SPJTSupplyContractD(result: any, companySeq: number, userSeq: number): Observable<any> {
        return this.AutoSupplyContract(result, companySeq, userSeq, result[0].WorkingTag);
    }

}
