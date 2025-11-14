import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SPDToolMoveService } from '../service/SPDToolMove.service';
import { RptSalesCatController } from '../controller/SPDToolMove.controller';
import { SPDToolRepairService } from '../service/SPDToolRepair.service';
import { PDToolRepairController } from '../controller/SPDToolRepair.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [
        RptSalesCatController,
        PDToolRepairController
    ]
    ,
    providers: [
        DatabaseService,
        GenerateXmlService,
        SPDToolMoveService,
        SPDToolRepairService
    ],
})
export class RegiTEModule { }
