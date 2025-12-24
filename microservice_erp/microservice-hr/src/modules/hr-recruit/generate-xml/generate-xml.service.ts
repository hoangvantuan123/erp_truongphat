
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
    return normalized === "1" || normalized === "true" ? "1" : "0";
  }



  generateXMLSHREmpIn(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
            <DataBlock1>
              <WorkingTag>${WorkingTag}</WorkingTag>
              <IDX_NO>${index + 1}</IDX_NO>
              <DataSeq>${index + 1}</DataSeq>
              <Status>0</Status>
              <Selected>1</Selected>
              <EmpFamilyName>${item.EmpFamilyName || ''}</EmpFamilyName>
              <EmpFirstName>${item.EmpFirstName || ''}</EmpFirstName>
              <EmpName>${item.EmpName || ''}</EmpName>
              <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
              <EmpID>${item.EmpID || ''}</EmpID>
              <ResidID>${item.ResidID || ''}</ResidID>
              <EntDate>${item.EntDate || ''}</EntDate>
              <UMEmpType>${item.UMEmpType || ''}</UMEmpType>
              <EmpChnName>${item.EmpChnName || ''}</EmpChnName>
              <EmpEngFirstName>${item.EmpEngFirstName || ''}</EmpEngFirstName>
              <EmpEngLastName>${item.EmpEngLastName || ''}</EmpEngLastName>
              <Remark>${ item.Remark || ''}</Remark>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
            </DataBlock1>
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSHrBasAddressAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${index + 1}</IDX_NO>
              <DataSeq>${index + 1}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
             <AddressSeq>${item.AddressSeq || 0}</AddressSeq>
            <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
            <SMAddressType>${item.SMAddressType || 3055001}</SMAddressType>
            <BegDate>${item.BegDate || ''}</BegDate>
            <EndDate>${item.EndDate || ''}</EndDate>
            <ZipNo>${item.ZipNo || ''}</ZipNo>
            <AddrSeq>${item.AddrSeq || 0}</AddrSeq>
            <Addr>${item.Addr || ''}</Addr>
            <Addr2>${item.Addr2 || ''}</Addr2>
            <AddrEng1>${item.AddrEng1 || ''}</AddrEng1>
            <AddrEng2>${item.AddrEng2 || ''}</AddrEng2>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSHREmpOne(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
           <IDX_NO>${index + 1}</IDX_NO>
              <DataSeq>${index + 1}</DataSeq>
            <Status>0</Status>
            <Selected>0</Selected>
            <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
            <EntRetTypeSeq>${item.EntRetTypeSeq || ''}</EntRetTypeSeq>
            <UMEmpType>${item.UMEmpType || ''}</UMEmpType>
            <EntDate>${item.EntDate || ''}</EntDate>
            <RetireDate>${item.RetireDate || ''}</RetireDate>
            <Height>${item.Height || 0}</Height>
            <Weight>${item.Weight || 0}</Weight>
            <EyeLt>${item.EyeLt || 0}</EyeLt>
            <EyeRt>${item.EyeRt || 0}</EyeRt>
            <SMBloodTypeName>${item.SMBloodTypeName || ''}</SMBloodTypeName>
            <SMBloodType>${item.SMBloodType || 0}</SMBloodType>
            <IsDisabled>  ${this.parseTo01(item.IsDisabled)}</IsDisabled>
            <IsForeigner>${this.parseTo01(item.IsForeigner)}</IsForeigner>
            <SMBirthType>${item.SMBirthType || ''}</SMBirthType>
            <BirthDate>${item.BirthDate || ''}</BirthDate>
            <UMNationSeq>${item.UMNationSeq || 0}</UMNationSeq>
            <SMSexSeq>${item.SMSexSeq || 0}</SMSexSeq>
            <IsMarriage>${this.parseTo01(item.IsMarriage)}</IsMarriage>
            <MarriageDate>${item.MarriageDate || ''}</MarriageDate>
            <UMReligionSeq>${item.UMReligionSeq || 0}</UMReligionSeq>
            <Hobby>${item.Hobby || ''}</Hobby>
            <Speciality>${item.Speciality || ''}</Speciality>
            <Phone>${item.Phone || ''}</Phone>
            <Cellphone>${item.Cellphone || ''}</Cellphone>
            <Extension>${item.Extension || ''}</Extension>
            <Email>${item.Email || ''}</Email>
            <UMEmployType>${item.UMEmployType || 0}</UMEmployType>
            <WishTask1>${item.WishTask1 || ''}</WishTask1>
            <WishTask2>${item.WishTask2 || ''}</WishTask2>
            <Recommender>${item.Recommender || ''}</Recommender>
            <RcmmndrCom>${item.RcmmndrCom || ''}</RcmmndrCom>
            <RcmmndrRank>${item.RcmmndrRank || ''}</RcmmndrRank>
            <Remark>${item.Remark || ''}</Remark>
            <UMHandiType>${item.UMHandiType || 0}</UMHandiType>
            <UMHandiGrd>${item.UMHandiGrd || 0}</UMHandiGrd>
            <HandiAppdate>${item.HandiAppdate || ''}</HandiAppdate>
            <IsVeteranEmp>${this.parseTo01(item.IsVeteranEmp)}</IsVeteranEmp>
            <VeteranNo>${item.VeteranNo || ''}</VeteranNo>
            <UMRelName>${item.UMRelName || ''}</UMRelName>
            <UMRelSeq>${item.UMRelSeq || 0}</UMRelSeq>
            <IsJobEmp>${this.parseTo01(item.IsJobEmp)}</IsJobEmp>
            <People>${item.People || 0}</People>
            <UMHouseSort>${item.UMHouseSort || 0}</UMHouseSort>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }


  generateXMLSHRBasFamily(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
        <DataBlock1>
          <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${index + 1}</IDX_NO>
              <DataSeq>${index + 1}</DataSeq>
          <Status>0</Status>
          <Selected>1</Selected>
          <FamilySeq>${item.FamilySeq || 0}</FamilySeq>
          <EmpSeq>${item.EmpSeqSync || item.EmpSeq || ''}</EmpSeq>
          <FamilyName>${item.FullName || item.FamilyName || ''}</FamilyName>
          <FamilyResidID>${item.FamilyResidID || ''}</FamilyResidID>
          <UMRelSeq>${item.UMRelSeq || ''}</UMRelSeq>
          <UMSchCareerSeq>${item.UMSchCareerSeq || ''}</UMSchCareerSeq>
          <Occupation>${item.Occupation || ''}</Occupation>
          <FamilyPhone>${item.PhoneNumber || item.FamilyPhone || ''}</FamilyPhone>
          <SMBirthType>${item.SMBirthType || ''}</SMBirthType>
          <BirthDate>${item.DateOfBirth || item.BirthDate || ''}</BirthDate>
          <RegDate>${item.RegDate || ''}</RegDate>
          <EndDate>${item.EndDate || ''}</EndDate>
          <IsNationMerit>${this.parseTo01(item.IsNationMerit)}</IsNationMerit>
          <UMNationSeq>${item.UMNationSeq || ''}</UMNationSeq>
          <IsHandi>${this.parseTo01(item.IsHandi)}</IsHandi>
          <UMHandiType>${item.UMHandiType || ''}</UMHandiType>
          <UMHandiGrd>${item.UMHandiGrd || ''}</UMHandiGrd>
          <HandiAppdate>${item.HandiAppdate || ''}</HandiAppdate>
          <IsSameRoof>${this.parseTo01(item.IsSameRoof)}</IsSameRoof>
          <IsDepend>${this.parseTo01(item.IsDepend)}</IsDepend>
          <IsPayAllow>${this.parseTo01(item.IsPayAllow)}</IsPayAllow>
          <IsMed>${this.parseTo01(item.IsMed)}</IsMed>
          <IsDeath>${this.parseTo01(item.IsDeath)}</IsDeath>
          <DispSeq>${item.DispSeq || ''}</DispSeq>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
        </DataBlock1>
      `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
}
