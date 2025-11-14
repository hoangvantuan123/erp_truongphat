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

import HrDaDeptActions from '../../components/actions/hr-da-dept/hrDaDeptActions'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import {
  validateCheckColumns,
  validateColumns,
} from '../../../utils/validateColumns'
import HrLaborContractQuery from '../../components/query/hrCertificate/hrLaborContractQuery'
import TableLaborContract from '../../components/table/hr-certificate/tableHrLaborContract'
import { SearchLaborContract } from '../../../features/mgn-hr/hr-certificate/searchLaborContract'
import { AuLaborContract } from '../../../features/mgn-hr/hr-certificate/AuLaborContract'
import { DeleteLaborContract } from '../../../features/mgn-hr/hr-certificate/deleteLaborContract'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
export default function HrLaborContract({
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
        title: t('1452'),
        id: 'EmpSeq',
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
        title: t('1480'),
        id: 'EmpName',
        kind: 'Custom',
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
        title: t('712'),
        id: 'DeptName',
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
        title: t('588'),
        id: 'ContractNo',
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
        title: t('493'),
        id: 'ContractKindName',
        kind: 'Custom',
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
        title: t('493'),
        id: 'ContractKind',
        kind: 'Custom',
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
        title: t('28782'),
        id: 'FromDate',
        kind: 'Text',
        readonly: false,
        width: 150,
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
        title: t('28783'),
        id: 'ToDate',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('127'),
        id: 'ContractDate',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
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
  const [SMOrdAppData, setSMOrdAppData] = useState(null)
  const [ContractKindData, setContractKindData] = useState(null)
  const [UMOrdTypeSeq, setUMOrdTypeSeq] = useState('')
  const [OrdName, setOrdName] = useState('')
  const [SMOrdAppSeq, setSMOrdAppSeq] = useState('')

  const [empSeq, setEmpSeq] = useState(0)
  const [empID, setEmpID] = useState('')
  const [empName, setEmpName] = useState('')
  const [contractKind, setContractKind] = useState('')
  const [ContractKindName, setContractKindName] = useState('')
  const [fromDateQ, setFromDateQ] = useState('')
  const [toDateQ, setToDateQ] = useState('')

  const [helpData08, setHelpData08] = useState([])
  const [helpData09, setHelpData09] = useState([])
  const [helpData12, setHelpData12] = useState([])

  const [editedRows, setEditedRows] = useState([])

  const [FactUnit, setFactUnit] = useState('')
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [hrAdmOrdSelected, setHrAdmOrdSelected] = useState([])

  const formatDate = (date) => date.format('YYYYMMDD')
  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'HR_LABOR_CONTRACT',
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
      const [EmpData,  ContractKindData] = await Promise.all(
        [
          GetCodeHelpVer2(
            10009,
            '',
            '',
            '',
            '',
            '',
            '1',
            '',
            50,
            '',
            0,
            0,
            0,
          ),

          GetCodeHelpCombo('', 6, 19998, 1, '%', '1000447', '', '', '', signal),
        ],
      )

      setEmpData(EmpData.data || [])
      setContractKindData(ContractKindData.data || [])
    } catch {
      setEmpData([])
      setContractKindData([])
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

  const fieldsToTrack = [
    'IdxNo',
    'EmpSeq',
    'EmpName',
    'ContractNo',
    'FromDate',
  ]

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
          EmpSeq: empSeq,
          ContractKind: contractKind,
          FromDateQ: formatDateSearch(fromDateQ),
          ToDateQ: formatDateSearch(toDateQ),
        },
      ]

      const response = await SearchLaborContract(data)
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
  }, [empSeq, contractKind, fromDateQ, toDateQ])

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

    const requiredColumns = [
      'EmpName',
      'ContractKindName',
      'FromDate'

    ]

    const columns = [
        'IdxNo',
        'EmpSeq',
        'EmpName',
        'DeptName',
        'ContractNo',
        'ContractKindName',
        'FromDate',
        'ToDate',
        'Remark',
        'ContractDate',
        'ContractKind',
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
        ContractKindName: t('493'),
        FromDate: t('28782'),

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

    try {
      const promises = []

      promises.push(AuLaborContract(data))

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
  }, [editedRows, isAPISuccess, empSeq, contractKind, fromDateQ, toDateQ, gridData])

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

    const resulD = hrAdmOrdSelected.map((row) => ({
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
        promises.push(DeleteLaborContract(resulD))
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
    } finally {
      onClickSearch()
      setIsAPISuccess(true)
      setModalOpen(false)
      controllers.current.onClickDeleteSheet = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [gridData, hrAdmOrdSelected, editedRows, isAPISuccess, modalOpen])

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
            setHrAdmOrdSelected(getSelectedRowsData())
          } else {
            newSelected = selection.rows.add(rowIndex)
            setHrAdmOrdSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRowsData, hrAdmOrdSelected],
  )

  return (
    <>
      <Helmet>
        <title>HPM - {t('110001417')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 uppercase opacity-85 ">
                {t('110001417')}
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
                <HrLaborContractQuery
                  dataUser={EmpData}
                  ContractKindData={ContractKindData}
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
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableLaborContract
              dataUser={EmpData}
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
