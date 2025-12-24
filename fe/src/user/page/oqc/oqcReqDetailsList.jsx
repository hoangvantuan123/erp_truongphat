import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import {Typography, message} from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'

import ErrorListModal from '../default/errorListModal'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'

import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateCheckColumns } from '../../../utils/validateColumns'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { useStateManager } from 'react-select'
import { useLocation} from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import TopLoadingBar from 'react-top-loading-bar';
import IqcOutsourceReqListDetailsActions from '../../components/actions/iqc-outsource/iqcOutsourceReqListDetailsActions'
import { GetListOqcTestReportResult } from '../../../features/oqc/GetListOqcTestReportBatch'
import TableOqcDetailsListReq from '../../components/table/oqc/tableOqcDetailsListReq'
import { CreatedOqcListBy } from '../../../features/oqc/createdOqcListBy'

export default function OqcReqDetailsList({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
}) {
  const { t } = useTranslation()
  const formatDate = (date) => date.format('YYYYMMDD')
  const location = useLocation();
  const dataSelect = location.state?.dataSelect || [];
  const [keyPath, setKeyPath] = useState('')
  const loadingBarRef = useRef(null);
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
      },
      
      {
        title: t('3'),
        id: 'FactUnitName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3'),
        id: 'FactUnit',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('744'),
        id: 'DeptName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('218'),
        id: 'WorkDate',
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
        title: t('1985'),
        id: 'DelvNo',
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
        title: t('2034'),
        id: 'ItemName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2035'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('510'),
        id: 'ProcName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
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
        icon: GridColumnIcon.HeaderArray,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2219'),
        id: 'ReqQty',
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
        title: t('8017'),
        id: 'ReqInQty',
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
        title: t('10537'),
        id: 'OKQty',
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
        title: t('2193'),
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
        title: t('2193'),
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
        title: t('2631'),
        id: 'EmpName',
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
        id: 'EmpSeq',
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
        title: t('120'),
        id: 'TestEndDate',
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
        title: t('29614'),
        id: 'FromSerial',
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

  const columnsError = useMemo(
    () => [
      {
        title: t('Dòng bị lỗi'),
        dataIndex: 'IDX_NO',
        key: 'IDX_NO',
        width: 100,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Data'),
        dataIndex: 'Name',
        key: 'Name',
        width: 200,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Kết quả'),
        dataIndex: 'result',
        key: 'result',
        width: 400,
        icon: GridColumnIcon.HeaderString,
      },
    ],
    [t],
  )
  const [loading, setLoading] = useState(false)
  const [gridData, setGridData] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)

  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [dataError, setDataError] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_OQC_LIST_DETAILS',
      defaultCols.filter((col) => col.visible),
    ),
  )
  const [QCEmployee, setQCEmployee] = useState(
    () => loadFromLocalStorageSheet('userInfo'))

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const lastWordEntryRef = useRef(null)
  const [dataUser, setDataUser] = useState([])

  const [dataSMTestResultName, setDataSMTestResultName] = useState([])

  const fieldsToTrack = [
    'FactUnitName',
    'DeptName',
    'WorkDate',
    'DelvNo',
    'ItemName',
    'ItemNo',
    'Spec',
    'ProcName',
    'QCNo',
    'ReqQty',
    'ReqInQty',
    'PassedQty',
    'RemainQty',
    'RejectQty',
    'EmpName',
    'SMTestResultName',
    'TestEndDate',
    'LOTNo',
    'FromSerial',
    'DeptSeq',
    'ProcSeq',
    'SourceSeq',
    'SourceType',
    'ItemSeq',
    'QCSeq',
    'SMTestResult',
    'EmpSeq',
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  useEffect(() => {
    const emptyData = generateEmptyData(50, defaultCols)
    const updatedEmptyData = updateIndexNo(emptyData)
    setGridData(updatedEmptyData)
    setNumRows(emptyData.length)
  }, [defaultCols])

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
        dataUsers,
        dataSmTestResultName,
      ] = await Promise.all([
        GetCodeHelp(10009, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6035', '1001', '', ''),
      ])
      setDataUser(dataUsers.data)
      setDataSMTestResultName(dataSmTestResultName.data)
    } catch (error) {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchCodeHelpData = null;
    }
  }, [])

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

  const onCellClicked = (cell, event) => {
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

    if (rowIndex >= 0 && rowIndex < gridData.length) {
      const rowData = gridData[rowIndex]

      const filteredData = {
        BLNo: rowData.BLNo,
        BLRefNo: rowData.BLRefNo,
        CustName: rowData.CustName,
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
  }

  const handleSaveData = useCallback(async () => {

    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
    if (isAPISuccess === false) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    if (controllers.current && controllers.current.handleSaveData) {
      controllers.current.handleSaveData.abort();
      controllers.current.handleSaveData = null;
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

    controllers.current.handleSaveData = controller;
    setIsAPISuccess(false)

    const requiredColumns = [
      'ItemName',
      'ItemNo',
      'AssetName',
      'UnitName',
      'SMStatusName',
      'ItemClassSName',
    ]

    const columnsU = [
      'FactUnitName',
      'FactUnit',
      'DeptName',
      'WorkDate',
      'DelvNo',
      'ItemName',
      'ItemNo',
      'Spec',
      'ProcName',
      'QCNo',
      'ReqQty',
      'ReqInQty',
      'OKQty',
      'RemainQty',
      'BadQty',
      'EmpName',
      'SMTestResultName',
      'TestEndDate',
      'LOTNo',
      'FromSerial',
      'DeptSeq',
      'ProcSeq',
      'SourceSeq',
      'SourceType',
      'ItemSeq',
      'QCSeq',
      'SMTestResult',
      'EmpSeq',
      'IDX_NO'
    ]

    const columnsA = [
      'FactUnitName',
      'FactUnit',
      'DeptName',
      'WorkDate',
      'DelvNo',
      'ItemName',
      'ItemNo',
      'Spec',
      'ProcName',
      'QCNo',
      'ReqQty',
      'ReqInQty',
      'OKQty',
      'RemainQty',
      'BadQty',
      'EmpName',
      'SMTestResultName',
      'TestEndDate',
      'LOTNo',
      'FromSerial',
      'DeptSeq',
      'ProcSeq',
      'SourceSeq',
      'SourceType',
      'ItemSeq',
      'QCSeq',
      'SMTestResult',
      'EmpSeq',
      'IDX_NO'
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


    const resulU = filterAndSelectColumns(gridData, columnsU, 'U').map(item => ({
          ...item,
          TestEndDate: item.TestEndDate.trim() ? item.TestEndDate : formatDate(dayjs()),
          WorkingTag: 'U'
        }))
        
    const resulA = filterAndSelectColumns(gridData, columnsA, 'A').map(item => ({
          ...item,
          TestEndDate: item.TestEndDate.trim() ? item.TestEndDate : formatDate(dayjs()),
          WorkingTag: 'A'
        }))

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
          promises.push(CreatedOqcListBy(resulA))
        }

        if (resulU.length > 0) {
          promises.push(CreatedOqcListBy(resulU))
        }

        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.data.success) {
            if (index === 0) {
              message.success('Thêm thành công!')
            } else {
              message.success('Cập nhật  thành công!')
            }

            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            resetTable()
          } else {
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.data)
            setIsModalVisible(true)
            message.error('Có lỗi xảy ra khi lưu dữ liệu')
          }
        })
      } catch (error) {
        setIsLoading(false)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
      finally{
        setIsAPISuccess(true)
        fetchGetListQcTestReportBatch()
        controllers.current.fetchData = null
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
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

    const fetchGetListQcTestReportBatch = useCallback(async () => {

      setLoading(true)
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      if (!isAPISuccess) {
        message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
        return
      }
      if (controllers.current.fetchGetListQcTestReportBatch) {
        controllers.current.fetchGetListQcTestReportBatch.abort();
        controllers.current.fetchGetListQcTestReportBatch = null;
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }
      const controller = new AbortController();
      const signal = controller.signal;
  
      controllers.current.fetchGetListQcTestReportBatch = controller;
      setIsAPISuccess(false)
      try {
        const selectData = dataSelect.map(item => {
          const cleanedQCDate = item.TestEndDate.trim() ? item.TestEndDate : formatDate(dayjs());
          return {
            ...item,
            QCDate: cleanedQCDate
          }
        })
        const response = await GetListOqcTestReportResult(selectData) 
        if (response.success) {
          const qcListQcTestReport = response.data.data || []
          const gridData = qcListQcTestReport.map(item => {
            if (item.EmpName === '' || item.EmpSeq === 0) {
              item.EmpName = QCEmployee.UserName
              item.EmpSeq = QCEmployee.UserSeq
            }
            return item
          })
          
          
          setGridData(gridData)
          setNumRows(gridData.length)
        }
      } catch (error) {
        console.log('error', error)
      } finally {
        setLoading(false)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        controllers.current.fetchGetListQcTestReportBatch = null;
      }
    }, [dataSelect, isAPISuccess])

    useEffect(() => {
      if (dataSelect) {
        fetchGetListQcTestReportBatch()
      }
    }, [])

  const onClickReset = () => {
    fetchGetListQcTestReportBatch()
  }

  return (
    <>
      <Helmet>
        <title>ITM - {t('800000112')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000112')}
              </Title>
              <IqcOutsourceReqListDetailsActions
                onClickReset= {onClickReset}
                onClickSave = {handleSaveData}
              />
            </div>
            
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableOqcDetailsListReq
              dataSMTestResultName = {dataSMTestResultName}
              dataUser = {dataUser}
              onCellClicked={onCellClicked}
              setSelection={setSelection}
              selection={selection}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              setEditedRows={setEditedRows}
              editedRows={editedRows}
              setNumRowsToAdd={setNumRowsToAdd}
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
              canEdit={canEdit}
            />
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        columns={columnsError}
      />
      <ModalSheetDelete
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        confirm={handleDeleteDataSheet}
      />
    </>
  )
}
