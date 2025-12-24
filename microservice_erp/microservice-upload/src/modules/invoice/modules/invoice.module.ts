import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';
import { InvoiceController } from '../controllers/invoice.controller';
import { InvoiceService } from '../services/invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { InvoiceDService } from '../services/invoiceD.service';
import { ERPFileInvocie } from '../entities/invoice.entity';

@Module({
    imports: [
        MulterModule.register({
            dest: '/var/www/uploads',
        }),
        TypeOrmModule.forFeature([ERPFileInvocie]),
        TypeOrmModule.forRoot(sqlServerITMV)
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService, DatabaseService, InvoiceDService],
})
export class InvoiceModule { }
