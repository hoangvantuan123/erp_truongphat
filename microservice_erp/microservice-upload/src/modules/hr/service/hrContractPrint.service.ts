import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import 'dotenv/config';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as os from 'os';
import * as fetch from 'node-fetch';
import { join, parse, sep } from 'path';
import * as path from 'path';
import { GenerateLaborContractXmlService } from '../generate-xml/generate-labor-contract-xml.service';
import { Linter } from 'eslint';
@Injectable()
export class HrContractPrintService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateLaborContractXmlService,
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
          console.log(
            `Đã hoàn thành 1 task. Số task còn lại trong hàng đợi: ${this.taskQueue.length}`,
          );
          if (this.taskQueue.length > 0) {
            const nextTask = this.taskQueue.shift();
            console.log(
              `task tiếp theo. Số task còn lại sau khi lấy ra: ${this.taskQueue.length}`,
            );
            nextTask?.();
          }
        }
      };

      if (!this.isProcessing) {
        console.log(
          'Hiện tại không có task nào đang xử lý, bắt đầu chạy task ngay lập tức',
        );
        executeTask();
      } else {
        this.taskQueue.push(executeTask);
        console.log(
          `Task được thêm vào hàng đợi. Tổng số task trong hàng đợi hiện tại: ${this.taskQueue.length}`,
        );
      }
    });
  }

  private urlToBase64(url: string): Observable<string | null> {
    return from(fetch(url)).pipe(
      switchMap((response) => from(response.arrayBuffer())),
      map((buffer) => Buffer.from(buffer).toString('base64')),
      catchError((error) => {
        return of(null);
      }),
    );
  }
  /*  private async convertToPdf(
     docxPath: string,
     pdfDir: string,
   ): Promise<string> {
     const pythonScript = join(
       __dirname,
       '..',
       '..',
       '..',
       '..',
       '..',
       'python',
       'convert.py',
     );
 
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
  generateDocx(
    data: any,
    templatePath: any,
  ): Observable<{ docxBuffer: Buffer; pdfBuffer: Buffer }> {
    if (!data.FileName) {
      return throwError(() => new Error('File name is required'));
    }

    if (!fs.existsSync(templatePath) || !fs.statSync(templatePath).isFile()) {
      return throwError(() => new NotFoundException('Template file not found'));
    }

    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      linebreaks: true,
      paragraphLoop: true,
    });

    const isValidUrl = (url: any): url is string =>
      typeof url === 'string' && url.startsWith('http');
    const imageObservables = {
      LinkImage1: isValidUrl(data.LinkImage1)
        ? this.urlToBase64(data.LinkImage1)
        : of(null),
    };

    return forkJoin(imageObservables).pipe(
      switchMap((images) => {
        doc.render({ ...data, ...images });

        const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });

        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docx-pdf-'));
        const userFolder = data.EmpSeq?.toString() || 'default';
        const tempDocxPath = path.join(tempDir, userFolder, `default.docx`);

        fs.mkdirSync(path.dirname(tempDocxPath), { recursive: true });

        return from(fs.promises.writeFile(tempDocxPath, docxBuffer)).pipe(
          switchMap(() => from(this.convertToPdf(tempDocxPath, tempDir))),
          switchMap((pdfPath: string) =>
            forkJoin({
              docxBuffer: from(fs.promises.readFile(tempDocxPath)),
              pdfBuffer: from(fs.promises.readFile(pdfPath)),
            }),
          ),
          catchError((err) => throwError(() => err)),
        );
      }),
    );
  }

  laborContractPrint(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;

    const generateQuery = (
      xmlDocument: string,
      procedure: string,
      serviceSeq: number,
      pgmSeq: number,
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

    const xmlDoc1 =
      this.generateXmlService.generateXMLLaborContractPrint1(result);

    const queries = [
      generateQuery(xmlDoc1, 'VTN_SDALabourContractPrint1', 9941, 1019401),
    ];

    return forkJoin(
      queries.map((q) => from(this.databaseService.executeQuery(q))),
    ).pipe(
      switchMap(([userFiles]) => {
        const now = new Date();

        const formatDateTime = (date: Date) =>
          `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}` +
          `${date.getDate().toString().padStart(2, '0')}` +
          `${date.getHours().toString().padStart(2, '0')}` +
          `${date.getMinutes().toString().padStart(2, '0')}` +
          `${date.getSeconds().toString().padStart(2, '0')}`;

        const formatDate = (dateStr: string) => {
          if (!dateStr || dateStr.length < 8) return '';
          const date = new Date(
            Number.parseInt(dateStr.slice(0, 4)),
            Number.parseInt(dateStr.slice(4, 6)) - 1,
            Number.parseInt(dateStr.slice(6, 8)),
          );
          return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        };

        const formatCurrentDate = (dateStr: string) => {
          if (!dateStr || dateStr.length < 8) return '';

          const year = parseInt(dateStr.slice(0, 4), 10);
          const month = parseInt(dateStr.slice(4, 6), 10);
          const day = parseInt(dateStr.slice(6, 8), 10);

          return `ngày ${day.toString().padStart(2, '0')} tháng ${month
            .toString()
            .padStart(2, '0')} năm ${year}`;
        };

        const formatVND = (value) => {
          const number = Number(value);
          return isNaN(number)
            ? ''
            : new Intl.NumberFormat('vi-VN').format(number);
        };

        const currentDateStr = formatDateTime(now);
        const contractTemplates: Record<string, string> = {
          '1000447005': 'HOP_DONG_CHINH_THUC_VO_THOI_HAN.docx',
          '1000447003': 'HOP_DONG_CHINH_THUC_LAN_1_NHAN VIEN.docx',
          '1000447004': 'HOP_DONG_CHINH_THUC_LAN_2.docx',
          '1000447010': 'PHU_LUC_HDLD.docx',
          '1000447002': 'HOP_DONG_THU_VIEC_NHAN_VIEN.docx',
          '1000447009': 'HOP_DONG_CONG_NHAN_LAN_1.docx',
        };

        const certificateTemplates: Record<number, string> = {
          1: 'DANH_GIA_SAU_THU_VIEC_NHAN_VIEN.docx',
          2: 'DANH_GIA_KY_TIEP_HOP_DONG_LAO_DONG_NV.docx',
        };

        const generateSingleDoc$ = (userFile: any) => {
          const fileName = contractTemplates[userFile?.ContractKind];
          if (!fileName) {
            return of({
              success: false,
              error: `Không tìm thấy template ${userFile?.ContractKind}`,
            });
          }

          const templatePath = join(process.env.PATHS_TEMPLATE, fileName);

          const newData = {
            ...userFile,
            FileName: `${(userFile?.ContractNo || '').trim()}_${currentDateStr}`,
            templatePath: templatePath.split(/[/\\]/).pop(),
            BasSal: formatVND(userFile?.BasSal || 0),
            BasSalEn: formatVND(userFile?.BasSalEn || 0),
            TotAll: formatVND(userFile?.TotAll || 0),
            TotAllEn: formatVND(userFile?.TotAllEn || 0),
            TotSal: formatVND(userFile?.TotSal || 0),
            TotSalEn: formatVND(userFile?.TotSalEn || 0),
            LivingAmt: formatVND(userFile?.LivingAmt || 0),
            WorkHardAmt: formatVND(userFile?.WorkHardAmt || 0),
            IncentiveAmt: formatVND(userFile?.IncentiveAmt || 0),
            FromDate: formatDate(userFile?.FromDate || ''),
            ToDate: formatDate(userFile?.ToDate || userFile?.Todate || ''),
            BOD: formatDate(userFile?.BOD || ''),
            ResidIdDate: formatDate(userFile?.ResidIdDate || ''),
            Date1: formatDate(userFile?.Date1 || ''),
            Date2: formatDate(userFile?.Date2 || ''),
            ContractDate: formatDate(userFile?.ContractDate || ''),
            PositionEn: userFile?.PositionEn || '',
            CurrentDate: formatCurrentDate(userFile?.FromDate || ''),
            ContractNo: (userFile?.ContractNo || '').trim() || '',
          };

          return this.generateDocx(newData, templatePath).pipe(
            map(({ pdfBuffer }) => ({
              FileName: newData.FileName,
              FilePdfBase64: pdfBuffer.toString('base64'),
            })),
          );
        };

        const generateSingleDocCetificate$ = (userFile: any) => {
          const fileName = certificateTemplates[result[0]?.CertificateType];
          if (!fileName) {
            return of({
              success: false,
              error: `Không tìm thấy template ${userFile?.CertificateType}`,
            });
          }

          const templatePath = join(process.env.PATHS_TEMPLATE, fileName);

          const newData = {
            ...userFile,
            FileName: `${(userFile?.ContractNo || '').trim()}_${currentDateStr}`,
            templatePath: templatePath.split(/[/\\]/).pop(),
            BasSal: formatVND(userFile?.BasSal || 0),
            BasSalEn: formatVND(userFile?.BasSalEn || 0),
            TotAll: formatVND(userFile?.TotAll || 0),
            TotAllEn: formatVND(userFile?.TotAllEn || 0),
            TotSal: formatVND(userFile?.TotSal || 0),
            TotSalEn: formatVND(userFile?.TotSalEn || 0),
            LivingAmt: formatVND(userFile?.LivingAmt || 0),
            WorkHardAmt: formatVND(userFile?.WorkHardAmt || 0),
            IncentiveAmt: formatVND(userFile?.IncentiveAmt || 0),
            FromDate: formatDate(userFile?.FromDate || ''),
            ToDate: formatDate(userFile?.ToDate || userFile?.Todate || ''),
            BOD: formatDate(userFile?.BOD || ''),
            ResidIdDate: formatDate(userFile?.ResidIdDate || ''),
            Date1: formatDate(userFile?.Date1 || ''),
            Date2: formatDate(userFile?.Date2 || ''),
            ContractDate: formatDate(userFile?.ContractDate || ''),
            PositionEn: userFile?.PositionEn || '',
            CurrentDate: formatCurrentDate(userFile?.FromDate || ''),
            ContractNo: (userFile?.ContractNo || '').trim() || '',
            EntDate: formatDate(userFile?.Date1 || ''),
            ContractDateTo: formatDate(userFile?.Date3 || ''),
          };

          return this.generateDocx(newData, templatePath).pipe(
            map(({ pdfBuffer }) => ({
              FileName: newData.FileName,
              FilePdfBase64: pdfBuffer.toString('base64'),
            })),
          );
        };

        let tasks$ = null;
        if (result[0]?.CertificateType) {
          tasks$ = userFiles.map(generateSingleDocCetificate$).filter(Boolean);
        } else {
          tasks$ = userFiles.map(generateSingleDoc$).filter(Boolean);
        }

        return forkJoin(tasks$).pipe(
          map((files: any) => {
            const hasFailure = files.some((f) => f.success === false);
            if (hasFailure) {
              return {
                success: false,
                errors:
                  files.find((f) => f.success === false)?.error ||
                  'Lỗi khi tạo hợp đồng lao động',
              };
            }
            return {
              success: true,
              data: files,
            };
          }),
        );
      }),
      catchError((err) => {
        console.error(err);
        return of({ success: false, error: err.message });
      }),
    );
  }

  printContract(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    return from(
      this.enqueueTask(() =>
        this.laborContractPrint(result, companySeq, userSeq).toPromise(),
      ),
    );
  }

  printBasCertificate(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    return from(
      this.enqueueTask(() =>
        this.basCertificatePrint(result, companySeq, userSeq).toPromise(),
      ),
    );
  }

  basCertificatePrint(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;

    const generateQuery = (
      xmlDocument: string,
      procedure: string,
      serviceSeq: number,
      pgmSeq: number,
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

    const xmlDoc1 =
      this.generateXmlService.generateXMLprintBasCertificate(result);

    const queries = [
      generateQuery(xmlDoc1, '_SHRBasCertificateRptQuery', 2113, 1819),
    ];

    return forkJoin(
      queries.map((q) => from(this.databaseService.executeQuery(q))),
    ).pipe(
      switchMap(([...data]) => {
        const userFiles = data.pop();
        const now = new Date();

        const formatDateTime = (date: Date) =>
          `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}` +
          `${date.getDate().toString().padStart(2, '0')}` +
          `${date.getHours().toString().padStart(2, '0')}` +
          `${date.getMinutes().toString().padStart(2, '0')}` +
          `${date.getSeconds().toString().padStart(2, '0')}`;

        const formatDate = (dateStr: string) => {
          if (!dateStr || dateStr.length < 8) return '';
          const date = new Date(
            Number.parseInt(dateStr.slice(0, 4)),
            Number.parseInt(dateStr.slice(4, 6)) - 1,
            Number.parseInt(dateStr.slice(6, 8)),
          );
          return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        };

        const getDateParts = (dateStr: string) => {
          if (!dateStr || dateStr.length < 8)
            return { day: '', month: '', year: '' };

          const year = dateStr.slice(0, 4);
          const month = dateStr.slice(4, 6);
          const day = dateStr.slice(6, 8);

          return {
            day,
            month,
            year,
          };
        };

        const formatVND = (value) => {
          const number = Number(value);
          return isNaN(number)
            ? ''
            : new Intl.NumberFormat('vi-VN').format(number);
        };

        const currentDateStr = formatDateTime(now);
        const contractTemplates: Record<string, string> = {
          '3067001': 'GIAY_XAC_NHAN_NHAN_SU.docx',
          '3067003': 'GIAY_XAC_NHAN_NHAN_SU_ENG.docx',
          '3067002': 'GIAY_CHUNG_NHAN_DANH_GIA_NANG_LUC_KOR.docx',
        };

        const generateSingleDoc$ = (userFile: any) => {
          const fileName = contractTemplates[userFile?.SMCertiType];
          if (!fileName) {
            return of({
              success: false,
              error: `Không tìm thấy template ${userFile?.SMCertiType}`,
            });
          }

          const templatePath = join(process.env.PATHS_TEMPLATE, fileName);

          const { day, month, year } = getDateParts(userFile?.ApplyDate || '');
          const {
            day: DayFr,
            month: MonthFr,
            year: YearFr,
          } = getDateParts(userFile?.EntDate || '');
          const {
            day: DayTo,
            month: MonthTo,
            year: YearTo,
          } = getDateParts(userFile?.RetireDate || '');

          const newData = {
            ...userFile,
            FileName: `${(userFile?.EmpID || '').trim()}_${currentDateStr}`,
            templatePath: templatePath.split(/[/\\]/).pop(),
            BasSal: formatVND(userFile?.BasSal || 0),
            EmpName: userFile?.EmpName || '',

            EmpID: userFile?.EmpID || '',
            ResidID: userFile?.ResidID || '',
            ApplyDate: formatDate(userFile?.ApplyDate || ''),
            EntDate: formatDate(userFile?.EntDate || ''),
            IssueDate: formatDate(userFile?.IssueDate || ''),
            Year: year || '',
            Month: month || '',
            Day: day || '',
            Province: userFile?.Province || '',
            District: userFile?.District || '',
            Commune: userFile?.Commune || '',
            Line: userFile?.Line || '',
            Number: userFile?.Number || '',
            YearFr: YearFr || '',
            MonthFr: MonthFr || '',
            DayFr: DayFr || '',

            YearTo: YearTo || '',
            MonthTo: MonthTo || '',
            DayTo: DayTo || '',

            TermYy: userFile?.TermYy || '',
            TermMm: userFile?.TermMm || '',
            TermDd: userFile?.TermDd || '',
          };

          return this.generateDocx(newData, templatePath).pipe(
            map(({ pdfBuffer }) => ({
              FileName: newData.FileName,
              FilePdfBase64: pdfBuffer.toString('base64'),
            })),
          );
        };

        const tasks$ = userFiles.map(generateSingleDoc$).filter(Boolean);

        return forkJoin(tasks$).pipe(
          map((files: any) => {
            const hasFailure = files.some((f) => f.success === false);
            if (hasFailure) {
              return {
                success: false,
                errors:
                  files.find((f) => f.success === false)?.error ||
                  'Lỗi khi tạo hợp đồng lao động',
              };
            }
            return {
              success: true,
              data: files,
            };
          }),
        );
      }),
      catchError((err) => {
        console.error(err);
        return of({ success: false, error: err.message });
      }),
    );
  }
}
