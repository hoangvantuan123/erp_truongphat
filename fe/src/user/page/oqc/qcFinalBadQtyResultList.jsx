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
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import TopLoadingBar from 'react-top-loading-bar';
import { formatNumberCellSum } from '../../../utils/formatNumberCellSum'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import QcFinalBadQtyActions from '../../components/actions/oqc/qcFinalBadQtyActions'
import QcFinalBadQtyResultListQuery from '../../components/query/oqc/qcFinalBadQtyResultListQuery'
import { SearchPageQcFinalBadQtyResultList } from '../../../features/oqc/searchPageQcBadQtyResultList'
import TableQcFinalBadQtyResultList from '../../components/table/oqc/tableQcFinalBadQtyResultList'
export default function QcFinalBadQtyResultList({
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
        title: t('3164'),
        id: 'FactUnit',
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
        title: t('1985'),
        id: 'WorkOrderNo',
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
        title: t('218'),
        id: 'WorkDate',
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
        title: t('2627'),
        id: 'QCNo',
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
        title: t('120'),
        id: 'QCDate',
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
        id: 'GoodItemName',
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
        id: 'GoodItemNo',
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
        id: 'GoodItemSpec',
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
        title: t('602'),
        id: 'UnitName',
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
        title: t('3669'),
        id: 'QCQty',
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
        title: t('6009'),
        id: 'BadQty',
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
        title: t('38099'),
        id: 'ReOrderQty',
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
        title: t('17025'),
        id: 'ReWorkQty',
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
        title: t('19090'),
        id: 'BreakOrderQty',
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
        title: t('14404'),
        id: 'RemainQty',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(0),
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
        title: t('1984'),
        id: 'WorkOrderSeq',
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
        title: t('8755'),
        id: 'GoodItemSeq',
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
        title: t('3662'),
        id: 'QCSeq',
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
        title: t('1059'),
        id: 'WorkCenterName',
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
        title: t('1062'),
        id: 'WorkCenterSeq',
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
        id: 'RealLotNo',
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
        title: t('29614'),
        id: 'SerialNoFrom',
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
        title: t('29963'),
        id: 'SerialNoTo',
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
        title: t('744'),
        id: 'DeptName',
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
        title: t('369'),
        id: 'ProgStatus',
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
        title: t('369'),
        id: 'ProgStatusName',
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
        id: 'UMItemClassLName',
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
        id: 'UMItemClassMName',
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
        id: 'UMItemClassSName',
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
        title: t('14422'),
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
  const [dataError, setDataError] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_FINAL_BAD_QTY_RESULT_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const lastWordEntryRef = useRef(null)

  /* data code help */
  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataItemClassLName, setDataItemClassLName] = useState([])
  const [dataItemClassMName, setDataItemClassMName] = useState([])
  const [dataItemClassSName, setDataItemClassSName] = useState([])
  const [dataWorkCenter, setDataWorkCenter] = useState([])
  const [dataProgStatusName, setDataProgStatusName] = useState([])

  /* Query Field */
  const [FactUnit, setFactUnit] = useState('')
  const [QCDateFrom, setQCDateFrom] = useState(dayjs().startOf('month'))
  const [QCDateTo, setQCDateTo] = useState(dayjs())

  const [QcNo, setQcNo] = useState('')

  const [ItemLClass, setItemLClass] = useState('')
  const [ItemLClassName, setItemLClassName] = useState('')
  const [ItemMClass, setItemMClass] = useState('')
  const [ItemMClassName, setItemMClassName] = useState('')
  const [ItemSClass, setItemSClass] = useState('')
  const [ItemSClassName, setItemSClassName] = useState('')
  const [ProgStatus, setProgStatus] = useState('')
  const [ProgStatusName, setProgStatusName] = useState('')
  const [DeptName, setDeptName] = useState('')

  const [SMQcType, setSMQcType] = useState('')
  const [SMQcTypeName, setSMQcTypeName] = useState('')
  
  const [ItemName, setItemName] = useState('')
  const [ItemNo, setItemNo] = useState('')
  const [Spec, setSpec] = useState('')
  const [ProcName, setProcName] = useState('')
  const [WorkOrderNo, setWorkOrderNo] = useState('')
  const [LotNo, setLotNo] = useState('')
  const [TestEndDateFrom, setTestEndDateFrom] = useState('')
  const [TestEndDateTo, setTestEndDateTo] = useState('')

  const [WorkCenter, setWorkCenter] = useState('')
  const [WorkCenterName, setWorkCenterName] = useState('')
  const [WorkType, setWorkType] = useState('')
  const [EmpSeq, setEmpSeq] = useState('')

  const navigate = useNavigate()
  const [keyPath, setKeyPath] = useState('')
  const [dataSelect, setDataSelect] = useState([])

  const fieldsToTrack = [
    'FactUnitName',
    'WorkOrderNo',
    'WorkDate',
    'QCNo',
    'QCDate',
    'GoodItemName',
    'GoodItemNo',
    'GoodItemSpec',
    'UnitName',
    'QCQty',
    'BadQty',
    'ReOrderQty',
    'ReWorkQty',
    'BreakOrderQty',
    'RemainQty',
    'FactUnit',
    'WorkOrderSeq',
    'GoodItemSeq',
    'QCSeq',
    'WorkCenterName',
    'WorkCenterSeq',
    'RealLotNo',
    'SerialNoFrom',
    'SerialNoTo',
    'DeptName',
    'ProgStatusName',
    'UMItemClassLName',
    'UMItemClassMName',
    'UMItemClassSName',
    'Remark',
    'Memo1',
    'Memo2',
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
    if (!isAPISuccess){

      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    } 

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
          QCDate: formatDate(QCDateFrom),
          QCDateTo: formatDate(QCDateTo),
          WorkOrderNo: WorkOrderNo,
          QCNo: QcNo,
          GoodItemName: ItemName,
          GoodItemNo: ItemNo,
          GoodItemSpec: Spec,
          ProgStatus: ProgStatus,
          WorkCenterSeq: WorkCenter,
          WorkCenterName : WorkCenterName,
          UMItemClassL : ItemLClass,
          UMItemClassM : ItemMClass,
          UMItemClassS : ItemSClass,

          RealLotNo: LotNo,
          DeptName : DeptName
        },
      ]

      const response = await SearchPageQcFinalBadQtyResultList(data)
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
    SMQcTypeName,
    DeptName,
    ItemName,
    ItemNo,
    Spec,
    TestEndDateTo,
    TestEndDateFrom,
    LotNo,
    ProcName,
    EmpSeq,
    isAPISuccess,
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
        dataWorkCenter,
        dataItemClassLName,
        dataItemClassMName,
        dataItemClassName,
        dataProgStatusName,
      ] = await Promise.all([
        GetCodeHelpComboVer2('', 6, 60001, 1, '%', '', '', '', ''),
        GetCodeHelpVer2(60002, '', '', '', '', '', '1', '',1000, 'IsYn = 1', 0, 0, 0),
        GetCodeHelpVer2(18097, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(18098, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(10014, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '1070', '', '', ''),
      ])

      setDataBizUnit(dataBizUnit.data)
      setDataWorkCenter(dataWorkCenter.data)
      setDataItemClassLName(dataItemClassLName.data)
      setDataItemClassMName(dataItemClassMName.data)
      setDataItemClassSName(dataItemClassName.data)
      setDataProgStatusName(dataProgStatusName.data)

    } catch (error) {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchCodeHelpData = null;
    }
  }, [])

  const fetchCodeHelpWorkCenter = useCallback(async () => {
   
    try {
      const [
        dataWorkCenter,
      ] = await Promise.all([
        GetCodeHelpVer2(60002, '', FactUnit, '', '', '', '1', '',1000, 'IsYn = 1', 0, 0, 0),
      ])
      setDataWorkCenter(dataWorkCenter.data)
    } catch (error) {
      console.log(error)
    }
  }, [FactUnit])

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
    fetchCodeHelpWorkCenter()
  }, [FactUnit])

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
      setDataItemClassSName(dataItemClassName.data)
    } catch (error) {
    }
  }, [ItemLClass, ItemMClass])

  useEffect(() => {
    fetchCodeHelpItemClass()
  }, [ItemLClass, ItemMClass])

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
        const data = {
          DelvNo: rowData.WorkOrderNo,
          DeptName: rowData.DeptName,
          WorkDate: rowData.WorkDate,
          ItemName: rowData.GoodItemName,
          ItemNo: rowData.GoodItemNo,
          ItemSeq: rowData.GoodItemSeq,
          Spec: rowData.Spec,
          SerialNoFr: rowData.SerialNoFr,
          SerialNoTo: rowData.SerialNoTo,
          LOTNo: rowData.LOTNo,
          ReqQty: rowData.QCQty,
          QCNo: rowData.QCNo,
          SMTestMethodName: rowData.SMTestMethodName,
          SMSamplingStdName: rowData.SMSamplingStdName,
          SelectDate: rowData.SelectDate,
          EmpName: rowData.EmpName,
          SMAQLLevelName: rowData.SMAQLLevelName,
          TestStartDate: rowData.TestStartDate,
          ReqSampleQty: rowData.ReqSampleQty,
          SMAQLStrictName: rowData.SMAQLStrictName,
          AQLAcValue: rowData.AQLAcValue,
          TestEndDate: rowData.QCDate,
          TestDocNo: rowData.TestDocNo,
          IsReCfm: rowData.IsReCfm,
          AQLReValue: rowData.AQLReValue,
          RealSampleQty: rowData.RealSampleQty,
          BadSampleQty: rowData.BadSampleQty,
          SMTestResultName: rowData.SMTestResultName,
          ReqInQty: rowData.ReqInQty,
          DisposeQty: rowData.DisposeQty,
          TestUsedTime: rowData.TestUsedTime,
          PassedQty: rowData.PassedQty,
          RejectQty: rowData.RejectQty,
          AcBadRatio: rowData.AcBadRatio,
          Remark: rowData.Remark,
          Memo1: rowData.Memo1,
          Memo2: rowData.Memo2,
          SampleNo: rowData.SampleNo,
          QCSeq: rowData.QCSeq,

        };
        
        const secretKey = 'TEST_ACCESS_KEY'
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          secretKey,
        ).toString()

        const encryptedToken = encodeBase64Url(encryptedData)
        setKeyPath(encryptedToken)
        setClickedRowData(rowData)
        setLastClickedCell(cell)
        navigate(`/qc/u/qc-finish-detail/${encryptedToken}`)
      }
    },
    [keyPath, getSelectRows, dataSelect],
  )

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
        <title>ITM - {t('800000149')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000149')}
              </Title>
              <QcFinalBadQtyActions fetchDataQuery={fetchData} />
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
                <QcFinalBadQtyResultListQuery
                  dataWorkCenter={dataWorkCenter}
                  dataBizUnit={dataBizUnit}
                  dataProgStatusName={dataProgStatusName}
                  dataItemClassLName={dataItemClassLName}
                  dataItemClassMName={dataItemClassMName}
                  dataItemClassSName={dataItemClassSName}
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
                  FactUnit={FactUnit}
                  setFactUnit={setFactUnit}
                  QCDateFrom={QCDateFrom}
                  setQCDateFrom={setQCDateFrom}
                  QCDateTo={QCDateTo}
                  setQCDateTo={setQCDateTo}
                  QcNo={QcNo}
                  setQcNo={setQcNo}
                  ItemName={ItemName}
                  setItemName={setItemName}
                  ItemNo={ItemNo}
                  setItemNo={setItemNo}
                  setProgStatus={setProgStatus}
                  setProgStatusName={setProgStatusName}
                  WorkCenterName={WorkCenterName}
                  setWorkCenterName={setWorkCenterName}
                  WorkCenter={WorkCenter}
                  setWorkCenter={setWorkCenter}
                  WorkOrderNo={WorkOrderNo}
                  setWorkOrderNo={setWorkOrderNo}
                  LotNo={LotNo}
                  setLotNo={setLotNo}
                  DeptName = {DeptName}
                  setDeptName = {setDeptName}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableQcFinalBadQtyResultList
              dataProgStatusName = {dataProgStatusName}
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
              canCreate={canCreate}
              canEdit={canEdit}
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
