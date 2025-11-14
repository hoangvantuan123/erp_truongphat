import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV, sqlServerITMVCommon } from 'src/config/database.config';
import {IqcService } from '../services/iqc.service';
import { IqcController } from '../controllers/iqc.controller'; 
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMV_COMMON/database.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
    TypeOrmModule.forRoot(sqlServerITMVCommon),
  ],
  controllers: [IqcController],
  providers: [
    DatabaseService,
    DatabaseServiceCommon,
    GenerateXmlService, 
    IqcService
  ],
})
export class IqcModule { }
