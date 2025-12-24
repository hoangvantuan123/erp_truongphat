import {
    Controller,
    Post,
    Body,
    Req,
    Res,
    HttpStatus,
    HttpException,
    Inject,
    Get,
    Delete,
    UnauthorizedException,
    Query
} from '@nestjs/common';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { gRPCHelpDefineService } from 'src/controllers/grpc/service/grpc.sp.defineLookup.service';
@Controller('v1/help')
export class OrgHelpDefineController {
    constructor(
        private readonly gRPCHelpDefineService: gRPCHelpDefineService
    ) { }



    @Post('CodeHelpItemH')
    OrgCodeHelpDefineItemH(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.gRPCHelpDefineService.OrgCodeHelpDefineItemH(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }




}
