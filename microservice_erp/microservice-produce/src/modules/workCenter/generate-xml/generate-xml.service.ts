
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


  async generateXMLSPDBaseWorkCenterQuery(result: any): Promise<string> {
    return `<ROOT> 
     <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <SMWorkCenterType>${result.SMWorkCenterType ?? ''}</SMWorkCenterType>
    <WorkCenterName>${result.WorkCenterName ?? ''}</WorkCenterName>
    <DeptName>${result.DeptName ?? ''}</DeptName>
  </DataBlock1>
</ROOT>`;
  }


}
