import {
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  UnauthorizedException,
  Req,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { multerOptions } from 'src/modules/options/multer.options';
import { jwtConstants } from 'src/config/security.config';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { UploadFileItemsService } from '../services/uploadFileItems.service';
import { ERPUploadsFileItems } from '../entities/uploadFileItems.entity';
import * as jwt from 'jsonwebtoken';

@Controller('v4')
export class UploadFileItemsController {
  constructor(
    private readonly uploadFileItemsService: UploadFileItemsService,
    private readonly databaseService: DatabaseService,
  ) {}

  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 50 }], multerOptions),
  )
  @Post('file/file-items-seq')
  async uploadFileTemp(
    @Req() req: Request,
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ): Promise<any> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      const itemNoSeq = req.body.itemNoSeq;
      const formCode = req.body.formCode;
      const tableName = req.body.tableName;

      const records: Partial<ERPUploadsFileItems>[] = files.files.map(
        (file) => ({
          FormCode: formCode,
          FieldName: file.fieldname,
          OriginalName: file.originalname,
          Encoding: file.encoding,
          MimeType: file.mimetype,
          Destination: file.destination,
          Filename: file.filename,
          ItemNoSeq: itemNoSeq,
          Path: file.path.replace(/\\/g, '/'),
          Size: file.size,
          CreatedBy: decodedToken.UserSeq,
          TableName: tableName,
        }),
      );

      const result = await this.uploadFileItemsService.addMultiple(
        records,
        decodedToken.UserSeq,
      );

      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], multerOptions),
  )
  @Post('file-ord-approval-req-save')
  async UploadFileOrdApprovalReqSave(
    @Req() req: Request,
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ): Promise<any> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      const itemNoSeq = req.body.itemNoSeq;
      const formCode = req.body.formCode;
      const tableName = req.body.tableName;

      const records: Partial<ERPUploadsFileItems>[] = files.files.map(
        (file) => ({
          FormCode: formCode,
          FieldName: file.fieldname,
          OriginalName: file.originalname,
          Encoding: file.encoding,
          MimeType: file.mimetype,
          Destination: file.destination,
          Filename: file.filename,
          ItemNoSeq: itemNoSeq,
          Path: file.path.replace(/\\/g, '/'),
          Size: file.size,
          CreatedBy: decodedToken.UserSeq,
          TableName: tableName,
        }),
      );

      const result =
        await this.uploadFileItemsService.UploadFileOrdApprovalReqSave(
          records,
          decodedToken.UserSeq,
        );

      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @Get('all-data-file-item-seq')
  async findAll(
    @Req() req: Request,
    @Query('ItemNoSeq') ItemNoSeq?: number,
    @Query('TableName') TableName?: string,
    @Query('FormCode') FormCode?: string,
  ) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.uploadFileItemsService.findAll(
        ItemNoSeq,
        FormCode,
        TableName,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @Delete('delete-data-file-item-seq')
  async delete(@Body('ids') ids: number[], @Req() req: Request): Promise<any> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };
      const user = await this.databaseService.checkAuthUserSeq(
        decodedToken.UserSeq,
      );
      if (!user) {
        throw new UnauthorizedException(
          'You do not have permission to access this API.',
        );
      }

      const result = await this.uploadFileItemsService.delete(ids);
      if (result.success) {
        return {
          success: true,
          message: result.message,
        };
      } else {
        return {
          success: false,
          message: result.message,
        };
      }
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @Post(':IdSeq/favorite')
  async updateFavoriteSeq(
    @Param('IdSeq') IdSeq: number,
    @Body('Favorite') Favorite: boolean,
    @Req() req: Request,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }

    try {
      // Giải mã token
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      const result = await this.uploadFileItemsService.updateFavoriteSeq(
        IdSeq,
        Favorite,
        decodedToken.UserSeq,
      );

      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
