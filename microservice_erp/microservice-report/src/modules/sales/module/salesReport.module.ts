import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { RptSalesCatService } from '../service/rptSalesCat.service';
import { RptSalesCatController } from '../controller/rptSalesCat.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [
        RptSalesCatController
    ],
    providers: [
        DatabaseService,
        GenerateXmlService,
        RptSalesCatService
    ],
})
export class SalesReportModule { }
