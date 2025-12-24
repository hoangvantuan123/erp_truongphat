import { Injectable } from '@nestjs/common';
import { Index } from 'typeorm';

@Injectable()
export class GenerateXmlLaborContractService {
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

    searchLaborContract(result: Array<{ [key: string]: any }>) {
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
            <EmpSeq>${this.escapeXml(item.EmpSeq)}</EmpSeq>
            <ContractKind>${this.escapeXml(item.ContractKind)}</ContractKind>
            <FromDateQ>${this.escapeXml(item.FromDateQ)}</FromDateQ>
            <ToDateQ>${this.escapeXml(item.ToDateQ)}</ToDateQ>
          </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkHrAdmOrd(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock1>
              <WorkingTag>${this.escapeXml(item.status) || 'U'}</WorkingTag>
              <IDX_NO>${this.escapeXml(item.IdxNo) || ''}</IDX_NO>
              <DataSeq>${this.escapeXml(index + 1 ) || 1}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <OrdName>${this.escapeXml(item.OrdName) || ''}</OrdName>
              <IsPaid>${this.convertToNumber(item.IsPaid) || 0}</IsPaid>
              <IsExAvgPay>${this.convertToNumber(item.IsExAvgPay) || 0}</IsExAvgPay>
              <IsExWkTerm>${this.convertToNumber(item.IsExWkTerm) || 0}</IsExWkTerm>
              <DispSeq>${this.escapeXml(item.DispSeq) || 0}</DispSeq>
              <OrdSeq>${this.escapeXml(item.OrdSeq) || 0}</OrdSeq>
              <UMOrdTypeSeq>${this.escapeXml(item.UMOrdTypeSeq) || ''}</UMOrdTypeSeq>
              <SMOrdAppSeq>${this.escapeXml(item.SMOrdAppSeq) || ''}</SMOrdAppSeq>
              <UMWsSeq>${this.escapeXml(item.UMWsSeq) || ''}</UMWsSeq>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
            </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveLaborContract(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
              <DataBlock1>
                <WorkingTag>${this.escapeXml(item.status) || 'U'}</WorkingTag>
                <IDX_NO>${this.escapeXml(item.IdxNo) || ''}</IDX_NO>
                <DataSeq>${this.escapeXml(index + 1 ) || 1}</DataSeq>
                <Status>0</Status>
                <Selected>1</Selected>
                <EmpSeq>${this.escapeXml(item.EmpSeq) || ''}</EmpSeq>
                <ContractNo>${this.escapeXml(item.ContractNo) || ''}</ContractNo>
                <FromDate>${this.escapeXml(item.FromDate) || ''}</FromDate>
                <ToDate>${this.escapeXml(item.ToDate) || ''}</ToDate>
                <Remark>${this.escapeXml(item.Remark) || ''}</Remark>
                <ContractDate>${this.escapeXml(item.ContractDate) || ''}</ContractDate>
                <ContractKind>${this.escapeXml(item.ContractKind) || ''}</ContractKind>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
              </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  searchAdmMultiOrd(result: Array<{ [key: string]: any }>) {
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
            <FrOrdDate>${this.escapeXml(item?.FrOrdDate)}</FrOrdDate>
            <ToOrdDate>${this.escapeXml(item?.ToOrdDate)}</ToOrdDate>
            <DeptSeq>${this.escapeXml(item?.DeptSeq)}</DeptSeq>
            <PosSeq>${this.escapeXml(item?.PosSeq)}</PosSeq>
            <OrdSeq>${this.escapeXml(item?.OrdSeq)}</OrdSeq>
            <UMJpSeq>${this.escapeXml(item?.UMJpSeq)}</UMJpSeq>
            <EmpSeq>${this.escapeXml(item?.EmpSeq)}</EmpSeq>
            <IsLast>${this.convertToNumber(item?.IsLast)}</IsLast>
            <UMPgSeq>${this.escapeXml(item?.UMPgSeq)}</UMPgSeq>
            <UMJdSeq>${this.escapeXml(item?.UMJdSeq)}</UMJdSeq>
            <UMJoSeq>${this.escapeXml(item?.UMJoSeq)}</UMJoSeq>
            <EntRetTypeSeq>${this.escapeXml(item?.EntRetTypeSeq)}</EntRetTypeSeq>
            <PuSeq>${this.escapeXml(item?.PuSeq)}</PuSeq>
            <PtSeq>${this.escapeXml(item?.PtSeq)}</PtSeq>
            <UMWsSeq>${this.escapeXml(item?.UMWsSeq)}</UMWsSeq>
          </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

    searchAdmMultiOrdObj(result: Array<{ [key: string]: any }>) {
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
            <FrOrdDate>${this.escapeXml(item?.FrOrdDate)}</FrOrdDate>
            <ToOrdDate>${this.escapeXml(item?.ToOrdDate)}</ToOrdDate>
            <DeptSeq>${this.escapeXml(item?.DeptSeq)}</DeptSeq>
            <PosSeq>${this.escapeXml(item?.PosSeq)}</PosSeq>
            <OrdSeq>${this.escapeXml(item?.OrdSeq)}</OrdSeq>
            <UMJpSeq>${this.escapeXml(item?.UMJpSeq)}</UMJpSeq>
            <EmpSeq>${this.escapeXml(item?.EmpSeq)}</EmpSeq>
            <IsLast>${this.convertToNumber(item?.IsLast)}</IsLast>
            <UMPgSeq>${this.escapeXml(item?.UMPgSeq)}</UMPgSeq>
            <UMJdSeq>${this.escapeXml(item?.UMJdSeq)}</UMJdSeq>
            <UMJoSeq>${this.escapeXml(item?.UMJoSeq)}</UMJoSeq>
            <EntRetTypeSeq>${this.escapeXml(item?.EntRetTypeSeq)}</EntRetTypeSeq>
            <PuSeq>${this.escapeXml(item?.PuSeq)}</PuSeq>
            <PtSeq>${this.escapeXml(item?.PtSeq)}</PtSeq>
            <UMWsSeq>${this.escapeXml(item?.UMWsSeq)}</UMWsSeq>
          </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getAdmOrdByOrdDate(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <EmpSeq>${this.escapeXml(item?.EmpSeq)}</EmpSeq>
            <OrdDate>${this.escapeXml(item?.OrdDate)}</OrdDate>
            <OrdSeq>${this.escapeXml(item?.OrdSeq)}</OrdSeq>
            <DeptSeq>${this.escapeXml(item?.DeptSeq)}</DeptSeq>
            <PosSeq>${this.escapeXml(item?.PosSeq)}</PosSeq>
            <UMJpSeq>${this.escapeXml(item?.UMJpSeq)}</UMJpSeq>
            <UMPgSeq>${this.escapeXml(item?.UMPgSeq)}</UMPgSeq>
            <UMJdSeq>${this.escapeXml(item?.UMJdSeq)}</UMJdSeq>
            <UMJoSeq>${this.escapeXml(item?.UMJoSeq)}</UMJoSeq>
            <PuSeq>${this.escapeXml(item?.PuSeq)}</PuSeq>
            <PtSeq>${this.escapeXml(item?.PtSeq)}</PtSeq>
            <UMWsSeq>${this.escapeXml(item?.UMWsSeq)}</UMWsSeq>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveHrAdmMultiOrd(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.status) || 'A'}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo) || '1'}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1) || '1'}</DataSeq>
            <Status>${this.escapeXml(item.Status) || '0'}</Status>
            <Selected>${this.escapeXml(item.Selected) || '1'}</Selected>
            <IntSeq>${this.escapeXml(item.IntSeq) || '0'}</IntSeq>
            <EmpSeq>${this.escapeXml(item.EmpSeq) || '28150'}</EmpSeq>
            <OrdDate>${this.escapeXml(item.OrdDate) || '20250613'}</OrdDate>
            <OrdSeq>${this.escapeXml(item.OrdSeq) || '2'}</OrdSeq>
            <DeptSeq>${this.escapeXml(item.DeptSeq) || '329'}</DeptSeq>
            <PosSeq>${this.escapeXml(item.PosSeq) || '87'}</PosSeq>
            <UMJpSeq>${this.escapeXml(item.UMJpSeq) || '3052001'}</UMJpSeq>
            <Ps xml:space="preserve">${this.escapeXml(item.Ps) || '   '}</Ps>
            <UMPgSeq>${this.escapeXml(item.UMPgSeq) || '3051001'}</UMPgSeq>
            <UMJdSeq>${this.escapeXml(item.UMJdSeq) || '3053018'}</UMJdSeq>
            <UMJoSeq>${this.escapeXml(item.UMJoSeq) || '3003031'}</UMJoSeq>
            <JobSeq>${this.escapeXml(item.JobSeq) || '25'}</JobSeq>
            <PuSeq>${this.escapeXml(item.PuSeq) || '5'}</PuSeq>
            <PtSeq>${this.escapeXml(item.PtSeq) || '1'}</PtSeq>
            <UMWsSeq>${this.escapeXml(item.UMWsSeq) || '3001003'}</UMWsSeq>
            <IsBoss>${this.convertToNumber(item.IsBoss) || '0'}</IsBoss>
            <IsWkOrd>${this.convertToNumber(item.IsWkOrd) || '0'}</IsWkOrd>
            <WkDeptSeq>${this.escapeXml(item.WkDeptSeq) || '329'}</WkDeptSeq>
            <Contents>${this.escapeXml(item.Contents) || 'TEST'}</Contents>
            <Remark>${this.escapeXml(item.Remark) || 'TEST'}</Remark>
            <IsLast>${this.convertToNumber(item.IsLast) || '1'}</IsLast>
            <PrevEmpSeq>${this.escapeXml(item.PrevEmpSeq) || '18183'}</PrevEmpSeq>
            <TABLE_NAME>${this.escapeXml(item.TABLE_NAME) || 'DataBlock1'}</TABLE_NAME>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async synchHrAdmMultiOrd(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag) || 'A'}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo) || '1'}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1) || '1'}</DataSeq>
            <Selected>${this.escapeXml(item.Selected) || '1'}</Selected>
            <Status>${this.escapeXml(item.Status) || '0'}</Status>
            <IntSeq>${this.escapeXml(item.IntSeq) || '1'}</IntSeq>
            <EmpSeq>${this.escapeXml(item.EmpSeq) || ''}</EmpSeq>
            <OrdSeq>${this.escapeXml(item.OrdSeq) || ''}</OrdSeq>
            <OrdDate>${this.escapeXml(item.OrdDate) || ''}</OrdDate>
            <OrdEndDate>${this.escapeXml(item.OrdEndDate) || ''}</OrdEndDate>
            <DeptSeq>${this.escapeXml(item.DeptSeq) || ''}</DeptSeq>
            <WkDeptSeq>${this.escapeXml(item.WkDeptSeq) || ''}</WkDeptSeq>
            <PosSeq>${this.escapeXml(item.PosSeq) || ''}</PosSeq>
            <Ps xml:space="preserve">${this.escapeXml(item.Ps) || '   '}</Ps>
            <UMPgSeq>${this.escapeXml(item.UMPgSeq) || ''}</UMPgSeq>
            <UMJpSeq>${this.escapeXml(item.UMJpSeq) || ''}</UMJpSeq>
            <UMJdSeq>${this.escapeXml(item.UMJdSeq) || ''}</UMJdSeq>
            <UMJoSeq>${this.escapeXml(item.UMJoSeq) || ''}</UMJoSeq>
            <JobSeq>${this.escapeXml(item.JobSeq) || ''}</JobSeq>
            <PtSeq>${this.escapeXml(item.PtSeq) || ''}</PtSeq>
            <UMWsSeq>${this.escapeXml(item.UMWsSeq) || ''}</UMWsSeq>
            <PuSeq>${this.escapeXml(item.PuSeq) || ''}</PuSeq>
            <IsBoss>${this.convertToNumber(item.IsBoss) || '0'}</IsBoss>
            <Contents>${this.escapeXml(item.Contents) || ''}</Contents>
            <Remark>${this.escapeXml(item.Remark) || ''}</Remark>
            <IsOrdDateLast>${this.convertToNumber(item.IsOrdDateLast) || 0}</IsOrdDateLast>
            <IsLast>${this.convertToNumber(item.IsLast) || 0}</IsLast>
            <PrevEmpSeq>${this.escapeXml(item.PrevEmpSeq) || ''}</PrevEmpSeq>
            <RetireDate>${this.escapeXml(item.RetireDate) || ''}</RetireDate>
            <IsWkOrd>${this.convertToNumber(item.IsWkOrd) || 0}</IsWkOrd>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
