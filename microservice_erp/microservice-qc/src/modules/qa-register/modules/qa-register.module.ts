import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { QaRegisterService } from '../services/qa-register.service';
import { QaRegisterController } from '../controllers/qa-register.controller';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { QaQcTitleService } from '../services/qaqc-title.service';
import { QaQcTitleController } from '../controllers/qaqc-title.controller';
import { QaItemClassQcController } from '../controllers/qa-item-class-qc.controller';
import { QaItemClassQcService } from '../services/qa-item-class-qc.service';
import { QaCustQcTitleService } from '../services/qa-cust-qc-title.service';
import { QaCustQcTitleController } from '../controllers/qa-cust-qc-title.controller';
@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
  ],
  controllers: [
    QaRegisterController, 
    QaQcTitleController, 
    QaItemClassQcController,
    QaCustQcTitleController,
  ],
  providers: [
    DatabaseService,
    GenerateXmlService,
    QaRegisterService,
    QaQcTitleService,
    QaItemClassQcService,
    QaCustQcTitleService
  ],
})
export class QaRegisterModule {}
