import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcDaDeptService } from 'src/controllers/grpc/service/grpc.hr.org.da_dept.service';
@Controller('v13/hr-dept/')
export class DaDeptController {
    constructor(private readonly daDeptService: GrpcDaDeptService) { }

    @Post('search-da-dept')
    searchDaDept(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.daDeptService.searchDaDept(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('dept-his')
    getDeptHis(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.daDeptService.getDeptHis(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('dept-cctr')
    getDeptCCtr(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.daDeptService.getDeptCCtr(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('cud-da-dept')
    createOrUpdateDaDept(@Body() body: { dataDept: any[], dataDeptHis: any[], dataOrgCCtr: any[] }, @Req() req: Request) {
        if (!body) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { dataDept: body.dataDept, dataDeptHis: body.dataDeptHis, dataOrgCCtr: body.dataOrgCCtr, metadata: { authorization } };

        return lastValueFrom(this.daDeptService.createOrUpdateDaDept(requestData.dataDept, requestData.dataDeptHis, requestData.dataOrgCCtr, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('delete-dept-his')
    deleteDeptHis(@Body() body: { dataDeptHis: any }, @Req() req: Request) {
        
        if (!body?.dataDeptHis) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.dataDeptHis, metadata: { authorization } };

        return lastValueFrom(this.daDeptService.deleteDeptHis(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('delete-dept-org')
    deleteDeptOrg(@Body() body: { dataDeptOrg: any }, @Req() req: Request) {

        if (!body?.dataDeptOrg) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.dataDeptOrg, metadata: { authorization } };

        return lastValueFrom(this.daDeptService.deleteDeptOrg(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
}