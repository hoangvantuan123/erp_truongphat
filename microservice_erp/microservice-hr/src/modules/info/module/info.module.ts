import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { HrEmpPlnService } from '../service/hrEmpPln.service';
import { HrEmpPlnController } from '../controller/hrEmpPln.controller';
import { HrEmpOneService } from '../service/hrEmpOne.service';
import { HrEmpOneController } from '../controller/hrEmOne.controller';
import { HrBaseFamilyService } from '../service/hrBaseFamily.service';
import { HBaseFamilyController } from '../controller/hrBaseFamily.controller';
import { HrBasAcademicService } from '../service/hrBasAcademic.service';
import { HBasAcademicController } from '../controller/hrBaeAcademic.controller';
import { HrBasAddressService } from '../service/hrBasAddress.service';
import { HrBasPrzPnlService } from '../service/hrBasPrzPnl.service';
import { HrBaslinguisticService } from '../service/hrBaslinguistic.service';

import { HrBasAddressController } from '../controller/hrBasAddress.controller';
import { HrBaslinguisticController } from '../controller/hrBaslinguistic.controller';
import { HrBasPrzPnlController } from '../controller/hrBasPrzPnl.controller';
import { HrBasUnionService } from '../service/hrOrgUnion.service';
import { HrOrgPosService } from '../service/hrOrgPos.service';
import { HrBaseTravelService } from '../service/hrBasTravel.service';
import { HrBaseTravelController } from '../controller/hrBasTravel.controller';
import { HrBaseUnionController } from '../controller/hrBasOrgUnion.controller';
import { HrBasOrgJobService } from '../service/hrBasOrgJob.service';
import { HrBaseOrgJobController } from '../controller/hrBasOrgJob.controller';
import { HrBaseOrgPosController } from '../controller/hrBasOrgPos.controller';
import { HrBasCareerController } from '../controller/hrBasCareer.controller';
import { HrBasCareerService } from '../service/hrBasCareer.service';
import { HrBasPjtCareerController } from '../controller/hrBasPjtCareer.controller';
import { HrBasPjtCareerService } from '../service/hrBasPjtCareer.service';
import { HrBasMilitaryService } from '../service/hrBasMilitary.service';
import { HrBasMilitaryController } from '../controller/hrBasMilitary.controller';
import { HrBasLicenseCheckService } from '../service/hrBasLicenseCheck.service';
import { HrBasLicenseCheckController } from '../controller/hrBasLicenseCheck.controller';
import { EmpUserDefineService } from '../service/hrEmpUserDefine.service';
import { EmpUserDefineController } from '../controller/hrEmpUserDefine.controller';
import { HrFileService } from '../service/hrFile.service';
import { HrFileController } from '../controller/hrFile.controller';
import { HrEmpDateService } from '../service/hrEmpDate.service';
import { HrEmpDateController } from '../controller/hrEmpDate.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [
        HrEmpPlnController,
        HrEmpOneController,
        HBaseFamilyController,
        HBasAcademicController,
        HrBasAddressController,
        HrBaslinguisticController,
        HrBasPrzPnlController,
        HrBaseTravelController,
        HrBaseUnionController,
        HrBaseOrgJobController,
        HrBaseOrgPosController,
        HrBasPjtCareerController,
        HrBasCareerController,
        HrBasMilitaryController,
        HrBasLicenseCheckController,
        EmpUserDefineController,
        HrFileController,
        HrEmpDateController
    ],
    providers: [
        DatabaseService,
        GenerateXmlService,
        HrEmpPlnService,
        HrEmpOneService,
        HrBaseFamilyService,
        HrBasAcademicService,
        HrBasAddressService,
        HrBasPrzPnlService,
        HrBaslinguisticService,
        HrBaseTravelService,
        HrOrgPosService,
        HrBasUnionService,
        HrBasOrgJobService,
        HrBasCareerService,
        HrBasPjtCareerService,
        HrBasMilitaryService,
        HrBasLicenseCheckService,
        EmpUserDefineService,
        HrFileService,
        HrEmpDateService
    ],
})
export class HrInfo { }
