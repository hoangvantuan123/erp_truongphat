
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

  generateXMLSHREmpInQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
          <WorkingTag>A</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
          <FrEntDate>${result?.FrEntDate || ''}</FrEntDate>
          <ToEntDate>${result?.ToEntDate || ''}</ToEntDate>
          <UMEmpType>${result?.UMEmpType || ''}</UMEmpType>
          <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLSHREmpOneQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <QBegDate>${result?.QBegDate || ''}</QBegDate>
            <QEndDate>${result?.QEndDate || ''}</QEndDate>
            <UMEmpType>${result?.UMEmpType || ''}</UMEmpType>
            <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
            <EntRetTypeSeq>${result?.EntRetTypeSeq || ''}</EntRetTypeSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLSHREmpDateQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <QBegDate>${result?.QBegDate || ''}</QBegDate>
            <QEndDate>${result?.QEndDate || ''}</QEndDate>
            <UMEmpType>${result?.UMEmpType || ''}</UMEmpType>
            <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
            <DeptSeq>${result?.DeptSeq || ''}</DeptSeq>
            <EntRetTypeSeq>${result?.EntRetTypeSeq || ''}</EntRetTypeSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLSHREmpInfoQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <QBegDate>${result?.QBegDate || ''}</QBegDate>
            <QEndDate>${result?.QEndDate || ''}</QEndDate>
            <UMEmpType>${result?.UMEmpType || ''}</UMEmpType>
            <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
            <EntRetTypeSeq>${result?.EntRetTypeSeq || ''}</EntRetTypeSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLSBasTravelQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
             <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <DeptSeq>${result?.DeptSeq || ''}</DeptSeq>
            <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
            <EntRetTypeSeq>${result?.EntRetTypeSeq || ''}</EntRetTypeSeq>
            <QBegDate>${result?.QBegDate || ''}</QBegDate>
            <QEndDate>${result?.QEndDate || ''}</QEndDate>
            <SMAbrd>${result?.SMAbrd || ''}</SMAbrd>
            <UMNationSeq>${result?.UMNationSeq || ''}</UMNationSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLSBasOrgJobQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
             <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <BegDate>${result?.BegDate || ''}</BegDate>
            <EndDate>${result?.EndDate || ''}</EndDate>
            <UMJobHighClass>${result?.UMJobHighClass || ''}</UMJobHighClass>
            <UMJobClass>${result?.UMJobClass || ''}</UMJobClass>
            <JobName>${result?.JobName || ''}</JobName>
            <SMIsUseSeq>${result?.SMIsUseSeq || ''}</SMIsUseSeq>
        </DataBlock1>
      </ROOT>`;
  }

  generateXMLHrOrgPosQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
             <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
             <QBegDate>${result?.QBegDate || ''}</QBegDate>
            <QEndDate>${result?.QEndDate || ''}</QEndDate>
            <UMJoSeq>${result?.UMJoSeq || ''}</UMJoSeq>
            <UMPosLvlSeq>${result?.UMPosLvlSeq || ''}</UMPosLvlSeq>
            <IsUse>${result?.IsUse || ''}</IsUse>
            <PosName>${result?.PosName || ''}</PosName>
            <IsPJT>${result?.IsPJT || ''}</IsPJT>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBasUnionQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
             <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <DeptSeq>${result?.DeptSeq || ''}</DeptSeq>
            <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
            <UMUnionStatus>${result?.UMUnionStatus || ''}</UMUnionStatus>
            <EntRetType>${result?.EntRetType || ''}</EntRetType>
            <FrBegDate>${result?.FrBegDate || ''}</FrBegDate>
            <ToBegDate>${result?.ToBegDate || ''}</ToBegDate>
            <FrEndDate>${result?.FrEndDate || ''}</FrEndDate>
            <ToEndDate>${result?.ToEndDate || ''}</ToEndDate>
            <UMUnionType>${result?.UMUnionType || ''}</UMUnionType>
            <IsLast>${result?.IsLast || 0}</IsLast>
            <IsSeveralUnion>${result?.IsSeveralUnion || 0}</IsSeveralUnion>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLSHRBasFamilyQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
               <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>${this.parseTo01(result.IsChangedMst)}</IsChangedMst>
              <IsSameRoof>${this.parseTo01(result.IsSameRoof)}</IsSameRoof>
              <IsDepend>${this.parseTo01(result.IsDepend)}</IsDepend>
              <IsPayAllow>${this.parseTo01(result.IsPayAllow)}</IsPayAllow>
              <IsMed>${this.parseTo01(result.IsMed)}</IsMed>
              <DeptSeq>${result?.DeptSeq || 0}</DeptSeq>
              <EmpSeq>${result?.EmpSeq || 0}</EmpSeq>
              <EntRetTypeSeq>${result?.EntRetTypeSeq || ''}</EntRetTypeSeq>
              <EntRetTypeName>${result?.EntRetTypeName || ''}</EntRetTypeName>
              <UMRelSeq >${result?.UMRelSeq || ''}</UMRelSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBasMilitaryQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
              <WorkingTag>Q</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBasCareerQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
               <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <DeptSeq>${result?.DeptSeq || ''}</DeptSeq>
              <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
              <EntRetTypeSeq>${result?.EntRetTypeSeq || ''}</EntRetTypeSeq>
              <QBegDate>${result?.QBegDate || ''}</QBegDate>
              <QEndDate>${result?.QEndDate || ''}</QEndDate>
              <CoNm>${result?.CoNm || ''}</CoNm>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBasPjtCareerQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
               <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
             <CareerSeq>${result?.CareerSeq || ''}</CareerSeq>
              <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
              <pjtBegDate>${result?.pjtBegDate || ''}</pjtBegDate>
              <pjtEndDate>${result?.pjtEndDate || ''}</pjtEndDate>
              <UMPjtType>${result?.UMPjtType || ''}</UMPjtType>
    <PjtName />
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBasAcademicQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
               <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <DeptSeq>${result?.DeptSeq}</DeptSeq>
              <EmpSeq>${result?.EmpSeq}</EmpSeq>
              <EntRetTypeSeq>${result?.EntRetTypeSeq}</EntRetTypeSeq>
              <EntRetTypeName>${result?.EntRetTypeName}</EntRetTypeName>
              <IsLastSchCareer>${result?.IsLastSchCareer}</IsLastSchCareer>
              <UMSchCareerSeq>${result?.UMSchCareerSeq}</UMSchCareerSeq>
              <UMMajorDepart>${result?.UMMajorDepart}</UMMajorDepart>
              <UMMajorCourse>${result?.UMMajorCourse}</UMMajorCourse>
              <UMRelSeq>${result?.UMRelSeq}</UMRelSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBasAddressQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
               <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <DeptSeq>${result?.DeptSeq}</DeptSeq>
              <EmpSeq>${result?.EmpSeq}</EmpSeq>
              <EntRetTypeSeq>${result?.EntRetTypeSeq}</EntRetTypeSeq>
              <SMAddressType>${result?.SMAddressType}</SMAddressType>
              <QAddress>${result?.QAddress}</QAddress>
              <QBegDate>${result?.QBegDate}</QBegDate>
              <QEndDate>${result?.QEndDate}</QEndDate>
              <IsLast>${result?.IsLast || 0}</IsLast>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBasLicenseCheckQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
               <WorkingTag>U</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <EmpSeq>${result?.EmpSeq}</EmpSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBaslinguisticQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
               <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <DeptSeq>${result?.DeptSeq}</DeptSeq>
              <EmpSeq>${result?.EmpSeq}</EmpSeq>
              <EntRetTypeSeq>${result?.EntRetTypeSeq}</EntRetTypeSeq>
              <QAddress>${result?.QAddress}</QAddress>
              <QBegDate>${result?.QBegDate}</QBegDate>
              <QEndDate>${result?.QEndDate}</QEndDate>
              <UMLanguageType>${result?.UMLanguageType}</UMLanguageType>
              <UMAuthType>${result?.UMAuthType}</UMAuthType>
              <IsLast>${result?.IsLast || 0}</IsLast>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLHrBasPrzPnlQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
               <WorkingTag>A</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
              <DeptSeq>${result?.DeptSeq}</DeptSeq>
              <EmpSeq>${result?.EmpSeq || ''}</EmpSeq>
              <EntRetTypeSeq>${result?.EntRetTypeSeq}</EntRetTypeSeq>
              <QBegDate>${result?.QBegDate}</QBegDate>
              <QEndDate>${result?.QEndDate}</QEndDate>
              <SMPrzPnlType>${result?.SMPrzPnlType}</SMPrzPnlType>
              <UMPrzPnlSeq>${result?.UMPrzPnlSeq}</UMPrzPnlSeq>
        </DataBlock1>
      </ROOT>`;
  }


  generateXMLSHREmpIn(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
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
            <Remark>${item.Remark || ''}</Remark>
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
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
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
          <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
          <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
          <Status>0</Status>
          <Selected>1</Selected>
          <FamilySeq>${item.FamilySeq || 0}</FamilySeq>
          <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
          <FamilyName>${item.FamilyName || ''}</FamilyName>
          <FamilyResidID>${item.FamilyResidID || ''}</FamilyResidID>
          <UMRelSeq>${item.UMRelSeq || ''}</UMRelSeq>
          <UMSchCareerSeq>${item.UMSchCareerSeq || ''}</UMSchCareerSeq>
          <Occupation>${item.Occupation || ''}</Occupation>
          <FamilyPhone>${item.FamilyPhone || ''}</FamilyPhone>
          <SMBirthType>${item.SMBirthType || ''}</SMBirthType>
          <BirthDate>${item.BirthDate || ''}</BirthDate>
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



  generateXMLSHRBasAcademic(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <AcademicSeq>${item.AcademicSeq || 0}</AcademicSeq>
            <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
            <DeptSeq>${item.DeptSeq || ''}</DeptSeq>
            <UMSchCareerSeq>${item.UMSchCareerSeq || ''}</UMSchCareerSeq>
            <UMSchSeq>${item.UMSchSeq || ''}</UMSchSeq>
            <UMUniversityType>${item.UMUniversityType || ''}</UMUniversityType>
            <EtcSchNm>${item.EtcSchNm || ''}</EtcSchNm>
            <UMMajorDepart>${item.UMMajorDepart || ''}</UMMajorDepart>
            <UMMinorDepart>${item.UMMinorDepart || ''}</UMMinorDepart>
            <UMMajorCourse>${item.UMMajorCourse || ''}</UMMajorCourse>
            <UMMinorCourse>${item.UMMinorCourse || ''}</UMMinorCourse>
            <MajorCourse>${item.MajorCourse || ''}</MajorCourse>
            <MinorCourse>${item.MinorCourse || ''}</MinorCourse>
            <SMDayNightType>${item.SMDayNightType || ''}</SMDayNightType>
            <EntYm>${item.EntYm || ''}</EntYm>
            <GrdYm>${item.GrdYm || ''}</GrdYm>
            <UMDegreeType>${item.UMDegreeType || ''}</UMDegreeType>
            <DegreeNo>${item.DegreeNo || ''}</DegreeNo>
            <ThesisNm>${item.ThesisNm || ''}</ThesisNm>
            <Loc>${item.Loc || ''}</Loc>
            <IsLastSchCareer>${item.IsLastSchCareer || 0}</IsLastSchCareer>
            <IsAppSchCareer>${item.IsAppSchCareer || 0}</IsAppSchCareer>
            <DispSeq>${item.DispSeq || ''}</DispSeq>
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
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
             <AddressSeq>${item.AddressSeq || 0}</AddressSeq>
            <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
            <SMAddressType>${item.SMAddressType || ''}</SMAddressType>
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
  generateXMLSHrBaslinguisticAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
             <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
            <linguisticSeq>${item.linguisticSeq || 0}</linguisticSeq>
            <UMLanguageTypeName>${item.UMLanguageTypeName || ''}</UMLanguageTypeName>
            <UMLanguageType>${item.UMLanguageType || ''}</UMLanguageType>
            <UMAuthTypeName>${item.UMAuthTypeName || ''}</UMAuthTypeName>
            <UMAuthType>${item.UMAuthType || ''}</UMAuthType>
            <Score>${item.Score || 0}</Score>
            <CharScore>${item.CharScore || ''}</CharScore>
            <UMGradeName>${item.UMGradeName || ''}</UMGradeName>
            <UMGrade>${item.UMGrade || 0}</UMGrade>
            <BegDate>${item.BegDate || ''}</BegDate>
            <EndDate>${item.EndDate || ''}</EndDate>
            <IsAllowPay>${this.parseTo01(item.IsAllowPay)}</IsAllowPay>
            <Remark>${item.Remark || ''}</Remark>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLSHrBasPrzPnlAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
           <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
            <PrzPnlSeq>${item.PrzPnlSeq || 0}</PrzPnlSeq>
            <SMPrzPnlType>${item.SMPrzPnlType || ''}</SMPrzPnlType>
            <PrzPnlFrDate>${item.PrzPnlFrDate || ''}</PrzPnlFrDate>
            <PrzPnlToDate>${item.PrzPnlToDate || ''}</PrzPnlToDate>
            <SMInOutType>${item.SMInOutType || ''}</SMInOutType>
            <UMPrzPnlSeq>${item.UMPrzPnlSeq || 0}</UMPrzPnlSeq>
            <PrzPnlReason>${item.PrzPnlReason || ''}</PrzPnlReason>
            <PrzPnlInst>${item.PrzPnlInst || ''}</PrzPnlInst>
            <IsAllowDeduc>${this.parseTo01(item.IsAllowDeduc)}</IsAllowDeduc>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLBasTravelAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <TravelRecSeq>${item.TravelRecSeq || 0}</TravelRecSeq>
            <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
            <DptDate>${item.DptDate || ''}</DptDate>
            <ArvDate>${item.ArvDate || ''}</ArvDate>
            <SMAbrdName>${item.SMAbrdName || ''}</SMAbrdName>
            <SMAbrd>${item.SMAbrd || ''}</SMAbrd>
            <UMNationName>${item.UMNationName || ''}</UMNationName>
            <UMNationSeq>${item.UMNationSeq || 0}</UMNationSeq>
            <TripRec>${item.TripRec || ''}</TripRec>
            <TripArea>${item.TripArea || ''}</TripArea>
            <Rem>${item.Rem || ''}</Rem>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLBasOrgJobAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
             <JobSeq>${item.JobSeq || 0}</JobSeq>
            <JobName>${item.JobName || ''}</JobName>
            <AbrJobName>${item.AbrJobName || ''}</AbrJobName>
            <JobEngName>${item.JobEngName || ''}</JobEngName>
            <AbrJobEngName>${item.AbrJobEngName || ''}</AbrJobEngName>
            <UMJobClass>${item.UMJobClass || 0}</UMJobClass>
            <CompeSeq>${item.CompeSeq || 0}</CompeSeq>
            <BegDate>${item.BegDate || ''}</BegDate>
            <EndDate>${item.EndDate || ''}</EndDate>
            <Descript>${item.Descript || ''}</Descript>
            <DispSeq>${item.DispSeq || 0}</DispSeq>
            <IsUse>${item.IsUse || 0}</IsUse>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLHrOrgPosAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <PosName>${item.PosName || ''}</PosName>
            <PosSeq>${item.PosSeq || 0}</PosSeq>
            <AbrPosName>${item.AbrPosName || ''}</AbrPosName>
            <PosEngName>${item.PosEngName || ''}</PosEngName>
            <AbrPosEngName>${item.AbrPosEngName || ''}</AbrPosEngName>
            <BegDate>${item.BegDate || ''}</BegDate>
            <EndDate>${item.EndDate || ''}</EndDate>
            <UMJoSeq>${item.UMJoSeq || 0}</UMJoSeq>
            <CCtrSeq>${item.CCtrSeq || ''}</CCtrSeq>
            <UMPosLvlSeq>${item.UMPosLvlSeq || 0}</UMPosLvlSeq>
            <Descript>${item.Descript || ''}</Descript>
            <DispSeq>${item.DispSeq || 0}</DispSeq>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsPJT>${item.IsPJT || 0}</IsPJT>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLHrBasUnionAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
            <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
            <UnionSeq>${item.UnionSeq || 0}</UnionSeq>
            <UMUnionType>${item.UMUnionType || ''}</UMUnionType>
            <BegDate>${item.BegDate || ''}</BegDate>
            <EndDate>${item.EndDate || ''}</EndDate>
            <UMUnionStatus>${item.UMUnionStatus || ''}</UMUnionStatus>
            <UnionJdNm>${item.UnionJdNm || ''}</UnionJdNm>
            <Remark>${item.Remark || ''}</Remark>
            <IsLast>${item.IsLast || ''}</IsLast>
            <IsAllowPay>${this.parseTo01(item.IsAllowPay)}</IsAllowPay>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLHrBasCareerAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
             <CareerSeq>${item.CareerSeq || 0}</CareerSeq>
              <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
              <CoDeptName>${item.CoDeptName || ''}</CoDeptName>
              <JpName>${item.JpName || ''}</JpName>
              <Duty>${item.Duty || ''}</Duty>
              <CoNm>${item.CoNm || ''}</CoNm>
              <EntDate>${item.EntDate || ''}</EntDate>
              <RetDate>${item.RetDate || ''}</RetDate>
              <UMChrgWkSeq>${item.UMChrgWkSeq || 0}</UMChrgWkSeq>
              <ChrgWk>${item.ChrgWk || ''}</ChrgWk>
              <Area><${item.Area || ''}/Area>
              <BusType>${item.BusType || ''}</BusType>
              <UMRetReason>${item.UMRetReason || 0}</UMRetReason>
              <AppCarTerm>${item.AppCarTerm || 0}</AppCarTerm>
              <IsGrp>${item.IsGrp || 0}</IsGrp>
              <Rem>${item.Rem || ''}</Rem>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLHrBasPjtCareerAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Status>0</Status>
            <Selected>1</Selected>
              <PjtCareerSeq>${item.PjtCareerSeq || 0}</PjtCareerSeq>
              <UMPjtType>${item.UMPjtType || ''}</UMPjtType>
              <PjtName>${item.PjtName || ''}</PjtName>
              <EntDate>${item.EntDate || ''}</EntDate>
              <RetDate>${item.RetDate || ''}</RetDate>
              <PerRole>${item.PerRole || ''}</PerRole>
              <PjtRemark>${item.PjtRemark || ''}</PjtRemark>
              <UMChrgWkSeq>${item.UMChrgWkSeq || 0}</UMChrgWkSeq>
              <ChrgWk>${item.ChrgWk || ''}</ChrgWk>
              <OrdPlace>${item.OrdPlace || ''}</OrdPlace>
              <JobSeq>${item.JobSeq || ''}</JobSeq>
              <AppTermMm>${item.AppTermMm || ''}</AppTermMm>
              <AppRate>${item.AppRate || ''}</AppRate>
              <Rem>${item.Rem || ''}</Rem>
              <EmpSeq>${item.EmpSeq || ''}</EmpSeq>
              <CareerSeq>${item.CareerSeq || ''}</CareerSeq>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLHRBasMilitaryAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
             <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
              <Status>0</Status>
              <Selected>0</Selected>
              <UMMilSrvSeq>${item.UMMilSrvSeq || 0}</UMMilSrvSeq>
              <MilSoldierNo>${item.MilSoldierNo || ''}</MilSoldierNo>
              <UMMilKindSeq>${item.UMMilKindSeq || 0}</UMMilKindSeq>
              <UMMilBrnchSeq>${item.UMMilBrnchSeq || 0}</UMMilBrnchSeq>
              <UMMilClsSeq>${item.UMMilClsSeq || 0}</UMMilClsSeq>
              <UMMilSpcSeq>${item.UMMilSpcSeq || 0}</UMMilSpcSeq>
              <UMMilRsrcSeq>${item.UMMilRsrcSeq || 0}</UMMilRsrcSeq>
              <MilEnrolDate>${item.MilEnrolDate || ''}</MilEnrolDate>
              <MilTransDate>${item.MilTransDate || ''}</MilTransDate>
              <UMMilRnkSeq>${item.UMMilRnkSeq || 0}</UMMilRnkSeq>
              <UMMilDschrgTypeSeq>${item.UMMilDschrgTypeSeq || 0}</UMMilDschrgTypeSeq>
              <UMMilVetTypeSeq>${item.UMMilVetTypeSeq || 0}</UMMilVetTypeSeq>
              <UMMilExTypeSeq>${item.UMMilExTypeSeq || 0}</UMMilExTypeSeq>
              <MilExNo>${item.MilExNo || ''}</MilExNo>
              <MilExBegDate>${item.MilExBegDate || ''}</MilExBegDate>
              <MilExEndDate>${item.MilExEndDate || ''}</MilExEndDate>
              <Remark>${item.Remark || ''}</Remark>
              <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
                <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLHrBasLicenseCheckAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
            <WorkingTag>${WorkingTag}</WorkingTag>
            <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
            <DataSeq>${item.IdxNo || item.IDX_NO}</DataSeq>
            <Selected>0</Selected>
            <Status>0</Status>
            <LicenseSeq>${item.LicenseSeq || 0}</LicenseSeq>
            <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
            <UMLicSeq>${item.UMLicSeq || 0}</UMLicSeq>
            <IssueInst>${item.IssueInst || ''}</IssueInst>
            <LicNo>${item.LicNo || ''}</LicNo>
            <AcqDate>${item.AcqDate || ''}</AcqDate>
            <ValDate>${item.ValDate || ''}</ValDate>
            <IsAllowPay>${this.parseTo01(item.IsAllowPay)}</IsAllowPay>
            <IsLaw>${this.parseTo01(item.IsLaw)}</IsLaw>
            <Rem>${item.Rem || ''}</Rem>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }
  generateXMLEmpUserDefineAUD(result: Array<{ [key: string]: any }>, WorkingTag: string): string {
    const xmlBlocks = result
      .map((item, index) => `
              <DataBlock1>
           <WorkingTag>${WorkingTag}</WorkingTag>
          <IDX_NO>${item.IdxNo || item.IDX_NO}</IDX_NO>
          <DataSeq>${index + 1}</DataSeq>
          <Selected>0</Selected>
          <Status>0</Status>
          <EmpSeq>${item.EmpSeq || 0}</EmpSeq>
          <Title>${item.Title || 0}</Title>
          <Serl>${item.Serl || 0}</Serl>
          <ValName>${item.ValName || 0}</ValName>
          <ValSeq>0</ValSeq>
          <SMInputType>${item.SMInputType || 0}</SMInputType>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          </DataBlock1>
          
          `)
      .join('');

    return `<ROOT>${xmlBlocks}</ROOT>`;
  }

  generateXMLSBasOrgJobClassQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
           <WorkingTag>U</WorkingTag>
          <IDX_NO>${result?.IdxNo}</IDX_NO>
          <DataSeq>1</DataSeq>
          <Status>0</Status>
          <Selected>0</Selected>
          <UMJobClass>${result?.UMJobClass || 0}</UMJobClass>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLEmpUserDefineQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
            <WorkingTag>U</WorkingTag>
          <IDX_NO>1</IDX_NO>
          <Status>0</Status>
          <DataSeq>1</DataSeq>
          <Selected>1</Selected>
          <TABLE_NAME>DataBlock1</TABLE_NAME>
          <IsChangedMst>0</IsChangedMst>
           <EmpSeq>${result.EmpSeq || 0}</EmpSeq>
        </DataBlock1>
      </ROOT>`;
  }
  generateXMLAdmOrdEmpListQ(result: any): string {
    return `<ROOT>
        <DataBlock1>
           <WorkingTag>U</WorkingTag>
              <IDX_NO>1</IDX_NO>
              <Status>0</Status>
              <DataSeq>1</DataSeq>
              <Selected>1</Selected>
              <TABLE_NAME>DataBlock1</TABLE_NAME>
              <IsChangedMst>0</IsChangedMst>
             <EmpSeq>${result.EmpSeq || 0}</EmpSeq>
              <IsOrdOuery>1</IsOrdOuery>
        </DataBlock1>
      </ROOT>`;
  }
}
