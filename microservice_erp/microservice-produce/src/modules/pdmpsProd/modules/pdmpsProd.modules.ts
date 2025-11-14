import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { PdmpsProdQueryService } from '../services/pdmpsProdQuery.service';
import { PdmpsProdQueryController } from '../controllers/pdmpsProdQuery.controller';
import { PdmpsProdUItemListQueryService } from '../services/pdmpsProdItemListQuery.service';
import { PdmpsProdItemListQueryController } from '../controllers/pdmpsProdItemListQuery.controller';
import { PdmpsProdPlanListQueryService } from '../services/pdmpsProdPlanListQuery.service';
import { PdmpsProdPlanListQueryController } from '../controllers/pdmpsProdPlanListQuery.controller';
import { PdmsProdPlanService } from '../services/pdmsProdPlan.service';
import { PdmpsProdPlanController } from '../controllers/pdmsProdPlan.controller';
@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [PdmpsProdQueryController, PdmpsProdItemListQueryController, PdmpsProdPlanListQueryController, PdmpsProdPlanController],
    providers: [DatabaseService, GenerateXmlService, PdmpsProdQueryService, PdmpsProdUItemListQueryService, PdmpsProdPlanListQueryService, PdmsProdPlanService],
})
export class PdmpsProd { }
