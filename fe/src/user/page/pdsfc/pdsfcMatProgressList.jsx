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
import { GetWcQuery } from '../../../features/wc/wcQ'
import TablePdsfcMatProgressList from '../../components/table/pdsfc/tablePdsfcMatProgressList'
import PdsfcMatProgressListQuery from '../../components/query/pdsfc/pdsfcMatProgressListQuery'
import PdsfcMatProgressListAction from '../../components/actions/pdsfc/pdsfcMatProgressListAction'
import { PostSPDSFCMatProgressListQ } from '../../../features/pdsfc/postSPDSFCMatProgressListQ'
export default function PdsfcMatProgressList({ permissions,
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
            title: t('787'),
            id: 'FactUnitName',
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
            title: t('1061'),
            id: 'WorkCenterName',
            kind: 'Text',
            readonly: false,
            width: 280,
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
            width: 280,
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
            width: 280,
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
            width: 280,
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
            width: 280,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2170'),
            id: 'MatItemName',
            kind: 'Text',
            readonly: false,
            width: 280,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2169'),
            id: 'MatItemNo',
            kind: 'Text',
            readonly: false,
            width: 280,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('1969'),
            id: 'MatItemSpec',
            kind: 'Text',
            readonly: false,
            width: 280,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('602'),
            id: 'MatUnitName',
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
            title: t('NeedQty'),
            id: 'NeedQty',
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
            title: t('9550'),
            id: 'ReqQty',
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
            title: t('9542'),
            id: 'OutQty',
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
            title: t('9992'),
            id: 'InputQty',
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
            id: 'ProgressStatusName',
            kind: 'Text',
            readonly: false,
            width: 280,
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
            width: 280,
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
            width: 280,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('3226'),
            id: 'GoodItemSpec',
            kind: 'Text',
            readonly: false,
            width: 280,
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
            width: 280,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('1529'),
            id: 'ProdUnitName',
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
            title: t('9012'),
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
            title: t('2647'),
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
            title: t('1981'),
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
            title: t('2647'),
            id: 'ProdNeedQty',
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
            width: 280,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('19140'),
            id: 'STDStockQty',
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
    const [formData, setFormData] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [workOrderDate, setWorkOrderDate] = useState(dayjs().startOf('month'))
    const [workOrderDateTo, setWorkOrderDateTo] = useState(dayjs())
    const [FactUnit, setFactUnit] = useState('')

    const [ItemName, setItemName] = useState('')
    const [ItemNo, setItemNo] = useState('')
    const [Spec, setSpec] = useState('')
    const [ProdPlanNo, setProdPlanNo] = useState('')
    const [WorkOrderNo, setWorkOrderNo] = useState('')
    const [MatItemName, setMatItemName] = useState('')
    const [MatItemNo, setMatItemNo] = useState('')
    const formatDate = (date) => date.format('YYYYMMDD')
    const [ProgressStatus, setProgressStatus] = useState('')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_mat_progress_list_a',
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
            FactUnit: FactUnit,
            WorkOrderDate: workOrderDate ? formatDate(workOrderDate) : '',
            WorkOrderDateTo: workOrderDateTo ? formatDate(workOrderDateTo) : '',
            WorkOrderNo: WorkOrderNo,
            ProgressStatus: ProgressStatus,

            GoodItemName: ItemName,
            GoodItemNo: ItemNo,
            GoodItemSpec: '',

            ProcName: '',
            MatItemName: MatItemName,
            MatItemNo: MatItemNo,
            MatItemSpec: '',

            DeptSeq: dataSheetSearch[0]?.BeDeptSeq ?? '',
            DeptName: dataSheetSearch[0]?.BeDeptName ?? '',

            WorkDate: formData ? formatDate(formData) : '',
            WorkDateTo: toDate ? formatDate(toDate) : '',

            WorkCenterSeq: dataSheetSearch2[0]?.WorkCenterSeq ?? '',
            WorkCenterName: dataSheetSearch2[0]?.WorkCenterName ?? ''
        };


        try {
            const response = await PostSPDSFCMatProgressListQ(search, signal);
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
                help03,
                help04,

                help07,
            ] = await Promise.all([
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),

                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '6052',
                    '',
                    '',
                    '',
                    signal
                ),
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

                GetWcQuery(search, signal),
            ])

            setHelpData01(help01?.data || [])

            setHelpData03(help03?.data || [])
            setHelpData04(help04?.data || [])

            setHelpData07(help07?.data || [])

        } catch (error) {
            setHelpData01([])
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

    return (
        <>
            <Helmet>
                <title>ITM - {t('TRUY VẤN VẬT LIỆU THEO TỪNG CHỈ THỊ TÁC NGHIỆP')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">
                            <PdsfcMatProgressListAction
                                fetchData={fetchData}
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
                                <PdsfcMatProgressListQuery
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
                                    helpData03={helpData03}
                                    setMatItemName={setMatItemName}
                                    MatItemName={MatItemName}
                                    setMatItemNo={setMatItemNo}
                                    MatItemNo={MatItemNo}
                                    setProgressStatus={setProgressStatus}
                                    ProgressStatus={ProgressStatus}
                                />
                            </div>
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t   overflow-auto">
                        <TablePdsfcMatProgressList
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