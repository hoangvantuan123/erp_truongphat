import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { sqlServerITMV } from 'src/config/database.config';
import { PayConditionService } from '../service/payCondition.service';
import { PayCondition } from '../entities/payCondition.entity';
import { PayConditionsController } from '../controller/payCondition.controller';
import { ProjectMgmtService } from '../service/projectMgmt.service';
import { ProjectMgmtsController } from '../controller/projectMgmt.controller';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([PayCondition]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [PayConditionsController, ProjectMgmtsController],
    providers: [PayConditionService, ProjectMgmtService, GenerateXmlService],
})
export class PMModule { }
