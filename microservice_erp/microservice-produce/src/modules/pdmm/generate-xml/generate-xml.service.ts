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

  generateXMLSPDMMOutReqItemStockQuery(results: any[]): string {
    return `<ROOT>
      ${results
        .map(
          (result, index) => `
        <DataBlock3>
          <WorkingTag>${result.WorkingTag ?? ''}</WorkingTag>
          <IDX_NO>${index + 1}</IDX_NO>
          <Status>0</Status>
          <DataSeq>${index + 1}</DataSeq>
          <Selected>1</Selected>
          <IsChangedMst>0</IsChangedMst>
          <ItemSeq>${result.ItemSeq || ''}</ItemSeq>
         <OutWHSeq>${result.Memo4 || ''}</OutWHSeq>
          <Qty>${result.Qty ?? ''}</Qty>
          <TABLE_NAME>DataBlock3</TABLE_NAME>
          <FactUnit>${result.FactUnit ?? ''}</FactUnit>
        </DataBlock3>`,
        )
        .join('')}
    </ROOT>`;
  }

  generateXMLSPDMMOutReqQuery(result: any): string {
    return `<ROOT> 
     <DataBlock1>
      <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <OutReqSeq>${result.OutReqSeq ?? ''}</OutReqSeq>
  </DataBlock1>
</ROOT>`;
  }
  generateXMLSPDMMOutReqItemQuery(result: any): string {
    return `<ROOT> 
     <DataBlock3>
      <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <OutReqSeq>${result.OutReqSeq ?? ''}</OutReqSeq>
  </DataBlock3>
</ROOT>`;
  }
  generateXMLSPDMMOutReqListQuery(result: any): string {
    return `<ROOT> 
     <DataBlock1>
     <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <ReqDate>${result.ReqDate ?? ''}</ReqDate>
    <ReqDateTo>${result.ReqDateTo ?? ''}</ReqDateTo>
    <OutReqNo>${result.OutReqNo ?? ''}</OutReqNo>
    <UseType>${result.UseType ?? ''}</UseType>
    <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
    <DeptName>${result.DeptName ?? ''}</DeptName>
    <EmpSeq>${result.EmpSeq ?? ''}</EmpSeq>
    <EmpName>${result.EmpName ?? ''}</EmpName>
    <CustSeq>${result.CustSeq ?? ''}</CustSeq>
    <CustName>${result.CustName ?? ''}</CustName>
    <ProgStatus>${result.ProgStatus ?? ''}</ProgStatus>
    <ProdPlanNo>${result.ProdPlanNo ?? ''}</ProdPlanNo>
    <WorkOrderNo>${result.WorkOrderNo ?? ''}</WorkOrderNo>
    <ProdReqNo>${result.ProdReqNo ?? ''}</ProdReqNo>
  </DataBlock1>
</ROOT>`;
  }
  generateXMLSCOMConfirm(result: any): string {
    return `<ROOT> 
     <DataBlock1>
     <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <CfmCode>${result.CfmCode ?? ''}</CfmCode>
    <CfmSeq>${result.CfmSeq ?? ''}</CfmSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <TableName>_TPDMMOutReqM</TableName>
  </DataBlock1>
</ROOT>`;
  }

  generateXMLSPDMMOutReqCancel(result: any): string {
    return `<ROOT> 
    <DataBlock1>
     <WorkingTag>U</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <IsConfirm>${result.IsConfirm ?? ''}</IsConfirm>
    <IsStop>${result.IsStop ?? ''}</IsStop>
    <Qty>${result.Qty ?? ''}</Qty>
    <ProgStatusName>${result.ProgStatusName ?? ''}</ProgStatusName>
    <OutReqSeq>${result.OutReqSeq ?? ''}</OutReqSeq>
    <ProgStatus>${result.ProgStatus ?? ''}</ProgStatus>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>
</ROOT>`;
  }
  generateXMLSPDMMOutProcItemListQuery(result: any): string {
    return `
<ROOT> 
    <DataBlock1>
        <WorkingTag>A</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <Status>0</Status>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
        <TABLE_NAME>DataBlock1</TABLE_NAME>
        <IsChangedMst>0</IsChangedMst>
        <IsMatSum>0</IsMatSum>
        <FactUnit>${result.FactUnit ?? ''}</FactUnit>
        <FactUnitName>${result.FactUnitName ?? ''}</FactUnitName>
        <MatOutDate>${result.MatOutDate ?? ''}</MatOutDate>
        <MatOutDateTo>${result.MatOutDateTo ?? ''}</MatOutDateTo>
        <OutWHSeq>${result.OutWHSeq ?? ''}</OutWHSeq>
        <InWHSeq>${result.InWHSeq ?? ''}</InWHSeq>
        <UseType>${result.UseType ?? ''}</UseType>
        <MatOutType>${result.MatOutType ?? ''}</MatOutType>
        <EmpName>${result.EmpName ?? ''}</EmpName>
        <MatOutNo>${result.MatOutNo ?? ''}</MatOutNo>
        <ProdPlanNo>${result.ProdPlanNo ?? ''}</ProdPlanNo>
        <WorkOrderNo>${result.WorkOrderNo ?? ''}</WorkOrderNo>
        <ItemName>${result.ItemName ?? ''}</ItemName>
        <ItemNo>${result.ItemNo ?? ''}</ItemNo>
        <OutReqNo>${result.OutReqNo ?? ''}</OutReqNo>
        <AssetSeq>${result.AssetSeq ?? ''}</AssetSeq>
        <WorkCenterSeq>${result.WorkCenterSeq ?? ''}</WorkCenterSeq>
        <WorkCenterName>${result.WorkCenterName ?? ''}</WorkCenterName>
        <ItemLotNo>${result.ItemLotNo ?? ''}</ItemLotNo>
    </DataBlock1>
</ROOT>`;
  }

  /* SAVE CHECK */
  /* CHECK */

  generateXMLSPDMMOutReq(result: any, WorkingTag: string): string {
    return `<ROOT> 
    <DataBlock1>
       <WorkingTag>${WorkingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <IsConfirm>${result.IsConfirm ?? 0}</IsConfirm>
    <SupplyContCustSeq>${result.SupplyContCustSeq ?? ''}</SupplyContCustSeq>
    <OutReqSeq>${result.OutReqSeq ?? ''}</OutReqSeq>
    <OutReqNo>${result.OutReqNo ?? ''}</OutReqNo>
    <IsOutSide>${result.IsOutSide ?? 0}</IsOutSide>
    <UseType>${result.UseType ?? 6044002}</UseType>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <ReqDate>${result.ReqDate ?? ''}</ReqDate>
    <EmpSeq>${result.EmpSeq ?? ''}</EmpSeq>
    <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
    <Remark>${result.Remark ?? ''}</Remark>
    <IsReturn>${result.IsReturn ?? 0}</IsReturn>
  </DataBlock1>
</ROOT>`;
  }
  generateXMLSPDMMOutReqSave(result: any, WorkingTag: string): string {
    return `<ROOT> 
    <DataBlock1>
       <WorkingTag>${WorkingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <OutReqSeq>${result.OutReqSeq ?? 0}</OutReqSeq>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <OutReqNo>${result.OutReqNo ?? ''}</OutReqNo>
    <ReqDate>${result.ReqDate ?? ''}</ReqDate>
    <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
    <EmpSeq>${result.EmpSeq ?? ''}</EmpSeq>
    <UseType>6044002</UseType>
    <IsConfirm>${result.IsConfirm ?? 0}</IsConfirm>
    <IsReturn>${result.IsReturn ?? 0}</IsReturn>
    <Remark>${result.Remark ?? ''}</Remark>
    <IsOutSide>${result.IsOutSide ?? 0}</IsOutSide>
    <SupplyContCustSeq>0</SupplyContCustSeq>
  </DataBlock1>
</ROOT>`;
  }
  generateXMLSPDMMOutReqItemCheck(
    result: Array<{ [key: string]: any }>,
    OutReqSeq: number,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
         <DataBlock3>
     <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <WorkOrderNo />
    <ProdPlanNo />
    <PJTName />
    <PJTNo />
    <WBSName />
    <ItemName>${item.ItemName || ''}</ItemName>
    <ItemNo>${item.ItemNo || ''}</ItemNo>
    <Spec>${item.Spec || ''}</Spec>
    <UnitName>${item.UnitName || ''}</UnitName>
    <NeedQty>${item.NeedQty || 0}</NeedQty>
    <WorkDate />
    <WorkStartTime />
    <OutReqSeq>${OutReqSeq || ''}</OutReqSeq>
    <OutReqItemSerl>${item.OutReqItemSerl || ''}</OutReqItemSerl>
    <WorkOrderSeq>${item.WorkOrderSeq || ''}</WorkOrderSeq>
    <ItemSeq>${item.ItemSeq || ''}</ItemSeq>
    <UnitSeq>${item.UnitSeq || ''}</UnitSeq>
    <PJTSeq>${item.PJTSeq || ''}</PJTSeq>
    <WorkCenterName>${item.WorkCenterName || ''}</WorkCenterName>
    <WBSSeq>${item.WBSSeq || ''}</WBSSeq>
    <WorkCenterSeq>${item.WorkCenterSeq || ''}</WorkCenterSeq>
    <WorkOrderSerl>${item.WorkOrderSerl || ''}</WorkOrderSerl>
      <OutWHName>${item.OutWHName || ''}</OutWHName>
     <WorkDate xml:space="preserve">        </WorkDate>
    <WorkStartTime xml:space="preserve">    </WorkStartTime>
    <Memo1>${item.Memo1 || ''}</Memo1>
    <Memo2>${item.Memo2 || ''}</Memo2>
    <Memo3>${item.Memo3 || ''}</Memo3>
    <Memo4>${item.Memo4 || 0}</Memo4>
    <Memo5>${item.Memo5 || 0}</Memo5>
    <Memo6>${item.Memo6 || 0}</Memo6>
    <CustName />
    <Qty>${item.Qty || 0}</Qty>
    <Remark>${item.Remark || ''}</Remark>
    <CustSeq>${item.CustSeq || ''}</CustSeq>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
  </DataBlock3>
  
  `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSPDMMOutReqItem(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
     <WorkingTag>${workingTag}</WorkingTag>
     <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <OutReqSeq>${item.OutReqSeq || ''}</OutReqSeq>
    <OutReqItemSerl>${item.OutReqItemSerl || item.OutReqItemSerl}</OutReqItemSerl>
       <WorkOrderSeq>${item.WorkOrderSeq || ''}</WorkOrderSeq>
   <ItemSeq>${item.ItemSeq || ''}</ItemSeq>
    <UnitSeq>${item.UnitSeq || ''}</UnitSeq>
       <Qty>${item.Qty || 0}</Qty>
    <Remark>${item.Remark ?? ''}</Remark>
       <ItemName>${item.ItemName || ''}</ItemName>
    <ItemNo>${item.ItemNo || ''}</ItemNo>
    <Spec>${item.Spec || ''}</Spec>
    <UnitName>${item.UnitName || ''}</UnitName>
    <NeedQty>0.00000</NeedQty>
    <WorkOrderNo />
    <WorkDate xml:space="preserve">        </WorkDate>
    <WorkStartTime xml:space="preserve">    </WorkStartTime>
    <PJTSeq>0</PJTSeq>
    <WBSSeq>0</WBSSeq>
    <PJTNo />
    <PJTName />
    <WBSName />
    <CustName />
    <CustSeq>0</CustSeq>
    <WorkCenterSeq>${item.WorkCenterSeq || 0}</WorkCenterSeq>
    <WorkCenterName>${item.WorkCenterName || ''}</WorkCenterName>
    <OutWHName>${item.OutWHName || ''}</OutWHName>
    <WorkOrderSerl>${item.WorkOrderSerl || ''}</WorkOrderSerl>
    <ProdPlanNo />
   <Memo1>${item.Memo1 || ''}</Memo1>
    <Memo2>${item.Memo2 || ''}</Memo2>
    <Memo3>${item.Memo3 || ''}</Memo3>
    <Memo4>${item.Memo4 || 0}</Memo4>
    <Memo5>${item.Memo5 || 0}</Memo5>
    <Memo6>${item.Memo6 || 0}</Memo6>
  </DataBlock3>
  
  `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}  <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <IsConfirm>0</IsConfirm>
  </DataBlock1></ROOT>`;
  }

  generateXMLSCOMSourceDailySave(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
       <DataBlock1>
     <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${index + 1}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <FromTableSeq>0</FromTableSeq>
    <FromSeq>0</FromSeq>
    <FromSerl>0</FromSerl>
    <FromSubSerl>0</FromSubSerl>
    <ToTableSeq>0</ToTableSeq>
    <FromQty>0</FromQty>
    <FromSTDQty>0</FromSTDQty>
    <FromAmt>0</FromAmt>
    <FromVAT>0</FromVAT>
    <PrevFromTableSeq>0</PrevFromTableSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <ToSeq>${item.OutReqSeq || 0}</ToSeq>
    <ToSerl>${index + 1}</ToSerl>
    <ToQty>${item.Qty || 0}</ToQty>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSCOMConfirmCreate(result: any): string {
    return `<ROOT> 
    <DataBlock1>
     <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <TableName>_TPDMMOutReqM</TableName>
    <CfmSeq>${result.OutReqSeq}</CfmSeq>
  </DataBlock1>
</ROOT>`;
  }

  generateXMLSCOMConfirmDelete(result: any, WorkingTag: string): string {
    return `<ROOT> 
    <DataBlock1>
    <WorkingTag>${result.WorkingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>${result.IsChangedMst}</IsChangedMst>
    <CfmSeq>${result.OutReqSeq}</CfmSeq>
    <TableName>_TPDMMOutReqM</TableName>
  </DataBlock1>
</ROOT>`;
  }

  generateXMLSPDMMOutReqItemListQuery(result: any): string {
    return `<ROOT> 
     <DataBlock1>
     <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
   <FactUnit>${result.FactUnit ?? ''}</FactUnit>
      <ReqDate>${result.ReqDate ?? ''}</ReqDate>
      <ReqDateTo>${result.ReqDateTo ?? ''}</ReqDateTo>
      <WorkDate>${result.WorkDate ?? ''}</WorkDate>
      <WorkDateTo>${result.WorkDateTo ?? ''}</WorkDateTo>
      <UseType>${result.UseType ?? ''}</UseType>
      <WorkCenterSeq>${result.WorkCenterSeq ?? ''}</WorkCenterSeq>
      <WorkCenterName>${result.WorkCenterName ?? ''}</WorkCenterName>
      <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
      <DeptName>${result.DeptName ?? ''}</DeptName>
      <EmpSeq>${result.EmpSeq ?? ''}</EmpSeq>
      <EmpName>${result.EmpName ?? ''}</EmpName>
      <OutReqNo>${result.OutReqNo ?? ''}</OutReqNo>
      <InWHSeq>${result.InWHSeq ?? ''}</InWHSeq>
      <AssyAssetSeq>${result.AssyAssetSeq ?? ''}</AssyAssetSeq>
      <WorkOrderNo>${result.WorkOrderNo ?? ''}</WorkOrderNo>
      <ProcName>${result.ProcName ?? ''}</ProcName>
      <ProgStatus>${result.ProgStatus ?? ''}</ProgStatus>
      <OutWHSeq>${result.OutWHSeq ?? ''}</OutWHSeq>
      <PJTName>${result.PJTName ?? ''}</PJTName>
      <AssetSeq>${result.AssetSeq ?? ''}</AssetSeq>
      <PJTNo>${result.PJTNo ?? ''}</PJTNo>
      <ProdPlanNo>${result.ProdPlanNo ?? ''}</ProdPlanNo>
      <ItemName>${result.ItemName ?? ''}</ItemName>
      <ItemNo>${result.ItemNo ?? ''}</ItemNo>
      <Spec>${result.Spec ?? ''}</Spec>
      <IsReturn>0</IsReturn>
  </DataBlock1>
</ROOT>`;
  }
  generateXMLSCOMSourceDailyJumpQuery(result: any): string {
    return `<ROOT> 
     <DataBlock1>
    <WorkingTag />
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ParamFromSeq>${result.ParamFromSeq}</ParamFromSeq>
    <ParamFromSerl>0</ParamFromSerl>
    <FromTableSeq>0</FromTableSeq>
    <FromSeq>0</FromSeq>
    <FromSerl>0</FromSerl>
    <FromSubSerl>0</FromSubSerl>
    <FromQty>0</FromQty>
    <FromSTDQty>0</FromSTDQty>
    <FromAmt>0</FromAmt>
    <FromVAT>0</FromVAT>
    <FromPgmSeq>0</FromPgmSeq>
    <ToPgmSeq>0</ToPgmSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <FromTableName>_TPDMMOutReqItem</FromTableName>
    <ToTableName>_TPDMMOutItem</ToTableName>
  </DataBlock1>
</ROOT>`;
  }

  generateXMLSPDMMOutProcItemQuery(
    result: Array<{ [key: string]: any }>,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
       <DataBlock3>
    <IDX_NO>${item.IDX_NO || 0}</IDX_NO>
    <FromTableSeq>${item.FromTableSeq || 0}</FromTableSeq>  
    <OutReqSeq>${item.FromSeq || 0}</OutReqSeq>
    <OutReqItemSerl>${item.FromSerl || 0}</OutReqItemSerl>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSMaterialQRStockOutCheck(result: any): string {
    return `<ROOT> 
      <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <InOutReqSeq>${result.InOutReqSeq ?? ''}</InOutReqSeq>
    <InOutReqItemSerl>${result.InOutReqItemSerl ?? ''}</InOutReqItemSerl>
    <BizUnit>${result.BizUnit ?? ''}</BizUnit>
    <BizUnitName>${result.ItemLotNo ?? ''}</BizUnitName>
    <InWHSeq>${result.InWHSeq ?? ''}</InWHSeq>
    <InWHName>${result.InWHName ?? ''}</InWHName>>
    <OutWHSeq>${result.OutWHSeq ?? ''}</OutWHSeq>
    <OutWHName>${result.OutWHName ?? ''}</OutWHName>
    <ItemSeq>${result.ItemSeq ?? ''}</ItemSeq>
    <UnitSeq>${result.UnitSeq ?? ''}</UnitSeq>
    <UnitName>${result.UnitName ?? ''}</UnitName>
    <ItemNo>${result.ItemNo ?? ''}</ItemNo>
    <LotNo>${result.LotNo ?? ''}</LotNo>
    <Qty>${result.Qty ?? ''}</Qty>
    <DateCode>${result.DateCode ?? ''}</DateCode>
    <ReelNo>${result.ReelNo ?? ''}</ReelNo>
    <Barcode>${result.Barcode ?? ''}</Barcode>
	<ReqQty>${result.ReqQty ?? ''}</ReqQty>
	<ScanQty>${result.ScanQty ?? ''}</ScanQty>
	</DataBlock1>
</ROOT>`;
  }

  generateXMLSPDMMOutReqItemList(result: any): string {
    return `<ROOT> 
   <DataBlock1>
     <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
   <OutReqSeq>${result.OutReqSeq ?? ''}</OutReqSeq>
  </DataBlock1>
</ROOT>`;
  }
  generateXMLSPDMMOutProcItemQueryQ(result: any): string {
    return `<ROOT> 
   <DataBlock3>
      <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <MatOutSeq>${result.MatOutSeq ?? ''}</MatOutSeq>
    <MatOutType />
    <MatOutTypeName />
  </DataBlock3>
</ROOT>`;
  }

  /* SAVE */

  generateSCOMCloseCheck(result: any, workingTag: string): string {
    return `<ROOT> 
   <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <Date>${result.InOutDate ?? ''}</Date>
    <ServiceSeq>3032</ServiceSeq>
    <MethodSeq>2</MethodSeq>
    <DtlUnitSeq>1</DtlUnitSeq>
  </DataBlock1>
</ROOT>`;
  }

  generateSCOMCloseCheckD(result: any, workingTag: string): string {
    return `<ROOT> 
   <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <Date>${result.InOutDate ?? ''}</Date>
    <ServiceSeq>3032</ServiceSeq>
    <MethodSeq>2</MethodSeq>
    <DtlUnitSeq>1</DtlUnitSeq>
  </DataBlock1>
</ROOT>`;
  }

  generateSCOMCloseItemCheck(
    result: Array<{ [key: string]: any }>,
    dataMaster: any,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
       <DataBlock2>
    <WorkingTag>${workingTag}</WorkingTag>
       <IDX_NO>${index + 1}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
    <FactUnit>${dataMaster.FactUnit ?? ''}</FactUnit>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <FactUnitOld>${dataMaster.FactUnit ?? ''}</FactUnitOld>
    <DateOld>${dataMaster.InOutDate ?? ''}</DateOld>
    <ServiceSeq>3032</ServiceSeq>
    <MethodSeq>2</MethodSeq>
    <Date>${dataMaster.InOutDate ?? ''}</Date>
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateSPDMMOutProcCheck(
    result: any,
    logsSave: any,
    workingTag: string,
  ): string {
    return `<ROOT> 
  <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <UseType>6044001</UseType>
    <IsOutSide>0</IsOutSide>
    <OutWHSeq >${result.OutWHSeq ?? ''}</OutWHSeq>
    <InWHSeq>${result.InWHSeq ?? ''}</InWHSeq>
    <MatOutSeq>${result.MatOutSeq || logsSave.MatOutSeq || ''}</MatOutSeq>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <MatOutNo>${result.MatOutNo || logsSave.MatOutNo || ''}</MatOutNo>
    <MatOutDate>${result.InOutDate ?? ''}</MatOutDate>
    <EmpSeq>${result.EmpSeq ?? ''}</EmpSeq>
    <MatOutType />
    <Remark>${result.Remark ?? ''}</Remark>
  </DataBlock1>
</ROOT>`;
  }

  generateSPDMMOutProcCheckD(result: any, workingTag: string): string {
    return `<ROOT> 
  <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <UseType>6044001</UseType>
    <IsOutSide>0</IsOutSide>
    <OutWHSeq >${result.OutWHSeq ?? ''}</OutWHSeq>
    <InWHSeq>${result.InWHSeq ?? ''}</InWHSeq>
    <MatOutSeq>${result.MatOutSeq ?? ''}</MatOutSeq>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <MatOutNo>${result.MatOutNo ?? ''}</MatOutNo>
    <MatOutDate>${result.InOutDate ?? ''}</MatOutDate>
    <EmpSeq>${result.EmpSeq ?? ''}</EmpSeq>
    <MatOutType />
   <Remark>${result.Remark ?? ''}</Remark>
  </DataBlock1>
</ROOT>`;
  }

  generateSPDMMOutProcItemCheck(
    result: Array<{ [key: string]: any }>,
    logsSave: any,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
    <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>${item.IDX_NO ?? item.IdxNo}</IDX_NO>
    <DataSeq>${item.DataSeq ?? item.IdxNo}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ReqQty>${item.ReqQty ?? ''}</ReqQty>
    <Qty>${item.Qty ?? ''}</Qty>
    <StdUnitQty>${item.Qty ?? ''}</StdUnitQty>
    <Remark>${item.Remark ?? ''}</Remark>
    <ItemLotNo>${item.LotNo ?? ''}</ItemLotNo>
    <SerialNoFrom />
    <MatOutSeq>${logsSave.MatOutSeq ?? ''}</MatOutSeq>
    <OutItemSerl>${item.OutItemSerl ?? ''}</OutItemSerl>
    <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
    <OutWHSeq>${item.OutWHSeq ?? ''}</OutWHSeq>
    <InWHSeq>${item.InWHSeq ?? ''}</InWHSeq>
    <UnitSeq>${item.UnitSeq ?? ''}</UnitSeq>
    <WorkOrderSeq/>
    <ConsgnmtCustSeq>0</ConsgnmtCustSeq>
    <OutReqSeq>${item.InOutReqSeq ?? ''}</OutReqSeq>
    <OutReqItemSerl>${item.InOutReqItemSerl ?? ''}</OutReqItemSerl>
    <PJTSeq>0</PJTSeq>
    <WBSSeq>0</WBSSeq>
    <WorkOrderSerl/>
    <AlterRate>0</AlterRate>
    <LotNo>${item.ItemLotNo ?? ''}</LotNo>
    <ReelNo>${item.ReelNo ?? ''}</ReelNo>
    <DateCode>${item.DateCode ?? ''}</DateCode>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateSPDMMOutProcItemCheckD(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
    <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>${item.IDX_NO ?? item.IdxNo}</IDX_NO>
    <DataSeq>${item.DataSeq ?? item.IdxNo}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ReqQty>${item.ReqQty ?? ''}</ReqQty>
    <Qty>${item.Qty ?? ''}</Qty>
    <StdUnitQty>${item.Qty ?? ''}</StdUnitQty>
    <Remark>${item.Remark ?? ''}</Remark>
    <ItemLotNo>${item.LotNo ?? ''}</ItemLotNo>
    <SerialNoFrom />
    <MatOutSeq>${item.MatOutSeq ?? ''}</MatOutSeq>
    <OutItemSerl>${item.OutItemSerl ?? ''}</OutItemSerl>
    <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
    <OutWHSeq>${item.OutWHSeq ?? ''}</OutWHSeq>
    <InWHSeq>${item.InWHSeq ?? ''}</InWHSeq>
    <UnitSeq>${item.UnitSeq ?? ''}</UnitSeq>
    <WorkOrderSeq/>
    <ConsgnmtCustSeq>0</ConsgnmtCustSeq>
    <OutReqSeq>${item.InOutReqSeq ?? ''}</OutReqSeq>
    <OutReqItemSerl>${item.InOutReqItemSerl ?? ''}</OutReqItemSerl>
    <PJTSeq>0</PJTSeq>
    <WBSSeq>0</WBSSeq>
    <WorkOrderSerl/>
    <AlterRate>0</AlterRate>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateSPDMMOutProcItemSave(
    result: Array<{ [key: string]: any }>,
    logsSave: any,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
     <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>${item.IDX_NO ?? item.IdxNo}</IDX_NO>
    <DataSeq>${item.DataSeq ?? item.IdxNo}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
     <MatOutSeq>${logsSave.MatOutSeq ?? ''}</MatOutSeq>
    <OutItemSerl>${item.OutItemSerl ?? item.IdxNo}</OutItemSerl>
   <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
    <OutWHSeq>${item.OutWHSeq ?? ''}</OutWHSeq>
    <InWHSeq>${item.InWHSeq ?? ''}</InWHSeq>
    <UnitSeq>${item.UnitSeq ?? ''}</UnitSeq>
    <Qty>${item.Qty ?? ''}</Qty>
    <StdUnitQty>${item.Qty ?? ''}</StdUnitQty>
     <ItemLotNo>${item.ItemLotNo ?? ''}</ItemLotNo>
    <SerialNoFrom />
    <WorkOrderSeq></WorkOrderSeq>
    <ConsgnmtCustSeq>0</ConsgnmtCustSeq>
 <Remark>${item.Remark ?? ''}</Remark>
   <ReqQty>${item.ReqQty ?? ''}</ReqQty>
    <OutReqSeq>${item.OutReqSeq ?? ''}</OutReqSeq>
 <OutReqItemSerl>${item.OutReqItemSerl ?? ''}</OutReqItemSerl>
    <PJTSeq>0</PJTSeq>
    <WBSSeq>0</WBSSeq>
    <WorkOrderSerl>0</WorkOrderSerl>
    <AlterRate>0.00000</AlterRate>
    <LotNo>${item.LotNo ?? ''}</LotNo>
    <ReelNo>${item.ReelNo ?? ''}</ReelNo>
    <DateCode>${item.DateCode ?? ''}</DateCode>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateSPDMMOutProcItemSaveD(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock3>
     <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>${item.IDX_NO ?? item.IdxNo}</IDX_NO>
    <DataSeq>${item.DataSeq ?? item.IdxNo}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <TABLE_NAME>DataBlock3</TABLE_NAME>
     <MatOutSeq>${item.MatOutSeq ?? ''}</MatOutSeq>
    <OutItemSerl>${item.OutItemSerl ?? item.IdxNo}</OutItemSerl>
   <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
    <OutWHSeq>${item.OutWHSeq ?? ''}</OutWHSeq>
    <InWHSeq>${item.InWHSeq ?? ''}</InWHSeq>
    <UnitSeq>${item.UnitSeq ?? ''}</UnitSeq>
    <Qty>${item.Qty ?? ''}</Qty>
    <StdUnitQty>${item.Qty ?? ''}</StdUnitQty>
     <ItemLotNo>${item.ItemLotNo ?? ''}</ItemLotNo>
    <SerialNoFrom />
    <WorkOrderSeq></WorkOrderSeq>
    <ConsgnmtCustSeq>0</ConsgnmtCustSeq>
    <Remark>${item.Remark ?? ''}</Remark>
   <ReqQty>${item.ReqQty ?? ''}</ReqQty>
    <OutReqSeq>${item.OutReqSeq ?? ''}</OutReqSeq>
 <OutReqItemSerl>${item.OutReqItemSerl ?? ''}</OutReqItemSerl>
    <PJTSeq>0</PJTSeq>
    <WBSSeq>0</WBSSeq>
    <WorkOrderSerl>0</WorkOrderSerl>
    <AlterRate>0.00000</AlterRate>
    <ReelNo>0</ReelNo>
    <DateCode>0</DateCode>
  </DataBlock3>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateSLGInOutDailyBatch(result: any, workingTag: string): string {
    return `<ROOT> 
  <DataBlock1>
  <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <Status>0</Status>
    <InOutSeq>${result.MatOutSeq ?? ''}</InOutSeq>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <InOutNo>${result.MatOutNo ?? ''}</InOutNo>
    <InOutType>180</InOutType>
  </DataBlock1>
</ROOT>`;
  }

  generateSLGInOutDailyItemSave(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock2>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IDX_NO ?? item.IdxNo}</IDX_NO>
    <DataSeq>${index + 1}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <InOutType>180</InOutType>
    <InOutSeq>${item.MatOutSeq ?? ''}</InOutSeq>
    <InOutSerl>${item.OutItemSerl ?? ''}</InOutSerl>
    <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
    <OutWHSeq>${item.OutWHSeq ?? ''}</OutWHSeq>
    <InWHSeq>${item.InWHSeq ?? ''}</InWHSeq>
    <UnitSeq>${item.UnitSeq ?? ''}</UnitSeq>
    <Qty>${item.Qty ?? ''}</Qty>
    <STDQty>${item.Qty ?? ''}</STDQty>
    <LotNo>${item.ItemLotNo ?? ''}</LotNo>
    <SerialNo />
  </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateSCOMSourceDailySave(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IDX_NO ?? 0}</IDX_NO>
    <DataSeq>${item.DataSeq ?? 0}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <FromTableSeq>24</FromTableSeq>
    <FromSeq>${item.OutReqSeq ?? ''}</FromSeq>
    <FromSerl>${item.OutReqItemSerl ?? ''}</FromSerl>
    <FromSubSerl>0</FromSubSerl>
    <ToTableSeq>25</ToTableSeq>
    <FromQty>${item.ReqQty ?? ''}</FromQty>
    <FromSTDQty>${item.ReqQty ?? ''}</FromSTDQty>
    <FromAmt>0</FromAmt>
    <FromVAT>0</FromVAT>
    <PrevFromTableSeq>0</PrevFromTableSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <ToSeq>${item.MatOutSeq ?? ''}</ToSeq>
    <ToSerl>${item.OutItemSerl ?? ''}</ToSerl>
    <ToQty>${item.Qty ?? 0}</ToQty> 
    <ToSTDQty>${item.Qty ?? 0}</ToSTDQty>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateSCOMSourceDailySaveD(
    result: Array<{ [key: string]: any }>,
    workingTag: string,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IdxNo ?? 0}</IDX_NO>
    <DataSeq>${item.IdxNo ?? 0}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <FromTableSeq>24</FromTableSeq>
    <FromSeq>${item.OutReqSeq ?? ''}</FromSeq>
    <FromSerl>${item.OutReqItemSerl ?? ''}</FromSerl>
    <FromSubSerl>0</FromSubSerl>
    <ToTableSeq>25</ToTableSeq>
    <FromQty>${item.ReqQty ?? ''}</FromQty>
    <FromSTDQty>${item.ReqQty ?? ''}</FromSTDQty>
    <FromAmt>0</FromAmt>
    <FromVAT>0</FromVAT>
    <PrevFromTableSeq>0</PrevFromTableSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <ToSeq>${item.MatOutSeq ?? ''}</ToSeq>
    <ToSerl>${item.OutItemSerl ?? ''}</ToSerl>
    <ToQty>${item.Qty ?? 0}</ToQty> 
    <ToSTDQty>${item.Qty ?? 0}</ToSTDQty>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
