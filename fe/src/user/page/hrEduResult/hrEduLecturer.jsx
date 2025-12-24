import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Menu, message } from 'antd'
const { Title, Text } = Typography
import dayjs from 'dayjs'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce, set } from 'lodash'

import TopLoadingBar from 'react-top-loading-bar'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'

import ErrorListModal from '../default/errorListModal'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import HrEduTypeAction from '../../components/actions/hrEdu/hrEduTypeAction'
import ModalConfirm from '../../components/modal/transReqMat/modalConfirm'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'

import { ClipboardCheckIcon, Cpu, InboxIcon } from 'lucide-react'
import TableHrEduLecturerInsite from '../../components/table/hrEdu/tableHrEduLecturerInSite'
import TableHrEduLecturerOutsite from '../../components/table/hrEdu/tableHrEduLecturerOutsite'

import { auHrEduLecturer } from '../../../features/mgn-hr/hr-edu/AuHrEduLecturer'
import { searchEduLecturer } from '../../../features/mgn-hr/hr-edu/searchEduLecturer'
import { deleteHrEduLecturer } from '../../../features/mgn-hr/hr-edu/deleteHrEduLecturer'
export default function HrEduLecturer({
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

  const defaultColsInsite = useMemo(
    () => [
      {
        title: t(''),
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
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
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
        icon: GridColumnIcon.HeaderString,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
          textHeader: '#DD1144',
        },
      },

      {
        title: t('1452'),
        id: 'EmpID',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('8924'),
        id: 'AddrSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },

      {
        title: t('1344'),
        id: 'ResidID',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('738'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('5'),
        id: 'DeptName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
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
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
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
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },

      {
        title: t('9078'),
        id: 'UMJpSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },

      {
        title: t('1345'),
        id: 'Address',
        kind: 'Text',
        readonly: false,
        width: 350,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('4460'),
        id: 'BasePrice',
        kind: 'Number',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('2137'),
        id: 'PosSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('17624'),
        id: 'SMPayType',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1313'),
        id: 'SMPayTypeName',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
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
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('LecturerSeq'),
        id: 'LecturerSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
    ],
    [t],
  )

  const defaultColsOutsite = useMemo(
    () => [
      {
        title: t(''),
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
        title: t('3549'),
        id: 'LecturerSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1775'),
        id: 'LecturerName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1344'),
        id: 'ResidID',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('8924'),
        id: 'AddrSeq',
        kind: 'Text',
        readonly: false,
        width: 250,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1345'),
        id: 'Address',
        kind: 'Text',
        readonly: false,
        width: 350,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },

      {
        title: t('1344'),
        id: 'ResidIDM',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },

      {
        title: t('8924'),
        id: 'AddrSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },

      {
        title: t('4460'),
        id: 'BasePrice',
        kind: 'Number',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('17624'),
        id: 'SMPayType',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1313'),
        id: 'SMPayTypeName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
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
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('LecturerSeq'),
        id: 'LecturerSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: false,
        },
      },
    ],
    [t],
  )

  const [showSearch2, setShowSearch2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gridDataInsite, setGridDataInsite] = useState([])
  const [numRowsInsite, setNumRowsInsite] = useState(0)

  const [gridDataOutsite, setGridDataOutsite] = useState([])
  const [numRowsOutsite, setNumRowsOutsite] = useState(0)

  const [helpData10, setHelpData10] = useState([])
  const [editedRows, setEditedRows] = useState([])
  const [editedRowsOutsite, setEditedRowsOutsite] = useState([])
  const [count, setCount] = useState(0)
  const lastWordEntryRef = useRef(null)
  const [isSent, setIsSent] = useState(false)

  const [EmpData, setEmpData] = useState([])
  const [deptData, setDeptData] = useState([])
  const [payTypeData, setPayTypeData] = useState([])

  const [current, setCurrent] = useState('0')
  const [checkPageA, setCheckPageA] = useState(false)

  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')
  const [modalDeleteSheetConfirm, setModalDeleteSheetConfirm] = useState(false)

  const [payType, setPayType] = useState('')
  const [payTypeName, setPayTypeName] = useState('')

  const [LecturerName, setLecturerName] = useState('')
  const [LecturerSeq, setLecturerSeq] = useState('')

  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionOutsite, setSelectionOutsite] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [addedRows, setAddedRows] = useState([])
  const [addedRowsOutsite, setAddedRowsOutsite] = useState([])
  const [numRowsInsiteToAdd, setNumRowsInsiteToAdd] = useState(null)
  const [numRowsOutsiteToAdd, setNumRowsOutsiteToAdd] = useState(null)

  const [colsInsite, setColsInsite] = useState(() =>
    loadFromLocalStorageSheet(
      'HR_EDU_INSITE',
      defaultColsInsite.filter((col) => col.visible),
    ),
  )

  const [colsOutsite, setColsOutsite] = useState(() =>
    loadFromLocalStorageSheet(
      'HR_EDU_OUTSITE',
      defaultColsOutsite.filter((col) => col.visible),
    ),
  )
  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [selectedInsite, setSelectedInsite] = useState([])
  const [selectedOutsite, setSelectedOutsite] = useState([])

  const [deptSearchSh, setDeptSearchSh] = useState('')
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('')

  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [userId, setUserId] = useState('')
  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
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
      const [EmpDataRes, DeptData, payTypeData] = await Promise.all([
        GetCodeHelpVer2(10009, '', '', '', '', '', '2', '', 1000, '', 0, 0, 0),

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
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3075', '', '', '', signal),
      ])

      setEmpData(EmpDataRes.data)
      setDeptData(DeptData.data)
      setPayTypeData(payTypeData.data)
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

  const fieldsToTrack = ['IdxNo', 'EmpName']

  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridDataInsite, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const getSelectedRows = (gridData, selection) => {
    const selectedInsiteRows = selection.rows.items
    let rows = []
    selectedInsiteRows.forEach((range) => {
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
        if (rowIndex >= 0 && rowIndex < gridDataInsite.length) {
          const isSelected = selection.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selection.rows.remove(rowIndex)
            setSelectedInsite(getSelectedRows(gridDataInsite, selection))
          } else {
            newSelected = selection.rows.add(rowIndex)
            setSelectedInsite([])
          }
        }
      }
    },
    [gridDataInsite, getSelectedRows, selectedInsite],
  )

  const onCellClickedOutsite = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataOutsite.length) {
          const isSelected = selectionOutsite.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selectionOutsite.rows.remove(rowIndex)
            setSelectedOutsite(
              getSelectedRows(gridDataOutsite, selectionOutsite),
            )
          } else {
            newSelected = selectionOutsite.rows.add(rowIndex)
            setSelectedOutsite([])
          }
        }
      }
    },
    [gridDataOutsite, getSelectedRows, selectedOutsite],
  )

  const handleRowAppend = useCallback(
    (numRowsInsiteToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(
        colsInsite,
        setGridDataInsite,
        setNumRowsInsite,
        setAddedRows,
        numRowsInsiteToAdd,
      )
    },
    [
      colsInsite,
      setGridDataInsite,
      setNumRowsInsite,
      setAddedRows,
      numRowsInsiteToAdd,
    ],
  )

  const handleRowAppendLectureOutsite = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(
        colsOutsite,
        setGridDataOutsite,
        setNumRowsOutsite,
        setAddedRowsOutsite,
        numRowsToAdd,
      )
    },
    [
      colsOutsite,
      setGridDataOutsite,
      setNumRowsOutsite,
      setAddedRowsOutsite,
      numRowsOutsiteToAdd,
    ],
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
      if (current === '0') {
        const data = [
          {
            SMPayType: payType,
            DeptSeq: deptSeq,
            EmpSeq: empSeq,
            EmpName: empName,
            SMInOutType: 1012001,
          },
        ]

        const response = await searchEduLecturer(data)
        const fetchedData = response.data || []

        const emptyData = generateEmptyData(0, defaultColsInsite)
        const combinedData = [...fetchedData, ...emptyData]
        const updatedData = updateIndexNo(combinedData)
        setGridDataInsite(updatedData)
        setNumRowsInsite(fetchedData.length + emptyData.length)
      }
      if (current === '1') {
        const data = [
          {
            SMPayType: payType,
            LecturerName: LecturerName,
            SMInOutType: 1012002,
          },
        ]

        const response = await searchEduLecturer(data)
        const fetchedData = response.data || []

        const emptyData = generateEmptyData(0, defaultColsOutsite)
        const combinedData = [...fetchedData, ...emptyData]
        const updatedData = updateIndexNo(combinedData)
        setGridDataOutsite(updatedData)
        setNumRowsOutsite(fetchedData.length + emptyData.length)
      }
    } catch (error) {
      const emptyData = generateEmptyData(10, defaultColsOutsite)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridDataInsite(updatedEmptyData)
      setNumRowsInsite(emptyData.length)
    } finally {
      setIsAPISuccess(true)
      controllers.current.onClickSearch = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    current,
    payType,
    deptSeq,
    empSeq,
    empName,
    LecturerName,
    defaultColsInsite,
    isAPISuccess,
    gridDataInsite,
    gridDataOutsite,
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

    const requiredColumns = ['EduCourseName']

    const columns = [
      'IdxNo',
      'EmpSeq',
      'EmpName',
      'EmpID',
      'AddrSeq',
      'ResidID',
      'DeptSeq',
      'DeptName',
      'PosName',
      'UMJpName',
      'UMJpSeq',
      'Address',
      'BasePrice',
      'PosSeq',
      'SMPayType',
      'SMPayTypeName',
      'Remark',
      'LecturerSeq',
      'IDX_NO',
    ]

    const columnsOutsite = [
      'IdxNo',
      'LecturerSeq',
      'LecturerName',
      'ResidID',
      'AddrSeq',
      'Address',
      'ResidIDM',
      'AddrSeq',
      'BasePrice',
      'SMPayType',
      'SMPayTypeName',
      'Remark',
      'LecturerSeq',
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

    const resulU = filterAndSelectColumns(gridDataInsite, columns, 'U').map(
      (row) => ({
        ...row,
        status: 'U',
        SMInOutType: 1012001,
      }),
    )

    const resulA = filterAndSelectColumns(gridDataInsite, columns, 'A').map(
      (row) => ({
        ...row,
        status: 'A',
        SMInOutType: 1012001,
      }),
    )

    const resulOutsiteU = filterAndSelectColumns(
      gridDataOutsite,
      columnsOutsite,
      'U',
    ).map((row) => ({
      ...row,
      status: 'U',
      SMInOutType: 1012002,
    }))

    const resulOutsiteA = filterAndSelectColumns(
      gridDataOutsite,
      columnsOutsite,
      'A',
    ).map((row) => ({
      ...row,
      status: 'A',
      SMInOutType: 1012002,
    }))

    const data = [...resulU, ...resulA]
    const dataOutsite = [...resulOutsiteU, ...resulOutsiteA]

    if (isSent) return
    setIsSent(true)

    try {
      const promises = []

      if (dataOutsite.length > 0) {
        promises.push(auHrEduLecturer(dataOutsite))
      }
      if (data.length > 0) {
        promises.push(auHrEduLecturer(data))
      }
      const results = await Promise.all(promises)

      results.forEach((result, index) => {
        if (result.success) {
          if (index === 0) {
            message.success('Thêm thành công!')
          } else {
            message.success('Cập nhật  thành công!')
          }
          if (data?.length > 0) {
            const newData = result?.data?.logs1
            setGridDataInsite((prev) => {
              const updated = prev.map((item) => {
                const found = newData.find((x) => x?.IDX_NO === item?.IdxNo)

                return found
                  ? {
                      ...item,
                      Status: '',
                      IdSeq: found?.IdSeq,
                      LecturerSeq: found?.LecturerSeq,
                    }
                  : item
              })
              return updateIndexNo(updated)
            })
          }

          if (dataOutsite?.length > 0) {
            const newData = result?.data?.logs1
            setGridDataOutsite((prev) => {
              const updated = prev.map((item) => {
                const found = newData.find((x) => x?.IDX_NO === item?.IdxNo)

                return found
                  ? {
                      ...item,
                      Status: '',
                      IdSeq: found?.IdSeq,
                      LecturerSeq: found?.LecturerSeq,
                    }
                  : item
              })
              return updateIndexNo(updated)
            })
          }

          setIsSent(false)
          setEditedRows([])
          setEditedRowsOutsite([])
          resetTable()
        } else {
          setIsSent(false)
          setModal2Open(true)
          setErrorData(result.errors)
        }
      })
    } catch (error) {
      console.log('error', error)
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    } finally {
      setIsAPISuccess(true)
      controllers.current.onClickSave = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [editedRows, editedRowsOutsite, gridDataInsite, gridDataOutsite])

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

    const resulD = selectedInsite.map((row) => ({
      ...row,
      status: 'D',
      SMInOutType: 1012001,
    }))

    const resulOutsiteD = selectedOutsite.map((row) => ({
      ...row,
      status: 'D',
      SMInOutType: 1012002,
    }))

    const validEntriesDeptHis = filterValidEntries()
    setCount(validEntriesDeptHis.length)
    const lastEntryDepHis = findLastEntry(validEntriesDeptHis)

    if (lastWordEntryRef.current?.Id !== lastEntryDepHis?.Id) {
      lastWordEntryRef.current = lastEntryDepHis
    }

    if (isSent) return
    setIsSent(true)

    const rowsWithStatusD = selectedInsite
      .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D')
      .map((row) => ({
        ...row,
        WorkingTag: 'D',
        SMInOutType: 1012001,
      }))

    const rowsOutsiteWithStatusD = selectedOutsite
      .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D')
      .map((row) => ({
        ...row,
        WorkingTag: 'D',
        SMInOutType: 1012002,
      }))

    try {
      const promises = []
      if (resulD.length > 0) {
        promises.push(deleteHrEduLecturer(resulD))
      }
      if (resulOutsiteD.length > 0) {
        promises.push(deleteHrEduLecturer(resulOutsiteD))
      }

      const results = await Promise.all(promises)
      results.forEach((result, index) => {
        if (result.success) {
          if (index === 0) {
            message.success('Xóa thành công!')
          }
          if (resulD.length > 0) {
            const deletedIds = rowsWithStatusD.map((item) => item.IdxNo)
            const updatedData = gridDataInsite.filter(
              (row) => !deletedIds.includes(row.IdxNo),
            )
            setGridDataInsite(updateIndexNo(updatedData))
            setNumRowsInsite(updatedData.length)
          }

          if (resulOutsiteD.length > 0) {
            const deletedIds = rowsOutsiteWithStatusD.map((item) => item.IdxNo)
            const updatedData = gridDataOutsite.filter(
              (row) => !deletedIds.includes(row.IdxNo),
            )
            setGridDataOutsite(updateIndexNo(updatedData))
            setNumRowsOutsite(updatedData.length)
          }

          setIsSent(false)
          setEditedRows([])
          setEditedRowsOutsite([])
          resetTable()
          setModalDeleteSheetConfirm(false)
        } else {
          setIsSent(false)
          setErrorData(result.data.errors)
          message.error('Có lỗi xảy ra khi xóa dữ liệu')
        }
      })
    } catch (error) {
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi xóa dữ liệu')
    } finally {
      setModalDeleteSheetConfirm(false)
      setIsAPISuccess(true)
      controllers.current.onClickDeleteSheet = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [gridDataInsite, editedRows, selectedInsite, modalDeleteSheetConfirm])

  const handleOpenDeleteDataSheet = useCallback(() => {
  if (selectedInsite.length === 0 && selectedOutsite.length === 0) {
      message.warning('Chọn dữ liệu để xóa')
    }
     else {
      setModalDeleteSheetConfirm(true)
    }
  }, [selectedInsite, selectedOutsite, modalDeleteSheetConfirm])

  return (
    <>
      <Helmet>
        <title>ITM - {t('10040522')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('10040522')}
              </Title>
              <HrEduTypeAction
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                handleSearch={onClickSearch}
                handleExternalSubmit={onClickSave}
                handleOpenDeleteDataSheet={handleOpenDeleteDataSheet}
              />
            </div>
            <div className="h-full flex border">
              <Menu
                mode="horizontal"
                selectedInsiteKeys={[current]}
                style={{ width: '100%' }}
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
                        <InboxIcon size={14} />
                        {t('14499')}
                      </span>
                    ),
                  },

                  {
                    key: '1',
                    label: (
                      <span className="flex items-center gap-1">
                        <ClipboardCheckIcon size={14} />
                        {t('14559')}
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            {current === '0' && (
              <>
                <TableHrEduLecturerInsite
                  DeptData={deptData}
                  EmpData={EmpData}
                  setEmpData={setEmpData}
                  payTypeData={payTypeData}
                  setPayTypeData={setPayTypeData}
                  setPayType={setPayType}
                  setPayTypeName={setPayTypeName}
                  deptSearchSh={deptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  deptName={deptName}
                  setDeptName={setDeptName}
                  deptSeq={deptSeq}
                  setDeptSeq={setDeptSeq}
                  resetTable={resetTable}
                  empName={empName}
                  setEmpName={setEmpName}
                  peopleSearchSh={peopleSearchSh}
                  setPeopleSearchSh={setPeopleSearchSh}
                  selectionPeople={selectionPeople}
                  setSelectionPeople={setSelectionPeople}
                  empSeq={empSeq}
                  setEmpSeq={setEmpSeq}
                  userId={userId}
                  setUserId={setUserId}
                  setSelection={setSelection}
                  showSearch={showSearch2}
                  setShowSearch={setShowSearch2}
                  selection={selection}
                  canEdit={canEdit}
                  cols={colsInsite}
                  setCols={setColsInsite}
                  setGridData={setGridDataInsite}
                  gridData={gridDataInsite}
                  defaultCols={defaultColsInsite}
                  setNumRows={setNumRowsInsite}
                  numRows={numRowsInsite}
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
              </>
            )}

            {current === '1' && (
              <>
                <TableHrEduLecturerOutsite
                  payTypeData={payTypeData}
                  setPayTypeData={setPayTypeData}
                  setPayType={setPayType}
                  setPayTypeName={setPayTypeName}
                  lecturerName={LecturerName}
                  setLecturerName={setLecturerName}
                  setSelection={setSelectionOutsite}
                  showSearch={showSearch2}
                  setShowSearch={setShowSearch2}
                  selection={selectionOutsite}
                  canEdit={canEdit}
                  cols={colsOutsite}
                  setCols={setColsOutsite}
                  setGridData={setGridDataOutsite}
                  gridData={gridDataOutsite}
                  defaultCols={defaultColsOutsite}
                  setNumRows={setNumRowsOutsite}
                  numRows={numRowsOutsite}
                  setHelpData10={setHelpData10}
                  helpData10={helpData10}
                  editedRows={editedRowsOutsite}
                  setEditedRows={setEditedRowsOutsite}
                  onCellClicked={onCellClickedOutsite}
                  handleRowAppend={handleRowAppendLectureOutsite}
                  loadingBarRef={loadingBarRef}
                  isAPISuccess={isAPISuccess}
                  setIsAPISuccess={setIsAPISuccess}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <ErrorListModal
        isModalVisible={modal2Open}
        setIsModalVisible={setModal2Open}
        dataError={errorData}
      />

      <ModalConfirm
        modalOpen={modalDeleteSheetConfirm}
        setmodalOpen={setModalDeleteSheetConfirm}
        MessageConfirm={'Xác nhận xóa sheet dữ liệu?'}
        onOk={onClickDeleteSheet}
        isShowInput={false}
      />
    </>
  )
}
