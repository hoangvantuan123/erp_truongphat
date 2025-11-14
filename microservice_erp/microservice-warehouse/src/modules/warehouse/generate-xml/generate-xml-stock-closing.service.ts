import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlStockClosingService {
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

  async generateXMLSLGReInOutStockQueryWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
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
    <IsChangedMst>0</IsChangedMst>
    <InOutYY>${this.escapeXml(item.InOutYY || '')}</InOutYY>
    </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGReInOutStockCheckWEB(
    result: Array<{ [key: string]: any }>,
    userSeq: number,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IdxNo || '1')}</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <InOutYM>${this.escapeXml(item.InOutYM || '')}</InOutYM>
    <SMInOutType>0</SMInOutType>
    <UserSeq>${userSeq}</UserSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGReInOutStockSumWEB(
    result: Array<{ [key: string]: any }>,
    userSeq: number,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IdxNo || '1')}</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <InOutYM>${this.escapeXml(item.InOutYM || '')}</InOutYM>
    <SMInOutType>0</SMInOutType>
    <UserSeq>${userSeq}</UserSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMClosingDateDynamicQueryWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
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
    <IsChangedMst>0</IsChangedMst>
    <ClosingYearMonth>${this.escapeXml(item.ClosingYearMonth || '')}</ClosingYearMonth>
    <UnitSeq>${this.escapeXml(item.BizUnit || '')}</UnitSeq>
    <DtlUnitSeq />
    <ClosingSeq>70</ClosingSeq>
    <SMUnitSeq>1032002</SMUnitSeq>
    <SMDtlUnitSeq>1032007</SMDtlUnitSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMClosingYMDynamicQueryWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
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
    <IsChangedMst>0</IsChangedMst>
    <ClosingYear>${this.escapeXml(item.ClosingYear || '')}</ClosingYear>
    <UnitSeq>${this.escapeXml(item.BizUnit || '')}</UnitSeq>
    <DtlUnitSeq />
    <ClosingSeq>69</ClosingSeq>
    <SMUnitSeq>1032002</SMUnitSeq>
    <SMDtlUnitSeq>1032007</SMDtlUnitSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMClosingDateCheckWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${index + 1}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ROW_IDX>${index + 1}</ROW_IDX>
    <ClosingDate>${this.escapeXml(item.ClosingDate || '')}</ClosingDate>
    <IsClose>${this.convertToNumber(item?.IsCloseMaterial)}</IsClose>
    <DtlUnitSeq>1</DtlUnitSeq>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <UnitSeq>${this.escapeXml(item.BizUnit || '')}</UnitSeq>
    <ClosingSeq>70</ClosingSeq>
  </DataBlock3>
  <DataBlock3>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${index + 2}</IDX_NO>
    <DataSeq>${index + 2}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ROW_IDX>${index + 2}</ROW_IDX>
    <ClosingDate>${this.escapeXml(item.ClosingDate || '')}</ClosingDate>
    <IsClose>${this.convertToNumber(item?.IsCloseItem)}</IsClose>
    <DtlUnitSeq>2</DtlUnitSeq>
    <UnitSeq>${this.escapeXml(item.BizUnit || '')}</UnitSeq>
    <ClosingSeq>70</ClosingSeq>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMClosingDateSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>${this.escapeXml(item.DataSeq || '')}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ROW_IDX>${this.escapeXml(item.ROW_IDX || '')}</ROW_IDX>
    <ClosingDate>${this.escapeXml(item.ClosingDate || '')}</ClosingDate>
    <IsClose>${this.escapeXml(item.IsClose || '')}</IsClose>
    <DtlUnitSeq>${this.escapeXml(item.DtlUnitSeq || '')}</DtlUnitSeq>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <ClosingSeq>70</ClosingSeq>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMClosingYMCheckWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${index + 1}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ROW_IDX>${index + 1}</ROW_IDX>
    <ClosingYM>${this.escapeXml(item.ClosingYM || '')}</ClosingYM>
    <IsClose>${this.convertToNumber(item?.IsCloseMaterial)}</IsClose>
    <DtlUnitSeq>1</DtlUnitSeq>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <UnitSeq>1</UnitSeq>
    <ClosingSeq>69</ClosingSeq>
  </DataBlock3>
  <DataBlock3>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${index + 2}</IDX_NO>
    <DataSeq>${index + 2}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ROW_IDX>${index + 2}</ROW_IDX>
    <ClosingYM>${this.escapeXml(item.ClosingYM || '')}</ClosingYM>
    <IsClose>${this.convertToNumber(item?.IsCloseItem)}</IsClose>
    <DtlUnitSeq>2</DtlUnitSeq>
    <UnitSeq>1</UnitSeq>
    <ClosingSeq>69</ClosingSeq>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMClosingYMSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>${this.escapeXml(item.DataSeq || '')}</DataSeq>
    <Selected>0</Selected>
    <Status>0</Status>
    <ROW_IDX>${this.escapeXml(item.ROW_IDX || '')}</ROW_IDX>
    <ClosingYM>${this.escapeXml(item.ClosingYM || '')}</ClosingYM>
    <ClosingSeq>69</ClosingSeq>
    <UnitSeq>1</UnitSeq>
    <DtlUnitSeq>${this.escapeXml(item.DtlUnitSeq || '')}</DtlUnitSeq>
    <IsClose>${this.escapeXml(item.IsClose || '')}</IsClose>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  //STOCK_YEAR_TRANS
  async generateXMLSLGStockNextCalcHistQueryWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
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
    <IsChangedMst>0</IsChangedMst>
    <BizUnit>${this.escapeXml(item.BizUnit || '0')}</BizUnit>
    <FromYY>${this.escapeXml(item.FromYY || '')}</FromYY>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGStockNextCalcCheckWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
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
    <IsChangedMst>0</IsChangedMst>
    <ToYY>${this.escapeXml(item.ToYY || '')}</ToYY>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <TransKind>${this.escapeXml(item.TransKind || '')}</TransKind>
    <FromYY>${this.escapeXml(item.FromYY || '')}</FromYY>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGStockNextCalcWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
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
    <IsChangedMst>0</IsChangedMst>
    <ToYY>${this.escapeXml(item.ToYY || '')}</ToYY>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <TransKind>${this.escapeXml(item.TransKind || '')}</TransKind>
    <FromYY>${this.escapeXml(item.FromYY || '')}</FromYY>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGStockNextCalcHistSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
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
    <IsChangedMst>0</IsChangedMst>
    <ToYY>${this.escapeXml(item.ToYY || '')}</ToYY>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <TransKind>${this.escapeXml(item.TransKind || '')}</TransKind>
    <FromYY>${this.escapeXml(item.FromYY || '')}</FromYY>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
