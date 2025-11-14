import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlService {
  private escapeXml(str: any): string {
    if (str == null) return ''; // null hoặc undefined trả về chuỗi rỗng
    if (typeof str !== 'string') str = String(str);
    return str.replace(/[&<>"']/g, (char: string): string => {
      switch (char) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return char;
      }
    });
  }

  private safeValue(value: any): string {
    return this.escapeXml(value ?? '');
  }

  private convertToNumber(value: boolean | string | null | undefined): number {
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'string') return value === '1' ? 1 : 0;
    return 0;
  }

  generateXMLSLGWHInitStockQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <AssetSeq>${this.safeValue(item.AssetSeq)}</AssetSeq>
          <AssetName>${this.safeValue(item.AssetName)}</AssetName>
          <UMItemClass>${this.safeValue(item.UMItemClass)}</UMItemClass>
          <ItemClassName>${this.safeValue(item.ItemClassName)}</ItemClassName>
          <IsGood>${item.IsGood ?? 0}</IsGood>
          <IsNew>${item.IsNew ?? 0}</IsNew>
        <ItemName>${this.safeValue(item.ItemName)}</ItemName>
        <ItemNo>${this.safeValue(item.ItemNo)}</ItemNo>
        <Spec>${this.safeValue(item.Spec)}</Spec>
        <StkYM>${this.safeValue(item.StkYM)}</StkYM>
        <BizUnit>${this.safeValue(item.BizUnit)}</BizUnit>
        <BizUnitName>${this.safeValue(item.BizUnitName)}</BizUnitName>
        <WHSeq>${this.safeValue(item.WHSeq)}</WHSeq>
        <WHName>${this.safeValue(item.WHName)}</WHName>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSLGWHInitStockAUD(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map((item, index) => `
        <DataBlock1>
          <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
           <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
          <DataSeq>${this.safeValue(item.IdxNo || item.IDX_NO)}</DataSeq>
          <Status>${this.safeValue(item.Status ?? 0)}</Status>
          <Selected>${this.safeValue(item.Selected ?? 1)}</Selected>
          <ItemName>${this.safeValue(item.ItemName)}</ItemName>
          <ItemNo>${this.safeValue(item.ItemNo)}</ItemNo>
          <Spec>${this.safeValue(item.Spec)}</Spec>
          <ItemSeq>${this.safeValue(item.ItemSeq)}</ItemSeq>
          <UnitName>${this.safeValue(item.UnitName)}</UnitName>
          <UnitSeq>${this.safeValue(item.UnitSeq)}</UnitSeq>
          <PrevQty>${this.safeValue(item.PrevQty)}</PrevQty>
          <AssetName>${this.safeValue(item.AssetName)}</AssetName>
          <AssetSeq>${this.safeValue(item.AssetSeq ?? 0)}</AssetSeq>
          <STDUnitName>${this.safeValue(item.STDUnitName)}</STDUnitName>
          <STDUnitSeq>${this.safeValue(item.STDUnitSeq)}</STDUnitSeq>
          <STDPrevQty>${this.safeValue(item.STDPrevQty)}</STDPrevQty>
          <FunctionWHSeq>${this.safeValue(item.FunctionWHSeq ?? 0)}</FunctionWHSeq>
          <ItemSeqOLD>${this.safeValue(item.ItemSeqOLD)}</ItemSeqOLD>
          <UnitSeqOLD>${this.safeValue(item.UnitSeqOLD)}</UnitSeqOLD>
          <WHSeqOLD>${this.safeValue(item.WHSeqOLD)}</WHSeqOLD>
          <FunctionWHSeqOLD>${this.safeValue(item.FunctionWHSeqOLD)}</FunctionWHSeqOLD>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <StkYM>${this.safeValue(item.StkYM)}</StkYM>
          <WHSeq>${this.safeValue(item.WHSeq)}</WHSeq>
          <BizUnit>${this.safeValue(item.BizUnit)}</BizUnit>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

}
