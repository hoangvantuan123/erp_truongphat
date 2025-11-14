import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { ProductService } from '../services/product.service';
import { ERPAddItems } from '../entities/addItems.entity';
import { ProductsController } from '../controllers/product.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([ERPAddItems]),
    TypeOrmModule.forRoot(sqlServerITMV)
  ],
  controllers: [ProductsController],
  providers: [DatabaseService, ProductService],
})
export class ProductModule { }
