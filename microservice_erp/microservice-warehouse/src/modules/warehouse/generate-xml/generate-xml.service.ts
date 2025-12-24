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
  //WH Register
  async generateXMLSDAWHMainQueryWEB(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock1>
        <WorkingTag>A</WorkingTag>
        <IDX_NO>${index + 1}</IDX_NO>
        <Status>0</Status>
        <DataSeq>${index + 1}</DataSeq>
        <Selected>1</Selected>
        <TABLE_NAME>DataBlock1</TABLE_NAME>
        <IsChangedMst>0</IsChangedMst>
        <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
        <FactUnit>${this.escapeXml(item.FactUnit || '')}</FactUnit>
        <SMWHKind>${this.escapeXml(item.SMWHKind || '')}</SMWHKind>
        <WHName>${this.escapeXml(item.WHName || '')}</WHName>
      </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  async generateXMLSDAWHMainCheck(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
         <WorkingTag>A</WorkingTag>
         <IDX_NO>${item?.IdxNo || 0}</IDX_NO>
        <Status>0</Status>
        <DataSeq>${item?.IdxNo || 0}</DataSeq>
        <Selected>1</Selected>
          <WHSeq>0</WHSeq>
          <BizUnitName>${this.escapeXml(item?.BizUnitName || '')}</BizUnitName>
          <FactUnitName>${this.escapeXml(item?.FactUnitName || '')}</FactUnitName>
          <WHName>${this.escapeXml(item?.WHName || '')}</WHName>
          <CostWHName> ${this.escapeXml(item?.CostWHName || '')}</CostWHName>
          <WHKindName>${this.escapeXml(item?.WHKindName || '')}</WHKindName>
          <MngDeptName>${this.escapeXml(item?.MngDeptName || '')}</MngDeptName>
          <CommissionCustName>${this.escapeXml(item?.CommissionCustName || '')}</CommissionCustName>
          <IsWHEmp>${this.escapeXml(item?.IsWHEmp ? 1 : 0)}</IsWHEmp>
          <IsWHItem>${this.escapeXml(item?.IsWHItem ? 1 : 0)}</IsWHItem>
          <RegionName>${this.escapeXml(item?.RegionName || '')}</RegionName>
          <ScopeName>${this.escapeXml(item?.ScopeName || '')}</ScopeName>
          <WHAddress>${this.escapeXml(item?.WHAddress || '')}</WHAddress>
          <IsNotUse>${this.escapeXml(item?.IsNotUse ? 1 : 0)}</IsNotUse>
          <SortSeq>${this.escapeXml(item?.SortSeq || '')}</SortSeq>
          <UMCostWHGroup>${this.escapeXml(item?.UMCostWHGroup || '')}</UMCostWHGroup>
          <SMWHKind>${this.escapeXml(item?.SMWHKind || '')}</SMWHKind>
          <MngDeptSeq>${this.escapeXml(item?.MngDeptSeq || '')}</MngDeptSeq>
          <CommissionCustSeq>${this.escapeXml(item?.CommissionCustSeq || '')}</CommissionCustSeq>
          <UMRegion>${this.escapeXml(item?.UMRegion || '')}</UMRegion>
          <WMSCode>${this.escapeXml(item?.WMSCode || '')}</WMSCode>
          <UMScope>${this.escapeXml(item?.UMScope || '')}</UMScope>
          <BizUnit>${this.escapeXml(item?.BizUnit || '')}</BizUnit>
          <FactUnit>${this.escapeXml(item?.FactUnit || '')}</FactUnit>
        <IsNotMinusCheck>${this.escapeXml(item?.IsNotMinusCheck ? 1 : 0)}</IsNotMinusCheck>
          <TABLE_NAME>DataBlock2</TABLE_NAME>
      </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  async generateXMLSDAWHMainSave(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
           <WorkingTag>A</WorkingTag>
           <IDX_NO>${item?.IDX_NO || 0}</IDX_NO>
            <DataSeq>${item?.DataSeq || 0}</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <WHSeq>${this.escapeXml(item?.WHSeq || '')}</WHSeq>
            <BizUnit>${this.escapeXml(item?.BizUnit || '')}</BizUnit>
            <FactUnit>${this.escapeXml(item?.FactUnit || '')}</FactUnit>
            <UMCostWHGroup>${this.escapeXml(item?.UMCostWHGroup || '')}</UMCostWHGroup>
            <WHName>${this.escapeXml(item?.WHName || '')}</WHName>
            <MngDeptSeq>${this.escapeXml(item?.MngDeptSeq || '')}</MngDeptSeq>
            <SMWHKind>${this.escapeXml(item?.SMWHKind || '')}</SMWHKind>
            <CommissionCustSeq>${this.escapeXml(item?.CommissionCustSeq || '')}</CommissionCustSeq>
               <IsWHEmp>${this.escapeXml(item?.IsWHEmp)}</IsWHEmp>
          <IsWHItem>${this.escapeXml(item?.IsWHItem)}</IsWHItem>
            <UMRegion>${this.escapeXml(item?.UMRegion || '')}</UMRegion>
            <WHAddress> ${this.escapeXml(item?.WHAddress || '')}</WHAddress>
            <SortSeq>${this.escapeXml(item?.SortSeq || '')}</SortSeq>
            <IsNotUse>${this.escapeXml(item?.IsNotUse)}</IsNotUse>
            <BizUnitName>${this.escapeXml(item?.BizUnitName || '')}</BizUnitName>
            <FactUnitName>${this.escapeXml(item?.FactUnitName || '')}</FactUnitName>
            <CostWHName> ${this.escapeXml(item?.CostWHName || '')}</CostWHName>
            <MngDeptName>${this.escapeXml(item?.MngDeptName || '')}</MngDeptName>
            <WHKindName>${this.escapeXml(item?.WHKindName || '')}</WHKindName>
            <RegionName>${this.escapeXml(item?.RegionName || '')}</RegionName>
            <CommissionCustName>${this.escapeXml(item?.CommissionCustName || '')}</CommissionCustName>
            <WMSCode>${this.escapeXml(item?.WMSCode || '')} </WMSCode>
            <ScopeName>${this.escapeXml(item?.ScopeName || '')} </ScopeName>
            <UMScope>${this.escapeXml(item?.UMScope || '')}</UMScope>
            <IsNotMinusCheck>${this.escapeXml(item?.IsNotMinusCheck)}</IsNotMinusCheck>
      </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSDAWHSubAutoCreate(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
           <WorkingTag>A</WorkingTag>
           <IDX_NO>${index + 1}</IDX_NO>
            <DataSeq>${index + 1}</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <WHSeq>${this.escapeXml(item?.WHSeq || '0')}</WHSeq>
            <BizUnit>${this.escapeXml(item?.BizUnit || '')}</BizUnit>
            <FactUnit>${this.escapeXml(item?.FactUnit || '')}</FactUnit>
            <UMCostWHGroup>${this.escapeXml(item?.UMCostWHGroup || '')}</UMCostWHGroup>
            <WHName>${this.escapeXml(item?.WHName || '')}</WHName>
            <MngDeptSeq>${this.escapeXml(item?.MngDeptSeq || '')}</MngDeptSeq>
            <SMWHKind>${this.escapeXml(item?.SMWHKind || '')}</SMWHKind>
            <CommissionCustSeq>${this.escapeXml(item?.CommissionCustSeq || '')}</CommissionCustSeq>
            <IsWHEmp>${this.escapeXml(item?.IsWHEmp || '')}</IsWHEmp>
            <IsWHItem>${this.escapeXml(item?.IsWHItem || '')}</IsWHItem>
            <UMRegion>${this.escapeXml(item?.UMRegion || '')}</UMRegion>
            <WHAddress> ${this.escapeXml(item?.WHAddress || '')}</WHAddress>
            <SortSeq>${this.escapeXml(item?.SortSeq || '')}</SortSeq>
            <IsNotUse>${this.escapeXml(item?.IsNotUse || '')}</IsNotUse>
            <BizUnitName>${this.escapeXml(item?.BizUnitName || '')}</BizUnitName>
            <FactUnitName>${this.escapeXml(item?.FactUnitName || '')}</FactUnitName>
            <CostWHName> ${this.escapeXml(item?.CostWHName || '')}</CostWHName>
            <MngDeptName>${this.escapeXml(item?.MngDeptName || '')}</MngDeptName>
            <WHKindName>${this.escapeXml(item?.WHKindName || '')}</WHKindName>
            <RegionName>${this.escapeXml(item?.RegionName || '')}</RegionName>
            <CommissionCustName>${this.escapeXml(item?.CommissionCustName || '')}</CommissionCustName>
            <WMSCode>${this.escapeXml(item?.WMSCode || '')} </WMSCode>
            <ScopeName>${this.escapeXml(item?.ScopeName || '')} </ScopeName>
            <UMScope>${this.escapeXml(item?.UMScope || '')}</UMScope>
            <IsNotMinusCheck>${this.escapeXml(item?.IsNotMinusCheck || '')}</IsNotMinusCheck>
      </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSDAWHMainCheckDorU(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
      <DataBlock2>
          <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${index + 1}</IDX_NO>
          <Status>0</Status>
          <DataSeq>${index + 1}</DataSeq>
          <Selected>1</Selected>
          <WHSeq>${this.escapeXml(item?.WHSeq || '')}</WHSeq>
          <BizUnitName>${this.escapeXml(item?.BizUnitName || '')}</BizUnitName>
          <FactUnitName>${this.escapeXml(item?.FactUnitName || '')}</FactUnitName>
          <WHName>${this.escapeXml(item?.WHName || '')}</WHName>
          <CostWHName> ${this.escapeXml(item?.CostWHName || '')}</CostWHName>
          <WHKindName>${this.escapeXml(item?.WHKindName || '')}</WHKindName>
          <MngDeptName>${this.escapeXml(item?.MngDeptName || '')}</MngDeptName>
          <CommissionCustName>${this.escapeXml(item?.CommissionCustName || '')}</CommissionCustName>
            <IsWHEmp>${this.escapeXml(this.convertToNumber(item?.IsWHEmp))}</IsWHEmp>
          <IsWHItem>${this.escapeXml(this.convertToNumber(item?.IsWHItem))}</IsWHItem>
          <RegionName>${this.escapeXml(item?.RegionName || '')}</RegionName>
          <ScopeName>${this.escapeXml(item?.ScopeName || '')}</ScopeName>
          <WHAddress>${this.escapeXml(item?.WHAddress || '')}</WHAddress>
          <IsNotUse>${this.escapeXml(this.convertToNumber(item?.IsNotUse))}</IsNotUse>
          <SortSeq>${this.escapeXml(item?.SortSeq || '')}</SortSeq>
          <UMCostWHGroup>${this.escapeXml(item?.UMCostWHGroup || '')}</UMCostWHGroup>
          <SMWHKind>${this.escapeXml(item?.SMWHKind || '')}</SMWHKind>
          <MngDeptSeq>${this.escapeXml(item?.MngDeptSeq || '')}</MngDeptSeq>
          <CommissionCustSeq>${this.escapeXml(item?.CommissionCustSeq || '')}</CommissionCustSeq>
          <UMRegion>${this.escapeXml(item?.UMRegion || '')}</UMRegion>
          <WMSCode>${this.escapeXml(item?.WMSCode || '')}</WMSCode>
          <UMScope>${this.escapeXml(item?.UMScope || '')}</UMScope>
          <BizUnit>${this.escapeXml(item?.BizUnit || '')}</BizUnit>
          <FactUnit>${this.escapeXml(item?.FactUnit || '')}</FactUnit>
          <IsNotMinusCheck>${this.escapeXml(this.convertToNumber(item?.IsNotMinusCheck))}</IsNotMinusCheck>
          <TABLE_NAME>DataBlock2</TABLE_NAME>
      </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSDAWHMainDorU(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string,
  ): Promise<string> {
    const xmlBlocks = result

      .map(
        (item, index) => `
        
      <DataBlock2>
           <WorkingTag>${WorkingTag}</WorkingTag>
           <IDX_NO>${index + 1}</IDX_NO>
            <DataSeq>${index + 1}</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <WHSeq>${this.escapeXml(item?.WHSeq || '')}</WHSeq>
            <BizUnit>${this.escapeXml(item?.BizUnit || '')}</BizUnit>
            <FactUnit>${this.escapeXml(item?.FactUnit || '')}</FactUnit>
            <UMCostWHGroup>${this.escapeXml(item?.UMCostWHGroup || '')}</UMCostWHGroup>
            <WHName>${this.escapeXml(item?.WHName || '')}</WHName>
            <MngDeptSeq>${this.escapeXml(item?.MngDeptSeq || '')}</MngDeptSeq>
            <SMWHKind>${this.escapeXml(item?.SMWHKind || '')}</SMWHKind>
            <CommissionCustSeq>${this.escapeXml(item?.CommissionCustSeq || '')}</CommissionCustSeq>
            <IsWHEmp>${this.escapeXml(item?.IsWHEmp)}</IsWHEmp>
            <IsWHItem>${this.escapeXml(item?.IsWHItem)}</IsWHItem>
            <UMRegion>${this.escapeXml(item?.UMRegion || '')}</UMRegion>
            <WHAddress> ${this.escapeXml(item?.WHAddress || '')}</WHAddress>
            <SortSeq>${this.escapeXml(item?.SortSeq || '')}</SortSeq>
            <IsNotUse>${this.escapeXml(item?.IsNotUse)}</IsNotUse>
            <BizUnitName>${this.escapeXml(item?.BizUnitName || '')}</BizUnitName>
            <FactUnitName>${this.escapeXml(item?.FactUnitName || '')}</FactUnitName>
            <CostWHName> ${this.escapeXml(item?.CostWHName || '')}</CostWHName>
            <MngDeptName>${this.escapeXml(item?.MngDeptName || '')}</MngDeptName>
            <WHKindName>${this.escapeXml(item?.WHKindName || '')}</WHKindName>
            <RegionName>${this.escapeXml(item?.RegionName || '')}</RegionName>
            <CommissionCustName>${this.escapeXml(item?.CommissionCustName || '')}</CommissionCustName>
            <WMSCode>${this.escapeXml(item?.WMSCode || '')} </WMSCode>
            <ScopeName>${this.escapeXml(item?.ScopeName || '')} </ScopeName>
            <UMScope>${this.escapeXml(item?.UMScope || '')}</UMScope>
            <IsNotMinusCheck>${this.escapeXml(item?.IsNotMinusCheck)}</IsNotMinusCheck>
      </DataBlock2>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  async generateXMLSDAWHCaseItemQuery(
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
        <FactUnit>${this.escapeXml(item.FactUnit || '')}</FactUnit>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSDAWHItemQuery(
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
      <FactUnit>${this.escapeXml(item.FactUnit || '')}</FactUnit>
      <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
      <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
      <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
      <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
      <Spec>${this.escapeXml(item.Spec || '')}</Spec>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSDAWHItemCheck(
    result: Array<{ [key: string]: any }>,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
        <DataBlock1>
        <WorkingTag>A</WorkingTag>
        <IDX_NO>${index + 1}</IDX_NO>
        <DataSeq>${index + 1}</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
        <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
        <Spec>${this.escapeXml(item.Spec || '')}</Spec>
        <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
        <SafetyQty>${item.SafetyQty || 0}</SafetyQty>
        <Location> ${this.escapeXml(item.Location || '')}</Location>
        <ItemSeq>${item.ItemSeq}</ItemSeq>
        <ItemSeqOld>0</ItemSeqOld>
        <WHSeq>${item.WHSeq}</WHSeq>
      </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSDAWHItem(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string,
  ): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) => `
          <DataBlock1>
          <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${item?.IdxNo || item?.IDX_NO}</IDX_NO>
          <DataSeq>${index + 1}</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
          <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
          <Spec>${this.escapeXml(item.Spec || '')}</Spec>
          <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
          <SafetyQty>${item.SafetyQty || 0}</SafetyQty>
          <Location> ${this.escapeXml(item.Location || '')}</Location>
          <ItemSeq>${item.ItemSeq}</ItemSeq>
          <ItemSeqOld>${item.ItemSeqOld || 0}</ItemSeqOld>
          <WHSeq>${item.WHSeq}</WHSeq>
        </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  async generateXMLSLGWHStockListDynamicQueryWEB(
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
    <IsUnitQry>0</IsUnitQry>
    <IsZeroQty>1</IsZeroQty>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName />
    <DateFr>${this.escapeXml(item.DateFr || '')}</DateFr>
    <DateTo>${this.escapeXml(item.DateTo || '')}</DateTo>
    <SMWHKind>${this.escapeXml(item.SMWHKind || '')}</SMWHKind>
    <WHKindName />
    <CustSeq />
    <CustName />
    <QryType>S</QryType>
    <QryTypeName>Tồn kho thực tế</QryTypeName>
    <FactUnit>${this.escapeXml(item.FactUnit || '')}</FactUnit>
    <FactUnitName />
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
    <AssetName />
    <ItemClassLSeq />
    <ItemClassLName />
    <ItemClassMSeq>${this.escapeXml(item.ItemClassMSeq || '')}</ItemClassMSeq>
    <ItemClassMName />
    <ItemClassSSeq />
    <ItemClassSName />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <SMABC />
    <IsSubDisplay>0</IsSubDisplay>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGBizUnitStockListQueryWEB(
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
    <IsUnitQry>0</IsUnitQry>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName />
    <DateFr>${this.escapeXml(item.DateFr || '')}</DateFr>
    <DateTo>${this.escapeXml(item.DateTo || '')}</DateTo>
    <WHKindName />
    <QryType>S</QryType>
    <QryTypeName>Tồn kho thực tế</QryTypeName>
    <FactUnit>${this.escapeXml(item.FactUnit || '')}</FactUnit>
    <FactUnitName />
    <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
    <AssetName />
    <ItemClassLSeq />
    <ItemClassLName />
    <ItemClassMSeq>${this.escapeXml(item.ItemClassMSeq || '')}</ItemClassMSeq>
    <ItemClassMName />
    <ItemClassSSeq />
    <ItemClassSName />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
  </DataBlock1>`,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockDetailListQueryWEB(
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
    <IsUnitQry>0</IsUnitQry>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <IsSubDisplay>0</IsSubDisplay>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
    <DateFr>${this.escapeXml(item.DateFr || '')}</DateFr>
    <DateTo>${this.escapeXml(item.DateTo || '')}</DateTo>
    <CustSeq />
    <CustName />
    <QryType>S</QryType>
    <QryTypeName>Tồn kho thực tế</QryTypeName>
    <FactUnit>${this.escapeXml(item.FactUnit || '')}</FactUnit>
    <FactUnitName />
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <SMWHKind />
    <WHKindName />
    <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <IsSubInclude>${this.escapeXml(item.StockType || '')}</IsSubInclude>
  </DataBlock1>
    `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHStockAgingListQueryWEB(
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
    <BizUnitName></BizUnitName>
    <STDDate>202501</STDDate>
    <CustSeq />
    <CustName />
    <QryType>S</QryType>
    <QryTypeName>Tồn kho thực tế</QryTypeName>
    <FactUnit>${this.escapeXml(item.FactUnit || '')}</FactUnit>
    <FactUnitName />
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
    <AssetName />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <IsUnitQry>0</IsUnitQry>
    <IsSubDisplay>0</IsSubDisplay>
  </DataBlock1>
    `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGWHLotStockListQueryWEB(
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
    <CustSeq />
    <CustName />
    <IsUnitQry>0</IsUnitQry>
    <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
    <BizUnitName></BizUnitName>
    <DateFr>${this.escapeXml(item.DateFr || '')}</DateFr>
    <DateTo>${this.escapeXml(item.DateTo || '')}</DateTo>
    <ValiDateFrom />
    <ValiDateTo />
    <FactUnit>${this.escapeXml(item.FactUnit || '')}</FactUnit>
    <FactUnitName />
    <WHSeq>${this.escapeXml(item.WHSeq || '')}</WHSeq>
    <WHName>${this.escapeXml(item.WHName || '')}</WHName>
    <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
    <AssetName />
    <SMWHKind />
    <WHKindName />
    <ItemClassLSeq />
    <ItemClassMSeq>${this.escapeXml(item.ItemClassMSeq || '')}</ItemClassMSeq>
    <ItemClassSSeq />
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <ValiToDate>0</ValiToDate>
    <IsSubDisplay>0</IsSubDisplay>
    <QryType>S</QryType>
  </DataBlock1>
    `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
