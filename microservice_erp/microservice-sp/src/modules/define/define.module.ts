
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sqlServerITMV } from 'src/config/database.config';
import { DefineService } from './define.service';
import { ErpDefineController } from './define.controller';

@Module({
    imports: [TypeOrmModule.forFeature([]), TypeOrmModule.forRoot(sqlServerITMV)],
    controllers: [ErpDefineController],
    providers: [DefineService],
})
export class DefineHelp { }
