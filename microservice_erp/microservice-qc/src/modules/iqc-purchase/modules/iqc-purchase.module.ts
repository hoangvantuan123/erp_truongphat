import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV, sqlServerITMVCommon } from 'src/config/database.config';
import {IqcPurchaseService } from '../services/iqc-purchase.service';
import { IqcPurchaseController } from '../controllers/iqc-purchase.controller'; 
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMV_COMMON/database.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
    TypeOrmModule.forRoot(sqlServerITMVCommon),
  ],
  controllers: [IqcPurchaseController],
  providers: [
    DatabaseService,
    DatabaseServiceCommon,
    GenerateXmlService, 
    IqcPurchaseService
  ],
})
export class IqcPurchaseModule { }
