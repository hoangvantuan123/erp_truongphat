import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV, sqlServerITMVCOMMON } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DaDeptController } from '../controllers/da-dept.controller';
import { DaDeptService } from '../services/da-dept.service';
import { GenerateXmlOrgService } from '../generate-xml/generate-org-xml.service';
import { OrgDeptController } from '../controllers/org-dept.controller';
import { OrgDeptService } from '../services/org-dept.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMVCOMMON/database.service';
import { EmpOrgDeptController } from '../controllers/emp-org-dept.controller';
import { EmpOrgDeptService } from '../services/emp-org-dept.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
    TypeOrmModule.forRoot(sqlServerITMVCOMMON),
  ],
  controllers: [
    DaDeptController,
    OrgDeptController,
    EmpOrgDeptController, 

  ],
  providers: [
    DatabaseService,
    DatabaseServiceCommon,
    GenerateXmlService,
    GenerateXmlOrgService,
    DaDeptService,
    OrgDeptService,
    EmpOrgDeptService,

  ],
})
export class OrgHrModule {}
