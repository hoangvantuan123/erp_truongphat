import { exec } from 'child_process';
import { join } from 'path';
import { PdfConverter } from './pdf-converter.interface';
import * as dotenv from 'dotenv';
dotenv.config();

export class WordPdfConverter implements PdfConverter {
    async convertToPdf(docxPath: string, pdfDir: string): Promise<string> {
        const pythonPath = process.env.PYTHON_PATH;
        const pythonScript = join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            '..',
            'python', 'convert.py');
        const command = `"${pythonPath}" "${pythonScript}" "${docxPath}" "${pdfDir}"`;

        return new Promise((resolve, reject) => {
            exec(command, { windowsHide: true }, (error, stdout) => {
                if (error) return reject(error);
                const outputPath = stdout.trim();
                if (!outputPath.endsWith('.pdf')) {
                    return reject(new Error('Không lấy được file PDF đầu ra'));
                }
                resolve(outputPath);
            });
        });
    }
}
