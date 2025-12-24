import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined } from '@ant-design/icons'

import { Typography, message } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'

import ErrorListModal from '../default/errorListModal'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'

import { ArrowIcon } from '../../components/icons'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateCheckColumns } from '../../../utils/validateColumns'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { useNavigate } from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar'
import QaItemQcTypeQuery from '../../components/query/qaBasic/qaItemQcTypeQuery'
import TableQaItemQcType from '../../components/table/qaBasic/tableQaItemQcType'
import { SearchQaItemQcTypePage } from '../../../features/qa-basic/searchQaItemTypePage'
import QaItemQcTypeActions from '../../components/actions/qa-basic/qaItemQCTypeActions'
import { CreateOrUpdateQAItemQcTypeBy } from '../../../features/qa-basic/createdOrUpdateQaItemQCTypeBy'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
export default function QaItemQcType({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
}) {
  const { t } = useTranslation()
  const formatDate = (date) => (date ? date.format('YYYYMMDD') : '')
  const loadingBarRef = useRef(null)

  const [totalQCQty, setTotalQCQty] = useState(0)
  const [totalPassedQty, setTotalPassedQty] = useState(0)
  const [totalRejectQty, setTotalRejectQty] = useState(0)

  const calculateTotalQCQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.QCQty || 0), 0)
    setTotalQCQty(total)
  }
  const calculateTotalPassedQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.PassedQty || 0), 0)
    setTotalPassedQty(total)
  }
  const calculateTotalRejectQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.RejectQty || 0), 0)
    setTotalRejectQty(total)
  }

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
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3259'),
        id: 'AssetName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2115'),
        id: 'ItemLClassName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3262'),
        id: 'ItemMClassName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('592'),
        id: 'UMItemClassName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('2090'),
        id: 'ItemName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('2107'),
        id: 'ItemSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('7909'),
        id: 'IsInQC',
        kind: 'Boolean',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9604'),
        id: 'IsOutQC',
        kind: 'Boolean',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('9411'),
        id: 'IsLastQC',
        kind: 'Boolean',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('8026'),
        id: 'IsInAfterQC',
        kind: 'Boolean',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('16790'),
        id: 'IsNotAutoIn',
        kind: 'Boolean',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3260'),
        id: 'AssetSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('15403'),
        id: 'IsSutakQc',
        kind: 'Boolean',
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
        title: t('11743'),
        id: 'TestItemType',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )
  const [loading, setLoading] = useState(false)
  const [menus, setMenus] = useState([])
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
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
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [dataCommissionCust, setDataCommissionCust] = useState([])
  const [dataUnit, setDataUnit] = useState([])
  const [dataNaWare, setDataNaWare] = useState([])
  const [dataMngDeptName, setDataMngDeptName] = useState([])
  const [dataUMRegion, setDataUMRegion] = useState([])
  const [dataScopeName, setDataScopeName] = useState([])
  const [dataError, setDataError] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QA_ITEM_QC_TYPE',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)

  /* Q */

  const [AssetSeq, setAssetSeq] = useState('')
  const [AssetName, setAssetName] = useState('')
  const [ItemLClass, setItemLClass] = useState('')
  const [ItemLClassName, setItemLClassName] = useState('')
  const [ItemMClass, setItemMClass] = useState('')
  const [ItemMClassName, setItemMClassName] = useState('')
  const [ItemSClass, setItemSClass] = useState('')
  const [ItemSClassName, setItemSClassName] = useState('')

  const [ItemName, setItemName] = useState('')
  const [ItemNo, setItemNo] = useState('')
  const [Spec, setSpec] = useState('')
  const [TestItemType, setTestItemType] = useState('')
  const [ItemCheck, setItemCheck] = useState(false)

  const [dataAssetName, setDataAssetName] = useState([])
  const [dataItemClassLName, setDataItemClassLName] = useState([])
  const [dataItemClassMName, setDataItemClassMName] = useState([])
  const [dataItemClassName, setDataItemClassName] = useState([])
  const [dataTestItemType, setDataTestItemType] = useState([])

  const [DateFr, setDateFr] = useState(dayjs().startOf('month'))
  const [DateTo, setDateTo] = useState(dayjs())

  const navigate = useNavigate()
  const [keyPath, setKeyPath] = useState('')
  const [dataSelect, setDataSelect] = useState([])

  const fieldsToTrack = [
    'Select',
    'AssetName',
    'ItemLClassName',
    'ItemMClassName',
    'UMItemClassName',
    'ItemName',
    'ItemNo',
    'Spec',
    'ItemSeq',
    'IsInQC',
    'IsOutQC',
    'IsLastQC',
    'IsInAfterQC',
    'IsNotAutoIn',
    'AssetSeq',
    'IsSutakQc',
    'TestItemType',
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const fetchData = useCallback(async () => {
    if (!isAPISuccess) return

    if (controllers.current && controllers.current.fetchData) {
      controllers.current.fetchData.abort()
      controllers.current.fetchData = null
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchData = controller

    setLoading(true)
    setIsAPISuccess(false)
    let hideLoadingMessage
    try {
      const data = [
        {
          Spec: Spec,
          AssetSeq: AssetSeq,
          ItemLClass: ItemLClass,
          ItemMClass: ItemMClass,
          ItemSClass: ItemSClass,
          DateFr: formatDate(DateFr),
          DateTo: formatDate(DateTo),
          ItemName: ItemName,
          ItemNo: ItemNo,
          TestItemType: TestItemType,
          ItemCheck: ItemCheck,
        },
      ]

      const response = await SearchQaItemQcTypePage(data)
      const fetchedData = response.data.data || []

      const emptyData = generateEmptyData(0, defaultCols)
      const combinedData = [...fetchedData, ...emptyData]
      const updatedData = updateIndexNo(combinedData)
      setGridData(updatedData)
      setNumRows(fetchedData.length + emptyData.length)
    } catch (error) {
      const emptyData = generateEmptyData(50, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridData(updatedEmptyData)
      setNumRows(emptyData.length)
    } finally {
      if (hideLoadingMessage) hideLoadingMessage()
      setLoading(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchData = null
    }
  }, [
    Spec,
    AssetSeq,
    ItemLClass,
    ItemMClass,
    ItemSClass,
    DateFr,
    DateTo,
    ItemName,
    ItemNo,
    TestItemType,
    ItemCheck,
  ])

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchCodeHelpData) {
      controllers.current.fetchCodeHelpData.abort()
      controllers.current.fetchCodeHelpData = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchCodeHelpData = controller
    try {
      const [
        dataAssetName,
        dataItemClassLName,
        dataItemClassMName,
        dataItemClassName,
        dataTestItemType,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10012, 1, '%', '', '', '', ''),
        GetCodeHelp(18097, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(18098, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(10014, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6070', '', '', ''),
      ])
      setDataAssetName(dataAssetName.data)
      setDataItemClassLName(dataItemClassLName.data)
      setDataItemClassMName(dataItemClassMName.data)
      setDataItemClassName(dataItemClassName.data)
      setDataTestItemType(dataTestItemType.data)
    } catch (error) {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpData = null
    }
  }, [])

  const fetchCodeHelpItemClass = useCallback(async () => {
    
    try {
      const [
        dataItemClassLName,
        dataItemClassMName,
        dataItemClassName,
      ] = await Promise.all([
        GetCodeHelpVer2(18097, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(18098, '', '', ItemLClass, '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(10014, '', '', ItemLClass, ItemMClass, '', '1', '', 1, '', 0, 0, 0),
      ])
      setDataItemClassLName(dataItemClassLName.data)
      setDataItemClassMName(dataItemClassMName.data)
      setDataItemClassName(dataItemClassName.data)
    } catch (error) {
    }
  }, [ItemLClass, ItemMClass])

  useEffect(() => {
    fetchCodeHelpItemClass()
  }, [ItemLClass, ItemMClass])

  const debouncedFetchCodeHelpData = useMemo(
    () => debounce(fetchCodeHelpData, 200),
    [fetchCodeHelpData],
  )
  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])

  useEffect(() => {
    calculateTotalQCQty()
    calculateTotalPassedQty()
    calculateTotalRejectQty()
    setCols(defaultCols.filter((col) => col.visible))
  }, [gridData, defaultCols])

  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }

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

  const getSelectRows = () => {
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

  const handleSaveData = useCallback(async () => {

    if (controllers.current.handleSaveData) {
      controllers.current.handleSaveData.abort()
      controllers.current.handleSaveData = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.handleSaveData = controller

    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
    const requiredColumns = [
      'AssetName',
      'ItemLClassName',
      'ItemMClassName',
      'UMItemClassName',
      'ItemName',
      'ItemNo',
    ]

    const columnsU = [
      'AssetName',
      'ItemLClassName',
      'ItemMClassName',
      'UMItemClassName',
      'ItemName',
      'ItemNo',
      'Spec',
      'ItemSeq',
      'IsInQC',
      'IsOutQC',
      'IsLastQC',
      'IsInAfterQC',
      'IsNotAutoIn',
      'AssetSeq',
      'IsSutakQc',
      'TestItemType',
    ]

    const columnsA = [
      'AssetName',
      'ItemLClassName',
      'ItemMClassName',
      'UMItemClassName',
      'ItemName',
      'ItemNo',
      'Spec',
      'ItemSeq',
      'IsInQC',
      'IsOutQC',
      'IsLastQC',
      'IsInAfterQC',
      'IsNotAutoIn',
      'AssetSeq',
      'IsSutakQc',
      'TestItemType',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }

    const missingIds = findMissingIds(lastEntry)
    if (missingIds.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }

    const resulU = filterAndSelectColumns(gridData, columnsU, 'U')
    const resulA = filterAndSelectColumns(gridData, columnsA, 'A')

    const validationMessage = validateCheckColumns(
      [...resulU, ...resulA],
      [...columnsU, ...columnsA],
      requiredColumns,
    )

    if (validationMessage !== true) {
      message.warning(validationMessage)
      return
    }

    if (isSent) return

    setIsSent(true)

    if (resulA.length > 0 || resulU.length > 0) {
      try {
        const promises = []

        if (resulA.length > 0) {
          promises.push(CreateOrUpdateQAItemQcTypeBy(resulA))
        }

        if (resulU.length > 0) {
          promises.push(CreateOrUpdateQAItemQcTypeBy(resulU))
        }

        const results = await Promise.all(promises)

        results.forEach((result, index) => {
          if (result.data.status) {
            const newData = result.data.data
            if (index === 0) {
              message.success('Thêm thành công!')
            } else {
              message.success('Cập nhật  thành công!')
            }

            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            // updateGridData(newData)
            resetTable()
          } else {
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setIsModalVisible(true)
            message.error('Có lỗi xảy ra khi lưu dữ liệu')
          }
        })
      } catch (error) {
        setIsLoading(false)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
      finally{
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        controllers.current.handleSaveData = null
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      message.warning('Không có dữ liệu để lưu!')
    }
  }, [editedRows])

  const handleDeleteDataSheet = useCallback(
    (e) => {
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
        PostD(idsWithStatusD)
          .then((response) => {
            message.destroy()
            if (response.data.success) {
              const remainingRows = gridData.filter(
                (row) =>
                  !idsWithStatusD.some(
                    (deletedRow) =>
                      deletedRow?.IDX_NO ||
                      deletedRow.IdxNo === row.IdxNo ||
                      row.IDX_NO,
                  ),
              )
              const updatedData = updateIndexNo(remainingRows)
              setGridData(updatedData)
              setNumRows(updatedData.length)
              resetTable()
              setModalOpen(false)
              message.success('Xóa thành công!')
            } else {
              setDataError(response.data.errors)
              setIsModalVisible(true)

              message.error(response.data.message || 'Xóa thất bại!')
            }
          })
          .catch((error) => {
            message.destroy()
            message.error('Có lỗi xảy ra khi xóa!')
          })
          .finally(() => {
            setIsDeleting(false)
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        const remainingEditedRows = editedRows.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow.Id),
        )
        setModalOpen(false)
        message.success('Xóa thành công!')
        const updatedDataEditedRows = updateIndexNo(remainingEditedRows)
        const updatedRemainingRows = updateIndexNo(remainingRows)
        setEditedRows(updatedDataEditedRows)
        setGridData(updatedRemainingRows)
        setNumRows(remainingRows.length)
        resetTable()
      }
    },
    [canDelete, gridData, selection, editedRows, isDeleting],
  )

  const handleRestSheet = useCallback(async () => {
    const hasWHseq = gridData.some((item) => item.hasOwnProperty('WHseq'))
    if (hasWHseq) {
      fetchData()
    } else {
      const allStatusA = gridData.every((item) => item.Status === 'A')

      if (allStatusA) {
        const emptyData = generateEmptyData(20, defaultCols)
        setGridData(emptyData)
        setNumRows(emptyData.length)
      } else {
        fetchData()
      }
    }
  }, [defaultCols, gridData])

  return (
    <>
      <Helmet>
        <title>ITM - {t('800000139')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000139')}
              </Title>
              <QaItemQcTypeActions
                fetchDataQuery={fetchData}
                handleSaveData={handleSaveData}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  Điều kiện truy vấn
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <QaItemQcTypeQuery
                  dataAssetName={dataAssetName}
                  dataItemClassLName={dataItemClassLName}
                  dataItemClassMName={dataItemClassMName}
                  dataItemClassSName={dataItemClassName}
                  dataTestItemType={dataTestItemType}
                  setAssetSeq={setAssetSeq}
                  setAssetName = {setAssetName}
                  ItemLClass={ItemLClass}
                  setItemLClass={setItemLClass}
                  ItemLClassName={ItemLClassName}
                  setItemLClassName={setItemLClassName}
                  ItemMClass={ItemMClass}
                  setItemMClass={setItemMClass}
                  ItemMClassName={ItemMClassName}
                  setItemMClassName={setItemMClassName}
                  ItemSClass={ItemSClass}
                  setItemSClass={setItemSClass}
                  ItemSClassName={ItemSClassName}
                  setItemSClassName={setItemSClassName}
                  DateFr={DateFr}
                  setDateFr={setDateFr}
                  DateTo={DateTo}
                  setDateTo={setDateTo}
                  ItemName={ItemName}
                  setItemName={setItemName}
                  ItemNo={ItemNo}
                  setItemNo={setItemNo}
                  TestItemType={TestItemType}
                  setTestItemType={setTestItemType}
                  ItemCheck={ItemCheck}
                  setItemCheck={setItemCheck}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableQaItemQcType
              handleRestSheet={handleRestSheet}
              // onCellClicked={onCellClicked}
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
              dataUnit={dataUnit}
              dataNaWare={dataNaWare}
              dataMngDeptName={dataMngDeptName}
              canCreate={canCreate}
              canEdit={canEdit}
              dataCommissionCust={dataCommissionCust}
              dataUMRegion={dataUMRegion}
              dataScopeName={dataScopeName}
            />
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      />
      <ModalSheetDelete
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        confirm={handleDeleteDataSheet}
      />
    </>
  )
}
