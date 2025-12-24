import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Menu, message } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'

import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce, set } from 'lodash'

import TopLoadingBar from 'react-top-loading-bar'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { Splitter, SplitterPanel } from 'primereact/splitter'

import ErrorListModal from '../default/errorListModal'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import HrAdmMultiOrdQuery from '../../components/query/hrAdmOrd/hrAdmMultiOrdQuery'
import TableHrAdmMultiOrd from '../../components/table/hr-adm-ord/tableHrAdmMultiOrd'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { SearchAdmMultiOrd } from '../../../features/mgn-hr/hr-adm-ord/searchAdmMultiOrd'
import { AuHrAdmMultiOrd } from '../../../features/mgn-hr/hr-adm-ord/AuHrAdmMultiOrd'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { DeleteAdmMultiOrd } from '../../../features/mgn-hr/hr-adm-ord/deleteAdmMultiOrd'
import { SearchAdmMultiOrdObj } from '../../../features/mgn-hr/hr-adm-ord/searchAdmMultiOrdObj'
import HrAdmOrdObjActions from '../../components/actions/hr-da-dept/hrAdmOrdObjAction'
export default function HrAdmOrdMulti({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests,
}) {
  const { t } = useTranslation()
  const loadingBarRef = useRef(null)
  const [isAPISuccess, setIsAPISuccess] = useState(true)

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
          disabled: false,
        },
      },

      {
        title: t('1437'),
        id: 'IntSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('4'),
        id: 'EmpName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3161'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('1452'),
        id: 'EmpID',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19131'),
        id: 'CurrOrdDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19130'),
        id: 'CurrOrdName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('163'),
        id: 'OrdDate',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('13623'),
        id: 'OrdName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('13628'),
        id: 'OrdSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('367'),
        id: 'DeptName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6686'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('373'),
        id: 'PosName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2137'),
        id: 'PosSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('642'),
        id: 'UMJpName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9078'),
        id: 'UMJpSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1073'),
        id: 'Ps',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('635'),
        id: 'UMPgName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9061'),
        id: 'UMPgSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1296'),
        id: 'UMJdName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9091'),
        id: 'UMJdSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1295'),
        id: 'UMJoName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9088'),
        id: 'UMJoSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1300'),
        id: 'JobName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9073'),
        id: 'JobSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('622'),
        id: 'PuName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('4408'),
        id: 'PuSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('583'),
        id: 'PtName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('948'),
        id: 'PtSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('553'),
        id: 'UMWsName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('4303'),
        id: 'UMWsSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('737'),
        id: 'IsBoss',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('33651'),
        id: 'IsWkOrd',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('48446'),
        id: 'WkDeptName',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('48456'),
        id: 'WkDeptSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('989'),
        id: 'Contents',
        kind: 'Text',
        readonly: false,
        width: 150,
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
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('18106'),
        id: 'IsLast',
        kind: 'Boolean',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('16520'),
        id: 'PrevEmpSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )

  const [showSearch2, setShowSearch2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gridData, setGridData] = useState([])
  const [numRows, setNumRows] = useState(0)

  const [helpData10, setHelpData10] = useState([])
  const [editedRows, setEditedRows] = useState([])
   const [count, setCount] = useState(0)
   const lastWordEntryRef = useRef(null)
   const [isSent, setIsSent] = useState(false)

  const [DeptData, setDeptData] = useState([])
  const [PosData, setPosData] = useState([])
  const [OrdData, setOrdData] = useState([])
  const [UMJpNameData, setUMJpNameData] = useState([])
  const [dataUser, setDataUser] = useState([])
  const [UMPgNameData, setUMPgNameData] = useState([])
  const [UMJdNameData, setUMJdNameData] = useState([])
  const [UMJoNameData, setUMJoNameData] = useState([])
  const [PuNameData, setPuNameData] = useState([])
  const [PtNameData, setPtNameData] = useState([])
  const [UMWsNameData, setUMWsNameData] = useState([])
  const [EntRetTypeNameData, setEntRetTypeNameData] = useState([])
  const [JobNameData, setJobNameData] = useState([])

  const [OrdName, setOrdName] = useState('')
  const [ordSeq, setOrdSeq] = useState('')
  const [EmpName, setEmpName] = useState('')
  const [EmpSeq, setEmpSeq] = useState('')
  const [ToOrdDate, setToOrdDate] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')
  const [PosName, setPosName] = useState('')
  const [PosSeq, setPosSeq] = useState('')
  const [UMWsName, setUMWsName] = useState('')
  const [UMWsSeq, setUMWsSeq] = useState('')
  const [PtName, setPtName] = useState('')
  const [PtSeq, setPtSeq] = useState('')
  const [PuName, setPuName] = useState('')
  const [PuSeq, setPuSeq] = useState('')
  const [UMPgName, setUMPgName] = useState('')
  const [UMPgSeq, setUMPgSeq] = useState('')
  const [UMJpName, setUMJpName] = useState('')
  const [UMJpSeq, setUMJpSeq] = useState('')
  const [EntRetTypeName, setEntRetTypeName] = useState('')
  const [EntRetTypeSeq, setEntRetTypeSeq] = useState('')
  const [UMJoName, setUMJoName] = useState('')
  const [UMJoSeq, setUMJoSeq] = useState('')
  const [UMJdName, setUMJdName] = useState('')
  const [UMJdSeq, setUMJdSeq] = useState('')
  const [FrOrdDate, setFrOrdDate] = useState(dayjs())
  const [EmpID, setEmpID] = useState('')
  const [IsLast, setIsLast] = useState(false)

  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')
  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [addedRows, setAddedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)

  // tree
  const [DeptName, setDeptName] = useState('')

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'HR_ADM_ORD_MULTI',
      defaultCols.filter((col) => col.visible),
    ),
  )
  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [selected, setSelected] = useState([])

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

  useEffect(() => {
    cancelAllRequests()
    message.destroy()
  }, [])

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
        DeptDataRes,
        PosDataRes,
        OrdDataRes,
        UMJpNameDataRes,
        dataUserRes,
        UMPgNameDataRes,
        UMJdNameDataRes,
        UMJoNameDataRes,
        PuNameDataRes,
        PtNameDataRes,
        UMWsNameDataRes,
        EntRetTypeNameDataRes,
        JobNameDataRes,
      ] = await Promise.all([
        GetCodeHelpVer2(
          10010,
          '',
          '',
          '',
          '',
          '',
          '1',
          '',
          1000,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpVer2(
          10011,
          '',
          '',
          '',
          '',
          '',
          '1',
          '',
          1000,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpVer2(
          20009,
          '',
          '',
          '',
          '',
          '',
          '1',
          '',
          1000,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpVer2(
          19999,
          '',
          '3052',
          '',
          '',
          '',
          '1',
          '',
          1000,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpVer2(10009, '', '', '', '', '', '1', '', 1000, '', 0, 0, 0),
        GetCodeHelpVer2(
          19999,
          '',
          '3051',
          '',
          '',
          '',
          '1',
          '',
          1000,
          '',
          0,
          0,
          0,
        ),

        GetCodeHelpVer2(
          19999,
          '',
          '3053',
          '',
          '',
          '',
          '1',
          '',
          1000,
          '',
          0,
          0,
          0,
        ),

        GetCodeHelpVer2(
          19999,
          '',
          '3003',
          '',
          '',
          '',
          '1',
          '',
          1000,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpCombo('', 6, 20001, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 20003, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '3001', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3031', '', '', '', signal),
        GetCodeHelpVer2(
          30006,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          1000,
          '',
          0,
          0,
          0,
        ),
      ])

      setDeptData(DeptDataRes.data)
      setPosData(PosDataRes.data)
      setOrdData(OrdDataRes.data)
      setUMJpNameData(UMJpNameDataRes.data)
      setDataUser(dataUserRes.data)
      setUMPgNameData(UMPgNameDataRes.data)
      setUMJdNameData(UMJdNameDataRes.data)
      setUMJoNameData(UMJoNameDataRes.data)
      setPuNameData(PuNameDataRes.data)
      setPtNameData(PtNameDataRes.data)
      setUMWsNameData(UMWsNameDataRes.data)
      setEntRetTypeNameData(EntRetTypeNameDataRes.data)
      setJobNameData(JobNameDataRes.data)
    } catch {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
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

  const fieldsToTrack = ['IdxNo']

  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const getSelectedRows = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          gridData[i]['IdxNo'] = i + 1
          rows.push(gridData[i])
        }
      }
    })

    return rows
  }

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
        setLastClickedCell(null)
        setClickedRowData(null)
        return
      }
      if (cell[0] === -1) {
        if (rowIndex >= 0 && rowIndex < gridData.length) {
          const isSelected = selection.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selection.rows.remove(rowIndex)
            setSelected(getSelectedRows())
          } else {
            newSelected = selection.rows.add(rowIndex)
            setSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRows, selected],
  )

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

  const onClickSearch = useCallback(async () => {
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
      const data = [
        {
          FrOrdDate: formatDateSearch(FrOrdDate),
          ToOrdDate: formatDateSearch(ToOrdDate),
          DeptSeq: DeptSeq,
          PosSeq: PosSeq,
          OrdSeq: ordSeq,
          UMJpSeq: UMJpSeq,
          EmpSeq: EmpSeq,
          IsLast: IsLast,
          UMPgSeq: UMPgSeq,
          UMJdSeq: UMJdSeq,
          UMJoSeq: UMJoSeq,
          EntRetTypeSeq: EntRetTypeSeq,
          PuSeq: PuSeq,
          PtSeq: PtSeq,
          UMWsSeq: UMWsSeq,
        },
      ]

      const response = await SearchAdmMultiOrd(data)
      const fetchedData = response.data || []

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
      controllers.current.onClickSearch = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    FrOrdDate,
    ToOrdDate,
    DeptSeq,
    PosSeq,
    ordSeq,
    UMJpSeq,
    EmpSeq,
    IsLast,
    UMPgSeq,
    UMJdSeq,
    UMJoSeq,
    EntRetTypeSeq,
    PuSeq,
    PtSeq,
    UMWsSeq,
  ])

    const onClickSearchObj = useCallback(async () => {
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
      const data = [
        {
          FrOrdDate: formatDateSearch(FrOrdDate),
          ToOrdDate: formatDateSearch(ToOrdDate),
          DeptSeq: DeptSeq,
          PosSeq: PosSeq,
          OrdSeq: ordSeq,
          UMJpSeq: UMJpSeq,
          EmpSeq: EmpSeq,
          IsLast: IsLast,
          UMPgSeq: UMPgSeq,
          UMJdSeq: UMJdSeq,
          UMJoSeq: UMJoSeq,
          EntRetTypeSeq: EntRetTypeSeq,
          PuSeq: PuSeq,
          PtSeq: PtSeq,
          UMWsSeq: UMWsSeq,
        },
      ]

      const response = await SearchAdmMultiOrdObj(data)
      const fetchedData = response.data || []

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
      controllers.current.onClickSearch = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    FrOrdDate,
    ToOrdDate,
    DeptSeq,
    PosSeq,
    ordSeq,
    UMJpSeq,
    EmpSeq,
    IsLast,
    UMPgSeq,
    UMJdSeq,
    UMJoSeq,
    EntRetTypeSeq,
    PuSeq,
    PtSeq,
    UMWsSeq,
  ])


  const onClickSave = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    if (controllers.current && controllers.current.onClickSave) {
      controllers.current.onClickSave.abort()
      controllers.current.onClickSave = null
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

    controllers.current.onClickSave = controller

    setIsAPISuccess(false)
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }

    const requiredColumns = ['EmpName', 'EmpSeq', 'EmpID']

    const columns = [
      'IdxNo',
      'IntSeq',
      'EmpName',
      'EmpSeq',
      'EmpID',
      'CurrOrdDate',
      'CurrOrdName',
      'OrdDate',
      'OrdName',
      'OrdSeq',
      'DeptName',
      'DeptSeq',
      'PosName',
      'PosSeq',
      'UMJpName',
      'UMJpSeq',
      'Ps',
      'UMPgName',
      'UMPgSeq',
      'UMJdName',
      'UMJdSeq',
      'UMJoName',
      'UMJoSeq',
      'JobName',
      'JobSeq',
      'PuName',
      'PuSeq',
      'PtName',
      'PtSeq',
      'UMWsName',
      'UMWsSeq',
      'IsBoss',
      'IsWkOrd',
      'WkDeptName',
      'WkDeptSeq',
      'Contents',
      'Remark',
      'IsLast',
      'PrevEmpSeq',
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

    const resulU = filterAndSelectColumns(gridData, columns, 'U').map(
      (row) => ({
        ...row,
        status: 'U',
      }),
    )

    const resulA = filterAndSelectColumns(gridData, columns, 'A').map(
      (row) => ({
        ...row,
        status: 'A',
      }),
    )

    const data = [...resulU, ...resulA]

    if (isSent) return
    setIsSent(true)

    try {
      const promises = []

      promises.push(AuHrAdmMultiOrd(data))

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
        if (result.success) {
          
          if (index === 0) {
            message.success('Thêm thành công!')
          } else {
            message.success('Cập nhật  thành công!')
          }

          setIsSent(false)
          setEditedRows([])
          resetTable()
        } else {
          setIsSent(false)
          setErrorData(result.data.errors)
          message.error('Có lỗi xảy ra khi lưu dữ liệu')
        }
      })
    } catch (error) {
      console.log('error', error)
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    } finally {
      onClickSearch()
    }
  }, [editedRows])

  const onClickDeleteSheet = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }


    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }

    const resulD = selected.map((row) => ({
      ...row,
      status: 'D',
    }))

    const validEntriesDeptHis = filterValidEntries()
    setCount(validEntriesDeptHis.length)
    const lastEntryDepHis = findLastEntry(validEntriesDeptHis)

    if (lastWordEntryRef.current?.Id !== lastEntryDepHis?.Id) {
      lastWordEntryRef.current = lastEntryDepHis
    }

    if (isSent) return
    setIsSent(true)

    try {
      const promises = []
      if (resulD.length > 0) {
        promises.push(DeleteAdmMultiOrd(resulD))
        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.success) {
            if (index === 0) {
              message.success('Xóa thành công!')
            }

            setIsSent(false)
            setEditedRows([])
            resetTable()
          } else {
            setIsSent(false)
            setErrorData(result.data.errors)
            message.error('Có lỗi xảy ra khi xóa dữ liệu')
          }
        })
      }
    } catch (error) {
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi xóa dữ liệu')
    } finally {
      onClickSearch()
    }
  }, [gridData, editedRows, selected])

  return (
    <>
      <Helmet>
        <title>ITM - {t('10040512')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('10040512')}
              </Title>
              <HrAdmOrdObjActions
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                onClickSearch={onClickSearch}
                onClickSave={onClickSave}
                onClickDeleteSheet={onClickDeleteSheet}
                onClickSearchObj={onClickSearchObj}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border bg-white"
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
                <HrAdmMultiOrdQuery
                  DeptData={DeptData}
                  PosData={PosData}
                  OrdData={OrdData}
                  UMJpNameData={UMJpNameData}
                  dataUser={dataUser}
                  UMPgNameData={UMPgNameData}
                  UMJdNameData={UMJdNameData}
                  UMJoNameData={UMJoNameData}
                  PuNameData={PuNameData}
                  PtNameData={PtNameData}
                  UMWsNameData={UMWsNameData}
                  EntRetTypeNameData={EntRetTypeNameData}
                  OrdName={OrdName}
                  setOrdName={setOrdName}
                  ordSeq={ordSeq}
                  setOrdSeq={setOrdSeq}
                  EmpName={EmpName}
                  setEmpName={setEmpName}
                  EmpSeq={EmpSeq}
                  setEmpSeq={setEmpSeq}
                  ToOrdDate={ToOrdDate}
                  setToOrdDate={setToOrdDate}
                  DeptName={DeptName}
                  setDeptName={setDeptName}
                  DeptSeq={DeptSeq}
                  setDeptSeq={setDeptSeq}
                  PosName={PosName}
                  setPosName={setPosName}
                  PosSeq={PosSeq}
                  setPosSeq={setPosSeq}
                  UMWsName={UMWsName}
                  setUMWsName={setUMWsName}
                  UMWsSeq={UMWsSeq}
                  setUMWsSeq={setUMWsSeq}
                  PtName={PtName}
                  setPtName={setPtName}
                  PtSeq={PtSeq}
                  setPtSeq={setPtSeq}
                  PuName={PuName}
                  setPuName={setPuName}
                  setPuSeq={setPuSeq}
                  UMPgName={UMPgName}
                  setUMPgName={setUMPgName}
                  setUMPgSeq={setUMPgSeq}
                  UMJpName={UMJpName}
                  setUMJpName={setUMJpName}
                  setUMJpSeq={setUMJpSeq}
                  EntRetTypeName={EntRetTypeName}
                  setEntRetTypeName={setEntRetTypeName}
                  setEntRetTypeSeq={setEntRetTypeSeq}
                  UMJoName={UMJoName}
                  setUMJoName={setUMJoName}
                  UMJoSeq={UMJoSeq}
                  setUMJoSeq={setUMJoSeq}
                  UMJdName={UMJdName}
                  setUMJdName={setUMJdName}
                  UMJdSeq={UMJdSeq}
                  setUMJdSeq={setUMJdSeq}
                  FrOrdDate={FrOrdDate}
                  setFrOrdDate={setFrOrdDate}
                  EmpID={EmpID}
                  setEmpID={setEmpID}
                  IsLast={IsLast}
                  setIsLast={setIsLast}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableHrAdmMultiOrd
              dataUser={dataUser}
              setDataUser={setDataUser}

              OrdData = {OrdData}
              setOrdData = {setOrdData}
              DeptData = {DeptData}
              setDeptData = {setDeptData}
              PosData = {PosData}
              setPosData = {setPosData}
              UMJpNameData = {UMJpNameData}
              setUMJpNameData = {setUMJpNameData}
              UMPgNameData={UMPgNameData}
              setUMPgNameData={setUMPgNameData}
              UMJdNameData={UMJdNameData}
              setUMJdNameData={setUMJdNameData}
              UMJoNameData={UMJoNameData}
              setUMJoNameData={setUMJoNameData}
              PuNameData={PuNameData}
              setPuNameData={setPuNameData}
              PtNameData={PtNameData}
              setPtNameData={setPtNameData}
              UMWsNameData={UMWsNameData}
              setUMWsNameData={setUMWsNameData}
              EntRetTypeNameData={EntRetTypeNameData}
              setEntRetTypeNameData={setEntRetTypeNameData}
              JobNameData={JobNameData}
              setJobNameData={setJobNameData}

              setSelection={setSelection}
              showSearch={showSearch2}
              setShowSearch={setShowSearch2}
              selection={selection}
              canEdit={canEdit}
              cols={cols}
              setCols={setCols}
              setGridData={setGridData}
              gridData={gridData}
              defaultCols={defaultCols}
              setNumRows={setNumRows}
              numRows={numRows}
              setHelpData10={setHelpData10}
              helpData10={helpData10}
              editedRows={editedRows}
              setEditedRows={setEditedRows}
              onCellClicked={onCellClicked}
              handleRowAppend={handleRowAppend}
              loadingBarRef={loadingBarRef}
              isAPISuccess={isAPISuccess}
              setIsAPISuccess={setIsAPISuccess}
            />
          </div>
        </div>
      </div>
      <ErrorListModal
        isModalVisible={modal2Open}
        setIsModalVisible={setModal2Open}
        dataError={errorData}
      />
    </>
  )
}
