import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { PrintLgEtcOutService } from '../services/printLgEtcOut.service';
import { PrintController } from '../controllers/print.controller';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { PrintPdmmOutExtraService } from '../services/printPdmmOutExtra.service';
import { PdmmOutExtraController } from '../controllers/printPdmmOutExtra.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    TypeOrmModule.forRoot(sqlServerITMV)
  ],
  controllers: [PrintController, PdmmOutExtraController],
  providers: [DatabaseService, PrintLgEtcOutService, GenerateXmlService, PrintPdmmOutExtraService],
})
export class PrintModule { }
