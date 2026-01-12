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
  Res,
  Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from '../services/upload.service';
import { SampleDto } from '../dto/sample.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { multerOptions } from 'src/modules/options/multer.options';
import { ERPUploadsFile } from '../entities/uploadFile.entity';
import { jwtConstants } from 'src/config/security.config';
import { DatabaseService } from 'src/common/database/database.service';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join, normalize } from 'path';
@Controller('v4')
export class UploadController {
  constructor(private readonly uploadService: UploadService,
    private readonly databaseService: DatabaseService
  ) { }




  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  uploadFile(
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/pass-validation')
  uploadFileAndPassValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file?.buffer.toString(),
    };
  }


  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 5 },
      ],
      multerOptions,
    ),
  )
  @Post('file/fail-validation')
  async uploadFileAndFailValidation(
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

      const records: Partial<ERPUploadsFile>[] = files.files.map((file) => ({
        FormCode: formCode,
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

      const result = await this.uploadService.addMultiple(records, decodedToken.UserSeq);

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


  @Get('all-data-bucket')
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

      return this.uploadService.findAll();
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }
  @Delete('delete-data-bucket')
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
        await this.uploadService.delete(ids);
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