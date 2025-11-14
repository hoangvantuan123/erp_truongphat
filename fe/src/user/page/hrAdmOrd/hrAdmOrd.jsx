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
import HrAdmOrdQuery from '../../components/query/hrAdmOrd/hrAdmOrdQuery'
import TableHrAdmOrd from '../../components/table/hr-adm-ord/tableHrAdmOrd'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { SearchAdmOrd } from '../../../features/mgn-hr/hr-adm-ord/searchAdmOrd'
import { AuHrAdmOrd } from '../../../features/mgn-hr/hr-adm-ord/AuHrAdmOrd'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { DeleteHrAdmOrd } from '../../../features/mgn-hr/hr-adm-ord/deleteHrAdmOrd'
import {
  validateCheckColumns,
  validateColumns,
} from '../../../utils/validateColumns'
export default function HrAdmOrd({
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
        title: t('13623'),
        id: 'OrdName',
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
        title: t('992'),
        id: 'UMOrdTypeName',
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
        title: t('1438'),
        id: 'SMOrdAppName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('553'),
        id: 'UMWsName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('7725'),
        id: 'IsPaid',
        kind: 'Boolean',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('10235'),
        id: 'IsExAvgPay',
        kind: 'Boolean',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('4320'),
        id: 'IsExWkTerm',
        kind: 'Boolean',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('327'),
        id: 'DispSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('13628'),
        id: 'OrdSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('5516'),
        id: 'UMOrdTypeSeq',
        kind: 'Custom',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('5517'),
        id: 'SMOrdAppSeq',
        kind: 'Custom',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: false,
        },
      },
      {
        title: t('4303'),
        id: 'UMWsSeq',
        kind: 'Custom',
        readonly: true,
        width: 100,
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

  const [UMOrdTypeData, setUMOrdTypeData] = useState(null)
  const [SMOrdAppData, setSMOrdAppData] = useState(null)
  const [UMWsData, setUMWsData] = useState(null)
  const [UMOrdTypeName, setUMOrdTypeName] = useState('')
  const [UMOrdTypeSeq, setUMOrdTypeSeq] = useState('')
  const [OrdName, setOrdName] = useState('')
  const [SMOrdAppName, setSMOrdAppName] = useState('')
  const [SMOrdAppSeq, setSMOrdAppSeq] = useState('')

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
      'HR_ADM_ORD',
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
      const [UMOrdTypeNameData, SMOrdAppNameData, UMWsData] = await Promise.all(
        [
          GetCodeHelpVer2(
            19999,
            '',
            '3088',
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
            19998,
            '',
            '3058',
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

          GetCodeHelpCombo('', 6, 19999, 1, '%', '3001', '', '', '', signal),
        ],
      )

      setUMOrdTypeData(UMOrdTypeNameData.data || [])
      setSMOrdAppData(SMOrdAppNameData.data || [])
      setUMWsData(UMWsData.data || [])
    } catch {
      setUMOrdTypeData([])
      setSMOrdAppData([])
      setUMWsData([])
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
    'OrdName',
    'UMOrdTypeName',
    'SMOrdAppName',
    'UMWsName',
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

  useEffect(() => {
    onClickSearch()
  }, [])

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
          UMOrdTypeSeq: UMOrdTypeSeq,
          SMOrdAppSeq: SMOrdAppSeq,
          OrdName: OrdName,
        },
      ]

      const response = await SearchAdmOrd(data)
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
  }, [UMOrdTypeSeq, SMOrdAppSeq, OrdName])

  const onClickSave = useCallback(async () => {
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
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }

    const requiredColumns = [
      'OrdName',
      'UMOrdTypeName',
      'SMOrdAppName',
      'UMWsName',
    ]

    const columns = [
      'IdxNo',
      'Seq',
      'OrdName',
      'UMOrdTypeName',
      'SMOrdAppName',
      'UMWsName',
      'IsPaid',
      'IsExAvgPay',
      'IsExWkTerm',
      'DispSeq',
      'OrdSeq',
      'UMOrdTypeSeq',
      'SMOrdAppSeq',
      'UMWsSeq',
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
        OrdName: t('13623'),
        UMOrdTypeName: t('992'),

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

      promises.push(AuHrAdmOrd(data))

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
        promises.push(DeleteHrAdmOrd(resulD))
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
  }, [gridData, hrAdmOrdSelected, editedRows])

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
        <title>HPM - {t('10040506')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 uppercase opacity-85 ">
                {t('10040506')}
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
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
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
                <HrAdmOrdQuery
                  UMOrdTypeData={UMOrdTypeData}
                  SMOrdAppData={SMOrdAppData}
                  UMOrdTypeName={UMOrdTypeName}
                  setUMOrdTypeName={setUMOrdTypeName}
                  UMOrdTypeSeq={UMOrdTypeSeq}
                  setUMOrdTypeSeq={setUMOrdTypeSeq}
                  OrdName={OrdName}
                  setOrdName={setOrdName}
                  SMOrdAppName={SMOrdAppName}
                  setSMOrdAppName={setSMOrdAppName}
                  SMOrdAppSeq={SMOrdAppSeq}
                  setSMOrdAppSeq={setSMOrdAppSeq}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableHrAdmOrd
              UMOrdTypeData={UMOrdTypeData}
              SMOrdAppData={SMOrdAppData}
              UMWsData={UMWsData}
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
    </>
  )
}
