import {
    Controller,
    Get,
    Param,
    Res,
    Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { join, normalize } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('secure-qr-tagg-file')
export class SecureQRTaggFileController {
    private readonly basePath: string;
    private readonly publicDir = join(__dirname, '..', '..', '..', 'public');

    constructor(private readonly configService: ConfigService) {
        this.basePath = this.configService.get<string>(
            'FILE_STORAGE_BASE_SYSTEM_ASSETS_DOCX_PATH'
        );
    }

    @Get('system/qr-tagg/:date/merged/:filename')
    getFile(
        @Param('date') date: string,
        @Param('filename') filename: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const rawPath = join(this.basePath, date, 'merged', filename);
            const filePath = normalize(rawPath);

            // Chặn path traversal
            if (!filePath.startsWith(normalize(this.basePath))) {
                return res.status(403).sendFile(join(this.publicDir, '403.html'));
            }

            if (!fs.existsSync(filePath)) {
                return res.status(404).sendFile(join(this.publicDir, '404.html'));
            }

            // Thiết lập header để tải đúng tên file
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${encodeURIComponent(filename)}"`
            );

            return res.sendFile(filePath);
        } catch (error) {
            console.error('Lỗi tải file:', error);
            return res.status(500).sendFile(join(this.publicDir, '500.html'));
        }
    }
}
