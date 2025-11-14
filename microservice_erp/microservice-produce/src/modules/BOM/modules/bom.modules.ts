import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { BOMService } from '../services/bom.service';
import { BomController } from '../controllers/bom.controller';
import { BOMReportAllService } from '../services/reportBOMAll.service';
import { BOMReportAllController } from '../controllers/BOMReportAll.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [BomController, BOMReportAllController],
    providers: [DatabaseService, GenerateXmlService, BOMService, BOMReportAllService],
})
export class BomModule { }
