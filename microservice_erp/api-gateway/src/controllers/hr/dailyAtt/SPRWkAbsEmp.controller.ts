import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcSPRWkAbsEmpService } from 'src/grpc/service/hr/dailyAtt/SPRWkAbsEmp.service';
@Controller('v6/hr')
export class SPRWkAbsEmpController {
    constructor(private readonly grpcSPRWkAbsEmpService: GrpcSPRWkAbsEmpService) { }

    @Post('SPRWkAbsEmpQ')
    SPRWkAbsEmpQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcSPRWkAbsEmpService.SPRWkAbsEmpQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPRWkAbsEmpAUD')
    SPRWkAbsEmpAUD(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcSPRWkAbsEmpService.SPRWkAbsEmpAUD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}