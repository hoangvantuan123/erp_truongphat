
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



  generateXMLSACLedgerQueryAccBalanceQ(result: Array<{ [key: string]: any }>): string {
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
                    <FSDomainSeq>${item.FSDomainSeq}</FSDomainSeq>
                    <AccUnit>${item.AccUnit}</AccUnit>
                    <AccDate>${item.AccDate}</AccDate>
                    <AccDateTo>${item.AccDateTo}</AccDateTo>
                    <SlipUnit>${item.SlipUnit}</SlipUnit>
                    <AccSeqFr>${item.AccSeqFr}</AccSeqFr>
                    <AccSeqTo>${item.AccSeqTo}</AccSeqTo>
                    <UMCostType>${item.UMCostType}</UMCostType>
                    <LinkCreateID>${item.LinkCreateID}</LinkCreateID>
                    <SMAccStd>${item.SMAccStd}</SMAccStd>
                </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSACLedgerQueryDetaBalanceQ(result: Array<{ [key: string]: any }>): string {
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
                    <AccUnit>${item.AccUnit}</AccUnit>
                    <AccDate>${item.AccDate}</AccDate>
                    <AccDateTo>${item.AccDateTo}</AccDateTo>
                    <CurrSeq>${item.CurrSeq}</CurrSeq>
                    <AccSeq>${item.AccSeq}</AccSeq>
                    <UMCostType>${item.UMCostType}</UMCostType>
                    <SlipUnit>${item.SlipUnit}</SlipUnit>
                    <RemSeq>${item.RemSeq}</RemSeq>
                    <RemValSeq>${item.RemValSeq}</RemValSeq>
                    <LinkCreateID>${item.LinkCreateID}</LinkCreateID>
                    <SMAccStd>1</SMAccStd>
                </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSACSlipRowSRemDetaBalanceQ(result: Array<{ [key: string]: any }>): string {
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
                    <AccUnit>${item.AccUnit}</AccUnit>
                    <AccDate>${item.AccDate}</AccDate>
                    <AccDateTo>${item.AccDateTo}</AccDateTo>
                    <CurrSeq>${item.CurrSeq}</CurrSeq>
                    <AccSeq>${item.AccSeq}</AccSeq>
                    <UMCostType>${item.UMCostType}</UMCostType>
                    <SlipUnit>${item.SlipUnit}</SlipUnit>
                    <RemSeq>${item.RemSeq}</RemSeq>
                    <RemValSeq>${item.RemValSeq}</RemValSeq>
                    <FSDomainSeq>${item.FSDomainSeq}</FSDomainSeq>
                    <SMAccStd>1</SMAccStd>
                </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSACLedgerQueryAccRemBalanceQ(result: Array<{ [key: string]: any }>): string {
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
                  <FSDomainSeq>${item.FSDomainSeq}</FSDomainSeq>
                  <AccUnit>${item.AccUnit}</AccUnit>
                  <AccDate>${item.AccDate}</AccDate>
                  <AccDateTo>${item.AccDateTo}</AccDateTo>
                  <SlipUnit>${item.SlipUnit}</SlipUnit>
                  <AccSeq>${item.AccSeq}</AccSeq>
                  <RemSeq>${item.RemSeq}</RemSeq>
                  <UMCostType>${item.UMCostType}</UMCostType>
                  <LinkCreateID>${item.LinkCreateID}</LinkCreateID>
                  <SMAccStd>1</SMAccStd>
                </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


}
