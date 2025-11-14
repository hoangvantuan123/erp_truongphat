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
@Controller('v8/upload')
export class TempFileController {
    constructor(
        private readonly gRPCTempFileService: gRPCTempFileService
    ) { }


    @Post('TempFileA')
    TempFileA(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.gRPCTempFileService.TempFileA(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }


    @Post('TempFileU')
    TempFileU(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.gRPCTempFileService.TempFileU(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('TempFileD')
    TempFileD(@Body() body: { result: any[] }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.gRPCTempFileService.TempFileD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('TempFileQ')
    TempFileQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.gRPCTempFileService.TempFileQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
  


    @Post('TempFileP')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async TempFileP(
        @Req() req: Request,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: { result: string },
    ) {
        if (!files?.length) {
            return { success: false, message: 'No files uploaded' };
        }

        if (!body?.result) {
            return { success: false, message: 'Missing "result"' };
        }

        let parsedResult: { IdSeq: string };
        try {
            parsedResult = JSON.parse(body.result);
        } catch (e) {
            return { success: false, message: 'Invalid JSON in "result"' };
        }
        const grpcFiles = files.map((file) => ({

            filename: file.originalname,
            content: file.buffer,
            mimetype: file.mimetype,
            encoding: file.encoding,
            size: file.size,
            fieldname: file.fieldname

        }));


        const authorization = req.headers.authorization || '';
        const requestData = { metadata: { authorization } };

        try {
            const response = await lastValueFrom(
                this.gRPCTempFileService.TempFileP(grpcFiles, parsedResult, requestData.metadata),
            );
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'gRPC call failed',
                errorDetails: error?.message,
            };
        }
    }


}