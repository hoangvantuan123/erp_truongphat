import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { AcctBalanceController } from '../controller/acctBalance.controller';
import { AcctBalanceService } from '../service/acctBalance.service';
@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [
        AcctBalanceController
    ],
    providers: [
        DatabaseService,
        GenerateXmlService,
        AcctBalanceService
    ],
})
export class AcctReportModule { }
