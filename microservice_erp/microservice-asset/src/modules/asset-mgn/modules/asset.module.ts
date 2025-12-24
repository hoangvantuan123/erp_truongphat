import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV, sqlServerITMVCOMMON } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMVCOMMON/database.service';
import { PdEquiptController } from '../controllers/pd-equipt.controller';
import { PdEquiptService } from '../services/pd-equipt.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
    TypeOrmModule.forRoot(sqlServerITMVCOMMON),
  ],
  controllers: [PdEquiptController],
  providers: [
    DatabaseService,
    DatabaseServiceCommon,
    GenerateXmlService,
    PdEquiptService,

  ],
})
export class AssetModule {}
