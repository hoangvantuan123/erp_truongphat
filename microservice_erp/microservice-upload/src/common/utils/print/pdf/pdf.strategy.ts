import { PdfConverter } from '../pdf/pdf-converter.interface';
import { LibreOfficeConverter } from '../pdf/libreoffice.converter';
import { WordPdfConverter } from '../pdf/word-windows.converter';
import * as dotenv from 'dotenv';
dotenv.config();

let converter: PdfConverter;

switch (process.env.PDF_CONVERT_STRATEGY) {
    case 'windows':
        converter = new WordPdfConverter();
        break;
    case 'libreoffice':
    default:
        converter = new LibreOfficeConverter();
        break;
}

export default converter;
