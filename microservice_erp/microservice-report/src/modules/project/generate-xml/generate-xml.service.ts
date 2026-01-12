
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
  parseTo01(value: any): string {
    const normalized = String(value).trim().toLowerCase();
    return normalized === "1" || normalized === "true" ? "1" : "0";
  }
  private safeValue(value: any): string {
    return this.escapeXml(value ?? '');
  }

  generateXMLProjectMgmtAUD(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map((item) => `
        
                <DataBlock1>
                    <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
        
                    <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
                    <DataSeq>${this.safeValue(item.IdxNo || item.IDX_NO)}</DataSeq>
        
                    <Status>0</Status>
                    <Selected>1</Selected>
                    <TABLE_NAME>DataBlock1</TABLE_NAME>
        
                    <IsChangedMst>${this.safeValue(item.IsChangedMst ?? 0)}</IsChangedMst>
        
                    <SupplyContSeq>${this.safeValue(item.SupplyContSeq ?? 0)}</SupplyContSeq>
                    <SupplyContNo>${this.safeValue(item.SupplyContNo ?? '')}</SupplyContNo>
                    <SupplyContAppSeq>${this.safeValue(item.SupplyContAppSeq ?? 0)}</SupplyContAppSeq>
        
                    <SMSupplyAdjType>${this.safeValue(item.SMSupplyAdjType ?? '')}</SMSupplyAdjType>
                    <SupplyContRev>${this.safeValue(item.SupplyContRev ?? '')}</SupplyContRev>
                    <SupplyContRevSeq>${this.safeValue(item.SupplyContRevSeq ?? '')}</SupplyContRevSeq>
        
                    <SupplyContName>${this.safeValue(item.SupplyContName ?? '')}</SupplyContName>
                    <BizUnit>${this.safeValue(item.BizUnit ?? '')}</BizUnit>
        
                    <SupplyContDateFr>${this.safeValue(item.SupplyContDateFr ?? '')}</SupplyContDateFr>
                    <SupplyContDateTo>${this.safeValue(item.SupplyContDateTo ?? '')}</SupplyContDateTo>
                    <SupplyContCustSeq>${this.safeValue(item.SupplyContCustSeq ?? '')}</SupplyContCustSeq>
        
                    <RegDate>${this.safeValue(item.RegDate ?? '')}</RegDate>
        
                    <UMSupplyContType>${this.safeValue(item.UMSupplyContType ?? '')}</UMSupplyContType>
                    <SupplyContEmpSeq>${this.safeValue(item.SupplyContEmpSeq ?? '')}</SupplyContEmpSeq>
                    <SupplyContDeptSeq>${this.safeValue(item.SupplyContDeptSeq ?? '')}</SupplyContDeptSeq>
        
                    <CurrSeq>${this.safeValue(item.CurrSeq ?? '')}</CurrSeq>
                    <CurrRate>${this.safeValue(item.CurrRate ?? '')}</CurrRate>
        
                    <SMSupplyChkType>${this.safeValue(item.SMSupplyChkType ?? '')}</SMSupplyChkType>
        
                    <Remark>${this.safeValue(item.Remark ?? '')}</Remark>
                    <FileSeq>${this.safeValue(item.FileSeq ?? 0)}</FileSeq>
                </DataBlock1>
                `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSupplyContractResAUD(
    result: Array<{ [key: string]: any }>,
    SupplyContSeq: any
  ): string {
    const xmlBlocks = result
      .map((item) => {
        // Xử lý SMResrcType: nếu có giá trị khác 0 thì dùng giá trị đó, nếu 0 hoặc undefined thì dùng 0
        const isStd = Number(item.ISStd || 0); // chuyển ISStd về số, mặc định 0
        const smResrcType = isStd === 1 ? 7005004 : 0;

        return `
            <DataBlock1>
                <WorkingTag>${this.safeValue(item.WorkingTag ?? item.Status)}</WorkingTag>
                <IDX_NO>${this.safeValue(item.IdxNo ?? item.IDX_NO ?? 0)}</IDX_NO>
                <DataSeq>${this.safeValue(item.IdxNo ?? item.IDX_NO ?? 0)}</DataSeq>
                <Status>0</Status>
                <Selected>${this.safeValue(item.Selected ?? 0)}</Selected>
                <ResrcSerl>${this.safeValue(item.IdxNo || item.ResrcSerl)}</ResrcSerl>
                <ISStd>${this.safeValue(item.ISStd || 0)}</ISStd>
                <ResrcName>${this.safeValue(item.ResrcName ?? '')}</ResrcName>
                <ResrcSeq>${this.safeValue(item.ResrcSeq || 0)}</ResrcSeq>
                <Qty>${this.safeValue(item.Qty || 0)}</Qty>
                <Price>${this.safeValue(item.Price || 0)}</Price>
                <Amt>${this.safeValue(item.Amt || 0)}</Amt>
                <VATAmt>${this.safeValue(item.VATAmt || 0)}</VATAmt>
                <SumAmt>${this.safeValue(item.SumAmt || 0)}</SumAmt>
                <DomPrice>${this.safeValue(item.DomPrice || 0)}</DomPrice>
                <PriceUnitSeq>${this.safeValue(item.PriceUnitSeq || 0)}</PriceUnitSeq>
                <SMResrcType>${smResrcType}</SMResrcType>
                <DomAmt>${this.safeValue(item.DomAmt || 1)}</DomAmt>
                <DomVATAmt>${this.safeValue(item.DomVATAmt || 0)}</DomVATAmt>
                <DomSumAmt>${this.safeValue(item.DomSumAmt || 0)}</DomSumAmt>
                <DelvDueDate>${this.safeValue(item.DelvDueDate ?? '')}</DelvDueDate>
                <SerialNo>${this.safeValue(item.SerialNo ?? '')}</SerialNo>
                <UMContSupplyType>${this.safeValue(item.UMContSupplyType ?? '')}</UMContSupplyType>
                <PJTSeq>${this.safeValue(item.PJTSeq || 0)}</PJTSeq>
                <WBSSeq>${this.safeValue(item.WBSSeq || 0)}</WBSSeq>
                <Remark>${this.safeValue(item.Remark ?? '')}</Remark>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                <SupplyContSeq>${this.safeValue(SupplyContSeq || 0)}</SupplyContSeq>
            </DataBlock1>
          `;
      })
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSupplyContractRemarkAUD(result: Array<{ [key: string]: any }>, SupplyContSeq: any): string {
    const xmlBlocks = result
      .map((item) => `
         <DataBlock1>
 <WorkingTag>${this.safeValue(item.Status ?? 'A')}</WorkingTag>
            <IDX_NO>${this.safeValue(item.IdxNo ?? item.IDX_NO ?? 0)}</IDX_NO>
            <DataSeq>${this.safeValue(item.IdxNo ?? item.IDX_NO ?? 0)}</DataSeq>
            <Status>0</Status>
    <Selected>1</Selected>
    <RemarkSerl>${this.safeValue(item.RemarkSerl ?? item.IdxNo ?? 0)}</RemarkSerl>
    <RemarkDate>${this.safeValue(item.RemarkDate || 0)}</RemarkDate>
    <Remark>${this.safeValue(item.Remark || 0)}</Remark>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
     <SupplyContSeq>${this.safeValue(SupplyContSeq || 0)}</SupplyContSeq>
  </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSPJTSupplyContractQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>U</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <SupplyContSeq>${this.safeValue(item.SupplyContSeq)}</SupplyContSeq>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSPJTSupplyContractResQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>U</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <SupplyContSeq>${this.safeValue(item.SupplyContSeq)}</SupplyContSeq>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPJTSupplyContractAmtListQ(result: Array<{ [key: string]: any }>): string {
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
              <BizUnit>${this.safeValue(item.BizUnit)} </BizUnit>
              <QryFrDate>${this.safeValue(item.QryFrDate)}</QryFrDate>
              <QryToDate>${this.safeValue(item.QryToDate)}</QryToDate>
              <SupplyContName>${this.safeValue(item.SupplyContName)}</SupplyContName>
              <SupplyContNo> ${this.safeValue(item.SupplyContNo)}</SupplyContNo>
              <SupplyContCustSeq>${this.safeValue(item.SupplyContCustSeq)} </SupplyContCustSeq>
              <UMSupplyContType> ${this.safeValue(item.UMSupplyContType)}</UMSupplyContType>
              <SupplyContDeptSeq>${this.safeValue(item.SupplyContDeptSeq)} </SupplyContDeptSeq>
              <SupplyContEmpSeq>${this.safeValue(item.SupplyContEmpSeq)} </SupplyContEmpSeq>
              <ResrcName> ${this.safeValue(item.ResrcName)}</ResrcName>
              <SMSupplyChkType> ${this.safeValue(item.SMSupplyChkType)}</SMSupplyChkType>
              <PJTSeq>${this.safeValue(item.PJTSeq)} </PJTSeq>
              <PJTName> ${this.safeValue(item.PJTName)}</PJTName>
              <SMProgress> ${this.safeValue(item.SMProgress)}</SMProgress>
              <PJTNo>${this.safeValue(item.PJTNo)} </PJTNo>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSPJTSupplyContractRemarkQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>U</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <SupplyContSeq>${this.safeValue(item.SupplyContSeq)}</SupplyContSeq>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPJTSupplyContractListQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
         <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>1</IsChangedMst>
            <BizUnit>${this.safeValue(item.BizUnit)}</BizUnit>
            <QryFrDate>${this.safeValue(item.QryFrDate)}</QryFrDate>
            <QryToDate>${this.safeValue(item.QryToDate)}</QryToDate>
            <SupplyContName> ${this.safeValue(item.SupplyContName)}</SupplyContName>
            <SupplyContNo> ${this.safeValue(item.SupplyContNo)}</SupplyContNo>
            <SupplyContCustSeq>${this.safeValue(item.SupplyContCustSeq)} </SupplyContCustSeq>
            <UMSupplyContType> ${this.safeValue(item.SupUMSupplyContTypeplyContSeq)}</UMSupplyContType>
            <SupplyContDeptSeq>${this.safeValue(item.SupplyContDeptSeq)} </SupplyContDeptSeq>
            <SupplyContEmpSeq>${this.safeValue(item.SupplyContEmpSeq)} </SupplyContEmpSeq>
            <ResrcName> ${this.safeValue(item.ResrcName)}</ResrcName>
            <SMSupplyChkType>${this.safeValue(item.SMSupplyChkType)} </SMSupplyChkType>
            <PJTSeq>${this.safeValue(item.PJTSeq)} </PJTSeq>
            <PJTName>${this.safeValue(item.PJTName)} </PJTName>
            <SMProgress />
    <PJTNo />
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

}
