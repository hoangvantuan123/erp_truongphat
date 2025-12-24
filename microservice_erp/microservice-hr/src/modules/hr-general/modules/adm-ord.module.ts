import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV, sqlServerITMVCOMMON} from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { AdmOrdController } from '../controllers/adm-ord.controller';
import { HrAdmGeneralService } from '../services/adm-ord.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMVCOMMON/database.service';
import { GenerateXmlLaborContractService } from '../generate-xml/generate-xml-labor-contract.service';
import { LaborContractController } from '../controllers/labor-contract.controller';
import { HrCertificateService } from '../services/labor-contract.service';
import { HrLaborContractPrintController } from '../controllers/labor-contract-print.controller';
import { HrLaborContractPrintService } from '../services/labor-contract-print.service';
import { GenerateXmlLaborContractPrintService } from '../generate-xml/generate-xml-labor-contract-print.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
    TypeOrmModule.forRoot(sqlServerITMVCOMMON),
  ],
  controllers: [
    AdmOrdController,
    LaborContractController,
    HrLaborContractPrintController,

  ],
  providers: [
    DatabaseService,
    DatabaseServiceCommon,
    GenerateXmlService,
    GenerateXmlLaborContractService,
    GenerateXmlLaborContractPrintService,
    HrAdmGeneralService,
    HrCertificateService,
    HrLaborContractPrintService,

  ],
})
export class AdmOrdModule {}
