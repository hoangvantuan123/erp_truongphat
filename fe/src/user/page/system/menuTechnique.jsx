import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, Layout } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import MenuManagementActions from '../../components/actions/system/menuManagementActions'
import TableMenuManagement from '../../components/table/system/tableMenuManagement'
import DrawerAddMenu from '../../components/drawer/system/addMenu'
import { GetAllMenus } from '../../../features/system/getMenus'
import { DeleteMenus } from '../../../features/system/deleteMenus'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { PostAddMenu } from '../../../features/system/postAddMenu'
import { PostUpdateMenu } from '../../../features/system/postUpdateMenu'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { GetAllRootMenus } from '../../../features/system/getRootMenu'
import { GetAllMenusSubmenu } from '../../../features/system/getMenuSubmenu'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
export default function MenuTechnique({ permissions, isMobile, controllers,
  cancelAllRequests }) {
  const { t } = useTranslation()
  const defaultCols = useMemo(() => [
    {
      title: '',
      id: 'Status',
      kind: 'Text',
      readonly: true,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup
    },
    {
      title: 'OrderSeq',
      id: 'OrderSeq',
      kind: 'Number',
      readonly: false,
      width: 120,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderNumber,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Menu Root ID',
      id: 'MenuRootId',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'MenuRootName',
      id: 'MenuRootName',
      kind: 'Text',
      readonly: false,
      width: 220,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderArray,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'MenuSubRootName',
      id: 'MenuSubRootName',
      kind: 'Text',
      readonly: false,
      width: 240,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderArray,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Menu Sub Root ID',
      id: 'MenuSubRootId',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Key',
      id: 'Key',
      kind: 'Text',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
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
      icon: GridColumnIcon.HeaderString,
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
      icon: GridColumnIcon.HeaderString,
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
      icon: GridColumnIcon.HeaderUri,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Type',
      id: 'Type',
      kind: 'Custom',
      readonly: false,
      width: 140,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    }
  ], [t]);
  const [languageSeq, setLanguage] = useState(() => {
    return parseInt(localStorage.getItem('language'), 10) || 6;
  });

  const loadingBarRef = useRef(null);
  const [loading, setLoading] = useState(false)
  const [menus, setMenus] = useState([])
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
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
  const [onSelectRow, setOnSelectRow] = useState([])
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_MENU',
      defaultCols.filter((col) => col.visible)
    )
  )
  const [keyMenuRoot, setKeyMenuRoot] = useState('')
  const [keyMenuSubRoot, setKeyMenuSubRoot] = useState('')
  const [keyMenuItem, setKeyMenuItem] = useState('')
  const [dataRootMenu, setDataRootMenu] = useState([])
  const [dataSubMenu, setDataSubMenu] = useState([])

  const fetchData = async () => {
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
      const [rootMenusResponse, subMenusResponse] = await Promise.all([
        GetAllRootMenus(languageSeq, signal),
        GetAllMenusSubmenu(languageSeq, signal)
      ])
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      setDataRootMenu(rootMenusResponse.data.data)
      setDataSubMenu(subMenusResponse.data.data)
    } catch (error) {
      setDataRootMenu([])
      setDataSubMenu([])
    } finally {
      setLoading(false)
      controllers.current.fetchData = null;
    }
  }
  useEffect(() => {
    cancelAllRequests();
    message.destroy();
  }, [])
  useEffect(() => {
    fetchData()
  }, [])
  const fetchDataMenus = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchDataMenus) {
      controllers.current.fetchDataMenus.abort();
      controllers.current.fetchDataMenus = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchDataMenus = controller;


    try {

      const response = await GetAllMenus(languageSeq, signal)
      if (response.success) {
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        const fetchedData = response.data.data || []
        const emptyData = generateEmptyData(50, defaultCols)
        setGridData([...fetchedData, ...emptyData])
        setNumRows(fetchedData.length + emptyData.length)
        resetTable()

      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
      }
    } catch (error) {
      setMenus([])
    } finally {
      controllers.current.fetchDataMenus = null;
      setLoading(false)
    }
  }, [languageSeq])


  useEffect(() => {
    fetchDataMenus()
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
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )



  const handleDeleteDataSheet = useCallback(
    (e) => {
      const selectedRows = getSelectedRows();

      const idsWithStatusD = selectedRows
        .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D')
        .map(row => {
          row.Status = 'D';
          return row.Id;
        });

      const rowsWithStatusA = selectedRows.filter(row => row.Status === 'A');

      if (idsWithStatusD.length > 0) {
        DeleteMenus(idsWithStatusD)
          .then(response => {
            if (response.data.success) {
              const remainingRows = gridData.filter(row => !idsWithStatusD.includes(row.Id));
              setGridData(remainingRows);
              setNumRows(remainingRows.length);
            } else {

              message.error(response.data.message || 'Xóa thất bại!');
            }
          })
          .catch(error => {
            message.error('Có lỗi xảy ra khi xóa!');
          });
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map(row => row.Id);

        const remainingRows = gridData.filter(row => !idsWithStatusA.includes(row.Id));
        setGridData(remainingRows);
        setNumRows(remainingRows.length);
      }
    },
    [gridData, selection]
  );





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

    if (
      lastClickedCell &&
      lastClickedCell[0] === cell[0] &&
      lastClickedCell[1] === cell[1]
    ) {
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

  const handleSaveData = async () => {
    const columnsU = [
      'Id',
      'Key',
      'Label',
      'Link',
      'MenuRootId',
      'MenuSubRootId',
      'Type',
      'OrderSeq',
      'LabelSeq'
    ]
    const columnsA = [
      'Key',
      'Label',
      'Link',
      'MenuRootId',
      'MenuSubRootId',
      'Type',
      'OrderSeq',
      'LabelSeq'
    ]
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    togglePageInteraction(true)

    const processedGridData = gridData.map((row) => ({
      ...row,
      LabelSeq: row.LabelSeq === undefined ? 0 : row.LabelSeq,
      OrderSeq: row.OrderSeq === undefined ? 0 : row.OrderSeq,
    }));
    const resulU = filterAndSelectColumns(processedGridData, columnsU, 'U')
    const resulA = filterAndSelectColumns(processedGridData, columnsA, 'A')

    if (isSent) return
    setIsSent(true)

    if (resulA.length > 0 || resulU.length > 0) {
      const loadingMessage = message.loading('Đang thực hiện lưu dữ liệu...')

      try {
        const promises = []

        if (resulA.length > 0) {
          promises.push(PostAddMenu(resulA))
        }

        if (resulU.length > 0) {
          promises.push(PostUpdateMenu(resulU))
        }

        await Promise.all(promises)

        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        setEditedRows([])
        setAddedRows([])
        fetchDataMenus()
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        togglePageInteraction(false)
        message.success('Lưu dữ liệu thành công!')
      } catch (error) {
        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        togglePageInteraction(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      togglePageInteraction(false)
      message.warning('Không có dữ liệu để lưu!')
    }
  }

  return (
    <>
      <Helmet>
        <title>HPM - {t('Menu Management')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 p-2 col-end-5 row-start-1 w-full">
            <div className="flex items-end justify-end">

              <MenuManagementActions fetchDataMenus={fetchDataMenus} openModal={openModal} handleDeleteDataSheet={handleDeleteDataSheet} data={menus} handleSaveData={handleSaveData} setNumRowsToAdd={setNumRowsToAdd} numRowsToAdd={numRowsToAdd} setClickCount={setClickCount} clickCount={clickCount} handleRowAppend={handleRowAppend}
              />
            </div>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 border-t w-full h-full   overflow-auto">
            <TableMenuManagement
              data={menus} dataRootMenu={dataRootMenu}
              dataSubMenu={dataSubMenu} onCellClicked={onCellClicked} setSelection={setSelection} selection={selection} showSearch={showSearch} setShowSearch={setShowSearch} setAddedRows={setAddedRows} addedRows={addedRows} setEditedRows={setEditedRows} editedRows={editedRows} setNumRowsToAdd={setNumRowsToAdd} clickCount={clickCount} numRowsToAdd={numRowsToAdd} numRows={numRows} onSelectRow={onSelectRow} openHelp={openHelp} setOpenHelp={setOpenHelp} setOnSelectRow={setOnSelectRow} setIsCellSelected={setIsCellSelected} isCellSelected={isCellSelected} setGridData={setGridData} gridData={gridData} setNumRows={setNumRows} setCols={setCols} handleRowAppend={handleRowAppend} cols={cols} defaultCols={defaultCols}
            />
          </div>
        </div>

      </div>
    </>
  )
}
