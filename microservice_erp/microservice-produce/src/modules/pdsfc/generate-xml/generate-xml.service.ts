
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

  generateXMLSPDSFCWorkOrderQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <GoodItemSpec>${result.GoodItemSpec ?? ''}</GoodItemSpec>
          <ProcName>${result.ProcName ?? ''}</ProcName>
          <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
          <DeptName>${result.DeptName ?? ''}</DeptName>
          <WorkOrderNo>${result.WorkOrderNo ?? ''}</WorkOrderNo>
          <ProdPlanNo>${result.ProdPlanNo ?? ''}</ProdPlanNo>
          <WHSeq>${result.WHSeq ?? ''}</WHSeq>
          <ProgStatus>${result.ProgStatus ?? ''}</ProgStatus>
          <ProgStatusName>${result.ProgStatusName ?? ''}</ProgStatusName>
          <WorkType>${result.WorkType ?? ''}</WorkType>
          <WorkTypeName>${result.WorkTypeName ?? ''}</WorkTypeName>
          <CustSeq>${result.CustSeq ?? ''}</CustSeq>
          <CustName>${result.CustName ?? ''}</CustName>
          <PoNo>${result.PoNo ?? ''}</PoNo>
          <PJTName>${result.PJTName ?? ''}</PJTName>
          <PJTNo>${result.PJTNo ?? ''}</PJTNo>
          <FactUnit>${result.FactUnit ?? ''}</FactUnit>
          <FactUnitName>${result.FactUnitName ?? ''}</FactUnitName>
          <WorkOrderDate>${result.WorkOrderDate ?? ''}</WorkOrderDate>
          <WorkOrderDateTo>${result.WorkOrderDateTo ?? ''}</WorkOrderDateTo>
          <WorkDate>${result.WorkDate ?? ''}</WorkDate>
          <WorkDateTo>${result.WorkDateTo ?? ''}</WorkDateTo>
          <WorkCenterSeq>${result.WorkCenterSeq ?? ''}</WorkCenterSeq>
          <WorkCenterName>${result.WorkCenterName ?? ''}</WorkCenterName>
          <GoodItemName>${result.GoodItemName ?? ''}</GoodItemName>
          <GoodItemNo>${result.GoodItemNo ?? ''}</GoodItemNo>
          <ChainGoodsSeq>${result.ChainGoodsSeq ?? ''}</ChainGoodsSeq>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLSPDSFCMatProgressListQ(result: any): string {
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
          <WorkOrderDate>${result.WorkOrderDate ?? ''}</WorkOrderDate>
          <WorkOrderDateTo>${result.WorkOrderDateTo ?? ''}</WorkOrderDateTo>
          <WorkOrderNo>${result.WorkOrderNo ?? ''}</WorkOrderNo>
          <ProgressStatus>${result.ProgressStatus ?? ''}</ProgressStatus>
          <GoodItemName>${result.GoodItemName ?? ''}</GoodItemName>
          <GoodItemNo>${result.GoodItemNo ?? ''}</GoodItemNo>
          <GoodItemSpec>${result.GoodItemSpec ?? ''}</GoodItemSpec>
          <ProcName>${result.ProcName ?? ''}</ProcName>
          <MatItemName>${result.MatItemName ?? ''}</MatItemName>
          <MatItemNo>${result.MatItemNo ?? ''}</MatItemNo>
          <MatItemSpec>${result.MatItemSpec ?? ''}</MatItemSpec>
          <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
          <DeptName>${result.DeptName ?? ''}</DeptName>
          <WorkDate>${result.WorkDate ?? ''}</WorkDate>
          <WorkDateTo>${result.WorkDateTo ?? ''}</WorkDateTo>
          <WorkCenterSeq>${result.WorkCenterSeq ?? ''}</WorkCenterSeq>
          <WorkCenterName>${result.WorkCenterName ?? ''}</WorkCenterName>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLSPDSFCWorkReportQ(result: any): string {
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
          <WorkDate>${result.WorkDate ?? ''}</WorkDate>
          <WorkDateTo>${result.WorkDateTo ?? ''}</WorkDateTo>
          <WorkType>${result.WorkType ?? ''}</WorkType>
          <WorkOrderNo>${result.WorkOrderNo ?? ''}</WorkOrderNo>
          <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
          <DeptName>${result.DeptName ?? ''}</DeptName>
          <WorkCenterSeq>${result.WorkCenterSeq ?? ''}</WorkCenterSeq>
          <WorkCenterName>${result.WorkCenterName ?? ''}</WorkCenterName>
          <RealLotNo>${result.RealLotNo ?? ''}</RealLotNo>
          <ProdPlanNo>${result.ProdPlanNo ?? ''}</ProdPlanNo>
          <SMIsMatInput>${result.SMIsMatInput ?? ''}</SMIsMatInput>
          <GoodItemName>${result.GoodItemName ?? ''}</GoodItemName>
          <GoodItemNo>${result.GoodItemNo ?? ''}</GoodItemNo>
          <GoodItemSpec>${result.GoodItemSpec ?? ''}</GoodItemSpec>
          <ProcName>${result.ProcName ?? ''}</ProcName>
          <AssyItemName>${result.AssyItemName ?? ''}</AssyItemName>
          <AssyItemNo>${result.AssyItemNo ?? ''}</AssyItemNo>
          <AssyItemSpec>${result.AssyItemSpec ?? ''}</AssyItemSpec>
          <PJTName>${result.PJTName ?? ''}</PJTName>
          <PJTNo>${result.PJTNo ?? ''}</PJTNo>
          <CustSeq>${result.CustSeq ?? ''}</CustSeq>
          <PoNo>${result.PoNo ?? ''}</PoNo>
          <EmpName>${result.EmpName ?? ''}</EmpName>
          <WorkTimeGroup>${result.WorkTimeGroup ?? ''}</WorkTimeGroup>
          <GoodItemSClass>${result.GoodItemSClass ?? ''}</GoodItemSClass>
          <GoodItemSClassName>${result.GoodItemSClassName ?? ''}</GoodItemSClassName>
          <CCtrSeq>${result.CCtrSeq ?? ''}</CCtrSeq>
          <CCtrName>${result.CCtrName ?? ''}</CCtrName>
        </DataBlock1>
      </ROOT>`;
  }



  generateXMLSCOMSourceDailyQ2(result: any): string {
    return `<ROOT>
        <DataBlock1>
           <WorkingTag>A</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>0</IsChangedMst>
    <WorkReportSeq>${result.WorkReportSeq ?? ''}</WorkReportSeq>
    <FactUnit>${result.FactUnit ?? ''}</FactUnit>
    <DeptSeq>${result.DeptSeq ?? ''}</DeptSeq>
    <DeptName>${result.DeptName ?? ''}</DeptName>
    <WorkDate>${result.WorkDate ?? ''}</WorkDate>
    <WorkCenterSeq>${result.WorkCenterSeq ?? ''}</WorkCenterSeq>
    <WorkCenterName>${result.WorkCenterName ?? ''}</WorkCenterName>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLSCOMSourceDailyQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item, index) => `
      <DataBlock1>
            <ToSeq>${item.WorkReportSeq ?? ''}</ToSeq>
            <ToQty>${item.ProdQty ?? ''}</ToQty>
            <ToSTDQty>${item.StdUnitProdQty ?? ''}</ToSTDQty>
            <IDX_NO>1</IDX_NO>
        </DataBlock1>`)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDSFCWorkReportMatQCheck(result: any): string {
    return `<ROOT>
    <DataBlock2>
      <WorkingTag />
      <IDX_NO>1</IDX_NO>
      <DataSeq>1</DataSeq>
      <Status>0</Status>
      <Selected>0</Selected>
      <WorkReportSeq>${result.WorkReportSeq ?? ''}</WorkReportSeq>
      <WorkOrderSeq>${result.WorkOrderSeq ?? ''}</WorkOrderSeq>
      <ProcSeq>${result.ProcSeq ?? ''}</ProcSeq>
      <WorkOrderSerl>${result.WorkOrderSerl ?? ''}</WorkOrderSerl>
      <TABLE_NAME>DataBlock2</TABLE_NAME>
    </DataBlock2>
  </ROOT>`;
  }

  /*   generateXMLSCOMSourceDailyQ(result: any): string {
      return `<ROOT>
          <DataBlock1>
              <ToSeq>${result.WorkReportSeq ?? ''}</ToSeq>
              <ToQty>${result.ToQty ?? ''}</ToQty>
              <ToSTDQty>${result.ToSTDQty ?? ''}</ToSTDQty>
              <IDX_NO>1</IDX_NO>
          </DataBlock1>
        </ROOT>`;
    } */
  generateXMLSPDSFCWorkReportMatQ(result: any): string {
    return `<ROOT>
       <DataBlock2>
            <WorkingTag />
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <WorkReportSeq>${result.WorkReportSeq ?? ''}</WorkReportSeq>
            <FactUnit>${result.FactUnit ?? ''}</FactUnit>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
        </DataBlock2>
      </ROOT>`;
  }
  generateXMLSPDSFCWorkReportToolQ(result: any): string {
    return `<ROOT>
       <DataBlock3>
            <WorkingTag />
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <WorkReportSeq>${result.WorkReportSeq ?? ''}</WorkReportSeq>
            <TABLE_NAME>DataBlock3</TABLE_NAME>
        </DataBlock3>
      </ROOT>`;
  }
  generateXMLSPDSFCWorkReportWorkEmpQuery(result: any): string {
    return `<ROOT>
       <DataBlock4>
          <WorkingTag />
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <WorkReportSeq>${result.WorkReportSeq ?? ''}</WorkReportSeq>
            <TABLE_NAME>DataBlock4</TABLE_NAME>
        </DataBlock4>
      </ROOT>`;
  }
  generateXMLSPDSFCWorkReportNonWorkQ(result: any): string {
    return `<ROOT>
       <DataBlock9>
                <WorkingTag />
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
           <WorkReportSeq>${result.WorkReportSeq ?? ''}</WorkReportSeq>
            <TABLE_NAME>DataBlock9</TABLE_NAME>
        </DataBlock9>
      </ROOT>`;
  }
  generateXMLSLGInOutDailyQuery(result: any): string {
    return `<ROOT>
            <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <InOutSeq>${result.InOutSeq ?? ''}</InOutSeq>
            <InOutType>40</InOutType>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLSLGInOutDailyItemQ(result: any): string {
    return `<ROOT>
            <DataBlock2>
            <WorkingTag>Q</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <InOutSeq>${result.InOutSeq ?? ''}</InOutSeq>
            <InOutType>40</InOutType>
        </DataBlock2>
      </ROOT>`;
  }



  generateXMLSCOMCloseCheck(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
       <DataBlock1>
        <WorkingTag>${WorkingTag}</WorkingTag>
        <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <FactUnit>${item.FactUnitMater || ''}</FactUnit>
        <TABLE_NAME>DataBlock1</TABLE_NAME>
        <Date>${item.DateMater || ''}</Date>
         <ServiceSeq>2894</ServiceSeq>
        <MethodSeq>2</MethodSeq>
        <DtlUnitSeq>1</DtlUnitSeq>
      </DataBlock1>
  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSCOMCloseItemCheck(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
      <DataBlock2>
      <WorkingTag>${WorkingTag}</WorkingTag>
        <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
    <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <TABLE_NAME>DataBlock2</TABLE_NAME>
    <FactUnitOld>${item.FactUnitMater || ''}</FactUnitOld>
    <DateOld>${item.DateMater || ''}</DateOld>
    <DeptSeqOld>${item.DeptSeqMater || ''}</DeptSeqOld>
    <ServiceSeq>2894</ServiceSeq>
        <MethodSeq>2</MethodSeq>
  </DataBlock2>
  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDSFCWorkReportCheck(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
        <DataBlock1>
          <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
          <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
          <Status>${item.Status ?? 0}</Status>
          <Selected>${item.Selected ?? 0}</Selected>
          <ItemBomRevName>${item.ItemBomRevName || ''}</ItemBomRevName>
          <ProdQty>${item.ProdQty || 0}</ProdQty>
          <OKQty>${item.OKQty || 0}</OKQty>
          <BadQty>${item.BadQty || 0}</BadQty>
          <ReOrderQty>${item.ReOrderQty || 0}</ReOrderQty>
          <LossCostQty>${item.LossCostQty || 0}</LossCostQty>
          <DisuseQty>${item.DisuseQty || 0}</DisuseQty>
          <WorkStartTime>${item.WorkStartTime || ''}</WorkStartTime>
          <WorkEndTime>${item.WorkEndTime || ''}</WorkEndTime>
          <WorkHour>${item.WorkHour || 0}</WorkHour>
          <ProcHour>${item.ProcHour || 0}</ProcHour>
          <WorkerQty>${item.WorkerQty || 0}</WorkerQty>
          <RealLotNo>${item.RealLotNo || ''}</RealLotNo>
          <SerialNoFrom>${item.SerialNoFrom || ''}</SerialNoFrom>
          <SerialNoTo>${item.SerialNoTo || ''}</SerialNoTo>
          <WorkCondition1>${item.WorkCondition1 || ''}</WorkCondition1>
          <WorkCondition2>${item.WorkCondition2 || ''}</WorkCondition2>
          <WorkCondition3>${item.WorkCondition3 || ''}</WorkCondition3>
          <WorkCondition4>${item.WorkCondition4 || 0}</WorkCondition4>
          <WorkCondition5>${item.WorkCondition5 || 0}</WorkCondition5>
          <WorkCondition6>${item.WorkCondition6 || 0}</WorkCondition6>
          <WorkCondition7>${item.WorkCondition7 || 0}</WorkCondition7>
          <StdUnitReOrderQty>${item.StdUnitReOrderQty || 0}</StdUnitReOrderQty>
          <StdUnitLossCostQty>${item.StdUnitLossCostQty || 0}</StdUnitLossCostQty>
          <StdUnitDisuseQty>${item.StdUnitDisuseQty || 0}</StdUnitDisuseQty>
          <GoodInSeq>${item.GoodInSeq || 0}</GoodInSeq>
 <WorkOrderNo>${item.WorkOrderNo || item.InNo || ''}</WorkOrderNo>
          <Remark>${item.Remark || ''}</Remark>
          <ProcRev>${item.ProcRev || ''}</ProcRev>
          <WorkReportSeq>${item.WorkReportSeq || 0}</WorkReportSeq>
          <WorkOrderSeq>${item.WorkOrderSeq || 0}</WorkOrderSeq>
          <WorkCenterSeq>${item.WorkCenterSeq || 0}</WorkCenterSeq>
          <GoodItemSeq>${item.GoodItemSeq || 0}</GoodItemSeq>
          <AssyItemSeq>${item.AssyItemSeq || 0}</AssyItemSeq>
          <ProcSeq>${item.ProcSeq || 0}</ProcSeq>
          <ProdUnitSeq>${item.ProdUnitSeq || 0}</ProdUnitSeq>
          <ChainGoodsSeq>${item.ChainGoodsSeq || 0}</ChainGoodsSeq>
          <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
          <WorkOrderSerl>${item.WorkOrderSerl || ''}</WorkOrderSerl>
          <IsProcQC>${item.IsProcQC || 0}</IsProcQC>
          <IsLastProc>${item.IsLastProc || 0}</IsLastProc>
          <IsPjt>${item.IsPjt || 0}</IsPjt>
          <PJTSeq>${item.PJTSeq || 0}</PJTSeq>
          <WBSSeq>${item.WBSSeq || 0}</WBSSeq>
          <SubEtcInSeq>${item.SubEtcInSeq || 0}</SubEtcInSeq>
          <WorkTimeGroup>${item.WorkTimeGroup || ''}</WorkTimeGroup>
          <QCSeq>${item.QCSeq || 0}</QCSeq>
          <QCNo>${item.QCNo || ''}</QCNo>
          <PreProdWRSeq>${item.PreProdWRSeq || 0}</PreProdWRSeq>
          <PreAssySeq>${item.PreAssySeq || 0}</PreAssySeq>
          <PreAssyQty>${item.PreAssyQty || 0}</PreAssyQty>
          <PreLotNo>${item.PreLotNo || ''}</PreLotNo>
          <PreUnitSeq>${item.PreUnitSeq || 0}</PreUnitSeq>
          <FactUnit>${item.FactUnit || item.FactUnitMater || ''}</FactUnit>
          <CustSeq>${item.CustSeq || 0}</CustSeq>
          <WorkType>${item.WorkType || ''}</WorkType>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <WorkDate>${item.DateMater || item.WorkDate || ''}</WorkDate>
          <DeptSeq>${item.DeptSeq || item.DeptSeqMater || 0}</DeptSeq>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSLGLotNoMasterCheck(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
  <DataBlock1>
   <WorkingTag>${WorkingTag}</WorkingTag>
  <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
          <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <InNo>${item.WorkOrderNo || item.InNo || ''}</InNo>
    <LotNoOLD>${item.WorkOrderNo || item.LotNoOLD || ''}</LotNoOLD>
    <ItemSeqOLD>${item.GoodItemSeq || item.ItemSeqOLD || ''}</ItemSeqOLD>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <CreateDate2>${item.WorkDate || item.CreateDate2 || ''}</CreateDate2>
    <ItemSeq>${item.GoodItemSeq || item.ItemSeq || ''}</ItemSeq>
    <UnitSeq>${item.ProdUnitName || item.UnitSeq || ''}</UnitSeq>
    <Qty>${item.ProdQty || item.Qty || 0}</Qty>
    <LotNo>${item.LotNo || item.LotNo || ''}</LotNo>
    <Remark>${item.Remark || item.Remark || ''}</Remark>
    <IsDelete>${item.IsDelete || ''}</IsDelete>
    <IsProductItem>1</IsProductItem>
    <IsExceptEmptyLotNo xml:space="preserve"> </IsExceptEmptyLotNo>
  </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSCOMSourceDailySave(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
        <DataBlock1>
          <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
          <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
          <Status>${item.Status ?? 0}</Status>
          <Selected>${item.Selected ?? 0}</Selected>
          <FromTableSeq>5</FromTableSeq>
          <FromSeq>${item.WorkOrderSeq || 0}</FromSeq>
          <FromSerl>${item.WorkOrderSerl || 0}</FromSerl>
          <FromSubSerl>0</FromSubSerl>
          <ToTableSeq>6</ToTableSeq>
          <FromQty>${item.FromQty || 0}</FromQty>
          <FromSTDQty>${item.OrderQty || 0}</FromSTDQty>
          <FromAmt>${item.FromAmt || 0}</FromAmt>
          <FromVAT>${item.FromVAT || 0}</FromVAT>
          <PrevFromTableSeq>0</PrevFromTableSeq>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <ToSeq>${item.ToSeq || 0}</ToSeq>
          <ToQty>${item.ProdQty || 0}</ToQty>
          <ToSTDQty>${item.StdUnitProdQty || 0}</ToSTDQty>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSLGInOutDailyBatch(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
        <DataBlock1>
          <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
          <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
          <Status>${item.Status ?? 0}</Status>
          <Selected>${item.Selected ?? 0}</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <InOutNo>${item.WorkOrderNo || ''}</InOutNo>
          <FactUnit>${item.FactUnit || ''}</FactUnit>
          <InOutDate>${item.WorkDate || ''}</InOutDate>
          <DeptSeq>${item.DeptSeq || ''}</DeptSeq>
          <ProcSeq>${item.ProcSeq || ''}</ProcSeq>
          <Remark>${item.Remark || ''}</Remark>
          <InOutSeq>${item.WorkReportSeq || ''}</InOutSeq>
          <InOutType>130</InOutType>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSCOMCloseItemSub(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
            <DataBlock3>
              <WorkingTag>${WorkingTag}</WorkingTag>
              <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
              <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
              <Status>0</Status>
              <Selected>0</Selected>
              <Date>${item.Date ?? ''}</Date>
              <ItemSeq>${item.MatItemSeq ?? ''}</ItemSeq>
              <TABLE_NAME>DataBlock3</TABLE_NAME>
              <DeptSeq>${item.DeptSeq ?? ''}</DeptSeq>
              <FactUnit>${item.FactUnit ?? ''}</FactUnit>
              <FactUnitOld>${item.FactUnit ?? ''}</FactUnitOld>
              <DateOld>${item.Date ?? ''}</DateOld>
              <ServiceSeq>2894</ServiceSeq> 
              <MethodSeq>${item.MethodSeq ?? ''}</MethodSeq>
              <RptUnit>${item.RptUnit ?? ''}</RptUnit>
        </DataBlock3>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSPDSFCWorkReportMat(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
             <DataBlock2>
              <WorkingTag>${WorkingTag}</WorkingTag>
              <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
              <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
              <Status>0</Status>
              <Selected>0</Selected>
              <Qty>${item.Qty ?? ''}</Qty>
              <StdUnitQty>${item.StdUnitQty ?? ''}</StdUnitQty>
              <RealLotNo />
              <SerialNoFrom />
              <Remark>${item.Remark ?? ''}</Remark>
              <InputType />
              <IsPaid>${item.IsPaid ?? ''}</IsPaid>
              <IsPjt>${item.IsPjt ?? ''}</IsPjt>
              <PjtSeq />
              <WBSSeq />
              <WorkReportSeq>${item.WorkReportSeq ?? ''}</WorkReportSeq>
              <ItemSerl>${item.IdxNo || item.IDX_NO || ''}</ItemSerl>
              <MatUnitSeq>${item.MatUnitSeq ?? ''}</MatUnitSeq>
              <StdUnitSeq>${item.StdUnitSeq ?? ''}</StdUnitSeq>
              <ProcSeq>${item.ProcSeq ?? ''}</ProcSeq>
              <AssyYn>${item.AssyYn ?? ''}</AssyYn>
              <IsConsign>0</IsConsign>
              <GoodItemSeq>${item.GoodItemSeq ?? ''}</GoodItemSeq>
              <WHSeq>343</WHSeq>
              <ProdWRSeq>${item.ProdWRSeq ?? ''}</ProdWRSeq>
              <TABLE_NAME>DataBlock2</TABLE_NAME>
              <MatItemSeq>${item.MatItemSeq ?? ''}</MatItemSeq>
              <InputDate>${item.Date ?? ''}</InputDate>
            </DataBlock2>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSLGInOutDailyItemSubSave(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
               <DataBlock3>
                <WorkingTag>${WorkingTag}</WorkingTag>
              <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
              <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <TABLE_NAME>DataBlock3</TABLE_NAME>
                <InOutType>130</InOutType>
                <InOutKind>8023015</InOutKind>
                <InOutSerl>${item.IdxNo || item.IDX_NO || ''}</InOutSerl>
                <DataKind>0</DataKind>
                <InWHSeq>0</InWHSeq>
                <InOutSeq>${item.WorkReportSeq ?? ''}</InOutSeq>
                <InOutDataSerl>${item.IdxNo || item.IDX_NO || ''}</InOutDataSerl>
                <ItemSeq>${item.MatItemSeq ?? ''}</ItemSeq>
                <UnitSeq>${item.MatUnitSeq ?? 0}</UnitSeq>
                <StdUnitSeq>${item.StdUnitSeq ?? 0}</StdUnitSeq>
                <Qty>${item.Qty ?? 0}</Qty>
                <STDQty>${item.Qty ?? 0}</STDQty>
                <LotNo>${item.LotNo ?? ''}</LotNo>
                <InOutDetailKind>6042002</InOutDetailKind>
                <Remark>${item.Remark ?? ''}</Remark>
                <OutWHSeq>${item.WHSeq ?? ''}</OutWHSeq>
              </DataBlock3>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDSFCWorkReportWorkEmp(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
                <DataBlock4>
                  <WorkingTag>${WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
                  <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
                  <Status>0</Status>
                  <Selected>0</Selected>
                  <UMWorkCenterEmpType>${item.UMWorkCenterEmpType ?? ''}</UMWorkCenterEmpType>
                  <WorkStartTime>${item.WorkStartTime ?? ''}</WorkStartTime>
                  <WorkEndTime>${item.WorkEndTime ?? ''}</WorkEndTime>
                  <EmpCnt>${item.EmpCnt ?? ''}</EmpCnt>
                  <WorkHour>${item.WorkHour ?? ''}</WorkHour>
                  <ManHour>${item.ManHour ?? ''}</ManHour>
                  <EmpSeq>${item.EmpSeq ?? ''}</EmpSeq>
                  <WorkReportSeq>${item.WorkReportSeq ?? ''}</WorkReportSeq>
                  <Serl>${item.Serl ?? 0}</Serl>
                  <Remark>${item.Remark ?? ''}</Remark>
                  <IsNotApplyItem>0</IsNotApplyItem>
                  <TABLE_NAME>DataBlock4</TABLE_NAME>
                </DataBlock4>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSLGLotNoMasterCheck2(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
                <DataBlock1>
                  <WorkingTag>${WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
                  <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
                  <Status>0</Status>
                  <Selected>1</Selected>
                  <ItemName>${item.ItemName ?? ''}</ItemName>
                  <ItemNo>${item.ItemNo ?? ''}</ItemNo>
                  <Spec>${item.Spec ?? ''}</Spec>
                  <UnitName>${item.UnitName ?? ''}</UnitName>
                  <Qty>${item.Qty ?? ''}</Qty>
                  <LotNo>${item.LotNo ?? ''}</LotNo>
                  <OriItemName />
                  <OriItemSeq>${item.OriItemSeq ?? 0}</OriItemSeq>
                  <UnitSeq>${item.UnitSeq ?? ''}</UnitSeq>
                  <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                </DataBlock1>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSLGInOutDaily(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
                <DataBlock1>
                   <WorkingTag>${WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
                  <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
                  <Status>0</Status>
                  <Selected>1</Selected>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <IsChangedMst>0</IsChangedMst>
                  <InOutNo>${item.InOutNo ?? ''}</InOutNo>
                  <InOutSeq>${item.InOutSeq ?? ''}</InOutSeq>
                  <BizUnit>${item.BizUnit ?? ''}</BizUnit>
                  <BizUnitName>${item.BizUnitName ?? ''}</BizUnitName>
                  <InWHSeq>${item.InWHSeq ?? ''}</InWHSeq>
                  <InWHName>${item.InOuInWHNametSeq ?? ''}</InWHName>
                  <EmpSeq>${item.EmpSeq ?? ''}</EmpSeq>
                  <EmpName>${item.EmpName ?? ''}</EmpName>
                  <DeptSeq>${item.DeptSeq ?? ''}</DeptSeq>
                  <InOutDate>${item.InOutDate ?? ''}</InOutDate>
                     <InOutType>40</InOutType>
                </DataBlock1>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSLGInOutDailyItem(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
                <DataBlock1>
                   <WorkingTag>${WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
                  <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
                  <Status>0</Status>
                  <Selected>1</Selected>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <IsChangedMst>0</IsChangedMst>
                  <InOutNo>${item.InOutNo ?? ''}</InOutNo>
                  <InOutSeq>${item.InOutSeq ?? ''}</InOutSeq>
                  <BizUnit>${item.BizUnit ?? ''}</BizUnit>
                  <BizUnitName>${item.BizUnitName ?? ''}</BizUnitName>
                  <InWHSeq>${item.InWHSeq ?? ''}</InWHSeq>
                  <InWHName>${item.InOuInWHNametSeq ?? ''}</InWHName>
                  <EmpSeq>${item.EmpSeq ?? ''}</EmpSeq>
                  <EmpName>${item.EmpName ?? ''}</EmpName>
                  <DeptSeq>${item.DeptSeq ?? ''}</DeptSeq>
                  <InOutDate>${item.InOutDate ?? ''}</InOutDate>
                  <InOutType>${item.InOutType ?? ''}</InOutType>
                </DataBlock1>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSPDSFCWorkReportNonWork(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
               <DataBlock9>
      <WorkingTag>${WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
                  <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <UMNonWorkTypeL>${item.UMNonWorkTypeL ?? ''}</UMNonWorkTypeL>
    <UMNonWorkTypeS>${item.UMNonWorkTypeS ?? ''}</UMNonWorkTypeS>
    <WorkStartTime>${Number(item.WorkStartTime) || 0}</WorkStartTime>
    <WorkEndTime>${Number(item.WorkEndTime) || 0}</WorkEndTime>
    <ToolName>${item.ToolName ?? ''}</ToolName>
    <ToolNo>${item.ToolNo ?? ''}</ToolNo>
    <NonWorkHour>${Number(item.NonWorkHour) || 0}</NonWorkHour>
    <Remark>${item.Remark ?? ''}</Remark>
    <WorkReportSeq>${item.WorkReportSeq ?? ''}</WorkReportSeq>
    <Serl>${item.Serl ?? ''}</Serl>
    <ToolSeq>${item.ToolSeq ?? ''}</ToolSeq>
    <UMNonWorkTypeLSeq>${item.UMNonWorkTypeLSeq ?? ''}</UMNonWorkTypeLSeq>
    <UMNonWorkTypeSSeq>${item.UMNonWorkTypeSSeq ?? ''}</UMNonWorkTypeSSeq>
    <TABLE_NAME>DataBlock9</TABLE_NAME>
  </DataBlock9>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSLGLotNoMaster(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
               <DataBlock1>
                   <WorkingTag>${WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
                  <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
                  <Status>0</Status>
                  <Selected>0</Selected>
                  <ItemName>${item.ItemName ?? ''}</ItemName>
                  <ItemNo>${item.ItemNo ?? ''}</ItemNo>
                  <Spec>${item.Spec ?? ''}</Spec>
                  <UnitName>${item.UnitName ?? ''}</UnitName>
                  <Qty>${item.Qty ?? ''}</Qty>
                  <LotNo>${item.LotNo ?? ''}</LotNo>
                  <OriItemName />
                  <OriItemSeq>${item.OriItemSeq ?? 0}</OriItemSeq>
                  <UnitSeq>${item.UnitSeq ?? ''}</UnitSeq>
                  <ItemSeq>${item.ItemSeq ?? ''}</ItemSeq>
                </DataBlock1>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSLGInOutDaily2(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
               <DataBlock1>
                   <WorkingTag>${WorkingTag}</WorkingTag>
                  <IDX_NO>1</IDX_NO>
                  <DataSeq>1</DataSeq>
                  <Status>0</Status>
                  <Selected>1</Selected>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <IsChangedMst>0</IsChangedMst>
                 <InOutNo>${item.InOutNo ? item.InOutNo : 0}</InOutNo>
                  <InOutSeq>${item.InOutSeq ?? 0}</InOutSeq>
                  <BizUnit>${item.BizUnit ?? ''}</BizUnit>
                  <BizUnitName>${item.BizUnitName ?? ''}</BizUnitName>
                  <InWHSeq>${item.InWHSeq ?? ''}</InWHSeq>
                  <InWHName>${item.InOuInWHNametSeq ?? ''}</InWHName>
                  <EmpSeq>${item.EmpSeq ?? ''}</EmpSeq>
                  <EmpName>${item.EmpName ?? ''}</EmpName>
                  <DeptSeq>${item.DeptSeq ?? ''}</DeptSeq>
                  <InOutDate>${item.InOutDate ?? ''}</InOutDate>
                     <InOutType>40</InOutType>
                </DataBlock1>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSLGInOutDailyItem2(
    result: Array<{ [key: string]: any }>,
    detailWorkingTag: string,
    data2: any,
    header: any
  ): string {
    const xmlBlocks = result
      .map((item) => {
        return `
          <DataBlock2>
            <WorkingTag>${detailWorkingTag}</WorkingTag>
               <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
                  <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <InOutSeq>${data2.InOutSeq ?? 0}</InOutSeq>
            <InOutSerl>${item.InOutSerl ?? 0}</InOutSerl>
            <ItemName>${item.ItemName ?? ''}</ItemName>
            <ItemNo>${item.ItemNo ?? ''}</ItemNo>
            <Spec>${item.Spec ?? ''}</Spec>
            <UnitName>${item.UnitName ?? ''}</UnitName>
            <Price>${item.Price ?? 0}</Price>
            <Qty>${item.Qty ?? 0}</Qty>
            <Amt>${item.Amt ?? 0}</Amt>
            <InOutDetailKindName>${item.InOutDetailKindName ?? ''}</InOutDetailKindName>
            <STDUnitName>${item.UnitName ?? ''}</STDUnitName>
            <STDQty>${item.Qty ?? 0}</STDQty>
            <InWHName>${item.InWHName ?? ''}</InWHName>
            <InOutKindName>${item.InOutKindName ?? ''}</InOutKindName>
            <LotNo>${item.LotNo ?? ''}</LotNo>
            <SerialNo>${item.SerialNo ?? ''}</SerialNo>
            <InOutRemark>${item.InOutRemark ?? ''}</InOutRemark>
            <DVPlaceName>${item.DVPlaceName ?? ''}</DVPlaceName>
            <OriItemName>${item.OriItemName ?? ''}</OriItemName>
            <OriUnitName/>
            <CCtrName/>
            <OriSTDQty>${item.OriSTDQty ?? 0}</OriSTDQty>
            <OriQty>${item.OriQty ?? 0}</OriQty>
            <OriItemSeq>${item.OriItemSeq ?? 0}</OriItemSeq>
            <OriUnitSeq>${item.OriUnitSeq ?? 0}</OriUnitSeq>
            <IsStockSales/>
            <InOutDetailKind>${item.InOutDetailKind ?? ''}</InOutDetailKind> 
            <InOutKind>8023004</InOutKind>
            <EtcOutVAT>${item.EtcOutVAT ?? 0}</EtcOutVAT>
            <UnitSeq>${item.UnitSeq ?? 0}</UnitSeq>
            <OutWHSeq>${item.OutWHSeq ?? 0}</OutWHSeq>
            <InWHSeq>${item.InWHSeq ?? 0}</InWHSeq>
            <DVPlaceSeq>${item.DVPlaceSeq ?? 0}</DVPlaceSeq>
            <CCtrSeq>${item.CCtrSeq ?? 0}</CCtrSeq>
            <EtcOutAmt>${item.EtcOutAmt ?? 0}</EtcOutAmt>
            <ItemSeq>${item.ItemSeq ?? 0}</ItemSeq>
            <OutWHName>${item.OutWHName ?? ''}</OutWHName>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
            <InOutType>40</InOutType>
          </DataBlock2>
        `;
      })
      .join('');

    const dataBlock1 = `
      <DataBlock1>
        <WorkingTag>${header.WorkingTag}</WorkingTag>
          <IDX_NO>1</IDX_NO>
        <Status>0</Status>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
        <IsChangedMst>0</IsChangedMst>
        <BizUnit>${header.BizUnit}</BizUnit>
        <EmpSeq>${header.EmpSeq}</EmpSeq>
        <DeptSeq>${header.DeptSeq}</DeptSeq>
      </DataBlock1>
    `;

    return `<ROOT>${xmlBlocks}${dataBlock1}</ROOT>`;
  }
  generateXMLSLGInOutDailySave2(
    result: Array<{ [key: string]: any }>,
    detailWorkingTag: string,
  ): string {
    const xmlBlocks = result
      .map((item) => {
        return `
          <DataBlock2>
           <WorkingTag>${detailWorkingTag}</WorkingTag>
               <IDX_NO>${item.IdxNo || item.IDX_NO || ''}</IDX_NO>
                  <DataSeq>${item.IdxNo || item.IDX_NO || ''}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <InOutSeq>${item.InOutSeq ?? 0}</InOutSeq>
            <InOutSerl>${item.InOutSerl ?? 0}</InOutSerl>
            <ItemName>${item.ItemName ?? ''}</ItemName>
            <ItemNo>${item.ItemNo ?? ''}</ItemNo>
            <Spec>${item.Spec ?? ''}</Spec>
            <UnitName>${item.UnitName ?? ''}</UnitName>
           
            <Qty>${item.Qty ?? 0}</Qty>
            <Amt>${item.Amt ?? 0}</Amt>
            <InOutDetailKindName>${item.InOutDetailKindName ?? ''}</InOutDetailKindName>
            <STDUnitName>${item.STDUnitName ?? ''}</STDUnitName>
            <STDQty>${item.STDQty ?? 0}</STDQty>
            <InWHName>${item.InWHName ?? ''}</InWHName>
            <InOutKindName>${item.InOutKindName ?? ''}</InOutKindName>
            <LotNo>${item.LotNo ?? ''}</LotNo>
            <SerialNo>${item.SerialNo ?? ''}</SerialNo>
            <InOutRemark>${item.InOutRemark ?? ''}</InOutRemark>
            <DVPlaceName>${item.DVPlaceName ?? ''}</DVPlaceName>
            <OriItemName>${item.OriItemName ?? ''}</OriItemName>
            <OriUnitName>${item.OriUnitName ?? ''}</OriUnitName>
            <CCtrName>${item.CCtrName ?? ''}</CCtrName>
            <OriSTDQty>${item.OriSTDQty ?? 0}</OriSTDQty>
            <OriQty>${item.OriQty ?? 0}</OriQty>
            <OriItemSeq>${item.OriItemSeq ?? 0}</OriItemSeq>
            <OriUnitSeq>${item.OriUnitSeq ?? 0}</OriUnitSeq>
            <IsStockSales>${item.IsStockSales ?? ''}</IsStockSales>
            <InOutDetailKind>${item.InOutDetailKind ?? ''}</InOutDetailKind>
            <InOutKind>8023004</InOutKind>
            <EtcOutVAT>${item.EtcOutVAT ?? 0}</EtcOutVAT>
            <UnitSeq>${item.UnitSeq ?? 0}</UnitSeq>
            <OutWHSeq>${item.OutWHSeq ?? 0}</OutWHSeq>
            <InWHSeq>${item.InWHSeq ?? 0}</InWHSeq>
            <DVPlaceSeq>${item.DVPlaceSeq ?? 0}</DVPlaceSeq>
            <CCtrSeq>${item.CCtrSeq ?? 0}</CCtrSeq>
            <EtcOutAmt>${item.EtcOutAmt ?? 0}</EtcOutAmt>
            <ItemSeq>${item.ItemSeq ?? 0}</ItemSeq>
            <OutWHName>${item.OutWHName ?? ''}</OutWHName>
             <Price>${item.Price ?? 0}</Price>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
            <InOutType>40</InOutType>
          </DataBlock2>
        `;
      })
      .join('');



    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDSFCWorkReportSubEtcSave(
    result: Array<{ [key: string]: any }>,
    detailWorkingTag: string,
    WorkReportSeq: any
  ): string {
    const xmlBlocks = result
      .map((item) => {
        const idxNo = item.IdxNo || item.IDX_NO || '';
        return `
        <DataBlock5>
            <WorkingTag>${detailWorkingTag}</WorkingTag>
            <IDX_NO>${idxNo}</IDX_NO>
            <DataSeq>${idxNo}</DataSeq>
          <Status>0</Status>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock5</TABLE_NAME>
          <WorkReportSeq>${WorkReportSeq}</WorkReportSeq>
          <InOutSeq>${item.InOutSeq ?? 0}</InOutSeq>
          <InOutType>40</InOutType>
        </DataBlock5>
        `;
      })
      .join('');



    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  /*   generateXMLSLGInOutDailyItemD(
      result: Array<{ [key: string]: any }>,
      detailWorkingTag: string,
    ): string {
      const xmlBlocks = result
        .map((item) => {
          const idxNo = item.IdxNo || item.IDX_NO || '';
          return `
        <DataBlock1>
       <WorkingTag>${detailWorkingTag}</WorkingTag>
              <IDX_NO>${idxNo}</IDX_NO>
              <DataSeq>${idxNo}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
      <TABLE_NAME>DataBlock1</TABLE_NAME>
      <IsChangedMst>0</IsChangedMst>
      <BizUnit>${item.BizUnit ?? 0}</BizUnit>
      <EmpSeq>${item.EmpSeq ?? 0}</EmpSeq>
    </DataBlock1>
          `;
        })
        .join('');
  
  
  
      return `<ROOT>${xmlBlocks}</ROOT>`;
    } */


  generateXMLSLGInOutDailyItemD(result: Array<{ [key: string]: any }>, WorkingTag: string,): string {
    const xmlBlocks = result
      .map((item, index) => `
               <DataBlock1>
                   <WorkingTag>${WorkingTag}</WorkingTag>
                  <IDX_NO>${index + 1}</IDX_NO>
                  <DataSeq>${index + 1}</DataSeq>
                  <Status>0</Status>
                  <Selected>1</Selected>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                    <IsChangedMst>0</IsChangedMst>
                    <BizUnit>${item.BizUnit ?? 0}</BizUnit>
                    <EmpSeq>${item.EmpSeq ?? 0}</EmpSeq>
                </DataBlock1>
                  `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSLGInOutDailyItemSave(
  ): string {
    return `<ROOT></ROOT>`;
  }


}
