import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { join, isAbsolute, dirname } from 'path';
import * as fs from 'fs';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as ImageModule from 'docxtemplater-image-module-free';
import fetch from 'node-fetch';
import converter from '../pdf/pdf.strategy';
import * as DocxMerger from 'docx-merger';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';

dotenv.config();

@Injectable()
export class DocxAssetUtilsService {
    constructor() { }
    private readonly baseDocxPath = process.env.FILE_STORAGE_BASE_SYSTEM_ASSETS_DOCX_PATH;
    private readonly basePdfPath = process.env.FILE_STORAGE_BASE_SYSTEM_ASSETS_PDF_PATH;

    private urlToBase64(url: string) {
        return from(
            fetch(url).then(async (res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const buffer = await res.buffer();
                return buffer.toString('base64');
            }),
        ).pipe(
            catchError(() => of('')),
        );
    }

    private escapeXml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    private cleanData(obj: any): any {
        return JSON.parse(
            JSON.stringify(obj, (key, value) => {
                if (typeof value === 'string') return this.escapeXml(value);
                return value;
            }),
        );
    }
    mergeDocxOnly(
        fileResults: { fileName: string; relativePath: string }[],
        outputFileName: string
    ): Observable<{ fileName: string; relativePath: string }> {
        if (!fileResults || fileResults.length === 0) {
            return throwError(() => new NotFoundException('Không có file DOCX để hợp nhất'));
        }

        const absolutePaths = fileResults.map(f =>
            isAbsolute(f.relativePath)
                ? f.relativePath
                : join(this.baseDocxPath, f.relativePath)
        );

        return forkJoin(
            absolutePaths.map(p => from(fs.promises.readFile(p, 'binary')))
        ).pipe(
            switchMap((docxBuffers: string[]) => {
                const merger = new DocxMerger({ pageBreak: false }, docxBuffers);

                return new Observable<Buffer>((observer) => {
                    merger.save('nodebuffer', (data: Buffer) => {
                        if (data) {
                            observer.next(data);
                            observer.complete();
                        } else {
                            observer.error(new Error('Không thể merge file DOCX'));
                        }
                    });
                });
            }),
            switchMap(async (mergedBuffer: Buffer) => {
                const outputPath = join(this.baseDocxPath, outputFileName);
                const dir = dirname(outputPath);

                if (!fs.existsSync(dir)) {
                    await fs.promises.mkdir(dir, { recursive: false });
                }

                await fs.promises.writeFile(outputPath, mergedBuffer);

                const fileName = outputFileName.split(/[\\/]/).pop() || '';
                const fileNameWithoutExt = fileName.replace(/\.docx$/i, '');
                const relativePath = outputFileName.replace(/\\/g, '/');

                return {
                    fileName,
                    fileNameWithoutExt,
                    relativePath,
                };
            }),
            catchError(err =>
                throwError(() =>
                    new InternalServerErrorException(`Hợp nhất DOCX lỗi: ${err.message}`),
                )
            ),
        );
    }


    generateDocx(TypeData: any, DataPrint: any[]) {
        const templatePath = TypeData?.TemplatePath;
        const fileNamePrefix =
            TypeData?.FileName?.replace('.docx', '') || `${Date.now()}`;

        const docxBaseDir = process.env.FILE_STORAGE_BASE_SYSTEM_ASSETS_DOCX_PATH;

        if (!templatePath || !isAbsolute(templatePath)) {
            throw new NotFoundException(`❌ TemplatePath không hợp lệ: ${templatePath}`);
        }

        if (!fs.existsSync(templatePath) || !fs.statSync(templatePath).isFile()) {
            throw new NotFoundException(`❌ Không tìm thấy template: ${templatePath}`);
        }

        const templateContent = fs.readFileSync(templatePath, 'binary');

        const observables = DataPrint.map((item, index) => {
            return this.urlToBase64(item.LinkImage1).pipe(
                switchMap((QRCodeBase64) => {
                    const zip = new PizZip(templateContent);
                    const doc = new Docxtemplater(zip, {
                        modules: [
                            new ImageModule({
                                centered: true,
                                getImage: (tagValue: any) => {
                                    try {
                                        const byteCharacters = Buffer.from(tagValue, 'base64').toString('binary');
                                        const byteNumbers = new Array(byteCharacters.length);
                                        for (let i = 0; i < byteCharacters.length; i++) {
                                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                                        }
                                        return new Uint8Array(byteNumbers).buffer;
                                    } catch {
                                        return new Uint8Array();
                                    }
                                },
                                getSize: () => [90, 90],
                            }),
                        ],
                        linebreaks: true,
                        paragraphLoop: true,
                    });

                    const finalData = this.cleanData({
                        ...TypeData,
                        ...item,
                        LinkImage1: QRCodeBase64 || '',
                    });

                    try {
                        doc.render(finalData);

                        const now = new Date();
                        const dateFolder = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                        const idFrom = TypeData?.PrintSeq;
                        const subFolder = join(dateFolder, idFrom);

                        const docxFolderPath = join(docxBaseDir, subFolder);

                        if (!fs.existsSync(docxFolderPath)) fs.mkdirSync(docxFolderPath, { recursive: true });

                        const fileName = `${fileNamePrefix}.docx`;
                        const docxPath = join(docxFolderPath, fileName);

                        fs.writeFileSync(docxPath, doc.getZip().generate({ type: 'nodebuffer' }));
                        const relativePath = join(dateFolder, idFrom, fileName).replace(/\\/g, '/');


                        return of({
                            fileName: fileName,
                            relativePath: relativePath,
                        });

                    } catch (err: any) {
                        throw new InternalServerErrorException(`Render thất bại: ${err.message}`);
                    }
                }),
            );
        });

        return forkJoin(observables);
    }



    convertDocxPathsToPdf(
        relativeDocxPaths: string[],
        pdfFolderRelative: string
    ): Observable<{ fileName: string; relativePath: string }[]> {
        if (!relativeDocxPaths || relativeDocxPaths.length === 0) {
            return throwError(() => new NotFoundException('Không có file DOCX để chuyển đổi'));
        }

        const baseDocxPath = this.baseDocxPath;
        const basePdfPath = this.basePdfPath;

        const convertOne = (relDocxPath: string) => {
            const absDocxPath = join(baseDocxPath, relDocxPath);
            const docxFileName = relDocxPath.split(/[\\/]/).pop() || 'default.docx';
            const pdfFileName = docxFileName.replace(/\.docx$/, '.pdf');

            const pdfAbsPath = join(basePdfPath, pdfFolderRelative, pdfFileName);
            const pdfRelativePath = join(pdfFolderRelative, pdfFileName).replace(/\\/g, '/');

            if (existsSync(pdfAbsPath)) {
                return of({
                    fileName: pdfFileName,
                    relativePath: pdfRelativePath,
                });
            }

            const pdfOutputFolder = join(basePdfPath, pdfFolderRelative);
            return from(converter.convertToPdf(absDocxPath, pdfOutputFolder)).pipe(
                map(() => ({
                    fileName: pdfFileName,
                    relativePath: pdfRelativePath,
                }))
            );
        };

        return forkJoin(relativeDocxPaths.map(convertOne)).pipe(
            catchError(err =>
                throwError(() =>
                    new InternalServerErrorException(`Convert PDF lỗi: ${err.message}`)
                )
            )
        );
    }



}
