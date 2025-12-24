import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMVCOMMON/database.service';
import { GenerateXmlLaborContractService } from '../generate-xml/generate-xml-labor-contract.service';
@Injectable()
export class HrCertificateService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlLaborContractService,
    private readonly databaseServiceCommon: DatabaseServiceCommon,
  ) {}

  searchLaborContract(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchLaborContract(result);
    const query = `
      EXEC VTN_SDALabourContractQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 9931,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1019371;
    `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  async createLaborContract(
    data: any[],
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1019371;

    try {

      const xmlDocumentSave =
        await this.generateXmlService.saveLaborContract(data);

      const querySave = `
          EXEC VTN_SDALabourContractSave_Web
            @xmlDocument = N'${xmlDocumentSave}',
            @xmlFlags = 2,
            @ServiceSeq = 9931,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataSave = await this.databaseService.executeQuery(querySave);

      return {
        success: true,
        data: { dataSave },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

}
