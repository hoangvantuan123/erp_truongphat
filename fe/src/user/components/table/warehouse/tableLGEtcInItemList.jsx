import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import { onRowAppended } from '../../sheet/js/onRowAppended'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheetNew from '../../sheet/jsx/layoutStatusMenuNew'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { AsyncDropdownCellRenderer } from '../../sheet/cells/AsyncDropdownCellRenderer'
import axios from 'axios'
import { set } from 'lodash'

function TableLGEtcInItemList({
  data,
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setAddedRows,
  setEditedRows,
  numRowsToAdd,
  onSelectRow,
  setOnSelectRow,
  onCellClicked,
  setIsCellSelected,
  setOpenHelp,
  openHelp,
  clickCount,
  setGridData,
  gridData,
  setNumRows,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  setIsQuery,
  isQuery,
}) {
  // console.log('gridData', gridData)
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [inputHelp, setInputHelp] = useState(null)
  const cellProps = useExtraCells()

  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [isCell, setIsCell] = useState(null)
  const [hiddenColumns, setHiddenColumns] = useState(
    loadFromLocalStorageSheet('H_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', []),
  )
  const [typeSearch, setTypeSearch] = useState('')
  const [keySearchText, setKeySearchText] = useState('')
  const [hoverRow, setHoverRow] = useState(undefined)

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const onHeaderMenuClick = useCallback((col, bounds) => {
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
  }, [])

  const highlightRegions = [
    {
      color: '#E6F6DD', // Màu xanh
      range: {
        x: 0,
        y: gridData.length,
        width: reorderColumns(cols).length,
        height: 1,
      },
    },
  ]

  const [keybindings, setKeybindings] = useState({
    downFill: true,
    rightFill: true,
    selectColumn: false,
  })

  const getData = useCallback(
    ([col, row]) => {
      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''
      const boundingBox = document.body.getBoundingClientRect()

      if (
        columnKey === 'Price' ||
        columnKey === 'Amt' ||
        columnKey === 'Qty' ||
        columnKey === 'ProgressQty' ||
        columnKey === 'NotProgressQty' ||
        columnKey === 'STDQty'
      ) {
        return {
          kind: GridCellKind.Number,
          data: value,
          displayData: new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
          }).format(value),
          readonly: column?.readonly || false,
          contentAlign: 'right',
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'InOutDate') {
        const formattedDate = value
          ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
          : ''
        const isValidDate =
          formattedDate && !isNaN(new Date(formattedDate).getTime())
        return {
          kind: GridCellKind.Text,
          data: value,
          displayData: isValidDate ? formattedDate : '',
          readonly: true,
          allowOverlay: true,
          hasMenu: false,
        }
      }
      return {
        kind: GridCellKind.Text,
        data: value,
        displayData: String(value),
        readonly: true,
        allowOverlay: true,
        hasMenu: false,
      }
    },
    [gridData, cols],
  )

  const onFill = useCallback(
    (start, end, data) => {
      setGridData((prevData) => {
        const newGridData = [...prevData]
        for (let row = start[1]; row <= end[1]; row++) {
          for (let col = start[0]; col <= end[0]; col++) {
            const columnKey = cols[col]?.id || ''
            if (!newGridData[row]) newGridData[row] = {}
            newGridData[row][columnKey] = data
          }
        }

        return newGridData
      })
    },

    [cols],
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

  const { renderLayer, layerProps } = useLayer({
    isOpen: showMenu !== null,
    triggerOffset: 4,
    onOutsideClick: () => setShowMenu(null),
    trigger: {
      getBounds: () => ({
        bottom: (showMenu?.bounds.y ?? 0) + (showMenu?.bounds.height ?? 0),
        height: showMenu?.bounds.height ?? 0,
        left: showMenu?.bounds.x ?? 0,
        right: (showMenu?.bounds.x ?? 0) + (showMenu?.bounds.width ?? 0),
        top: showMenu?.bounds.y ?? 0,
        width: showMenu?.bounds.width ?? 0,
      }),
    },
    placement: 'bottom-start',
    auto: true,
    possiblePlacements: ['bottom-start', 'bottom-end'],
  })

  /* TOOLLS */
  const handleSort = (columnId, direction) => {
    setGridData((prevData) => {
      const sortedData = [...prevData].sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1
        return 0
      })
      return sortedData
    })
    setShowMenu(null)
  }

  // Hàm ẩn cột

  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
      saveToLocalStorageSheet('H_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', uniqueCols)
      return uniqueCols
    })
  }

  const handleHideColumn = (colIndex) => {
    const columnId = cols[colIndex]?.id
    if (cols.length > 1) {
      updateHiddenColumns([columnId])
      setCols((prevCols) => {
        const newCols = prevCols.filter((_, idx) => idx !== colIndex)
        const uniqueCols = newCols.filter(
          (col, index, self) =>
            index === self.findIndex((c) => c.id === col.id),
        )
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_PAGE_ETC_IN_ITEM_LIST')
    localStorage.removeItem('H_ERP_COLS_PAGE_ETC_IN_ITEM_LIST')
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_ETC_IN_ITEM_LIST',
      [],
    ).map((col) => col.id)
    const newInvisibleCols = invisibleCols.filter(
      (col) => !currentVisibleCols.includes(col),
    )
    updateHiddenColumns(newInvisibleCols)
    updateVisibleColumns(
      defaultCols.filter(
        (col) => col.visible && !hiddenColumns.includes(col.id),
      ),
    )
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  const handleCheckboxChange = (columnId, isChecked) => {
    if (isChecked) {
      const restoredColumn = defaultCols.find((col) => col.id === columnId)
      setCols((prevCols) => {
        const newCols = [...prevCols, restoredColumn]
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_ETC_IN_ITEM_LIST', newHidden)
        return newHidden
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '' // Kiểm tra giá trị null hoặc undefined

    const year = parseInt(dateString.substring(0, 4), 10)
    const month = parseInt(dateString.substring(4, 6), 10) - 1 // Tháng trong JavaScript bắt đầu từ 0
    const day = parseInt(dateString.substring(6, 8), 10)

    const date = new Date(year, month, day)

    if (isNaN(date.getTime())) {
      // Kiểm tra ngày hợp lệ bằng getTime()
      return ''
    }

    const formattedYear = date.getFullYear()
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0')
    const formattedDay = String(date.getDate()).padStart(2, '0')

    return `${formattedYear}-${formattedMonth}-${formattedDay}`
  }
  useEffect(() => {
    if (isQuery) {
      gridRef.current.scrollTo(0, 0, 'both', 0, 0, {
        behavior: 'smooth',
        block: 'center',
      })
      setIsQuery(false)
    }
  }, [isQuery])
  const visibleColumns = cols.filter((col) => !hiddenColumns.includes(col.id))
  const visibleHeaders = visibleColumns.map((col) => ({
    id: col.id,
    title: col.title,
  }))

  const formattedData = gridData.map((item) => {
    const newItem = {}
    visibleHeaders.forEach((header) => {
      // Lặp qua mảng header
      if (item[header.id] !== undefined) {
        // Kiểm tra key tồn tại trong item
        if (header.id === 'ReqDate' || header.id === 'CfmDate') {
          newItem[header.title] = formatDate(item[header.id])
        } else if (header.id === 'Status') {
          newItem['Status'] = item[header.id]
        } else {
          newItem[header.title] = item[header.id]
        }
      }
    })
    return newItem
  })

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
        <h2 className="text-xs border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          SHEET DATA
        </h2>
        <DataEditor
          {...cellProps}
          ref={gridRef}
          columns={cols}
          getCellContent={getData}
          onFill={onFill}
          rows={numRows}
          showSearch={showSearch}
          onSearchClose={onSearchClose}
          rowMarkers="both"
          width="100%"
          height="100%"
          rowSelect="single"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          overscrollY={0}
          overscrollX={10}
          smoothScrollX={true}
          smoothScrollY={true}
          trailingRowOptions={{
            hint: '',
            sticky: true,
            tint: true,
          }}
          freezeColumns={3}
          headerHeight={30}
          rowHeight={28}
          getRowThemeOverride={(i) => {
            const row = gridData[i]
            if (!row || Object.keys(row).length === 0) {
              return undefined
            }
            return i === hoverRow
              ? {
                  bgCell: '#f7f7f7',
                  bgCellMedium: '#f0f0f0',
                }
              : i % 2 === 0
                ? undefined
                : {
                    bgCell: '#FBFBFB',
                  }
          }}
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          isDraggable={false}
          onRowAppended={() => handleRowAppend(1)}
          //onCellEdited={onCellEdited}
          onCellClicked={onCellClicked}
          highlightRegions={highlightRegions}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          //onKeyUp={onKeyUp}
          customRenderers={[AsyncDropdownCellRenderer]}
          onItemHovered={onItemHovered}
        />
        {showMenu !== null &&
          renderLayer(
            <div
              {...layerProps}
              className="border  w-72 rounded-lg bg-white shadow-lg cursor-pointer"
            >
              {showMenu.menuType === 'statusMenu' ? (
                <LayoutStatusMenuSheetNew
                  showMenu={showMenu}
                  data={formattedData}
                  handleSort={handleSort}
                  cols={cols}
                  renderLayer={renderLayer}
                  setShowSearch={setShowSearch}
                  setShowMenu={setShowMenu}
                  layerProps={layerProps}
                  handleReset={handleReset}
                  showDrawer={showDrawer}
                  fileName="EtcInItemList"
                  customHeaders={visibleHeaders}
                />
              ) : (
                <LayoutMenuSheet
                  showMenu={showMenu}
                  handleSort={handleSort}
                  handleHideColumn={handleHideColumn}
                  cols={cols}
                  renderLayer={renderLayer}
                  setShowSearch={setShowSearch}
                  setShowMenu={setShowMenu}
                  layerProps={layerProps}
                />
              )}
            </div>,
          )}
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
      </div>
    </div>
  )
}

export default TableLGEtcInItemList
