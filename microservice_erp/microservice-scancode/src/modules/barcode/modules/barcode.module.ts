import { Module } from '@nestjs/common';
import { BarcodeController } from '../controllers/barcode.controller';
import { BarcodeService } from '../services/barcode.service';

@Module({
    controllers: [BarcodeController],
    providers: [BarcodeService],
})
export class BarcodeModule { }