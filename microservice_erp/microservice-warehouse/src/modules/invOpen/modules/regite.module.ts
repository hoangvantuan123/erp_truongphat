import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

import { SLGWHInitStockController } from '../controller/SLGWHInitStock.controller';
import { SLGWHInitStockService } from '../service/SLGWHInitStock.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [

        SLGWHInitStockController
    ]
    ,
    providers: [
        DatabaseService,
        GenerateXmlService,

        SLGWHInitStockService
    ],
})
export class SLGWHInitStockModule { }
