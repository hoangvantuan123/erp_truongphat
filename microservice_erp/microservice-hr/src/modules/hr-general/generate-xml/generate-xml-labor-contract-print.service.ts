import { Injectable } from '@nestjs/common';
import { Index } from 'typeorm';

@Injectable()
export class GenerateXmlLaborContractPrintService {
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

    searchLaborContractPrint(result: Array<{ [key: string]: any }>) {
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
            <DeptSeq>${this.escapeXml(item.DeptSeq)}</DeptSeq>
            <BeginDate>${this.escapeXml(item.BeginDate)}</BeginDate>
            <EndDate>${this.escapeXml(item.EndDate)}</EndDate>
            <EmpType>${this.escapeXml(item.EmpType)}</EmpType>
          </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  searchCertificateIssue(result: Array<{ [key: string]: any }>) {
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
            <IsAgree>${this.convertToNumber(item.IsAgree)}</IsAgree>
            <SMCertiType>${this.escapeXml(item.SMCertiType)}</SMCertiType>
            <FrApplyDate>${this.escapeXml(item.FrApplyDate)}</FrApplyDate>
            <ToApplyDate>${this.escapeXml(item.ToApplyDate)}</ToApplyDate>
            <DeptSeq>${this.escapeXml(item.DeptSeq)}</DeptSeq>
            <EmpSeq>${this.escapeXml(item.EmpSeq)}</EmpSeq>
            <IsPrt>${this.convertToNumber(item.IsPrt) || 0}</IsPrt>
          </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

    async checkBasCertificate(result: Array<{ [key: string]: any }>) {

      console.log('checkBasCertificate', result);
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock1>
              <WorkingTag>${item.status}</WorkingTag>
              <IDX_NO>${item.IdxNo}</IDX_NO>
              <DataSeq>${index + 1 || 1}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <CertiSeq>${this.escapeXml(item.CertiSeq)}</CertiSeq>
              <ApplyDate>${this.escapeXml(item.ApplyDate)}</ApplyDate>
              <IssueDate>${this.escapeXml(item.IssueDate)}</IssueDate>
              <EmpSeq>${this.escapeXml(item.EmpSeq)}</EmpSeq>
              <RetireDate>${this.escapeXml(item.RetireDate)}</RetireDate>
              <ResidIDMYN>${this.escapeXml(item.ResidIDMYN) || 0}</ResidIDMYN>
              <JobName>${this.escapeXml(item.JobName)}</JobName>
              <JobSeq>${this.escapeXml(item.JobSeq)}</JobSeq>
              <CertiCnt>${this.escapeXml(item.CertiCnt) || 0}</CertiCnt>
              <CertiDecCnt>${this.escapeXml(item.CertiDecCnt) || 0}</CertiDecCnt>
              <CertiUseage>${this.escapeXml(item.CertiUseage)}</CertiUseage>
              <CertiSubmit>${this.escapeXml(item.CertiSubmit) || 0}</CertiSubmit>
              <TaxFrYm>${this.escapeXml(item.TaxFrYm)}</TaxFrYm>
              <TaxToYm>${this.escapeXml(item.TaxToYm)}</TaxToYm>
              <TaxEmpName>${this.escapeXml(item.TaxEmpName)}</TaxEmpName>
              <IsAgree>${this.convertToNumber(item.IsAgree) || 0}</IsAgree>
              <IssueNo>${this.escapeXml(item.IssueNo)}</IssueNo>
              <IsPrt>${this.convertToNumber(item.IsPrt) || 0}</IsPrt>
              <IssueEmpSeq>${this.escapeXml(item.IssueEmpSeq)}</IssueEmpSeq>
              <IsNoIssue>${this.convertToNumber(item.IsNoIssue) || 0}</IsNoIssue>
              <NoIssueReason>${this.escapeXml(item.NoIssueReason)}</NoIssueReason>
              <IsEmpApp>${this.convertToNumber(item.IsEmpApp) || 0}</IsEmpApp>
              <SMCertiType>${this.escapeXml(item.SMCertiType)}</SMCertiType>
              <TypeSeq>${this.escapeXml(item.TypeSeq) || 0}</TypeSeq>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
            </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

    async auBasCertificate(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock1>
              <WorkingTag>${item.WorkingTag}</WorkingTag>
              <IDX_NO>${item.IDX_NO}</IDX_NO>
              <DataSeq>${item.DataSeq}</DataSeq>
              <Selected>1</Selected>
              <Status>0</Status>
              <CertiSeq>${this.escapeXml(item.CertiSeq)}</CertiSeq>
              <EmpSeq>${this.escapeXml(item.EmpSeq)}</EmpSeq>
              <SMCertiType>${this.escapeXml(item.SMCertiType)}</SMCertiType>
              <ApplyDate>${this.escapeXml(item.ApplyDate)}</ApplyDate>
              <CertiCnt>${this.escapeXml(item.CertiCnt)}</CertiCnt>
              <CertiDecCnt>${this.escapeXml(item.CertiDecCnt)}</CertiDecCnt>
              <CertiUseage>${this.escapeXml(item.CertiUseage)}</CertiUseage>
              <CertiSubmit>${this.escapeXml(item.CertiSubmit)}</CertiSubmit>
              <JobName>${this.escapeXml(item.JobName)}</JobName>
              <JobSeq>${this.escapeXml(item.JobSeq) || 0}</JobSeq>
              <IsAgree>${this.convertToNumber(item.IsAgree) || 0}</IsAgree>
              <IsPrt>${this.convertToNumber(item.IsPrt) || 0}</IsPrt>
              <IssueDate>${this.escapeXml(item.IssueDate)}</IssueDate>
              <IssueNo>${this.escapeXml(item.IssueNo)}</IssueNo>
              <IssueEmpSeq>${this.escapeXml(item.IssueEmpSeq)}</IssueEmpSeq>
              <IsNoIssue>${this.convertToNumber(item.IsNoIssue) || 0}</IsNoIssue>
              <NoIssueReason>${this.escapeXml(item.NoIssueReason)}</NoIssueReason>
              <IsEmpApp>${this.convertToNumber(item.IsEmpApp) || 0}</IsEmpApp>
              <ResidIDMYN>${this.convertToNumber(item.ResidIDMYN) || 0}</ResidIDMYN>
              <TypeSeq>${this.escapeXml(item.TypeSeq) || 0}</TypeSeq>
              <TaxFrYm xml:space="preserve">${this.escapeXml(item.TaxFrYm)}</TaxFrYm>
              <TaxToYm xml:space="preserve">${this.escapeXml(item.TaxToYm)}</TaxToYm>
              <TaxEmpName />
            </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


   async confirmDelete(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
              <DataBlock1>
                <WorkingTag>D</WorkingTag>
                <IDX_NO>${item.IDX_NO}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <CfmSerl>2</CfmSerl>
                <CfmSeq>${item.EmpSeq}</CfmSeq>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                <TableName>_THRBasCertificate</TableName>
              </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

    searchCertificateIssueList(result: Array<{ [key: string]: any }>) {
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
            <FrIssueDate>${this.escapeXml(item.FrIssueDate)}</FrIssueDate>
            <ToIssueDate>${this.escapeXml(item.ToIssueDate)}</ToIssueDate>
            <SMCertiType>${this.escapeXml(item.SMCertiType)}</SMCertiType>
            <EmpSeq>${this.escapeXml(item.EmpSeq)}</EmpSeq>
            <IsAgree>${this.convertToNumber(item.IsAgree)}</IsAgree>
            <IsPrt>${this.convertToNumber(item.IsPrt) || 0}</IsPrt>
          </DataBlock1>

          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
