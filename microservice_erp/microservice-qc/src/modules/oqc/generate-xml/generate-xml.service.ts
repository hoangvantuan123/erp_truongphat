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
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>1</IsChangedMst>
            <FactUnit>${this.escapeXml(item.FactUnit ?? '')}</FactUnit>
            <WorkDate>${this.escapeXml(item.WorkDate ?? '')}</WorkDate>
            <WorkDateTo>${this.escapeXml(item.WorkDateTo ?? '')}</WorkDateTo>
            <TestEndDate>${this.escapeXml(item.TestEndDate ?? '')}</TestEndDate>
            <TestEndDateTo>${this.escapeXml(item.TestEndDateTo ?? '')}</TestEndDateTo>
            <DeptName>${this.escapeXml(item.DeptName ?? '')}</DeptName>
            <CustSeq>${this.escapeXml(item.CustSeq ?? '')}</CustSeq>
            <ItemName>${this.escapeXml(item.ItemName ?? '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo ?? '')}</ItemNo>
            <Spec>${this.escapeXml(item.Spec ?? '')}</Spec>
            <IsGoodIn>${this.escapeXml(item.IsGoodIn ?? '')}</IsGoodIn>
            <IsGoodInNm>${this.escapeXml(item.IsGoodInNm ?? '')}</IsGoodInNm>
            <LOTNo>${this.escapeXml(item.LotNo ?? '')}</LOTNo>
            <QCNo>${this.escapeXml(item.QcNo ?? '')}</QCNo>
            <SMQcType>${this.escapeXml(item.SMQcType ?? '')}</SMQcType>
            <ProcName />
            <WorkCenterSeq>${this.escapeXml(item.WorkCenter ?? '')}</WorkCenterSeq>
            <WorkType>${this.escapeXml(item.WorkType ?? '')}</WorkType>
            <DelvNo>${this.escapeXml(item.DelvNo ?? '')}</DelvNo>
            <ProdPlanNo />
            <OrderNo />
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  GetOQCSeq(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
           <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO ?? index + 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <FactUnitName>${this.escapeXml(item.FactUnitName ?? '')}</FactUnitName>
            <FactUnit>${this.escapeXml(item.FactUnit ?? 0)}</FactUnit>
            <SourceTypeName>${this.escapeXml(item.SourceTypeName ?? '')}</SourceTypeName>
            <DeptName>${this.escapeXml(item.DeptName ?? '')}</DeptName>
            <WorkDate>${this.escapeXml(item.WorkDate ?? '')}</WorkDate>
            <DelvNo>${this.escapeXml(item.DelvNo ?? '')}</DelvNo>
            <ProdPlanNo>${this.escapeXml(item.ProdPlanNo ?? '')}</ProdPlanNo>
            <ItemName>${this.escapeXml(item.ItemName ?? '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo ?? '')}</ItemNo>
            <Spec>${this.escapeXml(item.Spec ?? '')}</Spec>
            <ProcName>${this.escapeXml(item.ProcName ?? '')}</ProcName>
            <QCNo>${this.escapeXml(item.QCNo ?? '')}</QCNo>
            <TestEndDate>${this.escapeXml(item.TestEndDate ?? '')}</TestEndDate>
            <ReqQty>${this.escapeXml(item.ReqQty ?? 0)}</ReqQty>
            <OKQty>${this.escapeXml(item.OKQty ?? 0)}</OKQty>
            <RemainQty>${this.escapeXml(item.RemainQty ?? 0)}</RemainQty>
            <BadQty>${this.escapeXml(item.BadQty ?? 0)}</BadQty>
            <LOTNo>${this.escapeXml(item.LOTNo ?? '')}</LOTNo>
            <FromSerial />
            <ToSerial />
            <DeptSeq>${this.escapeXml(item.DeptSeq ?? 0)}</DeptSeq>
            <ProcSeq>${this.escapeXml(item.ProcSeq ?? 0)}</ProcSeq>
            <SourceSeq>${this.escapeXml(item.SourceSeq ?? 0)}</SourceSeq>
            <SourceKind>${this.escapeXml(item.SourceKind ?? 3)}</SourceKind>
            <ItemSeq>${this.escapeXml(item.ItemSeq ?? 0)}</ItemSeq>
            <QCSeq>${this.escapeXml(item.QCSeq ?? 0)}</QCSeq>
            <SMTestResult>${this.escapeXml(item.SMTestResult ?? 0)}</SMTestResult>
            <EmpSeq>${this.escapeXml(item.EmpSeq ?? 0)}</EmpSeq>
            <EmpName>${this.escapeXml(item.EmpName ?? '')}</EmpName>
            <WorkCenterName>${this.escapeXml(item.WorkCenterName ?? '')}</WorkCenterName>
            <WorkCenterSeq>${this.escapeXml(item.WorkCenterSeq ?? 0)}</WorkCenterSeq>
            <CustName>${this.escapeXml(item.CustName ?? '')}</CustName>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkQcTestReport(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${item?.QCSeq === 0 ? 'A': 'U'}</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <Status>0</Status>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <ReqQty>${this.escapeXml(item.ReqQty || 0)}</ReqQty>
            <SelectDate>${this.escapeXml(item.SelectDate || '')}</SelectDate>
            <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
            <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
            <SMTestMethod>${this.escapeXml(item.SMTestMethod || '')}</SMTestMethod>
            <SMSamplingStd>${this.escapeXml(item.SMSamplingStd || '')}</SMSamplingStd>
            <TestStartDate>${this.escapeXml(item.TestStartDate || '')}</TestStartDate>
            <TestEndDate>${this.escapeXml(item.TestEndDate || '')}</TestEndDate>
            <TestDocNo />
            <AcBadRatio>${this.escapeXml(item.AcBadRatio || 0)}</AcBadRatio>
            <RealSampleQty>${this.escapeXml(item.RealSampleQty || 0)}</RealSampleQty>
            <SampleNo />
            <SMAQLLevel>${this.escapeXml(item.SMAQLLevel || 0)}</SMAQLLevel>
            <SMAQLStrict>${this.escapeXml(item.SMAQLStrict || 0)}</SMAQLStrict>
            <ReqSampleQty>${this.escapeXml(item.ReqSampleQty || 0)}</ReqSampleQty>
            <SMAQLPoint />
            <AQLAcValue>${this.escapeXml(item.AQLAcValue || 0)}</AQLAcValue>
            <AQLReValue>${this.escapeXml(item.AQLReValue || 0)}</AQLReValue>
            <QCSeq>${this.escapeXml(item.QCSeq || '')}</QCSeq>
            <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
            <SourceSerl>${this.escapeXml(item.SourceSerl || '')}</SourceSerl>
            <SourceSeq>${this.escapeXml(item.SourceSeq || '')}</SourceSeq>
            <SourceType>${this.escapeXml(item.SourceType || 10)}</SourceType>
            <QCNo>${this.escapeXml(item.QCNo || '')}</QCNo>
            <IsReCfm>${this.escapeXml(item.IsReCfm || 0)}</IsReCfm>
            <BadSampleQty>${this.escapeXml(item.BadSampleQty || 0)}</BadSampleQty>
            <SMTestResult>${this.escapeXml(item.SMTestResult || 0)}</SMTestResult>
            <DisposeQty>${this.escapeXml(item.DisposeQty || 0)}</DisposeQty>
            <TestUsedTime>${this.escapeXml(item.TestUsedTime || 0)}</TestUsedTime>
            <PassedQty>${this.escapeXml(item.PassedQty || 0)}</PassedQty>
            <RejectQty>${this.escapeXml(item.RejectQty || 0)}</RejectQty>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <Memo1>${this.escapeXml(item.Memo1 || '')}</Memo1>
            <Memo2>${this.escapeXml(item.Memo2 || '')}</Memo2>
            <ReqInQty>${this.escapeXml(item?.ReqInQty || 0)}</ReqInQty>
            <BadSampleRate>${this.escapeXml(item.BadSampleRate || 0)}</BadSampleRate>
            <SMRejectTransType>${this.escapeXml(item.SMRejectTransType || 0)}</SMRejectTransType>
            <FileSeq>${this.escapeXml(item.FileSeq || 0)}</FileSeq>
            <TestEndDateOld>${this.escapeXml(item.TestEndDateOld || 0)}</TestEndDateOld>
          </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveQcTestReport(resultCheck: any): Promise<string> {
    const xmlBlocks = `
          <DataBlock1>
            <WorkingTag>${resultCheck.WorkingTag}</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <QCSeq>${this.escapeXml(resultCheck.QCSeq || 0)}</QCSeq>
            <QCNo>${this.escapeXml(resultCheck.QCNo || 0)}</QCNo>
            <SourceType>${this.escapeXml(resultCheck.SourceType || 10)}</SourceType>
            <SourceSeq>${this.escapeXml(resultCheck.SourceSeq || 0)}</SourceSeq>
            <SourceSerl>${this.escapeXml(resultCheck.SourceSerl || 1)}</SourceSerl>
            <ItemSeq>${this.escapeXml(resultCheck.ItemSeq || 1)}</ItemSeq>
            <SMTestMethod>${this.escapeXml(resultCheck.SMTestMethod || 0)}</SMTestMethod>
            <SMSamplingStd>${this.escapeXml(resultCheck.SMSamplingStd || 0)}</SMSamplingStd>
            <SMAQLLevel>${this.escapeXml(resultCheck.SMAQLLevel || 0)}</SMAQLLevel>
            <SMAQLPoint>${this.escapeXml(resultCheck.SMAQLPoint || 0)}</SMAQLPoint>
            <SMAQLStrict>${this.escapeXml(resultCheck.SMAQLStrict || 0)}</SMAQLStrict>
            <AQLAcValue>${this.escapeXml(resultCheck.AQLAcValue || 0)}</AQLAcValue>
            <AQLReValue>${this.escapeXml(resultCheck.AQLReValue || 0)}</AQLReValue>
            <AcBadRatio>${this.escapeXml(resultCheck.AcBadRatio || 0)}</AcBadRatio>
            <ReqQty>${this.escapeXml(resultCheck.ReqQty || 0)}</ReqQty>
            <ReqSampleQty>${this.escapeXml(resultCheck.ReqSampleQty || 0)}</ReqSampleQty>
            <SelectDate>${this.escapeXml(resultCheck.SelectDate || 0)}</SelectDate>
            <TestStartDate>${this.escapeXml(resultCheck.TestStartDate || 0)}</TestStartDate>
            <TestEndDate>${this.escapeXml(resultCheck.TestEndDate || 0)}</TestEndDate>
            <TestDocNo />
            <SampleNo />
            <RealSampleQty>${this.escapeXml(resultCheck.RealSampleQty || 0)}</RealSampleQty>
            <BadSampleQty>${this.escapeXml(resultCheck.BadSampleQty || 0)}</BadSampleQty>
            <BadSampleRate>${this.escapeXml(resultCheck.BadSampleRate || 0)}</BadSampleRate>
            <SMTestResult>${this.escapeXml(resultCheck.SMTestResult || 0)}</SMTestResult>
            <PassedQty>${this.escapeXml(resultCheck.PassedQty || 0)}</PassedQty>
            <RejectQty>${this.escapeXml(resultCheck.RejectQty || 0)}</RejectQty>
            <DisposeQty>${this.escapeXml(resultCheck.DisposeQty || 0)}</DisposeQty>
            <ReqInQty>${this.escapeXml(resultCheck.ReqInQty || 0)}</ReqInQty>
            <TestUsedTime>${this.escapeXml(resultCheck.TestUsedTime || 0)}</TestUsedTime>
            <Remark>${this.escapeXml(resultCheck.Remark || 0)}</Remark>
            <SMRejectTransType>${this.escapeXml(resultCheck.SMRejectTransType || 0)}</SMRejectTransType>
            <EmpSeq>${this.escapeXml(resultCheck.EmpSeq || 0)}</EmpSeq>
            <EmpName>${this.escapeXml(resultCheck.EmpName || 0)}</EmpName>
            <Memo1>${this.escapeXml(resultCheck.Memo1 || 0)}</Memo1>
            <Memo2>${this.escapeXml(resultCheck.Memo2 || 0)}</Memo2>
            <FileSeq>${this.escapeXml(resultCheck.FileSeq || 0)}</FileSeq>
            <TestEndDateOld>${this.escapeXml(resultCheck.TestEndDateOld || 0)}</TestEndDateOld>
            <IsReCfm>${this.escapeXml(resultCheck.IsReCfm || 0)}</IsReCfm>
          </DataBlock1>
          `;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveInOutDailyBatch(resultCheck: any): Promise<string> {
    const xmlBlocks = `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(resultCheck.WorkingTag ?? 'U')}</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <InOutSeq>${this.escapeXml(resultCheck.QCSeq ?? 0)}</InOutSeq>
            <Remark>${this.escapeXml(resultCheck.Remark ?? '')}</Remark>
            <InOutType>210</InOutType>
          </DataBlock1>
          `;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveAutoGoodInSave(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
    .map(
      (item, index) =>
        `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'U')}</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <Status>0</Status>
            <SourceType>3</SourceType>
            <WorkReportSeq>${this.escapeXml(item.SourceSeq ?? 0)}</WorkReportSeq>
            <GoodItemSeq>${this.escapeXml(item.ItemSeq ?? 0)}</GoodItemSeq>
            <InDate>${this.escapeXml(item.TestEndDate ?? 0)}</InDate>
            <ProdQty>${this.escapeXml(item.PassedQty ?? 0)}</ProdQty>
            <QCSeq>${this.escapeXml(item.QCSeq ?? 0)}</QCSeq>
          </DataBlock1>
          `).join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkDeleteOqcTestReport(result: Array<{ [key: string]: any }>): Promise<string> {
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
            <IsChangedMst>1</IsChangedMst>
            <ReqQty>${this.escapeXml(item.ReqQty ?? '')}</ReqQty>
            <SelectDate>${this.escapeXml(item.SelectDate ?? '')}</SelectDate>
            <EmpSeq>${this.escapeXml(item.EmpSeq ?? '')}</EmpSeq>
            <EmpName>${this.escapeXml(item.EmpName ?? '')}</EmpName>
            <SMTestMethod>${this.escapeXml(item.SMTestMethod ?? '')}</SMTestMethod>
            <SMSamplingStd>${this.escapeXml(item.SMSamplingStd ?? '')}</SMSamplingStd>
            <TestStartDate>${this.escapeXml(item.TestStartDate ?? '')}</TestStartDate>
            <TestEndDate>${this.escapeXml(item.TestEndDate ?? '')}</TestEndDate>
            <TestDocNo />
            <AcBadRatio>${this.escapeXml(item.AcBadRatio ?? 0)}</AcBadRatio>
            <RealSampleQty>${this.escapeXml(item.RealSampleQty ?? 0)}</RealSampleQty>
            <SampleNo />
            <SMAQLLevel>${this.escapeXml(item.SMAQLLevel ?? 0)}</SMAQLLevel>
            <SMAQLStrict>${this.escapeXml(item.SMAQLStrict ?? 0)}</SMAQLStrict>
            <ReqSampleQty>${this.escapeXml(item.ReqSampleQty ?? 0)}</ReqSampleQty>
            <SMAQLPoint />
            <AQLAcValue>${this.escapeXml(item.AQLAcValue ?? 0)}</AQLAcValue>
            <AQLReValue>${this.escapeXml(item.AQLReValue ?? 0)}</AQLReValue>
            <QCSeq>${this.escapeXml(item.QCSeq ?? '')}</QCSeq>
            <ItemSeq>${this.escapeXml(item.ItemSeq ?? '')}</ItemSeq>
            <SourceSerl>${this.escapeXml(item.SourceSerl ?? '')}</SourceSerl>
            <SourceSeq>${this.escapeXml(item.SourceSeq ?? '')}</SourceSeq>
            <SourceType>${this.escapeXml(item.SourceType ?? 1)}</SourceType>
            <QCNo>${this.escapeXml(item.QCNo ?? '')}</QCNo>
            <IsReCfm>${this.escapeXml(item.IsReCfm ?? 0)}</IsReCfm>
            <BadSampleQty>${this.escapeXml(item.BadSampleQty ?? 0)}</BadSampleQty>
            <SMTestResult>${this.escapeXml(item.SMTestResult ?? 0)}</SMTestResult>
            <DisposeQty>${this.escapeXml(item.DisposeQty ?? 0)}</DisposeQty>
            <TestUsedTime>${this.escapeXml(item.TestUsedTime ?? 0)}</TestUsedTime>
            <PassedQty>${this.escapeXml(item.PassedQty ?? 0)}</PassedQty>
            <RejectQty>${this.escapeXml(item.RejectQty ?? 0)}</RejectQty>
            <Remark>${this.escapeXml(item.Remark ?? '')}</Remark>
            <Memo1>${this.escapeXml(item.Memo1 ?? '')}</Memo1>
            <Memo2>${this.escapeXml(item.Memo2 ?? '')}</Memo2>
            <ReqInQty>${this.escapeXml(item?.ReqInQty ?? 0)}</ReqInQty>
            <BadSampleRate>${this.escapeXml(item.BadSampleRate ?? 0)}</BadSampleRate>
            <SMRejectTransType>${this.escapeXml(item.SMRejectTransType ?? 0)}</SMRejectTransType>
            <FileSeq>${this.escapeXml(item.FileSeq ?? 0)}</FileSeq>
            <TestEndDateOld>${this.escapeXml(item.TestEndDateOld ?? 0)}</TestEndDateOld>
          </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
 
  async getInOutDailyBatch(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'A')}</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Selected>0</Selected>
            <Status>0</Status>
            <InOutSeq>${this.escapeXml(item.QCSeq ?? '')}</InOutSeq>
            <FactUnit>${this.escapeXml(item.FactUnit ?? '')}</FactUnit>
            <Remark>${this.escapeXml(item.Remark ?? '')}</Remark>
            <InOutType>${this.escapeXml(item.InOutType ?? 210)}</InOutType>
          </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  QcTestReportBatchFin(result: Array<{ [key: string]: any }>) {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO ?? 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <FactUnitName>${this.escapeXml(item.FactUnitName ?? '')}</FactUnitName>
            <FactUnit>${this.escapeXml(item.FactUnit ?? 0)}</FactUnit>
            <SourceTypeName>${this.escapeXml(item.SourceTypeName ?? '')}</SourceTypeName>
            <DeptName>${this.escapeXml(item.DeptName ?? '')}</DeptName>
            <WorkDate>${this.escapeXml(item.WorkDate ?? '')}</WorkDate>
            <DelvNo>${this.escapeXml(item.DelvNo ?? '')}</DelvNo>
            <ItemName>${this.escapeXml(item.ItemName ?? '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo ?? 0)}</ItemNo>
            <Spec>${this.escapeXml(item.Spec ?? '')}</Spec>
            <ProcName>${this.escapeXml(item.ProcName ?? '')}</ProcName>
            <QCNo xml:space="preserve">${this.escapeXml(item.QCNo ?? 0)}</QCNo>
            <TestEndDate>${this.escapeXml(item.TestEndDate ?? '')}</TestEndDate>
            <Qty>${this.escapeXml(item.Qty ?? 0)}</Qty>
            <ReqQty>${this.escapeXml(item.Qty ?? 0)}</ReqQty>
            <ReqInQty>${this.escapeXml(item.ReqQty ?? 0)}</ReqInQty>
            <OKQty>${this.escapeXml(item.OKQty ?? 0)}</OKQty>
            <RemainQty>${this.escapeXml(item.RemainQty ?? 0)}</RemainQty>
            <BadQty>${this.escapeXml(item.BadQty ?? 0)}</BadQty>
            <GoodInQty>${this.escapeXml(item.GoodInQty ?? 0)}</GoodInQty>
            <NotInQty>${this.escapeXml(item.NotInQty ?? 0)}</NotInQty>
            <LOTNo>${this.escapeXml(item.LOTNo ?? '')}</LOTNo>
            <FromSerial>${this.escapeXml(item.FromSerial ?? '')}</FromSerial>
            <ToSerial>${this.escapeXml(item.ToSerial ?? '')}</ToSerial>
            <DeptSeq>${this.escapeXml(item.DeptSeq ?? 0)}</DeptSeq>
            <ProcSeq>${this.escapeXml(item.ProcSeq ?? 0)}</ProcSeq>
            <SourceSeq>${this.escapeXml(item.SourceSeq ?? 0)}</SourceSeq>
            <SourceKind>${this.escapeXml(item.SourceKind ?? 0)}</SourceKind>
            <ItemSeq>${this.escapeXml(item.ItemSeq ?? 0)}</ItemSeq>
            <QCSeq>${this.escapeXml(item.QCSeq ?? 0)}</QCSeq>
            <SMTestResult>${this.escapeXml(item.SMTestResult ?? 0)}</SMTestResult>
            <EmpSeq>${this.escapeXml(item.EmpSeq ?? 0)}</EmpSeq>
            <EmpName>${this.escapeXml(item.EmpName ?? '')}</EmpName>
            <WorkCenterName>${this.escapeXml(item.WorkCenterName ?? '')}</WorkCenterName>
            <WorkCenterSeq>${this.escapeXml(item.WorkCenterSeq ?? 0)}</WorkCenterSeq>
            <IsGoodIn>${this.escapeXml(item.IsGoodIn ?? 0)}</IsGoodIn>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  async QcTestReportBatchFinSaveCheck(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'A')}</WorkingTag>
            <IDX_NO>${this.escapeXml(item.IDX_NO + 1 || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <FactUnit>${this.escapeXml(item.FactUnit ?? 0)}</FactUnit>
            <QCNo>${this.escapeXml(item.QCNo ?? '')}</QCNo>
            <ReqQty>${this.escapeXml(item.ReqQty ?? 0)}</ReqQty>
            <ReqInQty>${this.escapeXml(item.ReqInQty ?? 0)}</ReqInQty>
            <PassedQty>${this.escapeXml(item.OKQty ?? 0)}</PassedQty>
            <RejectQty>${this.escapeXml(item.BadQty ?? 0)}</RejectQty>
            <EmpName>${this.escapeXml(item.EmpName ?? 0)}</EmpName>
            <TestEndDate>${this.escapeXml(item.TestEndDate ?? 0)}</TestEndDate>
            <DeptSeq>${this.escapeXml(item.DeptSeq ?? 0)}</DeptSeq>
            <SourceSeq>${this.escapeXml(item.SourceSeq ?? 0)}</SourceSeq>
            <SourceType>${this.escapeXml(item.SourceType ?? 3)}</SourceType>
            <ItemSeq>${this.escapeXml(item.ItemSeq ?? 0)}</ItemSeq>
            <QCSeq>${this.escapeXml(item.QCSeq ?? 0)}</QCSeq>
            <SMTestResult>${this.escapeXml(item.SMTestResult ?? 0)}</SMTestResult>
            <EmpSeq>${this.escapeXml(item.EmpSeq ?? 0)}</EmpSeq>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async QcTestReportBatchFinSave(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
            <DataBlock1>
              <WorkingTag>${this.escapeXml(item.WorkingTag ?? 'A')}</WorkingTag>
              <IDX_NO>${this.escapeXml(item.IDX_NO  ?? 1)}</IDX_NO>
              <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
              <Selected>1</Selected>
              <Status>0</Status>
              <QCSeq>${this.escapeXml(item.QCSeq ?? 1)}</QCSeq>
              <QCNo>${this.escapeXml(item.QCNo ?? 1)}</QCNo>
              <FactUnit>${this.escapeXml(item.FactUnit ?? 1)}</FactUnit>
              <SourceType>${this.escapeXml(item.SourceType ?? 1)}</SourceType>
              <SourceSeq>${this.escapeXml(item.SourceSeq ?? 1)}</SourceSeq>
              <SourceSerl>${this.escapeXml(item.SourceSerl ?? 1)}</SourceSerl>
              <ItemSeq>${this.escapeXml(item.ItemSeq ?? 1)}</ItemSeq>
              <ReqQty>${this.escapeXml(item.ReqQty ?? 0)}</ReqQty>
              <TestEndDate>${this.escapeXml(item.TestEndDate ?? '')}</TestEndDate>
              <SMTestResult>${this.escapeXml(item.SMTestResult ?? 0)}</SMTestResult>
              <PassedQty>${this.escapeXml(item.PassedQty ?? 0)}</PassedQty>
              <RejectQty>${this.escapeXml(item.RejectQty ?? 0)}</RejectQty>
              <ReqInQty>${this.escapeXml(item.ReqInQty ?? 0)}</ReqInQty>
              <EmpSeq>${this.escapeXml(item.EmpSeq ?? 0)}</EmpSeq>
              <EmpName>${this.escapeXml(item.EmpName ?? '')}</EmpName>
              <DeptSeq>${this.escapeXml(item.DeptSeq ?? 0)}</DeptSeq>
            </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  searchFinResultList(result: Array<{ [key: string]: any }>) {
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
            <IsChangedMst>1</IsChangedMst>
            <SourceType>${this.escapeXml(item.SourceType ?? 3)}</SourceType>
            <FactUnit>${this.escapeXml(item.FactUnit ?? 0)}</FactUnit>
            <TestEndDateFrom>${this.escapeXml(item.TestEndDateFrom ?? '')}</TestEndDateFrom>
            <TestEndDateTo>${this.escapeXml(item.TestEndDateTo ?? '')}</TestEndDateTo>
            <DeptSeq>${this.escapeXml(item.DeptSeq ?? '')}</DeptSeq>
            <DelvNo>${this.escapeXml(item.DelvNo ?? '')}</DelvNo>
            <ItemName>${this.escapeXml(item.ItemName ?? '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo ?? '')}</ItemNo>
            <Spec>${this.escapeXml(item.Spec ?? '')}</Spec>
            <ProcName>${this.escapeXml(item.ProcName ?? '')}</ProcName>
            <QCNo>${this.escapeXml(item.QCNo ?? '')}</QCNo>
            <SMQcType>${this.escapeXml(item.SMQcType ?? 0)}</SMQcType>
            <SMQcTypeName>${this.escapeXml(item.SMQcTypeName ?? '')}</SMQcTypeName>
            <WorkCenterSeq>${this.escapeXml(item.WorkCenterSeq ?? 0)}</WorkCenterSeq>
            <WorkType>${this.escapeXml(item.WorkType ?? 0)}</WorkType>
            <LotNo>${this.escapeXml(item.LotNo ?? '')}</LotNo>
            <EmpSeq>${this.escapeXml(item.EmpSeq ?? '')}</EmpSeq>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  searchQcFinalBadQtyResultList(result: Array<{ [key: string]: any }>) {
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
            <IsChangedMst>1</IsChangedMst>
            <FactUnit>${this.escapeXml(item.FactUnit ?? '')}</FactUnit>
            <QCDate>${this.escapeXml(item.QCDate ?? '')}</QCDate>
            <QCDateTo>${this.escapeXml(item.QCDateTo ?? '')}</QCDateTo>
            <WorkOrderNo>${this.escapeXml(item.WorkOrderNo ?? '')}</WorkOrderNo>
            <QCNo>${this.escapeXml(item.QCNo ?? '')}</QCNo>
            <GoodItemName>${this.escapeXml(item.GoodItemName ?? '')}</GoodItemName>
            <GoodItemNo>${this.escapeXml(item.GoodItemNo ?? '')}</GoodItemNo>
            <GoodItemSpec>${this.escapeXml(item.GoodItemSpec ?? '')}</GoodItemSpec>
            <ProgStatus>${this.escapeXml(item.ProgStatus ?? '')}</ProgStatus>
            <WorkCenterSeq>${this.escapeXml(item.WorkCenterSeq ?? '')}</WorkCenterSeq>
            <WorkCenterName>${this.escapeXml(item.WorkCenterName ?? '')}</WorkCenterName>
            <UMItemClassL>${this.escapeXml(item.UMItemClassL ?? '')}</UMItemClassL>
            <UMItemClassM>${this.escapeXml(item.UMItemClassM ?? '')}</UMItemClassM>
            <UMItemClassS>${this.escapeXml(item.UMItemClassS ?? '')}</UMItemClassS>
            <RealLotNo>${this.escapeXml(item.RealLotNo ?? '')}</RealLotNo>
            <DeptName>${this.escapeXml(item.DeptName ?? '')}</DeptName>
          </DataBlock1>

          `,
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

}
