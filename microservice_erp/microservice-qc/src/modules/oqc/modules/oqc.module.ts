import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { OqcService } from '../services/oqc.service';
import { OqcController } from '../controllers/oqc.controller';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMV_COMMON/database.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
  ],
  controllers: [OqcController],
  providers: [
    DatabaseService,
    DatabaseServiceCommon,
    GenerateXmlService,
    OqcService
  ],
})
export class OqcModule {}
