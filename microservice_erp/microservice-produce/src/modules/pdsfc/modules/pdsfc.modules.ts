import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { PdsfcListService } from '../services/pdsfcList.service';
import { PdsfcListController } from '../controller/pdsfcList.controller';
import { PdsfcWorkReportService } from '../services/pdsfcWorkReport.service';
import { PdsfcWorkReportController } from '../controller/pdsfcWorkReport.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [PdsfcListController, PdsfcWorkReportController],
    providers: [DatabaseService, GenerateXmlService, PdsfcListService, PdsfcWorkReportService],
})
export class Pdsfc { }
