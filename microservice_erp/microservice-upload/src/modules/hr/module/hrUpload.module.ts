import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { HrEmpInfoService } from '../service/hrEmpInfo.service';
import { HrEmpInfoController } from '../controller/hrEmpInfo.controller';
import { GenerateLaborContractXmlService } from '../generate-xml/generate-labor-contract-xml.service';
import { HrContractPrintService } from '../service/hrContractPrint.service';
import { HrContractPrintController } from '../controller/hrContractPrint.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [
        HrEmpInfoController,
        HrContractPrintController,
    ],
    providers: [
        HrEmpInfoService,
        DatabaseService,
        GenerateXmlService,
        GenerateLaborContractXmlService,
        HrContractPrintService,
    ],
})
export class HrUploadInfo { }
