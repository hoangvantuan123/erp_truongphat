import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlEqpInspect {
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

   searchEquiptInspect(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getToolQuery(result: Array<{ [key: string]: any }>) {
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
            <ToolName>${this.escapeXml(item.ToolName || '')}</ToolName>
            <ToolNo>${this.escapeXml(item.ToolNo || '')}</ToolNo>
            <UMToolKind>${this.escapeXml(item.UMToolKind || '')}</UMToolKind>
            <EmpSeq>${this.escapeXml(item.EmpSeq || 0)}</EmpSeq>
          </DataBlock1>

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


  async checkCreateOrUpdatePdEqpInspect(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag || item.Status || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <InspectName>${this.escapeXml(item.InspectName || '')}</InspectName>
            <CustName>${this.escapeXml(item.CustName || '')}</CustName>
            <SMTermType>${this.escapeXml(item.SMTermType || 0)}</SMTermType>
            <Term>${this.escapeXml(item.Term || '')}</Term>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <LastQCDate>${this.escapeXml(item.LastQCDate || '')}</LastQCDate>
            <NextQCDate>${this.escapeXml(item.NextQCDate || '')}</NextQCDate>
            <CustSeq>${this.escapeXml(item.CustSeq || 0)}</CustSeq>
            <TermSerl>${this.escapeXml(item.TermSerl || 0)}</TermSerl>
            <ToolSeq>${this.escapeXml(item.ToolSeq || 0)}</ToolSeq>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkAssyTool(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${item.Status}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo) || 1 }</IDX_NO>
            <DataSeq>${this.escapeXml(item.IdxNo) || 1 }</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <Serl>${this.escapeXml(item.IdxNo) || 1 }</Serl>
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

  async saveEqpInspect(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(item.DataSeq || 1)}</DataSeq>
            <Selected>${this.escapeXml(item.Selected || 1)}</Selected>
            <Status>${this.escapeXml(item.Status || 0)}</Status>
            <ToolSeq>${this.escapeXml(item.ToolSeq || 0)}</ToolSeq>
            <InspectName>${this.escapeXml(item.InspectName || '')}</InspectName>
            <LastQCDate xml:space="preserve">${this.escapeXml(item.LastQCDate || '')}</LastQCDate>
            <NextQCDate xml:space="preserve">${this.escapeXml(item.NextQCDate || '')}</NextQCDate>
            <CustSeq>${this.escapeXml(item.CustSeq || 0)}</CustSeq>
            <CustName>${this.escapeXml(item.CustName || '')}</CustName>
            <TermSerl>${this.escapeXml(item.TermSerl || 0)}</TermSerl>
            <Term>${this.escapeXml(item.Term || '')}</Term>
            <SMTermType>${this.escapeXml(item.SMTermType || 0)}</SMTermType>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveAssyTool(result: Array<{ [key: string]: any }>){
    const xmlBlock2 = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${item.WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.DataSeq || 1}</DataSeq>
            <Selected>0</Selected>
            <Status>0</Status>
            <ToolSeq>${this.escapeXml(item.ToolSeq || 0)}</ToolSeq>
            <Serl>${this.escapeXml(item.Serl) || 1 }</Serl>
            <ItemSeq>${this.escapeXml(item.ItemSeq || 0)}</ItemSeq>
            <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
            <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
          </DataBlock2>
          
          `,
      )
      .join(`
          
        `);

        const xmlBlock1 = `
          <DataBlock1>
              <WorkingTag>${result[0]?.WorkingTagTool || 'U'}</WorkingTag>
              <IDX_NO>${result[0].IdxNo || result[0].IDX_NO}</IDX_NO>
              <DataSeq>${result[0].DataSeq || 1}</DataSeq>
              <Selected>1</Selected>
              <Status>0</Status>
              <ToolSeq>${this.escapeXml(result[0].ToolSeq || 0)}</ToolSeq>
            </DataBlock1>
        `;
      

    const xmlBlocks = `${xmlBlock2} ${xmlBlock1}`;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  async checkToolUserDefine(result: Array<{ [key: string]: any }>, ToolSeq: any){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${item?.WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.DataSeq || 1}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <MngSerl>${item.MngSerl || 0}</MngSerl>
            <MngName>${item.MngName || ''}</MngName>
            <MngValName>${item.MngValName || ''}</MngValName>
            <MngValSeq>${item.MngValSeq || 0}</MngValSeq>
            <CodeHelpParams />
            <Mask />
            <SMInputType>${item.SMInputType || ''}</SMInputType>
            <CodeHelpSeq>${item.CodeHelpSeq || 0}</CodeHelpSeq>
            <IsNON>${item.IsNON || 0}</IsNON>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <ToolSeq>${ToolSeq || item?.ToolSeq}</ToolSeq>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

    async saveToolUserDefine(result: Array<{ [key: string]: any }>){
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
            <MngSerl>${this.escapeXml(item.MngSerl || 0)}</MngSerl>
            <MngName>${this.escapeXml(item.MngName || '')}</MngName>
            <MngValName>${this.escapeXml(item.MngValName || '')}</MngValName>
            <MngValSeq>${this.escapeXml(item.MngValSeq || 0)}</MngValSeq>
            <CodeHelpParams />
            <Mask />
            <SMInputType>${this.escapeXml(item.SMInputType || '')}</SMInputType>
            <CodeHelpSeq>${this.escapeXml(item.CodeHelpSeq || 0)}</CodeHelpSeq>
            <IsNON>${this.escapeXml(item.IsNON || 0)}</IsNON>
            <ToolSeq>${this.escapeXml(item?.ToolSeq || 0)}</ToolSeq>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkOrgDeptCCtr(result: Array<{ [key: string]: any }>, deptSeq: any){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.status || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(item.IdxNo || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <Seq>${this.escapeXml(item.Seq || 0)}</Seq>
            <BegYm>${this.escapeXml(item.BegYm || '')}</BegYm>
            <EndYm>${this.escapeXml(item.EndYm || '')}</EndYm>
            <CCtrSeq>${this.escapeXml(item.CCtrSeq || 0)}</CCtrSeq>
            <CCtrName>${this.escapeXml(item.CCtrName || '')}</CCtrName>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <IsLast>${this.convertToNumber(item.IsLast || 0)}</IsLast>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <DeptSeq>${this.escapeXml(item.DeptSeq ||deptSeq)}</DeptSeq>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveOrgDeptCCtr(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(item.IdxNo || 1)}</DataSeq>
            <Selected>0</Selected>
            <Status>0</Status>
            <Seq>${this.escapeXml(item.Seq || 1)}</Seq>
            <DeptSeq>${this.escapeXml(item.DeptSeq)}</DeptSeq>
            <BegYm>${this.escapeXml(item.BegYm || '')}</BegYm>
            <EndYm>${this.escapeXml(item.EndYm || '')}</EndYm>
            <CCtrSeq>${this.escapeXml(item.CCtrSeq || 0)}</CCtrSeq>
            <CCtrName>${this.escapeXml(item.CCtrName || '')}</CCtrName>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <IsLast>${this.convertToNumber(item.IsLast || 0)}</IsLast>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

}
