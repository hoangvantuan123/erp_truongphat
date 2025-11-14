import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcHrEmpDateService } from 'src/controllers/grpc/service/grpc.hr.info.hr_emp_date.service';
@Controller('v6/hr')
export class HrEmpDateController {
    constructor(private readonly grpcHrEmpDateService: GrpcHrEmpDateService) { }

    @Post('HrEmpDateQ')
    HrEmpDateQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcHrEmpDateService.HrEmpDateQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

}