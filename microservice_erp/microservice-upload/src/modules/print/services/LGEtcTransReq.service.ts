import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, tap, switchMap, mergeMap } from 'rxjs/operators';
import { join, parse, sep } from 'path';
import * as fs from 'fs';
import { InjectDataSource } from '@nestjs/typeorm';
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
import * as QRCode from 'qrcode';
import { DataSource } from 'typeorm';
@Injectable()
export class LGEtcTransReqService {

    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
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

    private async convertToPdf(docxPath: string, pdfDir: string): Promise<string> {
        const pythonPath = process.env.PYTHON_PATH
        const pythonScript = join(__dirname, '..', '..', '..', '..', '..', 'python', 'convert.py');

        const command = `"${pythonPath}" "${pythonScript}" "${docxPath}" "${pdfDir}"`;

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
                if (!tagValue) return null;
                const base64Data = tagValue.replace(/^data:image\/\w+;base64,/, '');
                return Buffer.from(base64Data, 'base64');
            },
            getSize: (tagValue: any, tagName: string, img: any) => {
                switch (img) {
                    case 'LinkImage1': return TypeData.SizeImage1;
                    case 'LinkImage2': return TypeData.SizeImage2;
                    case 'LinkImage3': return TypeData.SizeImage3;
                    case 'LinkImage4': return TypeData.SizeImage4;
                    default: return [50, 50];
                }
            },
        };

        const zip = new PizZip(templateContent);
        const doc = new Docxtemplater(zip, {
            modules: [new ImageModule(imageOpts)],
            linebreaks: true,
            paragraphLoop: true,
        });

        // Bỏ forkJoin urlToBase64, dùng trực tiếp base64 trong TypeData
        dayjs.extend(utc);
        dayjs.extend(timezone);
        const currentDate = dayjs().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
        const reqDateFormat = dayjs(DataPrint.OutReq.data.ReqDate, "YYYYMMDD").format("DD/MM/YYYY");

        doc.render({
            ...TypeData, // LinkImage1..4 là base64 trực tiếp
            ...DataPrint.OutReq.data[0],
            DataSheets: DataPrint.OutReqItem.data,
            ReqDateNew: reqDateFormat,
            currentDate: currentDate
        });

        const docxDir = process.env.STORAGE_DOCX_DIR!;
        const pdfDir = process.env.STORAGE_PDF_DIR!;

        if (!fs.existsSync(docxDir)) fs.mkdirSync(docxDir, { recursive: true });
        if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
        const FileName = this.generateFileName(TypeData.FileName);
        const docxPath = join(docxDir, FileName);

        return new Observable<string>(observer => {
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
                        .catch(err => observer.error(err));
                }
            });
        });
    }





    _executeSPDMMQueries(result: any, companySeq: number, userSeq: number): Observable<string> {
        // Tạo QR code trực tiếp từ result.CodeQr
        const qr$ = from(QRCode.toDataURL(result.CodeQr));

        return qr$.pipe(
            mergeMap(qrBase64 => {
                const TypeData = {
                    TemplatePath: 'PRINT_TEMPLATE_0003.docx',
                    FileName: result.FileName,
                    SizeImage1: [60, 60],
                    SizeImage2: [90, 90],
                    SizeImage3: [90, 90],
                    SizeImage4: [90, 90],
                    LinkImage1: qrBase64,
                    LinkImage2: qrBase64,
                    LinkImage3: qrBase64,
                    LinkImage4: qrBase64,
                };

                const queries$ = {
                    OutReqItem: of(
                        this.dataSource.query(`
                            EXEC _SLGInOutDailyItemQueryTP_WEB
                            @xmlDocument = N'${this.generateXmlService.generateXMLSLGEtcOutReqItemQ(result)}',
                            @xmlFlags = 2,
                            @ServiceSeq = 2619,
                            @WorkingTag = N'',
                            @CompanySeq = 1,
                            @LanguageSeq = 6,
                            @UserSeq = ${userSeq},
                            @PgmSeq = 3317;
                        `)
                    ).pipe(
                        mergeMap(promise => promise),
                        tap(resultQuery => console.log('Query OutReqItem Result:')),
                        map(resultQuery => ({ success: true, data: resultQuery })),
                        catchError(error => of({ success: false, message: error.message || 'DATABASE_ERROR' }))
                    ),

                    OutReq: of(
                        this.dataSource.query(`
                            EXEC _SLGInOutDailyQueryTP_WEB
                            @xmlDocument = N'${this.generateXmlService.generateXMLSLGEtcOutReqQ(result)}',
                            @xmlFlags = 2,
                            @ServiceSeq = 2619,
                            @WorkingTag = N'',
                            @CompanySeq = 1,
                            @LanguageSeq = 6,
                            @UserSeq = ${userSeq},
                            @PgmSeq = 3317;
                        `)
                    ).pipe(
                        mergeMap(promise => promise),
                        tap(resultQuery => console.log('Query OutReq Result:')),
                        map(resultQuery => ({ success: true, data: resultQuery })),
                        catchError(error => of({ success: false, message: error.message || 'DATABASE_ERROR' }))
                    ),
                };

                return forkJoin(queries$).pipe(
                    map(results => {
                        if (!results.OutReqItem.success && !results.OutReq.success) {

                            throw new Error('Query execution failed');
                        }
                        return this.generateDocx(TypeData, results, userSeq);
                    }),
                    mergeMap(docxObservable => docxObservable),
                    catchError(error => {

                        return throwError(() => new Error('Failed to execute SPDMM queries'));
                    })
                );
            })
        );
    }






}
