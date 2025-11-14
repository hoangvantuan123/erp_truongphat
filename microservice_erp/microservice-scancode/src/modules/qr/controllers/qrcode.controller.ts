import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QrcodeService } from '../services/qrcode.service';
import { QrcodeImageService } from '../services/qrcodeImage.service';

@Controller()
export class QrcodeController {
    constructor(
        private readonly qrcodeService: QrcodeService,
        private readonly qrcodeImageService: QrcodeImageService) { }

    /* http://localhost:8098/api/qrcode?url= */
    @Get('qrcode')
    generateQrCode(@Query('url') url: string, @Res() res: Response) {
        if (!url) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URL is required' });
        }
        try {
            const qrPng = this.qrcodeService.generateQrCode(url);
            res.writeHead(HttpStatus.OK, { 'Content-Type': 'image/png' });
            res.end(qrPng);
        } catch (err) {

            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }

    /* http://localhost:8098/api/qrcode-logo?url=url&logoUrl=text.png */
    @Get('qrcode-logo')
    async generateQrCodeWithLogo(
        @Query('url') url: string,
        @Query('logoUrl') logoUrl: string,
        @Query('size') size: string,
        @Res() res: Response
    ) {
        if (!url || !logoUrl) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URL and logo URL are required' });
        }

        // Chuyển đổi size từ string sang number và đảm bảo giá trị hợp lệ
        const qrSize = size ? parseInt(size, 10) : 10; // Giá trị mặc định là 10
        if (isNaN(qrSize) || qrSize <= 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid size parameter' });
        }

        try {
            const qrWithLogoBuffer = await this.qrcodeImageService.generateQrCodeWithLogo(url, logoUrl, qrSize);
            res.set('Content-Type', 'image/png');
            res.send(qrWithLogoBuffer);
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }

}