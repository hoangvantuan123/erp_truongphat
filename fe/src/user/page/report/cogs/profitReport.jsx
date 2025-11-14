import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { filterValidRows } from '../../../../utils/filterUorA'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import dayjs from 'dayjs'
import { HandleError } from '../../default/handleError'
import { SESMCFProfitAmtQ } from '../../../../features/report/cogs/SESMCFProfitAmtQ'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import ProfitReportAction from '../../../components/actions/report/cogs/profitReportAction'
import ProfitReportQuery from '../../../components/query/report/cogs/ProfitReportQuery'
import ProfitReportTable from '../../../components/table/report/cogs/profitReportTable'
export default function ProfitReport({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const langCode = localStorage.getItem('language') || '6';
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
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
            title: t('제품군- Nhóm thành phẩm'),
            id: 'ItemClassLName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('구분-Phân loại')
        },
        {
            title: t('Package'),
            id: 'ItemClassMName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('구분-Phân loại')
        },
        {
            title: t('모델명-Tên model'),
            id: 'ItemName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('구분-Phân loại')
        },
        {
            title: t('판매단가 (Đơn giá bán)(평균- bình quân)'),
            id: 'UnitPrice',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('판매수량-Số lượng bán hàng'),
            id: 'SaleQty',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('매출액-Doanh thu'),
            id: 'RevenueAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('원재료-NVL chính'),
            id: 'MatCosAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('재료비-Chi phí NVL')
        },
        {
            title: t('부자재-NVL phụ'),
            id: 'MatCosAmt1',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('재료비-Chi phí NVL')
        },
        {
            title: t('계Tổng'),
            id: 'TotalAmt1',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('재료비-Chi phí NVL')
        },
        {
            title: t('급여(한국) - Lương Hàn'),
            id: 'SalaryKrAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t("노무비-Chi phí nhân công")
        },
        {
            title: t('급여(베트남) - Lương Việt'),
            id: 'SalaryVNAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t("노무비-Chi phí nhân công")
        },
        {
            title: t('퇴직급여 - Trợ cấp thôi việc'),
            id: 'SeveranceAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t("노무비-Chi phí nhân công")
        },
        {
            title: t('복리후생비 - Bảo hiểm, Lợi ích khác'),
            id: 'InsurCostAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t("노무비-Chi phí nhân công")
        },
        {
            title: t('계Tổng'),
            id: 'TotalAmt2',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t("노무비-Chi phí nhân công")
        },
        {
            title: t('수도광열비 - Điện, nước, khí gas'),
            id: 'OtherExpenAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('제조경비-Chi phí sx chung')
        },
        {
            title: t('소모품비 - Công cụ dụng cụ, vật tư tiêu hao'),
            id: 'MatCosAmt2',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('제조경비-Chi phí sx chung')
        },
        { title: t('사무용품비 - Văn phòng phẩm, đồ dùng văn phòng'), id: 'ExpenAmt34', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('수선비 - Sửa chữa, bảo dưỡng'), id: 'ExpenAmt35', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('교육훈련비 - Đào tạo'), id: 'ExpenAmt36', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('감가비(건물) - Khấu hao nhà cửa'), id: 'ExpenAmt37', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('감가비(기계) - Khấu hao máy móc thiết bị'), id: 'ExpenAmt38', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('감가비(비품) - Khấu hao thiết bị quản lý'), id: 'ExpenAmt39', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('감가비(차량) - Khấu hao Phương tiện vận tải'), id: 'ExpenAmt40', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('무형자산상각비 - Khấu hao vô hình'), id: 'ExpenAmt41', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('외주가공비 - Phí gia công'), id: 'ExpenAmt42', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('지급수수료 - Chi phí khác'), id: 'ExpenAmt43', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('운반비 - Phí vận chuyển'), id: 'ExpenAmt44', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('토지임차료 - Thuê đất dài hạn'), id: 'ExpenAmt45', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('계Tổng'), id: 'TotalAmt3', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('제조경비-Chi phí sx chung') },
        { title: t('계-Tổng cộng'), id: 'TotalAmt4', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('매출총이익-Lợi nhuận gộp về bán hàng hóa'), id: 'GrossProfitSaleAmt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('%'), id: 'Percent', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('사무용품비 - Văn phòng phẩm, đồ dùng văn phòng'), id: 'ExpenAmt46', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('판매비-Chi phí bán hàng') },
        { title: t('감가비(차량) - Khấu hao Phương tiện vận tải'), id: 'ExpenAmt47', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('판매비-Chi phí bán hàng') },
        { title: t('보증,샘플비 - Bảo hành, khuyến mại'), id: 'ExpenAmt48', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('판매비-Chi phí bán hàng') },
        { title: t('운반비Chi phí vận chuyển'), id: 'ExpenAmt5', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('판매비-Chi phí bán hàng') },
        { title: t('로열티 - Royalty'), id: 'ExpenAmt49', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('판매비-Chi phí bán hàng') },
        { title: t('계Tổng'), id: 'TotalAmt5', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('판매비-Chi phí bán hàng') },
        { title: t('급여(한국) - Lương Hàn'), id: 'ExpenAmt50', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('급여(베트남) - Lương Việt'), id: 'ExpenAmt51', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('퇴직급여 - Trợ cấp thôi việc'), id: 'ExpenAmt52', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('복리후생비 - Bảo hiểm, Lợi ích khác'), id: 'ExpenAmt53', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('여비교통비 - Công tác phí'), id: 'ExpenAmt54', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('통신비 - Phí thông tin'), id: 'ExpenAmt62', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('수도광열비 - Điện, nước, khí gas'), id: 'ExpenAmt17', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('사무용품비 - Văn phòng phẩm, đồ dùng văn phòng'), id: 'ExpenAmt25', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('수선비 - Sửa chữa, bảo dưỡng'), id: 'ExpenAmt21', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('교육훈련비Chi phí đào tạo'), id: 'ExpenAmt23', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('도서인쇄비 - Phí in ấn'), id: 'ExpenAmt24', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('연구개발비 - Nghiên cứu phát triển'), id: 'ExpenAmt55', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('감가비(건물) - Khấu hao nhà cửa'), id: 'ExpenAmt27', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('감가비(기계) - Khấu hao máy móc thiết bị'), id: 'ExpenAmt28', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('감가비(비품) - Khấu hao thiết bị quản lý'), id: 'ExpenAmt56', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('무형자산상각비 - Khấu hao vô hình'), id: 'ExpenAmt30', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('지급수수료 - Chi phí khác'), id: 'ExpenAmt33', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('운반비 - Phí vận chuyển'), id: 'ExpenAmt22', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('세금과공과 - Chi phí thuế'), id: 'ExpenAmt19', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('접대비 - Ăn uống, tiếp khách'), id: 'ExpenAmt57', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('지급임차료 - Thuê xe, thuê nhà'), id: 'ExpenAmt58', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('토지임차료 - Thuê đất dài hạn'), id: 'ExpenAmt59', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('보험료 - Phí bảo hiểm'), id: 'ExpenAmt60', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('건물관리비 - Phí bảo trì tòa nhà'), id: 'ExpenAmt61', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('계 - Tổng'), id: 'TotalAmt6', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('관리비Chi phí quản lý') },
        { title: t('계 - Tổng cộng'), id: 'TotalAmt7', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('영업이익-Lợi nhuận bán hàng'), id: 'SaleProfitAmt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('%'), id: 'Percent2', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    ], [t]);





    const [menus, setMenus] = useState([])
    const [gridData, setGridData] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
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
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();

    const [formData, setFormData] = useState(dayjs().year(currentYear).month(currentMonth).endOf('month').subtract(1, 'month'));
    const [toDate, setToDate] = useState(dayjs().year(currentYear).month(currentMonth).endOf('month').subtract(1, 'month'));
    const [PrevFrAccYM, setPrevFrAccYM] = useState(dayjs().subtract(1, 'year').month(0).startOf('month'));
    const [PrevToAccYM, setPrevToAccYM] = useState(dayjs().subtract(1, 'year').month(currentMonth).endOf('month'));
    const [IsDisplayZero, setIsDisplayZero] = useState(true)
    const [IsInit, setIsInit] = useState(false)
    const [PrevIsInit, setPrevIsInit] = useState(false)

    const [FormatSeq, setFormatSeq] = useState(null)
    const [ProfitDivSeq, setProfitDivSeq] = useState(null)
    const [UMCustClass, setUMCustClass] = useState(null)
    const [displayLevels, setDisplayLevels] = useState(4)
    const [AccUnit, setAccUnit] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState('')
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch1, setDataSheetSearch1] = useState([])
    const [UMEmpType, setUMEmpType] = useState(null)
    const formatDate = (date) => date.format('YYYYMM')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'profit_report_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    useEffect(() => {
        cancelAllRequests()
        notification.destroy();
        message.destroy();
    }, [])

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







    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )
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
            HandleError([{
                success: false,
                message: t(error?.message) || 'Đã xảy ra lỗi khi tải dữ liệu!'
            }]);
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
    const handleSearchData = useCallback(async () => {
        const from = formData ? formatDate(formData) : '';
        const to = toDate ? formatDate(toDate) : '';

        const itemSeq = dataSheetSearch1?.[0]?.ItemSeq || '';
        const custSeq = dataSheetSearch?.[0]?.CustSeq || '';

        const searchParams = [{
            SMCostMng: 5512001,
            SMCostDiv: 5507002,
            ProfCostUnit: AccUnit || '',
            CostYMFr: from,
            CostYMTo: to,
            PJTSeq: itemSeq,
            UMCustClass: UMCustClass || '',
            ProfitDivSeq: ProfitDivSeq || '',
            CustSeq: custSeq,
        }];

        fetchGenericData({
            controllerKey: 'SESMCFProfitAmtQ',
            postFunction: SESMCFProfitAmtQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data || []);
                setNumRows(data?.length || 0);
            },
        });
    }, [
        formData,
        toDate,
        AccUnit,
        defaultCols,
        UMCustClass,
        ProfitDivSeq,
        dataSheetSearch,
        dataSheetSearch1
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
            const [res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11] = await Promise.allSettled([
                GetCodeHelpComboVer2('', langCode, 10002, 1, '%', '', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '1004', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 40030, 1, '%', '40030', '21', '11', '', signal),
                GetCodeHelpVer2(17001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(18080, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),

            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
            setHelpData04(res4.status === 'fulfilled' ? res4.value?.data || [] : []);
            setHelpData05(res5.status === 'fulfilled' ? res5.value?.data || [] : []);
        } finally {
            decreaseFetchCount();
            controllers.current.fetchCodeHelpData = null;
        }
    }, [langCode]);

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





    return (
        <>
            <Helmet>
                <title>{t('800000191')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <ProfitReportAction
                                handleSearchData={handleSearchData}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t border-b bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900" >
                                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase" >
                                    <FilterOutlined />
                                    {t('359')}
                                </h2>
                            </summary>
                            <ProfitReportQuery
                                formData={formData}
                                setFormData={setFormData}
                                toDate={toDate}
                                setToDate={setToDate}
                                setKeyItem3={setKeyItem3}
                                setKeyItem2={setKeyItem2}
                                keyItem2={keyItem2}
                                keyItem3={keyItem3}
                                helpData01={helpData01}
                                helpData02={helpData02}
                                setFormatSeq={setFormatSeq}
                                helpData03={helpData03}
                                setProfitDivSeq={setProfitDivSeq}
                                setUMCustClass={setUMCustClass}


                                setDataSearch={setDataSearch}
                                setDataSheetSearch={setDataSheetSearch}
                                setSearchText={setSearchText}
                                searchText={searchText}
                                setItemText={setItemText}
                                helpData04={helpData04}


                                setDataSearch1={setDataSearch1}
                                setItemText1={setItemText1}
                                setSearchText1={setSearchText1}
                                helpData05={helpData05}
                                setDataSheetSearch1={setDataSheetSearch1}
                                searchText1={searchText1}
                                setAccUnit={setAccUnit}




                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full ">
                        <ProfitReportTable
                            setSelection={setSelection}
                            selection={selection}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            numRows={numRows}
                            setGridData={setGridData}
                            gridData={gridData}
                            setNumRows={setNumRows}
                            setCols={setCols}
                            handleRowAppend={handleRowAppend}
                            cols={cols}
                            defaultCols={defaultCols}
                            canEdit={canEdit}
                            canCreate={canCreate}
                            setHelpData01={setHelpData01}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
