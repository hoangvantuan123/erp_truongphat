import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Button, message, Modal, Collapse } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce } from 'lodash'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import {
    useNavigate,
    useParams,
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar';
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'

import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { validateCheckColumns } from '../../../utils/validateColumns'
import PdmpsProdPlanAction from '../../components/actions/pdmpsProd/PdmpsProdPlan'
import QueryPdmpsProdPlan from '../../components/query/pdmpsProd/pdmpsProdPlan'
import TablePdmpsProdPlan from '../../components/table/pdmpsProd/tablePdmpsProdPlan'
import { PostSPDMPSProdPlanA } from '../../../features/pdmmPlan/PostSPDMPSProdPlanA'
import { filterAndSelectColumnsNoStatus } from '../../../utils/filterUorA'
import { PostSPDMPSProdPlanStock } from '../../../features/pdmmPlan/PostSPDMPSProdPlanStock'
import ErrorListModal from '../default/errorListModal'
import { PostSPDMPSProdPlanSemiGoodCrt } from '../../../features/pdmmPlan/postSPDMPSProdPlanSemiGoodCrt'
import { PostSPDMPSProdPlanQuery } from '../../../features/pdmmPlan/postSPDMPSProdPlanQuery'
import { PostSPDMPSProdPlanD } from '../../../features/pdmmPlan/postSPDMPSProdPlanD'
import { PostSPDMPSProdPlanU } from '../../../features/pdmmPlan/postSPDMPSProdPlanU'
import CryptoJS from 'crypto-js'
export default function PdmpsProdPlan({ permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    controllers,
    cancelAllRequests

}) {
    const { t } = useTranslation()
    const gridRef = useRef(null)
    const { seq } = useParams()
    const navigate = useNavigate()
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
            title: t('607'),
            id: 'IsSaved',
            kind: 'Boolean',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderBoolean,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: 'Số kế hoạch sản xuất',
            id: 'ProdPlanNo',
            kind: 'Text',
            readonly: true,
            width: 180,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'ProdPlanSeq',
            id: 'ProdPlanSeq',
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
            title: t('2119'),
            id: 'AssetName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3'),
            id: 'FactUnitName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
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
            title: t('177'),
            id: 'ProdPlanDate',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('1786'),
            id: 'ItemName',
            kind: 'Text',
            readonly: false,
            width: 180,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
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
            title: 'ItemSeq',
            id: 'ItemSeq',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2091'),
            id: 'ItemNo',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },

        },

        {
            title: t('551'),
            id: 'Spec',
            kind: 'Text',
            readonly: false,
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
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'UnitSeq',
            id: 'UnitSeq',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('809'),
            id: 'BOMRevName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
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
            title: 'BOMRevName',
            id: 'BOMRevName',
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
            title: t('2252'),
            id: 'ProcRevName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
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
            title: t('6423'),
            id: 'ProdPlanQty',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
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
            title: t('19981'),
            id: 'ProdPlanEndDate',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
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
            title: t('26223'),
            id: 'ProdDeptName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
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
            title: 'ProdDeptSeq',
            id: 'ProdDeptSeq',
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
            title: t('362'),
            id: 'Remark',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('568'),
            id: 'WorkCond7',
            kind: 'Text',
            readonly: true,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('643'),
            id: 'CfmEmpName',
            kind: 'Text',
            readonly: true,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('262'),
            id: 'CfmDate',
            kind: 'Text',
            readonly: true,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },


    ], [t]);
    const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'))
    const [loadingA, setLoadingA] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [gridData, setGridData] = useState([])
    const [numRows, setNumRows] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [searchText2, setSearchText2] = useState('')
    const [searchText3, setSearchText3] = useState('')
    const [searchText4, setSearchText4] = useState('')
    const [searchText5, setSearchText5] = useState('')
    const [itemText, setItemText] = useState('')
    const [itemText2, setItemText2] = useState('')
    const [itemText3, setItemText3] = useState('')
    const [itemText4, setItemText4] = useState('')
    const [itemText5, setItemText5] = useState('')
    const [dataSearch, setDataSearch] = useState(null)
    const [dataSearch2, setDataSearch2] = useState(null)
    const [dataSearch3, setDataSearch3] = useState(null)
    const [dataSearch4, setDataSearch4] = useState(null)
    const [dataSearch5, setDataSearch5] = useState(null)
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [helpData09, setHelpData09] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const [dataSheetSearch3, setDataSheetSearch3] = useState([])
    const [dataSheetSearch4, setDataSheetSearch4] = useState([])
    const [dataSheetSearch5, setDataSheetSearch5] = useState([])
    const [minorValue, setMinorValue] = useState('')
    const [addedRows, setAddedRows] = useState([])
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())
    const [FactUnit, setFactUnit] = useState('')
    const [ProdReqNo, setProdReqNo] = useState('')
    const [ReqType, setReqType] = useState('')

    const [clickedRowData, setClickedRowData] = useState(null)
    const [ProdType, setProdType] = useState('')
    const [editedRows, setEditedRows] = useState([])
    const [checkFrom, setCheckFrom] = useState(false)
    const [subRemark, setSubRemark] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [checkProdReqSeq, setCheckProdReqSeq] = useState(false)
    const [checkProdReqSeqType, setCheckProdReqSeqType] = useState(null)
    const [categoryType, setCategoryType] = useState("");
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [ProdPlanNoQry, setProdPlanNoQry] = useState('')
    const [ItemName, setItemName] = useState('')
    const [ItemNo, setItemNo] = useState('')
    const [SoNo, setSoNo] = useState('')
    const [dataSeq, setDataSeq] = useState(null)

    const formatDate = (date) => date.format('YYYYMMDD')
    const [prType, setPrType] = useState("");

    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdmps_prod_plan_a',
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
        setNumRows(emptyData.length)
    }, [])
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


    const fetchData = useCallback(async (search) => {
        setLoadingA(true);

        if (controllers.current.fetchData) {
            controllers.current.fetchData.abort();
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const controller = new AbortController();
        controllers.current.fetchData = controller;
        const signal = controller.signal;

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();



        try {
            const response = await PostSPDMPSProdPlanQuery(search, signal);

            if (response.success) {
                const data = response.data || [];
                const emptyData = generateEmptyData(100, defaultCols);
                const mergedData = updateIndexNo([...data, ...emptyData]);

                setGridData(mergedData);
                setNumRows(mergedData.length + 1);
            } else {
                const emptyData = generateEmptyData(100, defaultCols);
                const updatedEmptyData = updateIndexNo(emptyData);

                setGridData(updatedEmptyData);
                setNumRows(updatedEmptyData.length + 1);
            }
        } catch (error) {
            setGridData([]);
            setNumRows(0);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
            controllers.current.fetchData = null;
            setLoadingA(false);
        }
    }, [
    ]);
    const buildSearchParams = () => {
        return [{
            ProdReqEndDateFrom: formData ? formatDate(formData) : (dataSeq?.ProdReqEndDateFrom || ''),
            ProdReqEndDateTo: toDate ? formatDate(toDate) : (dataSeq?.ProdReqEndDateTo || ''),
            FactUnit: FactUnit || '',
            ProdDeptSeq: dataSheetSearch3[0]?.BeDeptSeq || dataSeq?.ProdDeptSeq || '',
            ProdPlanEndDateFrom: '',
            ProdPlanEndDateTo: '',
            ReqType: prType ?? dataSeq?.ReqType ?? '',
            ReqDeptSeq: dataSheetSearch[0]?.BeDeptSeq || dataSeq?.ReqDeptSeq || '',
            ReqEmpSeq: dataSheetSearch2[0]?.EmpSeq || dataSeq?.ReqEmpSeq || '',
            ProdPlanNoQry: ProdPlanNoQry || dataSeq?.ProdPlanNoQry || '',
            AssetSeq: categoryType || dataSeq?.AssetSeq || '',
            ProcTypeSeq: '',
            ItemName: ItemName || dataSeq?.ItemName || '',
            ItemNo: ItemNo || dataSeq?.ItemNo || '',
            Spec: dataSeq?.Spec || '',
            CustSeq: dataSheetSearch5[0]?.CustSeq || dataSeq?.CustSeq || '',
            SoNo: SoNo || dataSeq?.SoNo || '',
            PONo: ''
        }];
    };

    useEffect(() => {
        const fetchDataAndUpdate = async () => {
            if (!seq) return;

            const decrypted = decryptData(seq);
            if (!decrypted) return;

            const { ProdPlanNoQry, ItemName, ItemNo, ProdReqEndDateFrom, ProdReqEndDateTo } = decrypted;

            setProdPlanNoQry(ProdPlanNoQry);
            setItemName(ItemName);
            setItemNo(ItemNo);
            setFormData(dayjs(ProdReqEndDateFrom));
            setToDate(dayjs(ProdReqEndDateTo));
            setDataSeq(decrypted);

            const searchParams = [{
                ProdReqEndDateFrom: ProdReqEndDateFrom ? formatDate(dayjs(ProdReqEndDateFrom)) : '',
                ProdReqEndDateTo: ProdReqEndDateTo ? formatDate(dayjs(ProdReqEndDateTo)) : '',
                FactUnit: FactUnit || '',
                ProdDeptSeq: dataSheetSearch3[0]?.BeDeptSeq || decrypted.ProdDeptSeq || '',
                ProdPlanEndDateFrom: '',
                ProdPlanEndDateTo: '',
                ReqType: prType ?? decrypted.ReqType ?? '',
                ReqDeptSeq: dataSheetSearch[0]?.BeDeptSeq || decrypted.ReqDeptSeq || '',
                ReqEmpSeq: dataSheetSearch2[0]?.EmpSeq || decrypted.ReqEmpSeq || '',
                ProdPlanNoQry: ProdPlanNoQry || decrypted.ProdPlanNoQry || '',
                AssetSeq: categoryType || decrypted.AssetSeq || '',
                ProcTypeSeq: '',
                ItemName: ItemName || decrypted.ItemName || '',
                ItemNo: ItemNo || decrypted.ItemNo || '',
                Spec: decrypted.Spec || '',
                CustSeq: dataSheetSearch5[0]?.CustSeq || decrypted.CustSeq || '',
                SoNo: SoNo || decrypted.SoNo || '',
                PONo: ''
            }];

            await fetchData(searchParams);
        };

        fetchDataAndUpdate();
    }, [seq]);




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
            const [
                help01,
                help02,
                help03,
                help04,
                help05,
                help06,
                help07,
                help08,
                help09,

            ] = await Promise.all([
                GetCodeHelp(61007, '', '1', '', '', '', '', 1, 250, '', 0, 0, 0, signal),
                GetCodeHelp(17001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelp(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo(
                    '',
                    6,
                    10012,
                    1,
                    '%',
                    '',
                    '',
                    '',
                    'A.SMAssetGrp IN (6008002,6008004)',
                    signal
                ),
                GetCodeHelp(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo(
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
                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '6009',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '6010',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelp(60009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),

            ])

            setHelpData01(help01?.data || [])
            setHelpData02(help02?.data || [])
            setHelpData03(help03?.data || [])
            setHelpData04(help04?.data || [])
            setHelpData05(help05?.data || [])
            setHelpData06(help06?.data || [])
            setHelpData07(help07?.data || [])
            setHelpData08(help08?.data || [])
            setHelpData09(help09?.data || [])

        } catch (error) {
            setHelpData01([])
            setHelpData02([])
            setHelpData03([])
            setHelpData04([])
            setHelpData05([])
            setHelpData06([])
            setHelpData07([])
            setHelpData08([])
            setHelpData09([])

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



    const restFrom = () => {
        setCheckFrom(false);
        const emptyData = generateEmptyData(50, defaultCols)
        const updatedEmptyData = updateIndexNo(emptyData)
        setGridData(updatedEmptyData)
        setNumRows(emptyData.length)
        setSubRemark('')
        setProdReqNo('')
        setCheckProdReqSeq(false)
    }
    const handleSave = useCallback(async () => {
        if (!canCreate) return true;

        const columns = [
            'FactUnitName', 'FactUnit', 'ProdDeptName', 'ProdDeptSeq', 'ItemName', 'ItemNo',
            'Spec', 'ProdPlanNo', 'ProdPlanSeq', 'ItemSeq', 'UnitName', 'UnitSeq',
            'BOMRevName', 'BOMRev', 'ProcRevName', 'ProcRev', 'ProdPlanQty',
            'ProdPlanEndDate', 'Remark', 'FromSeq', 'FromSerl', 'FromTableSeq',
            'WorkCond1', 'WorkCond2', 'WorkCond3', 'WorkCond4', 'WorkCond5',
            'WorkCond6', 'WorkCond7', 'ProdPlanDate', 'ToTableSeq', 'FromQty',
            'FromSTDQty', 'IdxNo', 'AssetName'
        ];
        const requiredColumns = ['ItemName', 'ProdPlanQty', 'FactUnitName', 'BOMRevName', 'ProdDeptName'];
        setCheckFrom(false);

        const resulA = filterAndSelectColumns(gridData, columns, 'A').map(item => ({
            ...item,
            DeptSeq: userFromLocalStorage?.DeptSeq,
        }));
        const resulU = filterAndSelectColumns(gridData, columns, 'U').map(item => ({
            ...item,
            DeptSeq: userFromLocalStorage?.DeptSeq,
        }));

        if (resulA.length === 0 && resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            message.warning(t('870000041'));
            return true;
        }

        const validationMessage = validateCheckColumns([...resulA], columns, requiredColumns);
        if (validationMessage !== true) {
            const columnLabels = {
                ItemName: t('1786'),
                ProdPlanQty: t('6423'),
                FactUnitName: t('3'),
                BOMRevName: t('809'),
                ProdDeptName: t('26223')
            };

            const missingKeys = Array.isArray(validationMessage) ? validationMessage : [];

            const friendlyMessage = missingKeys.length
                ? `Thiếu các cột: ${missingKeys.map(k => columnLabels[k] || k).join(', ')}`
                : validationMessage;

            message.warning(friendlyMessage);
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(PostSPDMPSProdPlanA(resulA));
            if (resulU.length > 0) apiCalls.push(PostSPDMPSProdPlanU(resulU));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);

            if (isSuccess) {
                const mergedData = results.flatMap(result => result?.data?.[0] || []);

                setGridData(prevGrid => {
                    const updated = prevGrid.map(item => {
                        const found = mergedData.find(data => data.IDX_NO === item.IdxNo);
                        return found ? { ...item, ...found } : item;
                    });
                    return updateIndexNo(updated);
                });
            } else {
                const errorItems = results.flatMap(result => result?.errors || []);
                setModal2Open(true);
                setErrorData(errorItems);
                message.error(t('870000040'));
            }

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData, canCreate]);


    const handleSaveUpdate = () => {
        handleSave();
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
                message.warning('Đang xử lý, vui lòng chờ...')
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
            if (idsWithStatusD.length > 0) {
                setIsDeleting(true)
                PostSPDMPSProdPlanD(idsWithStatusD)
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
                            setModal2Open(true);
                            console.log('response.errors ', response.errors)
                            setErrorData(response.errors)
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
            clickedRowData,
        ],
    )


    const handleSPDMPSProdPlanStock = useCallback(() => {
        if (!canCreate) return true;

        const columnsA = ['ProdPlanQty', 'FactUnit', 'ItemSeq', 'IdxNo'];
        setCheckFrom(false);

        const requiredColumns = ['ProdPlanQty'];
        const resulA = filterAndSelectColumnsNoStatus(gridData, columnsA);

        if (resulA.length === 0) {
            togglePageInteraction(false);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            message.warning(t('870000041'));
            return true;
        }

        const validationMessage = validateCheckColumns([...resulA], [...columnsA], requiredColumns);
        if (validationMessage !== true) {
            message.warning(validationMessage);
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

        PostSPDMPSProdPlanStock(resulA)
            .then((result) => {
                const isSuccess = result?.success;

                const updateGridData = (newData) => {
                    setGridData((prevGridData) => {
                        const updatedGridData = prevGridData.map((item) => {
                            const matchingData = newData.find((data) => data.ItemSeq === item.ItemSeq);
                            if (matchingData) {
                                return {
                                    ...item,
                                    WorkCond7: `${matchingData.StockQty}`
                                };
                            }
                            return item;
                        });

                        return updateIndexNo(updatedGridData);
                    });
                };

                if (isSuccess) {
                    const newData = result.data || [];
                    updateGridData(newData)
                }
            })
            .catch((error) => {
                console.error('Lỗi xảy ra khi gọi API:', error);
                message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
            })
            .finally(() => {
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                togglePageInteraction(false);
            });
    }, [gridData, canCreate]);

    const handleSPDMPSProdPlanSemiGoodCrt = useCallback(() => {
        if (!canCreate) return true;

        const selectedRows = getSelectedRowsItem();
        const rowsWithProdPlanSeq = selectedRows.filter(
            row => row.ProdPlanSeq !== null && row.ProdPlanSeq !== undefined && row.ProdPlanSeq !== ''
        );

        const hasSavedRow = selectedRows.some(
            row => row.ItemName && (
                row.IsSaved === true ||
                row.IsSaved === "true" ||
                row.IsSaved === 1 ||
                row.IsSaved === "1"
            )
        );


        if (!hasSavedRow) {
            message.warning("Kế hoạch chưa được xác nhận.");
            return true;
        }
        const columns = [
            'FactUnitName', 'ProdPlanNo', 'ItemName', 'ItemNo', 'Spec',
            'UnitName', 'BOMRevName', 'ProcRevName', 'ProdPlanQty', 'ProdPlanEndDate',
            'ProdDeptName', 'Remark', 'ProdDeptSeq', 'FactUnit', 'ProcRev',
            'ItemSeq', 'ProdPlanSeq', 'BOMRev', 'UnitSeq', 'IdxNo'
        ];

        const requiredColumns = ['IsSaved', 'ProdDeptSeq'];

        setCheckFrom(false);

        const resul = filterAndSelectColumnsNoStatus(rowsWithProdPlanSeq, columns);

        if (resul.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            message.warning(t('870000041'));
            return true;
        }

        const validationMessage = validateCheckColumns(resul, columns, requiredColumns);
        if (validationMessage !== true) {
            message.warning(validationMessage);
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }

        loadingBarRef.current?.continuousStart();
        togglePageInteraction(true);

        PostSPDMPSProdPlanSemiGoodCrt(resul)
            .then((result) => {
                if (result?.success) {
                    const newData = (result.data || []).map(item => ({
                        ...item,
                        Status: '',
                    }));

                    setGridData(prevGridData => {
                        let updatedGridData = [...prevGridData];

                        newData.forEach(newItem => {
                            const lastFilledIndex = [...updatedGridData]
                                .reverse()
                                .findIndex(row => row.ItemName && row.ItemName !== "");

                            const insertIndex = lastFilledIndex !== -1
                                ? updatedGridData.length - lastFilledIndex
                                : 0;

                            updatedGridData.splice(insertIndex, 0, newItem);
                        });

                        updatedGridData = updatedGridData.map((row, idx) => ({
                            ...row,
                            IdxNo: idx + 1,

                        }));

                        setNumRows(updatedGridData.length);
                        return updatedGridData;
                    });
                }
                else {
                    const errorItems = result.errors || [];
                    setModal2Open(true);
                    setErrorData(errorItems);
                }
            })
            .catch((error) => {
                message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
            })
            .finally(() => {
                loadingBarRef.current?.complete();
                togglePageInteraction(false);
            });
    }, [gridData, canCreate, selection]);
    return (
        <>
            <Helmet>
                <title>ITM - {t('Kế hoạch sản xuất')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">
                            <PdmpsProdPlanAction
                                newFrom={newFrom}
                                handleSave={handleSaveUpdate}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                                handleSPDMPSProdPlanStock={handleSPDMPSProdPlanStock}
                                handleSPDMPSProdPlanSemiGoodCrt={handleSPDMPSProdPlanSemiGoodCrt}
                                fetchData={fetchData}
                                buildSearchParams={buildSearchParams}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
                            closable
                        >
                            <summary className="flex cursor-pointer items-center justify-between text-gray-900">
                                <h2 className="text-[10px] font-medium flex items-center gap-2 text-blue-600 uppercase">
                                    {t("359")}
                                </h2>
                            </summary>
                            <div className="flex p-2 gap-2">
                                <QueryPdmpsProdPlan
                                    helpData06={helpData06}
                                    setFactUnit={setFactUnit}
                                    FactUnit={FactUnit}
                                    helpData01={helpData01}
                                    helpData02={helpData02}
                                    helpData03={helpData03}
                                    helpData04={helpData04}
                                    helpData05={helpData05}
                                    helpData07={helpData07}
                                    helpData08={helpData08}
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
                                    setMinorValue={setMinorValue}
                                    formData={formData}
                                    setFormData={setFormData}
                                    setToDate={setToDate}
                                    toDate={toDate}
                                    setProdReqNo={setProdReqNo}
                                    ProdReqNo={ProdReqNo}
                                    setReqType={setReqType}
                                    ReqType={ReqType}
                                    setProdType={setProdType}
                                    ProdType={ProdType}
                                    setPrType={setPrType}
                                    prType={prType}
                                    setCategoryType={setCategoryType}
                                    categoryType={categoryType}
                                    setSearchText3={setSearchText3}
                                    searchText3={searchText3}
                                    setItemText3={setItemText3}
                                    itemText3={itemText3}
                                    setDataSearch3={setDataSearch3}
                                    dataSearch3={dataSearch3}
                                    setDataSheetSearch3={setDataSheetSearch3}
                                    dataSheetSearch3={dataSheetSearch3}
                                    setSearchText4={setSearchText4}
                                    searchText4={searchText4}
                                    setItemText4={setItemText4}
                                    itemText4={itemText4}
                                    setDataSearch4={setDataSearch4}
                                    dataSearch4={dataSearch4}
                                    setDataSheetSearch4={setDataSheetSearch4}
                                    dataSheetSearch4={dataSheetSearch4}

                                    setSearchText5={setSearchText5}
                                    searchText5={searchText5}
                                    setItemText5={setItemText5}
                                    itemText5={itemText5}
                                    setDataSearch5={setDataSearch5}
                                    dataSearch5={dataSearch5}
                                    setDataSheetSearch5={setDataSheetSearch5}
                                    dataSheetSearch5={dataSheetSearch5}

                                    helpData09={helpData09}

                                    setProdPlanNoQry={setProdPlanNoQry}
                                    ProdPlanNoQry={ProdPlanNoQry}
                                    ItemName={ItemName}
                                    setItemName={setItemName}
                                    ItemNo={ItemNo}
                                    setItemNo={setItemNo}
                                    SoNo={SoNo}
                                    setSoNo={setSoNo}
                                />
                            </div>
                        </details>
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 overflow-auto relative">
                        <TablePdmpsProdPlan
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
                            helpData02={helpData02}
                            helpData03={helpData03}
                            setNumRowsToAdd={setNumRowsToAdd}
                            numRowsToAdd={numRowsToAdd}
                            handleRowAppend={handleRowAppendA}
                            setAddedRows={setAddedRows}
                            addedRows={addedRows}
                            helpData06={helpData06}
                            setHelpData06={setHelpData06}
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
            <ErrorListModal isModalVisible={modal2Open}
                setIsModalVisible={setModal2Open}
                dataError={errorData} />

        </>
    )
}