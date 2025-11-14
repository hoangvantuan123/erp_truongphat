
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlService {




  async generateXMLSLGInOutReqPrintQuery(result: any): Promise<string> {
    return `<ROOT><DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <ReqSeq>${result[0]?.ReqSeq}</ReqSeq>
  </DataBlock1></ROOT>`;
  }

  generateXMLSPDMMOutReqItemQuery(result: any): string {
    return `<ROOT> 
     <DataBlock3>
      <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <OutReqSeq>${result.OutReqSeq ?? ''}</OutReqSeq>
  </DataBlock3>
</ROOT>`;
  }
  generateXMLSPDMMOutReqQuery(result: any): string {
    return `<ROOT> 
     <DataBlock1>
      <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <OutReqSeq>${result.OutReqSeq ?? ''}</OutReqSeq>
  </DataBlock1>
</ROOT>`;
  }

}
