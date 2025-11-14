import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { PdmmOutExtraService } from '../services/pdmmOutExtra.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { PdmmOutQueryListService } from '../services/pdmmOutQueryList.service';
import { PdmmOutExtraController } from '../controller/pdmmOutExtra.controller';
import { PdmmOutQueryListController } from '../controller/pdmmOutQueryList.controller';
import { PdmmOutItemListService } from '../services/pdmmOutItemList.service';
import { PdmmOutItemListController } from '../controller/pdmmOutItemList.controller';
import { ScanPdmmOutProcService } from '../services/scanPdmmOutProc.service';
import { ScanPdmmOutProcController } from '../controller/scanPdmmOutProc.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [PdmmOutQueryListController, PdmmOutExtraController, PdmmOutItemListController, ScanPdmmOutProcController],
    providers: [DatabaseService, GenerateXmlService, PdmmOutExtraService, PdmmOutQueryListService, PdmmOutItemListService, ScanPdmmOutProcService],
})
export class PdmmModule { }
