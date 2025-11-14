import { Injectable } from '@nestjs/common';
import { Index } from 'typeorm';


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

   searchBy(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag || 'A')}</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Status>0</Status>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
            <ItemLClass>${this.escapeXml(item.ItemLClass || '')}</ItemLClass>
            <ItemMClass>${this.escapeXml(item.ItemMClass || '')}</ItemMClass>
            <ItemSClass>${this.escapeXml(item.ItemSClass || '')}</ItemSClass>
            <DateFr>${this.escapeXml(item.DateFr || '')}</DateFr>
            <DateTo>${this.escapeXml(item.DateTo || '')}</DateTo>
            <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <TestItemType>${this.escapeXml(item.TestItemType || '')}</TestItemType>
            <ItemCheck>${this.convertToNumber(item.ItemCheck || 0)}</ItemCheck>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  createQAItemQcType(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
            <IsInQC>${this.convertToNumber(item.IsInQC) || 0}</IsInQC>
            <IsOutQC>${this.convertToNumber(item.IsOutQC || 0)}</IsOutQC>
            <IsLastQC>${this.convertToNumber(item.IsLastQC || 0)}</IsLastQC>
            <IsInAfterQC>${this.convertToNumber(item.IsInAfterQC || 0)}</IsInAfterQC>
            <IsNotAutoIn>${this.convertToNumber(item.IsNotAutoIn || 0)}</IsNotAutoIn>
            <IsSutakQc>${this.convertToNumber(item.IsSutakQc || 0)}</IsSutakQc>
            <TestItemType>${this.escapeXml(item.TestItemType || '')}</TestItemType>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

 async checkCudQaQcTitle(result: Array<{ [key: string]: any }>): Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock1>
              <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
              <IDX_NO>${this.escapeXml(item.IDX_NO || 1)}</IDX_NO>
              <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <UMQcTitleName>${this.escapeXml(item.UMQCTitleName || '')}</UMQcTitleName>
              <IsProcQc>${this.convertToNumber(item.IsProcQc || 0)}</IsProcQc>
              <IsPurQc>${this.convertToNumber(item.IsPurQc || 0)}</IsPurQc>
              <IsFinalQc>${this.convertToNumber(item.IsFinalQc || 0)}</IsFinalQc>
              <IsOutQc>${this.convertToNumber(item.IsOutQc || 0)}</IsOutQc>
              <InspecCond>${this.escapeXml(item.InspecCond || '')}</InspecCond>
              <InputType>${this.escapeXml(item.InPutType || '')}</InputType>
              <QcUnitSeq>${this.escapeXml(item.QCUnitSeq || '')}</QcUnitSeq>
              <Remark>${this.escapeXml(item.Remark || '')}</Remark>
              <IsBadAdd>${this.convertToNumber(item.IsBadAdd || 0)}</IsBadAdd>
              <UMQcTitleSeq>${this.escapeXml(item.UMQCTitleSeq || 0)}</UMQcTitleSeq>
              <UMQcTitleSeqOld>${this.escapeXml(item.UMQCTitleSeqOld || 0)}</UMQcTitleSeqOld>
              <SMAQLLevel>${this.escapeXml(item.SMAQLLevel || 0)}</SMAQLLevel>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
            </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  
 async CUDQaQcTitle(result: any []) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Selected>${this.escapeXml(item.Selected || 1)}</Selected>
            <Status>0</Status>
            <UMQcTitleSeq>${this.escapeXml(item.UMQcTitleSeq || 0)}</UMQcTitleSeq>
            <UMQcTitleName>${this.escapeXml(item.UMQcTitleName || '')}</UMQcTitleName>
            <UMQcTitleSeqOld>${this.escapeXml(item.UMQcTitleSeqOld || 0)}</UMQcTitleSeqOld>
            <IsProcQc>${this.convertToNumber(item.IsProcQc || 0)}</IsProcQc>
            <IsPurQc>${this.convertToNumber(item.IsPurQc || 0)}</IsPurQc>
            <IsFinalQc>${this.convertToNumber(item.IsFinalQc || 0)}</IsFinalQc>
            <IsOutQc>${this.convertToNumber(item.IsOutQc || 0)}</IsOutQc>
            <InspecCond>${this.escapeXml(item.InspecCond || '')}</InspecCond>
            <InputType>${this.escapeXml(item.InputType || 0)}</InputType>
            <QcUnitSeq>${this.escapeXml(item.QcUnitSeq || 0)}</QcUnitSeq>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <IsBadAdd>${this.convertToNumber(item.IsBadAdd || 0)}</IsBadAdd>
            <SMAQLLevel>${this.escapeXml(item.SMAQLLevel || 0)}</SMAQLLevel>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  

  async checkCudQaItemBad(result: Array<{ [key: string]: any }>, dataQaItemBad: any) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock2>
              <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
              <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
              <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <BadTypeName>${this.escapeXml(item.BadTypeName || '')}</BadTypeName>
              <BadKind>${this.escapeXml(item.BadKind || 0)}</BadKind>
              <BadReason>${this.escapeXml(item.BadReason || 0)}</BadReason>
              <Remark>${this.escapeXml(item.Remark || '')}</Remark>
              <BadSeq>${this.escapeXml(item.BadSeq || 0)}</BadSeq>
              <TABLE_NAME>DataBlock2</TABLE_NAME>
              <UMQcTitleSeq>${this.escapeXml(dataQaItemBad || 0)}</UMQcTitleSeq>
            </DataBlock2>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async CudQaItemBad(result: Array<{ [key: string]: any }>) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock2>
              <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
              <IDX_NO>${this.escapeXml(item.IDX_NO || 1)}</IDX_NO>
              <DataSeq>${this.escapeXml(item.IDX_NO || 1)}</DataSeq>
              <Selected>${this.escapeXml(item.Selected || 1)}</Selected>
              <Status>0</Status>
              <UMQcTitleSeq>${this.escapeXml(item.UMQcTitleSeq || 0)}</UMQcTitleSeq>
              <BadSeq>${this.escapeXml(item.BadSeq || 0)}</BadSeq>
              <BadTypeName>${this.escapeXml(item.BadTypeName || '')}</BadTypeName>
              <BadKind>${this.escapeXml(item.BadKind || 0)}</BadKind>
              <BadReason>${this.escapeXml(item.BadReason || '')}</BadReason>
              <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            </DataBlock2>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getItemQa(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Status>0</Status>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
            <AssetName>${this.escapeXml(item.AssetName || '')}</AssetName>
            <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
            <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getQaItemQc(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <IsAllQcKind>${this.escapeXml(item.IsAllQcKind || 0)}</IsAllQcKind>
            <ItemSeq>${this.escapeXml(item.ItemSeq || 0)}</ItemSeq>
            <SMQcKind>${this.escapeXml(item.SMQcKind || 0)}</SMQcKind>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getQaItemQcTitle(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <IsAllQcKind>${this.escapeXml(item.IsAllQcKind || 0)}</IsAllQcKind>
            <ItemSeq>${this.escapeXml(item.ItemSeq || 0)}</ItemSeq>
            <SMQcKind>${this.escapeXml(item.SMQcKind || 0)}</SMQcKind>
          </DataBlock2>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  saveQaItemQc(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Status>0</Status>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <IsAllQcKind>${this.escapeXml(item.IsAllQcKind || 0)}</IsAllQcKind>
            <ItemSeq>${this.escapeXml(item.ItemSeq || 0)}</ItemSeq>
            <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo || 0)}</ItemNo>
            <SMQcKind>${this.escapeXml(item.SMQcKind || 0)}</SMQcKind>
            <SMQcKindName>${this.escapeXml(item.SMQcKindName || '')}</SMQcKindName>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <SMTestMethod>${this.escapeXml(item.SMTestMethod || 0)}</SMTestMethod>
            <SMTestMethodName>${this.escapeXml(item.SMTestMethodName || '')}</SMTestMethodName>
            <SMAQLLevel>${this.escapeXml(item.SMAQLLevel || 0)}</SMAQLLevel>
            <SMAQLLevelName>${this.escapeXml(item.SMAQLLevelName || '')}</SMAQLLevelName>
            <SMSamplingStd>${this.escapeXml(item.SMSamplingStd || 0)}</SMSamplingStd>
            <SMSamplingStdName>${this.escapeXml(item.SMSamplingStdName || '')}</SMSamplingStdName>
            <SMAQLStrict>${this.escapeXml(item.SMAQLStrict || 0)}</SMAQLStrict>
            <SMAQLStrictName>${this.escapeXml(item.SMAQLStrictName || '')}</SMAQLStrictName>
            <SMQcTitleLevel>${this.escapeXml(item.SMQcTitleLevel || 0)}</SMQcTitleLevel>
            <SMQcTitleLevelName>${this.escapeXml(item.SMQcTitleLevelName || '')}</SMQcTitleLevelName>
            <SMAQLPoint>${this.escapeXml(item.SMAQLPoint || 0)}</SMAQLPoint>
            <SMAQLPointName>${this.escapeXml(item.SMAQLPointName || '')}</SMAQLPointName>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  checkQaItemQcTitle(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${this.escapeXml(item.Status || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <UMQCTitleName>${this.escapeXml(item.UMQcTitleName || '')}</UMQCTitleName>
            <IsStrictLevel>${this.convertToNumber(item.IsStrictLevel || 0)}</IsStrictLevel>
            <IsMidLevel>${this.convertToNumber(item.IsMidLevel || 0)}</IsMidLevel>
            <IsSimpleLevel>${this.convertToNumber(item.IsSimpleLevel || 0)}</IsSimpleLevel>
            <TestingCondition>${this.escapeXml(item.TestingCondition || '')}</TestingCondition>
            <SMInputTypeName>${this.escapeXml(item.SMInputTypeName || '')}</SMInputTypeName>
            <UMQCUnitName>${this.escapeXml(item.UMQCUnitName || '')}</UMQCUnitName>
            <TagetLevel>${this.escapeXml(item.TagetLevel || '')}</TagetLevel>
            <UpperLimit>${this.escapeXml(item.UpperLimit || '')}</UpperLimit>
            <LowerLimit>${this.escapeXml(item.LowerLimit || '')}</LowerLimit>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <UMQCTitleSeq>${this.escapeXml(item.UMQcTitleSeq || '')}</UMQCTitleSeq>
            <UMQCTitleSeqOld>${this.escapeXml(item.UMQcTitleSeqOld || '')}</UMQCTitleSeqOld>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
            <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
            <SMQcKind>${this.escapeXml(item.SMQcKind || '')}</SMQcKind>
            <IsAllQcKind>${this.escapeXml(item.IsAllQcKind || 0)}</IsAllQcKind>
          </DataBlock2>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  saveQaItemQcTitle(result: any []){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${this.escapeXml(item.WorkingTag || 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <UMQCTitleName>${this.escapeXml(item.UMQCTitleName || '')}</UMQCTitleName>
            <IsStrictLevel>${this.convertToNumber(item.IsStrictLevel || 0)}</IsStrictLevel>
            <IsMidLevel>${this.convertToNumber(item.IsMidLevel || 0)}</IsMidLevel>
            <IsSimpleLevel>${this.convertToNumber(item.IsSimpleLevel || 0)}</IsSimpleLevel>
            <TestingCond>${this.escapeXml(item.TestingCond || '')}</TestingCond>
            <SMInputTypeName>${this.escapeXml(item.SMInputTypeName || '')}</SMInputTypeName>
            <UMQCUnitName>${this.escapeXml(item.UMQCUnitName || '')}</UMQCUnitName>
            <TagetLevel>${this.escapeXml(item.TagetLevel || '')}</TagetLevel>
            <UpperLimit>${this.escapeXml(item.UpperLimit || '')}</UpperLimit>
            <LowerLimit>${this.escapeXml(item.LowerLimit || '')}</LowerLimit>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <UMQCTitleSeq>${this.escapeXml(item.UMQCTitleSeq || 0)}</UMQCTitleSeq>
            <UMQCTitleSeqOld>${this.escapeXml(item.UMQCTitleSeqOld || 0)}</UMQCTitleSeqOld>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
            <ItemSeq>${this.escapeXml(item.ItemSeq || 0)}</ItemSeq>
            <SMQcKind>${this.escapeXml(item.SMQcKind || 0)}</SMQcKind>
            <IsAllQcKind>${this.escapeXml(item.IsAllQcKind || 0)}</IsAllQcKind>
          </DataBlock2>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  deleteQaItemQc(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>D</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Status>0</Status>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <IsAllQcKind>0</IsAllQcKind>
            <ItemSeq>${this.escapeXml(item.ItemSeq || 0)}</ItemSeq>
            <ItemName>${this.escapeXml(item.ItemName || 0)}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo || 0)}</ItemNo>
            <SMQcKind>${this.escapeXml(item.SMQcKind || 0)}</SMQcKind>
            <SMQcKindName>${this.escapeXml(item.SMQcKindName || 0)}</SMQcKindName>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  getQaItemBad(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag />
            <IDX_NO>${this.escapeXml(item.IDX_NO || 0)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1|| 1)}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <UMQcTitleSeq>${this.escapeXml(item.UMQcTitleSeq || 0)}</UMQcTitleSeq>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
          </DataBlock2>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getQaItemClassSub(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
           <DataBlock2>
                <WorkingTag>A</WorkingTag>
                <IDX_NO>1</IDX_NO>
                <Status>0</Status>
                <DataSeq>1</DataSeq>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock2</TABLE_NAME>
                <IsChangedMst>0</IsChangedMst>
                <UMItemClass>${this.escapeXml(item.UMItemClass ?? '')}</UMItemClass>
            </DataBlock2>   
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getQaItemClassQc(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <AssetType>${this.escapeXml(item.AssetType ?? '')}</AssetType>
            <ClassType>${this.escapeXml(item.ClassType ?? '')}</ClassType>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async qaItemClassQcSave(result: Array<{ [key: string]: any }>) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock1>
              <WorkingTag>${this.escapeXml(item.WorkingTag ?? '')}</WorkingTag>
              <IDX_NO>${this.escapeXml(item.IDX_NO ?? '')}</IDX_NO>
              <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <UMItemClass>${this.escapeXml(item.UMItemClass ?? '')}</UMItemClass>
              <IsProcQc>${this.convertToNumber(item.IsProcQc ?? 0)}</IsProcQc>
              <IsFinalQc>${this.convertToNumber(item.IsFinalQc ?? 0)}</IsFinalQc>
              <IsOutQc>${this.convertToNumber(item.IsOutQc ?? 0)}</IsOutQc>
              <IsPurQc>${this.convertToNumber(item.IsPurQc ?? 0)}</IsPurQc>
              <TestMethod>${this.escapeXml(item.TestMethod ?? '')}</TestMethod>
              <SamplingStd>${this.escapeXml(item.SamplingStd ?? '')}</SamplingStd>
              <AQLLevel>${this.escapeXml(item.AQLLevel ?? '')}</AQLLevel>
              <AQLStrict>${this.escapeXml(item.AQLStrict ?? '')}</AQLStrict>
              <AQLPoint>${this.escapeXml(item.AQLPoint ?? '')}</AQLPoint>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
            </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkQaItemClassSub(result: Array<{ [key: string]: any }>, UMItemClass: any) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock2>
              <WorkingTag>${this.escapeXml(item.WorkingTag ?? '')}</WorkingTag>
              <IDX_NO>${this.escapeXml(item.IDX_NO ?? 1)}</IDX_NO>
              <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <UMItemClass>${this.escapeXml(item.UMItemClass ?? UMItemClass)}</UMItemClass>
              <Serl>${this.escapeXml(item.Serl ?? '')}</Serl>
              <UMQCTitleName>${this.escapeXml(item.UMQCTitleName ?? '')}</UMQCTitleName>
              <UMQCTitleSeq>${this.escapeXml(item.UMQCTitleSeq ?? '')}</UMQCTitleSeq>
              <TestingCondition>${this.escapeXml(item.TestingCondition ?? '')}</TestingCondition>
              <TargetLevel>${this.escapeXml(item.TargetLevel ?? '')}</TargetLevel>
              <SMInputTypeName>${this.escapeXml(item.SMInputTypeName ?? '')}</SMInputTypeName>
              <UMQCUnitName>${this.escapeXml(item.UMQCUnitName ?? '')}</UMQCUnitName>
              <UMQCUnitSeq>${this.escapeXml(item.UMQCUnitSeq ?? '')}</UMQCUnitSeq>
              <UpperLimit>${this.escapeXml(item.UpperLimit ?? '')}</UpperLimit>
              <LowerLimit>${this.escapeXml(item.LowerLimit ?? '')}</LowerLimit>
              <Remark>${this.escapeXml(item.Remark ?? '')}</Remark>
              <IsProcQc>${this.convertToNumber(item.IsProcQC ?? 0)}</IsProcQc>
              <IsFinalQc>${this.convertToNumber(item.IsFinalQC ?? 0)}</IsFinalQc>
              <IsOutQc>${this.convertToNumber(item.IsOutQC ?? 0)}</IsOutQc>
              <IsPurQc>${this.convertToNumber(item.IsPurQC ?? 0)}</IsPurQc>
              <TABLE_NAME>DataBlock2</TABLE_NAME>
            </DataBlock2>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async CUDQaItemClassSubSave(result: any []) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${this.escapeXml(item.WorkingTag ?? '')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO ?? '')}</IDX_NO>
            <DataSeq>${this.escapeXml(item.IDX_NO ?? '')}</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <UMItemClass>${this.escapeXml(item.UMItemClass ?? '')}</UMItemClass>
            <Serl>${this.escapeXml(item.Serl ?? '')}</Serl>
            <UMQCTitleSeq>${this.escapeXml(item.UMQCTitleSeq ?? '')}</UMQCTitleSeq>
            <TestingCondition>${this.escapeXml(item.TestingCondition ?? '')}</TestingCondition>
            <TargetLevel>${this.escapeXml(item.TargetLevel ?? '')}</TargetLevel>
            <SMInputTypeName>${this.escapeXml(item.SMInputTypeName ?? '')}</SMInputTypeName>
            <UpperLimit>${this.escapeXml(item.UpperLimit ?? '')}</UpperLimit>
            <UMQCUnitSeq>${this.escapeXml(item.UMQCUnitSeq ?? 0)}</UMQCUnitSeq>
            <LowerLimit>${this.escapeXml(item.LowerLimit ?? '')}</LowerLimit>
            <Remark>${this.escapeXml(item.Remark ?? '')}</Remark>
            <IsProcQc>${this.convertToNumber(item.IsProcQc ?? 0)}</IsProcQc>
            <IsFinalQc>${this.convertToNumber(item.IsFinalQc ?? 0)}</IsFinalQc>
            <IsOutQc>${this.convertToNumber(item.IsOutQc ?? 0)}</IsOutQc>
            <IsPurQc>${this.convertToNumber(item.IsPurQc ?? 0)}</IsPurQc>
            <UMQCTitleName>${this.escapeXml(item.UMQCTitleName ?? '')}</UMQCTitleName>
            <UMQCUnitName>${this.escapeXml(item.UMQCUnitName ?? '')}</UMQCUnitName>
          </DataBlock2>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async deleteQaItemClass(result: Array<{ [key: string]: any }>) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>D</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO ?? 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <UMItemClass>${this.escapeXml(item.UMItemClass ?? '')}</UMItemClass>
            <IsProcQc>${this.convertToNumber(item.IsProcQc ?? 0)}</IsProcQc>
            <IsFinalQc>${this.convertToNumber(item.IsFinalQc ?? 0)}</IsFinalQc>
            <IsOutQc>${this.convertToNumber(item.IsOutQc ?? 0)}</IsOutQc>
            <IsPurQc>${this.convertToNumber(item.IsPurQc ?? 0)}</IsPurQc>
            <TestMethod>${this.escapeXml(item.TestMethod ?? '')}</TestMethod>
            <SamplingStd>${this.escapeXml(item.SamplingStd ?? '')}</SamplingStd>
            <AQLLevel>${this.escapeXml(item.AQLLevel ?? 0)}</AQLLevel>
            <AQLStrict>${this.escapeXml(item.AQLStrict ?? 0)}</AQLStrict>
            <AQLPoint>${this.escapeXml(item.AQLPoint ?? 0)}</AQLPoint>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  searchQaCustQcTitle(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <CustName>${this.escapeXml(item.CustName ?? '')}</CustName>
          </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getQaItemByCust(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock2>
            <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'A')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO ?? 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <CustSeq>${this.escapeXml(item.CustSeq ?? 0)}</CustSeq>
            <SMQCType>${this.escapeXml(item.SMQCType ?? '')}</SMQCType>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
          </DataBlock2>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  getUMQCByItem(result: Array<{ [key: string]: any }>){
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock3>
            <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO ?? 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <ItemSeq>${this.escapeXml(item.ItemSeq ?? 0)}</ItemSeq>
            <SMQCType>${this.escapeXml(item.SMQCType ?? '')}</SMQCType>
            <CustSeq>${this.escapeXml(item.CustSeq ?? 0)}</CustSeq>
            <TABLE_NAME>DataBlock3</TABLE_NAME>
          </DataBlock3>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkQaCust(result: Array<{ [key: string]: any }>): Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock1>
              <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'A')}</WorkingTag>
              <IDX_NO>${this.escapeXml(item.IdxNo ?? item.IDX_NO)}</IDX_NO>
              <DataSeq>${this.escapeXml(item.IdxNo ?? item.IDX_NO)}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <CustName>${this.escapeXml(item.CustName ?? '')}</CustName>
              <CustSeq>${this.escapeXml(item.CustSeq ?? 0)}</CustSeq>
              <CustSeqOld>${this.escapeXml(item.CustSeqOld ?? 0)}</CustSeqOld>
              <SMQCType>${this.escapeXml(item.SMQCType ?? '6018002')}</SMQCType>
              <SMQCTypeOld>${this.escapeXml(item.SMQCTypeOld ?? '6018002')}</SMQCTypeOld>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
            </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkCudItem(result: Array<{ [key: string]: any }>, CustSeq : any, SMQCType : any) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
           <DataBlock2>
            <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'U')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IdxNo ?? item.IDX_NO)}</IDX_NO>
            <DataSeq>${this.escapeXml(item.IdxNo ?? item.IDX_NO)}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <ItemName>${this.escapeXml(item.ItemName ?? '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo ?? 0)}</ItemNo>
            <Spec>${this.escapeXml(item.Spec ?? '')}</Spec>
            <SMTestMethod>${this.escapeXml(item.SMTestMethod ?? 0)}</SMTestMethod>
            <ACPoint>${this.escapeXml(item.ACPoint ?? 0)}</ACPoint>
            <StartDate>${this.escapeXml(item.StartDate ?? '')}</StartDate>
            <EndDate>${this.escapeXml(item.EndDate ?? '')}</EndDate>
            <Remark>${this.escapeXml(item.Remark ?? '')}</Remark>
            <ItemSeq>${this.escapeXml(item.ItemSeq ?? 0)}</ItemSeq>
            <ItemSeqOld>${this.escapeXml(item.ItemSeqOld ?? 0)}</ItemSeqOld>
            <SMAQLLevel>${this.escapeXml(item.SMAQLLevel ?? 0)}</SMAQLLevel>
            <SMAQLPoint>${this.escapeXml(item.SMAQLPoint ?? 0)}</SMAQLPoint>
            <SMAQLStrict>${this.escapeXml(item.SMAQLStrict ?? 0)}</SMAQLStrict>
            <SMQCType>${this.escapeXml(item.SMQCType ?? SMQCType)}</SMQCType>
            <CustSeq>${this.escapeXml(item.CustSeq ?? CustSeq)}</CustSeq>
            <SMSamplingStd>${this.escapeXml(item.SMSamplingStd ?? '')}</SMSamplingStd>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
          </DataBlock2>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkUmQc(result: Array<{ [key: string]: any }>, CustSeq : any, SMQCType : any) : Promise<string>{
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
           <DataBlock3>
              <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'U')}</WorkingTag>
              <IDX_NO>${this.escapeXml(item.IdxNo ?? item.IDX_NO)}</IDX_NO>
              <DataSeq>${this.escapeXml(item.IdxNo ?? item.IDX_NO)}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <UMQCTitleName>${this.escapeXml(item.UMQCTitleName ?? '')}</UMQCTitleName>
              <TestingCondition>${this.escapeXml(item.TestingCondition ?? '')}</TestingCondition>
              <TargetLevel>${this.escapeXml(item.TargetLevel ?? '')}</TargetLevel>
              <UMQCUnitName>${this.escapeXml(item.UMQCUnitName ?? '')}</UMQCUnitName>
              <SMInputTypeName>${this.escapeXml(item.SMInputTypeName ?? '')}</SMInputTypeName>
              <UpperLimit>${this.escapeXml(item.UpperLimit ?? '')}</UpperLimit>
              <LowerLimit>${this.escapeXml(item.LowerLimit ?? '')}</LowerLimit>
              <Remark>${this.escapeXml(item.Remark ?? '')}</Remark>
              <ItemSeq>${this.escapeXml(item.ItemSeq ?? '')}</ItemSeq>
              <UMQCTitleSeq>${this.escapeXml(item.UMQCTitleSeq ?? '')}</UMQCTitleSeq>
              <UMQCTitleSeqOld>${this.escapeXml(item.UMQCTitleSeqOld ?? '0')}</UMQCTitleSeqOld>
              <CustSeq>${this.escapeXml(item.CustSeq ?? CustSeq)}</CustSeq>
              <SMQCType>${this.escapeXml(item.SMQCType ?? SMQCType)}</SMQCType>
              <UMQCUnitSeq>${this.escapeXml(item.UMQCUnitSeq ?? 0)}</UMQCUnitSeq>
              <TABLE_NAME>DataBlock3</TABLE_NAME>
            </DataBlock3>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
