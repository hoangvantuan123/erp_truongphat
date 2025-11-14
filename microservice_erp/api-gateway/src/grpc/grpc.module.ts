import { Module } from '@nestjs/common';

/* ASSET */
import { GrpcSPDToolMoveService } from './service/asset/regi_te/SPDToolMove.service';
import { GrpcSPDToolRepairService } from './service/asset/regi_te/PDToolRepair.service';
import { gRPCGroupsTempService } from './service/upload/groupTemp.service';
import { gRPCTempFileService } from './service/upload/tempFile.service';
import { gRPCJIGQRTaggingService } from './service/upload/JIGQRTagging.service';
import { GrpcSDAItemListService } from './service/wh/basic/SDAItemList.service';
import { GrpcSDACustService } from './service/wh/cust/SDACust.service';
import { GrpcSLGWHInitStockService } from './service/wh/invOpen/SLGWHInitStock.service';
import { GrpcItemPrintService } from './service/upload/itemPrint/itemPrint.service';
import { gRPCItemPrintQRTaggingService } from './service/upload/itemPrint/ItemQRTagging.service';
import { GrpcFilePrintService } from './service/upload/filePrint/filePrint.service';
import { GrpcStockRealOpenService } from './service/wh/warehouse/StockRealOpen.service';
const AllProviders = [
    /* ASSET */
    GrpcSPDToolMoveService,
    GrpcSPDToolRepairService,
    gRPCTempFileService,
    gRPCGroupsTempService,
    gRPCJIGQRTaggingService,
    GrpcSDAItemListService,
    GrpcSDACustService,
    GrpcSLGWHInitStockService,
    GrpcItemPrintService,
    gRPCItemPrintQRTaggingService,
    GrpcFilePrintService,
    GrpcStockRealOpenService
];

@Module({
    imports: [],
    providers: AllProviders,
    controllers: [],
    exports: AllProviders,
})
export class GRPCServiceModule { }
