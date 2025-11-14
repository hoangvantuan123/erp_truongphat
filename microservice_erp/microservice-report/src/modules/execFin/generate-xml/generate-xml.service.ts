
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



  generateXMLFinQueryCmpQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
                <DataBlock1>
                  <WorkingTag>U</WorkingTag>
                  <IDX_NO>${item.DisplayLevel}</IDX_NO>
                  <DataSeq>${item.DisplayLevel}</DataSeq>
                  <Status>0</Status>
                  <Selected>0</Selected>
                  <DisplayLevel>${item.DisplayLevel}</DisplayLevel>
                  <BSItem>1</BSItem>
                  <AccUnit>${item.AccUnit}</AccUnit>
                  <FrAccYM>${item.FrAccYM}</FrAccYM>
                  <ToAccYM>${item.ToAccYM}</ToAccYM>
                  <PrevFrAccYM>${item.PrevFrAccYM}</PrevFrAccYM>
                  <PrevToAccYM>${item.PrevToAccYM}</PrevToAccYM>
                  <FSKindNo>IS</FSKindNo>
                  <LanguageSeq>${item.LanguageSeq}</LanguageSeq>
                  <FormatSeq>${item.FormatSeq}</FormatSeq>
                  <FSDomainSeq>11</FSDomainSeq>
                  <RptUnit />
                  <IsDisplayZero>${item.IsDisplayZero}</IsDisplayZero>
                  <IsInit>0</IsInit>
                  <PrevIsInit>0</PrevIsInit>
                  <FTASeq />
                  <SlipUnit />
              </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLFSQueryTermByMonthQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
                <DataBlock1>
                 <WorkingTag>U</WorkingTag>
                  <IDX_NO>${item.DisplayLevel}</IDX_NO>
                  <DataSeq>${item.DisplayLevel}</DataSeq>
                  <Status>0</Status>
                  <Selected>0</Selected>
                  <DisplayLevel>${item.DisplayLevel}</DisplayLevel>
                <BSItem>1</BSItem>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <AccUnit>${item.AccUnit}</AccUnit>
                <AccYear>${item.AccYear}</AccYear>
                <FSKindNo>IS</FSKindNo>
                <LanguageSeq />
                  <FormatSeq>${item.FormatSeq}</FormatSeq>
                <FSDomainSeq>11</FSDomainSeq>
                <RptUnit />
                <IsDisplayZero>${item.IsDisplayZero}</IsDisplayZero>
                <SlipUnit />
              </DataBlock1>
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLFSMonthlyProdCostQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
                <DataBlock1>
                 <WorkingTag>U</WorkingTag>
                  <IDX_NO>${item.DisplayLevel}</IDX_NO>
                  <DataSeq>${item.DisplayLevel}</DataSeq>
                  <Status>0</Status>
                  <Selected>0</Selected>
                  <DisplayLevel>${item.DisplayLevel}</DisplayLevel>
                <BSItem>1</BSItem>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <AccUnit>${item.AccUnit}</AccUnit>
                <AccYear>${item.AccYear}</AccYear>
                <FSKindNo>GOODS_COST</FSKindNo>
                <LanguageSeq />
                  <FormatSeq>${item.FormatSeq}</FormatSeq>
                <FSDomainSeq>11</FSDomainSeq>
                <RptUnit />
                <IsDisplayZero>${item.IsDisplayZero}</IsDisplayZero>
                <SlipUnit />
              </DataBlock1>
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLMonthlyFinancialReportQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
                <DataBlock1>
                 <WorkingTag>U</WorkingTag>
                  <IDX_NO>${item.DisplayLevel}</IDX_NO>
                  <DataSeq>${item.DisplayLevel}</DataSeq>
                  <Status>0</Status>
                  <Selected>0</Selected>
                  <DisplayLevel>${item.DisplayLevel}</DisplayLevel>
                <BSItem>1</BSItem>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <AccUnit>${item.AccUnit}</AccUnit>
                <AccYear>${item.AccYear}</AccYear>
                <FSKindNo>BS</FSKindNo>
                <LanguageSeq />
                  <FormatSeq>${item.FormatSeq}</FormatSeq>
                <FSDomainSeq>11</FSDomainSeq>
                <RptUnit />
                <IsDisplayZero>${item.IsDisplayZero}</IsDisplayZero>
                <SlipUnit />
              </DataBlock1>
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLFinancialReportQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
                  <DataBlock1>
                  <WorkingTag>U</WorkingTag>
                  <IDX_NO>${item.DisplayLevel}</IDX_NO>
                  <DataSeq>${item.DisplayLevel}</DataSeq>
                  <Status>0</Status>
                  <Selected>0</Selected>
                  <DisplayLevel>${item.DisplayLevel}</DisplayLevel>
                  <BSItem>1</BSItem>
                  <AccUnit>${item.AccUnit}</AccUnit>
                  <FrAccYM>${item.FrAccYM}</FrAccYM>
                  <ToAccYM>${item.ToAccYM}</ToAccYM>
                  <PrevFrAccYM>${item.PrevFrAccYM}</PrevFrAccYM>
                  <PrevToAccYM>${item.PrevToAccYM}</PrevToAccYM>
                  <FSKindNo>BS</FSKindNo>
                  <LanguageSeq>${item.LanguageSeq}</LanguageSeq>
                  <FormatSeq>${item.FormatSeq}</FormatSeq>
                  <FSDomainSeq>11</FSDomainSeq>
                  <RptUnit />
                  <IsDisplayZero>${item.IsDisplayZero}</IsDisplayZero>
                  <IsInit>${item.IsInit}</IsInit>
                  <PrevIsInit>${item.PrevIsInit}</PrevIsInit>
                  <FTASeq />
                  <SlipUnit />
              </DataBlock1>
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
