import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SimpleQueryResult, SimpleQueryResult2 } from 'src/common/interfaces/simple-query-result.interface';

@Injectable()
export class PdmpsProdPlanListQueryService {
    constructor(private readonly databaseService: DatabaseService,
        private readonly generateXmlService: GenerateXmlService
    ) { }


    _SPDMPSDailyProdPlanListQuery(result: any, companySeq: number, userSeq: number): Promise<SimpleQueryResult> {
        return this.generateXmlService.generateXMLSPDMPSProdPlanListQuery(result)
            .then(xmlDocument => {
                const query = `
                EXEC _SPDMPSDailyProdPlanListQuery_WEB
                    @xmlDocument = N'${xmlDocument}',
                    @xmlFlags = 2,
                    @ServiceSeq = 3138,
                    @WorkingTag = N'',
                    @CompanySeq = ${companySeq},
                    @LanguageSeq = 6,
                    @UserSeq = ${userSeq},
                    @PgmSeq = 6885
                `;
                return this.databaseService.executeQuery(query);
            })
            .then(result => ({ success: true, data: result }))
            .catch(error => ({ success: false, message: error.message || ERROR_MESSAGES.DATABASE_ERROR }));
    }



}
