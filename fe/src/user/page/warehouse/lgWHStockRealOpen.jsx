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
import { filterAndSelectColumnsAUD } from '../../../utils/filterSheetAUD'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateColumns } from '../../../utils/validateColumns'
import { formatNumberCellSum } from '../../../utils/formatNumberCellSum'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import ModalMasterDelete from '../../components/modal/default/deleteMaster'
import WarningModal from '../default/warningModal'

import LGWHStockRealOpenActions from '../../components/actions/warehouse/lgWHStockRealOpenActions'
import LGWHStockRealOpenQuery from '../../components/query/warehouse/lgWHStockRealOpenQuery'
import LGWHStockRealOpenAddQuery from '../../components/query/warehouse/lgWHStockRealOpenAddQuery'
import TableLGWHStockRealOpen from '../../components/table/warehouse/tableLGWHStockRealOpen'

import { PostInventoryCheck } from '../../../features/warehouse/lgWHStockRealOpen/postInventoryCheck'
import { PostAUD } from '../../../features/warehouse/lgWHStockRealOpen/postAUD'
import { PostMasterDelete } from '../../../features/warehouse/lgWHStockRealOpen/postMasterDelete'

import ErrorListModal from '../default/errorListModal'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function LGWHStockRealOpen({
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
  const [totalQuantity, setTotalQuantity] = useState(0)
  const loadingBarRef = useRef(null)
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
        title: t('WHSeq'),
        id: 'WHSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('StkMngSeq'),
        id: 'StkMngSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('StkMngSerl'),
        id: 'StkMngSerl',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('BizUnit'),
        id: 'BizUnit',
        kind: 'Text',
        readonly: true,
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
        readonly: true,
        width: 180,
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
        title: t('Lot No'),
        id: 'LotNo',
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
        title: t('3259'),
        id: 'AssetName',
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
        title: t('Số lượng tồn kho'),
        id: 'Qty',
        kind: 'Text',
        readonly: true,
        width: 150,
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
        title: t('Vị trí trong kho'),
        id: 'Location',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
    ],
    [t, totalQuantity],
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
  const [dataItemTypeName, setDataItemTypeName] = useState([])
  const [dataWarehouse, setDataWarehouse] = useState([])
  const [dataUserName, setDataUserName] = useState([])

  const [fromDate, setFromDate] = useState(dayjs())
  const formatDate = (date) => date.format('YYYYMMDD')

  const [gridData, setGridData] = useState([])
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

  useEffect(() => {
    calculateTotalQuantity()
  }, [gridData])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_STOCK_REAL_OPEN',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])

  /* CodeHelp */
  const [bizUnit, setBizUnit] = useState('0')
  const [bizUnitName, setBizUnitName] = useState('')
  const [typeName, setTypeName] = useState('0')
  const [itemTypeName, setItemTypeName] = useState('0')
  const [itemName, setItemName] = useState('')
  const [itemNo, setItemNo] = useState('')
  const [location, setLocation] = useState('')
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [stkMngSeq, setStkMngSeq] = useState('0')
  const [stkMngNo, setStkMngNo] = useState('')
  const [remark, setRemark] = useState('')

  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('')

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
    if (parsedUserInfo && parsedUserInfo.UserName) {
      setEmpName(parsedUserInfo.UserName)
      setEmpSeq(parsedUserInfo.EmpSeq)
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
        codeHelpItemTypeName,
        codeHelpWarehouse,
        codeHelpUserName,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 10012, 1, '%', '', '', '', ''),
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
        GetCodeHelp(90003, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])

      setDataBizUnit(codeHelpBizUnit?.data || [])
      setDataItemTypeName(codeHelpItemTypeName?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataItemTypeName([])
      setDataWarehouse([])
      setDataUserName([])
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
      //onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
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
  const handleInventoryCheckData = async () => {
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

    if (bizUnit === '0' || bizUnit === '') {
      message.warning('"Đơn vị kinh doanh" không được để trống hoặc null!')
      return
    }
    if (whSeq === '0' || whSeq === '') {
      message.warning('"Kho kiểm kê" không được để trống hoặc null!')
      return
    }
    if (typeName === '0' || typeName === '') {
      message.warning('"Phân loại kiểm kê" không được để trống hoặc null!')
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const data = [
        {
          IsChangedMst: typeName,
          StkDate: fromDate ? formatDate(fromDate) : '',
          BizUnit: bizUnit,
          AssetSeq: itemTypeName,
          ItemName: itemName,
          ItemNo: itemNo,
          Spec: location,
          WHSeq: whSeq,
        },
      ]

      const response = await PostInventoryCheck(data)
      if (response.data.success) {
        const fetchedData = response.data.data || []
        setGridData(fetchedData)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setNumRows(fetchedData.length)
      } else {
        setData([])
        setGridData([])
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setIsAPISuccess(true)
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } catch (error) {
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
      message.warning('"Ngày kiểm kê" không được để trống hoặc null!')
      return
    }
    if (bizUnit === '0' || bizUnit === '') {
      message.warning('"Đơn vị kinh doanh" không được để trống hoặc null!')
      return
    }

    if (typeName === '0' || typeName === '') {
      message.warning('"Phân loại kiểm kê" không được để trống hoặc null!')
      return
    }

    if (whSeq === '0' || whSeq === '') {
      message.warning('"Kho kiểm kê" không được để trống hoặc null!')
      return
    }

    const dataMaster = [
      {
        StkMngSeq: stkMngSeq,
        StkMngNo: stkMngNo,
        StkDate: fromDate ? formatDate(fromDate) : '',
        BizUnit: bizUnit,
        BizUnitName: bizUnitName,
        WHSeq: whSeq,
        WHName: whName,
        EmpSeq: empSeq,
        EmpName: empName,
        IsZeroQty: typeName,
        Remark: remark,
      },
    ]

    const columnsA = [
      'Status',
      'StkMngSeq',
      'StkMngSerl',
      'WHSeq',
      'ItemName',
      'ItemNo',
      'Spec',
      'ItemSeq',
      'UnitName',
      'UnitSeq',
      'Qty',
      'AssetName',
      'LotNo',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)
    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }
    const missingIds = findMissingIds(lastEntry)
    setEmptyWordIds(missingIds)

    const dataSheetAUD = filterAndSelectColumnsAUD(gridData, columnsA)

    if (missingIds.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }
    if (whSeq !== dataSheetAUD[0]?.WHSeq) {
      message.warning(
        'Kho kiểm kê đã bị thay đổi, hãy ấn nút Truy xuất tồn kho!',
      )
      return
    }
    setIsAPISuccess(false)
    togglePageInteraction(true)
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
              (data) =>
                data.ItemSeq === item.ItemSeq && data.LotNo === item.LotNo,
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
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.success('Lưu dữ liệu thành công!')
          }
          togglePageInteraction(false)
          setIsAPISuccess(true)
          setStkMngSeq(result.data.data[0].StkMngSeq)
          setEditedRows([])
          updateGridData(newData)
          resetTable()
        } else {
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.error('Có lỗi xảy ra khi lưu dữ liệu')
          }
          togglePageInteraction(false)
          setIsAPISuccess(true)
          setDataError(result.data.errors)
          setIsModalVisible(true)
        }
      })
    } catch (error) {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      togglePageInteraction(false)
      setIsAPISuccess(true)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    }
  }, [
    gridData,
    stkMngSeq,
    stkMngNo,
    fromDate,
    bizUnit,
    bizUnitName,
    whSeq,
    whName,
    empSeq,
    empName,
    remark,
    isAPISuccess,
  ])

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
        StkMngSeq: stkMngSeq,
        StkDate: fromDate,
      },
    ]
    if (stkMngSeq === '0' || stkMngSeq === '') {
      resetTable()
      setModalMasterDeleteOpen(false)
      message.warning('Không có dữ liệu để xóa!')
    } else {
      setIsDeleting(true)
      setIsAPISuccess(false)
      togglePageInteraction(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      PostMasterDelete(dataMaster)
        .then((response) => {
          message.destroy()
          if (response.data.success) {
            handleResetData()
            resetTable()
            setModalMasterDeleteOpen(false)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            togglePageInteraction(false)
            setIsAPISuccess(true)
            message.success('Xóa thành công!')
          } else {
            setModalMasterDeleteOpen(false)
            setDataError(response.data.errors)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            togglePageInteraction(false)
            setIsAPISuccess(true)
            setIsModalVisible(true)
            message.error(response.data.message || 'Xóa thất bại!')
          }
        })
        .catch((error) => {
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
          }
          togglePageInteraction(false)
          setIsAPISuccess(true)
          message.error('Có lỗi xảy ra khi xóa!')
        })
        .finally(() => {
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
          }
          togglePageInteraction(false)
          setIsAPISuccess(true)
          setIsDeleting(false)
        })
    }
  }, [canDelete, isDeleting, stkMngSeq, fromDate, isAPISuccess])

  const handleRestSheet = useCallback(async () => {
    const emptyData = generateEmptyData(0, defaultCols)
    setGridData(emptyData)
    setNumRows(emptyData.length)
  }, [defaultCols, gridData])

  const initialValues = {
    BizUnit: '0',
    BizUnitName: 'All',
    FromDate: dayjs(),
    StkMngNo: '',
    WhName: '',
    WhSeq: '0',
    StkMngSeq: '0',
    EmpName: '',
    EmpSeq: '0',
    Remark: '',
  }

  const handleResetData = useCallback(async () => {
    setIsReset(true)
    setBizUnit(initialValues.BizUnit)
    setBizUnitName(initialValues.BizUnitName)
    setFromDate(initialValues.FromDate)
    setStkMngNo(initialValues.StkMngNo)
    setWhName(initialValues.WhName)
    setWhSeq(initialValues.WhSeq)
    setStkMngSeq(initialValues.StkMngSeq)
    setEmpName(initialValues.EmpName)
    setEmpSeq(initialValues.EmpSeq)
    setRemark(initialValues.Remark)
    const emptyData = generateEmptyData(0, defaultCols)
    setGridData(emptyData)
    setNumRows(emptyData.length)
    resetTable()
  }, [defaultCols, gridData])

  return (
    <>
      <Helmet>
        <title>ITM - {t('Đăng ký Kiểm tra tồn kho thực tế')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Đăng ký Kiểm tra tồn kho thực tế')}
              </Title>
              <LGWHStockRealOpenActions
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
                  {t('MASTER DATA')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <LGWHStockRealOpenQuery
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  bizUnit={bizUnit}
                  dataBizUnit={dataBizUnit}
                  setBizUnit={setBizUnit}
                  setBizUnitName={setBizUnitName}
                  typeName={typeName}
                  setTypeName={setTypeName}
                  dataItemTypeName={dataItemTypeName}
                  itemTypeName={itemTypeName}
                  setItemTypeName={setItemTypeName}
                  whName={whName}
                  setWhName={setWhName}
                  setWhSeq={setWhSeq}
                  dataWarehouse={dataWarehouse}
                  userName={empName}
                  setUserName={setEmpName}
                  setUserSeq={setEmpSeq}
                  dataUserName={dataUserName}
                  stkMngNo={stkMngNo}
                  setStkMngNo={setStkMngNo}
                  remark={remark}
                  setRemark={setRemark}
                  isReset={isReset}
                  setIsReset={setIsReset}
                />
              </div>
            </details>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                  <BlockOutlined />
                  {t('Điều kiện lọc kiểm kê')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <LGWHStockRealOpenAddQuery
                  dataItemTypeName={dataItemTypeName}
                  itemTypeName={itemTypeName}
                  setItemTypeName={setItemTypeName}
                  itemName={itemName}
                  setItemName={setItemName}
                  itemNo={itemNo}
                  setItemNo={setItemNo}
                  location={location}
                  setLocation={setLocation}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableLGWHStockRealOpen
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
