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
    return normalized === '1' || normalized === 'true' ? '1' : '0';
  }

  generateXMLSearchPjtProject(result: Array<{ [key: string]: any }>): string {
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
                  <BizUnit>${item.BizUnit || ''}</BizUnit>
                  <PlanFrDate>${item.PlanFrDate || ''}</PlanFrDate>
                  <PlanToDate>${item.PlanToDate || ''}</PlanToDate>
                  <QryFr>${item.QryFr || ''}</QryFr>
                  <QryTo>${item.QryTo || ''}</QryTo>
                  <PJTTypeSeq>${item.PJTTypeSeq || ''} </PJTTypeSeq>
                  <PJTName>${item.PJTName || ''}</PJTName>
                  <PJTNo>${item.PJTNo || ''}</PJTNo>
                  <SMSalesRecognize>${item.SMSalesRecognize || ''}</SMSalesRecognize>
                  <SMStatusSeq>${item.SMStatusSeq || ''}</SMStatusSeq>
                  <CustSeq>${item.CustSeq || ''}</CustSeq>
                  <ChargeDeptSeq>${item.ChargeDeptSeq || ''}</ChargeDeptSeq>
                  <ChargeEmpSeq>${item.ChargeEmpSeq || ''}</ChargeEmpSeq>
                  <SMExpKind>${item.SMExpKind || ''}</SMExpKind>
                  <FactUnit>${item.FactUnit || ''}</FactUnit>
                  <FactUnitName>${item.FactUnitName || ''}</FactUnitName>
                  <PMSeq>${item.PMSeq || ''}</PMSeq>
                  <ContractFrDate>${item.ContractFrDate || ''}</ContractFrDate>
                  <ContractToDate>${item.ContractToDate || ''}</ContractToDate>
                  <ContractDate>${item.ContractDate || ''}</ContractDate>
                  <ContractDateTo>${item.ContractDateTo || ''}</ContractDateTo>
                  <BizUnitName>${item.BizUnitName || ''}</BizUnitName>
                  <PJTTypeName>${item.PJTTypeName || ''}</PJTTypeName>
                  <SMSalesRecognizeName>${item.SMSalesRecognizeName || ''}</SMSalesRecognizeName>
                  <SMStatusSeq>${item.SMStatusSeq || ''}</SMStatusSeq>
                  <CustSeq>${item.CustSeq || ''}</CustSeq>
                  <ChargeDeptSeq>${item.ChargeDeptSeq || ''}</ChargeDeptSeq>
                  <ChargeEmpSeq>${item.ChargeEmpSeq || ''}</ChargeEmpSeq>
                  <SMExpKind>${item.SMExpKind || ''}</SMExpKind>
                  <FactUnit>${item.FactUnit || ''}</FactUnit>
                  <FactUnitName>${item.FactUnitName || ''}</FactUnitName>
                  <PMSeq>${item.PMSeq || ''}</PMSeq>
                  <ContractFrDate>${item.ContractFrDate || ''}</ContractFrDate>
                  <ContractToDate>${item.ContractToDate || ''}</ContractToDate>
                  <ContractDate>${item.ContractDate || ''}</ContractDate>
                  <ContractDateTo>${item.ContractDateTo || ''}</ContractDateTo>
                </DataBlock1>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLPjtProject(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                <DataBlock1>
                  <WorkingTag>${item.status || item.WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                  <Status>0</Status>
                  <DataSeq>${index + 1 || 1}</DataSeq>
                  <Selected>1</Selected>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <IsChangedMst>0</IsChangedMst>
                  <PJTSeq>${item?.PJTSeq || ''}</PJTSeq>
                  <PJTRev>${item?.PJTRev || '00'}</PJTRev>
                  <SMSalesReceipt>${item?.SMSalesReceipt || 7046001}</SMSalesReceipt>
                  <PJTRevSeq>${item?.PJTRevSeq || 1}</PJTRevSeq>
                  <PJTAmt>${item.PJTAmt || 0}</PJTAmt>
                  <ResultStdUnitSeq>${item.ResultStdUnitSeq || 1}</ResultStdUnitSeq>
                  <AccUnit>${item.AccUnit || 2}</AccUnit>
                  <SMSalesRecognize>${item.SMSalesRecognize || 7002004}</SMSalesRecognize>
                  <SMStatus>${item.SMStatus || 2001001}</SMStatus>
                  <PJTName>${item.PJTName || ''}</PJTName>
                  <PJTNo>${item.PJTNo || ''}</PJTNo>
                  <PlanFrDate>${item.PlanFrDate || ''}</PlanFrDate>
                  <PlanToDate>${item.PlanToDate || ''}</PlanToDate>
                  <ContractFrDate>${item.ContractFrDate || ''}</ContractFrDate>
                  <ContractToDate>${item.ContractToDate || ''}</ContractToDate>
                  <PJTTypeSeq>${item.PJTTypeSeq || 1}</PJTTypeSeq>
                  <BizUnit>${item.BizUnit || 0}</BizUnit>
                  <CustSeq>${item.CustSeq || 0}</CustSeq>
                  <ChargeEmpSeq>${item.ChargeEmpSeq || 0}</ChargeEmpSeq>
                  <ChargeDeptSeq>${item.ChargeDeptSeq || 0}</ChargeDeptSeq>
                  <WBSResrcLevel>${item.WBSResrcLevel || 0}</WBSResrcLevel>
                  <SMExpKind>${item.SMExpKind || 8009001}</SMExpKind>
                  <SLTaskSeq>${item.SLTaskSeq || ''}</SLTaskSeq>
                  <SLTaskName>${item.SLTaskName || ''}</SLTaskName>
                  <PMSeq>${item.PMSeq || ''}</PMSeq>
                  <PMName>${item.PMName || ''}</PMName>
                  <CurrSeq>${item.CurrSeq || 1}</CurrSeq>
                  <CurrRate>${item.CurrRate || 1}</CurrRate>
                  <Etc>${item.Etc || ''}</Etc>
                  <RegDate>${item.RegDate || ''}</RegDate>
                  <ContractDate>${item.ContractDate || ''}</ContractDate>
                  <UnitSeq>${item.UnitSeq || 1}</UnitSeq>
                  <ModelSeq>${item.ModelSeq || 0}</ModelSeq>
                  <UMCCtrKind>${item.UMCCtrKind || 0}</UMCCtrKind>
                  <UMCostType>${item.UMCostType || 0}</UMCostType>
                  <AssetSeq>${item.AssetSeq || 0}</AssetSeq>
                  <SMInOutKind>${item.SMInOutKind || 0}</SMInOutKind>
                  <IsInherit>${item.IsInherit || 0}</IsInherit>
                  <IsStandard>${item.IsStandard || 0}</IsStandard>
                  <UMModuleSeq>${item.UMModuleSeq || 1003002}</UMModuleSeq>
                  <SMInOut>${item.SMInOut || 1}</SMInOut>
                </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLCCtr(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                <DataBlock1>
                  <WorkingTag>${item.Status || item.WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                  <DataSeq>${index + 1 || 1}</DataSeq>
                  <Selected>1</Selected>
                  <Status>0</Status>
                  <BizUnit>${item.BizUnit || 0}</BizUnit>
                  <DeptSeq>${item.ChargeDeptSeq || 0}</DeptSeq>
                  <EmpSeq>${item.ChargeEmpSeq || 0}</EmpSeq>
                  <CCtrName>${item.CCtrName || ''}</CCtrName>
                  <AccUnit>${item.AccUnit || 1}</AccUnit>
                  <UMCostType>${item.UMCostType || 0}</UMCostType>
                  <UMCCtrKind>${item.UMCCtrKind || 0}</UMCCtrKind>
                </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLCCtrSave(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                <DataBlock1>
                  <WorkingTag>${item.Status || item.WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                  <DataSeq>${index + 1 || 1}</DataSeq>
                  <Selected>1</Selected>
                  <Status>0</Status>
                  <CCtrSeq>${item.CCtrSeq || 0}</CCtrSeq>
                  <CCtrName>${item.CCtrName || ''}</CCtrName>
                  <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
                  <DeptSeq>${item.DeptSeq || 0}</DeptSeq>
                  <UMCCtrKind>${item.UMCCtrKind || 0}</UMCCtrKind>
                  <UMCostType>${item.UMCostType || 0}</UMCostType>
                  <SMSourceType>5511001</SMSourceType>
                  <AccUnit>${item.AccUnit || 1}</AccUnit>
                  <BizUnit>${item.BizUnit || 0}</BizUnit>
                </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLConfirmDelete(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                <DataBlock1>
                  <WorkingTag>U</WorkingTag>
                  <IDX_NO>1</IDX_NO>
                  <DataSeq>1</DataSeq>
                  <Selected>1</Selected>
                  <Status>0</Status>
                  <CfmSeq>1</CfmSeq>
                  <CfmSerl>1</CfmSerl>
                  <TableName>_TPJTProject</TableName>
                </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLPjtDelv(result: Array<{ [key: string]: any }>, pjtSeq: any): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                <DataBlock1>
                  <WorkingTag>${item.Status || item.WorkingTag}</WorkingTag>
                  <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                  <DataSeq>${index + 1 || 1}</DataSeq>
                  <Status>0</Status>
                  <Selected>0</Selected>
                  <DelvSerl>${item.DelvSerl || 1}</DelvSerl>
                  <DelvExpectDate>${item.DelvExpectDate || ''}</DelvExpectDate>
                  <AdaptYMFr>${item.AdaptYMFr || ''}</AdaptYMFr>
                  <AdaptYMTo>${item.AdaptYMTo || ''}</AdaptYMTo>
                  <DelvQty>${item.DelvQty || 0}</DelvQty>
                  <ISPJTSales>${item.ISPJTSales || 0}</ISPJTSales>
                  <DelvPrice>${item.DelvPrice || 0}</DelvPrice>
                  <DelvAmt>${item.DelvAmt || 0}</DelvAmt>
                  <DelvVatAmt>${item.DelvVatAmt || 0}</DelvVatAmt>
                  <SumDelvAmt>${item.SumDelvAmt || 0}</SumDelvAmt>
                  <Remark>${item.Remark || ''}</Remark>
                  <DelvDomPrice>${item.DelvDomPrice || 0}</DelvDomPrice>
                  <DelvDomAmt>${item.DelvDomAmt || 0}</DelvDomAmt>
                  <DelvDomVatAmt>${item.DelvDomVatAmt || 0}</DelvDomVatAmt>
                  <SumDelvDomAmt>${item.SumDelvDomAmt || 0}</SumDelvDomAmt>
                  <ExpReceiptDate>${item.ExpReceiptDate || ''}</ExpReceiptDate>
                  <ItemSeq>${item.ItemSeq || 0}</ItemSeq>
                  <DelvCustSeq>${item.DelvCustSeq || 0}</DelvCustSeq>
                  <WBSSeq>${item.WBSSeq || 0}</WBSSeq>
                  <UnitSeq>${item.UnitSeq || 0}</UnitSeq>
                  <SMDelvType>${item.SMDelvType || 0}</SMDelvType>
                  <TABLE_NAME>DataBlock1</TABLE_NAME>
                  <PJTSeq>${item.PJTSeq || pjtSeq}</PJTSeq>
                </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLPjtItem(result: Array<{ [key: string]: any }>, pjtSeq: any): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                  <DataBlock1>
                    <WorkingTag>${item.WorkingTag || item.Status}</WorkingTag>
                    <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                    <DataSeq>${index + 1 || 1}</DataSeq>
                    <Status>0</Status>
                    <Selected>1</Selected>
                    <PJTItemSerl>${item.PJTItemSerl || 0}</PJTItemSerl>
                    <SMInputType>${item.SMInputType || 0}</SMInputType>
                    <ItemName>${item.ItemName || ''}</ItemName>
                    <ItemNo>${item.ItemNo || ''}</ItemNo>
                    <Spec>${item.Spec || ''}</Spec>
                    <ItemSeq>${item.ItemSeq || 0}</ItemSeq>
                    <ItemQty>${item.ItemQty || 0}</ItemQty>
                    <ItemPrice>${item.ItemPrice || 0}</ItemPrice>
                    <ItemAmt>${item.ItemAmt || 0}</ItemAmt>
                    <ItemVatAmt>${item.ItemVatAmt || 0}</ItemVatAmt>
                    <SumItemAmt>${item.SumItemAmt || 0}</SumItemAmt>
                    <ItemDomPrice>${item.ItemDomPrice || 0}</ItemDomPrice>
                    <ItemDomAmt>${item.ItemDomAmt || 0}</ItemDomAmt>
                    <ItemDomVatAmt>${item.ItemDomVatAmt || 0}</ItemDomVatAmt>
                    <SumItemDomAmt>${item.SumItemDomAmt || 0}</SumItemDomAmt>
                    <Remark>${item.Remark || ''}</Remark>
                    <UnitSeq>${item.UnitSeq || 0}</UnitSeq>
                    <TABLE_NAME>DataBlock1</TABLE_NAME>
                    <PJTSeq>${item.PJTSeq || pjtSeq}</PJTSeq>
                  </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

    generateXMLPjtItemDelete(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                  <DataBlock1>
                    <WorkingTag>${item.WorkingTag || item.Status}</WorkingTag>
                    <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                    <DataSeq>${index + 1 || 1}</DataSeq>
                    <Selected>0</Selected>
                    <Status>0</Status>
                    <PJTSeq>${item.PJTSeq || 0}</PJTSeq>
                    <PJTItemSerl>${item.PJTItemSerl || 0}</PJTItemSerl>
                    <SMInputType>${item.SMInputType || 0}</SMInputType>
                    <ItemName>${this.escapeXml(item.ItemName) || ''}</ItemName>
                    <ItemNo>${this.escapeXml(item.ItemNo) || ''}</ItemNo>
                    <Spec>${this.escapeXml(item.Spec) || ''}</Spec>
                    <ItemSeq>${item.ItemSeq || 0}</ItemSeq>
                    <UnitSeq>${item.UnitSeq || 0}</UnitSeq>
                    <ItemQty>${item.ItemQty || 0}</ItemQty>
                    <ItemPrice>${item.ItemPrice || 0}</ItemPrice>
                    <ItemAmt>${item.ItemAmt || 0}</ItemAmt>
                    <ItemDomPrice>${item.ItemDomPrice || 0}</ItemDomPrice>
                    <ItemDomAmt>${item.ItemDomAmt || 0}</ItemDomAmt>
                    <Remark>${item.Remark || ''}</Remark>
                    <ItemVatAmt>${item.ItemVatAmt || 0}</ItemVatAmt>
                    <SumItemAmt>${item.SumItemAmt || 0}</SumItemAmt>
                    <ItemDomVatAmt>${item.ItemDomVatAmt || 0}</ItemDomVatAmt>
                    <SumItemDomAmt>${item.SumItemDomAmt || 0}</SumItemDomAmt>
                  </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLCommon(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSearchMasterPJT(result: any): string {
    return `<ROOT>
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <PJTSeq>${result[0].PJTSeq}</PJTSeq>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLPJTItemQuery(result: Array<{ [key: string]: any }>): string {
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
              <PJTSeq>${item?.PJTSeq}</PJTSeq>
            </DataBlock1>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLPJTDelv(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
                <WorkingTag>${item?.WorkingTag || item?.Status || 'A'}</WorkingTag>
                <IDX_NO>1</IDX_NO>
                <Status>0</Status>
                <DataSeq>1</DataSeq>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                <IsChangedMst>0</IsChangedMst>
                <PJTSeq>${item?.PJTSeq}</PJTSeq>
              </DataBlock1>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLConditonCheckPjt(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                  <DataBlock1>
                    <WorkingTag>U</WorkingTag>
                    <IDX_NO>1</IDX_NO>
                    <Status>0</Status>
                    <DataSeq>1</DataSeq>
                    <Selected>1</Selected>
                    <TABLE_NAME>DataBlock1</TABLE_NAME>
                    <IsChangedMst>1</IsChangedMst>
                    <PJTSeq>${item?.PJTSeq}</PJTSeq>
                    <SupplyContRevSeq>1</SupplyContRevSeq>
                    <ProcDate>${item?.ProcDate}</ProcDate>
                    <SMStatusName>${item?.SMStatusName}</SMStatusName>
                    <CfmCode>1</CfmCode>
                    <ProcEmpSeq>${item?.ProcEmpSeq}</ProcEmpSeq>
                    <ProcDesc />
                    <ProcType>CONFIRM</ProcType>
                    <TableName>_TPJTProject</TableName>
                  </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSCOMConfirm(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
                  <DataBlock1>
                    <WorkingTag>U</WorkingTag>
                    <IDX_NO>1</IDX_NO>
                    <DataSeq>1</DataSeq>
                    <Selected>1</Selected>
                    <Status>0</Status>
                    <CfmSeq>${item?.PJTSeq}</CfmSeq>
                    <CfmDate>${item?.ProcDate}</CfmDate>
                    <CfmEmpSeq>${item?.ProcEmpSeq}</CfmEmpSeq>
                    <CfmReason />
                    <TableName>_TPJTProject</TableName>
                    <CfmCode>1</CfmCode>
                    <CfmSerl>1</CfmSerl>
                  </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
