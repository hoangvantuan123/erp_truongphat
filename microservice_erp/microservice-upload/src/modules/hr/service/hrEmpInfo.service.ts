import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import 'dotenv/config';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as ImageModule from 'docxtemplater-image-module-free';
import * as fetch from 'node-fetch';
import { join, parse, sep } from 'path';
import { convert } from 'docx2pdf-converter';

@Injectable()
export class HrEmpInfoService {
    private libreOfficePath: string;
    constructor(
        private readonly databaseService: DatabaseService,
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }
    private isProcessing = false;
    private taskQueue: (() => void)[] = [];

    private enqueueTask<T>(task: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const executeTask = async () => {
                this.isProcessing = true;
                try {
                    const result = await task();
                    resolve(result);
                } catch (err) {
                    reject(err);
                } finally {
                    this.isProcessing = false;
                    console.log(`Đã hoàn thành 1 task. Số task còn lại trong hàng đợi: ${this.taskQueue.length}`);
                    if (this.taskQueue.length > 0) {
                        const nextTask = this.taskQueue.shift();
                        console.log(`task tiếp theo. Số task còn lại sau khi lấy ra: ${this.taskQueue.length}`);
                        nextTask?.();
                    }
                }
            };

            if (!this.isProcessing) {
                console.log('Hiện tại không có task nào đang xử lý, bắt đầu chạy task ngay lập tức');
                executeTask();
            } else {
                this.taskQueue.push(executeTask);
                console.log(`Task được thêm vào hàng đợi. Tổng số task trong hàng đợi hiện tại: ${this.taskQueue.length}`);
            }
        });
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

  /*   private async convertToPdf(docxPath: string, pdfDir: string): Promise<string> {
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
    } */


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
    
    generateDocx(data: any): Observable<{ docxPath: string; pdfPath: string }> {
        if (!data.FileName) {
            return throwError(() => new Error('File name is required'));
        }

        const templatePath = join(process.env.PATHS_TEMPLATE, data.templatePath);
        if (!fs.existsSync(templatePath) || !fs.statSync(templatePath).isFile()) {
            return throwError(() => new NotFoundException('Template file not found'));
        }

        const templateContent = fs.readFileSync(templatePath, 'binary');

        const imageOpts = {
            centered: true,
            getImage: (tagValue: any) => {
                if (!tagValue) return new ArrayBuffer(0);
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
                        return data.SizeImage1 || [100, 100];
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

        // Kiểm tra URL hợp lệ
        const isValidUrl = (url: any): url is string => {
            return typeof url === 'string' && url.startsWith('http');
        };

        const imageObservables = {
            LinkImage1: isValidUrl(data.LinkImage1) ? this.urlToBase64(data.LinkImage1) : of(null),
        };

        Object.entries(imageObservables).forEach(([key, obs]) => {
            if (obs === of(null)) {
                console.warn(`${key} URL không hợp lệ hoặc không tồn tại:`, data[key]);
            }
        });

        return forkJoin(imageObservables).pipe(
            switchMap(images => {
                if (!images.LinkImage1) {
                    console.warn('Có ảnh bị null trong images:', images);
                }

                doc.render({
                    ...data,
                    ...images,
                });

                const rootUserPath = process.env.UPLOAD_USER_PATHS_ROOT || './user_files';
                const userFolder = data.EmpSeq?.toString() || 'default';

                const docxDir = join(rootUserPath, userFolder, 'documents', 'docx');
                const pdfDir = join(rootUserPath, userFolder, 'documents', 'pdf');

                if (!fs.existsSync(docxDir)) fs.mkdirSync(docxDir, { recursive: true });
                if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

                const FileName = this.generateFileName(data.FileName);
                const docxPath = join(docxDir, FileName);

                return from(new Promise<void>((resolve, reject) => {
                    fs.writeFile(docxPath, doc.getZip().generate({ type: 'nodebuffer' }), err => {
                        if (err) reject(err);
                        else resolve();
                    });
                })).pipe(
                    switchMap(() => from(this.convertToPdf(docxPath, pdfDir))),
                    map(pdfPath => ({ docxPath, pdfPath })),
                );
            }),
            catchError(err => {
                return throwError(() => err);
            }),
        );
    }






    EmpInfoRptQ(result: any, companySeq: number, userSeq: number): Observable<any> {
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
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
        /* _SHREmpInfoQuery*/
        const xmlDoc1 = this.generateXmlService.generateXMLEmpInfoRptQ(result);
        const queries = [
            generateQuery(xmlDoc1, '_SHREmpInfoQuery', 1729, 1792),
            generateQuery(xmlDoc1, '_SHREmpOneQuery', 1626, 3512),
            generateQuery(xmlDoc1, '_SHRAdmOrdEmpList', 4349, 1792),
            generateQuery(xmlDoc1, '_SHRBasFamilyQuery', 1630, 1797),
            generateQuery(xmlDoc1, '_SHRBasAcademicQuery', 1630, 1797),
            generateQuery(xmlDoc1, '_SHRBaslinguisticQuery', 1716, 1803),
            generateQuery(xmlDoc1, '_SHRBasPrzPnlQuery', 1654, 1798),
            generateQuery(xmlDoc1, '_SHRBasLicenseQuery', 1637, 1796),
            generateQuery(xmlDoc1, '_SHRBasTravelRecQuery', 1724, 1805),
            generateQuery(xmlDoc1, '_SHRBasCareerQuery', 1637, 1796),
            generateQuery(xmlDoc1, 'ITMV_SHREmpInfoRptQuery', 1517127, 1792),
        ];

        const userFilesPromise = this.dataSource.transaction(async (manager) => {
            return await manager.createQueryBuilder()
                .select([
                    'q.IdSeq as "IdSeq"',
                    'q.UserId as "UserId"',
                    'q.Filename as "Filename"',
                    'q.Type as "Type"',
                    'q.IsAvatar as "IsAvatar"',
                    'q.Path as "Path"',
                    'q.Size as "Size"',
                    'q.IdxNo as "IdxNo"',
                    'q.Originalname as "Originalname"',
                    'q.CreatedAt as "CreatedAt"',
                ])
                .from('_ERPUploadsUserFile', 'q')
                .where('q.UserId = :KeyItem1', { KeyItem1: result.EmpSeq })
                .andWhere('q.Type = :type', { type: 'AVATAR' })
                .getRawMany();
        });

        return forkJoin([
            ...queries.map(q => from(this.databaseService.executeQuery(q))),
            from(userFilesPromise),
        ]).pipe(
            switchMap(([...data]) => {
                const userFiles = data.pop();
                const dataBlocks = data;


                const now = new Date();
                const formatDateTime = (date: Date) =>
                    `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}` +
                    `${date.getDate().toString().padStart(2, '0')}` +
                    `${date.getHours().toString().padStart(2, '0')}` +
                    `${date.getMinutes().toString().padStart(2, '0')}` +
                    `${date.getSeconds().toString().padStart(2, '0')}`;
                const formatVND = (value) => {
                    const number = Number(value);
                    return isNaN(number) ? '' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
                };

                const wishTask1 = Number(dataBlocks[10][0].WishTask1 || 0); // Lương cơ bản
                const wishTask2 = Number(dataBlocks[10][0].WishTask2 || 0); // Phụ cấp xăng xe
                const umJdName = Number(dataBlocks[10][0].UMJdName || 0); // Thưởng
                const spWorkAmount = Number(dataBlocks[10][0].Weight || 0); // Thưởng
                const spWorkMore = Number(dataBlocks[10][0].UMEmployTypeName || 0); // Thưởng

                const totalAmount = wishTask1 + wishTask2 + umJdName + spWorkAmount + spWorkMore;
                const currentDateStr = formatDateTime(now);
                const newData = {
                    ...dataBlocks[0][0],
                    ...dataBlocks[1][0],
                    ...(userFiles?.[0] || {}),
                    LinkImage1: `http://${process.env.PATH_PRINT_INFO_USER}/public-files/${userFiles?.[0] && userFiles[0].Path ? userFiles[0].Path.replace('/ERP_CLOUD/user_files/', '') : ''}`,
                    SizeImage1: [177, 219],
                    FileName: `${result.EmpId}_${currentDateStr}`,
                    templatePath: "TEMP03.docx",
                    DataBlock3: dataBlocks[2],
                    DataBlock4: dataBlocks[3],
                    DataBlock5: dataBlocks[4],
                    DataBlock6: dataBlocks[5],
                    DataBlock7: dataBlocks[6],
                    DataBlock8: dataBlocks[7],
                    DataBlock9: dataBlocks[8],
                    DataBlock10: dataBlocks[9],
                    DataBlock11: dataBlocks[10],
                    // Tiền định dạng
                    WishTask1: formatVND(wishTask1),
                    WishTask2: formatVND(wishTask2),
                    UMJdName: formatVND(umJdName),
                    SpWorkAmount: formatVND(spWorkAmount),
                    SpWorkMore: formatVND(spWorkMore),

                    // Tổng tiền
                    TotalAmount: formatVND(totalAmount),
                };

                return this.generateDocx(newData).pipe(
                    map(({ docxPath, pdfPath }) => {
                        const rootPath = process.env.UPLOAD_USER_PATHS_ROOT?.replace(/\\/g, '/');
                        const formatPath = (fullPath: string) => {
                            return fullPath.replace(/\\/g, '/').replace(rootPath, '');
                        };

                        return {
                            success: true,
                            data: [{
                                FileDocxUrl: formatPath(docxPath),
                                FilePdfUrl: formatPath(pdfPath),
                            }],
                        };
                    })

                );


            }),
            catchError(err => {
                return of({ success: false, error: err.message });
            })
        );
    }



    EmpInfoRptQWrapper(result: any, companySeq: number, userSeq: number): Observable<any> {
        return from(this.enqueueTask(() =>
            this.EmpInfoRptQ(result, companySeq, userSeq).toPromise()
        ));
    }




}
