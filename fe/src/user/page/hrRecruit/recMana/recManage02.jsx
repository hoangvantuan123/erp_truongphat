import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import { Input, Typography, notification, Col, message, Form } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'


import dayjs from 'dayjs'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { HandleError } from '../../default/handleError'
import { HrEmpRecruitS } from '../../../../features/hr/hrEmpRecruit/HrEmpRecruitS'
import { HrEmpRecruitQ } from '../../../../features/hr/hrEmpRecruit/HrEmpRecruitQ'
import TableRecManage02 from '../../../components/table/hrRecruit/recMana/tableRecManage02'
import TableRecManage02Sync from '../../../components/table/hrRecruit/recMana/tableRecManage02Sync'
export default function RecManage02({
    permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    controllers,
    cancelAllRequests
}) {

    const { t } = useTranslation()
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const defaultColsA = useMemo(() => [
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
            title: 'Sync',
            id: 'StatusSync',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
        },
        {
            title: t('Mã nhân viên'),
            id: 'EmpID',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('3166'),
            id: 'EmpFamilyName',
            kind: 'Text',
            readonly: false,
            width: 90,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('3198'),
            id: 'EmpFirstName',
            kind: 'Text',
            readonly: false,
            width: 90,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('1584'),
            id: 'EmpName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },
        {
            title: t('Bằng cấp'),
            id: 'Degree',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },
        {
            title: t('Ngày sinh'),
            id: 'BirthDate',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('Check Tuổi'),
            id: 'CheckAge',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Giới tính'),
            id: 'SMSexName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('CMND/CCCD'),
            id: 'ResidID',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('Ngày cấp'),
            id: 'IssueDate',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Nơi cấp'),
            id: 'IssuePlace',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Số điện thoại'),
            id: 'PhoneNumber',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Liên hệ',
        },
        {
            title: t('Email'),
            id: 'Email',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Liên hệ',
        },
        {
            title: t('Phân loại'),
            id: 'CategoryTypeName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Hình thái tuyển dụng / nhà thầu'),
            id: 'RecruitmentName',
            kind: 'Text',
            readonly: false,
            width: 210,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Người phỏng vấn / Đăng ký'),
            id: 'Interviewer',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Nhà máy'),
            id: 'FactName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Phòng ban'),
            id: 'Department',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Team'),
            id: 'Team',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Part'),
            id: 'PartName',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Line/Model'),
            id: 'LineModel',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Chức vụ'),
            id: 'JopPositionName',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Ngày tuyển dụng'),
            id: 'InterviewDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        // Quê quán
        {
            title: t('Quê - Đường'),
            id: 'PerAddrStreet',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Phường/Xã'),
            id: 'PerAddrWard',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Quận/Huyện'),
            id: 'PerAddrDistrict',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Tỉnh/TP'),
            id: 'PerAddrProvince',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        // Chỗ ở hiện tại
        {
            title: t('Ở - Đường'),
            id: 'CurAddrStreet',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Phường/Xã'),
            id: 'CurAddrWard',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Quận/Huyện'),
            id: 'CurAddrDistrict',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Tỉnh/TP'),
            id: 'CurAddrProvince',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Dân tộc'),
            id: 'Ethnic',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
        {
            title: t('Km đến Cty'),
            id: 'DistanceKm',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
        {
            title: t('Hạn HĐ'),
            id: 'ContractTerm',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
    ], [t]);


    const defaultColsB = useMemo(() => [
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
            title: 'Sync',
            id: 'StatusSync',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
        },
        {
            title: t('Mã nhân viên'),
            id: 'EmpID',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('3166'),
            id: 'EmpFamilyName',
            kind: 'Text',
            readonly: false,
            width: 90,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('3198'),
            id: 'EmpFirstName',
            kind: 'Text',
            readonly: false,
            width: 90,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('1584'),
            id: 'EmpName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },
        {
            title: t('Bằng cấp'),
            id: 'Degree',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },
        {
            title: t('Ngày sinh'),
            id: 'BirthDate',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('Check Tuổi'),
            id: 'CheckAge',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Giới tính'),
            id: 'SMSexName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('CMND/CCCD'),
            id: 'ResidID',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('Ngày cấp'),
            id: 'IssueDate',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Nơi cấp'),
            id: 'IssuePlace',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Số điện thoại'),
            id: 'PhoneNumber',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Liên hệ',
        },
        {
            title: t('Email'),
            id: 'Email',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Liên hệ',
        },
        {
            title: t('Phân loại'),
            id: 'CategoryTypeName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Hình thái tuyển dụng / nhà thầu'),
            id: 'RecruitmentName',
            kind: 'Text',
            readonly: false,
            width: 210,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Người phỏng vấn / Đăng ký'),
            id: 'Interviewer',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Nhà máy'),
            id: 'FactName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Phòng ban'),
            id: 'Department',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Team'),
            id: 'Team',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Part'),
            id: 'PartName',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Line/Model'),
            id: 'LineModel',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Chức vụ'),
            id: 'JopPositionName',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Ngày tuyển dụng'),
            id: 'InterviewDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        // Quê quán
        {
            title: t('Quê - Đường'),
            id: 'PerAddrStreet',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Phường/Xã'),
            id: 'PerAddrWard',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Quận/Huyện'),
            id: 'PerAddrDistrict',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Tỉnh/TP'),
            id: 'PerAddrProvince',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        // Chỗ ở hiện tại
        {
            title: t('Ở - Đường'),
            id: 'CurAddrStreet',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Phường/Xã'),
            id: 'CurAddrWard',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Quận/Huyện'),
            id: 'CurAddrDistrict',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Tỉnh/TP'),
            id: 'CurAddrProvince',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Dân tộc'),
            id: 'Ethnic',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
        {
            title: t('Km đến Cty'),
            id: 'DistanceKm',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
        {
            title: t('Hạn HĐ'),
            id: 'ContractTerm',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
    ], [t]);
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionItem, setSelectionItem] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearch1, setShowSearch1] = useState(false)

    const [addedRows, setAddedRows] = useState([])
    const [addedRowsItem, setAddedRowsItem] = useState([])
    const [dataType, setDataType] = useState([])

    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRowsItem, setNumRowsItem] = useState(0)
    const formatDate = (date) => date.format('YYYYMMDD')
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())


    const [formData2, setFormData2] = useState(dayjs().startOf('month'))
    const [toDate2, setToDate2] = useState(dayjs())
    const [dataSearch, setDataSearch] = useState([])
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [gridData, setGridData] = useState([])
    const [gridDataItem, setGridDataItem] = useState([])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'rec_manage_02_a',
            defaultColsA.filter((col) => col.visible)
        )
    )

    const [colsItem, setColsItem] = useState(() =>
        loadFromLocalStorageSheet(
            'rec_manage_02_sync_a',
            defaultColsB.filter((col) => col.visible)
        )
    )
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const resetTableItem = () => {
        setSelectionItem({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
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


    const getSelectedRowsA = () => {
        return selection.rows.items.flatMap(([start, end]) => {
            const actualEnd = Math.max(end - 1, start);
            return gridData.slice(start, actualEnd + 1);
        });
    };


    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )


    const handleRowAppendItem = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(colsItem, setGridDataItem, setNumRowsItem, setAddedRowsItem, numRowsToAdd)
        },
        [colsItem, setGridDataItem, setNumRows, setAddedRowsItem, numRowsToAdd]
    )


    const handleSyncDataSheet = useCallback(
        (e) => {
            const selectedRows = getSelectedRowsA();

            const rowsWithStatus = selectedRows
                .filter((row) => !row.Status || row.StatusSync === 'A')
                .map((row) => {
                    return row;
                });

            if (rowsWithStatus.length === 0) {
                togglePageInteraction(false);
                loadingBarRef.current?.complete();
                return true;
            }
            togglePageInteraction(true);
            loadingBarRef.current?.continuousStart();

            if (rowsWithStatus.length > 0) {

                HrEmpRecruitS(rowsWithStatus)
                    .then((response) => {
                        if (response.success) {
                            setGridDataItem((prev) => {
                                const updatedIds = new Set(rowsWithStatus.map((r) => r.IdSeq));
                                const existingIds = new Set(prev.map((item) => item.IdSeq));

                                const updated = prev.map((item) => {
                                    if (updatedIds.has(item.IdSeq)) {
                                        return {
                                            ...item,
                                            StatusSync: 'S',
                                        };
                                    }
                                    return item;
                                });

                                const newItems = rowsWithStatus
                                    .filter((row) => !existingIds.has(row.IdSeq))
                                    .map((row) => ({
                                        ...row,
                                        StatusSync: 'S',
                                    }));

                                const finalData = updateIndexNo([...updated, ...newItems]);
                                setNumRowsItem(finalData.length);
                                return finalData;
                            });

                            const deletedIds = rowsWithStatus.map((item) => item.IdSeq);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdSeq));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                            loadingBarRef.current?.complete();
                            togglePageInteraction(false);
                            message.success(t('Đồng bộ dữ liệu thành công!'));
                        } else {
                            loadingBarRef.current?.complete();
                            togglePageInteraction(false);
                            HandleError([
                                {
                                    success: false,
                                    message: t(response?.message) || 'Đã xảy ra lỗi khi xóa!',
                                },
                            ]);

                        }
                    })
                    .catch((error) => {
                        loadingBarRef.current?.complete();
                        togglePageInteraction(false);
                        HandleError([
                            {
                                success: false,
                                message: t(error?.message) || 'Đã xảy ra lỗi khi xóa!',
                            },
                        ]);
                    });
            }


        },
        [gridData, selection, setGridDataItem, setNumRowsItem]
    );







    const handleSearchData = useCallback(async () => {
        const searchParams = {
            KeyItem1: formData ? formatDate(formData) : '',
            KeyItem2: toDate ? formatDate(toDate) : '',
            KeyItem5: keyItem3 ? keyItem3 : '',
            KeyItem6: keyItem2 ? keyItem2 : '',
            KeyItem4: 'A',

        }
        fetchGenericData({
            controllerKey: 'HrEmpRecruitQ',
            postFunction: HrEmpRecruitQ,
            searchParams,
            defaultCols: defaultColsB,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [dataSearch, formData, toDate, keyItem3, keyItem2])
    const handleSearchDataSync = useCallback(async () => {
        const searchParams = {
            KeyItem1: formData2 ? formatDate(formData2) : '',
            KeyItem2: toDate2 ? formatDate(toDate2) : '',
            KeyItem4: 'S',

        }
        fetchGenericData({
            controllerKey: 'HrEmpRecruitQ',
            postFunction: HrEmpRecruitQ,
            searchParams,
            defaultCols: defaultColsB,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridDataItem(data);
                setNumRowsItem(data.length);
            },
        });

    }, [formData2, toDate2])
    return (
        <>
            <Helmet>
                <title>ITMV - {t('Đồng bộ dữ liệu tuyển dụng ')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50  h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 flex col-end-5 row-start-2 w-full h-full">
                        <Splitter className="w-full h-full">
                            <SplitterPanel size={65} minSize={40}>
                                <TableRecManage02
                                    setSelection={setSelection}
                                    selection={selection}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}

                                    numRows={numRows}

                                    isCellSelected={isCellSelected}
                                    setGridData={setGridData}
                                    gridData={gridData}
                                    setNumRows={setNumRows}
                                    setCols={setCols}
                                    handleRowAppend={handleRowAppend}
                                    cols={cols}
                                    canCreate={canCreate}
                                    defaultCols={defaultColsA}
                                    canEdit={canEdit}
                                    handleSearchData={handleSearchData}

                                    formData={formData}
                                    setFormData={setFormData}
                                    toDate={toDate}
                                    setToDate={setToDate}
                                    setKeyItem3={setKeyItem3}
                                    setKeyItem2={setKeyItem2}
                                    keyItem2={keyItem2}
                                    keyItem3={keyItem3}
                                    handleSyncDataSheet={handleSyncDataSheet}
                                />
                            </SplitterPanel>
                            <SplitterPanel size={35} minSize={35}>
                                <TableRecManage02Sync
                                    setSelection={setSelectionItem}
                                    selection={selectionItem}
                                    showSearch={showSearch1}
                                    setShowSearch={setShowSearch1}
                                    numRows={numRowsItem}
                                    setGridData={setGridDataItem}
                                    gridData={gridDataItem}
                                    setNumRows={setNumRowsItem}
                                    setCols={setColsItem}
                                    handleRowAppend={handleRowAppendItem}
                                    cols={colsItem}
                                    canCreate={canCreate}
                                    defaultCols={defaultColsB}
                                    canEdit={canEdit}
                                    handleSearchDataSync={handleSearchDataSync}
                                    dataType={dataType}


                                    formData={formData2}
                                    setFormData={setFormData2}
                                    toDate={toDate2}
                                    setToDate={setToDate2}
                                />
                            </SplitterPanel>
                        </Splitter>
                    </div>
                </div>
            </div>
        </>
    )
}
