import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { GrpcClientService } from 'src/controllers/grpc/service/grpc-client.service';
import { lastValueFrom } from 'rxjs';

@Controller('v5/PdmpsProd')
export class PdmpsProdPlanListQueryController {
    constructor(private readonly grpcClientService: GrpcClientService) { }

    @Post('SPD-MPS-Prod-Plan-List-Query')
    SLGInOutReqPrintQuery(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.sendMetadata(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}
