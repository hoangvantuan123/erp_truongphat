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
import { join, isAbsolute } from 'path';
import * as fs from 'fs';
interface PrintResult {
    IdSeq: any;
    success: boolean;
    pdfPath?: string;
    error?: string;
}
@Injectable()
export class ErpTemJIGQRService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly docxUtilsService: DocxAssetUtilsService,
        private readonly erpPrintFileService: ERPPrintFileService,
        private readonly generateLabelsTemJIGQRService: GenerateLabelsTemJIGQRService,
    ) { }
    private readonly baseDocxPath = process.env.FILE_STORAGE_BASE_SYSTEM_ASSETS_DOCX_PATH;
    private readonly basePdfPath = process.env.FILE_STORAGE_BASE_SYSTEM_ASSETS_PDF_PATH;




    JIGQRTaggingPrint(records: any[], typeData: any): Observable<any> {
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

        const fileName = `tem_${Date.now()}`;
        const configPath = typeData.TemplatePath;


        return this.generateLabelsTemJIGQRService
            .generateLabelsPdf(records, configPath, outputDir, fileName)
            .pipe(
                switchMap((pdfPath: string) => {
                    const createdBy = typeData?.UserId || null;
                    const printSeq = typeData?.PrintSeq || null;

                    const printFileData = records.map(record => ({
                        PrintSeq: printSeq,
                        TypeFile: 'pdf',
                        Module: 'AssetQR',
                        PathDocx: pdfPath,
                        PathFile: pdfPath,
                        CreatedBy: createdBy,
                        UpdatedBy: createdBy,
                        NameFile: pdfPath.split('/').pop(),
                        IdSeq: record.IdSeq
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


}
