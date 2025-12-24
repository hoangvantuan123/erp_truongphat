import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DaMaterialListService } from '../service/daMaterialList.service';
import { DaMaterialListController } from '../controller/daMaterialList.controller';
@Module({
  imports: [],
  providers: [
    DatabaseService,
    GenerateXmlService,
    DaMaterialListService,
  ],
  controllers: [
    DaMaterialListController,
  
  ],
  exports: [],
})
export class DaMaterialListModule { }
