import { IQCStatusService } from './../service/iqcStatus.service';
import { Controller, Get, Query } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { RpcException } from '@nestjs/microservices';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class IQCStatusController {
    constructor(private readonly iqcStatusService: IQCStatusService) { }

    @MessagePattern('itm-spdqc-imp-result-list-web')
    async convertDC(

        @Payload() data: { fromDate: string, toDate: string, blNo: string, bizUnit: number, itemNo: string, itemName: string }
    ): Promise<SimpleQueryResult> {
        const { fromDate, toDate, blNo, bizUnit, itemNo, itemName } = data;
        const result = await this.iqcStatusService.ITM_SPDQCImpResultListQuery_WEB(fromDate, toDate, blNo, bizUnit, itemNo, itemName);
        return result;
    }

}
