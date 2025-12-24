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
import InfoEmpListQuery from '../../components/query/hrInfo/infoEmpListQuery'
import TableInfoEmpList from '../../components/table/hr-info/tableInfoEmpList'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { SearchInfoEmpList } from '../../../features/mgn-hr/info-emp/searchInfoEmpList'
export default function InfoEmpList({
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
        title: t('11227'),
        id: 'Photo',
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
        title: t('4'),
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
        title: t('3161'),
        id: 'EmpSeq',
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
        title: t('49584'),
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
        title: t('4612'),
        id: 'Age',
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
        title: t('163'),
        id: 'OrdDate',
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
        title: t('13623'),
        id: 'OrdName',
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
        title: t('15268'),
        id: 'IsExPrb',
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
        title: t('8820'),
        id: 'DeptFullName',
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
        title: t('1299'),
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
        title: t('1479'),
        id: 'UMEmpTypeName',
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
        id: 'RetireDate',
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
        title: t('17032'),
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
        title: t('11325'),
        id: 'WkEntDate',
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
        title: t('17815'),
        id: 'NextPsOrdDate',
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
        title: t('17812'),
        id: 'NextJpOrdDate',
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
        title: t('19132'),
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
        title: t('19151'),
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
        title: t('17812'),
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
        title: t('19153'),
        id: 'JdOrdDate',
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
        title: t('19158'),
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
        title: t('1084'),
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
        title: t('19035'),
        id: 'UMDegreeTypeName',
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
        title: t('10461'),
        id: 'UMSchName',
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
        title: t('17102'),
        id: 'UMMajorCourseName',
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
        title: t('8860'),
        id: 'GrdYm',
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
        title: t('19146'),
        id: 'CurrAddr',
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
        id: 'CurrAddrZip',
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
        title: t('7143'),
        id: 'SMBirthTypeName',
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
        title: t('396'),
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
        title: t('1069'),
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
      {
        title: t('421'),
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
        title: t('16968'),
        id: 'IsDisabled',
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
        title: t('14233'),
        id: 'IsPatVet',
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
        title: t('16003'),
        id: 'IsForeigner',
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
        title: t('543'),
        id: 'UMNationName',
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
        title: t('1335'),
        id: 'UMReligionName',
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
        title: t('7327'),
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
        title: t('48335'),
        id: 'PeopleName',
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
        title: t('48377'),
        id: 'UMHouseSortName',
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
        title: t('21800'),
        id: 'DeptSeq',
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
        title: t('18146'),
        id: 'Val',
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

  const [dataTree, setDataTree] = useState([])
  const [GrpSortNameData, setGrpSortNameData] = useState([])
  const [EntRetTypeNameData, setEntRetTypeNameData] = useState([])
  const [UMEmpTypeNameData, setUMEmpTypeNameData] = useState([])
  const [SMIsForData, setSMIsForData] = useState([])
  const [SMIsOrdNameData, setSMIsOrdNameData] = useState([])
  const [EmpNameData, setEmpNameData] = useState([])
  const [DeptNameData, setDeptNameData] = useState([])
  const [PosNameData, setPosNameData] = useState([])

  const [GrpSortName1, setGrpSortName1] = useState('')
  const [GrpSortName2, setGrpSortName2] = useState('')

  const [ym, setYm] = useState('')
  const [chkOrg, setchkOrg] = useState(false)

  const [EmpName, setEmpName] = useState('')
  const [DeptName, setDeptName] = useState('')
  const [BaseDate, setBaseDate] = useState(dayjs())
  const [PosName, setPosName] = useState('')
  const [IsLowDept, setIsLowDept] = useState(false)
  const [EmpID, setEmpID] = useState('')
  const [UMEmpTypeName, setUMEmpTypeName] = useState('')
  const [SMIsForSeq, setSMIsForSeq] = useState('')
  const [SMIsForName, setSMIsForName] = useState('')
  const [SMIsOrdName, setSMIsOrdName] = useState('')
  const [IsPhotoView, setIsPhotoView] = useState(false)
  const [EntRetTypeName, setEntRetTypeName] = useState('')
  const [chkEach, setChkEach] = useState(false)

  const [PosSeq, setPosSeq] = useState('')
  const [UMEmpType, setUMEmpType] = useState('')
  const [SMIsOrd, setSMIsOrd] = useState('')
  const [EntRetType, setEntRetType] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')

  const [EmpSeq, setEmpSeq] = useState('')
  const [userId, setUserId] = useState('')

  const secretKey = 'KEY_PATH'
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const formatDate = (date) => date.format('YYYYMM')

  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMM') : ''
  }

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'INFO_MONT_PER_CNT_LIST',
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
        EntRetTypeNameData,
        SmIsForNameData,
        UmEmpNameData,
        SMIsOrdNameData,

        EmpNameData,
        DeptData,
        PosData,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3031', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3213', '', '', '', signal),
        GetCodeHelpCombo(
          '',
          6,
          19999,
          1,
          '%',
          '3059',
          '1001',
          '3053001,3053002',
          '',
          signal,
        ),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3093', '', '', '', signal),
        GetCodeHelpVer2(10009, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
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
        GetCodeHelpVer2(10011, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])
      setEntRetTypeNameData(EntRetTypeNameData?.data || [])
      setSMIsForData(SmIsForNameData?.data || [])
      setUMEmpTypeNameData(UmEmpNameData?.data || [])
      setSMIsOrdNameData(SMIsOrdNameData?.data || [])
      setEmpNameData(EmpNameData?.data || [])
      setDeptNameData(DeptData?.data || [])
      setPosNameData(PosData?.data || [])

    } catch {
      setEntRetTypeNameData([])
      setSMIsForData([])
      setUMEmpTypeNameData([])
      setSMIsForData([])
      setSMIsOrdNameData([])
      setEmpNameData([])
      setDeptNameData([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpData = null
    }
  }, [])

  const fetchCodeHelpDataByDept = useCallback(async () => {
    try {
      const [DeptNameData] = await Promise.all([
        GetCodeHelpVer2(
          10010,
          DeptName,
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
      setDeptNameData(DeptNameData.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [DeptName])

  useEffect(() => {
    fetchCodeHelpDataByDept()
  }, [DeptName])

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
          PosSeq: PosSeq,
          BaseDate: formatDateSearch(BaseDate),
          UMEmpType: UMEmpType,
          SMIsOrd: SMIsOrd,
          EntRetType: EntRetType,
          SMIsForSeq: SMIsForSeq,
          DeptSeq: DeptSeq,
          EmpSeq: EmpSeq,
          IsLowDept: IsLowDept,
          IsPhotoView: IsPhotoView,
        },
      ]
      const dataResult = await SearchInfoEmpList(data)

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
    PosSeq,
    BaseDate,
    UMEmpType,
    SMIsOrd,
    EntRetType,
    SMIsForSeq,
    DeptSeq,
    EmpSeq,
    IsLowDept,
    IsPhotoView,
    EntRetTypeName,
    isAPISuccess,
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
  }, [PosSeq, BaseDate, UMEmpType, SMIsOrd, EntRetType, SMIsForSeq, DeptSeq, EmpSeq, IsLowDept, IsPhotoView, isAPISuccess])

  return (
    <>
      <Helmet>
        <title>ITM - {t('10040617')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('10040617')}
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
                <InfoEmpListQuery
                  UMEmpTypeNameData={UMEmpTypeNameData}
                  EntRetTypeNameData={EntRetTypeNameData}
                  SMIsForSeqData={SMIsForData}
                  SMIsOrdNameData={SMIsOrdNameData}
                  dataUser={EmpNameData}
                  dataDept={DeptNameData}
                  dataPos={PosNameData}
                  UMEmpTypeName={UMEmpTypeName}
                  setUMEmpTypeName={setUMEmpTypeName}
                  SMIsOrdName={SMIsOrdName}
                  setSMIsOrdName={setSMIsOrdName}
                  EntRetTypeName={EntRetTypeName}
                  setEntRetTypeName={setEntRetTypeName}
                  SMIsForSeq={SMIsForSeq}
                  setSMIsForSeq={setSMIsForSeq}
                  SMIsForName={SMIsForName}
                  setSMIsForName={setSMIsForName}
                  BaseDate={BaseDate}
                  setBaseDate={setBaseDate}
                  IsLowDept={IsLowDept}
                  setIsLowDept={setIsLowDept}
                  IsPhotoView={IsPhotoView}
                  setIsPhotoView={setIsPhotoView}
                  EmpName={EmpName}
                  setEmpName={setEmpName}
                  EmpSeq={EmpSeq}
                  setEmpSeq={setEmpSeq}
                  setUserId={setUserId}
                  setPosSeq={setPosSeq}
                  setPosName={setPosName}
                  PosSeq={PosSeq}
                  PosName={PosName}
                  setUMEmpType={setUMEmpType}
                  setSMIsOrd={setSMIsOrd}
                  setEntRetType={setEntRetType}
                  setDeptSeq={setDeptSeq}
                  DeptName={DeptName}
                  setDeptName={setDeptName}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableInfoEmpList
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
