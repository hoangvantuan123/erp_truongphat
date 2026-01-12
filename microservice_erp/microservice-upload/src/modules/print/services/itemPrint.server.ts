import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { DocxAssetUtilsService } from 'src/common/utils/print/docx/docxAssetUtils';
import { ERPPrintFileService } from './filePrint.service';
import { GenerateLabelsTemJIGQRService } from 'src/common/utils/print/pdf/generateLabelsTemJIGQR';
import { GenerateLabelsTemItemQRService } from 'src/common/utils/print/pdf/generateLabelsTemItemQR';
import { ERPPrintFile } from '../entities/filePrint.entity';
import { join, isAbsolute } from 'path';
import * as fs from 'fs';

interface PrintResult {
    IdSeq: any;
    success: boolean;
    pdfPath?: string;
    error?: string;
}
@Injectable()
export class ErpItemPrintQRService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly docxUtilsService: DocxAssetUtilsService,
        private readonly erpPrintFileService: ERPPrintFileService,
        private readonly generateLabelsTemItemQRService: GenerateLabelsTemItemQRService,
    ) { }
    private readonly basePdfPath = process.env.FILE_STORAGE_BASE_SYSTEM_ITEM_PDF_PATH;




    ItemPrintQRTaggingPrint(records: any[], typeData: any): Observable<any> {
        if (!records || records.length === 0) {
            return of({ success: false, message: 'No records provided', data: [] });
        }

        const now = new Date();
        const dateFolder = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}/${typeData.PrintSeq}`;

        // Đường dẫn thư mục ngày
        const outputDir = join(this.basePdfPath, dateFolder);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileName = uuidv7();
        const typeFile = typeData.TypeFile || 1;

        return this.generateLabelsTemItemQRService
            .generateLabelsPdf(records, outputDir, fileName, typeFile)
            .pipe(
                switchMap((pdfPath: string) => {
                    const createdBy = typeData?.UserId || null;
                    const printSeq = typeData?.PrintSeq || null;
                    const typePrintValue = typeData?.TypeFile || 1;

                    // Chuyển sang tên hiển thị
                    const typePrintLabel = typePrintValue === 1
                        ? 'Label'
                        : typePrintValue === 2
                            ? 'A4'
                            : '';


                    const printFileData = records.map(record => ({
                        PrintSeq: printSeq,
                        FileSeq: fileName,
                        TypeFile: 'pdf',
                        Module: 'ItemQR',
                        PathDocx: pdfPath,
                        PathFile: pdfPath,
                        CreatedBy: createdBy,
                        UpdatedBy: createdBy,
                        NameFile: pdfPath.split('/').pop(),
                        IdSeq: record?.IdSeq,
                        TypePrint: typePrintLabel,
                        ItemSeq: record?.ItemSeq || null,
                        QrCode: record?.CodeQR,
                        TemType: record?.TemType,
                    }));

                    return this.erpPrintFileService.FilePrintA(printFileData).pipe(
                        map((insertResult) => {
                            return {
                                success: true,
                                message: `Đã xử lý ${records.length} bản ghi`,
                                data: {
                                    mergedFile: {
                                        fileNameWithoutExt: fileName,
                                        relativePath: pdfPath
                                    },
                                },
                            }
                        }),
                        catchError(err =>
                            of({
                                success: false,
                                message: `Lỗi khi lưu vào bảng ERPPrintFile: ${err.message}`,
                                data: [],
                            })
                        )
                    );
                }),
                catchError(err =>
                    of({
                        success: false,
                        message: err?.message || 'Lỗi không xác định khi tạo PDF',
                        data: [],
                    })
                )
            );
    }



    ItemPrintQRTaggingPrintQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {


                const queryBuilder = manager.createQueryBuilder(ERPPrintFile, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.ItemSeq as "ItemSeq"',
                        'q.QrCode as "QrCode"',
                        'q.PrintSeq as "PrintSeq"',
                        'q.TypePrint as "TypePrint"',
                        'q.TemType as "TemType"',
                        'q.FileSeq as "FileSeq"',
                        'q.TypeFile as "TypeFile"',
                        'q.NameFile as "NameFile"',
                        'q.PathFile as "PathFile"',
                        'q.CreatedAt as "CreatedAt"',

                        's1."ItemName" as "ItemName"',
                        's1."ItemNo" as "ItemNo"',
                        's1."Spec" as "Spec"',

                        's3."EmpName" as "CreateName"',
                    ])

                    .leftJoin("_TDAItem", 's1', 'q."ItemSeq" = s1."ItemSeq"')
                    .leftJoin("_TDAEmp", 's3', 'q."CreatedBy" = s3."EmpSeq"')
                    .where('q."Module" = :module', { module: 'ItemQR' })
                    ;


                const startDateRaw = result.KeyItem1;
                const endDateRaw = result.KeyItem2;

                let startDate: string | undefined;
                let endDate: string | undefined;

                if (startDateRaw && /^\d{8}$/.test(startDateRaw)) {
                    startDate = `${startDateRaw.slice(0, 4)}-${startDateRaw.slice(4, 6)}-${startDateRaw.slice(6, 8)} 00:00:00`;
                }

                if (endDateRaw && /^\d{8}$/.test(endDateRaw)) {
                    endDate = `${endDateRaw.slice(0, 4)}-${endDateRaw.slice(4, 6)}-${endDateRaw.slice(6, 8)} 23:59:59`;
                }

                // 🧠 Thêm điều kiện lọc
                if (startDate && endDate) {
                    queryBuilder.andWhere('q.CreatedAt BETWEEN :startDate AND :endDate', { startDate, endDate });
                } else if (startDate) {
                    queryBuilder.andWhere('q.CreatedAt >= :startDate', { startDate });
                } else if (endDate) {
                    queryBuilder.andWhere('q.CreatedAt <= :endDate', { endDate });
                }



                if (result.KeyItem3) {
                    queryBuilder.andWhere(
                        's1.ItemName LIKE :KeyItem3 COLLATE SQL_Latin1_General_CP1_CI_AS',
                        { KeyItem3: `%${result.KeyItem3}%` }
                    );
                }
                if (result.KeyItem4) {
                    queryBuilder.andWhere(
                        's1.ItemNo LIKE :KeyItem4 COLLATE SQL_Latin1_General_CP1_CI_AS',
                        { KeyItem4: `%${result.KeyItem4}%` }
                    );
                }
                if (result.KeyItem5) {
                    queryBuilder.andWhere(
                        'q.QrCode LIKE :KeyItem5 COLLATE SQL_Latin1_General_CP1_CI_AS',
                        { KeyItem5: `%${result.KeyItem5}%` }
                    );
                }
                queryBuilder.orderBy('q.CreatedAt', 'DESC');

                const queryResult = await queryBuilder.getRawMany();

                return {
                    success: true,
                    data: queryResult,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.',
                    data: [],
                };
            }
        })).pipe(
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.',
                    data: [],
                });
            })
        );
    }


}
