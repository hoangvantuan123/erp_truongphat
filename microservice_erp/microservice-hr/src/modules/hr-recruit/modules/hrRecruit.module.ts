import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV, sqlServerITMVCOMMON } from 'src/config/database.config';
import { ERPEmpRecruit } from '../entities/hr.emp.recruit.entity';
import { ErpEmpRecruitService } from '../services/hrRecruitEmp.service';
import { HrEmpRecruitController } from '../controllers/hrRecruitEmp.controller';
import { ErpHrAcademyRecruitService } from '../services/hrAcademy.service';
import { HrAcademyRecruitController } from '../controllers/hrAcademyRecruit.controller';
import { ErpFamilyRecruitService } from '../services/hrFamily.service';
import { HrFamilyRecruitController } from '../controllers/hrFamilyRecruit.controller';
import { ErpLangsRecruitService } from '../services/hrRecruitLangs.service';
import { HrLangRecruitController } from '../controllers/hrLangRecruit.controller';
import { ErpHrCareerRecruitService } from '../services/hrCareer.service';
import { ErpHrCareerItemRecruitService } from '../services/hrCareerItem.service';
import { HrCareerItemRecruitController } from '../controllers/hrCareerItemRecruit.controller';
import { HrCareerRecruitController } from '../controllers/hrCareerRecruit.controller';
import { ErpOfficeSkillsRecruitService } from '../services/hrOfficeSkill.service';
import { HrOfficeSkillsController } from '../controllers/hrOfficeSkill.controller';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV), TypeOrmModule.forFeature([
            ERPEmpRecruit

        ])
    ],
    controllers: [
        HrEmpRecruitController,
        HrAcademyRecruitController,
        HrFamilyRecruitController,
        HrLangRecruitController,
        HrCareerItemRecruitController,
        HrCareerRecruitController,
        HrOfficeSkillsController

    ],
    providers: [
        ErpEmpRecruitService,
        ErpHrAcademyRecruitService,
        ErpFamilyRecruitService,
        ErpLangsRecruitService,
        ErpHrCareerRecruitService,
        ErpHrCareerItemRecruitService,
        ErpOfficeSkillsRecruitService,
        GenerateXmlService

    ],
})
export class HrRecruitModule { }
