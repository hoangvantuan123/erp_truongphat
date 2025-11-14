import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefineService } from '../services/define.service';
import { DefineItemService } from '../services/defineItem.service';
import { ERPDefine } from '../entities/define.entity';
import { ERPDefineItem } from '../entities/defineItem.entity';
import { DefinesController } from '../controllers/define.controller';
import { DefinesItemController } from '../controllers/defineItem.controller';
import { sqlServerITMV } from 'src/config/database.config';
@Module({
  imports: [
    TypeOrmModule.forFeature([ERPDefineItem, ERPDefine]),
    TypeOrmModule.forRoot(sqlServerITMV)
  ],
  controllers: [DefinesController, DefinesItemController],
  providers: [DefineItemService, DefineService],
})
export class DefineModule { }
