import { StockListController } from './../controller/stockList.controller';
import { Module, forwardRef } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { GenerateXmlLotMasterService } from '../generate-xml/generate-xml-lot-master.service';
import { GenerateXmlEtcInService } from '../generate-xml/generate-xml-etc-in.service';
import { GenerateXmlEtcOutService } from '../generate-xml/generate-xml-etc-out.service';
import { GenerateXmlEtcTransService } from '../generate-xml/generate-xml-etc-trans.service';
import { GenerateXmlStockRealService } from '../generate-xml/generate-xml-stock-real.service';
import { GenerateXmlStockClosingService } from '../generate-xml/generate-xml-stock-closing.service';
import { WarehouseController } from '../controller/warehouse.controller';
import { WarehouseService } from '../service/warehouse.service';
import { StockDetailListService } from '../service/stockDetailList.service';
import { StockListService } from '../service/stockList.service';
import { StockDetailListController } from '../controller/stockDetailList.controller';
import { StockAgingListService } from '../service/stockAgingList.service';
import { StockAgingListController } from '../controller/stockAgingList.controller';
import { AgingLotStockListController } from '../controller/agingLotStockList.controller';
import { AgingLotStockListService } from '../service/agingLotStockList.service';
import { LGWHItemService } from '../service/lgWHItem.service';
import { LGWHItemController } from '../controller/lgWHItem.controller';
import { LotMasterService } from '../service/lotmaster.service';
import { LotMasterController } from '../controller/lotmaster.controller';
import { EtcInReqService } from '../service/etcInReq.service';
import { EtcInReqController } from '../controller/etcInReq.controller';
import { EtcOutReqService } from '../service/etcOutReq.service';
import { EtcOutReqController } from '../controller/etcOutReq.controller';
import { EtcTransReqService } from '../service/etcTransReq.service';
import { EtcTransReqController } from '../controller/etcTransReq.controller';
import { LGWHStockRealService } from '../service/lgWHStockReal.service';
import { LGWHStockRealController } from '../controller/lgWHStockReal.controller';
import { LGWHStockClosingService } from '../service/lgWHStockClosing.service';
import { LGWHStockClosingController } from './../controller/lgWHStockClosing.controller';
import { BizStockListController } from '../controller/bizStockList.controller';
import { BizStockListService } from '../service/bizStockList.service';
@Module({
  imports: [],
  providers: [
    DatabaseService,
    GenerateXmlService,
    GenerateXmlLotMasterService,
    GenerateXmlEtcInService,
    GenerateXmlEtcOutService,
    GenerateXmlEtcTransService,
    GenerateXmlStockRealService,
    GenerateXmlStockClosingService,
    WarehouseService,
    StockListService,
    StockDetailListService,
    StockAgingListService,
    AgingLotStockListService,
    LGWHItemService,
    LotMasterService,
    EtcInReqService,
    EtcOutReqService,
    EtcTransReqService,
    LGWHStockRealService,
    LGWHStockClosingService,
    BizStockListService,
  ],
  controllers: [
    WarehouseController,
    StockListController,
    StockDetailListController,
    StockAgingListController,
    AgingLotStockListController,
    LGWHItemController,
    LotMasterController,
    EtcInReqController,
    EtcOutReqController,
    EtcTransReqController,
    LGWHStockRealController,
    LGWHStockClosingController,
    BizStockListController,
  ],
  exports: [WarehouseService],
})
export class WarehouseModule {}
