import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import {Typography, message } from 'antd'
const { Title, Text } = Typography
import { debounce, set } from 'lodash'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'

import ErrorListModal from '../default/errorListModal'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'

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
import { useStateManager } from 'react-select'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import TableIqcItemReq from '../../components/table/iqc/tableIqcItemReq'
import { uploadFilesItems } from '../../../features/upload/postFileItems'
import TabViewIqcOptions from '../../components/view/iqc/tabViewIqcOptions'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import {

  GetListItemById,
  GetListQcFile,
  GetListTestReportResult,
} from '../../../features/iqc/getById'
import { CreateOrDeleteQcTestReportItem } from '../../../features/iqc/createdQcTestReportItem'
import ModalConfirm from '../../components/modal/transReqMat/modalConfirm'
import { CreateQcTestFileSave } from '../../../features/iqc/createQcTestFileSave'
import { GetById } from '../../../features/iqc-purchase/getById'
import IqcOutsourceReqDetailQuery from '../../components/query/iqcOutsource/iqcOutsourceReqDetailsQuery'
import { CreateBy } from '../../../features/iqc-outsource/createdBy'
import IqcOutsourceReqDetailsActions from '../../components/actions/iqc-outsource/iqcOutsourceReqDetailsActions'
import { QcTestReportSampleReq } from '../../../features/iqc-outsource/getQcOutsourceSampleReq'
import TopLoadingBar from 'react-top-loading-bar';
import { PostDFilesItems } from '../../../features/upload/postDFileItems'
import { DeleteIqcOutsourceBy } from '../../../features/iqc-outsource/deleteBy'
import OqcReqDetailQuery from '../../components/query/oqc/oqcReqDetailsQuery'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetOQCSeq, GetOQcTestReportQuery } from '../../../features/oqc/getById'
import { CreateOqcBy } from '../../../features/oqc/createdBy'
import { getQFileSeq } from '../../../features/basic/daMaterialList/getQFileSeq'
import { DeleteOqcBy } from '../../../features/oqc/deleteBy'

export default function OqcReqDetails({
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
  const location = useLocation();
  const dateFormat = (date) =>  date ? date.format('YYYYMMDD') : ''

  const dataSelect = location.state?.dataSelect || [];
  const secretKey = 'TEST_ACCESS_KEY'
  const loadingBarRef = useRef(null);

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
        title: t('14831'),
        id: 'SampleNo',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('11745'),
        id: 'UMQCTitle',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('11745'),
        id: 'UMQCTitleName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('11745'),
        id: 'UMQCTitleSeq',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3673'),
        id: 'TestingCondition',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19111'),
        id: 'LowerLimit',
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
        title: t('19109'),
        id: 'UpperLimit',
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
        title: t('5390'),
        id: 'TargetLevel',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1928'),
        id: 'SMInputTypeName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9634'),
        id: 'TestValue',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1628'),
        id: 'QCTitleBadQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19057'),
        id: 'SMTestResultName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19057'),
        id: 'SMTestResultName1',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('14402'),
        id: 'BadReasonName',
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
        title: t('14402'),
        id: 'BadReason',
        kind: 'Text',
        readonly: false,
        width: 200,
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
        title: t('14831'),
        id: 'SampleNoSheet',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('14407'),
        id: 'BadItemCnt',
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
        title: t('14401'),
        id: 'IsBad',
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
    ],
    [t],
  )

  const defaultColsC = useMemo(
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
        title: 'IdSeq',
        id: 'IdSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: 'Tên file gốc',
        id: 'OriginalName',
        kind: 'Uri',
        readonly: true,
        width: 300,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderUri,
      },
      {
        title: 'Kích đúp vào dòng ở cột này để tải file',
        id: 'Filename',
        kind: 'Text',
        readonly: true,
        width: 300,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: 'Size',
        id: 'Size',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
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
  const [modalDeleteConfirm, setModalDeleteConfirm] =
    useState(false)

  const [formData, setFormData] = useState({})
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
      'S_ERP_COLS_PAGE_OQC_ITEM_REQ_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [QCEmployee, setQCEmployee] = useState(
    () => loadFromLocalStorageSheet('userInfo'))

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const [deleteDataItem, setDeleteDataItem] = useState([])

  const [WorkingTag, setWorkingTag] = useState('')

  /* Q */
  const [dataSMQcType, setDataSMQcType] = useState([])

  const [SMQcType, setSMQcType] = useState('')
  const [BLNo, setBLNo] = useState('')

  const [EmpSeq, setEmpSeq] = useState('')
  const [EmpName, setEmpName] = useState('')
  const [userId, setUserId] = useState('')

  const [dataUser, setDataUser] = useState([])
  const [dataQcUmTitleName, setDataQcUmTitleName] = useState([])
  const [dataSMTestResultName, setDataSMTestResultName] = useState([])
  const [dataBadReason, setDataBadReason] = useState([])
  const [dataSMAQLStrict, setDataSMAQLStrict] = useState([])
  const [dataSMAQLLevelName, setDataSMAQLLevelName] = useState([])
  const [dataAQLAcValue, setDataAQLAcValue] = useState([])
  const [dataSMTestMethodName, setDataSMTestMethodName] = useState([])
  const [dataSMSamplingStdName, setDataSMSamplingStdName] = useState([])

  const [peopleSearchSh, setPeopleSearchSh] = useState('')

  const [dataMaster, setDataMaster] = useState({})

  const fieldsToTrack = [
    'SampleNo',
    'UMQCTitleName',
    'TestingCondition',
    'LowerLimit',
    'UpperLimit',
    'TargetLevel',
    'SMInputTypeName',
    'TestValue',
    'QCTitleBadQty',
    'SMTestResultName',
    'BadReasonName',
    'BadReason',
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const [selectionB, setSelectionB] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionC, setSelectionC] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionD, setSelectionD] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [gridDataB, setGridDataB] = useState([])
  const [gridDataC, setGridDataC] = useState([])
  const [fileList, setFileList] = useState([])

  const [numRowsB, setNumRowsB] = useState(0)
  const [numRowsC, setNumRowsC] = useState(0)

  const [colsB, setColsB] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QC_REPORT_RESULT',
      defaultColsB.filter((col) => col.visible),
    ),
  )
  const [colsC, setColsC] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QC_FILE',
      defaultColsC.filter((col) => col.visible),
    ),
  )

  const [addedRowsB, setAddedRowsB] = useState([])
  const [addedRowsC, setAddedRowsC] = useState([])

  const [editedRowsB, setEditedRowsB] = useState([])

  const [numRowsToAddB, setNumRowsToAddB] = useState(null)

  const [dataSub, setDataSub] = useState([])

  const [dataType, setDataType] = useState([])

  //  Query
  const [QCNo, setQCNo] = useState('')
  const [SMTestMethodName, setSMTestMethodName] = useState('')
  const [SMSamplingStd, setSMSamplingStd] = useState('')
  const [SMSamplingStdName, setSMSamplingStdName] = useState('')
  const [SMAQLLevel, setSMAQLLevel] = useState('')
  const [SMAQLLevelName, setSMAQLLevelName] = useState('')
  const [AQLPoint, setAQLPoint] = useState('')
  const [SMAQLStrict, setSMAQLStrict] = useState('')
  const [SMAQLStrictName, setSMAQLStrictName] = useState('')
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
  const [SMTestMethod, setSMTestMethod] = useState('')
  const [CustSeq, setCustSeq] = useState('')
  const [WorkDate, setWorkDate] = useState('')

  const [ItemSeq, setItemSeq] = useState('')

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const fetchQcItemData = useCallback(async () => {
    if (!isAPISuccess || !ItemSeq) return
    if (controllers.current && controllers.current.fetchQcItemData) {
      controllers.current.fetchQcItemData.abort();
      controllers.current.fetchQcItemData = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchQcItemData = controller;

    setLoading(true)
    setIsAPISuccess(false)
    let hideLoadingMessage
    try {
    
      const data = [
        {
          QCSeq: QCSeq,
          ItemSeq: ItemSeq,
          SourceSeq: SourceSeq,
          SourceType: SourceType || 3,
          CustSeq: CustSeq,
        },
      ]

      const response = await GetListItemById(data)
      const fetchedData = response.data.data || []
      setDeleteDataItem(fetchedData)

      const emptyData = generateEmptyData(0, defaultCols)
      const combinedData = [...fetchedData, ...emptyData]
      const updatedData = updateIndexNo(combinedData)
      setGridData(updatedData)
      setNumRows(fetchedData.length + emptyData.length)
    } catch (error) {
      const emptyData = generateEmptyData(10, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridData(updatedEmptyData)
      setNumRows(emptyData.length)
    } finally {
      if (hideLoadingMessage) hideLoadingMessage()
      setLoading(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchQcItemData = null;
    }
  }, [QCSeq, ItemSeq, SourceSeq, SourceType, CustSeq])

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchCodeHelpData) {
      controllers.current.fetchCodeHelpData.abort();
      controllers.current.fetchCodeHelpData = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchCodeHelpData = controller;
    try {
      const [
        dataSMQcType,
        dataUser,
        dataQcTitleName,
        dataSMTestResultName,
        dataBadReason,
        dataSMAQLStrict,
        dataSMAQLLevelName,
        dataAQLAcValue,
        dataSMTestMethodName,
        dataSMSamplingStdName,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6035', '1001', '', ''),
        GetCodeHelp(10009, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(60022, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6035', '1003', '', ''),
        GetCodeHelp(60021, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6001', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6015', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6002', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6013', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6014', '', '', ''),
      ])

      setDataSMQcType(dataSMQcType.data)
      setDataUser(dataUser.data)
      setDataQcUmTitleName(dataQcTitleName.data)
      setDataSMTestResultName(dataSMTestResultName.data)
      setDataBadReason(dataBadReason.data)
      setDataSMAQLStrict(dataSMAQLStrict.data)
      setDataSMAQLLevelName(dataSMAQLLevelName.data)
      setDataAQLAcValue(dataAQLAcValue.data)
      setDataSMTestMethodName(dataSMTestMethodName.data)
      setDataSMSamplingStdName(dataSMSamplingStdName.data)
    } catch (error) {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchCodeHelpData = null;
    }
  }, [])

  const fetchCodeHelpDataUserSearch = useCallback(async () => {
   
    try {
      const [
        dataUser, 
      ] = await Promise.all([
        GetCodeHelpVer2(10009, peopleSearchSh, '', '', '', '', '1', '', 50, 'TypeSeq = 3031001', 0, 0, 0),
      ])

      setDataUser(dataUser.data?.filter(item => item.TypeSeq === 3031001) || [])
      
    } catch (error) {
    }
  }, [peopleSearchSh])

  useEffect(() => {
    fetchCodeHelpDataUserSearch()
  }, [peopleSearchSh])

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

    if (rowIndex >= 0 && rowIndex < menus.length) {
      const rowData = menus[rowIndex]
      setClickedRowData(rowData)
      setLastClickedCell(cell)
    }
  }



  const handleSaveListItemData = useCallback(async (QCSeq) => {
    const requiredColumns = ['SampleNo', 'UMQCTitleName']

    const columnsA = [
      'SampleNo',
      'UMQCTitle',
      'UMQCTitleName',
      'UMQCTitleSeq',
      'UMQcTitleSeq',
      'TestingCondition',
      'LowerLimit',
      'UpperLimit',
      'TargetLevel',
      'SMInputTypeName',
      'TestValue',
      'QCTitleBadQty',
      'SMTestResultName',
      'SMTestResultName1',
      'BadReasonName',
      'BadReason',
      'Id',
      'Status',
      'isEdited',
      'QCSeq',
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
    const resulA = filterAndSelectColumns(gridData, columnsA, 'A').map(item => ({
      ...item,
      QCSeq: QCSeq,
    }))
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
        const batchSize = 50
        const promises = []
        for (let i = 0; i < resulA.length; i += batchSize) {
          const batch = resulA.slice(i, i + batchSize)
          promises.push(CreateOrDeleteQcTestReportItem(batch))
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

            return updatedGridData
          })
        }
        results.forEach((result, index) => {
          if (result.data.success) {
            const newData = result.data.data
            if (index === 0) {
              message.success('Thêm thành công!')
            } else {
              message.success('Cập nhật thành công!')
            }

            loadingMessage()
            setIsLoading(false)
            setIsSent(false)
            // setEditedRows([])
            // updateGridData(newData)
            // resetTable()
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
    } else {
      setIsLoading(false)
      setIsSent(false)
    }
  }, [editedRows, gridData])

  const handleSaveData = useCallback(async () => {

    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
    if(!isAPISuccess){
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    if (controllers.current && controllers.current.handleSaveData) {
      controllers.current.handleSaveData.abort();
      controllers.current.handleSaveData = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.handleSaveData = controller;
    const result = [
      {
        ReqQty: ReqQty,
        SelectDate: formatDate(SelectDate),
        EmpSeq: QEmpSeq,
        EmpName: QEmpName,
        SMTestMethod: SMTestMethod,
        SMSamplingStd: SMSamplingStd || 6014001,
        TestStartDate: formatDate(TestStartDate),
        TestEndDate: formatDate(TestEndDate),
        AcBadRatio: AcBadRatio,
        RealSampleQty: RealSampleQty,
        SMAQLLevel: SMAQLLevel || 6015006,
        SMAQLStrict: SMAQLStrict || 6001001,
        ReqSampleQty: ReqSampleQty,
        AQLAcValue: AQLAcValue,
        AQLReValue: AQLReValue,
        QCSeq: QCSeq,
        ItemSeq: ItemSeq,
        SourceSerl: SourceSerl,
        SourceSeq: SourceSeq,
        SourceType: SourceType,
        SMAQLPoint: 6002009,
        QCNo: QCNo,
        IsReCfm: IsReCfm,
        BadSampleQty: BadSampleQty,
        SMTestResult: SMTestResult,
        DisposeQty: DisposeQty,
        TestUsedTime: TestUsedTime,
        PassedQty: PassedQty,
        RejectQty: RejectQty,
        Remark: Remark,
        Memo1: Memo1,
        Memo2: Memo2,
        ReqInQty: ReqInQty,
        BadSampleRate: BadSampleRate,
        SMRejectTransType: SMRejectTransType,
        FileSeq: FileSeq === '' ? 0 : FileId,
        TestEndDateOld: formatDate(TestEndDate),
      },
    ]
    setIsAPISuccess(false)

    try {
      const response = await CreateOqcBy(result)
      setLoading(true)
      if (response.data.success) {
        const qcTestReportResult = response.data.data || []
        handleSaveListItemData(qcTestReportResult[0].QCSeq)
        setQCSeq(qcTestReportResult[0].QCSeq)
        
        const saveB = await handleUploadFiles(fileList, 'file', qcTestReportResult[0].QCSeq)
        if (!saveB) {
          console.log('Upload failed')
        }
        setLoading(false)
      }else{
        message.error(response.message)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
      setIsAPISuccess(true)
      fetchQcItemData()
      controllers.current.handleSaveData = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }, [
    ReqQty,
    SelectDate,
    EmpSeq,
    EmpName,
    SMTestMethod,
    SMSamplingStd,
    TestStartDate,
    TestEndDate,
    AcBadRatio,
    RealSampleQty,
    SMAQLLevel,
    SMAQLStrict,
    ReqSampleQty,
    AQLAcValue,
    AQLReValue,
    QCSeq,
    ItemSeq,
    SourceSerl,
    SourceSeq,
    SourceType,
    QCNo,
    IsReCfm,
    BadSampleQty,
    SMTestResult,
    DisposeQty,
    TestUsedTime,
    PassedQty,
    RejectQty,
    Remark,
    Memo1,
    Memo2,
    ReqInQty,
    BadSampleRate,
    SMRejectTransType,
    FileSeq,
    FileId,
    TestEndDate,
    gridData,
    isAPISuccess,
    fileList,
  ])

  const handleDeleteData = useCallback(async () => {

    if (canDelete === false) {
      message.warning('Bạn không có quyền xóa dữ liệu')
      return
    }
    if(!isAPISuccess){
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    if (controllers.current && controllers.current.handleDeleteData) {
      controllers.current.handleDeleteData.abort();
      controllers.current.handleDeleteData = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.handleDeleteData = controller;
    const result = [
      {
        ReqQty: ReqQty,
        SelectDate: formatDate(SelectDate),
        EmpSeq: EmpSeq,
        EmpName: QEmpName,
        SMTestMethod: SMTestMethod,
        SMSamplingStd: SMSamplingStd || 6014001,
        TestStartDate: formatDate(TestStartDate),
        TestEndDate: formatDate(TestEndDate),
        AcBadRatio: AcBadRatio,
        RealSampleQty: RealSampleQty,
        SMAQLLevel: SMAQLLevel || 6015006,
        SMAQLStrict: SMAQLStrict || 6001001,
        ReqSampleQty: ReqSampleQty,
        AQLAcValue: AQLAcValue,
        AQLReValue: AQLReValue,
        QCSeq: QCSeq,
        ItemSeq: ItemSeq,
        SourceSerl: SourceSerl,
        SourceSeq: SourceSeq,
        SourceType: SourceType,
        SMAQLPoint: 6002009,
        QCNo: QCNo,
        IsReCfm: IsReCfm,
        BadSampleQty: BadSampleQty,
        SMTestResult: SMTestResult,
        DisposeQty: DisposeQty,
        TestUsedTime: TestUsedTime,
        PassedQty: PassedQty,
        RejectQty: RejectQty,
        Remark: Remark,
        Memo1: Memo1,
        Memo2: Memo2,
        ReqInQty: ReqInQty,
        BadSampleRate: BadSampleRate,
        SMRejectTransType: SMRejectTransType,
        FileSeq: FileSeq === '' ? 0 : FileId,
        TestEndDateOld: formatDate(TestEndDate),
      },
    ]
    setIsAPISuccess(false)

    try {
      const response = await DeleteOqcBy(result)
      setLoading(true)
      if (response.success) {
        const qcTestReportResult = response.data.data || []
        // handleSaveListItemData(qcTestReportResult[0].QCSeq)
        const saveB = await handleDeleteFiles(fileList, 'file', qcTestReportResult[0].QCSeq)
        if (!saveB) {
          console.log('Upload failed')
        }
        setLoading(false)
        message.success('Xóa thành công!')
        setModalDeleteConfirm(false)
        resetAll()
      }else{
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
        loadingBarRef.current.complete();
        
      }
      controllers.current.handleDeleteData = null;
    }
  }, [
    ReqQty,
    SelectDate,
    EmpSeq,
    EmpName,
    SMTestMethod,
    SMSamplingStd,
    TestStartDate,
    TestEndDate,
    AcBadRatio,
    RealSampleQty,
    SMAQLLevel,
    SMAQLStrict,
    ReqSampleQty,
    AQLAcValue,
    AQLReValue,
    QCSeq,
    ItemSeq,
    SourceSerl,
    SourceSeq,
    SourceType,
    QCNo,
    IsReCfm,
    BadSampleQty,
    SMTestResult,
    DisposeQty,
    TestUsedTime,
    PassedQty,
    RejectQty,
    Remark,
    Memo1,
    Memo2,
    ReqInQty,
    BadSampleRate,
    SMRejectTransType,
    FileSeq,
    FileId,
    TestEndDate,
    gridData,
    isAPISuccess
  ])

  const resetAll = () => {
    setBLNo('')
    setQCNo('')
    setDataMaster({})
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
    setSMAQLLevelName('')
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

    const handleDeleteFiles = async (fileList, formCode, QCSeq) => {
      if (fileList.length === 0) {
        return false
      }
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('files', file.originFileObj)
      })
      formData.append('itemNoSeq', QCSeq)
      formData.append('tableName', 'PDQCTestReportItemFin')
      formData.append('formCode', formCode)
      const result = await PostDFilesItems(formData)
      if (result.data.success) {
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
  
        fetchDataFileSeq(QCSeq, 'file')
        setFileList([])
        return true
      } else {
        message.error(result.message || 'Upload failed.')
        return false
      }
    }

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
    setEmpName('')
    setBadSampleQty(0)
    setSMTestResultName('Đạt')
    setSMTestResult(6035003)
    setDisposeQty(0)
    setTestUsedTime(0)
    setPassedQty(ReqInQty)
    setRejectQty(0)
    setRemark('')
    setMemo1('')
    setMemo2('')
    setSampleNo('')
    const hasSampleNo = gridData.some((item) => item.hasOwnProperty('SampleNo'))
    const hasFile = gridDataC.some((item) => item.hasOwnProperty('OriginalName'))
    if (hasSampleNo) {
      fetchQcItemData()
    }
    if(hasFile && QCSeq){
      fetchDataFileSeq(QCSeq, 'file')
    } 
    else {
      const allStatusA = gridData.every((item) => item.Status === 'A')
      const allGridCStatusA = gridDataC.every((item) => item.Status === 'A')
      const emptyData = generateEmptyData(0, defaultCols)
      if (allStatusA) {
        setGridData(emptyData)
        setNumRows(emptyData.length)
      }
      if (allGridCStatusA) {
        setGridDataC(emptyData)
        setNumRowsC(emptyData.length)
      }
    }
  }, [defaultCols, gridData])

  const onOkSaveFile = useCallback(async () => {
    const resultUpload = await uploadFilesItems(formData)
    const result = [
      {
        fileList: resultUpload.data.data,
        FileSeq: FileSeq,
      },
    ]

    const resultCreateTestFile = await CreateQcTestFileSave(result)

    if (resultCreateTestFile.success) {
      message.success(`${fileList} uploaded successfully`)
      setFileId(resultCreateTestFile.data.data[0].AttachFileSeq)
      fetchQcFile(resultCreateTestFile.data.data[0].AttachFileSeq)
    } else {
      throw new Error(result.message || 'Upload failed.')
    }
  }, [formData, FileId])

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

  const decryptData = (encryptedToken) => {
    try {
      const base64Data = decodeBase64Url(encryptedToken)
      const bytes = CryptoJS.AES.decrypt(base64Data, secretKey)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedData)
    } catch (error) {
      navigate(`/qc/u/iqc-page`)
      return null
    }
  }

  const decodeBase64Url = (base64Url) => {
    try {
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const padding =
        base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
      return base64 + padding
    } catch (error) {
      throw new Error('Invalid Base64 URL')
    }
  }

  const fetchQcReportResult = useCallback(async () => {
    try {
      const response = await GetListTestReportResult(QCSeq)
      if (response.success) {
        const qcTestReportResult = response.data.data || []
        setGridDataB(qcTestReportResult)
        setNumRowsB(qcTestReportResult.length)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }, [QCSeq])

  const fetchQcFile = useCallback(async (FileSeq) => {
    try {
      if (FileSeq) {
        const response = await GetListQcFile(FileSeq)
        if (response.success) {
          const qcTestReportResult = response.data.data || []
          setGridDataC(qcTestReportResult)
          setNumRowsC(qcTestReportResult.length)
        }
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }, [FileSeq])

  const handleUploadFiles = async (fileList, formCode, QCSeq) => {
          if (fileList.length === 0) {
            return false
          }
          if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart()
          }
          const formData = new FormData()
          fileList.forEach((file) => {
            formData.append('files', file.originFileObj)
          })
          formData.append('itemNoSeq', QCSeq)
          formData.append('tableName', 'PDQCTestReportItemFin')
          formData.append('formCode', formCode)
          const result = await uploadFilesItems(formData)
          if (result.data.success) {
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
    
            fetchDataFileSeq(QCSeq, 'file')
            setFileList([])
            return true
          } else {
            message.error(result.message || 'Upload failed.')
            return false
          }
        }
    
      const fetchDataFileSeq = useCallback(async (ItemNoSeq, FormCode) => {
          const controller = new AbortController()
          const signal = controller.signal
          const TableName = 'PDQCTestReportItemFin'
      
          try {
            const response = await getQFileSeq(ItemNoSeq, FormCode, TableName, signal)
      
            if (response.success) {
              const fetchedData = response.data.data || []
              setGridDataC(fetchedData)
              setNumRowsC(fetchedData.length)
            } else {
              message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
            }
          } catch (error) {
            setGridDataC([])
            setNumRowsC(0)
          } finally {
          }
        }, [])

  const fetchQcTestReportSample = useCallback(async () => {
    
    try {
      const deleteItem = deleteDataItem.map((item) => ({
        ...item,
        QCSeq: QCSeq,
        WorkingTag: 'D',
      }))
      await CreateOrDeleteQcTestReportItem(deleteItem)


      const result = [
        {
          RealSampleQty: RealSampleQty,
          SampleNo: SampleNo || 0,
          QCSeq: QCSeq, 
          ItemSeq: ItemSeq,
          SourceType: SourceType || 1,
        },
      ]

      const response = await QcTestReportSampleReq(result)
      if (response.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const QcTestReportSample = (response.data.data || []).map(
          (item, index) => ({
            ...item,
            Status: 'A',
            isEdited: true,
            Id: index + 1,
            IdxNo: index + 1,
            QCSeq: QCSeq,
          }),
        )

        setGridData(QcTestReportSample)
        setNumRows(QcTestReportSample.length)
        setModalOpenSheetConfirm(false)
      }
      else{
        const emptyData = generateEmptyData(20, defaultCols)
        setGridData(emptyData)
        setNumRows(emptyData.length)
        setModalOpenSheetConfirm(false)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }, [RealSampleQty, SampleNo, QCSeq, ItemSeq, SourceType, gridData])

  const validDate  = (dateString, setDateCallback) => {
      const parsedDate = dayjs(dateString?.trim(), 'YYYYMMDD');
      if (parsedDate.isValid()) {
        setDateCallback(parsedDate);
      } else {
        setDateCallback(dateFormat(''));
      }
    }

  const fetchDetailsData = useCallback(async () => {
    if (controllers.current && controllers.current.fetchDetailsData) {
      controllers.current.fetchDetailsData.abort();
      controllers.current.fetchDetailsData = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchDetailsData = controller;
    try {
      if (ItemSeq) {
        const data = [
          {
            ReqQty: ReqQty,
            QCSeq: QCSeq,
            ItemSeq: ItemSeq,
            ProcSeq: 0,
            SourceType: 3,
          },
        ]

        const response = await GetOQcTestReportQuery(data)

        if (response.success) {
          const qcReqDetails = response.data.data[0] || []
          setQCNo(qcReqDetails?.QCNo)
          setSMTestMethodName(qcReqDetails?.SMTestMethodName)
          setSMSamplingStdName(qcReqDetails?.SMSamplingStdName)
          validDate(qcReqDetails?.SelectDate, setSelectDate)
          if(qcReqDetails?.EmpName){
            setQEmpName(qcReqDetails?.EmpName)
          }
          if(qcReqDetails?.ReqQty){
            setReqQty(qcReqDetails?.ReqQty)
          }
          
          setSMAQLLevelName(qcReqDetails?.SMAQLLevelName)
          validDate(qcReqDetails?.TestStartDate, setTestStartDate)
          setReqSampleQty(qcReqDetails?.ReqSampleQty)
          setSMAQLStrictName(qcReqDetails?.SMAQLStrictName)
          setAQLPoint(qcReqDetails?.AQLPoint)
          setAQLReValue(qcReqDetails?.AQLReValue)
          setAQLAcValue(qcReqDetails?.AQLAcValue)
          validDate(qcReqDetails?.TestEndDate, setTestEndDate)
          setRealSampleQty(qcReqDetails?.RealSampleQty)
          setSampleNo(qcReqDetails?.SampleNo)
          setBadSampleQty(qcReqDetails?.BadSampleQty)
          if (qcReqDetails?.SMTestResultName){
            setSMTestResultName(qcReqDetails?.SMTestResultName)
            setSMTestResult(qcReqDetails?.SMTestResult)
          }else{
            setSMTestResultName('Đạt')
            setSMTestResult(6035003)
          }
          if(qcReqDetails?.ReqInQty !== 0){
            setReqInQty(qcReqDetails?.ReqInQty)
          }
          setDisposeQty(qcReqDetails?.DisposeQty)
          setTestUsedTime(qcReqDetails?.TestUsedTime)
          if (qcReqDetails?.PassedQty !== 0){
            setPassedQty(qcReqDetails?.PassedQty)
          }
          if (qcReqDetails?.RejectQty !== 0){
            setRejectQty(qcReqDetails?.RejectQty)
          }
          setAcBadRatio(qcReqDetails?.AcBadRatio)
          setRemark(qcReqDetails?.Remark)
          setMemo1(qcReqDetails?.Memo1)
          setMemo2(qcReqDetails?.Memo2)
          setIsReCfm(qcReqDetails?.IsReCfm)
          setFileSeq(qcReqDetails?.FileSeq)
          setSourceSerl(qcReqDetails?.SourceSerl)
          setSMTestMethod(qcReqDetails?.SMTestMethod)
          if(qcReqDetails?.EmpName || qcReqDetails?.EmpSeq){
            setQEmpName(qcReqDetails?.EmpName)
            setQEmpSeq(qcReqDetails?.EmpSeq)
          }else{
            setQEmpName(QCEmployee.UserName)
            setQEmpSeq(QCEmployee.UserSeq)
          }
          // setSMSamplingStd(qcReqDetails?.SMSamplingStd)
          setSMRejectTransType(qcReqDetails?.SMRejectTransType)
        
          if(qcReqDetails?.SourceSeq){
            setSourceSeq(qcReqDetails?.SourceSeq)
          }
          if(qcReqDetails?.SourceType){
            setSourceType(qcReqDetails?.SourceType)
          }
        } else {
          message.error(
            response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!',
          )
        }
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchDetailsData = null;
    }
  }, [ReqQty, QCSeq, ItemSeq, FileSeq])

  const fetchDetailsMasterData = useCallback(async () => {
    
    try {
      if (id) {
        const dataDecrypt = decryptData(id)
        const data = [
          {
            FactUnitName: dataDecrypt.FactUnitName,
            FactUnit: dataDecrypt.FactUnit,
            SourceTypeName: dataDecrypt.SourceTypeName,
            DeptName: dataDecrypt.DeptName,
            WorkDate: dataDecrypt.WorkDate,
            DelvNo: dataDecrypt.DelvNo,
            ProdPlanNo: dataDecrypt.ProdPlanNo,
            ItemName: dataDecrypt.ItemName,
            ItemNo: dataDecrypt.ItemNo,
            Spec: dataDecrypt.Spec,
            ProcName: dataDecrypt.ProcName,
            QCNo: dataDecrypt.QCNo,
            TestEndDate: dataDecrypt.TestEndDate,
            ReqQty: dataDecrypt.ReqQty,
            OKQty: dataDecrypt.OKQty,
            RemainQty: dataDecrypt.RemainQty,
            BadQty: dataDecrypt.BadQty,
            LOTNo: dataDecrypt.LOTNo,
            FromSerial: dataDecrypt.FromSerial,
            ToSerial: dataDecrypt.ToSerial,
            DeptSeq: dataDecrypt.DeptSeq,
            ProcSeq: dataDecrypt.ProcSeq,
            SourceSeq: dataDecrypt.SourceSeq,
            SourceKind: dataDecrypt.SourceKind,
            ItemSeq: dataDecrypt.ItemSeq,
            QCSeq: dataDecrypt.QCSeq,
            SMTestResult: dataDecrypt.SMTestResult,
            EmpSeq: dataDecrypt.EmpSeq,
            EmpName: dataDecrypt.EmpName,
            WorkCenterName: dataDecrypt.WorkCenterName,
            WorkCenterSeq: dataDecrypt.WorkCenterSeq,
            CustName: dataDecrypt.CustName,
          },
        ]

        const response = await GetOQCSeq(data)
        

        if (response.success) {
          const qcReqDetails = response.data.data[0] || []
          setDataMaster(qcReqDetails)

          console.log('qcReqDetails?.ReqQty', qcReqDetails?.ReqQty)

          setQCSeq(qcReqDetails?.QCSeq || 0)
          setReqQty(qcReqDetails?.ReqQty ?  qcReqDetails?.ReqQty : qcReqDetails?.RemainQty )
          setItemSeq(qcReqDetails?.ItemSeq)
          setSourceSeq(qcReqDetails?.SourceSeq)
          setSourceType(qcReqDetails?.SourceKind)
          setCustSeq(qcReqDetails?.CustSeq)
          validDate(qcReqDetails?.WorkDate, setWorkDate)
          

        } else {
          message.error(
            response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!',
          )
        }
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchDetailsData = null;
    }
  }, [ReqQty, QCSeq, ItemSeq, FileSeq])
  console.log('ReqQty', ReqQty)

  useEffect(() => {
    if(QCSeq){
      fetchDataFileSeq(QCSeq, 'file')
    }
    fetchDetailsData()
    fetchQcItemData()
   
  }, [fetchDetailsData, fetchQcItemData, fetchDataFileSeq])

  useEffect(() => {
    fetchDetailsMasterData()
  }, [id])

  return (
    <>
      <Helmet>
        <title>HPM - {t('800000151')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000151')}
              </Title>
              <IqcOutsourceReqDetailsActions
                handleRestSheet={handleRestSheet}
                handleSaveData={handleSaveData}
                setModalDeleteConfirm = {setModalDeleteConfirm}
                fetchQcTestReportSample = {fetchQcTestReportSample}
              />
            </div>

            <div className="">
              <OqcReqDetailQuery
                dataMaster={dataMaster}
                dataSMQcType={dataSMQcType}
                setSMQcType={setSMQcType}
                dataSMAQLStrict = {dataSMAQLStrict}
                dataSMAQLLevelName= {dataSMAQLLevelName}
                dataAQLAcValue={dataAQLAcValue}
                dataSMTestMethodName={dataSMTestMethodName}
                dataSMSamplingStdName={dataSMSamplingStdName}
                BLNo={BLNo}
                setBLNo={setBLNo}
                setEmpSeq={setEmpSeq}
                setEmpName={setQEmpName}
                setUserId={setUserId}
                dataUser={dataUser}
                QCNo={QCNo}
                setQCNo={setQCNo}
                SMTestMethodName={SMTestMethodName}
                setSMTestMethodName={setSMTestMethodName}
                SMSamplingStd={SMSamplingStd}
                setSMSamplingStd={setSMSamplingStd}
                SMSamplingStdName={SMSamplingStdName}
                setSMSamplingStdName={setSMSamplingStdName}
                SMAQLLevel={SMAQLLevel}
                setSMAQLLevel={setSMAQLLevel}
                SMAQLLevelName={SMAQLLevelName}
                setSMAQLLevelName={setSMAQLLevelName}
                AQLPoint={AQLPoint}
                setAQLPoint={setAQLPoint}
                SMAQLStrict={SMAQLStrict}
                setSMAQLStrict={setSMAQLStrict}
                SMAQLStrictName={SMAQLStrictName}
                setSMAQLStrictName={setSMAQLStrictName}
                AQLAcValue={AQLAcValue}
                setAQLAcValue={setAQLAcValue}
                AQLReValue={AQLReValue}
                setAQLReValue={setAQLReValue}
                AcBadRatio={AcBadRatio}
                setAcBadRatio={setAcBadRatio}
                ReqQty={ReqQty}
                setReqQty={setReqQty}
                ReqSampleQty={ReqSampleQty}
                setReqSampleQty={setReqSampleQty}
                SelectDate={SelectDate}
                setSelectDate={setSelectDate}
                TestStartDate={TestStartDate}
                setTestStartDate={setTestStartDate}
                TestEndDate={TestEndDate}
                setTestEndDate={setTestEndDate}
                TestDocNo={TestDocNo}
                setTestDocNo={setTestDocNo}
                RealSampleQty={RealSampleQty}
                setRealSampleQty={setRealSampleQty}
                SampleNo={SampleNo}
                setSampleNo={setSampleNo}
                BadSampleQty={BadSampleQty}
                setBadSampleQty={setBadSampleQty}
                BadSampleRate={BadSampleRate}
                SMTestResult={SMTestResult}
                setSMTestResult={setSMTestResult}
                SMTestResultName={SMTestResultName}
                setSMTestResultName={setSMTestResultName}
                PassedQty={PassedQty}
                setPassedQty={setPassedQty}
                RejectQty={RejectQty}
                setRejectQty={setRejectQty}
                DisposeQty={DisposeQty}
                setDisposeQty={setDisposeQty}
                ReqInQty={ReqInQty}
                setReqInQty={setReqInQty}
                TestUsedTime={TestUsedTime}
                setTestUsedTime={setTestUsedTime}
                Remark={Remark}
                setRemark={setRemark}
                SMRejectTransType={SMRejectTransType}
                EmpSeq={QEmpSeq}
                DeptSeq={QDeptSeq}
                EmpName={QEmpName}
                Memo1={Memo1}
                setMemo1={setMemo1}
                Memo2={Memo2}
                setMemo2={setMemo2}
                FileSeq={FileSeq}
                IsReCfm={IsReCfm}
                setIsReCfm={setIsReCfm}
                setLoading={setLoading}
                peopleSearchSh= {peopleSearchSh}
                setPeopleSearchSh={setPeopleSearchSh}
                WorkDate={WorkDate}
                setWorkDate={setWorkDate}
              />
            </div>
          </div>

          <div className="col-start-1 flex gap-3 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-hidden">
            <Splitter className="w-full h-full">
              <SplitterPanel size={60} minSize={20}>
                <TableIqcItemReq
                  dataQcUmTitleName={dataQcUmTitleName}
                  dataSMTestResultName={dataSMTestResultName}
                  dataBadReason={dataBadReason}
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
                  canEdit={canEdit}
                />
              </SplitterPanel>
              <SplitterPanel size={40} minSize={10}>
                <TabViewIqcOptions
                  dataType={dataType}
                  setSelection={setSelectionB}
                  selection={selectionB}
                  showSearch={showSearch}
                  setShowSearch={setShowSearch}
                  setAddedRows={setAddedRowsB}
                  addedRows={addedRowsB}
                  setEditedRows={setEditedRowsB}
                  editedRows={editedRowsB}
                  setNumRowsToAdd={setNumRowsToAddB}
                  numRowsToAdd={numRowsToAddB}
                  numRows={numRowsB}
                  setGridData={setGridDataB}
                  gridData={gridDataB}
                  setNumRows={setNumRowsB}
                  setCols={setColsB}
                  handleRowAppend={handleRowAppendB}
                  cols={colsB}
                  canCreate={canCreate}
                  defaultCols={defaultColsB}
                  canEdit={canEdit}
                  dataSub={dataSub}
                  setSelectionC={setSelectionC}
                  selectionC={selectionC}
                  setAddedRowsC={setAddedRowsC}
                  addedRowsC={addedRowsC}
                  numRowsC={numRowsC}
                  setGridDataC={setGridDataC}
                  gridDataC={gridDataC}
                  setNumRowsC={setNumRowsC}
                  setColsC={setColsC}
                  colsC={colsC}
                  defaultColsC={defaultColsC}
                  setFileList={setFileList}
                  fileList={fileList}               
                  setFormData={setFormData}
                  FileId = {FileId}
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

      <ModalConfirm
        modalOpen={modalOpenSheetConfirm}
        setmodalOpen={setModalOpenSheetConfirm}
        MessageConfirm={'Xác nhận thay đổi dữ liệu?'}
        onOk={fetchQcTestReportSample}
        isShowInput={false}
      />

      <ModalConfirm
        modalOpen={modalDeleteConfirm}
        setmodalOpen={setModalDeleteConfirm}
        MessageConfirm={'Xác nhận xóa dữ liệu?'}
        onOk={handleDeleteData}
        isShowInput={false}
      />
    </>
  )
}
