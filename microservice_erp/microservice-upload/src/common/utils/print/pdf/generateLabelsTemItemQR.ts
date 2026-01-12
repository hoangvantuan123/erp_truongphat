import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { join } from 'path';
import { Observable } from 'rxjs';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

@Injectable()
export class GenerateLabelsTemItemQRService {
    generateLabelsPdf(data: any[], outputDir: string, fileName: string, typeFile?: number): Observable<string> {
        return new Observable<string>((observer) => {
            const pythonPath = process.env.PYTHON_PATH;
            if (!pythonPath) {
                observer.error(new Error('PYTHON_PATH không được cấu hình trong .env'));
                return;
            }

            const pythonScript = join(__dirname, '..', '..', '..', '..', '..', '..', 'python', 'item', 'item_print_label.py');
            const pythonScriptA4 = join(__dirname, '..', '..', '..', '..', '..', '..', 'python', 'item', 'item_print_a4.py');

            if (!fs.existsSync(pythonScript) || !fs.existsSync(pythonScriptA4)) {
                observer.error(new Error(`Không tìm thấy file Python.`));
                return;
            }

            const scriptType = typeFile ?? 1;
            const pythonScriptToRun = scriptType === 2 ? pythonScriptA4 : pythonScript;

            const newfile = `${fileName}.pdf`;
            const outputPath = join(outputDir, newfile);
            const command = `"${pythonPath}" "${pythonScriptToRun}" "${outputPath}"`;

            const child = exec(command, { windowsHide: true }, (error, stdout, stderr) => {
                if (error) {
                    observer.error(error);
                    return;
                }

                if (stderr && stderr.trim().length > 0) {
                    observer.error(new Error(`Python stderr: ${stderr}`));
                    return;
                }

                if (!fs.existsSync(outputPath)) {
                    observer.error(new Error('Không tìm thấy file PDF đầu ra'));
                    return;
                }

                observer.next(outputPath);
                observer.complete();
            });

            try {
                child.stdin?.write(JSON.stringify(data));
                child.stdin?.end();
            } catch (err) {
                observer.error(new Error('Lỗi khi gửi dữ liệu vào Python process'));
            }
        });
    }

}
