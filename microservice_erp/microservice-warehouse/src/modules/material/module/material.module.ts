import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { StockInService } from '../service/stockIn.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { EmployeeController } from '../controller/stockIn.controller';
import { DeliveryListService } from '../service/deliveryList.service';
import { DeliveryListController } from '../controller/deliveryList.controller';
import { StockOutController } from '../controller/stockOut.controller';
import { StockOutService } from '../service/stockOut.service';
import { IQCStatusController } from '../controller/iqcStatus.controller';
import { IQCStatusService } from './../service/iqcStatus.service';
import { MatWHStockInController }  from '../controller/matWHStockIn.controller';
import { MatWHStockInService } from './../service/matWHStockIn.service';

@Module({
  imports: [],
  providers: [
    DatabaseService,
    StockInService,
    GenerateXmlService,
    DeliveryListService,
    StockOutService,
    IQCStatusService,
    MatWHStockInService
  ],
  controllers: [EmployeeController, DeliveryListController, StockOutController, IQCStatusController, MatWHStockInController],
  exports: [],
})
export class MaterialModule { }
