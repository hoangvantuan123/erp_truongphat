// src/utils/pdfConverter.ts

import { exec } from 'child_process';
import { join } from 'path';

/**
 * Chuyển đổi file .docx sang .pdf bằng Python script.
 * @param docxPath Đường dẫn đến file .docx
 * @param pdfDir Thư mục đầu ra chứa file .pdf
 * @returns Đường dẫn tới file PDF được tạo
 */
export async function convertToPdf(docxPath: string, pdfDir: string): Promise<string> {
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
