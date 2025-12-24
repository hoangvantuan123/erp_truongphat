import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import { Typography, message } from 'antd'
const { Title, Text } = Typography
import { debounce, set } from 'lodash'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'

import ErrorListModal from '../default/errorListModal'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'

import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateCheckColumns } from '../../../utils/validateColumns'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { Splitter, SplitterPanel } from 'primereact/splitter'

import { useNavigate, useParams } from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar'
import QaItemQcTitleActions from '../../components/actions/qa-basic/qaItemQcTitleActions'
import QaItemQcTitleQuery from '../../components/query/qaBasic/qaItemQcTitleQuery'
import TableQaItemQcTitle from '../../components/table/qaBasic/tableQaItemQcTitle'
import QaItemQcTitleBasicQuery from '../../components/query/qaBasic/qaItemQcTitleBasicQuery'
import TableQaItemQcTitleBasicDetail from '../../components/table/qaBasic/tableQaItemQcTitleBasicDetail'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { SearchQaItemQcTitlePage } from '../../../features/qa-basic/searchQaItemTitlePage'
import { GetQaItemQc } from '../../../features/qa-basic/getQaItemQc'
import { GetQaItemQcTitle } from '../../../features/qa-basic/getQaItemQcTitle'
import { CreatedQaItemQc } from '../../../features/qa-basic/createdQaItemQc'
import { CreatedQaItemQcTitle } from '../../../features/qa-basic/createdQaItemQcTitle'
import { DelelteQaItemQc } from '../../../features/qa-basic/deleteQAItemQc'

export default function QaItemQcTitle({
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
        visible: false,
        icon: GridColumnIcon.HeaderLookup,
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
        title: t('2090'),
        id: 'ItemName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('18801'),
        id: 'Spec',
        kind: 'Custom',
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
        title: t('3259'),
        id: 'AssetName',
        kind: 'Custom',
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
        title: t('324'),
        id: 'SMQcKindName',
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
        id: 'UMQcTitleName',
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
        title: t('11747'),
        id: 'IsStrictLevel',
        kind: 'Text',
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
        title: t('11748'),
        id: 'IsMidLevel',
        kind: 'Boolean',
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
        title: t('11749'),
        id: 'IsSimpleLevel',
        kind: 'Boolean',
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
        title: t('5390'),
        id: 'TagetLevel',
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
      {
        title: t('3680'),
        id: 'UMQCTitleSeq',
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
        title: t('11759'),
        id: 'UMQCTitleSeqOld',
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
  const [menus, setMenus] = useState([])
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenSheetConfirm, setModalOpenSheetConfirm] = useState(false)
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
      'S_ERP_COLS_PAGE_QA_ITEM_QC_TITLE',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [QCEmployee, setQCEmployee] = useState(() =>
    loadFromLocalStorageSheet('userInfo'),
  )

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const [deleteDataItem, setDeleteDataItem] = useState([])

  const [WorkingTag, setWorkingTag] = useState('')

  /* Q */
  const [QAssetName, setQAssetName] = useState('')
  const [QAssetSeq, setQAssetSeq] = useState('')
  const [QItemName, setQItemName] = useState('')
  const [QItemNo, setQItemNo] = useState('')
  const [QSpec, setQSpec] = useState('')

  const [EmpSeq, setEmpSeq] = useState('')
  const [EmpName, setEmpName] = useState('')
  const [userId, setUserId] = useState('')

  // data code help
  const [dataAssetName, setDataAssetName] = useState([])
  const [dataItemName, setDataItemName] = useState([])
  const [dataItemNo, setDataItemNo] = useState([])
  const [dataSpec, setDataSpec] = useState([])
  const [dataSMQcKindName, setDataSMQcKindName] = useState([])
  const [dataSMTestMethodName, setDataSMTestMethodName] = useState([])
  const [dataSMQcTitleLevelName, setDataSMQcTitleLevelName] = useState([])
  const [dataSMSamplingStdName, setDataSMSamplingStdName] = useState([])
  const [dataSMAQLStrictName, setDataSMAQLStrictName] = useState([])
  const [dataSMAQLLevelName, setDataSMAQLLevelName] = useState([])
  const [dataSMAQLPointName, setDataSMAQLPointName] = useState([])
  const [dataQcUmTitleName, setDataQcUmTitleName] = useState([])


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
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const [selectionB, setSelectionB] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [gridDataB, setGridDataB] = useState([])
  const [gridDataC, setGridDataC] = useState([])
  const [fileList, setFileList] = useState([])

  const [numRowsB, setNumRowsB] = useState(0)

  const [colsB, setColsB] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QA_ITEM_QC_TITLE_SPEC',
      defaultColsB.filter((col) => col.visible),
    ),
  )

  const [addedRowsB, setAddedRowsB] = useState([])
  const [editedRowsB, setEditedRowsB] = useState([])
  const [numRowsToAddB, setNumRowsToAddB] = useState(null)

  const [dataSub, setDataSub] = useState([])

  //  Details

  const [QCNo, setQCNo] = useState('')
  const [SMSamplingStd, setSMSamplingStd] = useState('')

  const [AQLAcValue, setAQLAcValue] = useState('')
  const [AQLReValue, setAQLReValue] = useState('')
  const [AcBadRatio, setAcBadRatio] = useState('')
  const [ReqQty, setReqQty] = useState(0)
  const [ReqSampleQty, setReqSampleQty] = useState(0)
  const [SelectDate, setSelectDate] = useState('')
  const [TestStartDate, setTestStartDate] = useState('')
  const [TestEndDate, setTestEndDate] = useState('')
  const [TestDocNo, setTestDocNo] = useState('')
  const [RealSampleQty, setRealSampleQty] = useState(0)
  const [SampleNo, setSampleNo] = useState('')
  const [BadSampleQty, setBadSampleQty] = useState(0)
  const [BadSampleRate, setBadSampleRate] = useState(0)
  const [SMTestResult, setSMTestResult] = useState('')
  const [SMTestResultName, setSMTestResultName] = useState('')
  const [PassedQty, setPassedQty] = useState(0)
  const [RejectQty, setRejectQty] = useState(0)
  const [DisposeQty, setDisposeQty] = useState(0)
  const [ReqInQty, setReqInQty] = useState(0)
  const [TestUsedTime, setTestUsedTime] = useState('')
  const [Remark, setRemark] = useState('')
  const [SMRejectTransType, setSMRejectTransType] = useState('')
  const [QEmpSeq, setQEmpSeq] = useState('')
  const [QDeptSeq, setQDeptSeq] = useState('')
  const [QEmpName, setQEmpName] = useState('')
  const [Memo1, setMemo1] = useState('')
  const [Memo2, setMemo2] = useState('')
  const [FileSeq, setFileSeq] = useState('')
  const [FileId, setFileId] = useState('')
  const [IsReCfm, setIsReCfm] = useState('')
  const [QCSeq, setQCSeq] = useState('')
  const [SourceSeq, setSourceSeq] = useState(0)
  const [SourceSerl, setSourceSerl] = useState('')
  const [SourceType, setSourceType] = useState(1)
  const [CustSeq, setCustSeq] = useState('')

  const [ItemName, setItemName] = useState('')
  const [ItemSeq, setItemSeq] = useState('')
  const [ItemNo, setItemNo] = useState('')
  const [Spec, setSpec] = useState('')
  const [SMQcKindName, setSMQcKindName] = useState('')
  const [SMQcKind, setSMQcKind] = useState('')
  const [AssetName, setAssetName] = useState('')
  const [AssetSeq, setAssetSeq] = useState('')
  const [SMTestMethod, setSMTestMethod] = useState(0)
  const [SMTestMethodName, setSMTestMethodName] = useState('')
  const [SMQcTitleLevel, setSMQcTitleLevel] = useState('')
  const [SMQcTitleLevelName, setSMQcTitleLevelName] = useState('')
  const [SMSamplingStdName, setSMSamplingStdName] = useState('')
  const [SMAQLStrict, setSMAQLStrict] = useState('')
  const [SMAQLStrictName, setSMAQLStrictName] = useState('')
  const [SMAQLLevelName, setSMAQLLevelName] = useState('')
  const [SMAQLLevel, setSMAQLLevel] = useState('')
  const [SMAQLPointName, setSMAQLPointName] = useState('')
  const [SMAQLPoint, setSMAQLPoint] = useState('')

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
        dataAssetName,
        dataItemName,
        dataItemNo,
        dataSpec,
        dataSMQcKindName,
        dataSMTestMethodName,
        dataSMQcTitleLevelName,
        dataSMSamplingStdName,
        dataSMAQLStrictName,
        dataSMAQLLevelName,
        dataSMAQLPointName,
        dataQcUmTitleName,
      ] = await Promise.all([
        GetCodeHelpComboVer2('', 6, 10012, 1, '%', '', '', '', ''),
        GetCodeHelpVer2(18001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(18002, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(18003, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6018', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6013', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6031', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6014', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6001', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6015', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6002', '', '', ''),
        GetCodeHelpVer2(60022, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),

      ])

      setDataAssetName(dataAssetName.data)
      setDataItemName(dataItemName.data)
      setDataItemNo(dataItemNo.data)
      setDataSpec(dataSpec.data)
      setDataSMQcKindName(dataSMQcKindName.data)
      setDataSMTestMethodName(dataSMTestMethodName.data)
      setDataSMQcTitleLevelName(dataSMQcTitleLevelName.data)
      setDataSMSamplingStdName(dataSMSamplingStdName.data)
      setDataSMAQLStrictName(dataSMAQLStrictName.data)
      setDataSMAQLLevelName(dataSMAQLLevelName.data)
      setDataSMAQLPointName(dataSMAQLPointName.data)
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
      // onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )

  const handleQaItemQcTitle = useCallback(() => {
    const data = [
      {
        ItemSeq: ItemSeq,
        ItemNo: ItemNo,
        ItemName: ItemName,
        AssetSeq: AssetSeq,
        AssetName: AssetName,
        Spec: Spec,
        SMQcKind: SMQcKind,
        WorkingTag: 'QCTitle'
      },
    ]
    fetchQaItemQcTitle(data)
  }, [
    ItemSeq, 
    ItemNo, 
    ItemName, 
    AssetSeq, 
    AssetName, 
    Spec, 
    SMQcKindName
  ])

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

  const fetchQaItemQc = useCallback(async (data) => {
    if (!isAPISuccess) return
    if (controllers.current && controllers.current.fetchQaItemQc) {
      controllers.current.fetchQaItemQc.abort()
      controllers.current.fetchQaItemQc = null
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

    controllers.current.fetchQaItemQc = controller

    setLoading(true)
    setIsAPISuccess(false)
    try {
      
      const response = await GetQaItemQc(data)
      const fetchedData = response.data.data || []

      setSMTestMethod(fetchedData[0]?.SMTestMethod)
      setSMTestMethodName(fetchedData[0]?.SMTestMethodName)
      setSMAQLLevel(fetchedData[0]?.SMAQLLevel)
      setSMAQLLevelName(fetchedData[0]?.SMAQLLevelName)
      setSMAQLStrict(fetchedData[0]?.SMAQLStrict)
      setSMAQLStrictName(fetchedData[0]?.SMAQLStrictName)
      setSMAQLPoint(fetchedData[0]?.SMAQLPoint)
      setSMAQLPointName(fetchedData[0]?.SMAQLPointName)
      setSMSamplingStd(fetchedData[0]?.SMSamplingStd)
      setSMSamplingStdName(fetchedData[0]?.SMSamplingStdName)
      setSMQcTitleLevel(fetchedData[0]?.SMQcTitleLevel)
      setSMQcTitleLevelName(fetchedData[0]?.SMQcTitleLevelName)
      setSMQcKindName(fetchedData[0]?.SMQcKindName)
      setSMQcKind(fetchedData[0]?.SMQcKind)
      
    } catch (error) {
      
    } finally {
      setLoading(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchQaItemQc = null
    }
  }, [
    SMTestMethod, 
    SMTestMethodName, 
    SMAQLLevel, 
    SMAQLLevelName, 
    SMSamplingStd,
    SMSamplingStdName, 
    SMAQLStrict,
    SMAQLStrictName,
    SMAQLPoint,
    SMAQLPointName,
    SMQcTitleLevel,
    SMQcTitleLevelName,

  ])

  const fetchQaItemQcTitle = useCallback(async (data) => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    if (controllers.current && controllers.current.fetchQaItemQcTitle) {
      controllers.current.fetchQaItemQcTitle.abort()
      controllers.current.fetchQaItemQcTitle = null
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

    controllers.current.fetchQaItemQcTitle = controller

    setLoading(true)
    setIsAPISuccess(false)
    try {
      
      const response = await GetQaItemQcTitle(data)
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
      controllers.current.fetchQaItemQcTitle = null
    }
  }, [
    gridDataB,

  ])

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

      if (rowIndex >= 0 && rowIndex < gridData.length) {
        const rowData = gridData[rowIndex]

        setItemName(rowData.ItemName)
        setItemSeq(rowData.ItemSeq)
        setItemNo(rowData.ItemNo)
        setAssetName(rowData.AssetName)
        setSpec(rowData.Spec)

        const data = [
          {
            ItemSeq: rowData.ItemSeq,
            ItemNo: rowData.ItemNo,
            ItemName: rowData.ItemName,
            AssetSeq: rowData.AssetSeq,
            AssetName: rowData.AssetName,
            Spec: rowData.Spec,
            SMQcKind: rowData.SMQcKind,
          },
        ]
        fetchQaItemQc(data)
        fetchQaItemQcTitle(data)
      }
    },
    [gridData],
  )

  const handleSaveListItemData = useCallback(
    async (ItemSeq, SMQcKind) => {
      const requiredColumns = ['UMQcTitleName']

      const columnsA = [
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
      
      
      const resulA = gridDataB.map(
        (item) => ({
          ...item,
          ItemSeq: ItemSeq,
          SMQcKind: SMQcKind,
        }),
      )

      const validationMessage = validateCheckColumns(
        [...resulA],
        [...columnsA],
        requiredColumns,
      )

      if (validationMessage !== true) {
        message.warning(validationMessage)
        return
      }

      if (isSent) return
      setIsSent(true)

      if (resulA.length > 0) {
        try {
          const promises = []
          promises.push(CreatedQaItemQcTitle(resulA))
          
          const results = await Promise.all(promises)
          const updateGridData = (newData) => {
            setGridDataB((prevGridData) => {
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

              return updatedGridData
            })
          }

          results.forEach((result, index) => {
            if (result.data.status) {
              const newData = result.data.data
              if (index === 0) {
                message.success('Thêm thành công!')
                // updateGridData(newData)
              } else {
                message.success('Cập nhật thành công!')
              }

              setIsLoading(false)
              setIsSent(false)
              // setEditedRows([])
              // updateGridData(newData)
              // resetTable()
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
      } else {
        setIsLoading(false)
        setIsSent(false)
      }
    },
    [
      editedRows, 
      gridDataB,
      colsB,
    ],
  )

  const handleSaveData = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
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
    const result = [
      {
        ItemSeq: ItemSeq,
        ItemName: ItemName,
        ItemNo: ItemNo,
        SMQcKind: SMQcKind,
        SMQcKindName: SMQcKindName,
        Spec: Spec,
        SMTestMethod: SMTestMethod,
        SMTestMethodName: SMTestMethodName,
        SMAQLLevel: SMAQLLevel,
        SMAQLLevelName: SMAQLLevelName,
        SMSamplingStd: SMSamplingStd,
        SMSamplingStdName: SMSamplingStdName,
        SMAQLStrict: SMAQLStrict,
        SMAQLStrictName: SMAQLStrictName,
        SMQcTitleLevel: SMQcTitleLevel,
        SMQcTitleLevelName: SMQcTitleLevelName,
        SMAQLPoint: SMAQLPoint,
        SMAQLPointName: SMAQLPointName,
      },
    ]
    setIsAPISuccess(false)

    try {
      const response = await CreatedQaItemQc(result)
      setLoading(true)
      if (response.data.status) {
        const qaItemQcResult = response.data.data || []
        handleSaveListItemData(
          qaItemQcResult[0].ItemSeq,
          qaItemQcResult[0].SMQcKind,
        )
        setLoading(false)
        
      } else {
        message.error(response.message)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
      setIsAPISuccess(true)
      fetchData()
      controllers.current.handleSaveData = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    ItemSeq,
    ItemName,
    ItemNo,
    SMQcKindName,
    SMQcKind,
    Spec,
    SMTestMethod,
    SMTestMethodName,
    SMAQLLevel,
    SMAQLLevelName,
    SMSamplingStd,
    SMSamplingStdName,
    SMAQLStrict,
    SMAQLStrictName,
    SMQcTitleLevel,
    SMQcTitleLevelName,
    SMAQLPoint,
    SMAQLPointName,
    gridData,
    isAPISuccess,
  ])

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
    const result = [
      {
        ItemSeq: ItemSeq,
        ItemName: ItemName,
        ItemNo: ItemNo,
        SMQcKind: SMQcKind,
        SMQcKindName: SMQcKindName,
        Spec: Spec,
      },
    ]
    setIsAPISuccess(false)

    try {
      const response = await DelelteQaItemQc(result)
      setLoading(true)
      if (response.success) {
        const qcTestReportResult = response.data.data || []
        setLoading(false)
        message.success('Xóa thành công!')
        setModalDeleteConfirm(false)
        handleRestSheet()
        fetchData()
      } else {
        message.error(response.message)
        setModalDeleteConfirm(false)
      }
    } catch (error) {
      console.log('error', error)
      setModalDeleteConfirm(false)
    } finally {
      setLoading(false)
      setIsAPISuccess(true)

      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.handleDeleteData = null
    }
  }, [
    ItemSeq,
    ItemName,
    ItemNo,
    SMQcKind,
    SMQcKindName,
    Spec,
    gridData,
    isAPISuccess,
  ])

  const resetAll = () => {
    setBLNo('')
    setQCNo('')
    setReqQty(0)
    setSMTestMethodName('')
    setSMTestMethod(0)
    setSMSamplingStd(0)
    setSMSamplingStdName('')
    setSelectDate('')
    setEmpName('')
    setEmpSeq(0)
    setQEmpName('')
    setQEmpSeq(0)
    setTestStartDate('')
    setTestEndDate('')
    setReqSampleQty('')
    setSMAQLStrictName('')
    setSMAQLStrict(0)
    setAQLAcValue(0)
    setTestDocNo('')
    setIsReCfm(0)
    setAQLReValue(0)
    setRealSampleQty(0)
    setBadSampleQty(0)
    setSMTestResult(0)
    setSMTestResultName('')
    setReqInQty(0)
    setDisposeQty(0)
    setTestUsedTime('')
    setPassedQty(0)
    setRejectQty(0)
    setAcBadRatio(0)
    setRemark(0)
    setMemo1('')
    setMemo2('')
    setSampleNo(0)
    setGridDataC([])
    setNumRowsC(0)
    setQCSeq('')
    setItemSeq('')
    setSourceSeq('')
    setSourceType('')
    setCustSeq('')
    setGridData([])
    setNumRows(0)
  }

  const handleRestSheet = useCallback(async () => {
    setItemName('')
    setItemSeq('')
    setItemNo('')
    setAssetName('')
    setSpec('')
    setSMQcKindName('')
    setSMQcKind('')
    setSMTestMethod(0)
    setSMTestMethodName('')
    setSMAQLLevel(0)
    setSMAQLLevelName('')
    setSMSamplingStd(0)
    setSMSamplingStdName('')
    setSMAQLStrict(0)
    setSMAQLStrictName('')
    setSMAQLPoint(0)
    setSMAQLPointName('')
    setSMQcTitleLevel(0)
    setSMQcTitleLevelName('')
    
    setGridDataB([])
    setNumRowsB(0)
   
  }, [defaultColsB, gridDataB])

  const handleRowAppendB = useCallback(
    (numRowsToAddB) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      if (dataSub.length === 0) {
        message.warning('Vui lòng chọn vật phẩm trước khi thêm dữ liệu')
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
    setIsAPISuccess(false)
    try {
      const data = [
        {
          AssetSeq: QAssetSeq,
          AssetName: QAssetName,
          ItemNo: QItemNo,
          ItemName: QItemName,
          Spec: QSpec,
        },
      ]

      const response = await SearchQaItemQcTitlePage(data)

      if (response.success) {
        const qaItemData = response.data.data || []

        const emptyData = generateEmptyData(0, defaultCols)
        const combinedData = [...qaItemData, ...emptyData]
        const updatedData = updateIndexNo(combinedData)
        setGridData(updatedData)
        setNumRows(qaItemData.length + emptyData.length)
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchData = null
    }
  }, [QAssetSeq, QAssetName, QItemNo, QItemName, QSpec, isAPISuccess])

  
  return (
    <>
      <Helmet>
        <title>ITM - {t('800000140')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000140')}
              </Title>
              <QaItemQcTitleActions
                fetchData={fetchData}
                handleRestSheet={handleRestSheet}
                handleSaveData={handleSaveData}
                setModalDeleteConfirm={setModalDeleteConfirm}
                handleQaItemQcTitle={handleQaItemQcTitle}
              />
            </div>
          </div>

          <div className="col-start-1 flex gap-3 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-hidden">
            <Splitter className="w-full h-full">
              <SplitterPanel size={50} minSize={20}>
                <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
                  <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
                    <QaItemQcTitleQuery
                      dataAssetName={dataAssetName}
                      AssetName = {QAssetName}
                      setAssetName={setQAssetName}
                      setAssetSeq={setQAssetSeq}
                      ItemName={QItemName}
                      setItemName={setQItemName}
                      ItemNo={QItemNo}
                      setItemNo={setQItemNo}
                      Spec={QSpec}
                      setSpec={setQSpec}
                    />
                    <TableQaItemQcTitle
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
              <SplitterPanel size={76} minSize={78}>
                <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
                  <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
                    <QaItemQcTitleBasicQuery
                      dataItemName={dataItemName}
                      dataItemNo={dataItemNo}
                      dataSpec={dataSpec}
                      dataSMQcKindName={dataSMQcKindName}
                      dataSMTestMethodName={dataSMTestMethodName}
                      dataSMQcTitleLevelName={dataSMQcTitleLevelName}
                      dataSMSamplingStdName={dataSMSamplingStdName}
                      dataSMAQLStrictName={dataSMAQLStrictName}
                      dataSMAQLLevelName={dataSMAQLLevelName}
                      dataSMAQLPointName={dataSMAQLPointName}
                      setQAssetName={setQAssetName}
                      setQAssetSeq={setQAssetSeq}
                      setQItemName={setQItemName}
                      setQItemNo={setQItemNo}
                      setQSpec={setQSpec}
                      setItemSeq={setItemSeq}
                      ItemName={ItemName}
                      setItemName={setItemName}
                      ItemNo={ItemNo}
                      setItemNo={setItemNo}
                      AssetName={AssetName}
                      setAssetName={setAssetName}
                      setAssetSeq={setAssetSeq}
                      Spec={Spec}
                      setSpec={setSpec}
                      SMQcKindName={SMQcKindName}
                      setSMQcKindName={setSMQcKindName}
                      setSMQcKind={setSMQcKind}
                      setSMTestMethod={setSMTestMethod}
                      SMTestMethodName={SMTestMethodName}
                      setSMTestMethodName={setSMTestMethodName}
                      setSMAQLLevel={setSMAQLLevel}
                      SMAQLLevelName={SMAQLLevelName}
                      setSMAQLLevelName={setSMAQLLevelName}
                      setSMAQLStrict={setSMAQLStrict}
                      SMAQLStrictName={SMAQLStrictName}
                      setSMAQLStrictName={setSMAQLStrictName}
                      setSMSamplingStd={setSMSamplingStd}
                      SMSamplingStdName={SMSamplingStdName}
                      setSMSamplingStdName={setSMSamplingStdName}
                      setSMAQLPoint={setSMAQLPoint}
                      SMAQLPointName={SMAQLPointName}
                      setSMAQLPointName={setSMAQLPointName}
                      SMQcTitleLevelName = {SMQcTitleLevelName}
                      setSMQcTitleLevelName = {setSMQcTitleLevelName}
                      setSMQcTitleLevel = {setSMQcTitleLevel}
                    />
                    <TableQaItemQcTitleBasicDetail
                      dataQcUmTitleName = {dataQcUmTitleName}
                      setSelection={setSelectionB}
                      selection={selectionB}
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
                      handleRowAppend={handleRowAppend}
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
