import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SearchStatiticController } from '../controllers/search-statitic.controller';
import { SearchStatisticService } from '../services/search-statistic.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(sqlServerITMV),
  ],
  controllers: [
    SearchStatiticController 

  ],
  providers: [
    DatabaseService,
    GenerateXmlService,
    SearchStatisticService,

  ],
})
export class SearchStatisticModule {}
