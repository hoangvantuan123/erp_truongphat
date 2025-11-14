import { useState, useCallback, useEffect, useRef, useMemo, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import {
    Input,
    notification,
    Table,
    Typography,
    message,
    Spin,
    Layout,
} from 'antd'
const { Title, Text } = Typography
import { FilterOutlined, LoadingOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import CryptoJS from 'crypto-js'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import ModalWaiting from '../../components/modal/material/modalWaiting'
import TopLoadingBar from 'react-top-loading-bar'
import PdmmOutQueryDetailListAction from '../../components/actions/pdmm/pdmmOutQueryDetailListAction'
import PdmmOutQueryDetailListQuery from '../../components/query/pdmm/pdmmOutQueryDetailListQuery'
import TablePdmmOutQueryDetailList from '../../components/table/pdmm/tablePdmmOutQueryDetailList'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { PostQOutReqItemList } from '../../../features/pdmm/postQOutReqItemList'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
export default function PdmmOutQueryDetailList({
    permissions,
    isMobile,
    canEdit,
    setCollapsed,
    collapsed,
    abortControllerRef,
    controllers,
    cancelAllRequests,
}) {
    const loadingBarRef = useRef(null)
    const { t } = useTranslation()
    const userInfo = localStorage.getItem('userInfo')
    const parsedUserInfo = JSON.parse(userInfo)

    const defaultCols = useMemo(
        () => [
            {
                title: '',
                id: 'Status',
                kind: 'Text',
                readonly: true,
                width: 50,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderLookup,
            },

            {
                title: t('607'),
                id: 'IsConfirm',
                kind: 'Boolean',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderBoolean,
            },
            {
                title: t('1326'),
                id: 'IsStop',
                kind: 'Boolean',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderBoolean,
            },
            {
                title: t('2'),
                id: 'FactUnitName',
                kind: 'Text',
                readonly: true,
                width: 150,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('647'),
                id: 'OutReqNo',
                kind: 'Text',
                readonly: true,
                width: 150,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('200'),
                id: 'ReqDate',
                kind: 'Text',
                readonly: true,
                width: 100,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('2090'),
                id: 'ItemName',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('2091'),
                id: 'ItemNo',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('551'),
                id: 'Spec',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('2107'),
                id: 'ItemSeq',
                kind: 'Text',
                readonly: true,
                width: 100,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('7516'),
                id: 'Qty',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderNumber,
            },
            {
                title: t('LeftQty'),
                id: 'LeftQty',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderNumber,
            },
            {
                title: t('StockQty'),
                id: 'StockQty',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderNumber,
            },


            {
                title: t('369'),
                id: 'ProgStatus',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('2085'),
                id: 'UnitName',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },


            {
                title: t('366'),
                id: 'DeptName',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('DeptSeq'),
                id: 'DeptSeq',
                kind: 'Text',
                readonly: true,
                width: 100,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('623'),
                id: 'EmpName',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('EmpSeq'),
                id: 'EmpSeq',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('626'),
                id: 'OutWHName',
                kind: 'Text',
                readonly: true,
                width: 180,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('WorkCenterName'),
                id: 'WorkCenterName',
                kind: 'Text',
                readonly: true,
                width: 180,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('WorkCenterSeq'),
                id: 'WorkCenterSeq',
                kind: 'Text',
                readonly: true,
                width: 180,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('InWHName'),
                id: 'InWHName',
                kind: 'Text',
                readonly: true,
                width: 180,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },


            {
                title: t('8072'),
                id: 'OutReqSeq',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('3151'),
                id: 'FactUnit',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('9563'),
                id: 'OutWHSeq',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('Ngày xác nhận'),
                id: 'ReqDate',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderDate,
            },
            {
                title: t('3259'),
                id: 'AssetName',
                kind: 'Text',
                readonly: true,
                width: 150,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
        ],

        [t],
    )

    const [data, setData] = useState([])

    const [dataBizUnit, setDataBizUnit] = useState([])
    const [dataStatus, setDataStatus] = useState([])
    const [dataTypeName, setDataTypeName] = useState([])
    const [dataStockType, setDataStockType] = useState([])

    const [dataWarehouse, setDataWarehouse] = useState([])
    const [dataDeptName, setDataDeptName] = useState([])
    const [dataUserName, setDataUserName] = useState([])
    const [dataCustName, setDataCustName] = useState([])

    const [fromDate, setFromDate] = useState(dayjs().startOf('month') || '')
    const [toDate, setToDate] = useState(dayjs())

    const [bizUnit, setBizUnit] = useState('0')
    const [itemName, setItemName] = useState('')
    const [itemNo, setItemNo] = useState('')
    const [typeName, setTypeName] = useState('0')
    const [stockType, setStockType] = useState('0')
    const [status, setStatus] = useState('0')

    const [keyPath, setKeyPath] = useState(null)
    const formatDate = (date) => date.format('YYYYMMDD')

    //Sheet
    const [gridData, setGridData] = useState([])
    const [isQuery, setIsQuery] = useState(false)
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [showSearch, setShowSearch] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [clickCount, setClickCount] = useState(false)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [dataSearch, setDataSearch] = useState(null)
    const [dataSearch2, setDataSearch2] = useState(null)
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdmm_out_query_detail_list_a',
            defaultCols.filter((col) => col.visible),
        ),
    )
    useEffect(() => {
        setCols(defaultCols.filter((col) => col.visible))
    }, [defaultCols])
    const [whName, setWhName] = useState('')
    const [whSeq, setWhSeq] = useState('')

    /* CodeHelp */
    const [empName, setEmpName] = useState('')
    const [empSeq, setEmpSeq] = useState('')
    const [custName, setCustName] = useState('')
    const [custSeq, setCustSeq] = useState('')
    const [deptName, setDeptName] = useState('')
    const [deptSeq, setDeptSeq] = useState('0')
    const [etcReqNo, setEtcReqNo] = useState('')

    const [checkIsStop, setCheckIsStop] = useState(false)
    const [checkIsConfirm, setCheckIsConfirm] = useState(false)
    const [isAPISuccess, setIsAPISuccess] = useState(true)


    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const [searchText, setSearchText] = useState('')
    const [searchText2, setSearchText2] = useState('')
    const [itemText, setItemText] = useState('')
    const [itemText2, setItemText2] = useState('')
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }

    useEffect(() => {
        cancelAllRequests()
        message.destroy()
    }, [])

    useEffect(() => {
        if (parsedUserInfo && parsedUserInfo.UserName) {
            setEmpName(parsedUserInfo.UserName)
            setEmpSeq(parsedUserInfo.EmpSeq)
        }
    }, [])


    const fetchSLGInOutReqItemListQueryWEB = async () => {
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart()
        }
        togglePageInteraction(true)
        try {
            const data = {
                IsChangedMst: '0',
                InOutReqType: typeName === undefined ? '0' : typeName,
                FactUnit: bizUnit,
                ReqDate: fromDate ? formatDate(fromDate) : '',
                ReqDateTo: toDate ? formatDate(toDate) : '',
                OutWHSeq: whSeq,
                OutWHName: whName,
                SMProgressType: status,
                SMProgressTypeName: '',
                InOutReqDetailKind: stockType,
                InOutReqDetailKindName: '',
                CustSeq: custSeq,
                CustName: custName,
                DeptName: dataSearch?.BeDeptName || dataSearch?.DeptName || '',
                EmpSeq: dataSearch2?.EmpSeq || '',
                DeptSeq: dataSearch2?.DeptSeq || dataSearch2?.BeDeptSeq || '',
                ItemName: itemName,
                ItemNo: itemNo,
                EmpName: dataSearch2?.EmpName || '',
                OutReqNo: etcReqNo,
            }

            const response = await PostQOutReqItemList(data)
            if (response.success) {
                const fetchedData = response.data || []
                setData(fetchedData)
                setGridData(fetchedData)
                setIsAPISuccess(true)

                setNumRows(fetchedData.length + 1)
                setIsQuery(true)
                resetTable()
            } else {
                setData([])
                setGridData([])
                setNumRows(1)
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải dữ liệu.')
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete()
            }
            togglePageInteraction(false)
        }
    }

    const fetchCodeHelpData = useCallback(async () => {
        if (controllers.current.fetchCodeHelpController) {
            controllers.current.fetchCodeHelpController.abort()
            controllers.current.fetchCodeHelpController = null
            await new Promise((resolve) => setTimeout(resolve, 10))
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart()
        }
        const controller = new AbortController()
        const signal = controller.signal

        controllers.current.fetchCodeHelpController = controller
        try {
            const [
                codeHelpBizUnit,
                codeHelpTypeName,
                codeHelpStatus,
                codeHelpStockType,
                codeHelpWarehouse,
                codeHelpDeptName,
                codeHelpUserName,
                codeHelpCustName,
            ] = await Promise.all([
                GetCodeHelpComboVer2('', 6, 10003, 1, '%', '', '', '', ''),
                GetCodeHelpComboVer2('', 6, 19999, 1, '%', '1028534', '', '', ''),
                GetCodeHelpComboVer2('', 6, 19995, 1, '%', '3329', '', '', ''),
                GetCodeHelpComboVer2('', 6, 19999, 1, '%', '8025', '', '', ''),
                GetCodeHelpVer2(
                    10006,
                    '',
                    bizUnit || '',
                    '',
                    '',
                    '',
                    '1',
                    '',
                    1,
                    '',
                    0,
                    0,
                    0,
                ),
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(17001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
            ])

            setDataBizUnit(codeHelpBizUnit?.data || [])
            setDataTypeName(codeHelpTypeName?.data || [])
            setDataStatus(codeHelpStatus?.data || [])
            setDataStockType(codeHelpStockType?.data || [])
            setDataWarehouse(codeHelpWarehouse?.data || [])
            setDataDeptName(codeHelpDeptName?.data || [])
            setDataUserName(codeHelpUserName?.data || [])
            setDataCustName(codeHelpCustName?.data || [])
        } catch (error) {
            setDataBizUnit([])
            setDataTypeName([])
            setDataStatus([])
            setDataStockType([])
            setDataWarehouse([])
            setDataDeptName([])
            setDataUserName([])
            setDataCustName([])
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete()
            }
            controllers.current.fetchCodeHelpController = null
        }
    }, [bizUnit])

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


    const nextPage = useCallback(() => {
        if (keyPath) {
            window.open(`/wms/u/prod_mgmt/pdmm/pdmm_out_query_detail_list/${keyPath}`, '_blank')
            localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true))
        }
    }, [keyPath])
    //Sheet

    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
                (row) => row !== undefined,
            ),
        )
    }
    useEffect(() => {
        const data = getSelectedRowsData()
        if (data && data.length > 0) {
            if (Number(data[0]?.IsConfirm) !== 1) {

                setKeyPath(null)
                message.warning('Đơn yêu cầu chưa được phê duyệt')
            } else if (Number(data[0]?.IsStop) === 1) {
                setKeyPath(null)
                message.warning('Đơn yêu cầu đã bị dừng lại')
            } else {
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
            }
        } else {
            setKeyPath(null)
        }
    }, [selection.rows.items, gridData])

    const handleRowAppend = useCallback(
        (numRowsToAdd) => {

        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
    )

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault()
                setShowSearch(true)
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
                fetchSLGInOutReqItemListQueryWEB()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [fetchSLGInOutReqItemListQueryWEB])
    const nextPage2 = useCallback(() => {
        if (keyPath) {
            window.open(`/wms/u/prod_mgmt/pdmm/pdmm_out_query_detail_list/${keyPath}`, '_blank')
            localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true))
        }
    }, [keyPath])
    return (
        <>
            <Helmet>
                <title>HPM - {t('Truy vấn chi tiết đề nghị xuất khi vật liệu')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">

                            <PdmmOutQueryDetailListAction
                                nextPage={nextPage}
                                debouncedFetchSLGInOutReqItemListQueryWEB={
                                    fetchSLGInOutReqItemListQueryWEB
                                }
                                nextPage2={nextPage2}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
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
                            <PdmmOutQueryDetailListQuery
                                fromDate={fromDate}
                                setFromDate={setFromDate}
                                setToDate={setToDate}
                                toDate={toDate}
                                bizUnit={bizUnit}
                                dataBizUnit={dataBizUnit}
                                setBizUnit={setBizUnit}
                                typeName={typeName}
                                dataTypeName={dataTypeName}
                                setTypeName={setTypeName}
                                stockType={stockType}
                                dataStockType={dataStockType}
                                setStockType={setStockType}
                                status={status}
                                dataStatus={dataStatus}
                                setStatus={setStatus}
                                whName={whName}
                                setWhName={setWhName}
                                setWhSeq={setWhSeq}
                                dataWarehouse={dataWarehouse}
                                custName={custName}
                                setCustName={setCustName}
                                setCustSeq={setCustSeq}
                                dataCustName={dataCustName}
                                userName={empName}
                                setUserName={setEmpName}
                                setUserSeq={setEmpSeq}
                                dataUserName={dataUserName}
                                deptName={deptName}
                                setDeptName={setDeptName}
                                setDeptSeq={setDeptSeq}
                                dataDeptName={dataDeptName}
                                etcReqNo={etcReqNo}
                                setEtcReqNo={setEtcReqNo}
                                itemName={itemName}
                                setItemName={setItemName}
                                itemNo={itemNo}
                                setItemNo={setItemNo}


                                setDataSheetSearch={setDataSheetSearch}
                                dataSheetSearch={dataSheetSearch}
                                setDataSheetSearch2={setDataSheetSearch2}
                                setItemText2={setItemText2}
                                itemText2={itemText2}
                                setSearchText2={setSearchText2}

                                searchText2={searchText2}
                                setDataDeptName={setDataDeptName}
                                setDataUserName={setDataUserName}
                                controllers={controllers}
                                searchText={searchText}
                                itemText={itemText}
                                setItemText={setItemText}
                                setSearchText={setSearchText}
                                setDataSearch={setDataSearch}
                                setDataSearch2={setDataSearch2}
                            />
                        </details>
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 border-t w-full h-full rounded-lg">
                        <TablePdmmOutQueryDetailList
                            data={data}
                            setSelection={setSelection}
                            selection={selection}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            setAddedRows={setAddedRows}
                            addedRows={addedRows}
                            setEditedRows={setEditedRows}
                            editedRows={editedRows}
                            setNumRowsToAdd={setNumRowsToAdd}
                            clickCount={clickCount}
                            numRowsToAdd={numRowsToAdd}
                            numRows={numRows}
                            onSelectRow={onSelectRow}
                            openHelp={openHelp}
                            setOpenHelp={setOpenHelp}
                            setOnSelectRow={setOnSelectRow}
                            setIsCellSelected={setIsCellSelected}
                            isCellSelected={isCellSelected}
                            setGridData={setGridData}
                            gridData={gridData}
                            setNumRows={setNumRows}
                            setCols={setCols}
                            handleRowAppend={handleRowAppend}
                            cols={cols}
                            defaultCols={defaultCols}
                            setIsQuery={setIsQuery}
                            isQuery={isQuery}
                        />

                    </div>
                </div>
            </div>

            <ModalWaiting
                modal2Open={checkIsStop}
                setModal2Open={setCheckIsStop}
                resetTable={resetTable}
                error="Đơn yêu cầu đã tạm dừng!"
                setKeyPath={setKeyPath}
            />

            <ModalWaiting
                modal2Open={checkIsConfirm}
                setModal2Open={setCheckIsConfirm}
                resetTable={resetTable}
                error="Đơn yêu cầu chưa được xác nhận!"
                setKeyPath={setKeyPath}
            />
        </>
    )
}
