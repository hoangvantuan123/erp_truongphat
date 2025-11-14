import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Menu, message } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

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

import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { validateCheckColumns } from '../../../utils/validateColumns'

import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import HrBasCertificateActions from '../../components/actions/hr-da-dept/hrBasCertificateActions'
import HrBasCetificateQuery from '../../components/query/hrCertificate/hrBasCetificateQuery'
import TableHrBasCertificate from '../../components/table/hr-certificate/tableHrBasCertificate'
import { SearchBasCertificate } from '../../../features/mgn-hr/hr-certificate/searchBasCertificate'
import { AUBasCertificate } from '../../../features/mgn-hr/hr-certificate/AUBasCertificate'
import { DeleteBasCetificate } from '../../../features/mgn-hr/hr-certificate/deleteBasCetificate'
import { PrintBasCetificate } from '../../../features/mgn-hr/hr-certificate/printBasCetificate'
export default function HrBasCertificate({
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
        title: t('1321'),
        id: 'SMCertiTypeName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('17608'),
        id: 'CertiSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('7041'),
        id: 'ApplyDate',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('167'),
        id: 'IssueDate',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('4'),
        id: 'EmpName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('3161'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('1452'),
        id: 'EmpID',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1744'),
        id: 'EmpEngName',
        kind: 'Text',
        readonly: true,
        width: 200,
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
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('738'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('642'),
        id: 'UMJpName',
        kind: 'Text',
        readonly: true,
        width: 200,
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
        width: 200,
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
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1344'),
        id: 'ResidID',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('48438'),
        id: 'ResidIDMYN',
        kind: 'Boolean',
        readonly: true,
        width: 200,
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
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('4774'),
        id: 'JobName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('12791'),
        id: 'JobSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('13700'),
        id: 'CertiCnt',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('10668'),
        id: 'CertiDecCnt',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1796'),
        id: 'CertiUseage',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('8736'),
        id: 'CertiSubmit',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('3181'),
        id: 'TaxFrYm',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('2320'),
        id: 'TaxToYm',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('360'),
        id: 'TaxEmpName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('598'),
        id: 'IsAgree',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('5570'),
        id: 'IssueNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('5572'),
        id: 'IsPrt',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('13709'),
        id: 'IssueEmpName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('5573'),
        id: 'IssueEmpSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('13703'),
        id: 'IsNoIssue',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1481'),
        id: 'NoIssueReason',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('3582'),
        id: 'IsEmpApp',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('10775'),
        id: 'CompanyName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('19314'),
        id: 'CompanyAddr',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('886'),
        id: 'Owner',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('13069'),
        id: 'OwnerJpName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('17030'),
        id: 'Term',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('17607'),
        id: 'SMCertiType',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('17028'),
        id: 'TypeSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
    ],
    [t],
  )

  const [isSent, setIsSent] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [count, setCount] = useState(0)
  const lastWordEntryRef = useRef(null)

  const [loading, setLoading] = useState(false)

  const [gridData, setGridData] = useState([])
  const [numRows, setNumRows] = useState(0)
  const [addedRows, setAddedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)

  const [EmpData, setEmpData] = useState(null)
  const [DeptData, setDeptData] = useState([])
  const [SMCertiTypeData, setSMCertiTypeData] = useState([])
  const [ContractKindData, setContractKindData] = useState(null)

  const [empSeq, setEmpSeq] = useState(0)
  const [empID, setEmpID] = useState('')
  const [empName, setEmpName] = useState('')
  const [DeptName, setDeptName] = useState('')
  const [DeptSeq, setDeptSeq] = useState(0)
  const [SMCertiType, setSMCertiType] = useState('')
  const [SMCertiTypeName, setSMCertiTypeName] = useState('')
  const [contractKind, setContractKind] = useState('')
  const [ContractKindName, setContractKindName] = useState('')
  const [fromDateQ, setFromDateQ] = useState('')
  const [toDateQ, setToDateQ] = useState('')
  const [IsPrt, setIsPrt] = useState(0)
  const [IsAgree, setIsAgree] = useState(0)

  const [helpData08, setHelpData08] = useState([])
  const [helpData09, setHelpData09] = useState([])
  const [helpData12, setHelpData12] = useState([])

  const [editedRows, setEditedRows] = useState([])

  const [FactUnit, setFactUnit] = useState('')
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [basCertificateSelected, setBasCertificateSelected] = useState([])

  const formatDate = (date) => date.format('YYYYMMDD')
  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'HR_BAS_CERTIFICATE',
      defaultCols.filter((col) => col.visible),
    ),
  )
  const [selection, setSelection] = useState({
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
      const [EmpData, DeptDataRes, SMCertiTypeData] = await Promise.all([
        GetCodeHelpVer2(10009, '', '', '', '', '', '1', '', 50, '', 0, 0, 0),

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
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3067', '1002', '1', '', signal),
      ])

      setEmpData(EmpData.data || [])
      setDeptData(DeptDataRes.data || [])
      setSMCertiTypeData(SMCertiTypeData.data || [])
    } catch {
      setEmpData([])
      setDeptData([])
      setSMCertiTypeData([])
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

  const fieldsToTrack = ['IdxNo', 'EmpSeq', 'EmpName', 'ContractNo', 'FromDate']

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
    setIsAPISuccess(false)

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

    

    try {
      const data = [
        {
          IsAgree: IsAgree,
          FrApplyDate: formatDateSearch(fromDateQ),
          ToApplyDate: formatDateSearch(toDateQ),
          DeptSeq: DeptSeq,
          EmpSeq: empSeq,
          IsPrt: IsPrt,
          SMCertiType: SMCertiType,
        },
      ]

      const response = await SearchBasCertificate(data)
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
  }, [empSeq, contractKind, fromDateQ, toDateQ, SMCertiType, IsAgree, IsPrt])

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

    
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }

    const requiredColumns = [
      'SMCertiTypeName',
      'ApplyDate',
      'IssueDate',
      'EmpName',
      'EmpSeq',
      'CertiCnt',
    ]

    const columns = [
      'IdxNo',
      'SMCertiTypeName',
      'CertiSeq',
      'ApplyDate',
      'IssueDate',
      'EmpName',
      'EmpSeq',
      'EmpID',
      'EmpEngName',
      'DeptName',
      'DeptSeq',
      'UMJpName',
      'EntDate',
      'RetireDate',
      'ResidID',
      'ResidIDM',
      'ResidIDMYN',
      'Addr',
      'JobName',
      'JobSeq',
      'CertiCnt',
      'CertiDecCnt',
      'CertiUsage',
      'CertiSubmit',
      'TaxFrYm',
      'TaxToYm',
      'TaxEmpName',
      'IsAgree',
      'IssueNo',
      'IsPrt',
      'IssueEmpName',
      'IssueEmpSeq',
      'IsNoIssue',
      'NoIssueReason',
      'IsEmpApp',
      'CompanyName',
      'CompanyAddr',
      'Owner',
      'OwnerJpName',
      'Term',
      'SMCertiType',
      'TypeSeq',
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
    const validationMessage = validateCheckColumns(
      [...resulA],
      columns,
      requiredColumns,
    )
    if (validationMessage !== true) {
      const columnLabels = {
        EmpName: t('1480'),
        SMCertiTypeName: t('493'),
        ApplyDate: t('28782'),
        IssueDate: t('28782'),
        CertiCnt: t('28782'),
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

    const data = [...resulU, ...resulA]

    if (isSent) return
    setIsSent(true)
    setIsAPISuccess(false)

    try {
      const promises = []

      promises.push(AUBasCertificate(data))

      const results = await Promise.all(promises)

      results.forEach((result, index) => {
        if (result.success) {
          const newData = result.data.data
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
      setIsAPISuccess(true)
    } finally {
      onClickSearch()
      setIsAPISuccess(true)

      controllers.current.onClickSave = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    editedRows,
    isAPISuccess,
    empSeq,
    contractKind,
    fromDateQ,
    toDateQ,
    gridData,
  ])

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

    const resulD = basCertificateSelected.map((row) => ({
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
      if (resulD.length > 0 && resulD.length > 0) {
        promises.push(DeleteBasCetificate(resulD))
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
      setModalOpen(true)
      setIsAPISuccess(true)
    } finally {
      onClickSearch()
      setIsAPISuccess(true)
      setModalOpen(false)
      controllers.current.onClickDeleteSheet = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [gridData, basCertificateSelected, editedRows, isAPISuccess, modalOpen])

    const onClickPrint = useCallback(async () => {
      if (!isAPISuccess) {
        message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
        return
      }
  
      if (basCertificateSelected.length === 0) {
        message.warning('Lựa chọn ít nhất một bản ghi để in!')
        return
      }
  
      if (controllers.current && controllers.current.onClickPrint) {
        controllers.current.onClickPrint.abort()
        controllers.current.onClickPrint = null
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
  
      controllers.current.onClickPrint = controller
  
      setIsAPISuccess(false)
  
      try {
        const data = basCertificateSelected.map((row) => ({
          ...row,
        }))

        const response = await PrintBasCetificate(data)

        if (!response.success) {
          message.error(
            response?.errors ||
              'Lỗi khi in hợp đồng lao động. Vui lòng thử lại sau.',
          )
          return
        } else {
          const fileBase64 = response.data

          if (fileBase64.length === 0) {
            message.warn('Không có file base64 trong phản hồi')
          } else if (fileBase64.length <= 5) {
            fileBase64.forEach((file) => {
              const fileBase64 = file?.FilePdfBase64
              const fileName = file?.FileName || 'document.pdf'

              if (fileBase64) {
                const byteCharacters = atob(fileBase64)
                const byteNumbers = new Array(byteCharacters.length)
                  .fill()
                  .map((_, i) => byteCharacters.charCodeAt(i))
                const byteArray = new Uint8Array(byteNumbers)

                const blob = new Blob([byteArray], { type: 'application/pdf' })
                const blobUrl = URL.createObjectURL(blob)

                window.open(blobUrl, '_blank')
              } else {
                message.warn(`Không có dữ liệu file PDF cho ${fileName}`)
              }
            })
          } else {
            const zip = new JSZip()

            fileBase64.forEach((file, index) => {
              const fileBase64 = file?.FilePdfBase64
              const fileName =
                (file?.FileName || `document_${index + 1}`) + '.pdf'

              if (fileBase64) {
                zip.file(fileName, fileBase64, { base64: true })
              }
            })

            const zipBlob = await zip.generateAsync({ type: 'blob' })
            saveAs(zipBlob, 'giay_chung_nhan.zip')
          }
        }
      } catch (error) {
        console.log(error)
        setIsAPISuccess(true)
      } finally {
        setIsAPISuccess(true)
        controllers.current.onClickPrint = null
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
      }
    }, [basCertificateSelected, isAPISuccess])

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
            setBasCertificateSelected(getSelectedRowsData())
          } else {
            newSelected = selection.rows.add(rowIndex)
            setBasCertificateSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRowsData, basCertificateSelected],
  )

  return (
    <>
      <Helmet>
        <title>HPM - {t('10009990')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 uppercase opacity-85 ">
                {t('10009990')}
              </Title>
              <HrBasCertificateActions
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                onClickSearch={onClickSearch}
                onClickSave={onClickSave}
                onClickPrint={onClickPrint}
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
                <HrBasCetificateQuery
                  dataUser={EmpData}
                  DeptData={DeptData}
                  setDeptData={setDeptData}
                  SMCertiTypeData={SMCertiTypeData}
                  FromDateQ={fromDateQ}
                  setFromDateQ={setFromDateQ}
                  ToDateQ={toDateQ}
                  setToDateQ={setToDateQ}
                  ContractKind={contractKind}
                  setContractKind={setContractKind}
                  setContractKindName={setContractKindName}
                  EmpName={empName}
                  setEmpName={setEmpName}
                  EmpSeq={empSeq}
                  setEmpSeq={setEmpSeq}
                  EmpID={empID}
                  setEmpID={setEmpID}
                  DeptName={DeptName}
                  setDeptName={setDeptName}
                  DeptSeq={DeptSeq}
                  setDeptSeq={setDeptSeq}
                  SMCertiType={SMCertiType}
                  setSMCertiType={setSMCertiType}
                  SMCertiTypeName={SMCertiTypeName}
                  setSMCertiTypeName={setSMCertiTypeName}
                  IsPrt={IsPrt}
                  setIsPrt={setIsPrt}
                  IsAgree={IsAgree}
                  setIsAgree={setIsAgree}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableHrBasCertificate
              dataUser={EmpData}
              SMCertiTypeData={SMCertiTypeData}
              setDataUser={setEmpData}
              ContractKindData={ContractKindData}
              setContractKindData={setContractKindData}
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
              onCellClicked={onCellClicked}
            />
          </div>
        </div>
      </div>
      <ErrorListModal
        isModalVisible={modal2Open}
        setIsModalVisible={setModal2Open}
        dataError={errorData}
      />

      <ModalSheetDelete
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        confirm={onClickDeleteSheet}
      />
    </>
  )
}
