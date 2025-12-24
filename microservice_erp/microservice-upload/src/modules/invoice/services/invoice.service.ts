import { Injectable, NotFoundException } from '@nestjs/common';
import { join, parse, sep } from 'path';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as ImageModule from 'docxtemplater-image-module-free';
import * as fetch from 'node-fetch';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { ERPFileInvocie } from '../entities/invoice.entity';
import { Repository, In } from 'typeorm';
import 'dotenv/config';

@Injectable()
export class InvoiceService {
  private libreOfficePath: string;

  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(ERPFileInvocie)
    private readonly ERPFileInvocieRepository: Repository<ERPFileInvocie>,
  ) {
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  async addMultiple(records: any[], createdBy: number): Promise<any> {
    if (!records || records.length === 0) {
      throw new Error('No records provided for insertion');
    }

    const processedRecords = records.map((record) => ({
      ...record,
      CreatedBy: createdBy,
    }));

    const batchSize = 1000;
    const batches = this.chunkArray(processedRecords, batchSize);

    let affectedRows = 0;
    let insertedRecords: ERPFileInvocie[] = [];

    for (const batch of batches) {
      const result = await this.ERPFileInvocieRepository.insert(batch);

      const insertedIds = result.identifiers.map((item) => item.IdSeq);

      const newlyInsertedRecords =
        await this.ERPFileInvocieRepository.createQueryBuilder('file')
          .select([
            'file.IdSeq as "IdSeq"',
            'file.FormCode as "FormCode"',
            'file.Destination as "Destination"',
            'file.Path as "Path"',
            'file.IdxNo as "IdxNo"',
            'file.CreatedBy as "CreatedBy"',
            'file.CreatedAt as "CreatedAt"',
            'file.UpdatedBy as "UpdatedBy"',
            'file.UpdatedAt as "UpdatedAt"',
            'UserSeq.UserName as "UserName"',
            'UserSeq.UserId as "UserId"',
          ])
          .leftJoin(
            '_TCAUser_WEB',
            'UserSeq',
            'file.CreatedBy = UserSeq.UserSeq',
          )
          .where('file.IdSeq IN (:...insertedIds)', { insertedIds })
          .getRawMany();

      affectedRows += result.identifiers.length;
      insertedRecords = [...insertedRecords, ...newlyInsertedRecords];
    }

    return {
      affectedRows,
      message: 'Records inserted successfully',
      data: insertedRecords,
    };
  }
  private generateFileName(originalFileName: string): string {
    const { name } = parse(originalFileName);
    return `${name}.docx`;
  }

  private async urlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      return buffer.toString('base64');
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  }
  /*  private async convertToPdf(docxPath: string, pdfDir: string): Promise<string> {
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
  async generateDocx(data: any, createdBy: number): Promise<string> {
    if (!data.FileName) {
      throw new Error('File name is required');
    }

    const templatePath = join(process.env.UPLOAD_PATHS, data.templatePath);
    if (!fs.existsSync(templatePath) || !fs.statSync(templatePath).isFile()) {
      throw new NotFoundException('Template file not found');
    }

    const templateContent = fs.readFileSync(templatePath, 'binary');

    const imageOpts = {
      centered: true,
      getImage: (tagValue: any) => {
        const byteCharacters = Buffer.from(tagValue, 'base64').toString(
          'binary',
        );
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Uint8Array(byteNumbers).buffer;
      },

      getSize: (tagValue: any, tagName: string, img: any) => {
        switch (img) {
          case 'LinkImage1':
            return data.sizeImage1;
          case 'LinkImage2':
            return data.sizeImage2;
          case 'LinkImage3':
            return data.sizeImage3;
          case 'LinkImage4':
            return data.sizeImage4;
          default:
            return [0, 0];
        }
      },
    };

    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      modules: [new ImageModule(imageOpts)],
      linebreaks: true,
      paragraphLoop: true,
    });

    const LinkImage1 = await this.urlToBase64(data.LinkImage1);
    const LinkImage2 = await this.urlToBase64(data.LinkImage2);
    const LinkImage3 = await this.urlToBase64(data.LinkImage3);
    const LinkImage4 = await this.urlToBase64(data.LinkImage4);
    if (!LinkImage1 || !LinkImage2 || !LinkImage3 || !LinkImage4) {
      throw new Error('Cannot load image');
    }
    doc.render({
      ...data,
      LinkImage1: LinkImage1,
      LinkImage2: LinkImage2,
      LinkImage3: LinkImage3,
      LinkImage4: LinkImage4,
    });

    const docxDir = join(
      sep === '\\'
        ? 'E:\\ERP_CLOUD\\print_logs\\docx'
        : '/var/www/invoice/docx',
    );
    const pdfDir = join(
      sep === '\\' ? 'E:\\ERP_CLOUD\\print_logs\\pdf' : '/var/www/invoice/pdf',
    );

    if (!fs.existsSync(docxDir)) fs.mkdirSync(docxDir, { recursive: true });
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const FileName = this.generateFileName(data.FileName);
    const docxPath = join(docxDir, FileName);

    await new Promise<void>((resolve, reject) => {
      fs.writeFile(
        docxPath,
        doc.getZip().generate({ type: 'nodebuffer' }),
        (err) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });

    await this.convertToPdf(docxPath, pdfDir);

    let records = [
      {
        FormCode: data.FileName,
        Destination: pdfDir,
        Path: pdfDir,
        IdxNo: 1,
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
      },
    ];
    await this.addMultiple(records, createdBy);

    return data.FileName;
  }

  async findFormCode(formCode: string): Promise<{
    data: any[];
    total: number;
    message: string;
    success: boolean;
  }> {
    const query = this.ERPFileInvocieRepository.createQueryBuilder('invoice');
    query.select([
      'invoice.IdSeq as "IdSeq"',
      'invoice.FormCode as "FormCode"',
      'invoice.Destination as "Destination"',
      'invoice.Path as "Path"',
      'invoice.IdxNo as "IdxNo"',
      'invoice.CreatedBy as "CreatedBy"',
      'invoice.CreatedAt as "CreatedAt"',
      'invoice.UpdatedBy as "UpdatedBy"',
      'invoice.UpdatedAt as "UpdatedAt"',
      'UserSeq.UserName as "UserName"',
      'UserSeq.UserId as "UserId"',
    ]);
    query.where('invoice.FormCode = :formCode', { formCode });
    query.leftJoin(
      '_TCAUser_WEB',
      'UserSeq',
      'invoice.CreatedBy = UserSeq.UserSeq',
    );
    const data = await query.getRawMany();

    return {
      data,
      total: data.length,
      message: 'Success',
      success: true,
    };
  }
}
