import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Menu, Form } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar';
import ErrorListModal from '../default/errorListModal'
import HrEmplnSeqAction from '../../components/actions/hr/hrEmplnSeqAction'
import HrEmplnSeqQuery from '../../components/query/hr/hrEmplnSeqQuery'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import {
    CalendarDays,
    ClipboardCheck,
    Users,
    MapPin,
    ShieldCheck,
    BookOpenCheck,
    Languages,
    Medal,
    IdCard,
    HeartPulse,
    BriefcaseBusiness,
    Globe,
    Info,
    FileStack,
    Package,
    MonitorSmartphone,
    Plane,
    Tag,
    UserRoundSearch
} from 'lucide-react';
import Emp1Table from '../../components/table/emp/emp1Table'
import Emp0Table from '../../components/table/emp/emp0Table'
import Emp2Table from '../../components/table/emp/emp2Table'
import Emp5Table from '../../components/table/emp/emp5Table'
import Emp3Table from '../../components/table/emp/emp3Table'
import Emp4Table from '../../components/table/emp/emp4Table'
import Emp6Table from '../../components/table/emp/emp6Table'
import Emp7Table from '../../components/table/emp/emp7Table'
import Emp8Table from '../../components/table/emp/emp8Table'
import Emp9Table from '../../components/table/emp/emp9Table'
import Emp10Table from '../../components/table/emp/emp10Table'
import Emp11Table from '../../components/table/emp/emp11Table'
import Emp12Table from '../../components/table/emp/emp12Table'
import Emp13Table from '../../components/table/emp/emp13Table'
import Emp14Table from '../../components/table/emp/emp14Table'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { HandleError } from '../default/handleError'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { filterValidRows } from '../../../utils/filterUorA'
import { PostQHrEmpOne } from '../../../features/hr/hrEmpOne/postQHrEmpOne'
import { PostQHrEmpInfo } from '../../../features/hr/hrEmpOne/postQHrEmpInfo'
import { PostQHrBaseFamily } from '../../../features/hr/hrBaseFamily/postQHrBaseFamily'
import { PostDHrBaseFamily } from '../../../features/hr/hrBaseFamily/postDHrBaseFamily'
import { PostAHrBaseFamily } from '../../../features/hr/hrBaseFamily/postAHrBaseFamily'
import { PostUHrBaseFamily } from '../../../features/hr/hrBaseFamily/postUHrBaseFamily'
import { PostQHrBasAddress } from '../../../features/hr/hrBasAddress/postQHrBasAddress'
import { PostDHrBasAddress } from '../../../features/hr/hrBasAddress/postDHrBasAddress'
import { PostUHrBasAddress } from '../../../features/hr/hrBasAddress/postUHrBasAddress'
import { PostAHrBasAddress } from '../../../features/hr/hrBasAddress/postAHrBasAddress'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { PostQHrBasAcademi } from '../../../features/hr/hrBasAcademi/postQHrBasAcademi'
import { PostDHrBasAcademi } from '../../../features/hr/hrBasAcademi/postDHrBasAcademi'
import { PostAHrBasAcademi } from '../../../features/hr/hrBasAcademi/postAHrBasAcademi'
import { PostUHrBasAcademi } from '../../../features/hr/hrBasAcademi/postUHrBasAcademi'
import { PostQHrBaseLangSkill } from '../../../features/hr/hrBasLangSkill/postQHrBaseLangSkill'
import { PostDHrBaseLangSkill } from '../../../features/hr/hrBasLangSkill/postDHrBaseLangSkill'
import { PostAHrBaseLangSkill } from '../../../features/hr/hrBasLangSkill/postAHrBaseLangSkill'
import { PostUHrBaseLangSkill } from '../../../features/hr/hrBasLangSkill/postUHrBaseLangSkill'
import { PostQHrBasPrzPnl } from '../../../features/hr/hrBasePrzPnl/postQHrBasPrzPnl'
import { PostDHrBasPrzPnl } from '../../../features/hr/hrBasePrzPnl/postDHrBasPrzPnl'
import { PostAHrBasPrzPnl } from '../../../features/hr/hrBasePrzPnl/postAHrBasPrzPnl'
import { PostUHrBasPrzPnl } from '../../../features/hr/hrBasePrzPnl/postUHrBasPrzPnl'
import { PostQHrBaseTravel } from '../../../features/hr/hrBasTravel/postQHrBaseTravel'
import { PostDHrBaseTravel } from '../../../features/hr/hrBasTravel/postDHrBaseTravel'
import { PostAHrBaseTravel } from '../../../features/hr/hrBasTravel/postAHrBaseTravel'
import { PostUHrBaseTravel } from '../../../features/hr/hrBasTravel/postUHrBaseTravel'
import { PostHrBasCareerQ } from '../../../features/hr/hrBasCareer/postHrBasCareerQ'
import { PostHrBasCareerD } from '../../../features/hr/hrBasCareer/postHrBasCareerD'

import { PostHrBasCareerA } from '../../../features/hr/hrBasCareer/postHrBasCareerA'
import { PostHrBasCareerU } from '../../../features/hr/hrBasCareer/postHrBasCareerU'
import { PostHrBasPjtCareerQ } from '../../../features/hr/hrBasPjtCareer/postHrBasPjtCareerQ'
import HrBasCareerSeqQuery from '../../components/query/hr/hrBasCareerSeqQuery'
import { PostHrBasPjtCareerD } from '../../../features/hr/hrBasPjtCareer/postHrBasPjtCareerD'
import { PostHrBasPjtCareerA } from '../../../features/hr/hrBasPjtCareer/postHrBasPjtCareerA'
import { PostHrBasPjtCareerU } from '../../../features/hr/hrBasPjtCareer/postHrBasPjtCareerU'

import { HrBasMilitaryA } from '../../../features/hr/hrBasMilitary/HrBasMilitaryA'
import { HrBasMilitaryU } from '../../../features/hr/hrBasMilitary/HrBasMilitaryU'
import { HrBasMilitaryD } from '../../../features/hr/hrBasMilitary/HrBasMilitaryD'
import { HrBasMilitaryQ } from '../../../features/hr/hrBasMilitary/HrBasMilitaryQ'

import { HrBasLicenseCheckA } from '../../../features/hr/hrBasLicenseCheck/HrBasLicenseCheckA'
import { HrBasLicenseCheckU } from '../../../features/hr/hrBasLicenseCheck/HrBasLicenseCheckU'
import { HrBasLicenseCheckD } from '../../../features/hr/hrBasLicenseCheck/HrBasLicenseCheckD'
import { HrBasLicenseCheckQ } from '../../../features/hr/hrBasLicenseCheck/HrBasLicenseCheckQ'

import { EmpUserDefineQ } from '../../../features/hr/empUserDefine/EmpUserDefineQ'
import { AdmOrdEmpListQ } from '../../../features/hr/empUserDefine/AdmOrdEmpListQ'
import { EmpUserDefineU } from '../../../features/hr/empUserDefine/EmpUserDefineU'

import { HrFileQ } from '../../../features/hr/hrFile/HrFileQ'
import { HrFileD } from '../../../features/hr/hrFile/HrFileD'
import Emp15Table from '../../components/table/emp/emp15Table'
import { HrEmpInfoQ } from '../../../features/print/hr/hrEmpInfoQ'
import { HOST_API_SERVER_14 } from '../../../services'



export default function HrEmplnSeq({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols1 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },

        {
            title: 'Ngày vào nhóm', id: 'JoinGroupDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày vào', id: 'JoinDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày hết hạn thực tập', id: 'InternEndDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày nghỉ việc', id: 'LeaveDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày bắt đầu tính trợ cấp thôi việc', id: 'ResignAllowanceStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày quyết toán giữa kỳ', id: 'MidTermSettlementDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày bắt đầu tính nghỉ phép năm', id: 'AnnualLeaveStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày bắt đầu tính nghỉ phép tháng', id: 'MonthlyLeaveStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày bắt đầu tính thời gian làm việc liên tục', id: 'ContinuousWorkStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày chuyển đến', id: 'TransferInDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày chuyển đi', id: 'TransferOutDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày điều chỉnh lương kỳ sau', id: 'NextSalaryAdjustDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày tiêu chuẩn bắt đầu thăng chức', id: 'PromotionStandardStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày làm việc ở bộ phận hiện tại', id: 'CurrentDeptStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày làm việc tại vị trí của bộ phận hiện tại', id: 'CurrentDeptPosStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày làm việc ở chức vụ hiện tại', id: 'CurrentPositionStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,

            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày làm việc ở cấp bậc hiện tại', id: 'CurrentGradeStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày làm việc với trách nhiệm công việc hiện tại', id: 'CurrentDutyStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày làm việc với bậc lương hiện tại', id: 'CurrentSalaryGradeStartDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày dự định kết thúc thực tập', id: 'ExpectedInternEndDate', kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

    ], []);

    const defaultCols2 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        { title: 'Ngày bổ nhiệm', id: 'OrdDate', kind: 'Date', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Cấp bậc', id: 'PosName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Bộ phận làm việc', id: 'DeptName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Nội dung bổ nhiệm', id: 'OrdName', kind: 'Text', readonly: false, width: 240, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Lý do bổ nhiệm', id: 'Remark', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Ngày kết thúc quyết định', id: 'OrdEndDate', kind: 'Date', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Chức vị', id: 'UMPgName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Thuộc bộ phận', id: 'UMJpName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Phân loại ra quyết định', id: 'SMSourceTypeName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Part', id: 'UMJoName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Section', id: 'PtName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Team', id: 'UMJdName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Bậc lương', id: 'LevelName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Vị trí', id: 'JobName', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Trạng thái làm việc', id: 'EntRetTypeName', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Nhóm lương', id: 'UMWsName', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Hình thái lương', id: 'PuName', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Trưởng bộ phận', id: 'IsBoss', kind: 'CheckBox', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Cuối cùng hay không', id: 'IsLast', kind: 'CheckBox', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Có công việc cuối cùng hay không', id: 'IsOrdDateLast', kind: 'CheckBox', readonly: false, width: 240, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Ghi chú', id: 'Contents', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    ], []);
    const defaultCols3 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },
        {
            title: 'Tên gia đình',
            id: 'FamilyName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: 'Số chứng minh thư nhân dân',
            id: 'FamilyResidID',
            kind: 'Text',
            width: 200,
            hasMenu: true,
            readonly: false,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Tên quan hệ',
            id: 'UMRelName',
            kind: 'Text',
            width: 130,
            readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: 'Tên học lực',
            id: 'UMSchCareerName',
            kind: 'Text',
            width: 160, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Nghề nghiệp',
            id: 'Occupation',
            kind: 'Text',
            width: 120, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Số điện thoại',
            id: 'FamilyPhone',
            kind: 'Text',
            width: 130, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Dương/Âm',
            id: 'SMBirthTypeName',
            kind: 'Text',
            width: 100, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Ngày sinh',
            id: 'BirthDate',
            kind: 'Date',
            width: 120, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Ngày đăng ký',
            id: 'RegDate',
            kind: 'Date',
            width: 120, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Ngày kết thúc',
            id: 'EndDate',
            kind: 'Date',
            width: 120, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Người có công với quốc gia hay không',
            id: 'IsNationMerit',
            kind: 'Text',
            width: 200, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Quốc tịch người nước ngoài',
            id: 'UMNationName',
            kind: 'Text',
            width: 150, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Có khuyết tật hay không',
            id: 'IsHandi',
            kind: 'Text',
            width: 160, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Tên loại hình khuyết tật',
            id: 'UMHandiTypeName',
            kind: 'Text',
            width: 180, readonly: false,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Tên cấp bậc khuyết tật',
            id: 'UMHandiGrdName',
            kind: 'Text',
            width: 160,
            hasMenu: true, readonly: false,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Ngày đăng ký khuyết tật',
            id: 'HandiAppdate',
            kind: 'Date',
            width: 160,
            hasMenu: true,
            visible: true, readonly: false,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Sống chung',
            id: 'IsSameRoof',
            kind: 'Text',
            width: 120,
            hasMenu: true, readonly: false,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Có người phụ thuộc',
            id: 'IsDepend',
            kind: 'Text',
            width: 150,
            hasMenu: true, readonly: false,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Có đối tượng nhận trợ cấp gia đình',
            id: 'IsPayAllow',
            kind: 'Text',
            width: 200,
            hasMenu: true, readonly: false,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Người phụ thuộc có bảo hiểm y tế hay không',
            id: 'IsMed',
            kind: 'Text',
            width: 260,
            hasMenu: true, readonly: false,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Đã chết hay chưa',
            id: 'IsDeath',
            kind: 'Text',
            width: 150,
            hasMenu: true, readonly: false,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Thứ tự',
            id: 'DispSeq',
            kind: 'Number',
            width: 80,
            hasMenu: true, readonly: false,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
    ], [t]);
    const defaultCols4 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },
        {
            title: 'Loại địa chỉ',
            id: 'SMBirthTypeName',
            kind: 'Text',
            readonly: false,
            width: 280,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: 'Số zip',
            id: 'ZipNo',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Địa chỉ 1',
            id: 'Addr',
            kind: 'Text',
            readonly: false,
            width: 300,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Địa chỉ 2',
            id: 'Addr2',
            kind: 'Text',
            readonly: false,
            width: 300,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Địa chỉ bằng tiếng Anh 1',
            id: 'AddrEng1',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Địa chỉ bằng tiếng Anh 2',
            id: 'AddrEng2',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

    ], []);
    const defaultCols5 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        { title: 'Phân loại binh dịch', id: 'UMMilSrvName', kind: 'Text', readonly: false, width: 220, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Số quân', id: 'MilSoldierNo', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Quân chủng', id: 'UMMilKindName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Binh chủng', id: 'UMMilBrnchName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Loại binh dịch (nghĩa vụ nhập ngũ)', id: 'UMMilClsName', kind: 'Text', readonly: false, width: 260, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Chức vụ trong quân đội', id: 'UMMilSpcName', kind: 'Text', readonly: false, width: 220, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Phân loại nguồn lực', id: 'UMMilRsrcName', kind: 'Text', readonly: false, width: 220, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Ngày nhập ngũ', id: 'MilEnrolDate', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Ngày chuyển', id: 'MilTransDate', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Chức vụ, cấp bậc (quân đội)', id: 'UMMilRnkName', kind: 'Text', readonly: false, width: 240, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Phân loại xuất ngũ', id: 'UMMilDschrgTypeName', kind: 'Text', readonly: false, width: 220, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Phân loại nhóm dự bị, quân dự bị', id: 'UMMilVetTypeName', kind: 'Text', readonly: false, width: 260, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Phân loại trường hợp đặc biệt', id: 'UMMilExTypeName', kind: 'Text', readonly: false, width: 250, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Số chỉ định trường hợp đặc biệt, ngoại lệ', id: 'MilExNo', kind: 'Text', readonly: false, width: 260, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Ngày chỉ định trường hợp đặc biệt', id: 'MilExBegDate', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Ngày hết hạn ngoại lệ', id: 'MilExEndDate', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: 'Ghi chú', id: 'Remark', kind: 'Text', readonly: false, width: 250, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    ], []);
    const defaultCols6 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },

        {
            title: 'Học lực, trình độ học vấn',
            id: 'UMSchCareerName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: 'Tên trường học',
            id: 'EtcSchNm',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Phân loại ngày đêm',
            id: 'SMDayNightTypeName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Năm nhập học',
            id: 'EntYm',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Tháng, năm tốt nghiệp',
            id: 'GrdYm',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Phân loại học vị',
            id: 'UMDegreeTypeName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Số học vị',
            id: 'DegreeNo',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Tên luận văn',
            id: 'ThesisNm',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Địa chỉ',
            id: 'Loc',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

    ], [t]);

    const defaultCols7 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },

        {
            title: 'Ngôn ngữ',
            id: 'UMLanguageTypeName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Loại chứng nhận',
            id: 'UMAuthTypeName',
            kind: 'Text',
            readonly: false,
            width: 180,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Điểm số',
            id: 'Score',
            kind: 'Number',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Cấp bậc',
            id: 'UMGradeName',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: 'Có thanh toán lương không',
            id: 'IsAllowPay',
            kind: 'Boolean',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ghi chú',
            id: 'Remark',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
    ], []);

    const defaultCols8 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },

        {
            title: 'Loại khen thưởng',
            id: 'SMPrzPnlTypeName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày bắt đầu thưởng phạt',
            id: 'PrzPnlFrDate',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày kết thúc thưởng phạt',
            id: 'PrzPnlToDate',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Phân loại trong - ngoài công ty',
            id: 'SMInOutTypeName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Khen thưởng kỷ luật',
            id: 'UMPrzPnlName',
            kind: 'Text',
            readonly: false,
            width: 180,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Lý do thưởng phạt',
            id: 'PrzPnlReason',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Cơ quan thưởng phạt',
            id: 'PrzPnlInst',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Trả lương/giảm lương hay không',
            id: 'IsAllowDeduc',
            kind: 'Boolean',
            readonly: false,
            width: 180,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        }
    ], []);

    const defaultCols9 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },
        {
            title: 'Tên phân loại giấy phép hành nghề',
            id: 'UMLicName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Cơ quan cấp',
            id: 'IssueInst',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Số bằng cấp chuyên môn',
            id: 'LicNo',
            kind: 'Text',
            readonly: false,
            width: 180,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày thu hồi',
            id: 'AcqDate',
            kind: 'Date',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày có hiệu lực',
            id: 'ValDate',
            kind: 'Date',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Có thanh toán lương không',
            id: 'IsAllowPay',
            kind: 'Boolean',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Có tư cách pháp định hay không',
            id: 'IsLaw',
            kind: 'Boolean',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ghi chú',
            id: 'Rem',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
    ], []);
    const defaultCols10 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },
        {
            title: 'Tên phân loại giấy phép hành nghề',
            id: 'LicenseCategoryName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Cơ quan cấp',
            id: 'IssuingAuthority',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Số bằng cấp chuyên môn',
            id: 'CertificateNumber',
            kind: 'Text',
            readonly: false,
            width: 180,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày thu hồi',
            id: 'RevokedDate',
            kind: 'Date',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày có hiệu lực',
            id: 'EffectiveDate',
            kind: 'Date',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Có thanh toán lương không',
            id: 'IsAllowPay',
            kind: 'Boolean',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Có tư cách pháp định hay không',
            id: 'HasLegalCapacity',
            kind: 'Boolean',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ghi chú',
            id: 'Remark',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
    ], []);
    const defaultCols11 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },

        {
            title: 'Ngày xuất phát',
            id: 'DptDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày đến',
            id: 'ArvDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Loại công tác',
            id: 'SMAbrdName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Quốc gia',
            id: 'UMNationName',
            kind: 'Text',
            readonly: false,
            width: 180,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Khu vực công tác',
            id: 'TripRec',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Khu vực công tác (2)',
            id: 'TripArea',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ghi chú',
            id: 'Rem',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        }
    ], []);
    const defaultCols12 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },

        {
            title: 'Tên công ty làm việc',
            id: 'CoNm',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày bắt đầu',
            id: 'EntDate',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày kết thúc',
            id: 'RetDate',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Công việc phụ trách',
            id: 'UMChrgWkName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Công việc phụ trách khác',
            id: 'ChrgWk',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Nơi làm việc',
            id: 'Area',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Chủng loại',
            id: 'BusType',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Lý do thôi việc',
            id: 'UMRetReasonName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Số tháng kinh nghiệm được công nhận',
            id: 'AppCarTerm',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Có phải tập đoàn hay không',
            id: 'IsGrp',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ghi chú',
            id: 'Rem',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
    ], []);
    const defaultCols13 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        {
            title: 'Phân loại dự án',
            id: 'UMPjtTypeName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Dự án',
            id: 'PjtName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày bắt đầu',
            id: 'EntDate',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ngày kết thúc',
            id: 'RetDate',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Vai trò phụ trách',
            id: 'PerRole',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Khái quát dự án',
            id: 'PjtRemark',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Công việc phụ trách',
            id: 'ChrgWk',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Công việc phụ trách khác',
            id: 'UMChrgWkName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Nơi đặt hàng',
            id: 'OrdPlace',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Tên công việc',
            id: 'JobName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Số tháng được xác nhận',
            id: 'AppTermMm',
            kind: 'Text', // Có thể dùng 'Number' nếu hỗ trợ
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Tỷ lệ áp dụng',
            id: 'AppRate',
            kind: 'Text', // Có thể dùng 'Number' nếu hỗ trợ
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Ghi chú',
            id: 'Rem',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
    ], []);
    const defaultCols14 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        {
            title: 'Tên thông tin bổ sung',
            id: 'Title',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Giá trị thông tin bổ sung',
            id: 'ValName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

    ], []);
    const defaultCols15 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        {
            title: 'Originalname',
            id: 'Originalname',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Filename',
            id: 'Filename',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Size',
            id: 'Size',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: 'Path',
            id: 'Path',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

    ], []);
    const [gridData, setGridData] = useState([])
    const [dataRoot, setDataRoot] = useState([])
    const [dataRootInfo, setDataRootInfo] = useState([])
    const [gridData2, setGridData2] = useState([])
    const [gridData3, setGridData3] = useState([])
    const [gridData4, setGridData4] = useState([])
    const [gridData5, setGridData5] = useState([])
    const [gridData6, setGridData6] = useState([])
    const [gridData7, setGridData7] = useState([])
    const [gridData8, setGridData8] = useState([])
    const [gridData9, setGridData9] = useState([])
    const [gridData10, setGridData10] = useState([])
    const [gridData11, setGridData11] = useState([])
    const [gridData12, setGridData12] = useState([])
    const [gridData13, setGridData13] = useState([])
    const [gridData14, setGridData14] = useState([])
    const [gridData15, setGridData15] = useState([])
    const [gridAvatar, setGridAvatar] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection2, setSelection2] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection3, setSelection3] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection4, setSelection4] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection5, setSelection5] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection6, setSelection6] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection7, setSelection7] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })

    const [selection8, setSelection8] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })

    const [selection9, setSelection9] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection10, setSelection10] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection11, setSelection11] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection12, setSelection12] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection13, setSelection13] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection14, setSelection14] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection15, setSelection15] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearch2, setShowSearch2] = useState(false)
    const [showSearch3, setShowSearch3] = useState(false)
    const [showSearch4, setShowSearch4] = useState(false)
    const [showSearch5, setShowSearch5] = useState(false)
    const [showSearch6, setShowSearch6] = useState(false)
    const [showSearch7, setShowSearch7] = useState(false)
    const [showSearch8, setShowSearch8] = useState(false)
    const [showSearch9, setShowSearch9] = useState(false)
    const [showSearch10, setShowSearch10] = useState(false)
    const [showSearch11, setShowSearch11] = useState(false)
    const [showSearch12, setShowSearch12] = useState(false)
    const [showSearch13, setShowSearch13] = useState(false)
    const [showSearch14, setShowSearch14] = useState(false)
    const [showSearch15, setShowSearch15] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [addedRows1, setAddedRows1] = useState([])
    const [addedRows2, setAddedRows2] = useState([])
    const [addedRows3, setAddedRows3] = useState([])
    const [addedRows4, setAddedRows4] = useState([])
    const [addedRows5, setAddedRows5] = useState([])
    const [addedRows6, setAddedRows6] = useState([])
    const [addedRows7, setAddedRows7] = useState([])
    const [addedRows8, setAddedRows8] = useState([])
    const [addedRows9, setAddedRows9] = useState([])
    const [addedRows10, setAddedRows10] = useState([])
    const [addedRows11, setAddedRows11] = useState([])
    const [addedRows12, setAddedRows12] = useState([])
    const [addedRows13, setAddedRows13] = useState([])
    const [addedRows14, setAddedRows14] = useState([])
    const [addedRows15, setAddedRows15] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRowsToAdd2, setNumRowsToAdd2] = useState(null)
    const [numRowsToAdd3, setNumRowsToAdd3] = useState(null)
    const [numRowsToAdd4, setNumRowsToAdd4] = useState(null)
    const [numRowsToAdd5, setNumRowsToAdd5] = useState(null)
    const [numRowsToAdd6, setNumRowsToAdd6] = useState(null)
    const [numRowsToAdd7, setNumRowsToAdd7] = useState(null)
    const [numRowsToAdd8, setNumRowsToAdd8] = useState(null)
    const [numRowsToAdd9, setNumRowsToAdd9] = useState(null)
    const [numRowsToAdd10, setNumRowsToAdd10] = useState(null)
    const [numRowsToAdd11, setNumRowsToAdd11] = useState(null)
    const [numRowsToAdd12, setNumRowsToAdd12] = useState(null)
    const [numRowsToAdd13, setNumRowsToAdd13] = useState(null)
    const [numRowsToAdd14, setNumRowsToAdd14] = useState(null)
    const [numRowsToAdd15, setNumRowsToAdd15] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRows1, setNumRows1] = useState(0)
    const [numRows2, setNumRows2] = useState(0)
    const [numRows3, setNumRows3] = useState(0)
    const [numRows4, setNumRows4] = useState(0)
    const [numRows5, setNumRows5] = useState(0)
    const [numRows6, setNumRows6] = useState(0)
    const [numRows7, setNumRows7] = useState(0)
    const [numRows8, setNumRows8] = useState(0)
    const [numRows9, setNumRows9] = useState(0)
    const [numRows10, setNumRows10] = useState(0)
    const [numRows11, setNumRows11] = useState(0)
    const [numRows12, setNumRows12] = useState(0)
    const [numRows13, setNumRows13] = useState(0)
    const [numRows14, setNumRows14] = useState(0)
    const [numRows15, setNumRows15] = useState(0)

    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [helpData09, setHelpData09] = useState([])

    const [helpData10, setHelpData10] = useState([])
    const [helpData11, setHelpData11] = useState([])
    const [helpData12, setHelpData12] = useState([])
    const [helpData13, setHelpData13] = useState([])
    const [helpData14, setHelpData14] = useState([])
    const [helpData15, setHelpData15] = useState([])
    const [helpData16, setHelpData16] = useState([])
    const [helpData17, setHelpData17] = useState([])
    const [helpData18, setHelpData18] = useState([])
    const [helpData19, setHelpData19] = useState([])
    const [helpData20, setHelpData20] = useState([])
    const [helpData21, setHelpData21] = useState([])
    const [helpData22, setHelpData22] = useState([])
    const [helpData23, setHelpData23] = useState([])
    const [helpData24, setHelpData24] = useState([])
    const [helpData25, setHelpData25] = useState([])

    const [helpData26, setHelpData26] = useState([]);
    const [helpData27, setHelpData27] = useState([]);
    const [helpData28, setHelpData28] = useState([]);
    const [helpData29, setHelpData29] = useState([]);
    const [helpData30, setHelpData30] = useState([]);
    const [helpData31, setHelpData31] = useState([]);
    const [helpData32, setHelpData32] = useState([]);
    const [helpData33, setHelpData33] = useState([]);
    const [helpData34, setHelpData34] = useState([]);
    const [helpData35, setHelpData35] = useState([]);
    const [helpData36, setHelpData36] = useState([]);
    const [helpData37, setHelpData37] = useState([]);
    const [helpData38, setHelpData38] = useState([]);
    const [helpData39, setHelpData39] = useState([]);
    const [helpData40, setHelpData40] = useState([]);
    const [helpData41, setHelpData41] = useState([]);
    const [helpData42, setHelpData42] = useState([]);
    const [helpData43, setHelpData43] = useState([]);
    const [helpData44, setHelpData44] = useState([]);
    const [helpData45, setHelpData45] = useState([]);
    const [helpData46, setHelpData46] = useState([]);








    const [dataSeq, setDataSeq] = useState([])

    const [current, setCurrent] = useState('0');
    const [checkPageA, setCheckPageA] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState('')
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch1, setDataSheetSearch1] = useState([])
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [CoNm, setCoNm] = useState('')
    const [keyPath, setKeyPath] = useState(null)
    const [form] = Form.useForm();



    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault()
            event.returnValue = 'Bạn có chắc chắn muốn rời đi không?'
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_01_a',
            defaultCols1.filter((col) => col.visible)
        )
    )
    const [cols2, setCols2] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_02_a',
            defaultCols2.filter((col) => col.visible)
        )
    )
    const [cols3, setCols3] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_03_a',
            defaultCols3.filter((col) => col.visible)
        )
    )
    const [cols4, setCols4] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_04_a',
            defaultCols4.filter((col) => col.visible)
        )
    )
    const [cols5, setCols5] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_05_a',
            defaultCols5.filter((col) => col.visible)
        )
    )
    const [cols6, setCols6] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_06_a',
            defaultCols6.filter((col) => col.visible)
        )
    )
    const [cols7, setCols7] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_07_a',
            defaultCols7.filter((col) => col.visible)
        )
    )

    const [cols8, setCols8] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_08_a',
            defaultCols8.filter((col) => col.visible)
        )
    )
    const [cols9, setCols9] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_09_a',
            defaultCols9.filter((col) => col.visible)
        )
    )
    const [cols10, setCols10] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_10_a',
            defaultCols10.filter((col) => col.visible)
        )
    )
    const [cols11, setCols11] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_11_a',
            defaultCols11.filter((col) => col.visible)
        )
    )
    const [cols12, setCols12] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_12_a',
            defaultCols12.filter((col) => col.visible)
        )
    )
    const [cols13, setCols13] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_13_a',
            defaultCols13.filter((col) => col.visible)
        )
    )
    const [cols14, setCols14] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_14_a',
            defaultCols14.filter((col) => col.visible)
        )
    )
    const [cols15, setCols15] = useState(() =>
        loadFromLocalStorageSheet(
            'emp_15_a',
            defaultCols15.filter((col) => col.visible)
        )
    )
    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )
    const handleRowAppend2 = useCallback(
        (numRowsToAdd2) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols2, setGridData2, setNumRows2, setAddedRows2, numRowsToAdd2)
        },
        [cols2, setGridData2, setNumRows2, setAddedRows2, numRowsToAdd2]
    )

    const handleRowAppend3 = useCallback(
        (numRowsToAdd3) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols3, setGridData3, setNumRows3, setAddedRows3, numRowsToAdd3)
        },
        [cols3, setGridData3, setNumRows3, setAddedRows3, numRowsToAdd3]
    )

    const handleRowAppend4 = useCallback(
        (numRowsToAdd4) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols4, setGridData4, setNumRows4, setAddedRows4, numRowsToAdd4)
        },
        [cols4, setGridData4, setNumRows4, setAddedRows4, numRowsToAdd4]
    )

    const handleRowAppend5 = useCallback(
        (numRowsToAdd5) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols5, setGridData5, setNumRows5, setAddedRows5, numRowsToAdd5)
        },
        [cols5, setGridData5, setNumRows5, setAddedRows5, numRowsToAdd5]
    )

    const handleRowAppend6 = useCallback(
        (numRowsToAdd6) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols6, setGridData6, setNumRows6, setAddedRows6, numRowsToAdd6)
        },
        [cols6, setGridData6, setNumRows6, setAddedRows6, numRowsToAdd6]
    )

    const handleRowAppend7 = useCallback(
        (numRowsToAdd7) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols7, setGridData7, setNumRows7, setAddedRows7, numRowsToAdd7)
        },
        [cols7, setGridData7, setNumRows7, setAddedRows7, numRowsToAdd7]
    )

    const handleRowAppend8 = useCallback(
        (numRowsToAdd8) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols8, setGridData8, setNumRows8, setAddedRows8, numRowsToAdd8)
        },
        [cols8, setGridData8, setNumRows8, setAddedRows8, numRowsToAdd8]
    )

    const handleRowAppend9 = useCallback(
        (numRowsToAdd9) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols9, setGridData9, setNumRows9, setAddedRows9, numRowsToAdd9)
        },
        [cols9, setGridData9, setNumRows9, setAddedRows9, numRowsToAdd9]
    )
    const handleRowAppend10 = useCallback(
        (numRowsToAdd10) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols10, setGridData10, setNumRows10, setAddedRows10, numRowsToAdd10)
        },
        [cols10, setGridData10, setNumRows10, setAddedRows10, numRowsToAdd10]
    )


    const handleRowAppend11 = useCallback(
        (numRowsToAdd11) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols11, setGridData11, setNumRows11, setAddedRows11, numRowsToAdd11)
        },
        [cols11, setGridData11, setNumRows11, setAddedRows11, numRowsToAdd11]
    )

    const handleRowAppend12 = useCallback(
        (numRowsToAdd12) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols12, setGridData12, setNumRows12, setAddedRows12, numRowsToAdd12)
        },
        [cols12, setGridData12, setNumRows12, setAddedRows12, numRowsToAdd12]
    )

    const handleRowAppend13 = useCallback(
        (numRowsToAdd13) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols13, setGridData13, setNumRows13, setAddedRows13, numRowsToAdd13)
        },
        [cols13, setGridData13, setNumRows13, setAddedRows13, numRowsToAdd13]
    )

    const handleRowAppend14 = useCallback(
        (numRowsToAdd14) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols14, setGridData14, setNumRows14, setAddedRows14, numRowsToAdd14)
        },
        [cols14, setGridData14, setNumRows14, setAddedRows14, numRowsToAdd14]
    )
    const handleRowAppend15 = useCallback(
        (numRowsToAdd15) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols15, setGridData15, setNumRows15, setAddedRows15, numRowsToAdd15)
        },
        [cols15, setGridData15, setNumRows15, setAddedRows15, numRowsToAdd15]
    )

    const increaseFetchCount = () => {
        activeFetchCountRef.current += 1;
    };

    const decreaseFetchCount = () => {
        activeFetchCountRef.current -= 1;
        if (activeFetchCountRef.current === 0) {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    };


    const fetchGenericData = async ({
        controllerKey,
        postFunction,
        searchParams,
        useEmptyData = true,
        defaultCols,
        afterFetch = () => { },
    }) => {
        increaseFetchCount();

        if (controllers.current[controllerKey]) {
            controllers.current[controllerKey].abort();
            await new Promise((resolve) => setTimeout(resolve, 10));
            return fetchGenericData({
                controllerKey,
                postFunction,
                searchParams,
                afterFetch,
                defaultCols,
                useEmptyData,
            });
        }

        const controller = new AbortController();
        controllers.current[controllerKey] = controller;
        const { signal } = controller;

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const response = await postFunction(searchParams, signal);
            if (!response.success) {
                HandleError([
                    {
                        success: false,
                        message: response.message || 'Đã xảy ra lỗi vui lòng thử lại!',
                    },
                ]);
            }
            const data = response.success ? (response.data || []) : [];

            let mergedData = updateIndexNo(data);

            if (useEmptyData) {
                const emptyData = updateIndexNo(generateEmptyData(100, defaultCols));
                mergedData = updateIndexNo([...data, ...emptyData]);
            }

            await afterFetch(mergedData);
        } catch (error) {
            let emptyData = [];

            if (useEmptyData) {
                emptyData = updateIndexNo(generateEmptyData(100, defaultCols));
            }

            await afterFetch(emptyData);
        } finally {
            decreaseFetchCount();
            controllers.current[controllerKey] = null;
        }
    };



    const handleSaveAll = useCallback(async () => {
        if (!canCreate) return true;

        const validateRequiredFields = (data, fields) =>
            data.flatMap((row, i) =>
                fields
                    .filter(({ key }) => !row[key]?.toString().trim())
                    .map(({ key, label }) => ({
                        IDX_NO: i + 1,
                        field: key,
                        Name: label,
                        result: `${label} không được để trống`,
                    }))
            );

        const gridMap = [
            {
                gridData, setGridData,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                ],
                apis: { A: null, U: null },
                mapReturnFields: [],
            },
            /*    {
                   gridData: gridData2, setGridData: setGridData2,
                   requiredFields: [
                       { key: 'EmpSeq', label: 'Nhân viên' },
                   ],
                   apis: { A: null, U: null },
                   mapReturnFields: [],
               }, */
            {
                gridData: gridData3, setGridData: setGridData3,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                    { key: 'UMRelName', label: 'Tên quan hệ' },
                    { key: 'FamilyName', label: 'Tên gia đình' },
                ],
                apis: { A: PostAHrBaseFamily, U: PostUHrBaseFamily },
                mapReturnFields: ['FamilySeq', 'EmpSeq'],
            },
            {
                gridData: gridData4, setGridData: setGridData4,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                ],
                apis: { A: PostAHrBasAddress, U: PostUHrBasAddress },
                mapReturnFields: ['AddressSeq', 'EmpSeq'],
            },
            {
                gridData: gridData5, setGridData: setGridData5,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                ],
                apis: { A: HrBasMilitaryA, U: HrBasMilitaryU },
                mapReturnFields: ['UMMilSrvSeq', 'EmpSeq'],
            },
            {
                gridData: gridData6, setGridData: setGridData6,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                ],
                apis: { A: PostAHrBasAcademi, U: PostUHrBasAcademi },
                mapReturnFields: ['AcademicSeq', 'EmpSeq'],
            },
            {
                gridData: gridData7, setGridData: setGridData7,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                    { key: 'UMLanguageTypeName', label: 'Ngôn ngữ' },
                ],
                apis: { A: PostAHrBaseLangSkill, U: PostUHrBaseLangSkill },
                mapReturnFields: ['linguisticSeq', 'EmpSeq'],
            },
            {
                gridData: gridData8, setGridData: setGridData8,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                ],
                apis: { A: PostAHrBasPrzPnl, U: PostUHrBasPrzPnl },
                mapReturnFields: ['PrzPnlSeq', 'EmpSeq'],
            },
            {
                gridData: gridData9, setGridData: setGridData9,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                ],
                apis: { A: HrBasLicenseCheckA, U: HrBasLicenseCheckU },
                mapReturnFields: ['LicenseSeq', 'EmpSeq'],
            },
            {
                gridData: gridData11, setGridData: setGridData11,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                ],
                apis: { A: PostAHrBaseTravel, U: PostUHrBaseTravel },
                mapReturnFields: ['TravelRecSeq', 'EmpSeq'],
            },
            {
                gridData: gridData12, setGridData: setGridData12,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                    { key: 'CoNm', label: 'Tên công ty làm việc' },
                ],
                apis: { A: PostHrBasCareerA, U: PostHrBasCareerU },
                mapReturnFields: ['CareerSeq', 'EmpSeq'],
            },
            {
                gridData: gridData13, setGridData: setGridData13,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },
                    { key: 'AppTermMm', label: 'Số tháng được xác nhận' },
                    { key: 'AppRate', label: 'Tỉ lệ áp dụng' },
                ],
                apis: { A: PostHrBasPjtCareerA, U: PostHrBasPjtCareerU },
                mapReturnFields: ['PjtCareerSeq', 'EmpSeq'],
            },
            {
                gridData: gridData14, setGridData: setGridData14,
                requiredFields: [
                    { key: 'EmpSeq', label: 'Nhân viên' },

                ],
                apis: { A: null, U: EmpUserDefineU },
                mapReturnFields: ['EmpSeq'],
            },
        ];

        const allErrors = [];
        const allPromises = [];

        for (let i = 0; i < gridMap.length; i++) {
            const { gridData, setGridData, apis, requiredFields, mapReturnFields = [] } = gridMap[i];
            const isGrid13 = gridData === gridData13;
            const resulA = filterValidRows(gridData, 'A').map(item => {
                if (isGrid13) {
                    return {
                        ...item,
                        EmpSeq: dataSeq?.EmpSeq,
                        EmpID: dataSeq?.EmpID,
                        CareerSeq: dataSeq?.CareerSeq,
                    };
                } else {
                    return {
                        ...item,
                        EmpSeq: dataSheetSearch[0]?.EmpSeq,
                        DeptSeq: dataSheetSearch[0]?.DeptSeq,
                    };
                }
            });


            const resulU = filterValidRows(gridData, 'U').map(item => {
                if (isGrid13) {
                    return {
                        ...item,
                        EmpSeq: dataSeq?.EmpSeq || item.EmpSeq,
                        EmpID: dataSeq?.EmpID,
                        CareerSeq: dataSeq?.CareerSeq,
                    };
                } else {
                    return {
                        ...item,
                        EmpSeq: dataSheetSearch[0]?.EmpSeq || item.EmpSeq,
                        DeptSeq: dataSheetSearch[0]?.DeptSeq || item.DeptSeq,
                    };
                }
            });

            const errors = [
                ...validateRequiredFields(resulA, requiredFields),
                ...validateRequiredFields(resulU, requiredFields),
            ];

            if (errors.length > 0) {
                allErrors.push(...errors.map(e => ({ ...e, GridIndex: i + 1 })));
                continue;
            }

            if ((resulA.length > 0 && apis?.A) || (resulU.length > 0 && apis?.U)) {
                const apiCall = async () => {
                    const apiCalls = [];
                    if (resulA.length > 0) apiCalls.push(apis.A(resulA));
                    if (resulU.length > 0) apiCalls.push(apis.U(resulU));

                    const results = await Promise.all(apiCalls);
                    const isSuccess = results.every(result => result?.success);

                    if (!isSuccess) {
                        const errorItems = results.flatMap(result => result?.errors || []);
                        throw errorItems;
                    }

                    const [A, U] =
                        resulA.length && resulU.length
                            ? results
                            : resulA.length
                                ? [results[0], []]
                                : [[], results[0]];

                    const AData = A?.data?.logs1 || [];
                    const UData = U?.data?.logs1 || [];

                    setGridData(prev => {
                        const updated = prev.map(item => {
                            const found = [...AData, ...UData].find(x => x?.IDX_NO === item?.IdxNo);
                            if (!found) return item;

                            const newItem = { ...item, Status: '' };

                            mapReturnFields.forEach(field => {
                                if (found[field] !== undefined) {
                                    newItem[field] = found[field];
                                }
                            });

                            return newItem;
                        });
                        return updateIndexNo(updated);
                    });
                };

                allPromises.push(apiCall());
            }
        }

        if (allErrors.length > 0) {
            setModal2Open(true);
            setErrorData(allErrors);
            return;
        }

        if (allPromises.length === 0) {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
            return;
        }

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            await Promise.all(allPromises);
        } catch (errorItems) {
            setModal2Open(true);
            setErrorData(errorItems);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [
        canCreate,
        gridData, setGridData,
        gridData2, setGridData2,
        gridData3, setGridData3,
        gridData4, setGridData4,
        gridData5, setGridData5,
        gridData6, setGridData6,
        gridData7, setGridData7,
        gridData8, setGridData8,
        gridData9, setGridData9,
        gridData11, setGridData11,
        gridData10, setGridData10,
        gridData12, setGridData12,
        gridData13, setGridData13,
        gridData14, setGridData14,
        dataSheetSearch,
        dataSeq
    ]);



    const getSelectedRows = (selection, gridData) => {
        return selection?.rows?.items?.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(Boolean)
        ) || [];
    };

    const resetTable = (setSelectionFn) => {
        if (typeof setSelectionFn === 'function') {
            setSelectionFn({
                columns: CompactSelection.empty(),
                rows: CompactSelection.empty()
            });
        }
    };

    const createResetFn = (setSelectionFn) => () => resetTable(setSelectionFn);

    const handleDeleteDataSheet = useCallback(() => {
        if (canDelete === false) return;

        const map = {
            '1': {
                selection, setSelection, gridData, setGridData, setNumRows,
                deleteApi: null, resetFn: resetTable
            },
            /*  '2': {
                 selection: selection2, setSelection: setSelection2, gridData: gridData2, setGridData: setGridData2, setNumRows: setNumRows2,
                 deleteApi: null, resetFn: resetTable(setSelection2)
             }, */
            '3': {
                selection: selection3, setSelection: setSelection3, gridData: gridData3, setGridData: setGridData3, setNumRows: setNumRows3,
                deleteApi: PostDHrBaseFamily, resetFn: createResetFn(setSelection3),

            },
            '4': {
                selection: selection4, setSelection: setSelection4, gridData: gridData4, setGridData: setGridData4, setNumRows: setNumRows4,
                deleteApi: PostDHrBasAddress, resetFn: resetTable(setSelection4)
            },
            '5': {
                selection: selection5, setSelection: setSelection5, gridData: gridData5, setGridData: setGridData5, setNumRows: setNumRows5,
                deleteApi: HrBasMilitaryD, resetFn: resetTable(setSelection5)
            },
            '6': {
                selection: selection6, setSelection: setSelection6, gridData: gridData6, setGridData: setGridData6, setNumRows: setNumRows6,
                deleteApi: PostDHrBasAcademi, resetFn: resetTable(setSelection6)
            },
            '7': {
                selection: selection7, setSelection: setSelection7, gridData: gridData7, setGridData: setGridData7, setNumRows: setNumRows7,
                deleteApi: PostDHrBaseLangSkill, resetFn: resetTable(setSelection7)
            },
            '8': {
                selection: selection8, setSelection: setSelection8, gridData: gridData8, setGridData: setGridData8, setNumRows: setNumRows8,
                deleteApi: PostDHrBasPrzPnl, resetFn: resetTable(setSelection8)
            },
            '9': {
                selection: selection9, setSelection: setSelection9, gridData: gridData9, setGridData: setGridData9, setNumRows: setNumRows9,
                deleteApi: HrBasLicenseCheckD, resetFn: resetTable(setSelection9)
            },
            '10': {
                selection: selection10, setSelection: setSelection10, gridData: gridData10, setGridData: setGridData10, setNumRows: setNumRows10,
                deleteApi: null, resetFn: resetTable(setSelection10)
            },
            '11': {
                selection: selection11, setSelection: setSelection11, gridData: gridData11, setGridData: setGridData11, setNumRows: setNumRows11,
                deleteApi: PostDHrBaseTravel, resetFn: resetTable(setSelection11)
            },
            '12': [
                {
                    selection: selection12, setSelection: setSelection12, gridData: gridData12, setGridData: setGridData12, setNumRows: setNumRows12,
                    deleteApi: PostHrBasCareerD, resetFn: resetTable(setSelection12)
                },
                {
                    selection: selection13, setSelection: setSelection13, gridData: gridData13, setGridData: setGridData13, setNumRows: setNumRows13,
                    deleteApi: PostHrBasPjtCareerD, resetFn: resetTable(setSelection13)
                },
            ],
            '14': {
                selection: selection15, setSelection: setSelection15, gridData: gridData15, setGridData: setGridData15, setNumRows: setNumRows15,
                deleteApi: HrFileD, resetFn: resetTable(setSelection15)
            }
        };

        const target = map[current];
        if (!target) return;

        const processTarget = ({ selection, setSelection, gridData, setGridData, setNumRows, deleteApi, resetFn }) => {
            const selectedRows = getSelectedRows(selection, gridData);


            const rowsWithStatusD = selectedRows
                .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D')
                .map(row => ({
                    ...row,
                    Status: 'D'
                }));

            const rowsWithStatusA = selectedRows.filter(row => row.Status === 'A');

            if (rowsWithStatusD.length > 0 && deleteApi) {
                deleteApi(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.IdxNo);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdxNo));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                        } else {
                            setModal2Open(true);
                            setErrorData(response?.errors || []);
                        }
                    })
                    .catch((error) => {
                        message.error('Có lỗi xảy ra khi xóa!');
                    });
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map(row => row.Id);
                const remainingRows = gridData.filter(row => !idsWithStatusA.includes(row.Id));
                setGridData(updateIndexNo(remainingRows));
                setNumRows(remainingRows.length);
                resetFn?.();
            }
        };

        if (Array.isArray(target)) {
            target.forEach(processTarget);
        } else {
            processTarget(target);
        }
    }, [
        current, canDelete,
        // Các state & setter bạn đã định nghĩa
        selection, setSelection, gridData, setGridData, setNumRows, resetTable,
        selection2, setSelection2, gridData2, setGridData2, setNumRows2,
        selection3, setSelection3, gridData3, setGridData3, setNumRows3,
        selection4, setSelection4, gridData4, setGridData4, setNumRows4,
        selection5, setSelection5, gridData5, setGridData5, setNumRows5,
        selection6, setSelection6, gridData6, setGridData6, setNumRows6,
        selection7, setSelection7, gridData7, setGridData7, setNumRows7,
        selection8, setSelection8, gridData8, setGridData8, setNumRows8,
        selection9, setSelection9, gridData9, setGridData9, setNumRows9,
        selection10, setSelection10, gridData10, setGridData10, setNumRows10,
        selection11, setSelection11, gridData11, setGridData11, setNumRows11,
        selection12, setSelection12, gridData12, setGridData12, setNumRows12,
        selection13, setSelection13, gridData13, setGridData13, setNumRows13,
        selection14, setSelection14, gridData14, setGridData14, setNumRows14,

    ]);



    const fetchCodeHelpData = useCallback(async () => {
        increaseFetchCount();

        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        loadingBarRef.current?.continuousStart();

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.fetchCodeHelpData = controller;

        try {

            const [help01, help02, help03, help04, help05, help06, help07, help08, help09, help10, help11,
                help12, help13, help14, help15, help16, help17, help18, help19, help20, help21, help22, help23, help24, help25,
                help26, help27, help28, help29, help30, help31, help32, help33, help34, help35,
                help36, help37, help38, help39, help40, help41, help42, help43, help44, help45, help46

            ] = await Promise.all([
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3059', '1001', '3053001,3053002', '', signal),
                GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3062', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3063', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '1009', '', '', '', signal),
                GetCodeHelpVer2(19999, '', '1002', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3065', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3064', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '3055', '', '', '', signal),
                GetCodeHelpVer2(19999, '', '3063', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '1011', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3104', '', '', '', signal),

                GetCodeHelpCombo('', 6, 19999, 1, '%', '3079', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3080', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3081', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '3057', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '1012', '', '', '', signal),
                GetCodeHelpVer2(19999, '', '3085', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '1002', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '1013', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3306', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3102', '', '', '', signal),

                GetCodeHelpCombo('', 6, 19999, 1, '%', '3306', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3068', '', '', '', signal),
                GetCodeHelpVer2(30006, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),



                GetCodeHelpCombo('', 6, 19999, 1, '%', '3059', '1001', '3053001,3053002', '', signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '3095', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '1009', '', '', '', signal),
                GetCodeHelpVer2(19999, '', '1002', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '1010', '', '', '', signal),
                GetCodeHelpVer2(19999, '', '3060', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3061', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3064', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3065', '', '', '', signal),
                GetCodeHelpVer2(19999, '', '3062', '', '', '', '', 1, 0, '', 0, 0, 0, signal),



                GetCodeHelpVer2(19999, '', '3005', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3070', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3071', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3072', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3074', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3075', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3076', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(19999, '', '3077', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3073', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '3069', '', '', '', signal),

                GetCodeHelpVer2(19999, '', '3078', '', '', '', '', 1, 0, '', 0, 0, 0, signal),





            ]);
            setHelpData01(help01.data)
            setHelpData02(help02.data)

            setHelpData03(help03.data)
            setHelpData04(help04.data)
            setHelpData05(help05.data)
            setHelpData06(help06.data)
            setHelpData07(help07.data)
            setHelpData08(help08.data)
            setHelpData09(help09.data)

            setHelpData10(help10.data)
            setHelpData11(help11.data)
            setHelpData12(help12.data)

            setHelpData13(help13.data)
            setHelpData14(help14.data)
            setHelpData15(help15.data)
            setHelpData16(help16.data)
            setHelpData17(help17.data)
            setHelpData18(help18.data)
            setHelpData19(help19.data)
            setHelpData20(help20.data)
            setHelpData21(help21.data)
            setHelpData22(help22.data)


            setHelpData23(help23.data)
            setHelpData24(help24.data)
            setHelpData25(help25.data)

            setHelpData26(help26.data);
            setHelpData27(help27.data);
            setHelpData28(help28.data);
            setHelpData29(help29.data);
            setHelpData30(help30.data);
            setHelpData31(help31.data);
            setHelpData32(help32.data);
            setHelpData33(help33.data);
            setHelpData34(help34.data);
            setHelpData35(help35.data);
            setHelpData36(help36.data);
            setHelpData37(help37.data);
            setHelpData38(help38.data);
            setHelpData39(help39.data);
            setHelpData40(help40.data);
            setHelpData41(help41.data);
            setHelpData42(help42.data);
            setHelpData43(help43.data);
            setHelpData44(help44.data);
            setHelpData45(help45.data);
            setHelpData46(help46.data);






        } catch {
            setHelpData01([])
            setHelpData02([])
            setHelpData03([])
            setHelpData04([])
            setHelpData05([])
            setHelpData06([])
            setHelpData07([])
            setHelpData08([])
            setHelpData09([])

            setHelpData10([])
            setHelpData11([])
            setHelpData12([])
            setHelpData13([])
            setHelpData14([])
            setHelpData15([])

            setHelpData16([])
            setHelpData17([])
            setHelpData18([])
            setHelpData19([])
            setHelpData20([])
            setHelpData21([])
            setHelpData22([])
            setHelpData23([])
            setHelpData24([])
            setHelpData25([])



            setHelpData26([]);
            setHelpData27([]);
            setHelpData28([]);
            setHelpData29([]);
            setHelpData30([]);
            setHelpData31([]);
            setHelpData32([]);
            setHelpData33([]);
            setHelpData34([]);
            setHelpData35([]);

            setHelpData36([]);
            setHelpData37([]);
            setHelpData38([]);
            setHelpData39([]);
            setHelpData40([]);

            setHelpData41([]);
            setHelpData42([]);
            setHelpData43([]);
            setHelpData44([]);
            setHelpData45([]);
            setHelpData46([]);

        } finally {
            decreaseFetchCount();
            controllers.current.fetchCodeHelpData = null;
        }
    }, []);

    const debouncedFetchCodeHelpData = useMemo(
        () => debounce(fetchCodeHelpData, 100),
        [fetchCodeHelpData],
    )
    useEffect(() => {
        debouncedFetchCodeHelpData()
        return () => {
            debouncedFetchCodeHelpData.cancel()
        }
    }, [debouncedFetchCodeHelpData])
    const handleSearch = useCallback(() => {
        const UserSeq = dataSheetSearch[0]?.EmpSeq;
        if (UserSeq == null || UserSeq === '') return;

        const searchParams = {
            EmpSeq: UserSeq || 0,
        };

        const searchParams2 = {
            KeyItem1: UserSeq || 0,
            KeyItem2: 'AVATAR',
            KeyItem3: 1,
        }
        const searchParams3 = {
            KeyItem1: UserSeq || 0,
            KeyItem2: 'FILE',
            KeyItem3: '',
        }

        fetchGenericData({
            controllerKey: 'HrFileQ',
            postFunction: HrFileQ,
            searchParams: searchParams2,
            useEmptyData: false,
            defaultCols: null,
            afterFetch: (data) => {
                setGridAvatar(data)
            },
        });
        fetchGenericData({
            controllerKey: 'HrFileQ2',
            postFunction: HrFileQ,
            searchParams: searchParams3,
            useEmptyData: false,
            defaultCols: defaultCols15,
            afterFetch: (data) => {
                setGridData15(data);
                setNumRows15(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'PostQHrEmpOne',
            postFunction: PostQHrEmpOne,
            searchParams,
            useEmptyData: false,
            defaultCols: null,
            afterFetch: (data) => setDataRoot(data[0]),
        });

        fetchGenericData({
            controllerKey: 'PostQHrEmpInfo',
            postFunction: PostQHrEmpInfo,
            searchParams,
            useEmptyData: false,
            defaultCols: null,
            afterFetch: (data) => setDataRootInfo(data[0]),
        });

        fetchGenericData({
            controllerKey: 'AdmOrdEmpListQ',
            postFunction: AdmOrdEmpListQ,
            searchParams,
            useEmptyData: false,
            defaultCols: defaultCols2,
            afterFetch: (data) => {
                setGridData2(data);
                setNumRows2(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'PostQHrBaseFamily',
            postFunction: PostQHrBaseFamily,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols3,
            afterFetch: (data) => {
                setGridData3(data);
                setNumRows3(data.length);
            },
        });

        fetchGenericData({
            controllerKey: 'PostQHrBasAddress',
            postFunction: PostQHrBasAddress,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols4,
            afterFetch: (data) => {
                setGridData4(data);
                setNumRows4(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'HrBasMilitaryQ',
            postFunction: HrBasMilitaryQ,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols5,
            afterFetch: (data) => {
                setGridData5(data);
                setNumRows5(data.length);
            },
        });

        fetchGenericData({
            controllerKey: 'PostQHrBasAcademi',
            postFunction: PostQHrBasAcademi,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols6,
            afterFetch: (data) => {
                setGridData6(data);
                setNumRows6(data.length);
            },
        });

        fetchGenericData({
            controllerKey: 'PostQHrBaseLangSkill',
            postFunction: PostQHrBaseLangSkill,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols7,
            afterFetch: (data) => {
                setGridData7(data);
                setNumRows7(data.length);
            },
        });

        fetchGenericData({
            controllerKey: 'PostQHrBasPrzPnl',
            postFunction: PostQHrBasPrzPnl,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols8,
            afterFetch: (data) => {
                setGridData8(data);
                setNumRows8(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'HrBasLicenseCheckQ',
            postFunction: HrBasLicenseCheckQ,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols9,
            afterFetch: (data) => {
                setGridData9(data);
                setNumRows9(data.length);
            },
        });

        fetchGenericData({
            controllerKey: 'PostQHrBaseTravel',
            postFunction: PostQHrBaseTravel,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols11,
            afterFetch: (data) => {
                setGridData11(data);
                setNumRows11(data.length);
            },
        });

        fetchGenericData({
            controllerKey: 'PostHrBasCareerQ',
            postFunction: PostHrBasCareerQ,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols12,
            afterFetch: (data) => {
                setGridData12(data);
                setNumRows12(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'EmpUserDefineQ',
            postFunction: EmpUserDefineQ,
            searchParams,
            useEmptyData: false,
            defaultCols: defaultCols14,
            afterFetch: (data) => {
                setGridData14(data);
                setNumRows14(data.length);
            },
        });
    }, [dataSheetSearch]);
    const handlePrint = useCallback(() => {
        const UserSeq = dataSheetSearch[0]?.EmpSeq;
        if (UserSeq == null || UserSeq === '') return;

        const searchParams = {
            EmpSeq: UserSeq || 0,
            EmpId: dataSheetSearch[0]?.EmpID || 'none',
        }


        fetchGenericData({
            controllerKey: 'HrEmpInfoQ',
            postFunction: HrEmpInfoQ,
            searchParams: searchParams,
            useEmptyData: false,
            defaultCols: null,
            afterFetch: (data) => {

                const rawPath = data?.[0]?.FilePdfUrl;

                if (rawPath) {
                    const relativePath = rawPath.replace('/ERP_CLOUD/user_files/', '');
                    const fullUrl = `${HOST_API_SERVER_14}/${relativePath}`;
                    window.open(fullUrl, '_blank');
                } else {
                    message.warn('Không có đường dẫn FilePdfUrl trong phản hồi');
                }
            },
        });
    }, [dataSheetSearch]);
    useEffect(() => {
        const UserSeq = dataSheetSearch[0]?.EmpSeq;
        if (UserSeq == null || UserSeq === '') return;

        handleSearch();
    }, [dataSheetSearch]);

    const handleExternalSubmit = () => {
        const hasValidEmpSeq = Array.isArray(dataSheetSearch) && dataSheetSearch[0]?.EmpSeq;
        if (!hasValidEmpSeq) {
            message.warning('Vui lòng chọn nhân viên trước khi lưu!');
            return;
        }

        form.submit();
        handleSaveAll();
    };
    const getSelectedRowsData12 = () => {
        const selectedRows = selection12.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData12[start + i]).filter((row) => row !== undefined)
        );
    };
    useEffect(() => {
        const data = getSelectedRowsData12();

        if (!data || data.length === 0) return;

        const CareerSeq = data[0]?.CareerSeq;
        if (CareerSeq == null || CareerSeq === '') return;

        setDataSeq(data[0]);
        const searchParams = {
            PjtCareerSeq: data[0]?.PjtCareerSeq || 0,
            EmpSeq: data[0]?.EmpSeq,
            CareerSeq: data[0]?.CareerSeq,
        }
        fetchGenericData({
            controllerKey: 'PostHrBasPjtCareerQ',
            postFunction: PostHrBasPjtCareerQ,
            searchParams,
            useEmptyData: true,
            defaultCols: defaultCols13,
            afterFetch: (data) => {
                setGridData13(data);
                setNumRows13(data.length);
            },
        });



    }, [selection12.rows.items]);
    return (
        <>
            <Helmet>
                <title>{t('Thẻ nhân sự')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <HrEmplnSeqAction handleSearch={handleSearch} handlePrint={handlePrint} handleSaveAll={handleExternalSubmit} handleDeleteDataSheet={handleDeleteDataSheet} />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t border-b bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase" >
                                    Truy vấn nhân sự
                                </h2>
                            </summary>
                            <HrEmplnSeqQuery
                                helpData01={helpData01}
                                helpData02={helpData02}
                                helpData08={helpData08}
                                searchText={searchText}
                                setSearchText={setSearchText}
                                setSearchText1={setSearchText1}
                                searchText1={searchText1}
                                setItemText={setItemText}
                                itemText={itemText}
                                setDataSearch={setDataSearch}
                                dataSearch={dataSearch}
                                setDataSearch1={setDataSearch1}
                                dataSearch1={dataSearch1}
                                setDataSheetSearch={setDataSheetSearch}
                                setDataSheetSearch1={setDataSheetSearch1}
                                dataSheetSearch={dataSheetSearch}
                                setItemText1={setItemText1}
                                setHelpData02={setHelpData02}
                                CoNm={CoNm}
                                setCoNm={setCoNm}
                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg ">

                        <Splitter className="w-full h-full" >
                            <SplitterPanel size={85} minSize={85}>
                                <div className="h-full flex ">
                                    <Menu
                                        mode="inline"
                                        selectedKeys={[current]}
                                        style={{ width: 200 }}
                                        onClick={(e) => {
                                            if (!checkPageA) {
                                                setCurrent(e.key);
                                            }
                                        }}

                                        className="border-b"
                                        items={[
                                            {
                                                key: '0',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <UserRoundSearch size={14} />
                                                        {t('Thông tin cơ bản')}
                                                    </span>
                                                ),
                                            },
                                            /*   {
                                                  key: '1',
                                                  label: (
                                                      <span className="flex items-center gap-1">
                                                          <CalendarDays size={14} />
                                                          {t('Ngày bắt đầu')}
                                                      </span>
                                                  ),
                                              }, */
                                            {
                                                key: '2',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <ClipboardCheck size={14} />
                                                        {t('Bổ nhiệm, chỉ định')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '3',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <Users size={14} />
                                                        {t('Gia đình')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '4',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {t('Địa chỉ')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '5',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <ShieldCheck size={14} />
                                                        {t('Nghĩa vụ đi lính')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '6',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <BookOpenCheck size={14} />
                                                        {t('Học lực trình độ học vấn')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '7',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <Languages size={14} />
                                                        {t('Ngôn ngữ học')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '8',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <Medal size={14} />
                                                        {t('Khen thưởng kỹ luật')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '9',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <IdCard size={14} />
                                                        {t('Giấy phép')}
                                                    </span>
                                                ),
                                            },
                                            /*   {
                                                  key: '10',
                                                  label: (
                                                      <span className="flex items-center gap-1">
                                                          <HeartPulse size={14} />
                                                          {t('Sức khỏe')}
                                                      </span>
                                                  ),
                                              }, */
                                            {
                                                key: '11',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <BriefcaseBusiness size={14} />
                                                        {t('Công tác')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '12',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <Globe size={14} />
                                                        {t('Kinh nghiệm bên ngoài')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '13',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <Info size={14} />
                                                        {t('Thông tin bổ sung')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '14',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <FileStack size={14} />
                                                        {t('Quản lý tệp tin')}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    />
                                    <div className="flex-1 overflow-auto bg-white">
                                        {current === '0' && <>
                                            <Emp0Table
                                                dataSearch={dataRoot}
                                                dataRootInfo={dataRootInfo}
                                                form={form}
                                                dataSheetSearch={dataSheetSearch}
                                                setModal2Open={setModal2Open}
                                                setErrorData={setErrorData}

                                                gridAvatar={gridAvatar}
                                                setGridAvatar={setGridAvatar}
                                                helpData26={helpData26} setHelpData26={setHelpData26}
                                                helpData27={helpData27} setHelpData27={setHelpData27}
                                                helpData28={helpData28} setHelpData28={setHelpData28}
                                                helpData29={helpData29} setHelpData29={setHelpData29}
                                                helpData30={helpData30} setHelpData30={setHelpData30}
                                                helpData31={helpData31} setHelpData31={setHelpData31}
                                                helpData32={helpData32} setHelpData32={setHelpData32}
                                                helpData33={helpData33} setHelpData33={setHelpData33}
                                                helpData34={helpData34} setHelpData34={setHelpData34}
                                                helpData35={helpData35} setHelpData35={setHelpData35}

                                            /></>}

                                        {current === '1' && <><Emp1Table
                                            setSelection={setSelection}
                                            selection={selection}
                                            showSearch={showSearch}
                                            setShowSearch={setShowSearch}
                                            numRows={numRows}
                                            setGridData={setGridData}
                                            gridData={gridData}
                                            setNumRows={setNumRows}
                                            setCols={setCols}
                                            cols={cols}
                                            defaultCols={defaultCols1}
                                            canEdit={canEdit}
                                            canCreate={canCreate}
                                            handleRowAppend={handleRowAppend}

                                        /></>}
                                        {current === '2' && <><Emp2Table setSelection={setSelection2}
                                            selection={selection2}
                                            showSearch={showSearch2}
                                            setShowSearch={setShowSearch2}
                                            numRows={numRows2}
                                            setGridData={setGridData2}
                                            gridData={gridData2}
                                            setNumRows={setNumRows2}
                                            setCols={setCols2}
                                            cols={cols2}
                                            defaultCols={defaultCols2}
                                            canEdit={canEdit}
                                            canCreate={canCreate}
                                        /*             handleRowAppend={handleRowAppend2} */

                                        /></>}
                                        {current === '3' && <><Emp3Table
                                            setSelection={setSelection3}
                                            selection={selection3}
                                            showSearch={showSearch3}
                                            setShowSearch={setShowSearch3}
                                            numRows={numRows3}
                                            setGridData={setGridData3}
                                            gridData={gridData3}
                                            setNumRows={setNumRows3}
                                            setCols={setCols3}
                                            cols={cols3}
                                            defaultCols={defaultCols3}
                                            canEdit={canEdit}
                                            canCreate={canCreate}
                                            handleRowAppend={handleRowAppend3}

                                            helpData03={helpData03}
                                            helpData04={helpData04}
                                            helpData05={helpData05}
                                            helpData06={helpData06}
                                            helpData07={helpData07}
                                            helpData08={helpData08}
                                            setHelpData03={setHelpData03}
                                            setHelpData04={setHelpData04}
                                            setHelpData05={setHelpData05}
                                            setHelpData06={setHelpData06}
                                            setHelpData07={setHelpData07}
                                            setHelpData08={setHelpData08}
                                        /></>}
                                        {current === '4' && <><Emp4Table
                                            setSelection={setSelection4}
                                            selection={selection4}
                                            showSearch={showSearch4}
                                            setShowSearch={setShowSearch4}
                                            numRows={numRows4}
                                            setGridData={setGridData4}
                                            gridData={gridData4}
                                            setNumRows={setNumRows4}
                                            setCols={setCols4}
                                            cols={cols4}
                                            defaultCols={defaultCols4}
                                            canEdit={canEdit}
                                            canCreate={canCreate}
                                            handleRowAppend={handleRowAppend4}
                                            helpData09={helpData09}
                                            setHelpData09={setHelpData09}

                                        /></>}
                                        {current === '5' && <><Emp5Table

                                            setSelection={setSelection5}
                                            selection={selection5}
                                            showSearch={showSearch5}
                                            setShowSearch={setShowSearch5}
                                            numRows={numRows5}
                                            setGridData={setGridData5}
                                            gridData={gridData5}
                                            setNumRows={setNumRows5}
                                            setCols={setCols5}
                                            cols={cols5}
                                            defaultCols={defaultCols5}
                                            canEdit={canEdit}
                                            canCreate={canCreate}
                                            handleRowAppend={handleRowAppend5}


                                            helpData36={helpData36}
                                            helpData37={helpData37}
                                            helpData38={helpData38}
                                            helpData39={helpData39}
                                            helpData40={helpData40}
                                            helpData41={helpData41}
                                            helpData42={helpData42}
                                            helpData43={helpData43}
                                            helpData44={helpData44}
                                            helpData45={helpData45}
                                            setHelpData36={setHelpData36}
                                            setHelpData37={setHelpData37}
                                            setHelpData38={setHelpData38}
                                            setHelpData39={setHelpData39}
                                            setHelpData40={setHelpData40}
                                            setHelpData41={setHelpData41}
                                            setHelpData42={setHelpData42}
                                            setHelpData43={setHelpData43}
                                            setHelpData44={setHelpData44}
                                            setHelpData45={setHelpData45}




                                        /></>}
                                        {current === '6' && <>
                                            <Emp6Table
                                                setSelection={setSelection6}
                                                selection={selection6}
                                                showSearch={showSearch6}
                                                setShowSearch={setShowSearch6}
                                                numRows={numRows6}
                                                setGridData={setGridData6}
                                                gridData={gridData6}
                                                setNumRows={setNumRows6}
                                                setCols={setCols6}
                                                cols={cols6}
                                                defaultCols={defaultCols6}
                                                canEdit={canEdit}
                                                canCreate={canCreate}
                                                handleRowAppend={handleRowAppend6}

                                                helpData10={helpData10}
                                                helpData11={helpData11}
                                                helpData12={helpData12}
                                                setHelpData10={setHelpData10}
                                                setHelpData11={setHelpData11}
                                                setHelpData12={setHelpData12}
                                            /></>}
                                        {current === '7' && <>
                                            <Emp7Table
                                                setSelection={setSelection7}
                                                selection={selection7}
                                                showSearch={showSearch7}
                                                setShowSearch={setShowSearch7}
                                                numRows={numRows7}
                                                setGridData={setGridData7}
                                                gridData={gridData7}
                                                setNumRows={setNumRows7}
                                                setCols={setCols7}
                                                cols={cols7}
                                                defaultCols={defaultCols7}
                                                canEdit={canEdit}
                                                canCreate={canCreate}
                                                handleRowAppend={handleRowAppend7}
                                                helpData13={helpData13}
                                                helpData14={helpData14}
                                                helpData15={helpData15}
                                                setHelpData13={setHelpData13}
                                                setHelpData14={setHelpData14}
                                                setHelpData15={setHelpData15}

                                            /></>}

                                        {current === '8' && <>
                                            <Emp8Table
                                                setSelection={setSelection8}
                                                selection={selection8}
                                                showSearch={showSearch8}
                                                setShowSearch={setShowSearch8}
                                                numRows={numRows8}
                                                setGridData={setGridData8}
                                                gridData={gridData8}
                                                setNumRows={setNumRows8}
                                                setCols={setCols8}
                                                cols={cols8}
                                                defaultCols={defaultCols8}
                                                canEdit={canEdit}
                                                canCreate={canCreate}
                                                handleRowAppend={handleRowAppend8}
                                                helpData16={helpData16}
                                                helpData17={helpData17}
                                                helpData18={helpData18}
                                                setHelpData16={setHelpData16}
                                                setHelpData17={setHelpData17}
                                                setHelpData18={setHelpData18}

                                            /></>}

                                        {current === '9' && <>
                                            <Emp9Table
                                                setSelection={setSelection9}
                                                selection={selection9}
                                                showSearch={showSearch9}
                                                setShowSearch={setShowSearch9}
                                                numRows={numRows9}
                                                setGridData={setGridData9}
                                                gridData={gridData9}
                                                setNumRows={setNumRows9}
                                                setCols={setCols9}
                                                cols={cols9}
                                                defaultCols={defaultCols9}
                                                canEdit={canEdit}
                                                canCreate={canCreate}
                                                handleRowAppend={handleRowAppend9}
                                                helpData46={helpData46}
                                                setHelpData46={setHelpData46}

                                            /></>}
                                        {current === '11' && <>
                                            <Emp11Table
                                                setSelection={setSelection11}
                                                selection={selection11}
                                                showSearch={showSearch11}
                                                setShowSearch={setShowSearch11}
                                                numRows={numRows11}
                                                setGridData={setGridData11}
                                                gridData={gridData11}
                                                setNumRows={setNumRows11}
                                                setCols={setCols11}
                                                cols={cols11}
                                                defaultCols={defaultCols11}
                                                canEdit={canEdit}
                                                canCreate={canCreate}
                                                handleRowAppend={handleRowAppend11}
                                                helpData19={helpData19}
                                                helpData20={helpData20}
                                                setHelpData19={setHelpData19}
                                                setHelpData20={setHelpData20}

                                            /></>}



                                        {current === '12' && <>
                                            <Splitter className="w-full h-full" layout="vertical">
                                                <SplitterPanel size={55} minSize={10}>
                                                    <div className="h-full overflow-auto">

                                                        <Emp12Table
                                                            setSelection={setSelection12}
                                                            selection={selection12}
                                                            showSearch={showSearch12}
                                                            setShowSearch={setShowSearch12}
                                                            numRows={numRows12}
                                                            setGridData={setGridData12}
                                                            gridData={gridData12}
                                                            setNumRows={setNumRows12}
                                                            setCols={setCols12}
                                                            cols={cols12}
                                                            defaultCols={defaultCols12}
                                                            canEdit={canEdit}
                                                            canCreate={canCreate}
                                                            handleRowAppend={handleRowAppend12}


                                                            helpData21={helpData21}
                                                            helpData22={helpData22}
                                                            setHelpData21={setHelpData21}
                                                            setHelpData22={setHelpData22}


                                                        />

                                                    </div>
                                                </SplitterPanel>



                                                <SplitterPanel size={7} minSize={10}>
                                                    <div className="h-full p-2 border-t border-b overflow-auto">
                                                        <HrBasCareerSeqQuery dataSeq={dataSeq} />
                                                    </div>
                                                </SplitterPanel>
                                                <SplitterPanel size={33} minSize={20}>
                                                    <Emp13Table
                                                        setSelection={setSelection13}
                                                        selection={selection13}
                                                        showSearch={showSearch13}
                                                        setShowSearch={setShowSearch13}
                                                        numRows={numRows13}
                                                        setGridData={setGridData13}
                                                        gridData={gridData13}
                                                        setNumRows={setNumRows13}
                                                        setCols={setCols13}
                                                        cols={cols13}
                                                        defaultCols={defaultCols13}
                                                        canEdit={canEdit}
                                                        canCreate={canCreate}
                                                        handleRowAppend={handleRowAppend13}


                                                        helpData23={helpData23}
                                                        helpData24={helpData24}
                                                        helpData25={helpData25}
                                                        setHelpData23={setHelpData23}
                                                        setHelpData24={setHelpData24}
                                                        setHelpData25={setHelpData25}


                                                    />


                                                </SplitterPanel>



                                            </Splitter>


                                        </>

                                        }

                                        {current === '13' && <>
                                            <Emp14Table
                                                setSelection={setSelection14}
                                                selection={selection14}
                                                showSearch={showSearch14}
                                                setShowSearch={setShowSearch14}
                                                numRows={numRows14}
                                                setGridData={setGridData14}
                                                gridData={gridData14}
                                                setNumRows={setNumRows14}
                                                setCols={setCols14}
                                                cols={cols14}
                                                defaultCols={defaultCols14}
                                                canEdit={canEdit}
                                                canCreate={canCreate}
                                            /></>}
                                        {current === '14' && <>
                                            <Emp15Table

                                                setSelection={setSelection15}
                                                selection={selection15}
                                                showSearch={showSearch15}
                                                setShowSearch={setShowSearch15}
                                                numRows={numRows15}
                                                setGridData={setGridData15}
                                                gridData={gridData15}
                                                setNumRows={setNumRows15}
                                                setCols={setCols15}
                                                cols={cols15}
                                                defaultCols={defaultCols15}
                                                canEdit={canEdit}
                                                canCreate={canCreate}
                                                dataSheetSearch={dataSheetSearch}

                                            />
                                        </>}
                                    </div>
                                </div>
                            </SplitterPanel>



                        </Splitter>
                    </div>
                </div>
            </div>
            <ErrorListModal isModalVisible={modal2Open}
                setIsModalVisible={setModal2Open}
                dataError={errorData} />
        </>
    )
}
