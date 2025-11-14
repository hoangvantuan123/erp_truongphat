import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlEqpInspectDetail {
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

  searchEquiptInspectDetail(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock1>
              <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <ToolSeq>${this.escapeXml(item.ToolSeq || 0)}</ToolSeq>
            </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getToolDetailMatByTermSerl(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <TermSerl>${this.escapeXml(item.TermSerl || 0)}</TermSerl>
            <ToolSeq>${this.escapeXml(item.ToolSeq || 0)}</ToolSeq>
          </DataBlock2>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getToolAssyQuery(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <ToolSeq>${this.escapeXml(item.ToolSeq || 0)}</ToolSeq>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getToolRepairQuery(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <ToolName>${this.escapeXml(item.ToolName || '')}</ToolName>
            <ToolNo>${this.escapeXml(item.ToolNo || '')}</ToolNo>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <UMToolKind>${this.escapeXml(item.UMToolKind || '')}</UMToolKind>
            <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getUserDefineQuery(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <ToolSeq>${this.escapeXml(item.ToolSeq || 0)}</ToolSeq>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkToolDetailInspect(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
         <DataBlock1>
          <WorkingTag>${item.WorkingTag}</WorkingTag>
          <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
          <DataSeq>${item.DataSeq || 1}</DataSeq>
          <Status>0</Status>
          <Selected>1</Selected>
          <InspectName>${this.escapeXml(item.InspectName || '')}</InspectName>
          <CustName>${this.escapeXml(item.CustName || '')}</CustName>
          <SMTermType>${item.SMTermType || 0}</SMTermType>
          <Term>${this.escapeXml(item.Term || '')}</Term>
          <TotShot>${this.escapeXml(item.TotShot || '')}</TotShot>
          <Remark>${this.escapeXml(item.Remark || '')}</Remark>
          <LastQCDate>${this.escapeXml(item.LastQCDate || '')}</LastQCDate>
          <NextQCDate>${this.escapeXml(item.NextQCDate || '')}</NextQCDate>
          <CustSeq>${item.CustSeq || 0}</CustSeq>
          <TermSerl>${item.TermSerl || 0}</TermSerl>
          <ToolSeq>${item.ToolSeq || 0}</ToolSeq>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
        </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkAssyTool(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${item.Status}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo) || 1}</IDX_NO>
            <DataSeq>${this.escapeXml(item.IdxNo) || 1}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <Serl>${this.escapeXml(item.IdxNo) || 1}</Serl>
            <ItemSeq>${this.escapeXml(item.ItemSeq || 0)}</ItemSeq>
            <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
          </DataBlock2>
          

          `,
      )
      .join(`  `);

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveToolDetailInspect(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${item.WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.DataSeq || 1}</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <ToolSeq>${item.ToolSeq || 0}</ToolSeq>
            <InspectName>${this.escapeXml(item.InspectName || '')}</InspectName>
            <LastQCDate xml:space="preserve">${this.escapeXml(item.LastQCDate || '')}</LastQCDate>
            <NextQCDate xml:space="preserve">${this.escapeXml(item.NextQCDate || '')}</NextQCDate>
            <CustSeq>${item.CustSeq || 0}</CustSeq>
            <CustName>${this.escapeXml(item.CustName || '')}</CustName>
            <TermSerl>${item.TermSerl || 0}</TermSerl>
            <Term>${this.escapeXml(item.Term || '')}</Term>
            <SMTermType>${item.SMTermType || 0}</SMTermType>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <TotShot>${this.escapeXml(item.TotShot || 0)}</TotShot>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveToolDetailMat(
    result: Array<{ [key: string]: any }>,
    dataTool: any,
  ) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${item.WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${index + 1 || 1}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <ToolSeq>${dataTool[0]?.ToolSeq || item.ToolSeq}</ToolSeq>
            <Serl>${item.Serl || 1}</Serl>
            <ItemSeq>${item.ItemSeq || 0}</ItemSeq>
            <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
            <UnitSeq>${item.UnitSeq || 0}</UnitSeq>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
            <NeedQtyNumerator>${item.NeedQtyNumerator || 0}</NeedQtyNumerator>
            <NeedQtyDenominator>${item.NeedQtyDenominator || 0}</NeedQtyDenominator>
            <PartPrice>${item.PartPrice || 0}</PartPrice>
            <PartAmt>${item.PartAmt || 0}</PartAmt>
            <TermSerl>${dataTool[0]?.TermSerl || item.TermSerl}</TermSerl>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
          </DataBlock2>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
