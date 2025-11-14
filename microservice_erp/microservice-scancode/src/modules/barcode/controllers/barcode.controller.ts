import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BarcodeService } from '../services/barcode.service';

@Controller('barcode')
export class BarcodeController {
    constructor(private readonly barcodeService: BarcodeService) { }
    /* http://localhost:8098/api/barcode?text=1234567890&bcType=code39&includetext=false */
    @Get()
    generateBarcode(@Query('text') text: string, @Query('bcType') bcType: string, @Query('includetext') includetext: boolean, @Res() res: Response) {
        if (!text || !bcType) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Text and barcode type are required' });
        }

        try {
            this.barcodeService.generateBarcode(text, bcType, includetext, (err, png) => {
                if (err) {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error generating barcode' });
                } else {
                    res.writeHead(HttpStatus.OK, { 'Content-Type': 'image/png' });
                    res.end(png);
                }
            });
        } catch (err) {
            console.error('Error generating barcode:', err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }
}