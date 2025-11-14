import { Module } from '@nestjs/common';
/*  */
import { GRPCServiceModule } from 'src/grpc/grpc.module';
/* ASSET */
import { SPDToolMoveController } from './asset/regi_te/SPDToolMove.controller';
import { SPDToolRepairController } from './asset/regi_te/SPDToolRepair.controller';
import { GroupsTempController } from './upload/groupTemp.controller';
import { TempFileController } from './upload/tempFIle.controller';
import { JIGQRTaggingPrintController } from './upload/JIGQRTaggingPrint.controller';
import { SDAItemListController } from './warehouse/basic/daMaterialList.controller';
import { SDACustController } from './warehouse/customers/SDACust.controller';
import { SLGWHInitStockQController } from './warehouse/invOpen/SLGWHInitStock.controller';
import { ItemPrintController } from './upload/itemPrint/itemPrint.controller';
import { ItemPrintQRTaggingController } from './upload/itemPrint/ItemQRTaggingPrint.controller';
import { FilePrintController } from './upload/filePrint/filePrint.controller';
import { StockRealOpenQController } from './warehouse/warehouse/StockRealOpen.controller';

const AllProviders = [

    /* ASSET */
    SPDToolMoveController,
    SPDToolRepairController,
    TempFileController,
    GroupsTempController,
    JIGQRTaggingPrintController,
    SDAItemListController,
    SDACustController,
    SLGWHInitStockQController,
    ItemPrintController,
    ItemPrintQRTaggingController,
    FilePrintController,
    StockRealOpenQController
];

@Module({
    imports: [GRPCServiceModule],
    providers: [],
    controllers: AllProviders,
    exports: [],
})
export class ControllersModule { }
