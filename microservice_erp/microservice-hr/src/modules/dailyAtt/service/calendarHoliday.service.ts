
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';

@Injectable()
export class CalendarHolidayService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }


    CalendarHolidayQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLCalendarHolidayQ(result);

        const query = `
            EXEC _SCOMCalendarHolidayQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 6658,
            @WorkingTag = N'${result[0].WorkingTag || 'Q'}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 8110;
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

    private AutoCheckCalendarHoliday(result: any[], userSeq: number,
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

        const xmlDoc1 = this.generateXmlService.generateXMLCalendarHolidayAUD(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SCOMCalendarHolidayCheck', 6658, 8110);

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

                const saveXmlDoc1 = this.generateXmlService.generateXMLCalendarHolidayAUD(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SCOMCalendarHolidaySave', 6658, 8110);



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

    CalendarHolidayAUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.AutoCheckCalendarHoliday(result, companySeq, userSeq, result[0].WorkingTag);
    }

}
