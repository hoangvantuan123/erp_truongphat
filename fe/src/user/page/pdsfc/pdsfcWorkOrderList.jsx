import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, notification, message } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar';
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { GetQPdmpsProdPlanList } from '../../../features/pdmpsProd/getQPdmpsProdPlanList'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import PdsfcWorkOrderListAction from '../../components/actions/pdsfc/pdsfcWorkOrderListAction'
import PdsfcWorkOrderListQuery from '../../components/query/pdsfc/pdsfcWorkOrderListQuery'
import TablePdsfcWorkOrderList from '../../components/table/pdsfc/tablePdsfcWorkOrderList'
import { PostSPDSFCWorkOrderQ } from '../../../features/pdsfc/postSPDSFCWorkOrderQ'
import { GetWcQuery } from '../../../features/wc/wcQ'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'
export default function PdsfcWorkOrderList({ permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    controllers,
    cancelAllRequests


}) {
    const { t } = useTranslation()
    const gridRef = useRef(null)
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
            title: t('WorkOrderSeq'),
            id: 'WorkOrderSeq',
            kind: 'text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderRowID,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('WorkOrderSerl'),
            id: 'WorkOrderSerl',
            kind: 'text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderRowID,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('IsCancel'),
            id: 'IsCancel',
            kind: 'Boolean',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderBoolean,
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
        },
        {
            title: t('1985'),
            id: 'WorkOrderNo',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('441'),
            id: 'WorkOrderDate',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('1524'),
            id: 'ProdPlanNo',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('Work center'),
            id: 'WorkCenterName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2034'),
            id: 'GoodItemName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('551'),
            id: 'GoodItemSpec',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2035'),
            id: 'GoodItemNo',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('22303'),
            id: 'ItemUnitName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
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
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('809'),
            id: 'ItemBomRevName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('6423'),
            id: 'OrderQty',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('510'),
            id: 'ProcName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2102'),
            id: 'AssyItemName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2101'),
            id: 'AssyItemNo',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2846'),
            id: 'AssyItemSpec',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('12062'),
            id: 'ProdUnitName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('9012'),
            id: 'StdUnitQty',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('9106'),
            id: 'ProgressQty',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('7145'),
            id: 'OKQty',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('6009'),
            id: 'BadQty',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('13511'),
            id: 'ProdQty',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('369'),
            id: 'ProgStatus',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('218'),
            id: 'WorkDate',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('4305'),
            id: 'WorkStartTime',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('8258'),
            id: 'WorkEndTime',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('1981'),
            id: 'WorkType',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('10622'),
            id: 'WHName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('34281'),
            id: 'LastUserName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('33118'),
            id: 'LastDateTime',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

    ], [t]);
    const [loadingA, setLoadingA] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [gridData, setGridData] = useState([])
    const [numRows, setNumRows] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [searchText2, setSearchText2] = useState('')
    const [itemText, setItemText] = useState('')
    const [itemText2, setItemText2] = useState('')
    const [dataSearch, setDataSearch] = useState(null)
    const [dataSearch2, setDataSearch2] = useState(null)
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const [minorValue, setMinorValue] = useState('')
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())
    const [workOrderDate, setWorkOrderDate] = useState(null)
    const [workOrderDateTo, setWorkOrderDateTo] = useState(null)
    const [FactUnit, setFactUnit] = useState('')
    const [dataType, setDataType] = useState([])
    const [keyPath, setKeyPath] = useState(null)
    const [isCheckClick, setIsCheckClick] = useState(false);
    const [ItemName, setItemName] = useState('')
    const [ItemNo, setItemNo] = useState('')
    const [Spec, setSpec] = useState('')
    const [ProdPlanNo, setProdPlanNo] = useState('')
    const [WorkOrderNo, setWorkOrderNo] = useState('')
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_work_order_list',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])
    const fetchData = async () => {

        setLoadingA(true);
        if (controllers.current.fetchData) {
            controllers.current.fetchData.abort();
            controllers.current.fetchData = null;
            togglePageInteraction(false)
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true)
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchData = controller;
        const search = {
            GoodItemSpec: '',
            ProcName: '',
            DeptSeq: dataSheetSearch[0]?.BeDeptSeq ?? '',
            DeptName: dataSheetSearch[0]?.BeDeptName ?? '',
            WorkOrderNo: WorkOrderNo,
            ProdPlanNo: ProdPlanNo,
            WHSeq: '',
            ProgStatus: '',
            ProgStatusName: '',
            WorkType: '',
            WorkTypeName: '',
            CustSeq: '',
            CustName: '',
            PoNo: '',
            PJTName: '',
            PJTNo: '',
            FactUnit: FactUnit,
            FactUnitName: '',
            WorkOrderDate: workOrderDate ? formatDate(workOrderDate) : '',
            WorkOrderDateTo: workOrderDateTo ? formatDate(workOrderDateTo) : '',
            WorkDate: formData ? formatDate(formData) : '',
            WorkDateTo: toDate ? formatDate(toDate) : '',
            WorkCenterSeq: dataSheetSearch2[0]?.WorkCenterSeq ?? '',
            WorkCenterName: dataSheetSearch2[0]?.WorkCenterName ?? '',
            GoodItemName: ItemName,
            GoodItemNo: ItemNo,
            ChainGoodsSeq: '',
            SrtDate: '',
            EndDate: ''

        };

        try {
            const response = await PostSPDSFCWorkOrderQ(search, signal);
            if (response.success) {
                const fetchedData = response.data || [];
                setGridData(fetchedData);
                setNumRows(fetchedData.length + 1);
            } else {
                message.error(response.errorDetails);
                setGridData([])
                setNumRows(0)
                setData([]);
            }
        } catch (error) {
            setGridData([])
            setNumRows(0)
            setData([]);
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false)
            controllers.current.fetchData = null;
            setLoadingA(false);
        }
    };
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
                help02,
                help03,
                help04,
                help05,
                help06,
                help07,
            ] = await Promise.all([
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
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
                GetWcQuery(search, signal),
            ])

            setHelpData01(help01?.data || [])
            setHelpData02(help02?.data || [])
            setHelpData03(help03?.data || [])
            setHelpData04(help04?.data || [])
            setHelpData05(help05?.data || [])
            setHelpData06(help06?.data || [])
            setHelpData07(help07?.data || [])

        } catch (error) {
            setHelpData02([])
            setHelpData03([])
            setHelpData04([])
            setHelpData05([])
            setHelpData06([])
            setHelpData07([])
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
    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
        );
    };

    useEffect(() => {
        const data = getSelectedRowsData();
        if (data && data.length > 0) {
            if (data[0].IdSeq !== "") {
                setDataType(data)
                setIsCheckClick(true)
                const filteredData = {
                    ...data[0],
                    NewRow: true
                };
                const secretKey = 'KEY_PATH'
                const encryptedData = CryptoJS.AES.encrypt(
                    JSON.stringify(filteredData),
                    secretKey
                ).toString()
                const encryptedToken = encodeBase64Url(encryptedData)
                setKeyPath(encryptedToken)

            } else {
                setDataType([])
                setIsCheckClick(false)
                setKeyPath(null)
            }

        } else {
            setDataType([])
            setIsCheckClick(false)
            setKeyPath(null)
        }
    }, [selection.rows.items, gridData]);
    const nextPage = useCallback(() => {
        if (keyPath) {
            window.open(`/u/prod_mgmt/pdsfc_work_report/${keyPath}`);
            localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true))
        }
    }, [keyPath]);
    return (
        <>
            <Helmet>
                <title>ITM - {t('Truy vấn chỉ thị tác nghiệp')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">

                            <PdsfcWorkOrderListAction
                                fetchData={fetchData}
                                nextPage={nextPage}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-[10px] font-medium flex items-center gap-2 text-blue-600 uppercase">
                                    <FilterOutlined />
                                    {t('359')}
                                </h2>
                                <span className="relative size-5 shrink-0">
                                    <ArrowIcon />
                                </span>
                            </summary>
                            <div className="flex p-2 gap-4">
                                <PdsfcWorkOrderListQuery
                                    helpData01={helpData01}
                                    setDataSearch={setDataSearch}
                                    setDataSheetSearch={setDataSheetSearch}
                                    setItemText={setItemText}
                                    searchText={searchText}
                                    setSearchText={setSearchText}
                                    helpData04={helpData04}
                                    setFormData={setFormData}
                                    setToDate={setToDate}
                                    formData={formData}
                                    toDate={toDate}
                                    setFactUnit={setFactUnit}
                                    ItemName={ItemName}
                                    setItemName={setItemName}
                                    ItemNo={ItemNo}
                                    setItemNo={setItemNo}
                                    Spec={Spec}
                                    setSpec={setSpec}
                                    setProdPlanNo={setProdPlanNo}
                                    ProdPlanNo={ProdPlanNo}
                                    setWorkOrderDate={setWorkOrderDate}
                                    workOrderDate={workOrderDate}
                                    setWorkOrderDateTo={setWorkOrderDateTo}
                                    workOrderDateTo={workOrderDateTo}
                                    setWorkOrderNo={setWorkOrderNo}
                                    WorkOrderNo={WorkOrderNo}
                                    setSearchText2={setSearchText2}
                                    searchText2={searchText2}
                                    setDataSheetSearch2={setDataSheetSearch2}
                                    dataSheetSearch2={dataSheetSearch2}
                                    setDataSearch2={setDataSearch2}
                                    dataSearch2={dataSearch2}
                                    setItemText2={setItemText2}
                                    itemText2={itemText2}
                                    helpData07={helpData07}

                                />
                            </div>
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t   overflow-auto">
                        <TablePdsfcWorkOrderList
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

                        />
                    </div>
                </div>
            </div>
        </>
    )
}