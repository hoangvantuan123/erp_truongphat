import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { DefineService } from '../services/define.service';
import { DefineItemService } from '../services/defineItem.service';
import { ERPDefine } from '../entities/define.entity';
import { ERPDefineItem } from '../entities/defineItem.entity';
import { DefinesController } from '../controllers/define.controller';
import { DefinesItemController } from '../controllers/defineItem.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([ERPDefineItem, ERPDefine]),
    TypeOrmModule.forRoot(sqlServerITMV)
  ],
  controllers: [DefinesController, DefinesItemController],
  providers: [DatabaseService, DefineItemService, DefineService],
})
export class DefineModule { }
