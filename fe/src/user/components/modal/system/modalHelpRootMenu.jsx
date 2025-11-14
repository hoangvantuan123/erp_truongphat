import ReactDOM from 'react-dom'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Modal, Button, Input, Drawer, Checkbox } from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  TableOutlined,
} from '@ant-design/icons'
import { SearchRootMenu } from '../../../../features/system/searchRootMenus'
import { ArrowIcon } from '../../icons'
import {
  loadFromLocalStorageSheet,
  saveToLocalStorageSheet,
} from '../../../../localStorage/sheet/sheet'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useLayer } from 'react-laag'
import {
  DataEditor,
  GridCellKind,
  CompactSelection,
} from '@glideapps/glide-data-grid'
import { SearchMenus } from '../../../../features/system/searchMenus'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'

const { Search } = Input

const defaultCols = [
  {
    title: '#',
    id: 'Status',
    kind: 'Text',
    readonly: true,
    width: 50,
    hasMenu: true,
  },
  {
    title: 'Key',
    id: 'Key',
    kind: 'Text',
    readonly: false,
    width: 120,
    hasMenu: true,
  },
  {
    title: 'Label',
    id: 'Label',
    kind: 'Text',
    readonly: false,
    width: 120,
    hasMenu: true,
  },
]

export default function ModalHelpRootMenu({
  openHelp,
  setOpenHelp,
  setOnSelectRow,
  keySearchText,
  setKeySearchText,
  typeSearch,
  setTypeSearch,
  setDataSearch,
  dataSearch,
}) {
  const gridRef = useRef(null)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet('S_ERP_COLS_HELP_ROOT_MENU', defaultCols),
  )
  const [open, setOpen] = useState(false)
  const [numRows, setNumRows] = useState(0)
  const onFill = useOnFill(setDataSearch, cols)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [hiddenColumns, setHiddenColumns] = useState(
    loadFromLocalStorageSheet('H_ERP_COLS_HELP_ROOT_MENU', []),
  )
  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  const [showSearch, setShowSearch] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const onHeaderMenuClick = useCallback(
    (col, bounds) => {
      if (cols[col]?.id === 'Status') {
        setShowMenu({
          col,
          bounds,
          menuType: 'statusMenu',
        })
      } else {
        setShowMenu({
          col,
          bounds,
          menuType: 'defaultMenu',
        })
      }
    },
    [cols],
  )

  const getData = useCallback(
    ([col, row]) => {
      const person = dataSearch[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''

      return {
        kind: GridCellKind.Text,
        data: value,
        displayData: String(value),
        readonly: true,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
      }
    },
    [dataSearch, cols],
  )

  const onColumnResize = useCallback(
    (column, newSize) => {
      const index = cols.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...cols]
        newCols.splice(index, 1, newCol)
        setCols(newCols)
      }
    },
    [cols],
  )

  const handleSort = (columnId, direction) => {
    setDataSearch((prevData) => {
      const sortedData = [...prevData].sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1
        return 0
      })
      return sortedData
    })
    setShowMenu(null)
  }

  const handleHideColumn = (colIndex) => {
    const columnId = cols[colIndex]?.id
    if (cols.length > 1) {
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_HELP_ROOT_MENU', newHidden)
        return newHidden
      })
      setCols((prevCols) => {
        const newCols = prevCols.filter((_, idx) => idx !== colIndex)
        saveToLocalStorageSheet('S_ERP_COLS_HELP_ROOT_MENU', newCols)
        return newCols
      })
      setShowMenu(null)
    }
  }

  const handleReset = () => {
    setCols(defaultCols)
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_HELP_ROOT_MENU')
    localStorage.removeItem('H_ERP_COLS_HELP_ROOT_MENU')
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_HELP_ROOT_MENU', updatedCols)
      return updatedCols
    })
  }, [])

  const handleCheckboxChange = (columnId, isChecked) => {
    if (isChecked) {
      const restoredColumn = defaultCols.find((col) => col.id === columnId)
      setCols((prevCols) => {
        const newCols = [...prevCols, restoredColumn]
        saveToLocalStorageSheet('S_ERP_COLS_HELP_ROOT_MENU', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_HELP_ROOT_MENU', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_HELP_ROOT_MENU', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_HELP_ROOT_MENU', newHidden)
        return newHidden
      })
    }
  }

  const handleCloseHelp = () => {
    setOpenHelp(false)
    setKeySearchText('')
    setTypeSearch('')
    setShowMenu(null)
    resetTable()
    setDataSearch([])
    setNumRows(0)
  }

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key === 'q') {
        handleCloseHelp()
      }
    },
    [handleCloseHelp],
  )

  const handleSearchRootMenu = async () => {
    try {
      const response = await SearchRootMenu(keySearchText, ['Label', 'Key'])
      if (response.success) {
        setDataSearch(response.data.data)
        setNumRows(response.data.data.length)
      }
    } catch (error) {
      setDataSearch([])
    }
  }

  const handleSearchSubRootMenu = async () => {
    try {
      const response = await SearchMenus(keySearchText, ['Label', 'Key'])
      if (response.success) {
        setDataSearch(response.data.data)
        setNumRows(response.data.data.length)
      }
    } catch (error) {
      setDataSearch([])
    }
  }

  const handleSearch = () => {
    switch (typeSearch) {
      case 'MenuRootName':
        handleSearchRootMenu()
        break
      case 'MenuSubRootName':
        handleSearchSubRootMenu()
        break
      default:
        break
    }
  }

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (openHelp) {
      switch (typeSearch) {
        case 'MenuRootName':
          handleSearchRootMenu()
          break
        case 'MenuSubRootName':
          handleSearchSubRootMenu()
          break
        default:
          break
      }
    }
  }, [openHelp, typeSearch])

  useEffect(() => {
    if (openHelp) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openHelp, handleKeyDown])

  const onCellClicked = (cell, event) => {
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

    if (
      lastClickedCell &&
      lastClickedCell[0] === cell[0] &&
      lastClickedCell[1] === cell[1]
    ) {
      setOnSelectRow(null)
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    if (rowIndex >= 0 && rowIndex < dataSearch.length) {
      const rowData = dataSearch[rowIndex]
      setOnSelectRow(rowData)
    }
  }

  return (
    <Modal
      width="80%"
      open={openHelp}
      closable={false}
      footer={null}
      centered={true}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {showMenu !== null && (
        <div
          style={{
            position: 'absolute',
            top: showMenu.bounds.y - 40,
            left: showMenu.bounds.x - 190,
            zIndex: 1000,
          }}
          className="border w-72 rounded-lg bg-white shadow-lg cursor-pointer"
        >
          {showMenu.menuType === 'statusMenu' ? (
            <LayoutStatusMenuSheet
              showMenu={showMenu}
              handleSort={handleSort}
              cols={cols}
              setShowSearch={setShowSearch}
              setShowMenu={setShowMenu}
              handleReset={handleReset}
              showDrawer={showDrawer}
            />
          ) : (
            <LayoutMenuSheet
              showMenu={showMenu}
              handleSort={handleSort}
              handleHideColumn={handleHideColumn}
              cols={cols}
              setShowSearch={setShowSearch}
              setShowMenu={setShowMenu}
            />
          )}
        </div>
      )}

      <div
        style={{ display: 'flex', flexDirection: 'column', height: '75vh' }}
        className="gap-4"
      >
        <details
          className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
          open
        >
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
            <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600">
              <FilterOutlined />
              Điều kiện truy vấn
            </h2>
            <span className="relative size-5 shrink-0">
              <ArrowIcon />
            </span>
          </summary>
          <div className="flex p-2 gap-4">
            <div className="flex flex-col w-full">
              <Search
                allowClear
                size="middle"
                placeholder="Tìm kiếm"
                className="w-full"
                value={keySearchText}
                onChange={(e) => setKeySearchText(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <Button
                onClick={handleSearch}
                type="primary"
                icon={<SearchOutlined />}
                size="middle"
              >
                Truy vấn
              </Button>
            </div>
          </div>
        </details>

        <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
          <h2 className="text-xs border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
            <TableOutlined />
            SHEET DATA
          </h2>
          <DataEditor
            ref={gridRef}
            columns={cols}
            getCellContent={getData}
            rows={numRows}
            onFill={onFill}
            showSearch={showSearch}
            onSearchClose={onSearchClose}
            rowMarkers={('checkbox-visible', 'both')}
            width="100%"
            height="100%"
            rowSelect="single"
            gridSelection={selection}
            onGridSelectionChange={setSelection}
            getCellsForSelection={true}
            onCellClicked={onCellClicked}
            trailingRowOptions={{
              hint: ' ',
              sticky: true,
              tint: true,
            }}
            freezeColumns="0"
            getRowThemeOverride={(i) =>
              i % 2 === 0
                ? undefined
                : {
                    bgCell: '#FBFBFB',
                  }
            }
            onPaste={true}
            fillHandle={true}
            isDraggable={false}
            smoothScrollY={true}
            smoothScrollX={true}
            onHeaderMenuClick={onHeaderMenuClick}
            onColumnMoved={onColumnMoved}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-3">
        <Button onClick={() => handleCloseHelp()}>Cancel</Button>
        <Button type="primary" onClick={handleCloseHelp}>
          Save
        </Button>
      </div>
      <Drawer title="CÀI ĐẶT SHEET" onClose={onClose} open={open}>
        {defaultCols.map(
          (col) =>
            col.id !== 'Status' && (
              <div key={col.id} style={{ marginBottom: '10px' }}>
                <Checkbox
                  checked={!hiddenColumns.includes(col.id)}
                  onChange={(e) =>
                    handleCheckboxChange(col.id, e.target.checked)
                  }
                >
                  {col.title}
                </Checkbox>
              </div>
            ),
        )}
      </Drawer>
    </Modal>
  )
}
