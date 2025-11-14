import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { CogsReportService } from '../service/cogsReport.service';
import { CogsReportController } from '../controller/cogsReport.controller';
@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [
        CogsReportController
    ],
    providers: [
        DatabaseService,
        GenerateXmlService,
        CogsReportService

    ],
})
export class CogsReportModule { }
