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
  async generateXMLSPUORDPOCheckWEB(
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
    <IsChangedMst>0</IsChangedMst>
    <POSeq>${this.escapeXml(item.POSeq || '0')}</POSeq>
    <PONo>${this.escapeXml(item.PONo || '')}</PONo>
    <POMngNo>${this.escapeXml(item.POMngNo || '')}</POMngNo>
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <PODate>${this.escapeXml(item.PODate || '')}</PODate>
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
    <IsPJT xml:space="preserve"> </IsPJT>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <Payment />
    <POAmd>0</POAmd>
    <FileSeq>${this.escapeXml(item.ApproReqSeq || '0')}</FileSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMConfirmDeleteWEBPO(
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
    <CfmSeq>${this.escapeXml(item.POSeq || '0')}</CfmSeq>
    <TableName>_TPUORDPO</TableName>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDPOItemCheckWEB(
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
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <PJTName />
    <PJTNo />
    <PJTSeq>0</PJTSeq>
    <WBSName />
    <WBSSeq>0</WBSSeq>
    <POSeq>${this.escapeXml(item.POSeq || '0')}</POSeq>
    <POSerl>${this.escapeXml(item.POSerl || '0')}</POSerl>
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
    <POAmd>0</POAmd>
    <WHSeq>${this.escapeXml(item.WHSeq || '0')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <DelvTime xml:space="preserve">    </DelvTime>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <DelvDate2 xml:space="preserve">        </DelvDate2>
    <SMPriceTypeName />
    <SMPriceType>0</SMPriceType>
    <SMPayType>${this.escapeXml(item.SMPayType || '0')}</SMPayType>
    <Remark1>${this.escapeXml(item.Remark || '')}</Remark1>
    <Remark2 />
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

  async generateXMLSPUORDPOSaveWEB(
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
    <POSeq>${this.escapeXml(item.POSeq || '0')}</POSeq>
    <PONo>${this.escapeXml(item.PONo || '')}</PONo>
    <POMngNo>${this.escapeXml(item.POMngNo || '')}</POMngNo>
    <SMImpType>${this.escapeXml(item.SMImpType || '')}</SMImpType>
    <PODate>${this.escapeXml(item.PODate || '')}</PODate>
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
    <IsPJT xml:space="preserve"> </IsPJT>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <Payment />
    <POAmd>0</POAmd>
    <FileSeq>${this.escapeXml(item.FileSeq || '0')}</FileSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDPOItemSaveWEB(
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
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <PJTName />
    <PJTNo />
    <PJTSeq>0</PJTSeq>
    <WBSName />
    <WBSSeq>0</WBSSeq>
    <POSeq>${this.escapeXml(item.POSeq || '0')}</POSeq>
    <POSerl>${this.escapeXml(item.POSerl || '0')}</POSerl>
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
    <TotCurAmt>${this.escapeXml(item.TotCurAmt || '0')}</TotCurAmt>
    <TotDomAmt>${this.escapeXml(item.TotDomAmt || '0')}</TotDomAmt>
    <DomPrice>${this.escapeXml(item.DomPrice || '0')}</DomPrice>
    <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
    <DomVAT>${this.escapeXml(item.DomVAT || '0')}</DomVAT>
    <IsVAT>${this.escapeXml(item.IsVAT || '0')}</IsVAT>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '0')}</STDUnitSeq>
    <STDUnitQty>${this.escapeXml(item.Qty || '0')}</STDUnitQty>
    <POAmd>0</POAmd>
    <WHSeq>${this.escapeXml(item.WHSeq || '0')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <DelvTime xml:space="preserve">    </DelvTime>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <DelvDate2 xml:space="preserve">        </DelvDate2>
    <SMPriceTypeName />
    <SMPriceType>0</SMPriceType>
    <SMPayType>${this.escapeXml(item.SMPayType || '0')}</SMPayType>
    <Remark1>${this.escapeXml(item.Remark || '')}</Remark1>
    <Remark2 />
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

  async generateXMLSCOMSourceDailySaveWEBPO(
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
  <FromTableSeq>11</FromTableSeq>
  <FromSeq>${this.escapeXml(item.ApproReqSeq || '0')}</FromSeq>
  <FromSerl>${this.escapeXml(item.ApproReqSerl || '0')}</FromSerl>
  <FromSubSerl>0</FromSubSerl>
  <ToTableSeq>13</ToTableSeq>
  <FromQty>${this.escapeXml(item.ApprovalReqQty || '0')}</FromQty>
  <FromSTDQty>${this.escapeXml(item.ApprovalReqQty || '0')}</FromSTDQty>
  <FromAmt>${this.escapeXml(item.ApprovalReqCurAmt || '0')}</FromAmt>
  <FromVAT>0</FromVAT> 
  <PrevFromTableSeq>0</PrevFromTableSeq>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
  <ToSeq>${this.escapeXml(item.POSeq || '0')}</ToSeq>
  <ToSerl>${this.escapeXml(item.POSerl || '0')}</ToSerl>
  <ToQty>${this.escapeXml(item.Qty || '0')}</ToQty>
  <ToSTDQty>${this.escapeXml(item.Qty || '0')}</ToSTDQty>
  <ToAmt>${this.escapeXml(item.CurAmt || '0')}</ToAmt>
  <DomAmt>${this.escapeXml(item.DomAmt || '0')}</DomAmt>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMConfirmCreateWEBPO(
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
    <TableName>_TPUORDPO</TableName>
    <CfmSeq>${this.escapeXml(item.POSeq || '')}</CfmSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  //ImpDelivery
  async generateXMLSSLImpPermitMasterQueryWEB(result: number) {
    const xmlBlocks = `
      <DataBlock1>
    <WorkingTag />
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <PermitSeq>${result}</PermitSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>`;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpPermitSheetJumpQueryWEB(result: number) {
    const xmlBlocks = `
      <DataBlock1>
    <WorkingTag />
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ParamFromSeq>${result}</ParamFromSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <FromPgmSeq>5559</FromPgmSeq>
    <ToPgmSeq>1036085</ToPgmSeq>
  </DataBlock1>`;
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpDelvMasterQueryWEB(result: number) {
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

  async generateXMLSSLImpDelvSheetQueryWEB(result: number) {
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

  async generateXMLSIpmDeliveryQRCheckWEB(
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
	<PermitSeq>${this.escapeXml(item.PermitSeq || '')}</PermitSeq>
	<PermitSerl>${this.escapeXml(item.PermitSerl || '')}</PermitSerl>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
	<UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <Qty>${this.escapeXml(item.Qty || 0)}</Qty>
    <DateCode>${this.escapeXml(item.DateCode || '')}</DateCode>
    <ReelNo>${this.escapeXml(item.ReelNo || '')}</ReelNo>
    <Barcode>${this.escapeXml(item.Barcode || '')}</Barcode>
	<SMImpKind>${this.escapeXml(item.SMImpKind || '')}</SMImpKind>
	<SMImpKindName>${this.escapeXml(item.SMImpKindName || '')}</SMImpKindName>
	<Price>${this.escapeXml(item.Price || 0)}</Price>
	<CurAmt>${this.escapeXml(item.CurAmt || 0)}</CurAmt>
	<PermitQty>${this.escapeXml(item.PermitQty || 0)}</PermitQty>
  <PermitAmt>${this.escapeXml(item.PermitAmt || 0)}</PermitAmt>
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
  <ServiceSeq>4492</ServiceSeq>
  <MethodSeq>2</MethodSeq>
  <DtlUnitSeq>1</DtlUnitSeq>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpDelvMasterCheckWEB(
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
    <DelvNo />
    <BLNo />
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <SMImpKind>${this.escapeXml(item.SMImpKind || '')}</SMImpKind>
    <SMImpKindName>${this.escapeXml(item.SMImpKindName || '')}</SMImpKindName>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <PermitNo>${this.escapeXml(item.PermitNo || '')}</PermitNo>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '')}</DelvSeq>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <CurrSeq>${this.escapeXml(item.CurrSeq || '')}</CurrSeq>
    <CurrName>${this.escapeXml(item.CurrName || '')}</CurrName>
    <ExRate>${this.escapeXml(item.ExRate || '')}</ExRate>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <IsPJT>0</IsPJT>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpDelvSheetCheckWEB(
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
    <PJTSeq>0</PJTSeq>
    <WBSSeq>0</WBSSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <MakerName />
    <MakerSeq>0</MakerSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <Qty>${this.escapeXml(item.Qty || '')}</Qty>
    <Price>${this.escapeXml(item.Price || 0)}</Price>
    <CurAmt>${this.escapeXml(item.CurAmt || 0)}</CurAmt>
    <DomAmt>${this.escapeXml(item.CurAmt || 0)}</DomAmt>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <FromSerlNo />
    <ToSerlNo />
    <ProdDate>${this.escapeXml(item.CreateDate || '')}</ProdDate>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDQty>${this.escapeXml(item.Qty || '')}</STDQty>
    <DelvSerl>${this.escapeXml(item.DelvSerl || '')}</DelvSerl>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '')}</STDUnitSeq>
    <AccName />
    <OppAccName />
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <IsQtyChange />
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <Memo1 />
    <Memo2 />
    <Memo3 />
    <Memo4 />
    <Memo5 />
    <Memo6 />
    <Memo7>0</Memo7>
    <Memo8>0</Memo8>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '')}</DelvSeq>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpDelvMasterSaveWEB(
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
    <DelvSeq>${this.escapeXml(item.DelvSeq || '')}</DelvSeq>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <DelvNo>${this.escapeXml(item.DelvNo || '')}</DelvNo>
    <PermitNo>${this.escapeXml(item.PermitNo || '')}</PermitNo>
    <BLNo xml:space="preserve">            </BLNo>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <CurrName>${this.escapeXml(item.CurrName || '')}</CurrName>
    <CurrSeq>${this.escapeXml(item.CurrSeq || '')}</CurrSeq>
    <ExRate>${this.escapeXml(item.ExRate || '')}</ExRate>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <SMImpKindName>${this.escapeXml(item.SMImpKindName || '')}</SMImpKindName>
    <SMImpKind>${this.escapeXml(item.SMImpKind || '')}</SMImpKind>
    <IsPJT>0</IsPJT>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSSLImpDelvSheetSaveWEB(
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
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <DelvSeq>${this.escapeXml(item.DelvSeq || '')}</DelvSeq>
    <DelvSerl>${this.escapeXml(item.DelvSerl || '')}</DelvSerl>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <Qty>${this.escapeXml(item.Qty || '')}</Qty>
    <Price>${this.escapeXml(item.Price || 0)}</Price>
    <CurAmt>${this.escapeXml(item.CurAmt || 0)}</CurAmt>
    <DomAmt>${this.escapeXml(item.DomAmt || 0)}</DomAmt>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <FromSerlNo />
    <ToSerlNo />
    <ProdDate>${this.escapeXml(item.ProdDate || '')}</ProdDate>
    <STDUnitSeq>${this.escapeXml(item.STDUnitSeq || '')}</STDUnitSeq>
    <STDUnitName>${this.escapeXml(item.STDUnitName || '')}</STDUnitName>
    <STDQty>${this.escapeXml(item.STDQty || '')}</STDQty>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <AccName />
    <OppAccName />
    <IsQtyChange xml:space="preserve"> </IsQtyChange>
    <PJTSeq>0</PJTSeq>
    <WBSSeq>0</WBSSeq>
    <MakerSeq>0</MakerSeq>
    <MakerName />
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <Memo1 />
    <Memo2 />
    <Memo3 />
    <Memo4 />
    <Memo5 />
    <Memo6 />
    <Memo7>1.00000</Memo7>
    <Memo8>0.00000</Memo8>
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
  <FromTableSeq>48</FromTableSeq>
  <FromSeq>${this.escapeXml(item.PermitSeq || '0')}</FromSeq>
  <FromSerl>${this.escapeXml(item.PermitSerl || '0')}</FromSerl>
  <FromSubSerl>0</FromSubSerl>
  <ToTableSeq>49</ToTableSeq>
  <FromQty>${this.escapeXml(item.PermitQty || '0')}</FromQty>
  <FromSTDQty>${this.escapeXml(item.PermitQty || '0')}</FromSTDQty>
  <FromAmt>${this.escapeXml(item.PermitAmt || '0')}</FromAmt>
  <FromVAT>0</FromVAT> 
  <PrevFromTableSeq>43</PrevFromTableSeq>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
  <ToSeq>${this.escapeXml(item.DelvSeq || '0')}</ToSeq>
  <ToSerl>${this.escapeXml(item.DelvSerl || '0')}</ToSerl>
  <ToQty>${this.escapeXml(item.Qty || '0')}</ToQty>
  <ToSTDQty>${this.escapeXml(item.Qty || '0')}</ToSTDQty>
  <ToAmt>${this.escapeXml(item.CurAmt || '0')}</ToAmt>
  <DomAmt>${this.escapeXml(item.CurAmt || '0')}</DomAmt>
  <ToPrice>${this.escapeXml(item.Price || '0')}</ToPrice>
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
    <InOutSeq>${this.escapeXml(item.DelvSeq || '')}</InOutSeq>
    <InOutType>240</InOutType>
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

  async generateXMLSSLImpDeliveryListQueryWEB(
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

  async generateXMLSSLImpDeliveryItemListQueryWEB(
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
    <TableName>_TPUORDPO</TableName>
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

  async generateXMLSPUORDPOListQueryWEB(
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
    <PODateFr>${this.escapeXml(item.PODateFr || '')}</PODateFr>
    <PODateTo>${this.escapeXml(item.PODateTo || '')}</PODateTo>
    <DelvDateFr />
    <DelvDateTo />
    <SMCurrStatus>${this.escapeXml(item.SMCurrStatus || '')}</SMCurrStatus>
    <SMImpType />
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <POMngNo>${this.escapeXml(item.POMngNo || '')}</POMngNo>
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

  async generateXMLSPUORDPOMasterQueryWEB(
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

  async generateXMLSPUORDPOSheetQueryWEB(
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

  async generateXMLSPUORDPOMasterLinkQueryWEB(
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
    <POAmd>0</POAmd>
    <POSeq>${this.escapeXml(item.POSeq || '0')}</POSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSPUORDPOSheetLinkQueryWEB(
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
    <POAmd>0</POAmd>
    <POSeq>${this.escapeXml(item.POSeq || '0')}</POSeq>
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
  async generateXMLSPUORDPOItemListQueryWEB(
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
    <POMngNo>${this.escapeXml(item.POMngNo || '')}</POMngNo>
    <SMCurrStatus>${this.escapeXml(item.SMCurrStatus || '')}</SMCurrStatus>
    <SMImpType />
    <IsPJTPur />
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <SMAssetType />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <PODateFr>${this.escapeXml(item.PODateFr || '')}</PODateFr>
    <PODateTo>${this.escapeXml(item.PODateTo || '')}</PODateTo>
    <PurGroupDeptSeq>307</PurGroupDeptSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
