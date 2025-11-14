import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { GrpcPdmmService } from 'src/controllers/grpc/service/grpc-pdmm.service';
import { lastValueFrom } from 'rxjs';

@Controller('v5/pdmm')
export class PdmmOutReqController {
    constructor(private readonly grpcClientService: GrpcPdmmService) { }



    @Post('SPDMM-Out-Req-And-Item-A')
    SPDMMOutReqA(@Body() body: { result: any, resultItems: any[], resultCheck: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, resultItems: body.resultItems, resultCheck: body.resultCheck, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.AOutReq(requestData.result, requestData.resultItems, requestData.resultCheck, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }



    @Post('SPDMM-Out-Req-And-Item-D')
    SPDMMOutReqD(@Body() body: { result: any, resultItems: any[], resultCheck: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, resultItems: body.resultItems, resultCheck: body.resultCheck, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.DOutReq(requestData.result, requestData.resultItems, requestData.resultCheck, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPDMM-Out-Req-Item-D')
    DOutReqItem(@Body() body: { resultItems: any[], resultCheck: any }, @Req() req: Request) {
        if (!body?.resultItems) {
            return { success: false, message: 'Invalid request: Missing "resultItems"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { resultItems: body.resultItems, resultCheck: body.resultCheck, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.DOutReqItem(requestData.resultItems, requestData.resultCheck, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPDMM-Out-Req-Item-A')
    AOutReqItem(@Body() body: { resultItems: any[], resultCheck: any }, @Req() req: Request) {
        if (!body?.resultItems) {
            return { success: false, message: 'Invalid request: Missing "resultItems"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { resultItems: body.resultItems, resultCheck: body.resultCheck, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.AOutReqItem(requestData.resultItems, requestData.resultCheck, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPDMM-Out-Req-And-Item-U')
    SPDMMOutReqU(@Body() body: { result: any, resultItems: any[], resultCheck: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, resultItems: body.resultItems, resultCheck: body.resultCheck, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.UOutReq(requestData.result, requestData.resultItems, requestData.resultCheck, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPDMM-Out-Req-Q')
    QOutReq(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.QOutReq(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPDMM-Out-Req-Item-Q')
    QOutReqItem(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.QOutReqItem(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPDMM-Out-Req-Item-Stock-Query')
    SPDMMOutReqItemStockQuery(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.SPDMMOutReqItemStockQuery(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }


    @Post('SCOM-Confirm')
    SCOMConfirm(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.SCOMConfirm(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SP-DMM-Out-Req-Cancel')
    SPDMMOutReqCancel(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcClientService.SPDMMOutReqCancel(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}
