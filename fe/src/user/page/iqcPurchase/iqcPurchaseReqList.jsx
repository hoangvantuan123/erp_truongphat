import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined, } from '@ant-design/icons'

import { Typography, message, } from 'antd'
const { Title } = Typography
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
import { SearchIqcPurchasePage } from '../../../features/iqc-purchase/searchIqcPurchasePage'
import IqcPurchaseReqListQuery from '../../components/query/iqcPurchase/iqcPurchaseReqListQuery'
import TableIqcPurchaseReqList from '../../components/table/iqcPurchase/tableIqcPurchaseReqList'
import IqcPurchaseReqListActions from '../../components/actions/iqc-purchase/iqcPurchaseReqListActions'
import TopLoadingBar from 'react-top-loading-bar';
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'

export default function IqcPurchaseReqList({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
}) {
  const loadingBarRef = useRef(null);
  const { t } = useTranslation()
  const formatDate = (date) =>  date ? date.format('YYYYMMDD') : ''
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
        title: t('2'),
        id: 'BizUnitName',
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
        title: t('2'),
        id: 'BizUnit',
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
        title: t('474'),
        id: 'SourceTypeName',
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
        title: t('141'),
        id: 'DelvDate',
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
        title: t('534'),
        id: 'CustName',
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
        title: t('684'),
        id: 'DelvNo',
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
        title: t('740'),
        id: 'DeptName',
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
        title: t('2339'),
        id: 'EmpName',
        kind: 'Text',
        readonly: false,
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
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('18801'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('602'),
        id: 'UnitName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2336'),
        id: 'Qty',
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
        title: t('2337'),
        id: 'WHName',
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
        title: t('25431'),
        id: 'LOTNo',
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
        title: t('2627'),
        id: 'QCNo',
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
        title: t('3672'),
        id: 'QCDate',
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
        title: t('2631'),
        id: 'QCEmpName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2631'),
        id: 'QCEmpSeq',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('10537'),
        id: 'OkQty',
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
        title: t('6009'),
        id: 'BadQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19059'),
        id: 'SMTestResultName',
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
        title: t('19059'),
        id: 'SMTestResult',
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
        title: t('362'),
        id: 'Remark',
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
        title: t('18830'),
        id: 'RemarkD',
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
        title: t('3259'),
        id: 'AssetName',
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
        title: t('3259'),
        id: 'AssetSeq',
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

      {
        title: t('651'),
        id: 'PONo',
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
        title: t('7623'),
        id: 'SourceSeq',
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
      {
        title: t('2470'),
        id: 'SourceSerl',
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
      {
        title: t('16246'),
        id: 'SourceType',
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
      {
        title: 'IDX_NO',
        id: 'IDX_NO',
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
      'S_ERP_COLS_PAGE_IQC_PURCHASE_PAGE',
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
  const [BizUnit, setBizUnit] = useState('')
  const [BizUnitName, setBizUnitName] = useState('')

  const [BLDateFr, setBLDateFr] = useState('')
  const [BLDateTo, setBLDateTo] = useState('')
  const [QCDateFrom, setQCDateFrom] = useState('')
  const [QCDateTo, setQCDateTo] = useState('')
  const [DelvDateFr, setDelvDateFr] = useState(dayjs().startOf('month'))
  const [DelvDateTo, setDelvDateTo] = useState(dayjs())
  const [DelvNo, setDelvNo] = useState('')

  const [QcNo, setQcNo] = useState('')
  const [SMQcType, setSMQcType] = useState('')
  const [BLRefNo, setBLRefNo] = useState('')
  const [BLNo, setBLNo] = useState('')
  const [CustSeq, setCustSeq] = useState('')
  const [CustName, setCustName] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')
  const [DeptName, setDeptName] = useState('')
  const [EmpSeq, setEmpSeq] = useState('')
  const [EmpName, setEmpName] = useState('')
  const [userId, setUserId] = useState('')
  const [ItemName, setItemName] = useState('')
  const [ItemNo, setItemNo] = useState('')
  const [Spec, setSpec] = useState('')
  const [AssetSeq, setAssetSeq] = useState('')
  const [AssetName, setAssetName] = useState('')
  const [PJTName, setPJTName] = useState('')
  const [PJTNo, setPJTNo] = useState('')

  const [WHSeq, setWHSeq] = useState('')
  const [WHName, setWHName] = useState('')

  const [dataCustomer, setDataCustomer] = useState([])
  const [dataDepartment, setDataDepartment] = useState([])
  const [dataUser, setDataUser] = useState([])
  const [dataAsset, setDataAsset] = useState([])
  const [dataWHName, setDataWHName] = useState([])


  const navigate = useNavigate()
  const [keyPath, setKeyPath] = useState('')
  const [dataSelect, setDataSelect] = useState([])
  const [LotNo, setLotNo] = useState('')

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
    if (!isAPISuccess) {
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

    setIsAPISuccess(false)
    try {

      const data = [
        {
          BizUnit: BizUnit,
          BLDateFr: formatDate(BLDateFr),
          BLDateTo: formatDate(BLDateTo),
          QCDateFrom: formatDate(QCDateFrom),
          QCDateTo: formatDate(QCDateTo),
          DelvDateFr: formatDate(DelvDateFr),
          DelvDateTo: formatDate(DelvDateTo),
          QcNo: QcNo,
          SMQcType: SMQcType,
          BLRefNo: BLRefNo,
          BLNo: BLNo,
          CustSeq: CustSeq,
          DeptSeq: DeptSeq,
          EmpSeq: EmpSeq,
          ItemName: ItemName,
          ItemNo: ItemNo,
          Spec: Spec,
          AssetSeq: AssetSeq,
          PJTName: PJTName,
          PJTNo: PJTNo,
          DelvNo: DelvNo,
          LotNo: LotNo,
        },
      ]

      const response = await SearchIqcPurchasePage(data)
      const fetchedData = response.data.data || []

      const emptyData = generateEmptyData(0, defaultCols)
      const combinedData = [...fetchedData, ...emptyData]
      const updatedData = updateIndexNo(combinedData)
      setGridData(updatedData)
      setNumRows(fetchedData.length + emptyData.length)
    } catch (error) {
      const emptyData = generateEmptyData(0, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridData(updatedEmptyData)
      setNumRows(emptyData.length)
    } finally {
      setIsAPISuccess(true)
      controllers.current.fetchData = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }, [
    BizUnit,
    BLDateFr,
    BLDateTo,
    QCDateFrom,
    QCDateTo,
    DelvDateFr,
    DelvDateTo,
    QcNo,
    SMQcType,
    BLRefNo,
    BLNo,
    CustSeq,
    DeptSeq,
    EmpSeq,
    ItemName,
    ItemNo,
    Spec,
    AssetSeq,
    PJTName,
    PJTNo,
    DelvNo,
    LotNo,
    isAPISuccess
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
        dataWH,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6035', '1002', '', ''),
        GetCodeHelp(17041, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0),
        GetCodeHelpVer2(10009, '', '', '', '', '', '1', '', 1, 'TypeSeq = 3031001', 0, 0, 0),
        GetCodeHelpCombo('', 6, 10012, 1, '%', '', '', '', ''),
        GetCodeHelpVer2(10006, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),

      ])

      setDataBizUnit(dataBizUnit.data)
      setDataSMQcType(dataSMQcType.data)
      setDataCustomer(dataCustomer.data)
      setDataDepartment(dataDepartment.data)
      setDataUser(dataUser.data)
      setDataAsset(dataAsset.data)
      setDataWHName(dataWH.data)
    } catch (error) {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchCodeHelpData = null;
    }
  }, [])

  const fetchCodeHelpDataByBizUnit = useCallback(async () => {
    try {
      const [
        dataWH,
      ] = await Promise.all([
        GetCodeHelpVer2(10006, '', BizUnit, '', '', '', '1', '', 1, '', 0, 0, 0),
      ])
      setDataWHName(dataWH.data)
    } catch (error) {
    } finally {
      setLoading(false)
      
    }
  }, [BizUnit])

  useEffect(() => {
    fetchCodeHelpDataByBizUnit()
  }, [fetchCodeHelpDataByBizUnit])

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

  const nextPageDeatails = useCallback(() => {
    if (keyPath) {
      
      navigate(`/qc/u/iqc-purchase-accept/${keyPath}`)
    } else {
      message.warning('Lựa chọn đề nghị xử lý kiểm tra')
    }
  }, [keyPath, navigate])

  const nextPageDeatailsList = useCallback(() => {
    
    if(dataSelect.length > 0){
      navigate(`/qc/u/iqc-purchase-accept-list`, { state: { dataSelect } });
    }else{
      if(!keyPath){
        message.warning('Lựa chọn đề nghị xử lý kiểm tra')
      }else{
        navigate(`/qc/u/iqc-purchase-accept/${keyPath}`)
      }
    }
    
  }, [navigate, keyPath, dataSelect])

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

  const onCellClicked = useCallback((cell, event) => {
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
        CustSeq: rowData.CustSeq,
        ItemName: rowData.ItemName,
        ItemNo: rowData.ItemNo,
        Spec: rowData.Spec,
        Qty: rowData.Qty,
        ReqQty: rowData.Qty,
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
        DelvNo: rowData.DelvNo,
        LOTNo: rowData.LOTNo,
        
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
    }
  }, [keyPath, getSelectRows, dataSelect])

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
      'IdxNo',
      'ItemSeq',
      'ItemName',
      'ItemNo',
      'Spec',
      'TrunName',
      'AssetName',
      'AssetSeq',
      'UnitName',
      'UnitSeq',
      'SMStatusName',
      'SMStatus',
      'SMInOutKind',
      'DeptName',
      'DeptSeq',
      'EmpName',
      'EmpSeq',
      'ModelName',
      'ModelSeq',
      'STDItemName',
      'ItemSName',
      'ItemEngName',
      'ItemEngSName',
      'ItemClassLName',
      'ItemClassMName',
      'ItemClassSName',
      'UMItemClassS',
      'IsInherit',
      'IsVessel',
      'IsVat',
      'SMVatKind',
      'SMVatType',
      'IsOption',
      'IsSet',
      'VatKindName',
      'VatTypeName',
      'Guaranty',
      'HSCode',
      'IsRollUnit',
      'IsSerialMng',
      'SeriNoCd',
      'IsLotMng',
      'IsQtyChange',
      'SafetyStk',
      'SMLimitTermKind',
      'LimitTerm',
      'STDLoadConvQty',
      'SMConsgnmtKind',
      'BOMUnitSeq',
      'OutLoss',
      'InLoss',
      'SMMrpKind',
      'SMOutKind',
      'SMProdMethod',
      'SMProdSpec',
      'ConsgnmtKind',
      'BOMUnitName',
      'MrpKind',
      'OutKind',
      'ProdMethod',
      'ProdSpec',
      'UMPurGroup',
      'MkCustSeq',
      'PurCustSeq',
      'MinQty',
      'StepQty',
      'SMPurKind',
      'IsPurVat',
      'IsAutoPurCreate',
      'OrderQty',
      'DelvDay',
      'CustomTaxRate',
      'PurGroup',
      'MkCustName',
      'PurCustName',
      'PurKind',
      'SMPurProdType',
      'IDX_NO',
    ]

    const columnsA = [
      'IdxNo',
      'ItemSeq',
      'ItemName',
      'ItemNo',
      'Spec',
      'TrunName',
      'AssetName',
      'AssetSeq',
      'UnitName',
      'UnitSeq',
      'SMStatusName',
      'SMStatus',
      'SMInOutKind',
      'DeptName',
      'DeptSeq',
      'EmpName',
      'EmpSeq',
      'ModelName',
      'ModelSeq',
      'STDItemName',
      'ItemSName',
      'ItemEngName',
      'ItemEngSName',
      'ItemClassLName',
      'ItemClassMName',
      'ItemClassSName',
      'UMItemClassS',
      'IsInherit',
      'IsVessel',
      'IsVat',
      'SMVatKind',
      'SMVatType',
      'IsOption',
      'IsSet',
      'VatKindName',
      'VatTypeName',
      'Guaranty',
      'HSCode',
      'IsRollUnit',
      'IsSerialMng',
      'SeriNoCd',
      'IsLotMng',
      'IsQtyChange',
      'SafetyStk',
      'SMLimitTermKind',
      'LimitTerm',
      'STDLoadConvQty',
      'SMConsgnmtKind',
      'BOMUnitSeq',
      'OutLoss',
      'InLoss',
      'SMMrpKind',
      'SMOutKind',
      'SMProdMethod',
      'SMProdSpec',
      'ConsgnmtKind',
      'BOMUnitName',
      'MrpKind',
      'OutKind',
      'ProdMethod',
      'ProdSpec',
      'UMPurGroup',
      'MkCustSeq',
      'PurCustSeq',
      'MinQty',
      'StepQty',
      'SMPurKind',
      'IsPurVat',
      'IsAutoPurCreate',
      'OrderQty',
      'DelvDay',
      'CustomTaxRate',
      'PurGroup',
      'MkCustName',
      'PurCustName',
      'PurKind',
      'SMPurProdType',
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
        <title>HPM - {t('800000099')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000099')}
              </Title>
              <IqcPurchaseReqListActions
                setModalOpen={setModalOpen}
                handleRestSheet={handleRestSheet}
                fetchDataQuery={fetchData}
                openModal={openModal}
                handleDeleteDataSheet={handleDeleteDataSheet}
                handleSaveData={handleSaveData}
                setNumRowsToAdd={setNumRowsToAdd}
                numRowsToAdd={numRowsToAdd}
                setClickCount={setClickCount}
                clickCount={clickCount}
                nextPageDeatails={nextPageDeatails}
                nextPageDeatailsList={nextPageDeatailsList}
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
                <IqcPurchaseReqListQuery
                  dataBizUnit={dataBizUnit}
                  dataSMQcType={dataSMQcType}
                  setBizUnit={setBizUnit}
                  BLDateFr={BLDateFr}
                  setBLDateFr={setBLDateFr}
                  BLDateTo={BLDateTo}
                  setBLDateTo={setBLDateTo}
                  QCDateFrom={QCDateFrom}
                  setQCDateFrom={setQCDateFrom}
                  QCDateTo={QCDateTo}
                  setQCDateTo={setQCDateTo}
                  DelvDateFr={DelvDateFr}
                  setDelvDateFr={setDelvDateFr}
                  DelvDateTo={DelvDateTo}
                  setDelvDateTo={setDelvDateTo}
                  QcNo={QcNo}
                  setQcNo={setQcNo}
                  setSMQcType={setSMQcType}
                  BLRefNo={BLRefNo}
                  setBLRefNo={setBLRefNo}
                  DelvNo={DelvNo}
                  setDelvNo={setDelvNo}
                  // BLNo={BLNo}
                  // setBLNo={setBLNo}
                  CustSeq={CustSeq}
                  setCustSeq={setCustSeq}
                  setDeptSeq={setDeptSeq}
                  EmpSeq={EmpSeq}
                  setEmpSeq={setEmpSeq}
                  ItemName={ItemName}
                  setItemName={setItemName}
                  ItemNo={ItemNo}
                  setItemNo={setItemNo}
                  setAssetSeq={setAssetSeq}
                  dataCustomer={dataCustomer}
                  CustName={CustName}
                  setCustName={setCustName}
                  departData={dataDepartment}
                  deptName={DeptName}
                  setDeptName={setDeptName}
                  dataUser={dataUser}
                  EmpName={EmpName}
                  setEmpName={setEmpName}
                  setUserId={setUserId}
                  dataAsset={dataAsset}
                  setAssetName={setAssetName}
                  LotNo={LotNo}
                  setLotNo={setLotNo}
                  dataWHName={dataWHName}
                  WHName={WHName}
                  setWHName={setWHName}
                  WHSeq={WHSeq}
                  setWHSeq={setWHSeq}

                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableIqcPurchaseReqList
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
