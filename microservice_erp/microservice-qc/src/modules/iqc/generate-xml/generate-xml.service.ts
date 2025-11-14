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



  async searchBy(result: Array<{ [key: string]: any }>): Promise<string> {
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
            <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
            <BLDateFr>${this.escapeXml(item.BLDateFr || '')}</BLDateFr>
            <BLDateTo>${this.escapeXml(item.BLDateTo || '')}</BLDateTo>
            <QCDateFrom>${this.escapeXml(item.QCDateFrom || '')}</QCDateFrom>
            <QCDateTo>${this.escapeXml(item.QCDateTo || '')}</QCDateTo>
            <DelvDateFr>${this.escapeXml(item.DelvDateFr || '')}</DelvDateFr>
            <DelvDateTo>${this.escapeXml(item.DelvDateTo || '')}</DelvDateTo>
            <QcNo>${this.escapeXml(item.QcNo || '')}</QcNo>
            <SMQcType>${this.escapeXml(item.SMQcType || '')}</SMQcType>
            <BLRefNo>${this.escapeXml(item.BLRefNo || '')}</BLRefNo>
            <BLNo>${this.escapeXml(item.BLNo || '')}</BLNo>
            <CustSeq>${this.escapeXml(item.CustSeq || '')}</CustSeq>
            <DeptSeq>${this.escapeXml(item.DeptSeq || '')}</DeptSeq>
            <EmpSeq>${this.escapeXml(item.EmpSeq || '')}</EmpSeq>
            <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <AssetSeq>${this.escapeXml(item.AssetSeq || '')}</AssetSeq>
            <ItemClassLSeq>${this.escapeXml(item.ItemClassLSeq || '')}</ItemClassLSeq>
            <ItemClassMSeq />
            <ItemClassSSeq />
            <PJTName>${this.escapeXml(item.PJTName || '')}</PJTName>
            <PJTNo>${this.escapeXml(item.PJTNo || '')}</PJTNo>
          </DataBlock1>

          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  

  async getById(result: Array<{ [key: string]: any }>): Promise<string> {
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
            <ReqQty>${this.escapeXml(item.ReqQty || 0)}</ReqQty>
            <QCSeq>${this.escapeXml(item.QCSeq || 0)}</QCSeq>
            <ItemSeq>${this.escapeXml(item.ItemSeq || 0)}</ItemSeq>
            <ProcSeq>${this.escapeXml(item.ProcSeq || 0)}</ProcSeq>
            <SourceType>${this.escapeXml(item.SourceType || 10)}</SourceType>
          </DataBlock1>

          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  async getQcListItemBy(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <QCSeq>${item.QCSeq}</QCSeq>
            <ItemSeq>${item.ItemSeq}</ItemSeq>
            <ProcSeq>0</ProcSeq>
            <CustSeq>0</CustSeq>
            <SourceSeq>${item.SourceSeq}</SourceSeq>
            <SourceType>${item.SourceType}</SourceType>
          </DataBlock1>

          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async getQcTestReportResult(QCSeq: number): Promise<string> {
    const xmlBlocks = 
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <QCSeq>${QCSeq}</QCSeq>
          </DataBlock1>
          `;

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
    const xmlBlocks = 
          `
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

  async saveQcTestFile(result: Array<{ [key: string]: any }>, resultCheck: any []): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            
          </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  

  async saveQcTestReportItemSave(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock3>
            <WorkingTag>${item?.WorkingTag || 'A'}</WorkingTag>
            <IDX_NO>${index + 1}</IDX_NO>
            <DataSeq>${index + 1}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <SampleNo>${item?.SampleNo}</SampleNo>
            <UMQCTitleName>${item?.UMQCTitleName}</UMQCTitleName>
            <TestingCondition />
            <LowerLimit>${item?.LowerLimit}</LowerLimit>
            <UpperLimit>${item?.UpperLimit}</UpperLimit>
            <SMInputTypeName>${item?.SMInputTypeName}</SMInputTypeName>
            <UMQCTitleSeq>${item?.UMQcTitleSeq || item?.UMQCTitleSeq }</UMQCTitleSeq>
            <QCSeq>${item?.QCSeq}</QCSeq>
            <TestValue>${item?.TestValue}</TestValue>
            <QCTitleBadQty>${item?.QCTitleBadQty}</QCTitleBadQty>
            <SMTestResult>${item?.SMTestResultName || ''}</SMTestResult>
            <BadReasonName>${item?.BadReasonName || ''}</BadReasonName>
            <BadReason>${item?.BadReason || ''}</BadReason>
            <SampleSeq>${item?.SampleSeq || ''}</SampleSeq>
            <TABLE_NAME>DataBlock3</TABLE_NAME>
          </DataBlock3>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async getQcListTestBatch(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <BizUnitName>${this.escapeXml(item.BizUnitName || '')}</BizUnitName>
            <BizUnit>${this.escapeXml(item.BizUnit || '')}</BizUnit>
            <SourceTypeName>${this.escapeXml(item.SourceTypeName || '')}</SourceTypeName>
            <CustName>${this.escapeXml(item.CustName || '')}</CustName>
            <DelvNo>${this.escapeXml(item.BLNo || '')}</DelvNo>
            <DeptName>${this.escapeXml(item.DeptName || '')}</DeptName>
            <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
            <SMTestResult>${this.escapeXml(item.SMTestResult || 0)}</SMTestResult>
            <SMTestResultName>${this.escapeXml(item.SMTestResultName || '')}</SMTestResultName>
            
            <ItemName>${this.escapeXml(item.ItemName || '')}</ItemName>
            <ItemNo>${this.escapeXml(item.ItemNo || '')}</ItemNo>
            <Spec>${this.escapeXml(item.Spec || '')}</Spec>
            <UnitName>${this.escapeXml(item.UnitName || '')}</UnitName>
            <Qty>${this.escapeXml(item.Qty || 0)}</Qty>
            <QCNo>${this.escapeXml(item.QCNo || '')}</QCNo>
            <QCDate>${this.escapeXml(item.QCDate || '')}</QCDate>
            <QCEmpName>${this.escapeXml(item.QCEmpName || '')}</QCEmpName>
            <QCEmpSeq>${this.escapeXml(item.QCEmpSeq || 0)}</QCEmpSeq>
            <OkQty>${this.escapeXml(item.OkQty || 0)}</OkQty>
            <BadQty>${this.escapeXml(item.BadQty || 0)}</BadQty>
           
            <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
            <SourceSeq>${this.escapeXml(item.SourceSeq || '')}</SourceSeq>
            <SourceSerl>${this.escapeXml(item.SourceSerl || '')}</SourceSerl>
            <SourceType>${this.escapeXml(item.SourceType || '')}</SourceType>
            <QCSeq>${this.escapeXml(item.QCSeq || '')}</QCSeq>
           
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <DelvDate>${this.escapeXml(item.DelvDate || '')}</DelvDate>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>

          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async getQcListTestReportCheck(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${item?.QCSeq === 0 ? 'A': 'U'}</WorkingTag>
            <IDX_NO>${this.escapeXml(index + 1 || 1)}</IDX_NO>
            <DataSeq>${this.escapeXml(index + 1 || 1)}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <EmpName>${this.escapeXml(item.EmpName || '')}</EmpName>
            <ReqQty>${this.escapeXml(item?.ReqQty || 0)}</ReqQty>
            <ReqInQty>${this.escapeXml(item?.Qty || 0)}</ReqInQty>
            <PassedQty>${this.escapeXml(item.OkQty || 0)}</PassedQty>
            <RejectQty>${this.escapeXml(item.BadQty || 0)}</RejectQty>
            <TestEndDate>${this.escapeXml(item.QCDate || '')}</TestEndDate>
            <Remark>${this.escapeXml(item.Remark || '')}</Remark>
            <ItemSeq>${this.escapeXml(item.ItemSeq || '')}</ItemSeq>
            <SourceSeq>${this.escapeXml(item.SourceSeq || '')}</SourceSeq>
            <SourceSerl>${this.escapeXml(item.SourceSerl || '')}</SourceSerl>
            <SourceType>${this.escapeXml(item.SourceType || '')}</SourceType>
            <QCSeq>${this.escapeXml(item.QCSeq || 0)}</QCSeq>
            <EmpSeq>${this.escapeXml(item.QCEmpSeq || 0)}</EmpSeq>
            <SMTestResult>${this.escapeXml(item.SMTestResult || '')}</SMTestResult>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>

          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async saveQcListTestReport(resultCheck : any[], result : any[]): Promise<string> {
    const xmlBlocks = resultCheck
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>${this.escapeXml(item?.WorkingTag)}</WorkingTag>
            <IDX_NO>${this.escapeXml(item?.IDX_NO)}</IDX_NO>
            <DataSeq>${this.escapeXml(item?.DataSeq)}</DataSeq>
            <Selected>${this.escapeXml(item?.Selected)}</Selected>
            <Status>${this.escapeXml(item?.Status)}</Status>
            <QCSeq>${this.escapeXml(item?.QCSeq)}</QCSeq>
            <QCNo>${this.escapeXml(item?.QCNo)}</QCNo>
            <SourceType>${this.escapeXml(item?.SourceType)}</SourceType>
            <SourceSeq>${this.escapeXml(item?.SourceSeq)}</SourceSeq>
            <SourceSerl>${this.escapeXml(item?.SourceSerl)}</SourceSerl>
            <ItemSeq>${this.escapeXml(item?.ItemSeq)}</ItemSeq>
            <ReqQty>${this.escapeXml(item?.ReqQty)}</ReqQty>
            <TestEndDate>${this.escapeXml(item?.TestEndDate)}</TestEndDate>
            <SMTestResult>${this.escapeXml(item?.SMTestResult)}</SMTestResult>
            <PassedQty>${this.escapeXml(item?.PassedQty)}</PassedQty>
            <RejectQty>${this.escapeXml(result[index]?.BadQty)}</RejectQty>
            <ReqInQty>${this.escapeXml(item?.ReqInQty)}</ReqInQty>
            <Remark>${this.escapeXml(item?.Remark)}</Remark>
            <EmpSeq>${this.escapeXml(result[index]?.QCEmpSeq)}</EmpSeq>
            <EmpName>${this.escapeXml(item?.EmpName)}</EmpName>
          </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async getInOutDailyBatch(QCSeq : any): Promise<string> {
    const xmlBlocks =  
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <DataSeq>1</DataSeq>
            <Selected>0</Selected>
            <Status>0</Status>
            <InOutSeq>${QCSeq}</InOutSeq>
            <Remark></Remark>
            <InOutType>210</InOutType>
          </DataBlock1>
          ` ;

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async QcTestReportSampleReq(result: Array<{ [key: string]: any }>): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <DataBlock1>
            <WorkingTag>U</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <RealSampleQty>${item.RealSampleQty}</RealSampleQty>
            <SampleNo>${item.SampleNo}</SampleNo>
            <QCSeq>${item.QCSeq}</QCSeq>
            <ItemSeq>${item.ItemSeq}</ItemSeq>
            <ProcSeq>0</ProcSeq>
            <CustSeq>0</CustSeq>
            <SourceType>${item.SourceType}</SourceType>
          </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async QcTestFileSave(result: Array<{ [key: string]: any }>, fileSeq: any, UserId: any, EmpSeq: any, resultFileQc: any): Promise<string> {
    const xmlBlocks = result
      .map(
        (item, index) =>
          `
          <_AttachFileMaster>      
            <AttachFileConstSeq>${resultFileQc.AttachFileConstSeq}</AttachFileConstSeq>      
            <AttachFileSeq>${fileSeq}</AttachFileSeq>      
            <LoginPgmSeq>2209925</LoginPgmSeq>      
            <RootPath>${resultFileQc.RootPath}</RootPath>      
            <ServerAddr>${resultFileQc.ServerAddr}</ServerAddr>      
            <UserSeq>${EmpSeq}</UserSeq>      
            <PcName>${UserId}</PcName>      
            <ServerType>${resultFileQc.ServerType}</ServerType>      
            <Guid>${resultFileQc.Guid}</Guid>      
            <AccountName />      
            <AccountKey />      
            <HostIp>192.168.116.1</HostIp>   
          </_AttachFileMaster>    

          <_AttachFileData>      
            <IDX_NO>0</IDX_NO>      
            <WorkingTag>A</WorkingTag>      
            <AttachFileNo>${item?.IdxNo +  1 || 0}</AttachFileNo>      
            <IsRepFile>1</IsRepFile>      
            <FilePath>${item.Path}</FilePath>      
            <FileName>${item.Filename}</FileName>      
            <FileExt>${item?.FileExt || 'xsls'}</FileExt>      
            <FileSize>${item.Size}</FileSize>      
            <RealFilePath>${item.Path}</RealFilePath>      
            <RealFileName>${item.Filename}</RealFileName>      
            <Remark />
            <Request>UP</Request>      
            <Result>OK</Result>    
          </_AttachFileData>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async QcCheckStatusList(result: Array<{ [key: string]: any }>,){
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
            <BizUnit>${item.BizUnit}</BizUnit>
            <TestEndDateFrom>${item.TestEndDateFrom}</TestEndDateFrom>
            <TestEndDateTo>${item.TestEndDateTo}</TestEndDateTo>
            <BLDateFr>${item.BLDateFr}</BLDateFr>
            <BLDateTo>${item.BLDateTo}</BLDateTo>
            <EmpSeq>${item.EmpSeq}</EmpSeq>
            <ItemName>${item.ItemName}</ItemName>
            <ItemNo>${item.ItemNo}</ItemNo>
            <Spec>${item.Spec}</Spec>
            <CustSeq>${item.CustSeq}</CustSeq>
            <QCNo>${item.QCNo}</QCNo>
            <BLRefNo>${item.BLRefNo}</BLRefNo>
            <SMQcType>${item.SMQcType}</SMQcType>
            <DelvDateFr>${item.DelvDateFr}</DelvDateFr>
            <DelvDateTo>${item.DelvDateTo}</DelvDateTo>
            <LotNo>${item.LotNo}</LotNo>
            <ItemClassLSeq>${item.ItemClassLSeq}</ItemClassLSeq>
            <ItemClassMSeq>${item.ItemClassMSeq}</ItemClassMSeq>
            <ItemClassSSeq>${item.ItemClassSSeq}</ItemClassSSeq>
          </DataBlock1>
          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async checkDeleteQcImportTestReport(result: Array<{ [key: string]: any }>): Promise<string> {
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
            <ReqQty>${this.escapeXml(item.ReqQty || '')}</ReqQty>
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
            <SourceType>${this.escapeXml(item.SourceType || 1)}</SourceType>
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
            <ReqInQty>${this.escapeXml(item.ReqInQty || '')}</ReqInQty>
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

}
