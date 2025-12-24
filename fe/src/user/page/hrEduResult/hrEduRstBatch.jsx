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
  MapPin,
  FileStack,
  UserRoundSearch,
} from 'lucide-react'

import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { HandleError } from '../default/handleError'
import { filterValidRows } from '../../../utils/filterUorA'

import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'

import { HrFileQ } from '../../../features/hr/hrFile/HrFileQ'

import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { HrFileD } from '../../../features/hr/hrFile/HrFileD'
import ModalConfirm from '../../components/modal/transReqMat/modalConfirm'
import HrEduPerRstAction from '../../components/actions/hrEdu/hrEduPerRstAction'
import HrEduPerRstQuery from '../../components/query/hrEdu/hrEduPerRstQuery'
import Edu0Table from '../../components/table/edu-per-rst/edu0Table'
import Edu1Table from '../../components/table/edu-per-rst/edu1Table'
import Edu2Table from '../../components/table/edu-per-rst/edu2Table'
import Edu3Table from '../../components/table/edu-per-rst/edu3Table'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { auHrEduPerRst } from '../../../features/mgn-hr/hr-edu-rst/AuHrEduPerRst'
import Edu4Table from '../../components/table/edu-per-rst/edu4Table'
import { getEduRstById } from '../../../features/mgn-hr/hr-edu-rst/getEduRstById'
import { deleteHrEduPerRst } from '../../../features/mgn-hr/hr-edu-rst/deleteHrEduPerRst'
import { deleteHrEduRstCost } from '../../../features/mgn-hr/hr-edu-rst/deleteHrEduRstCost'
import { deleteHrEduRstItem } from '../../../features/mgn-hr/hr-edu-rst/deleteHrEduRstItem'
import { getEduRstCost } from '../../../features/mgn-hr/hr-edu-rst/getEduRstCost'
import { getEduRstItemById } from '../../../features/mgn-hr/hr-edu-rst/getEduRstItemById'
import { getEduRstPerObj } from '../../../features/mgn-hr/hr-edu-rst/getEduRstPerObj'
import { auHrEduRstBatch } from '../../../features/mgn-hr/hr-edu-rst/AuHrEduRstBatch'
import { getEduRstByBatch } from '../../../features/mgn-hr/hr-edu-rst/getEduRstByBatch'
import { deleteHrEduRstObj } from '../../../features/mgn-hr/hr-edu-rst/deleteHrEduRstObj'
import { deleteHrEduRstBatch } from '../../../features/mgn-hr/hr-edu-rst/deleteHrEduRstBatch'

export default function HrEduRstBatch({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests,
}) {
  const userFrom = JSON.parse(localStorage.getItem('userInfo'))
  const [isAPISuccess, setIsAPISuccess] = useState(true)

  const location = useLocation()
  const dataSelect = location.state?.eduRstSelected || []
  const loadingBarRef = useRef(null)
  const activeFetchCountRef = useRef(0)
  const { t } = useTranslation()

  const defaultColsRstItem = useMemo(
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
        title: t('10468'),
        id: 'RstSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('10566'),
        id: 'EduItemSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('18167'),
        id: 'EduItemName',
        kind: 'Text',
        readonly: false,
        width: 280,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('22265'),
        id: 'SMDataType',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('8060'),
        id: 'SMDataTypeName',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('9740'),
        id: 'CodeHelpConst',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('9743'),
        id: 'CodeHelpParams',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('3083'),
        id: 'RstValueText',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('362'),
        id: 'Rem',
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

  const defaultColsRstCost = useMemo(
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
        title: t('19015'),
        id: 'RstSeq',
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
        title: t('6082'),
        id: 'UMCostItem',
        kind: 'Custom',
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
        title: t('1054'),
        id: 'UMCostItemName',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        themeOverride: {
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('8654'),
        id: 'RstCost',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('5898'),
        id: 'IsVAT',
        kind: 'Boolean',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('1032'),
        id: 'VATAmt',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('10722'),
        id: 'IsInsur',
        kind: 'Boolean',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('10719'),
        id: 'ReturnAmt',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('362'),
        id: 'Rem',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('16518'),
        id: 'UMCostItemOld',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: false,
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

  const defaultColsRstEmp = useMemo(
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
        title: t('10468'),
        id: 'RstSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('3161'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('4'),
        id: 'EmpName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('1452'),
        id: 'EmpID',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('738'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('5'),
        id: 'DeptName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
    ],
    [],
  )

  const [isSent, setIsSent] = useState(false)

  const [gridDataRstItem, setGridDataRstItem] = useState([])
  const [gridDataRstCost, setGridDataRstCost] = useState([])
  const [gridDataFile, setGridDataFile] = useState([])
  const [gridDataRstEmp, setGridDataRstEmp] = useState([])
  const [gridAvatar, setGridAvatar] = useState([])

  const [selectionRstItem, setSelectionRstItem] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionRstCost, setSelectionRstCost] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionFile, setSelectionFile] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionRstEmp, setSelectionRstEmp] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [showSearch3, setShowSearch3] = useState(false)
  const [showSearch4, setShowSearch4] = useState(false)

  const [showSearch13, setShowSearch13] = useState(false)
  const [showSearch15, setShowSearch15] = useState(false)
  const [addedRowsMgn, setAddedRowsMgn] = useState([])

  const [addedRowsMold, setAddedRowsMold] = useState([])
  const [addedRowsEmp, setAddedRowsEmp] = useState([])

  const [numRowsToAddInspect, setNumRowsToAddInspect] = useState(null)
  const [numRowsToAddMgn, setNumRowsToAddMgn] = useState(null)

  const [numRowsToAddMold, setNumRowsToAddMold] = useState(null)

  const [numRowsToAddEmp, setNumRowsToAddEmp] = useState(null)

  const [numRowsRstItem, setNumRowsRstItem] = useState(0)

  const [numRowsRstCost, setNumRowsRstCost] = useState(0)
  const [numRows15, setNumRows15] = useState(0)
  const [numRowsEmp, setNumRowsEmp] = useState(0)

  const [UMEduGrpTypeData, setUMEduGrpTypeData] = useState([])
  const [EduTypeData, setEduTypeData] = useState([])
  const [EmpData, setEmpData] = useState([])
  const [CourseData, setCourseData] = useState([])
  const [CfmEmpData, setCfmEmpData] = useState([])
  const [classData, setClassData] = useState([])
  const [SMInOutTypeNameData, setSMInOutTypeNameData] = useState([])
  const [UMInstituteData, setUMInstituteData] = useState([])
  const [SatisLevelData, setSatisLevelData] = useState([])
  const [UMlocationData, setUMlocationData] = useState([])
  const [LecturerData, setLecturerData] = useState([])
  const [CostItemData, setCostItemData] = useState([])

  const [helpData09, setHelpData09] = useState([])

  const [current, setCurrent] = useState('0')
  const [checkPageA, setCheckPageA] = useState(false)

  const [dataSheetSearch, setDataSheetSearch] = useState([])
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [formBasInfo] = Form.useForm()
  const [formInfo] = Form.useForm()
  const [modalDeleteConfirm, setModalDeleteConfirm] = useState(false)

  const [rstSeq, setRstSeq] = useState(null)

  const [ReqSeq, setReqSeq] = useState(null)

  const [EmpName, setEmpName] = useState('')
  const [EmpSeq, setEmpSeq] = useState(null)
  const [UserId, setUserId] = useState('')

  const [DeptName, setDeptName] = useState('')
  const [DeptSeq, setDeptSeq] = useState(null)

  const [PosName, setPosName] = useState('')
  const [PosSeq, setPosSeq] = useState(null)
  const [UMJpName, setUMJpName] = useState('')

  const [EduClassSeq, setEduClassSeq] = useState('')
  const [SMEduPlanType, setSMEduPlanType] = useState(null)

  const [EduTypeSeq, setEduTypeSeq] = useState('')

  const [selectEmp, setSelectEmp] = useState(null)
  const [selectCfmEmp, setSelectCfmEmp] = useState(null)
  const [WorkingTag, setWorkingTag] = useState('A')

  const [cfmEmpName, setCfmEmpName] = useState('')
  const [cfmEmpSeq, setCfmEmpSeq] = useState(null)
  const [cfmEmpId, setCfmEmpId] = useState('')

  const [EduClassName, setEduClassName] = useState('')
  const [EduClass, setEduClass] = useState('')
  const [EduGrpType, setEduGrpType] = useState('')
  const [eduTypeName, setEduTypeName] = useState('')
  const [EduCourseName, setEduCourseName] = useState('')
  const [EduCourseSeq, setEduCourseSeq] = useState('')
  const [SMInOutType, setSMInOutType] = useState('')
  const [SatisLevel, setSatisLevel] = useState('')
  const [UMInstituteName, setUMInstituteName] = useState('')
  const [UMInstitute, setUMInstitute] = useState('')
  const [UMLocation, setUMLocation] = useState('')

  const [LecturerName, setLecturerName] = useState('')
  const [LecturerSeq, setLecturerSeq] = useState('')

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

  const [colsRstItem, setColsRstItem] = useState(() =>
    loadFromLocalStorageSheet(
      'edu_rst_item_a',
      defaultColsRstItem.filter((col) => col.visible),
    ),
  )

  const [colsRstCost, setColsRstCost] = useState(() =>
    loadFromLocalStorageSheet(
      'edu_rst_cost_a',
      defaultColsRstCost.filter((col) => col.visible),
    ),
  )

  const [colsFile, setColsFile] = useState(() =>
    loadFromLocalStorageSheet(
      'asset_file_a',
      defaultcolsFile.filter((col) => col.visible),
    ),
  )

  const [colsRstEmp, setColsRstEmp] = useState(() =>
    loadFromLocalStorageSheet(
      'edu_rst_emp_a',
      defaultColsRstEmp.filter((col) => col.visible),
    ),
  )

  const handleRowAppendRstItem = useCallback(
    (numRowsToAddMgn) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsRstItem,
        setGridDataRstItem,
        setNumRowsRstItem,
        setAddedRowsMgn,
        numRowsToAddMgn,
      )
    },
    [
      colsRstItem,
      setGridDataRstItem,
      setNumRowsRstItem,
      setAddedRowsMgn,
      numRowsToAddMgn,
    ],
  )

  const handleRowAppendRstCost = useCallback(
    (numRowsToAddMold) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsRstCost,
        setGridDataRstCost,
        setNumRowsRstCost,
        setAddedRowsMold,
        numRowsToAddMold,
      )
    },
    [
      colsRstCost,
      setGridDataRstCost,
      setNumRowsRstCost,
      setAddedRowsMold,
      numRowsToAddMold,
    ],
  )

  const handleRowAppendRstEmp = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsRstEmp,
        setGridDataRstEmp,
        setNumRowsEmp,
        setAddedRowsEmp,
        numRowsToAdd,
      )
    },
    [
      colsRstEmp,
      setGridDataRstEmp,
      setNumRowsEmp,
      setAddedRowsEmp,
      numRowsToAddEmp,
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
          selection: selectionRstCost,
          setSelection: setSelectionRstCost,
          gridData: gridDataRstCost,
          setGridData: setGridDataRstCost,
          setNumRows: setNumRowsRstCost,
          deleteApi: deleteHrEduRstCost,
          resetFn: resetTable(setSelectionRstCost),
        },
      ],
      2: [
        {
          selection: selectionRstItem,
          setSelection: setSelectionRstItem,
          gridData: gridDataRstItem,
          setGridData: setGridDataRstItem,
          setNumRows: setNumRowsRstItem,
          deleteApi: deleteHrEduRstItem,
          resetFn: resetTable(setSelectionRstItem),
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

    const mapObj = {
      0: [
        {
          selection: selectionRstEmp,
          setSelection: setSelectionRstEmp,
          gridData: gridDataRstEmp,
          setGridData: setGridDataRstEmp,
          setNumRows: setNumRowsEmp,
          deleteApi: deleteHrEduRstObj,
          resetFn: resetTable(setSelectionRstEmp),
        },
      ],
    }

    const target = map[current]
    const targetObj = mapObj[0]

    if (!target && !targetObj) return

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
          WorkingTag: 'D',
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
    }
    if (Array.isArray(targetObj)) {
      targetObj.forEach(processTarget)
    } 
    else {
      processTarget(target)
      processTarget(targetObj)
    }
  }, [
    current,
    canDelete,

    gridDataRstItem,
    setGridDataRstItem,
    setNumRowsRstItem,

    selectionRstCost,
    setSelectionRstCost,
    gridDataRstCost,
    setGridDataRstCost,
    setNumRowsRstCost,

    selectionRstEmp,
    setSelectionRstEmp,
    gridDataRstEmp,
    setGridDataRstEmp,
    setNumRowsEmp,
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
        userData,
        cfmEmpData,
        ClassData,
        UMEduGrpTypeData,
        EduTypeData,
        CourseData,
        SMInOutTypeNameData,
        UMInstituteData,
        SatisLevelData,
        UMlocationData,
        LecturerData,
        CostItemData,
      ] = await Promise.all([
        GetCodeHelpVer2(
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
        GetCodeHelpVer2(
          10009,
          '',
          '',
          '',
          '',
          '',
          '2',
          1,
          0,
          '',
          0,
          0,
          0,
          signal,
        ),
        GetCodeHelpVer2(
          20017,
          '',
          '',
          '',
          '',
          '',
          '1',
          1,
          1000,
          '',
          0,
          0,
          0,
          signal,
        ),
        GetCodeHelpComboVer2('', 6, 19999, 1, '%', '3908', '', '', '', signal),
        GetCodeHelpVer2(
          20021,
          '',
          '',
          '',
          '',
          '',
          '1',
          1,
          1000,
          '',
          0,
          0,
          0,
          signal,
        ),
        GetCodeHelpVer2(
          20019,
          '',
          '',
          '',
          '',
          '',
          '1',
          1,
          1000,
          '',
          0,
          0,
          0,
          signal,
        ),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '1012', '', '', '', signal),
        GetCodeHelpVer2(
          19999,
          '',
          '3904',
          '',
          '',
          '',
          '1',
          1,
          1000,
          "IsUse = ''1''",
          0,
          0,
          0,
          signal,
        ),
        GetCodeHelpComboVer2('', 6, 19999, 1, '%', '3911', '', '', '', signal),

        GetCodeHelpComboVer2('', 6, 19999, 1, '%', '3905', '', '', '', signal),
        GetCodeHelpVer2(
          20028,
          '',
          '3904',
          '',
          '',
          '',
          '1',
          1,
          1000,
          '',
          0,
          0,
          0,
          signal,
        ),
        GetCodeHelpVer2(
          20029,
          '',
          '',
          '',
          '',
          '',
          '1',
          1,
          1000,
          '',
          0,
          0,
          0,
          signal,
        ),
      ])

      setEmpData(userData.data)
      setCfmEmpData(cfmEmpData.data)
      setClassData(ClassData.data)
      setUMEduGrpTypeData(UMEduGrpTypeData.data)
      setEduTypeData(EduTypeData.data)
      setCourseData(CourseData.data)
      setSMInOutTypeNameData(SMInOutTypeNameData.data)
      setUMInstituteData(UMInstituteData.data)
      setSatisLevelData(SatisLevelData.data)
      setUMlocationData(UMlocationData.data)
      setLecturerData(LecturerData.data)
      setCostItemData(CostItemData.data)
    } catch {
      setEmpData([])
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

  const handleSaveBasInfo = useCallback(
    async (dataMainInfo, dataRstCost, dataItem, dataPerObj) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }

      if (isSent) return
      setIsSent(true)

      try {
        const results = await auHrEduRstBatch(
          dataMainInfo,
          dataRstCost,
          dataItem,
          dataPerObj,
        )


        if (results.success) {
          message.success('Thành công!')

          setIsSent(false)
          resetTable()

          const newData = results?.data?.logs2
          setGridDataRstCost((prev) => {
            const updated = prev.map((item) => {
              const found = newData.find((x) => x?.IDX_NO === item?.IdxNo)

              return found
                ? {
                    ...item,
                    Status: '',
                    IdSeq: found?.IdSeq,
                    EmpSeq: found?.EmpSeq,
                  }
                : item
            })
            return updateIndexNo(updated)
          })

          const newDataObj = results?.data?.logs4
          setGridDataRstEmp((prev) => {
            const updated = prev.map((item) => {
              const found = newDataObj.find((x) => x?.IDX_NO === item?.IdxNo)

              return found
                ? {
                    ...item,
                    Status: '',
                    IdSeq: found?.IdSeq,
                    EduTypeSeq: found?.EduTypeSeq,
                  }
                : item
            })
            return updateIndexNo(updated)
          })
          setRstSeq(results?.data?.logs1[0].RstSeq)
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
        console.log('error2', error)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
    },
    [gridDataRstCost],
  )

  const handleDeleteEduRstBatch = useCallback(
    async (dataMainInfo, dataRstCost, dataMgn) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền xóa dữ liệu')
        return
      }

      if (isSent) return
      setIsSent(true)

      try {
        const results = await deleteHrEduRstBatch(
          dataMainInfo,
          dataRstCost,
          dataMgn,
        )

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

    const dataInfo = await formInfo.getFieldValue()

    const mainInfo = [
      {
        WorkingTag: WorkingTag,
        ...dataInfo,
        CfmEmpSeq: cfmEmpSeq,
        EmpSeq: EmpSeq,
        SMEduPlanType: SMEduPlanType,
        ReqSeq: ReqSeq,
        EduClassSeq: EduClass,
        UMEduGrpType: EduGrpType,
        EduTypeSeq: EduTypeSeq,
        EduCourseSeq: EduCourseSeq,
        SMInOutType: SMInOutType,
        SatisLevel: SatisLevel,
        UMInstitute: UMInstitute,
        LecturerSeq: LecturerSeq,
        UMlocation: UMLocation,
        RegDate: formatDateSearch(dataInfo?.RegDate),
        EduBegDate: formatDateSearch(dataInfo?.EduBegDate[0]),
        EduEndDate: formatDateSearch(dataInfo?.EduBegDate[1]),
        RstSeq: rstSeq,
      },
    ]

    const requiredFields = []
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

    const resulA = filterValidRows(gridDataRstCost, 'A').map((item) => {
      return {
        ...item,
        WorkingTag: 'A',
        RstSeq: rstSeq
      }
    })

    const resulU = filterValidRows(gridDataRstCost, 'U').map((item) => {
      return {
        ...item,
        WorkingTag: 'U',
        RstSeq: rstSeq
      }
    })

    const errors = [
      ...validateRequiredFields(resulA, requiredFields),
      ...validateRequiredFields(resulU, requiredFields),
    ]

    const requiredFieldsMgn = []
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

    const resulMgnA = filterValidRows(gridDataRstItem, 'A').map((item) => {
      return {
        ...item,
        WorkingTag: 'A',
        RstSeq: rstSeq
      }
    })

    const resulMgnU = filterValidRows(gridDataRstItem, 'U').map((item) => {
      return {
        ...item,
        WorkingTag: 'U',
        RstSeq: rstSeq
      }
    })

    const requiredFieldsPerObj = []

    const resulPerObjA = filterValidRows(gridDataRstEmp, 'A').map((item) => {
      return {
        ...item,
        WorkingTag: 'A',
        RstSeq: rstSeq
      }
    })

    const resulPerObjU = filterValidRows(gridDataRstEmp, 'U').map((item) => {
      return {
        ...item,
        WorkingTag: 'U',
        RstSeq: rstSeq

      }
    })

    const errorsMgn = [
      ...validateRequiredFieldsMgn(resulMgnA, requiredFieldsMgn),
      ...validateRequiredFieldsMgn(resulMgnU, requiredFieldsMgn),
    ]

    const errorsPerObj = [
      ...validateRequiredFieldsMgn(resulPerObjA, requiredFieldsPerObj),
      ...validateRequiredFieldsMgn(resulPerObjU, requiredFieldsPerObj),
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

    if (errorsPerObj.length > 0) {
      setModal2Open(true)
      setErrorData(errorsPerObj)
      return
    }

    const dataRstCost = [...resulA, ...resulU]
    const dataMgn = [...resulMgnA, ...resulMgnU]
    const dataPerObj = [...resulPerObjA, ...resulPerObjU]

    handleSaveBasInfo(mainInfo, dataRstCost, dataMgn, dataPerObj)
  }, [
    WorkingTag,
    formBasInfo,
    formInfo,
    UMLocation,
    SatisLevel,
    SMInOutType,
    SMEduPlanType,
    LecturerSeq,
    gridDataRstCost,
    gridDataRstItem,

    gridDataRstCost,
    gridDataRstItem,
    gridDataRstEmp,
  ])

  const handleDelete = useCallback(async () => {
    if (WorkingTag === '') return

    const formatDateSearch = (date) => {
      const d = dayjs(date)
      return d.isValid() ? d.format('YYYYMMDD') : ''
    }

    const dataBasInfo = await formInfo.getFieldValue()

    const mainInfo = [
      {
        WorkingTag: 'D',
        RstSeq: rstSeq,
        ...dataBasInfo,
      },
    ]

    const requiredFields = []
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

    const resulA = gridDataRstCost.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
        rstSeq: rstSeq,
      }
    })

    const resulU = gridDataRstCost.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
        rstSeq: rstSeq,
      }
    })

    const errors = [
      ...validateRequiredFields(resulA, requiredFields),
      ...validateRequiredFields(resulU, requiredFields),
    ]

    const requiredFieldsMgn = []
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

    const resulMgnA = gridDataRstItem.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
        rstSeq: rstSeq,
      }
    })

    const resulMgnU = gridDataRstItem.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
        rstSeq: rstSeq,
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

    const dataRstCost = [...resulA, ...resulU]
    const dataMgn = [...resulMgnA, ...resulMgnU]

    handleDeleteEduRstBatch(mainInfo, dataRstCost, dataMgn)
    handleDeleteAllFiles()
  }, [WorkingTag, formInfo, gridDataRstCost, gridDataRstItem])

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

  const onClickSearch = useCallback(async () => {
    const getValidDate = (value) => {
      const date = dayjs(value)
      return date.isValid() ? date : null
    }
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    if (controllers.current && controllers.current.onClickSearch) {
      controllers.current.onClickSearch.abort()
      controllers.current.onClickSearch = null
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

    controllers.current.onClickSearch = controller

    setIsAPISuccess(false)

    try {
      const searchParams = [
        {
          EmpSeq: EmpSeq,
          RstSeq: rstSeq || dataSelect[0].RstSeq,
          SMEduPlanType: SMEduPlanType,
          SMEduPlanTypeName: '',
          ReqSeq: ReqSeq,
          CfmEmpSeq: cfmEmpSeq,
        },
      ]

      const response = await getEduRstByBatch(searchParams)
      const { dataCost, dataItem, dataPersRst, dataObj } = response.data

      console.log('dataPersRst[0]?.LecturerName', dataPersRst[0]?.LecturerName)

      formInfo.setFieldsValue({
        RegDate: getValidDate(dataPersRst[0]?.RegDate),
        CfmEmpName: dataPersRst[0]?.CfmEmpName,
        RstNo: dataPersRst[0]?.RstNo,
        EduClassName: dataPersRst[0]?.EduClassName,
        UMEduGrpTypeName: dataPersRst[0]?.UMEduGrpTypeName,
        EduTypeName: dataPersRst[0]?.EduTypeName,
        EduCourseName: dataPersRst[0]?.EduCourseName,
        SMInOutTypeName: dataPersRst[0]?.SMInOutTypeName,
        EduBegDate: [
          getValidDate(dataPersRst[0]?.EduBegDate),
          getValidDate(dataPersRst[0]?.EduEndDate),
        ],
        EduDd: dataPersRst[0]?.EduDd,
        EduTm: dataPersRst[0]?.EduTm,
        EduPoint: dataPersRst[0]?.EduPoint,
        SatisLevelName: dataPersRst[0]?.SatisLevelName,
        UMInstituteName: dataPersRst[0]?.UMInstituteName,
        UMlocationName: dataPersRst[0]?.UMlocationName,
        LecturerName: dataPersRst[0]?.LecturerName || LecturerName,
        EtcInstitute: dataPersRst[0]?.EtcInstitute,
        Etclocation: dataPersRst[0]?.Etclocation,
        EtcLecturer: dataPersRst[0]?.EtcLecturer,
        RstRem: dataPersRst[0]?.RstRem,
        RstSummary: dataPersRst[0]?.RstSummary,
        IsBatchReq: dataPersRst[0]?.IsBatchReq,
        IsEnd: dataPersRst[0]?.IsEnd,
        EtcCourseName : dataPersRst[0]?.EtcCourseName,
      })

      setRstSeq(dataPersRst[0]?.RstSeq)
      setCfmEmpName(dataPersRst[0]?.CfmEmpName)
      setCfmEmpSeq(dataPersRst[0]?.CfmEmpSeq)
      setEduClass(dataPersRst[0]?.EduClass)
      setEduTypeSeq(dataPersRst[0]?.EduTypeSeq)
      setEduClassName(dataPersRst[0]?.EduClassName)

      setEduCourseSeq(dataPersRst[0]?.EduCourseSeq)
      setUMInstitute(dataPersRst[0]?.UMInstitute)
      setLecturerName(dataPersRst[0]?.LecturerName)
      setSatisLevel(dataPersRst[0]?.SatisLevel)
      setEduGrpType(dataPersRst[0]?.UMEduGrpType)
      setSMInOutType(dataPersRst[0]?.SMInOutType)
      setSMEduPlanType(dataPersRst[0]?.SMEduPlanType)
      setUMLocation(dataPersRst[0]?.UMlocation)
      setLecturerSeq(dataPersRst[0]?.LecturerSeq)
      setGridDataRstItem(dataItem)
      setNumRowsRstItem(dataItem.length)

      setGridDataRstCost(dataCost || [])
      setNumRowsRstCost(dataCost?.length)

      setGridDataRstEmp(dataObj || [])
      setNumRowsEmp(dataObj?.length)

        const searchParamsFile = {
          KeyItem1: dataPersRst[0]?.RstSeq || 0,
          KeyItem2: 'FILE_EDU_RESULT',
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

      } catch (error) {
        const emptyData = generateEmptyData(10, defaultColsRstCost)
        const updatedEmptyData = updateIndexNo(emptyData)
        setGridDataRstCost(updatedEmptyData)
        setNumRowsRstCost(emptyData.length)
    } finally {
      setIsAPISuccess(true)
      controllers.current.onClickSearch = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    current,
    DeptSeq,
    EmpSeq,
    EmpName,
    rstSeq,
    cfmEmpSeq,
    SMEduPlanType,
    ReqSeq,
    isAPISuccess,
    gridDataRstCost,
    gridDataRstItem,
    formInfo,
  ])

  useEffect(() => {
    if (selectEmp) {
      setEmpSeq(selectEmp.EmpSeq)
      setEmpName(selectEmp.EmpName)
      setUserId(selectEmp.EmpID)
      setDeptName(selectEmp.DeptName)
      setDeptSeq(selectEmp.DeptSeq)
      setPosName(selectEmp.PosName)
      setPosSeq(selectEmp.PosSeq)
      setUMJpName(selectEmp.UMJpName)
    }
  }, [selectEmp])

  useEffect(() => {
    if (dataSelect.length > 0) {
      setEmpSeq(dataSelect[0].EmpSeq)
      setEmpName(dataSelect[0].EmpName)
      setUserId(dataSelect[0].EmpID)
      setDeptName(dataSelect[0].DeptName)
      setDeptSeq(dataSelect[0].DeptSeq)
      setPosName(dataSelect[0].PosName)
      setPosSeq(dataSelect[0].PosSeq)
      setUMJpName(dataSelect[0].UMJpName)
      setRstSeq(dataSelect[0].RstSeq)
      setCfmEmpSeq(dataSelect[0].CfmEmpSeq)
      setUMLocation(dataSelect[0].UMLocation)
      setEduGrpType(dataSelect[0].EduGrpType)
      setSatisLevel(dataSelect[0].SatisLevel)
      setWorkingTag('U')

      onClickSearch()
    }
  }, [dataSelect])

  const handleCheckRstCost = () => {
    const getValidDate = (value) => {
      const date = dayjs(value)
      return date.isValid() ? date : null
    }

    const searchParams = [
      {
        RstSeq: rstSeq,
        ReqSeq: ReqSeq,
      },
    ]

    fetchGenericData({
      controllerKey: 'getEduRstCost',
      postFunction: getEduRstCost,
      searchParams: searchParams,
      useEmptyData: false,
      defaultCols: defaultColsRstCost,
      afterFetch: (data) => {
        setGridDataRstCost(data)
        setNumRowsRstCost(data.length)
      },
    })
  }

  const handleCheckRstItem = () => {
    const getValidDate = (value) => {
      const date = dayjs(value)
      return date.isValid() ? date : null
    }

    const searchParams = [
      {
        ReqSeq: ReqSeq,
        RstSeq: rstSeq,
        EduTypeSeq: EduTypeSeq,
        IsSearch: 1,
      },
    ]

    fetchGenericData({
      controllerKey: 'getEduRstItemById',
      postFunction: getEduRstItemById,
      searchParams: searchParams,
      useEmptyData: false,
      defaultCols: defaultColsRstItem,
      afterFetch: (data) => {
        setGridDataRstItem(data)
        setNumRowsRstItem(data.length)
      },
    })
  }

  const handleCheckRstEmp = () => {
    const getValidDate = (value) => {
      const date = dayjs(value)
      return date.isValid() ? date : null
    }

    const searchParams = [
      {
        EmpSeq: EmpSeq,
        RstSeq: rstSeq,
        DeptName: DeptName,
        EmpName: EmpName,
        ReqSeq: EmpSeq,
      },
    ]

    fetchGenericData({
      controllerKey: 'getEduRstPerObj',
      postFunction: getEduRstPerObj,
      searchParams: searchParams,
      useEmptyData: false,
      defaultCols: defaultColsRstEmp,
      afterFetch: (data) => {
        setGridDataRstEmp(data)
        setNumRowsEmp(data.length)
      },
    })
  }

  return (
    <>
      <Helmet>
        <title>{t('10002577')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col  h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full  ">
            <div className="flex p-2 items-end justify-end">
              <HrEduPerRstAction
                handleSaveAll={handleExternalSubmit}
                handleDeleteDataSheet={handleDeleteDataSheet}
                handleDelete={handleDelete}
                handleSearch={onClickSearch}
                setModalDeleteConfirm={setModalDeleteConfirm}
                current={current}
                handleCheckRstCost={handleCheckRstCost}
                handleCheckRstItem={handleCheckRstItem}
                handleCheckRstEmp={handleCheckRstEmp}
              />
            </div>

          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full">
            <Splitter className="w-full h-full">
              <SplitterPanel size={80} minSize={30}>
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
                            {t('20798')}
                          </span>
                        ),
                      },

                      {
                        key: '1',
                        label: (
                          <span className="flex items-center gap-1">
                            <ClipboardCheck size={14} />
                            {t('19026')}
                          </span>
                        ),
                      },

                      {
                        key: '2',
                        label: (
                          <span className="flex items-center gap-1">
                            <FileStack size={14} />
                            {t('20895')}
                          </span>
                        ),
                      },
                      {
                        key: '3',
                        label: (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {t('18124')}
                          </span>
                        ),
                      },
                    ]}
                  />
                  <div className="flex-1 overflow-auto w-full h-full bg-white">
                    {current === '0' && (
                      <>
                        <Edu0Table
                          dataSearch={dataSelect}
                          CfmEmpData={CfmEmpData}
                          ClassData={classData}
                          UMEduGrpTypeData={UMEduGrpTypeData}
                          EduTypeData={EduTypeData}
                          setEduTypeData={setEduTypeData}
                          CourseData={CourseData}
                          setCourseData={setCourseData}
                          SMInOutTypeNameData={SMInOutTypeNameData}
                          UMInstituteData={UMInstituteData}
                          setUMInstituteData={setUMInstituteData}
                          SatisLevelData={SatisLevelData}
                          setSatisLevelData={setSatisLevelData}
                          UMlocationData={UMlocationData}
                          LecturerData={LecturerData}
                          setLecturerData={setLecturerData}
                          form={formInfo}
                          cfmEmpName={cfmEmpName}
                          setCfmEmpName={setCfmEmpName}
                          cfmEmpSeq={cfmEmpSeq}
                          setCfmEmpSeq={setCfmEmpSeq}
                          CfmUserId={cfmEmpId}
                          setCfmUserId={setCfmEmpId}
                          setSelectEmp={setSelectCfmEmp}
                          EduClassName={EduClassName}
                          setEduClassName={setEduClassName}
                          setEduClass={setEduClass}
                          setEduGrpType={setEduGrpType}
                          eduTypeName={eduTypeName}
                          setEduTypeName={setEduTypeName}
                          setEduTypeSeq={setEduTypeSeq}
                          EduCourseName={EduCourseName}
                          setEduCourseName={setEduCourseName}
                          setEduCourseSeq={setEduCourseSeq}
                          setSMInOutType={setSMInOutType}
                          setSatisLevel={setSatisLevel}
                          UMInstituteName={UMInstituteName}
                          setUMInstituteName={setUMInstituteName}
                          setUMInstitute={setUMInstitute}
                          setUMlocation={setUMLocation}
                          LecturerName={LecturerName}
                          setLecturerName={setLecturerName}
                          setLecturerSeq={setLecturerSeq}
                          setEduClassSeq={setEduClassSeq}
                        />
                      </>
                    )}

                    {current === '1' && (
                      <>
                        <Edu1Table
                          dataCostItem={CostItemData}
                          setDataCostItem={setCostItemData}
                          setSelection={setSelectionRstCost}
                          selection={selectionRstCost}
                          showSearch={showSearch13}
                          setShowSearch={setShowSearch13}
                          numRows={numRowsRstCost}
                          setGridData={setGridDataRstCost}
                          gridData={gridDataRstCost}
                          setNumRows={setNumRowsRstCost}
                          setCols={setColsRstCost}
                          cols={colsRstCost}
                          defaultCols={defaultColsRstCost}
                          canEdit={canEdit}
                          canCreate={canCreate}
                          handleRowAppend={handleRowAppendRstCost}
                          fetchGenericData={fetchGenericData}
                        />
                      </>
                    )}

                    {current === '2' && (
                      <>
                        <Edu2Table
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
                          RstSeq={rstSeq}
                        />
                      </>
                    )}
                    {current === '3' && (
                      <>
                        <Edu3Table
                          rstSeq={dataSelect?.rstSeq}
                          setSelection={setSelectionRstItem}
                          selection={selectionRstItem}
                          showSearch={showSearch4}
                          setShowSearch={setShowSearch4}
                          numRows={numRowsRstItem}
                          setGridData={setGridDataRstItem}
                          gridData={gridDataRstItem}
                          setNumRows={setNumRowsRstItem}
                          setCols={setColsRstItem}
                          cols={colsRstItem}
                          defaultCols={defaultColsRstItem}
                          canEdit={canEdit}
                          canCreate={canCreate}
                          handleRowAppend={handleRowAppendRstItem}
                          helpData09={helpData09}
                          setHelpData09={setHelpData09}
                          fetchGenericData={fetchGenericData}
                        />
                      </>
                    )}
                  </div>
                </div>
              </SplitterPanel>

              <SplitterPanel size={20} minSize={10}>
                <Edu4Table
                  setSelection={setSelectionRstEmp}
                  selection={selectionRstEmp}
                  showSearch={showSearch4}
                  setShowSearch={setShowSearch4}
                  numRows={numRowsEmp}
                  setGridData={setGridDataRstEmp}
                  gridData={gridDataRstEmp}
                  setNumRows={setNumRowsEmp}
                  setCols={setColsRstEmp}
                  cols={colsRstEmp}
                  defaultCols={defaultColsRstEmp}
                  canEdit={canEdit}
                  canCreate={canCreate}
                  handleRowAppend={handleRowAppendRstEmp}
                  helpData={EmpData}
                  setHelpData={setEmpData}
                  fetchGenericData={fetchGenericData}
                />
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
