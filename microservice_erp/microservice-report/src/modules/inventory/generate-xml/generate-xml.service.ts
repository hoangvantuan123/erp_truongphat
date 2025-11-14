
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



  generateXMLSupplementIssueQ(result: Array<{ [key: string]: any }>): string {
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
                  <SMCostMng>${item.SMCostMng}</SMCostMng>
                  <RptUnit />
                  <CostUnit>${item.CostUnit}</CostUnit>
                  <CostUnitName/>
                  <CostYMFr>${item.CostYMFr}</CostYMFr>
                  <CostYMTo>${item.CostYMTo}</CostYMTo>
                  <AssetGroupSeq>${item.AssetGroupSeq}</AssetGroupSeq>
                  <ItemClassKind />
                  <ItemClassKindName />
                  <ItemClassSeq />
                  <ItemClassName />
                  <AssetSeq>${item.AssetSeq}</AssetSeq>
                  <AssetName/>
                  <ItemSeq>${item.ItemSeq}</ItemSeq>
                  <ItemName>${item.ItemName}</ItemName>
                  <ItemNo>${item.ItemNo}</ItemNo>
                  <SMAdjustKindSeq>${item.SMAdjustKindSeq}</SMAdjustKindSeq>
                  <ItemKind />
                  <AppPriceKind>${item.AppPriceKind}</AppPriceKind>
            </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLStockMonthlyAmtQ(result: Array<{ [key: string]: any }>): string {
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
                <SMCostMng>${item.SMCostMng}</SMCostMng>
                <PlanYear />
                <RptUnit />
                <CostUnit>${item.CostUnit}</CostUnit>
                <CostUnitName />
                <CostYMFr>${item.CostYMFr}</CostYMFr>
                <CostYMTo>${item.CostYMTo}</CostYMTo>
                <AssetGroupSeq>${item.AssetGroupSeq}</AssetGroupSeq>
                <ItemClassKind></ItemClassKind>
                <ItemClassKindName></ItemClassKindName>
                <ItemClassSeq />
                <ItemClassName />
                <AssetSeq>${item.AssetSeq}</AssetSeq>
                <AssetName></AssetName>
               <ItemSeq>${item.ItemSeq}</ItemSeq>
                  <ItemName>${item.ItemName}</ItemName>
                  <ItemNo>${item.ItemNo}</ItemNo>
                <AppPriceKind>${item.AppPriceKind}</AppPriceKind>
                <IsAssetType>${item.IsAssetType}</IsAssetType>
                <IsDiff>${item.IsDiff}</IsDiff>
                <ItemKind />
              </DataBlock1>
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
