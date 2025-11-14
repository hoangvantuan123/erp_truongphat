import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { GrpcHrEmpPlnService } from 'src/controllers/grpc/service/grpc.hr.info.hr_emp_pln.service';
import { lastValueFrom } from 'rxjs';
import { GrpcHrFileService } from 'src/controllers/grpc/service/grpc.hr_file.service';

@Controller('v6/hr')
export class HrEmpFileController {
    constructor(private readonly grpcHrFileService: GrpcHrFileService) { }

    @Post('HrFileQ')
    HrFileQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcHrFileService.HrFileQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('HrFileD')
    HrFileD(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcHrFileService.HrFileD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}