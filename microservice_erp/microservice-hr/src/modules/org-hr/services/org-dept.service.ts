import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { Observable, from, catchError, map, of, switchMap } from 'rxjs';
import { GenerateXmlOrgService } from '../generate-xml/generate-org-xml.service';
import { DatabaseServiceCommon } from 'src/common/database/sqlServer/ITMVCOMMON/database.service';
@Injectable()
export class OrgDeptService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly databaseServiceCommon: DatabaseServiceCommon,
    private readonly generateXmlService: GenerateXmlOrgService,
  ) {}

  searchTreeOrg(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.searchBy(result);
    const query = `
      EXEC _SHROrgDeptQueryTree
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1608,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1780;
    `;
    const dataBase = {
      BaseDate: result[0].baseDate,
      OrgType: result[0].OrgType,
    }

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: this.buildTree(dataBase, resultQuery) })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  buildTree(dataBase: any, data: any[]) {
    const nodeMap = new Map();
    const tree: any[] = [];
  
    data.forEach((item) => {
      nodeMap.set(item.Seq, {
        title: item.NodeName,
        key: item.Seq.toString(),
        icon: item.IsFile ? 'file' : 'folder',
        children: [],
        BaseDate: dataBase.BaseDate || '',
        OrgType: dataBase.OrgType,
        ...item,
      });
    });
  
    data.forEach((item) => {
      const node = nodeMap.get(item.Seq);
      const parentNode = nodeMap.get(item.ParentSeq);
  
      if (parentNode) {
        node.Level = (parentNode.Level ?? 0) + 1;
        parentNode.children.push(node);
      } else {
        node.Level = 1;
        tree.push(node);
      }
    });
  
    return tree;
  }

  flattenTree(treeData: any) {
    const result: any[] = [];
  
    const traverse =(nodes: any, parent = null, level = 1) =>{
      nodes.forEach((node: any) => {
        const { children, raw, ...rest } = node;
  
        result.push({
          ...rest,
          parent,
          level,
          raw
        });
  
        if (children && children.length > 0) {
          traverse(children, node.key, level + 1);
        }
      });
    }
  
    traverse(treeData);
    return result;
  }

  getDeptNew(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getDeptNew(result);
    const query = `
      EXEC _SHRDeptNewQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 888,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1780;
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

  async createOrUpdateOrgTree(
    dataTree: any,
    companySeq: number,
    userSeq: number,
  ): Promise<SimpleQueryResult> {
    const pgmSeq = 1780;

    const flattenTree = this.flattenTree(dataTree);
    const xmlDocument =
      await this.generateXmlService.createOrUpdateOrgTree(flattenTree);
    const query = `
      EXEC _SHROrgDeptSaveTree_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 1608,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = 1780;
    `;

    try {
      const dataOrgDept = await this.databaseService.executeQuery(query);

      const xmlDocumentOrgDeptLast =
        await this.generateXmlService.createOrUpdateOrgDeptLast(dataOrgDept);

      const querySaveOrgDeptLast = `
          EXEC _SHROrgDeptLastSave_Web
            @xmlDocument = N'${xmlDocumentOrgDeptLast}',
            @xmlFlags = 2,
            @ServiceSeq = 5952,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataOrgDeptLastSave =
        await this.databaseService.executeQuery(querySaveOrgDeptLast);


        const queryOrgDeptLastSync = `
          EXEC _SHROrgDeptLastSynthSave_Web
            @xmlDocument = N'<ROOT></ROOT>',
            @xmlFlags = 2,
            @ServiceSeq = 5541,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
      const dataOrgDeptLastSync =
        await this.databaseServiceCommon.executeQuery(queryOrgDeptLastSync);


      return {
        success: true,
        data: { dataOrgDept, dataOrgDeptLastSave, dataOrgDeptLastSync },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  getDeptHis(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getDeptHis(result);
    const query = `
      EXEC _SHRDeptHistQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 937,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
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

  getDeptCCtr(
    result: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.getDeptCCtr(result);
    const query = `
      EXEC _SHROrgDeptCCtrQuery_Web
        @xmlDocument = N'${xmlDocument}',
        @xmlFlags = 2,
        @ServiceSeq = 943,
        @WorkingTag = N'',
        @CompanySeq = ${companySeq},
        @LanguageSeq = 6,
        @UserSeq = ${userSeq},
        @PgmSeq = ${pgmSeq};
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

  async deleteDeptHis(
    dataDeptHis: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      const xmlDocumentDeptHis = await this.generateXmlService.checkDeptHis(
        dataDeptHis,
        ''
      );
      const queryCheckDeptHis = `
        EXEC _SHRDeptHistCheck_Web
          @xmlDocument = N'${xmlDocumentDeptHis}',
          @xmlFlags = 2,
          @ServiceSeq = 937,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const dataCheckDeptHis =
        await this.databaseService.executeQuery(queryCheckDeptHis);

      if (dataCheckDeptHis.length !== 0 && dataCheckDeptHis[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckDeptHis[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveDeptHis =
        await this.generateXmlService.saveDeptHis(dataCheckDeptHis);
      const querySaveDeptHis = `
        EXEC _SHRDeptHistSave_Web
          @xmlDocument = N'${xmlDocumentSaveDeptHis}',
          @xmlFlags = 2,
          @ServiceSeq = 937,
          @WorkingTag = N'',
          @CompanySeq = ${companySeq},
          @LanguageSeq = 6,
          @UserSeq = ${userSeq},
          @PgmSeq = ${pgmSeq};
      `;

      const dataSaveDeptHis =
        await this.databaseService.executeQuery(querySaveDeptHis);

      return {
        success: true,
        data: { dataSaveDeptHis },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }

  async deleteDeptOrg(
    dataOrgCCtr: any[],
    companySeq: number,
    userSeq: number,
    pgmSeq: number,
  ): Promise<SimpleQueryResult> {
    try {
      const xmlDocumentOrgDept = await this.generateXmlService.checkOrgDeptCCtr(
        dataOrgCCtr,
        '',
      );
      const queryCheckOrgDept = `
          EXEC _SHROrgDeptCCtrCheck_Web
            @xmlDocument = N'${xmlDocumentOrgDept}',
            @xmlFlags = 2,
            @ServiceSeq = 943,
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataCheckOrgDept =
        await this.databaseService.executeQuery(queryCheckOrgDept);

      if (dataCheckOrgDept.length !== 0 && dataCheckOrgDept[0]?.Status !== 0) {
        return {
          success: false,
          message:
            dataCheckOrgDept[0]?.Result ?? 'Error occurred during the check.',
        };
      }

      const xmlDocumentSaveOrgDept =
        await this.generateXmlService.saveOrgDeptCCtr(dataCheckOrgDept);
      const querySaveOrgDept = `
          EXEC _SHROrgDeptCCtrSave_Web
            @xmlDocument = N'${xmlDocumentSaveOrgDept}',
            @xmlFlags = 2,
            @ServiceSeq = 943,
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

      const dataSaveOrgDept =
        await this.databaseService.executeQuery(querySaveOrgDept);
      return {
        success: true,
        data: { dataSaveOrgDept },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message ?? ERROR_MESSAGES.DATABASE_ERROR,
      };
    }
  }
}
