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
import LGEtcOutReqListQuery from '../../components/query/warehouse/lgEtcOutReqListQuery'
import LGEtcOutReqListActions from '../../components/actions/warehouse/lgEtcOutReqListActions'
import TableLGEtcOutReqList from '../../components/table/warehouse/tableLGEtcOutReqList'
import { GetSLGInOutReqListQuery } from '../../../features/warehouse/lgEtcOutReq/postSLGInOutReqListQuery'
import { PostSLGInOutReqListConfirm } from '../../../features/warehouse/lgEtcOutReq/postSLGInOutReqListConfirm'
import { PostSLGInOutReqListStop } from '../../../features/warehouse/lgEtcOutReq/postSLGInOutReqListStop'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import ModalSheetConfirm from '../../components/modal/default/confirmSheet'
import ModalSheetStop from '../../components/modal/default/stopSheet'
import ErrorListModal from '../default/errorListModal'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import Item from 'antd/es/list/Item'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function LGEtcOutReqList({
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
        title: t('607'),
        id: 'Confirm',
        kind: 'Boolean',
        readonly: false,
        width: 80,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('1326'),
        id: 'IsStop',
        kind: 'Boolean',
        readonly: false,
        width: 80,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('2'),
        id: 'BizUnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('647'),
        id: 'ReqNo',
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
        title: t('419'),
        id: 'CompleteWishDate',
        kind: 'Text',
        readonly: true,
        width: 100,
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
        title: t('6'),
        id: 'CustName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,

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
        title: t('369'),
        id: 'SMProgressTypeName',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,

        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('9425'),
        id: 'LastUserName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('9423'),
        id: 'LastDateTime',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('8072'),
        id: 'ReqSeq',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('16110'),
        id: 'InOutReqType',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('3151'),
        id: 'BizUnit',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('782'),
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
        id: 'CfmDate',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('Mã người xác nhận'),
        id: 'CfmEmpId',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Tên người xác nhận'),
        id: 'CfmEmpName',
        kind: 'Text',
        readonly: true,
        width: 180,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Lý do xác nhận'),
        id: 'CfmReason',
        kind: 'Text',
        readonly: true,
        width: 200,
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
  const [isQuery, setIsQuery] = useState(false)
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
      'S_ERP_COLS_PAGE_ETC_OUT_REQ_LIST',
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
  const [reqSeq, setReqSeq] = useState('')
  const [etcReqNo, setEtcReqNo] = useState('')
  const [reason, setReason] = useState('')
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [reqNoTitle, setReqNoTitle] = useState('')
  const [isConfirm, setIsConfirm] = useState('')
  const [isStop, setIsStop] = useState('0')
  const [reqNo, setReqNo] = useState('')
  const [rowIndex, setRowIndex] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)

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
  }, [])

  useEffect(() => {
    if (parsedUserInfo && parsedUserInfo.UserName) {
      setEmpName(parsedUserInfo.UserName)
      setEmpSeq(parsedUserInfo.EmpSeq)
    }
  }, [])

  useEffect(() => {
    const savedState = localStorage.getItem('detailsStateLGEtcOutReqList')
    setIsOpenDetails(savedState === 'open')
  }, [])

  const handleToggle = (event) => {
    const isOpen = event.target.open
    setIsOpenDetails(isOpen)
    localStorage.setItem(
      'detailsStateLGEtcOutReqList',
      isOpen ? 'open' : 'closed',
    )
  }

  const fetchSLGInOutReqListQueryWEB = async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const data = [
        {
          IsChangedMst: '0',
          InOutReqType: typeName,
          BizUnit: bizUnit,
          BizUnitName: '',
          ReqDateFr: fromDate ? formatDate(fromDate) : '',
          ReqDateTo: toDate ? formatDate(toDate) : '',
          OutWHSeq: whSeq,
          OutWHName: whName,
          ReqNo: etcReqNo,
          CustSeq: custSeq,
          CustName: custName,
          DeptSeq: deptSeq,
          DeptName: deptName,
          EmpSeq: empSeq,
          EmpName: empName,
          SMProgressType: status,
        },
      ]

      const response = await GetSLGInOutReqListQuery(data)
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
          message.error('Có lỗi xảy ra khi tải dữ liệu.')
        }
      }
    } catch (error) {
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
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
        codeHelpWarehouse,
        codeHelpDeptName,
        codeHelpUserName,
        codeHelpCustName,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '1028534', '', '', ''),
        GetCodeHelpCombo('', 6, 19995, 1, '%', '3329', '', '', ''),
        GetCodeHelp(
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
        GetCodeHelp(10010, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(90003, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(17001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])

      setDataBizUnit(codeHelpBizUnit?.data || [])
      setDataTypeName(codeHelpTypeName?.data || [])
      setDataStatus(codeHelpStatus?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataDeptName(codeHelpDeptName?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
      setDataCustName(codeHelpCustName?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataTypeName([])
      setDataStatus([])
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

  // const nextPage = useCallback(() => {
  //   if (keyPath) {
  //     navigate(`/wms/u/warehouse/etc-out/lg-etc-out-req/${keyPath}`)
  //   }
  // }, [keyPath, navigate])

  const nextPage = useCallback(() => {
    if (keyPath) {
      window.open(
        `/wms/u/warehouse/etc-out/lg-etc-out-req/${keyPath}`,
        '_blank',
      )
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
      if (data[0].ReqSeq !== '') {
        const filteredData = {
          ReqSeq: data[0].ReqSeq,
        }
        const secretKey = 'TEST_ACCESS_KEY'
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(filteredData),
          secretKey,
        ).toString()
        const encryptedToken = encodeBase64Url(encryptedData)
        setKeyPath(encryptedToken)
      } else {
        setKeyPath(null)
      }
    } else {
      setKeyPath(null)
    }
  }, [selection.rows.items, gridData])

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
        fetchSLGInOutReqListQueryWEB()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSLGInOutReqListQueryWEB])

  const handleConfirmDataSheet = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }
    let resulAUD = [
      {
        RowIndex: rowIndex,
        Reason: reason,
        ReqSeq: reqSeq,
        ReqNo: reqNo,
        IsConfirm: isConfirm,
      },
    ]

    if (isSent) return
    setIsSent(true)
    if (resulAUD.length > 0 || resulAUD.length > 0) {
      setIsAPISuccess(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      try {
        const promises = []

        if (resulAUD.length > 0) {
          promises.push(PostSLGInOutReqListConfirm(resulAUD))
        }

        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.data.success) {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.success('Xác nhận yêu cầu thành công!')
            }
            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            setModalConfirmOpen(false)
            fetchSLGInOutReqListQueryWEB()
            setReason('')
            resetTable()
          } else {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi xác nhận yêu cầu')
            }
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setModalConfirmOpen(false)
            setIsModalVisible(true)
            setReason('')
          }
        })
      } catch (error) {
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error(error.message || 'Có lỗi xảy ra khi xác nhận yêu cầu')
        }
        setIsLoading(false)
        setIsSent(false)
        setModalConfirmOpen(false)
        setReason('')
      }
    } else {
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.warning('Không có dữ liệu để xác nhận!')
      }
      setIsSent(false)
      setModalConfirmOpen(false)
      setReason('')
    }
  }, [rowIndex, reason, reqSeq, reason, isConfirm, isAPISuccess])

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
        Reason: reason,
        ReqSeq: reqSeq,
        ReqNo: reqNo,
        IsStop: isStop,
      },
    ]

    if (isSent) return
    setIsSent(true)
    if (resulAUD.length > 0 || resulAUD.length > 0) {
      setIsAPISuccess(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      try {
        const promises = []

        if (resulAUD.length > 0) {
          promises.push(PostSLGInOutReqListStop(resulAUD))
        }

        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.data.success) {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.success('Xác nhận dừng yêu cầu thành công!')
            }
            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            setModalStopOpen(false)
            setReason('')
            fetchSLGInOutReqListQueryWEB()
            resetTable()
          } else {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi xác nhận dừng yêu cầu')
            }
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setModalStopOpen(false)
            setIsModalVisible(true)
            setReason('')
          }
        })
      } catch (error) {
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error(
            error.message || 'Có lỗi xảy ra khi xác nhận dừng yêu cầu',
          )
        }
        setIsLoading(false)
        setIsSent(false)
        setModalStopOpen(false)
        setReason('')
      }
    } else {
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.warning('Không có dữ liệu để xác nhận dừng yêu cầu!')
      }
      setModalStopOpen(false)
      setReason('')
    }
  }, [rowIndex, reason, reqSeq, reason, isStop, isAPISuccess])
  return (
    <>
      <Helmet>
        <title>HPM - {t('Truy vấn yêu cầu xuất kho khác')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Truy vấn yêu cầu xuất kho khác')}
              </Title>
              <LGEtcOutReqListActions
                nextPage={nextPage}
                debouncedFetchSLGInOutReqListQueryWEB={
                  fetchSLGInOutReqListQueryWEB
                }
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
                <LGEtcOutReqListQuery
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
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TableLGEtcOutReqList
                data={data}
                //onCellClicked={onCellClicked}
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
                setModalConfirmOpen={setModalConfirmOpen}
                setModalStopOpen={setModalStopOpen}
                setReqSeq={setReqSeq}
                setReqNo={setReqNo}
                setIsConfirm={setIsConfirm}
                setIsStop={setIsStop}
                setRowIndex={setRowIndex}
                setReqNoTitle={setReqNoTitle}
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
      <ModalSheetConfirm
        modalOpen={modalConfirmOpen}
        setModalOpen={setModalConfirmOpen}
        confirm={handleConfirmDataSheet}
        reason={reason}
        setReason={setReason}
        reqNoTitle={reqNoTitle}
      />
      <ModalSheetStop
        modalOpen={modalStopOpen}
        setModalOpen={setModalStopOpen}
        confirm={handleStopDataSheet}
        reason={reason}
        setReason={setReason}
        reqNoTitle={reqNoTitle}
      />
    </>
  )
}
