
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';

@Injectable()
export class SPRWkEmpDdService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }


    SPRWkEmpDdQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSPRWkEmpDdQ(result);

        const query = `
            EXEC _SPRWkEmpDdQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 2301,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1630;
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

    private AutoCheckSPRWkEmpDd(result: any[], userSeq: number,
        companySeq: number, workingTag: string): Observable<any> {
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

        const xmlDoc1 = this.generateXmlService.generateXMLSPRWkEmpDdCheckAUD(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SPRWkEmpDdCheck', 2301, 1630);

        return forkJoin([
            from(this.dataSource.query(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({
                            success: false,
                            message: 'Không có dữ liệu trả về từ máy chủ.',
                            errors: [
                                {
                                    IDX_NO: 0,
                                    Name: 'Dữ liệu',
                                    result: 'Không có dữ liệu trả về từ máy chủ.',
                                },
                            ],
                        });
                    }

                    const invalidItems = data.filter((item: any) => item.Status !== 0);

                    if (invalidItems.length > 0) {
                        const firstError = invalidItems[0];
                        const messageSummary = `Dòng ${firstError.IDX_NO || '?'}: ${firstError.Result || 'Lỗi không xác định'
                            }`;

                        return of({
                            success: false,
                            message: messageSummary,
                            errors: messageSummary,
                        });
                    }
                }

                // Lấy XML dựa trên workingTag
                const saveXmlDoc1 =
                    workingTag === 'D'
                        ? this.generateXmlService.generateXMLSPRWkEmpDdCheckAUD(data1, workingTag)
                        : this.generateXmlService.generateXMLSPRWkEmpDdAUD(data1, workingTag);

                const saveQuery1 = generateQuery(saveXmlDoc1, '_SPRWkEmpDdSave', 2301, 1630);


                return forkJoin([
                    from(this.dataSource.query(saveQuery1)),

                ]).pipe(
                    map(([saveData1]) => {
                        for (const data of [saveData1]) {
                            const invalidItems = data?.filter((item: any) => item.Status !== 0) || [];

                            if (invalidItems.length) {
                                const isInvalidFormat = invalidItems.some(
                                    (item: any) => !item.ROW_IDX || !item.ItemName || !item.Result
                                );

                                if (isInvalidFormat) {
                                    return {
                                        success: false,
                                        message: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                        errors: [{
                                            IDX_NO: 1,
                                            Name: 'Lỗi',
                                            result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                        }],
                                    };
                                }
                                const messageSummary = invalidItems
                                    .map((item: any) => `Dòng ${item.ROW_IDX}: ${item.Result}`)
                                    .join('; ');
                                return {
                                    success: false,
                                    message: messageSummary,
                                    errors: messageSummary,
                                };
                            }
                        }
                        const uniqueRows = Array.from(
                            new Map(saveData1.map(item => [item.ROW_IDX, item])).values()
                        );
                        return {
                            success: true,
                            data: uniqueRows
                        };
                    })
                );
            }),
            catchError((err) => {
                return of(err);
            })
        );
    }

    SPRWkEmpDdAUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheckSPRWkEmpDd(result, companySeq, userSeq, result[0].WorkingTag);
    }

}
