import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcUploadHrEmpInfoService } from 'src/controllers/grpc/service/grpc.upload.hr_emp_info.service';
@Controller('v8/hr')
export class UploadHrEmpInfoController {
    constructor(private readonly GrpcUploadHrEmpInfoService: GrpcUploadHrEmpInfoService) { }

    @Post('EmpInfoRptQ')
    EmpInfoRptQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.GrpcUploadHrEmpInfoService.EmpInfoRptQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}