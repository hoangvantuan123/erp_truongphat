import { exec } from 'child_process';
import { join, parse } from 'path';
import { PdfConverter } from './pdf-converter.interface';

export class LibreOfficeConverter implements PdfConverter {
    constructor(private libreOfficePath: string = 'libreoffice') {}

    async convertToPdf(docxPath: string, pdfDir: string): Promise<string> {
        const pdfPath = join(pdfDir, parse(docxPath).name + '.pdf');
        const command = `"${this.libreOfficePath}" --headless --convert-to pdf --outdir "${pdfDir}" "${docxPath}"`;

        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) return reject(error);
                resolve(pdfPath);
            });
        });
    }
}
