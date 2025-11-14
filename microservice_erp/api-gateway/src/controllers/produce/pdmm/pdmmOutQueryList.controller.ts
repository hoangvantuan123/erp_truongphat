import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { GrpcPdmmService } from 'src/controllers/grpc/service/grpc-pdmm.service';
import { lastValueFrom } from 'rxjs';

@Controller('v5/pdmm')
export class PdmmOutQueryListController {
    constructor(private readonly grpcClientService: GrpcPdmmService) { }

    @Post('SPDMM-Out-Req-List-Query-WEB')
    SLGInOutReqPrintQuery(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { lastValueFromsuccess: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.QueryOutReqList(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}
