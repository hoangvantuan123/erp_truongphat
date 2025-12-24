/* PdmmOutQueryList */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Button, message, Modal, Collapse } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar';
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { GetWcQuery } from '../../../features/wc/wcQ'
import PdmmOutQueryListQuery from '../../components/query/pdmm/pdmmOutQueryList'
import TablePdmmOutQueryList from '../../components/table/pdmm/tablePdmmOutQueryList'
import PdmmOutQueryListAction from '../../components/actions/pdmm/pdmmOutQueryListAction'
import { GetOutReqListQuery } from '../../../features/pdmm/getOutReqListQuery'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'
export default function PdmmOutQueryList({ permissions,
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
            id: 'IsConfirm',
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
            title: t('240'),
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
            title: t('OutReqNo'),
            id: 'OutReqNo',
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
            title: t('366'),
            id: 'DeptName',
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
            title: t('1859'),
            id: 'EmpName',
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
            title: t('2170'),
            id: 'ItemName',
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
            id: 'ItemSpec',
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
            title: t('3244'),
            id: 'UnitName',
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
            title: t('4382'),
            id: 'Qty',
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
            title: t('9542'),
            id: 'ProgQty',
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
            title: t('362'),
            id: 'Remark',
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
            title: t("850000167"),
            id: 'CfmReason',
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
            title: 'ItemSeq',
            id: 'ItemSeq',
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
            title: 'OutReqSeq',
            id: 'OutReqSeq',
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
            title: 'ProgStatus',
            id: 'ProgStatus',
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
    const [helpData03, setHelpData03] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
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
    const [dataType, setDataType] = useState([])
    const [isCheckClick, setIsCheckClick] = useState(false);
    const [keyPath, setKeyPath] = useState(null)
    const [OutReqNo, setOutReqNo] = useState('')

    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdmm_out_list_extra_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }


    const fetchData = async () => {

        setLoadingA(true);
        if (controllers.current.fetchData) {
            controllers.current.fetchData.abort();
            controllers.current.fetchData = null;
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
            ReqDate: formData ? formatDate(formData) : '',
            ReqDateTo: toDate ? formatDate(toDate) : '',
            OutReqNo: OutReqNo,
            UseType: '',
            DeptName: dataSearch?.BeDeptName || dataSearch?.DeptName || '',
            EmpSeq: dataSearch2?.EmpSeq || '',
            DeptSeq: dataSearch2?.DeptSeq || dataSearch?.BeDeptSeq || '',
            CustSeq: '',
            CustName: '',
            ProgStatus: '',
            ProdPlanNo: '',
            WorkOrderNo: '',
            ProdReqNo: '',
        };
        try {
            const response = await GetOutReqListQuery(search, signal);

            if (response.success) {
                const fetchedData = updateIndexNo(response.data) || [];

                setGridData(fetchedData);
                setNumRows(fetchedData.length + 1);
            } else {
                setGridData([])
                setNumRows(0)
                setData([]);
            }
        } catch (error) {
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
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
        fetchData()
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

            ] = await Promise.all([
                GetCodeHelpVer2(18021, '', '', '', '', '', '', 1, 250, '', 0, 0, 0, signal),
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
                GetWcQuery(search, signal)

            ])

            setHelpData01(help01?.data || [])
            setHelpData03(help03?.data || [])
            setHelpData05(help05?.data || [])
            setHelpData06(help06?.data || [])
            setHelpData07(help07?.data || [])

        } catch (error) {
            setHelpData01([])
            setHelpData03([])
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
                    OutReqSeq: data[0]?.OutReqSeq,
                    key: "OutReqSeq",
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
            window.open(`/wms/u/prod_mgmt/pdmm/pdmm_out_extra/${keyPath}`);
            localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true))
        }
    }, [keyPath]);



    const nextPage2 = useCallback(() => {
        if (keyPath) {
            window.open(`/wms/u/prod_mgmt/pdmm/pdmm_out_query_detail_list/${keyPath}`, '_blank')
            localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true))
        }
    }, [keyPath])
    return (
        <>
            <Helmet>
                <title>ITM - {t('800000121')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">
                            <PdmmOutQueryListAction
                                fetchData={fetchData}
                                nextPage={nextPage}
                                nextPage2={nextPage2}
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
                                <PdmmOutQueryListQuery
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
                                    setOutReqNo={setOutReqNo}
                                    OutReqNo={OutReqNo}
                                />
                            </div>
                        </details>
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 border-t min-h-0 overflow-auto relative">
                        <TablePdmmOutQueryList
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
                            setAddedRows={setAddedRows}
                            addedRows={addedRows}
                            helpData07={helpData07}
                            setHelpData07={setHelpData07}
                        />
                    </div>
                </div>
            </div>


        </>
    )
}