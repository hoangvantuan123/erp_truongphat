import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import { Typography, message } from 'antd'
const { Title, Text } = Typography
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
import { updateEditedRows } from '../../components/sheet/js/updateEditedRows'
import TableQcItemClassQcLeft from '../../components/table/qaBasic/tableQaItemClassQcLeft'
import TableQcItemClassQcRight from '../../components/table/qaBasic/tableQaItemClassQcRight'
import QaItemClassQcLeftQuery from '../../components/query/qaBasic/qaItemClassQcLeftQuery'
import QaItemClassQcRightQuery from '../../components/query/qaBasic/qaItemClassQcRightQuery'
import { SearchQaItemClassQcPage } from '../../../features/qa-basic/qa-item-class-qc/searchQaItemClassQcPage'
import { GetQaItemClassSub } from '../../../features/qa-basic/qa-item-class-qc/getQaItemClassSub'
import { CUDQaItemClassBy } from '../../../features/qa-basic/qa-item-class-qc/AuDQaItemClass'
import { DeleteQaItemClassSub } from '../../../features/qa-basic/qa-item-class-qc/deleteQaItemClassSub'
import { DeleteQaItemClass } from '../../../features/qa-basic/qa-item-class-qc/deleteQaItemClass'

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
        title: t('715'),
        id: 'UMItemClassName',
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
        title: t('715'),
        id: 'UMItemClass',
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
        title: t('475'),
        id: 'TestMethodName',
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
        title: t('475'),
        id: 'TestMethod',
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
        title: t('1520'),
        id: 'SamplingStdName',
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
        title: t('1520'),
        id: 'SamplingStd',
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
        title: t('10845'),
        id: 'AQLLevelName',
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
        title: t('10845'),
        id: 'AQLLevel',
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
        title: t('807'),
        id: 'AQLStrictName',
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
        title: t('807'),
        id: 'AQLStrict',
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
        title: t('29615'),
        id: 'AQLPointName',
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
        title: t('29615'),
        id: 'AQLPoint',
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
        title: t('33633'),
        id: 'IsReg',
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
        title: t('IDX_NO'),
        id: 'IDX_NO',
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
        title: t('476'),
        id: 'UMQCTitleName',
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
        title: t('3680'),
        id: 'UMQCTitleSeq',
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
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('16705'),
        id: 'SMInputTypeSeq',
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
        title: t('3663'),
        id: 'UMQCUnitName',
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
        title: t('3664'),
        id: 'UMQCUnitSeq',
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
      {
        title: t('3965'),
        id: 'IsProcQC',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('9410'),
        id: 'IsFinalQC',
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
        title: t('9603'),
        id: 'IsOutQC',
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
        title: t('7908'),
        id: 'IsPurQC',
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
        title: t('715'),
        id: 'UMItemClass',
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
        title: t('Serl'),
        id: 'Serl',
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
        title: t('IDX_NO'),
        id: 'IDX_NO',
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
  const [editedRowsB, setEditedRowsB] = useState([])
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
  const [onSelectRowB, setOnSelectRowB] = useState([])
  const [dataError, setDataError] = useState([])
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_LEFT',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const lastWordEntryRef = useRef(null)
  
  // data code help
  const [dataAssetTypeName, setDataAssetTypeName] = useState([])
  const [dataClassTypeName, setDataClassTypeName] = useState([])
  const [dataTestMethod, setDataTestMethod] = useState([])
  const [dataSamplingStd, setDataSamplingStd] = useState([])
  const [dataAQLLevelName, setDataAQLLevelName] = useState([])
  const [dataAQLStrictName, setDataAQLStrictName] = useState([])
  const [dataAQLPointName, setDataAQLPointName] = useState([])
  const [dataQcUmTitleName, setDataQcUmTitleName] = useState([])

  // Query
  const [AssetTypeName, setAssetTypeName] = useState([])
  const [AssetType, setAssetType] = useState([])

  const [ClassTypeName, setClassTypeName] = useState([])
  const [ClassType, setClassType] = useState([])

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
      'S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT',
      defaultColsB.filter((col) => col.visible),
    ),
  )

  const [addedRowsB, setAddedRowsB] = useState([])
  const [numRowsToAddB, setNumRowsToAddB] = useState(null)

  const [dataSub, setDataSub] = useState([])
  const [UMItemClass, setUMItemClass]  = useState('')

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
        dataClassTypeName,
        dataAssetTypeName,
        dataTestMethod,
        dataSamplingStd,
        dataAQLLevelName,
        dataAQLStrictName,
        dataAQLPointName,
        dataQcUmTitleName,
      ] = await Promise.all([
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '8036', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '8010', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6013', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6014', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6015', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6001', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6002', '', '', ''),
        GetCodeHelpVer2(60022, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        
      ])
      setDataClassTypeName(dataClassTypeName.data)
      setDataAssetTypeName(dataAssetTypeName.data)
      setDataTestMethod(dataTestMethod.data)
      setDataSamplingStd(dataSamplingStd.data)
      setDataAQLLevelName(dataAQLLevelName.data)
      setDataAQLStrictName(dataAQLStrictName.data)
      setDataAQLPointName(dataAQLPointName.data)
      setDataQcUmTitleName(dataQcUmTitleName.data)
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
            
            if(product.UMItemClass){
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

  const fetchQaItemClassSub = useCallback(
    async (data) => {
      if (!isAPISuccess) return
      if (controllers.current && controllers.current.fetchQaItemClassSub) {
        controllers.current.fetchQaItemClassSub.abort()
        controllers.current.fetchQaItemClassSub = null
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

      controllers.current.fetchQaItemClassSub = controller

      setLoading(true)
      setIsAPISuccess(false)
      try {
        const response = await GetQaItemClassSub(data)
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
        controllers.current.fetchQaItemClassSub = null
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
              UMItemClass: rowData.UMItemClass || 0,
              IDX_NO: rowIndex + 1 || 1,
            },
          ]
          setUMItemClass(rowData.UMItemClass || 0)
          fetchQaItemClassSub(data)
          setDataSelectTitle(getSelectedRows())
        }
      }
    },
    [gridData, getSelectedRows, UMItemClass],
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
      const requiredColumns = ['UMItemClassName', 'UMItemClass']

      const columnsQaItemClassA = [
        'UMItemClassName',
        'UMItemClass',
        'TestMethodName',
        'TestMethod',
        'SamplingStdName',
        'SamplingStd',
        'AQLLevelName',
        'AQLLevel',
        'AQLStrictName',
        'AQLStrict',
        'AQLPointName',
        'AQLPoint',
        'IsReg',
        'IDX_NO',
      ]

      const columnsQaItemClassU = [
        'UMItemClassName',
        'UMItemClass',
        'TestMethodName',
        'TestMethod',
        'SamplingStdName',
        'SamplingStd',
        'AQLLevelName',
        'AQLLevel',
        'AQLStrictName',
        'AQLStrict',
        'AQLPointName',
        'AQLPoint',
        'IsReg',
        'IDX_NO',
      ]

      const columnsQaItemClassSubA = [
        'UMItemClass',
        'Serl',
        'UMQCTitleName',
        'UMQCTitleSeq',
        'TestingCondition',
        'TargetLevel',
        'SMInputTypeSeq',
        'UMQCUnitName',
        'UMQCUnitSeq',
        'UpperLimit',
        'LowerLimit',
        'Remark',
        'IsProcQC',
        'IsFinalQC',
        'IsOutQC',
        'IsPurQC',
        'IDX_NO',
        
      ]

      const columnsQaItemClassSubU = [
        'UMItemClass',
        'Serl',
        'UMQCTitleName',
        'UMQCTitleSeq',
        'TestingCondition',
        'TargetLevel',
        'SMInputTypeSeq',
        'UMQCUnitName',
        'UMQCUnitSeq',
        'UpperLimit',
        'LowerLimit',
        'Remark',
        'IsProcQC',
        'IsFinalQC',
        'IsOutQC',
        'IsPurQC',
        'IDX_NO',
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
        columnsQaItemClassA,
        'A',
      ).map((item) => ({
        ...item,
        WorkingTag: 'A',
      }))


      const dataQaQcTitleU = filterAndSelectColumns(
        gridData,
        columnsQaItemClassU,
        'U',
      ).map((item) => ({
        ...item,
        WorkingTag: 'U',
      }))

      const dataQaItemClass = [...dataQaQcTitleA, ...dataQaQcTitleU];

      let idx = Math.max(0, ...gridDataB.map(item => + item.IdxNo || 0));

      const dataQaItemClassSubA = filterAndSelectColumns(
        gridDataB,
        columnsQaItemClassSubA,
        'A',
      ).map((item) => ({
        ...item,
        WorkingTag: 'A',
        IDX_NO: idx,
      }))

      const dataQaItemBadU = filterAndSelectColumns(
        gridDataB,
        columnsQaItemClassSubU,
        'U',
      ).map((item) => ({
        ...item,
        WorkingTag: 'U',
      }))

      const dataQaItemClassSub = [...dataQaItemClassSubA, ...dataQaItemBadU ]

      const validationQaQcTitleMessage = validateCheckColumns(
        [...dataQaQcTitleA],
        [...columnsQaItemClassA],
        requiredColumns,
      )

      const validationQaItemBadMessage = validateCheckColumns(
        [...dataQaQcTitleA],
        [...columnsQaItemClassSubA],
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

          promises.push(CUDQaItemClassBy(dataQaItemClass, dataQaItemClassSub))

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
          setGridDataB([])
          setNumRowsB(0)
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

    const dataQaQcTitle = dataSelectTitle.map((item) => ({
      ...item,
      WorkingTag: 'D',
    }))

    const dataQaItemClassSub = dataSelectBad.map((item) => ({
      ...item,
      WorkingTag: 'D',
    }))
    setIsAPISuccess(false)

    try {
      const promises = []

      if(dataQaQcTitle.length !== 0){
        promises.push(DeleteQaItemClass(dataQaQcTitle))
      }
      if(dataQaItemClassSub.length !== 0){
        promises.push(DeleteQaItemClassSub(dataQaItemClassSub, UMItemClass))
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
      const data = [{
        AssetTypeName : AssetTypeName,
        AssetType: AssetType,
        ClassTypeName: ClassTypeName,
        ClassType: ClassType,

      }]

      const response = await SearchQaItemClassQcPage(data)

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
    AssetTypeName,
    AssetType,
    ClassTypeName,
    ClassType,
    isAPISuccess
  ])

  return (
    <>
      <Helmet>
        <title>HPM - {t('800000158')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000158')}
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
              <SplitterPanel size={50} minSize={20}>
                <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
                  <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
                    <QaItemClassQcLeftQuery
                      dataAssetName={dataAssetTypeName}
                      dataClassTypeName={dataClassTypeName}
                      setAssetTypeName={setAssetTypeName}
                      setAssetType={setAssetType}
                      setClassTypeName={setClassTypeName}
                      setClassType={setClassType}
                    />
                    <TableQcItemClassQcLeft
                      dataTestMethod={dataTestMethod}
                      dataSamplingStd={dataSamplingStd}
                      dataAQLLevelName={dataAQLLevelName}
                      dataAQLStrictName={dataAQLStrictName}
                      dataAQLPointName={dataAQLPointName}
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
              <SplitterPanel size={50} minSize={20}>
                <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
                  <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
                    <QaItemClassQcRightQuery
                      dataSelectTitle={dataSelectTitle}
                    />
                    <TableQcItemClassQcRight
                      dataQcUmTitleName={dataQcUmTitleName}
                      setSelection={setSelectionB}
                      selection={selectionB}
                      showSearch={showSearch}
                      setShowSearch={setShowSearch}
                      setAddedRows={setAddedRows}
                      addedRows={addedRowsB}
                      setEditedRows={setEditedRowsB}
                      onCellClicked={onCellClickedB}
                      editedRows={editedRowsB}
                      setNumRowsToAdd={setNumRowsToAdd}
                      clickCount={clickCount}
                      numRowsToAdd={numRowsToAddB}
                      numRows={numRowsB}
                      onSelectRow={onSelectRowB}
                      openHelp={openHelp}
                      setOpenHelp={setOpenHelp}
                      setOnSelectRow={setOnSelectRowB}
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
