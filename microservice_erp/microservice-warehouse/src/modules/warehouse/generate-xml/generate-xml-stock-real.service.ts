import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlStockRealService {
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

  async generateXMLSLGWHStockRealOpenListQueryWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>${this.escapeXml(item.IsChangedMst || '')}</IsChangedMst>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <StkDate>${this.escapeXml(item.StkDate || '')}</StkDate>
    <StkDateTo>${this.escapeXml(item.StkDateTo || '')}</StkDateTo>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <StkMngNo>${this.escapeXml(item.StkMngNo || '')}</StkMngNo>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLStockRealOpenQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
       <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>${this.escapeXml(item.IsChangedMst || '')}</IsChangedMst>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <StkDate>${this.escapeXml(item.StkDate || '')}</StkDate>
    <StkDateTo>${this.escapeXml(item.StkDateTo || '')}</StkDateTo>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <StkMngNo>${this.escapeXml(item.StkMngNo || '')}</StkMngNo>
  </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSLGWHStockRealOpenQ(result: Array<{ [key: string]: any }>): string {
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
    <StkMngSeq>${item.StkMngSeq}</StkMngSeq>
  </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  async generateXMLSLGWHStockRealOpenResultListQueryWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>${this.escapeXml(item.IsChangedMst || '')}</IsChangedMst>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <StkDate>${this.escapeXml(item.StkDate || '')}</StkDate>
    <StkDateTo>${this.escapeXml(item.StkDateTo || '')}</StkDateTo>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <StkMngNo>${this.escapeXml(item.StkMngNo || '')}</StkMngNo>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockRealOpenItemQueryWEB(result: number) {
    const xmlBlocks = `
        <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <StkMngSeq>${result}</StkMngSeq>
  </DataBlock1>`

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockRealOpenQueryWEB(result: number) {
    const xmlBlocks = `
       <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <StkMngSeq>${result}</StkMngSeq>
  </DataBlock1>`

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockRealOpenDeleteWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>D</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <StkMngSeq>${this.escapeXml(item.StkMngSeq || '0')}</StkMngSeq>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockRealOpenCheckWEB(result: Array<{ [key: string]: any }>, workingTag: string): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <StkMngNo>${this.escapeXml(item.StkMngNo || '')}</StkMngNo>
    <StkMngSeq>${this.escapeXml(item.StkMngSeq || '0')}</StkMngSeq>
    <BizUnit>${this.escapeXml(item.BizUnit || '0')}</BizUnit>
    <StkDate>${this.escapeXml(item.StkDate || '')}</StkDate>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '0')}</EmpSeq>
    <WHSeq>${this.escapeXml(item.WHSeq || '0')}</WHSeq>
	<Remark>${this.escapeXml(item.Remark || '')}</Remark>
  <IsZeroQty>${this.escapeXml(item.IsZeroQty || '')}</IsZeroQty>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGGetWHStockQueryWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>${this.escapeXml(item.IsChangedMst || '0')}</IsChangedMst>
    <AssetSeq>${this.escapeXml(item.AssetSeq || '0')}</AssetSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <WHSeq>${this.escapeXml(item.WHSeq || '0')}</WHSeq>
    <StkDate>${this.escapeXml(item.StkDate || '')}</StkDate>
    <BizUnit>${this.escapeXml(item.BizUnit || '0')}</BizUnit>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockRealOpenSaveWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <StkMngSeq>${this.escapeXml(item.StkMngSeq || '0')}</StkMngSeq>
    <StkMngNo>${this.escapeXml(item.StkMngNo || '')}</StkMngNo>
    <StkDate>${this.escapeXml(item.StkDate || '')}</StkDate>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <IsZeroQty>${this.escapeXml(item.IsZeroQty || '')}</IsZeroQty>
	<Remark>${this.escapeXml(item.Remark || '')}</Remark>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockRealOpenItemSaveWEB(result: Array<{ [key: string]: any }>, workingTag: string): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${index + 1}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <StkMngSeq>${this.escapeXml(item.StkMngSeq || '0')}</StkMngSeq>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <MngGoodQty>${this.escapeXml(item.Qty || '0')}</MngGoodQty>
    <MngBadQty>0</MngBadQty>
    <MngInQty>0</MngInQty>
    <MngTotQty>${this.escapeXml(item.Qty || '0')}</MngTotQty>
    <MngUnitSeq>${this.escapeXml(item.UnitSeq || '0')}</MngUnitSeq>
    <StkMngSerl>0</StkMngSerl>
  </DataBlock2>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSStockRealQRCheckWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
	<InOutReqSeq>${this.escapeXml(item.StkMngSeq || '0')}</InOutReqSeq>
	<InOutReqItemSerl>${this.escapeXml(item.StkMngSerl || '0')}</InOutReqItemSerl>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '0')}</UnitSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <DateCode>${this.escapeXml(item.DateCode || '')}</DateCode>
    <ReelNo>${this.escapeXml(item.ReelNo || '')}</ReelNo>
    <Barcode>${this.escapeXml(item.Barcode || '')}</Barcode>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  async generateXMLSLGWHStockRealRegSaveWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${index + 1}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <MngUnitSeq>${this.escapeXml(item.UnitSeq || '0')}</MngUnitSeq>
    <MngGoodQty>${this.escapeXml(item.Qty || '0')}</MngGoodQty>
    <MngBadQty>0</MngBadQty>
    <MngInQty>0</MngInQty>
    <MngTotQty>${this.escapeXml(item.Qty || '0')}</MngTotQty>
    <RealGoodQty>${this.escapeXml(item.NotProgressQty || '0')}</RealGoodQty>
    <RealBadQty>0</RealBadQty>
    <DiffGoodQty>0</DiffGoodQty>
    <DiffBadQty>0</DiffBadQty>
    <StkMngSerl>${this.escapeXml(item.StkMngSerl || '0')}</StkMngSerl>
    <UMStockDiffTypeName>${this.escapeXml(item.Barcode || '')}</UMStockDiffTypeName>
    <UMStockDiffType>${this.escapeXml(item.StkMngItemSerl || '0')}</UMStockDiffType>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <StkMngSeq>${this.escapeXml(item.StkMngSeq || '0')}</StkMngSeq>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
  </DataBlock2>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  async generateXMLSLGWHStockRealRegDeleteWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
    <WorkingTag>D</WorkingTag>
    <IDX_NO>${index + 1}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <MngUnitSeq>${this.escapeXml(item.UnitSeq || '0')}</MngUnitSeq>
    <MngGoodQty>${this.escapeXml(item.Qty || '0')}</MngGoodQty>
    <MngBadQty>0</MngBadQty>
    <MngInQty>0</MngInQty>
    <MngTotQty>${this.escapeXml(item.Qty || '0')}</MngTotQty>
    <RealGoodQty>0</RealGoodQty>
    <RealBadQty>0</RealBadQty>
    <DiffGoodQty>0</DiffGoodQty>
    <DiffBadQty>0</DiffBadQty>
    <StkMngSerl>${this.escapeXml(item.StkMngSerl || '0')}</StkMngSerl>
    <UMStockDiffTypeName />
    <UMStockDiffType>${this.escapeXml(item.StkMngItemSerl || '0')}</UMStockDiffType>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <StkMngSeq>${this.escapeXml(item.StkMngSeq || '0')}</StkMngSeq>
    <Remark>${this.escapeXml(item.Barcode || '0')}</Remark>
  </DataBlock2>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockRealRegMasterDeleteWEB(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
    <WorkingTag>D</WorkingTag>
    <IDX_NO>${index + 1}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <StkMngSeq>${this.escapeXml(item.StkMngSeq || '0')}</StkMngSeq>
    <Remark></Remark>
  </DataBlock2>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

}