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
import PdmpsProdReqItemListAction from '../../components/actions/pdmpsProd/PdmpsProdReqItemListAction'
import PdmpsProdReqItemListQuery from '../../components/query/pdmpsProd/pdmpsProdReqItemListQuery'
import TablePdmpsProdReqItemList from '../../components/table/pdmpsProd/tablePdmpsProdReqItemList'
import { GetQPdmpsProdReqItemList } from '../../../features/pdmpsProd/getQPdmpsProdReqItemList'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
export default function PdmpsProdReqItemList({ permissions,
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
    const [gridData, setGridData] = useState([])
    const [totalQuantity, setTotalQuantity] = useState(0);
   
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
            title: t('1326'),
            id: 'IsStop',
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
            title: t('1547'),
            id: 'ProdReqNo',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('1859'),
            id: 'EmpName',
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
            title: t('362'),
            id: 'Remark',
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
            title: t('1544'),
            id: 'ReqTypeName',
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
            title: t('1542'),
            id: 'ProdTypeName',
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
            title: t('6'),
            id: 'CustName',
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
            title: t('2115'),
            id: 'DeptName',
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
            title: t('2115'),
            id: 'ItemClassLName',
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
            title: t('3262'),
            id: 'ItemClassMName',
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
            title: t('592'),
            id: 'ItemClassSName',
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
            width: 150,
            hasMenu: true,
            visible: true,
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
            title: 'Quy cách',
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
            title: t('338'),
            id: 'Qty',
            kind: 'Number',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderNumber,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('411'),
            id: 'ReqDate',
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
            title: t('19981'),
            id: 'ReqDateTo',
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
            title: t('369'),
            id: 'ProgStatusName',
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
            title: t("16939"),
            id: 'LeftQty',
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
            title: t('14843'),
            id: 'PlanDeptName',
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

    ], [t]);
    const [loadingA, setLoadingA] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

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
    const [FactUnit, setFactUnit] = useState('')
    const [ProdReqNo, setProdReqNo] = useState('')
    const [ReqType, setReqType] = useState('')
    const [ProgStatus, setProgStatus] = useState('')
    const [ItemName, setItemName] = useState('')
    const [ItemNo, setItemNo] = useState('')
    const [OrderNo, setOrderNo] = useState('')
    const [ProdType, setProdType] = useState('')
    const [PoNo, setPoNo] = useState('')
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdmps_prod_req_item_list_a',
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
        togglePageInteraction(true)
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchData = controller;
        const search = {
            FactUnit: FactUnit,
            ReqDate: formData ? formatDate(formData) : '',
            ReqDateTo: toDate ? formatDate(toDate) : '',
            ProdReqNo: ProdReqNo,
            DeptSeq: dataSearch?.BeDeptSeq || '',
            EmpSeq: dataSearch2?.EmpSeq || '',
            EndDate: '',
            EndDateTo: '',
            DelvDate: '',
            DelvDateTo: '',
            ReqType: ReqType,
            ProdType: ProdType,
            UMProdObject: '',
            PoNo: PoNo,
            CustSeq: '',
            ProgStatus: ProgStatus,
            ItemName: ItemName,
            ItemNo: ItemNo,
            OrderNo: OrderNo


        };
        try {
            const response = await GetQPdmpsProdReqItemList(search, signal);

            if (response.success) {
                const fetchedData = response.data || [];
                setGridData(fetchedData);
                setNumRows(fetchedData.length + 1);
            } else {
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
            const [
                help01,
                help02,
                help03,
                help04,
                help05,
                help06,
                help07,
            ] = await Promise.all([
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
                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '6067',
                    '',
                    '',
                    '',
                    signal
                ),
            ])
            setHelpData01(help01?.data || [])
            setHelpData02(help02?.data || [])
            setHelpData03(help03?.data || [])
            setHelpData04(help04?.data || [])
            setHelpData05(help05?.data || [])
            setHelpData06(help06?.data || [])
            setHelpData07(help07?.data || [])
        } catch (error) {
            setHelpData01([])
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

    return (
        <>
            <Helmet>
                <title>HPM - {t('850000161')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] p-3 overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 mb-2 row-start-1 w-full rounded-lg ">
                        <div className="flex items-center justify-between mb-2">
                            <Title level={4} className="mt-2 uppercase opacity-85 ">
                                {t('850000161')}
                            </Title>
                            <PdmpsProdReqItemListAction
                                fetchData={fetchData}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                                    <FilterOutlined />
                                    {t('359')}
                                </h2>
                                <span className="relative size-5 shrink-0">
                                    <ArrowIcon />
                                </span>
                            </summary>
                            <div className="flex p-2 gap-4">
                                <PdmpsProdReqItemListQuery
                                    helpData01={helpData01}
                                    helpData02={helpData02}
                                    helpData03={helpData03}
                                    helpData04={helpData04}
                                    helpData05={helpData05}
                                    helpData06={helpData06}
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


                                    setFactUnit={setFactUnit}
                                    FactUnit={FactUnit}

                                    setProdReqNo={setProdReqNo}
                                    ProdReqNo={ProdReqNo}
                                    setReqType={setReqType}
                                    setProgStatus={setProgStatus}
                                    ReqType={ReqType}
                                    setProdType={setProdType}
                                    ProdType={ProdType}
                                    helpData07={helpData07}
                                    setOrderNo={setOrderNo}
                                    OrderNo={OrderNo}
                                    setItemName={setItemName}
                                    ItemName={ItemName}
                                    setItemNo={setItemNo}
                                    ItemNo={ItemNo}
                                    PoNo={PoNo}
                                    setPoNo={setPoNo}
                                />
                            </div>
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
                        <TablePdmpsProdReqItemList
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