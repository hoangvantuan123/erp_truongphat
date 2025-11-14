import { Injectable } from '@nestjs/common';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';

import { Observable, from, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
@Injectable()
export class DaMaterialListService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService) { }



    SDAItemListQ(
        result: any,
        userSeq: number,
        companySeq: number,
    ): Observable<SimpleQueryResult> {
        const xmlDocument = this.generateXmlService.generateXMLSDAItemListBaseQuery(result);
        const query = `
            EXEC _SDAItemListQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 5137,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 17667;
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

    private SDAItemListAutoCheck(
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

        // 🔹 Xác định proc, serviceSeq & hàm generateXML theo workingTag
        const isUpdate = workingTag === 'U';
        const procCheck = isUpdate ? '_SDAItemUpdateCheck' : '_SDAItemUploadCheck';
        const procSave = isUpdate ? '_SDAItemUpdateSave' : '_SDAItemUploadSave';
        const serviceSeq = isUpdate ? 7969 : 5199;

        // 🔹 Gọi hàm tạo XML phù hợp
        const xmlDoc1 = isUpdate
            ? this.generateXmlService.generateXMLItemU(result, workingTag)
            : this.generateXmlService.generateXMLItem(result, workingTag);

        const query1 = generateQuery(xmlDoc1, procCheck, serviceSeq, 124);

        return forkJoin([
            from(this.dataSource.query(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra"] });
                    }

                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            message: 'Lỗi',
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

                // 🔹 Gọi hàm generateXML phù hợp cho bước Save
                const saveXmlDoc1 = isUpdate
                    ? this.generateXmlService.generateXMLItemU(data1, workingTag)
                    : this.generateXmlService.generateXMLItem(data1, workingTag);

                const saveQuery1 = generateQuery(saveXmlDoc1, procSave, serviceSeq, 124);

                return forkJoin([
                    from(this.dataSource.query(saveQuery1)),
                ]).pipe(
                    map(([saveData1]) => {
                        const invalidItems = saveData1?.filter((item: any) => item.Status !== 0) || [];

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

                        return { success: true, data: saveData1 };
                    })
                );
            }),
            catchError((err) => of(err))
        );
    }



    SDAItemListAUD(result: any, companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        return this.SDAItemListAutoCheck(result, companySeq, userSeq, result[0].WorkingTag);
    }


}
