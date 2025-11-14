import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { GrpCodeHelpComboQueryService } from 'src/controllers/grpc/service/grpc-code-help-combo-query.service';
import { lastValueFrom } from 'rxjs';

@Controller('v1/ver2/mssql/code-help-combo-query')
export class CodeHelpComboQueryV2Controller {
    constructor(private readonly grpCodeHelpComboQueryService: GrpCodeHelpComboQueryService) { }

    @Post('')
    codeHelpComboQueryController(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpCodeHelpComboQueryService.sendCodehelpComboQuery(requestData.result, requestData.metadata))
            .then((resu) => resu)
            .catch((error) => {
                console.error('[Controller] Error:', error);
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('/ver-230427')
    codeHelpComboQueryV230427Controller(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpCodeHelpComboQueryService.getCodeHelpCombo230427(requestData.result, requestData.metadata))
            .then((resu) => resu)
            .catch((error) => {
                console.error('[Controller] Error:', error);
                return { success: false, message: 'Internal Server Error' };
            });
    }
}
