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
  HttpStatus,
  Query,
  Delete
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { Response, Express, Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { InvoiceDService } from '../services/invoiceD.service';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoiceDService: InvoiceDService,
    private readonly databaseService: DatabaseService) { }

  @Post('generate-invoice')
  async generateInvoice(@Req() req: Request, @Body() data: any, @Res() res: Response): Promise<any> {
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
      const fileId = await this.invoiceService.generateDocx(data, decodedToken.UserSeq);
      res.status(HttpStatus.OK).json({ fileId });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }



  @Get('invoice-form-code')
  async findFormCode(@Req() req: Request, @Query('formCode') formCode?: string) {
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

      return this.invoiceService.findFormCode(formCode);
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }


  @Delete('delete-invoice-form-code')
  async delete(@Body('FormCode') FormCode: string, @Req() req: Request): Promise<any> {
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
        await this.invoiceDService.delete(FormCode);
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