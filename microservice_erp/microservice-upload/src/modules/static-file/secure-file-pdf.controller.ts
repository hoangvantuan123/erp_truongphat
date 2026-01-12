import {
    Controller,
    Get,
    Param,
    Res,
    Req,
    Header,
    HttpCode,
    Options,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { join, normalize } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('secure-file-pdf')
export class SecureFilePdfController {
    private readonly basePath: string;
    private readonly publicDir = join(__dirname, '..', '..', '..', 'public');

    constructor(private readonly configService: ConfigService) {
        this.basePath = this.configService.get<string>(
            'FILE_STORAGE_BASE_SYSTEM_ASSETS_PDF_PATH',
        );
    }

    @Options('system/assets/pdf/:date/:printId/:filename')
    @HttpCode(204)
    handlePreflight(
        @Param('date') date: string,
        @Param('filename') filename: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const origin = req.headers.origin || '*';
        res
            .header('Access-Control-Allow-Origin', origin)
            .header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            .header('Access-Control-Allow-Credentials', 'true');
        return res.send();
    }

    @Get('system/assets/pdf/:date/:printId/:filename')
    async getFile(
        @Param('date') date: string,
        @Param('printId') printId: string,
        @Param('filename') filename: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const rawPath = join(this.basePath, date, printId,filename);
            const filePath = normalize(rawPath);

            const origin = req.headers.origin || '*';
            res
                .header('Access-Control-Allow-Origin', origin)
                .header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                .header('Access-Control-Allow-Credentials', 'true');

            if (!filePath.startsWith(normalize(this.basePath))) {
                return res
                    .status(403)
                    .sendFile(join(this.publicDir, '403.html'));
            }

            if (!fs.existsSync(filePath)) {
                return res
                    .status(404)
                    .sendFile(join(this.publicDir, '404.html'));
            }

            res.type('application/pdf');

            return res.sendFile(filePath);
        } catch (error) {
            return res
                .status(500)
                .sendFile(join(this.publicDir, '500.html'));
        }
    }
}
