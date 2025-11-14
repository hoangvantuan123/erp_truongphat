
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



  generateXMLSSLEISItemAnalysisQ(result: Array<{ [key: string]: any }>): string {
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
                      <SMYearActPlan>${item.SMYearActPlan}</SMYearActPlan>
                      <SMYearActPlanName>${item.SMYearActPlanName}</SMYearActPlanName>
                      <BizUnit>${item.BizUnit}</BizUnit>
                      <BizUnitName>${item.BizUnitName}</BizUnitName>
                      <FromYM>${item.FromYM}</FromYM>
                      <ToYM>${item.ToYM}</ToYM>
                      <SMOutSales>${item.SMOutSales}</SMOutSales>
                      <SMOutSalesName>${item.SMOutSalesName}</SMOutSalesName>
                      <SMSTDQueryType>${item.SMSTDQueryType}</SMSTDQueryType>
                      <SMSTDQueryTypeName>${item.SMSTDQueryTypeName}</SMSTDQueryTypeName>
                      <UMItemClass>${item.UMItemClass}</UMItemClass>
                      <UMItemClassName>${item.UMItemClassName}</UMItemClassName>
                      <SMQryUnitSeq>${item.SMQryUnitSeq}</SMQryUnitSeq>
                      <SMRateAmt>${item.SMRateAmt}</SMRateAmt>
                      <SMRateAmtName>${item.SMRateAmtName}</SMRateAmtName>
                      <SMTermsKind>${item.SMTermsKind}</SMTermsKind>
                      <SMTermsKindName>${item.SMTermsKindName}</SMTermsKindName>
                      <Ranking>${item.Ranking}</Ranking>
              </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


}
