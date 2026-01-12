import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    useNavigate, useParams, createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import { notification, message, Tabs } from 'antd'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { HandleError } from '../../default/handleError'
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../../utils/decode-JWT'
import { filterValidRows } from '../../../../utils/filterUorA'
import { SolutionOutlined, DollarOutlined, PaperClipOutlined, FileTextOutlined } from '@ant-design/icons';


import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import PM01Table from '../../../components/table/project/contract/pm01Table'
import PM01Action from '../../../components/actions/project/contract/pm01Action'
import PM01Query from '../../../components/query/project/contract/pm01Query'
import PM01BTable from '../../../components/table/project/contract/pm01BTable'
import PM01CTable from '../../../components/table/project/contract/pm01CTable'
import PM01DTable from '../../../components/table/project/contract/pm01DTable'
import { ProjectMgmtAUD } from '../../../../features/project/ProjectMgmtAUD'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { TempFileP } from '../../../../features/tempFile/TempFileP'
import { HandleSuccess } from '../../default/handleSuccess'
import { SPJTSupplyContractResAUD } from '../../../../features/project/SPJTSupplyContractResAUD'
import { SupplyContractRemarkAUD } from '../../../../features/project/SupplyContractRemarkAUD'
import { TempFileD } from '../../../../features/tempFile/TempFileD'
import { TempFileQ } from '../../../../features/tempFile/TempFileQ'
import { PayConditionD } from '../../../../features/project/PayConditionD'
import { PayConditionQ } from '../../../../features/project/PayConditionQ'

import { SPJTSupplyContractQ } from '../../../../features/project/SPJTSupplyContractQ'
import { SPJTSupplyContractD } from '../../../../features/project/SPJTSupplyContractD'
import { SPJTSupplyContractResQ } from '../../../../features/project/SPJTSupplyContractResQ'
import { SPJTSupplyContractRemarkQ } from '../../../../features/project/SPJTSupplyContractRemarkQ'
import { HOST_API_SERVER_4 } from '../../../../services'

export default function PM01Page({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const langCode = localStorage.getItem('language') || '6';
    const activeFetchCountRef = useRef(0);
    const fileInputRef = useRef(null);
    const { seq } = useParams()
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Ngày dự định giao hàng'), id: 'DelvDueDate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: 'right', themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Dự án'), id: 'PJTName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Mã dự án'), id: 'PJTNo', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Có nguồn tiêu chuẩn hay không'), id: 'ISStd', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Nguồn cung ứng'), id: 'ResrcName', kind: 'Text', readonly: false, width: 250, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Mã sản phẩm'), id: 'ItemNo', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số lượng'), id: 'Qty', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Thời gian thuê (Ngày)'), id: 'DomAmt', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: 'right' },
        { title: t('Đơn giá'), id: 'Price', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số tiền'), id: 'Amt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Số tiền thuế giá trị gia tăng'), id: 'VATAmt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Tổng số tiền'), id: 'SumAmt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },

        { title: t('Ghi chú'), id: 'Remark', kind: 'Text', readonly: false, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: 'right' },
    ], [t]);
    const defaultColsB = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Điều kiện thanh tóan'), id: 'UMPayCondName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Tỷ lệ thanh toán'), id: 'PayRate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Số tiền thanh toán'), id: 'PayAmt', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Số tiền chi trả (nguyên tệ)'), id: 'DomPayAmt', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: false, trailingRowOptions: { disabled: true } },
        { title: t('Thanh toán thuế VAT'), id: 'PayVATAmt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Thuế giá trị gia tăng thanh toán bằng nguyên tệ'), id: 'DomPayVATAmt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: false, trailingRowOptions: { disabled: true }, },
        { title: t('Tổng số tiền thanh toán'), id: 'SumPayAmt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Tổng số tiền thanh toán (nguyên tệ)'), id: 'DomSumPayAmt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: false, trailingRowOptions: { disabled: true }, },
        { title: t('Ngày thanh toán dự kiến'), id: 'PayPlanDate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Ngày lặp lại'), id: 'PayRepeatDate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ghi chú'), id: 'PayCondRemark', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Trạng thái thanh toán'), id: 'PayCondStatus', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
    ], [t]);
    const defaultColsC = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Tên tệp tin'), id: 'OriginalName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Kích thước'), id: 'Size', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Thời gian'), id: 'CreatedAt', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    ], [t]);
    const defaultColsD = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Ghi chú'), id: 'Remark', kind: 'Text', readonly: false, width: 250, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Thời gian ghi chú'), id: 'RemarkDate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
    ], [t]);
    const [gridData, setGridData] = useState([])
    const [gridDataB, setGridDataB] = useState([])
    const [gridDataC, setGridDataC] = useState([])
    const [gridDataD, setGridDataD] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionB, setSelectionB] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionC, setSelectionC] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionD, setSelectionD] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearchB, setShowSearchB] = useState(false)
    const [showSearchC, setShowSearchC] = useState(false)
    const [showSearchD, setShowSearchD] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [addedRowsB, setAddedRowsB] = useState([])
    const [addedRowsD, setAddedRowsD] = useState([])

    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRowsB, setNumRowsB] = useState(0)
    const [numRowsC, setNumRowsC] = useState(0)
    const [numRowsD, setNumRowsD] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [keyItem1, setKeyItem1] = useState('')
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [keyItem4, setKeyItem4] = useState('')
    const [keyItem5, setKeyItem5] = useState('')


    const [current, setCurrent] = useState('0');
    const [checkPageA, setCheckPageA] = useState(false)
    const [whName, setWHName] = useState('')
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [helpData09, setHelpData09] = useState([])
    const [itemName, setItemName] = useState('')
    const [itemCode, setItemCode] = useState('')
    const [BizUnit, setBizUnit] = useState('')
    const [SupplyContName, setSupplyContName] = useState('')
    const [UMSupplyContType, setUMSupplyContType] = useState('')
    const [spec, setSpec] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [formDate, setFormDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs())
    const [RegDate, setRegDate] = useState(dayjs())
    const formatDate = (date) => date.format('YYYYMMDD')
    const [ReqNo, setReqNo] = useState('')
    const [TrackingNo, setTrackingNo] = useState('')
    const [InvoiceNo, setInvoiceNo] = useState('')
    const [LotNo, setLotNo] = useState('')
    const [SerialNo, setSerialNo] = useState('')
    const [Remark, setRemark] = useState('')


    const [SupplyContSeq, setSupplyContSeq] = useState(null)
    const [SupplyContNo, setSupplyContNo] = useState(null)

    const [searchText3, setSearchText3] = useState('')
    const [dataSearch3, setDataSearch3] = useState([])
    const [itemText3, setItemText3] = useState(null)
    const [dataSheetSearch3, setDataSheetSearch3] = useState([])


    const [searchText2, setSearchText2] = useState('')
    const [dataSearch2, setDataSearch2] = useState([])
    const [itemText2, setItemText2] = useState(null)
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])

    const [activeTab, setActiveTab] = useState("1");

    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState('')
    const [dataSearch, setDataSearch] = useState([])
    const [itemText, setItemText] = useState(null)
    const [itemText1, setItemText1] = useState(null)
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const secretKey = 'KEY_PATH_ERP'
    const [displayValue, setDisplayValue] = useState('');
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pm01_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [colsB, setColsB] = useState(() =>
        loadFromLocalStorageSheet(
            'pm01_b_a',
            defaultColsB.filter((col) => col.visible)
        )
    )
    const [colsC, setColsC] = useState(() =>
        loadFromLocalStorageSheet(
            'pm01_c_a',
            defaultColsC.filter((col) => col.visible)
        )
    )
    const [colsD, setColsD] = useState(() =>
        loadFromLocalStorageSheet(
            'pm01_D_a',
            defaultColsD.filter((col) => col.visible)
        )
    )


    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    useEffect(() => {
        // Grid A
        const emptyA = generateEmptyData(100, defaultCols);
        const updatedA = updateIndexNo(emptyA);
        setGridData(updatedA);
        setNumRows(updatedA.length + 1);

        // Grid B
        const emptyB = generateEmptyData(100, defaultColsB);
        const updatedB = updateIndexNo(emptyB);
        setGridDataB(updatedB);
        setNumRowsB(updatedB.length);

        // Grid D
        const emptyD = generateEmptyData(100, defaultColsD);
        const updatedD = updateIndexNo(emptyD);
        setGridDataD(updatedD);
        setNumRowsD(updatedD.length);

    }, [defaultCols, defaultColsB, defaultColsD]);

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
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
        }
    };

    const parseDateYYYYMMDD = (dateStr) => {
        if (!dateStr) return null;
        return dayjs(dateStr, "YYYYMMDD");
    };



    const decodeBase64Url = (base64Url) => {
        try {
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const padding =
                base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
            return base64 + padding
        } catch (error) {
            throw new Error('Invalid Base64 URL')
        }
    }

    const decryptData = (encryptedToken) => {
        try {
            const base64Data = decodeBase64Url(encryptedToken)
            const bytes = CryptoJS.AES.decrypt(base64Data, secretKey)
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
            return JSON.parse(decryptedData)
        } catch (error) {
            return null
        }
    }

    useEffect(() => {
        if (!seq) return;

        const decrypted = decryptData(seq);
        if (!decrypted?.SupplyContSeq) {
            return;
        }

        const searchParams = [{
            SupplyContSeq: decrypted.SupplyContSeq,
        }]
        const searchParams2 = {
            KeyItem1: decrypted.SupplyContSeq,
            KeyItem2: 'HĐ',
        }
        fetchGenericData({
            controllerKey: 'SPJTSupplyContractQ',
            postFunction: SPJTSupplyContractQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                const row = data?.[0];
                if (!row) return;

                if (row.BizUnit != null) setBizUnit(row.BizUnit);
                if (row.SupplyContNo != null) setSupplyContNo(row.SupplyContNo);
                if (row.SupplyContName != null) setSupplyContName(row.SupplyContName);
                setDisplayValue(decrypted.BizUnitName)

                setDataSearch3(prev => ({
                    ...prev,
                    CustSeq: row.SupplyContCustSeq ?? prev?.CustSeq
                }));
                if (row.SupplyContCustName != null) setSearchText3(row.SupplyContCustName);

                setDataSearch2(prev => ({
                    ...prev,
                    BeDeptSeq: row.SupplyContDeptSeq?.[0] ?? prev?.BeDeptSeq
                }));
                if (row.SupplyContDeptSeq?.[1] != null) setSearchText2(row.SupplyContDeptSeq[1]);

                setDataSearch(prev => ({
                    ...prev,
                    EmpSeq: row.SupplyContEmpSeq ?? prev?.EmpSeq,
                    SupplyContEmpName: row.SupplyContEmpName ?? prev?.SupplyContEmpName,
                }));
                if (row.SupplyContEmpName != null) setSearchText(row.SupplyContEmpName);
                if (row.SupplyContDateFr) {
                    setFormDate(parseDateYYYYMMDD(row.SupplyContDateFr));
                }

                if (row.SupplyContDateTo) {
                    setToDate(parseDateYYYYMMDD(row.SupplyContDateTo));
                }

                if (row.RegDate) {
                    setRegDate(parseDateYYYYMMDD(row.RegDate));
                }

                if (row.Remark != null) setRemark(row.Remark);

                setSupplyContSeq(decrypted.SupplyContSeq);

            },
        });
        fetchGenericData({
            controllerKey: 'SPJTSupplyContractResQ',
            postFunction: SPJTSupplyContractResQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'SPJTSupplyContractRemarkQ',
            postFunction: SPJTSupplyContractRemarkQ,
            searchParams,
            defaultCols: defaultColsD,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridDataD(data);
                setNumRowsD(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'PayConditionQ',
            postFunction: PayConditionQ,
            searchParams: searchParams2,
            defaultCols: defaultColsB,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridDataB(data);
                setNumRowsB(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'TempFileQ',
            postFunction: TempFileQ,
            searchParams: searchParams2,
            defaultCols: defaultColsC,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridDataC(data);
                setNumRowsC(data.length);
            },
        });
    }, [seq]);

    const handleSearchData = useCallback(async () => {
        if (!SupplyContSeq) {
            HandleError([
                {
                    success: false,
                    message: 'Không tim thấy thông tin số hợp đồng. Vui lòng kiểm tra lại!',
                },
            ]);
            return;
        }
        const searchParams = [{
            SupplyContSeq: SupplyContSeq,
        }]
        const searchParams2 = {
            KeyItem1: SupplyContSeq,
            KeyItem2: 'HĐ',
        }
        fetchGenericData({
            controllerKey: 'SPJTSupplyContractQ',
            postFunction: SPJTSupplyContractQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                const row = data?.[0];
                if (!row) return;

                if (row.BizUnit != null) setBizUnit(row.BizUnit);
                if (row.SupplyContNo != null) setSupplyContNo(row.SupplyContNo);
                if (row.SupplyContName != null) setSupplyContName(row.SupplyContName);
                setDataSearch3(prev => ({
                    ...prev,
                    CustSeq: row.SupplyContCustSeq ?? prev?.CustSeq
                }));
                if (row.SupplyContCustName != null) setSearchText3(row.SupplyContCustName);

                setDataSearch2(prev => ({
                    ...prev,
                    BeDeptSeq: row.SupplyContDeptSeq?.[0] ?? prev?.BeDeptSeq
                }));
                if (row.SupplyContDeptSeq?.[1] != null) setSearchText2(row.SupplyContDeptSeq[1]);

                setDataSearch(prev => ({
                    ...prev,
                    EmpSeq: row.SupplyContEmpSeq ?? prev?.EmpSeq,
                    SupplyContEmpName: row.SupplyContEmpName ?? prev?.SupplyContEmpName,
                }));
                if (row.SupplyContEmpName != null) setSearchText(row.SupplyContEmpName);

                if (row.SupplyContDateFr) {
                    setFormDate(parseDateYYYYMMDD(row.SupplyContDateFr));
                }

                if (row.SupplyContDateTo) {
                    setToDate(parseDateYYYYMMDD(row.SupplyContDateTo));
                }

                if (row.RegDate) {
                    setRegDate(parseDateYYYYMMDD(row.RegDate));
                }

                if (row.Remark != null) setRemark(row.Remark);

                setSupplyContSeq(SupplyContSeq);

            },
        });
        fetchGenericData({
            controllerKey: 'SPJTSupplyContractResQ',
            postFunction: SPJTSupplyContractResQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length + 1);
            },
        });
        fetchGenericData({
            controllerKey: 'SPJTSupplyContractRemarkQ',
            postFunction: SPJTSupplyContractRemarkQ,
            searchParams,
            defaultCols: defaultColsD,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridDataD(data);
                setNumRowsD(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'PayConditionQ',
            postFunction: PayConditionQ,
            searchParams: searchParams2,
            defaultCols: defaultColsB,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridDataB(data);
                setNumRowsB(data.length);
            },
        });
        fetchGenericData({
            controllerKey: 'TempFileQ',
            postFunction: TempFileQ,
            searchParams: searchParams2,
            defaultCols: defaultColsC,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridDataC(data);
                setNumRowsC(data.length);
            },
        });

    }, [SupplyContSeq,]);



    const fetchCodeHelpData = useCallback(async () => {
        increaseFetchCount();

        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();
        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.fetchCodeHelpData = controller;


        try {
            const [res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11] = await Promise.allSettled([
                GetCodeHelpComboVer2('', langCode, 10003, 1, '%', '', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '7021', '1001', '1', '', signal),

                GetCodeHelpVer2(17041, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(70023, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(18080, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),

                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '7011', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '2000056', '', '', '', signal),
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
            setHelpData04(res4.status === 'fulfilled' ? res4.value?.data || [] : []);
            setHelpData05(res5.status === 'fulfilled' ? res5.value?.data || [] : []);
            setHelpData06(res6.status === 'fulfilled' ? res6.value?.data || [] : []);
            setHelpData07(res7.status === 'fulfilled' ? res7.value?.data || [] : []);
            setHelpData08(res8.status === 'fulfilled' ? res8.value?.data || [] : []);
            setHelpData09(res9.status === 'fulfilled' ? res9.value?.data || [] : []);

        } finally {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
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


    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
                (row) => row !== undefined,
            ),
        )
    }


    // Append cho Grid A
    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            if (!canCreate) return;
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd);
        },
        [cols, canCreate]
    );

    // Append cho Grid B
    const handleRowAppendB = useCallback(
        (numRowsToAdd) => {
            if (!canCreate) return;
            onRowAppended(colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAdd);
        },
        [colsB, canCreate]
    );

    // Append cho Grid D
    const handleRowAppendD = useCallback(
        (numRowsToAdd) => {
            if (!canCreate) return;
            onRowAppended(colsD, setGridDataD, setNumRowsD, setAddedRowsD, numRowsToAdd);
        },
        [colsD, canCreate]
    );


    const nextPage = useCallback(async () => {
        const selected = getSelectedRowsData();

        if (!selected?.length) return;

        const firstSeq = selected[0]?.WHItemInSeq;

        // Kiểm tra tất cả có cùng WHItemInSeq
        const allSameSeq = selected.every(row => row.WHItemInSeq === firstSeq);

        if (!allSameSeq) {
            HandleError([
                {
                    success: false,
                    message: 'Yêu cầu quét nhập kho đơn lẻ đang không cùng số yêu cầu nhập kho!',
                },
            ]);
            return;
        }

        const filteredData = {
            IdSeq: firstSeq,
            ReqNo: selected[0]?.ReqNo,
        };




    }, [gridData, userFrom, selection]);

    const onChange = key => {
        console.log(key);
    };



    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;

        /** --------------------------
         * Validate Master bắt buộc
        --------------------------- */
        const masterRequired = [
            { value: SupplyContName, message: 'Vui lòng nhập tên hợp đồng!' },
            { value: BizUnit, message: 'Vui lòng nhập bộ phận kinh doanh!' },
            { value: RegDate, message: 'Vui lòng chọn ngày ký hợp đồng!' },
            { value: dataSearch?.EmpSeq, message: 'Vui lòng chọn nhân viên phụ trách!' },
            { value: dataSearch2?.BeDeptSeq, message: 'Vui lòng chọn phòng ban!' },
            { value: dataSearch3?.CustSeq, message: 'Vui lòng chọn khách hàng!' },
        ];

        for (const field of masterRequired) {
            if (!field.value) {
                HandleError([{ success: false, message: field.message }]);
                return;
            }
        }

        /** --------------------------
         * Tạo Master Data
        --------------------------- */
        const master = [{
            IdxNo: 1,
            CreatedBy: userFrom?.UserSeq,
            UpdatedBy: userFrom?.UserSeq,
            WorkingTag: Number(SupplyContSeq) > 0 ? "U" : "A",
            IsChangedMst: 0,
            SupplyContSeq: SupplyContSeq || "",
            SupplyContNo: SupplyContSeq ? SupplyContNo : "",
            SupplyContAppSeq: "0",
            SMSupplyAdjType: "7011001",
            SupplyContRev: "",
            SupplyContRevSeq: "",
            SupplyContName: SupplyContName,
            BizUnit: BizUnit || "",
            SupplyContDateFr: formDate ? formatDate(formDate) : "",
            SupplyContDateTo: toDate ? formatDate(toDate) : "",
            SupplyContCustSeq: dataSearch3?.CustSeq || "",
            RegDate: RegDate ? formatDate(RegDate) : "",
            UMSupplyContType: "7021001",
            SupplyContEmpSeq: dataSearch?.EmpSeq || "",
            SupplyContDeptSeq: dataSearch2?.BeDeptSeq || "",
            CurrSeq: 2,
            CurrRate: 1,
            SMSupplyChkType: "7057002",
            Remark: Remark || "",
            FileSeq: "0",
        }];

        /** --------------------------
         * Gom các grid theo A/U
        --------------------------- */
        const A = {
            gridA: filterValidRows(gridData, "A"),
            gridB: filterValidRows(gridDataB, "A"),
            gridD: filterValidRows(gridDataD, "A"),
        };

        const U = {
            gridA: filterValidRows(gridData, "U"),
            gridB: filterValidRows(gridDataB, "U"),
            gridD: filterValidRows(gridDataD, "U"),
        };

        /** --------------------------
         * Validate các Grid chỉ khi có dữ liệu
        --------------------------- */
        const requiredFields = [
            { key: "DelvDueDate", label: "Ngày dự định giao hàng" },
            { key: "PJTName", label: "Dự án" },
        ];
        const requiredFieldsB = [
            { key: "UMPayCondName", label: "Điều kiện thanh toán" },
            { key: "PayRate", label: "Tỷ lệ thanh toán" },
            { key: "PayAmt", label: "Số tiền thanh toán" },
            { key: "PayVATAmt", label: "Thanh toán thuế VAT" },
            { key: "PayPlanDate", label: "Ngày thanh toán dự kiến" },
            { key: "PayCondStatus", label: "Trạng thái thanh toán" },
        ];

        const validateGrid = (grid) =>
            grid.flatMap((row, i) =>
                requiredFields
                    .filter(f => !row[f.key]?.toString().trim())
                    .map(f => ({ message: `Cột ${f.label} không được để trống (hàng ${i + 1})` }))
            );
        const validateGridB = (grid) =>
            grid.flatMap((row, i) =>
                requiredFieldsB
                    .filter(f => !row[f.key]?.toString().trim())
                    .map(f => ({ message: `Cột ${f.label} không được để trống (hàng ${i + 1})` }))
            );

        let errors = [];
        if (A.gridA.length) errors.push(...validateGrid(A.gridA));
        if (U.gridA.length) errors.push(...validateGrid(U.gridA));
        if (A.gridB.length) errors.push(...validateGridB(A.gridB));
        if (U.gridB.length) errors.push(...validateGridB(U.gridB));

        if (errors.length) {
            HandleError([{ success: false, message: [errors[0].message] }]);
            return;
        }

        /** --------------------------
         * Gọi API cho dữ liệu A/U
        --------------------------- */
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const promises = [];

            if (master?.[0]?.WorkingTag === "A") {
                promises.push(ProjectMgmtAUD(master, A.gridA, A.gridD, A.gridB));
            }

            if (master?.[0]?.WorkingTag === "U") {
                const mergeUniqueById = (uArray = [], aArray = []) => {
                    const map = new Map();
                    uArray.forEach(item => map.set(item.IdxNo, item));
                    aArray.forEach(item => {
                        if (!map.has(item.IdxNo)) map.set(item.IdxNo, item);
                    });
                    return Array.from(map.values());
                };

                promises.push(ProjectMgmtAUD(master, mergeUniqueById(U.gridA, A.gridA), mergeUniqueById(U.gridD, A.gridD), mergeUniqueById(U.gridB, A.gridB)));
            }

            const responses = await Promise.all(promises);
            if (!responses.every(r => r?.success)) {
                HandleError(responses);
                return;
            }

            /** --------------------------
             * Chuẩn hóa dữ liệu trả về từ backend
            --------------------------- */
            const getArrayOrThrow = (value, label) => {
                if (Array.isArray(value)) return value;
                if (value == null) return [];
                if (value?.success === false) {
                    throw new Error(`${label} Error: ${value?.error?.originalError?.info?.message || value?.message || "Unknown error"}`);
                }
                throw new Error(`${label} Error: invalid data format`);
            };

            const addDataRaw = responses[0]?.data?.[0] || {};
            const updateDataRaw = responses[1]?.data?.[0] || {};

            const addData = {
                save1: addDataRaw?.save1?.[0] || {},
                resSave: getArrayOrThrow(addDataRaw?.resSave, "AddData SaveItem"),
                remarkSave: getArrayOrThrow(addDataRaw?.remarkSave, "AddData RemarkSave"),
                payConditionA: getArrayOrThrow(addDataRaw?.payConditionA?.data, "AddData PayConditionA"),
                payConditionU: getArrayOrThrow(addDataRaw?.payConditionU?.data, "AddData PayConditionU"),
            };

            const updateData = {
                save1: updateDataRaw?.save1?.[0] || {},
                resSave: getArrayOrThrow(updateDataRaw?.resSave, "UpdateData SaveItem"),
                remarkSave: getArrayOrThrow(updateDataRaw?.remarkSave, "UpdateData RemarkSave"),
                payConditionA: getArrayOrThrow(updateDataRaw?.payConditionA?.data, "UpdateData PayConditionA"),
                payConditionU: getArrayOrThrow(updateDataRaw?.payConditionU?.data, "UpdateData PayConditionU"),
            };

            const supplyContSeq = addData.save1?.SupplyContSeq || updateData.save1?.SupplyContSeq;
            const supplyContNo = addData.save1?.SupplyContNo || updateData.save1?.SupplyContNo;

            setSupplyContSeq(supplyContSeq);
            setSupplyContNo(supplyContNo);


            setGridData(prev => {
                const updated = prev.map(item => {
                    const found = [...addData.resSave, ...updateData.resSave].find(x => x?.IDX_NO === item?.IdxNo);
                    return found ? {
                        ...item,
                        Status: '',
                        SupplyContSeq: found.SupplyContSeq,
                        ResrcSeq: found.ResrcSeq,
                        SupplyContNo: found.SupplyContNo,
                        SerialNo: found.SerialNo,
                        UMContSupplyType: found.UMContSupplyType,
                        WBSSeq: found.WBSSeq,
                        ResrcSerl: found.ResrcSerl,
                    } : item;
                });
                return updateIndexNo(updated);
            });

            setGridDataB(prev => {
                const updated = prev.map(item => {
                    const found = [...addData.payConditionA, ...addData.payConditionU, ...updateData.payConditionA, ...updateData.payConditionU].find(x => x?.IdxNo === item?.IdxNo);
                    return found ? {
                        ...item,
                        Status: '',
                        SupplyContSeq: found.SupplyContSeq,
                        IdSeq: found.IdSeq,
                    } : item;
                });
                return updateIndexNo(updated);
            });

            setGridDataD(prev => {
                const updated = prev.map(item => {
                    const found = [...addData.remarkSave, ...updateData.remarkSave].find(x => x?.IDX_NO === item?.IdxNo);
                    return found ? {
                        ...item,
                        Status: '',
                        SupplyContSeq: found.SupplyContSeq,
                        RemarkSerl: found.RemarkSerl,
                    } : item;
                });
                return updateIndexNo(updated);
            });

        } catch (err) {
            HandleError([{ success: false, message: err.message }]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }

    }, [gridData, gridDataB, gridDataD, canCreate, SupplyContSeq, dataSearch, dataSearch2, dataSearch3, Remark, BizUnit, formDate, toDate, SupplyContName, RegDate]);

    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, [fileInputRef]);
    const handleUpload = async (event) => {

        if (!SupplyContSeq) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng tạo mã hợp đồng trước khi tải tệp đính kèm!',
                },
            ]);
            event.target.value = null;
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return;
        }
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        const files = Array.from(event.target.files);
        if (files.length === 0) {
            event.target.value = null;
            return;
        }

        const currentDate = new Date();
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}${mm}${dd}`;

        const resultData = {
            IdSeq: SupplyContSeq,
            Time: formattedDate,
            CreatedBy: userFrom?.UserSeq,
            SupplyContSeq: SupplyContSeq
        };
        try {
            const result = await TempFileP(files, resultData);

            if (result.success && Array.isArray(result.data)) {
                setGridDataC(prev => [...prev, ...result.data]);
                setNumRowsC(prev => prev + result.data.length);
                HandleSuccess([
                    {
                        success: true,
                        message: 'Tải tệp đính kèm thành công',
                    },
                ]);
            } else {
                HandleError([
                    {
                        success: false,
                        message: t(result?.message) || 'Đã xảy ra lỗi khi tải lên!',
                    },
                ]);
            }
        } catch (error) {
            HandleError([
                {
                    success: false,
                    message: 'Lỗi hệ thống khi tải lên!',
                },
            ]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
            event.target.value = null;
        }
    };
    const getSelectedRowsA = () => {
        return selection.rows.items.flatMap(([start, end]) =>
            gridData.slice(start, end)
        );
    };
    const getSelectedRowsB = () => {
        return selectionB.rows.items.flatMap(([start, end]) =>
            gridDataB.slice(start, end)
        );
    };
    const getSelectedRowsC = () => {
        return selectionC.rows.items.flatMap(([start, end]) =>
            gridDataC.slice(start, end)
        );
    };
    const getSelectedRowsD = () => {
        return selectionD.rows.items.flatMap(([start, end]) =>
            gridDataD.slice(start, end)
        );
    };

    const resetTableB = () => {
        setSelectionB({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const resetTableC = () => {
        setSelectionC({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const resetTableD = () => {
        setSelectionD({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }


    const HandOpenFile = useCallback(async () => {
        try {
            const selectedRows = getSelectedRowsC();

            if (!selectedRows || selectedRows.length === 0) {
                return HandleError([{ success: false, message: 'Chưa chọn file nào!' }]);
            }

            const pdfUrls = selectedRows.map(row => {
                const cleanedPath = row.Path.replace(/^.*storage_erp[\\/]/, "");
                return `${HOST_API_SERVER_4}/${cleanedPath}`;
            });


            const isElectron = !!window?.electron?.openPDFWindow;

            if (isElectron) {
                // Mở từng file trong electron window
                for (const url of pdfUrls) {
                    window.electron.openPDFWindow(url);
                }
            } else {
                // Web: mở tab mới cho từng file
                for (const url of pdfUrls) {
                    window.open(url, "_blank");
                }
            }
        } catch (error) {
            HandleError([{ success: false, message: t(error?.message) }]);
        }
    }, [selectionC, gridDataC]);
    const HandDownloadFile = useCallback(async () => {
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();
        try {
            const selectedRows = getSelectedRowsC();

            if (!selectedRows || selectedRows.length === 0) {
                return HandleError([{ success: false, message: 'Chưa chọn file nào!' }]);
            }

            for (const row of selectedRows) {
                const pathFile = row.Path;
                if (!pathFile) continue;

                const fileName = row.OriginalName.split("\\").pop() || "file.pdf";
                const cleanedPath = pathFile.replace(/^.*storage_erp[\\/]/, "");
                const url = `${HOST_API_SERVER_4}/${cleanedPath}`;

                const response = await fetch(url, { method: 'GET' });
                if (!response.ok) continue;

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(blobUrl);
            }
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        } catch (error) {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
            HandleError([{ success: false, message: 'Đã xảy ra lỗi khi download!' }]);
        }
    }, [selectionC, gridDataC]);
    const items = [
        {
            key: '1',
            label: (
                <span className="flex items-center gap-1  text-blue-700">
                    <SolutionOutlined />
                    Nguồn cung ứng
                </span>
            ),
            children: (
                <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-auto">
                    <PM01Table
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
                        canCreate={canCreate}
                        defaultCols={defaultCols}
                        canEdit={canEdit}
                        helpData06={helpData06}
                        setHelpData06={setHelpData06}
                        helpData07={helpData07}
                        setHelpData07={setHelpData07}
                        handleRowAppend={handleRowAppend}
                    />
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <span className="flex items-center gap-1  text-green-700">
                    <DollarOutlined />
                    Điều kiện thanh toán
                </span>
            ),
            children: <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-auto">
                <PM01BTable
                    setSelection={setSelectionB}
                    selection={selectionB}
                    showSearch={showSearchB}
                    setShowSearch={setShowSearchB}
                    numRows={numRowsB}
                    setGridData={setGridDataB}
                    gridData={gridDataB}
                    setNumRows={setNumRowsB}
                    setCols={setColsB}
                    cols={colsB}
                    canCreate={canCreate}
                    defaultCols={defaultColsB}
                    canEdit={canEdit}
                    helpData08={helpData08}
                    setHelpData08={setHelpData08}
                    handleRowAppend={handleRowAppendB}
                    helpData09={helpData09}
                    setHelpData09={setHelpData09}
                /></div >,
        },
        {
            key: '3',
            label: (
                <span className="flex items-center gap-1  text-orange-700">
                    <PaperClipOutlined />
                    Quản lý tệp tin đính kèm
                </span>
            ),
            children: <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-auto">
                <PM01CTable
                    setSelection={setSelectionC}
                    selection={selectionC}
                    showSearch={showSearchC}
                    setShowSearch={setShowSearchC}
                    numRows={numRowsC}
                    setGridData={setGridDataC}
                    gridData={gridDataC}
                    setNumRows={setNumRowsC}
                    setCols={setColsC}
                    cols={colsC}
                    canCreate={canCreate}
                    defaultCols={defaultColsC}
                    canEdit={canEdit}
                    fileInputRef={fileInputRef}
                    triggerFileInput={triggerFileInput}
                    handleUpload={handleUpload}
                    HandOpenFile={HandOpenFile}
                    HandDownloadFile={HandDownloadFile}
                /></div >,
        },
        {
            key: '4',
            label: (
                <span className="flex items-center gap-1  text-purple-700">
                    <FileTextOutlined />
                    Ghi chú
                </span>
            ),
            children: <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-auto">
                <PM01DTable
                    setSelection={setSelectionD}
                    selection={selectionD}
                    showSearch={showSearchD}
                    setShowSearch={setShowSearchD}
                    numRows={numRowsD}
                    setGridData={setGridDataD}
                    gridData={gridDataD}
                    setNumRows={setNumRowsD}
                    setCols={setColsD}
                    cols={colsD}
                    canCreate={canCreate}
                    defaultCols={defaultColsD}
                    canEdit={canEdit}
                    handleRowAppend={handleRowAppendD}

                /></div >,
        },
    ];
    const tabConfig = {
        "1": {
            gridData,
            setGridData,
            numRows,
            setNumRows,
            selection: selection,
            getSelectedRows: getSelectedRowsA,
            apiDelete: SPJTSupplyContractResAUD,
            updateIndex: updateIndexNo,
            resetTable: resetTable,
            keyField: 'IdxNo'
        },
        "2": {
            gridData: gridDataB,
            setGridData: setGridDataB,
            numRows: numRowsB,
            setNumRows: setNumRowsB,
            selection: selectionB,
            getSelectedRows: getSelectedRowsB,
            apiDelete: PayConditionD,
            updateIndex: updateIndexNo,
            resetTable: resetTableB,
            keyField: 'IdSeq'
        },
        "3": {
            gridData: gridDataC,
            setGridData: setGridDataC,
            numRows: numRowsC,
            setNumRows: setNumRowsC,
            selection: selectionC,
            getSelectedRows: getSelectedRowsC,
            apiDelete: TempFileD,
            updateIndex: updateIndexNo,
            resetTable: resetTableC,
            keyField: 'IdSeq'
        },
        "4": {
            gridData: gridDataD,
            setGridData: setGridDataD,
            numRows: numRowsD,
            setNumRows: setNumRowsD,
            selection: selectionD,
            getSelectedRows: getSelectedRowsD,
            apiDelete: SupplyContractRemarkAUD,
            updateIndex: updateIndexNo,
            resetTable: resetTableD,
            keyField: 'IdxNo'
        }
    };

    const handleDeleteDataSheet = useCallback(() => {
        if (canDelete === false) return;

        const config = tabConfig[activeTab]; // lấy config của tab đang mở

        const {
            gridData,
            setGridData,
            numRows,
            setNumRows,
            getSelectedRows,
            apiDelete,
            updateIndex,
            resetTable
        } = config;
        const keyField = config.keyField;
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        const selectedRows = getSelectedRows();

        const rowsWithStatusD = selectedRows
            .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === 'E')
            .map(row => ({
                ...row,
                Status: 'D',
                WorkingTag: 'D'
            }));


        const rowsWithStatusA = selectedRows.filter(row => row.Status === 'A');

        const finish = () => {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        };

        if (rowsWithStatusD.length > 0) {
            apiDelete(rowsWithStatusD)
                .then(response => {
                    if (response.success) {
                        const deletedIds = rowsWithStatusD.map(item => item[keyField]);
                        const updatedData = gridData.filter(row => !deletedIds.includes(row[keyField]));

                        setGridData(updateIndex(updatedData));
                        setNumRows(updatedData.length);
                        resetTable();
                    } else {
                        HandleError([{ success: false, message: response.message }]);
                    }
                })
                .catch(error => {
                    HandleError([{ success: false, message: error.message }]);
                })
                .finally(finish);
        } else {
            if (rowsWithStatusA.length > 0) {
                const idsA = rowsWithStatusA.map(row => row.Id);
                const remaining = gridData.filter(row => !idsA.includes(row.Id));

                setGridData(updateIndex(remaining));
                setNumRows(remaining.length);
                resetTable();
            }
            finish();
        }
    }, [activeTab, tabConfig]);

    const CreateNew = () => {
        const route = `/pm/project-mgmt/pm01`;
        const isElectron = !!window?.electron?.openRoute;
        isElectron
            ? window.electron.openRoute(route)
            : window.open(route, '_blank');
        window.close();
        localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true));
    };

    const resetAll = () => {
        // Reset các form chính
        setBizUnit('');
        setSupplyContNo(null);
        setSupplyContName('');
        setUMSupplyContType('');
        setSpec('');
        setDisplayValue('');

        // Reset ngày tháng
        setFormDate(dayjs().startOf('month'));
        setToDate(dayjs());
        setRegDate(dayjs());


        setSupplyContSeq(null);

        // Reset các text search
        setSearchText('');
        setSearchText1('');
        setSearchText2('');
        setSearchText3('');

        // Reset dữ liệu search
        setDataSearch([]);
        setDataSearch1([]);
        setDataSearch2([]);
        setDataSearch3([]);

        const emptyA = generateEmptyData(100, defaultCols);
        const updatedA = updateIndexNo(emptyA);
        setGridData(updatedA);
        setNumRows(updatedA.length);

        // Grid B
        const emptyB = generateEmptyData(100, defaultColsB);
        const updatedB = updateIndexNo(emptyB);
        setGridDataB(updatedB);
        setNumRowsB(updatedB.length);

        // Grid D
        const emptyD = generateEmptyData(100, defaultColsD);
        const updatedD = updateIndexNo(emptyD);
        setGridDataD(updatedD);
        setNumRowsD(updatedD.length);

        setRemark('');


    };

    const handleDeleteDataSheetMater = useCallback(
        (e) => {
            if (canDelete === false) return;
            if (!SupplyContSeq && !SupplyContNo) {
                HandleError([
                    {
                        success: false,
                        message: 'Không tìm thấy thông tin hợp đồng!',
                    },
                ]);
                togglePageInteraction(false);
                loadingBarRef.current?.complete();
                return;
            }
            togglePageInteraction(true);
            loadingBarRef.current?.continuousStart();


            const rowsWithStatusD = [{
                IdxNo: 1,
                CreatedBy: userFrom?.UserSeq,
                UpdatedBy: userFrom?.UserSeq,
                WorkingTag: "D",
                IsChangedMst: 0,
                SupplyContSeq: SupplyContSeq,
                SupplyContNo: SupplyContNo,
                SupplyContAppSeq: "0",
                SMSupplyAdjType: "7011001",
                SupplyContRev: "",
                SupplyContRevSeq: "",
                SupplyContName: SupplyContName,
                BizUnit: BizUnit || "",
                SupplyContDateFr: formDate ? formatDate(formDate) : "",
                SupplyContDateTo: toDate ? formatDate(toDate) : "",
                SupplyContCustSeq: dataSearch3?.CustSeq || "",
                RegDate: RegDate ? formatDate(RegDate) : "",
                UMSupplyContType: "7021001",
                SupplyContEmpSeq: dataSearch?.EmpSeq || "",
                SupplyContDeptSeq: dataSearch2?.BeDeptSeq || "",
                CurrSeq: 2,
                CurrRate: 1,
                SMSupplyChkType: "7057002",
                Remark: Remark || "",
                FileSeq: "0",
            }];

            const finish = () => {
                loadingBarRef.current?.complete();
                togglePageInteraction(false);
            };

            if (rowsWithStatusD.length > 0) {
                SPJTSupplyContractD(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            resetAll()
                            HandleSuccess([
                                {
                                    success: true,
                                    message: 'Xóa thông tin hợp đồng thành công!',
                                },
                            ]);
                        } else {

                            HandleError([
                                {
                                    success: false,
                                    message: response.message || 'Đã xảy ra lỗi khi xóa!',
                                },
                            ]);
                        }
                    })
                    .catch((error) => {
                        HandleError([
                            {
                                success: false,
                                message: error.message || 'Đã xảy ra lỗi khi xóa!',
                            },
                        ]);
                    })
                    .finally(() => {
                        finish();
                    });
            }
        }, [gridData, gridDataB, gridDataD, canDelete, SupplyContSeq, dataSearch, dataSearch2, dataSearch3, Remark, BizUnit, formDate, toDate, SupplyContName, RegDate]

    );
    return (
        <>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className=" bg-white h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg">
                        <div className="flex items-center  justify-end bg-white p-1">
                            <PM01Action
                                handleSearchData={handleSearchData}
                                nextPage={nextPage}
                                handleSaveData={handleSaveData}
                                triggerFileInput={triggerFileInput}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                                SupplyContSeq={SupplyContSeq}
                                CreateNew={CreateNew}
                                SupplyContNo={SupplyContNo}
                                handleDeleteDataSheetMater={handleDeleteDataSheetMater}
                            />
                        </div>

                        <details
                            className="group [&_summary::-webkit-details-marker]:hidden border-t border-b   bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-1 gap-1.5 border-b text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[9px] font-medium flex items-center text-blue-800   uppercase">
                                    {t('ĐĂNG KÝ THÔNG TIN HỢP ĐỒNG')}
                                </h2>
                            </summary>
                            <PM01Query
                                helpData01={helpData01}
                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}
                                helpData05={helpData05}
                                setHelpData05={setHelpData05}
                                BizUnit={BizUnit}
                                setBizUnit={setBizUnit}
                                setUMSupplyContType={setUMSupplyContType}
                                formDate={formDate}
                                setFormDate={setFormDate}
                                toDate={toDate}
                                setToDate={setToDate}
                                SupplyContNo={SupplyContNo}
                                setSupplyContNo={setSupplyContNo}
                                SupplyContName={SupplyContName}
                                setSupplyContName={setSupplyContName}
                                setDisplayValue={setDisplayValue}
                                displayValue={displayValue}



                                setSearchText3={setSearchText3}
                                searchText3={searchText3}
                                setDataSearch3={setDataSearch3}
                                setItemText3={setItemText3}
                                setDataSheetSearch3={setDataSheetSearch3}



                                setSearchText2={setSearchText2}
                                searchText2={searchText2}
                                setDataSearch2={setDataSearch2}
                                setItemText2={setItemText2}
                                setDataSheetSearch2={setDataSheetSearch2}


                                setSearchText={setSearchText}
                                searchText={searchText}
                                setDataSearch={setDataSearch}
                                setItemText={setItemText}
                                setDataSheetSearch={setDataSheetSearch}
                                setSearchText1={setSearchText1}
                                setItemText1={setItemText1}
                                setDataSearch1={setDataSearch1}


                                RegDate={RegDate}
                                setRegDate={setRegDate}
                                Remark={Remark}
                                setRemark={setRemark}


                            />
                        </details>
                    </div>
                    <div className=" w-full h-full mt-5 ">
                        <Tabs defaultActiveKey="1"
                            type="card"
                            size="small"
                            items={items}
                            className="h-full "
                            onChange={(key) => setActiveTab(key)}
                        />
                    </div>


                </div>
            </div>

        </>
    )
}
