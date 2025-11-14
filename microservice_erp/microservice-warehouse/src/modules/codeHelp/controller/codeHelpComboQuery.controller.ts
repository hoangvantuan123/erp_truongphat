import { Controller, Get, Query } from '@nestjs/common';
import { CodeHelpComboQueryService } from '../service/codeHelpComboQuery.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class CodeHelpComboQueryController {
    constructor(private readonly codeHelpComboQueryService: CodeHelpComboQueryService) { }
    @MessagePattern('code-help-combo-query')
    async checkItemLotExists(
        @Payload() data: { workingTag: string, languageSeq: number, codeHelpSeq: number, companySeq: number, keyword: string, param1: string, param2: string, param3: string, param4: string }
    ): Promise<SimpleQueryResult> {
        const { workingTag, languageSeq, codeHelpSeq, companySeq, keyword, param1, param2, param3, param4 } = data;
        const result = await this.codeHelpComboQueryService._SCACodeHelpComboQuery(workingTag, languageSeq, codeHelpSeq, companySeq, keyword, param1, param2, param3, param4);
        return result;
    }
}
