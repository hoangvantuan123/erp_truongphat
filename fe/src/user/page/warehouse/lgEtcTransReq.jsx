import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Typography, Row, Col, message, Form } from 'antd'
const { Title, Text } = Typography
import {
  FilterOutlined,
  LoadingOutlined,
  BlockOutlined,
} from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { filterAndSelectColumnsAUD } from '../../../utils/filterAUD'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateColumns } from '../../../utils/validateColumns'
import { formatNumberCellSum } from '../../../utils/formatNumberCellSum'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import ModalMasterDelete from '../../components/modal/default/deleteMaster'
import WarningModal from '../default/warningModal'

import LGEtcTransReqActions from '../../components/actions/warehouse/lgEtcTransReqActions'
import LGEtcTransReqQuery from '../../components/query/warehouse/lgEtcTransReqQuery'
import TableLGEtcTransReq from '../../components/table/warehouse/tableLGEtcTransReq'

import { PostInventoryCheck } from '../../../features/warehouse/lgEtcTransReq/postInventoryCheck'
import { PostAUD } from '../../../features/warehouse/lgEtcTransReq/postAUD'
import { PostMasterDelete } from '../../../features/warehouse/lgEtcTransReq/postMasterDelete'
import { PostSheetDelete } from '../../../features/warehouse/lgEtcTransReq/postSheetDelete'

import ErrorListModal from '../default/errorListModal'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function LGEtcTransReq({
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
  const gridRef = useRef(null)
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
  const loadingBarRef = useRef(null)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

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
        title: t('7517'),
        id: 'ReqSerl',
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
        title: t('3202'),
        id: 'InOutReqKind',
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
        title: t('2090'),
        id: 'ItemName',
        kind: 'Text',
        readonly: false,
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
        width: 120,
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
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('868'),
        id: 'UnitSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: t('2359'),
        id: 'Price',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('7516'),
        id: 'Qty',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalQuantity),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },

      {
        title: t('290'),
        id: 'Amt',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalAmount),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },

      {
        title: t('1868'),
        id: 'InOutReqDetailKindName',
        kind: 'Text',
        readonly: false,
        width: 120,
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
        title: t('12557'),
        id: 'InOutReqDetailKind',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Trạng thái tồn kho'),
        id: 'InventoryRemark',
        kind: 'Text',
        readonly: true,
        width: 450,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Seq'),
        id: 'InventorySeq',
        kind: 'Text',
        readonly: true,
        width: 80,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('InWHSeq'),
        id: 'InWHSeq',
        kind: 'Text',
        readonly: true,
        width: 80,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('OutWHSeq'),
        id: 'OutWHSeq',
        kind: 'Text',
        readonly: true,
        width: 80,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: false,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('ReqSeq'),
        id: 'ReqSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
    ],
    [t, totalAmount, totalQuantity],
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

  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataBizUnitTrans, setDataBizUnitTrans] = useState([])
  const [dataTypeName, setDataTypeName] = useState([])
  const [dataStockType, setDataStockType] = useState([])
  const [dataItemName, setDataItemName] = useState([])
  const [dataWarehouseIn, setDataWarehouseIn] = useState([])
  const [dataWarehouseOut, setDataWarehouseOut] = useState([])
  const [dataDeptName, setDataDeptName] = useState([])
  const [dataUserName, setDataUserName] = useState([])
  const [dataCustName, setDataCustName] = useState([])

  const [fromDate, setFromDate] = useState(dayjs())
  const formatDate = (date) => date.format('YYYYMMDD')
  const [expDate, setExpDate] = useState(dayjs())
  const [isOpenDetails, setIsOpenDetails] = useState(false)
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMasterDeleteOpen, setModalMasterDeleteOpen] = useState(false)

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])
  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [isCell, setIsCell] = useState(null)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [keySelectColumn, setKeySelectColumn] = useState(false)
  const [dataCommissionCust, setDataCommissionCust] = useState([])
  const [dataError, setDataError] = useState([])

  const [isDeleting, setIsDeleting] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const calculateTotalQuantity = () => {
    const total = gridData.reduce((sum, item) => sum + (item.Qty || 0), 0)
    setTotalQuantity(total)
  }
  const calculateTotalAmount = () => {
    const total = gridData.reduce((sum, item) => sum + (item.Amt || 0), 0)
    setTotalAmount(total)
  }
  useEffect(() => {
    calculateTotalQuantity()
    calculateTotalAmount()
  }, [gridData])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_ETC_TRANS_REQ',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])

  /* CodeHelp */
  const [bizUnit, setBizUnit] = useState('0')
  const [bizUnitName, setBizUnitName] = useState('')
  const [bizUnitTrans, setBizUnitTrans] = useState('0')
  const [bizUnitNameTrans, setBizUnitNameTrans] = useState('')
  const [typeName, setTypeName] = useState('0')
  const [stockType, setStockType] = useState('')
  const [status, setStatus] = useState('')
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('0')
  const [custName, setCustName] = useState('')
  const [custSeq, setCustSeq] = useState('')
  const [reqSeq, setReqSeq] = useState('0')
  const [etcReqNo, setEtcReqNo] = useState('')
  const [remark, setRemark] = useState('')
  const [isConfirm, setIsConfirm] = useState('')
  const [isStop, setIsStop] = useState('0')
  const [whNameIn, setWHNameIn] = useState('')
  const [whSeqIn, setWHSeqIn] = useState('')
  const [whNameOut, setWHNameOut] = useState('')
  const [whSeqOut, setWHSeqOut] = useState('')

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)

  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const [clickCellName, setClickCellName] = useState([])
  const [onConfirm, setOnConfirm] = useState(false)
  const [onDiscard, setOnDiscard] = useState(false)

  const fieldsToTrack = ['ItemName']
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

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

  useEffect(() => {
    if (!gridData || !gridData.some((item) => item.Status === 'A')) {
      const emptyData = generateEmptyData(100, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridData(updatedEmptyData)
      setNumRows(emptyData.length)
      return
    }
  }, [])

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
        codeHelpStockType,
        codeHelpItemName,
        codeHelpWarehouse,
        codeHelpDeptName,
        codeHelpUserName,
        codeHelpCustName,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '1028534', '', '', ''),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '8012', '', '', ''),
        GetCodeHelp(18001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
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
      setDataBizUnitTrans(codeHelpBizUnit?.data || [])
      setDataTypeName(codeHelpTypeName?.data || [])
      setDataStockType(codeHelpStockType?.data || [])
      setDataItemName(codeHelpItemName?.data || [])
      setDataWarehouseIn(codeHelpWarehouse?.data || [])
      setDataWarehouseOut(codeHelpWarehouse?.data || [])
      setDataDeptName(codeHelpDeptName?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
      setDataCustName(codeHelpCustName?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataBizUnitTrans([])
      setDataTypeName([])
      setDataItemName([])
      setDataStockType([])
      setDataWarehouseIn([])
      setDataWarehouseOut([])
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

  //Sheet
  const getSelectedRows = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          gridData[i]['IdxNo'] = i + 1
          rows.push(gridData[i])
        }
      }
    })

    return rows
  }

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
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
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  /* HOOKS KEY */
  useKeydownHandler(isCellSelected, setOpenHelp)

  const onCellClicked = (cell, event) => {
    if (cell.length >= 2 && cell[0] === 1) {
      setIsCellSelected(true)
    } else {
      setIsCellSelected(false)
      setIsMinusClicked(false)
      setLastClickedCell(null)
      setClickedRowData(null)
    }

    if (
      lastClickedCell &&
      lastClickedCell[0] === cell[0] &&
      lastClickedCell[1] === cell[1]
    ) {
      setIsCellSelected(false)
      setIsMinusClicked(false)
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

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

    if (rowIndex >= 0 && rowIndex < gridData.length) {
      const rowData = gridData[rowIndex]
      setClickedRowData(rowData)
      setLastClickedCell(cell)
    }
  }
  const handleOnDiscard = () => {
    setIsModalWarning(false)
    setEditedRows([])
    setGridData([])
    setClickedRowData(null)
    setOnDiscard(true)
    resetTable()
  }

  const handleInventoryCheckData = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }

    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }

    if (whSeqIn === '0' || whSeqIn === '') {
      message.warning('"Kho nhập kho" không được để trống hoặc null!')
      return
    }

    if (whSeqOut === '0' || whSeqOut === '') {
      message.warning('"Kho xuất kho" không được để trống hoặc null!')
      return
    }

    if (whSeqOut === whSeqIn) {
      message.warning('"Kho xuất kho" không được giống với "Kho nhập kho"!')
      return
    }

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)
    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }
    const missingIds = findMissingIds(lastEntry)
    setEmptyWordIds(missingIds)

    const dataSheetAUD = gridData
      .filter(
        (row) =>
          (row.ItemName !== '' && row.ItemName !== null) ||
          (row.Qty !== '' && row.Qty !== null) ||
          (row.InOutReqDetailKind !== '' && row.InOutReqDetailKind !== null),
      )
      .map((row) => ({
        ...row,
        InWHSeq: whSeqIn,
        OutWHSeq: whSeqOut,
      }))

    if (missingIds.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }
    if (!validateColumns(dataSheetAUD, ['ItemName'])) {
      message.warning('Cột "Tên sản phẩm" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(dataSheetAUD, ['Qty'])) {
      message.warning('Cột "Số lượng yêu cầu" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(dataSheetAUD, ['InOutReqDetailKind'])) {
      message.warning(
        'Cột "Phân loại di chuyển kho sản phẩm" không được để trống hoặc null!',
      )
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }

    const resSuccess = await PostInventoryCheck(dataSheetAUD)
    if (resSuccess.data.success) {
      const dataResSuccess = resSuccess.data.data
      const updatedGridData = gridData.map((item) => {
        const matchedItem = dataResSuccess.find(
          (data) => data.ItemSeq === item.ItemSeq,
        )
        if (matchedItem) {
          return {
            ...item,
            InventorySeq: matchedItem.InventorySeq,
            InventoryRemark: matchedItem.InventoryRemark,
            InWHSeq: matchedItem.InWHSeq,
            OutWHSeq: matchedItem.OutWHSeq,
          }
        }
        return item
      })
      setGridData(updatedGridData)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.success('Kiểm tra trạng thái tồn kho thành công')
      }
    }
  }, [gridData, whSeqIn, whSeqOut, isAPISuccess])

  const handleSaveData = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }

    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }

    if (fromDate === '' || fromDate === null) {
      message.warning('"Ngày yêu cầu" không được để trống hoặc null!')
      return
    }
    if (bizUnit === '0' || bizUnit === '') {
      message.warning(
        '"Đơn vị kinh doanh (Kho nhập)" không được để trống hoặc null!',
      )
      return
    }

    if (bizUnitTrans === '0' || bizUnitTrans === '') {
      message.warning(
        '"Đơn vị kinh doanh (Kho xuất)" không được để trống hoặc null!',
      )
      return
    }

    if (typeName === '0' || typeName === '') {
      message.warning('"Phân loại sản phẩm" không được để trống hoặc null!')
      return
    }

    if (whSeqIn === '0' || whSeqIn === '') {
      message.warning('"Kho nhập kho" không được để trống hoặc null!')
      return
    }

    if (whSeqOut === '0' || whSeqOut === '') {
      message.warning('"Kho xuất kho" không được để trống hoặc null!')
      return
    }

    if (whSeqOut === whSeqIn) {
      message.warning('"Kho xuất kho" không được giống với "Kho nhập kho"!')
      return
    }

    const dataMaster = [
      {
        ReqSeq: reqSeq,
        ReqNo: etcReqNo,
        InOutReqType: typeName,
        InOutReqDetailType: '0',
        IsStop: isStop,
        ReqDate: fromDate ? formatDate(fromDate) : '',
        CompleteWishDate: expDate ? formatDate(expDate) : '',
        BizUnit: bizUnit,
        BizUnitName: bizUnitName,
        TransBizUnit: bizUnitTrans,
        TransBizUnitName: bizUnitNameTrans,
        DeptSeq: deptSeq,
        DeptName: deptName,
        InWHSeq: whSeqIn,
        InWHName: whNameIn,
        OutWHSeq: whSeqOut,
        OutWHName: whNameOut,
        CustSeq: custSeq,
        CustName: custName,
        EmpSeq: empSeq,
        EmpName: empName,
        Remark: remark,
      },
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)
    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }
    const missingIds = findMissingIds(lastEntry)
    setEmptyWordIds(missingIds)

    const dataSheetAUD = gridData
      .filter(
        (row) =>
          (row.ItemName !== '' && row.ItemName !== null) ||
          (row.Qty !== '' && row.Qty !== null) ||
          (row.InOutReqDetailKind !== '' && row.InOutReqDetailKind !== null),
      )
      .map((row) => ({
        ...row,
        InWHSeq: whSeqIn,
        OutWHSeq: whSeqOut,
      }))

    if (missingIds.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }

    if (dataSheetAUD.length === 0) {
      message.warning('Bạn chưa nhập thông tin SHEET!')
      return
    }

    if (!validateColumns(dataSheetAUD, ['InventoryRemark'])) {
      message.warning('Bạn chưa kiểm tra trạng thái tồn kho trước khi lưu!')
      return
    }

    if (!validateColumns(dataSheetAUD, ['ItemName'])) {
      message.warning('Cột "Tên sản phẩm" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(dataSheetAUD, ['Qty'])) {
      message.warning('Cột "Số lượng yêu cầu" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(dataSheetAUD, ['InOutReqDetailKind'])) {
      message.warning(
        'Cột "Phân loại di chuyển kho sản phẩm" không được để trống hoặc null!',
      )
      return
    }
    if (whSeqOut !== dataSheetAUD[0]?.OutWHSeq) {
      message.warning(
        'Kho xuất kho đã bị thay đổi, hãy ấn nút kiểm tra trạng thái tồn kho lại!',
      )
      return
    }
    togglePageInteraction(true)
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const promises = []
      promises.push(PostAUD(dataMaster, dataSheetAUD))
      const results = await Promise.all(promises)
      const updateGridData = (newData) => {
        setGridData((prevGridData) => {
          const updatedGridData = prevGridData.map((item) => {
            const matchingData = newData.find(
              (data) => data.IDX_NO === item.IdxNo,
            )

            if (matchingData) {
              return matchingData
            }
            return item
          })

          return updatedGridData
        })
      }
      results.forEach((result, index) => {
        if (result.data.success) {
          const newData = result.data.data
          togglePageInteraction(false)
          setIsAPISuccess(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.success('Lưu dữ liệu thành công!')
          }
          setIsSent(false)
          setReqSeq(result.data.data[0].ReqSeq)
          setEditedRows([])
          updateGridData(newData)
          resetTable()
        } else {
          setDataError(result.data.errors)
          setIsModalVisible(true)
          togglePageInteraction(false)
          setIsAPISuccess(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.error('Có lỗi xảy ra khi lưu dữ liệu')
          }
        }
      })
    } catch (error) {
      togglePageInteraction(false)
      setIsAPISuccess(true)
      setIsSent(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
    }
  }, [
    gridData,
    reqSeq,
    etcReqNo,
    typeName,
    isStop,
    fromDate,
    expDate,
    bizUnit,
    bizUnitName,
    bizUnitTrans,
    bizUnitNameTrans,
    deptSeq,
    deptName,
    whSeqIn,
    whNameIn,
    whSeqOut,
    whNameOut,
    custSeq,
    custName,
    empSeq,
    empName,
    remark,
    isAPISuccess,
  ])

  const handleDeleteDataSheet = useCallback(
    (e) => {
      if (isAPISuccess === false) {
        message.warning(
          'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
        )
        return
      }

      if (canDelete === false) {
        message.warning('Bạn không có quyền xóa dữ liệu')
        return
      }
      if (isDeleting) {
        message.warning('Đang xử lý, vui lòng chờ...')
        return
      }

      const selectedRows = getSelectedRows()
      const idsWithStatusD = selectedRows
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => {
          row.Status = 'D'
          return row
        })

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
      if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
        message.warning('Vui lòng chọn các mục cần xóa!')
        setModalOpen(false)
        return
      }

      if (idsWithStatusD.length > 0) {
        setIsDeleting(true)
        togglePageInteraction(true)
        setIsAPISuccess(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.continuousStart()
        }
        PostSheetDelete(idsWithStatusD)
          .then((response) => {
            message.destroy()
            if (response.data.success) {
              const idsWithStatusDList = idsWithStatusD.map((row) => row.IdxNo)
              const remainingRows = gridData.filter(
                (row) => !idsWithStatusDList.includes(row.IdxNo),
              )
              const updatedEmptyData = updateIndexNo(remainingRows)
              setGridData(updatedEmptyData)
              setNumRows(remainingRows.length)
              resetTable()
              setModalOpen(false)
              togglePageInteraction(false)
              setIsAPISuccess(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.success('Xóa thành công!')
              }
            } else {
              setModalOpen(false)
              setDataError(response.data.errors)
              setIsModalVisible(true)
              togglePageInteraction(false)
              setIsAPISuccess(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.error(response.data.message || 'Xóa thất bại!')
              }
            }
          })
          .catch((error) => {
            togglePageInteraction(false)
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi xóa!')
            }
          })
          .finally(() => {
            setIsDeleting(false)
            togglePageInteraction(false)
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        const remainingEditedRows = editedRows.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow?.Id),
        )
        setModalOpen(false)
        message.success('Xóa thành công!')
        setEditedRows(remainingEditedRows)
        setGridData(remainingRows)
        setNumRows(remainingRows.length)
        resetTable()
      }
    },
    [canDelete, gridData, selection, editedRows, isDeleting, isAPISuccess],
  )

  const handleDeleteDataMaster = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }

    if (canDelete === false) {
      message.warning('Bạn không có quyền xóa dữ liệu')
      return
    }
    if (isDeleting) {
      message.warning('Đang xử lý, vui lòng chờ...')
      return
    }
    const dataMaster = [
      {
        Status: 'D',
        ReqSeq: reqSeq,
        ReqDate: fromDate,
      },
    ]

    if (reqSeq === '0' || reqSeq === '') {
      resetTable()
      setModalMasterDeleteOpen(false)
      message.warning('Không có dữ liệu để xóa!')
    } else {
      setIsDeleting(true)
      togglePageInteraction(true)
      setIsAPISuccess(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      PostMasterDelete(dataMaster)
        .then((response) => {
          if (response.data.success) {
            handleResetData()
            resetTable()
            setModalMasterDeleteOpen(false)
            togglePageInteraction(false)
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.success('Xóa thành công!')
            }
          } else {
            setModalMasterDeleteOpen(false)
            setDataError(response.data.errors)
            setIsModalVisible(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error(response.data.message || 'Xóa thất bại!')
            }
            togglePageInteraction(false)
            setIsAPISuccess(true)
          }
        })
        .catch((error) => {
          togglePageInteraction(false)
          setIsAPISuccess(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.error('Có lỗi xảy ra khi xóa!')
          }
        })
        .finally(() => {
          setIsDeleting(false)
          togglePageInteraction(false)
          setIsAPISuccess(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
          }
        })
    }
  }, [canDelete, isDeleting, reqSeq, fromDate, isAPISuccess])

  const handleRestSheet = useCallback(async () => {
    const emptyData = generateEmptyData(100, defaultCols)
    setGridData(emptyData)
    setNumRows(emptyData.length)
  }, [defaultCols, gridData])

  const initialValues = {
    BizUnit: '0',
    BizUnitName: '',
    BizUnitTrans: '0',
    BizUnitNameTrans: '',
    FromDate: dayjs(),
    ExpDate: dayjs(),
    EtcReqNo: '',
    DeptName: '',
    DeptSeq: '0',
    InWHName: '',
    InWHSeq: '0',
    OutWHName: '',
    OutWHSeq: '0',
    ReqSeq: '0',
    CustName: '',
    CustSeq: '0',
    EmpName: '',
    EmpSeq: '0',
    Remark: '',
  }

  const handleResetData = useCallback(async () => {
    setIsReset(true)
    setBizUnit(initialValues.BizUnit)
    setBizUnitName(initialValues.BizUnitName)
    setBizUnitTrans(initialValues.BizUnitTrans)
    setBizUnitNameTrans(initialValues.BizUnitNameTrans)
    setFromDate(initialValues.FromDate)
    setExpDate(initialValues.ExpDate)
    setEtcReqNo(initialValues.EtcReqNo)
    setDeptName(initialValues.DeptName)
    setDeptSeq(initialValues.DeptSeq)
    setWHNameIn(initialValues.InWHName)
    setWHSeqIn(initialValues.InWHSeq)
    setWHNameOut(initialValues.OutWHName)
    setWHSeqOut(initialValues.OutWHSeq)
    setReqSeq(initialValues.ReqSeq)
    setCustName(initialValues.CustName)
    setCustSeq(initialValues.CustSeq)
    setEmpName(initialValues.EmpName)
    setEmpSeq(initialValues.EmpSeq)
    setRemark(initialValues.Remark)
    const emptyData = generateEmptyData(100, defaultCols)
    setGridData(emptyData)
    setNumRows(emptyData.length)
    resetTable()
  }, [defaultCols, gridData])

  return (
    <>
      <Helmet>
        <title>HPM - {t('Đăng ký yêu cầu di chuyển kho sản phẩm')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Đăng ký yêu cầu di chuyển kho sản phẩm')}
              </Title>
              <LGEtcTransReqActions
                setModalOpen={setModalOpen}
                setModalMasterDeleteOpen={setModalMasterDeleteOpen}
                handleResetData={handleResetData}
                handleSaveData={handleSaveData}
                handleInventoryCheckData={handleInventoryCheckData}
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
                <LGEtcTransReqQuery
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  expDate={expDate}
                  setExpDate={setExpDate}
                  bizUnit={bizUnit}
                  dataBizUnit={dataBizUnit}
                  setBizUnit={setBizUnit}
                  setBizUnitName={setBizUnitName}
                  bizUnitTrans={bizUnitTrans}
                  dataBizUnitTrans={dataBizUnitTrans}
                  setBizUnitTrans={setBizUnitTrans}
                  setBizUnitNameTrans={setBizUnitNameTrans}
                  typeName={typeName}
                  dataTypeName={dataTypeName}
                  setTypeName={setTypeName}
                  whNameIn={whNameIn}
                  setWHNameIn={setWHNameIn}
                  setWHSeqIn={setWHSeqIn}
                  dataWarehouseIn={dataWarehouseIn}
                  whNameOut={whNameOut}
                  setWHNameOut={setWHNameOut}
                  setWHSeqOut={setWHSeqOut}
                  dataWarehouseOut={dataWarehouseOut}
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
                  remark={remark}
                  setRemark={setRemark}
                  isReset={isReset}
                  setIsReset={setIsReset}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableLGEtcTransReq
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
              canCreate={canCreate}
              handleRestSheet={handleRestSheet}
              canEdit={canEdit}
              dataItemName={dataItemName}
              dataStockType={dataStockType}
            />
          </div>
        </div>
      </div>
      <ErrorListModal
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
    </>
  )
}
