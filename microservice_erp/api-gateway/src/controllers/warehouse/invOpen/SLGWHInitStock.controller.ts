import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcSLGWHInitStockService } from 'src/grpc/service/wh/invOpen/SLGWHInitStock.service';
@Controller('v1/inv-open')
export class SLGWHInitStockQController {
    constructor(private readonly grpcSLGWHInitStockService: GrpcSLGWHInitStockService) { }

    @Post('SLGWHInitStockQ')
    SLGWHInitStockQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcSLGWHInitStockService.SLGWHInitStockQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SLGWHInitStockAUD')
    SLGWHInitStockAUD(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcSLGWHInitStockService.SLGWHInitStockAUD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}