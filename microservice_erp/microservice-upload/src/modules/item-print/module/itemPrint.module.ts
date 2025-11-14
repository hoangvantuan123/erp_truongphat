import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sqlServerERP } from 'src/config/database.config';
import { ItemPrint } from '../entities/itemPrint.entity';
import { ItemPrintService } from '../service/itemPrint.service';
import { ItemPrintController } from '../controller/itemPrint.controller';
import { ItemPrintHistoryService } from '../service/itemPrintHistory.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        ItemPrint
    ]), TypeOrmModule.forRoot(sqlServerERP),],
    providers: [
        ItemPrintService,
        ItemPrintHistoryService

    ],
    controllers: [
        ItemPrintController
    ],
    exports: [TypeOrmModule],
})
export class ItemPrintModule { }



