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
import TablePdmpsProdPlanList from '../../components/table/pdmpsProd/tablePdmpsProdpLANList'
import PdmpsProdPlanListQuery from '../../components/query/pdmpsProd/pdmpsProdPlanListQuery'
import PdmpsProdPlanListAction from '../../components/actions/pdmpsProd/PdmpsProdPlanListAction'
import { GetQPdmpsProdPlanList } from '../../../features/pdmpsProd/getQPdmpsProdPlanList'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'
export default function PdmpsProdReqPlanList({ permissions,
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
            title: t('607'),
            id: 'IsCfm',
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
            title: t('1786'),
            id: 'ItemName',
            kind: 'Number',
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
            title: t('2091'),
            id: 'ItemNo',
            kind: 'Number',
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
            title: t('13057'),
            id: 'Spec',
            kind: 'Number',
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
            title: t('1529'),
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
            title: t('6423'),
            id: 'ProdQty',
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
            title: t('2252'),
            id: 'ProcRevName',
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
            title: t('2119'),
            id: 'AssetName',
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
            title: t('388'),
            id: 'SrtDate',
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
            title: t('6444'),
            id: 'EndDate',
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
            title: t('643'),
            id: 'CfmEmpName',
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
            title: t('262'),
            id: 'CfmDate',
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
            title: t('9437'),
            id: 'LastUserName',
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
            title: t('1235'),
            id: 'LastDateTime',
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
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const [minorValue, setMinorValue] = useState('')
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())
    const [FactUnit, setFactUnit] = useState('')
    const [ProdReqNo, setProdReqNo] = useState('')
    const [ReqType, setReqType] = useState('')
    const [ProdType, setProdType] = useState('')
    const [ItemName, setItemName] = useState('')
    const [ItemNo, setItemNo] = useState('')
    const [Spec, setSpec] = useState('')
    const [dataType, setDataType] = useState([])
    const [isCheckClick, setIsCheckClick] = useState(false);
    const [keyPath, setKeyPath] = useState(null)
    const [ProdPlanNo, setProdPlanNo] = useState('')
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdmps_prod_plan_list_a',
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
            ProdPlanNo: ProdPlanNo,
            SrtDate: formData ? formatDate(formData) : '',
            EndDate: toDate ? formatDate(toDate) : '',
            FrProdPlanDate: '',
            ToProdPlanDate: '',
            AssetSeq: '',
            ItemName: ItemName,
            ItemNo: ItemNo,
            Spec: Spec,
            DeptSeq: dataSearch?.BeDeptSeq || '',
            ProcRevName: '',
            CfmEmpName: '',

        };
        try {
            const response = await GetQPdmpsProdPlanList(search, signal);
            if (response.success) {
                const fetchedData = JSON.parse(response.data) || [];
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
            const [
                help01,
                help02,
                help03,
                help04,
                help05,
                help06,
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
            ])

            setHelpData01(help01?.data || [])
            setHelpData02(help02?.data || [])
            setHelpData03(help03?.data || [])
            setHelpData04(help04?.data || [])
            setHelpData05(help05?.data || [])
            setHelpData06(help06?.data || [])
        } catch (error) {
            setHelpData02([])
            setHelpData03([])
            setHelpData04([])
            setHelpData05([])
            setHelpData06([])
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
                    ProdPlanNoQry: data[0]?.ProdPlanNo,
                    ProdReqEndDateFrom: data[0]?.EndDate,
                    ProdReqEndDateTo: data[0]?.SrtDate,
                    FactUnit: data[0]?.UnitSeq,
                    ItemName: data[0]?.ItemName,
                    ItemNo: data[0]?.ItemNo,
                    Spec: data[0]?.Spec,
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
            window.open(`/wms/u/prod_mgmt/pdmps/pdms_prod_plan/${keyPath}`);
            localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true))
        }
    }, [keyPath]);

    return (
        <>
            <Helmet>
                <title>ITM - {t('850000164')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">
                            <PdmpsProdPlanListAction
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
                                <PdmpsProdPlanListQuery
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
                                />
                            </div>
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t rounded-lg  overflow-auto">
                        <TablePdmpsProdPlanList
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