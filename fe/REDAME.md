import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Typography, Row, Col, message, Form, Checkbox } from 'antd'
const { Title, Text } = Typography
import {
    FilterOutlined,
    LoadingOutlined,
    BlockOutlined,
    BarcodeOutlined,
    QrcodeOutlined,
} from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { debounce, set } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { filterAndSelectColumnsAUD } from '../../../utils/filterSheetAUD'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateColumns } from '../../../utils/validateColumns'
import { formatNumberCellSum } from '../../../utils/formatNumberCellSum'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import ModalMasterDelete from '../../components/modal/default/deleteMaster'
import WarningModal from '../default/warningModal'
import ModalWaiting from '../../components/modal/material/modalWaiting'
import SuccessSubmit from '../default/successSubmit'
import LoadSubmit from '../default/loadSubmit'
import ModalFocus from '../default/focus'
import { PostQOutReq } from '../../../features/pdmm/postQOutReq'

import { Splitter, SplitterPanel } from 'primereact/splitter'

import ErrorListModal from '../default/errorListModal'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import PdmmOutQueryDetailListSeqAction from '../../components/actions/pdmm/pdmmOutQueryDetailListSeqAction'
import PdmmOutQueryDetailListSeqQuery from '../../components/query/pdmm/pdmmOutQueryDetailListSeqQuery'
import TablePdmmOutQueryDetailSeqList from '../../components/table/pdmm/tablePdmmOutQueryDetailSeqList'
import TablePdmmOutQueryDetailSeqItemList from '../../components/table/pdmm/tablePdmmOutQueryDetailSeqItemList'
import { PostQScanPdmmOutProc } from '../../../features/pdmm/postQScanPdmmOutProc'
import { PostScanQRCheckStockOutFiFo } from '../../../features/pdmm/postScanQRCheckStockOutFiFo'
export default function PdmmOutQueryDetailListSeq({
    permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    abortControllerRef,
    controllers,
    cancelAllRequests,
}) {
    const { t } = useTranslation()
    const { seq, id } = useParams()
    const loadingBarRef = useRef(null)
    /* SOS*/
    const workerRef = useRef(null)
    const [inputCode, setInputCode] = useState(null)
    const [inputBarCode, setInputBarCode] = useState(null)

    const bufferRef = useRef('')
    const [error, setError] = useState(null)

    const nameFrom = 'XUẤT KHO VẬT LIỆU'

    const [localId, setLocalId] = useState(id)
    const secretKey = 'KEY_PATH'
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
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderLookup,
            },
            {
                title: t('FactUnitName'),
                id: 'FactUnitName',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderBoolean,
            },
            {
                title: t('InWHName'),
                id: 'InWHName',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('OutWHName'),
                id: 'OutWHName',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('Qty'),
                id: 'Qty',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('ReqQty'),
                id: 'ReqQty',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('DateCode'),
                id: 'DateCode',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('ReelNo'),
                id: 'ReelNo',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('StockOutDate'),
                id: 'StockOutDate',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('LotNo'),
                id: 'LotNo',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('LotNoFull'),
                id: 'LotNoFull',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('Barcode'),
                id: 'Barcode',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },

        ],
        [
            t,
        ],
    )

    const defaultColsItem = useMemo(
        () => [
            {
                title: '',
                id: 'Status',
                kind: 'Text',
                readonly: true,
                width: 50,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderLookup,
            },
            {
                title: t('7000517'),
                id: 'InOutSerl',
                kind: 'Text',
                readonly: false,
                width: 100,
                hasMenu: true,
                visible: false,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('ItemName'),
                id: 'ItemName',
                kind: 'Text',
                readonly: true,
                width: 150,
                hasMenu: true,
                visible: true,
                themeOverride: {
                    textHeader: '#DD1144',
                    bgIconHeader: '#DD1144',
                    fontFamily: '',
                },
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('2091'),
                id: 'ItemNo',
                kind: 'Text',
                readonly: true,
                width: 150,
                hasMenu: true,
                visible: true,
                themeOverride: {
                    textHeader: '#DD1144',
                    bgIconHeader: '#DD1144',
                    fontFamily: '',
                },
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },

            {
                title: t('Số lượng'),
                id: 'RemainQty',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderNumber,
            },

            {
                title: t('SL khả dụng'),
                id: 'OutQty',
                kind: 'Text',
                readonly: false,
                width: 150,
                hasMenu: true,
                visible: true,

                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderNumber,
            },
            {
                title: t('Qty1'),
                id: 'Qty1',
                kind: 'Text',
                readonly: false,
                width: 150,
                hasMenu: true,
                visible: true,

                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderNumber,
            },
            {
                title: t('2090'),
                id: 'ItemName',
                kind: 'Text',
                readonly: true,
                width: 180,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('551'),
                id: 'Spec',
                kind: 'Text',
                readonly: true,
                width: 220,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('2107'),
                id: 'ItemSeq',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: false,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderRowID,
            },
            {
                title: t('602'),
                id: 'UnitName',
                kind: 'Text',
                readonly: true,
                width: 120,
                hasMenu: true,
                visible: true,
                trailingRowOptions: {
                    disabled: true,
                },
                icon: GridColumnIcon.HeaderString,
            },





        ],
        [t],
    )

    const columnsError = useMemo(
        () => [
            {
                title: t('Dòng bị lỗi'),
                dataIndex: 'IDX_NO',
                key: 'IDX_NO',
                width: 100,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('Data'),
                dataIndex: 'Name',
                key: 'Name',
                width: 200,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: t('Kết quả'),
                dataIndex: 'result',
                key: 'result',
                width: 400,
                icon: GridColumnIcon.HeaderString,
            },
        ],
        [t],
    )


    const [fromDate, setFromDate] = useState(dayjs())
    const formatDate = (date) => date.format('YYYYMMDD')

    const [gridData, setGridData] = useState([])
    const [gridDataItem, setGridDataItem] = useState([])
    const [gridDataItemTemp, setGridDataItemTemp] = useState([])

    const dataRef = useRef(gridData) /* DATA */
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMasterDeleteOpen, setModalMasterDeleteOpen] = useState(false)

    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [selectionItem, setSelectionItem] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearchItem, setShowSearchItem] = useState(false)

    const [addedRowsItem, setAddedRowsItem] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [editedRowsItem, setEditedRowsItem] = useState([])

    const [numRowsToAddItem, setNumRowsToAddItem] = useState(null)

    const [numRowsItem, setNumRowsItem] = useState(0)
    const [numRows, setNumRows] = useState(0)

    const [openHelp, setOpenHelp] = useState(false)
    const [openHelpItem, setOpenHelpItem] = useState(false)

    const [isCellSelected, setIsCellSelected] = useState(false)
    const [isCellSelectedItem, setIsCellSelectedItem] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [onSelectRowItem, setOnSelectRowItem] = useState([])
    const [isReset, setIsReset] = useState(false)



    /* V */

    const [scanHistory, setScanHistory] = useState([])
    const dataRefSacenHistory = useRef(scanHistory)
    const [filteredData, setFilteredData] = useState(null)
    const [inputItemNo, setInputItemNo] = useState('')
    const [modal2Open, setModal2Open] = useState(false)








    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'out_query_seq_list_a',
            defaultCols.filter((col) => col.visible),
        ),
    )

    const [colsItem, setColsItem] = useState(() =>
        loadFromLocalStorageSheet(
            'out_query_seq_item_list_a',
            defaultColsItem.filter((col) => col.visible),
        ),
    )



    const [status, setStatus] = useState('')
    const [empName, setEmpName] = useState('')
    const [empSeq, setEmpSeq] = useState('')

    const [inOutSeq, setInOutSeq] = useState('0')
    const [inOutNo, setInOutNo] = useState('')

    const [materData, setMaterData] = useState([])
    const fieldsToTrack = ['ItemNo']

    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }

    const resetTableItem = () => {
        setSelectionItem({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }
    useEffect(() => {
        if (parsedUserInfo && parsedUserInfo.UserName) {
            setEmpName(parsedUserInfo.UserName)
            setEmpSeq(parsedUserInfo.EmpSeq)
        }
    }, [])



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
        cancelAllRequests()
        message.destroy()
    }, [])


    const handleChange = (e) => {
        setInputBarCode(e.target.value)
    }
    const handleEnter = () => {
        if (inputBarCode) {

        }
    }



    const fetchDataRoot = async (seq) => {

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
            } else {
                setMaterData([]);
            }
        } catch (error) {
            setMaterData([]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
            controllers.current.fetchDataRoot = null;
        }
    };
    const fetchSheetQuery = async (reqSeq) => {
        try {
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart()
            }
            const searchData = {
                OutReqSeq: reqSeq,
            }
            const etcOutResponse = await PostQScanPdmmOutProc(searchData);

            if (etcOutResponse?.success) {
                const fetchedData = etcOutResponse.data || []

                setGridDataItem(fetchedData)
                setFilteredData(fetchedData)
                setGridDataItemTemp(fetchedData[0])
                setNumRowsItem(fetchedData.length)

                if (loadingBarRef.current) {
                    loadingBarRef.current.complete()
                }
            } else {
                const emptyData = generateEmptyData(0, defaultCols)
                setGridDataItem(emptyData)
                setNumRowsItem(emptyData.length)

                if (loadingBarRef.current) {
                    loadingBarRef.current.complete()
                    message.error('Có lỗi xảy ra khi tải dữ liệu.')
                }
            }
        } catch (error) {

            const emptyData = generateEmptyData(0, defaultCols)
            setGridDataItem(emptyData)
            setNumRowsItem(emptyData.length)

            if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.error('Có lỗi xảy ra khi tải dữ liệu.')
            }
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete()
            }

        }
    }


    useEffect(() => {
        if (seq) {
            const data = decryptData(seq);
            if (!data) {
                return;
            }
            fetchDataRoot(data)
            fetchSheetQuery(data)
        }
    }, []);



    /* HOOKS KEY */
    useKeydownHandler(isCellSelected, setOpenHelp)
    useKeydownHandler(isCellSelectedItem, setOpenHelpItem)



    const handleResetData = useCallback(async () => {
        setIsReset(true)
        setLocalId('')
        setInOutSeq('0')
        setInOutNo('')
        const emptyData = generateEmptyData(0, defaultColsItem)
        setGridDataItem(emptyData)
        setNumRowsItem(emptyData.length)
        resetTableItem()

    }, [defaultColsItem, gridDataItem])


    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && bufferRef.current.trim()) {
                const barcode = bufferRef.current
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-zA-Z0-9/.\-*%_]/g, '')
                handleCheckBarcode(barcode)
                setInputCode(barcode)

                bufferRef.current = ''
            } else if (e.key.length === 1) {
                const normalizedKey = e.key
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                if (/^[a-zA-Z0-9/.\-*%_]{1}$/.test(normalizedKey)) {
                    bufferRef.current += normalizedKey
                }
            }
        }

        const handleFocus = () => setStatus(true)

        const handleBlur = () => setStatus(false)

        const handleClick = () => setStatus(true)

        window.addEventListener('keypress', handleKeyPress)
        window.addEventListener('focus', handleFocus)
        window.addEventListener('blur', handleBlur)
        document.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('keypress', handleKeyPress)
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('blur', handleBlur)
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const debouncedCheckBarcode = useCallback(
        debounce(async (formData, resultMessage) => {
            const resSuccess = await PostScanQRCheckStockOutFiFo(formData)
            if (resSuccess.success) {
                const dataResSuccess = resSuccess.data[0]
                message.success(resultMessage)
                setInputBarCode(null)
                setModal2Open(false)
                setInputCode(null)
                addToScanHistory(dataResSuccess, () => {
                    setGridDataItem((prevData) =>
                        prevData.map((item) =>
                            item.ItemNo === formData.ItemNo
                                ? {
                                    ...item,
                                    OutQty: item.OutQty + formData.Qty,
                                    RemainQty: item.RemainQty - formData.Qty,
                                }
                                : item,
                        ),
                    )
                })
            } else {
                setModal2Open(true)
                setError(resSuccess?.message)
            }
        }, 100),
        [],
    )


    useEffect(() => {
        workerRef.current = new Worker(
            new URL('../../../workers/workeStockOutFiFo.js', import.meta.url),
        )

        workerRef.current.onmessage = async (event) => {
            const { success, message: resultMessage, data: resultData } = event.data
            if (success) {
                if (resultData) {
                    const {
                        itemNo,
                        qty,
                        lot,
                        dc,
                        reel,
                        barcode,
                        UnitSeq,
                        ItemSeq,
                        OutWHName,
                        OutWHSeq,
                        InWHName,
                        InWHSeq,
                        FactUnitName,
                        FactUnit,
                        WorkOrderSerl,
                        WorkOrderSeq,
                        OutReqItemSerl,
                        OutReqSeq,
                    } = resultData

                    const formData = {
                        WorkingTag: 'A',
                        Idx_no: '1',
                        Status: '0',
                        DataSeq: '1',
                        Selected: '1',
                        OutReqSeq: OutReqSeq,
                        OutReqItemSerl: OutReqItemSerl,
                        WorkOrderSeq: WorkOrderSeq,
                        WorkOrderSerl: WorkOrderSerl,
                        FactUnit: FactUnit,
                        FactUnitName: FactUnitName,
                        InWHSeq: InWHSeq,
                        InWHName: InWHName,
                        OutWHSeq: OutWHSeq,
                        OutWHName: OutWHName,
                        ItemSeq: ItemSeq,
                        UnitSeq: UnitSeq,
                        ItemNo: itemNo,
                        LotNo: lot,
                        Qty: qty,
                        DateCode: dc,
                        ReelNo: reel,
                        Barcode: barcode,
                    }
                    setInputItemNo(itemNo)
                    debouncedCheckBarcode(formData, resultMessage)
                }
            } else {
                setModal2Open(true)
                setError(resultMessage)
            }
        }
        return () => {
            workerRef.current.terminate()
            debouncedCheckBarcode.cancel()
        }
    }, [filteredData, debouncedCheckBarcode])
    /* CHECK SCAN  */
    const addToScanHistory = useCallback((dataResSuccess, callback) => {
        const newLotNoFull = dataResSuccess?.LotNoFull?.trim().toLowerCase()
        const newBarcode = dataResSuccess?.Barcode?.trim().toLowerCase()

        setScanHistory((prevHistory) => {
            const isExist = prevHistory.some(
                (item) =>
                    item.LotNoFull?.trim().toLowerCase() === newLotNoFull &&
                    item.Barcode?.trim().toLowerCase() === newBarcode,
            )

            if (!isExist) {
                const updatedHistory = [
                    ...prevHistory,
                    {
                        OutReqSeq: dataResSuccess?.OutReqSeq,
                        OutReqItemSerl: dataResSuccess?.OutReqItemSerl,
                        WorkOrderSeq: dataResSuccess?.WorkOrderSeq,
                        WorkOrderSerl: dataResSuccess?.WorkOrderSerl,
                        FactUnit: dataResSuccess?.FactUnit,
                        FactUnitName: dataResSuccess?.FactUnitName,
                        InWHSeq: dataResSuccess?.InWHSeq,
                        InWHName: dataResSuccess?.InWHName,
                        OutWHSeq: dataResSuccess?.OutWHSeq,
                        OutWHName: dataResSuccess?.OutWHName,
                        ItemSeq: dataResSuccess?.ItemSeq,
                        UnitSeq: dataResSuccess?.UnitSeq,
                        ItemNo: dataResSuccess?.ItemNo,
                        LotNo: dataResSuccess?.LotNo,
                        Qty: dataResSuccess?.Qty,
                        DateCode: dataResSuccess?.DateCode,
                        ReelNo: dataResSuccess?.ReelNo,
                        Barcode: dataResSuccess?.Barcode,
                        StockOutDate: dataResSuccess?.StockOutDate,
                        LotNoFull: dataResSuccess?.LotNoFull,
                        ReqQty: dataResSuccess?.ReqQty,
                        EmpSeq: dataResSuccess?.EmpSeq,
                    },
                ]
                callback()
                return updatedHistory
            }
            return prevHistory
        })
    }, [])

    const handleCheckBarcode = useCallback((barcode) => {
        const currentTableData = dataRef.current
        const currentScanHistory = dataRefSacenHistory.current

        workerRef.current.postMessage({
            type: 'CHECK_BARCODE',
            barcode,
            tableData: currentTableData,
            tableScanHistory: currentScanHistory,
        })
    }, [])


    
    useEffect(() => {
        dataRef.current = gridDataItem
        dataRefSacenHistory.current = scanHistory
    }, [gridDataItem, scanHistory])


    return (
        <>
            <Helmet>
                <title>HPM - {t('XUẤT KHO VẬT LIỆU')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
                <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
                        <div className="flex items-center justify-between mb-2">
                            <Title level={4} className="mt-2 uppercase opacity-85 ">
                                {t('XUẤT KHO VẬT LIỆU')}
                            </Title>
                            <PdmmOutQueryDetailListSeqAction
                                status={status}
                                setModalOpen={setModalOpen}
                                setModalMasterDeleteOpen={setModalMasterDeleteOpen}
                                handleResetData={handleResetData}

                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                                    <BlockOutlined />
                                    {t('Master Data')}
                                </h2>
                                <span className="relative size-5 shrink-0">
                                    <ArrowIcon />
                                </span>
                            </summary>
                            <div className="flex p-2 gap-4">
                                <PdmmOutQueryDetailListSeqQuery
                                    fromDate={fromDate}
                                    setFromDate={setFromDate}
                                    materData={materData}
                                    gridDataItemTemp={gridDataItemTemp}
                                />
                            </div>
                        </details>
                    </div>
                    <div className="col-start-1 flex gap-3 col-end-5 row-start-2 w-full  h-[calc(100%-1 0px)]   rounded-lg  overflow-hidden">
                        <Splitter className="w-full h-full">
                            <SplitterPanel size={50} minSize={10}>
                                <TablePdmmOutQueryDetailSeqList
                                    setSelection={setSelection}
                                    selection={selection}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}
                                    setEditedRows={setEditedRows}
                                    editedRows={editedRows}
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
                                    cols={cols}
                                    defaultCols={defaultCols}
                                    inputItemNo={inputItemNo}
                                />
                            </SplitterPanel>
                            <SplitterPanel size={50} minSize={20}>
                                <div className="h-14 w-full border rounded-lg bg-white mb-1 p-0">
                                    <Form layout="vertical">
                                        <Row className="gap-2 flex items-center">
                                            <Col>
                                                <QrcodeOutlined
                                                    style={{
                                                        fontSize: '42px',
                                                        marginTop: '-12px',
                                                        marginLeft: '20px',
                                                    }}
                                                />
                                            </Col>
                                            <Col className="w-[50%]">
                                                <Form.Item>
                                                    <Input
                                                        placeholder="Nhập thông tin barcode sản phẩm"
                                                        size="middle"
                                                        value={inputBarCode}
                                                        onChange={handleChange}
                                                        onPressEnter={handleEnter}
                                                        //autoFocus={true}
                                                        style={{
                                                            fontSize: '18px',
                                                            fontWeight: 'bold',
                                                            marginTop: '10px',
                                                            border: '2px solid #000',
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <TablePdmmOutQueryDetailSeqItemList

                                    setSelection={setSelectionItem}
                                    selection={selectionItem}
                                    showSearch={showSearchItem}
                                    setShowSearch={setShowSearchItem}
                                    setAddedRows={setAddedRowsItem}
                                    addedRows={addedRowsItem}
                                    setEditedRows={setEditedRowsItem}
                                    editedRows={editedRowsItem}
                                    setNumRowsToAdd={setNumRowsToAddItem}
                                    numRowsToAdd={numRowsToAddItem}
                                    numRows={numRowsItem}
                                    onSelectRow={onSelectRowItem}
                                    openHelp={openHelpItem}
                                    setOpenHelp={setOpenHelpItem}
                                    setOnSelectRow={setOnSelectRowItem}
                                    setIsCellSelected={setIsCellSelectedItem}
                                    isCellSelected={isCellSelectedItem}
                                    setGridData={setGridDataItem}
                                    gridData={gridDataItem}
                                    setNumRows={setNumRowsItem}
                                    setCols={setColsItem}
                                    cols={colsItem}
                                    defaultCols={defaultColsItem}
                                    canCreate={canCreate}
                                    canEdit={canEdit}
                                />
                            </SplitterPanel>
                        </Splitter>
                    </div>
                </div>
            </div>
            {/*     <ErrorListModal
                dataError={dataError}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
                columns={columnsError}
            />
            <ModalSheetDelete
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                confirm={handleDeleteDataSheet}
            />
            <ModalMasterDelete
                modalOpen={modalMasterDeleteOpen}
                setModalOpen={setModalMasterDeleteOpen}
                confirm={handleDeleteDataMaster}
            />

            <WarningModal
                setIsModalVisible={setIsModalWarning}
                handleOnDiscard={handleOnDiscard}
                handleOnConfirm={handleSaveData}
                isModalVisible={isModalWarning}
            />
            <ModalWaiting
                modal2Open={modal2Open}
                setModal2Open={setModal2Open}
                error={error}
            />
            <LoadSubmit setModal4Open={setModal4Open} modal4Open={modal4Open} />
            <SuccessSubmit
                setModal5Open={setModal5Open}
                modal5Open={modal5Open}
                successMessage={successMessage}
            />
            <ModalFocus status={status} setStatus={setStatus} nameFrom={nameFrom} /> */}
        </>
    )
}
