import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import {
  Input,
  Space,
  Table,
  Typography,
  message,
  Flex,
  Splitter,
  Button,
} from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateColumns } from '../../../utils/validateColumns'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import WarehousRegistrationAction from '../../components/actions/basic/warehousRegistrationAction'
import WarehousRegistrationQuery from '../../components/query/basic/warehousRegistrationQuery'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetSDAWHMainQueryWEB } from '../../../features/warehouse/getSDAWHMainQueryWEB'
import TableWarehousRegistration from '../../components/table/basic/tableWarehousRegistration'
import { PostSDAWHSubCreate } from '../../../features/warehouse/postSDAWhSubCreate'
import { PostSDAWHAutoDelete } from '../../../features/warehouse/postSDAWhAutoDelete'
import ErrorListModal from '../default/errorListModal'
import { PostSDAWHAutoUpdate } from '../../../features/warehouse/postSDAWhAutoUpdate'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
const columnsError = [
  {
    title: 'Tên kho',
    dataIndex: 'whName',
    key: 'whName',
  },
  {
    title: 'Đơn vị kinh doanh',
    dataIndex: 'bizUnitName',
    key: 'bizUnitName',
  },
  {
    title: 'Kết quả',
    dataIndex: 'result',
    key: 'result',
  },
]

export default function WarehousRegistration({
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
        title: t('7338'),
        id: 'BizUnit',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: t("2"),
        id: 'BizUnitName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
        },
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('6138'),
        id: 'FactUnit',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: t('3'),
        id: 'FactUnitName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('3100'),
        id: 'WHName',
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
      },
      {
        title: t('777'),
        id: 'WHKindName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
        },
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('520'),
        id: 'MngDeptName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2830'),
        id: 'CommissionCustSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: t('6'),
        id: 'CommissionCustName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('3238'),
        id: 'IsWHEmp',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('3239'),
        id: 'IsWHItem',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('34813'),
        id: 'RegionName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2275'),
        id: 'ScopeName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('1345'),
        id: 'WHAddress',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('3159'),
        id: 'IsNotUse',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('3223'),
        id: 'SortSeq',
        kind: 'Number',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: 'WMSCode',
        id: 'WMSCode',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderCode,
      },
      {
        title: 'UMCostWHGroup',
        id: 'UMCostWHGroup',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('5494'),
        id: 'MngDeptSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: 'SMWHKind',
        id: 'SMWHKind',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('49701'),
        id: 'UMRegion',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('49701'),
        id: 'UMScope',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('16969'),
        id: 'IsNotMinusCheck',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
    ],
    [t],
  )
  const [loading, setLoading] = useState(false)
  const [loadingRoot, setLoadingRoot] = useState(false)
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
      'S_ERP_COLS_PAGE_WARE_REGI',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [searchBizUnit, setSearchBizUnit] = useState(0)
  const [searchFactUnit, setSearchFactUnit] = useState(0)
  const [searchNaWare, setSearchNaWare] = useState(0)
  const [searchWHName, setSearchWHName] = useState('')
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const fieldsToTrack = [
    'BizUnit',
    'BizUnitName',
    'FactUnit',
    'FactUnitName',
    'CostWHName',
    'SMWHKind',
    'WHKindName',
    'MngDeptName',
    'CommissionCustName',
    'IsWHEmp',
    'IsWHItem',
    'UMRegion',
    'RegionName',
    'WHAddress',
    'IsNotUse',
    'SortSeq',
    'WMSCode',
    'IsNotMinusCheck',
    'UMCostWHGroup',
    'WHName',
    'MngDeptSeq',
    'CommissionCustSeq',
    'UMScope',
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)
  const [abortController, setAbortController] = useState(null)
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
    const emptyData = generateEmptyData(50, defaultCols)
    const updatedEmptyData = updateIndexNo(emptyData)
    setGridData(updatedEmptyData)
    setNumRows(emptyData.length)
  }, [defaultCols])

  const fetchData = useCallback(async () => {
    if (controllers.current.fetchDataController) {
      controllers.current.fetchDataController.abort()
      controllers.current.fetchDataController = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchDataController = controller

    try {
      const data = [
        {
          BizUnit: searchBizUnit,
          FactUnit: searchFactUnit,
          SMWHKind: searchNaWare,
          WHName: searchWHName,
        },
      ]

      const response = await GetSDAWHMainQueryWEB(data, signal)

      if (response.data.success) {
        const fetchedData = response.data.data || []
        const emptyData = generateEmptyData(50, defaultCols)
        const combinedData = [...fetchedData, ...emptyData]
        const updatedData = updateIndexNo(combinedData)

        setGridData(updatedData)
        setNumRows(fetchedData.length + emptyData.length)
      } else {
        message.error(response.message || t('870000014'));
      }
    } catch (error) {
      if (error.name === 'AbortError') {
      } else {
        const emptyData = generateEmptyData(50, defaultCols)
        const updatedEmptyData = updateIndexNo(emptyData)
        setGridData(updatedEmptyData)
        setNumRows(emptyData.length)
      }
    } finally {
      controllers.current.fetchDataController = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [searchBizUnit, searchFactUnit, searchNaWare, defaultCols, searchWHName])

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
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
        codeHelpResponse,
        codeHelpDataNaWareResponse,
        codeHelpQueryMngDeptName,
        codeHelpQueryCommissionCust,
        codeHelpQueryUMRegion,
        codeHelpQueryScope,
      ] = await Promise.all([
        GetCodeHelpComboVer2('', 6, 60001, 1, '%', '', '', '', '', signal),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '8002', '1001', '1', '', signal),
        GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
        GetCodeHelpVer2(17001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
        GetCodeHelpVer2(
          19999,
          '',
          '8001',
          '',
          '',
          '',
          '',
          1,
          0,
          '',
          0,
          0,
          0,
          signal,
        ),
        GetCodeHelpVer2(
          19999,
          '',
          '8039',
          '',
          '',
          '',
          '',
          1,
          0,
          '',
          0,
          0,
          0,
          signal,
        ),
      ])

      setDataUnit(codeHelpResponse?.data || [])
      setDataNaWare(codeHelpDataNaWareResponse?.data || [])
      setDataMngDeptName(codeHelpQueryMngDeptName?.data || [])
      setDataCommissionCust(codeHelpQueryCommissionCust?.data || [])
      setDataUMRegion(codeHelpQueryUMRegion?.data || [])
      setDataScopeName(codeHelpQueryScope?.data || [])
    } catch (error) {
      setDataUnit([])
      setDataNaWare([])
      setDataMngDeptName([])
      setDataCommissionCust([])
      setDataUMRegion([])
      setDataScopeName([])
    } finally {
      setLoading(false)
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
        message.warning(t('850000045'))
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

  const handleSaveData = useCallback(async () => {
    if (canCreate === false) {
      message.warning(t('870000015'))
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      return
    }
    const requiredColumns = ['BizUnitName', 'WHKindName', 'WHName']

    const columnsU = [
      'WHSeq',
      'BizUnit',
      'BizUnitName',
      'FactUnit',
      'FactUnitName',
      'CostWHName',
      'SMWHKind',
      'WHKindName',
      'MngDeptName',
      'CommissionCustName',
      'IsWHEmp',
      'IsWHItem',
      'UMRegion',
      'RegionName',
      'WHAddress',
      'IsNotUse',
      'SortSeq',
      'WMSCode',
      'IsNotMinusCheck',
      'UMCostWHGroup',
      'WHName',
      'MngDeptSeq',
      'CommissionCustSeq',
      'UMScope',
      'ScopeName',
      'Id',
      'IdxNo',
    ]
    const columnsA = [
      'BizUnit',
      'BizUnitName',
      'FactUnit',
      'FactUnitName',
      'CostWHName',
      'SMWHKind',
      'WHKindName',
      'MngDeptName',
      'CommissionCustName',
      'IsWHEmp',
      'IsWHItem',
      'UMRegion',
      'RegionName',
      'WHAddress',
      'IsNotUse',
      'SortSeq',
      'WMSCode',
      'IsNotMinusCheck',
      'UMCostWHGroup',
      'WHName',
      'MngDeptSeq',
      'CommissionCustSeq',
      'UMScope',
      'ScopeName',
      'Id',
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
    const resulU = filterAndSelectColumns(gridData, columnsU, 'U')
    const resulA = filterAndSelectColumns(gridData, columnsA, 'A')
    if (missingIds.length > 0) {
      message.warning(
        t('870000016')
      )
      return
    }

    if (
      !validateColumns(resulU, requiredColumns) &&
      !validateColumns(resulA, requiredColumns)
    ) {
      message.warning(
        t('870000017')
      )
      return
    }
    if (isSent) return
    setIsSent(true)
    if (resulA.length > 0 || resulU.length > 0) {
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      try {
        const promises = []

        if (resulA.length > 0) {
          promises.push(PostSDAWHSubCreate(resulA))
        }

        if (resulU.length > 0) {
          promises.push(PostSDAWHAutoUpdate(resulU))
        }

        const results = await Promise.all(promises)
        const updateGridData = (newData) => {
          setGridData((prevGridData) => {
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
          if (result.data.success === true) {
            const newData = result.data.data
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            updateGridData(newData)
            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            setAddedRows([])
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
          } else {
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setIsModalVisible(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            message.error(t('870000010'))
          }
        })
      } catch (error) {
        setIsLoading(false)
        setIsSent(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        message.error(error.message || t('870000010'))
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      message.warning(t('870000003'))
    }
  }, [gridData])

  const handleDeleteDataSheet = useCallback(
    (e) => {
      setModalOpen(false)
      togglePageInteraction(true)
      if (canDelete === false) {
        togglePageInteraction(false);
        message.warning(t('870000018'))
        return
      }
      if (isDeleting) {
        togglePageInteraction(false);
        message.warning(t('870000019'))
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
        message.warning(t('870000020'))
        setModalOpen(false)
        togglePageInteraction(false)
        return
      }

      if (idsWithStatusD.length > 0) {
        setIsDeleting(true)
        PostSDAWHAutoDelete(idsWithStatusD)
          .then((response) => {
            message.destroy()
            if (response.data.success) {
              const remainingRows = gridData.filter(
                (row) =>
                  !idsWithStatusD.some(
                    (deletedRow) => deletedRow.WHSeq === row.WHSeq,
                  ),
              )
              const updatedData = updateIndexNo(remainingRows)
              setGridData(updatedData)
              setNumRows(updatedData.length)
              resetTable()
              togglePageInteraction(false)
              setModalOpen(false)
              message.success(t('870000021'))
            } else {
              togglePageInteraction(false)
              setDataError(response.data.errors)
              setIsModalVisible(true)
              message.error(response.data.message || t('870000022'))
            }
          })
          .catch((error) => {
            message.destroy()
            message.error(t('870000023'))
          })
          .finally(() => {
            setIsDeleting(false)
            togglePageInteraction(false)
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
        const updatedDataEditedRows = updateIndexNo(remainingEditedRows);
        const updatedRemainingRows = updateIndexNo(remainingRows);
        setEditedRows(updatedDataEditedRows)
        setGridData(updatedRemainingRows)
        setNumRows(remainingRows.length)
        resetTable()

        togglePageInteraction(false)
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
        const emptyData = generateEmptyData(50, defaultCols)
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
        <title>HPM - {t('850000050')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex p-2 items-end justify-end">

              <WarehousRegistrationAction
                setModalOpen={setModalOpen}
                handleRestSheet={handleRestSheet}
                fetchDataQuery={fetchData}
                fetchCodeHelpData={fetchCodeHelpData}
                openModal={openModal}
                handleDeleteDataSheet={handleDeleteDataSheet}
                handleSaveData={handleSaveData}
                setNumRowsToAdd={setNumRowsToAdd}
                numRowsToAdd={numRowsToAdd}
                setClickCount={setClickCount}
                clickCount={clickCount}
                handleRowAppend={handleRowAppend}
                isDeleting={isDeleting}
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
                <WarehousRegistrationQuery
                  setSearchWHName={setSearchWHName}
                  searchWHName={searchWHName}
                  setSearchBizUnit={setSearchBizUnit}
                  setSearchFactUnit={setSearchFactUnit}
                  setSearchNaWare={setSearchNaWare}
                  dataUnit={dataUnit}
                  setDataUnit={setDataUnit}
                  dataNaWare={dataNaWare}
                  setDataNaWare={setDataNaWare}
                  dataMngDeptName={dataMngDeptName}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full border-t h-full  overflow-auto">
            <TableWarehousRegistration
              handleRestSheet={handleRestSheet}
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
        columns={columnsError}
      />
      <ModalSheetDelete
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        confirm={handleDeleteDataSheet}
      />
    </>
  )
}
