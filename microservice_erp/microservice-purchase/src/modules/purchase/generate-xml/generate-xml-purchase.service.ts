import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlPurchaseService {
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
  async generateXMLSPUORDApprovalReqCheckWEB(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DocumentNo>${this.escapeXml(item.DocumentNo || '')}</DocumentNo>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <ApproReqSeq>${this.escapeXml(item.ApproReqSeq || '0')}</ApproReqSeq>
    <ApproReqDate>${this.escapeXml(item.ApproReqDate || '')}</ApproReqDate>
    <ApproReqNo>${this.escapeXml(item.ApproReqNo || '')}</ApproReqNo>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '0')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <FileSeq>0</FileSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMConfirmDeleteWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <CfmSeq>${this.escapeXml(item.ApproReqSeq || '')}</CfmSeq>
    <TableName>_TPUORDApprovalReq</TableName>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDApprovalReqItemCheckWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>${this.escapeXml(item.Status || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IdxNo || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ApproReqSeq>${this.escapeXml(item.ApproReqSeq || '0')}</ApproReqSeq>
    <ApproReqSerl>${this.escapeXml(item.ApproReqSerl || '0')}</ApproReqSerl>
    <PJTName />
    <PJTNo />
    <PJTSeq>0</PJTSeq>
    <WBSName />
    <WBSSeq>0</WBSSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '0')}</UnitSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <CustSeq>${this.escapeXml(item.CustSeq || '0')}</CustSeq>
    <MakerName />
    <MakerSeq>0</MakerSeq>
    <CurrName>${this.escapeXml(item.CurrName || '')}</CurrName>
    <CurrSeq>${this.escapeXml(item.CurrSeq || '0')}</CurrSeq>
    <ExRate>${this.escapeXml(item.ExRate || '0')}</ExRate>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <DCRate>${this.escapeXml(item.DCRate || '0')}</DCRate>
    <OriginPrice>${this.escapeXml(item.OriginPrice || '0')}</OriginPrice>
    <IsVAT>${this.escapeXml(item.IsVAT || '0')}</IsVAT>
    <CurAmt>${this.escapeXml(item.CurAmt || '0')}</CurAmt>
    <CurVAT>${this.escapeXml(item.CurVAT || '0')}</CurVAT>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <SMImpType>${this.escapeXml(item.SMImpType || '0')}</SMImpType>
    <DomPrice>${this.escapeXml(item.DomPrice || '0')}</DomPrice>
    <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
    <DomVAT>${this.escapeXml(item.DomVAT || '0')}</DomVAT>
    <SMPriceTypeName />
    <SMPriceType>0</SMPriceType>
    <SMPayType>${this.escapeXml(item.SMPayType || '0')}</SMPayType>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <WHSeq>${this.escapeXml(item.WHSeq || '0')}</WHSeq>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '0')}</STDUnitSeq>
    <STDUnitQty>${this.escapeXml(item.Qty || '0')}</STDUnitQty>
    <Memo1>${this.escapeXml(item.Memo1 || '')}</Memo1>
    <Memo2>${this.escapeXml(item.Memo2 || '')}</Memo2>
    <Memo3>${this.escapeXml(item.Memo3 || '')}</Memo3>
    <Memo4 />
    <Memo5 />
    <Memo6 />
    <Memo7>0</Memo7>
    <Memo8>0</Memo8>
    <SourceSeq>0</SourceSeq>
    <SourceSerl>0</SourceSerl>
    <SourceType />
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <ApproReqDate>${this.escapeXml(item.ApproReqDate || '')}</ApproReqDate>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDApprovalReqSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <ApproReqSeq>${this.escapeXml(item.ApproReqSeq || '')}</ApproReqSeq>
    <ApproReqNo>${this.escapeXml(item.ApproReqNo || '')}</ApproReqNo>
    <ApproReqDate>${this.escapeXml(item.ApproReqDate || '')}</ApproReqDate>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <FileSeq>0</FileSeq>
    <IsPJT xml:space="preserve"> </IsPJT>
    <DocumentNo>${this.escapeXml(item.DocumentNo || '')}</DocumentNo>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDApprovalReqItemSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ApproReqSeq>${this.escapeXml(item.ApproReqSeq || '0')}</ApproReqSeq>
    <ApproReqSerl>${this.escapeXml(item.ApproReqSerl || '0')}</ApproReqSerl>
    <PJTName />
    <PJTNo />
    <PJTSeq>0</PJTSeq>
    <WBSName />
    <WBSSeq>0</WBSSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '0')}</UnitSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <CustSeq>${this.escapeXml(item.CustSeq || '0')}</CustSeq>
    <MakerName />
    <MakerSeq>0</MakerSeq>
    <CurrName>${this.escapeXml(item.CurrName || '')}</CurrName>
    <CurrSeq>${this.escapeXml(item.CurrSeq || '0')}</CurrSeq>
    <ExRate>${this.escapeXml(item.ExRate || '0')}</ExRate>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <DCRate>${this.escapeXml(item.DCRate || '0')}</DCRate>
    <OriginPrice>${this.escapeXml(item.OriginPrice || '0')}</OriginPrice>
    <IsVAT>${this.escapeXml(item.IsVAT || '0')}</IsVAT>
    <CurAmt>${this.escapeXml(item.CurAmt || '0')}</CurAmt>
    <TotCurAmt>${this.escapeXml(item.TotCurAmt || '0')}</TotCurAmt>
    <TotDomAmt>${this.escapeXml(item.TotDomAmt || '0')}</TotDomAmt>
    <CurVAT>${this.escapeXml(item.CurVAT || '0')}</CurVAT>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <SMImpType>${this.escapeXml(item.SMImpType || '0')}</SMImpType>
    <DomPrice>${this.escapeXml(item.DomPrice || '0')}</DomPrice>
    <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
    <DomVAT>${this.escapeXml(item.DomVAT || '0')}</DomVAT>
    <SMPriceTypeName />
    <SMPriceType>0</SMPriceType>
    <SMPayType>${this.escapeXml(item.SMPayType || '0')}</SMPayType>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <WHSeq>${this.escapeXml(item.WHSeq || '0')}</WHSeq>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '0')}</STDUnitSeq>
    <STDUnitQty>${this.escapeXml(item.Qty || '0')}</STDUnitQty>
    <Memo1>${this.escapeXml(item.Memo1 || '')}</Memo1>
    <Memo2>${this.escapeXml(item.Memo2 || '')}</Memo2>
    <Memo3>${this.escapeXml(item.Memo3 || '')}</Memo3>
    <Memo4 />
    <Memo5 />
    <Memo6 />
    <Memo7>0</Memo7>
    <Memo8>0</Memo8>
    <SourceSeq>0</SourceSeq>
    <SourceSerl>0</SourceSerl>
    <SourceType />
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <ApproReqDate>${this.escapeXml(item.ApproReqDate || '')}</ApproReqDate>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMConfirmCreateWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <TableName>_TLGInOutReq</TableName>
    <CfmSeq>${this.escapeXml(item.ApproReqSeq || '')}</CfmSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  //OrdPO
  async generateXMLSPUDelvCheckWEB(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
       <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '0')}</DelvSeq>
    <BizUnit>${this.escapeXml(item.BizUnit || '0')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <DelvNo>${this.escapeXml(item.DelvNo || '')}</DelvNo>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <DelvMngNo>${this.escapeXml(item.DelvMngNo || '')}</DelvMngNo>
    <CustSeq>${this.escapeXml(item.CustSeq || '0')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <CustNo>${this.escapeXml(item.CustNo || '')}</CustNo>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '0')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <SMImpType>${this.escapeXml(item.SMImpType || '0')}</SMImpType>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '0')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <CurrSeq>${this.escapeXml(item.CurrSeq || '0')}</CurrSeq>
    <CurrName>${this.escapeXml(item.CurrName || '')}</CurrName>
    <ExRate>${this.escapeXml(item.ExRate || '0')}</ExRate>
    <SMDelvType>${this.escapeXml(item.SMDelvType || '')}</SMDelvType>
    <SMStkType>6033001</SMStkType>
    <IsPJT>0</IsPJT>
    <InOutType>160</InOutType>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvItemCheckWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>${this.escapeXml(item.Status || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IdxNo || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <PJTName />
    <PJTNo />
    <PJTSeq>0</PJTSeq>
    <WBSName />
    <WBSSeq>0</WBSSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '0')}</UnitSeq>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <CurAmt>${this.escapeXml(item.CurAmt || '0')}</CurAmt>
    <CurVAT>${this.escapeXml(item.CurVAT || '0')}</CurVAT>
    <MakerName />
    <MakerSeq>0</MakerSeq>
    <DomPrice>${this.escapeXml(item.DomPrice || '0')}</DomPrice>
    <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
    <DomVAT>${this.escapeXml(item.DomVAT || '0')}</DomVAT>
    <IsVAT>${this.escapeXml(item.IsVAT || '0')}</IsVAT>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '0')}</STDUnitSeq>
    <STDUnitQty>${this.escapeXml(item.Qty || '0')}</STDUnitQty>
    <WHSeq>${this.escapeXml(item.WHSeq || '0')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <DelvCustName />
    <DelvCustSeq>0</DelvCustSeq>
    <SalesCustName />
    <SalesCustSeq>0</SalesCustSeq>
    <SMPriceTypeName />
    <SMPriceType>0</SMPriceType>
    <SMQcTypeName>Chưa kiểm tra</SMQcTypeName>
    <SMQcType>6035002</SMQcType>
    <QcDate />
    <QCQty>0</QCQty>
    <QCCurAmt>0</QCCurAmt>
    <QCStdUnitQty>0</QCStdUnitQty>
    <StdConvQty>0</StdConvQty>
    <FromSerial />
    <Toserial />
    <LotMngYN />
    <FromTableSeq>13</FromTableSeq>
    <FromSeq>${this.escapeXml(item.POSeq || '0')}</FromSeq>
    <FromSerl>${this.escapeXml(item.POSerl || '0')}</FromSerl>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <LotNo_Old />
    <ItemSeq_Old>0</ItemSeq_Old>
    <IsFiction>0</IsFiction>
    <FicRateNum>0</FicRateNum>
    <FicRateDen>0</FicRateDen>
    <EvidName />
    <EvidSeq>0</EvidSeq>
    <Remark2 />
    <Memo1>${this.escapeXml(item.Memo1 || '')}</Memo1>
    <Memo2>${this.escapeXml(item.Memo2 || '')}</Memo2>
    <Memo3>${this.escapeXml(item.Memo3 || '')}</Memo3>
    <Memo4 />
    <Memo5 />
    <Memo6 />
    <Memo7>0</Memo7>
    <Memo8>0</Memo8>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <DelvNo>${this.escapeXml(item.DelvNo || '')}</DelvNo>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '0')}</DelvSeq>
    <DelvSerl>${this.escapeXml(item.DelvSerl || '0')}</DelvSerl>
    <LotNo />
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <BizUnit>${this.escapeXml(item.BizUnit || '0')}</BizUnit>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '0')}</DelvSeq>
    <DelvNo>${this.escapeXml(item.DelvNo || '')}</DelvNo>
    <DelvMngNo>${this.escapeXml(item.DelvMngNo || '')}</DelvMngNo>
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CurrName>${this.escapeXml(item.CurrName || '')}</CurrName>
    <CurrSeq>${this.escapeXml(item.CurrSeq || '')}</CurrSeq>
    <ExRate>${this.escapeXml(item.ExRate || '0')}</ExRate>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <IsPJT>0</IsPJT>
    <SMDelvType>6034001</SMDelvType>
    <SMStkType>6033001</SMStkType>
    <InOutType>160</InOutType>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvItemSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <PJTName />
    <PJTNo />
    <PJTSeq>0</PJTSeq>
    <WBSName />
    <WBSSeq>0</WBSSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '0')}</UnitSeq>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <CurAmt>${this.escapeXml(item.CurAmt || '0')}</CurAmt>
    <CurVAT>${this.escapeXml(item.CurVAT || '0')}</CurVAT>
    <MakerName />
    <MakerSeq>0</MakerSeq>
    <DomPrice>${this.escapeXml(item.DomPrice || '0')}</DomPrice>
    <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
    <DomVAT>${this.escapeXml(item.DomVAT || '0')}</DomVAT>
    <IsVAT>${this.escapeXml(item.IsVAT || '0')}</IsVAT>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '0')}</STDUnitSeq>
    <STDUnitQty>${this.escapeXml(item.Qty || '0')}</STDUnitQty>
    <WHSeq>${this.escapeXml(item.WHSeq || '0')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <DelvCustName />
    <DelvCustSeq>0</DelvCustSeq>
    <SalesCustName />
    <SalesCustSeq>0</SalesCustSeq>
    <SMPriceTypeName />
    <SMPriceType>0</SMPriceType>
    <SMQcTypeName>Chưa kiểm tra</SMQcTypeName>
    <SMQcType>6035002</SMQcType>
    <QcDate />
    <QCQty>0</QCQty>
    <QCCurAmt>0</QCCurAmt>
    <QCStdUnitQty>0</QCStdUnitQty>
    <StdConvQty>0</StdConvQty>
    <FromSerial />
    <Toserial />
    <LotMngYN />
    <FromTableSeq>13</FromTableSeq>
    <FromSeq>${this.escapeXml(item.POSeq || '0')}</FromSeq>
    <FromSerl>${this.escapeXml(item.POSerl || '0')}</FromSerl>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <LotNo_Old />
    <ItemSeq_Old>0</ItemSeq_Old>
    <IsFiction>0</IsFiction>
    <FicRateNum>0</FicRateNum>
    <FicRateDen>0</FicRateDen>
    <EvidName />
    <EvidSeq>0</EvidSeq>
    <Remark2 />
    <Memo1>${this.escapeXml(item.Memo1 || '')}</Memo1>
    <Memo2>${this.escapeXml(item.Memo2 || '')}</Memo2>
    <Memo3>${this.escapeXml(item.Memo3 || '')}</Memo3>
    <Memo4 />
    <Memo5 />
    <Memo6 />
    <Memo7>0</Memo7>
    <Memo8>0</Memo8>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <DelvNo>${this.escapeXml(item.DelvNo || '')}</DelvNo>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '0')}</DelvSeq>
    <DelvSerl>${this.escapeXml(item.DelvSerl || '0')}</DelvSerl>
    <LotNo />
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <BizUnit>${this.escapeXml(item.BizUnit || '0')}</BizUnit>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMSourceDailySaveWEBDelv(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
  <WorkingTag>${this.escapeXml(item.Status || '')}</WorkingTag>
  <IDX_NO>${index + 1}</IDX_NO>
  <DataSeq>${index + 1}</DataSeq>
  <Status>0</Status>
  <Selected>1</Selected>
  <FromTableSeq>13</FromTableSeq>
  <FromSeq>${this.escapeXml(item.POSeq || '0')}</FromSeq>
  <FromSerl>${this.escapeXml(item.POSerl || '0')}</FromSerl>
  <FromSubSerl>0</FromSubSerl>
  <ToTableSeq>10</ToTableSeq>
  <FromQty>${this.escapeXml(item.POQty || '0')}</FromQty>
  <FromSTDQty>${this.escapeXml(item.POQty || '0')}</FromSTDQty>
  <FromAmt>${this.escapeXml(item.POAmt || '0')}</FromAmt>
  <FromVAT>0</FromVAT> 
  <PrevFromTableSeq>11</PrevFromTableSeq>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
  <ToSeq>${this.escapeXml(item.DelvSeq || '0')}</ToSeq>
  <ToSerl>${this.escapeXml(item.DelvSerl || '0')}</ToSerl>
  <ToQty>${this.escapeXml(item.Qty || '0')}</ToQty>
  <ToSTDQty>${this.escapeXml(item.Qty || '0')}</ToSTDQty>
  <ToAmt>${this.escapeXml(item.CurAmt || '0')}</ToAmt>
  <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  //PurDelvIn
  async generateXMLSPUDelvInMasterQueryWEB(result: number) {
    const xmlBlocks = `
      <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <DelvSeq>${result}</DelvSeq>
  </DataBlock1>`;
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInSheetQueryWEB(result: number) {
    const xmlBlocks = `
      <DataBlock2>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <DelvSeq>${result}</DelvSeq>
  </DataBlock2>`;
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInMasterLinkQueryWEB(result: number) {
    const xmlBlocks = `
      <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <DelvInSeq>${result}</DelvInSeq>
  </DataBlock1>`;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInSheetLinkQueryWEB(result: number) {
    const xmlBlocks = `
      <DataBlock2>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <DelvInSeq>${result}</DelvInSeq>
  </DataBlock2>`;
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGEtcInSheetQueryWEB(result: number) {
    const xmlBlocks = `
      <DataBlock1>
  <WorkingTag>U</WorkingTag>
  <IDX_NO>1</IDX_NO>
  <Status>0</Status>
  <DataSeq>1</DataSeq>
  <Selected>1</Selected>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
  <IsChangedMst>0</IsChangedMst>
  <InOutSeq>${result}</InOutSeq>
</DataBlock1>`;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGLotNoMasterCheckWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
  <WorkingTag>${this.escapeXml(item.Status || '')}</WorkingTag>
  <IDX_NO>${this.escapeXml(item.IdxNo || '0')}</IDX_NO>
  <DataSeq>${index + 1}</DataSeq>
  <Status>0</Status>
  <Selected>1</Selected>
  <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
  <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
  <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
  <Spec>${this.escapeXml(item.Spec || '')}</Spec>
  <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
  <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
  <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
  <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
  <CreateDate>${this.escapeXml(item.CreateDate || '')}</CreateDate>
  <CreateTime></CreateTime>
  <ValiDate></ValiDate>
  <ValidTime></ValidTime>
  <RegDate>${this.escapeXml(item.RegDate || '')}</RegDate>
  <RegUserName></RegUserName>
  <RegUserSeq>${this.escapeXml(item.UserSeq || '0')}</RegUserSeq>
  <CustName></CustName>
  <CustSeq>${this.escapeXml(item.CustSeq || '0')}</CustSeq>
  <SourceLotNo>${this.escapeXml(item.LotNo || '')}</SourceLotNo>
  <Remark>${this.escapeXml(item.Remark || '')}</Remark>
  <OriLotNo>${this.escapeXml(item.LotNo || '')}</OriLotNo>
  <OriItemName />
  <OriItemNo />
  <OriSpec />
  <OriItemSeq>${this.escapeXml(item.ItemSeq || '0')}</OriItemSeq>
  <LotNoOLD>${this.escapeXml(item.LotNo || '')}</LotNoOLD>
  <ItemSeqOLD>${this.escapeXml(item.ItemSeq || '0')}</ItemSeqOLD>
  <InNo>${this.escapeXml(item.DelvNo || '')}</InNo>
  <SupplyCustSeq>${this.escapeXml(item.CustSeq || '0')}</SupplyCustSeq>
  <LotSeq>0</LotSeq>
  <PgmSeqModifying />
  <Dummy1>WEB_Import</Dummy1>
  <Dummy2></Dummy2>
  <Dummy3></Dummy3>
  <Dummy4 />
  <Dummy5 />
  <Dummy6>0</Dummy6>
  <Dummy7>0</Dummy7>
  <Dummy8>0</Dummy8>
  <Dummy9>0</Dummy9>
  <Dummy10>0</Dummy10>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGLotNoMasterSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
  <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
  <IDX_NO>${this.escapeXml(item.IDX_NO || '0')}</IDX_NO>
  <DataSeq>${index + 1}</DataSeq>
  <Status>0</Status>
  <Selected>1</Selected>
  <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
  <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
  <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
  <Spec>${this.escapeXml(item.Spec || '')}</Spec>
  <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
  <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
  <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
  <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
  <CreateDate>${this.escapeXml(item.CreateDate || '')}</CreateDate>
  <CreateTime>${this.escapeXml(item.CreateTime || '')}</CreateTime>
  <ValiDate>${this.escapeXml(item.ValiDate || '')}</ValiDate>
  <ValidTime>${this.escapeXml(item.ValidTime || '')}</ValidTime>
  <RegDate>${this.escapeXml(item.RegDate || '')}</RegDate>
  <RegUserName>${this.escapeXml(item.RegUserName || '')}</RegUserName>
  <RegUserSeq>${this.escapeXml(item.RegUserSeq || '')}</RegUserSeq>
  <CustName>${this.escapeXml(item.CustName || '')}</CustName>
  <CustSeq>${this.escapeXml(item.CustSeq || '0')}</CustSeq>
  <SourceLotNo>${this.escapeXml(item.LotNo || '')}</SourceLotNo>
  <Remark>${this.escapeXml(item.Remark || '')}</Remark>
  <OriLotNo>${this.escapeXml(item.OriLotNo || '')}</OriLotNo>
  <OriItemName />
  <OriItemNo />
  <OriSpec />
  <OriItemSeq>${this.escapeXml(item.OriItemSeq || '0')}</OriItemSeq>
  <LotNoOLD>${this.escapeXml(item.LotNoOLD || '')}</LotNoOLD>
  <ItemSeqOLD>${this.escapeXml(item.ItemSeqOLD || '0')}</ItemSeqOLD>
  <InNo>${this.escapeXml(item.InNo || '')}</InNo>
  <SupplyCustSeq>${this.escapeXml(item.CustSeq || '0')}</SupplyCustSeq>
  <LotSeq>0</LotSeq>
  <PgmSeqModifying />
  <Dummy1>${this.escapeXml(item.Dummy1 || '')}</Dummy1>
  <Dummy2>${this.escapeXml(item.Dummy2 || '')}</Dummy2>
  <Dummy3>${this.escapeXml(item.Dummy3 || '')}</Dummy3>
  <Dummy4 />
  <Dummy5 />
  <Dummy6>0</Dummy6>
  <Dummy7>0</Dummy7>
  <Dummy8>0</Dummy8>
  <Dummy9>0</Dummy9>
  <Dummy10>0</Dummy10>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGLotNoMasterDeleteWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
  <WorkingTag>D</WorkingTag>
  <IDX_NO>${this.escapeXml(item.IdxNo || '0')}</IDX_NO>
  <DataSeq>${index + 1}</DataSeq>
  <Status>0</Status>
  <Selected>1</Selected>
  <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
  <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
  <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
  <Spec>${this.escapeXml(item.Spec || '')}</Spec>
  <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
  <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
  <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
  <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
  <CreateDate>${this.escapeXml(item.CreateDate || '')}</CreateDate>
  <CreateTime>${this.escapeXml(item.CreateTime || '')}</CreateTime>
  <ValiDate>${this.escapeXml(item.ValiDate || '')}</ValiDate>
  <ValidTime>${this.escapeXml(item.ValidTime || '')}</ValidTime>
  <RegDate>${this.escapeXml(item.RegDate || '')}</RegDate>
  <RegUserName>${this.escapeXml(item.RegUserName || '')}</RegUserName>
  <RegUserSeq>${this.escapeXml(item.RegUserSeq || '')}</RegUserSeq>
  <CustName>${this.escapeXml(item.CustName || '')}</CustName>
  <CustSeq>${this.escapeXml(item.CustSeq || '0')}</CustSeq>
  <SourceLotNo>${this.escapeXml(item.LotNo || '')}</SourceLotNo>
  <Remark>${this.escapeXml(item.Remark || '')}</Remark>
  <OriLotNo>${this.escapeXml(item.OriLotNo || '')}</OriLotNo>
  <OriItemName />
  <OriItemNo />
  <OriSpec />
  <OriItemSeq>${this.escapeXml(item.OriItemSeq || '0')}</OriItemSeq>
  <LotNoOLD>${this.escapeXml(item.LotNoOLD || '')}</LotNoOLD>
  <ItemSeqOLD>${this.escapeXml(item.ItemSeqOLD || '0')}</ItemSeqOLD>
  <InNo>${this.escapeXml(item.InNo || '')}</InNo>
  <SupplyCustSeq>${this.escapeXml(item.CustSeq || '0')}</SupplyCustSeq>
  <LotSeq>0</LotSeq>
  <PgmSeqModifying />
  <Dummy1>${this.escapeXml(item.Dummy1 || '')}</Dummy1>
  <Dummy2>${this.escapeXml(item.Dummy2 || '')}</Dummy2>
  <Dummy3>${this.escapeXml(item.Dummy3 || '')}</Dummy3>
  <Dummy4 />
  <Dummy5 />
  <Dummy6>0</Dummy6>
  <Dummy7>0</Dummy7>
  <Dummy8>0</Dummy8>
  <Dummy9>0</Dummy9>
  <Dummy10>0</Dummy10>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPurDelvInQRCheckWEB(
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
    <DelvSeq>${this.escapeXml(item.DelvSeq || '')}</DelvSeq>
    <DelvSerl>${this.escapeXml(item.DelvSerl || '')}</DelvSerl>
		<BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
		<WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
		<WHName>${this.escapeXml(item.WHName || '')}</WHName>
		<ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
		<UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
		<ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
		<LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
		<Qty>${this.escapeXml(item.Qty || '0')}</Qty>
		<DateCode>${this.escapeXml(item.DateCode || '')}</DateCode>
		<ReelNo>${this.escapeXml(item.ReelNo || '')}</ReelNo>
		<Barcode>${this.escapeXml(item.Barcode || '')}</Barcode>
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <SMImpTypeName>${this.escapeXml(item.SMImpTypeName || '')}</SMImpTypeName>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <CurAmt>${this.escapeXml(item.CurAmt || '0')}</CurAmt>
		<DomPrice>${this.escapeXml(item.DomPrice || '0')}</DomPrice>
		<DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
    <DelvQty>${this.escapeXml(item.DelvQty || '')}</DelvQty>
		<DelvAmt>${this.escapeXml(item.DelvAmt || '')}</DelvAmt>
    <IsLotMng>${this.escapeXml(item.IsLotMng || '')}</IsLotMng>
	</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMCloseItemCheckWEB(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>1</IDX_NO>
      <Status>0</Status>
      <DataSeq>1</DataSeq>
      <Selected>1</Selected>
      <TABLE_NAME>DataBlock1</TABLE_NAME>
      <IsChangedMst>1</IsChangedMst>
      <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
      <Date>${this.escapeXml(item.DelvDate || '')}</Date>
      <ServiceSeq>2543</ServiceSeq>
      <MethodSeq>8</MethodSeq>
      <DtlUnitSeq>1</DtlUnitSeq>
      </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMCloseItemCheckWEBDelvIn(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>1</IDX_NO>
      <Status>0</Status>
      <DataSeq>1</DataSeq>
      <Selected>1</Selected>
      <TABLE_NAME>DataBlock1</TABLE_NAME>
      <IsChangedMst>1</IsChangedMst>
      <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
      <Date>${this.escapeXml(item.DelvInDate || '')}</Date>
      <ServiceSeq>2607</ServiceSeq>
      <MethodSeq>8</MethodSeq>
      <DtlUnitSeq>1</DtlUnitSeq>
      </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInMasterCheckWEB(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
  <WorkingTag>${workingTag}</WorkingTag>
  <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <SMWareHouseType>6201001</SMWareHouseType>
    <DelvInSeq>${this.escapeXml(item.DelvInSeq || '0')}</DelvInSeq>
    <DelvInNo>${this.escapeXml(item.DelvInNo || '')}</DelvInNo>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DelvInDate>${this.escapeXml(item.DelvInDate || '')}</DelvInDate>
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>   
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <CurrSeq>${this.escapeXml(item.CurrSeq || '')}</CurrSeq>
    <CurrName>${this.escapeXml(item.CurrName || '')}</CurrName>
    <ExRate>${this.escapeXml(item.ExRate || '')}</ExRate>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <InOutType>170</InOutType>
    <IsPJT>0</IsPJT>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInSheetCheckWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
      <WorkingTag>${this.escapeXml(item.Status || '')}</WorkingTag>
      <IDX_NO>${this.escapeXml(item.IdxNo || '')}</IDX_NO>
      <DataSeq>${index + 1}</DataSeq>
      <Status>0</Status>
    <Selected>0</Selected>
    <DelvInSeq>${this.escapeXml(item.DelvInSeq || '0')}</DelvInSeq>
    <DelvInSerl>${this.escapeXml(item.DelvInSerl || '0')}</DelvInSerl>
    <PJTName />
    <PJTNo />
    <PJTSeq>0</PJTSeq>
    <WBSName />
    <WBSSeq>0</WBSSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <IsVAT>${this.escapeXml(item.IsVAT || '0')}</IsVAT>
    <CurAmt>${this.escapeXml(item.CurAmt || '0')}</CurAmt>
    <CurVAT>${this.escapeXml(item.CurVAT || '0')}</CurVAT>
    <DomPrice>${this.escapeXml(item.DomPrice || '0')}</DomPrice>
    <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
    <DomVAT>${this.escapeXml(item.DomVAT || '0')}</DomVAT>
    <SMPriceTypeName />
    <SMPriceType>0</SMPriceType>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <DelvCustName />
    <DelvCustSeq>0</DelvCustSeq>
    <SalesCustName />
    <SalesCustSeq>0</SalesCustSeq>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDUnitQty>${this.escapeXml(item.Qty || '')}</STDUnitQty>
    <SMPayTypeName />
    <SMPayType>0</SMPayType>
    <SMDelvTypeName />
    <SMDelvType>0</SMDelvType>
    <SMStkType>0</SMStkType>
    <SMStkTypeName />
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '')}</STDUnitSeq>
    <StdConvQty>1</StdConvQty>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <FromSerial />
    <ToSerial />
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <LotMngYN>${this.escapeXml(item.LotMngYN || '0')}</LotMngYN>
    <AccSeq>0</AccSeq>
    <AccName />
    <AntiAccSeq>0</AntiAccSeq>
    <AntiAccName />
    <IsFiction>0</IsFiction>
    <FicRateNum>0</FicRateNum>
    <FicRateDen>0</FicRateDen>
    <EvidSeq>0</EvidSeq>
    <EvidName />
    <FromSeq>${this.escapeXml(item.DelvSeq || '')}</FromSeq>
    <FromSerl>${this.escapeXml(item.DelvSerl || '')}</FromSerl>
    <FromQty>${this.escapeXml(item.DelvQty || '')}</FromQty>
    <LotNoOLD>${this.escapeXml(item.LotNo || '')}</LotNoOLD>
    <ItemSeqOLD>${this.escapeXml(item.ItemSeq || '')}</ItemSeqOLD>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <IsReturn />
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <DelvInDate>${this.escapeXml(item.DelvInDate || '')}</DelvInDate>
    <Memo1>${this.escapeXml(item.Memo1 || '')}</Memo1>
    <Memo2>${this.escapeXml(item.Memo2 || '')}</Memo2>
    <Memo3>${this.escapeXml(item.Memo3 || '')}</Memo3>
    <Memo4 />
    <Memo5 />
    <Memo6 />
    <Memo7>0</Memo7>
    <Memo8>0</Memo8>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInMasterSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>${this.escapeXml(item.DataSeq || '')}</DataSeq>
    <Selected>${this.escapeXml(item.Selected || '')}</Selected>
    <Status>${this.escapeXml(item.Status || '')}</Status>
    <DelvInSeq>${this.escapeXml(item.DelvInSeq || '')}</DelvInSeq>
    <DelvInNo>${this.escapeXml(item.DelvInNo || '')}</DelvInNo>
    <DelvInDate>${this.escapeXml(item.DelvInDate || '')}</DelvInDate>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <IsPJT>${this.escapeXml(item.IsPJT || '')}</IsPJT>
    <InOutType>170</InOutType>
    <SMWareHouseType>6201001</SMWareHouseType>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <CurrName>${this.escapeXml(item.CurrName || '')}</CurrName>
    <CurrSeq>${this.escapeXml(item.CurrSeq || '')}</CurrSeq>
    <ExRate>${this.escapeXml(item.ExRate || '')}</ExRate>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInSheetSaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IDX_NO || '')}</IDX_NO>
    <DataSeq>${this.escapeXml(item.DataSeq || '')}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <DelvInSeq>${this.escapeXml(item.DelvInSeq || '0')}</DelvInSeq>
    <DelvInSerl>${this.escapeXml(item.DelvInSerl || '0')}</DelvInSerl>
    <PJTName />
    <PJTNo />
    <PJTSeq>0</PJTSeq>
    <WBSName />
    <WBSSeq>0</WBSSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <IsVAT>${this.escapeXml(item.IsVAT || '0')}</IsVAT>
    <CurAmt>${this.escapeXml(item.CurAmt || '0')}</CurAmt>
    <CurVAT>${this.escapeXml(item.CurVAT || '0')}</CurVAT>
    <DomPrice>${this.escapeXml(item.DomPrice || '0')}</DomPrice>
    <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
    <DomVAT>${this.escapeXml(item.DomVAT || '0')}</DomVAT>
    <SMPriceTypeName />
    <SMPriceType>0</SMPriceType>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <DelvCustName />
    <DelvCustSeq>0</DelvCustSeq>
    <SalesCustName />
    <SalesCustSeq>0</SalesCustSeq>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDUnitQty>${this.escapeXml(item.Qty || '')}</STDUnitQty>
    <SMPayTypeName />
    <SMPayType>0</SMPayType>
    <SMDelvTypeName />
    <SMDelvType>0</SMDelvType>
    <SMStkType>0</SMStkType>
    <SMStkTypeName />
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '')}</STDUnitSeq>
    <StdConvQty>1</StdConvQty>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <FromSerial />
    <ToSerial />
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <LotMngYN>${this.escapeXml(item.LotMngYN || '0')}</LotMngYN>
    <AccSeq>0</AccSeq>
    <AccName />
    <AntiAccSeq>0</AntiAccSeq>
    <AntiAccName />
    <IsFiction>0</IsFiction>
    <FicRateNum>0</FicRateNum>
    <FicRateDen>0</FicRateDen>
    <EvidSeq>0</EvidSeq>
    <EvidName />
    <FromSeq>${this.escapeXml(item.FromSeq || '')}</FromSeq>
    <FromSerl>${this.escapeXml(item.FromSerl || '')}</FromSerl>
    <FromQty>${this.escapeXml(item.FromQty || '')}</FromQty>
    <LotNoOLD>${this.escapeXml(item.LotNo || '')}</LotNoOLD>
    <ItemSeqOLD>${this.escapeXml(item.ItemSeq || '')}</ItemSeqOLD>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <IsReturn />
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <DelvInDate>${this.escapeXml(item.DelvInDate || '')}</DelvInDate>
    <Memo1>${this.escapeXml(item.Memo1 || '')}</Memo1>
    <Memo2>${this.escapeXml(item.Memo2 || '')}</Memo2>
    <Memo3>${this.escapeXml(item.Memo3 || '')}</Memo3>
    <Memo4 />
    <Memo5 />
    <Memo6 />
    <Memo7>10</Memo7>
    <Memo8>0</Memo8>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMSourceDailySaveWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
  <WorkingTag>${this.escapeXml(item.Status || '')}</WorkingTag>
  <IDX_NO>${index + 1}</IDX_NO>
  <DataSeq>${index + 1}</DataSeq>
  <Status>0</Status>
  <Selected>1</Selected>
  <FromTableSeq>10</FromTableSeq>
  <FromSeq>${this.escapeXml(item.DelvSeq || '0')}</FromSeq>
  <FromSerl>${this.escapeXml(item.DelvSerl || '0')}</FromSerl>
  <FromSubSerl>0</FromSubSerl>
  <ToTableSeq>9</ToTableSeq>
  <FromQty>${this.escapeXml(item.DelvQty || '0')}</FromQty>
  <FromSTDQty>${this.escapeXml(item.DelvQty || '0')}</FromSTDQty>
  <FromAmt>${this.escapeXml(item.DelvAmt || '0')}</FromAmt>
  <FromVAT>0</FromVAT> 
  <PrevFromTableSeq>13</PrevFromTableSeq>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
  <ToSeq>${this.escapeXml(item.DelvInSeq || '0')}</ToSeq>
  <ToSerl>${this.escapeXml(item.DelvInSerl || '0')}</ToSerl>
  <ToQty>${this.escapeXml(item.Qty || '0')}</ToQty>
  <ToSTDQty>${this.escapeXml(item.Qty || '0')}</ToSTDQty>
  <ToAmt>${this.escapeXml(item.CurAmt || '0')}</ToAmt>
  <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutDailyBatchWEBDelvIn(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <InOutSeq>${this.escapeXml(item.DelvInSeq || '0')}</InOutSeq>
    <InOutType>170</InOutType>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutDailyBatchWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
    <WorkingTag>${this.escapeXml(item.WorkingTag || '')}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <InOutSeq>${this.escapeXml(item.DelvSeq || '0')}</InOutSeq>
    <InOutType>160</InOutType>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpPermitItemListQueryWEB(
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
    <IsChangedMst>1</IsChangedMst>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName />
    <PermitDateFr>${this.escapeXml(item.PermitDateFr || '')}</PermitDateFr>
    <PermitDateTo>${this.escapeXml(item.PermitDateTo || '')}</PermitDateTo>
    <PermitRefNo>${this.escapeXml(item.PermitRefNo || '')}</PermitRefNo>
    <SMImpKind>${this.escapeXml(item.SMImpKind || '')}</SMImpKind>
    <SMImpKindName />
    <UMPriceTerms />
    <UMPriceTermsName />
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName />
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName />
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName />
    <SMProgressType>${this.escapeXml(item.SMProgressType || '')}</SMProgressType>
    <PermitTypeName />
    <PJTNo />
    <SMImpSortName />
    <PJTName />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <SourceTableSeq>42</SourceTableSeq>
    <SourceRefNo />
    <SourceNo>${this.escapeXml(item.InvoiceNo || '')}</SourceNo>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpPermitListQueryWEB(
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
    <IsChangedMst>1</IsChangedMst>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName />
    <PermitDateFr>${this.escapeXml(item.PermitDateFr || '')}</PermitDateFr>
    <PermitDateTo>${this.escapeXml(item.PermitDateTo || '')}</PermitDateTo>
    <PermitRefNo>${this.escapeXml(item.PermitRefNo || '')}</PermitRefNo>
    <SMImpKind>${this.escapeXml(item.SMImpKind || '')}</SMImpKind>
    <SMImpKindName />
    <UMPriceTerms />
    <UMPriceTermsName />
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName />
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName />
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName />
    <SMProgressType>${this.escapeXml(item.SMProgressType || '')}</SMProgressType>
    <PermitTypeName />
    <PJTNo />
    <SMImpSortName />
    <PJTName />
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpPermitStopWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${this.escapeXml(item.RowIndex + 1 || '')}</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <IsStop>${this.escapeXml(item.IsStop || '')}</IsStop>
    <PermitSeq>${this.escapeXml(item.PermitSeq || '')}</PermitSeq>
	  <RemarkS>${this.escapeXml(item.RemarkS || '')}</RemarkS>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLPurDelvInListQueryWEB(
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
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DelvDateFr>${this.escapeXml(item.DelvDateFr || '')}</DelvDateFr>
    <DelvDateTo>${this.escapeXml(item.DelvDateTo || '')}</DelvDateTo>
    <DelvNo>${this.escapeXml(item.DelvNo || '')}</DelvNo>
    <SMImpKind>${this.escapeXml(item.SMImpKind || '')}</SMImpKind>
    <SMImpKindName />
    <UMPriceTerms />
    <UMPriceTermsName />
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <SMProgressType></SMProgressType>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLPurDelvInItemListQueryWEB(
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
    <IsChangedMst>1</IsChangedMst>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DelvDateFr>${this.escapeXml(item.DelvDateFr || '')}</DelvDateFr>
    <DelvDateTo>${this.escapeXml(item.DelvDateTo || '')}</DelvDateTo>
    <DelvNo>${this.escapeXml(item.DelvNo || '')}</DelvNo>
    <SMImpKind>${this.escapeXml(item.SMImpKind || '')}</SMImpKind>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <SourceTableSeq>42</SourceTableSeq>
    <SourceRefNo />
    <SourceNo>${this.escapeXml(item.InvoiceNo || '')}</SourceNo>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMConfirmWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
         <DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${this.escapeXml(item.RowIndex + 1 || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <CfmCode>${this.escapeXml(this.convertToNumber(item?.IsConfirm))}</CfmCode>
    <CfmSeq>${this.escapeXml(item.ApproReqSeq || '')}</CfmSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <TableName>_TPUORDApprovalReq</TableName>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMConfirmWEBPO(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
         <DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${this.escapeXml(item.RowIndex + 1 || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <CfmCode>${this.escapeXml(this.convertToNumber(item?.IsConfirm))}</CfmCode>
    <CfmSeq>${this.escapeXml(item.POSeq || '')}</CfmSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <TableName>_TPUDelv</TableName>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLApprovalReqStopWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${this.escapeXml(item.RowIndex + 1 || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <IsStop>${this.escapeXml(item.IsStop || '')}</IsStop>
    <ApproReqSeq>${this.escapeXml(item.ApproReqSeq || '')}</ApproReqSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLPOStopWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>${this.escapeXml(item.RowIndex + 1 || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <IsStop>${this.escapeXml(item.IsStop || '')}</IsStop>
    <POSeq>${this.escapeXml(item.POSeq || '')}</POSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDApprovalReqListQueryWEB(
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
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <ApproReqDateFr>${this.escapeXml(item.ApproReqDateFr || '')}</ApproReqDateFr>
    <ApproReqDateTo>${this.escapeXml(item.ApproReqDateTo || '')}</ApproReqDateTo>
    <DelvDateFr />
    <DelvDateTo />
    <SMCurrStatus>${this.escapeXml(item.SMCurrStatus || '')}</SMCurrStatus>
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <DocumentNo>${this.escapeXml(item.DocumentNo || '')}</DocumentNo>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <PurGroupDeptSeq>307</PurGroupDeptSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDApprovalReqMasterQueryWEB(
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
    <ApproReqSeq>${this.escapeXml(item.ApproReqSeq || '')}</ApproReqSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDApprovalReqSheetQueryWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <ApproReqSeq>${this.escapeXml(item.ApproReqSeq || '')}</ApproReqSeq>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvMasterQueryWEB(
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
    <IsChangedMst>1</IsChangedMst>
    <POSeq>${this.escapeXml(item.POSeq || '0')}</POSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvSheetQueryWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <POSeq>${this.escapeXml(item.POSeq || '0')}</POSeq>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvMasterLinkQueryWEB(
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
    <IsChangedMst>1</IsChangedMst>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '0')}</DelvSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvSheetLinkQueryWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '0')}</DelvSeq>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDApprovalReqItemListQueryWEB(
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
	  <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DocumentNo>${this.escapeXml(item.DocumentNo || '')}</DocumentNo>
    <SMCurrStatus>${this.escapeXml(item.SMCurrStatus || '')}</SMCurrStatus>
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <IsPJTPur />
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <ApproReqNo>${this.escapeXml(item.ApproReqNo || '')}</ApproReqNo>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <SMAssetType />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <ApproReqDateFr>${this.escapeXml(item.ApproReqDateFr || '')}</ApproReqDateFr>
    <ApproReqDateTo>${this.escapeXml(item.ApproReqDateTo || '')}</ApproReqDateTo>
    <PurGroupDeptSeq>307</PurGroupDeptSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  async generateXMLSPUDelvItemListQueryWEB(
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
	  <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DelvMngNo>${this.escapeXml(item.DelvMngNo || '')}</DelvMngNo>
    <POMngNo>${this.escapeXml(item.POMngNo || '')}</POMngNo>
    <SMDelvInType>${this.escapeXml(item.SMDelvInType || '')}</SMDelvInType>
    <SMImpType />
    <IsPJTPur />
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <SMAssetType />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <DelvDateFr>${this.escapeXml(item.DelvDateFr || '')}</DelvDateFr>
    <DelvDateTo>${this.escapeXml(item.DelvDateTo || '')}</DelvDateTo>
    <PurGroupDeptSeq>307</PurGroupDeptSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInItemListQueryWEB(
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
	  <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DelvMngNo>${this.escapeXml(item.DelvMngNo || '')}</DelvMngNo>
    <POMngNo>${this.escapeXml(item.POMngNo || '')}</POMngNo>
    <DelvInNo>${this.escapeXml(item.DelvInNo || '')}</DelvInNo>
    <SMImpType />
    <IsPJTPur />
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <SMAssetType />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <DelvInDateFr>${this.escapeXml(item.DelvInDateFr || '')}</DelvInDateFr>
    <DelvInDateTo>${this.escapeXml(item.DelvInDateTo || '')}</DelvInDateTo>
    <PurGroupDeptSeq>307</PurGroupDeptSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvListQueryWEB(
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
	  <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DelvMngNo>${this.escapeXml(item.DelvMngNo || '')}</DelvMngNo>
    <POMngNo>${this.escapeXml(item.POMngNo || '')}</POMngNo>
    <SMDelvInType>${this.escapeXml(item.SMDelvInType || '')}</SMDelvInType>
    <SMImpType />
    <IsPJTPur />
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <SMAssetType />
    <DelvDateFr>${this.escapeXml(item.DelvDateFr || '')}</DelvDateFr>
    <DelvDateTo>${this.escapeXml(item.DelvDateTo || '')}</DelvDateTo>
    <PurGroupDeptSeq>307</PurGroupDeptSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUDelvInListQueryWEB(
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
	  <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DelvMngNo>${this.escapeXml(item.DelvMngNo || '')}</DelvMngNo>
    <DelvInNo>${this.escapeXml(item.DelvInNo || '')}</DelvInNo>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <DelvInDateFr>${this.escapeXml(item.DelvInDateFr || '')}</DelvInDateFr>
    <DelvInDateTo>${this.escapeXml(item.DelvInDateTo || '')}</DelvInDateTo>
    <PurGroupDeptSeq>307</PurGroupDeptSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
