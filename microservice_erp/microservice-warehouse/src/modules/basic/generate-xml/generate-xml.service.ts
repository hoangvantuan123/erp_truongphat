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

  private convertToNumber(value: boolean | string | number | null | undefined): number {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    if (typeof value === 'number') {
      return value === 1 ? 1 : 0;
    }
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return lower === 'true' || lower === '1' ? 1 : 0;
    }
    return 0; // null / undefined / giá trị khác
  }


  generateXMLSDAItemListBaseQuery(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
       <DataBlock1>
    <WorkingTag>M</WorkingTag>
    <IDX_NO>1</IDX_NO>
    <Status>0</Status>
    <DataSeq>1</DataSeq>
    <Selected>1</Selected>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <IsChangedMst>1</IsChangedMst>
    <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
    <UMItemClassL>${this.escapeXml(item.UMItemClassL || '')}</UMItemClassL>
    <UMItemClassM>${this.escapeXml(item.UMItemClassM || '')}</UMItemClassM>
    <UMItemClassS>${this.escapeXml(item.UMItemClassS || '')}</UMItemClassS>
    <SMInOutKind>${this.escapeXml(item.SMInOutKind || '')}</SMInOutKind>
    <SMStatus>${this.escapeXml(item.SMStatus || '')}</SMStatus>
    <SMABC>${this.escapeXml(item.SMABC || '')}</SMABC>
    <MakerSeq>${this.escapeXml(item.MakerSeq || '')}</MakerSeq>
    <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
    <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
    <UnitSeq>${this.escapeXml(item.UnitSeq || '')}</UnitSeq>
    <ModelSeq>${this.escapeXml(item.ModelSeq || '')}</ModelSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
    <Spec>${this.escapeXml(item.Spec || '')}</Spec>
    <FromDate>${this.escapeXml(item.FromDate || '')}</FromDate>
    <ToDate>${this.escapeXml(item.ToDate || '')}</ToDate>
  </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  //WH Register

  generateXMLItem(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
          <WorkingTag>${this.escapeXml(WorkingTag)}</WorkingTag>
          <IDX_NO>${this.escapeXml(item?.IdxNo || item?.IDX_NO)}</IDX_NO>
          <DataSeq>${index + 1}</DataSeq>
          <Status>0</Status>
          <Selected>1</Selected>
          <ItemSeq>${(item?.ItemSeq || 0)}</ItemSeq>
          <ItemName>${this.escapeXml(item?.ItemName || '')}</ItemName>
          <ItemNo>${(item?.ItemNo || '')}</ItemNo>
          <Spec>${this.escapeXml(item?.Spec || '')}</Spec>
          <TrunName>${this.escapeXml(item?.TrunName || '')}</TrunName>
          <AssetName>${this.escapeXml(item?.AssetName || '')}</AssetName>
          <AssetSeq>${(item?.AssetSeq || 0)}</AssetSeq>
          <UnitName>${this.escapeXml(item?.UnitName || '')}</UnitName>
          <UnitSeq>${(item?.UnitSeq || 0)}</UnitSeq>
          <SMStatusName>${(item?.SMStatusName || '')}</SMStatusName>
          <SMStatus>${(item?.SMStatus)}</SMStatus>
          <SMInOutKind>${this.escapeXml(item?.SMInOutKind || '')}</SMInOutKind>
          <DeptName>${this.escapeXml(item?.DeptName || '')}</DeptName>
          <DeptSeq>${(item?.DeptSeq || 0)}</DeptSeq>
          <EmpName>${this.escapeXml(item?.EmpName || '')}</EmpName>
          <EmpSeq>${(item?.EmpSeq)}</EmpSeq>
          <ModelName>${this.escapeXml(item?.ModelName || '')}</ModelName>
          <ModelSeq>${(item?.ModelSeq)}</ModelSeq>
          <STDItemName>${this.escapeXml(item?.STDItemName || '')}</STDItemName>
          <ItemSName>${(item?.ItemSName)}</ItemSName>
          <ItemEngName>${this.escapeXml(item?.ItemEngName || '')}</ItemEngName>
          <ItemEngSName>${this.escapeXml(item?.ItemEngSName || '')}</ItemEngSName>
          <ItemClassLName>${this.escapeXml(item?.ItemClassLName || '')}</ItemClassLName>
          <ItemClassMName>${this.escapeXml(item?.ItemClassMName || '')}</ItemClassMName>
          <ItemClassSName>${this.escapeXml(item?.ItemClassSName || '')}</ItemClassSName>
          <UMItemClassS>${this.escapeXml(item?.UMItemClassS || '')}</UMItemClassS>
          <IsInherit>${this.escapeXml(item?.IsInherit || 0)}</IsInherit>
          <IsVessel>${this.escapeXml(item?.IsVessel || 0)}</IsVessel>
          <IsVat>${this.convertToNumber(item?.IsVat)}</IsVat>
          <SMVatKind>${this.escapeXml(item?.SMVatKind || 0)}</SMVatKind>
          <SMVatType>${this.escapeXml(item?.SMVatType || 0)}</SMVatType>
          <IsOption>${this.convertToNumber(item?.IsOption)}</IsOption>
          <IsSet>${this.convertToNumber(item?.IsSet)}</IsSet>
          <VatKindName>${this.escapeXml(item?.VatKindName || 0)}</VatKindName>
          <VatTypeName>${this.escapeXml(item?.VatTypeName || 0)}</VatTypeName>
          <Guaranty>${(item?.Guaranty || 0)}</Guaranty>
          <HSCode>${this.escapeXml(item?.HSCode || 0)}</HSCode>
          <IsRollUnit>${this.convertToNumber(item?.IsRollUnit)}</IsRollUnit>
          <IsSerialMng>${this.convertToNumber(item?.IsSerialMng)}</IsSerialMng>
          <SeriNoCd>${this.escapeXml(item?.SeriNoCd || 0)}</SeriNoCd>
          <IsLotMng>${this.convertToNumber(item?.IsLotMng)}</IsLotMng>
          <IsQtyChange>${this.convertToNumber(item?.IsQtyChange)}</IsQtyChange>
          <SafetyStk>${this.escapeXml(item?.SafetyStk || 0)}</SafetyStk>
          <SMLimitTermKind>${this.escapeXml(item?.SMLimitTermKind || 0)}</SMLimitTermKind>
          <LimitTerm>${(item?.LimitTerm || 0)}</LimitTerm>
          <STDLoadConvQty>${(item?.STDLoadConvQty || 0)}</STDLoadConvQty>
          <SMConsgnmtKind>${this.escapeXml(item?.SMConsgnmtKind || 0)}</SMConsgnmtKind>
          <BOMUnitSeq>${this.escapeXml(item?.BOMUnitSeq || 0)}</BOMUnitSeq>
          <OutLoss>${(item?.OutLoss || 0)}</OutLoss>
          <InLoss>${(item?.InLoss || 0)}</InLoss>
          <SMMrpKind>${this.escapeXml(item?.SMMrpKind || 0)}</SMMrpKind>
          <SMOutKind>${this.escapeXml(item?.SMOutKind || 0)}</SMOutKind>
          <SMProdMethod>${this.escapeXml(item?.SMProdMethod || 0)}</SMProdMethod>
          <SMProdSpec>${this.escapeXml(item?.SMProdSpec || 0)}</SMProdSpec>
          <ConsgnmtKind>${this.escapeXml(item?.ConsgnmtKind || 0)}</ConsgnmtKind>
          
          <BOMUnitName>${this.escapeXml(item?.BOMUnitName || 0)}</BOMUnitName>
          <MrpKind>${this.escapeXml(item?.MrpKind || 0)}</MrpKind>
          <OutKind>${this.escapeXml(item?.OutKind || 0)}</OutKind>
          <ProdMethod>${this.escapeXml(item?.ProdMethod || 0)}</ProdMethod>
          <ProdSpec>${this.escapeXml(item?.ProdSpec || 0)}</ProdSpec>
          <UMPurGroup>${this.escapeXml(item?.UMPurGroup || 0)}</UMPurGroup>
          <MkCustSeq>${this.escapeXml(item?.MkCustSeq || 0)}</MkCustSeq>
          <PurCustSeq>${this.escapeXml(item?.PurCustSeq || 0)}</PurCustSeq>
          <MinQty>${(item?.MinQty || 0)}</MinQty>
          <StepQty>${this.escapeXml(item?.StepQty || 0)}</StepQty>
          <SMPurKind>${this.escapeXml(item?.SMPurKind || 0)}</SMPurKind>
          <IsPurVat>${this.convertToNumber(item?.IsPurVat)}</IsPurVat>
          <IsAutoPurCreate>${this.escapeXml(item?.IsAutoPurCreate || 0)}</IsAutoPurCreate>
          <OrderQty>${(item?.OrderQty || 0)}</OrderQty>
          <DelvDay>${(item?.DelvDay || 0)}</DelvDay>
          <CustomTaxRate>${this.escapeXml(item?.CustomTaxRate || 0)}</CustomTaxRate>
          <PurGroup>${this.escapeXml(item?.PurGroup || '')}</PurGroup>
          <MkCustName>${this.escapeXml(item?.MkCustName || '')}</MkCustName>
          <PurCustName>${this.escapeXml(item?.PurCustName || '')}</PurCustName>
          <PurKind>${(item?.PurKind || 0)}</PurKind>
          <SMPurProdType>${this.escapeXml(item?.SMPurProdType || '')}</SMPurProdType>
          <PurProdType>${this.escapeXml(item?.PurProdType || '')}</PurProdType>
          <SMInOutKindName>${this.escapeXml(item?.SMInOutKindName || '')}</SMInOutKindName>
          <SMLimitTermKindName>${this.escapeXml(item?.SMLimitTermKindName || '')}</SMLimitTermKindName>
          <SMABCName>${this.escapeXml(item?.SMABCName || 0)}</SMABCName>
          <SMABC>${this.escapeXml(item?.SMABC || 0)}</SMABC>
          <IsInQC>${this.convertToNumber(item?.IsInQC)}</IsInQC>
          <IsOutQC>${this.convertToNumber(item?.IsOutQC)}</IsOutQC>
          <IsLastQC>${this.convertToNumber(item?.IsLastQC)}</IsLastQC>
          <ItemRemark>${this.escapeXml(item?.ItemRemark || '')}</ItemRemark>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLItemU(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
               <DataBlock3>
          <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${item?.IdxNo || item?.IDX_NO}</IDX_NO>
          <DataSeq>${index + 1}</DataSeq>
          <Status>0</Status>
          <Selected>1</Selected>
          <ROW_IDX>${item?.IdxNo || item?.IDX_NO}</ROW_IDX>
          <ItemSeq>${item?.ItemSeq || 0}</ItemSeq>
          <ItemName>${this.escapeXml(item?.ItemName || '')}</ItemName>
          <ItemNo>${item?.ItemNo || ''}</ItemNo>
          <Spec>${this.escapeXml(item?.Spec || '')}</Spec>
          <ItemClassLName>${this.escapeXml(item?.ItemClassLName || '')}</ItemClassLName>
          <ItemClassMName>${this.escapeXml(item?.ItemClassMName || '')}</ItemClassMName>
          <ItemClassSName>${this.escapeXml(item?.ItemClassSName || '')}</ItemClassSName>
          <SMStatusName>${item?.SMStatusName || ''}</SMStatusName>
          <SMInOutKindName>${this.escapeXml(item?.SMInOutKindName || '')}</SMInOutKindName>
          <ItemSName>${item?.ItemSName}</ItemSName>
          <ItemEngName>${this.escapeXml(item?.ItemEngName || '')}</ItemEngName>
          <ItemEngSName>${this.escapeXml(item?.ItemEngSName || '')}</ItemEngSName>
          <IsSet>${this.convertToNumber(item?.IsSet)}</IsSet>
          <IsOption>${this.convertToNumber(item?.IsOption)}</IsOption>
          <IsLotMng>${this.convertToNumber(item?.IsLotMng)}</IsLotMng>
          <IsSerialMng>${this.convertToNumber(item?.IsSerialMng)}</IsSerialMng>
          <IsRollUnit>${this.convertToNumber(item?.IsRollUnit)}</IsRollUnit>
          <IsVat>${this.convertToNumber(item?.IsVat)}</IsVat>
          <VatKindName>${this.escapeXml(item?.VatKindName || 0)}</VatKindName>
          <VatTypeName>${this.escapeXml(item?.VatTypeName || 0)}</VatTypeName>
          <Guaranty>${item?.Guaranty || 0}</Guaranty>
          <SeriNoCd>${this.escapeXml(item?.SeriNoCd || 0)}</SeriNoCd>
          <IsQtyChange>${this.convertToNumber(item?.IsQtyChange)}</IsQtyChange>
          <SafetyStk>${this.escapeXml(item?.SafetyStk || 0)}</SafetyStk>
          <LimitTerm>${item?.LimitTerm || 0}</LimitTerm>
          <STDLoadConvQty>${item?.STDLoadConvQty || 0}</STDLoadConvQty>
          <OutLoss>${item?.OutLoss || 0}</OutLoss>
          <InLoss>${item?.InLoss || 0}</InLoss>
          <MrpKind>${this.escapeXml(item?.MrpKind || 0)}</MrpKind>
          <OutKind>${this.escapeXml(item?.OutKind || 0)}</OutKind>
          <ProdMethod>${this.escapeXml(item?.ProdMethod || 0)}</ProdMethod>
          <ProdSpec>${this.escapeXml(item?.ProdSpec || 0)}</ProdSpec>
          <LotSize>0</LotSize>
          <MinQty>${item?.MinQty || 0}</MinQty>
          <StepQty>${this.escapeXml(item?.StepQty || 0)}</StepQty>
          <IsPurVat>${this.convertToNumber(item?.IsPurVat)}</IsPurVat>
          <IsAutoPurCreate>${this.escapeXml(item?.IsAutoPurCreate || 0)}</IsAutoPurCreate>
          <OrderQty>${item?.OrderQty || 0}</OrderQty>
          <DelvDay>${item?.DelvDay || 0}</DelvDay>
          <CustomTaxRate>${this.escapeXml(item?.CustomTaxRate || 0)}</CustomTaxRate>
          <PurGroup>${this.escapeXml(item?.PurGroup || '')}</PurGroup>
          <MkCustName>${this.escapeXml(item?.MkCustName || '')}</MkCustName>
          <PurCustName>${this.escapeXml(item?.PurCustName || '')}</PurCustName>
          <PurKind>${item?.PurKind || 0}</PurKind>
          <PurProdType>${this.escapeXml(item?.PurProdType || '')}</PurProdType>
          <UMajorItemClass>0</UMajorItemClass>
          <LaunchDate></LaunchDate>
           <UnitName>${this.escapeXml(item?.UnitName || '')}</UnitName>
            <DeptName>${this.escapeXml(item?.DeptName || '')}</DeptName>
          <DeptSeq>${item?.DeptSeq || 0}</DeptSeq>
           <EmpName>${this.escapeXml(item?.EmpName || '')}</EmpName>
          <EmpSeq>${(item?.EmpSeq)}</EmpSeq>
          <ItemClassLSeq>0</ItemClassLSeq>
          <SMInOutKind>${this.escapeXml(item?.SMInOutKind || '')}</SMInOutKind>
          <SMStatus>${item?.SMStatus}</SMStatus>
          <UMItemClassS>${this.escapeXml(item?.UMItemClassS || '')}</UMItemClassS>
          <ItemClassMSeq>0</ItemClassMSeq>
          <TrunName>${this.escapeXml(item?.TrunName || '')}</TrunName>
           <AssetName>${this.escapeXml(item?.AssetName || '')}</AssetName>
          <AssetSeq>${item?.AssetSeq || 0}</AssetSeq>
          <StkUnitSeq>${item?.UnitSeq || 0}</StkUnitSeq>
           <UnitSeq>${(item?.UnitSeq || 0)}</UnitSeq>
          <SMVatKind>${this.escapeXml(item?.SMVatKind || 0)}</SMVatKind>
          <SMVatType>${this.escapeXml(item?.SMVatType || 0)}</SMVatType>
          <SMLimitTermKind>${this.escapeXml(item?.SMLimitTermKind || 0)}</SMLimitTermKind>
          <SMConsgnmtKind>${this.escapeXml(item?.SMConsgnmtKind || 0)}</SMConsgnmtKind>
          <BOMUnitSeq>${this.escapeXml(item?.BOMUnitSeq || 0)}</BOMUnitSeq>
          <SMMrpKind>${this.escapeXml(item?.SMMrpKind || 0)}</SMMrpKind>
          <SMProdMethod>${this.escapeXml(item?.SMProdMethod || 0)}</SMProdMethod>
          <SMPurProdType>${this.escapeXml(item?.SMPurProdType || '')}</SMPurProdType>
          <SMProdSpec>${this.escapeXml(item?.SMProdSpec || 0)}</SMProdSpec>
          <PurCustSeq>${this.escapeXml(item?.PurCustSeq || 0)}</PurCustSeq>
          <MkCustSeq>${this.escapeXml(item?.MkCustSeq || 0)}</MkCustSeq>
          <UMPurGroup>${this.escapeXml(item?.UMPurGroup || 0)}</UMPurGroup>
          <SMABC>${this.escapeXml(item?.SMABC || 0)}</SMABC>
          <SMOutKind>${this.escapeXml(item?.SMOutKind || 0)}</SMOutKind>
          <SMPurKind>${this.escapeXml(item?.SMPurKind || 0)}</SMPurKind>
          <IsInQC>${this.convertToNumber(item?.IsInQC)}</IsInQC>
          <IsOutQC>${this.convertToNumber(item?.IsOutQC)}</IsOutQC>
          <IsLastQC>${this.convertToNumber(item?.IsLastQC)}</IsLastQC>
          <Remark>${this.escapeXml(item?.ItemRemark || '')}</Remark>

          <InWHSeq>0</InWHSeq>
          <InWHName></InWHName>
          <OutWHSeq>0</OutWHSeq>
          <OutWHName></OutWHName>
          <AddInfoName></AddInfoName>
          <AddInfoValue></AddInfoValue>
          <TITLE_IDX0_SEQ />
          <TABLE_NAME>DataBlock3</TABLE_NAME>
        </DataBlock3>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  async generateXMLItemUpdate(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): Promise<string> {
    const xmlBlocks = result.map((item, index) => {
      return `
        <DataBlock3>
          <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${item?.IdxNo || item?.IDX_NO}</IDX_NO>
          <DataSeq>${index + 1}</DataSeq>
          <Status>0</Status>
          <Selected>1</Selected>
          <ROW_IDX>${item?.IdxNo || item?.IDX_NO}</ROW_IDX>
          <ItemSeq>${item?.ItemSeq || 0}</ItemSeq>
          <ItemName>${this.escapeXml(item?.ItemName || '')}</ItemName>
          <ItemNo>${item?.ItemNo || ''}</ItemNo>
          <Spec>${this.escapeXml(item?.Spec || '')}</Spec>
          <ItemClassLName>${this.escapeXml(item?.ItemClassLName || '')}</ItemClassLName>
          <ItemClassMName>${this.escapeXml(item?.ItemClassMName || '')}</ItemClassMName>
          <ItemClassSName>${this.escapeXml(item?.ItemClassSName || '')}</ItemClassSName>
          <SMStatusName>${item?.SMStatusName || ''}</SMStatusName>
          <SMInOutKindName>${this.escapeXml(item?.SMInOutKindName || '')}</SMInOutKindName>
          <ItemSName>${item?.ItemSName}</ItemSName>
          <ItemEngName>${this.escapeXml(item?.ItemEngName || '')}</ItemEngName>
          <ItemEngSName>${this.escapeXml(item?.ItemEngSName || '')}</ItemEngSName>
          <IsSet>${this.convertToNumber(item?.IsSet)}</IsSet>
          <IsOption>${this.convertToNumber(item?.IsOption)}</IsOption>
          <IsLotMng>${this.convertToNumber(item?.IsLotMng)}</IsLotMng>
          <IsSerialMng>${this.convertToNumber(item?.IsSerialMng)}</IsSerialMng>
          <IsRollUnit>${this.convertToNumber(item?.IsRollUnit)}</IsRollUnit>
          <IsVat>${this.convertToNumber(item?.IsVat)}</IsVat>
          <VatKindName>${this.escapeXml(item?.VatKindName || 0)}</VatKindName>
          <VatTypeName>${this.escapeXml(item?.VatTypeName || 0)}</VatTypeName>
          <Guaranty>${item?.Guaranty || 0}</Guaranty>
          <SeriNoCd>${this.escapeXml(item?.SeriNoCd || 0)}</SeriNoCd>
          <IsQtyChange>${this.convertToNumber(item?.IsQtyChange)}</IsQtyChange>
          <SafetyStk>${this.escapeXml(item?.SafetyStk || 0)}</SafetyStk>
          <LimitTerm>${item?.LimitTerm || 0}</LimitTerm>
          <STDLoadConvQty>${item?.STDLoadConvQty || 0}</STDLoadConvQty>
          <OutLoss>${item?.OutLoss || 0}</OutLoss>
          <InLoss>${item?.InLoss || 0}</InLoss>
          <MrpKind>${this.escapeXml(item?.MrpKind || 0)}</MrpKind>
          <OutKind>${this.escapeXml(item?.OutKind || 0)}</OutKind>
          <ProdMethod>${this.escapeXml(item?.ProdMethod || 0)}</ProdMethod>
          <ProdSpec>${this.escapeXml(item?.ProdSpec || 0)}</ProdSpec>
          <LotSize>0</LotSize>
          <MinQty>${item?.MinQty || 0}</MinQty>
          <StepQty>${this.escapeXml(item?.StepQty || 0)}</StepQty>
          <IsPurVat>${this.convertToNumber(item?.IsPurVat)}</IsPurVat>
          <IsAutoPurCreate>${this.escapeXml(item?.IsAutoPurCreate || 0)}</IsAutoPurCreate>
          <OrderQty>${item?.OrderQty || 0}</OrderQty>
          <DelvDay>${item?.DelvDay || 0}</DelvDay>
          <CustomTaxRate>${this.escapeXml(item?.CustomTaxRate || 0)}</CustomTaxRate>
          <PurGroup>${this.escapeXml(item?.PurGroup || '')}</PurGroup>
          <MkCustName>${this.escapeXml(item?.MkCustName || '')}</MkCustName>
          <PurCustName>${this.escapeXml(item?.PurCustName || '')}</PurCustName>
          <PurKind>${item?.PurKind || 0}</PurKind>
          <PurProdType>${this.escapeXml(item?.PurProdType || '')}</PurProdType>
          <UMajorItemClass>0</UMajorItemClass>
          <LaunchDate></LaunchDate>
           <UnitName>${this.escapeXml(item?.UnitName || '')}</UnitName>
            <DeptName>${this.escapeXml(item?.DeptName || '')}</DeptName>
          <DeptSeq>${item?.DeptSeq || 0}</DeptSeq>
           <EmpName>${this.escapeXml(item?.EmpName || '')}</EmpName>
          <EmpSeq>${(item?.EmpSeq)}</EmpSeq>
          <ItemClassLSeq>0</ItemClassLSeq>
          <SMInOutKind>${this.escapeXml(item?.SMInOutKind || '')}</SMInOutKind>
          <SMStatus>${item?.SMStatus}</SMStatus>
          <UMItemClassS>${this.escapeXml(item?.UMItemClassS || '')}</UMItemClassS>
          <ItemClassMSeq>0</ItemClassMSeq>
          <TrunName>${this.escapeXml(item?.TrunName || '')}</TrunName>
           <AssetName>${this.escapeXml(item?.AssetName || '')}</AssetName>
          <AssetSeq>${item?.AssetSeq || 0}</AssetSeq>
          <StkUnitSeq>${item?.UnitSeq || 0}</StkUnitSeq>
           <UnitSeq>${(item?.UnitSeq || 0)}</UnitSeq>
          <SMVatKind>${this.escapeXml(item?.SMVatKind || 0)}</SMVatKind>
          <SMVatType>${this.escapeXml(item?.SMVatType || 0)}</SMVatType>
          <SMLimitTermKind>${this.escapeXml(item?.SMLimitTermKind || 0)}</SMLimitTermKind>
          <SMConsgnmtKind>${this.escapeXml(item?.SMConsgnmtKind || 0)}</SMConsgnmtKind>
          <BOMUnitSeq>${this.escapeXml(item?.BOMUnitSeq || 0)}</BOMUnitSeq>
          <SMMrpKind>${this.escapeXml(item?.SMMrpKind || 0)}</SMMrpKind>
          <SMProdMethod>${this.escapeXml(item?.SMProdMethod || 0)}</SMProdMethod>
          <SMPurProdType>${this.escapeXml(item?.SMPurProdType || '')}</SMPurProdType>
          <SMProdSpec>${this.escapeXml(item?.SMProdSpec || 0)}</SMProdSpec>
          <PurCustSeq>${this.escapeXml(item?.PurCustSeq || 0)}</PurCustSeq>
          <MkCustSeq>${this.escapeXml(item?.MkCustSeq || 0)}</MkCustSeq>
          <UMPurGroup>${this.escapeXml(item?.UMPurGroup || 0)}</UMPurGroup>
          <SMABC>${this.escapeXml(item?.SMABC || 0)}</SMABC>
          <SMOutKind>${this.escapeXml(item?.SMOutKind || 0)}</SMOutKind>
          <SMPurKind>${this.escapeXml(item?.SMPurKind || 0)}</SMPurKind>
          <IsInQC>${this.convertToNumber(item?.IsInQC)}</IsInQC>
          <IsOutQC>${this.convertToNumber(item?.IsOutQC)}</IsOutQC>
          <IsLastQC>${this.convertToNumber(item?.IsLastQC)}</IsLastQC>
          <Remark>${this.escapeXml(item?.ItemRemark || '')}</Remark>

          <InWHSeq>0</InWHSeq>
          <InWHName></InWHName>
          <OutWHSeq>0</OutWHSeq>
          <OutWHName></OutWHName>
          <AddInfoName></AddInfoName>
          <AddInfoValue></AddInfoValue>
          <TITLE_IDX0_SEQ />
          <TABLE_NAME>DataBlock3</TABLE_NAME>
        </DataBlock3>
      `;
    }).join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


}
