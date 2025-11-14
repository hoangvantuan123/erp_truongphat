import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcDaDeptService } from 'src/controllers/grpc/service/grpc.hr.org.da_dept.service';
import { GrpcOrgDeptService } from 'src/controllers/grpc/service/grpc.hr.org.org_dept.service';
@Controller('v13/hr-org-dept/')
export class OrgDeptController {
    constructor(private readonly grpcOrgDeptService : GrpcOrgDeptService) { }

    @Post('search-org-tree')
    searchTreeOrg(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcOrgDeptService.searchTreeOrg(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('get-dept-new')
    getDeptNew(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcOrgDeptService.getDeptNew(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('save-org-tree')
    createOrUpdateOrgTree(@Body() body: { dataTree: any }, @Req() req: Request) {

        console.log('body', body);
        if (!body?.dataTree) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.dataTree, metadata: { authorization } };

        return lastValueFrom(this.grpcOrgDeptService.createOrUpdateOrgTree(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

}