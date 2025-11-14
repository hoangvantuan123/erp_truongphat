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

import PdsfcWorkReportListAction from '../../components/actions/pdsfc/pdsfcWorkReportListAction'
import PdsfcWorkReportListQuery from '../../components/query/pdsfc/pdsfcWorkReportListQuery'
import TablepdsfcWorkReportList from '../../components/table/pdsfc/tablepdsfcWorkReportList'
import { PostSPDSFCWorkReportQ } from '../../../features/pdsfc/postSPDSFCWorkReportQ'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import { PostSPDSFCWorkReportWorkEmpQ } from '../../../features/pdsfc/postSPDSFCWorkReportWorkEmpQ'
export default function PdsfcWorkReportList({ permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    controllers,
    cancelAllRequests


}) {
    const activeFetchCountRef = useRef(0);
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
            title: t('218'),
            id: 'WorkDate',
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
            title: t('744'),
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
            title: t('1524'),
            id: 'ProdPlanNo',
            kind: 'Text',
            readonly: false,
            width: 190,
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
            title: t('38099'),
            id: 'ReOrderQty',
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
            title: t('1527'),
            id: 'WorkHour',
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
            title: t('8232'),
            id: 'WorkerQty',
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
            title: t('2101'),
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
            title: t('2846'),
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
            title: t('14853'),
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
            title: t('16001'),
            id: 'GoodItemSClassName',
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
            title: t('1773'),
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
            title: t('1774'),
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
            title: t('16000'),
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
            title: t('4519'),
            id: 'StdUnitProdQty',
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
            title: t('4521'),
            id: 'StdUnitOKQty',
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
            title: t('4516'),
            id: 'StdUnitBadQty',
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
            title: t('38100'),
            id: 'StdUnitReOrderQty',
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
            title: t('LotNo'),
            id: 'RealLotNo',
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
            title: t('8269'),
            id: 'WorkCondition1',
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
            title: t('8270'),
            id: 'WorkCondition2',
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
            title: t('8271'),
            id: 'WorkCondition3',
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
            title: t('8272'),
            id: 'WorkCondition4',
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
            title: t('8273'),
            id: 'WorkCondition5',
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
            title: t('8274'),
            id: 'WorkCondition6',
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
            title: t('22278'),
            id: 'WorkCondition7',
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
            title: t('16878'),
            id: 'IsMatInput',
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
            title: t('3240'),
            id: 'IsLastProc',
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
            title: t('1903'),
            id: 'IsGoodIn',
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
            title: t('1982'),
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
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: t('9437'),
            id: 'CustName',
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
    const [WorkType, setWorkType] = useState('')
    const [RealLotNo, setRealLotNo] = useState('')
    const [AssyItemName, setAssyItemName] = useState('')
    const [AssyItemNo, setAssyItemNo] = useState('')
    const [dataType, setDataType] = useState([])
    const [keyPath, setKeyPath] = useState(null)
    const [isCheckClick, setIsCheckClick] = useState(false);
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_work_report_list_a',
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


    const increaseFetchCount = () => {
        activeFetchCountRef.current += 1;
        if (activeFetchCountRef.current === 1) {
            loadingBarRef.current?.continuousStart();
            togglePageInteraction(true);
        }
    };

    const decreaseFetchCount = () => {
        activeFetchCountRef.current -= 1;
        if (activeFetchCountRef.current === 0) {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    };

    const fetchData = async () => {
        increaseFetchCount();
        setLoadingA(true);

        if (controllers.current.fetchData) {
            controllers.current.fetchData.abort();
            controllers.current.fetchData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.fetchData = controller;

        const search = {
            FactUnit,
            WorkDate: formData ? formatDate(formData) : '',
            WorkDateTo: toDate ? formatDate(toDate) : '',
            WorkType,
            WorkOrderNo,
            ProdPlanNo,
            DeptSeq: dataSheetSearch[0]?.BeDeptSeq ?? '',
            DeptName: dataSheetSearch[0]?.BeDeptName ?? '',
            WorkCenterSeq: dataSheetSearch2[0]?.WorkCenterSeq ?? '',
            WorkCenterName: dataSheetSearch2[0]?.WorkCenterName ?? '',
            RealLotNo,
            SMIsMatInput: '',
            GoodItemName: ItemName,
            GoodItemNo: ItemNo,
            GoodItemSpec: '',
            ProcName: '',
            AssyItemName,
            AssyItemNo,
            AssyItemSpec: '',
            PJTName: '',
            PJTNo: '',
            CustSeq: '',
            PoNo: '',
            EmpName: '',
            WorkTimeGroup: '',
            GoodItemSClass: '',
            GoodItemSClassName: '',
            CCtrSeq: '',
            CCtrName: ''
        };

        try {
            const response = await PostSPDSFCWorkReportQ(search, signal);
            if (response.success) {
                const fetchedData = response.data || [];
                setGridData(fetchedData);
                setNumRows(fetchedData.length + 1);
            } else {
                message.error(response.errorDetails);
                setGridData([]);
                setNumRows(0);
                setData([]);
            }
        } catch (error) {
            setGridData([]);
            setNumRows(0);
            setData([]);
        } finally {
            decreaseFetchCount();
            controllers.current.fetchData = null;
            setLoadingA(false);
        }
    };

    const fetchCodeHelpData = useCallback(async () => {
        increaseFetchCount();
        setLoading(true);

        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.fetchCodeHelpData = controller;

        try {
            const search = {
                FactUnit: '',
                SMWorkCenterType: '',
                WorkCenterName: '',
                DeptName: ''
            };

            const [help01, help03, help04, help07] = await Promise.all([
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '6041', '', '', '', signal),
                GetCodeHelpCombo('', 6, 60001, 1, '%', '', '', '', '', signal),
                GetWcQuery(search, signal),
            ]);

            setHelpData01(help01?.data || []);
            setHelpData03(help03?.data || []);
            setHelpData04(help04?.data || []);
            setHelpData07(help07?.data || []);
        } catch (error) {
            setHelpData01([]);
            setHelpData03([]);
            setHelpData04([]);
            setHelpData05([]);
            setHelpData06([]);
            setHelpData07([]);
        } finally {
            decreaseFetchCount();
            controllers.current.fetchCodeHelpData = null;
            setLoading(false);
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
                    WorkReportSeq: data[0]?.WorkReportSeq,
                    WorkCenterSeq: data[0]?.WorkCenterSeq,
                    WorkDate: data[0]?.WorkDate,
                    FactUnit: data[0]?.FactUnit,
                    FactUnitName: data[0]?.FactUnitName,
                    DeptSeq: data[0]?.DeptSeq,
                    DeptName: data[0]?.DeptName,
                    StdUnitProdQty: data[0]?.StdUnitProdQty,
                    ProdQty: data[0]?.ProdQty,
                    WorkOrderNo: data[0]?.WorkOrderNo,
                    AssyItemNo: data[0]?.AssyItemNo,
                    ProdPlanNo: data[0]?.ProdPlanNo,
                    ProcName: data[0]?.ProcName,
                    AssyItemName: data[0]?.AssyItemName,
                    InOutSeq: data[0]?.InOutSeq,
                    WorkCenterName: data[0]?.WorkCenterName,
                    ProcSeq: data[0]?.ProcSeq,
                    WorkOrderSerl: data[0]?.WorkOrderSerl,
                    WorkOrderSeq: data[0]?.WorkOrderSeq,
                    NewRow: false


                }
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
                <title>HPM - {t('Truy vấn hiệu suất sản xuất')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">
                            <PdsfcWorkReportListAction
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
                                <PdsfcWorkReportListQuery
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
                                    setWorkType={setWorkType}
                                    WorkType={WorkType}
                                    setRealLotNo={setRealLotNo}
                                    RealLotNo={RealLotNo}
                                    AssyItemName={AssyItemName}
                                    AssyItemNo={AssyItemNo}
                                    setAssyItemNo={setAssyItemNo} setAssyItemName={setAssyItemName}


                                />
                            </div>
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t   overflow-auto">
                        <TablepdsfcWorkReportList
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