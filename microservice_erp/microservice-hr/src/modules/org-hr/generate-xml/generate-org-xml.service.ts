import { Injectable } from '@nestjs/common';
import { Index } from 'typeorm';


@Injectable()
export class GenerateXmlOrgService {
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

  searchBy(result: Array<{ [key: string]: any }>) {
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
            <OrgType>${this.escapeXml(item.OrgType || 1)}</OrgType>
            <BaseDate>${this.escapeXml(item.baseDate)}</BaseDate>
            <IsDisDate>${this.convertToNumber(item.isDisDate || 0)}</IsDisDate>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getDeptNew(result: Array<{ [key: string]: any }>) {
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
            <OrgType>${this.escapeXml(item.OrgType || 1)}</OrgType>
            <BaseDate>${this.escapeXml(item.BaseDate || 0)}</BaseDate>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getDeptHis(result: Array<{ [key: string]: any }>){
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
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getDeptCCtr(result: Array<{ [key: string]: any }>){
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
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <CCtrSeq>${this.escapeXml(item.CCtrSeq || 0)}</CCtrSeq>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async createOrUpdateOrgTree(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Selected>0</Selected>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <Seq>${this.escapeXml(item.Seq || 1)}</Seq>
            <ParentSeq>${this.escapeXml(item.ParentSeq || 0)}</ParentSeq>
            <NodeName>${this.escapeXml(item.NodeName || '')}</NodeName>
            <IsFile>${this.convertToNumber(item.IsFile || 0)}</IsFile>
            <NodeImg>${this.escapeXml(item.NodeImg || '')}</NodeImg>
            <Sort>${this.escapeXml(item.Sort || 0)}</Sort>
            <Level>${this.escapeXml(item.Level || 0)}</Level>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <OrgType>${this.escapeXml(item.OrgType || 1)}</OrgType>
            <BaseDate>${this.escapeXml(item.BaseDate || 0)}</BaseDate>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async createOrUpdateOrgDeptLast(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Selected>0</Selected>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <DeptSeq>${this.escapeXml(item.Seq || 1)}</DeptSeq>
            <OrgType>${this.escapeXml(item.OrgType || 1)}</OrgType>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkDeptHis(result: Array<{ [key: string]: any }>, deptSeq: any){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.status || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(item.IdxNo || 1)}</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <DeptSeq>${this.escapeXml(item.DeptSeq || deptSeq)}</DeptSeq>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
            <AbrDeptName>${this.escapeXml(item.AbrDeptName || '')}</AbrDeptName>
            <EngDeptName>${this.escapeXml(item.EngDeptName || '')}</EngDeptName>
            <AbrEngDeptName>${this.escapeXml(item.AbrEngDeptName || '')}</AbrEngDeptName>
            <BegDate>${this.escapeXml(item.BegDate || '')}</BegDate>
            <EndDate>${this.escapeXml(item.EndDate || '')}</EndDate>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveDeptHis(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(item.IdxNo || 1)}</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <Seq>${this.escapeXml(item.Seq || 1)}</Seq>
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
            <BegDate>${this.escapeXml(item.BegDate || '')}</BegDate>
            <EndDate>${this.escapeXml(item.EndDate || '')}</EndDate>
            <AbrDeptName>${this.escapeXml(item.AbrDeptName || '')}</AbrDeptName>
            <EngDeptName>${this.escapeXml(item.EngDeptName || '')}</EngDeptName>
            <AbrEngDeptName>${this.escapeXml(item.AbrEngDeptName || '')}</AbrEngDeptName>
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

  searchEmpOrgTreeBy(result: Array<{ [key: string]: any }>) {
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
            <OrgType>${this.escapeXml(item.OrgType || 1)}</OrgType>
            <BaseDate>${this.escapeXml(item.baseDate || '')}</BaseDate>
            <IsOut>${this.convertToNumber(item.IsOut || 0)}</IsOut>
            <IsWkDept>${this.convertToNumber(item.IsWkDept || 0)}</IsWkDept>
            <IsRetire>${this.convertToNumber(item.IsRetire || 0)}</IsRetire>
            <IsNotOne>${this.convertToNumber(item.IsNotOne || 0)}</IsNotOne>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getEmpByOrgDept(result: Array<{ [key: string]: any }>) {
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
            <OrgType>${this.escapeXml(item.OrgType || 1)}</OrgType>
            <BaseDate>${this.escapeXml(item.BaseDate)}</BaseDate>
            <IsLowDept>${this.convertToNumber(item.IsLowDept || 0)}</IsLowDept>
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <IsWkDept>${this.convertToNumber(item.IsWkDept || 0)}</IsWkDept>
            <IsRetire>${this.convertToNumber(item.IsRetire || 0)}</IsRetire>
            <IsNotOne>${this.convertToNumber(item.IsNotOne || 0)}</IsNotOne>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

}
