import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpGroupsTempService } from '../services/groupTemp.service';
import { ERPGroupsTemp } from '../entities/groupTemp.entity';
import { sqlServerERP } from 'src/config/database.config';
import { ERPTempFile } from '../entities/tempFile.entity';
import { ERPTempFileService } from '../services/tempFile.service';
import { ErpGroupsTempController } from '../controller/groupTemp.controller';
import { ErpTempFileController } from '../controller/tempFile.controller';



import { ERPUploadsFile } from '../entities/uploadFile.entity';
import { UploadFileTempController } from '../controller/uploadFileTemp.controller';
import { UploadFileTempService } from '../services/uploadFileTemp.service';
import { ERPUploadsFileTemp } from '../entities/uploadFileTemp.entity';
import { ERPUploadsFileItems } from '../entities/uploadFileItems.entity';
import { UploadFileItemsService } from '../services/uploadFileItems.service';
import { UploadFileItemsController } from '../controller/uploadFileItems.controller';
import { UploadUserController } from '../controller/uploadUser.controller';
import { UploadUserService } from '../services/uploadUser.service';
import { ERPUploadsUserFile } from '../entities/uploadUserFile.entity';
import { UploadController } from '../controller/upload.controller';
import { UploadService } from '../services/upload.service';
import { DatabaseService } from 'src/common/database/database.service';
@Module({
  imports: [
    MulterModule.register({
      dest: '/var/www/uploads',
    }),
    TypeOrmModule.forFeature([ERPGroupsTemp, ERPTempFile, ERPUploadsFile, ERPUploadsUserFile, ERPUploadsFileTemp, ERPUploadsFileItems]),
    TypeOrmModule.forRoot(sqlServerERP)
  ],
  controllers: [ErpGroupsTempController, ErpTempFileController, UploadController, UploadFileTempController, UploadFileItemsController, UploadUserController],
  providers: [ErpGroupsTempService, ERPTempFileService, UploadService, DatabaseService, UploadFileTempService, UploadFileItemsService, UploadUserService],
})
export class UploadModule { }
