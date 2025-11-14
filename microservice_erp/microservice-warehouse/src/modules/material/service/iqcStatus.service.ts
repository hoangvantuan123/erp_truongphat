import { Injectable } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';

@Injectable()
export class IQCStatusService {
    constructor(private readonly databaseService: DatabaseService) { }

    async ITM_SPDQCImpResultListQuery_WEB(fromDate: string, toDate: string, blNo: string, bizUnit: number, itemNo: string, itemName: string): Promise<SimpleQueryResult> {
        const query = `
      EXEC ITM_SPDQCImpResultListQuery_WEB 
        @pFromDate = '${fromDate}',
        @pToDate = '${toDate}',
        @pBLNo = '${blNo}',
        @pBizUnit = ${bizUnit},
        @pItemNo = '${itemNo}',
        @pItemName = '${itemName}';
    `;

        try {
            const result = await this.databaseService.executeQuery(query);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: ERROR_MESSAGES.DATABASE_ERROR };
        }
    }





}
