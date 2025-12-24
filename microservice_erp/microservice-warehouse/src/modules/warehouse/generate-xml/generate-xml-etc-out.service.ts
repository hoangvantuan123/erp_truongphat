import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlEtcOutService {
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
  //Etc Out Req List
  async generateXMLSLGInOutReqListQueryWEB(
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
    <InOutReqType>${this.escapeXml(item.InOutReqType || '')}</InOutReqType>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <ReqDateFr>${this.escapeXml(item.ReqDateFr || '')}</ReqDateFr>
    <ReqDateTo>${this.escapeXml(item.ReqDateTo || '')}</ReqDateTo>
    <OutWHSeq>${this.escapeXml(item.OutWHSeq || '')}</OutWHSeq>
    <OutWHName>${this.escapeXml(item.OutWHName || '')}</OutWHName>
    <ReqNo>${this.escapeXml(item.ReqNo || '')}</ReqNo>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <SMProgressType>${this.escapeXml(item.SMProgressType || '')}</SMProgressType>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutReqItemListQueryWEB(
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
    <InOutReqType>${this.escapeXml(item.InOutReqType || '')}</InOutReqType>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <ReqDateFr>${this.escapeXml(item.ReqDateFr || '')}</ReqDateFr>
    <ReqDateTo>${this.escapeXml(item.ReqDateTo || '')}</ReqDateTo>
    <OutWHSeq>${this.escapeXml(item.OutWHSeq || '')}</OutWHSeq>
    <OutWHName>${this.escapeXml(item.OutWHName || '')}</OutWHName>
    <SMProgressType>${this.escapeXml(item.SMProgressType || '')}</SMProgressType>
    <SMProgressTypeName>${this.escapeXml(item.SMProgressTypeName || '')}</SMProgressTypeName>
    <InOutReqDetailKind>${this.escapeXml(item.InOutReqDetailKind || '')}</InOutReqDetailKind>
    <InOutReqDetailKindName>${this.escapeXml(item.InOutReqDetailKindName || '')}</InOutReqDetailKindName>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <AssetSeq />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <ReqNo>${this.escapeXml(item.ReqNo || '')}</ReqNo>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutItemListQueryWEB(
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
    <InOutType>${this.escapeXml(item.InOutType || '')}</InOutType>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <InOutDateFr>${this.escapeXml(item.InOutDateFr || '')}</InOutDateFr>
    <InOutDateTo>${this.escapeXml(item.InOutDateTo || '')}</InOutDateTo>
    <InOutDetailKind>${this.escapeXml(item.InOutDetailKind || '')}</InOutDetailKind>
    <InOutDetailKindName>${this.escapeXml(item.InOutDetailKindName || '')}</InOutDetailKindName>
    <OutWHSeq>${this.escapeXml(item.OutWHSeq || '')}</OutWHSeq>
    <OutWHName>${this.escapeXml(item.OutWHName || '')}</OutWHName>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <UseDeptSeq />
    <UseDeptName/>
    <ReqNo>${this.escapeXml(item.ReqNo || '')}</ReqNo>
    <InOutNo>${this.escapeXml(item.InOutNo || '')}</InOutNo>
    <AssetSeq />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutReqQueryWEB(result: number) {
    const xmlBlocks = `
        <DataBlock1>
    <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <ReqSeq>${result}</ReqSeq>
  </DataBlock1>`;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutReqItemQueryWEB(result: number) {
    const xmlBlocks = `
        <DataBlock2>
    <IDX_NO>1</IDX_NO>
    <ReqSeq>${result}</ReqSeq>
  </DataBlock2>`;

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
    <CfmSeq>${this.escapeXml(item.ReqSeq || '')}</CfmSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <TableName>_TLGInOutReq</TableName>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutReqStopSaveWEB(
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
    <ReqSeq>${this.escapeXml(item.ReqSeq || '')}</ReqSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSCOMCloseCheckWEB(
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
    <Date>${this.escapeXml(item.ReqDate || '')}</Date>
    <ServiceSeq>2631</ServiceSeq>
    <MethodSeq>1</MethodSeq>
    <DtlUnitSeq>1</DtlUnitSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutReqCheckWEB(
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
    <ReqSeq>${this.escapeXml(item.ReqSeq || '0')}</ReqSeq>
    <ReqNo>${this.escapeXml(item.ReqNo || '')}</ReqNo>
    <InOutReqType>${this.escapeXml(item.InOutReqType || '')}</InOutReqType>
    <IsTrans>0</IsTrans>
    <InOutReqDetailType>0</InOutReqDetailType>
    <IsStop>${this.escapeXml(item.IsStop || '')}</IsStop>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <ReqDate>${this.escapeXml(item.ReqDate || '')}</ReqDate>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <OutWHSeq>${this.escapeXml(item.OutWHSeq || '')}</OutWHSeq>
    <OutWHName>${this.escapeXml(item.OutWHName || '')}</OutWHName>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <CompleteWishDate>${this.escapeXml(item.CompleteWishDate || '')}</CompleteWishDate>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutReqItemCheckWEB(
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
    <ReqSerl>${this.escapeXml(item.ReqSerl || '')}</ReqSerl>
    <InOutReqKind>${this.escapeXml(item.InOutReqKind || '')}</InOutReqKind>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <InOutReqDetailKindName>${this.escapeXml(item.InOutReqDetailKindName || '')}</InOutReqDetailKindName>
    <InOutReqDetailKind>${this.escapeXml(item.InOutReqDetailKind || '')}</InOutReqDetailKind>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDUnitSeq>${this.escapeXml(item.UnitSeq || '')}</STDUnitSeq>
    <STDQty>${this.escapeXml(item.Amt || '0')}</STDQty>
    <CCtrName>${this.escapeXml(item.Price || '0')}</CCtrName>
    <CCtrSeq></CCtrSeq>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <LotNo />
    <InventorySeq>${this.escapeXml(item.InventorySeq || '0')}</InventorySeq>
    <InventoryRemark>${this.escapeXml(item.InventoryRemark || '')}</InventoryRemark>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <ReqSeq>${this.escapeXml(item.ReqSeq || '')}</ReqSeq>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutInventoryCheckWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
    <WorkingTag>${this.escapeXml(item.Status || '')}</WorkingTag>
    <IDX_NO>${this.escapeXml(item.IdxNo || '')}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>1</Selected>
    <OutWHSeq>${this.escapeXml(item.OutWHSeq || '0')}</OutWHSeq>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
	  <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
  </DataBlock3>`,
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
    <CfmSeq>${this.escapeXml(item.ReqSeq || '')}</CfmSeq>
    <TableName>_TLGInOutReq</TableName>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutReqSaveWEB(
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
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <BizUnit>${this.escapeXml(item.BizUnit || '0')}</BizUnit>
    <ReqNo>${this.escapeXml(item.ReqNo || '')}</ReqNo>
    <ReqDate>${this.escapeXml(item.ReqDate || '')}</ReqDate>
    <CompleteWishDate>${this.escapeXml(item.CompleteWishDate || '')}</CompleteWishDate>
    <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '0')}</DeptSeq>
    <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '0')}</EmpSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <CustSeq>${this.escapeXml(item.CustSeq || '0')}</CustSeq>
    <OutWHName>${this.escapeXml(item.OutWHName || '')}</OutWHName>
    <OutWHSeq>${this.escapeXml(item.OutWHSeq || '0')}</OutWHSeq>
    <InOutReqType>${this.escapeXml(item.InOutReqType || '')}</InOutReqType>
    <InOutReqDetailType>0</InOutReqDetailType>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <IsTrans>${this.escapeXml(item.IsTrans || '0')}</IsTrans>
    <IsStop>${this.escapeXml(item.IsStop || '0')}</IsStop>
    <ReqSeq>${this.escapeXml(item.ReqSeq || '0')}</ReqSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutReqItemSaveWEB(
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
    <ReqSeq>${this.escapeXml(item.ReqSeq || '')}</ReqSeq>
    <ReqSerl>${this.escapeXml(item.ReqSerl || '')}</ReqSerl>
    <InOutReqKind>${this.escapeXml(item.InOutReqKind || '')}</InOutReqKind>
    <InOutReqDetailKindName>${this.escapeXml(item.InOutReqDetailKindName || '')}</InOutReqDetailKindName>
    <InOutReqDetailKind>${this.escapeXml(item.InOutReqDetailKind || '')}</InOutReqDetailKind>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <STDUnitName>${this.escapeXml(item.STDUnitName || '')}</STDUnitName>
    <STDUnitSeq>${this.escapeXml(item.STDUnitSeq || '')}</STDUnitSeq>
    <STDQty>${this.escapeXml(item.STDQty || '0')}</STDQty>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <CCtrName>${this.escapeXml(item.CCtrName || '0')}</CCtrName>
    <CCtrSeq></CCtrSeq>
    <LotNo />
    <InventorySeq>${this.escapeXml(item.InventorySeq || '0')}</InventorySeq>
    <InventoryRemark>${this.escapeXml(item.InventoryRemark || '')}</InventoryRemark>
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
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <TableName>_TLGInOutReq</TableName>
    <CfmSeq>${this.escapeXml(item.ReqSeq || '')}</CfmSeq>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  //FrmEtcIn
  async generateXMLSLGEtcInReqQuery2WEB(result: number) {
    const xmlBlocks = `
      <DataBlock1>
  <WorkingTag>U</WorkingTag>
  <IDX_NO>1</IDX_NO>
  <Status>0</Status>
  <DataSeq>1</DataSeq>
  <Selected>1</Selected>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
  <IsChangedMst>0</IsChangedMst>
  <ReqSeq>${result}</ReqSeq>
</DataBlock1>`;

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
  <OriLotNo>${this.escapeXml(item.OriLotNo || '')}</OriLotNo>
  <OriItemName />
  <OriItemNo />
  <OriSpec />
  <OriItemSeq>${this.escapeXml(item.ItemSeq || '0')}</OriItemSeq>
  <LotNoOLD>${this.escapeXml(item.LotNo || '')}</LotNoOLD>
  <ItemSeqOLD>${this.escapeXml(item.ItemSeq || '0')}</ItemSeqOLD>
  <InNo>${this.escapeXml(item.InOutNo || '')}</InNo>
  <SupplyCustSeq>${this.escapeXml(item.CustSeq || '0')}</SupplyCustSeq>
  <LotSeq>0</LotSeq>
  <PgmSeqModifying />
  <Dummy1></Dummy1>
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

  async generateXMLSEtcInQRCheckWEB(
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
	<InOutReqSeq>${this.escapeXml(item.InOutReqSeq || '0')}</InOutReqSeq>
	<InOutReqItemSerl>${this.escapeXml(item.InOutReqItemSerl || '0')}</InOutReqItemSerl>
    <BizUnit></BizUnit>
    <BizUnitName></BizUnitName>
    <InWHSeq></InWHSeq>
    <InWHName></InWHName>
	<OutWHSeq>${this.escapeXml(item.OutWHSeq || '0')}</OutWHSeq>
    <OutWHName></OutWHName>	
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '0')}</UnitSeq>
    <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <DateCode>${this.escapeXml(item.DateCode || '')}</DateCode>
    <ReelNo>${this.escapeXml(item.ReelNo || '')}</ReelNo>
    <Barcode>${this.escapeXml(item.Barcode || '')}</Barcode>
    <InOutDetailKind>${this.escapeXml(item.InOutDetailKind || '0')}</InOutDetailKind>
	<InOutDetailKindName>${this.escapeXml(item.InOutDetailKindName || '')}</InOutDetailKindName>
  <Price>${this.escapeXml(item.Price || '0')}</Price>
	<Amt>${this.escapeXml(item.Amt || '0')}</Amt>
  <InOutReqType>${this.escapeXml(item.InOutReqType || '0')}</InOutReqType>
  <ReqQty>${this.escapeXml(item.ReqQty || '0')}</ReqQty>
  <ScanQty>${this.escapeXml(item.ScanQty || '0')}</ScanQty>
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
  <Date>${this.escapeXml(item.InOutDate || '')}</Date>
  <ServiceSeq>2669</ServiceSeq>
  <MethodSeq>2</MethodSeq>
  <DtlUnitSeq>1</DtlUnitSeq>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutDailyCheckWEB(
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
  <InOutSeq>${this.escapeXml(item.InOutSeq || '')}</InOutSeq>
  <InOutType>${this.escapeXml(item.InOutType || '')}</InOutType>
  <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
  <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
  <InOutDate>${this.escapeXml(item.InOutDate || '')}</InOutDate>
  <InOutNo>${this.escapeXml(item.InOutNo || '')}</InOutNo>
  <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
  <CustName>${this.escapeXml(item.CustName || '')}</CustName>
  <OutWHSeq>${this.escapeXml(item.OutWHSeq || '')}</OutWHSeq>
  <OutWHName>${this.escapeXml(item.OutWHName || '')}</OutWHName>
  <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
  <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
  <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
  <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
  <UseDeptSeq>${this.escapeXml(item.DeptSeq || '')}</UseDeptSeq>
  <UseDeptName>${this.escapeXml(item.DeptName || '')}</UseDeptName>
  <Remark>${this.escapeXml(item.Remark || '')}</Remark>
  <Memo>WEB</Memo>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutDailyItemCheckWEB(
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
  <InOutSerl>${this.escapeXml(item.InOutSerl || '')}</InOutSerl>
  <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
  <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
  <Spec>${this.escapeXml(item.Spec || '')}</Spec>
  <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <Amt>${this.escapeXml(item.Amt || '0')}</Amt>
    <InOutDetailKindName>${this.escapeXml(item.InOutDetailKindName || '')}</InOutDetailKindName>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDQty>${this.escapeXml(item.Qty || '')}</STDQty>
    <InWHName />
    <InOutKindName />
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <SerialNo />
    <InOutRemark>${this.escapeXml(item.InOutRemark || '')}</InOutRemark>
    <DVPlaceName />
    <OriItemName />
    <OriUnitName />
    <CCtrName />
    <OriSTDQty>0</OriSTDQty>
    <OriQty>0</OriQty>
    <OriItemSeq>0</OriItemSeq>
    <OriUnitSeq>0</OriUnitSeq>
    <IsStockSales />
    <InOutDetailKind>${this.escapeXml(item.InOutDetailKind || '')}</InOutDetailKind>
    <InOutKind>8023004</InOutKind>
    <EtcOutVAT>0</EtcOutVAT>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '0')}</UnitSeq>
    <OutWHSeq>${this.escapeXml(item.OutWHSeq || '0')}</OutWHSeq>
    <InWHSeq>${this.escapeXml(item.InWHSeq || '0')}</InWHSeq>
    <DVPlaceSeq>0</DVPlaceSeq>
    <CCtrSeq>0</CCtrSeq>
    <EtcOutAmt>0</EtcOutAmt>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <OutWHName />
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <InOutSeq>${this.escapeXml(item.InOutSeq || '0')}</InOutSeq>
    <InOutType>${this.escapeXml(item.InOutType || '0')}</InOutType>
</DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutDailySaveWEB(
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
  <InOutSeq>${this.escapeXml(item.InOutSeq || '')}</InOutSeq>
  <InOutType>${this.escapeXml(item.InOutType || '')}</InOutType>
  <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
  <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
  <InOutDate>${this.escapeXml(item.InOutDate || '')}</InOutDate>
  <InOutNo>${this.escapeXml(item.InOutNo || '')}</InOutNo>
  <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
  <CustName>${this.escapeXml(item.CustName || '')}</CustName>
  <OutWHSeq>${this.escapeXml(item.OutWHSeq || '')}</OutWHSeq>
  <OutWHName>${this.escapeXml(item.OutWHName || '')}</OutWHName>
  <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
  <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
  <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
  <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
  <UseDeptSeq>${this.escapeXml(item.DeptSeq || '')}</UseDeptSeq>
  <UseDeptName>${this.escapeXml(item.DeptName || '')}</UseDeptName>
  <Remark>${this.escapeXml(item.Remark || '')}</Remark>
  <Memo>WEB</Memo>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutDailyItemSaveWEB(
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
  <Selected>1</Selected>
  <InOutSerl>${this.escapeXml(item.InOutSerl || '')}</InOutSerl>
  <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
  <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
  <Spec>${this.escapeXml(item.Spec || '')}</Spec>
  <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
    <Price>${this.escapeXml(item.Price || '0')}</Price>
    <Qty>${this.escapeXml(item.Qty || '0')}</Qty>
    <Amt>${this.escapeXml(item.Amt || '0')}</Amt>
    <InOutDetailKindName>${this.escapeXml(item.InOutDetailKindName || '')}</InOutDetailKindName>
    <STDUnitName>${this.escapeXml(item.UnitName || '')}</STDUnitName>
    <STDQty>${this.escapeXml(item.Qty || '')}</STDQty>
    <InWHName />
    <InOutKindName />
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <SerialNo />
    <InOutRemark>${this.escapeXml(item.InOutRemark || '')}</InOutRemark>
    <DVPlaceName />
    <OriItemName />
    <OriUnitName />
    <CCtrName />
    <OriSTDQty>0</OriSTDQty>
    <OriQty>0</OriQty>
    <OriItemSeq>0</OriItemSeq>
    <OriUnitSeq>0</OriUnitSeq>
    <IsStockSales />
    <InOutDetailKind>${this.escapeXml(item.InOutDetailKind || '')}</InOutDetailKind>
    <InOutKind>8023004</InOutKind>
    <EtcOutVAT>0</EtcOutVAT>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '0')}</UnitSeq>
    <OutWHSeq>${this.escapeXml(item.OutWHSeq || '0')}</OutWHSeq>
    <InWHSeq>${this.escapeXml(item.InWHSeq || '0')}</InWHSeq>
    <DVPlaceSeq>0</DVPlaceSeq>
    <CCtrSeq>0</CCtrSeq>
    <EtcOutAmt>0</EtcOutAmt>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <OutWHName />
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <InOutSeq>${this.escapeXml(item.InOutSeq || '0')}</InOutSeq>
    <InOutType>${this.escapeXml(item.InOutType || '0')}</InOutType>
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
  <IDX_NO>${this.escapeXml(item.IdxNo || '')}</IDX_NO>
  <DataSeq>${index + 1}</DataSeq>
  <Status>0</Status>
  <Selected>1</Selected>
  <FromTableSeq>15</FromTableSeq>
  <FromSeq>${this.escapeXml(item.ReqSeq || '0')}</FromSeq>
  <FromSerl>${this.escapeXml(item.ReqSerl || '0')}</FromSerl>
  <FromSubSerl>0</FromSubSerl>
  <ToTableSeq>14</ToTableSeq>
  <FromQty>${this.escapeXml(item.ReqQty || '0')}</FromQty>
  <FromSTDQty>${this.escapeXml(item.ReqQty || '0')}</FromSTDQty>
  <FromAmt>0</FromAmt>
  <FromVAT>0</FromVAT> 
  <PrevFromTableSeq>0</PrevFromTableSeq>
  <TABLE_NAME>DataBlock1</TABLE_NAME>
  <ToSeq>${this.escapeXml(item.InOutSeq || '0')}</ToSeq>
  <ToSerl>${this.escapeXml(item.InOutSerl || '0')}</ToSerl>
  <ToSubSerl>${this.escapeXml(item.InOutType || '0')}</ToSubSerl>
  <ToQty>${this.escapeXml(item.Qty || '0')}</ToQty>
  <ToSTDQty>${this.escapeXml(item.Qty || '0')}</ToSTDQty>
  <ToAmt>${this.escapeXml(item.Amt || '0')}</ToAmt>
  <ToPrice>${this.escapeXml(item.Price || '0')}</ToPrice>
</DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutTPQueryWEB(result: number) {
    const xmlBlocks = `
        <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <InOutSeq>${result}</InOutSeq>
  </DataBlock1>`;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGInOutTPItemQueryWEB(result: number) {
    const xmlBlocks = `
        <DataBlock2>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <InOutSeq>${result}</InOutSeq>
  </DataBlock2>`;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
