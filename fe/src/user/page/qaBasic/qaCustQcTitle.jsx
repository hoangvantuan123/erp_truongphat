import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import { Col, Form, Input, Row, Typography, message } from 'antd'
const { Title, Text } = Typography
import { debounce, set } from 'lodash'
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
import { DeleteQaQcTitle } from '../../../features/qa-basic/qaqc-title/deleteQaQcTitle'
import { DeleteQcItemBad } from '../../../features/qa-basic/qaqc-title/deleteQcItemBad'
import { updateEditedRows } from '../../components/sheet/js/updateEditedRows'
import TableQaCustQcTitleLeft from '../../components/table/qaBasic/tableQaCustQcTitleLeft'
import QaCustQcTitleRightQuery from '../../components/query/qaBasic/qaCustQcTitleRightQuery'
import QaCustQcTitleBottomQuery from '../../components/query/qaBasic/qaCustQcTitleBottomQuery'
import TableQaCustQcTitleBottom from '../../components/table/qaBasic/tableQaCustQcTitleBottom'
import TableQaCustQcTitleRight from '../../components/table/qaBasic/tableQaCustQcTitleRight'
import { GetItemByCust } from '../../../features/qa-basic/qa-cust-qc-type/getItemByCust'
import { GetQcTitleByItem } from '../../../features/qa-basic/qa-cust-qc-type/getQcTitleByItem'
import { SearchQaCustQcTitlePage } from '../../../features/qa-basic/qa-cust-qc-type/searchQaCustQcTitlePage'
import { CUDQaCustQcTitleBy } from '../../../features/qa-basic/qa-cust-qc-type/AuQaCustQcTitle'
import QaCustQcTitleAction from '../../components/actions/qa-basic/qaCustQcTitleAction'

export default function QaItemClassQc({
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
        title: t('6'),
        id: 'CustName',
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
        title: t('694'),
        id: 'CustSeq',
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
        title: t('324'),
        id: 'SMQCTypeName',
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
        title: t('2127'),
        id: 'SMQCType',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
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
        title: t('2090'),
        id: 'ItemName',
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
        title: t('2107'),
        id: 'ItemNo',
        kind: 'Custom',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      

      {
        title: t('2107'),
        id: 'ItemSeq',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('551'),
        id: 'Spec',
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
        title: t('475'),
        id: 'SMTestMethodName',
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
        title: t('11744'),
        id: 'SMTestMethod',
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
        title: t('1520'),
        id: 'SMSamplingStdName',
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
        title: t('14828'),
        id: 'SMSamplingStd',
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
      {
        title: t('10845'),
        id: 'SMAQLLevelName',
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
        title: t('13935'),
        id: 'SMAQLLevel',
        kind: 'Custom',
        readonly: false,
        width: 250,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('13936'),
        id: 'SMAQLStrictName',
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
        title: t('10847'),
        id: 'SMAQLStrict',
        kind: 'Custom',
        readonly: false,
        width: 250,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('808'),
        id: 'SMAQLPoint',
        kind: 'Custom',
        readonly: false,
        width: 250,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('808'),
        id: 'SMAQLPointName',
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
        title: t('191'),
        id: 'StartDate',
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
        title: t('232'),
        id: 'EndDate',
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
    ],
    [t],
  )

  const defaultColsBottom = useMemo(
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
        title: t('476'),
        id: 'UMQCTitleName',
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
        title: t('3680'),
        id: 'UMQCTitleSeq',
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
        title: t('3673'),
        id: 'TestingCondition',
        kind: 'Text',
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
        title: t('5390'),
        id: 'TargetLevel',
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

      {
        title: t('3663'),
        id: 'UMQCUnitName',
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
        title: t('1928'),
        id: 'SMInputTypeName',
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
        title: t('6390'),
        id: 'UpperLimit',
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
        title: t('10459'),
        id: 'LowerLimit',
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

  const [selectionBottom, setSelectionBottom] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [editedRowsBottom, setEditedRowsBottom] = useState([])
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
  const [onSelectRowBottom, setOnSelectRowBottom] = useState([])
  const [dataError, setDataError] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QA_CUST_QC_LEFT',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)

  // data code help
  const [dataCust, setDataCust] = useState([])
  const [dataSmQcTypeName, setDataSmQcTypeName] = useState([])
  const [dataItemName, setDataItemName] = useState([])
  const [dataSpec, setDataSpec] = useState([])
  const [dataSmTestMethodName, setDataSmTestMethodName] = useState([])
  const [dataSMSamplingStdName, setDataSMSamplingStdName] = useState([])
  const [dataSMAQLLevelName, setDataSMAQLLevelName] = useState([])
  const [dataSMAQLStrictName, setDataSMAQLStrictName] = useState([])
  const [dataSmAcPointName, setDataSmAcPointName] = useState([])
  const [dataQcUmTitleName, setDataQcUmTitleName] = useState([])

  // Query
  const [CustName, setCustName] = useState('')
  const [CustSeq, setCustSeq] = useState('')
  const [ItemNo, setItemNo] = useState('')
  const [ItemName, setItemName] = useState('')
  const [ItemSeq, setItemSeq] = useState('')
  const [Spec, setSpec] = useState('')
  const [SMQCType, setSMQCType] = useState('')
  const [SMQCTypeName, setSMQCTypeName] = useState('')

  const fieldsToTrack = [
    'StartDate',
    'EndDate'
  ]

  const [selectionB, setSelectionB] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [gridDataB, setGridDataB] = useState([])
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridDataB, fieldsToTrack)

  const [dataSelectTitle, setDataSelectTitle] = useState([])
  const [dataSelectItem, setDataSelectItem] = useState([])

  const [numRowsB, setNumRowsB] = useState(0)
  const [colsB, setColsB] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QA_CUST_QC_TITLE_RIGHT',
      defaultColsB.filter((col) => col.visible),
    ),
  )

  const [addedRowsB, setAddedRowsB] = useState([])
  const [numRowsToAddB, setNumRowsToAddB] = useState(null)

  const [gridDataBottom, setGridDataBottom] = useState([])
  const [numRowsBottom, setNumRowsBottom] = useState(0)
  const [colsBottom, setColsBottom] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QC_CUST_TITLE_BOTTOM',
      defaultColsBottom.filter((col) => col.visible),
    ),
  )
  const [numRowsToAddBottom, setNumRowsToAddBottom] = useState(null)
  const [addedRowsBottom, setAddedRowsBottom] = useState([])

  const [dataSub, setDataSub] = useState([])
  const [UMQCTitleSeq, setUMQCTitleSeq] = useState('')

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
        dataCust,
        dataSMQcType,
        dataItemName,
        dataSpec,
        dataQcUmTitleName,
        dataTestMethod,
        dataSamplingStd,
        dataSMAQLLevel,
        dataAQLStrict,
        dataACPointName,
      ] = await Promise.all([
        GetCodeHelpVer2(
          17001,
          '',
          '',
          '',
          '',
          '',
          '1',
          '',
          1,
          'SMCustStatus=2004001',
          0,
          0,
          0,
        ),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6018', '1001', '', ''),
        GetCodeHelpVer2(18001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(18003, '', '', '', '', '', '3', '50', 1, '', 0, 0, 0),
        GetCodeHelpVer2(60022, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6013', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6014', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6015', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6001', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6002', '', '', ''),
      ])
      setDataCust(dataCust.data)
      setDataSmQcTypeName(dataSMQcType.data)
      setDataItemName(dataItemName.data)
      setDataSpec(dataSpec.data)
      setDataQcUmTitleName(dataQcUmTitleName.data)
      setDataSmTestMethodName(dataTestMethod.data)
      setDataSMSamplingStdName(dataSamplingStd.data)
      setDataSMAQLLevelName(dataSMAQLLevel.data)
      setDataSMAQLStrictName(dataAQLStrict.data)
      setDataSmAcPointName(dataACPointName.data)
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

            if (product.CustSeq) {
              product['Status'] = ''
            } else {
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

  const handleRowAppendBottom = useCallback(
    (numRowsToAddBottom) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(
        colsBottom,
        setGridDataBottom,
        setNumRowsBottom,
        setAddedRowsBottom,
        numRowsToAddBottom,
      )
    },
    [
      colsBottom,
      setGridDataBottom,
      setNumRowsBottom,
      setAddedRowsBottom,
      numRowsToAddBottom,
    ],
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

  const fetchItemBy = useCallback(
    async (data) => {
      if (!isAPISuccess) return
      if (controllers.current && controllers.current.fetchItemBy) {
        controllers.current.fetchItemBy.abort()
        controllers.current.fetchItemBy = null
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

      controllers.current.fetchItemBy = controller

      setLoading(true)
      setIsAPISuccess(false)
      try {
        const response = await GetItemByCust(data)
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
        controllers.current.fetchItemBy = null
      }
    },
    [gridDataB, colsB],
  )

  const fetchQcTitleByItem = useCallback(
    async (data) => {
      if (!isAPISuccess) return
      if (controllers.current && controllers.current.fetchQcTitleByItem) {
        controllers.current.fetchQcTitleByItem.abort()
        controllers.current.fetchQcTitleByItem = null
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

      controllers.current.fetchQcTitleByItem = controller

      setLoading(true)
      setIsAPISuccess(false)
      try {
        const response = await GetQcTitleByItem(data)
        const fetchedData = response.data.data || []

        setGridDataBottom(fetchedData)
        setNumRowsBottom(fetchedData.length)
      } catch (error) {
      } finally {
        setLoading(false)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        controllers.current.fetchQcTitleByItem = null
      }
    },
    [gridDataBottom, colsBottom],
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
              CustSeq: rowData.CustSeq || 0,
              SMQCType: rowData.SMQCType || 0,
              IDX_NO: rowIndex + 1 || 1,
            },
          ]
          setCustName(rowData.CustName)
          setCustSeq(rowData.CustSeq)
          setSMQCTypeName(rowData.SMQCTypeName)
          setSMQCType(rowData.SMQCType)
          fetchItemBy(data)
          setDataSelectTitle(getSelectedRows())
        }
      }
    },
    [gridData, getSelectedRows, CustName, SMQCTypeName, SMQCType, CustSeq],
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
          const rowData = gridDataB[rowIndex]
          const data = [
            {
              CustSeq: rowData.CustSeq || 0,
              SMQCType: SMQCType,
              ItemSeq: rowData.ItemSeq || 0,
              IDX_NO: rowIndex + 1 || 1,
            },
          ]
          setItemName(rowData.ItemName)
          setItemSeq(rowData.ItemSeq)
          setSpec(rowData.Spec)
          setItemNo(rowData.ItemNo)
          fetchQcTitleByItem(data)
          setDataSelectItem(getSelectedRowsB())
        }
      }
    },
    [
      gridDataBottom,
      getSelectedRowsB,
      gridDataB,
      SMQCType,
      ItemName,
      Spec,
      ItemNo,
      ItemSeq
    ],
  )

  const handleSaveData = useCallback(
    async () => {

      if (!isAPISuccess) {
        message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
        return
      }
      if (controllers.current && controllers.current.handleSaveData) {
        controllers.current.handleSaveData.abort()
        controllers.current.handleSaveData = null
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

      controllers.current.handleSaveData = controller

      setLoading(true)
      setIsAPISuccess(false)

      const requiredColumns = ['UMQCTitleName']

      const columnsQaCustA = ['CustName', 'CustSeq', 'SMQCTypeName', 'SMQCType', 'IdxNo']

      const columnsQaCustU = ['CustName', 'CustSeq', 'SMQCTypeName', 'SMQCType', 'IdxNo']

      const columnsItemA = [
        'ItemName',
        'ItemSeq',
        'ItemNo',
        'Spec',
        'SMTestMethodName',
        'SMTestMethod',
        'SMSamplingStdName',
        'SMSamplingStd',
        'SMAQLLevelName',
        'SMAQLLevel',
        'SMAQLStrictName',
        'SMAQLStrict',
        'SMACPointName',
        'SMAQLPoint',
        'SMAQLPointName',
        'StartDate',
        'EndDate',
        'Remark',
        'IdxNo'
      ]

      const columnsItemU = [
        'ItemName',
        'ItemSeq',
        'ItemNo',
        'Spec',
        'SMTestMethodName',
        'SMTestMethod',
        'SMSamplingStdName',
        'SMSamplingStd',
        'SMAQLLevelName',
        'SMAQLLevel',
        'SMAQLStrictName',
        'SMAQLStrict',
        'SMACPointName',
        'SMAQLPoint',
        'SMAQLPointName',
        'StartDate',
        'EndDate',
        'Remark',
        'IdxNo'
      ]

      const columnsUMQcA = [
        'UMQCTitleName',
        'UMQCTitleSeq',
        'TestingCondition',
        'TargetLevel',
        'UMQCUnitName',
        'SMInputTypeName',
        'UpperLimit',
        'LowerLimit',
        'ItemSeq',
        'SMQCType',
        'Remark',
        'IdxNo'
      ]

      const columnsUMQcU = [
        'UMQCTitleName',
        'UMQCTitleSeq',
        'TestingCondition',
        'TargetLevel',
        'UMQCUnitName',
        'SMInputTypeName',
        'UpperLimit',
        'LowerLimit',
        'ItemSeq',
        'SMQCType',
        'Remark',
        'IdxNo'
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

      const dataQaCustA = filterAndSelectColumns(
        gridData,
        columnsQaCustA,
        'A',
      ).map((item) => ({
        ...item,
        WorkingTag: 'A',
      }))

      const dataQaCustU = filterAndSelectColumns(
        gridData,
        columnsQaCustU,
        'U',
      ).map((item) => ({
        ...item,
        WorkingTag: 'U',
      }))

      const dataQaCustTitle = [...dataQaCustA, ...dataQaCustU]

      const dataQaItemA = filterAndSelectColumns(
        gridDataB,
        columnsItemA,
        'A',
      ).map((item) => ({
        ...item,
        WorkingTag: 'A',
        CustSeq: CustSeq,
        SMQCType: SMQCType,
        
      }))
      const dataQaItemU = filterAndSelectColumns(
        gridDataB,
        columnsItemU,
        'U',
      ).map((item) => ({
        ...item,
        WorkingTag: 'U',
        CustSeq: CustSeq,
        SMQCType: SMQCType,
      }))



      const dataQaItem = [...dataQaItemA, ...dataQaItemU]

      const dataUMQcA = filterAndSelectColumns(
        gridDataBottom,
        columnsUMQcA,
        'A',
      ).map((item) => ({
        ...item,
        WorkingTag: 'A',
        CustSeq: CustSeq,
        SMQCType: SMQCType,
        ItemSeq: ItemSeq,
      }))
      const dataUMQcU = filterAndSelectColumns(
        gridDataBottom,
        columnsUMQcU,
        'U',
      ).map((item) => ({
        ...item,
        WorkingTag: 'U',
        CustSeq: CustSeq,
        SMQCType: SMQCType,
        ItemSeq: ItemSeq,
      }))

      const dataUMQc = [...dataUMQcA, ...dataUMQcU]

      const validationQaQcTitleMessage = validateCheckColumns(
        [...dataQaCustTitle],
        [...columnsQaCustA],
        requiredColumns,
      )

      const validationQaItemMessage = validateCheckColumns(
        [...dataQaItem],
        [...columnsItemA],
        requiredColumns,
      )

      if (validationQaQcTitleMessage !== true) {
        message.warning(validationQaQcTitleMessage)
        return
      }

      if (validationQaItemMessage !== true) {
        message.warning(validationQaItemMessage)
        return
      }

      if (isSent) return
      setIsSent(true)

      try {
        const promises = []

        promises.push(CUDQaCustQcTitleBy(dataQaCustTitle, dataQaItem, dataUMQc))

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
            // setDataError(result.data.message)
            // setIsModalVisible(true)
            message.error(result.data.message)
          }
        })
      } catch (error) {
        setIsLoading(false)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      } finally {
        fetchData()
        setIsAPISuccess(true)
        setLoading(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        controllers.current.handleSaveData = null
      }
    },
    [editedRows, gridData, cols, gridDataB, colsB, gridDataBottom, colsBottom, ItemSeq, CustSeq, SMQCType, dataError, isAPISuccess],
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

      if (dataQaQcTitle.length !== 0) {
        promises.push(DeleteQaQcTitle(dataQaQcTitle))
      }
      if (dataQaItemBad.length !== 0) {
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
  }, [dataSelectTitle, dataSelectItem, gridData, gridDataB, isAPISuccess])

  const handleRestSheet = useCallback(async () => {
    setCustName('')
    setCustSeq('')
    setItemNo('')
    setItemName('')
    setItemSeq('')
    setSpec('')
    setSMQCType('')
    setSMQCTypeName('')

    setGridData([])
    setNumRows(0)

    setGridDataB([])
    setNumRowsB(0)

    setGridDataBottom([])
    setNumRowsBottom(0)
  }, [defaultCols, gridData, defaultColsB, gridDataB, gridDataBottom, defaultColsBottom])

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
      const data = [
        {
          CustName: CustName,
        },
      ]

      const response = await SearchQaCustQcTitlePage(data)

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
  }, [gridData, isAPISuccess, CustName])

  return (
    <>
      <Helmet>
        <title>HPM - {t('800000159')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000159')}
              </Title>
              <QaCustQcTitleAction
                fetchData={fetchData}
                handleRestSheet={handleRestSheet}
                handleSaveData={handleSaveData}
                setModalDeleteConfirm={setModalDeleteConfirm}
              />
            </div>
          </div>

          <div className="col-start-1 flex gap-3 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-hidden">
            <Splitter className="w-full h-full">
              <SplitterPanel size={30} minSize={20}>
                <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
                  <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
                    <div className="flex p-2 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg">
                      <Form layout="vertical">
                        <Row className="gap-4 flex items-center">
                          <Col>
                            <Form.Item
                              label={
                                <span className="uppercase text-[9px]">
                                  {t('713')}
                                </span>
                              }
                              style={{ marginBottom: 0 }}
                              labelCol={{
                                style: { marginBottom: 2, padding: 0 },
                              }}
                              wrapperCol={{ style: { padding: 0 } }}
                            >
                              <Input
                                placeholder={t('713')}
                                className="w-[150px]"
                                onChange={(e) => {
                                  setCustName(e.target.value)
                                }}
                                size="middle"
                                style={{ backgroundColor: '#e8f0ff' }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                    <TableQaCustQcTitleLeft
                      dataCustomer={dataCust}
                      dataSmQcTypeName={dataSmQcTypeName}
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
                      
                      CustName={CustName}
                      setCustName={setCustName}
                      SMQCTypeName={SMQCTypeName}
                      setSMQCTypeName={setSMQCTypeName}
                    />
                  </div>
                </div>
              </SplitterPanel>
              <SplitterPanel size={75} minSize={20}>
                <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
                  <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
                    <Splitter layout="vertical" className="h-full w-full">
                      <SplitterPanel size={40} minSize={20}>
                        <div className="w-full gap-1 h-full flex items-center justify-center pb-2">
                          <div className="w-full h-full flex flex-col  overflow-hidden ">
                            <QaCustQcTitleRightQuery
                              CustName={CustName}
                              SMQCTypeName={SMQCTypeName}
                            />
                            <TableQaCustQcTitleRight
                              dataItemName={dataItemName}
                              dataSpec={dataSpec}
                              dataTestMethod={dataSmTestMethodName}
                              dataSMAQLLevelName={dataSMAQLLevelName}
                              dataSamplingStd={dataSMSamplingStdName}
                              dataAQLLevelName={dataSMAQLLevelName}
                              dataAQLStrictName={dataSMAQLStrictName}
                              dataAQLPointName={dataSmAcPointName}
                              setSelection={setSelectionB}
                              selection={selectionB}
                              showSearch={showSearch}
                              setShowSearch={setShowSearch}
                              setAddedRows={setAddedRowsB}
                              addedRows={addedRowsB}
                              setEditedRows={setEditedRows}
                              onCellClicked={onCellClickedB}
                              editedRows={editedRows}
                              setNumRowsToAdd={setNumRowsToAddB}
                              clickCount={clickCount}
                              numRowsToAdd={numRowsToAddB}
                              numRows={numRowsB}
                              onSelectRow={onSelectRow}
                              openHelp={openHelp}
                              setOpenHelp={setOpenHelp}
                              setOnSelectRow={setOnSelectRow}
                              setIsCellSelected={setIsCellSelected}
                              isCellSelected={isCellSelected}
                              setGridData={setGridDataB}
                              gridData={gridDataB}
                              setNumRows={setNumRowsB}
                              setCols={setColsB}
                              handleRowAppend={handleRowAppendB}
                              cols={colsB}
                              defaultCols={defaultColsB}
                              canCreate={canCreate}
                              canEdit={canEdit}
                            />
                          </div>
                        </div>
                      </SplitterPanel>

                      <SplitterPanel size={40} minSize={20}>
                        <div className="w-full gap-2 h-full flex items-center justify-center ">
                          <div className="w-full h-full flex flex-col  overflow-hidden ">
                            <QaCustQcTitleBottomQuery
                              ItemName={ItemName}
                              ItemNo={ItemNo}
                              Spec={Spec}
                            />
                            <TableQaCustQcTitleBottom
                              dataQcUmTitleName={dataQcUmTitleName}
                              setSelection={setSelectionBottom}
                              selection={selectionBottom}
                              showSearch={showSearch}
                              setShowSearch={setShowSearch}
                              setAddedRows={setAddedRowsBottom}
                              addedRows={addedRowsBottom}
                              setEditedRows={setEditedRowsBottom}
                              // onCellClicked={onCellClicked}
                              editedRows={editedRowsBottom}
                              setNumRowsToAdd={setNumRowsToAddBottom}
                              clickCount={clickCount}
                              numRowsToAdd={numRowsToAddBottom}
                              numRows={numRowsBottom}
                              onSelectRow={onSelectRowBottom}
                              openHelp={openHelp}
                              setOpenHelp={setOpenHelp}
                              setOnSelectRow={setOnSelectRowBottom}
                              setIsCellSelected={setIsCellSelected}
                              isCellSelected={isCellSelected}
                              setGridData={setGridDataBottom}
                              gridData={gridDataBottom}
                              setNumRows={setNumRowsBottom}
                              setCols={setColsBottom}
                              handleRowAppend={handleRowAppendBottom}
                              cols={colsBottom}
                              defaultCols={defaultColsBottom}
                              canCreate={canCreate}
                              canEdit={canEdit}
                            />
                          </div>
                        </div>
                      </SplitterPanel>
                    </Splitter>
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
