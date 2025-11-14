import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlLotMasterService {
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
  //Lot Master Register
  async generateXMLSLGLotNoMasterQueryWEB(result: Array<{ [key: string]: any }>): Promise<string> {
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
    <CreateDateFr />
    <CreateDateTo />
    <LotNo>${this.escapeXml(item.LotNo || '')}</LotNo>
    <ItemSeq>${this.escapeXml(item.ItemSeq || '0')}</ItemSeq>
    <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
    <ValiDateFr />
    <ValiDateTo />
    <OriLotNo />
    <OriItemSeq>${this.escapeXml(item.OriItemSeq || '0')}</OriItemSeq>
    <OriItemName />
    <RegDateFr>${this.escapeXml(item.RegDateFr || '')}</RegDateFr>
    <RegDateTo>${this.escapeXml(item.RegDateTo || '')}</RegDateTo>
    <SourceLotNo />
    <RegUserSeq>${this.escapeXml(item.RegUserSeq || '0')}</RegUserSeq>
    <RegUserName />
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGLotNoMasterCheckWEB(result: Array<{ [key: string]: any }>): Promise<string> {
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
    <Qty>${this.escapeXml(item.Qty || '')}</Qty>
    <CreateDate>${this.escapeXml(item.CreateDate || '')}</CreateDate>
    <CreateTime>${this.escapeXml(item.CreateTime || '')}</CreateTime>
    <ValiDate>${this.escapeXml(item.ValiDate || '')}</ValiDate>
    <ValidTime>${this.escapeXml(item.ValidTime || '')}</ValidTime>
    <RegDate>${this.escapeXml(item.RegDate || '')}</RegDate>
    <RegUserName>${this.escapeXml(item.RegUserName || '')}</RegUserName>
    <RegUserSeq>${this.escapeXml(item.RegUserSeq || '')}</RegUserSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <SourceLotNo>${this.escapeXml(item.LotNo || '')}</SourceLotNo>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <OriLotNo>${this.escapeXml(item.OriLotNo || '')}</OriLotNo>
    <OriItemName />
    <OriItemNo />
    <OriSpec />
    <OriItemSeq>${this.escapeXml(item.OriItemSeq || '0')}</OriItemSeq>
    <LotNoOLD>${this.escapeXml(item.LotNoOLD || '')}</LotNoOLD>
    <ItemSeqOLD>${this.escapeXml(item.ItemSeqOLD || '')}</ItemSeqOLD>
    <InNo>${this.escapeXml(item.InNo || '')}</InNo>
    <SupplyCustSeq>${this.escapeXml(item.CustSeq || '')}</SupplyCustSeq>
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
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLSLGLotNoMasterSaveWEB(result: Array<{ [key: string]: any }>): Promise<string> {
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
    <Qty>${this.escapeXml(item.Qty || '')}</Qty>
    <CreateDate>${this.escapeXml(item.CreateDate || '')}</CreateDate>
    <CreateTime>${this.escapeXml(item.CreateTime || '')}</CreateTime>
    <ValiDate>${this.escapeXml(item.ValiDate || '')}</ValiDate>
    <ValidTime>${this.escapeXml(item.ValidTime || '')}</ValidTime>
    <RegDate>${this.escapeXml(item.RegDate || '')}</RegDate>
    <RegUserName>${this.escapeXml(item.RegUserName || '')}</RegUserName>
    <RegUserSeq>${this.escapeXml(item.RegUserSeq || '')}</RegUserSeq>
    <CustName>${this.escapeXml(item.CustName || '')}</CustName>
    <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
    <SourceLotNo>${this.escapeXml(item.LotNo || '')}</SourceLotNo>
    <Remark>${this.escapeXml(item.Remark || '')}</Remark>
    <OriLotNo>${this.escapeXml(item.OriLotNo || '')}</OriLotNo>
    <OriItemName />
    <OriItemNo />
    <OriSpec />
    <OriItemSeq>${this.escapeXml(item.OriItemSeq || '0')}</OriItemSeq>
    <LotNoOLD>${this.escapeXml(item.LotNoOLD || '')}</LotNoOLD>
    <ItemSeqOLD>${this.escapeXml(item.ItemSeqOLD || '')}</ItemSeqOLD>
    <InNo>${this.escapeXml(item.InNo || '')}</InNo>
    <SupplyCustSeq>${this.escapeXml(item.CustSeq || '')}</SupplyCustSeq>
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
  </DataBlock1>`
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



}