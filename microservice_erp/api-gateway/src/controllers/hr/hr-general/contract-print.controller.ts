import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcHrContractPrintService } from 'src/controllers/grpc/service/grpc.hr.upload.contract-print.service';

@Controller('v13/contract-print/')
export class HrContractPrintController {
  constructor(
    private readonly printService: GrpcHrContractPrintService,
  ) {}

  
  @Post('print')
  printContract(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.printService.printContract(
        requestData.result,
        requestData.metadata,
      ),
    )
      .then((resu) => {
        return resu;
      })
      .catch((error) => {
        return { success: false, message: 'Internal Server Error' };
      });
  }

  @Post('certificate-issue')
  printBasCertificate(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }


    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.printService.printBasCertificate(
        requestData.result,
        requestData.metadata,
      ),
    )
      .then((resu) => {
        return resu;
      })
      .catch((error) => {
        return { success: false, message: 'Internal Server Error' };
      });
  }

}
