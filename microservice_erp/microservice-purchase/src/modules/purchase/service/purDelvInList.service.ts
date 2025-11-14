import { Injectable } from '@nestjs/common';
import {
  SimpleQueryResult,
  SimpleQueryResult2,
} from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlPurchaseService } from '../generate-xml/generate-xml-purchase.service';

@Injectable()
export class PurDelvInListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlPurchaseService,
  ) {}

  async SPUDelvInListQueryWEB(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    const xmlDocument =
      await this.generateXmlService.generateXMLSPUDelvInListQueryWEB(result);
    const query = `
  EXEC _SPUDelvInListQuery_WEB
    @xmlDocument = N'${xmlDocument}',
    @xmlFlags = 2,
    @ServiceSeq = 2152,
    @WorkingTag = N'',
    @CompanySeq = ${companySeq},
    @LanguageSeq = 6,
    @UserSeq = ${userSeq},
    @PgmSeq = ${pgmSeq};
`;
    try {
      const result = await this.databaseService.executeQuery(query);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }
}
