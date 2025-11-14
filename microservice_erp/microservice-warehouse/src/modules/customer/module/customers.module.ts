import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { CustomersService } from '../service/customers.service';
import { CustomersController } from '../controller/customers.controller';
import { SDACustService } from '../service/sdaCust.service';
import { SDACustController } from '../controller/sdaCust.controller';
@Module({
  imports: [],
  providers: [
    DatabaseService,
    GenerateXmlService,
    CustomersService,
    SDACustService
  ],
  controllers: [
    CustomersController,
    SDACustController

  ],
  exports: [],
})
export class CustomerModule { }
