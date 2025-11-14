import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Button, message, Modal, Collapse } from 'antd'
const { Title, Text } = Typography
import { useParams, useNavigate } from 'react-router-dom'
import { FilterOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce } from 'lodash'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar';
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'

import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

import TablePdmmOutExtra from '../../components/table/pdmm/tablepdmmOutExtra'
import PdmmOutExtraQuery from '../../components/query/pdmm/pdmmOutExtraQuery'
import PdmmOutExtraAction from '../../components/actions/pdmm/pdmmOutExtraAction'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { GetWcQuery } from '../../../features/wc/wcQ'
import { PostAOutReq } from '../../../features/pdmm/postAOutReq'
import { PostDOutReq } from '../../../features/pdmm/postDOutReq'
import CryptoJS from 'crypto-js'
import { PostQOutReq } from '../../../features/pdmm/postQOutReq'
import { PostQOutItemReq } from '../../../features/pdmm/postQOutItemReq'
import { PostCheckOutReqItem } from '../../../features/pdmm/postCheckOutReqItem'
import { PostUOutReq } from '../../../features/pdmm/postUOutReq'
import { PostDOutReqItem } from '../../../features/pdmm/postDOutReqItem'
import { PostAOutReqItem } from '../../../features/pdmm/postAOutReqItem'
import { generatePrintCode } from '../../../utils/generatePrintCode'
import { PrintPdmmOutExtra } from '../../../features/invocie/printPdmmOutExtra'
import { HOST_API_SERVER_11 } from '../../../services'
export default function PdmmOutExtra({ permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    controllers,
    cancelAllRequests
}) {
    /* ADD */
    const { t } = useTranslation()
    const gridRef = useRef(null)
    const navigate = useNavigate()
    const { seq } = useParams()
    const loadingBarRef = useRef(null);
    const defaultCols = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderLookup
        },




        {
            title: t('2170'),
            id: 'ItemName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' },
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2169'),
            id: 'ItemNo',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('1969'),
            id: 'Spec',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('602'),
            id: 'UnitName',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Work center',
            id: 'WorkCenterName',
            kind: 'Text',
            readonly: true,
            width: 250,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('584'),
            id: 'OutWHName',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('626'),
            id: 'Memo1',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('31773'),
            id: 'Memo4',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('31773'),
            id: 'Memo5',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('4382'),
            id: 'Qty',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' },
            icon: GridColumnIcon.HeaderNumber,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('19138'),
            id: 'Memo2',
            kind: 'Text',
            readonly: true,
            width: 350,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderNumber,
            themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' },
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('Ghi Chú'),
            id: 'Remark',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderNumber,
            trailingRowOptions: {
                disabled: true,
            },
        },



    ], [t]);
    const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'))
    const [showSearch, setShowSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [gridData, setGridData] = useState([])
    const [numRows, setNumRows] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [searchText2, setSearchText2] = useState('')
    const [searchText3, setSearchText3] = useState('')
    const [itemText, setItemText] = useState('')
    const [itemText2, setItemText2] = useState('')
    const [itemText3, setItemText3] = useState('')
    const [dataSearch, setDataSearch] = useState(null)
    const [dataSearch2, setDataSearch2] = useState(null)
    const [dataSearch3, setDataSearch3] = useState(null)
    const [helpData01, setHelpData01] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const [dataSheetSearch3, setDataSheetSearch3] = useState([])
    const [addedRows, setAddedRows] = useState([])
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())
    const [FactUnit, setFactUnit] = useState('')
    const [ProdReqNo, setProdReqNo] = useState('')
    const [ReqType, setReqType] = useState('')
    const [ProdType, setProdType] = useState('')
    const [editedRows, setEditedRows] = useState([])
    const [checkFrom, setCheckFrom] = useState(false)
    const [subRemark, setSubRemark] = useState('')
    const [OutReqSeq, setOutReqSeq] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [checkProdReqSeq, setCheckProdReqSeq] = useState(false)
    const [checkProdReqSeqType, setCheckProdReqSeqType] = useState(null)
    const [materData, setMaterData] = useState([])
    const [loadingA, setLoadingA] = useState(false)
    const [PathSeq, setPathSeq] = useState([])
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdmm_out_extra_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })



    const secretKey = 'KEY_PATH'
    const decodeBase64Url = (base64Url) => {
        try {
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
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

            navigate(`/wms/u/prod_mgmt/pdmm/pdmm_out_query_list`)
            return null
        }
    }
    const fetchDataRoot = async (seq) => {
        setLoadingA(true);

        if (controllers.current.fetchDataRoot) {
            controllers.current.fetchDataRoot.abort();
            controllers.current.fetchDataRoot = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        loadingBarRef.current?.continuousStart();
        togglePageInteraction(true);

        const controller = new AbortController();
        controllers.current.fetchDataRoot = controller;

        try {
            const response = await PostQOutReq({ OutReqSeq: seq });
            if (response.success) {

                setMaterData(response.data);
                setOutReqSeq(response.data[0]?.OutReqNo || '');
                setFactUnit(response.data[0]?.FactUnit || '');
                setSubRemark(response.data[0]?.Remark || '');
                setSearchText(response.data[0]?.DeptName || '');
                setSearchText2(response.data[0]?.EmpName || '');
                setDataSearch2(response.data[0])
                setDataSearch(response.data[0])
            } else {
                setMaterData([]);
            }
        } catch (error) {
            setMaterData([]);
        } finally {
            loadingBarRef.current?.complete();
            setLoadingA(false);
            togglePageInteraction(false);
            controllers.current.fetchDataRoot = null;
        }
    };
    const fetchDataItemRoot = async (seq) => {
        setLoadingA(true);

        if (controllers.current.fetchDataItemRoot) {
            controllers.current.fetchDataItemRoot.abort();
            controllers.current.fetchDataItemRoot = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        loadingBarRef.current?.continuousStart();
        togglePageInteraction(true);

        const controller = new AbortController();
        controllers.current.fetchDataItemRoot = controller;

        try {
            const response = await PostQOutItemReq({ OutReqSeq: seq });
            if (response.success) {
                const fetchedData = response.data || [];
                const emptyData = generateEmptyData(100, defaultCols)
                const combinedData = [...fetchedData, ...emptyData];
                const updatedData = updateIndexNo(combinedData);
                setGridData(updatedData);
                setNumRows(updatedData.length + 1);
                setDataSearch3(response.data[0] ? {
                    MatOutWhName: response.data[0].OutWHName,
                    WorkCenterName: response.data[0].WorkCenterName,
                    ProdInWhName: response.data[0].Memo1,
                    MatOutWhSeq: response.data[0].Memo4,
                    ProdInWhSeq: response.data[0].Memo5,
                    WorkCenterSeq: response.data[0].WorkCenterSeq,
                } : {});
                setSearchText3(response.data[0].WorkCenterName)


            } else {
                setGridData([]);
                setNumRows(1)
            }
        } catch (error) {
            setGridData([]);
            setNumRows(1)
        } finally {
            loadingBarRef.current?.complete();
            setLoadingA(false);
            togglePageInteraction(false);
            controllers.current.fetchDataItemRoot = null;
        }
    };
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])

    useEffect(() => {
        const emptyData = generateEmptyData(100, defaultCols)
        const updatedEmptyData = updateIndexNo(emptyData)
        setGridData(updatedEmptyData)
        setNumRows(emptyData.length + 1)
    }, [])

    const fetchCodeHelpData = useCallback(async () => {
        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.fetchCodeHelpData = controller;
        setLoading(true)
        try {
            const search = {
                FactUnit: '',
                SMWorkCenterType: '',
                WorkCenterName: '',
                DeptName: ''

            };
            const [
                help01,
                help03,
                help05,
                help06,
                help07,
                help08,

            ] = await Promise.all([
                GetCodeHelpVer2(18001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpComboVer2(
                    '',
                    6,
                    60001,
                    1,
                    '%',
                    '',
                    '',
                    '',
                    '',
                    signal
                ),
                GetWcQuery(search, signal),
                GetCodeHelpVer2(10009, userFromLocalStorage?.UserId, '', '', '', '', '', 1, 1, '', 0, 0, 0, signal),

            ])
            setHelpData01(help01?.data || [])
            setHelpData03(help03?.data || [])
            setHelpData05(help05?.data || [])
            setHelpData06(help06?.data || [])
            setHelpData07(help07?.data || [])
            setHelpData08(help08?.data || [])


        } catch (error) {
            setHelpData01([])
            setHelpData03([])
            setHelpData05([])
            setHelpData06([])
            setHelpData07([])
            setHelpData08([])

        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            controllers.current.fetchCodeHelpData = null;
            setLoading(false)
        }
    }, [])

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


    useEffect(() => {
        if (seq) {
            const data = decryptData(seq);
            if (!data) {

                return;
            }
            setPathSeq(data?.OutReqSeq)
            fetchDataRoot(data?.OutReqSeq);
            fetchDataItemRoot(data?.OutReqSeq);
        } else {

            if (helpData08?.length) {
                const foundUser = helpData08.find(item => item.EmpID === userFromLocalStorage?.UserId);

                if (foundUser) {
                    setSearchText2(foundUser.EmpName);
                    setItemText2(foundUser.EmpName);
                    setSearchText(foundUser.DeptName);
                    setDataSearch2(foundUser);
                    setDataSheetSearch([foundUser]);
                }
            }
        }
    }, [helpData05]);



    const handleRowAppendA = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )
    const newFrom = async () => {
        const columnsA = [
            'ItemName', 'ItemSeq', 'ItemNo', 'Spec', 'UnitName', 'Qty',
            'EndDate', 'DelvDate', 'CustName', 'CustSeq', 'ProdReqSeq',
            'PlanDeptName', 'Remark', 'Memo', 'IdxNo', 'PlanDeptSeq', 'UnitSeq'
        ];

        const resulA = filterAndSelectColumns(gridData, columnsA, 'A');
        const resulU = filterAndSelectColumns(gridData, columnsA, 'U');

        const hasDataA = resulA.length > 0;
        const hasDataU = resulU.length > 0;


        if (hasDataA || hasDataU) {
            setCheckFrom(true);
        } else {
            restFrom()
        }

    };
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



    const restFrom = () => {
        setCheckFrom(false);
        const emptyData = generateEmptyData(50, defaultCols)
        const updatedEmptyData = updateIndexNo(emptyData)
        setGridData(updatedEmptyData)
        setNumRows(emptyData.length)
        setSubRemark('')
        setOutReqSeq('')
        setMaterData([])
        setCheckProdReqSeq(false)
        setSearchText3('')
        setDataSearch3(null)
        navigate('/wms/u/prod_mgmt/pdmm/pdmm_out_extra')
    }
    const handleDelete = useCallback(async () => {
        if (!canDelete) return true;

        const requiredColumns = ['ItemName', 'Qty', 'WorkCenterName'];

        setCheckFrom(false);

        let filteredGridData = gridData.filter(item => item.OutReqSeq);

        const missingRequired = filteredGridData.some(item =>
            requiredColumns.some(column => !item[column] || item[column] === null || item[column] === undefined)
        );


        if (filteredGridData.length === 0) {
            togglePageInteraction(false);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            message.warning(t('KHông có dữ liệu nào để xóa'));
            return true;
        }

        if (missingRequired) {
            message.warning(t('Thiếu thông tin bắt buộc!'));
            togglePageInteraction(false);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            return true;
        }

        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true);
        try {
            const rootData = {
                IsConfirm: 0,
                OutReqSeq: materData[0].OutReqSeq,
                OutReqNo: materData[0].OutReqNo,
                IsOutSide: '',
                UseType: materData[0].UseType,
                FactUnit: materData[0].FactUnit,
                SupplyContCustSeq: '',
                ReqDate: toDate ? formatDate(toDate) : '',
                DeptName: materData[0]?.BeDeptName,
                EmpSeq: materData[0]?.EmpSeq || '',
                DeptSeq: materData[0]?.DeptSeq || '',
                EmpName: materData[0]?.EmpName || '',
                Remark: materData[0]?.Remark,
                IsReturn: 0,
            };
            const resultCheck = {
                IsChangedMst: materData[0]?.IsConfirm,
                WorkingTag: "U",
                OutReqSeq: materData[0]?.OutReqSeq,
            }

            const results = await Promise.all([PostDOutReq(rootData, filteredGridData, resultCheck)]);
            const isSuccess = results.every(result => result?.success);

            if (isSuccess) {
                message.success(t('Xóa thành công!'));
                const emptyData = generateEmptyData(50, defaultCols)
                const updatedEmptyData = updateIndexNo(emptyData)
                setGridData(updatedEmptyData)
                setNumRows(emptyData.length)
                setSubRemark('')
                setOutReqSeq('')
                setMaterData([])
                setCheckProdReqSeq(false)

            } else {
                message.error(t('870000040'));
            }
        } catch (error) {
            return false;
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false);
        }
    }, [gridData, canDelete, FactUnit, toDate, dataSearch, dataSearch2, subRemark, materData]);
    const handleSave = useCallback(async () => {
        if (!canCreate) return true;

        const columnsA = [
            'IdxNo', 'ItemName', 'ItemSeq', 'ItemNo', 'Spec', 'UnitName', 'Qty',
            'OutReqSeq', 'OutReqItemSerl', 'WorkOrderSeq', 'UnitSeq', 'PJTSeq',
            'WBSSeq', 'WorkCenterSeq', 'WorkOrderSerl', 'Remark', 'CustSeq',
            'OutWHName', 'WorkCenterName', 'Memo1', 'Memo2', 'Memo3', 'Memo4', 'Memo5', 'Memo6', 'PrevQty'
        ];

        setCheckFrom(false);

        const requiredColumns = {
            'ItemName': 'Tên vật tư',
            'Qty': 'Số lượng',
            'WorkCenterName': 'Trung tâm công việc',
            "Memo2": "Tồn kho phân xưởng"
        };

        const rootData = {
            IsConfirm: 0,
            OutReqSeq: 0,
            OutReqNo: '',
            IsOutSide: '',
            UseType: '',
            FactUnit: FactUnit,
            SupplyContCustSeq: '',
            ReqDate: toDate ? formatDate(toDate) : '',
            DeptName: dataSearch?.BeDeptName || dataSearch?.DeptName || '',
            EmpSeq: dataSearch2?.EmpSeq || '',
            DeptSeq: dataSearch?.DeptSeq || dataSearch2?.DeptSeq,
            EmpName: dataSearch2?.EmpName || '',
            Remark: subRemark,
            IsReturn: 0,
        };

        const resultCheck = {
            IsChangedMst: 0,
            WorkingTag: "A",
            OutReqSeq: 0
        };

        if (!dataSearch3) {
            message.warning("Thiếu thông tin dữ liệu tìm kiếm kho xuất nhập!");
            return true;
        }

        const requiredDataSearch3Fields = {
            'WorkCenterName': 'Trung tâm công việc',
            'MatOutWhName': 'Kho xuất vật tư',
            'ProdInWhName': 'Kho nhập sản phẩm',
            'MatOutWhSeq': 'Mã kho xuất vật tư',
            'ProdInWhSeq': 'Mã kho nhập sản phẩm',
            'WorkCenterSeq': 'Mã trung tâm công việc'
        };

        const missingDataSearch3 = Object.keys(requiredDataSearch3Fields)
            .filter(field => !dataSearch3[field] || dataSearch3[field] === "")
            .map(field => requiredDataSearch3Fields[field]);

        if (missingDataSearch3.length > 0) {
            message.warning(`Thiếu thông tin bắt buộc trong dữ liệu tìm kiếm:\n${missingDataSearch3.join(", ")}`);
            return true;
        }

        const resulA = filterAndSelectColumns(gridData, columnsA, 'A').map(item => ({
            ...item,
            WorkCenterName: dataSearch3.WorkCenterName,
            OutWHName: dataSearch3.MatOutWhName,
            Memo1: dataSearch3.ProdInWhName,
            Memo4: dataSearch3.MatOutWhSeq,
            Memo5: dataSearch3.ProdInWhSeq,
            WorkCenterSeq: dataSearch3.WorkCenterSeq,
        }));

        if (resulA.length === 0) {
            togglePageInteraction(false);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            return true;
        }

        // Kiểm tra số lượng > 0
        const invalidQtyRows = resulA
            .map((item, index) => ({ index: index + 1, qty: Number(item.Qty) }))
            .filter(row => isNaN(row.qty) || row.qty <= 0);

        if (invalidQtyRows.length > 0) {
            const messages = invalidQtyRows.map(row => `Dòng ${row.index}: Số lượng phải lớn hơn 0`).join("\n");
            message.warning(`Vui lòng kiểm tra lại số lượng:\n${messages}`);
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }

        const missingValues = [...resulA].map((item, index) => {
            const missingFields = Object.keys(requiredColumns).filter(col => !item[col] || item[col] === "");
            return missingFields.length > 0
                ? `Dòng ${index + 1}: Thiếu ${missingFields.map(col => requiredColumns[col]).join(", ")}`
                : null;
        }).filter(msg => msg !== null);

        if (missingValues.length > 0) {
            message.warning(` Vui lòng nhập đầy đủ thông tin:\n${missingValues.join("\n")}`);
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }

        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true);

        try {
            const results = await Promise.all([
                PostAOutReq(rootData, resulA, resultCheck)
            ]);

            const isSuccess = results.every(result => result?.success);

            const updateGridData = (newData) => {
                setGridData(prevGridData => {
                    const updatedGridData = prevGridData.map(item => {
                        const matchingData = newData.find(data => data.IDX_NO === item.IdxNo);
                        if (matchingData) {
                            return {
                                ...matchingData,
                                Status: ''
                            };
                        }
                        return item;
                    });
                    return updateIndexNo(updatedGridData);
                });
            };

            if (isSuccess) {
                const newData = results.flatMap(result => result.data.saveResultItem || []);
                const newDataProdReqNo = results.flatMap(result => result.data.saveResult || []);
                setOutReqSeq(newDataProdReqNo[0].OutReqNo);

                setMaterData(newDataProdReqNo);
                setCheckProdReqSeqType(newDataProdReqNo[0].OutReqNo);
                updateGridData(newData);
                setCheckProdReqSeq(true);
                setEditedRows([]);
                setAddedRows([]);




            } else {
                message.error(t('870000040'));
            }
        } catch (error) {
            return false;
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false);
        }
    }, [gridData, canCreate, FactUnit, formData, toDate, dataSearch, dataSearch2, ProdType, ReqType, subRemark, dataSearch3]);


    const handleUpdate = useCallback(async () => {
        if (!canCreate) return true;

        const columnsU = [
            'IdxNo', 'ItemName', 'ItemSeq', 'ItemNo', 'Spec', 'UnitName', 'Qty',
            'OutReqSeq', 'OutReqItemSerl', 'WorkOrderSeq', 'UnitSeq', 'PJTSeq',
            'WBSSeq', 'WorkCenterSeq', 'WorkOrderSerl', 'Qty', 'Remark', 'CustSeq',
            'OutWHName', 'WorkCenterName', 'Memo1', 'Memo2', 'Memo3', 'Memo4', 'Memo5', 'Memo6', 'PrevQty'
        ];

        const columnsA = [...columnsU];

        setCheckFrom(false);

        const requiredColumns = {
            'ItemName': 'Tên vật tư',
            'Qty': 'Số lượng',
            'WorkCenterName': 'Trung tâm công việc',
            "Memo2": "Tồn kho phân xưởng"
        };


        if (!dataSearch3) {
            message.warning("Thiếu dữ liệu tìm kiếm (dataSearch3)!");
            return true;
        }

        const requiredDataSearch3Fields = {
            'WorkCenterName': 'Trung tâm công việc',
            'MatOutWhName': 'Kho xuất vật tư',
            'ProdInWhName': 'Kho nhập sản phẩm',
            'MatOutWhSeq': 'Mã kho xuất vật tư',
            'ProdInWhSeq': 'Mã kho nhập sản phẩm',
            'WorkCenterSeq': 'Mã trung tâm công việc'
        };

        const missingDataSearch3 = Object.keys(requiredDataSearch3Fields)
            .filter(field => !dataSearch3[field] || dataSearch3[field] === "")
            .map(field => requiredDataSearch3Fields[field]);

        if (missingDataSearch3.length > 0) {
            message.warning(`Thiếu thông tin bắt buộc trong dữ liệu tìm kiếm:\n${missingDataSearch3.join(", ")}`);
            return true;
        }

        const rootData = {
            OutReqSeq: materData[0]?.OutReqSeq,
            OutReqNo: materData[0]?.OutReqNo,
            UseType: materData[0]?.UseType,
            FactUnit: FactUnit,
            SupplyContCustSeq: '',
            ReqDate: toDate ? formatDate(toDate) : '',
            DeptName: dataSearch?.BeDeptName || dataSearch?.DeptName || '',
            EmpSeq: dataSearch2?.EmpSeq || '',
            DeptSeq: dataSearch?.DeptSeq || dataSearch2?.DeptSeq,
            EmpName: dataSearch2?.EmpName || '',
            Remark: subRemark,
            IsConfirm: dataSearch2?.IsConfirm,
            IsReturn: dataSearch2?.IsReturn,
            IsOutSide: dataSearch2?.IsOutSide,
        };

        const resultCheck = {
            IsChangedMst: materData[0]?.IsConfirm,
            WorkingTag: "U",
            OutReqSeq: materData[0]?.OutReqSeq,
        };

        const resulU = filterAndSelectColumns(gridData, columnsU, 'U').map(item => ({
            ...item,
            WorkCenterName: dataSearch3.WorkCenterName,
            OutWHName: dataSearch3.MatOutWhName,
            Memo1: dataSearch3.ProdInWhName,
            Memo4: dataSearch3.MatOutWhSeq,
            Memo5: dataSearch3.ProdInWhSeq,
            WorkCenterSeq: dataSearch3.WorkCenterSeq,
        }));

        const resulA = filterAndSelectColumns(gridData, columnsA, 'A').map(item => ({
            ...item,
            OutReqSeq: materData[0]?.OutReqSeq,
            OutReqNo: materData[0]?.OutReqNo,
            WorkCenterName: dataSearch3.WorkCenterName,
            OutWHName: dataSearch3.MatOutWhName,
            Memo1: dataSearch3.ProdInWhName,
            Memo4: dataSearch3.MatOutWhSeq,
            Memo5: dataSearch3.ProdInWhSeq,
            WorkCenterSeq: dataSearch3.WorkCenterSeq,
        }));
        const missingValues = [...resulU, ...resulA].map((item, index) => {
            const missingFields = Object.keys(requiredColumns).filter(col => !item[col] || item[col] === "");
            return missingFields.length > 0
                ? `Dòng ${index + 1}: Thiếu ${missingFields.map(col => requiredColumns[col]).join(", ")}`
                : null;
        }).filter(msg => msg !== null);

        if (missingValues.length > 0) {
            message.warning(`Vui lòng nhập đầy đủ thông tin:\n${missingValues.join("\n")}`);
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }

        loadingBarRef.current?.continuousStart();
        togglePageInteraction(true);

        try {
            const results = await Promise.all([
                PostUOutReq(rootData, resulU, resultCheck),
                resulA.length > 0 ? PostAOutReqItem(resulA, resultCheck) : Promise.resolve({ success: true, data: [] })
            ]);

            const isSuccess = results.every(result => result?.success);
            if (isSuccess) {
                message.success("Cập nhật thành công!");
                const newData = results[1]?.data || [];
                const updateData = results[0]?.data?.saveResultItem || [];
                const newDataProdReqNo = results.flatMap(result => result.data?.saveResult || []);

                if (newDataProdReqNo.length > 0) {
                    setOutReqSeq(newDataProdReqNo[0].OutReqNo);
                    setMaterData(newDataProdReqNo);
                    setCheckProdReqSeqType(newDataProdReqNo[0].OutReqNo);
                }

                setGridData(prevGridData => {
                    const updatedGridData = prevGridData.map(item => {
                        const matchingData = newData.find(data => data.IDX_NO === item.IdxNo);
                        return matchingData || item;
                    });
                    return updateIndexNo(updatedGridData);
                });

                setGridData(prevGridData => {
                    const updatedGridData = prevGridData.map(item => {
                        const matchingData = updateData.find(data => data.IDX_NO === item.IdxNo);
                        return matchingData || item;
                    });
                    return updateIndexNo(updatedGridData);
                });

                setCheckProdReqSeq(true);
            } else {
                const errorResults = results.filter(result => !result.success);
                let errorMessages = "";

                errorResults.forEach(result => {
                    if (result.errors && result.errors.length > 0) {
                        errorMessages += result.errors.map(error => `Name: ${error.Name}, Reason: ${error.result}`).join("\n");
                    } else if (result.message) {
                        errorMessages += `Error: ${result.message}\n`;
                    }
                });

                message.error(errorMessages);
            }
        } catch (error) {
            message.error("❌ Đã xảy ra lỗi khi cập nhật dữ liệu.");
            return false;
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData, canCreate, materData, toDate, dataSearch2, subRemark, FactUnit, dataSearch3]);


    const handleSaveUpdate = () => {
        if (materData.length > 0) {
            handleUpdate();
        } else {
            handleSave();
        }
    }
    const getSelectedRowsItem = () => {
        const selectedRows = selection.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData[i]) {
                    gridData[i]['IdxNo'] = i + 1
                    rows.push(gridData[i])
                }
            }
        })

        return rows
    }


    const handleDeleteDataSheet = useCallback(
        (e) => {
            togglePageInteraction(true)
            if (canDelete === false) {
                message.warning(t('870000018'))
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }
            if (isDeleting) {
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }

            const selectedRows = getSelectedRowsItem()
            const idsWithStatusD = selectedRows
                .filter(
                    (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
                )
                .map((row, index) => {
                    row.Status = 'D'
                    return row
                })
            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
            if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            const resultCheck = {
                IsChangedMst: materData[0]?.IsConfirm,
                WorkingTag: "D",
                OutReqSeq: materData[0]?.OutReqSeq,
            }
            if (idsWithStatusD.length > 0) {
                setIsDeleting(true)
                PostDOutReqItem(idsWithStatusD, resultCheck)
                    .then((response) => {
                        message.destroy()
                        if (response.success) {
                            const idsWithStatusDList = idsWithStatusD.map(
                                (row) => row.IdxNo,
                            )
                            const remainingRows = gridData.filter(
                                (row) => !idsWithStatusDList.includes(row.IdxNo),
                            )
                            const updatedEmptyData = updateIndexNo(remainingRows)
                            setGridData(updatedEmptyData)
                            setNumRows(remainingRows.length)
                            resetTable()

                        } else {
                            setDataError(response.data.errors)

                            message.error(response.data.message || t('870000022'))
                        }
                    })
                    .catch((error) => {
                        message.destroy()
                        message.error(t('870000023'))
                    })
                    .finally(() => {
                        setIsDeleting(false)
                        togglePageInteraction(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                    })
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData.filter(
                    (row) => !idsWithStatusA.includes(row.Id),
                )
                const remainingEditedRows = editedRows.filter(
                    (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow?.Id),
                )
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                const updatedDataEditedRows = updateIndexNo(remainingEditedRows);
                const updatedRemainingRows = updateIndexNo(remainingRows);
                setEditedRows(updatedDataEditedRows)
                setGridData(updatedRemainingRows)
                setNumRows(remainingRows.length)
                resetTable()
            }
        },
        [
            canDelete,
            gridData,
            selection,
            editedRows,
            isDeleting,
            materData
        ],
    )
    const handleCheckOutReqItem = useCallback(async () => {
        if (!canDelete) return true;
        const requiredColumns = ['ItemName', 'WorkCenterName'];

        setCheckFrom(false);

        let filteredGridData = [];

        if (!dataSearch3) {
            message.warning(t('Thiếu thông tin bắt buộc!'));
            return true;
        }

        filteredGridData = gridData
            .filter(item => item.ItemSeq)
            .map(item => ({
                ...item,
                WorkCenterName: dataSearch3.WorkCenterName || "",
                OutWHName: dataSearch3.MatOutWhName || "",
                Memo1: dataSearch3.ProdInWhName || "",
                Memo4: dataSearch3.MatOutWhSeq || "",
                Memo5: dataSearch3.ProdInWhSeq || "",
                WorkCenterSeq: dataSearch3.WorkCenterSeq || "",
            }));

        const missingRequired = filteredGridData.some(item =>
            requiredColumns.some(column => item[column] == null || item[column] === "")
        );

        if (filteredGridData.length === 0) {
            togglePageInteraction(false);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            message.warning(t('Không có dữ liệu nào để xóa'));
            return true;
        }

        if (missingRequired) {
            message.warning(t('Thiếu thông tin bắt buộc!'));
            togglePageInteraction(false);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            return true;
        }

        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true);

        try {
            const result = await PostCheckOutReqItem(filteredGridData);

            const updateGridData = (newData) => {
                setGridData(prevGridData => {
                    const updatedGridData = prevGridData.map(item => {
                        const matchingData = newData.find(data => data.ItemSeq === item.ItemSeq);
                        if (matchingData) {
                            return {
                                ...item,
                                Memo2: `${matchingData.InventoryRemark}`,
                            };
                        }
                        return item;
                    });

                    return updateIndexNo(updatedGridData);
                });
            };

            if (result?.success) {
                const newData = result.data || [];
                updateGridData(newData);
                message.success(t('Check thành công'));
            } else {
                message.error(t('870000040'));
            }
        } catch (error) {
            return false;
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false);
        }
    }, [gridData, dataSearch3]);
    const handleOnClickPrint = useCallback(() => {
        const resultData = {
            OutReqSeq: materData[0].OutReqSeq,
            FileName: generatePrintCode(),
            CodeQr: materData[0]?.OutReqNo
        };

        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true);

        PrintPdmmOutExtra(resultData)
            .then(responseOutReq => {
                if (responseOutReq.success) {
                    const url = `${HOST_API_SERVER_11}/${responseOutReq?.data}`;
                    window.open(url, "_blank");
                } else {
                    message.error(responseOutReq.message || 'Lỗi khi lấy dữ liệu in.');
                }
            })
            .catch(error => {
                console.error('Error in handleOnClickPrint:', error);
                message.error('Lỗi khi lấy dữ liệu in.', error);
            })
            .finally(() => {
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                togglePageInteraction(false);
            });
    }, [PathSeq, materData]);

    return (
        <>
            <Helmet>
                <title>HPM - {t('800000120')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">

                            <PdmmOutExtraAction
                                newFrom={newFrom}
                                handleSave={handleSaveUpdate}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                                handleDelete={handleDelete}
                                handleCheckOutReqItem={handleCheckOutReqItem}
                                handleOnClickPrint={handleOnClickPrint}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                                    {t("850000156")}
                                </h2>
                            </summary>
                            <div className="flex p-2 gap-4">
                                <PdmmOutExtraQuery
                                    helpData01={helpData01}
                                    helpData03={helpData03}
                                    helpData05={helpData05}
                                    helpData06={helpData06}
                                    setHelpData05={setHelpData05}
                                    setItemText={setItemText}
                                    itemText={itemText}
                                    setSearchText={setSearchText}
                                    searchText={searchText}
                                    setDataSearch={setDataSearch}
                                    dataSearch={dataSearch}
                                    setDataSheetSearch={setDataSheetSearch}
                                    dataSheetSearch={dataSheetSearch}
                                    controllers={controllers}
                                    setItemText2={setItemText2}
                                    itemText2={itemText2}
                                    setSearchText2={setSearchText2}
                                    searchText2={searchText2}
                                    setDataSearch2={setDataSearch2}
                                    dataSearch2={dataSearch2}
                                    setDataSheetSearch2={setDataSheetSearch2}
                                    dataSheetSearch2={dataSheetSearch2}
                                    formData={formData}
                                    setFormData={setFormData}
                                    setToDate={setToDate}
                                    toDate={toDate}
                                    setSubRemark={setSubRemark}
                                    setFactUnit={setFactUnit}
                                    FactUnit={FactUnit}
                                    setProdReqNo={setProdReqNo}
                                    ProdReqNo={ProdReqNo}
                                    setReqType={setReqType}
                                    ReqType={ReqType}
                                    setProdType={setProdType}
                                    subRemark={subRemark}
                                    ProdType={ProdType}
                                    setOutReqSeq={setOutReqSeq}
                                    OutReqSeq={OutReqSeq}
                                    helpData07={helpData07}
                                    setHelpData07={setHelpData07}
                                    setSearchText3={setSearchText3}
                                    searchText3={searchText3}
                                    itemText3={itemText3}
                                    setItemText3={setItemText3}
                                    setDataSearch3={setDataSearch3}
                                    dataSearch3={dataSearch3}
                                    dataSheetSearch3={dataSheetSearch3}
                                    setDataSheetSearch3={setDataSheetSearch3}
                                    gridData={gridData}
                                />
                            </div>
                        </details>
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 border-t overflow-auto relative">
                        <TablePdmmOutExtra
                            setSelection={setSelection}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            selection={selection}
                            canEdit={canEdit}
                            cols={cols}
                            setCols={setCols}
                            setGridData={setGridData}
                            gridData={gridData}
                            defaultCols={defaultCols}
                            setNumRows={setNumRows}
                            numRows={numRows}
                            setEditedRows={setEditedRows}
                            editedRows={editedRows}
                            helpData01={helpData01}
                            setHelpData01={setHelpData01}
                            helpData03={helpData03}
                            setNumRowsToAdd={setNumRowsToAdd}
                            numRowsToAdd={numRowsToAdd}
                            handleRowAppend={handleRowAppendA}
                            setAddedRows={setAddedRows}
                            addedRows={addedRows}
                            helpData07={helpData07}
                            setHelpData07={setHelpData07}
                        />
                    </div>
                </div>
            </div>





            <Modal open={checkFrom} footer={null} closable={true} maskClosable={false} onCancel={() => setCheckFrom(false)} centered>
                <div className="flex flex-col items-center justify-center">
                    <div className="p-3 rounded-lg mb-4 bg-orange-100">
                        <ExclamationCircleOutlined style={{ fontSize: '44px', color: '#faad14' }} />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">{t('850000158')}</h2>
                    <p className="text-gray-600 mb-6 text-center">
                        {t('850000157')}
                    </p>
                    <div className="flex w-full gap-4">

                        <Button
                            key="discard"
                            size="large"
                            className="w-full"
                            color="default" variant="filled"
                            onClick={restFrom}
                        >
                            {t('850000159')}
                        </Button>
                        <Button
                            key="confirm"
                            size="large"
                            className="w-full"
                            onClick={handleSaveUpdate}
                            style={{ backgroundColor: '#faad14', borderColor: '#faad14', color: '#fff' }}
                        >
                            {t('850000160')}
                        </Button>
                    </div>
                </div>
            </Modal>

        </>
    )
}