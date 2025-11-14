import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { PdEquiptController } from '../controllers/pd-equipt.controller';
import { PdEquiptService } from '../services/pd-equipt.service';
import { PdEquiptInspectController } from '../controllers/pd-equipt-inspect.controller';
import { PdEquiptInspectService } from '../services/pd-equipt-inspect.service';
import { GenerateXmlEqpInspect } from '../generate-xml/generate-xml-eqp-inspect.service';
import { PdEquiptInspectDetailController } from '../controllers/pd-equipt-inspect-detail.controller';
import { PdEquiptInspectDetailService } from '../services/pd-equipt-inspect-detail.service';
import { GenerateXmlEqpInspectDetail } from '../generate-xml/generate-xml-eqp-inspect-detail.service';
import { PdMultiEquiptController } from '../controllers/pd-multi-equipt.controller';
import { PdMultiEquiptService } from '../services/pd-multi-equipt.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
  ],
  controllers: [PdEquiptController, PdEquiptInspectController, PdEquiptInspectDetailController, PdMultiEquiptController],
  providers: [
    DatabaseService,
    GenerateXmlService,
    PdEquiptService,
    GenerateXmlEqpInspect,
    PdEquiptInspectService,
    GenerateXmlEqpInspectDetail,
    PdEquiptInspectDetailService,
    PdMultiEquiptService,


  ],
})
export class AssetModule {}
