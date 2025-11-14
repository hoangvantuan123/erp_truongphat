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

  private escapeXml2(str: string): string {
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

  private convertToNumber(value: boolean | string | null | undefined): number {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    if (typeof value === 'string') {
      return value === '1' ? 1 : 0;
    }
    return 0;
  }

  private buildEscapedXmlList(
    codes: (string | number)[],
  ) {
    const rawXml = `<XmlString>${codes.map((code) => `<Code>${code}</Code>`).join('')}</XmlString>`;
    const escapedXml1 = this.escapeXml(rawXml);
    const escapedXml = this.escapeXml2(escapedXml1);
    return escapedXml;
  }

  searchInfoMonthPerCnt(result: Array<{ [key: string]: any }>) {
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
            <YM>${this.escapeXml(item.YM || '')}</YM>
            <GrpSort1>${this.escapeXml(item.GrpSort1 || '')}</GrpSort1>
            <GrpSort2>${this.escapeXml(item.GrpSort2 || '')}</GrpSort2>
            <EntRetType>${this.escapeXml(item.EntRetType || '')}</EntRetType>
            <chkOrg>${this.convertToNumber(item.chkOrg) || 0}</chkOrg>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  searchInfoEmpList(result: Array<{ [key: string]: any }>) {
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
            <PosSeq>${this.escapeXml(item.PosSeq || 0)}</PosSeq>
            <BaseDate>${this.escapeXml(item.BaseDate || '')}</BaseDate>
            <UMEmpType>${this.escapeXml(item.UMEmpType || '')}</UMEmpType>
            <SMIsOrd>${this.escapeXml(item.SMIsOrd || '')}</SMIsOrd>
            <EntRetType>${this.escapeXml(item.EntRetType || '')}</EntRetType>
            <SMIsForSeq>${this.escapeXml(item.SMIsForSeq || '')}</SMIsForSeq>
            <DeptSeq>${this.escapeXml(item.DeptSeq || 0)}</DeptSeq>
            <EmpSeq>${this.escapeXml(item.EmpSeq || 0)}</EmpSeq>
            <IsLowDept>${this.convertToNumber(item.IsLowDept || 0)}</IsLowDept>
            <IsPhotoView>${this.convertToNumber(item.IsPhotoView || 0)}</IsPhotoView>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  searchInfoMultiEmpList(result: Array<{ [key: string]: any }>) {
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
            <EmpNameFr>${this.escapeXml(item.EmpNameFr || '')}</EmpNameFr>
            <EmpNameTo>${this.escapeXml(item.EmpNameTo || '')}</EmpNameTo>
            <IsRetire>${this.convertToNumber(item.IsRetire || 0)}</IsRetire>
            <EntDateFr>${this.escapeXml(item.EntDateFr || '')}</EntDateFr>
            <EntDateTo>${this.escapeXml(item.EntDateTo || '')}</EntDateTo>
            <RetDateFr>${this.escapeXml(item.RetDateFr || '')}</RetDateFr>
            <RetDateTo>${this.escapeXml(item.RetDateTo || '')}</RetDateTo>
            <DeptLevel>${this.escapeXml(item.DeptLevel || '')}</DeptLevel>
            <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
            <MultiDeptSeq>${this.buildEscapedXmlList( item.MultiDeptSeq || '')}</MultiDeptSeq>
            <IsLowDept>${this.convertToNumber(item.IsLowDept || 0)}</IsLowDept>
            <Ps>${this.escapeXml(item.Ps ||'')}</Ps>
            <JpSeq>${this.escapeXml(item.JpSeq || '')}</JpSeq>
            <MultiJpSeq>${this.buildEscapedXmlList(item.MultiJpSeq || '')}</MultiJpSeq>
            <SMMoreLess>${this.escapeXml(item.SMMoreLess || '')}</SMMoreLess>
            <PgSeq>${this.escapeXml(item.PgSeq || '')}</PgSeq>
            <MultiPgSeq>${this.buildEscapedXmlList(item.MultiPgSeq || '')}</MultiPgSeq>
            <PuSeq>${this.escapeXml(item.PuSeq || '')}</PuSeq>
            <MultiPuSeq>${this.buildEscapedXmlList(item.MultiPuSeq || '')}</MultiPuSeq>
            <UMSchCareerSeq>${this.escapeXml(item.UMSchCareerSeq || '')}</UMSchCareerSeq>
            <MultiUMSchCareerSeq>${this.buildEscapedXmlList(item.MultiUMSchCareerSeq || '')}</MultiUMSchCareerSeq>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
