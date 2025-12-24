import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcSPRWkEmpDdService } from 'src/grpc/service/hr/dailyAtt/SPRWkEmpDd.service';
@Controller('v6/hr')
export class SPRWkEmpDdController {
    constructor(private readonly GrpcSPRWkEmpDdService: GrpcSPRWkEmpDdService) { }

    @Post('SPRWkEmpDdQ')
    SPRWkEmpDdQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.GrpcSPRWkEmpDdService.SPRWkEmpDdQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPRWkEmpDdAUD')
    SPRWkEmpDdAUD(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.GrpcSPRWkEmpDdService.SPRWkEmpDdAUD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}