import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { FinQueryCmpService } from '../service/_FinQueryCmp.service';
import { FinQueryCmpController } from '../controller/_FinQueryCmp.controller';
@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [
        FinQueryCmpController
    ],
    providers: [
        DatabaseService,
        GenerateXmlService,
        FinQueryCmpService

    ],
})
export class ExecFinModule { }
