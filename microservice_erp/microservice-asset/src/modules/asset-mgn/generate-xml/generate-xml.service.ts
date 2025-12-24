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

   searchAssetEquipt(result: Array<{ [key: string]: any }>) {
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
            <IsChangedMst>1</IsChangedMst>
            <ToolName>${this.escapeXml(item.ToolName || '')}</ToolName>
            <ToolNo>${this.escapeXml(item.ToolNo || '')}</ToolNo>
            <UMToolKind>${this.escapeXml(item.UMToolKind || '')}</UMToolKind>
            <PUCustSeq>${this.escapeXml(item.PUCustSeq || 0)}</PUCustSeq>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <SMStatus>${this.escapeXml(item.SMStatus || '')}</SMStatus>
            <EmpSeq>${this.escapeXml(item.EmpSeq || 0)}</EmpSeq>
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <InstallArea>${this.escapeXml(item.InstallArea || '')}</InstallArea>
            <AssetName>${this.escapeXml(item.AssetName || '')}</AssetName>
            <AssetNo>${this.escapeXml(item.AssetNo || '')}</AssetNo>
          </DataBlock1>

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


  async checkCreateOrUpdatePdEquip(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${item.WorkingTag}</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>1</IsChangedMst>
            <ToolSeq>${this.escapeXml(item?.ToolSeq || 0)}</ToolSeq>
            <AsstNo>${this.escapeXml(item.AsstNo || '')}</AsstNo>
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
            <InstallArea>${this.escapeXml(item.InstallArea || '')}</InstallArea>
            <MoveEmpName>${this.escapeXml(item.MoveEmpName || '')}</MoveEmpName>
            <ToolName>${this.escapeXml(item.ToolName || '')}</ToolName>
            <ToolNo>${this.escapeXml(item.ToolNo || '')}</ToolNo>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <SMStatus>${this.escapeXml(item.SMStatus || 0)}</SMStatus>
            <UMToolKind>${this.escapeXml(item.UMToolKind || 0)}</UMToolKind>
            <EmpSeq>${this.escapeXml(item.EmpSeq || 0)}</EmpSeq>
            <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
            <AssetSeq>${this.escapeXml(item.AssetSeq || 0)}</AssetSeq>
            <AsstName>${this.escapeXml(item.AsstName || '')}</AsstName>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <PUCustSeq>${this.escapeXml(item.PUCustSeq || 0)}</PUCustSeq>
            <PUCustName>${this.escapeXml(item.PUCustName || '')}</PUCustName>
            <SerialNo>${this.escapeXml(item.SerialNo || '')}</SerialNo>
            <BuyDate>${this.escapeXml(item.BuyDate || '')}</BuyDate>
            <Uses>${this.escapeXml(item.Uses || '')}</Uses>
            <BuyCost>${this.escapeXml(item.BuyCost || 0)}</BuyCost>
            <Forms>${this.escapeXml(item.Forms || '')}</Forms>
            <Capacity>${this.escapeXml(item.Capacity || '')}</Capacity>
            <ASTelNo>${this.escapeXml(item.ASTelNo || '')}</ASTelNo>
            <NationSeq>${this.escapeXml(item.NationSeq || 0)}</NationSeq>
            <ManuCompnay>${this.escapeXml(item.ManuCompnay || '')}</ManuCompnay>
            <TotalShot>${this.escapeXml(item.TotalShot || '')}</TotalShot>
            <Cavity>${this.escapeXml(item.Cavity || '')}</Cavity>
            <MoldCount>${this.escapeXml(item.MoldCount || '')}</MoldCount>
            <DesignShot>${this.escapeXml(item.DesignShot || '')}</DesignShot>
            <OrderCustSeq>${this.escapeXml(item.OrderCustSeq || 0)}</OrderCustSeq>
            <InitialShot>${this.escapeXml(item.InitialShot || '')}</InitialShot>
            <CustShareRate>${this.escapeXml(item.CustShareRate || 0)}</CustShareRate>
            <WorkShot>${this.escapeXml(item.WorkShot || '')}</WorkShot>
            <ProdSrtDate>${this.escapeXml(item.ProdSrtDate || '')}</ProdSrtDate>
            <DisuseDate>${this.escapeXml(item.DisuseDate || '')}</DisuseDate>
            <ModifyShot>${this.escapeXml(item.ModifyShot || '')}</ModifyShot>
            <DisuseCustSeq>${this.escapeXml(item.DisuseCustSeq || 0)}</DisuseCustSeq>
            <ModifyDate>${this.escapeXml(item.ModifyDate || '')}</ModifyDate>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkAssyTool(result: Array<{ [key: string]: any }>, ToolSeq: any){
    const xmlBlocks2 = result
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
            <ToolSeq>${this.escapeXml(ToolSeq)}</ToolSeq>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
          </DataBlock2>
          

          `,
      )
      .join(`  `);

        const xmlBlock1 = `
         <DataBlock1>
            <WorkingTag>${result[0]?.WorkingTag || 'U'}</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>1</IsChangedMst>
            <ToolSeq>${this.escapeXml(ToolSeq)}</ToolSeq>
          </DataBlock1>

        `

    const xmlBlocks = `${xmlBlocks2} ${xmlBlock1}`

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveTool(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${item.WorkingTag}</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <ToolSeq>${this.escapeXml(item.ToolSeq || 0)}</ToolSeq>
            <ToolName>${this.escapeXml(item.ToolName || '')}</ToolName>
            <ToolNo>${this.escapeXml(item.ToolNo || '')}</ToolNo>
            <UMToolKind>${this.escapeXml(item.UMToolKind || 0)}</UMToolKind>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <Capacity>${this.escapeXml(item.Capacity || '')}</Capacity>
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <EmpSeq>${this.escapeXml(item.EmpSeq || 0)}</EmpSeq>
            <BuyDate>${this.escapeXml(item.BuyDate || '')}</BuyDate>
            <BuyCost>${this.escapeXml(item.BuyCost || 0)}</BuyCost>
            <SMStatus>${this.escapeXml(item.SMStatus || 0)}</SMStatus>
            <Cavity>${this.escapeXml(item.Cavity || 0)}</Cavity>
            <DesignShot>${this.escapeXml(item.DesignShot || 0)}</DesignShot>
            <InitialShot>${this.escapeXml(item.InitialShot || 0)}</InitialShot>
            <WorkShot>${this.escapeXml(item.WorkShot || 0)}</WorkShot>
            <TotalShot>${this.escapeXml(item.TotalShot || 0)}</TotalShot>
            <AsstNo>${this.escapeXml(item.AsstNo || '')}</AsstNo>
            <AsstName>${this.escapeXml(item.AsstName || '')}</AsstName>
            <AssetSeq>${this.escapeXml(item.AssetSeq || 0)}</AssetSeq>
            <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
            <PUCustSeq>${this.escapeXml(item.PUCustSeq || 0)}</PUCustSeq>
            <PUCustName>${this.escapeXml(item.PUCustName || '')}</PUCustName>
            <InstallArea>${this.escapeXml(item.InstallArea || '')}</InstallArea>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <Uses>${this.escapeXml(item.Uses || '')}</Uses>
            <Forms>${this.escapeXml(item.Forms || '')}</Forms>
            <SerialNo>${this.escapeXml(item.SerialNo || '')}</SerialNo>
            <NationSeq>${this.escapeXml(item.NationSeq || 0)}</NationSeq>
            <ManuCompnay>${this.escapeXml(item.ManuCompnay || '')}</ManuCompnay>
            <MoldCount>${this.escapeXml(item.MoldCount || 0)}</MoldCount>
            <OrderCustSeq>${this.escapeXml(item.OrderCustSeq || 0)}</OrderCustSeq>
            <CustShareRate>${this.escapeXml(item.CustShareRate || 0)}</CustShareRate>
            <ModifyShot>${this.escapeXml(item.ModifyShot || 0)}</ModifyShot>
            <ModifyDate xml:space="preserve">${this.escapeXml(item.ModifyDate || '')}</ModifyDate>
            <DisuseDate xml:space="preserve">${this.escapeXml(item.DisuseDate || '')}</DisuseDate>
            <DisuseCustSeq>${this.escapeXml(item.DisuseCustSeq || 0)}</DisuseCustSeq>
            <ProdSrtDate xml:space="preserve">${this.escapeXml(item.ProdSrtDate || '')}</ProdSrtDate>
            <ASTelNo>${this.escapeXml(item.ASTelNo || '')}</ASTelNo>
            <MoveEmpName>${this.escapeXml(item.MoveEmpName || '')}</MoveEmpName>
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
