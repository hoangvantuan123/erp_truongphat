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
import { GrpcItemPrintService } from 'src/grpc/service/upload/itemPrint/itemPrint.service';
@Controller('v8/item-print')
export class ItemPrintController {
    constructor(
        private readonly grpcItemPrintService: GrpcItemPrintService
    ) { }





    @Post('ItemPrintA')
    ItemPrintA(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcItemPrintService.ItemPrintA(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }
    @Post('ItemPrintU')
    ItemPrintU(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcItemPrintService.ItemPrintU(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }
    @Post('ItemPrintD')
    ItemPrintD(@Body() body: { result: any[] }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcItemPrintService.ItemPrintD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }

    @Post('ItemPrintQ')
    ItemPrintQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcItemPrintService.ItemPrintQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }
    @Post('ItemPrintCheckQRQ')
    ItemPrintCheckQRQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcItemPrintService.ItemPrintCheckQRQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }

    @Post('ItemPrintCheckQRU')
    ItemPrintCheckQRU(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcItemPrintService.ItemPrintCheckQRU(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }




}
