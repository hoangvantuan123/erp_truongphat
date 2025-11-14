import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import { Input, Typography, Row, Col, message, Form } from 'antd'
const { Title, Text } = Typography
import { debounce, indexOf } from 'lodash'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { filterAndSelectColumnsA } from '../../../utils/filterA'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateCheckColumns } from '../../../utils/validateColumns'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { PostA } from '../../../features/basic/lgWHItem/postA'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import LgWHItemAction from '../../components/actions/basic/lgWHItemAction'
import LgWhItemQuery from '../../components/query/basic/LgWHItemQuery'
import TableSDAWHCaseItem from '../../components/table/basic/tableSDAWHCaseItem'
import TableWHItem from '../../components/table/basic/tableWHItem'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { GetSDAWHCaseItemQuery } from '../../../features/warehouse/getSDAWHCaseItemQuery'
import { GetSDAWHCaseQuery } from '../../../features/warehouse/getSDAWHItemQuery'
import { PostU } from '../../../features/basic/lgWHItem/postU'
import ErrorListModal from '../default/errorListModal'
import { PostD } from '../../../features/basic/lgWHItem/postD'
import WarningModal from '../default/warningModal'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
export default function LGWHItem({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests,
}) {
  const loadingBarRef = useRef(null)
  const { t } = useTranslation()
  const [totalQuantity, setTotalQuantity] = useState(0);
  const defaultColsView = useMemo(() => [
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
    { title: t('21742'), id: 'WHSeq', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: false, icon: GridColumnIcon.HeaderRowID },
    { title: t('773'), id: 'WHName', kind: 'Text', readonly: true, width: 200, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString },
    { title: t('3'), id: 'FactUnitName', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString },
    { title: t('850000044'), id: 'FactUnit', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: false, icon: GridColumnIcon.HeaderRowID },
    { title: t('2'), id: 'BizUnitName', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString },
    { title: t('7338'), id: 'BizUnit', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: false, icon: GridColumnIcon.HeaderRowID },
    { title: t('784'), id: 'WHKindName', kind: 'Text', readonly: true, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString },
    { title: t('520'), id: 'MngDeptName', kind: 'Text', readonly: true, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString },
    { title: t('3099'), id: 'MngDeptSeq', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: false, icon: GridColumnIcon.HeaderRowID },
    { title: t('6'), id: 'CommissionCustName', kind: 'Text', readonly: true, width: 200, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString },
  ], [t]);

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
          hint: '',
          targetColumn: 0,
          disabled: false,
        },
      },
      {
        title: t('1786'),
        id: 'ItemName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
        },
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2091'),
        id: 'ItemSeq',
        kind: 'Text',
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
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
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
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('602'),
        id: 'UnitName',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1676'),
        id: 'SafetyQty',
        kind: 'Number',
        readonly: false,
        width: 180,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        trailingRowOptions: {
          hint: t('1079') + totalQuantity,
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,

          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '600 13px',
          },
        },
      },
      {
        title: t('373'),
        id: 'Location',
        kind: 'Text',
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
        title: t('21742'),
        id: 'WHSeq',
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
        title: t('10048143'),
        id: 'ItemSeqOld',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t, totalQuantity],
  )

  const [loading, setLoading] = useState(false)
  const [gridData, setGridData] = useState([])
  const [gridDataItem, setGridDataItem] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
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
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [lastClickedCellItem, setLastClickedCellItem] = useState(null)
  const [addedRows, setAddedRows] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [editedRowsItem, setEditedRowsItem] = useState([])

  const [clickedRowData, setClickedRowData] = useState(null)
  const [clickedRowDataItem, setClickedRowDataItem] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [isMinusClickedItem, setIsMinusClickedItem] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [numRowsItem, setNumRowsItem] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [isCellSelectedItem, setIsCellSelectedItem] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [onSelectRowItem, setOnSelectRowItem] = useState([])

  const [dataUnit, setDataUnit] = useState([])
  const [dataError, setDataError] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [productCatalog, setProductCatalog] = useState([])
  const [onConfirm, setOnConfirm] = useState(false)
  const [onDiscard, setOnDiscard] = useState(false)
  const calculateTotalQuantity = () => {
    const total = gridDataItem.reduce(
      (sum, item) => sum + (item.SafetyQty || 0),
      0,
    )
    setTotalQuantity(total)
  }
  useEffect(() => {
    calculateTotalQuantity()
  }, [gridDataItem])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_LG_WH_CASE_ITEM',
      defaultColsView.filter((col) => col.visible),
    ),
  )
  const [colsE, setColsE] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_LG_WH_ITEM',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setColsE(defaultCols.filter((col) => col.visible))
  }, [defaultCols])

  const [searchBizUnit, setSearchBizUnit] = useState(0)
  const [searchFactUnit, setSearchFactUnit] = useState(0)
  const [searchSpec, setSearchSpec] = useState(null)
  const [searchItemNo, setSearchItemNo] = useState(null)
  const [searchItemName, setSearchItemName] = useState(null)
  const [searchWHName, setSearchWHName] = useState(null)

  const [searchProCataLog, setSearchProCataLog] = useState(0)
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const [clickCellName, setClickCellName] = useState([])
  const [itemName, setItemName] = useState([])
  const fieldsToTrack = ['ItemName']
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridDataItem, fieldsToTrack)

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
    if (!gridDataItem || !gridDataItem.some((item) => item.Status === 'A')) {
      const emptyData = generateEmptyData(0, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridDataItem(updatedEmptyData)
      setNumRowsItem(emptyData.length)
      return
    }
  }, [])
  useEffect(() => {
    cancelAllRequests()
    message.destroy()
  }, [])
  const fetchData = useCallback(async () => {
    if (editedRowsItem.length > 0) {
      setIsModalWarning(true)
      return
    }
    if (controllers.current.fetchDataController) {
      controllers.current.fetchDataController.abort()
      controllers.current.fetchDataController.current = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchDataController = controller

    resetTable()
    setLoading(true)
    try {
      const data = [
        {
          BizUnit: searchBizUnit,
          FactUnit: searchFactUnit,
          WHName: searchWHName,
          AssetSeq: searchProCataLog,
          ItemName: searchItemName,
          ItemNo: searchItemNo,
          Spec: searchSpec,
        },
      ]

      const response = await GetSDAWHCaseItemQuery(data, signal)
      const fetchedData = response.data.data || []
      setGridData(fetchedData)

      setNumRows(fetchedData.length)
    } catch (error) {
      setGridData([])
      setNumRows(0)
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchDataController = null
    }
  }, [
    searchBizUnit,
    searchFactUnit,
    searchWHName,
    searchProCataLog,
    searchItemName,
    searchItemNo,
    searchSpec,
    editedRowsItem,
  ])

  const fetchDataItem = useCallback(
    async (rowData) => {
      if (controllers.current.fetchDataItem) {
        controllers.current.fetchDataItem.abort()
        controllers.current.fetchDataItem = null
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const controller = new AbortController()
      const signal = controller.signal

      controllers.current.fetchDataItem = controller

      setLoading(true)
      try {
        const data = [
          {
            BizUnit: searchBizUnit,
            FactUnit: searchFactUnit,
            WHSeq: rowData?.WHSeq || '',
            AssetSeq: searchProCataLog,
            ItemName: searchItemName,
            ItemNo: searchItemNo,
            Spec: searchSpec,
          },
        ]

        const response = await GetSDAWHCaseQuery(data, signal)

        const fetchedData = response.data.data || []
        const emptyData = generateEmptyData(50, defaultCols)
        const combinedData = [...fetchedData, ...emptyData]
        const updatedData = updateIndexNo(combinedData)
        setGridDataItem(updatedData)
        setNumRowsItem(fetchedData.length + emptyData.length)
      } catch (error) {
        const emptyData = generateEmptyData(50, defaultCols)
        setGridDataItem(emptyData)
        setNumRowsItem(emptyData.length)
      } finally {
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setLoading(false)
        controllers.current.fetchDataItem = null
      }
    },
    [
      searchBizUnit,
      searchFactUnit,
      searchProCataLog,
      searchItemName,
      searchItemNo,
      searchSpec,
    ],
  )


  const fetchCodeHelpData = useCallback(async () => {
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
        codeHelpResponse,
        getCodeHelpComboProductCatalog,
        getCodeHelpItemName,
      ] = await Promise.all([
        GetCodeHelpComboVer2('', 6, 60001, 1, '%', '', '', '', '', signal),
        GetCodeHelpComboVer2('', 6, 10012, 1, '%', '', '', '', '', signal),
        GetCodeHelpVer2(18001, '', '', '', '', '', '', 1, 50, '', 0, 0, 0, signal),
      ])
      setDataUnit(codeHelpResponse?.data || [])
      setProductCatalog(getCodeHelpComboProductCatalog?.data || [])
      setItemName(getCodeHelpItemName?.data || [])
    } catch (error) {
      setDataUnit([])
      setProductCatalog([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpData = null
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

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const getSelectedRowsItem = () => {
    const selectedRows = selectionItem.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridDataItem[i]) {
          gridDataItem[i]['IdxNo'] = i + 1
          rows.push(gridDataItem[i])
        }
      }
    })

    return rows
  }

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning(t('850000045'))
        return
      }
      onRowAppended(
        colsE,
        setGridDataItem,
        setNumRowsItem,
        setAddedRows,
        numRowsToAdd,
      )
    },
    [colsE, setGridDataItem, setNumRowsItem, setAddedRows, numRowsToAdd],
  )

  /* HOOKS KEY */
  useKeydownHandler(isCellSelected, setOpenHelp)

  const onCellClicked = useCallback(
    async (cell, event) => {
      if (editedRowsItem.length > 0) {
        setIsModalWarning(true)
        return
      }

      if (selection.rows.items.length === 0) {
        setClickedRowData(null)
        setGridDataItem([])
        return
      }

      const selectedRows = getSelectedRows()
      if (selectedRows.length > 0) {
        setClickedRowData(selectedRows[0])
        await fetchDataItem(selectedRows[0])
      }
    },
    [editedRowsItem, gridData, fetchDataItem, selection],
  )

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

  const handleOnDiscard = () => {
    setIsModalWarning(false)
    setEditedRowsItem([])
    setGridDataItem([])
    setClickedRowData(null)
    setOnDiscard(true)
    resetTable()
  }

  const onCellClickedItem = (cell, event) => {
    if (cell.length >= 2 && cell[0] === 1) {
      setIsCellSelectedItem(true)
    } else {
      setIsCellSelectedItem(false)
      setIsMinusClickedItem(false)
      setLastClickedCellItem(null)
      setClickedRowDataItem(null)
    }

    if (
      lastClickedCellItem &&
      lastClickedCellItem[0] === cell[0] &&
      lastClickedCellItem[1] === cell[1]
    ) {
      setIsCellSelectedItem(false)
      setIsMinusClickedItem(false)
      setLastClickedCellItem(null)
      setClickedRowDataItem(null)
      return
    }

    let rowIndex

    if (cell[0] !== -1) {
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClickedItem(true)
    } else {
      rowIndex = cell[0]
      setIsMinusClickedItem(false)
    }

    if (rowIndex >= 0 && rowIndex < gridData.length) {
      const rowData = gridData[rowIndex]
      setLastClickedCellItem(cell)
    }
  }
  const handleSaveData = useCallback(async () => {
    togglePageInteraction(true)
    if (canCreate === false) {
      message.warning(t('850000045'))
      togglePageInteraction(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      return
    }
    const requiredColumns = ['ItemName']
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const columnsU = [
      'ItemName',
      'ItemSeq',
      'ItemNo',
      'Spec',
      'UnitName',
      'SafetyQty',
      'Location',
      'WHSeq',
      'ItemSeqOld',
      'IdxNo',
    ]
    const columnsA = [
      'ItemName',
      'ItemSeq',
      'ItemNo',
      'Spec',
      'UnitName',
      'SafetyQty',
      'Location',
      'WHSeq',
      'IdxNo',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }

    const missingIds = findMissingIds(lastEntry)
    setEmptyWordIds(missingIds)
    const resulU = filterAndSelectColumns(gridDataItem, columnsU, 'U')
    const resulA = filterAndSelectColumnsA(gridDataItem, columnsA, 'A')
    if (missingIds.length > 0) {
      message.warning(
        t('850000046'),
      )
      togglePageInteraction(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      return
    }

    const validationMessage = validateCheckColumns(
      [...resulU, ...resulA],
      [...columnsU, ...columnsA],
      requiredColumns,
    )

    if (validationMessage !== true) {
      message.warning(validationMessage)
      togglePageInteraction(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      return
    }

    if (isSent) return
    if (!clickedRowData) {
      message.warning(t('850000047'))
      togglePageInteraction(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      return
    }
    setIsSent(true)

    if (resulA.length > 0 || resulU.length > 0) {
      try {
        const promises = []

        if (resulA.length > 0) {
          promises.push(PostA(resulA))
        }

        if (resulU.length > 0) {
          promises.push(PostU(resulU))
        }

        const results = await Promise.all(promises)

        const updateGridData = (newData) => {
          setGridDataItem((prevGridData) => {
            const updatedGridData = prevGridData.map((item) => {
              const matchingData = newData.find(
                (data) => data.IDX_NO === item.IdxNo,
              )

              if (matchingData) {
                return {
                  ...matchingData,
                  IdxNo: matchingData.IDX_NO,
                }
              }
              return item
            })

            const updatedData = updateIndexNo(updatedGridData)
            return updatedData
          })
        }

        results.forEach((result, index) => {
          if (result.data.success) {
            const newData = result.data.data
            setIsLoading(false)
            setIsSent(false)
            setEditedRowsItem([])
            updateGridData(newData)
            resetTableItem()
            togglePageInteraction(false)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
          } else {
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setIsModalVisible(true)
            togglePageInteraction(false)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
          }
        })
      } catch (error) {
        setIsLoading(false)
        setIsSent(false)
        togglePageInteraction(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        message.error(error.message || t('870000010'))
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      togglePageInteraction(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      message.warning(t('870000003'))
    }
  }, [editedRowsItem, gridDataItem, clickedRowData])

  const handleDeleteDataSheet = useCallback(
    (e) => {
      togglePageInteraction(true)
      if (canDelete === false) {
        message.warning(t('870000002'))
        togglePageInteraction(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        return
      }
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      if (isDeleting) {
        togglePageInteraction(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        return
      }

      const selectedRows = getSelectedRowsItem()
      const idsWithStatusD = selectedRows
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row, index) => {
          row.Status = 'D'
          return row
        })
      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
      if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
        message.warning(t('870000011'))
        setModalOpen(false)
        return
      }
      if (idsWithStatusD.length > 0) {
        setIsDeleting(true)
        PostD(idsWithStatusD)
          .then((response) => {
            message.destroy()
            if (response.data.success) {
              const idsWithStatusDList = idsWithStatusD.map(
                (row) => row.ItemSeq,
              )
              const remainingRows = gridDataItem.filter(
                (row) => !idsWithStatusDList.includes(row.ItemSeq),
              )
              const updatedEmptyData = updateIndexNo(remainingRows)
              setGridDataItem(updatedEmptyData)
              setNumRowsItem(remainingRows.length)
              resetTableItem()
              setModalOpen(false)
            } else {
              setDataError(response.data.errors)
              setIsModalVisible(true)

              message.error(response.data.message || t('870000012'))
            }
          })
          .catch((error) => {
            message.destroy()
            message.error(t('870000013'))
          })
          .finally(() => {
            setIsDeleting(false)
            togglePageInteraction(false)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridDataItem.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        const remainingEditedRows = editedRowsItem.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow?.Id),
        )
        togglePageInteraction(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setModalOpen(false)
        const updatedDataEditedRows = updateIndexNo(remainingEditedRows)
        const updatedRemainingRows = updateIndexNo(remainingRows)
        setEditedRowsItem(updatedDataEditedRows)
        setGridDataItem(updatedRemainingRows)
        setNumRowsItem(remainingRows.length)
        resetTableItem()
      }
    },
    [
      canDelete,
      gridDataItem,
      selectionItem,
      editedRowsItem,
      isDeleting,
      clickedRowData,
    ],
  )

  const handleRestSheet = useCallback(async () => {
    fetchDataItem(clickedRowData)
    setEditedRowsItem([])
    resetTableItem()
  }, [defaultCols, gridDataItem, clickedRowData])

  return (
    <>
      <Helmet>
        <title>HPM - {t('850000048')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex p-2 items-end justify-end">

              <LgWHItemAction
                data={gridDataItem}
                clickedRowData={clickedRowData}
                setModalOpen={setModalOpen}
                fetchDataItem={fetchDataItem}
                handleRestSheet={handleRestSheet}
                fetchDataQuery={fetchData}
                openModal={openModal}
                handleDeleteDataSheet={handleDeleteDataSheet}
                handleSaveData={handleSaveData}
                setNumRowsToAdd={setNumRowsToAdd}
                numRowsToAdd={numRowsToAdd}
                setClickCount={setClickCount}
                clickCount={clickCount}
                handleRowAppend={handleRowAppend}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  {t('850000014')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <LgWhItemQuery
                  setSearchBizUnit={setSearchBizUnit}
                  searchWHName={searchWHName}
                  setSearchWHName={setSearchWHName}
                  searchItemName={searchItemName}
                  setSearchItemName={setSearchItemName}
                  searchItemNo={searchItemNo}
                  setSearchItemNo={setSearchItemNo}
                  searchSpec={searchSpec}
                  setSearchSpec={setSearchSpec}
                  setSearchFactUnit={setSearchFactUnit}
                  setSearchProCataLog={setSearchProCataLog}
                  dataUnit={dataUnit}
                  productCatalog={productCatalog}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 border-t overflow-hidden relative">
            <Splitter className="w-full h-full">
              <SplitterPanel size={50} minSize={10}>
                <TableSDAWHCaseItem
                  onCellClicked={onCellClicked}
                  setSelection={setSelection}
                  selection={selection}
                  showSearch={showSearch}
                  setShowSearch={setShowSearch}
                  onSelectRow={onSelectRow}
                  openHelp={openHelp}
                  setOpenHelp={setOpenHelp}
                  setOnSelectRow={setOnSelectRow}
                  setIsCellSelected={setIsCellSelected}
                  isCellSelected={isCellSelected}
                  setGridData={setGridData}
                  gridData={gridData}
                  setNumRows={setNumRows}
                  numRows={numRows}
                  setCols={setCols}
                  cols={cols}
                  defaultCols={defaultColsView}
                  dataUnit={dataUnit}
                  canCreate={canCreate}
                  canEdit={canEdit}
                />
              </SplitterPanel>
              <SplitterPanel size={50} minSize={20}>
                <div className=" h-24 w-full  border-l border-b bg-white p-3">
                  <Form layout="vertical">
                    <Row className="gap-4 flex items-center">
                      <Col className="w-[50%]">
                        <Form.Item
                          label={
                            <span className="uppercase text-[9px]">
                              {t('850000049')}
                            </span>
                          }
                          className="mb-0 "
                        >
                          <Input
                            placeholder=""
                            size="middle"
                            value={clickedRowData?.WHName}
                            readOnly
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <TableWHItem
                  onCellClicked={onCellClickedItem}
                  setSelection={setSelectionItem}
                  selection={selectionItem}
                  showSearch={showSearchItem}
                  setShowSearch={setShowSearchItem}
                  setAddedRows={setAddedRows}
                  addedRows={addedRows}
                  setEditedRows={setEditedRowsItem}
                  editedRows={editedRowsItem}
                  setNumRowsToAdd={setNumRowsToAdd}
                  clickCount={clickCount}
                  numRowsToAdd={numRowsToAdd}
                  numRows={numRowsItem}
                  onSelectRow={onSelectRow}
                  openHelp={openHelp}
                  setOpenHelp={setOpenHelp}
                  setOnSelectRowItem={setOnSelectRowItem}
                  setIsCellSelected={setIsCellSelectedItem}
                  isCellSelected={isCellSelectedItem}
                  setGridData={setGridDataItem}
                  gridData={gridDataItem}
                  setNumRows={setNumRowsItem}
                  setCols={setColsE}
                  handleRowAppend={handleRowAppend}
                  cols={colsE}
                  defaultCols={defaultCols}
                  dataUnit={dataUnit}
                  canCreate={canCreate}
                  canEdit={canEdit}
                  itemName={itemName}
                  clickedRowData={clickedRowData}
                  handleRestSheet={handleRestSheet}
                />
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
