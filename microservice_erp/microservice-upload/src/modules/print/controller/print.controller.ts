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
    HttpException
} from '@nestjs/common';
import { PrintLgEtcOutService } from '../services/printLgEtcOut.service';
import { Response, Express, Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import * as jwt from 'jsonwebtoken';

@Controller('v4/print')
export class PrintController {
    constructor(private readonly printLgEtcOutService: PrintLgEtcOutService,) { }


    @Post('slg-in-out-req-print-query')
    async SLGInOutReqPrintQuery(
        @Body('result') result: any,
        @Req() req: Request
    ): Promise<SimpleQueryResult> {
        console.log('result', result)
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };
            return this.printLgEtcOutService._SLGInOutReqPrintQuery_WEB(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }
}