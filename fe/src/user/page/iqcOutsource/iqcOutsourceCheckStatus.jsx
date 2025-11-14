import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined } from '@ant-design/icons'

import { Typography, message, } from 'antd'
const { Title, } = Typography
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
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import IqcCheckStatusActions from '../../components/actions/iqc/iqcCheckStatusActions'
import TopLoadingBar from 'react-top-loading-bar';
import { SearchPageIqcOutsourceCheckStatus } from '../../../features/iqc-outsource/searchPageIqcCheckStatus'
import TableIqcOutsourceCheckStatusList from '../../components/table/iqcOutsource/tableIqcOutsourceCheckStatusList'
import { formatNumberCellSum } from '../../../utils/formatNumberCellSum'
import IqcOutsourceCheckStatusQuery from '../../components/query/iqcOutsource/iqcOutsourceCheckStatusQuery'
export default function IqcOutsourceCheckStatus({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
}) {
  const { t } = useTranslation()
  const formatDate = (date) => (date ? date.format('YYYYMMDD') : '')
  const loadingBarRef = useRef(null);

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
        title: t('3'),
        id: 'FactUnitName',
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
        title: t('3672'),
        id: 'TestEndDate',
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
        title: t('2627'),
        id: 'QCNo',
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
        title: t('141'),
        id: 'DelvDate',
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
        title: t('684'),
        id: 'DelvNo',
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
        title: t('1985'),
        id: 'WorkOrderNo',
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
        title: t('695'),
        id: 'CustName',
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
        title: t('2034'),
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
        title: t('2035'),
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
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('510'),
        id: 'ProcName',
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
        title: t('25431'),
        id: 'LotNo',
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
        title: t('474'),
        id: 'SMTestResultName',
        kind: 'Text',
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
        title: t('475'),
        id: 'SMTestMethodName',
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
        title: t('2200'),
        id: 'SMAQLLevelName',
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
        title: t('29615'),
        id: 'AQLName',
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
        title: t('3669'),
        id: 'QCQty',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalQCQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('10537'),
        id: 'PassedQty',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalPassedQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('6024'),
        id: 'RejectQty',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalRejectQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },

      {
        title: t('6016'),
        id: 'BadRate',
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
        title: t('2631'),
        id: 'EmpName',
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
        title: t('534'),
        id: 'CustName',
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
        title: t('362'),
        id: 'Remark',
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
        title: t('19799'),
        id: 'Memo1',
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
        title: t('19800'),
        id: 'Memo2',
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
        id: 'ItemClassSName',
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
        title: t('3262'),
        id: 'ItemClassMName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2115'),
        id: 'ItemClassLName',
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
    [t, totalQCQty, totalPassedQty, totalRejectQty],
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
      'S_ERP_COLS_PAGE_IQC_OUTSOURCE_STATUS_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)

  /* Q */
  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataSMQcType, setDataSMQcType] = useState([])
  const [FactUnit, setFactUnit] = useState('')

  const [QCDateFrom, setQCDateFrom] = useState(dayjs().startOf('month'))
  const [QCDateTo, setQCDateTo] = useState(dayjs())

  const [QcNo, setQcNo] = useState('')
  const [SMQcType, setSMQcType] = useState('')
  const [CustSeq, setCustSeq] = useState('')
  const [CustName, setCustName] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')

  const [ItemName, setItemName] = useState('')
  const [ItemNo, setItemNo] = useState('')
  const [Spec, setSpec] = useState('')
  const [ProcName, setProcName] = useState('')
  const [WorkOrderNo, setWorkOrderNo] = useState('')
  const [LotNo, setLotNo] = useState('')
  const [ItemClassLSeq, setItemClassLSeq] = useState('')
  const [ItemClassMSeq, setItemClassMSeq] = useState('')
  const [ItemClassSSeq, setItemClassSSeq] = useState('')
  const [TestEndDateFrom, setTestEndDateFrom] = useState('')
  const [TestEndDateTo, setTestEndDateTo] = useState('')

  const [dataCustomer, setDataCustomer] = useState([])


  const navigate = useNavigate()
  const [keyPath, setKeyPath] = useState('')
  const [dataSelect, setDataSelect] = useState([])

  const fieldsToTrack = [
    'Select',
    'BizUnitName',
    'BizUnit',
    'SourceTypeName',
    'BLDate',
    'CustName',
    'BLRefNo',
    'BLNo',
    'DeptName',
    'EmpName',
    'PJTName',
    'PJTNo',
    'PJTSeq',
    'WBSSeq',
    'ItemName',
    'ItemNo',
    'Spec',
    'UnitName',
    'ItemClassLName',
    'ItemClassMName',
    'ItemClassName',
    'Qty',
    'QCNo',
    'QCDate',
    'QCEmpName',
    'OkQty',
    'BadQty',
    'LOTNo',
    'FromSerial',
    'BLSeq',
    'ToSerial',
    'BLSerl',
    'ItemSeq',
    'SourceSeq',
    'SourceSerl',
    'SourceType',
    'QCSeq',
    'SMTestResultName',
    'SMTestResult',
    'Remark',
    'AssetSeq',
    'AssetName',
    'DelvDate',
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
      controllers.current.fetchData.abort();
      controllers.current.fetchData = null;
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

    controllers.current.fetchData = controller;

    setLoading(true)
    setIsAPISuccess(false)
    let hideLoadingMessage
    try {

      const data = [
        {
          FactUnit: FactUnit,
          TestEndDateFrom: formatDate(QCDateFrom),
          TestEndDateTo: formatDate(QCDateTo),
          ItemName: ItemName,
          ItemNo: ItemNo,
          Spec: Spec,
          CustSeq: CustSeq,
          CustName: CustName,
          QCNo: QcNo,
          SMQcType: SMQcType,
          LotNo: LotNo,
          ItemClassLSeq: ItemClassLSeq,
          ItemClassMSeq: ItemClassMSeq,
          ItemClassSSeq: ItemClassSSeq,
          WorkOrderNo: WorkOrderNo,
          ProcName: ProcName
        },
      ]

      const response = await SearchPageIqcOutsourceCheckStatus(data)
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
        loadingBarRef.current.complete();
      }
      controllers.current.fetchData = null;
    }
  }, [
    FactUnit,
    QCDateFrom,
    QCDateTo,
    QcNo,
    SMQcType,
    CustSeq,
    DeptSeq,
    ItemName,
    ItemNo,
    Spec,
    TestEndDateTo,
    TestEndDateFrom,
    ItemClassLSeq,
    LotNo,
    ProcName,
    WorkOrderNo
  ])

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
        dataBizUnit,
        dataSMQcType,
        dataCustomer,
        dataDepartment,
        dataUser,
        dataAsset,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6035', '1002', '', ''),
        GetCodeHelp(17041, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0),
        GetCodeHelp(90003, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpCombo('', 6, 10012, 1, '%', '', '', '', ''),
      ])

      setDataBizUnit(dataBizUnit.data)
      setDataSMQcType(dataSMQcType.data)
      setDataCustomer(dataCustomer.data)
      setDataDepartment(dataDepartment.data)
      setDataUser(dataUser.data)
      setDataAsset(dataAsset.data)
    } catch (error) {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchCodeHelpData = null;
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

  const onCellClicked = useCallback(
    (cell, event) => {
      let rowIndex

      if (cell[0] >= 0 && cell[0] < 3) {
        return
      }

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

      setDataSelect(getSelectRows())

      if (rowIndex >= 0 && rowIndex < gridData.length) {
        const rowData = gridData[rowIndex]

        const filteredData = {
          BLNo: rowData.BLNo,
          BLRefNo: rowData.BLRefNo,
          CustName: rowData.CustName,
          ItemName: rowData.ItemName,
          ItemNo: rowData.ItemNo,
          Spec: rowData.Spec,
          Qty: rowData.Qty,
          ReqQty: rowData.PassedQty,
          ReqInQty: rowData.ReqInQty,
          PassedQty: rowData.PassedQty,
          RejectQty: rowData.RejectQty,
          TestEndDate: rowData.TestEndDate,
          Remark: rowData.Remark,
          ItemSeq: rowData.ItemSeq,
          SourceSeq: rowData.SourceSeq,
          SourceSerl: rowData.SourceSerl,
          SourceType: rowData.SourceType,
          QCSeq: rowData.QCSeq,
          EmpSeq: rowData.EmpSeq,
          SMTestResult: rowData.SMTestResult,
          SMTestResultName: rowData.SMTestResultName,
        }

        const secretKey = 'TEST_ACCESS_KEY'
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(filteredData),
          secretKey,
        ).toString()

        const encryptedToken = encodeBase64Url(encryptedData)
        setKeyPath(encryptedToken)
        setClickedRowData(rowData)
        setLastClickedCell(cell)
        navigate(`/qc/u/iqc-outsource/${encryptedToken}`)
      }
    },
    [keyPath, getSelectRows, dataSelect],
  )

  const handleSaveData = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
    const requiredColumns = [
      'ItemName',
      'ItemNo',
      'AssetName',
      'UnitName',
      'SMStatusName',
      'ItemClassSName',
    ]

    const columnsU = [
      'TestEndDate',
      'QCNo',
      'BLDate',
      'BLRefNo',
      'BLNo',
      'ItemName',
      'ItemNo',
      'Spec',
      'LotNo',
      'SMTestResultName',
      'SMTestMethodName',
      'SMAQLLevelName',
      'AQLName',
      'ReqQty',
      'QCQty',
      'QCSeq',
      'PassedQty',
      'RejectQty',
      'BadRate',
      'RealSampleQty',
      'BadSampleQty',
      'BadSampleRate',
      'EmpName',
      'BLSeq',
      'BLSerl',
      'CustName',
      'Remark',
      'Memo1',
      'Memo2',
      'SourceType',
      'SourceSeq',
      'SourceSerl',
      'ItemSeq',
      'ItemClassSName',
      'ItemClassMName',
      'ItemClassLName',
      'ItemClassSSeq',
      'ItemClassMSeq',
      'ItemClassLSeq',
      'DelvDate',
      'DisposeQty',
      'IsFile',
      'LastUserName',
      'LastDateTime',
    ]

    const columnsA = [
      'TestEndDate',
      'QCNo',
      'BLDate',
      'BLRefNo',
      'BLNo',
      'ItemName',
      'ItemNo',
      'Spec',
      'LotNo',
      'SMTestResultName',
      'SMTestMethodName',
      'SMAQLLevelName',
      'AQLName',
      'ReqQty',
      'QCQty',
      'QCSeq',
      'PassedQty',
      'RejectQty',
      'BadRate',
      'RealSampleQty',
      'BadSampleQty',
      'BadSampleRate',
      'EmpName',
      'BLSeq',
      'BLSerl',
      'CustName',
      'Remark',
      'Memo1',
      'Memo2',
      'SourceType',
      'SourceSeq',
      'SourceSerl',
      'ItemSeq',
      'ItemClassSName',
      'ItemClassMName',
      'ItemClassLName',
      'ItemClassSSeq',
      'ItemClassMSeq',
      'ItemClassLSeq',
      'DelvDate',
      'DisposeQty',
      'IsFile',
      'LastUserName',
      'LastDateTime',
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
          promises.push(PostA(resulA))
        }

        if (resulU.length > 0) {
          promises.push(PostU(resulU))
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
              message.success('Cập nhật  thành công!')
            }

            loadingMessage()
            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            updateGridData(newData)
            resetTable()
          } else {
            loadingMessage()
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setIsModalVisible(true)
            message.error('Có lỗi xảy ra khi lưu dữ liệu')
          }
        })
      } catch (error) {
        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
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
        <title>HPM - {t('800000111')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000111')}
              </Title>
              <IqcCheckStatusActions fetchDataQuery={fetchData} />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
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
                <IqcOutsourceCheckStatusQuery
                  dataBizUnit={dataBizUnit}
                  dataSMQcType={dataSMQcType}
                  setBizUnit={setFactUnit}
                  QCDateFrom={QCDateFrom}
                  setQCDateFrom={setQCDateFrom}
                  QCDateTo={QCDateTo}
                  setQCDateTo={setQCDateTo}
                  QcNo={QcNo}
                  setQcNo={setQcNo}
                  setSMQcType={setSMQcType}
                  CustSeq={CustSeq}
                  setCustSeq={setCustSeq}
                  ItemName={ItemName}
                  setItemName={setItemName}
                  ItemNo={ItemNo}
                  setItemNo={setItemNo}
                  dataCustomer={dataCustomer}
                  CustName={CustName}
                  setCustName={setCustName}
                  WorkOrderNo={WorkOrderNo}
                  setWorkOrderNo={setWorkOrderNo}
                  ProcName={ProcName}
                  setProcName={setProcName}
                  LotNo={LotNo}
                  setLotNo={setLotNo}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableIqcOutsourceCheckStatusList
              handleRestSheet={handleRestSheet}
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
