
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


  async generateXMLSPDMPSProdReqListQuery(result: any): Promise<string> {
    return `<ROOT> <DataBlock1> <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <FactUnit>${result.FactUnit}</FactUnit>
    <ReqDate>${result.ReqDate}</ReqDate>
    <ReqDateTo>${result.ReqDateTo}</ReqDateTo>
    <ProdReqNo>${result.ProdReqNo}</ProdReqNo>
    <DeptSeq>${result.DeptSeq}</DeptSeq>
    <EmpSeq>${result.EmpSeq}</EmpSeq>
    <ReqType>${result.ReqType}</ReqType>
    <ProdType>${result.ProdType}</ProdType>
    <UMProdObject>${result.UMProdObject}</UMProdObject>
  </DataBlock1>
</ROOT>`;
  }
  async generateXMLSPDMPSProdReqItemListQuery(result: any): Promise<string> {
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
      <EndDate>${result.EndDate ?? ''}</EndDate>
      <EndDateTo>${result.EndDateTo ?? ''}</EndDateTo> 
      <DelvDate>${result.DelvDate ?? ''}</DelvDate>
      <DelvDateTo>${result.DelvDateTo ?? ''}</DelvDateTo>
      <ProdReqNo>${result.ProdReqNo ?? ''}</ProdReqNo>
      <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
      <EmpSeq>${result.EmpSeq ?? ''}</EmpSeq>
      <PoNo>${result.PoNo ?? ''}</PoNo>
      <ReqType>${result.ReqType ?? ''}</ReqType>
      <CustSeq>${result.CustSeq ?? ''}</CustSeq>
      <ItemName>${result.ItemName ?? ''}</ItemName>
      <ItemNo>${result.ItemNo ?? ''}</ItemNo>
      <ProdType>${result.ProdType ?? ''}</ProdType>
      <OrderNo>${result.OrderNo ?? ''}</OrderNo>
      <ProgStatus>${result.ProgStatus ?? ''}</ProgStatus>
    </DataBlock1>
  </ROOT>`;
  }
  async generateXMLSPDMPSProdPlanListQuery(result: any): Promise<string> {
    return `<ROOT>
    <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <ProdPlanNo>${result.ProdPlanNo ?? ''}</ProdPlanNo>
    <SrtDate>${result.SrtDate ?? '20230318'}</SrtDate>
    <EndDate>${result.EndDate ?? '20250325'}</EndDate>
    <FrProdPlanDate>${result.FrProdPlanDate ?? ''}</FrProdPlanDate>
    <ToProdPlanDate>${result.ToProdPlanDate ?? ''}</ToProdPlanDate>
    <AssetSeq>${result.AssetSeq ?? ''}</AssetSeq>
    <ItemName>${result.ItemName ?? ''}</ItemName>
    <ItemNo>${result.ItemNo ?? ''}</ItemNo>
    <Spec>${result.Spec ?? ''}</Spec>
    <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
    <ProcRevName>${result.ProcRevName ?? ''}</ProcRevName>
    <CfmEmpName>${result.CfmEmpName ?? ''}</CfmEmpName>
    </DataBlock1>
  </ROOT>`;
  }


  async generateXMLSPDMPSDailyProdPlanListQuery(result: any): Promise<string> {
    return `<ROOT>    <DataBlock1>
    <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <FactUnit>${result.FactUnit}</FactUnit>
    <ProdPlanNo>${result.ProdPlanNo}</ProdPlanNo>
    <SrtDate>${result.SrtDate}</SrtDate>
    <EndDate>${result.EndDate}</EndDate>
    <FrProdPlanDate>${result.FrProdPlanDate}</FrProdPlanDate>
    <ToProdPlanDate>${result.ToProdPlanDate}</ToProdPlanDate>
    <AssetSeq>${result.AssetSeq}</AssetSeq>
    <ItemName>${result.ItemName}</ItemName>
    <ItemNo>${result.ItemNo}</ItemNo>
    <Spec>${result.Spec}</Spec>
    <DeptSeq>${result.DeptSeq}</DeptSeq>
    <ProcRevName>${result.ProcRevName}</ProcRevName>
    <CfmEmpName>${result.CfmEmpName}</CfmEmpName>
  </DataBlock1>
</ROOT>`;
  }


  async generateXMLSPDMPSProdReq(result: any, workingTag: string): Promise<string> {
    return `<ROOT><DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <ProdReqSeq>${result.ProdReqSeq || 0}</ProdReqSeq>
    <FactUnit>${result.FactUnit}</FactUnit>
    <ProdReqNo>${result.ProdReqNo}</ProdReqNo>
    <DeptSeq>${result.DeptSeq}</DeptSeq>
    <DeptName>${result.DeptName}</DeptName>
    <EmpSeq>${result.EmpSeq}</EmpSeq>
    <EmpName>${result.EmpName}</EmpName>
    <ReqDate>${result.ReqDate}</ReqDate>
    <ReqType>${result.ReqType}</ReqType>
    <ProdType>${result.ProdType}</ProdType>
    <Remark>${result.Remark}</Remark>
    <UMProdObject />
  </DataBlock1>
</ROOT>`;
  }




  async generateXMLSPDMPSProdReqItemCheck(result: Array<{ [key: string]: any }>, ProdReqSeq: number, workingTag: string): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
  <DataBlock2>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Serl>${item.IdxNo || item.IDX_NO}</Serl>
    <ItemName>${item.ItemName || ''}</ItemName>
    <ItemNo>${item.ItemNo || ''}</ItemNo>
    <Spec>${item.Spec || ''}</Spec>
    <ItemSeq>${item.ItemSeq || ''}</ItemSeq>
    <UnitName>${item.UnitName || ''}</UnitName>
    <Qty>${item.Qty || ''}</Qty>
    <EndDate>${item.EndDate || ''}</EndDate>
    <DelvDate>${item.DelvDate || ''}</DelvDate>
    <PlanDeptName>${item.PlanDeptName || ''}</PlanDeptName>
    <Remark>${item.Remark || ''}</Remark>
    <Memo>${item.Memo || ''} </Memo>
    <UnitSeq>${item.UnitSeq || ''}</UnitSeq>
    <ProdReqSeq>${ProdReqSeq || ''}</ProdReqSeq>
    <PJTName />
    <PJTNo />
    <WBSName />
    <PJTSeq>${item.PJTSeq || ''}</PJTSeq>
    <WBSSeq>${item.WBSSeq || ''}</WBSSeq>
    <CustSeq>${item.CustSeq || ''}</CustSeq>
    <CustName>${item.CustName || ''}</CustName>
    <PlanDeptSeq>${item.PlanDeptSeq || ''}</PlanDeptSeq>
    <SoNo />
    <TABLE_NAME>DataBlock2</TABLE_NAME>
  </DataBlock2>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;

  }



  async generateXMLSPDMPSProdReqItemCheck2(result: Array<{ [key: string]: any }>, workingTag: string): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
  <DataBlock2>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Serl>${item.IdxNo || item.IDX_NO}</Serl>
    <ItemName>${item.ItemName || ''}</ItemName>
    <ItemNo>${item.ItemNo || ''}</ItemNo>
    <Spec>${item.Spec || ''}</Spec>
    <ItemSeq>${item.ItemSeq || ''}</ItemSeq>
    <UnitName>${item.UnitName || ''}</UnitName>
    <Qty>${item.Qty || ''}</Qty>
      <EndDate>${item.EndDate || ''}</EndDate>
    <DelvDate>${item.DelvDate || ''}</DelvDate>
    <PlanDeptName>${item.PlanDeptName || ''}</PlanDeptName>
     <Remark>${item.Remark || ''}</Remark>
    <Memo>${item.Memo || ''} </Memo>
    <UnitSeq>${item.UnitSeq || ''}</UnitSeq>
    <ProdReqSeq>${item.ProdReqSeq || ''}</ProdReqSeq>
    <PJTName />
    <PJTNo />
    <WBSName />
    <PJTSeq>${item.PJTSeq || ''}</PJTSeq>
    <WBSSeq>${item.WBSSeq || ''}</WBSSeq>
     <CustSeq>${item.CustSeq || ''}</CustSeq>
    <CustName>${item.CustName || ''}</CustName>
    <PlanDeptSeq>${item.PlanDeptSeq || ''}</PlanDeptSeq>
    <SoNo />
    <TABLE_NAME>DataBlock2</TABLE_NAME>
  </DataBlock2>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;

  }





  generateXMLSCOMGetCloseType(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
    <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
      <Status>0</Status>
      <Selected>1</Selected>
      <Dummy1>${item?.ItemSeq ?? ''}</Dummy1>
      <TABLE_NAME>DataBlock1</TABLE_NAME>
    </DataBlock1>`)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSCOMCloseCheck(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
    <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
  <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
      <Status>0</Status>
      <Selected>0</Selected>
      <Date>${item?.ProdPlanEndDate ?? ''}</Date>
      <FactUnit>${item?.FactUnit ?? ''}</FactUnit>
      <TABLE_NAME>DataBlock1</TABLE_NAME>
      <ServiceSeq>5294</ServiceSeq>
      <MethodSeq>2</MethodSeq>
      <DtlUnitSeq>${item?.UnitSeq ?? ''}</DtlUnitSeq>
    </DataBlock1>`)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSCOMConfirmDelete(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
    <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
      <Status>0</Status>
      <Selected>0</Selected>
      <CfmSeq>${item?.ProdPlanSeq ?? ''}</CfmSeq>
      <TABLE_NAME>DataBlock1</TABLE_NAME>
      <TableName>_TPDMPSDailyProdPlan</TableName>
    </DataBlock1>`)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSPDMPSProdPlan(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
    <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
     <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
      <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
      <Selected>1</Selected>
      <Status>0</Status>
      <FactUnitName>${item?.FactUnitName ?? ''}</FactUnitName>
      <FactUnit>${item?.FactUnit ?? ''}</FactUnit>
      <ProdDeptName>${item?.ProdDeptName ?? ''}</ProdDeptName>
      <ProdDeptSeq>${item?.ProdDeptSeq ?? ''}</ProdDeptSeq>
      <ItemName>${item?.ItemName ?? ''}</ItemName>
      <ItemNo>${item?.ItemNo ?? ''}</ItemNo>
      <Spec>${item?.Spec ?? ''}</Spec>
      <ProdPlanNo>${item?.ProdPlanNo ?? ''}</ProdPlanNo>
      <ProdPlanSeq>${item?.ProdPlanSeq ?? ''}</ProdPlanSeq>
      <ItemSeq>${item?.ItemSeq ?? ''}</ItemSeq>
      <UnitName>${item?.UnitName ?? ''}</UnitName>
      <UnitSeq>${item?.UnitSeq ?? ''}</UnitSeq>
      <BOMRevName>${item?.BOMRevName ?? ''}</BOMRevName>
      <BOMRev>${item?.BOMRev ?? ''}</BOMRev>
      <ProcRevName>${item?.ProcRevName ?? ''}</ProcRevName>
      <ProcRev>${item?.ProcRev ?? ''}</ProcRev>
      <ProdPlanQty>${item?.ProdPlanQty ?? ''}</ProdPlanQty>
      <ProdPlanEndDate>${item?.ProdPlanEndDate ?? ''}</ProdPlanEndDate>
      <Remark>${item?.Remark ?? ''}</Remark>
      <FromSeq>${item?.FromSeq ?? 0}</FromSeq>
      <FromSerl>${item?.FromSerl ?? 0}</FromSerl>
      <FromTableSeq>${item?.FromTableSeq ?? 0}</FromTableSeq>
      <WorkCond1>${item?.WorkCond1 ?? ''}</WorkCond1>
      <WorkCond2>${item?.WorkCond2 ?? ''}</WorkCond2>
      <WorkCond3>${item?.WorkCond3 ?? ''}</WorkCond3>
      <WorkCond4>${item?.WorkCond4 ?? 0}</WorkCond4>
      <WorkCond5>${item?.WorkCond5 ?? 0}</WorkCond5>
      <WorkCond6>${item?.WorkCond6 ?? 0}</WorkCond6>
      <WorkCond7>${item?.WorkCond7 ?? 0}</WorkCond7>
      <AssetName>${item?.AssetName ?? 0}</AssetName>
      <ProdPlanDate>${item?.ProdPlanDate ?? ''}</ProdPlanDate>
      <ToTableSeq>${item?.ToTableSeq ?? 0}</ToTableSeq>
      <FromQty>${item?.FromQty ?? 0}</FromQty>
      <FromSTDQty>${item?.FromSTDQty ?? 0}</FromSTDQty>
      <TABLE_NAME>${item?.TABLE_NAME ?? 'DataBlock1'}</TABLE_NAME>
      <DeptSeq>${item?.DeptSeq ?? ''}</DeptSeq>

    </DataBlock1>`)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSCOMSourceDailySave(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
  <DataBlock1>
  <WorkingTag>${workingTag}</WorkingTag>
     <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Selected>0</Selected>
    <Status>0</Status>
    <ToSeq>${item?.ProdPlanSeq ?? ''}</ToSeq>
    <ToQty>${item?.ToQty ?? 0}</ToQty>
    <FromSeq>${item?.FromSeq ?? 0}</FromSeq>
    <FromSerl>${item?.FromSerl ?? 0}</FromSerl>
    <FromTableSeq>${item?.FromTableSeq ?? 0}</FromTableSeq>
    <FromQty>${item?.FromQty ?? 0}</FromQty>
    <FromSTDQty>${item?.FromSTDQty ?? 0}</FromSTDQty>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;

  }


  generateXMLSPDMPSProdPlanWorkOrderSaveNotCapa(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
  <DataBlock1>
     <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Selected>0</Selected>
    <Status>0</Status>
    <FactUnitName>${item?.FactUnitName ?? ''}</FactUnitName>
    <FactUnit>${item?.FactUnit ?? ''}</FactUnit>
    <ProdPlanSeq>${item?.ProdPlanSeq ?? ''}</ProdPlanSeq>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;

  }
  generateXMLConfirmCreate(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
  <DataBlock1>
     <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Selected>0</Selected>
    <Status>0</Status>
    <TableName>_TPDMPSDailyProdPlan</TableName>
    <CfmSeq>${item?.ProdPlanSeq ?? ''}</CfmSeq>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;

  }




  generateXMLSPDMPSProdPlanStockQuery(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
  <DataBlock1>
     <WorkingTag />
     <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Status>0</Status>
    <Selected>1</Selected>
    <ProdPlanQty>${item.ProdPlanQty ?? 0}</ProdPlanQty>
    <FactUnit>${item.FactUnit ?? 0}</FactUnit>
    <ItemSeq>${item.ItemSeq ?? 0}</ItemSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;

  }


  generateXMLSPDMPSProdPlanQuery(result: Array<{ [key: string]: any }>): string {
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
    <ProdReqEndDateTo>${item.ProdReqEndDateTo ?? ''}</ProdReqEndDateTo>
    <ProdReqEndDateFrom>${item.ProdReqEndDateFrom ?? ''}</ProdReqEndDateFrom>
    <FactUnit>${item.FactUnit ?? ''}</FactUnit>
    <ProdDeptSeq>${item.ProdDeptSeq ?? ''}</ProdDeptSeq>
    <ProdPlanEndDateFrom>${item.ProdPlanEndDateFrom ?? ''}</ProdPlanEndDateFrom>
    <ProdPlanEndDateTo>${item.ProdPlanEndDateTo ?? ''}</ProdPlanEndDateTo>
    <ReqType>${item.ReqType ?? ''}</ReqType>
    <ReqDeptSeq>${item.ReqDeptSeq ?? ''}</ReqDeptSeq>
    <ReqEmpSeq>${item.ReqEmpSeq ?? ''}</ReqEmpSeq>
    <ProdPlanNoQry>${item.ProdPlanNoQry ?? ''}</ProdPlanNoQry>
    <AssetSeq>${item.AssetSeq ?? ''}</AssetSeq>
    <ProcTypeSeq>${item.ProcTypeSeq ?? ''}</ProcTypeSeq>
    <ItemName>${item.ItemName ?? ''}</ItemName>
    <ItemNo>${item.ItemNo ?? ''}</ItemNo>
    <Spec>${item.Spec ?? ''}</Spec>
    <CustSeq>${item.CustSeq ?? ''}</CustSeq>
    <SoNo>${item.SoNo ?? ''}</SoNo>
    <PONo>${item.PONo ?? ''}</PONo>
  </DataBlock1>`
      )
      .join('');
    return `<ROOT>${xmlBlocks}</ROOT>`;

  }
  generateXMLSCOMConfirmQuery(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
  <DataBlock1>
    <CfmSeq>${item.ProdPlanSeq ?? ''}</CfmSeq>
    <IDX_NO>${index + 1}</IDX_NO>
    <TableName>_TPDMPSDailyProdPlan</TableName>
  </DataBlock1>`
      )
      .join('');
    return `<ROOT>${xmlBlocks}</ROOT>`;

  }
  generateXMLSCOMSourceDailyQuery(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
  <DataBlock1>
      <ToQty>${item.ProdPlanQty ?? ''}</ToQty>
    <IDX_NO>${index + 1}</IDX_NO>
    <ToSeq>${item.ProdPlanSeq ?? ''}</ToSeq>
  </DataBlock1>`
      )
      .join('');
    return `<ROOT>${xmlBlocks}</ROOT>`;

  }




  generateXMLSCOMConfirm(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
    <DataBlock1>
   <WorkingTag />
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <CfmCode>${item.CfmCode ?? ''}</CfmCode>
    <CfmSeq>${item.ProdPlanSeq ?? ''}</CfmSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <TableName>_TPDMPSDailyProdPlan</TableName>
    </DataBlock1>`)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDMPSProdPlanConfirm(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
    <DataBlock1>
   <WorkingTag />
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <ProdPlanSeq>${item.ProdPlanSeq ?? ''}</ProdPlanSeq>
    <CfmEmpName />
    <CfmDate />
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    </DataBlock1>`)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSPDMPSProdPlanSemiGoodCrt(result: Array<{ [key: string]: any }>, workingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
        <WorkingTag />
            <DataBlock1>
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <FactUnitName>${item.FactUnitName ?? ''}</FactUnitName>
    <ProdPlanNo>${item.ProdPlanNo ?? ''}</ProdPlanNo>
    <ItemName>${item.ItemName ?? ''}</ItemName>
    <ItemNo>${item.ItemNo ?? ''}</ItemNo>
    <Spec>${item.Spec ?? ''}</Spec>
    <UnitName>${item.UnitName ?? ''}</UnitName>
    <BOMRevName>${item.BOMRevName ?? ''}</BOMRevName>
    <ProcRevName>${item.ProcRevName ?? ''}</ProcRevName>
    <ProdPlanQty>${item.ProdPlanQty ?? ''}</ProdPlanQty>
    <ProdPlanEndDate>${item.ProdPlanEndDate ?? ''}</ProdPlanEndDate>
    <ProdDeptName>${item.ProdDeptName ?? ''}</ProdDeptName>
    <Remark>${item.Remark ?? ''}</Remark>
    <ProdDeptSeq>${item.ProdDeptSeq ?? ''}</ProdDeptSeq>
    <FactUnit>${item.FactUnit ?? ''}</FactUnit>
    <ProcRev>${item.ProcRev ?? ''}</ProcRev>
    <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
    <ProdPlanSeq>${item.ProdPlanSeq ?? ''}</ProdPlanSeq>
    <BOMRev>${item.BOMRev ?? ''}</BOMRev>
    <UnitSeq>${item.UnitSeq ?? ''}</UnitSeq>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    </DataBlock1>`)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

}
