import {
    Controller,
    Post,
    Body,
    Req,
    Res,
    HttpStatus,
    HttpException,
    Inject,
    Get,
    Delete,
    UnauthorizedException,
    Query
} from '@nestjs/common';
import { timeout } from 'rxjs/operators';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcFilePrintService } from 'src/grpc/service/upload/filePrint/filePrint.service';
@Controller('v8/file-print')
export class FilePrintController {
    constructor(
        private readonly grpcFilePrintService: GrpcFilePrintService
    ) { }





    @Post('FilePrintA')
    FilePrintA(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcFilePrintService.FilePrintA(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }
    @Post('FilePrintU')
    FilePrintU(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcFilePrintService.FilePrintU(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }
    @Post('FilePrintD')
    FilePrintD(@Body() body: { result: any[] }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcFilePrintService.FilePrintD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }

    @Post('FilePrintQ')
    FilePrintQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcFilePrintService.FilePrintQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }




}
