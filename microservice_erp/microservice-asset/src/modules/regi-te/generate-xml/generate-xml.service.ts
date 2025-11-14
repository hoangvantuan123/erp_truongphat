import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateXmlService {
  private escapeXml(str: any): string {
    if (str == null) return ''; // null hoặc undefined trả về chuỗi rỗng
    if (typeof str !== 'string') str = String(str);
    return str.replace(/[&<>"']/g, (char: string): string => {
      switch (char) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return char;
      }
    });
  }

  private safeValue(value: any): string {
    return this.escapeXml(value ?? '');
  }

  private convertToNumber(value: boolean | string | null | undefined): number {
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'string') return value === '1' ? 1 : 0;
    return 0;
  }

  generateXMLSPDToolMoveQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <MoveDateFr>${this.safeValue(item.MoveDateFr)}</MoveDateFr>
          <MoveDateTo>${this.safeValue(item.MoveDateTo)}</MoveDateTo>
          <ToolName>${this.safeValue(item.ToolName)}</ToolName>
          <ToolNo>${this.safeValue(item.ToolNo)}</ToolNo>
          <Spec>${this.safeValue(item.Spec)}</Spec>
          <UMToolKind>${item.UMToolKind ?? 0}</UMToolKind>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDToolRepairTotalListQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
       <UMToolKind>${this.safeValue(item.UMToolKind)}</UMToolKind>
        <UMReasonSeq>${this.safeValue(item.UMReasonSeq)}</UMReasonSeq>
        <DeptSeq>${this.safeValue(item.DeptSeq)}</DeptSeq>
        <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
        <TermSerl>${this.safeValue(item.TermSerl)}</TermSerl>
        <UMContenteSeq>${this.safeValue(item.UMContenteSeq)}</UMContenteSeq>
        <IsLast>${this.safeValue(item.IsLast)}</IsLast>
        <DueCheckDateFr>${this.safeValue(item.DueCheckDateFr)}</DueCheckDateFr>
        <DueCheckDateTo>${this.safeValue(item.DueCheckDateTo)}</DueCheckDateTo>
        <CheckDateFr>${this.safeValue(item.CheckDateFr)}</CheckDateFr>
        <CheckDateTo>${this.safeValue(item.CheckDateTo)}</CheckDateTo>
        <RepDateFr>${this.safeValue(item.RepDateFr)}</RepDateFr>
        <RepDateTo>${this.safeValue(item.RepDateTo)}</RepDateTo>
        <ToolName>${this.safeValue(item.ToolName)}</ToolName>
        <ToolNo>${this.safeValue(item.ToolNo)}</ToolNo>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDToolRepairQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
            <RepairDateFr>${this.safeValue(item.RepairDateFr)}</RepairDateFr>
            <RepairDateTo>${this.safeValue(item.RepairDateTo)}</RepairDateTo>
            <ToolNo>${this.safeValue(item.ToolNo)}</ToolNo>
            <ToolName>${this.safeValue(item.ToolName)}</ToolName>
            <Spec>${this.safeValue(item.Spec)}</Spec>
            <UMToolKind>${this.safeValue(item.UMToolKind)}</UMToolKind>
            <RepairCustName>${this.safeValue(item.RepairCustName)}</RepairCustName>
            <EmpName>${this.safeValue(item.EmpName)}</EmpName>
            <TermSerl>${this.safeValue(item.TermSerl)}</TermSerl>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDToolRepairMatQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
            <RepairDate>${this.safeValue(item.RepairDate)}</RepairDate>
              <Serl>${this.safeValue(item.Serl)}</Serl>
              <ToolSeq>${this.safeValue(item.ToolSeq)}</ToolSeq>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSPDToolMoveAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
          <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
          <DataSeq>${this.safeValue(item.IdxNo || item.IDX_NO)}</DataSeq>
          <Selected>0</Selected>
          <Status>0</Status>
          <ToolName>${this.safeValue(item.ToolName)}</ToolName>
          <ToolNo>${this.safeValue(item.ToolNo)}</ToolNo>
          <Spec>${this.safeValue(item.Spec)}</Spec>
          <SerialNo>${this.safeValue(item.SerialNo)}</SerialNo>
          <UMToolKind>${item.UMToolKind ?? 0}</UMToolKind>
          <ToolSeq>${item.ToolSeq ?? 0}</ToolSeq>
          <Serl>${item.Serl ?? 0}</Serl>
          <MoveDate>${this.safeValue(item.MoveDate)}</MoveDate>
          <MovePlaceType>${item.MovePlaceType ?? 0}</MovePlaceType>
          <MovePlaceSeq>${item.MovePlaceSeq ?? 0}</MovePlaceSeq>
          <MovePlaceName>${this.safeValue(item.MovePlaceName)}</MovePlaceName>
          <EmpName>${this.safeValue(item.EmpName)}</EmpName>
          <EmpSeq>${item.EmpSeq ?? 0}</EmpSeq>
          <Remark>${this.safeValue(item.Remark)}</Remark>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDToolRepairMatAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock2>
          <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
          <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
          <DataSeq>${this.safeValue(item.IdxNo || item.IDX_NO)}</DataSeq>
          <Selected>0</Selected>
          <Status>0</Status>
           <ToolSeq>${this.safeValue(item.ToolSeq)}</ToolSeq>
            <Serl>${this.safeValue(item.Serl)}</Serl>
            <MSerl>${this.safeValue(item.MSerl)}</MSerl>
            <ItemName>${this.safeValue(item.ItemName)}</ItemName>
            <ItemNo>${this.safeValue(item.ItemNo)}</ItemNo>
            <Spec>${this.safeValue(item.Spec)}</Spec>
            <UnitName>${this.safeValue(item.UnitName)}</UnitName>
            <ItemSeq>${this.safeValue(item.ItemSeq)}</ItemSeq>
            <RepairDate>${this.safeValue(item.RepairDate)}</RepairDate>
            <Qty>${this.safeValue(item.Qty)}</Qty>
            <Remark>${this.safeValue(item.Remark)}</Remark>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
        </DataBlock2>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPDToolRepairAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
         <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
          <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
          <DataSeq>${this.safeValue(item.IdxNo || item.IDX_NO)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <ToolName>${this.safeValue(item.ToolName)}</ToolName>
            <ToolNo>${this.safeValue(item.ToolNo)}</ToolNo>
            <Spec>${this.safeValue(item.Spec)}</Spec>
            <RepairDate>${item.RepairDate}</RepairDate>
            <RepairCustName>${this.safeValue(item.RepairCustName)}</RepairCustName>
            <EmpName>${this.safeValue(item.EmpName)}</EmpName>
            <RepairTime>${item.RepairTime}</RepairTime>
            <UMReasonName>${this.safeValue(item.UMReasonName)}</UMReasonName>
            <Reason>${this.safeValue(item.Reason)}</Reason>
            <UMContenteName>${this.safeValue(item.UMContenteName)}</UMContenteName>
            <Contents>${this.safeValue(item.Contents)}</Contents>
            <RepairCost>${item.RepairCost}</RepairCost>
            <OutOrder>${item.OutOrder}</OutOrder>
            <OutDate>${item.OutDate}</OutDate>
            <OutTime>${item.OutTime}</OutTime>
            <RepFrDate>${item.RepFrDate}</RepFrDate>
            <RepFrTime>${item.RepFrTime}</RepFrTime>
            <RepToDate>${item.RepToDate}</RepToDate>
            <RepToTime>${item.RepToTime}</RepToTime>
            <RepairInput>${item.RepairInput}</RepairInput>
            <Remark>${this.safeValue(item.Remark)}</Remark>
           <UMToolKind>${item.UMToolKind ?? 6009001}</UMToolKind>

            <Serl>${item.Serl}</Serl>
            <EmpSeq>${item.EmpSeq}</EmpSeq>
            <ToolSeq>${item.ToolSeq}</ToolSeq>
            <RepairCustSeq>${item.RepairCustSeq}</RepairCustSeq>
            <TermSerl>${item.TermSerl}</TermSerl>
            <UMContenteSeq>${item.UMContenteSeq}</UMContenteSeq>
            <UMReasonSeq>${item.UMReasonSeq}</UMReasonSeq>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
