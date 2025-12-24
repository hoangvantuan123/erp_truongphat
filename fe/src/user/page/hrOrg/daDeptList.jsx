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
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { Splitter, SplitterPanel } from 'primereact/splitter'

import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'

import { validateCheckColumns } from '../../../utils/validateColumns'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { Package, MonitorSmartphone } from 'lucide-react'
import ErrorListModal from '../default/errorListModal'
import HrDaDeptActions from '../../components/actions/hr-da-dept/hrDaDeptActions'
import HrDaDeptQuery from '../../components/query/hrDaDept/hrDaDeptQuery'
import TableDaDept from '../../components/table/hr-da-dept/tableDaDept'
import DaDeptQuery from '../../components/query/hrDaDept/daDeptQuery'
import TableDeptHisRegis from '../../components/table/hr-da-dept/tableDeptHisRegist'
import TableActiveCenterHisRegist from '../../components/table/hr-da-dept/tableActiveCenterHisRegist'
import { SearchDaDeptPage } from '../../../features/mgn-hr/da-dept/searchDaDeptPage'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { AuDaDept } from '../../../features/mgn-hr/da-dept/AuDaDept'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { GetDeptHis } from '../../../features/mgn-hr/da-dept/getDeptHis'
import { GetDeptCCtr } from '../../../features/mgn-hr/da-dept/getDeptCCtr'
import { DeleteDeptHis } from '../../../features/mgn-hr/da-dept/deleteDeptHis'
import { DeleteDeptOrg } from '../../../features/mgn-hr/da-dept/deleteDeptOrg'
export default function DaDeptList({
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
        title: t('426'),
        id: 'Seq',
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
        title: t('712'),
        id: 'DeptName',
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
        title: t('738'),
        id: 'DeptSeq',
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
        title: t('3138'),
        id: 'AbrDeptName',
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
        title: t('1744'),
        id: 'EngDeptName',
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
        title: t('1743'),
        id: 'AbrEngDeptName',
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
        title: t('191'),
        id: 'BegDate',
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
        title: t('232'),
        id: 'EndDate',
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
        title: t('3267'),
        id: 'CCtrName',
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
        title: t('3268'),
        id: 'CCtrSeq',
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
        title: t('3134'),
        id: 'SMDeptTypeName',
        kind: 'Custom',
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
        title: t('3135'),
        id: 'SMDeptType',
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
        title: t('3136'),
        id: 'SMDeptClassName',
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
        title: t('3137'),
        id: 'SMDeptClass',
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
        title: t('11323'),
        id: 'DeptPhone',
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
        title: t('11324'),
        id: 'DeptFax',
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
        title: t('3154'),
        id: 'TaxName',
        kind: 'Custom',
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
        title: t('1464'),
        id: 'TaxUnit',
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
        title: t('640'),
        id: 'TaxNo',
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
        title: t('2044'),
        id: 'AccUnitName',
        kind: 'Custom',
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
        title: t('3270'),
        id: 'AccUnit',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3150'),
        id: 'BizUnitName',
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
        title: t('3151'),
        id: 'BizUnit',
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
        title: t('2026'),
        id: 'SlipUnitName',
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
        title: t('3221'),
        id: 'SlipUnit',
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
        title: t('787'),
        id: 'FactUnitName',
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
        title: t('3164'),
        id: 'FactUnit',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('652'),
        id: 'UMCostTypeName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('3149'),
        id: 'UMCostType',
        kind: 'Text',
        readonly: false,
        width: 200,
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
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('327'),
        id: 'DispSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('1471'),
        id: 'IsUse',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )
  const defaultCols2 = useMemo(
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
        title: t('191'),
        id: 'BegDate',
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
        title: t('232'),
        id: 'EndDate',
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
        title: t('712'),
        id: 'DeptName',
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
        title: t('3138'),
        id: 'AbrDeptName',
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
        title: t('1744'),
        id: 'EngDeptName',
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
        title: t('1743'),
        id: 'AbrEngDeptName',
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
        title: t('1236'),
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
    ],
    [t],
  )
  const defaultcolsOrgDept = useMemo(
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
        title: t('1662'),
        id: 'BegYm',
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
        title: t('232'),
        id: 'EndYm',
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
        title: t('3267'),
        id: 'CCtrName',
        kind: 'Custom',
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
        title: t('3268'),
        id: 'CCtrSeq',
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
        title: t('1236'),
        id: 'IsLast',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )

  const [isSent, setIsSent] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSearch2, setShowSearch2] = useState(false)
  const [showSearch3, setShowSearch3] = useState(false)
  const [count, setCount] = useState(0)
  const lastWordEntryRef = useRef(null)

  const [loading, setLoading] = useState(false)

  const [gridData, setGridData] = useState([])
  const [gridDataDeptHis, setGridDataDeptHis] = useState([])
  const [gridDataOrgDept, setGridDataOrgDept] = useState([])

  const [numRowsLogs, setNumRowsLogs] = useState(0)
  const [numRows, setNumRows] = useState(0)
  const [numRowsDeptHis, setNumRowsDeptHis] = useState(0)
  const [numRowsOrgDept, setNumRowsOrgDept] = useState(0)

  const [addedRows, setAddedRows] = useState([])
  const [addedRowsDeptHis, setAddedRowsDeptHis] = useState([])
  const [addedRowsOrgDept, setAddedRowsOrgDept] = useState([])
  const [numRowsToAddDeptHis, setNumRowsToAddDeptHis] = useState([])
  const [numRowsToAddOrgDept, setNumRowsToAddOrgDept] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)

  const [SMDeptTypeData, setSMDeptTypeDataData] = useState([])
  const [SMDeptType, setSMDeptType] = useState('')

  const [IsUseData, setIsUseData] = useState([])
  const [IsUse, setIsUse] = useState([])

  const [QBegDate, setQBegDate] = useState(null)
  const [QEndDate, setQEndDate] = useState(null)

  const [DeptName, setDeptName] = useState('')
  const [DeptNameQ, setDeptNameQ] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')

  const [TaxNameData, setTaxNameData] = useState([])
  const [AccUnitNameData, setAccUnitNameData] = useState([])
  const [BizUnitNameData, setBizUnitNameData] = useState([])
  const [SlipUnitNameData, setSlipUnitNameData] = useState([])
  const [FactUnitNameData, setFactUnitNameData] = useState([])
  const [UMCostTypeData, setUMCostTypeData] = useState([])
  const [CCtrData, setCCtrData] = useState([])

  const [cacheDataCCtr, setCacheDataCCtr] = useState([])

  const [helpData08, setHelpData08] = useState([])
  const [helpData09, setHelpData09] = useState([])
  const [helpData10, setHelpData10] = useState([])
  const [helpData12, setHelpData12] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [editedRowsDeptHis, setEditedRowsDeptHis] = useState([])
  const [editedRowsOrgDept, setEditedRowsOrgDept] = useState([])

  const [FactUnit, setFactUnit] = useState('')

  const [current, setCurrent] = useState('1')
  const secretKey = 'KEY_PATH'
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [BizUnit, setBizUnit] = useState(null)
  const [checkPageA, setCheckPageA] = useState(false)
  const formatDate = (date) => date.format('YYYYMMDD')
  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'DA_DEPT_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [colsDeptHis, setColsDeptHis] = useState(() =>
    loadFromLocalStorageSheet(
      'DA_DEPT_HIS_LIST',
      defaultCols2.filter((col) => col.visible),
    ),
  )
  const [selectionDeptHis, setSelectionDeptHis] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [colsOrgDept, setColsOrgDept] = useState(() =>
    loadFromLocalStorageSheet(
      'ORG_DEPT_CENTER',
      defaultcolsOrgDept.filter((col) => col.visible),
    ),
  )
  const [selectionDeptOrg, setSelectionDeptOrg] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

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
        SMDeptTypeData,
        IsUseData,
        TaxNameData,
        AccUnitNameData,
        BizUnitData,
        SlipUnitData,
        FactUnitData,
        UMCostTypeData,
        CCtrData,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3051', '1001', '1', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '1050', '', '', '', signal),
        GetCodeHelpCombo('', 6, 10004, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 10002, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 40001, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 60001, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '4001', '', '', '', signal),
        GetCodeHelpVer2(
          50001,
          '',
          '',
          '',
          '',
          '',
          '1',
          '',
          50,
          "IsNotUse <> ''1''",
          0,
          0,
          0,
        ),
      ])

      setSMDeptTypeDataData(SMDeptTypeData?.data || [])
      setIsUseData(IsUseData?.data || [])
      setTaxNameData(TaxNameData?.data || [])
      setAccUnitNameData(AccUnitNameData?.data || [])
      setBizUnitNameData(BizUnitData?.data || [])
      setSlipUnitNameData(SlipUnitData?.data || [])
      setFactUnitNameData(FactUnitData?.data || [])
      setUMCostTypeData(UMCostTypeData?.data || [])
      setCCtrData(CCtrData?.data || [])
    } catch {
      setSMDeptTypeDataData([])
      setIsUseData([])
      setTaxNameData([])
      setAccUnitNameData([])
      setBizUnitNameData([])
      setSlipUnitNameData([])
      setFactUnitNameData([])
      setUMCostTypeData([])
      setCCtrData([])
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

  const getSelectedRowsData = () => {
    const selectedRows = selection.rows.items

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
        (row) => row !== undefined,
      ),
    )
  }

  const getSelectedRowsDeptHis = () => {
    const selectedRows = selectionDeptHis.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridDataDeptHis[i]) {
          gridDataDeptHis[i]['IdxNo'] = i + 1
          rows.push(gridDataDeptHis[i])
        }
      }
    })

    return rows
  }

  const getSelectedRowsDeptOrg = () => {
    const selectedRows = selectionDeptOrg.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridDataOrgDept[i]) {
          gridDataOrgDept[i]['IdxNo'] = i + 1
          rows.push(gridDataOrgDept[i])
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

  const handleRowAppendDeptHis = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(
        colsDeptHis,
        setGridDataDeptHis,
        setNumRowsDeptHis,
        setAddedRowsDeptHis,
        numRowsToAdd,
      )
    },
    [
      colsDeptHis,
      setGridDataDeptHis,
      setNumRowsDeptHis,
      setAddedRowsDeptHis,
      numRowsToAddDeptHis,
    ],
  )

  const handleRowAppendOrgDept = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(
        colsOrgDept,
        setGridDataOrgDept,
        setNumRowsOrgDept,
        setAddedRowsOrgDept,
        numRowsToAdd,
      )
    },
    [
      colsOrgDept,
      setGridDataOrgDept,
      setNumRowsOrgDept,
      setAddedRowsOrgDept,
      numRowsToAddOrgDept,
    ],
  )

  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [dadeptSelected, setDadeptSelected] = useState([])
  const [deptHisSelected, setDeptHisSelected] = useState([])
  const [deptOrgSelected, setDeptOrgSelected] = useState([])

  const onCellClickedDaDept = useCallback(
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
          const rowData = gridData[rowIndex]
          const data = [
            {
              DeptSeq: rowData.DeptSeq,
              DeptName: rowData.DeptName,
              CCtrSeq: rowData.CCtrSeq,
            },
          ]
          setDeptNameQ(rowData.DeptName)
          setDeptSeq(rowData.DeptSeq || '')

          const isSelected = selection.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selection.rows.remove(rowIndex)
            setDadeptSelected(getSelectedRowsData())
            fetchDataDeptHis(data)
          } else {
            newSelected = selection.rows.add(rowIndex)
            setDadeptSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRowsData, dadeptSelected],
  )

  const onCellClickedDeptHis = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataDeptHis.length) {

          const isSelected = selectionDeptHis.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selectionDeptHis.rows.remove(rowIndex)
            setDeptHisSelected(getSelectedRowsDeptHis())
          } else {
            newSelected = selectionDeptHis.rows.add(rowIndex)
            setDeptHisSelected([])
          }
          
        }
      }
    },
    [gridDataDeptHis, getSelectedRowsDeptHis, deptHisSelected],
  )

  const onCellClickedDeptOrg = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataOrgDept.length) {
          const isSelected = selectionDeptOrg.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selectionDeptOrg.rows.remove(rowIndex)
            setDeptOrgSelected(getSelectedRowsDeptOrg())
          } else {
            newSelected = selectionDeptOrg.rows.add(rowIndex)
            setDeptOrgSelected([])
          }
          
        }
      }
    },
    [gridDataOrgDept, getSelectedRowsDeptOrg, deptOrgSelected],
  )

  const fetchDataDeptHis = useCallback(async (data) => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    if (controllers.current && controllers.current.fetchDataDeptHis) {
      controllers.current.fetchDataDeptHis.abort()
      controllers.current.fetchDataDeptHis = null
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

    controllers.current.fetchDataDeptHis = controller

    setIsAPISuccess(false)

    try {
      const dataDeptHis = [
        {
          DeptSeq: data[0].DeptSeq,
          DeptName: data[0].DeptName,
        },
      ]

      const dataDeptCCtr = [
        {
          DeptSeq: data[0].DeptSeq,
          CCtrSeq: data[0].CCtrSeq,
        },
      ]

      const response = await GetDeptHis(dataDeptHis)
      const fetchedData = response.data || []

      setGridDataDeptHis(fetchedData)
      setNumRowsDeptHis(fetchedData.length)

      const responseDeptCctr = await GetDeptCCtr(dataDeptCCtr)
      const fetchedDataDeptCCtr = responseDeptCctr.data || []

      setGridDataOrgDept(fetchedDataDeptCCtr)
      setNumRowsOrgDept(fetchedDataDeptCCtr.length)
    } catch (error) {
      const emptyData = generateEmptyData(0, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridData(updatedEmptyData)
      setNumRows(emptyData.length)
    } finally {
      setIsAPISuccess(true)
      controllers.current.fetchDataDeptHis = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [])

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
          QBegDate: formatDateSearch(QBegDate),
          QEndDate: formatDateSearch(QEndDate),
          SMDeptType: SMDeptType,
          IsUse: IsUse,
          DeptName: DeptName,
        },
      ]

      const response = await SearchDaDeptPage(data)
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
  }, [QBegDate, QEndDate, SMDeptType, IsUse, DeptName])

  const onClickSave = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
    const requiredColumns = [
      'DeptName',
      'BegDate',
      'SMDeptType',
      'TaxUnit',
      'AccUnit',
      'BizUnit',
      'SlipUnit',
    ]

    const columnsDaDept = [
      'IdxNo',
      'Seq',
      'DeptName',
      'DeptSeq',
      'AbrDeptName',
      'EngDeptName',
      'AbrEngDeptName',
      'BegDate',
      'EndDate',
      'CCtrName',
      'CCtrSeq',
      'SMDeptTypeName',
      'SMDeptType',
      'SMDeptClassName',
      'SMDeptClass',
      'DeptPhone',
      'DeptFax',
      'TaxName',
      'TaxUnit',
      'TaxNo',
      'AccUnitName',
      'AccUnit',
      'BizUnitName',
      'BizUnit',
      'SlipUnitName',
      'SlipUnit',
      'FactUnitName',
      'FactUnit',
      'UMCostTypeName',
      'UMCostType',
      'Remark',
      'DispSeq',
      'IsUse',
      'IDX_NO',
    ]

    const requiredColumnsDeptHis = ['BegDate', 'DeptName']

    const columnsDeptHis = [
      'IdxNo',
      'BegDate',
      'EndDate',
      'DeptName',
      'AbrDeptName',
      'EngDeptName',
      'AbrEngDeptName',
      'Remark',
      'IsLast',
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

    const resulU = filterAndSelectColumns(gridData, columnsDaDept, 'U').map(
      (row) => ({
        ...row,
        status: 'U',
      }),
    )

    const resulA = filterAndSelectColumns(gridData, columnsDaDept, 'A').map(
      (row) => ({
        ...row,
        status: 'A',
      }),
    )

    const dataDaDept = [...resulU, ...resulA]
    const validationMessage = validateCheckColumns(
      [...resulA],
      columnsDaDept,
      requiredColumns,
    )
    if (validationMessage !== true) {
      const columnLabels = {
        DeptName: t('712'),
        BegDate: t('191'),
        SMDeptTypeName: t('3134'),
        TaxName: t('2044'),
        AccUnitName: t('3154'),
        BizUnitName: t('3150'),
        SlipUnitName: t('2026'),

      }

      const missingKeys = Array.isArray(validationMessage)
        ? validationMessage
        : []

      const friendlyMessage = missingKeys.length
        ? `Thiếu các cột: ${missingKeys.map((k) => columnLabels[k] || k).join(', ')}`
        : validationMessage

      message.warning(friendlyMessage)
      loadingBarRef.current?.complete()
      return true
    }

    const validEntriesDeptHis = filterValidEntries()
    setCount(validEntriesDeptHis.length)
    const lastEntryDepHis = findLastEntry(validEntriesDeptHis)

    if (lastWordEntryRef.current?.Id !== lastEntryDepHis?.Id) {
      lastWordEntryRef.current = lastEntryDepHis
    }

    const missingIdsDeptHis = findMissingIds(lastEntryDepHis)
    if (missingIdsDeptHis.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }

    const resulUDeptHis = filterAndSelectColumns(
      gridDataDeptHis,
      columnsDeptHis,
      'U',
    ).map((row) => ({
      ...row,
      DeptSeq: row.DeptSeq || DeptSeq,
      status: 'U',
    }))

    const resulADeptHis = filterAndSelectColumns(
      gridDataDeptHis,
      columnsDeptHis,
      'A',
    ).map((row) => ({
      ...row,
      DeptSeq: row.DeptSeq || DeptSeq,
      status: 'A',
    }))

    const dataDeptHis = [...resulUDeptHis, ...resulADeptHis]

    const validationMessageDeptHis = validateCheckColumns(
      [...resulUDeptHis, ...resulADeptHis],
      [...columnsDeptHis],
      requiredColumnsDeptHis,
    )

    if (validationMessageDeptHis !== true) {
      message.warning(validationMessageDeptHis)
      return
    }

    const requiredColumnsOrgCCtr = ['BegYm', 'CCtrName']

    const columnsOrgCCtr = [
      'IdxNo',
      'BegYm',
      'EndYm',
      'CCtrName',
      'CCtrSeq',
      'Remark',
      'IsLast',
      'Remark',
      'IsLast',
      'IDX_NO',
    ]

    const validEntriesOrgCCtr = filterValidEntries()
    setCount(validEntriesOrgCCtr.length)
    const lastEntryOrgCCtr = findLastEntry(validEntriesOrgCCtr)

    if (lastWordEntryRef.current?.Id !== lastEntryOrgCCtr?.Id) {
      lastWordEntryRef.current = lastEntryOrgCCtr
    }

    const missingIdsOrgCCtr = findMissingIds(lastEntryOrgCCtr)
    if (missingIdsOrgCCtr.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }

    const resulUOrgCCtr = filterAndSelectColumns(
      gridDataOrgDept,
      columnsOrgCCtr,
      'U',
    ).map((row) => ({
      ...row,
      DeptSeq: row.DeptSeq || DeptSeq,
      status: 'U',
    }))
    const resulAOrgCCtr = filterAndSelectColumns(
      gridDataOrgDept,
      columnsOrgCCtr,
      'A',
    ).map((row) => ({
      ...row,
      DeptSeq: row.DeptSeq || DeptSeq,
      status: 'A',
    }))

    const dataOrgCCtr = [...resulUOrgCCtr, ...resulAOrgCCtr]

    const validationMessageOrgCCtr = validateCheckColumns(
      [...resulUOrgCCtr, ...resulAOrgCCtr],
      [...columnsOrgCCtr],
      requiredColumnsOrgCCtr,
    )

    if (validationMessageOrgCCtr !== true) {
      message.warning(validationMessageOrgCCtr)
      return
    }

    if (isSent) return
    setIsSent(true)

    try {
      const promises = []

      promises.push(AuDaDept(dataDaDept, dataDeptHis, dataOrgCCtr))

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
          const newData = result.data.dataSaveDaDept
          if (index === 0) {
            message.success('Thêm thành công!')
          } else {
            message.success('Cập nhật  thành công!')
          }

          setIsSent(false)
          setEditedRows([])
          if(newData.length > 0) {
            updateGridData(newData)
          }
          resetTable()
        } else {
          setIsSent(false)
          setErrorData(result.data.errors)
          message.error('Có lỗi xảy ra khi lưu dữ liệu')
        }
      })
    } catch (error) {
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    } finally {
      onClickSearch()
      setGridDataDeptHis([])
      setNumRowsDeptHis(0)

      setGridDataOrgDept([])
      setNumRowsOrgDept(0)
    }
  }, [editedRows, editedRowsDeptHis, editedRowsOrgDept])

  const onClickDeleteSheet = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
    const requiredColumns = [
      'DeptName',
      'BegDate',
      'SMDeptType',
      'TaxUnit',
      'AccUnit',
      'BizUnit',
      'SlipUnit',
    ]

    const columnsDaDept = [
      'IdxNo',
      'Seq',
      'DeptName',
      'DeptSeq',
      'AbrDeptName',
      'EngDeptName',
      'AbrEngDeptName',
      'BegDate',
      'EndDate',
      'CCtrName',
      'CCtrSeq',
      'SMDeptTypeName',
      'SMDeptType',
      'SMDeptClassName',
      'SMDeptClass',
      'DeptPhone',
      'DeptFax',
      'TaxName',
      'TaxUnit',
      'TaxNo',
      'AccUnitName',
      'AccUnit',
      'BizUnitName',
      'BizUnit',
      'SlipUnitName',
      'SlipUnit',
      'FactUnitName',
      'FactUnit',
      'UMCostTypeName',
      'UMCostType',
      'Remark',
      'DispSeq',
      'IsUse',
      'IDX_NO',
    ]

    const requiredColumnsDeptHis = ['BegDate', 'DeptName']

    const columnsDeptHis = [
      'IdxNo',
      'BegDate',
      'EndDate',
      'DeptName',
      'AbrDeptName',
      'EngDeptName',
      'AbrEngDeptName',
      'Remark',
      'IsLast',
      'IDX_NO',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }

    const resulD = dadeptSelected.map((row) => ({
      ...row,
      status: 'D',
    }))

    const dataDaDept = [...resulD]
    const validationMessage = validateCheckColumns(
      [...resulD],
      [...columnsDaDept],
      requiredColumns,
    )

    if (validationMessage !== true) {
      message.warning(validationMessage)
      return
    }

    const validEntriesDeptHis = filterValidEntries()
    setCount(validEntriesDeptHis.length)
    const lastEntryDepHis = findLastEntry(validEntriesDeptHis)

    if (lastWordEntryRef.current?.Id !== lastEntryDepHis?.Id) {
      lastWordEntryRef.current = lastEntryDepHis
    }

    const resulDDeptHis = gridDataDeptHis.map((row) => ({
      ...row,
      DeptSeq: row.DeptSeq || DeptSeq,
      status: 'D',
    }))

    const dataDeptHis = [...resulDDeptHis]

    const validationMessageDeptHis = validateCheckColumns(
      [...resulDDeptHis],
      [...columnsDeptHis],
      requiredColumnsDeptHis,
    )

    if (validationMessageDeptHis !== true) {
      message.warning(validationMessageDeptHis)
      return
    }

    if (isSent) return
    setIsSent(true)

    try {
      const promises = []
      if (dataDaDept.length > 0 && dataDeptHis.length > 0) {
        promises.push(AuDaDept(dataDaDept, dataDeptHis, []))
        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.data.success) {
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
      if (deptHisSelected.length > 0) {
        const resulDDeptHisSelect = deptHisSelected.map((row) => ({
          ...row,
          DeptSeq: row.DeptSeq || DeptSeq,
          status: 'D',
        }))
        const resultDDeptHis = await DeleteDeptHis(resulDDeptHisSelect)
        if (resultDDeptHis.success) {
          setDeptHisSelected([])
          setIsSent(false)
          setEditedRows([])
          message.success('Xóa thành công!')
        } else {
          setIsSent(false)
          setErrorData(resultDDeptHis.data.errors)
          message.error('Có lỗi xảy ra khi xóa dữ liệu')
        }
      }

      if (deptOrgSelected.length > 0) {
        const resulDDeptOrgSelect = deptOrgSelected.map((row) => ({
          ...row,
          DeptSeq: row.DeptSeq || DeptSeq,
          status: 'D',
        }))
        const resultDDeptOrg = await DeleteDeptOrg(resulDDeptOrgSelect)
        if (resultDDeptOrg.success) {  
          setDeptOrgSelected([])
          setIsSent(false)
          setEditedRows([])
          message.success('Xóa thành công!')
        } else {
          setIsSent(false)
          setErrorData(resultDDeptOrg.data.errors)
          message.error('Có lỗi xảy ra khi xóa dữ liệu')
        }
      }
    } catch (error) {
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi xóa dữ liệu')
    } finally {
      onClickSearch()
      setGridDataDeptHis([])
      setNumRowsDeptHis(0)

      setGridDataOrgDept([])
      setNumRowsOrgDept(0)
    }
  }, [
    gridData,
    gridDataDeptHis,
    gridDataOrgDept,
    dadeptSelected,
    deptHisSelected,
    deptOrgSelected,
    
    editedRows,
    editedRowsDeptHis,
    editedRowsOrgDept,
  ])

  return (
    <>
      <Helmet>
        <title>ITM - {t('10041544')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
          <div className="flex items-center justify-between">
          <Title level={4} className="m-2 uppercase opacity-85 ">
                {t('10041544')}
              </Title>
              <HrDaDeptActions
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                onClickSearch={onClickSearch}
                onClickSave={onClickSave}
                onClickDeleteSheet={onClickDeleteSheet}
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
                <HrDaDeptQuery
                  SMDeptTypeData={SMDeptTypeData}
                  SMDeptType={SMDeptType}
                  setSMDeptType={setSMDeptType}
                  IsUseData={IsUseData}
                  IsUse={IsUse}
                  setIsUse={setIsUse}
                  QBegDate={QBegDate}
                  setQBegDate={setQBegDate}
                  QEndDate={QEndDate}
                  setQEndDate={setQEndDate}
                  DeptName={DeptName}
                  setDeptName={setDeptName}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <Splitter className="w-full h-full" layout="vertical">
              <SplitterPanel size={33} minSize={10}>
                <div className="h-full overflow-auto">
                  <TableDaDept
                    SMDeptTypeData={SMDeptTypeData}
                    TaxNameData={TaxNameData}
                    AccUnitNameData={AccUnitNameData}
                    BizUnitNameData={BizUnitNameData}
                    SlipUnitNameData={SlipUnitNameData}
                    FactUnitNameData={FactUnitNameData}
                    UMCostTypeData={UMCostTypeData}
                    setSelection={setSelection}
                    showSearch={showSearch}
                    setShowSearch={setShowSearch}
                    selection={selection}
                    canEdit={canEdit}
                    cols={cols}
                    setCols={setCols}
                    setGridData={setGridData}
                    gridData={gridData}
                    defaultCols={defaultCols}
                    setNumRows={setNumRows}
                    numRows={numRows}
                    helpData09={helpData09}
                    setHelpData09={setHelpData09}
                    helpData08={helpData08}
                    setHelpData08={setHelpData08}
                    FactUnit={FactUnit}
                    setHelpData12={setHelpData12}
                    helpData12={helpData12}
                    setEditedRows={setEditedRows}
                    handleRowAppend={handleRowAppend}
                    onCellClickedDaDept={onCellClickedDaDept}
                  />
                </div>
              </SplitterPanel>

              <SplitterPanel size={7} minSize={10}>
                <div className="h-full p-2 border-t border-b overflow-auto">
                  <DaDeptQuery
                    DeptName={DeptNameQ}
                    setDeptName={setDeptNameQ}
                  />
                </div>
              </SplitterPanel>
              <SplitterPanel size={55} minSize={20}>
                <div className="h-full flex flex-col">
                  <Menu
                    mode="horizontal"
                    selectedKeys={[current]}
                    onClick={(e) => {
                      if (!checkPageA) {
                        setCurrent(e.key)
                      } else {
                        message.warning(t('870000042'))
                      }
                    }}
                    className="border-b"
                    items={[
                      {
                        key: '1',
                        label: (
                          <span className="flex items-center gap-1">
                            <Package size={14} />
                            {t('739')}
                          </span>
                        ),
                      },
                      {
                        key: '2',
                        label: (
                          <span className="flex items-center gap-1">
                            <MonitorSmartphone size={14} />
                            {t('580')}
                          </span>
                        ),
                      },
                    ]}
                  />
                  <div className="flex-1 overflow-auto">
                    {current === '1' && (
                      <>
                        <TableDeptHisRegis
                          setSelection={setSelectionDeptHis}
                          showSearch={showSearch2}
                          setShowSearch={setShowSearch2}
                          selection={selectionDeptHis}
                          canEdit={canEdit}
                          cols={colsDeptHis}
                          setCols={setColsDeptHis}
                          setGridData={setGridDataDeptHis}
                          gridData={gridDataDeptHis}
                          defaultCols={defaultCols2}
                          setNumRows={setNumRowsDeptHis}
                          numRows={numRowsDeptHis}
                          setHelpData10={setHelpData10}
                          helpData10={helpData10}
                          editedRowsDeptHis={editedRowsDeptHis}
                          setEditedRows={setEditedRowsDeptHis}
                          handleRowAppend={handleRowAppendDeptHis}
                          onCellClickedDeptHis={onCellClickedDeptHis}
                        />
                      </>
                    )}
                    {current === '2' && (
                      <TableActiveCenterHisRegist
                        CCtrData={CCtrData}
                        setSelection={setSelectionDeptOrg}
                        showSearch={showSearch3}
                        setShowSearch={setShowSearch3}
                        selection={selectionDeptOrg}
                        canEdit={canEdit}
                        cols={colsOrgDept}
                        setCols={setColsOrgDept}
                        setGridData={setGridDataOrgDept}
                        gridData={gridDataOrgDept}
                        defaultCols={defaultcolsOrgDept}
                        setNumRows={setNumRowsOrgDept}
                        numRows={numRowsOrgDept}
                        setCacheData={setCacheDataCCtr}
                        setEditedRows={setEditedRowsOrgDept}
                        handleRowAppend={handleRowAppendOrgDept}
                        onCellClickedDeptOrg={onCellClickedDeptOrg}
                      />
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
    </>
  )
}
