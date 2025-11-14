import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV, sqlServerITMVCommon } from 'src/config/database.config';
import {IqcOutsourceService } from '../services/iqc-outsource.service';
import { IqcOutsourceController } from '../controllers/iqc-outsource.controller'; 
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMV_COMMON/database.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
    TypeOrmModule.forRoot(sqlServerITMVCommon),
  ],
  controllers: [IqcOutsourceController],
  providers: [
    DatabaseService,
    DatabaseServiceCommon,
    GenerateXmlService, 
    IqcOutsourceService
  ],
})
export class IqcOutsourceModule { }
