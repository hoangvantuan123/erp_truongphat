
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sqlServerITMV } from 'src/config/database.config';
import { EmpSPService } from '../service/emp.service';
import { ErpEmpSPController } from '../controller/emp.controller';

@Module({
    imports: [TypeOrmModule.forFeature([]), TypeOrmModule.forRoot(sqlServerITMV)],
    controllers: [ErpEmpSPController],
    providers: [EmpSPService],
})
export class EmpHelpModule { }
