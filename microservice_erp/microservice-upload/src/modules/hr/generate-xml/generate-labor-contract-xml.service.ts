
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateLaborContractXmlService {

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



  generateXMLLaborContractPrint1(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
                <WorkingTag>U</WorkingTag>
                <IDX_NO>${index + 1 || 1}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <ContractDate>${item?.ContractDate}</ContractDate>
                <ContractKind>${item?.ContractKind}</ContractKind>
                <EmpSeq>${item?.EmpSeq}</EmpSeq>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
              </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  
  generateXMLprintBasCertificate(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
         <DataBlock1>
          <WorkingTag />
          <IDX_NO>1</IDX_NO>
          <DataSeq>1</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <ApplyDate>${this.escapeXml(item?.ApplyDate)}</ApplyDate>
          <ResidIDMYN>${item?.ResidIDMYN || 0}</ResidIDMYN>
          <SMCertiType>${item?.SMCertiType}</SMCertiType>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <Emp>${item?.EmpSeq || '10_'}</Emp>
          <Certi>${item?.CertiSeq || '1_'}</Certi>
          <Count>${item?.CertiCnt || 1}</Count>
        </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
