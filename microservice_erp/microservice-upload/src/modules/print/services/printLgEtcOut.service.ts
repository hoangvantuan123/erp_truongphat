import { Injectable } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { InjectDataSource } from '@nestjs/typeorm';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DataSource } from 'typeorm';
@Injectable()
export class PrintLgEtcOutService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }

    async _SLGInOutReqPrintQuery_WEB(
        result: any[],
        companySeq: number,
        userSeq: number
    ): Promise<SimpleQueryResult> {
        const xmlDocument = await this.generateXmlService.generateXMLSLGInOutReqPrintQuery(result);

        const query = `
      EXEC _SLGInOutReqPrintQuery_WEB
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 5660,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 6885;
    `;

        try {
            // Sử dụng query trực tiếp từ DataSource
            const resultRaw = await this.dataSource.query(query);

            const data = {
                ...resultRaw[0],
                DataSheets: resultRaw
            };

            return { success: true, data: data };
        } catch (error) {
            console.error('Database error:', error);
            return { success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR };
        }
    }
}

