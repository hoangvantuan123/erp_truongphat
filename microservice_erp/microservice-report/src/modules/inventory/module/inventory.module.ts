import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SupplementIssueService } from '../service/supplementIssue.service';
import { SupplementIssueController } from '../controller/supplementIssue.controller';
@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [
        SupplementIssueController
    ],
    providers: [
        DatabaseService,
        GenerateXmlService,
        SupplementIssueService

    ],
})
export class InventoryReportModule { }
