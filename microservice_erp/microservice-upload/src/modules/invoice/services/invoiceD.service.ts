import { Injectable, NotFoundException } from '@nestjs/common';
import { join, parse, sep } from 'path';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as ImageModule from 'docxtemplater-image-module-free';
import * as fetch from 'node-fetch';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { ERPFileInvocie } from '../entities/invoice.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class InvoiceDService {

    constructor(
        private readonly databaseService: DatabaseService,
        @InjectRepository(ERPFileInvocie)
        private readonly ERPFileInvocieRepository: Repository<ERPFileInvocie>,
    ) { }

    async delete(FormCode: string): Promise<any> {
        try {
            const filesToDelete = await this.ERPFileInvocieRepository.find({
                where: {
                    FormCode: FormCode,
                },
                select: ['FormCode']
            });

            // Xóa trong database trước
            const result = await this.ERPFileInvocieRepository.delete({
                FormCode: FormCode,
            });

            const directories = [
                join(sep === '\\' ? 'D:\\Tmp\\docx' : '/var/www/invoice/docx'),
                join(sep === '\\' ? 'D:\\Tmp\\pdf' : '/var/www/invoice/pdf')
            ];

            if (filesToDelete.length > 0) {
                for (const file of filesToDelete) {
                    // Kiểm tra và xóa ở tất cả các thư mục
                    for (const dir of directories) {
                        // Thêm đuôi .pdf và .docx để kiểm tra
                        const possibleFiles = [
                            join(dir, `${file.FormCode}.pdf`),
                            join(dir, `${file.FormCode}.docx`)
                        ];

                        for (const filePath of possibleFiles) {
                            console.log(`Đang kiểm tra và xóa file tại: ${filePath}`);

                            try {
                                // Kiểm tra file có tồn tại không
                                await fs.access(filePath);

                                // Nếu tồn tại, tiến hành xóa
                                await fs.unlink(filePath);
                                console.log(`Đã xóa file: ${filePath}`);
                            } catch (err) {
                                if (err.code === 'ENOENT') {
                                    console.warn(`File không tồn tại: ${filePath}`);
                                } else if (err.code === 'EACCES') {
                                    console.error(`Không đủ quyền xóa file: ${filePath}`);
                                } else {
                                    console.error(`Lỗi khi xóa file: ${filePath}`, err);
                                }
                            }
                        }
                    }
                }
            }

            // Trả về kết quả sau khi xóa
            return {
                success: true,
                message:
                    result.affected > 0
                        ? `${result.affected} item(s) deleted successfully.`
                        : 'No items found to delete.',
            };
        } catch (error: any) {
            console.error('Error during delete operation:', error);
            return {
                success: false,
                message: `An error occurred while trying to delete items: ${error.message}`,
            };
        }
    }

}