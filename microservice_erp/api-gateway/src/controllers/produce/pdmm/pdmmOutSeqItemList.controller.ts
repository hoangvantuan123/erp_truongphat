import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { GrpcPdmmService } from 'src/controllers/grpc/service/grpc-pdmm.service';
import { lastValueFrom } from 'rxjs';

@Controller('v5/pdmm')
export class PdmmOutItemListController {
    constructor(private readonly grpcClientService: GrpcPdmmService) { }

    @Post('SPDMM-Out-Req-Item-List-Query')
    QueryOutReqItemList(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.QueryOutReqItemList(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPDMM-Out-Proc-Item-List-Query')
    SPDMMOutProcItemListQuery(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.SPDMMOutProcItemListQuery(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

}
