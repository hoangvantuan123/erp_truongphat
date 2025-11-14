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
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import { timeout } from 'rxjs/operators';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { gRPCTempFileService } from 'src/grpc/service/upload/tempFile.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { memoryStorage } from 'multer';
import { gRPCItemPrintQRTaggingService } from 'src/grpc/service/upload/itemPrint/ItemQRTagging.service';
@Controller('v8/print')
export class ItemPrintQRTaggingController {
    constructor(
        private readonly gRPCItemPrintQRTaggingService: gRPCItemPrintQRTaggingService
    ) { }





    @Post('ItemPrintQRTaggingPrint')
    ItemPrintQRTaggingPrint(@Body() body: { result: any, typeData: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, typeData: body.typeData, metadata: { authorization } };
        return lastValueFrom(this.gRPCItemPrintQRTaggingService.ItemPrintQRTaggingPrint(requestData.result, requestData.typeData, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('ItemPrintQRTaggingPrintQ')
    ItemPrintQRTaggingPrintQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.gRPCItemPrintQRTaggingService.ItemPrintQRTaggingPrintQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.' };
            });
    }


}