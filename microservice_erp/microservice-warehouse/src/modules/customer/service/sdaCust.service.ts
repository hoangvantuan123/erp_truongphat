import { Injectable } from '@nestjs/common';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';

import { Observable, from, of, forkJoin, concatMap, toArray } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
@Injectable()
export class SDACustService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService) { }



    SDACustQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSDACustQ(result);
        const query = `
            EXEC _SDACustInfoBaseQuery_WEB2
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1599,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 11031;
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
    SDACustEmpInfoQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSDACustEmpInfoQ(result);
        const query = `
            EXEC _SDACustEmpInfoQuery
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1893,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = 1,
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1213;
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


    /*    private AutoCheckSDACust(
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
               EXEC ${procedure}_WEB2
               @xmlDocument = N'${xmlDocument}',
               @xmlFlags = ${xmlFlags},
               @ServiceSeq = ${serviceSeq},
               @WorkingTag = N'',
               @CompanySeq = ${companySeq},
               @LanguageSeq = ${languageSeq},
               @UserSeq = ${userSeq},
               @PgmSeq = ${pgmSeq};
           `;
   
           return from(result).pipe(
               concatMap(item => {
                   const xmlCheck = this.generateXmlService.generateXMLSDACustAUD([item], workingTag);
                   const queryCheck = generateQuery(xmlCheck, '_SDACustCheck', 1856, 1213);
   
                   return from(this.dataSource.query(queryCheck)).pipe(
                       switchMap((data1: any[]) => {
                           const results = [data1];
   
                           for (const data of results) {
                               if (!data?.length) {
                                   return of({ success: false, errors: ["Không có dữ liệu trả về từ"] });
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
                           const saveXmlDoc1 = this.generateXmlService.generateXMLSDACustAUD(data1, workingTag);
                           const saveXmlDoc2 = this.generateXmlService.generateXMLSDACustAddAUD(data1, workingTag);
   
                           const saveQuery1 = generateQuery(saveXmlDoc1, '_SDACustSave', 1856, 1213);
                           const saveQuery2 = generateQuery(saveXmlDoc2, '_SDACustAddSave', 1863, 1213);
   
                           return forkJoin([
                               from(this.dataSource.query(saveQuery1)),
                               from(this.dataSource.query(saveQuery2)),
                           ]).pipe(
                               map(([saveData1, saveData2]) => {
                                   const allSaves = [saveData1, saveData2];
   
                                   for (const data of allSaves) {
                                       const invalidItems = data?.filter((item: any) => item.Status !== 0) || [];
                                       if (invalidItems.length) {
                                           const isInvalidFormat = invalidItems.some(
                                               (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                                           );
   
                                           if (isInvalidFormat) {
                                               return {
                                                   success: false,
                                                   errors: [
                                                       {
                                                           IDX_NO: 1,
                                                           Name: "Lỗi",
                                                           result: "Không thể lấy dữ liệu chi tiết lỗi.",
                                                       },
                                                   ],
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
                                       data: saveData1,
                                   };
                               })
                           );
                       })
                   );
               }),
               catchError(err => of({ success: false, errors: [err] }))
           );
   
   
       } */

    private AutoCheckSDACust(
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
                EXEC ${procedure}_WEB2
                @xmlDocument = N'${xmlDocument}',
                @xmlFlags = ${xmlFlags},
                @ServiceSeq = ${serviceSeq},
                @WorkingTag = N'',
                @CompanySeq = ${companySeq},
                @LanguageSeq = ${languageSeq},
                @UserSeq = ${userSeq},
                @PgmSeq = ${pgmSeq};
            `;

        return from(result).pipe(
            concatMap(item => {
                const xmlCheck = this.generateXmlService.generateXMLSDACustAUD([item], workingTag);
                const queryCheck = generateQuery(xmlCheck, '_SDACustCheck', 1856, 1213);

                return from(this.dataSource.query(queryCheck)).pipe(
                    switchMap((data1: any[]) => {
                        const results = [data1];

                        for (const data of results) {
                            if (!data?.length) {
                                return of({ success: false, errors: ["Không có dữ liệu trả về từ"] });
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

                        const saveXmlDoc1 = this.generateXmlService.generateXMLSDACustAUD(data1, workingTag);
                        const saveXmlDoc2 = this.generateXmlService.generateXMLSDACustAddAUD(data1, workingTag);
                        const saveQuery1 = generateQuery(saveXmlDoc1, '_SDACustSave', 1856, 1213);
                        const saveQuery2 = generateQuery(saveXmlDoc2, '_SDACustAddSave', 1863, 1213);

                        // Chỉ tạo saveXmlDoc3 và saveQuery3 khi workingTag là "A"
                        let forkQueries = [
                            from(this.dataSource.query(saveQuery1)),
                            from(this.dataSource.query(saveQuery2)),
                        ];

                        if (workingTag === "A") {
                            const saveXmlDoc3 = this.generateXmlService.generateXMLSDACustKindSave(data1);
                            const saveQuery3 = generateQuery(saveXmlDoc3, '_SDACustKindSave', 1864, 1213);
                            forkQueries.push(from(this.dataSource.query(saveQuery3)));
                        }

                        return forkJoin(forkQueries).pipe(
                            map((saveResults) => {
                                const saveData1 = saveResults[0];
                                const saveData2 = saveResults[1];
                                const saveData3 = workingTag === "A" ? saveResults[2] : undefined;

                                const allSaves = [saveData1, saveData2];

                                for (const data of allSaves) {
                                    const invalidItems = data?.filter((item: any) => item.Status !== 0) || [];
                                    if (invalidItems.length) {
                                        const isInvalidFormat = invalidItems.some(
                                            (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                                        );

                                        if (isInvalidFormat) {
                                            return {
                                                success: false,
                                                errors: [
                                                    {
                                                        IDX_NO: 1,
                                                        Name: "Lỗi",
                                                        result: "Không thể lấy dữ liệu chi tiết lỗi.",
                                                    },
                                                ],
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
                                    data: saveData1, // hoặc merge tất cả nếu muốn
                                };
                            })
                        );

                    })
                );
            }),
            toArray(), // gom tất cả kết quả lại thành mảng
            map(results => {
                // results là mảng các object {success, data/errors} cho từng item
                // Nếu muốn merge tất cả data thành một mảng duy nhất
                const allSuccessData = results
                    .filter(r => r.success)
                    .flatMap((r: any) => r.data || []);

                const allErrors = results
                    .filter(r => !r.success)
                    .flatMap(r => r.errors || []);

                return {
                    success: allErrors.length === 0,
                    data: allSuccessData,
                    errors: allErrors,
                };
            }),
            catchError(err => of({ success: false, errors: [err] }))
        );
    }

    SDACustAUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheckSDACust(result, companySeq, userSeq, result[0].WorkingTag);
    }



    private AutoCheckSDACustD(result: any[], userSeq: number,
        companySeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
            EXEC ${procedure}_WEB2
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlDoc1 = this.generateXmlService.generateXMLSDACustCheckD(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SDACustCheck', 1856, 1213);

        return forkJoin([
            from(this.dataSource.query(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ"] });
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

                const saveXmlDoc1 = this.generateXmlService.generateXMLSDACustCheckD(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SDACustDelete', 1856, 1213);



                return forkJoin([
                    from(this.dataSource.query(saveQuery1)),

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
                            data: saveData1
                        };
                    })
                );
            }),
            catchError((err) => {
                return of(err);
            })
        );
    }

    SDACustD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheckSDACustD(result, companySeq, userSeq, result[0].WorkingTag);
    }



    private AutoCheckCustEmpInfo(result: any[], userSeq: number,

        companySeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
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

        const xmlDoc1 = this.generateXmlService.generateXMLSDACustEmpInfo(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SDACustEmpInfoCheck', 1893, 1213);

        return forkJoin([
            from(this.dataSource.query(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ"] });
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

                const saveXmlDoc1 = this.generateXmlService.generateXMLSDACustEmpInfo(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SDACustEmpInfoSave', 1893, 1213);



                return forkJoin([
                    from(this.dataSource.query(saveQuery1)),

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
                            data: saveData1
                        };
                    })
                );
            }),
            catchError((err) => {
                return of(err);
            })
        );
    }

    SDACustEmpInfoAUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheckCustEmpInfo(result, companySeq, userSeq, result[0].WorkingTag);
    }


}
