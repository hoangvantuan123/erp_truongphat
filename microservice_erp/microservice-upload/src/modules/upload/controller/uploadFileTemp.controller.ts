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
  Delete
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { multerOptions } from 'src/modules/options/multer.options';
import { jwtConstants } from 'src/config/security.config';
import { DatabaseService } from 'src/common/database/database.service';
import { UploadFileTempService } from '../services/uploadFileTemp.service';
import { ERPUploadsFileTemp } from '../entities/uploadFileTemp.entity';
import * as jwt from 'jsonwebtoken';

@Controller('v4')
export class UploadFileTempController {
  constructor(private readonly uploadFileTempService: UploadFileTempService,
    private readonly databaseService: DatabaseService
  ) { }




  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  @Post('file/file-tempe')
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

      const formCode = req.body.formCode;
      const fileNameCust = req.body.fileNameCust;
      const language = req.body.language;
      const defineSeq = req.body.defineSeq;
      const defineItemSeq = req.body.defineItemSeq;

      const records: Partial<ERPUploadsFileTemp>[] = files.files.map((file) => ({
        FormCode: formCode,
        FilenameCustom: fileNameCust,
        LanguageSeq: language,
        DefineSeq: defineSeq,
        DefineItemSeq: defineItemSeq,
        FieldName: file.fieldname,
        OriginalName: file.originalname,
        Encoding: file.encoding,
        MimeType: file.mimetype,
        Destination: file.destination,
        Filename: file.filename,
        Path: file.path.replace(/\\/g, '/'),
        Size: file.size,
        CreatedBy: decodedToken.UserSeq,
      }));

      const result = await this.uploadFileTempService.addMultiple(records, decodedToken.UserSeq);

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


  @Get('all-data-file-temp')
  async findAll(@Req() req: Request) {
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

      return this.uploadFileTempService.findAll();
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }
  @Get('all-help-query-temp')
  async helpQueryTemp(@Req() req: Request) {
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

      return this.uploadFileTempService.helpQueryTemp();
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @Delete('delete-data-file-temp')
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

      const result =
        await this.uploadFileTempService.delete(ids);
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
}