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

@Controller('/v4')
export class SecureFilePublicController {
    private readonly basePath: string;
    private readonly publicDir = join(__dirname, '..', '..', '..', 'public');

    constructor(private readonly configService: ConfigService) {
        this.basePath = this.configService.get<string>(
            'STORAGE_ROOT',
        );
    }

    @Get('system/wh/:seq/:date/:filename')
    async getFile(
        @Param('date') date: string,
        @Param('seq') seq: string,
        @Param('filename') filename: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const rawPath = join(this.basePath, 'system', 'wh', seq, date, filename);
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

            res.type(filename);

            return res.sendFile(filePath);
        } catch (error) {
            return res
                .status(500)
                .sendFile(join(this.publicDir, '500.html'));
        }
    }
}
