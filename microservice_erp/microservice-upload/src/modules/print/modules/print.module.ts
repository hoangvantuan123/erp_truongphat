import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sqlServerERP } from 'src/config/database.config';
import { DocxAssetUtilsService } from 'src/common/utils/print/docx/docxAssetUtils';
import { ErpTemJIGQRService } from '../services/temJIGQR';
import { ERPPrintFile } from '../entities/filePrint.entity';
import { ERPPrintFileService } from '../services/filePrint.service';
import { GenerateLabelsTemJIGQRService } from 'src/common/utils/print/pdf/generateLabelsTemJIGQR';
import { ErpJIGQRTaggingController } from '../controller/assetQRTagging.controller';
import { ErpItemQRTaggingController } from '../controller/itemQRTagging.controller';
import { ErpItemPrintQRService } from '../services/itemPrint.server';
import { GenerateLabelsTemItemQRService } from 'src/common/utils/print/pdf/generateLabelsTemItemQR';
import { FilePrintController } from '../controller/filePrint.controller';

import { PrintLgEtcOutService } from '../services/printLgEtcOut.service';
import { PrintPdmmOutExtraService } from '../services/printPdmmOutExtra.service';
import { PrintController } from '../controller/print.controller';
import { PdmmOutExtraController } from '../controller/printPdmmOutExtra.controller';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([ERPPrintFile]),
        TypeOrmModule.forRoot(sqlServerERP)
    ],
    controllers: [ErpJIGQRTaggingController, ErpItemQRTaggingController, FilePrintController, PdmmOutExtraController, PrintController],
    providers: [ErpTemJIGQRService, GenerateXmlService, DocxAssetUtilsService, ERPPrintFileService, GenerateLabelsTemJIGQRService, ErpItemPrintQRService, GenerateLabelsTemItemQRService, PrintPdmmOutExtraService, PrintLgEtcOutService],
})
export class PrintModule { }
