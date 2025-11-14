import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';
@Injectable()
export class HrBasUnionService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }



    HrBasUnionQ(result: any, companySeq: number, userSeq: number): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLHrBasUnionQ(result);
        const query = `
            EXEC _SHRBasUnionQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1541,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1781;
        `;

        return this.databaseService.executeQueryVer02(query).pipe(
            map(resultQuery => ({ success: true, data: resultQuery })),
            catchError(error => of({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }))
        );
    }



    private HrBasUnionAUD(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
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

        const xmlDoc1 = this.generateXmlService.generateXMLHrBasUnionAUD(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SHRBasUnionCheck', 1831, 1813);

        return forkJoin([
            from(this.databaseService.executeQuery(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về"] });
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

                const saveXmlDoc1 = this.generateXmlService.generateXMLHrBasUnionAUD(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SHRBasUnionSave', 1831, 1813);



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


    HrBasUnionA(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.HrBasUnionAUD(result, companySeq, userSeq, 'A');
    }

    HrBasUnionU(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.HrBasUnionAUD(result, companySeq, userSeq, 'U');
    }
    HrBasUnionD(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.HrBasUnionAUD(result, companySeq, userSeq, 'D');
    }



}
