import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import { Typography, message } from 'antd'
const { Title } = Typography
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'

import ErrorListModal from '../default/errorListModal'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'

import { filterAndSelectColumns } from '../../../utils/filterUorA'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateCheckColumns } from '../../../utils/validateColumns'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { useNavigate, useParams } from 'react-router-dom'

import TopLoadingBar from 'react-top-loading-bar'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import QaQcTitleAction from '../../components/actions/qa-basic/qaQcTitleAction'
import TableQaQcTitle from '../../components/table/qaBasic/tableQaQcTitle'
import TableQaItemBad from '../../components/table/qaBasic/tableQaItemBad'
import { SearchQaQcTitlePage } from '../../../features/qa-basic/qaqc-title/searchQaQcTitlePage'
import { GetQaItemBad } from '../../../features/qa-basic/qaqc-title/getQaItemBad'
import { CUDQaQcTitleBy } from '../../../features/qa-basic/qaqc-title/AuDQaQcTitle'
import { DeleteQaQcTitle } from '../../../features/qa-basic/qaqc-title/deleteQaQcTitle'
import { DeleteQcItemBad } from '../../../features/qa-basic/qaqc-title/deleteQcItemBad'
import { updateEditedRows } from '../../components/sheet/js/updateEditedRows'

export default function QaQcTitle({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
}) {
  const { t } = useTranslation()
  // const formatDate = (date) => date.format('YYYYMMDD')
  const { id } = useParams()
  const navigate = useNavigate()
  const secretKey = 'TEST_ACCESS_KEY'
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
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: t('1605'),
        id: 'UMQCTitleName',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1605'),
        id: 'UMQCTitleSeq',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3093'),
        id: 'IsProcQc',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('7909'),
        id: 'IsPurQc',
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
        title: t('9411'),
        id: 'IsFinalQc',
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
        title: t('9604'),
        id: 'IsOutQc',
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
        title: t('3673'),
        id: 'InspecCond',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1928'),
        id: 'InPutType',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1928'),
        id: 'InPutTypeName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3663'),
        id: 'QcUnitName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3663'),
        id: 'QcUnitSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('18881'),
        id: 'IsBadAdd',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('15084'),
        id: 'UMQCTitleSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('15085'),
        id: 'UMQcTitleSeqOld',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('13932'),
        id: 'SMAQLLevelName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('13932'),
        id: 'SMAQLLevel',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,

        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )

  const defaultColsB = useMemo(
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
        title: t('6014'),
        id: 'BadTypeName',
        kind: 'Custom',
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
        title: t('6013'),
        id: 'BadKind',
        kind: 'Custom',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6013'),
        id: 'BadKindName',
        kind: 'Custom',
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
        title: t('6012'),
        id: 'BadReason',
        kind: 'Custom',
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
        title: t('6012'),
        id: 'BadReasonName',
        kind: 'Custom',
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
        title: t('362'),
        id: 'Remark',
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
        title: t('362'),
        id: 'BadSeq',
        kind: 'Text',
        readonly: false,
        width: 250,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )

  const formatDate = useCallback((date) => date.format('YYYYMMDD'), [])

  const [loading, setLoading] = useState(false)
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDeleteConfirm, setModalDeleteConfirm] = useState(false)

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
  const [dataError, setDataError] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QA_QC_TITLE',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  
  // data code help
  const [dataQcUmTitleName, setDataQcUmTitleName] = useState([])
  const [dataInputTypeName, setDataInputTypeName] = useState([])
  const [dataSMAQLLevelName, setDataSMAQLLevelName] = useState([])
  const [dataBadKindName, setDataBadKindName] = useState([])
  const [dataBadReasonName, setDataBadReasonName] = useState([])

  const fieldsToTrack = [
    'UMQcTitleName',
    'IsStrictLevel',
    'IsMidLevel',
    'IsSimpleLevel',
    'SMInputTypeName',
    'UMQCUnitName',
    'TagetLevel',
    'UpperLimit',
    'LowerLimit',
    'Remark',
    'UMQCTitleSeq',
    'UMQCTitleSeqOld',
    'SMAQLLevelName',
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const [selectionB, setSelectionB] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [gridDataB, setGridDataB] = useState([])

  const [dataSelectTitle, setDataSelectTitle] = useState([])
  const [dataSelectBad, setDataSelectBad] = useState([])

  const [numRowsB, setNumRowsB] = useState(0)

  const [colsB, setColsB] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QA_ITEM_BAD',
      defaultColsB.filter((col) => col.visible),
    ),
  )

  const [addedRowsB, setAddedRowsB] = useState([])
  const [numRowsToAddB, setNumRowsToAddB] = useState(null)

  const [dataSub, setDataSub] = useState([])
  const [UMQCTitleSeq, setUMQCTitleSeq]  = useState('')

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

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
        dataQcUmTitleName,
        dataInputTypeName,
        dataSMAQLLevelName,
        dataBadKindName,
        dataBadReasonName,
      ] = await Promise.all([
        GetCodeHelpVer2(19999, '', '6002', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '1018', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6015', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19999, 1, '%', '6006', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19999, 1, '%', '6007', '', '', ''),
      ])
      setDataQcUmTitleName(dataQcUmTitleName.data)
      setDataInputTypeName(dataInputTypeName.data)
      setDataSMAQLLevelName(dataSMAQLLevelName.data)
      setDataBadKindName(dataBadKindName.data)
      setDataBadReasonName(dataBadReasonName.data)
    } catch (error) {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpData = null
    }
  }, [])

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

          
          setGridData((prev) => {
            const newData = [...prev]
            const product = gridData[i]
            
            if(product.UMQCTitleSeq){
              product['Status'] = 'U'
            }else{
              product['Status'] = 'A'
            }
            
      
            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, product, newData, ''),
            )
      
            return newData
          })
        }
      }
    })

    

    return rows
  }

  const getSelectedRowsB = () => {
    const selectedRows = selectionB.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridDataB[i]) {
          rows.push(gridDataB[i])
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

  const fetchQaItemBad = useCallback(
    async (data) => {
      if (!isAPISuccess) return
      if (controllers.current && controllers.current.fetchQaItemBad) {
        controllers.current.fetchQaItemBad.abort()
        controllers.current.fetchQaItemBad = null
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

      controllers.current.fetchQaItemBad = controller

      setLoading(true)
      setIsAPISuccess(false)
      try {
        const response = await GetQaItemBad(data)
        const fetchedData = response.data.data || []

        setGridDataB(fetchedData)
        setNumRowsB(fetchedData.length)
      } catch (error) {
      } finally {
        setLoading(false)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        controllers.current.fetchQaItemBad = null
      }
    },
    [gridDataB, colsB],
  )

  const onCellClicked = useCallback(
    (cell, event) => {
      let rowIndex

      if (cell[0] === -1) {
        rowIndex = cell[1]
        setIsMinusClicked(true)
      } else {
        rowIndex = cell[1]
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
      if (cell[0] === -1) {
        if (rowIndex >= 0 && rowIndex < gridData.length) {
          const rowData = gridData[rowIndex]
          const data = [
            {
              UMQcTitleSeq: rowData.UMQCTitleSeq || 0,
              IDX_NO: rowIndex + 1 || 1,
            },
          ]
          setUMQCTitleSeq(rowData.UMQCTitleSeq || 0)
          fetchQaItemBad(data)
          setDataSelectTitle(getSelectedRows())
        }
      }
    },
    [gridData, getSelectedRows, UMQCTitleSeq],
  )

  const onCellClickedB = useCallback(
    (cell, event) => {
      let rowIndex


      if (cell[0] === -1) {
        rowIndex = cell[1]
        setIsMinusClicked(true)
      } else {
        rowIndex = cell[1]
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
      if (cell[0] === -1) {
        if (rowIndex >= 0 && rowIndex < gridDataB.length) {
          setDataSelectBad(getSelectedRowsB())
        }
      }
    },
    [gridDataB, getSelectedRowsB],
  )


  const handleSaveData = useCallback(
    async (ItemSeq, SMQcKind) => {
      const requiredColumns = ['UMQCTitleName']

      const columnsQaQcTitleA = [
        'UMQCTitleName',
        'UMQCTitleSeq',
        'IsProcQc',
        'IsPurQc',
        'IsFinalQc',
        'IsOutQc',
        'InspecCond',
        'InPutType',
        'InPutTypeName',
        'QcUnitName',
        'QcUnitSeq',
        'Remark',
        'IsBadAdd',
        'UMQcTitleSeqOld',
        'SMAQLLevelName',
        'SMAQLLevel',
      ]

      const columnsQaQcTitleU = [
        'UMQCTitleName',
        'UMQCTitleSeq',
        'IsProcQc',
        'IsPurQc',
        'IsFinalQc',
        'IsOutQc',
        'InspecCond',
        'InPutType',
        'InPutTypeName',
        'QcUnitName',
        'QcUnitSeq',
        'Remark',
        'IsBadAdd',
        'UMQcTitleSeqOld',
        'SMAQLLevelName',
        'SMAQLLevel',
      ]

      const columnsQaItemBadA = [
        'BadTypeName',
        'BadKind',
        'BadKindName',
        'BadReason',
        'BadReasonName',
        'Remark',
        'BadSeq',
        
      ]

      const columnsQaItemBadU = [
        'BadTypeName',
        'BadKind',
        'BadKindName',
        'BadReason',
        'BadReasonName',
        'Remark',
        'BadSeq',
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

      const dataQaQcTitleA = filterAndSelectColumns(
        gridData,
        columnsQaQcTitleA,
        'A',
      ).map((item) => ({
        ...item,
        WorkingTag: 'A',
      }))

      const dataQaQcTitleU = filterAndSelectColumns(
        gridData,
        columnsQaQcTitleU,
        'U',
      ).map((item) => ({
        ...item,
        WorkingTag: 'U',
      }))

      const dataQaQcTitle = [...dataQaQcTitleA, ...dataQaQcTitleU];

      const dataQaItemBadA = filterAndSelectColumns(
        gridDataB,
        columnsQaItemBadA,
        'A',
      ).map((item) => ({
        ...item,
        WorkingTag: 'A',
      }))
      const dataQaItemBadU = filterAndSelectColumns(
        gridDataB,
        columnsQaItemBadU,
        'U',
      ).map((item) => ({
        ...item,
        WorkingTag: 'U',
      }))

      const dataQaItemBad = [...dataQaItemBadA, ...dataQaItemBadU ]

      const validationQaQcTitleMessage = validateCheckColumns(
        [...dataQaQcTitleA],
        [...columnsQaQcTitleA],
        requiredColumns,
      )

      const validationQaItemBadMessage = validateCheckColumns(
        [...dataQaQcTitleA],
        [...columnsQaQcTitleA],
        requiredColumns,
      )

      if (validationQaQcTitleMessage !== true) {
        message.warning(validationQaQcTitleMessage)
        return
      }

      if (validationQaItemBadMessage !== true) {
        message.warning(validationQaItemBadMessage)
        return
      }

      if (isSent) return
      setIsSent(true)

      
        try {
          const promises = []

          promises.push(CUDQaQcTitleBy(dataQaQcTitle, dataQaItemBad))

          const results = await Promise.all(promises)
          

          results.forEach((result, index) => {
            if (result.data.success) {
              const newData = result.data.data
              if (index === 0) {
                message.success('Thêm thành công!')
              } else {
                message.success('Cập nhật thành công!')
              }

              setIsLoading(false)
              setIsSent(false)
            } else {
              setIsLoading(false)
              setIsSent(false)
              setDataError(result.data.message)
              setIsModalVisible(true)
              message.error('Có lỗi xảy ra khi lưu dữ liệu')
            }
          })
        } catch (error) {
          setIsLoading(false)
          setIsSent(false)
          message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
        }
        finally {
          fetchData()
        }
    },
    [editedRows, gridData, cols ,gridDataB, colsB],
  )

  const handleDeleteData = useCallback(async () => {
    if (canDelete === false) {
      message.warning('Bạn không có quyền xóa dữ liệu')
      return
    }
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    if (controllers.current && controllers.current.handleDeleteData) {
      controllers.current.handleDeleteData.abort()
      controllers.current.handleDeleteData = null
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

    controllers.current.handleDeleteData = controller
    
    const columnsQaQcTitle = [
      'UMQCTitleName',
      'UMQCTitleSeq',
      'IsProcQc',
      'IsPurQc',
      'IsFinalQc',
      'IsOutQc',
      'InspecCond',
      'InputType',
      'InPutTypeName',
      'QcUnitName',
      'QcUnitSeq',
      'Remark',
      'IsBadAdd',
      'UMQcTitleSeq',
      'UMQcTitleSeqOld',
      'SMAQLLevelName',
    ]

    const columnsQaItemBad = [
      'BadTypeName',
      'BadKind',
      'BadKindName',
      'BadReason',
      'BadReasonName',
      'Remark',
    ]

    const dataQaQcTitle = dataSelectTitle.map((item) => ({
      ...item,
      WorkingTag: 'D',
    }))

    const dataQaItemBad = dataSelectBad.map((item) => ({
      ...item,
      WorkingTag: 'D',
    }))
    setIsAPISuccess(false)

    try {
      const promises = []

      if(dataQaQcTitle.length !== 0){
        promises.push(DeleteQaQcTitle(dataQaQcTitle))
      }
      if(dataQaItemBad.length !== 0){
        promises.push(DeleteQcItemBad(dataQaItemBad, UMQCTitleSeq))
      }
      const results = await Promise.all(promises)

      results.forEach((result, index) => {
        if (result.data.success) {
          const newData = result.data.data
          if (index === 0) {
            setLoading(false)
            message.success('Xóa thành công!')
            setModalDeleteConfirm(false)
            handleRestSheet()
            setIsAPISuccess(true)
            
          } else {
            message.error(response.message)
            setModalDeleteConfirm(false)
          }

          setIsLoading(false)
          setIsSent(false)

        } else {
          setModalDeleteConfirm(false)
          setIsLoading(false)
          setIsSent(false)
          setDataError(result.data.message)
          setIsModalVisible(true)
          message.error('Có lỗi xảy ra khi lưu dữ liệu')
        }
      })
    } catch (error) {
      console.log('error', error)
      setModalDeleteConfirm(false)
    } finally {
      setModalDeleteConfirm(false)
      setLoading(false)
      setIsAPISuccess(true)
      fetchData()
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.handleDeleteData = null
    }
  }, [
    dataSelectTitle,
    dataSelectBad,
    gridData,
    gridDataB,
    isAPISuccess,
  ])

  const handleRestSheet = useCallback(async () => {
    setGridData([])
    setNumRows(0)

    setGridDataB([])
    setNumRowsB(0)
  }, [defaultCols, gridData, defaultColsB, gridDataB])

  const handleRowAppendB = useCallback(
    (numRowsToAddB) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }

      onRowAppended(
        colsB,
        setGridDataB,
        setNumRowsB,
        setAddedRowsB,
        numRowsToAddB,
      )
    },
    [colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB, dataSub],
  )

  const validDate = (dateString, setDateCallback) => {
    const parsedDate = dayjs(dateString?.trim(), 'YYYYMMDD')
    if (parsedDate.isValid()) {
      setDateCallback(parsedDate)
    } else {
      setDateCallback(dateFormat(''))
    }
  }

  const fetchData = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
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
    try {
      const data = [{}]

      const response = await SearchQaQcTitlePage(data)

      if (response.success) {
        const qaQcTitleData = response.data.data || []
        setIsAPISuccess(true)

        setGridData(qaQcTitleData)
        setNumRows(qaQcTitleData.length)
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
      }
    } catch (error) {
      console.log('error', error)
      setIsAPISuccess(true)

    } finally {
      setIsAPISuccess(true)
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchData = null
    }
  }, [
    gridData,
    isAPISuccess
  ])

  return (
    <>
      <Helmet>
        <title>ITM - {t('800000142')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000142')}
              </Title>
              <QaQcTitleAction
                fetchData={fetchData}
                handleRestSheet={handleRestSheet}
                handleSaveData={handleSaveData}
                setModalDeleteConfirm={setModalDeleteConfirm}
              />
            </div>
          </div>

          <div className="col-start-1 flex gap-3 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-hidden">
            <Splitter className="w-full h-full">
              <SplitterPanel size={60} minSize={20}>
                <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
                  <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
                    <TableQaQcTitle
                      dataQcUmTitleName={dataQcUmTitleName}
                      dataInputTypeName={dataInputTypeName}
                      dataSMAQLLevelName={dataSMAQLLevelName}
                      setSelection={setSelection}
                      selection={selection}
                      showSearch={showSearch}
                      setShowSearch={setShowSearch}
                      setAddedRows={setAddedRows}
                      addedRows={addedRows}
                      setEditedRows={setEditedRows}
                      onCellClicked={onCellClicked}
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
                      canEdit={canEdit}
                    />
                  </div>
                </div>
              </SplitterPanel>
              <SplitterPanel size={40} minSize={20}>
                <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
                  <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
                    <TableQaItemBad
                      dataBadKindName={dataBadKindName}
                      dataBadReasonName={dataBadReasonName}
                      setSelection={setSelectionB}
                      selection={selectionB}
                      onCellClicked={onCellClickedB}
                      setShowSearch={setShowSearch}
                      showSearch={showSearch}
                      setEditedRows={setEditedRows}
                      setOnSelectRow={setOnSelectRow}
                      setOpenHelp={setOpenHelp}
                      openHelp={openHelp}
                      setGridData={setGridDataB}
                      gridData={gridDataB}
                      handleRestSheet={handleRestSheet}
                      numRows={numRowsB}
                      handleRowAppend={handleRowAppendB}
                      setCols={setColsB}
                      cols={colsB}
                      defaultCols={defaultColsB}
                      canEdit={canEdit}
                    />
                  </div>
                </div>
              </SplitterPanel>
            </Splitter>
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      />
      <ModalSheetDelete
        modalOpen={modalDeleteConfirm}
        setModalOpen={setModalDeleteConfirm}
        confirm={handleDeleteData}
      />
    </>
  )
}
