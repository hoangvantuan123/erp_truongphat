import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { RptHrInoutController } from '../controller/rptHrInout.controller';
import { RptHrInoutService } from '../service/rptHrInout.service';
@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [
        RptHrInoutController
    ],
    providers: [
        DatabaseService,
        GenerateXmlService,
        RptHrInoutService
    ],
})
export class HrReportModule { }
