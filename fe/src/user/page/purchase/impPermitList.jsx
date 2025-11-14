import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
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
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import CryptoJS from 'crypto-js'
import ImpPermitListQuery from '../../components/query/purchase/impPermitListQuery'
import ImpPermitListActions from '../../components/actions/purchase/impPermitListActions'
import TableImpPermitList from '../../components/table/purchase/tableImpPermitList'
import { GetSheetQuery } from '../../../features/purchase/impPermitList/getSheetQuery'
import { PostSSLImpPermitStop } from '../../../features/purchase/impPermitList/postSSLImpPermitStop'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import ModalSheetStop from '../../components/modal/default/stopSheet'
import ErrorListModal from '../default/errorListModal'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import Item from 'antd/es/list/Item'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function ImpPermitList({
  permissions,
  isMobile,
  canEdit,
  abortControllerRef,
  controllers,
  cancelAllRequests,
}) {
  const loadingBarRef = useRef(null)
  const { t } = useTranslation()
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
  const gridRef = useRef(null)
  const navigate = useNavigate()

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
        title: t('1326'),
        id: 'IsStop',
        kind: 'Boolean',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('6073'),
        id: 'IsExpended',
        kind: 'Boolean',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('15334'),
        id: 'PermitNo',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('18456'),
        id: 'PermitDate',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('15336'),
        id: 'PermitRefNo',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('7013'),
        id: 'AcceptDate',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('6785'),
        id: 'SMImpKindName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('31720'),
        id: 'CustName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('694'),
        id: 'CustSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2094'),
        id: 'ItemName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('13072'),
        id: 'ItemSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('363'),
        id: 'CurrName',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('1628'),
        id: 'Qty',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('6786'),
        id: 'CurAmt',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('15328'),
        id: 'DomAmt',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('18034'),
        id: 'TaxAmt',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('18037'),
        id: 'TaxDomAmt',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('93'),
        id: 'UMPriceTermsName',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('362'),
        id: 'Remark1',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('732'),
        id: 'DeptName',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('31395'),
        id: 'PermitSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('369'),
        id: 'SMProgressTypeName',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('17777'),
        id: 'SMProgressType',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('6797'),
        id: 'SMImpSortName',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Người dừng lại'),
        id: 'StopEmpName',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Ngày dừng lại'),
        id: 'StopDate',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Lý do dừng lại'),
        id: 'StopReason',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
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
  const [loading, setLoading] = useState(false)
  const [loadingA, setLoadingA] = useState(null)
  const [errorA, setErrorA] = useState(false)
  const [data, setData] = useState([])

  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataStatus, setDataStatus] = useState([])
  const [dataTypeName, setDataTypeName] = useState([])

  const [dataWarehouse, setDataWarehouse] = useState([])
  const [dataDeptName, setDataDeptName] = useState([])
  const [dataUserName, setDataUserName] = useState([])
  const [dataCustName, setDataCustName] = useState([])

  const [fromDate, setFromDate] = useState(dayjs().startOf('month') || '')
  const [toDate, setToDate] = useState(dayjs())

  const [bizUnit, setBizUnit] = useState('0')

  const [typeName, setTypeName] = useState('0')

  const [status, setStatus] = useState('0')

  const [keyPath, setKeyPath] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')

  //Sheet
  const [isOpenDetails, setIsOpenDetails] = useState(false)
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false)
  const [modalStopOpen, setModalStopOpen] = useState(false)

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [keySelectColumn, setKeySelectColumn] = useState(false)

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_IMP_PERMIT_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])
  const [dataError, setDataError] = useState([])
  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('')

  /* CodeHelp */
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [custName, setCustName] = useState('')
  const [custSeq, setCustSeq] = useState('')
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('0')
  const [permitSeq, setPermitSeq] = useState('0')
  const [permitRefNo, setPermitRefNo] = useState('')
  const [reason, setReason] = useState('')
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [permitRefNoTitle, setPermitRefNoTitle] = useState('')
  const [isConfirm, setIsConfirm] = useState('')
  const [isStop, setIsStop] = useState('0')
  const [reqNo, setReqNo] = useState('')
  const [rowIndex, setRowIndex] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)
  const [isQuery, setIsQuery] = useState(false)
  const [selection2, setSelection2] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selection3, setSelection3] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  const resetTable2 = () => {
    setSelection2({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  const resetTable3 = () => {
    setSelection3({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  useEffect(() => {
    cancelAllRequests()
    message.destroy()
    if (parsedUserInfo && parsedUserInfo.UserName) {
      setEmpName(parsedUserInfo.UserName)
      setEmpSeq(parsedUserInfo.EmpSeq)
    }
  }, [])

  useEffect(() => {
    const savedState = localStorage.getItem('detailsStateLGEtcInReqList')
    setIsOpenDetails(savedState === 'open')
  }, [])

  const handleToggle = (event) => {
    const isOpen = event.target.open
    setIsOpenDetails(isOpen)
    localStorage.setItem(
      'detailsStateLGEtcInReqList',
      isOpen ? 'open' : 'closed',
    )
  }

  const fetchSheetQuery = async () => {
    if (isAPISuccess === false) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const data = [
        {
          SMImpKind: typeName,
          BizUnit: bizUnit,
          PermitDateFr: fromDate ? formatDate(fromDate) : '',
          PermitDateTo: toDate ? formatDate(toDate) : '',
          PermitRefNo: permitRefNo,
          CustSeq: custSeq,
          CustName: custName,
          DeptSeq: deptSeq,
          DeptName: deptName,
          EmpSeq: empSeq,
          EmpName: empName,
          SMProgressType: status,
        },
      ]

      const response = await GetSheetQuery(data)
      if (response.data.success) {
        const fetchedData = response.data.data || []
        setData(fetchedData)
        setGridData(fetchedData)
        setIsQuery(true)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setNumRows(fetchedData.length)
        resetTable()
      } else {
        setData([])
        setGridData([])
        setNumRows(0)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } catch (error) {
      setErrorA(true)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      setIsAPISuccess(true)
      //if (loadingBarRef.current) {
      //loadingBarRef.current.complete()
      //}
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
        codeHelpDeptName,
        codeHelpUserName,
        codeHelpCustName,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8008', '1001', '1', ''),
        GetCodeHelpCombo('', 6, 19995, 1, '%', '3329', '', '', ''),
        GetCodeHelp(10010, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(90003, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(17001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])

      setDataBizUnit(codeHelpBizUnit?.data || [])
      setDataTypeName(codeHelpTypeName?.data || [])
      setDataStatus(codeHelpStatus?.data || [])
      setDataDeptName(codeHelpDeptName?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
      setDataCustName(codeHelpCustName?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataTypeName([])
      setDataStatus([])
      setDataDeptName([])
      setDataUserName([])
      setDataCustName([])
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpController = null
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

  const nextPagePermit = useCallback(() => {
    if (keyPath) {
      navigate(`/pur/u/import/imp-permit-add/${keyPath}`)
    }
  }, [keyPath, navigate])

  // const nextPagePermit = useCallback(() => {
  //   if (keyPath) {
  //     window.open(`/pur/u/import/imp-permit-add/${keyPath}`, '_blank')
  //   }
  // }, [keyPath])

  const nextPageExpense = useCallback(() => {
    if (keyPath) {
      navigate(`/pur/u/import/imp-expense/${keyPath}`)
    }
  }, [keyPath, navigate])

  //Sheet

  const getSelectedRows = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          rows.push(gridData[i])
        }
      }
    })

    return rows
  }

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
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
        e.preventDefault()
        fetchSheetQuery()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSheetQuery])

  const onCellClicked = (cell, event) => {
    let rowIndex

    if (cell[0] !== -1) {
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClicked(true)
    } else {
      rowIndex = cell[0]
      setIsMinusClicked(false)
    }

    if (
      lastClickedCell &&
      lastClickedCell[0] === cell[0] &&
      lastClickedCell[1] === cell[1]
    ) {
      setKeyPath(null)
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    if (rowIndex >= 0 && rowIndex < data.length) {
      const rowData = data[rowIndex]
      if (rowData.BizUnitName === 'TOTAL') {
        setKeyPath(null)
        setLastClickedCell(null)
        setClickedRowData(null)
        return
      } else {
        const filteredData = {
          PermitSeq: rowData.PermitSeq,
        }
        const secretKey = 'TEST_ACCESS_KEY'
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(filteredData),
          secretKey,
        ).toString()
        if (isAPISuccess === true) {
          const encryptedToken = encodeBase64Url(encryptedData)
          setKeyPath(encryptedToken)
          setClickedRowData(rowData)
          setLastClickedCell(cell)
        }
      }
    }
  }

  const handleStopDataSheet = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }
    let resulAUD = [
      {
        RowIndex: rowIndex,
        RemarkS: reason,
        PermitSeq: permitSeq,
        IsStop: isStop,
      },
    ]

    if (isSent) return
    setIsSent(true)
    if (resulAUD.length > 0) {
      setIsAPISuccess(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      try {
        const promises = []

        if (resulAUD.length > 0) {
          promises.push(PostSSLImpPermitStop(resulAUD))
        }

        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.data.success) {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            message.success('Xác nhận dừng yêu cầu thành công!')
            setEditedRows([])
            setModalStopOpen(false)
            setReason('')
            fetchSheetQuery()
            resetTable()
          } else {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            setDataError(result.data.errors)
            setModalStopOpen(false)
            setIsModalVisible(true)
            setReason('')
            message.error('Có lỗi xảy ra khi xác nhận dừng yêu cầu')
          }
        })
      } catch (error) {
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setModalStopOpen(false)
        setReason('')
        message.error(
          error.message || 'Có lỗi xảy ra khi xác nhận dừng yêu cầu',
        )
      }
    } else {
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      setModalStopOpen(false)
      setReason('')
      message.warning('Không có dữ liệu để xác nhận dừng yêu cầu!')
    }
  }, [rowIndex, reason, permitSeq, isStop, isAPISuccess])
  return (
    <>
      <Helmet>
        <title>HPM - {t('Truy vấn tờ khai nhập khẩu')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div
        className={`bg-slate-50 p-3 h-screen overflow-hidden relative app-content  `}
      >
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Truy vấn tờ khai nhập khẩu')}
              </Title>
              <ImpPermitListActions
                nextPagePermit={nextPagePermit}
                nextPageExpense={nextPageExpense}
                debouncedFetchSSLImpPermitListQueryWEB={fetchSheetQuery}
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
                <ImpPermitListQuery
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
                  status={status}
                  dataStatus={dataStatus}
                  setStatus={setStatus}
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
                  permitRefNo={permitRefNo}
                  setPermitRefNo={setPermitRefNo}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TableImpPermitList
                data={data}
                onCellClicked={onCellClicked}
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
                canEdit={canEdit}
                setModalStopOpen={setModalStopOpen}
                setPermitSeq={setPermitSeq}
                setPermitRefNo={setPermitRefNo}
                setIsStop={setIsStop}
                setRowIndex={setRowIndex}
                setPermitRefNoTitle={setPermitRefNoTitle}
                setIsQuery={setIsQuery}
                isQuery={isQuery}
              />
            }
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        columns={columnsError}
      />
      <ModalSheetStop
        modalOpen={modalStopOpen}
        setModalOpen={setModalStopOpen}
        confirm={handleStopDataSheet}
        reason={reason}
        setReason={setReason}
        reqNoTitle={permitRefNoTitle}
      />
    </>
  )
}
