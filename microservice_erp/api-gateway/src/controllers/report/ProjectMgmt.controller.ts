import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcProjectMgmtService } from 'src/grpc/service/report/project/projectMgmt.service';
@Controller('v15/pm')
export class ProjectMgmtController {
    constructor(private readonly grpcProjectMgmtService: GrpcProjectMgmtService) { }


    @Post('ProjectMgmtAUD')
    ProjectMgmtAUD(@Body() body: { result: any, result2: any, result3: any, result4: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, result2: body.result2, result3: body.result3, result4: body.result4, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.ProjectMgmtAUD(requestData.result, requestData.result2, requestData.result3, requestData.result4, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPJTSupplyContractResAUD')
    SPJTSupplyContractResAUD(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.SPJTSupplyContractResAUD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SupplyContractRemarkAUD')
    SupplyContractRemarkAUD(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.SupplyContractRemarkAUD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPJTSupplyContractQ')
    SPJTSupplyContractQ(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.SPJTSupplyContractQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPJTSupplyContractResQ')
    SPJTSupplyContractResQ(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.SPJTSupplyContractResQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPJTSupplyContractRemarkQ')
    SPJTSupplyContractRemarkQ(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.SPJTSupplyContractRemarkQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPJTSupplyContractListQ')
    SPJTSupplyContractListQ(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.SPJTSupplyContractListQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPJTSupplyContractD')
    SPJTSupplyContractD(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.SPJTSupplyContractD(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('SPJTSupplyContractAmtListQ')
    SPJTSupplyContractAmtListQ(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcProjectMgmtService.SPJTSupplyContractAmtListQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

}