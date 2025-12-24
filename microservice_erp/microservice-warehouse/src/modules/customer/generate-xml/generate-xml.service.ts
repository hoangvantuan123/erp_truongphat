import { Injectable } from '@nestjs/common';
import { retry } from 'rxjs';
import { workerData } from 'worker_threads';

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
      const v = value.trim().toLowerCase();
      return v === '1' || v === 'true' ? 1 : 0;
    }

    return 0;
  }


  private safeValue(value: any): string {
    return this.escapeXml(value ?? '');
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
                      <IsChangedMst>0</IsChangedMst>
                      <CustName>${this.escapeXml(item.CustName || '')}</CustName>
                      <CustNo>${this.escapeXml(item.CustNo || '')}</CustNo>
                      <BizNo>${this.escapeXml(item.BizNo || '')}</BizNo>
                      <MinorBizNo>${this.escapeXml(item.MinorBizNo || '')}</MinorBizNo>
                      <SMCustStatus>${this.escapeXml(item.SMCustStatus || '')}</SMCustStatus>
                      <UMCustKind>${this.escapeXml(item.UMCustKind || '')}</UMCustKind>
                      <Owner>${this.escapeXml(item.Owner || '')}</Owner>
                      <ChannelSeq>${this.escapeXml(item.ChannelSeq || 0)}</ChannelSeq>
                      <Email>${this.escapeXml(item.Email || '')}</Email>
                      <PersonId2>${this.escapeXml(item.PersonId2 || '')}</PersonId2>
                    </DataBlock1>

          `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  //WH Register



  async generateXMLCustCheck(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): Promise<string> {
    const xmlBlocks = result.map((item, index) => {
      return `
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>1</IDX_NO>
                <DataSeq>1</DataSeq>
                <Status>0</Status>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[0].Sel)}</Sel>
                <UMCustKindName>Điểm giao dịch doanh số trong nước</UMCustKindName>
                <UMCustKind>1004001</UMCustKind>
                <TABLE_NAME>DataBlock2</TABLE_NAME>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>2</IDX_NO>
                <DataSeq>2</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[1].Sel)}</Sel>
                <UMCustKindName>Điểm giao dịch doanh số xuất khẩu (doanh nghiệp nước ngoài)</UMCustKindName>
                <UMCustKind>1004002</UMCustKind>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>3</IDX_NO>
                <DataSeq>3</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[2].Sel)}</Sel>
                <UMCustKindName>Điểm giao dịch nhập mua trong nước</UMCustKindName>
                <UMCustKind>1004003</UMCustKind>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>4</IDX_NO>
                <DataSeq>4</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[3].Sel)}</Sel>
                <UMCustKindName>Điểm giao dịch nhập khẩu (doanh nghiệp nước ngoài)</UMCustKindName>
                <UMCustKind>1004004</UMCustKind>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>5</IDX_NO>
                <DataSeq>5</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[4].Sel)}</Sel>
                <UMCustKindName>Nơi giao dịch xuất khẩu tại địa phương(Công ty)</UMCustKindName>
                <UMCustKind>1004010</UMCustKind>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>6</IDX_NO>
                <DataSeq>6</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[5].Sel)}</Sel>
                <UMCustKindName>Nơi giao dịch nhập khẩu tại địa phương(Công ty)</UMCustKindName>
                <UMCustKind>1004011</UMCustKind>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>7</IDX_NO>
                <DataSeq>7</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[6].Sel)}</Sel>
                <UMCustKindName>Khách hàng dịch vụ</UMCustKindName>
                <UMCustKind>1004016</UMCustKind>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>8</IDX_NO>
                <DataSeq>8</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[7].Sel)}</Sel>
                <UMCustKindName>Doanh nghiệp phát hành hóa đơn thuế VAT điện tử</UMCustKindName>
                <UMCustKind>1004017</UMCustKind>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>9</IDX_NO>
                <DataSeq>9</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[8].Sel)}</Sel>
                <UMCustKindName>The retailer has no business code</UMCustKindName>
                <UMCustKind>1004018</UMCustKind>
            </DataBlock2>
            <DataBlock2>
                <WorkingTag />
                <IDX_NO>10</IDX_NO>
                <DataSeq>10</DataSeq>
                <Status>0</Status>
                <Selected>0</Selected>
                <Sel>${this.convertToNumber(item?.dataCustKind?.[9].Sel)}</Sel>
                <UMCustKindName>Khách hàng gia công ngoài</UMCustKindName>
                <UMCustKind>1004019</UMCustKind>
            </DataBlock2>
            <DataBlock1>
                <WorkingTag>${WorkingTag}</WorkingTag>
                <IDX_NO>1</IDX_NO>
                <Status>0</Status>
                <DataSeq>1</DataSeq>
                <Selected>1</Selected>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
                <IsChangedMst>${this.escapeXml(item.IsChangedMst || '')}</IsChangedMst>
                <CustSeq>${this.escapeXml(item.CustSeq + index || 0)}</CustSeq>
                <TrunName>${this.escapeXml(item.TrunName || '')}</TrunName>
                <FullName>${this.escapeXml(item.FullName || '')}</FullName>
                <SMCustStatus>0</SMCustStatus>
                <SMCustStatusName>${this.escapeXml(item.SMCustStatusName || '')}</SMCustStatusName>
                <UMCredLevel>${this.escapeXml(item.UMCredLevel || '')}</UMCredLevel>
                <UMCredLevelName>${this.escapeXml(item.UMCredLevelName || '')}</UMCredLevelName>
                <CustName>${this.escapeXml(item.CustName || '')}</CustName>
                <CustNo>${this.escapeXml(item.CustNo || '')}</CustNo>
                <SMDomFor>${this.escapeXml(item.SMDomFor || '')}</SMDomFor>
                <SMDomForName>${this.escapeXml(item.SMDomForName || '')}</SMDomForName>
                <UMCountrySeq>${this.escapeXml(item.UMCountrySeq || '')}</UMCountrySeq>
                <UMCountryName>${this.escapeXml(item.UMCountryName || '')}</UMCountryName>
                <FrDate>${this.escapeXml(item.FrDate || '')}</FrDate>
                <BizNo>${this.escapeXml(item.BizNo || '')}</BizNo>
                <LawRegNo>${this.escapeXml(item.LawRegNo || '')}</LawRegNo>
                <Owner>${this.escapeXml(item.Owner || '')}</Owner>
                <TelNo>${this.escapeXml(item.TelNo || '')}</TelNo>
                <PersonId>${this.escapeXml(item.PersonId || '')}</PersonId>
                <BizType>${this.escapeXml(item.BizType || '')}</BizType>
                <BizKind>${this.escapeXml(item.BizKind || '')}</BizKind>
                <BizAddr>${this.escapeXml(item.BizAddr || '')}</BizAddr>
                <SMBizPers>${this.escapeXml(item.SMBizPers || '')}</SMBizPers>
                <SMBizPersName>${this.escapeXml(item.SMBizPersName || '')}</SMBizPersName>
                <IsBizNoNon>${this.escapeXml(item.IsBizNoNon || '')}</IsBizNoNon>
                <IsRegNoNon>${this.escapeXml(item.IsRegNoNon || '')}</IsRegNoNon>
                <MinorBizNo>${this.escapeXml(item.MinorBizNo || '')}</MinorBizNo>
            </DataBlock1>
      `;
    }).join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustAddCheck(custCheck: any[], workingTag: any): Promise<string> {

    const custSeq = parseInt(custCheck[0]?.CustSeq, 10) || 0;
    const xmlBlocks = custCheck.map((item, index) => {

      return `
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <Status>0</Status>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
        <TABLE_NAME>DataBlock1</TABLE_NAME>
        <IsChangedMst>0</IsChangedMst>
        <MinorBizNo>${this.escapeXml(item?.MinorBizNo || '')}</MinorBizNo>
        <EngCustName>${this.escapeXml(item?.EngCustName || '')}</EngCustName>
        <EngCustSName>${this.escapeXml(item?.EngCustSName || '')}</EngCustSName>
        <Tel2>${this.escapeXml(item?.Tel2 || '')}</Tel2>
        <CustSName1>${this.escapeXml(item?.CustName || '')}</CustSName1>
        <CustSName2>${this.escapeXml(item?.FullName || '')}</CustSName2>
        <FAX>${this.escapeXml(item?.FAX || '')}</FAX>
        <Email>${this.escapeXml(item?.Email || '')}</Email>
        <HomePage>${this.escapeXml(item?.HomePage || '')}</HomePage>
        <CustShip>${this.escapeXml(item?.CustShip || '')}</CustShip>
        <IsStdReceiptUse>${this.escapeXml(item?.IsStdReceiptUse || 0)}</IsStdReceiptUse>
        <IsStdPayUse>${this.escapeXml(item?.IsStdPayUse || '')}</IsStdPayUse>
        <IsSpecifiedForm>${this.escapeXml(item?.IsSpecifiedForm || 0)}</IsSpecifiedForm>
        <IsOverShipPermit>${this.escapeXml(item?.IsOverShipPermit || 0)}</IsOverShipPermit>
        <IsWayBillAsk>${this.escapeXml(item?.IsWayBillAsk || 0)}</IsWayBillAsk>
        <IsPurchaseAfterSales>${this.escapeXml(item?.IsPurchaseAfterSales || 0)}</IsPurchaseAfterSales>
        <IsTaxInvoice>${this.escapeXml(item?.IsTaxInvoice || 0)}</IsTaxInvoice>
        <ShipLeadTime>${this.escapeXml(item?.ShipLeadTime || 0)}</ShipLeadTime>
        <EntryUniqueNo>${this.escapeXml(item?.EntryUniqueNo || '')}</EntryUniqueNo>
        <CurrSeq>${this.escapeXml(item?.CurrSeq || '')}</CurrSeq>
        <CurrName>${this.escapeXml(item?.CurrName || '')}</CurrName>
        <TransOpenDate>${this.escapeXml(item?.TransOpenDate || '')}</TransOpenDate>
        <TransCloseDate>${this.escapeXml(item?.TransCloseDate || '')}</TransCloseDate>
        <ZipNo>${this.escapeXml(item?.ZipNo || '')}</ZipNo>
        <Addr>${this.escapeXml(item?.Addr || '')}</Addr>
        <EngAddr1>${this.escapeXml(item?.EngAddr1 || '')}</EngAddr1>
        <KorAddr2>${this.escapeXml(item?.KorAddr2 || '')}</KorAddr2>
        <EngAddr2>${this.escapeXml(item?.EngAddr2 || '')}</EngAddr2>
        <KorAddr3>${this.escapeXml(item?.KorAddr3 || '')}</KorAddr3>
        <EngAddr3>${this.escapeXml(item?.EngAddr3 || '')}</EngAddr3>
        <CustSeq>${custSeq + index}</CustSeq>
      </DataBlock1>
      `
    }).join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustClassCheck(result: any[], dto: Array<{ [key: string]: any }>, workingTag: any): Promise<string> {

    const xmlBlocks = dto.map((item, index) => {
      return `
      <DataBlock2>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <Status>0</Status>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
        <TABLE_NAME>DataBlock2</TABLE_NAME>
        <IsChangedMst>1</IsChangedMst>
        <UMChannel>${this.escapeXml(item.UMChannel || '')}</UMChannel>
        <UMChannelName>${this.escapeXml(item.UMChannelName || '')}</UMChannelName>
        <CustSeq>${this.escapeXml(result[index].CustSeq || '')}</CustSeq>
      </DataBlock2>
      `
        ;
    })

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustUserDefineCheck(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    const xmlBlocks = result.map((item, index) => {
      return `
        <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <DataSeq>1</DataSeq>
        <Status>0</Status>
        <Selected>1</Selected>
        <MngSerl>1000001</MngSerl>
        <MngName>Số tài khoản ngân hàng/ Bank Number</MngName>
        <MngValName>${this.escapeXml(item.BankNumber || '')}</MngValName>
        <MngValSeq>0</MngValSeq>
        <CodeHelpParams>200</CodeHelpParams>
        <Mask />
        <SMInputType>1027001</SMInputType>
        <CodeHelpSeq>0</CodeHelpSeq>
        <IsNON>0</IsNON>
        <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        <TABLE_NAME>DataBlock1</TABLE_NAME>
      </DataBlock1>
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>2</IDX_NO>
        <DataSeq>2</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <MngSerl>1000002</MngSerl>
        <MngName>Tên chủ số tài khoản/ Bank Account Name</MngName>
        <MngValName>${this.escapeXml(item.BankAccName || '')}</MngValName>
        <MngValSeq>0</MngValSeq>
        <CodeHelpParams>200</CodeHelpParams>
        <Mask />
        <SMInputType>1027001</SMInputType>
        <CodeHelpSeq>0</CodeHelpSeq>
        <IsNON>0</IsNON>
        <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
      </DataBlock1>
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>3</IDX_NO>
        <DataSeq>3</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <MngSerl>1000003</MngSerl>
        <MngName>Tên ngân hàng/ Bank Name</MngName>
        <MngValName>${this.escapeXml(item.BankName || '')}</MngValName>
        <MngValSeq>0</MngValSeq>
        <CodeHelpParams>200</CodeHelpParams>
        <Mask />
        <SMInputType>1027001</SMInputType>
        <CodeHelpSeq>0</CodeHelpSeq>
        <IsNON>0</IsNON>
        <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
      </DataBlock1>
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>4</IDX_NO>
        <DataSeq>4</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <MngSerl>1000004</MngSerl>
        <MngName>거래처 Abbr name (역어) - Tên viết tắt của NCC</MngName>
        <MngValName>${this.escapeXml(item.CustAbbrName || '')}</MngValName>
        <MngValSeq>0</MngValSeq>
        <CodeHelpParams>200</CodeHelpParams>
        <Mask />
        <SMInputType>1027001</SMInputType>
        <CodeHelpSeq>0</CodeHelpSeq>
        <IsNON>0</IsNON>
        <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
      </DataBlock1>
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>5</IDX_NO>
        <DataSeq>5</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <MngSerl>1000005</MngSerl>
        <MngName>대표 연락처 - Số điện thoại công ty</MngName>
        <MngValName>${this.escapeXml(item.CustPhone || '')}</MngValName>
        <MngValSeq>0</MngValSeq>
        <CodeHelpParams>200</CodeHelpParams>
        <Mask />
        <SMInputType>1027001</SMInputType>
        <CodeHelpSeq>0</CodeHelpSeq>
        <IsNON>0</IsNON>
        <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
      </DataBlock1>
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>6</IDX_NO>
        <DataSeq>6</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <MngSerl>1000006</MngSerl>
        <MngName>영업 덤당 연락처 - Số điện thoại phụ trách bán hàng</MngName>
        <MngValName>${this.escapeXml(item.CustPhone2 || '')}</MngValName>
        <MngValSeq>0</MngValSeq>
        <CodeHelpParams>200</CodeHelpParams>
        <Mask />
        <SMInputType>1027001</SMInputType>
        <CodeHelpSeq>0</CodeHelpSeq>
        <IsNON>0</IsNON>
        <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
      </DataBlock1>
      `;
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustKindSave(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    const xmlBlocks = result.map((item, index) => {
      return `
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>1</IDX_NO>
          <DataSeq>1</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[0].Sel))}</Sel>
          <UMCustKindName>Điểm giao dịch doanh số trong nước</UMCustKindName>
          <UMCustKind>1004001</UMCustKind>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>2</IDX_NO>
          <DataSeq>2</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[1].Sel))}</Sel>
          <UMCustKindName>Điểm giao dịch doanh số xuất khẩu (doanh nghiệp nước ngoài)</UMCustKindName>
          <UMCustKind>1004002</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>3</IDX_NO>
          <DataSeq>3</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[2].Sel))}</Sel>
          <UMCustKindName>Điểm giao dịch nhập mua trong nước</UMCustKindName>
          <UMCustKind>1004003</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>4</IDX_NO>
          <DataSeq>4</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[3].Sel))}</Sel>
          <UMCustKindName>Điểm giao dịch nhập khẩu (doanh nghiệp nước ngoài)</UMCustKindName>
          <UMCustKind>1004004</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>5</IDX_NO>
          <DataSeq>5</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[4].Sel))}</Sel>
          <UMCustKindName>Nơi giao dịch xuất khẩu tại địa phương(Công ty)</UMCustKindName>
          <UMCustKind>1004010</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>6</IDX_NO>
          <DataSeq>6</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[5].Sel))}</Sel>
          <UMCustKindName>Nơi giao dịch nhập khẩu tại địa phương(Công ty)</UMCustKindName>
          <UMCustKind>1004011</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>7</IDX_NO>
          <DataSeq>7</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[6].Sel))}</Sel>
          <UMCustKindName>Khách hàng dịch vụ</UMCustKindName>
          <UMCustKind>1004016</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>8</IDX_NO>
          <DataSeq>8</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[7].Sel))}</Sel>
          <UMCustKindName>Doanh nghiệp phát hành hóa đơn thuế VAT điện tử</UMCustKindName>
          <UMCustKind>1004017</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>9</IDX_NO>
          <DataSeq>9</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[8].Sel))}</Sel>
          <UMCustKindName>The retailer has no business code</UMCustKindName>
          <UMCustKind>1004018</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
        <DataBlock1>
          <WorkingTag />
          <IDX_NO>10</IDX_NO>
          <DataSeq>10</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <Sel>${this.escapeXml(this.convertToNumber(item?.dataCustKind?.[9].Sel))}</Sel>
          <UMCustKindName>Khách hàng gia công ngoài</UMCustKindName>
          <UMCustKind>1004019</UMCustKind>
          <CustSeq>${resultCustAddCheck[index].CustSeq}</CustSeq>
        </DataBlock1>
      `;
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustActInfoSave(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    const xmlBlocks = result.map((item, index) => {
      return `
        <DataBlock1>
          <WorkingTag>${workingTag}</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>1</IsChangedMst>
          <CustMap>${this.escapeXml(item.CustMap || '')}</CustMap>
          <OwnerJP>${this.escapeXml(item.OwnerJP || '')}</OwnerJP>
          <TrafficInfo>${this.escapeXml(item.TrafficInfo || '')}</TrafficInfo>
          <CustSpec>${this.escapeXml(item.CustSpec || '')}</CustSpec>
          <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
        </DataBlock1>
      `;
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  async generateXMLCustFileSave(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    console.log('resultCustAddCheck', resultCustAddCheck)
    const xmlBlocks = result.map((item, index) => {
      return `
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <Status>0</Status>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
        <TABLE_NAME>DataBlock1</TABLE_NAME>
        <IsChangedMst>0</IsChangedMst>
        <FileSeq>${this.escapeXml(item.FileSeq || '')}</FileSeq>
        <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
      </DataBlock1>
    `
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  async generateXMLCustRemarkSave(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    const xmlBlocks = result.map((item, index) => {
      return `
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <Status>0</Status>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
        <TABLE_NAME>DataBlock1</TABLE_NAME>
        <IsChangedMst>0</IsChangedMst>
        <CustRemark>${this.escapeXml(item.CustRemark || '')}</CustRemark>
        <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
      </DataBlock1>`;
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustSave(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    const xmlBlocks = result.map((item, index) => {
      return `
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
        <Status>0</Status>
        <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
        <CustName>${this.escapeXml(item?.CustName || '')}</CustName>
        <TrunName>${this.escapeXml(item?.TrunName || '')}</TrunName>
        <CustNo>${this.escapeXml(item?.CustNo || '')}</CustNo>
        <UMCredLevel>${this.escapeXml(item?.UMCredLevel || '')}</UMCredLevel>
        <SMDomFor>${this.escapeXml(item?.SMDomFor || '')}</SMDomFor>
        <SMCustStatus>${this.escapeXml(item?.SMCustStatus || '')}</SMCustStatus>
        <FullName>${this.escapeXml(item?.FullName || '')}</FullName>
        <BizNo>${this.escapeXml(item?.BizNo || '')}</BizNo>
        <PersonId>${this.escapeXml(item?.PersonId || '')}</PersonId>
        <Owner>${this.escapeXml(item?.Owner || '')}</Owner>
        <LawRegNo>${this.escapeXml(item?.LawRegNo || '')}</LawRegNo>
        <BizAddr>${this.escapeXml(item?.BizAddr || '')}</BizAddr>
        <BizKind>${this.escapeXml(item?.BizKind || '')}</BizKind>
        <BizType>${this.escapeXml(item?.BizType || '')}</BizType>
        <TelNo>${this.escapeXml(item?.TelNo || '')}</TelNo>
        <FrDate xml:space="preserve">        </FrDate>
        <IsBizNoNon>${this.escapeXml(item?.IsBizNoNon || '')}</IsBizNoNon>
        <IsRegNoNon>${this.escapeXml(item?.IsRegNoNon || '')}</IsRegNoNon>
        <UMCredLevelName>${this.escapeXml(item?.UMCredLevelName || '')}</UMCredLevelName>
        <SMDomForName>${this.escapeXml(item?.SMDomForName || '')}</SMDomForName>
        <SMCustStatusName>${this.escapeXml(item?.SMCustStatusName || '')}</SMCustStatusName>
        <SMBizPers>${this.escapeXml(item?.SMBizPers || '')}</SMBizPers>
        <SMBizPersName>${this.escapeXml(item?.SMBizPersName || '')}</SMBizPersName>
        <UMCountryName>${this.escapeXml(item?.UMCountryName || '')}</UMCountryName>
        <UMCountrySeq>${this.escapeXml(item?.UMCountrySeq || '')}</UMCountrySeq>
      </DataBlock1>`;
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustAddSave(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    const xmlBlocks = result.map((item, index) => {
      return `
      <DataBlock1>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
        <Status>0</Status>
        <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
        <EntryUniqueNo xml:space="preserve">                    </EntryUniqueNo>
        <Tel2>${this.escapeXml(item?.Tel2 || '')}</Tel2>
        <FAX>${this.escapeXml(item?.FAX || '')}</FAX>
        <ZipNo xml:space="preserve">          </ZipNo>
        <Addr>${this.escapeXml(item?.Addr || '')}</Addr>
        <KorAddr2>${this.escapeXml(item?.KorAddr2 || '')}</KorAddr2>
        <KorAddr3>${this.escapeXml(item?.KorAddr3 || '')}</KorAddr3>
        <EngCustName>${this.escapeXml(item?.EngCustName || '')}</EngCustName>
        <EngAddr1>${this.escapeXml(item?.EngAddr1 || '')}</EngAddr1>
        <EngAddr2>${this.escapeXml(item?.EngAddr2 || '')}</EngAddr2>
        <EngAddr3>${this.escapeXml(item?.EngAddr3 || '')}</EngAddr3>
        <TransOpenDate xml:space="preserve">        </TransOpenDate>
        <CurrSeq>${this.escapeXml(item?.CurrSeq || 0)}</CurrSeq>
        <Email>${this.escapeXml(item?.Email || '')}</Email>
        <HomePage>${this.escapeXml(item?.HomePage || '')}</HomePage>
        <EngCustSName>${this.escapeXml(item?.EngCustSName || '')}</EngCustSName>
        <CustSName1>${this.escapeXml(item?.CustSName || '')}</CustSName1>
        <CustSName2>${this.escapeXml(item?.CustSName || '')}</CustSName2>
        <IsStdReceiptUse>${this.escapeXml(item?.IsStdReceiptUse || 0)}</IsStdReceiptUse>
        <IsStdPayUse>${this.escapeXml(item?.IsStdPayUse || 0)}</IsStdPayUse>
        <IsSpecifiedForm>${this.escapeXml(item?.IsSpecifiedForm || 0)}</IsSpecifiedForm>
        <IsWayBillAsk>${this.escapeXml(item?.IsWayBillAsk || 0)}</IsWayBillAsk>
        <IsOverShipPermit>${this.escapeXml(item?.IsOverShipPermit || 0)}</IsOverShipPermit>
        <IsTaxInvoice>${this.escapeXml(item?.IsTaxInvoice || 0)}</IsTaxInvoice>
        <ShipLeadTime>${this.escapeXml(item?.ShipLeadTime || 0.0)}</ShipLeadTime>
        <CustShip>${this.escapeXml(item?.CustShip || '')}</CustShip>
        <CurrName>${this.escapeXml(item?.CurrName || '')}</CurrName>
        <IsPurchaseAfterSales>${this.escapeXml(item?.IsPurchaseAfterSales || 0)}</IsPurchaseAfterSales>
        <MinorBizNo>${this.escapeXml(item?.MinorBizNo || '')}</MinorBizNo>
        <TransCloseDate xml:space="preserve">        </TransCloseDate>
  </DataBlock1>`;
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustClassSave(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    const xmlBlocks = result.map((item, index) => {
      return `
      <DataBlock2>
        <WorkingTag>${workingTag}</WorkingTag>
        <IDX_NO>1</IDX_NO>
        <DataSeq>1</DataSeq>
        <Selected>1</Selected>
        <Status>0</Status>
        <UMChannelName>${this.escapeXml(item.UMChannelName || '')}</UMChannelName>
        <UMChannel>${this.escapeXml(item.UMChannel || '')}</UMChannel>
        <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
      </DataBlock2>
      
    `;
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLCustUserDefineSave(result: Array<{ [key: string]: any }>, resultCustAddCheck: any[], workingTag: any): Promise<string> {

    const xmlBlocks = result.map((item, index) => {

      return `  
    <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>1</IDX_NO>
      <DataSeq>1</DataSeq>
      <Selected>1</Selected>
      <Status>0</Status>
      <MngSerl>1000001</MngSerl>
      <MngName>Số tài khoản ngân hàng/ Bank Number</MngName>
      <MngValName>${this.escapeXml(item.BankNumber || '')}</MngValName>
      <MngValSeq>0</MngValSeq>
      <CodeHelpParams>200</CodeHelpParams>
      <Mask />
      <SMInputType>1027001</SMInputType>
      <CodeHelpSeq>0</CodeHelpSeq>
      <IsNON>0</IsNON>
      <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
    </DataBlock1>
  <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>2</IDX_NO>
      <DataSeq>2</DataSeq>
      <Selected>0</Selected>
      <Status>0</Status>
      <MngSerl>1000002</MngSerl>
      <MngName>Tên chủ số tài khoản/ Bank Account Name</MngName>
      <MngValName>${this.escapeXml(item?.BankAccName || '')}</MngValName>
      <MngValSeq>0</MngValSeq>
      <CodeHelpParams>200</CodeHelpParams>
      <Mask />
      <SMInputType>1027001</SMInputType>
      <CodeHelpSeq>0</CodeHelpSeq>
      <IsNON>0</IsNON>
      <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
  </DataBlock1>
  <DataBlock1>
      <WorkingTag>${workingTag}</WorkingTag>
      <IDX_NO>3</IDX_NO>
      <DataSeq>3</DataSeq>
      <Selected>0</Selected>
      <Status>0</Status>
      <MngSerl>1000003</MngSerl>
      <MngName>Tên ngân hàng/ Bank Name</MngName>
      <MngValName>${this.escapeXml(item?.BankName || '')}</MngValName>
      <MngValSeq>0</MngValSeq>
      <CodeHelpParams>200</CodeHelpParams>
      <Mask />
      <SMInputType>1027001</SMInputType>
      <CodeHelpSeq>0</CodeHelpSeq>
      <IsNON>0</IsNON>
      <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>4</IDX_NO>
    <DataSeq>4</DataSeq>
    <Selected>0</Selected>
    <Status>0</Status>
    <MngSerl>1000004</MngSerl>
    <MngName>거래처 Abbr name (역어) - Tên viết tắt của NCC</MngName>
    <MngValName>${this.escapeXml(item?.CustAbbrName || '')}</MngValName>
    <MngValSeq>0</MngValSeq>
    <CodeHelpParams>200</CodeHelpParams>
    <Mask />
    <SMInputType>1027001</SMInputType>
    <CodeHelpSeq>0</CodeHelpSeq>
    <IsNON>0</IsNON>
    <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>5</IDX_NO>
    <DataSeq>5</DataSeq>
    <Selected>0</Selected>
    <Status>0</Status>
    <MngSerl>1000005</MngSerl>
    <MngName>대표 연락처 - Số điện thoại công ty</MngName>
    <MngValName>${this.escapeXml(item?.CustPhone || '')}</MngValName>
    <MngValSeq>0</MngValSeq>
    <CodeHelpParams>200</CodeHelpParams>
    <Mask />
    <SMInputType>1027001</SMInputType>
    <CodeHelpSeq>0</CodeHelpSeq>
    <IsNON>0</IsNON>
    <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag>${workingTag}</WorkingTag>
    <IDX_NO>6</IDX_NO>
    <DataSeq>6</DataSeq>
    <Selected>0</Selected>
    <Status>0</Status>
    <MngSerl>1000006</MngSerl>
    <MngName>영업 덤당 연락처 - Số điện thoại phụ trách bán hàng</MngName>
    <MngValName>${this.escapeXml(item?.CustPhone2 || '')}</MngValName>
    <MngValSeq>0</MngValSeq>
    <CodeHelpParams>200</CodeHelpParams>
    <Mask />
    <SMInputType>1027001</SMInputType>
    <CodeHelpSeq>0</CodeHelpSeq>
    <IsNON>0</IsNON>
    <CustSeq>${this.escapeXml(resultCustAddCheck[index].CustSeq || '')}</CustSeq>
  </DataBlock1>
      `;
    })
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLGetMasterInfo(custSeq: any): Promise<string> {

    const xmlBlocks = `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <CustSeq>${custSeq}</CustSeq>
        </DataBlock1>
  `;
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLGetBasicInfo(custSeq: any): Promise<string> {

    const xmlBlocks = `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <CustSeq>${custSeq}</CustSeq>
        </DataBlock1>
  `;
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLGetBankInfo(custSeq: any): Promise<string> {

    const xmlBlocks = `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <CustSeq>${custSeq}</CustSeq>
        </DataBlock1>
  `;
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLGetCustAddInfo(custSeq: any): Promise<string> {

    const xmlBlocks = `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <CustSeq>${custSeq}</CustSeq>
        </DataBlock1>
  `;
    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  async generateXMLGetCustKindInfo(custSeq: any): Promise<string> {

    const xmlBlocks = `
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>1</IsChangedMst>
          <CustSeq>${custSeq}</CustSeq>
        </DataBlock1>
  `;
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



  generateXMLSDACustQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item) => `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <CustName>${this.safeValue(item.CustName)}</CustName>
            <CustNo>${this.safeValue(item.CustNo)}</CustNo>
            <BizNo>${this.safeValue(item.BizNo)}</BizNo>
            <MinorBizNo>${this.safeValue(item.MinorBizNo)}</MinorBizNo>
            <SMCustStatus>${this.safeValue(item.SMCustStatus)}</SMCustStatus>
            <UMCustKind>${this.safeValue(item.UMCustKind)}</UMCustKind>
            <Owner>${this.safeValue(item.Owner)}</Owner>
            <ChannelSeq>${this.safeValue(item.ChannelSeq)}</ChannelSeq>
            <Email>${this.safeValue(item.Email)}</Email>
            <PersonId2>${this.safeValue(item.PersonId2)}</PersonId2>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSDACustEmpInfoQ(result: Array<{ [key: string]: any }>): string {
    const xmlBlocks = result
      .map(
        (item) => `
          <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }



  generateXMLSDACustAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map(
        (item) => `
          <DataBlock1>
            <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
            <IDX_NO>${this.safeValue(item.IDX_NO ?? item.IdxNo ?? 1)}</IDX_NO>
            <Status>${this.safeValue(item.Status ?? 0)}</Status>
            <DataSeq>${this.safeValue(item.DataSeq ?? 1)}</DataSeq>
            <Selected>${this.safeValue(item.Selected ?? 1)}</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>${this.safeValue(item.IsChangedMst ?? 1)}</IsChangedMst>
            <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
            <TrunName>${this.safeValue(item.TrunName)}</TrunName>
            <FullName>${this.safeValue(item.FullName)}</FullName>
            <SMCustStatus>0</SMCustStatus>
            <SMCustStatusName>${this.safeValue(item.SMCustStatusName)}</SMCustStatusName>
            <UMCredLevel>${this.safeValue(item.UMCredLevel)}</UMCredLevel>
            <UMCredLevelName>${this.safeValue(item.UMCredLevelName)}</UMCredLevelName>
            <CustName>${this.safeValue(item.CustName)}</CustName>
            <CustNo>${this.safeValue(item.CustNo)}</CustNo>
            <SMDomFor>${this.safeValue(item.SMDomFor)}</SMDomFor>
            <SMDomForName>${this.safeValue(item.SMDomForName)}</SMDomForName>
            <UMCountrySeq>${this.safeValue(item.UMCountrySeq)}</UMCountrySeq>
            <UMCountryName>${this.safeValue(item.UMCountryName)}</UMCountryName>
            <FrDate>${this.safeValue(item.FrDate)}</FrDate>
            <BizNo>${this.safeValue(item.BizNo)}</BizNo>
            <LawRegNo>${this.safeValue(item.LawRegNo)}</LawRegNo>
            <Owner>${this.safeValue(item.Owner)}</Owner>
            <TelNo>${this.safeValue(item.TelNo)}</TelNo>
            <PersonId>${this.safeValue(item.PersonId)}</PersonId>
            <BizType>${this.safeValue(item.BizType)}</BizType>
            <BizKind>${this.safeValue(item.BizKind)}</BizKind>
            <BizAddr>${this.safeValue(item.BizAddr)}</BizAddr>
            <SMBizPers>${this.safeValue(item.SMBizPers)}</SMBizPers>
            <SMBizPersName>${this.safeValue(item.SMBizPersName)}</SMBizPersName>
            <IsBizNoNon>${this.safeValue(item.IsBizNoNon)}</IsBizNoNon>
            <IsRegNoNon>${this.safeValue(item.IsRegNoNon)}</IsRegNoNon>
            <MinorBizNo>${this.safeValue(item.MinorBizNo)}</MinorBizNo>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSDACustAddAUD(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map(
        (item) => `
          <DataBlock1>
            <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
            <IDX_NO>${this.safeValue(item.IDX_NO ?? item.IdxNo ?? 1)}</IDX_NO>
            <DataSeq>${this.safeValue(item.DataSeq ?? 1)}</DataSeq>
            <Selected>${this.safeValue(item.Selected ?? 1)}</Selected>
            <Status>${this.safeValue(item.Status ?? 0)}</Status>
            <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
            <EntryUniqueNo>${this.safeValue(item.EntryUniqueNo)}</EntryUniqueNo>
            <Tel2>${this.safeValue(item.Tel2)}</Tel2>
            <FAX>${this.safeValue(item.FAX)}</FAX>
            <ZipNo>${this.safeValue(item.ZipNo)}</ZipNo>
            <Addr>${this.safeValue(item.Addr)}</Addr>
            <KorAddr2>${this.safeValue(item.KorAddr2)}</KorAddr2>
            <KorAddr3>${this.safeValue(item.KorAddr3)}</KorAddr3>
            <EngCustName>${this.safeValue(item.EngCustName)}</EngCustName>
            <EngAddr1>${this.safeValue(item.EngAddr1)}</EngAddr1>
            <EngAddr2>${this.safeValue(item.EngAddr2)}</EngAddr2>
            <EngAddr3>${this.safeValue(item.EngAddr3)}</EngAddr3>
            <TransOpenDate>${this.safeValue(item.TransOpenDate)}</TransOpenDate>
            <CurrSeq>${this.safeValue(item.CurrSeq ?? 0)}</CurrSeq>
            <Email>${this.safeValue(item.Email)}</Email>
            <HomePage>${this.safeValue(item.HomePage)}</HomePage>
            <EngCustSName>${this.safeValue(item.EngCustSName)}</EngCustSName>
            <CustSName1>${this.safeValue(item.CustSName1)}</CustSName1>
            <CustSName2>${this.safeValue(item.CustSName2)}</CustSName2>
            <IsStdReceiptUse>${this.safeValue(item.IsStdReceiptUse ?? 0)}</IsStdReceiptUse>
            <IsStdPayUse>${this.safeValue(item.IsStdPayUse ?? 0)}</IsStdPayUse>
            <IsSpecifiedForm>${this.safeValue(item.IsSpecifiedForm ?? 0)}</IsSpecifiedForm>
            <IsWayBillAsk>${this.safeValue(item.IsWayBillAsk ?? 0)}</IsWayBillAsk>
            <IsOverShipPermit>${this.safeValue(item.IsOverShipPermit ?? 0)}</IsOverShipPermit>
            <IsTaxInvoice>${this.safeValue(item.IsTaxInvoice ?? 0)}</IsTaxInvoice>
            <ShipLeadTime>${this.safeValue(item.ShipLeadTime ?? '0.00000')}</ShipLeadTime>
            <CustShip>${this.safeValue(item.CustShip)}</CustShip>
            <CurrName>${this.safeValue(item.CurrName)}</CurrName>
            <IsPurchaseAfterSales>${this.safeValue(item.IsPurchaseAfterSales ?? 0)}</IsPurchaseAfterSales>
            <MinorBizNo>${this.safeValue(item.MinorBizNo)}</MinorBizNo>
            <TransCloseDate>${this.safeValue(item.TransCloseDate)}</TransCloseDate>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSDACustKindSave(
    result: Array<{ [key: string]: any }>,
  ): string {
    const xmlBlocks = result
      .map(
        (item) => `
          <DataBlock1>
    <WorkingTag />
    <IDX_NO>1</IDX_NO>
    <DataSeq>1</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Điểm giao dịch doanh số trong nước</UMCustKindName>
    <UMCustKind>1004001</UMCustKind>
    <TABLE_NAME>DataBlock1</TABLE_NAME>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>2</IDX_NO>
    <DataSeq>2</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Điểm giao dịch doanh số xuất khẩu (doanh nghiệp nước ngoài)</UMCustKindName>
    <UMCustKind>1004002</UMCustKind>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>3</IDX_NO>
    <DataSeq>3</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Điểm giao dịch nhập mua trong nước</UMCustKindName>
    <UMCustKind>1004003</UMCustKind>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>4</IDX_NO>
    <DataSeq>4</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Điểm giao dịch nhập khẩu (doanh nghiệp nước ngoài)</UMCustKindName>
    <UMCustKind>1004004</UMCustKind>
    <CustSeq>0${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>5</IDX_NO>
    <DataSeq>5</DataSeq>
    <Status>0</Status>
    <Selected>1</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Nơi giao dịch xuất khẩu tại địa phương(Công ty)</UMCustKindName>
    <UMCustKind>1004010</UMCustKind>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>6</IDX_NO>
    <DataSeq>6</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Nơi giao dịch nhập khẩu tại địa phương(Công ty)</UMCustKindName>
    <UMCustKind>1004011</UMCustKind>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>7</IDX_NO>
    <DataSeq>7</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Khách hàng dịch vụ</UMCustKindName>
    <UMCustKind>1004016</UMCustKind>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>8</IDX_NO>
    <DataSeq>8</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Doanh nghiệp phát hành hóa đơn thuế VAT điện tử</UMCustKindName>
    <UMCustKind>1004017</UMCustKind>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>9</IDX_NO>
    <DataSeq>9</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>The retailer has no business code</UMCustKindName>
    <UMCustKind>1004018</UMCustKind>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
  <DataBlock1>
    <WorkingTag />
    <IDX_NO>10</IDX_NO>
    <DataSeq>10</DataSeq>
    <Status>0</Status>
    <Selected>0</Selected>
    <Sel>1</Sel>
    <UMCustKindName>Khách hàng gia công ngoài</UMCustKindName>
    <UMCustKind>1004019</UMCustKind>
    <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
  </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSDACustCheckD(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map(
        (item) => `
          <DataBlock1>
            <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
            <IDX_NO>${this.safeValue(item.IDX_NO ?? item.IdxNo ?? 1)}</IDX_NO>
            <DataSeq>${this.safeValue(item.DataSeq ?? 1)}</DataSeq>
            <Selected>${this.safeValue(item.Selected ?? 1)}</Selected>
            <Status>${this.safeValue(item.Status ?? 0)}</Status>
            <CustSeq>${this.safeValue(item.CustSeq)}</CustSeq>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSDACustEmpInfo(
    result: Array<{ [key: string]: any }>,
    WorkingTag: string
  ): string {
    const xmlBlocks = result
      .map(
        (item) => `
          <DataBlock1>
            <WorkingTag>${this.safeValue(WorkingTag)}</WorkingTag>
             <IDX_NO>${this.safeValue(item.IDX_NO ?? item.IdxNo ?? 1)}</IDX_NO>
            <DataSeq>${this.safeValue(item.DataSeq ?? 1)}</DataSeq>
            <Selected>${this.safeValue(item.Selected ?? 1)}</Selected>
            <Status>${this.safeValue(item.Status ?? 0)}</Status>
           <EmpSerl>${this.safeValue(item.EmpSerl !== '' ? item.IDX_NO : item.IdxNo)}</EmpSerl>

            <EmpName>${this.safeValue(item.EmpName ?? '')} </EmpName>
            <JpName>${this.safeValue(item.JpName ?? '')} </JpName>
            <DeptName>${this.safeValue(item.DeptName ?? '')} </DeptName>
            <TELNo>${this.safeValue(item.TELNo ?? '')} </TELNo>
            <MobileNo>${this.safeValue(item.MobileNo ?? '')} </MobileNo>
            <FAX>${this.safeValue(item.FAX ?? '')} </FAX>
            <EMail>${this.safeValue(item.EMail ?? '')} </EMail>
            <Remark>${this.safeValue(item.Remark ?? '')} </Remark>
            <UMJobRollKindName>${this.safeValue(item.UMJobRollKindName ?? '')} </UMJobRollKindName>
            <UMJobRollKind> ${this.safeValue(item.UMJobRollKind ?? '')}</UMJobRollKind>
          <IsStd>${this.convertToNumber(item.IsStd)}</IsStd>

            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <CustSeq>${this.safeValue(item.CustSeq ?? 0)}</CustSeq>
          </DataBlock1>
        `
      )
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

}

