import { Module, forwardRef } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { GenerateXmlPurchaseService } from '../generate-xml/generate-xml-purchase.service';
import { GenerateXmlImportService } from '../generate-xml/generate-xml-import.service';
import { ImpPermitListController } from '../controller/impPermitList.controller';
import { ImpPermitListService } from '../service/impPermitList.service';
import { ImpPermitItemController } from '../controller/impPermitItemList.controller';
import { ImpPermitItemListService } from '../service/impPermitItemList.service';
import { ImpDeliveryController } from '../controller/impDelivery.controller';
import { ImpDeliveryService } from '../service/impDelivery.service';
import { ImpDeliveryListService } from '../service/impDeliveryList.service';
import { ImpDeliveryListController } from '../controller/impDeliveryList.controller';
import { ImpDeliveryItemListController } from '../controller/impDeliveryItemList.controller';
import { ImpDeliveryItemListService } from '../service/impDeliveryItemList.service';
import { PurOrdApprovalReqController } from '../controller/purOrdApprovalReq.controller';
import { PurOrdApprovalReqService } from '../service/purOrdApprovalReq.service';
import { PurOrdApprovalReqListController } from '../controller/purOrdApprovalReqList.controller';
import { PurOrdApprovalReqListService } from '../service/purOrdApprovalReqList.service';
import { PurOrdApprovalReqItemListController } from '../controller/purOrdApprovalReqItemList.controller';
import { PurOrdApprovalReqItemListService } from '../service/purOrdApprovalReqItemList.service';
import { PurOrdPOController } from '../controller/purOrdPO.controller';
import { PurOrdPOService } from '../service/purOrdPO.service';
import { PurOrdPOListController } from '../controller/purOrdPOList.controller';
import { PurOrdPOListService } from '../service/purOrdPOList.service';
import { PurOrdPOItemListController } from '../controller/purOrdPOItemList.controller';
import { PurOrdPOItemListService } from '../service/purOrdPOItemList.service';
import { PurDelvController } from '../controller/purDelv.controller';
import { PurDelvService } from '../service/purDelv.service';
import { PurDelvItemListService } from '../service/purDelvItemList.service';
import { PurDelvItemListController } from '../controller/purDelvItemList.controller';
import { PurDelvListService } from '../service/purDelvList.service';
import { PurDelvListController } from '../controller/purDelvList.controller';
import { PurDelvInController } from '../controller/purDelvIn.controller';
import { PurDelvInService } from '../service/purDelvIn.service';
import { PurDelvInListService } from '../service/purDelvInList.service';
import { PurDelvInListController } from '../controller/purDelvInList.controller';
import { PurDelvInItemListController } from '../controller/purDelvInItemList.controller';
import { PurDelvInItemListService } from '../service/purDelvInItemList.service';
import { ImpOrderController } from '../controller/impOrder.controller';
import { ImpOrderService } from '../service/impOrder.service';
import { ImpOrderListService } from '../service/impOrderList.service';
import { ImpOrderItemListService } from '../service/impOrderItemList.service';
import { ImpOrderItemListController } from '../controller/impOrderItemList.controller';
import { ImpOrderListController } from '../controller/impOrderList.controller';
@Module({
  imports: [],
  providers: [
    DatabaseService,
    GenerateXmlService,
    GenerateXmlPurchaseService,
    GenerateXmlImportService,
    ImpPermitListService,
    ImpPermitItemListService,
    ImpDeliveryService,
    ImpDeliveryListService,
    ImpDeliveryItemListService,
    PurOrdApprovalReqService,
    PurOrdApprovalReqListService,
    PurOrdApprovalReqItemListService,
    PurOrdPOService,
    PurOrdPOListService,
    PurOrdPOItemListService,
    PurDelvService,
    PurDelvItemListService,
    PurDelvListService,
    PurDelvInService,
    PurDelvInListService,
    PurDelvInItemListService,
    ImpOrderService,
    ImpOrderListService,
    ImpOrderItemListService,
  ],
  controllers: [
    ImpPermitListController,
    ImpPermitItemController,
    ImpDeliveryController,
    ImpDeliveryListController,
    ImpDeliveryItemListController,
    PurOrdApprovalReqController,
    PurOrdApprovalReqListController,
    PurOrdApprovalReqItemListController,
    PurOrdPOController,
    PurOrdPOListController,
    PurOrdPOItemListController,
    PurDelvController,
    PurDelvItemListController,
    PurDelvListController,
    PurDelvInController,
    PurDelvInListController,
    PurDelvInItemListController,
    ImpOrderController,
    ImpOrderListController,
    ImpOrderItemListController,
  ],
  exports: [],
})
export class PurchaseModule {}
