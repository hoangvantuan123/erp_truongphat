import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, message, Menu, Form } from 'antd'
const { Title, Text } = Typography
import { debounce, set } from 'lodash'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar'
import ErrorListModal from '../default/errorListModal'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import {
  ClipboardCheck,
  Users,
  MapPin,
  FileStack,
  UserRoundSearch,
} from 'lucide-react'

import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { HandleError } from '../default/handleError'
import { filterValidRows } from '../../../utils/filterUorA'

import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'

import { HrFileQ } from '../../../features/hr/hrFile/HrFileQ'
import PdEquipQuery from '../../components/query/assetMng/pdEquipQuery'
import Equip0Table from '../../components/table/pd-equip/equip0Table'
import Equip1Table from '../../components/table/pd-equip/equip1Table'
import Equip2Table from '../../components/table/pd-equip/equip2Table'
import Equip3Table from '../../components/table/pd-equip/equip3Table'
import Equip4Table from '../../components/table/pd-equip/Equip4Table'
import Equip5Table from '../../components/table/pd-equip/equip5Table'
import PdEquipAction from '../../components/actions/assetMng/pdEquipAction'
import { getPdEquipById } from '../../../features/assetMng/getPdEquipById'
import { AuBasInfo } from '../../../features/assetMng/AuBasInfo'
import { GetCodeHelpComboVer230427 } from '../../../features/codeHelp/getCodeHelpComboVer230427'
import { GetCodeHelpVer230427 } from '../../../features/codeHelp/getCodeHelpVer230427'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { getPdEquipMoldById } from '../../../features/assetMng/getPdEquipMoldById'
import { getToolInfoDefineById } from '../../../features/assetMng/getToolInfoDefineById'
import { deleteMold } from '../../../features/assetMng/deleteMold'
import { HrFileD } from '../../../features/hr/hrFile/HrFileD'
import { deletePdEquip } from '../../../features/assetMng/deletePdEquip'
import ModalConfirm from '../../components/modal/transReqMat/modalConfirm'

export default function PdEquip({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests,
}) {
  const userFrom = JSON.parse(localStorage.getItem('userInfo'))
  const navigate = useNavigate()

  const location = useLocation()
  const dataSelect = location.state?.filteredData || []
  const loadingBarRef = useRef(null)
  const activeFetchCountRef = useRef(0)
  const { t } = useTranslation()

  const defaultColsInspect = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: t('1642'),
        id: 'Serl',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('17295'),
        id: 'TermSerl',
        kind: 'Text',
        width: 200,
        hasMenu: true,
        readonly: false,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('17294'),
        id: 'InspectName',
        kind: 'Text',
        width: 130,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('186'),
        id: 'RepairDate',
        kind: 'Date',
        width: 160,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1268'),
        id: 'NextQCDate',
        kind: 'Date',
        width: 120,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('15247'),
        id: 'RepairCustName',
        kind: 'Text',
        width: 130,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6759'),
        id: 'RepairTime',
        kind: 'Text',
        width: 100,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('14611'),
        id: 'UMReasonName',
        kind: 'Text',
        width: 120,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1481'),
        id: 'Reason',
        kind: 'Text',
        width: 120,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('15248'),
        id: 'UMContenteName',
        kind: 'Text',
        width: 120,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6757'),
        id: 'Contents',
        kind: 'Text',
        width: 120,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6696'),
        id: 'RepairCost',
        kind: 'Text',
        width: 200,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3922'),
        id: 'OutOrder',
        kind: 'Text',
        width: 150,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        width: 160,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6762'),
        id: 'RepairCustSeq',
        kind: 'Text',
        width: 180,
        readonly: false,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )

  const defaultColsMgn = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: t('2125'),
        id: 'MngSerl',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('291'),
        id: 'MngName',
        kind: 'Text',
        readonly: false,
        width: 280,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('2877'),
        id: 'MngValName',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
    ],
    [],
  )

  const defaultColsMold = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: t('2090'),
        id: 'ItemSeq',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('2090'),
        id: 'ItemName',
        kind: 'Custom',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('602'),
        id: 'UnitName',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
    ],
    [],
  )

  const defaultcolsFile = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: 'Originalname',
        id: 'Originalname',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: 'Filename',
        id: 'Filename',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: 'Size',
        id: 'Size',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: 'Path',
        id: 'Path',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
    ],
    [],
  )
  const [isSent, setIsSent] = useState(false)

  const [gridData, setGridData] = useState([])
  const [dataRoot, setDataRoot] = useState([])
  const [dataRootInfo, setDataRootInfo] = useState([])
  const [gridDataInspect, setGridDataInspect] = useState([])
  const [gridDataMgn, setGridDataMgn] = useState([])
  const [gridDataMold, setGridDataMold] = useState([])
  const [gridDataFile, setGridDataFile] = useState([])
  const [gridAvatar, setGridAvatar] = useState([])
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selection3, setSelection3] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selection4, setSelection4] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionMold, setSelectionMold] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionFile, setSelectionFile] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [showSearch3, setShowSearch3] = useState(false)
  const [showSearch4, setShowSearch4] = useState(false)

  const [showSearch13, setShowSearch13] = useState(false)
  const [showSearch15, setShowSearch15] = useState(false)
  const [addedRowsInspect, setAddedRowsInspect] = useState([])
  const [addedRowsMgn, setAddedRowsMgn] = useState([])

  const [addedRowsMold, setAddedRowsMold] = useState([])

  const [numRowsToAddInspect, setNumRowsToAddInspect] = useState(null)
  const [numRowsToAddMgn, setNumRowsToAddMgn] = useState(null)

  const [numRowsToAddMold, setNumRowsToAddMold] = useState(null)

  const [numRows, setNumRows] = useState(0)

  const [numRowsInspect, setNumRowsInspect] = useState(0)
  const [numRowsMgn, setNumRowsMgn] = useState(0)

  const [numRowsMold, setNumRowsMold] = useState(0)
  const [numRows15, setNumRows15] = useState(0)

  const [SMStatusData, setSmStatusData] = useState([])
  const [UmToolKindData, setUmToolKindData] = useState([])
  const [EmpData, setEmpData] = useState([])
  const [AssetData, setAssetData] = useState([])
  const [CustData, setCustData] = useState([])
  const [FactData, setFactData] = useState([])
  const [ItemData, setItemData] = useState([])

  const [helpData09, setHelpData09] = useState([])

  const [dataSeq, setDataSeq] = useState([])

  const [current, setCurrent] = useState('0')
  const [checkPageA, setCheckPageA] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchText1, setSearchText1] = useState('')
  const [itemText, setItemText] = useState([])
  const [itemText1, setItemText1] = useState([])
  const [dataSearch, setDataSearch] = useState([])
  const [dataSearch1, setDataSearch1] = useState([])
  const [dataSheetSearch, setDataSheetSearch] = useState([])
  const [dataSheetSearch1, setDataSheetSearch1] = useState([])
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [CoNm, setCoNm] = useState('')
  const [formBasInfo] = Form.useForm()
  const [formMoldInfo] = Form.useForm()
  const [modalDeleteConfirm, setModalDeleteConfirm] =
      useState(false)

  const [UmToolKindName, setUmToolKindName] = useState('')
  const [UmToolKind, setUmToolKind] = useState(null)

  const [ToolName, setToolName] = useState('')
  const [ToolSeq, setToolSeq] = useState(null)

  const [ToolNo, setToolNo] = useState('')
  const [Spec, setSpec] = useState('')

  const [SMStatus, setSMStatus] = useState('')
  const [SMStatusName, setSMStatusName] = useState('')
  const [InstallArea, setInstallArea] = useState('')

  const [MoveEmpName, setMoveEmpName] = useState('')
  const [EmpName, setEmpName] = useState('')
  const [EmpSeq, setEmpSeq] = useState(null)

  const [DeptName, setDeptName] = useState('')
  const [DeptSeq, setDeptSeq] = useState(null)

  const [AsstName, setAsstName] = useState('')
  const [AsstSeq, setAsstSeq] = useState(null)

  const [AsstNo, setAsstNo] = useState('')
  const [Remark, setRemark] = useState('')
  const [IsMold, setIsMold] = useState(false)
  const [CustSeq, setCustSeq] = useState('')
  const [CustName, setCustName] = useState('')
  const [NationSeq, setNationSeq] = useState('')
  const [NationName, setNationName] = useState('')

  const [WorkingTag, setWorkingTag] = useState('A')

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = 'Bạn có chắc chắn muốn rời đi không?'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const [colsInspect, setColsInspect] = useState(() =>
    loadFromLocalStorageSheet(
      'eqp_inspect_a',
      defaultColsInspect.filter((col) => col.visible),
    ),
  )
  const [colsMgn, setColsMgn] = useState(() =>
    loadFromLocalStorageSheet(
      'eqp_mgn_a',
      defaultColsMgn.filter((col) => col.visible),
    ),
  )

  const [colsMold, setColsMold] = useState(() =>
    loadFromLocalStorageSheet(
      'eqp_mold_a',
      defaultColsMold.filter((col) => col.visible),
    ),
  )

  const [colsFile, setColsFile] = useState(() =>
    loadFromLocalStorageSheet(
      'asset_file_a',
      defaultcolsFile.filter((col) => col.visible),
    ),
  )

  const handleRowAppendInspect = useCallback(
    (numRowsToAddInspect) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsInspect,
        setGridDataInspect,
        setNumRowsInspect,
        setAddedRowsInspect,
        numRowsToAddInspect,
      )
    },
    [
      colsInspect,
      setGridDataInspect,
      setNumRowsInspect,
      setAddedRowsInspect,
      numRowsToAddInspect,
    ],
  )

  const handleRowAppendMgn = useCallback(
    (numRowsToAddMgn) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsMgn,
        setGridDataMgn,
        setNumRowsMgn,
        setAddedRowsMgn,
        numRowsToAddMgn,
      )
    },
    [colsMgn, setGridDataMgn, setNumRowsMgn, setAddedRowsMgn, numRowsToAddMgn],
  )

  const handleRowAppendMold = useCallback(
    (numRowsToAddMold) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsMold,
        setGridDataMold,
        setNumRowsMold,
        setAddedRowsMold,
        numRowsToAddMold,
      )
    },
    [
      colsMold,
      setGridDataMold,
      setNumRowsMold,
      setAddedRowsMold,
      numRowsToAddMold,
    ],
  )

  const increaseFetchCount = () => {
    activeFetchCountRef.current += 1
  }

  const decreaseFetchCount = () => {
    activeFetchCountRef.current -= 1
    if (activeFetchCountRef.current === 0) {
      loadingBarRef.current?.complete()
      togglePageInteraction(false)
    }
  }

  const fetchGenericData = async ({
    controllerKey,
    postFunction,
    searchParams,
    useEmptyData = true,
    defaultCols,
    afterFetch = () => {},
  }) => {
    increaseFetchCount()

    if (controllers.current[controllerKey]) {
      controllers.current[controllerKey].abort()
      await new Promise((resolve) => setTimeout(resolve, 10))
      return fetchGenericData({
        controllerKey,
        postFunction,
        searchParams,
        afterFetch,
        defaultCols,
        useEmptyData,
      })
    }

    const controller = new AbortController()
    controllers.current[controllerKey] = controller
    const { signal } = controller

    togglePageInteraction(true)
    loadingBarRef.current?.continuousStart()

    try {
      const response = await postFunction(searchParams, signal)
      if (!response.success) {
        HandleError([
          {
            success: false,
            message: response.message || 'Đã xảy ra lỗi vui lòng thử lại!',
          },
        ])
      }
      const data = response.success ? response.data || [] : []

      let mergedData = updateIndexNo(data)

      if (useEmptyData) {
        const emptyData = updateIndexNo(generateEmptyData(100, defaultCols))
        mergedData = updateIndexNo([...data, ...emptyData])
      }

      await afterFetch(mergedData)
    } catch (error) {
      let emptyData = []

      if (useEmptyData) {
        emptyData = updateIndexNo(generateEmptyData(100, defaultCols))
      }

      await afterFetch(emptyData)
    } finally {
      decreaseFetchCount()
      controllers.current[controllerKey] = null
      togglePageInteraction(false)
      loadingBarRef.current?.complete()
    }
  }

  const getSelectedRows = (selection, gridData) => {
    return (
      selection?.rows?.items?.flatMap(([start, end]) =>
        Array.from(
          { length: end - start },
          (_, i) => gridData[start + i],
        ).filter(Boolean),
      ) || []
    )
  }

  const resetTable = (setSelectionFn) => {
    if (typeof setSelectionFn === 'function') {
      setSelectionFn({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
      })
    }
  }

  const createResetFn = (setSelectionFn) => () => resetTable(setSelectionFn)

  const handleDeleteDataSheet = useCallback(() => {
    if (canDelete === false) return

    const map = {
      1: [
        {
          selection: selectionMold,
          setSelection: setSelectionMold,
          gridData: gridDataMold,
          setGridData: setGridDataMold,
          setNumRows: setNumRowsMold,
          deleteApi: deleteMold,
          resetFn: resetTable(setSelectionMold),
        },
      ],
      3: [
        {
          selection: selectionFile,
          setSelection: setSelectionFile,
          gridData: gridDataFile,
          setGridData: setGridDataFile,
          setNumRows: setNumRows15,
          deleteApi: HrFileD,
          resetFn: resetTable(setSelectionFile),
        },
      ],
    }

    const target = map[current]
    if (!target) return

    const processTarget = ({
      selection,
      setSelection,
      gridData,
      setGridData,
      setNumRows,
      deleteApi,
      resetFn,
    }) => {
      const selectedRows = getSelectedRows(selection, gridData)

      const rowsWithStatusD = selectedRows
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => ({
          ...row,
          Status: 'D',
        }))

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

      if (rowsWithStatusD.length > 0 && deleteApi) {
        deleteApi(rowsWithStatusD)
          .then((response) => {
            if (response.success) {
              const deletedIds = rowsWithStatusD.map((item) => item.IdxNo)
              const updatedData = gridData.filter(
                (row) => !deletedIds.includes(row.IdxNo),
              )
              setGridData(updateIndexNo(updatedData))
              setNumRows(updatedData.length)
              resetTable()
            } else {
              setModal2Open(true)
              setErrorData(response?.errors || [])
            }
          })
          .catch((error) => {
            message.error('Có lỗi xảy ra khi xóa!')
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        setGridData(updateIndexNo(remainingRows))
        setNumRows(remainingRows.length)
        resetFn?.()
      }
    }

    if (Array.isArray(target)) {
      target.forEach(processTarget)
    } else {
      processTarget(target)
    }
  }, [
    current,
    canDelete,
    selection,
    setSelection,
    gridData,
    setGridData,
    setNumRows,
    resetTable,

    gridDataInspect,
    setGridDataInspect,
    setNumRowsInspect,

    gridDataMgn,
    setGridDataMgn,
    setNumRowsMgn,

    selectionMold,
    setSelectionMold,
    gridDataMold,
    setGridDataMold,
    setNumRowsMold,
  ])

  const fetchCodeHelpData = useCallback(async () => {
    increaseFetchCount()

    if (controllers.current.fetchCodeHelpData) {
      controllers.current.fetchCodeHelpData.abort()
      controllers.current.fetchCodeHelpData = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    loadingBarRef.current?.continuousStart()

    const controller = new AbortController()
    const signal = controller.signal
    controllers.current.fetchCodeHelpData = controller

    try {
      const [
        SMStatusData,
        umToolKindData,
        userData,
        assetData,
        custData,
        factData,
        itemData,
      ] = await Promise.all([
        GetCodeHelpComboVer230427(
          '',
          6,
          19998,
          1,
          '%',
          '6023',
          '',
          '',
          '',
          signal,
        ),
        GetCodeHelpVer230427(
          19999,
          '',
          '6009',
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

        GetCodeHelpVer230427(
          10009,
          '',
          '',
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

        GetCodeHelpVer230427(
          40007,
          '',
          '',
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

        GetCodeHelpVer230427(
          17051,
          '',
          '1002',
          '',
          '',
          '',
          '',
          1,
          0,
          'SMCustStatus = 2004001',
          0,
          0,
          0,
          signal,
        ),

        GetCodeHelpVer230427(
          19999,
          '',
          '1002',
          '',
          '',
          '',
          '',
          1,
          0,
          "IsUse = ''1''",
          0,
          0,
          0,
          signal,
        ),

        GetCodeHelpVer230427(
          18011,
          '',
          '',
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
      setSmStatusData(SMStatusData.data)
      setUmToolKindData(umToolKindData.data)
      setEmpData(userData.data)
      setAssetData(assetData.data)
      setCustData(custData.data)
      setFactData(factData.data)
      setItemData(itemData.data)
    } catch {
      setSmStatusData([])
      setUmToolKindData([])
      setEmpData([])
      setAssetData([])
      setCustData([])
      setFactData([])
      setItemData([])
    } finally {
      decreaseFetchCount()
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

  const fetchImageFile = useCallback(() => {
    if (dataSelect?.ToolSeq) {
      const ToolSeq = dataSelect?.ToolSeq
      if (ToolSeq == null || ToolSeq === '') return

      const searchParams2 = {
        KeyItem1: ToolSeq || 0,
        KeyItem2: 'ASSET',
        KeyItem3: 1,
      }

      fetchGenericData({
        controllerKey: 'HrFileQ',
        postFunction: HrFileQ,
        searchParams: searchParams2,
        useEmptyData: false,
        defaultCols: null,

        afterFetch: (data) => {
          const sortData = data.sort((a, b) => b.IdxNo - a.IdxNo)
          setGridAvatar(sortData)
        },
      })
    }
  }, [dataSelect])

  const handleSaveBasInfo = useCallback(
    async (dataMainInfo, dataAssyTool, dataMgn) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }

      if (isSent) return
      setIsSent(true)

      try {
        const results = await AuBasInfo(dataMainInfo, dataAssyTool, dataMgn)

        if (results.success) {
          const newData = results.data
          message.success('Thành công!')

          setIsSent(false)
          resetTable()
        } else {
          const error = [
            {
              IDX_NO: 1,
              Name: 'Duplicate',
              result: results.errors,
            },
          ]
          setIsSent(false)
          setModal2Open(true)
          setErrorData(error)
        }
      } catch (error) {
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      } finally {
        fetchDataById()
      }
    },
    [],
  )

  const handleDeletePd = useCallback(
    async (dataMainInfo, dataAssyTool, dataMgn) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền xóa dữ liệu')
        return
      }

      if (isSent) return
      setIsSent(true)

      try {
        const results = await deletePdEquip(dataMainInfo, dataAssyTool, dataMgn)

        if (results.success) {
          const newData = results.data
          message.success('Xóa thành công!')
          
          setIsSent(false)
          resetTable()
        } else {
          const error = [
            {
              IDX_NO: 1,
              Name: 'Duplicate',
              result: results.errors,
            },
          ]
          setIsSent(false)
          setModal2Open(true)
          setErrorData(error)
        }
      } catch (error) {
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      } finally {
        fetchDataById()
        setModalDeleteConfirm(false)
      }
    },
    [],
  )

  const handleExternalSubmit = useCallback(async () => {
    if (WorkingTag === '') return

    const formatDateSearch = (date) => {
      const d = dayjs(date)
      return d.isValid() ? d.format('YYYYMMDD') : ''
    }

    const dataBasInfo = await formBasInfo.getFieldValue()
    const dataMoldInfo = await formMoldInfo.getFieldValue()

    const mainInfo = [
      {
        WorkingTag: WorkingTag,
        ToolName: ToolName,
        ToolNo: ToolNo,
        Spec: Spec,
        ToolSeq: ToolSeq,
        SMStatus: SMStatus,
        UMToolKind: UmToolKind || dataBasInfo?.UMToolKind,
        UmToolKindName: UmToolKindName,
        InstallArea: InstallArea,
        MoveEmpName: MoveEmpName,
        EmpSeq: EmpSeq,
        EmpName: EmpName,
        DeptSeq: DeptSeq,
        DeptName: DeptName,
        AssetSeq: AsstSeq,
        AsstName: AsstName,
        AsstNo: AsstNo,
        Remark: Remark,
        IsMold: IsMold,
        AsstSeq: AsstSeq,
        SerialNo: dataBasInfo?.SerialNo,
        NationSeq: NationSeq,
        NationName: dataBasInfo?.NationName,
        ManuCompnay: dataBasInfo?.ManuCompnay,
        PUCustName: dataBasInfo?.PUCustName,
        PUCustSeq: CustSeq,
        BuyDate: formatDateSearch(dataBasInfo?.BuyDate),
        Uses: dataBasInfo?.Uses,
        BuyCost: dataBasInfo?.BuyCost,
        Forms: dataBasInfo?.Forms,
        BuyCustTel: dataBasInfo?.BuyCustTel,
        Capacity: dataBasInfo?.Capacity,
        ASTelNo: dataBasInfo?.ASTelNo,
        Cavity: dataMoldInfo?.Cavity,
        MoldCount: dataMoldInfo?.MoldCount,
        DesignShot: dataMoldInfo?.DesignShot,
        OrderCustName: dataMoldInfo?.OrderCustName,
        InitialShot: dataMoldInfo?.InitialShot,
        CustShareRate: dataMoldInfo?.CustShareRate,
        WorkShot: dataMoldInfo?.WorkShot,
        ProdSrtDate: formatDateSearch(dataMoldInfo?.ProdSrtDate),
        TotalShot: dataMoldInfo?.TotalShot,
        DisuseDate: formatDateSearch(dataMoldInfo?.DisuseDate),
        ModifyShot: dataMoldInfo?.ModifyShot,
        DisuseCustName: dataMoldInfo?.DisuseCustName,
        ModifyDate: formatDateSearch(dataMoldInfo?.ModifyDate),
      },
    ]

    const requiredFields = [
      { key: 'ItemName', label: t('2090') },
      { key: 'ItemNo', label: t('2091') },
    ]
    const validateRequiredFields = (data, fields) =>
      data.flatMap((row, i) =>
        fields
          .filter(({ key }) => !row[key]?.toString().trim())
          .map(({ key, label }) => ({
            IDX_NO: i + 1,
            field: key,
            Name: label,
            result: `${label} không được để trống`,
          })),
      )

    const resulA = filterValidRows(gridDataMold, 'A').map((item) => {
      return {
        ...item,
        WorkingTag: WorkingTag,
        ToolSeq: ToolSeq,
      }
    })

    const resulU = filterValidRows(gridDataMold, 'U').map((item) => {
      return {
        ...item,
        WorkingTag: WorkingTag,
        ToolSeq: ToolSeq,
      }
    })

    const errors = [
      ...validateRequiredFields(resulA, requiredFields),
      ...validateRequiredFields(resulU, requiredFields),
    ]

    const requiredFieldsMgn = [
      { key: 'MngSerl', label: t('2125') },
      { key: 'MngName', label: t('291') },
    ]
    const validateRequiredFieldsMgn = (data, fields) =>
      data.flatMap((row, i) =>
        fields
          .filter(({ key }) => !row[key]?.toString().trim())
          .map(({ key, label }) => ({
            IDX_NO: i + 1,
            field: key,
            Name: label,
            result: `${label} không được để trống`,
          })),
      )

    const resulMgnA = filterValidRows(gridDataMgn, 'A').map((item) => {
      return {
        ...item,
        WorkingTag: 'A',
        ToolSeq: ToolSeq,
      }
    })

    const resulMgnU = filterValidRows(gridDataMgn, 'U').map((item) => {
      return {
        ...item,
        WorkingTag: 'U',
        ToolSeq: ToolSeq,
      }
    })

    const errorsMgn = [
      ...validateRequiredFieldsMgn(resulMgnA, requiredFieldsMgn),
      ...validateRequiredFieldsMgn(resulMgnU, requiredFieldsMgn),
    ]

    if (errors.length > 0) {
      setModal2Open(true)
      setErrorData(errors)
      return
    }
    if (errorsMgn.length > 0) {
      setModal2Open(true)
      setErrorData(errorsMgn)
      return
    }

    const dataAssyTool = [...resulA, ...resulU]
    const dataMgn = [...resulMgnA, ...resulMgnU]

    handleSaveBasInfo(mainInfo, dataAssyTool, dataMgn)
  }, [
    WorkingTag,
    formBasInfo,
    formMoldInfo,
    gridDataMold,
    gridDataMgn,
    NationSeq,
    ToolName,
    ToolNo,
    SMStatus,
    InstallArea,
    MoveEmpName,
    EmpName,
    DeptName,
    AsstName,
    AsstNo,
    Remark,
    IsMold,
    CustSeq,
    gridDataMold,
    gridDataMgn,
  ])

  const handleDelete = useCallback(async () => {
    if (WorkingTag === '') return

    const formatDateSearch = (date) => {
      const d = dayjs(date)
      return d.isValid() ? d.format('YYYYMMDD') : ''
    }

    const dataBasInfo = await formBasInfo.getFieldValue()
    const dataMoldInfo = await formMoldInfo.getFieldValue()

    const mainInfo = [
      {
        WorkingTag: 'D',
        ToolName: ToolName,
        ToolNo: ToolNo,
        Spec: Spec,
        ToolSeq: ToolSeq,
        SMStatus: SMStatus,
        UMToolKind: UmToolKind || dataBasInfo?.UMToolKind,
        UmToolKindName: UmToolKindName,
        InstallArea: InstallArea,
        MoveEmpName: MoveEmpName,
        EmpSeq: EmpSeq,
        EmpName: EmpName,
        DeptSeq: DeptSeq,
        DeptName: DeptName,
        AssetSeq: AsstSeq,
        AsstName: AsstName,
        AsstNo: AsstNo,
        Remark: Remark,
        IsMold: IsMold,
        AsstSeq: AsstSeq,
        SerialNo: dataBasInfo?.SerialNo,
        NationSeq: NationSeq,
        NationName: dataBasInfo?.NationName,
        ManuCompnay: dataBasInfo?.ManuCompnay,
        PUCustName: dataBasInfo?.PUCustName,
        PUCustSeq: CustSeq,
        BuyDate: formatDateSearch(dataBasInfo?.BuyDate),
        Uses: dataBasInfo?.Uses,
        BuyCost: dataBasInfo?.BuyCost,
        Forms: dataBasInfo?.Forms,
        BuyCustTel: dataBasInfo?.BuyCustTel,
        Capacity: dataBasInfo?.Capacity,
        ASTelNo: dataBasInfo?.ASTelNo,
        Cavity: dataMoldInfo?.Cavity,
        MoldCount: dataMoldInfo?.MoldCount,
        DesignShot: dataMoldInfo?.DesignShot,
        OrderCustName: dataMoldInfo?.OrderCustName,
        InitialShot: dataMoldInfo?.InitialShot,
        CustShareRate: dataMoldInfo?.CustShareRate,
        WorkShot: dataMoldInfo?.WorkShot,
        ProdSrtDate: formatDateSearch(dataMoldInfo?.ProdSrtDate),
        TotalShot: dataMoldInfo?.TotalShot,
        DisuseDate: formatDateSearch(dataMoldInfo?.DisuseDate),
        ModifyShot: dataMoldInfo?.ModifyShot,
        DisuseCustName: dataMoldInfo?.DisuseCustName,
        ModifyDate: formatDateSearch(dataMoldInfo?.ModifyDate),
      },
    ]

    const requiredFields = [
      { key: 'ItemName', label: t('2090') },
      { key: 'ItemNo', label: t('2091') },
    ]
    const validateRequiredFields = (data, fields) =>
      data.flatMap((row, i) =>
        fields
          .filter(({ key }) => !row[key]?.toString().trim())
          .map(({ key, label }) => ({
            IDX_NO: i + 1,
            field: key,
            Name: label,
            result: `${label} không được để trống`,
          })),
      )

    const resulA = gridDataMold.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
        ToolSeq: ToolSeq,
      }
    })

    const resulU = gridDataMold.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
        ToolSeq: ToolSeq,
      }
    })

    const errors = [
      ...validateRequiredFields(resulA, requiredFields),
      ...validateRequiredFields(resulU, requiredFields),
    ]

    const requiredFieldsMgn = [
      { key: 'MngSerl', label: t('2125') },
      { key: 'MngName', label: t('291') },
    ]
    const validateRequiredFieldsMgn = (data, fields) =>
      data.flatMap((row, i) =>
        fields
          .filter(({ key }) => !row[key]?.toString().trim())
          .map(({ key, label }) => ({
            IDX_NO: i + 1,
            field: key,
            Name: label,
            result: `${label} không được để trống`,
          })),
      )

    const resulMgnA = gridDataMgn.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
        ToolSeq: ToolSeq,
      }
    })

    const resulMgnU = gridDataMgn.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
        ToolSeq: ToolSeq,
      }
    })

    const errorsMgn = [
      ...validateRequiredFieldsMgn(resulMgnA, requiredFieldsMgn),
      ...validateRequiredFieldsMgn(resulMgnU, requiredFieldsMgn),
    ]

    if (errors.length > 0) {
      setModal2Open(true)
      setErrorData(errors)
      return
    }
    if (errorsMgn.length > 0) {
      setModal2Open(true)
      setErrorData(errorsMgn)
      return
    }

    const dataAssyTool = [...resulA, ...resulU]
    const dataMgn = [...resulMgnA, ...resulMgnU]

    handleDeletePd(mainInfo, dataAssyTool, dataMgn)
    handleDeleteAllFiles()
  }, [
    WorkingTag,
    formBasInfo,
    formMoldInfo,
    gridDataMold,
    gridDataMgn,
    NationSeq,
    ToolName,
    ToolNo,
    SMStatus,
    InstallArea,
    MoveEmpName,
    EmpName,
    DeptName,
    AsstName,
    AsstNo,
    Remark,
    IsMold,
    CustSeq,
    gridDataMold,
    gridDataMgn,
  ])

  const fetchDataById = useCallback(async () => {
    if (dataSelect?.ToolSeq) {
      setWorkingTag('U')
      setToolSeq(dataSelect?.ToolSeq)
      const getValidDate = (value) => {
        const date = dayjs(value)
        return date.isValid() ? date : null
      }

      const searchParams = [
        {
          ToolSeq: dataSelect?.ToolSeq,
          ToolName: dataSelect?.ToolName,
          ToolNo: dataSelect?.ToolNo,
          UMToolKind: dataSelect?.UMToolKind,
          EmpSeq: dataSelect?.EmpSeq,
        },
      ]

      fetchGenericData({
        controllerKey: `getPdEquipById`,
        postFunction: getPdEquipById,
        searchParams,
        useEmptyData: false,
        defaultCols: null,
        afterFetch: (data) => {
          formBasInfo.setFieldsValue({
            ...data,
            SerialNo: data[0]?.SerialNo,
            BuyDate: getValidDate(data[0]?.BuyDate),
            Uses: data[0]?.Uses,
            BuyCost: data[0]?.BuyCost,
            Forms: data[0]?.Forms,
            BuyCustTel: data[0]?.BuyCustTel,
            Capacity: data[0]?.CapaCity,
            ASTelNo: data[0]?.ASTelNo,
            NationName: data[0]?.NationName,
            ManuCompnay: data[0]?.ManuCompnay,
            PUCustName: data[0]?.PUCustName,
          })

          formMoldInfo.setFieldsValue({
            ...data,
            Cavity: data[0]?.Cavity,
            MoldCount: data[0]?.MoldCount,
            DesignShot: data[0]?.DesignShot,
            OrderCustName: data[0]?.OrderCustName,
            InitialShot: data[0]?.InitialShot,
            CustShareRate: data[0]?.CustShareRate,
            WorkShot: data[0]?.WorkShot,
            ProdSrtDate: getValidDate(data[0]?.ProdSrtDate),
            TotalShot: data[0]?.TotalShot,
            DisuseDate: getValidDate(data[0]?.DisuseDate),
            ModifyShot: data[0]?.ModifyShot,
            DisuseCustName: data[0]?.DisuseCustName,
            ModifyDate: getValidDate(data[0]?.ModifyDate),
          })

          setToolName(data[0]?.ToolName)
          setToolNo(data[0]?.ToolNo)
          setSpec(data[0]?.Spec)
          setSMStatus(data[0]?.SMStatus)
          setSMStatusName(data[0]?.SMStatusName)
          setUmToolKindName(data[0]?.UMToolKindName)
          setInstallArea(data[0]?.InstallArea)
          setMoveEmpName(data[0]?.MoveEmpName)
          setEmpName(data[0]?.EmpName)
          setDeptName(data[0]?.DeptName)
          setAsstName(data[0]?.AsstName)
          setAsstNo(data[0]?.AsstNo)
          setRemark(data[0]?.Remark)
          setIsMold(data[0]?.IsMold === 1 ? true : false)
          setCustSeq(data[0]?.PUCustSeq)
          setCustName(data[0]?.PUCustName)
          setUmToolKind(data[0]?.UMToolKind)
          setDeptSeq(data[0]?.DeptSeq)
          setEmpSeq(data[0]?.EmpSeq)
          setNationSeq(data[0]?.NationSeq)
          setNationName(data[0]?.NationName)
        },
      })

      fetchGenericData({
        controllerKey: 'getPdEquipMoldById',
        postFunction: getPdEquipMoldById,
        searchParams: searchParams,
        useEmptyData: false,
        defaultCols: defaultColsMold,
        afterFetch: (data) => {
          setGridDataMold(data)
          setNumRowsMold(data.length)
        },
      })

      let searchParamsMgn = [
        {
          ToolSeq: dataSelect?.ToolSeq,
        },
      ]
      fetchGenericData({
        controllerKey: 'getToolInfoDefineById',
        postFunction: getToolInfoDefineById,
        searchParams: searchParamsMgn,
        useEmptyData: false,
        defaultCols: defaultColsMgn,
        afterFetch: (data) => {
          setGridDataMgn(data)
          setNumRowsMgn(data.length)
        },
      })

      const searchParamsFile = {
        KeyItem1: dataSelect?.ToolSeq || 0,
        KeyItem2: 'FILE_ASSET',
        KeyItem3: '',
      }

      fetchGenericData({
        controllerKey: 'HrFileQ2',
        postFunction: HrFileQ,
        searchParams: searchParamsFile,
        useEmptyData: false,
        defaultCols: defaultcolsFile,
        afterFetch: (data) => {
          setGridDataFile(data)
          setNumRows15(data.length)
        },
      })
    }
  }, [dataSelect, WorkingTag])

  const handleDeleteAllFiles = useCallback(async () => {
    const idSeq1 = gridAvatar[0]?.IdSeq
    const idSeq2 = gridAvatar[1]?.IdSeq
    if (idSeq1) {
      const res = await HrFileD([{ IdSeq: idSeq1 }])
    }
    if (idSeq2) {
      const res = await HrFileD([{ IdSeq: idSeq2 }])
    }
    if (gridDataFile.length > 0) {
      const res = await HrFileD(gridDataFile)
      if (res.success) {
        setGridAvatar([])
        setNumRowsAvatar(0)
        message.success('Xóa thành công tất cả file đính kèm')
      } else {
        setModal2Open(true)
        setErrorData(res?.errors || [])
      }
    }
  }, [gridAvatar])

  const handleSearch = useCallback(async () => {
    const fetchDataById = async () => {
      if (ToolName || ToolNo) {
        setWorkingTag('U')

        const getValidDate = (value) => {
          const date = dayjs(value)
          return date.isValid() ? date : null
        }

        const searchParams = [
          {
            ToolName: ToolName,
            ToolNo: ToolNo,
            EmpSeq: EmpSeq,
          },
        ]

        fetchGenericData({
          controllerKey: `getPdEquipById`,
          postFunction: getPdEquipById,
          searchParams,
          useEmptyData: false,
          defaultCols: null,
          afterFetch: (data) => {
            formBasInfo.setFieldsValue({
              ...data,
              SerialNo: data[0]?.SerialNo,
              BuyDate: getValidDate(data[0]?.BuyDate),
              Uses: data[0]?.Uses,
              BuyCost: data[0]?.BuyCost,
              Forms: data[0]?.Forms,
              BuyCustTel: data[0]?.BuyCustTel,
              Capacity: data[0]?.CapaCity,
              ASTelNo: data[0]?.ASTelNo,
              NationName: data[0]?.NationName,
              ManuCompnay: data[0]?.ManuCompnay,
              PUCustName: data[0]?.PUCustName,
            })

            formMoldInfo.setFieldsValue({
              ...data,
              Cavity: data[0]?.Cavity,
              MoldCount: data[0]?.MoldCount,
              DesignShot: data[0]?.DesignShot,
              OrderCustName: data[0]?.OrderCustName,
              InitialShot: data[0]?.InitialShot,
              CustShareRate: data[0]?.CustShareRate,
              WorkShot: data[0]?.WorkShot,
              ProdSrtDate: getValidDate(data[0]?.ProdSrtDate),
              TotalShot: data[0]?.TotalShot,
              DisuseDate: getValidDate(data[0]?.DisuseDate),
              ModifyShot: data[0]?.ModifyShot,
              DisuseCustName: data[0]?.DisuseCustName,
              ModifyDate: getValidDate(data[0]?.ModifyDate),
            })
            setToolSeq(data[0]?.ToolSeq)
            setToolName(data[0]?.ToolName)
            setToolNo(data[0]?.ToolNo)
            setSpec(data[0]?.Spec)
            setSMStatus(data[0]?.SMStatus)
            setSMStatusName(data[0]?.SMStatusName)
            setUmToolKindName(data[0]?.UMToolKindName)
            setInstallArea(data[0]?.InstallArea)
            setMoveEmpName(data[0]?.MoveEmpName)
            setEmpName(data[0]?.EmpName)
            setDeptName(data[0]?.DeptName)
            setAsstName(data[0]?.AsstName)
            setAsstNo(data[0]?.AsstNo)
            setRemark(data[0]?.Remark)
            setIsMold(data[0]?.IsMold === 1 ? true : false)
            setCustSeq(data[0]?.PUCustSeq)
            setCustName(data[0]?.PUCustName)
            setUmToolKind(data[0]?.UMToolKind)
            setDeptSeq(data[0]?.DeptSeq)
            setEmpSeq(data[0]?.EmpSeq)
            setNationSeq(data[0]?.NationSeq)
            setNationName(data[0]?.NationName)

            let searchParamsMold = [
              {
                ToolName: data[0]?.ToolName,
                ToolNo: data[0]?.ToolNo,
                EmpSeq: data[0]?.EmpSeq,
                ToolSeq: data[0]?.ToolSeq,
              },
            ]

            fetchGenericData({
              controllerKey: 'getPdEquipMoldById',
              postFunction: getPdEquipMoldById,
              searchParams: searchParamsMold,
              useEmptyData: false,
              defaultCols: defaultColsMold,
              afterFetch: (data) => {
                setGridDataMold(data)
                setNumRowsMold(data.length)
              },
            })

            let searchParamsMgn = [
              {
                ToolSeq: data[0]?.ToolSeq,
              },
            ]
            fetchGenericData({
              controllerKey: 'getToolInfoDefineById',
              postFunction: getToolInfoDefineById,
              searchParams: searchParamsMgn,
              useEmptyData: false,
              defaultCols: defaultColsMgn,
              afterFetch: (data) => {
                setGridDataMgn(data)
                setNumRowsMgn(data.length)
              },
            })

            const searchParamsFile = {
              KeyItem1: data[0]?.ToolSeq || 0,
              KeyItem2: 'FILE_ASSET',
              KeyItem3: '',
            }

            fetchGenericData({
              controllerKey: 'HrFileQ2',
              postFunction: HrFileQ,
              searchParams: searchParamsFile,
              useEmptyData: false,
              defaultCols: defaultcolsFile,
              afterFetch: (data) => {
                setGridDataFile(data)
                setNumRows15(data.length)
              },
            })

            const searchParams2 = {
              KeyItem1: data[0]?.ToolSeq || 0,
              KeyItem2: 'ASSET',
              KeyItem3: 1,
            }

            fetchGenericData({
              controllerKey: 'HrFileQ',
              postFunction: HrFileQ,
              searchParams: searchParams2,
              useEmptyData: false,
              defaultCols: null,

              afterFetch: (data) => {
                const sortData = data.sort((a, b) => b.IdxNo - a.IdxNo)
                setGridAvatar(sortData)
              },
            })
          },
        })
      }
    }

    fetchDataById()
  }, [
    ToolName,
    ToolSeq,
    ToolNo,
    EmpSeq,
    gridDataMold,
    gridDataMgn,
    gridDataFile,
  ])

  useEffect(() => {
    fetchDataById()
    fetchImageFile()
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('10046625')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col  h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full  ">
            <div className="flex p-2 items-end justify-end">
              <PdEquipAction
                handleSaveAll={handleExternalSubmit}
                handleDeleteDataSheet={handleDeleteDataSheet}
                handleDelete={handleDelete}
                handleSearch={handleSearch}
                setModalDeleteConfirm = {setModalDeleteConfirm}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t border-b bg-white"
              open
            >
              <summary
                className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900"
                onClick={(e) => e.preventDefault()}
              >
                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase">
                  Truy vấn
                </h2>
              </summary>
              <PdEquipQuery
                SMStatusData={SMStatusData}
                UmToolKindData={UmToolKindData}
                setUmToolKindData={setUmToolKindData}
                EmpData={EmpData}
                setEmpData={setEmpData}
                AssetData={AssetData}
                UmToolKind={UmToolKind}
                setUmToolKind={setUmToolKind}
                UmToolKindName={UmToolKindName}
                setUmToolKindName={setUmToolKindName}
                setSearchText1={setSearchText1}
                searchText1={searchText1}
                setItemText={setItemText}
                itemText={itemText}
                setDataSearch={setDataSearch}
                dataSearch={dataSearch}
                setDataSearch1={setDataSearch1}
                dataSearch1={dataSearch1}
                setDataSheetSearch={setDataSheetSearch}
                setDataSheetSearch1={setDataSheetSearch1}
                dataSheetSearch={dataSheetSearch}
                setItemText1={setItemText1}
                CoNm={CoNm}
                setCoNm={setCoNm}
                ToolName={ToolName}
                setToolName={setToolName}
                ToolSeq={ToolSeq}
                setToolSeq={setToolSeq}
                ToolNo={ToolNo}
                setToolNo={setToolNo}
                Spec={Spec}
                setSpec={setSpec}
                SMStatus={SMStatus}
                setSMStatus={setSMStatus}
                SMStatusName={SMStatusName}
                setSMStatusName={setSMStatusName}
                InstallArea={InstallArea}
                setInstallArea={setInstallArea}
                MoveEmpName={MoveEmpName}
                setMoveEmpName={setMoveEmpName}
                EmpName={EmpName}
                setEmpName={setEmpName}
                EmpSeq={EmpSeq}
                setEmpSeq={setEmpSeq}
                DeptName={DeptName}
                setDeptName={setDeptName}
                DeptSeq={DeptSeq}
                setDeptSeq={setDeptSeq}
                AsstName={AsstName}
                setAsstName={setAsstName}
                AsstSeq={AsstSeq}
                setAsstSeq={setAsstSeq}
                AsstNo={AsstNo}
                setAsstNo={setAsstNo}
                Remark={Remark}
                setRemark={setRemark}
                IsMold={IsMold}
                setIsMold={setIsMold}
                setSearchText={setSearchText}
              />
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full">
            <Splitter className="w-full h-full">
              <SplitterPanel size={85} minSize={85}>
                <div className="h-full flex ">
                  <Menu
                    mode="inline"
                    selectedKeys={[current]}
                    style={{ width: 200 }}
                    onClick={(e) => {
                      if (!checkPageA) {
                        setCurrent(e.key)
                      }
                    }}
                    className="border-b"
                    items={[
                      {
                        key: '0',
                        label: (
                          <span className="flex items-center gap-1">
                            <UserRoundSearch size={14} />
                            {t('719')}
                          </span>
                        ),
                      },

                      {
                        key: '1',
                        label: (
                          <span className="flex items-center gap-1">
                            <ClipboardCheck size={14} />
                            {t('12389')}
                          </span>
                        ),
                      },
                      {
                        key: '2',
                        label: (
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {t('17314')}
                          </span>
                        ),
                      },

                      {
                        key: '3',
                        label: (
                          <span className="flex items-center gap-1">
                            <FileStack size={14} />
                            {t('446')}
                          </span>
                        ),
                      },
                      {
                        key: '4',
                        label: (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {t('18146')}
                          </span>
                        ),
                      },
                    ]}
                  />
                  <div className="flex-1 overflow-auto w-full h-full bg-white">
                    {current === '0' && (
                      <>
                        <Equip0Table
                          dataSearch={dataRoot}
                          dataRootInfo={dataRootInfo}
                          CustData={CustData}
                          FactData={FactData}
                          setFactData={setFactData}
                          form={formBasInfo}
                          dataSheetSearch={dataSheetSearch}
                          gridAvatar={gridAvatar}
                          setGridAvatar={setGridAvatar}
                          CustName={CustName}
                          setCustName={setCustName}
                          CustSeq={CustSeq}
                          setCustSeq={setCustSeq}
                          setNationSeq={setNationSeq}
                          NationSeq={NationSeq}
                          NationName={NationName}
                          setNationName={setNationName}
                          ToolSeq={ToolSeq}
                        />
                      </>
                    )}

                    {current === '1' && (
                      <div className="w-full h-[calc(100vh-250px)] overflow-auto">
                        <Splitter className="w-full h-full">
                          <SplitterPanel size={55} minSize={10}>
                            <div className="h-full">
                              <Equip1Table
                                form={formMoldInfo}
                                dataRootInfo={dataRootInfo}
                              />
                            </div>
                          </SplitterPanel>

                          <SplitterPanel size={45} minSize={20}>
                            <Equip2Table
                              dataItemName={ItemData}
                              setSelection={setSelectionMold}
                              selection={selectionMold}
                              showSearch={showSearch13}
                              setShowSearch={setShowSearch13}
                              numRows={numRowsMold}
                              setGridData={setGridDataMold}
                              gridData={gridDataMold}
                              setNumRows={setNumRowsMold}
                              setCols={setColsMold}
                              cols={colsMold}
                              defaultCols={defaultColsMold}
                              canEdit={canEdit}
                              canCreate={canCreate}
                              handleRowAppend={handleRowAppendMold}
                              fetchGenericData={fetchGenericData}
                            />
                          </SplitterPanel>
                        </Splitter>
                      </div>
                    )}

                    {current === '2' && (
                      <>
                        <Equip3Table
                          setSelection={setSelection3}
                          selection={selection3}
                          showSearch={showSearch3}
                          setShowSearch={setShowSearch3}
                          numRows={numRowsInspect}
                          setGridData={setGridDataInspect}
                          gridData={gridDataInspect}
                          setNumRows={setNumRowsInspect}
                          setCols={setColsInspect}
                          cols={colsInspect}
                          defaultCols={defaultColsInspect}
                          canEdit={canEdit}
                          canCreate={canCreate}
                          handleRowAppend={handleRowAppendInspect}
                          EmpData={EmpData}
                          setEmpData={setEmpData}
                          AssetData={AssetData}
                          fetchGenericData={fetchGenericData}
                          ToolName={ToolName}
                          ToolNo={ToolNo}
                          ToolSeq={ToolSeq}
                          Spec={Spec}
                          UMToolKind={UmToolKind}
                          EmpName={EmpName}
                        />
                      </>
                    )}

                    {current === '3' && (
                      <>
                        <Equip4Table
                          setSelection={setSelectionFile}
                          selection={selectionFile}
                          showSearch={showSearch15}
                          setShowSearch={setShowSearch15}
                          numRows={numRows15}
                          setGridData={setGridDataFile}
                          gridData={gridDataFile}
                          setNumRows={setNumRows15}
                          setCols={setColsFile}
                          cols={colsFile}
                          defaultCols={defaultcolsFile}
                          canEdit={canEdit}
                          canCreate={canCreate}
                          dataSheetSearch={dataSheetSearch}
                          ToolSeq={ToolSeq}
                        />
                      </>
                    )}
                    {current === '4' && (
                      <>
                        <Equip5Table
                          ToolSeq={dataSelect?.ToolSeq}
                          setSelection={setSelection4}
                          selection={selection4}
                          showSearch={showSearch4}
                          setShowSearch={setShowSearch4}
                          numRows={numRowsMgn}
                          setGridData={setGridDataMgn}
                          gridData={gridDataMgn}
                          setNumRows={setNumRowsMgn}
                          setCols={setColsMgn}
                          cols={colsMgn}
                          defaultCols={defaultColsMgn}
                          canEdit={canEdit}
                          canCreate={canCreate}
                          handleRowAppend={handleRowAppendMgn}
                          helpData09={helpData09}
                          setHelpData09={setHelpData09}
                          fetchGenericData={fetchGenericData}
                        />
                      </>
                    )}
                  </div>
                </div>
              </SplitterPanel>
            </Splitter>
          </div>
        </div>
      </div>
      <ErrorListModal
        isModalVisible={modal2Open}
        setIsModalVisible={setModal2Open}
        dataError={errorData}
      />

      <ModalConfirm
        modalOpen={modalDeleteConfirm}
        setmodalOpen={setModalDeleteConfirm}
        MessageConfirm={'Xác nhận xóa dữ liệu?'}
        onOk={handleDelete}
        isShowInput={false}
      />
    </>
  )
}
