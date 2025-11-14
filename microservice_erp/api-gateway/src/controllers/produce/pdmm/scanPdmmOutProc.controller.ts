import { Controller, Post, Body, Req, HttpStatus, Res, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { GrpcPdmmService } from 'src/controllers/grpc/service/grpc-pdmm.service';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
@Controller('v5/pdmm/scan')
export class ScanPdmmOutProcController {
    constructor(private readonly grpcClientService: GrpcPdmmService,

        @Inject('PRODUCE_SERVICE') private readonly warehouseService: ClientProxy,
    ) { }
    private getAuthorization(req: Request) {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return {
                success: false,
                message: 'Authorization header is missing',
                error: 'Unauthorized'
            };
        }

        return authorization
    }
    private async sendRequest(pattern: string, payload: any) {
        const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '360000');
        const controller = new AbortController();
        const timeoutHandler = setTimeout(() => controller.abort(), requestTimeout);

        try {
            const result = await firstValueFrom(
                this.warehouseService.send(pattern, payload).pipe(
                    timeout(requestTimeout)
                )
            );

            clearTimeout(timeoutHandler);
            return result;
        } catch (error) {
            clearTimeout(timeoutHandler);

            if (error.name === 'AbortError' || error.message.includes('Timeout')) {
                return {
                    success: false,
                    message: 'Request timeout. Service might be busy or unavailable.',
                    error: 'Timeout'
                };
            }

            if (error instanceof RpcException) {
                return {
                    success: false,
                    message: 'Service error occurred.',
                    error: error.message
                };
            }

            return {
                success: false,
                message: 'Internal communication error.',
                error: error.message || 'Unknown error'
            };
        }
    }
    @Post('SCOM-Source-Daily-Jump-Query')
    _SCOMSourceDailyJumpQuery(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.SCOMSourceDailyJumpQuery(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }


    @Post('SPDMM-Out-Req-Item-List-Query')
    SPDMMOutReqItemList(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.SPDMMOutReqItemList(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SMaterial-QR-Stock-Out-Check')
    SMaterialQRStockOutCheck(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.SMaterialQRStockOutCheck(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('Check-Logs-T-FIFO-Temp')
    CheckLogsTFIFOTemp(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.CheckLogsTFIFOTemp(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('D-Check-Logs-T-FIFO-Temp')
    DCheckLogsTFIFOTemp(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.DCheckLogsTFIFOTemp(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPDMM-Out-Proc-Item-Query')
    SPDMMOutProcItemQuery(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.SPDMMOutProcItemQuery(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }


    @Post('slg-in-out-save')
    async SLGInOutSave(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-save', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('slg-in-out-sheet-delete')
    async SLGInOutDelete(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-sheet-delete', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('slg-in-out-master-delete')
    async SLGInOutMasterDelete(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-master-delete', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
}
