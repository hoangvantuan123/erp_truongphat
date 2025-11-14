import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';
@Injectable()
export class PdmmOutExtraService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }

    _SPDMMOutReqItemQuery(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDMMOutReqItemQuery(result);
        const query = `
            EXEC _SPDMMOutReqItemQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2988,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1571;
        `;
        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }

    _SPDMMOutReqItemStockQuery_WEB(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDMMOutReqItemStockQuery(result);
        const query = `
            EXEC _SLGInOutInventoryTransCheck_V2_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 3033,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1571;
        `;
        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }

    _SPDMMOutReqQuery_WEB(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPDMMOutReqQuery(result);
        const query = `
            EXEC _SPDMMOutReqQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2988,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1571;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }


    private AutoCheck(
        result: any,
        resultItems: any[],
        resultCheck: any,
        companySeq: number,
        userSeq: number,
        workingTag: string
    ): Observable<any> {
        const xmlFlags = 2;
        const serviceSeq = 2988;
        const languageSeq = 6;
        const pgmSeq = 1035;

        const xmlDocumentCheck = this.generateXmlService.generateXMLSCOMConfirmDelete(resultCheck, workingTag);
        const queryConfirm = `
            EXEC _SCOMConfirmDelete_WEB
            @xmlDocument = N'${xmlDocumentCheck}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2609,
            @WorkingTag = N'${resultCheck.workingTag}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        return this.databaseService.executeQueryVer02(queryConfirm).pipe(
            mergeMap(confirmResult => {
                const invalidItems = confirmResult.filter((item: any) => item.Status && item.Status !== 0);
                if (invalidItems.length) {
                    return throwError(() => ({
                        success: false,
                        status: false,
                        errors: invalidItems.map(item => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.ItemName || "Unknown Item",
                            result: item.Result || "No result provided",
                        })),
                    }));
                }
                const xmlDocumentOutReq = this.generateXmlService.generateXMLSPDMMOutReq(result, workingTag);
                const queryOutReq = `
                    EXEC _SPDMMOutReqCheck_WEB
                    @xmlDocument = N'${xmlDocumentOutReq}',
                    @xmlFlags = ${xmlFlags},
                    @ServiceSeq = ${serviceSeq},
                    @WorkingTag = N'${workingTag}',
                    @CompanySeq = ${companySeq},
                    @LanguageSeq = ${languageSeq},
                    @UserSeq = ${userSeq},
                    @PgmSeq = ${pgmSeq};
                `;
                return this.databaseService.executeQueryVer02(queryOutReq);
            }),
            mergeMap(resultCheck => {
                if (!resultCheck?.length) {
                    return throwError(() => ({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra đơn hàng"] }));
                }
                const firstResultCheck = resultCheck[0];
                const xmlDocumentItemCheck = this.generateXmlService.generateXMLSPDMMOutReqItemCheck(resultItems, firstResultCheck.OutReqSeq, workingTag);
                const queryItemCheck = `
                    EXEC _SPDMMOutReqItemCheck_WEB
                    @xmlDocument = N'${xmlDocumentItemCheck}',
                    @xmlFlags = ${xmlFlags},
                    @ServiceSeq = ${serviceSeq},
                    @WorkingTag = N'${workingTag}',
                    @CompanySeq = ${companySeq},
                    @LanguageSeq = ${languageSeq},
                    @UserSeq = ${userSeq},
                    @PgmSeq = ${pgmSeq};
                `;
                return this.databaseService.executeQueryVer02(queryItemCheck).pipe(
                    map(checkResultItems => ({ checkResultItems, firstResultCheck }))
                );
            }),
            mergeMap(({ checkResultItems, firstResultCheck }) => {
                const saveData = (query: string) =>
                    this.databaseService.executeQueryVer02(query).pipe(
                        catchError(() => of({ success: false, errors: ["Lỗi khi lưu dữ liệu"] }))
                    );

                const xmlSaveResult = this.generateXmlService.generateXMLSPDMMOutReqSave(firstResultCheck, workingTag);
                const xmlSaveItems = this.generateXmlService.generateXMLSPDMMOutReqItem(checkResultItems, workingTag);

                const querySave = `EXEC _SPDMMOutReqSave_WEB @xmlDocument = N'${xmlSaveResult}', @xmlFlags = ${xmlFlags}, @ServiceSeq = ${serviceSeq}, @CompanySeq = ${companySeq}, @LanguageSeq = ${languageSeq}, @UserSeq = ${userSeq}, @PgmSeq = ${pgmSeq};`;
                const querySaveItems = `EXEC _SPDMMOutReqItemSave_WEB @xmlDocument = N'${xmlSaveItems}', @xmlFlags = ${xmlFlags}, @ServiceSeq = ${serviceSeq}, @CompanySeq = ${companySeq}, @LanguageSeq = ${languageSeq}, @UserSeq = ${userSeq}, @PgmSeq = ${pgmSeq};`;
                const xmlDocumentConfirmSave = this.generateXmlService.generateXMLSCOMConfirmCreate(firstResultCheck);
                const xmlDocumentSourceDailySave = this.generateXmlService.generateXMLSCOMSourceDailySave(checkResultItems, workingTag);
                const queryConfirm = `
                EXEC _SCOMConfirmCreate
                @xmlDocument = N'${xmlDocumentConfirmSave}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = 2609,
                @WorkingTag = N'${workingTag}',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;
                const querySourceDaily = `
            EXEC _SCOMSourceDailySave
            @xmlDocument = N'${xmlDocumentSourceDailySave}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq =5419,
            @WorkingTag = N'${workingTag}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
                this.databaseService.executeQueryVer02(queryConfirm).subscribe();
                this.databaseService.executeQueryVer02(querySourceDaily).subscribe();
                return forkJoin({ saveResult: saveData(querySave), saveResultItem: saveData(querySaveItems) }).pipe(
                    map(({ saveResult, saveResultItem }) => {
                        if (saveResult.success === false || saveResultItem.success === false) {
                            return { success: false, errors: [...(saveResult.errors || []), ...(saveResultItem.errors || [])] };
                        }
                        return { success: true, data: { saveResult, saveResultItem } };
                    })
                );
            }),
            catchError(error => of({ success: false, errors: [error.message || "Lỗi không xác định"] }))
        );
    }



    private AutoCheckItem(
        resultItems: any[],
        resultCheck: any,
        companySeq: number,
        userSeq: number,
        workingTag: string,
    ): Observable<any> {
        const xmlFlags = 2;
        const serviceSeq = 2988;
        const languageSeq = 6;
        const pgmSeq = 1035;

        const xmlDocumentCheck = this.generateXmlService.generateXMLSCOMConfirmDelete(resultCheck, workingTag);

        const queryConfirm = `
            EXEC _SCOMConfirmDelete_WEB
            @xmlDocument = N'${xmlDocumentCheck}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = 2609,
            @WorkingTag = N'${resultCheck.workingTag}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        return this.databaseService.executeQueryVer02(queryConfirm).pipe(
            mergeMap((confirmResult) => {



                const invalidItems = confirmResult.filter((item: any) => item.Status && item.Status !== 0);

                if (invalidItems.length > 0) {

                    return throwError(() => ({
                        success: false,
                        status: false,
                        errors: invalidItems.map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.ItemName || "Unknown Item",
                            result: item.Result || "No result provided",
                        })),
                    }));
                }


                const xmlDocumentItemCheck = this.generateXmlService.generateXMLSPDMMOutReqItem(resultItems, workingTag);

                const queryCheck = `
                    EXEC _SPDMMOutReqItemCheck_WEB
                    @xmlDocument = N'${xmlDocumentItemCheck}',
                    @xmlFlags = ${xmlFlags},
                    @ServiceSeq = ${serviceSeq},
                    @WorkingTag = N'${workingTag}',
                    @CompanySeq = ${companySeq},
                    @LanguageSeq = ${languageSeq},
                    @UserSeq = ${userSeq},
                    @PgmSeq = ${pgmSeq};
                `;

                return this.databaseService.executeQueryVer02(queryCheck);
            }),
            mergeMap((checkResultItems) => {
                if (!checkResultItems?.length) {
                    return throwError(() => ({
                        success: false,
                        errors: ["Không có dữ liệu kiểm tra sản phẩm"]
                    }));
                }



                const saveResultItem = (checkData: any[]): Observable<any> => {
                    const xmlDocumentSave = this.generateXmlService.generateXMLSPDMMOutReqItem(checkData, workingTag);
                    if (!xmlDocumentSave) {
                        return throwError(() => new Error("Lỗi khi tạo XML cho saveResultItem"));
                    }

                    const querySaveItem = `
                        EXEC _SPDMMOutReqItemSave_WEB
                        @xmlDocument = N'${xmlDocumentSave}',
                        @xmlFlags = ${xmlFlags},
                        @ServiceSeq = ${serviceSeq},
                        @WorkingTag = N'${workingTag}',
                        @CompanySeq = ${companySeq},
                        @LanguageSeq = ${languageSeq},
                        @UserSeq = ${userSeq},
                        @PgmSeq = ${pgmSeq};
                    `;

                    return this.databaseService.executeQueryVer02(querySaveItem).pipe(
                        catchError(() => {
                            return of({ success: false, status: false, errors: ["Lỗi khi lưu kết quả sản phẩm"] });
                        })
                    );
                };

                return saveResultItem(checkResultItems);
            }),
            map((saveResults) => ({
                success: true,
                status: true,
                data: saveResults,
            })),
            catchError((error) => of({ success: false, status: false, errors: [error.message || "Lỗi không xác định"] }))
        );
    }




    AutoCheckA(result: any, resultItems: any[], resultCheck: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult2> {
        return this.AutoCheck(result, resultItems, resultCheck, companySeq, userSeq, 'A');
    }
    AutoCheckD(result: any, resultItems: any[], resultCheck: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult2> {
        return this.AutoCheck(result, resultItems, resultCheck, companySeq, userSeq, 'D');
    }
    AutoCheckU(result: any, resultItems: any[], resultCheck: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult2> {
        return this.AutoCheck(result, resultItems, resultCheck, companySeq, userSeq, 'U');
    }


    DOutReqItem(resultItems: any[], resultCheck: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult2> {
        return this.AutoCheckItem(resultItems, resultCheck, companySeq, userSeq, 'D');
    }
    AOutReqItem(resultItems: any[], resultCheck: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult2> {
        return this.AutoCheckItem(resultItems, resultCheck, companySeq, userSeq, 'A');
    }

}
