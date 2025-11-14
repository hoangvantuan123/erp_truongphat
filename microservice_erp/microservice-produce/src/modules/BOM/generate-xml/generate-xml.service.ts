
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


  async generateXMLSPDBOMTreeQuery(result: any): Promise<string> {
    return `<ROOT><DataBlock2>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <ItemSeqTree>${result?.ItemSeq}</ItemSeqTree>
    <ItemSpecTree></ItemSpecTree>
    <ItemBomRevTree></ItemBomRevTree>
  </DataBlock2>
</ROOT>`;
  }
  async generateXMLSPDBOMItemInfoQuery(result: any): Promise<string> {
    return `<ROOT>
     <DataBlock3>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <ItemSeq>${result?.ItemSeq}</ItemSeq>
  </DataBlock3>
</ROOT>`;
  }
  async generateSPDBOMVerMngQuery(result: any): Promise<string> {
    return `<ROOT>
       <DataBlock4>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock4</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <ItemBomRev>00</ItemBomRev>
    <ItemSeq>${result?.ItemSeq}</ItemSeq>
  </DataBlock4>
  <DataBlock3>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
  </DataBlock3>
</ROOT>`;
  }

  async generateXMLSPDBOMSubItemQuery(result: any): Promise<string> {
    return `<ROOT>
       <DataBlock5>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock5</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <ItemSeq>${result?.ItemSeq}</ItemSeq>
    <ItemBomRev>00</ItemBomRev>
    <GoodSeq>${result?.ItemSeq}</GoodSeq>
    <GoodBomRev>00</GoodBomRev>
    <ProcRev>00</ProcRev>
  </DataBlock5>
</ROOT>`;
  }
  async generateXMLSPDBOMReportAllQuery(result: any): Promise<string> {
    return `<ROOT>
       <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <IsMaxRev>0</IsMaxRev>
    <UMQueryType>${result?.UMQueryType}</UMQueryType>
    <ItemSeq>${result?.ItemSeq}</ItemSeq>
    <ItemNo>${result?.ItemNo}</ItemNo>
    <AssetSeq>${result?.AssetSeq}</AssetSeq>
    <DateFr>${result?.DateFr}</DateFr>
    <DateTo>${result?.DateTo}</DateTo>
  </DataBlock1>
</ROOT>`;
  }

  async generateXMLSPDBOMSubItemCheck(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
 <DataBlock5>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <UserSeq>${item.UserSeq}</UserSeq>
    <SubItemNo>${item.SubItemNo}</SubItemNo>
    <UnitName>${item.UnitName}</UnitName>
    <NeedQtyNumerator>${item.NeedQtyNumerator}</NeedQtyNumerator>
    <NeedQtyDenominator>${item.NeedQtyDenominator}</NeedQtyDenominator>
    <HaveChild>${this.escapeXml(this.convertToNumber(item?.HaveChild))}</HaveChild>
    <InLossRate>${item.InLossRate}</InLossRate>
    <OutLossRate>${item.OutLossRate}</OutLossRate>
    <ECOSeq/>
    <FrApplyDate>${item.OutLossRate}</FrApplyDate>HaveChild
    <ToApplyDate> ${item.OutLossRate}</ToApplyDate> 
    <Location> ${item.OutLossRate}</Location>
    <Spec> ${item.Spec}</Spec>
    <SubItemName> ${item.SubItemName}</SubItemName>
    <Remark />
    <IsCfm>0</IsCfm>
    <StkConvertQty>0</StkConvertQty>
    <Serl>${item.Serl || ''}</Serl>
    <SubItemSeq>${item.SubItemSeq}</SubItemSeq>
    <SubUnitSeq>${item.SubUnitSeq}</SubUnitSeq>
    <SubItemBomRev>${item.SubItemBomRev}</SubItemBomRev>
    <ProcRev />
    <ProcName />
    <ProcSeq>0</ProcSeq>
    <SMDelvType />
    <Remark1 />
    <Remark2 />
    <Remark3 />
    <Remark4 />
    <Remark5 />
    <Remark6 />
    <Remark7 />
    <Remark8 />
    <Remark9 />
    <Remark10> ${item.Remark10 || ''} </Remark10>
    <TABLE_NAME>DataBlock5</TABLE_NAME>
    <ItemSeq>${item.ItemSeq || ''}</ItemSeq>
    <ItemBomRev>00</ItemBomRev>
    <UnitSeq> ${item.RemUnitSeqark10 || ''} </UnitSeq>
    <GoodSeq>${item.GoodSeq || ''}</GoodSeq>
    <GoodBomRev>00</GoodBomRev>
  </DataBlock5>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;

  }



  async generateXMLItem(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): Promise<string> {
    const xmlBlocks = result.map((item, index) => {
      return `
 <DataBlock5>
     <WorkingTag>${WorkingTag}</WorkingTag>
    <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <UserSeq>${item.UserSeq}</UserSeq>
    <SubItemNo>${item.SubItemNo}</SubItemNo>
    <UnitName>${item.UnitName}</UnitName>
    <NeedQtyNumerator>${item.NeedQtyNumerator}</NeedQtyNumerator>
    <NeedQtyDenominator>${item.NeedQtyDenominator}</NeedQtyDenominator>
    <HaveChild>${this.escapeXml(this.convertToNumber(item?.HaveChild))}</HaveChild>
    <InLossRate>${item.InLossRate}</InLossRate>
    <OutLossRate>${item.OutLossRate}</OutLossRate>
    <ECOSeq/>
    <FrApplyDate>${item.OutLossRate}</FrApplyDate>HaveChild
    <ToApplyDate> ${item.OutLossRate}</ToApplyDate> 
    <Location> ${item.OutLossRate}</Location>
    <Spec> ${item.Spec}</Spec>
    <SubItemName> ${item.SubItemName}</SubItemName>
    <Remark />
    <IsCfm>0</IsCfm>
    <StkConvertQty>0</StkConvertQty>
    <Serl>${item.Serl || ''}</Serl>
    <SubItemSeq>${item.SubItemSeq}</SubItemSeq>
    <SubUnitSeq>${item.SubUnitSeq}</SubUnitSeq>
    <SubItemBomRev>${item.SubItemBomRev}</SubItemBomRev>
    <ProcRev />
    <ProcName />
    <ProcSeq>0</ProcSeq>
    <SMDelvType />
    <Remark1 />
    <Remark2 />
    <Remark3 />
    <Remark4 />
    <Remark5 />
    <Remark6 />
    <Remark7 />
    <Remark8 />
    <Remark9 />
    <Remark10> ${item.Remark10 || ''} </Remark10>
    <TABLE_NAME>DataBlock5</TABLE_NAME>
    <ItemSeq>${item.ItemSeq || ''}</ItemSeq>
    <ItemBomRev>00</ItemBomRev>
    <UnitSeq> ${item.RemUnitSeqark10 || ''} </UnitSeq>
    <GoodSeq>${item.GoodSeq || ''}</GoodSeq>
    <GoodBomRev>00</GoodBomRev>
  </DataBlock5>
      `;
    }).join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
