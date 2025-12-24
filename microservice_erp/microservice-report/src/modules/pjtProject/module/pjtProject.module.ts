import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { PjtProjectService } from '../service/pjtProject.service';
import { PjtProjectController } from '../controller/pjtproject.controller';
@Module({
  imports: [TypeOrmModule.forRoot(sqlServerITMV)],
  controllers: [PjtProjectController],
  providers: [DatabaseService, GenerateXmlService, PjtProjectService],
})
export class PjtProjectModule {}
