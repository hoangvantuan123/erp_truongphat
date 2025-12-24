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
import { SearchAdmMultiOrdObj } from '../../../features/mgn-hr/hr-adm-ord/searchAdmMultiOrdObj'
import HrEduTypeAction from '../../components/actions/hrEdu/hrEduTypeAction'
import HrEduTypeQuery from '../../components/query/hrEdu/hrEduTypeQuery'
import TableHrEduType from '../../components/table/hrEdu/tableHrEduType'
import ModalConfirm from '../../components/modal/transReqMat/modalConfirm'
import { searchEduType } from '../../../features/mgn-hr/hr-edu/searchEduType'
import { auHrEduType } from '../../../features/mgn-hr/hr-edu/AuHrEduType'
import { deleteHrEduType } from '../../../features/mgn-hr/hr-edu/deleteHrEduType'
export default function HrEduType({
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
        readonly: false,
        width: 50,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderLookup,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('1092'),
        id: 'EduTypeSeq',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
          textHeader: '#DD1144',
        },
      },
      {
        title: t('1091'),
        id: 'EduTypeName',
        kind: 'Text',
        readonly: false,
        width: 200,
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
        title: t('1086'),
        id: 'UMEduGrpType',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('1085'),
        id: 'UMEduGrpTypeName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('358'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('327'),
        id: 'DispSeq',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
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

  const [EduGrpData, setEduGrpData] = useState([])

  const [ordSeq, setOrdSeq] = useState('')
  const [EmpSeq, setEmpSeq] = useState('')
  const [ToOrdDate, setToOrdDate] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')
  const [PosSeq, setPosSeq] = useState('')
  const [UMWsSeq, setUMWsSeq] = useState('')
  const [PtSeq, setPtSeq] = useState('')
  const [PuSeq, setPuSeq] = useState('')
  const [UMPgSeq, setUMPgSeq] = useState('')
  const [UMJpSeq, setUMJpSeq] = useState('')
  const [EntRetTypeSeq, setEntRetTypeSeq] = useState('')
  const [UMJoSeq, setUMJoSeq] = useState('')
  const [UMJdSeq, setUMJdSeq] = useState('')
  const [FrOrdDate, setFrOrdDate] = useState(dayjs())
  const [IsLast, setIsLast] = useState(false)

  const [EduGrpType, setEduGrpType] = useState('')
  const [EduGrpName, setEduGrpName] = useState('')

  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')

  const [modalDeleteSheetConfirm, setModalDeleteSheetConfirm] = useState(false)

  const [selectedRows, setSelectedRows] = useState([])

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

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'HR_EDU_TYPE',
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
      const [EduGrpDataRes] = await Promise.all([
        GetCodeHelpCombo('', 6, 19999, 1, '%', '3908', '', '', '', signal),
      ])

      setEduGrpData(EduGrpDataRes.data)
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
          EduTypeName: EduGrpName,
          UMEduGrpType: EduGrpType,
        },
      ]

      const response = await searchEduType(data)
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
  }, [EduGrpType, EduGrpName])

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

    const requiredColumns = ['EduTypeName']

    const columns = [
      'IdxNo',
      'EduTypeSeq',
      'EduTypeName',
      'UMEduGrpType',
      'UMEduGrpTypeName',
      'Remark',
      'DispSeq',
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

      promises.push(auHrEduType(data))

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
          const newData = result?.data?.logs1;
          setGridData((prev) => {
            const updated = prev.map((item) => {
              const found = newData.find((x) => x?.IDX_NO === item?.IdxNo)

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

          setIsSent(false)
          setEditedRows([])
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
  }, [editedRows, gridData])

  const onClickDeleteSheet = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền xóa dữ liệu')
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

    const rowsWithStatusD = selected
      .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D')
      .map((row) => ({
        ...row,
        WorkingTag: 'D',
      }))

    try {
      const promises = []
      if (resulD.length > 0) {
        promises.push(deleteHrEduType(resulD))
        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.success) {
            if (index === 0) {
              message.success('Xóa thành công!')
            }

            setIsSent(false)
            setEditedRows([])
            resetTable()

            const deletedIds = rowsWithStatusD.map((item) => item.IdxNo)
            const updatedData = gridData.filter(
              (row) => !deletedIds.includes(row.IdxNo),
            )
            setGridData(updateIndexNo(updatedData))
            setNumRows(updatedData.length)
          } else {
            setIsSent(false)
            setModal2Open(true)
            setErrorData(result.data.errors)
            message.error('Có lỗi xảy ra khi xóa dữ liệu')
          }
        })
      }
    } catch (error) {
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi xóa dữ liệu')
    } finally {
      setModalDeleteSheetConfirm(false)
      setIsAPISuccess(true)
      controllers.current.onClickDelete = null
    }
  }, [gridData, editedRows, selected, modalDeleteSheetConfirm])

  const handleOpenDeleteDataSheet = useCallback(() => {
    if (selected.length > 0) {
      setModalDeleteSheetConfirm(true)
    } else {
      message.warning('Chọn dữ liệu để xóa')
    }
  }, [selected, modalDeleteSheetConfirm])

  return (
    <>
      <Helmet>
        <title>ITM - {t('10040521')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('10040521')}
              </Title>
              <HrEduTypeAction
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                handleSearch={onClickSearch}
                handleExternalSubmit={onClickSave}
                handleOpenDeleteDataSheet={handleOpenDeleteDataSheet}
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
              <HrEduTypeQuery
                EduGrpData={EduGrpData}
                setEduGrpData={setEduGrpData}
                EduGrpType={EduGrpType}
                setEduGrpType={setEduGrpType}
                EduGrpName={EduGrpName}
                setEduGrpName={setEduGrpName}
              />
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableHrEduType
              EduGrpData={EduGrpData}
              setEduGrpData={setEduGrpData}
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
