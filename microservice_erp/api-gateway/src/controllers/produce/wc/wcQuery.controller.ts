import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { GrpcWcService } from 'src/controllers/grpc/service/grpc-ws.service';
import { lastValueFrom } from 'rxjs';

@Controller('v5/wc')
export class WcController {
    constructor(private readonly grpcWcService: GrpcWcService) { }

    @Post('SPD-Base-Work-Center-Query')
    SPDBaseWorkCenterQuery(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcWcService.workCenterQ(requestData.result, requestData.metadata))
            .then((resu) => resu)
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}
