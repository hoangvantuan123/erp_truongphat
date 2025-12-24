import { Module } from '@nestjs/common';
import { UploadService } from '../services/upload.service';
import { UploadController } from '../controllers/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ERPUploadsFile } from '../entities/uploadFile.entity';
import { UploadFileTempController } from '../controllers/uploadFileTemp.controller';
import { UploadFileTempService } from '../services/uploadFileTemp.service';
import { ERPUploadsFileTemp } from '../entities/uploadFileTemp.entity';
import { ERPUploadsFileItems } from '../entities/uploadFileItems.entity';
import { UploadFileItemsService } from '../services/uploadFileItems.service';
import { UploadFileItemsController } from '../controllers/uploadFileItems.controller';
import { UploadUserController } from '../controllers/uploadUser.controller';
import { UploadUserService } from '../services/uploadUser.service';
import { ERPUploadsUserFile } from '../entities/uploadUserFile.entity';
import { ERPTempFileService } from '../services/tempFile.service';
import { ErpTempFileController } from '../controllers/tempFile.controller';
import { ERPTempFile } from '../entities/tempFile.entity';
import 'dotenv/config';
@Module({
  imports: [
    MulterModule.register({
      dest: process.env.UPLOAD_PATHS,
    }),
    TypeOrmModule.forFeature([ERPUploadsFile, ERPUploadsUserFile, ERPUploadsFileTemp, ERPUploadsFileItems, ERPTempFile]),
    TypeOrmModule.forRoot(sqlServerITMV)
  ],
  controllers: [UploadController, UploadFileTempController, UploadFileItemsController, UploadUserController, ErpTempFileController],
  providers: [UploadService, DatabaseService, UploadFileTempService, UploadFileItemsService, UploadUserService, ERPTempFileService],
})
export class UploadModule { }
