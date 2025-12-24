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

import ErrorListModal from '../default/errorListModal'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'

import EmpOrgDeptActions from '../../components/actions/hr-da-dept/empOrgDeptActions'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import InfoMultiEmpListQuery from '../../components/query/hrInfo/infoMultiEmpListQuery'
import TableInfoMultiEmpList from '../../components/table/hr-info/tableInfoMultiEmpList'
import { SearchInfoMultiEmpList } from '../../../features/mgn-hr/info-emp/searchInfoMultiEmpList'
export default function InfoMultiEmpList({
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
        title: t('3161'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('738'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('10546'),
        id: 'MinorName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('3083'),
        id: 'MinorValue',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
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
          disabled: false,
        },
      },
      {
        title: t('1584'),
        id: 'EmpName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },

      {
        title: t('5'),
        id: 'DeptName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('3189'),
        id: 'EmpEngName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('3264'),
        id: 'EmpChnName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1585'),
        id: 'SMSexName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1344'),
        id: 'ResidId',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1344'),
        id: 'ResidIdM',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('215'),
        id: 'EntDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1176'),
        id: 'RetDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('18498'),
        id: 'RetEmpDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('17575'),
        id: 'MidRetDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('19152'),
        id: 'JpOrdDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('19149'),
        id: 'PgOrdDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('19133'),
        id: 'DeptOrdDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('19159'),
        id: 'PsOrdDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('622'),
        id: 'PuName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('554'),
        id: 'WkDeptName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('635'),
        id: 'UMPgName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
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
          disabled: false,
        },
      },
      {
        title: t('642'),
        id: 'UMJpName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1296'),
        id: 'UMJdName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1295'),
        id: 'UMJoName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('JobName'),
        id: 'JobName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('583'),
        id: 'PtName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('17027'),
        id: 'EntRetName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('386'),
        id: 'BirthDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('11832'),
        id: 'MarriageDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('488'),
        id: 'IsMarriage',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('12632'),
        id: 'ForeignerType',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1797'),
        id: 'AddrZip',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1345'),
        id: 'Addr',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1396'),
        id: 'Phone',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('19356'),
        id: 'Cellphone',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('9462'),
        id: 'UMSchCareerName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('14253'),
        id: 'PAddr1',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('133'),
        id: 'GrpEntDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('12329'),
        id: 'WkDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('86'),
        id: 'YyOccurDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('16432'),
        id: 'Email',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('373'),
        id: 'PosName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('4315'),
        id: 'WkPlace',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1055'),
        id: 'Extension',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
    ],
    [t],
  )

  const [showSearch2, setShowSearch2] = useState(false)
  const lastWordEntryRef = useRef(null)

  const [loading, setLoading] = useState(false)

  const [gridData, setGridData] = useState([])

  const [numRows, setNumRows] = useState(0)

  const [addedRowsDeptHis, setAddedRowsDeptHis] = useState([])
  const [numRowsToAddDeptHis, setNumRowsToAddDeptHis] = useState([])

  const [helpData10, setHelpData10] = useState([])
  const [editedRowsDeptHis, setEditedRowsDeptHis] = useState([])

  const [DeptLevelData, setDeptLevelNameData] = useState([])
  const [JpNameData, setJpNameData] = useState([])
  const [PgNameData, setPgNameData] = useState([])
  const [PuNameData, setPuNameData] = useState([])
  const [UMSchCareerData, setUMSchCareerData] = useState([])
  const [DeptNameData, setDeptNameData] = useState([])

  const [selectDeptLevel, setSelectDeptLevel] = useState([])
  const [selectDeptName, setSelectDeptName] = useState([])
  const [selectJpName, setSelectJpName] = useState([])
  const [selectPuName, setSelectPuName] = useState([])
  const [selectPgName, setSelectPgName] = useState([])
  const [selectUMSchCareer, setSelectUMSchCareer] = useState([])

  const [DeptName, setDeptName] = useState('')
  const [IsLowDept, setIsLowDept] = useState(false)
  const [DeptLevelName, setDeptLevelName] = useState('')
  const [DeptLevelSeq, setDeptLevelSeq] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')
  const [IsRetire, setIsRetire] = useState(false)

  const [EmpNameFr, setEmpNameFr] = useState('')
  const [EmpNameTo, setEmpNameTo] = useState('')

  const [EntDateFr, setEntDateFr] = useState(null)
  const [EntDateTo, setEntDateTo] = useState(null)

  const [RetDateFr, setRetDateFr] = useState(null)
  const [RetDateTo, setRetDateTo] = useState(null)

  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)

  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'INFO_MULTI_EMP_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )

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
        DeptLevelData,
        PgNameData,
        JpNameData,
        PuNameData,
        UMSchCareerData,
        DeptData,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 19999, 1, '%', '3054', '', '', '', signal),
        GetCodeHelpVer2(19999, '', '3052', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(
          19999,
          '',
          '3051',
          '',
          '',
          '',
          '1',
          '',
          1,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpCombo('', 6, 20001, 1, '%', '', '', '', '', signal),
        GetCodeHelpVer2(
          19999,
          '',
          '3063',
          '',
          '',
          '',
          '1',
          '',
          1,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpVer2(
          10010,
          '',
          '',
          '',
          '',
          '',
          '1',
          '',
          1,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
      ])
      setDeptLevelNameData(DeptLevelData?.data || [])
      setPgNameData(PgNameData?.data || [])
      setJpNameData(JpNameData?.data || [])
      setPuNameData(PuNameData?.data || [])
      setUMSchCareerData(UMSchCareerData?.data || [])
      setDeptNameData(DeptData?.data || [])
    } catch {
      setDeptLevelNameData([])
      setPgNameData([])
      setJpNameData([])
      setPgNameData([])
      setPuNameData([])
      setUMSchCareerData([])
      setDeptNameData([])
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

  const fetchSearchData = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    setLoading(true)
    if (controllers.current.fetchSearchData) {
      controllers.current.fetchSearchData.abort()
      controllers.current.fetchSearchData = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal
    controllers.current.fetchSearchData = controller
    setIsAPISuccess(false)

    try {
      const data = [
        {
          EmpNameFr: EmpNameFr,
          EmpNameTo: EmpNameTo,
          IsRetire: IsRetire,

          EntDateFr: formatDateSearch(EntDateFr),
          EntDateTo: formatDateSearch(EntDateTo),
          RetDateFr: formatDateSearch(RetDateFr),
          RetDateTo: formatDateSearch(RetDateTo),
          DeptLevel: DeptLevelSeq,

          DeptSeq: DeptSeq,
          MultiDeptSeq: selectDeptName.map((item) => item.BeDeptSeq),
          IsLowDept: IsLowDept,
          Ps: '',
          JpSeq: '',
          MultiJpSeq: selectJpName,
          SMMoreLess: '',
          PgSeq: '',
          MultiPgSeq: selectPgName,
          PuSeq: '',
          MultiPuSeq: selectPuName,
          UMSchCareerSeq: '',
          MultiUMSchCareerSeq: selectUMSchCareer,
        },
      ]
      const dataResult = await SearchInfoMultiEmpList(data)

      setGridData(dataResult?.data || [])
      setNumRows(dataResult?.data?.length)
    } catch {
      setGridData([])
    } finally {
      setLoading(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchSearchData = null
    }
  }, [
    gridData,
    EmpNameFr,
    EmpNameTo,
    IsRetire,

    isAPISuccess,
    EntDateFr,
    EntDateTo,
    RetDateFr,
    RetDateTo,
    DeptLevelName,
    DeptLevelSeq,

    DeptSeq,
    selectDeptName,
    IsLowDept,
    selectJpName,
    selectPgName,
    selectPuName,
    selectUMSchCareer,
    IsRetire,
    IsLowDept,
  ])

  const fieldsToTrack = ['IdxNo']

  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const getSelectedRowsDeptNew = () => {
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

  const handleRowAppendDeptHis = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(
        cols,
        setGridData,
        setNumRows,
        setAddedRowsDeptHis,
        numRowsToAdd,
      )
    },
    [cols, setGridData, setNumRows, setAddedRowsDeptHis, numRowsToAddDeptHis],
  )

  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [deptNewSelected, setDeptNewSelected] = useState([])

  const onCellClickedDepNew = useCallback(
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
            setDeptNewSelected(getSelectedRowsDeptNew())
          } else {
            newSelected = selection.rows.add(rowIndex)
            setDeptNewSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRowsDeptNew, deptNewSelected],
  )

  const onClickSearch = useCallback(async () => {
    fetchSearchData()
  }, [
    EmpNameFr,
    EmpNameTo,
    IsRetire,

    EntDateFr,
    EntDateTo,
    RetDateFr,
    RetDateTo,
    DeptLevelName,
    DeptLevelSeq,

    DeptSeq,
    selectDeptName,
    IsLowDept,
    selectJpName,
    selectPgName,
    selectPuName,
    selectUMSchCareer,
    IsRetire,
    IsLowDept,
    isAPISuccess,
  ])


  return (
    <>
      <Helmet>
        <title>ITM - {t('10040621')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('10040621')}
              </Title>
              <EmpOrgDeptActions
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                onClickSearch={onClickSearch}
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
                <InfoMultiEmpListQuery
                  JpNameData={JpNameData}
                  DeptLevelData={DeptLevelData}
                  PgNameData={PgNameData}
                  PuNameData={PuNameData}
                  UMSchCareerData={UMSchCareerData}
                  dataDept={DeptNameData}
                  DeptSeq={DeptSeq}
                  setDeptSeq={setDeptSeq}
                  DeptName={DeptName}
                  setDeptName={setDeptName}
                  EmpNameFr={EmpNameFr}
                  setEmpNameFr={setEmpNameFr}
                  EmpNameTo={EmpNameTo}
                  setEmpNameTo={setEmpNameTo}
                  EntDateFr={EntDateFr}
                  setEntDateFr={setEntDateFr}
                  EntDateTo={EntDateTo}
                  setEntDateTo={setEntDateTo}
                  RetDateTo={RetDateTo}
                  setRetDateTo={setRetDateTo}
                  RetDateFr={RetDateFr}
                  setRetDateFr={setRetDateFr}
                  DeptLevelName={DeptLevelName}
                  setDeptLevelName={setDeptLevelName}
                  DeptLevelSeq={DeptLevelSeq}
                  setDeptLevelSeq={setDeptLevelSeq}
                  IsRetire={IsRetire}
                  setIsRetire={setIsRetire}
                  IsLowDept={IsLowDept}
                  setIsLowDept={setIsLowDept}
                  selectJpName={selectJpName}
                  setSelectJpName={setSelectJpName}
                  setSelectDeptName={setSelectDeptName}
                  selectDeptName={selectDeptName}
                  selectDeptLevel={selectDeptLevel}
                  setSelectDeptLevel={setSelectDeptLevel}
                  selectPgName={selectPgName}
                  setSelectPgName={setSelectPgName}
                  selectPuName={selectPuName}
                  setSelectPuName={setSelectPuName}
                  selectUMSchCareer={selectUMSchCareer}
                  setSelectUMSchCareer={setSelectUMSchCareer}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableInfoMultiEmpList
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
              editedRowsDeptHis={editedRowsDeptHis}
              setEditedRows={setEditedRowsDeptHis}
              handleRowAppend={handleRowAppendDeptHis}
              onCellClickedDepNew={onCellClickedDepNew}
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
