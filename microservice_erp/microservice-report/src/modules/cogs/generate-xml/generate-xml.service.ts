
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlService {

  private escapeXml(str: any): string {
    if (typeof str !== 'string') {
      str = str == null ? '' : String(str);
    }
    return str.replace(/[&<>"']/g, (char: string): string => {
      switch (char) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&apos;';
        default:
          return char;
      }
    });
  }
  private convertToNumber(value: boolean | string | null | undefined): number {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    if (typeof value === 'string') {
      return value === '1' ? 1 : 0;
    }
    return 0;
  }
  parseTo01(value: any): string {
    const normalized = String(value).trim().toLowerCase();
    return normalized === "1" || normalized === "true" ? "1" : "0";
  }



  generateXMLSESMCFProfitAmtQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
              <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <RptUnit />
              <SMCostMng>${item.SMCostMng}</SMCostMng>
              <PlanYear />
              <SMCostDiv>${item.SMCostDiv}</SMCostDiv>
              <CostMngAmdSeq />
              <ProfCostUnit>${item.ProfCostUnit}</ProfCostUnit>
              <CostYMFr>${item.CostYMFr}</CostYMFr>
              <CostYMTo>${item.CostYMTo}</CostYMTo>
              <SMQryUnitSeq />
              <ItemClassLSeq />
              <ItemClassMSeq />
              <UMItemClass />
              <PJTSeq>${item.PJTSeq}</PJTSeq>
              <UMCustClass>${item.UMCustClass}</UMCustClass>
              <ProfitDivSeq>${item.ProfitDivSeq}</ProfitDivSeq>
              <DeptSeq />
              <CustSeq>${item.CustSeq}</CustSeq>
            </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSESMCFMnfcostasQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
            <DataBlock1>
                  <WorkingTag>A</WorkingTag>
                  <IDX_NO>1</IDX_NO>
                  <Status>0</Status>
                  <DataSeq>1</DataSeq>
                  <Selected>1</Selected>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <IsChangedMst>0</IsChangedMst>
                  <RptUnit />
                  <SMCostMng>${item.SMCostMng}</SMCostMng>
                  <PlanYear />
                  <SMCostDiv>${item.SMCostDiv}</SMCostDiv>
                  <CostMngAmdSeq />
                  <ProfCostUnit>${item.ProfCostUnit}</ProfCostUnit>
                  <CostYMFr>${item.CostYMFr}</CostYMFr>
                  <CostYMTo>${item.CostYMTo}</CostYMTo>
                  <SMQryUnitSeq>${item.SMQryUnitSeq}</SMQryUnitSeq>
                  <PJTSeq>${item.PJTSeq}</PJTSeq>
                  <UMCustClass>${item.UMCustClass}</UMCustClass>
                  <ProfitDivSeq>${item.ProfitDivSeq}</ProfitDivSeq>
                  <DeptSeq>${item.DeptSeq}</DeptSeq>
                  <CustSeq>${item.CustSeq}</CustSeq>
              </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLVTNSESMZProdCostMonListQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
            <DataBlock1>
                 <WorkingTag>A</WorkingTag>
                  <IDX_NO>1</IDX_NO>
                  <Status>0</Status>
                  <DataSeq>1</DataSeq>
                  <Selected>1</Selected>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <IsChangedMst>0</IsChangedMst>
                  <RptUnit>${item.RptUnit}</RptUnit>
                  <SMCostMng>${item.SMCostMng}</SMCostMng>
                  <CostMngAmdSeq>${item.CostMngAmdSeq}</CostMngAmdSeq>
                  <CostUnit>${item.CostUnit}</CostUnit>
                  <CostYY>${item.CostYY}</CostYY>
                  <AssetSeq>${item.AssetSeq}</AssetSeq>
                  <QueryKind>${item.QueryKind}</QueryKind>
                  <ItemSeq>${item.ItemSeq}</ItemSeq>
                  <ItemName>${item.ItemName}</ItemName>
                  <ItemNo>${item.ItemNo}</ItemNo>
                  <ItemClassKind>${item.ItemClassKind}</ItemClassKind>
                  <ItemClassSeq>${item.ItemClassSeq}</ItemClassSeq>
                  <PlanYear>${item.PlanYear}</PlanYear>
              </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSBAZProdCostItemListQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
            <DataBlock1>
                    <WorkingTag>A</WorkingTag>
                    <IDX_NO>1</IDX_NO>
                    <Status>0</Status>
                    <DataSeq>1</DataSeq>
                    <Selected>1</Selected>
                    <TABLE_NAME>DataBlock1</TABLE_NAME>
                    <IsChangedMst>1</IsChangedMst>
                    <RptUnit>${item.RptUnit}</RptUnit>
                    <SMCostMng>${item.SMCostMng}</SMCostMng>
                    <FSDomainSeq>${item.FSDomainSeq}</FSDomainSeq>
                    <CostUnit>${item.CostUnit}</CostUnit>
                    <CostYMFr>${item.CostYMFr}</CostYMFr>
                    <CostYMTo>${item.CostYMTo}</CostYMTo>
                    <ItemClassKind>${item.ItemClassKind}</ItemClassKind>
                    <ItemClassKindName></ItemClassKindName>
                    <ItemClassSeq>${item.ItemClassSeq}</ItemClassSeq>
                    <ItemSeq>${item.ItemSeq}</ItemSeq>
                    <ItemNo>${item.ItemNo}</ItemNo>
                    <AssetSeq>${item.AssetSeq}</AssetSeq>
                    <AssetGroupSeq>${item.AssetGroupSeq}</AssetGroupSeq>
                    <IsAssetType>${item.IsAssetType}</IsAssetType>
                    <WorkOrderNo>${item.WorkOrderNo}</WorkOrderNo>
                    <PlanYear>${item.PlanYear}</PlanYear>
                    <CostMngAmdSeq>${item.CostMngAmdSeq}</CostMngAmdSeq>
                    <IsAssetAcc>${item.IsAssetAcc}</IsAssetAcc>
              </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
