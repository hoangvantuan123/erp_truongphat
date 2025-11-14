import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Typography, Row, Col, message, Form } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined, LoadingOutlined } from '@ant-design/icons'
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

import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import WarningModal from '../default/warningModal'
import LGLotNoMasterAction from '../../components/actions/warehouse/lGLotNoMasterAction'
import LGLotMasterQuery from '../../components/query/warehouse/lGLotMasterQuery'
import { GetLGLotNoMasterQuery } from '../../../features/warehouse/getLGLotNoMasterQuery'
import TableLGLotNoMaster from '../../components/table/warehouse/tableLGLotNoMaster'
import { PostLGLotNoMasterAUD } from '../../../features/warehouse/postLGLotNoMasterAUD'
import ErrorListModal from '../default/errorListModal'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function LGLotMaster({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  abortControllerRef,
  controllers,
  cancelAllRequests,
}) {
  const loadingBarRef = useRef(null)
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [totalQuantity, setTotalQuantity] = useState(0)
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
        title: 'LotNo',
        id: 'LotNo',
        kind: 'Text',
        readonly: false,
        width: 200,
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
        title: t('2090'),
        id: 'ItemName',
        kind: 'Text',
        readonly: false,
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
        title: t('Màu sắc'),
        id: 'Dummy1',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('Pallet '),
        id: 'Dummy2',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('1628'),
        id: 'Qty',
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
        title: t('17387'),
        id: 'CreateDate',
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
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('17385'),
        id: 'CreateTime',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderTime,
      },
      {
        title: t('Ngày hết hạn'),
        id: 'ValiDate',
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
        icon: GridColumnIcon.HeaderDate,
      },

      {
        title: t('210'),
        id: 'RegDate',
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
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('2066'),
        id: 'RegUserName',
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
        title: t('Nhà cung cấp'),
        id: 'CustName',
        kind: 'Text',
        readonly: false,
        width: 180,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('5543'),
        id: 'SourceLotNo',
        kind: 'Text',
        readonly: true,
        width: 120,
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
        width: 150,
        hasMenu: false,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('1901'),
        id: 'InNo',
        kind: 'Text',
        readonly: false,
        width: 180,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },



      {
        title: t('30660'),
        id: 'Dummy3',
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
  const secretKey = 'TEST_ACCESS_KEY'

  const [dataItemName, setDataItemName] = useState([])
  const [dataUserName, setDataUserName] = useState([])
  const [dataCustName, setDataCustName] = useState([])

  const [fromDate, setFromDate] = useState(dayjs().startOf('month') || '')
  const [toDate, setToDate] = useState(dayjs())
  const [lotNo, setLotNo] = useState('')
  const formatDate = (date) => date.format('YYYYMMDD')
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [isQuery, setIsQuery] = useState(false)
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

  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)

  const [onSelectRow, setOnSelectRow] = useState([])

  const [dataError, setDataError] = useState([])

  const [isDeleting, setIsDeleting] = useState(false)

  const calculateTotalQuantity = () => {
    const total = gridData.reduce((sum, item) => sum + (item.Qty || 0), 0)
    setTotalQuantity(total)
  }
  useEffect(() => {
    calculateTotalQuantity()
  }, [gridData])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_LOT_MASTER',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])
  /* CodeHelp */
  const [userName, setUserName] = useState('')
  const [userSeq, setUserSeq] = useState('')
  const [custName, setCustName] = useState('')
  const [custSeq, setCustSeq] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemSeq, setItemSeq] = useState('0')
  const [itemNo, setItemNo] = useState('')
  const [itemSpec, setItemSpec] = useState('')
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)

  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)

  const [onDiscard, setOnDiscard] = useState(false)

  const fieldsToTrack = ['ItemName']
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)
  const [selection2, setSelection2] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

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
    if (!gridData || !gridData.some((item) => item.Status === 'A')) {
      const emptyData = generateEmptyData(50, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridData(updatedEmptyData)
      setNumRows(emptyData.length + 1)
      return
    }
  }, [])

  const fetchSLGLotNoMasterQueryWEB = useCallback(async () => {
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
          RegDateFr: fromDate?.format('YYYYMMDD'),
          RegDateTo: toDate?.format('YYYYMMDD'),
          ItemSeq: itemSeq,
          ItemName: itemName,
          LotNo: lotNo,
          OriItemSeq: custSeq,
          RegUserSeq: userSeq,
        },
      ]
      const response = await GetLGLotNoMasterQuery(data)
      const fetchedData = response.data.data || []
      setIsQuery(true)
      const emptyData = generateEmptyData(50, defaultCols)
      const combinedData = [...fetchedData, ...emptyData]
      const updatedData = updateIndexNo(combinedData)
      setGridData(updatedData)
      setNumRows(fetchedData.length + emptyData.length + 1)
      resetTable()
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    } catch (error) {
      const emptyData = generateEmptyData(50, defaultCols)
      setGridData(emptyData)
      setNumRows(emptyData.length)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    } finally {
      setLoading(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    fromDate,
    toDate,
    itemSeq,
    itemName,
    lotNo,
    custSeq,
    userSeq,
    defaultCols,
    isAPISuccess,
  ])

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
      const [codeHelpItemName, codeHelpUserName, codeHelpCustName] =
        await Promise.all([
          GetCodeHelpVer2(18001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
          GetCodeHelpVer2(90003, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
          GetCodeHelpVer2(17001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        ])
      setDataItemName(codeHelpItemName?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
      setDataCustName(codeHelpCustName?.data || [])
    } catch (error) {
      setDataItemName([])
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
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault()
        fetchSLGLotNoMasterQueryWEB()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSLGLotNoMasterQueryWEB])

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
  const handleSaveData = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }

    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      return
    }

    const columnsA = [
      'Status',
      'IdxNo',
      'Id',
      'LotNo',
      'ItemName',
      'ItemNo',
      'Spec',
      'ItemSeq',
      'UnitName',
      'UnitSeq',
      'Qty',
      'CreateDate',
      'CreateTime',
      'ValiDate',
      'ValidTime',
      'RegDate',
      'RegUserName',
      'RegUserSeq',
      'CustName',
      'CustSeq',
      'SourceLotNo',
      'OriLotNo',
      'OriLotSeq',
      'ItemSeqOLD',
      'LotNoOLD',
      'Remark',
      'InNo',
      'Remark',
      'SupplyCustSeq',
      'Dummy1',
      'Dummy2',
      'Dummy3',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }

    const missingIds = findMissingIds(lastEntry)
    setEmptyWordIds(missingIds)

    const resulAUD = filterAndSelectColumnsAUD(gridData, columnsA)

    if (missingIds.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }

    if (!validateColumns(resulAUD, ['LotNo'])) {
      message.warning('Cột "Lot No" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(resulAUD, ['ItemName'])) {
      message.warning('Cột "Tên sản phẩm" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(resulAUD, ['CreateDate'])) {
      message.warning('Cột "Ngày sản xuất" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(resulAUD, ['RegDate'])) {
      message.warning('Cột "Ngày nhập kho" không được để trống hoặc null!')
      return
    }

    if (isSent) return
    setIsSent(true)
    if (resulAUD.length > 0 || resulAUD.length > 0) {
      setIsAPISuccess(false)
      togglePageInteraction(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      try {
        const promises = []

        if (resulAUD.length > 0) {
          promises.push(PostLGLotNoMasterAUD(resulAUD))
        }

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
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.success('Lưu dữ liệu thành công!')
            }
            togglePageInteraction(false)
            setIsAPISuccess(true)
            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            updateGridData(newData)
            resetTable()
          } else {
            setIsAPISuccess(true)
            setIsLoading(false)
            setIsSent(false)
            togglePageInteraction(false)
            setDataError(result.data.errors)
            setIsModalVisible(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi lưu dữ liệu')
            }
          }
        })
      } catch (error) {
        setIsLoading(false)
        setIsSent(false)
        togglePageInteraction(false)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error('Có lỗi xảy ra khi lưu dữ liệu')
        }
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      togglePageInteraction(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.warning('Không có dữ liệu để lưu!')
      }
    }
  }, [gridData, isAPISuccess])

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
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
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
        togglePageInteraction(true)
        setIsAPISuccess(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.continuousStart()
        }

        PostLGLotNoMasterAUD(idsWithStatusD)
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
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.success('Xóa thành công!')
              }
            } else {
              setDataError(response.data.errors)
              setIsModalVisible(true)
              togglePageInteraction(false)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.error(response.data.message || 'Xóa thất bại!')
              }
            }
          })
          .catch((error) => {
            message.destroy()
            togglePageInteraction(false)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi xóa!')
            }
          })
          .finally(() => {
            togglePageInteraction(false)
            setIsAPISuccess(true)
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
        setEditedRows(remainingEditedRows)
        setGridData(remainingRows)
        setNumRows(remainingRows.length)
        resetTable()
      }
    },
    [canDelete, gridData, selection, editedRows, isDeleting],
  )

  const handleRestSheet = useCallback(async () => {
    const allStatusA = gridData.every((item) => item.Status === 'A')

    if (allStatusA) {
      const emptyData = generateEmptyData(50, defaultCols)
      setGridData(emptyData)
      setNumRows(emptyData.length)
    } else {
      fetchSLGLotNoMasterQueryWEB()
    }
  }, [defaultCols, gridData])

  return (
    <>
      <Helmet>
        <title>{t('Đăng ký thông tin lô hàng của sản phẩm')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex p-2 items-end justify-end">
              <LGLotNoMasterAction
                setModalOpen={setModalOpen}
                fetchDataQuery={fetchSLGLotNoMasterQueryWEB}
                handleSaveData={handleSaveData}
              />
            </div>
            <details
              className="group p-1 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600  uppercase">
                  Điều kiện truy vấn
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <LGLotMasterQuery
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
                  toDate={toDate}
                  itemName={itemName}
                  setItemName={setItemName}
                  setItemSeq={setItemSeq}
                  itemNo={itemNo}
                  setItemNo={setItemNo}
                  itemSpec={itemSpec}
                  setItemSpec={setItemSpec}
                  lotNo={lotNo}
                  setLotNo={setLotNo}
                  userName={userName}
                  setUserName={setUserName}
                  userSeq={userSeq}
                  setUserSeq={setUserSeq}
                  custName={custName}
                  setCustName={setCustName}
                  custSeq={custSeq}
                  setCustSeq={setCustSeq}
                  setDataItemName={setDataItemName}
                  dataItemName={dataItemName}
                  dataUserName={dataUserName}
                  setDataUserName={setFromDate}
                  dataCustName={dataCustName}
                  setDataCustName={setDataCustName}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t   overflow-auto">
            <TableLGLotNoMaster
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
              dataCustName={dataCustName}
              setIsQuery={setIsQuery}
              isQuery={isQuery}
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

      <WarningModal
        setIsModalVisible={setIsModalWarning}
        handleOnDiscard={handleOnDiscard}
        handleOnConfirm={handleSaveData}
        isModalVisible={isModalWarning}
      />
    </>
  )
}
