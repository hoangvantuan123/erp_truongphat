import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, Layout } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { filterAndSelectColumnsA } from '../../../utils/filterA'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { checkActionPermission } from '../../../permissions'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { GetAllRootMenus } from '../../../features/system/getRootMenu'
import { DeleteRootMenus } from '../../../features/system/deleteRootMenus'
import RootMenuManagementActions from '../../components/actions/system/rootMenuManagementActions'
import TableRootMenuManagement from '../../components/table/system/tableRootMenuManagement'
import { PostUpdateRootMenu } from '../../../features/system/postUpdateRootMenu'
import { PostAddRootMenu } from '../../../features/system/postAddRootMenu'
const defaultCols = [
  {
    title: '#',
    id: 'Status',
    kind: 'Text',
    readonly: true,
    width: 50,
    hasMenu: true,
    visible: true
  },
  {
    title: 'Key',
    id: 'Key',
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
    title: 'Label',
    id: 'Label',
    kind: 'Text',
    readonly: false,
    width: 250,
    hasMenu: true,
    visible: true,
    trailingRowOptions: {
      disabled: true,
    },
  },
  {
    title: 'LabelSeq',
    id: 'LabelSeq',
    kind: 'Text',
    readonly: false,
    width: 250,
    hasMenu: true,
    visible: true,
    trailingRowOptions: {
      disabled: true,
    },
  },
  {
    title: 'Link',
    id: 'Link',
    kind: 'Text',
    readonly: false,
    width: 250,
    hasMenu: true,
    visible: true,
    trailingRowOptions: {
      disabled: true,
    },
  },
  {
    title: 'Icon',
    id: 'Icon',
    kind: 'Text',
    readonly: false,
    width: 250,
    hasMenu: true,
    visible: true,
    trailingRowOptions: {
      disabled: true,
    },
  }
]
import TopLoadingBar from 'react-top-loading-bar';
export default function RootMenuTechnique({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests
}) {
  const loadingBarRef = useRef(null);
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [menus, setMenus] = useState([])
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)

  const [isCellSelected, setIsCellSelected] = useState(false)
  const [isCell, setIsCell] = useState(null)
  const [onSelectRow, setOnSelectRow] = useState([])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_ROOT_MENU',
      defaultCols.filter((col) => col.visible)
    )
  )
  const [languageSeq, setLanguage] = useState(() => {
    return parseInt(localStorage.getItem('language'), 10) || 6;
  });
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const fieldsToTrack = ['Key', 'Label', 'Link', 'Icon']
  const { filterValidEntries, findLastEntry, findMissingIds } = useDynamicFilter(
    gridData,
    fieldsToTrack
  )
  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty()
    })
  }

  useEffect(() => {
    cancelAllRequests();
    message.destroy();
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchData) {
      controllers.current.fetchData.abort();
      controllers.current.fetchData = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchData = controller;

    try {
      const response = await GetAllRootMenus(languageSeq, signal)

      if (response.success) {
        const fetchedData = response.data.data || []
        const emptyData = generateEmptyData(50, defaultCols)
        setGridData([...fetchedData, ...emptyData])
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        setNumRows(fetchedData.length + emptyData.length)
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
      }
    } catch (error) {
      const emptyData = generateEmptyData(50, defaultCols)
      setGridData(emptyData)
      setNumRows(emptyData.length)
    } finally {
      setLoading(false)
      controllers.current.fetchData = null;
    }
  }, [languageSeq])
  useEffect(() => {
    fetchData()
  }, [])
  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }

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

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
  )

  const handleDeleteDataSheet = useCallback(
    (e) => {
      if (canDelete === false) {
        message.warning('Bạn không có quyền xóa dữ liệu')
        return
      }
      const selectedRows = getSelectedRows()
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }
      const idsWithStatusD = selectedRows
        .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D')
        .map((row) => {
          row.Status = 'D'
          return row.Id
        })

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

      if (idsWithStatusD.length > 0) {
        DeleteRootMenus(idsWithStatusD)
          .then((response) => {
            if (response.data.success) {
              const remainingRows = gridData.filter((row) => !idsWithStatusD.includes(row.Id))
              setGridData(remainingRows)
              setNumRows(remainingRows.length)
              resetTable()
              if (loadingBarRef.current) {
                loadingBarRef.current.complete();
              }
            } else {
              message.error(response.data.message || 'Xóa thất bại!')
            }
          })
          .catch((error) => {
            message.error('Có lỗi xảy ra khi xóa!')
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)

        const remainingRows = gridData.filter((row) => !idsWithStatusA.includes(row.Id))
        const remainingEditedRows = editedRows.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow.Id)
        )
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        setEditedRows(remainingEditedRows)
        setGridData(remainingRows)
        setNumRows(remainingRows.length)
        resetTable()
      }
    },
    [gridData, selection, editedRows]
  )

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
    if (cell.length >= 2 && cell[0] === 1) {
      setIsCellSelected(true)
    } else {
      setIsCellSelected(false)
      setIsMinusClicked(false)
      setLastClickedCell(null)
      setClickedRowData(null)
    }

    if (lastClickedCell && lastClickedCell[0] === cell[0] && lastClickedCell[1] === cell[1]) {
      setIsCellSelected(false)
      setIsMinusClicked(false)
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    let rowIndex

    if (cell[0] !== -1) {
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClicked(true)
    } else {
      rowIndex = cell[0]
      setIsMinusClicked(false)
    }

    if (rowIndex >= 0 && rowIndex < menus.length) {
      const rowData = menus[rowIndex]
      setClickedRowData(rowData)
      setLastClickedCell(cell)
    }
  }

  const handleSaveData = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
    const columnsU = ['Id', 'Key', 'LabelSeq', 'Label', 'Link', 'Icon']
    const columnsA = ['Key', 'Label', 'Link', 'Icon', 'LabelSeq']
    const processedGridData = gridData.map((row) => ({
      ...row,
      LabelSeq: row.LabelSeq === undefined ? 0 : row.LabelSeq,
      OrderSeq: row.OrderSeq === undefined ? 0 : row.OrderSeq,
    }));
    const resulU = filterAndSelectColumns(processedGridData, columnsU, 'U')
    const resulA = filterAndSelectColumns(processedGridData, columnsA, 'A')

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }

    const missingIds = findMissingIds(lastEntry)
    setEmptyWordIds(missingIds)
    if (missingIds.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!'
      )
      return
    }
    if (isSent) return
    setIsSent(true)

    if (resulA.length > 0 || resulU.length > 0) {
      const loadingMessage = message.loading('Đang thực hiện lưu dữ liệu...')

      try {
        const promises = []

        if (resulA.length > 0) {
          promises.push(PostAddRootMenu(resulA))
        }

        if (resulU.length > 0) {
          promises.push(PostUpdateRootMenu(resulU))
        }



        await Promise.all(promises)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        setEditedRows([])
        resetTable()
        fetchData()
      } catch (error) {
        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      message.warning('Không có dữ liệu để lưu!')
    }
  }, [gridData])


  const handleRestSheet = useCallback(async () => {
    fetchData();
    setEditedRows([]);
    resetTable();
  }, [defaultCols, gridData]);

  return (
    <>
      <Helmet>
        <title>ITM - {t('850000020')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 p-2 col-end-5 row-start-1 w-full">
            <div className="flex items-end justify-end">
              <RootMenuManagementActions
                openModal={openModal}
                handleDeleteDataSheet={handleDeleteDataSheet}
                data={menus}
                handleSaveData={handleSaveData}
                setNumRowsToAdd={setNumRowsToAdd}
                setClickCount={setClickCount}
                numRowsToAdd={numRowsToAdd}
              />
            </div>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 border-t overflow-auto relative">
            <TableRootMenuManagement
              data={gridData}
              onCellClicked={onCellClicked}
              setSelection={setSelection}
              selection={selection}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              setAddedRows={setAddedRows}
              addedRows={addedRows}
              setEditedRows={setEditedRows}
              editedRows={editedRows}
              setNumRowsToAdd={setNumRowsToAdd}
              clickCount={clickCount}
              numRowsToAdd={numRowsToAdd}
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
              handleRowAppend={handleRowAppend}
              cols={cols}
              defaultCols={defaultCols}
              canEdit={canEdit}
              canCreate={canCreate}
              handleRestSheet={handleRestSheet}
            />
          </div>
        </div>
      </div>
    </>
  )
}
