import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { WorkCenterQueryService } from '../services/workCenterQuery.service';
import { WorkCenterQueryController } from '../controllers/workCenterQuery.controller';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [WorkCenterQueryController],
    providers: [DatabaseService, WorkCenterQueryService, GenerateXmlService],
})
export class WorkCenterModule { }
