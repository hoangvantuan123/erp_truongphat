import { Injectable } from '@nestjs/common';
import { Index } from 'typeorm';


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

   searchBy(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Status>0</Status>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <QBegDate>${this.escapeXml(item.QBegDate || '')}</QBegDate>
            <QEndDate>${this.escapeXml(item.QEndDate || '')}</QEndDate>
            <SMDeptType>${this.escapeXml(item.SMDeptType || '')}</SMDeptType>
            <IsUse>${this.convertToNumber(item.IsUse) || ''}</IsUse>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
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

  async checkCreateOrUpdateDaDept(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.status || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(item.IdxNo || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <AbrDeptName>${this.escapeXml(item.AbrDeptName || '')}</AbrDeptName>
            <EngDeptName>${this.escapeXml(item.EngDeptName || '')}</EngDeptName>
            <AbrEngDeptName>${this.escapeXml(item.AbrEngDeptName || '')}</AbrEngDeptName>
            <BegDate>${this.escapeXml(item.BegDate || '')}</BegDate>
            <EndDate>${this.escapeXml(item.EndDate || '')}</EndDate>
            <CCtrSeq>${this.escapeXml(item.CCtrSeq || 0)}</CCtrSeq>
            <SMDeptType>${this.escapeXml(item.SMDeptType || '')}</SMDeptType>
            <SMDeptClass>${this.escapeXml(item.SMDeptClass || 0)}</SMDeptClass>
            <DeptPhone>${this.escapeXml(item.DeptPhone || '')}</DeptPhone>
            <DeptFax>${this.escapeXml(item.DeptFax || '')}</DeptFax>
            <TaxUnit>${this.escapeXml(item.TaxUnit || 0)}</TaxUnit>
            <AccUnit>${this.escapeXml(item.AccUnit || 0)}</AccUnit>
            <BizUnit>${this.escapeXml(item.BizUnit || 0)}</BizUnit>
            <SlipUnit>${this.escapeXml(item.SlipUnit || 0)}</SlipUnit>
            <FactUnit>${this.escapeXml(item.FactUnit || 0)}</FactUnit>
            <UMCostType>${this.escapeXml(item.UMCostType || '')}</UMCostType>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <DispSeq>${this.escapeXml(item.DispSeq || 0)}</DispSeq>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async createOrUpdateDaDept(result: Array<{ [key: string]: any }>){
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
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
            <AbrDeptName>${this.escapeXml(item.AbrDeptName || '')}</AbrDeptName>
            <EngDeptName>${this.escapeXml(item.EngDeptName || '')}</EngDeptName>
            <AbrEngDeptName>${this.escapeXml(item.AbrEngDeptName || '')}</AbrEngDeptName>
            <BegDate>${this.escapeXml(item.BegDate || '')}</BegDate>
            <EndDate>${this.escapeXml(item.EndDate || '')}</EndDate>
            <SMDeptType>${this.escapeXml(item.SMDeptType || '')}</SMDeptType>
            <SMDeptClass>${this.escapeXml(item.SMDeptClass || 0)}</SMDeptClass>
            <TaxUnit>${this.escapeXml(item.TaxUnit || 0)}</TaxUnit>
            <AccUnit>${this.escapeXml(item.AccUnit || 0)}</AccUnit>
            <BizUnit>${this.escapeXml(item.BizUnit || 0)}</BizUnit>
            <FactUnit>${this.escapeXml(item.FactUnit || 0)}</FactUnit>
            <SlipUnit>${this.escapeXml(item.SlipUnit || 0)}</SlipUnit>
            <DispSeq>${this.escapeXml(item.DispSeq || 0)}</DispSeq>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <CCtrSeq>${this.escapeXml(item.CCtrSeq || 0)}</CCtrSeq>
            <UMCostType>${this.escapeXml(item.UMCostType || '')}</UMCostType>
            <DeptPhone>${this.escapeXml(item.DeptPhone || '')}</DeptPhone>
            <DeptFax>${this.escapeXml(item.DeptFax || '')}</DeptFax>
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

}
