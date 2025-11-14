// pdf-converter.interface.ts
export interface PdfConverter {
    convertToPdf(docxPath: string, pdfDir: string): Promise<string>;
}
