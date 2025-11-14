import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { join } from 'path';
import { Observable } from 'rxjs';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

@Injectable()
export class GenerateLabelsTemJIGQRService {
    generateLabelsPdf(data: any[], configPath: string, outputDir: string, fileName: string): Observable<string> {
        return new Observable<string>((observer) => {
            const pythonPath = process.env.PYTHON_PATH;
            if (!pythonPath) {
                observer.error(new Error('PYTHON_PATH không được cấu hình trong .env'));
                return;
            }

            const pythonScript = join(__dirname, '..', '..', '..', '..', '..', '..', 'python', 'asset', 'tem_jig.py');
            if (!fs.existsSync(pythonScript)) {
                observer.error(new Error(`Không tìm thấy file Python: ${pythonScript}`));
                return;
            }
            const newfile = `${fileName}.pdf`;
            const outputPath = join(outputDir, newfile);
            const command = `"${pythonPath}" "${pythonScript}" "${configPath}" "${outputPath}"`;

            const child = exec(command, { windowsHide: true }, (error, stdout, stderr) => {
                if (error) {
                    observer.error(error);
                    return;
                }

                if (stderr && stderr.trim().length > 0) {
                    observer.error(new Error(`Python stderr: ${stderr}`));
                    return;
                }

                // Kiểm tra file output thực sự được tạo
                if (!fs.existsSync(outputPath)) {
                    observer.error(new Error('Không tìm thấy file PDF đầu ra'));
                    return;
                }

                observer.next(outputPath);
                observer.complete();
            });

            // Gửi dữ liệu JSON sang Python qua stdin
            try {
                child.stdin?.write(JSON.stringify(data));
                child.stdin?.end();
            } catch (err) {
                observer.error(new Error('Lỗi khi gửi dữ liệu vào Python process'));
            }
        });
    }
}
