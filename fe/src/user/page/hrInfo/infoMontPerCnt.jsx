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
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import EmpOrgDeptActions from '../../components/actions/hr-da-dept/empOrgDeptActions'
import InfoPerMonthCntQuery from '../../components/query/hrInfo/infoPerMonthCntQuery'
import { SearchInfoMontPerCnt } from '../../../features/mgn-hr/info-emp/searchInfoMontPerCnt'
import TableInfoMontPerCnt from '../../components/table/hr-info/tableInfoMontPerCnt'
export default function InfoMontPerCnt({
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
        title: t('2942'),
        id: 'GrpName1',
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
        title: t('12306'),
        id: 'GrpName2',
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
        title: t('17184'),
        id: 'PrevMMCnt',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('12869'),
        id: 'CurrEntCnt',
        kind: 'Text',
        readonly: true,
        width: 250,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('12879'),
        id: 'CurrRetCnt',
        kind: 'Text',
        readonly: true,
        width: 250,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('12849'),
        id: 'CurrMMCnt',
        kind: 'Text',
        readonly: true,
        width: 250,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('8820'),
        id: 'DeptFullName',
        kind: 'Text',
        readonly: true,
        width: 250,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
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

  const [GrpSortName1, setGrpSortName1] = useState('')
  const [GrpSortName2, setGrpSortName2] = useState('')
  const [EntRetTypeName, setEntRetTypeName] = useState('')

  const [ym, setYm] = useState(dayjs())
  const [chkOrg, setchkOrg] = useState(false)

  const [orgType, setOrgType] = useState('')

  const [baseDate, setBaseDate] = useState(dayjs())
  const [isDisDate, setIsDisDate] = useState(false)

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
        GrpSortNameData,
        EntRetTypeNameData
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3947', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '3031', '', '', '', signal),
      ])

      setGrpSortNameData(GrpSortNameData?.data || [])
      setEntRetTypeNameData(EntRetTypeNameData?.data || [])
    } catch {
      setGrpSortNameData([])
      setEntRetTypeNameData([])
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
          YM: formatDateSearch(ym || ''),
          GrpSort1: GrpSortName1,
          GrpSort2: GrpSortName2,
          EntRetType: EntRetTypeName,
          chkOrg: chkOrg
        },
      ]

      const dataMontPerCnt = await SearchInfoMontPerCnt(data)

      setGridData(dataMontPerCnt.data || [])
      setNumRows(dataMontPerCnt.data.length || 0)
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
  }, [gridData, ym, GrpSortName1, GrpSortName2, EntRetTypeName, chkOrg, isAPISuccess])

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
    [
      cols,
      setGridData,
      setNumRows,
      setAddedRowsDeptHis,
      numRowsToAddDeptHis,
    ],
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
  }, [ym, GrpSortName1, GrpSortName2, EntRetTypeName, chkOrg, isAPISuccess])


  return (
    <>
      <Helmet>
        <title>HPM - {t('10039353')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('10039353')}
              </Title>
              <EmpOrgDeptActions
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                onClickSearch={onClickSearch}
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
                <InfoPerMonthCntQuery
                  GrpSortNameData={GrpSortNameData}
                  EntRetTypeNameData={EntRetTypeNameData}
                  GrpSortName1={GrpSortName1}
                  setGrpSortName1={setGrpSortName1}
                  GrpSortName2={GrpSortName2}
                  setGrpSortName2={setGrpSortName2}
                  EntRetTypeName={EntRetTypeName}
                  setEntRetTypeName={setEntRetTypeName}
                  ym={ym}
                  setYm={setYm}
                  chkOrg={chkOrg}
                  setchkOrg={setchkOrg}
                  canEdit={canEdit}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableInfoMontPerCnt
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
