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

  generateXMLSearchEduType(result: any): string {
    return `<ROOT>
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <UMEduGrpType>${this.escapeXml(result[0]?.UMEduGrpType) || ''}</UMEduGrpType>
          <EduTypeName>${this.escapeXml(result[0]?.EduTypeName) || ''}</EduTypeName>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLEduType(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
                <WorkingTag>${result[0].status || result[0].WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>1</Selected>
                <EduTypeSeq>${item.EduTypeSeq || 0}</EduTypeSeq>
                <EduTypeName>${this.escapeXml(item.EduTypeName) || ''}</EduTypeName>
                <UMEduGrpType>${item.UMEduGrpType || ''}</UMEduGrpType>
                <Remark>${this.escapeXml(item.Remark) || ''}</Remark>
                <DispSeq>${this.escapeXml(item.DispSeq) || 0}</DispSeq>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
              </DataBlock1>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSearchEduCourse(result: any): string {
    return `<ROOT>
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <UMEduHighClass>${this.escapeXml(result[0]?.UMEduHighClass) || 0}</UMEduHighClass>
          <UMEduHighClassName>${this.escapeXml(result[0]?.UMEduHighClassName) || ''}</UMEduHighClassName>
          <UMEduMidClass>${result[0]?.UMEduMidClass || 0}</UMEduMidClass>
          <UMEduMidClassName>${this.escapeXml(result[0]?.UMEduMidClassName) || ''}</UMEduMidClassName>
          <EduClassSeq>${result[0]?.EduClassSeq || 0}</EduClassSeq>
          <EduClassName>${this.escapeXml(result[0]?.EduClassName) || ''}</EduClassName>
          <UMEduGrpType>${result[0]?.UMEduGrpType || 0}</UMEduGrpType>
          <EduTypeSeq>${result[0]?.EduTypeSeq || 0}</EduTypeSeq>
          <EduCourseName>${this.escapeXml(result[0]?.EduCourseName) || ''}</EduCourseName>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLEduCourse(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
                <WorkingTag>${item.status || item.WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>1</Selected>
                <EduCourseSeq>${item.EduCourseSeq || 0}</EduCourseSeq>
                <EduCourseName>${this.escapeXml(item.EduCourseName) || ''}</EduCourseName>
                <EduClassSeq>${item.EduClassSeq || 0}</EduClassSeq>
                <EduClassName>${this.escapeXml(item.EduClassName) || ''}</EduClassName>
                <UMEduHighClass>${item.UMEduHighClass || 0}</UMEduHighClass>
                <UMEduHighClassName>${this.escapeXml(item.UMEduHighClassName) || ''}</UMEduHighClassName>
                <UMEduMidClass>${item.UMEduMidClass || 0}</UMEduMidClass>
                <UMEduMidClassName>${this.escapeXml(item.UMEduMidClassName) || ''}</UMEduMidClassName>
                <SMEduCourseType>${item.SMEduCourseType || 0}</SMEduCourseType>
                <EduCompeSeq>${item.EduCompeSeq || 0}</EduCompeSeq>
                <EduCompeName>${this.escapeXml(item.EduCompeName) || ''}</EduCompeName>
                <UMEduGrpType>${item.UMEduGrpType || 0}</UMEduGrpType>
                <EduTypeSeq>${item.EduTypeSeq || 0}</EduTypeSeq>
                <SMEduCourseTypeName>${this.escapeXml(item.SMEduCourseTypeName) || ''}</SMEduCourseTypeName>
                <EduRem>${this.escapeXml(item.EduRem) || ''}</EduRem>
                <IsUse>${this.convertToNumber(item.IsUse) || 0}</IsUse>
                <EtcCourseYN>${this.convertToNumber(item.EtcCourseYN) || 0}</EtcCourseYN>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
              </DataBlock1>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSearchEduClassTree(result: any): string {
    return `<ROOT>
            <DataBlock1>
              <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <ClassNo>${result[0]?.ClassNo || 2}</ClassNo>
            </DataBlock1>
          </ROOT>`;
  }

  generateXMLGetEduClass(result: any): string {
    return `<ROOT>
              <DataBlock1>
                <WorkingTag>U</WorkingTag>
                <IDX_NO>1</IDX_NO>
                <Status>0</Status>
                <DataSeq>1</DataSeq>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                <IsChangedMst>0</IsChangedMst>
                <UMEduHighClass>${result[0]?.UMEduHighClass || 0}</UMEduHighClass>
                <UMEduHighClassName>${this.escapeXml(result[0]?.UMEduHighClassName) || ''}</UMEduHighClassName>
                <UMEduMidClass>${result[0]?.UMEduMidClass || 0}</UMEduMidClass>
                <UMEduMidClassName>${this.escapeXml(result[0]?.UMEduMidClassName) || ''}</UMEduMidClassName>
                <EduClassName>${this.escapeXml(result[0]?.EduClassName) || ''}</EduClassName>
              </DataBlock1>
          </ROOT>`;
  }

  generateXMLEduClass(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
                <WorkingTag>${item.status || item.WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>1</Selected>
                <EduClassSeq>${item.EduClassSeq || 0}</EduClassSeq>
                <EduClassName>${this.escapeXml(item.EduClassName) || ''}</EduClassName>
                <UMEduHighClass>${item.UMEduHighClass || 0}</UMEduHighClass>
                <UMEduMidClass>${item.UMEduMidClass || 0}</UMEduMidClass>
                <EduGoal>${this.escapeXml(item.EduGoal) || ''}</EduGoal>
                <EduAppRange>${this.escapeXml(item.EduAppRange) || ''}</EduAppRange>
                <Remark>${this.escapeXml(item.Remark) || ''}</Remark>
                <EduCompeSeq>${item.EduCompeSeq || 0}</EduCompeSeq>
                <EduCompeName>${this.escapeXml(item.EduCompeName) || ''}</EduCompeName>
                <DispSeq>${item.DispSeq || 0}</DispSeq>
                <IsUse>${this.convertToNumber(item.IsUse) || 0}</IsUse>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
              </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduLecturer(result: Array<{ [key: string]: any }>): string {
    let xmlBlocks = '';
    if (result[0]?.SMInOutType === 1012001) {
      xmlBlocks = result
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
                <SMPayType>${item.SMPayType || ''}</SMPayType>
                <DeptSeq>${item.DeptSeq || 0}</DeptSeq>
                <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
                <EmpName>${this.escapeXml(item.EmpName) || ''}</EmpName>
                <SMInOutType>1012001</SMInOutType>
              </DataBlock1>
          
          `,
        )
        .join('');
    } else {
      xmlBlocks = result
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
                <SMPayType>${item.SMPayType || ''}</SMPayType>
                <LecturerName>${this.escapeXml(item.LecturerName) || ''}</LecturerName>
                <SMInOutType>1012002</SMInOutType>
              </DataBlock1>
          
          `,
        )
        .join('');
    }

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduLecturerAU(result: Array<{ [key: string]: any }>): string {
    let xmlBlocks = '';

    if (result[0].SMInOutType === 1012001) {
      xmlBlocks = result
        .map(
          (item, index) => `
              <DataBlock1>
                <WorkingTag>${result[0].status || result[0].WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>1</Selected>
                <LecturerSeq>${item.LecturerSeq || 0}</LecturerSeq>
                <SMInOutType>${item.SMInOutType || 0}</SMInOutType>
                <SMInOutTypeName>${item.SMInOutTypeName || ''}</SMInOutTypeName>
                <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
                <EmpName>${item.EmpName || ''}</EmpName>
                <EmpID>${this.escapeXml(item.EmpID) || ''}</EmpID>
                <ResidID>${this.escapeXml(item.ResidID) || ''}</ResidID>
                <Address>${this.escapeXml(item.Address) || ''}</Address>
                <BasePrice>${item.BasePrice || 0}</BasePrice>
                <SMPayType>${item.SMPayType || 0}</SMPayType>
                <SMPayTypeName>${item.SMPayTypeName || ''}</SMPayTypeName>
                <Remark>${this.escapeXml(item.Remark) || ''}</Remark>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
              </DataBlock1>
          
          `,
        )
        .join('');
    } else {
      xmlBlocks = result
        .map(
          (item, index) => `
              <DataBlock1>
                <WorkingTag>${result[0].status || result[0].WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>1</Selected>
                <LecturerSeq>${item.LecturerSeq || 0}</LecturerSeq>
                <LecturerSeq>${item.LecturerSeq || 0}</LecturerSeq>
                <LecturerName>${item.LecturerName || ''}</LecturerName>
                <ResidID>${this.escapeXml(item.ResidID) || ''}</ResidID>
                <SMInOutType>1012002</SMInOutType>
                <SMInOutTypeName />
                <Address>${this.escapeXml(item.Address) || ''}</Address>
                <Remark>${this.escapeXml(item.Remark) || ''}</Remark>
                <BasePrice>${item.BasePrice || 0}</BasePrice>
                <SMPayType>${item.SMPayType || 0}</SMPayType>
                <SMPayTypeName>${item.SMPayTypeName || ''}</SMPayTypeName>
              </DataBlock1>
          
          `,
        )
        .join('');
    }

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSearchEduPerRst(result: any): string {
    return `<ROOT>
        <DataBlock1>
          <WorkingTag>U</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <EmpSeq>${result[0].EmpSeq || 0}</EmpSeq>
          <RstSeq>${result[0].RstSeq || 0}</RstSeq>
          <SMEduPlanType>${result[0].SMEduPlanType || 0}</SMEduPlanType>
          <SMEduPlanTypeName>${result[0].SMEduPlanTypeName || ''}</SMEduPlanTypeName>
          <ReqSeq>${result[0].ReqSeq || 0}</ReqSeq>
          <CfmEmpSeq>${result[0].CfmEmpSeq || 0}</CfmEmpSeq>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLEduRstItemQuery(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock2>
                <WorkingTag>U</WorkingTag>
                <IDX_NO>1</IDX_NO>
                <Status>0</Status>
                <DataSeq>1</DataSeq>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock2</TABLE_NAME>
                <IsChangedMst>0</IsChangedMst>
                <RstSeq>${item?.RstSeq || 0}</RstSeq>
                <EduTypeSeq>${item?.EduTypeSeq || 0}</EduTypeSeq>
              </DataBlock2>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduRstCostQuery(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock3>
                <WorkingTag>U</WorkingTag>
                <IDX_NO>1</IDX_NO>
                <Status>0</Status>
                <DataSeq>1</DataSeq>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock3</TABLE_NAME>
                <IsChangedMst>0</IsChangedMst>
                <RstSeq>${item?.RstSeq || 0}</RstSeq>
                <ReqSeq>${item?.ReqSeq || 0}</ReqSeq>
              </DataBlock3>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduPerRst(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
                <WorkingTag>${item.status || item.WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                <IsChangedMst>0</IsChangedMst>
                <EmpSeq>${item?.EmpSeq || 0}</EmpSeq>
                <RstSeq>${item?.RstSeq || 0}</RstSeq>
                <RstNo>${item?.RstNo || ''}</RstNo>
                <SMEduPlanType>${item?.SMEduPlanType || 0}</SMEduPlanType>
                <ReqSeq>${item?.ReqSeq || 0}</ReqSeq>
                <RegDate>${item?.RegDate || ''}</RegDate>
                <CfmEmpSeq>${item?.CfmEmpSeq || 0}</CfmEmpSeq>
                <CfmEmpName>${this.escapeXml(item?.CfmEmpName) || ''}</CfmEmpName>
                <EduClassSeq>${item?.EduClassSeq || 0}</EduClassSeq>
                <IsBatchReq>${this.convertToNumber(item?.IsBatchReq) || 0}</IsBatchReq>
                <UMEduGrpType>${item?.UMEduGrpType || ''}</UMEduGrpType>
                <EduTypeSeq>${item?.EduTypeSeq || 0}</EduTypeSeq>
                <EduCourseSeq>${item?.EduCourseSeq || 0}</EduCourseSeq>
                <EtcCourseName>${this.escapeXml(item?.EtcCourseName) || ''}</EtcCourseName>
                <SMInOutType>${item?.SMInOutType || 0}</SMInOutType>
                <EduBegDate>${item?.EduBegDate || ''}</EduBegDate>
                <EduEndDate>${item?.EduEndDate || ''}</EduEndDate>
                <EduDd>${item?.EduDd || 0}</EduDd>
                <EduTm>${item?.EduTm || 0}</EduTm>
                <EduPoint>${item?.EduPoint || 0}</EduPoint>
                <SatisLevel>${item?.SatisLevel || 0}</SatisLevel>
                <UMInstitute>${item?.UMInstitute || ''}</UMInstitute>
                <UMlocation>${item?.UMlocation || ''}</UMlocation>
                <LecturerSeq>${item?.LecturerSeq || 0}</LecturerSeq>
                <EtcInstitute>${this.escapeXml(item?.EtcInstitute) || ''}</EtcInstitute>
                <Etclocation>${this.escapeXml(item?.Etclocation) || ''}</Etclocation>
                <EtcLecturer>${this.escapeXml(item?.EtcLecturer) || ''}</EtcLecturer>
                <RstSummary>${this.escapeXml(item?.RstSummary) || ''}</RstSummary>
                <RstRem>${this.escapeXml(item?.RstRem) || ''}</RstRem>
                <FileNo>${item?.FileNo || 0}</FileNo>
              </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduCostRst(
    result: Array<{ [key: string]: any }>,
    rstSeq: any,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock3>
                <WorkingTag>${item?.status || item?.WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>1</Selected>
                <RstSeq>${item?.RstSeq || rstSeq || 0}</RstSeq>
                <UMCostItem>${item?.UMCostItem || 0}</UMCostItem>
                <ReqCost>${item?.ReqCost || 0}</ReqCost>
                <RstCost>${item?.RstCost || 0}</RstCost>
                <IsReturnItem>${this.convertToNumber(item?.IsReturnItem) || 0}</IsReturnItem>
                <IsInsur>${this.convertToNumber(item?.IsInsur) || 0}</IsInsur>
                <ReturnRate>${item?.ReturnRate || 0}</ReturnRate>
                <ReturnAmt>${item?.ReturnAmt || 0}</ReturnAmt>
                <Rem>${item?.Rem || ''}</Rem>
                <UMCostItemOld>${item?.UMCostItemOld || 0}</UMCostItemOld>
                <TABLE_NAME>DataBlock3</TABLE_NAME>
              </DataBlock3>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduCostRstBatch(
    result: Array<{ [key: string]: any }>,
    rstSeq: any,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock3>
                <WorkingTag>${item?.Status || item?.WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <RstSeq>${item?.RstSeq || rstSeq || 0}</RstSeq>
                <UMCostItem>${item?.UMCostItem || 0}</UMCostItem>
                <RstCost>${item?.RstCost || 0}</RstCost>
                <IsVAT>${this.convertToNumber(item?.IsVAT) || 0}</IsVAT>
                <VATAmt>${item?.VATAmt || 0}</VATAmt>
                <IsReturnItem>${this.convertToNumber(item?.IsReturnItem) || 0}</IsReturnItem>
                <IsInsur>${this.convertToNumber(item?.IsInsur) || 0}</IsInsur>
                <ReturnRate>${item?.ReturnRate || 0}</ReturnRate>
                <ReturnAmt>${item?.ReturnAmt || 0}</ReturnAmt>
                <Rem>${item?.Rem || ''}</Rem>
                <UMCostItemOld>${item?.UMCostItemOld || 0}</UMCostItemOld>
                <TABLE_NAME>DataBlock3</TABLE_NAME>
              </DataBlock3>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduItemRst(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSearchEduCostRst(result: any): string {
    return `<ROOT>
          <DataBlock3>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock3</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <RstSeq>${result[0]?.RstSeq || 0}</RstSeq>
            <ReqSeq>${result[0]?.ReqSeq || 0}</ReqSeq>
          </DataBlock3>
      </ROOT>`;
  }

  generateXMLSearchEduItemRst(result: any): string {
    return `<ROOT>
          <DataBlock2>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock2</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <RstSeq>${result[0]?.RstSeq || 0}</RstSeq>
            <ReqSeq>${result[0]?.ReqSeq || 0}</ReqSeq>
            <EduTypeSeq>${result[0]?.EduTypeSeq || 0}</EduTypeSeq>
            <IsSearch>${result[0]?.IsSearch || 1}</IsSearch>
          </DataBlock2>
      </ROOT>`;
  }

  generateXMLSearchEduPerRstQuery(
    result: Array<{ [key: string]: any }>,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock4>
              <WorkingTag>U</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock4</TABLE_NAME>
              <IsChangedMst>1</IsChangedMst>
              <EmpID>${item?.EmpID || ''}</EmpID>
              <DeptName>${item?.DeptName || ''}</DeptName>
              <EmpSeq>${item?.EmpSeq || 0}</EmpSeq>
              <EmpName>${item?.EmpName || ''}</EmpName>
              <RstSeq>${item?.RstSeq || 0}</RstSeq>
              <ReqSeq>${item?.ReqSeq || 0}</ReqSeq>
            </DataBlock4>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduPerObj(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock4>
                <WorkingTag>${item?.status || item?.WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <RstSeq>${item?.RstSeq || 0}</RstSeq>
                <EmpSeq>${item?.EmpSeq || 0}</EmpSeq>
                <EmpName>${item?.EmpName || ''}</EmpName>
                <EmpID>${item?.EmpID || ''}</EmpID>
                <DeptSeq>${item?.DeptSeq || 0}</DeptSeq>
                <DeptName>${item?.DeptName || ''}</DeptName>
                <EmpSeqOld>${item?.EmpSeqOld || 0}</EmpSeqOld>
                <TABLE_NAME>DataBlock4</TABLE_NAME>
              </DataBlock4>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduPerObjBatch(
    result: Array<{ [key: string]: any }>,
    rstSeq: any,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock4>
                <WorkingTag>${item?.status || item?.WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <RstSeq>${item?.RstSeq || rstSeq || 0}</RstSeq>
                <EmpSeq>${item?.EmpSeq || 0}</EmpSeq>
                <EmpSeqOld>${item?.EmpSeqOld || 0}</EmpSeqOld>
                <Dummy1>${item?.Dummy1 || 0}</Dummy1>
                <Dummy2>${item?.Dummy2 || 0}</Dummy2>
                <Dummy3>${item?.Dummy3 || 0}</Dummy3>
                <Dummy4>${item?.Dummy4 || 0}</Dummy4>
                <Dummy5>${item?.Dummy5 || 0}</Dummy5>
                <Dummy6>${item?.Dummy6 || 0}</Dummy6>
              </DataBlock4>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSearchEduRst(result: any): string {
    return `<ROOT>
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <RstNo>${result[0]?.RstNo || 0}</RstNo>
          <RegBegDate>${result[0]?.RegBegDate || ''}</RegBegDate>
          <RegEndDate>${result[0]?.RegEndDate || ''}</RegEndDate>
          <EduRstType>${result[0]?.EduRstType || ''}</EduRstType>
          <UMEduGrpType>${result[0]?.UMEduGrpType || ''}</UMEduGrpType>
          <EduTypeSeq>${result[0]?.EduTypeSeq || 0}</EduTypeSeq>
          <UMEduHighClass>${result[0]?.UMEduHighClass || 0}</UMEduHighClass>
          <UMEduMidClass>${result[0]?.UMEduMidClass || 0}</UMEduMidClass>
          <EduClassSeq>${result[0]?.EduClassSeq || 0}</EduClassSeq>
          <EduCourseSeq>${result[0]?.EduCourseSeq || 0}</EduCourseSeq>
          <DeptSeq>${result[0]?.DeptSeq || 0}</DeptSeq>
          <CfmEmpSeq>${result[0]?.CfmEmpSeq || 0}</CfmEmpSeq>
          <EmpSeq>${result[0]?.EmpSeq || 0}</EmpSeq>
          <IsConfirm>${result[0]?.IsConfirm || 1}</IsConfirm>
          <IsNotConfirm>${result[0]?.IsNotConfirm || 1}</IsNotConfirm>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLSearchEduRstEnd(result: any): string {
    return `<ROOT>
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <RegBegDate>${result[0]?.RegBegDate || ''}</RegBegDate>
          <RegEndDate>${result[0]?.RegEndDate || ''}</RegEndDate>
          <EduBegDate>${result[0]?.EduBegDate || ''}</EduBegDate>
          <EduEndDate>${result[0]?.EduEndDate || ''}</EduEndDate>
          <DeptSeq>${result[0]?.DeptSeq || 0}</DeptSeq>
          <IsEnd>${result[0]?.IsEnd || 0}</IsEnd>
          <UMEduGrpType>${result[0]?.UMEduGrpType || ''}</UMEduGrpType>
          <EduClassSeq>${result[0]?.EduClassSeq || 0}</EduClassSeq>
          <EmpSeq>${result[0]?.EmpSeq || 0}</EmpSeq>
          <CfmEmpSeq>${result[0]?.CfmEmpSeq || 0}</CfmEmpSeq>
          <EduRstType>${result[0]?.EduRstType || ''}</EduRstType>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLEduPerRstEnd(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
                <WorkingTag>U</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <IsEnd>${this.convertToNumber(item.IsEnd) || 1}</IsEnd>
                <SMEduPlanType>${item.SMEduPlanType || 0}</SMEduPlanType>
                <RegDate>${item.RegDate || ''}</RegDate>
                <RstSeq>${item.RstSeq || 0}</RstSeq>
                <RstNo>${item.RstNo || ''}</RstNo>
                <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
                <EmpID>${item.EmpID || ''}</EmpID>
                <DeptSeq>${item.DeptSeq || 0}</DeptSeq>
                <UMEduGrpType>${item.UMEduGrpType || ''}</UMEduGrpType>
                <EduClassSeq>${item.EduClassSeq || 0}</EduClassSeq>
                <EduCourseSeq>${item.EduCourseSeq || 0}</EduCourseSeq>
                <EtcCourseName>${item.EtcCourseName || ''}</EtcCourseName>
                <EduBegDate>${item.EduBegDate || ''}</EduBegDate>
                <EduEndDate>${item.EduEndDate || ''}</EduEndDate>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
              </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLComConfirm(
    result: Array<{ [key: string]: any }>,
    rstSeq: any,
  ): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
                <WorkingTag>U</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <CfmCode>1</CfmCode>
                <CfmSeq>${rstSeq}</CfmSeq>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                <TableName>_THREduPersRst</TableName>
              </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLEduRstBatch(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock1>
                <WorkingTag>${item?.Status || item?.WorkingTag}</WorkingTag>
                <IDX_NO>${item.IdxNo || item.IDX_NO || 1}</IDX_NO>
                <Status>0</Status>
                <DataSeq>${index + 1 || 1}</DataSeq>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                <IsChangedMst>0</IsChangedMst>
                <PlanSerl>0</PlanSerl>
                <RstNo>${item.RstNo || ''}</RstNo>
                <PlanSeq>${item.PlanSeq || 0}</PlanSeq>
                <RstSeq>${item.RstSeq || 0}</RstSeq>
                <RegDate>${item.RegDate || ''}</RegDate>
                <EduClassSeq>${item.EduClassSeq || 0}</EduClassSeq>
                <UMEduGrpType>${item.UMEduGrpType || ''}</UMEduGrpType>
                <EduTypeSeq>${item.EduTypeSeq || 0}</EduTypeSeq>
                <EduCourseSeq>${item.EduCourseSeq || 0}</EduCourseSeq>
                <EtcCourseName>${item.EtcCourseName || ''}</EtcCourseName>
                <SMInOutType>${item.SMInOutType || ''}</SMInOutType>
                <EduBegDate>${item.EduBegDate || ''}</EduBegDate>
                <EduEndDate>${item.EduEndDate || ''}</EduEndDate>
                <EduDd>${item.EduDd || 0}</EduDd>
                <EduTm>${item.EduTm || 0}</EduTm>
                <EduPoint>${item.EduPoint || 0}</EduPoint>
                <SatisLevel>${item.SatisLevel || 0}</SatisLevel>
                <UMInstitute>${item.UMInstitute || ''}</UMInstitute>
                <UMlocation>${item.UMlocation || ''}</UMlocation>
                <LecturerSeq>${item.LecturerSeq || 0}</LecturerSeq>
                <EtcInstitute>${item.EtcInstitute || ''}</EtcInstitute>
                <Etclocation>${item.Etclocation || ''}</Etclocation>
                <RstSummary>${item.RstSummary || ''}</RstSummary>
                <RstRem>${item.RstRem || ''}</RstRem>
                <FileNo>${item.FileNo || ''}</FileNo>
              </DataBlock1>
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

    generateXMLEduRstObjBatch(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item, index) => `
              <DataBlock4>
                <WorkingTag>U</WorkingTag>
                <IDX_NO>1</IDX_NO>
                <Status>0</Status>
                <DataSeq>1</DataSeq>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock4</TABLE_NAME>
                <IsChangedMst>0</IsChangedMst>
                <RstSeq>${item?.RstSeq || 0}</RstSeq>
                <PlanSeq>0</PlanSeq>
              </DataBlock4>
          
          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
