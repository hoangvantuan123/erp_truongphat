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
  private safeValue(value: any): string {
    return this.escapeXml(value ?? '');
  }
  generateXMLSPRWkItemQ(result: Array<{ [key: string]: any }>): string {
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
          <SMWkItemType>${this.safeValue(item.SMWkItemType)}</SMWkItemType>
          <SMDTCType>${this.safeValue(item.SMDTCType)}</SMDTCType>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPRWkEmpDdQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock3>
         <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock3</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <WkDate>${this.safeValue(item.WkDate)}</WkDate>
          <PtSeq> ${this.safeValue(item.PtSeq)}</PtSeq>
          <PuSeq> ${this.safeValue(item.PuSeq)}</PuSeq>
          <DeptSeq>${this.safeValue(item.DeptSeq)}</DeptSeq>
          <EmpSeq>${this.safeValue(item.EmpSeq)}</EmpSeq>
        </DataBlock3>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLCalendarHolidayQ(result: Array<{ [key: string]: any }>): string {
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
          <CountrySeq>${this.safeValue(item.CountrySeq)}</CountrySeq>
          <IsCommon>${this.safeValue(item.IsCommon)}</IsCommon>
          <Solar>${this.safeValue(item.Solar)}</Solar>
          <SMHolidayType>${this.safeValue(item.SMHolidayType)}</SMHolidayType>
          <HolidayName>${this.safeValue(item.HolidayName)}</HolidayName>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLWkOverTimeApproveQ(result: Array<{ [key: string]: any }>): string {
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
          <FromDate>${this.safeValue(item.FromDate)}</FromDate>
          <ToDate>${this.safeValue(item.ToDate)}</ToDate>
          <WkItemSeq>${this.safeValue(item.WkItemSeq)}</WkItemSeq>
          <DeptSeq>${this.safeValue(item.DeptSeq)}</DeptSeq>
          <EmpSeq>${this.safeValue(item.EmpSeq)}</EmpSeq>
          <UMEmpType>${this.safeValue(item.UMEmpType)}</UMEmpType>
          <IsCheck>${this.safeValue(item.IsCheck ?? 0)}</IsCheck>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPRWkAbsEmpQ(result: Array<{ [key: string]: any }>): string {
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
          <AbsDate>${this.safeValue(item.AbsDate)}</AbsDate>
          <DeptSeq>${this.safeValue(item.DeptSeq)}</DeptSeq>
          <WkItemSeq>${this.safeValue(item.WkItemSeq)}</WkItemSeq>
          <EmpSeq>${this.safeValue(item.EmpSeq)}</EmpSeq>
          <EmpName>${this.safeValue(item.EmpName)}</EmpName>
          <EmpID>${this.safeValue(item.EmpID)}</EmpID>
          <PuSeq>${this.safeValue(item.PuSeq)}</PuSeq>
          <PtSeq>${this.safeValue(item.PtSeq)}</PtSeq>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPRWkMmEmpDaysQ(result: Array<{ [key: string]: any }>): string {
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
          <YM>${this.safeValue(item.YM)}</YM>
          <DeptSeq>${this.safeValue(item.DeptSeq)}</DeptSeq>
          <EmpSeq>${this.safeValue(item.EmpSeq)}</EmpSeq>
          <PuSeq>${this.safeValue(item.PuSeq)}</PuSeq>
          <PtSeq>${this.safeValue(item.PtSeq)}</PtSeq>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLWkOverTimeApproveConfirm(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>U</WorkingTag>
        <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
           <CfmCode>${this.safeValue(item.CfmCode)}</CfmCode>
          <CfmSeq>${this.safeValue(item.CfmSeq)}</CfmSeq>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <TableName>_TPRWkEmpRealDd_VTN</TableName>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSPRWkItemAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
          <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
          <DataSeq>${this.safeValue(item.IdxNo || item.IDX_NO)}</DataSeq>
          <Selected>0</Selected>
          <Status>0</Status>
            <WkItemSeq>${item.WkItemSeq ?? 0}</WkItemSeq>
            <WkItemName>${this.safeValue(item.WkItemName ?? '1')}</WkItemName>
            <WkItemSName>${this.safeValue(item.WkItemSName ?? '')}</WkItemSName>
            <WkItemType>${this.safeValue(item.WkItemType ?? '')}</WkItemType>
            <SMWkItemType>${item.SMWkItemType ?? 3007001}</SMWkItemType>
            <DTCType>${this.safeValue(item.DTCType ?? '')}</DTCType>
            <SMDTCType>${item.SMDTCType ?? 3068001}</SMDTCType>
            <DecPntCnt>${item.DecPntCnt ?? 0}</DecPntCnt>
            <IsAbsReason>${item.IsAbsReason ?? 0}</IsAbsReason>
            <IsLongAbs>${item.IsLongAbs ?? 0}</IsLongAbs>
            <AbsWkSort>${this.safeValue(item.AbsWkSort ?? '')}</AbsWkSort>
            <SMAbsWkSort>${item.SMAbsWkSort ?? 0}</SMAbsWkSort>
            <IsPaid>${item.IsPaid ?? 0}</IsPaid>
            <IsHalf>${item.IsHalf ?? 0}</IsHalf>
            <IsDeduc>${item.IsDeduc ?? 0}</IsDeduc>
            <IsSat>${item.IsSat ?? 0}</IsSat>
            <IsSun>${item.IsSun ?? 0}</IsSun>
            <IsHoli>${item.IsHoli ?? 0}</IsHoli>
            <IsLimit>${item.IsLimit ?? 0}</IsLimit>
            <LimitGrp>${this.safeValue(item.LimitGrp ?? '')}</LimitGrp>
            <SMLimitGrp>${item.SMLimitGrp ?? 0}</SMLimitGrp>
            <WkMth>${this.safeValue(item.WkMth ?? '')}</WkMth>
            <SMWkMth>${item.SMWkMth ?? 0}</SMWkMth>
            <WkMthGrp>${this.safeValue(item.WkMthGrp ?? '')}</WkMthGrp>
            <SMWkMthGrp>${item.SMWkMthGrp ?? 0}</SMWkMthGrp>
            <TmUnit>${item.TmUnit ?? 0}</TmUnit>
            <AppMth>${this.safeValue(item.AppMth ?? '')}</AppMth>
            <SMAppMth>${item.SMAppMth ?? 0}</SMAppMth>
            <IsUse>${item.IsUse ?? 0}</IsUse>
            <DispSeq>${item.DispSeq ?? 0}</DispSeq>
            <IsPrint>${item.IsPrint ?? 0}</IsPrint>
            <Remark>${this.safeValue(item.Remark ?? '')}</Remark>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPRWkEmpDdCheckAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item) => `
          <DataBlock3>
                <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
                <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
                <DataSeq>${this.safeValue(item.IdxNo || item.IDX_NO)}</DataSeq>
                <Selected>0</Selected>
                <Status>0</Status>
                <ROW_IDX>${item.ROW_IDX ?? 0}</ROW_IDX>
                <EmpSeq>${this.safeValue(item.EmpSeq ?? '')}</EmpSeq>
                <DeptSeq>${this.safeValue(item.DeptSeq ?? '')}</DeptSeq>
                <PuSeq>${this.safeValue(item.PuSeq ?? '')}</PuSeq>
                <PtSeq>${this.safeValue(item.PtSeq ?? '')}</PtSeq>
                <WkDate>${this.safeValue(item.WkDate ?? '')}</WkDate>
                <WkItemSeq>${this.safeValue(item.WkItemSeq ?? '')}</WkItemSeq>
                <DTCnt>${this.safeValue(item.DTCnt ?? '')}</DTCnt>
                 <TABLE_NAME>DataBlock3</TABLE_NAME>
        </DataBlock3>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPRWkEmpDdAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item) => `
          <DataBlock3>
                <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
                <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
                <DataSeq>${this.safeValue(item.IdxNo || item.IDX_NO)}</DataSeq>
                <Selected>0</Selected>
                <Status>0</Status>
                <ROW_IDX>${item.ROW_IDX ?? 0}</ROW_IDX>
                <EmpSeq>${this.safeValue(item.EmpSeq ?? '')}</EmpSeq>
                <DeptSeq>${this.safeValue(item.DeptSeq ?? '')}</DeptSeq>
                <PuSeq>${this.safeValue(item.PuSeq ?? '')}</PuSeq>
                 <PtSeq>${this.safeValue(item.PtSeq ?? '')}</PtSeq>
                <WkDate>${this.safeValue(item.WkDate ?? '')}</WkDate>
                <WkItemSeq>${this.safeValue(item.WkItemSeq ?? '')}</WkItemSeq>
                <DTCnt>${this.safeValue(item.DTCnt ?? '')}</DTCnt>
                <DTime>${this.safeValue(item.DTime ?? '')}</DTime>
                <MinCnt>${this.safeValue(item.MinCnt ?? '')}</MinCnt>
        </DataBlock3>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLCalendarHolidayAUD(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
          <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
          <DataSeq>${this.safeValue(item.DataSeq ?? 1)}</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <CompanySeq>${item.CompanySeq ?? 0}</CompanySeq>
          <Solar>${this.safeValue(item.Solar ?? '')}</Solar>
          <SMHolidayType>${item.SMHolidayType ?? ''}</SMHolidayType>
          <HolidayName>${this.safeValue(item.HolidayName ?? '')}</HolidayName>
          <CountrySeq>${item.CountrySeq ?? 0}</CountrySeq>
          <IsCommon>${item.IsCommon ?? 0}</IsCommon>
          <Remark>${this.safeValue(item.Remark ?? '')}</Remark>
          <SolarOld>${item.SolarOld ?? 0}</SolarOld>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLWkOverTimeApproveAUD(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map((item) => `
        <DataBlock1>
          <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
          <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
          <DataSeq>${this.safeValue(item.DataSeq ?? 1)}</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <IsCheck>${this.safeValue(item.IsCheck ?? 0)}</IsCheck>
          <EmpSeq>${this.safeValue(item.EmpSeq)}</EmpSeq>
          <WkDate>${this.safeValue(item.WkDate)}</WkDate>
          <WkItemSeq>${this.safeValue(item.WkItemSeq)}</WkItemSeq>
          <PayDTime>${this.safeValue(item.PayDTime)}</PayDTime>
          <PayDTCnt>${this.safeValue(item.PayDTCnt)}</PayDTCnt>
          <PayMinCnt>${this.safeValue(item.PayMinCnt)}</PayMinCnt>
          <Remark>${this.safeValue(item.Remark ?? '')}</Remark>
          <Seq>${this.safeValue(item.Seq)}</Seq>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPRWkMmEmpDaysAUD(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
          <DataBlock1>
            <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
    <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
            <DataSeq>${this.safeValue(item.DataSeq ?? 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <EmpSeq>${this.safeValue(item.EmpSeq)}</EmpSeq>
            <PayYM>${this.safeValue(item.PayYM)}</PayYM>
            <OccurFrDate>${this.safeValue(item.OccurFrDate)}</OccurFrDate>
            <OccurToDate>${this.safeValue(item.OccurToDate)}</OccurToDate>
            <OccurDays>${this.safeValue(item.OccurDays)}</OccurDays>
            <UseFrDate>${this.safeValue(item.UseFrDate)}</UseFrDate>
            <UseToDate>${this.safeValue(item.UseToDate)}</UseToDate>
            <PbSeq>${this.safeValue(item.PbSeq)}</PbSeq>
            <GnerAmtYyMm>${this.safeValue(item.GnerAmtYyMm ?? '')}</GnerAmtYyMm>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <YM>${this.safeValue(item.YM)}</YM>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSPRWkMmEmpDaysProc(
    result: Array<{ [key: string]: any }>
  ): string {
    const xmlBlocks = result
      .map((item, index) => {
        // Lấy giá trị PuSeq an toàn
        const puSeq = this.safeValue(item.PuSeq);

        // Nếu giá trị rỗng, dùng self-closing tag, nếu có giá trị, đóng tag bình thường
        const puSeqTag = puSeq ? `<PuSeq>${puSeq}</PuSeq>` : `<PuSeq />`;

        return `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <IsChangedMst>0</IsChangedMst>
            <Selected>1</Selected>
            <YyMm>${this.safeValue(item.YyMm)}</YyMm>
            ${puSeqTag}
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
        `;
      })
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSPRWkAbsEmpAUD(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map(
        (item) => `
          <DataBlock1>
            <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
            <IDX_NO>${this.safeValue(item.IdxNo || item.IDX_NO)}</IDX_NO>
            <DataSeq>${this.safeValue(item.DataSeq ?? 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <EmpName>${this.safeValue(item.EmpName)}</EmpName>
            <EmpSeq>${this.safeValue(item.EmpSeq)}</EmpSeq>
            <EmpID>${this.safeValue(item.EmpID)}</EmpID>
            <DeptName>${this.safeValue(item.DeptName)}</DeptName>
            <UMJpName>${this.safeValue(item.UMJpName)}</UMJpName>
            <UMPgName>${this.safeValue(item.UMPgName)}</UMPgName>
            <UMJoName>${this.safeValue(item.UMJoName)}</UMJoName>
            <DeptSeq>${this.safeValue(item.DeptSeq)}</DeptSeq>
            <PuSeq>${this.safeValue(item.PuSeq)}</PuSeq>
            <PuName>${this.safeValue(item.PuName)}</PuName>
            <PtSeq>${this.safeValue(item.PtSeq)}</PtSeq>
            <PtName>${this.safeValue(item.PtName)}</PtName>
            <WkItemName>${this.safeValue(item.WkItemName)}</WkItemName>
            <WkItemSeq>${this.safeValue(item.WkItemSeq)}</WkItemSeq>
            <IsHalf>${this.safeValue(item.IsHalf ?? 0)}</IsHalf>
            <Remark>${this.safeValue(item.Remark ?? '')}</Remark>
            <CCSeq>${this.safeValue(item.CCSeq ?? 0)}</CCSeq>
            <InputType>${this.safeValue(item.InputType)}</InputType>
            <SMInputType>${this.safeValue(item.SMInputType ?? 0)}</SMInputType>
            <UMGrpSeq>${this.safeValue(item.UMGrpSeq ?? 0)}</UMGrpSeq>
            <UMWkGrpSeq>${this.safeValue(item.UMWkGrpSeq ?? 0)}</UMWkGrpSeq>
            <Seq>${this.safeValue(item.Seq ?? 0)}</Seq>
            <GrpName>${this.safeValue(item.GrpName)}</GrpName>
            <WkGrpName>${this.safeValue(item.WkGrpName)}</WkGrpName>
            <OldWkItemSeq>${this.safeValue(item.OldWkItemSeq ?? 0)}</OldWkItemSeq>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <AbsDate>${this.safeValue(item.AbsDate)}</AbsDate>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


}
