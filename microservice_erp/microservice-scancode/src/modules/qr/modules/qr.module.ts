import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QrcodeController } from '../controllers/qrcode.controller';
import { QrcodeImageService } from '../services/qrcodeImage.service';
import { QrcodeService } from '../services/qrcode.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
  ],
  controllers: [QrcodeController],
  providers: [QrcodeImageService, QrcodeService],
})
export class QRModule { }
