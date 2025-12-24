import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { CellsItemNameV01 } from '../../sheet/cells/cellsItemNameV01'
function TableBomReportAll({
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setEditedRows,
  setGridData,
  gridData,
  setNumRows,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  dataNaWare,
  handleRestSheet,
  canEdit,
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('report_all_bom_ah', [])
  })
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

      return {
        kind: GridCellKind.Text,
        data: value,
        copyData: String(value),
        displayData: String(value),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
        isEditing: true,
      }
    },
    [gridData, cols],
  )

  const onKeyUp = useCallback(
    (event) => {
      if (event.key === 'Backspace') {
        const [col, row] = event.location

        setGridData((prev) => {
          const newData = [...prev]
          if (newData[row]) {
            const column = cols[col - 1]
          }
          return newData
        })
      }
    },
    [cols, gridData],
  )

  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (canEdit === false) {
        message.warning('Bạn không có quyền chỉnh sửa dữ liệu')
        return
      }
      if (
        newValue.kind !== GridCellKind.Text &&
        newValue.kind !== GridCellKind.Custom &&
        newValue.kind !== GridCellKind.Boolean &&
        newValue.kind !== GridCellKind.Number
      ) {
        return
      }

      const indexes = reorderColumns(cols)
      const [col, row] = cell
      const key = indexes[col]

      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''

        updatedData[row][key] = newValue.data
        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'
        updatedData[row]['IdxNo'] = row + 1
        setEditedRows((prevEditedRows) => {
          const existingIndex = prevEditedRows.findIndex(
            (editedRow) => editedRow.rowIndex === row,
          )

          const updatedRowData = {
            rowIndex: row,
            updatedRow: updatedData[row],
            status: currentStatus === 'A' ? 'A' : 'U',
          }

          if (existingIndex === -1) {
            return [...prevEditedRows, updatedRowData]
          } else {
            const updatedEditedRows = [...prevEditedRows]
            updatedEditedRows[existingIndex] = updatedRowData
            updatedEditedRows[existingIndex].updatedRow['IdxNo'] = row + 1
            return updatedEditedRows
          }
        })

        return updatedData
      })
    },
    [canEdit, cols, gridData],
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

  const handleSort = (columnId, direction) => {
    setGridData((prevData) => {
      const rowsWithStatusA = prevData.filter((row) => row.Status === 'A')
      const rowsWithoutStatusA = prevData.filter((row) => row.Status !== 'A')

      const sortedData = rowsWithoutStatusA.sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1
        return 0
      })

      const updatedData = updateIndexNo([...sortedData, ...rowsWithStatusA])

      return updatedData
    })

    setShowMenu(null)
  }

  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
      saveToLocalStorageSheet('report_all_bom_ah', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('report_all_bom_a', uniqueCols)
      return uniqueCols
    })
  }

  // Hàm ẩn cột
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
        saveToLocalStorageSheet('report_all_bom_a', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('report_all_bom_a')
    localStorage.removeItem('report_all_bom_ah')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('report_all_bom_a', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'report_all_bom_a',
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
    setShowMenu(null)
  }
  const onClose = () => {
    setOpen(false)
  }

  const handleCheckboxChange = (columnId, isChecked) => {
    if (isChecked) {
      const restoredColumn = defaultCols.find((col) => col.id === columnId)
      setCols((prevCols) => {
        const newCols = [...prevCols, restoredColumn]
        saveToLocalStorageSheet('report_all_bom_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('report_all_bom_ah', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('report_all_bom_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('report_all_bom_ah', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full  h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col bg-white overflow-x-hidden border overflow-hidden ">
        <h2 className="text-xs border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          DATA SHEET
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
          className=" rounded-r-lg"
          height="100%"
          rowSelect="multi"

          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          freezeTrailingRows={0}
          rowHeight={25}
          freezeColumns={1}
          getRowThemeOverride={(rowIndex) => {
            if (rowIndex === hoverRow) {
              return {
                bgCell: "#f7f7f7",
                bgCellMedium: "#f0f0f0"
              };
            }
            return undefined;
          }}

          overscrollY={0}
          overscrollX={50}

          smoothScrollX={true}
          smoothScrollY={true}

          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          isDraggable={false}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onItemHovered={onItemHovered}

        />
        {showMenu !== null &&
          renderLayer(
            <div
              {...layerProps}
              className="border  w-72 rounded-lg bg-white shadow-lg cursor-pointer"
            >
              {showMenu.menuType === 'statusMenu' ? (
                <LayoutStatusMenuSheet
                  showMenu={showMenu}
                  data={gridData}
                  handleRowAppend={handleRowAppend}
                  handleRestSheet={handleRestSheet}
                  handleSort={handleSort}
                  cols={cols}
                  renderLayer={renderLayer}
                  setShowSearch={setShowSearch}
                  setShowMenu={setShowMenu}
                  layerProps={layerProps}
                  handleReset={handleReset}
                  showDrawer={showDrawer}
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

export default TableBomReportAll
