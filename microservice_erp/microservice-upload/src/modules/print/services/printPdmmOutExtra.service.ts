import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, tap, switchMap, mergeMap } from 'rxjs/operators';
import { join, parse, sep } from 'path';
import * as fs from 'fs';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as ImageModule from 'docxtemplater-image-module-free';
import * as fetch from 'node-fetch';
import { Repository, In } from 'typeorm'
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import 'dotenv/config';
import { exec } from 'child_process';
@Injectable()
export class PrintPdmmOutExtraService {
    private libreOfficePath: string;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) {

    }

    private generateFileName(originalFileName: string): string {
        const { name } = parse(originalFileName);
        return `${name}.docx`;
    }

    private urlToBase64(url: string): Observable<string | null> {
        return from(fetch(url)).pipe(
            switchMap(response => from(response.arrayBuffer())),
            map(buffer => Buffer.from(buffer).toString('base64')),
            catchError(error => {
                return of(null);
            })
        );
    }
    /* private async convertToPdf(docxPath: string, pdfDir: string): Promise<string> {
        const pythonScript = join(__dirname, '..', '..', '..', '..', '..', 'python', 'convert.py');

        const command = `python "${pythonScript}" "${docxPath}" "${pdfDir}"`;

        return new Promise((resolve, reject) => {
            exec(command, { windowsHide: true }, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }

                const outputPath = stdout.trim();
                if (!outputPath.endsWith('.pdf')) {
                    return reject(new Error('Không lấy được file PDF đầu ra'));
                }

                resolve(outputPath);
            });
        });
    }
 */
    private async convertToPdf(docxPath: string, pdfDir: string): Promise<string> {
        const pythonPath = 'C:\\Users\\Administrator\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';
        const pythonScript = join(__dirname, '..', '..', '..', '..', '..', 'python', 'convert.py');

        const command = `"${pythonPath}" "${pythonScript}" "${docxPath}" "${pdfDir}"`;

        return new Promise((resolve, reject) => {
            exec(command, { windowsHide: true }, (error, stdout, stderr) => {
                if (error) {
                    console.error('Lỗi khi chạy lệnh:', error);
                    return reject(error);
                }

                const outputPath = stdout.trim();
                if (!outputPath.endsWith('.pdf')) {
                    return reject(new Error('Không lấy được file PDF đầu ra'));
                }

                resolve(outputPath);
            });
        });
    }
    generateDocx(TypeData: any, DataPrint: any, createdBy: number): Observable<string> {

        if (!TypeData.FileName) {
            return throwError(() => new Error('File name is required'));
        }

        const templatePath = join(process.env.PATHS_TEMPLATE, TypeData.TemplatePath);
        if (!fs.existsSync(templatePath) || !fs.statSync(templatePath).isFile()) {
            return throwError(() => new NotFoundException('Template file not found'));
        }

        const templateContent = fs.readFileSync(templatePath, 'binary');

        const imageOpts = {
            centered: true,
            getImage: (tagValue: any) => {
                const byteCharacters = Buffer.from(tagValue, 'base64').toString('binary');
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                return new Uint8Array(byteNumbers).buffer;
            },

            getSize: (tagValue: any, tagName: string, img: any) => {
                switch (img) {
                    case 'LinkImage1':
                        return TypeData.SizeImage1;
                    case 'LinkImage2':
                        return TypeData.SizeImage2;
                    case 'LinkImage3':
                        return TypeData.SizeImage3;
                    case 'LinkImage4':
                        return TypeData.SizeImage4;
                    default:
                        return [50, 50];
                }
            },
        };

        const zip = new PizZip(templateContent);
        const doc = new Docxtemplater(zip, {
            modules: [new ImageModule(imageOpts)],
            linebreaks: true,
            paragraphLoop: true,
        });

        return forkJoin({
            LinkImage1: this.urlToBase64(TypeData.LinkImage1),
            LinkImage2: this.urlToBase64(TypeData.LinkImage2),
            LinkImage3: this.urlToBase64(TypeData.LinkImage3),
            LinkImage4: this.urlToBase64(TypeData.LinkImage4),
        }).pipe(
            switchMap(images => {
                if (!images.LinkImage1 || !images.LinkImage2 || !images.LinkImage3 || !images.LinkImage4) {
                    return throwError(() => new Error('Cannot load image'));
                }
                dayjs.extend(utc);
                dayjs.extend(timezone);

                const currentDate = dayjs().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
                doc.render({
                    ...TypeData,
                    ...images,
                    ...DataPrint.OutReq.data[0],
                    DataSheets: DataPrint.OutReqItem.data,
                    currentDate: currentDate
                });

                const docxDir = join(sep === '\\' ? 'F:\\ERP_CLOUD\\print_logs\\docx' : '/var/www/invoice/docx');
                const pdfDir = join(sep === '\\' ? 'F:\\ERP_CLOUD\\print_logs\\pdf' : '/var/www/invoice/pdf');

                if (!fs.existsSync(docxDir)) fs.mkdirSync(docxDir, { recursive: true });
                if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

                const FileName = this.generateFileName(TypeData.FileName);
                const docxPath = join(docxDir, FileName);

                return new Observable<string>(observer => {
                    // Write the docx file first
                    fs.writeFile(docxPath, doc.getZip().generate({ type: 'nodebuffer' }), (err) => {
                        if (err) {
                            observer.error(err);
                        } else {
                            this.convertToPdf(docxPath, pdfDir)
                                .then(pdfPath => {
                                    const pdfFileName = parse(pdfPath).base;
                                    observer.next(pdfFileName);
                                    observer.complete();
                                })
                                .catch(err => {
                                    observer.error(err);
                                });
                        }
                    });
                });
            }),
            catchError(error => {
                console.error('Error generating docx:', error);
                return throwError(() => error);
            })
        );
    }



    _executeSPDMMQueries(result: any, companySeq: number, userSeq: number): Observable<string> {

        const TypeData = {
            TemplatePath: 'PRINT_TEMPLATE_0001.docx',
            FileName: result.FileName,
            SizeImage1: [90, 90],
            SizeImage2: [90, 90],
            SizeImage3: [90, 90],
            SizeImage4: [90, 90],
            LinkImage1: `http://${process.env.HOST_QR_CODE}/api/qrcode?url=${result.CodeQr}`,
            LinkImage2: `http://${process.env.HOST_QR_CODE}/api/qrcode?url=`,
            LinkImage3: `http://${process.env.HOST_QR_CODE}/api/qrcode?url=`,
            LinkImage4: `http://${process.env.HOST_QR_CODE}/api/qrcode?url=`,
        };

        const queries$ = {
            OutReqItem: this.databaseService.executeQueryVer02(`
        EXEC _SPDMMOutReqItemQuery_WEB
        @xmlDocument = N'${this.generateXmlService.generateXMLSPDMMOutReqItemQuery(result)}',
        @xmlFlags = 2,
        @ServiceSeq = 2988,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1571;
    `).pipe(
                tap(resultQuery => console.log('Query OutReqItem Result:', resultQuery)),
                map(resultQuery => ({ success: true, data: resultQuery })),
                catchError(error => of({ success: false, message: error.message || 'DATABASE_ERROR' }))
            ),

            OutReq: this.databaseService.executeQueryVer02(`
        EXEC _SPDMMOutReqQuery_WEB
        @xmlDocument = N'${this.generateXmlService.generateXMLSPDMMOutReqQuery(result)}',
        @xmlFlags = 2,
        @ServiceSeq = 2988,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1571;
    `).pipe(
                tap(resultQuery => console.log('Query OutReq Result:', resultQuery)),
                map(resultQuery => ({ success: true, data: resultQuery })),
                catchError(error => of({ success: false, message: error.message || 'DATABASE_ERROR' }))
            )
        };

        // Đợi cả hai truy vấn hoàn thành trước khi tiếp tục
        return forkJoin(queries$).pipe(
            /*   tap(results => console.log('All queries completed:', results)),
   */
            map(results => {

                if (!results.OutReqItem.success && !results.OutReq.success) {
                    console.error('One or more queries failed:', results);
                    throw new Error('Query execution failed');
                }

                return this.generateDocx(TypeData, results, userSeq);
            }),

            catchError(error => {
                console.error('Error occurred:', error);
                return throwError(() => new Error('Failed to execute SPDMM queries'));
            }),

            mergeMap(docxObservable => docxObservable) // Chờ `generateDocx()` hoàn thành
        );

    }





}
