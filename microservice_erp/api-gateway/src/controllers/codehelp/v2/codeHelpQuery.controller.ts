import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { GrpCodeHelpQueryService } from 'src/controllers/grpc/service/grpc-code-help-query.service';
import { lastValueFrom } from 'rxjs';

@Controller('v1/ver2/mssql/code-help-query')
export class CodeHelpQueryV2Controller {
    constructor(private readonly grpCodeHelpQueryService: GrpCodeHelpQueryService) { }

    @Post('')
    codeHelpQueryController(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpCodeHelpQueryService.sendCodehelpQuery(requestData.result, requestData.metadata))
            .then((resu) => resu)
            .catch((error) => {
                console.error('[Controller] Error:', error);
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('/ver-230427')
    codeHelpQueryv230427Controller(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpCodeHelpQueryService.getCodeHelp230427(requestData.result, requestData.metadata))
            .then((resu) => resu)
            .catch((error) => {
                console.error('[Controller] Error:', error);
                return { success: false, message: 'Internal Server Error' };
            });
    }
}
