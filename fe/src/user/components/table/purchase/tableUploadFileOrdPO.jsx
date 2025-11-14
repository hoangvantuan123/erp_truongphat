import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { UploadOutlined } from '@ant-design/icons'
import ModalHelpRootMenu from '../../modal/system/modalHelpRootMenu'
import { Button, Drawer, Checkbox, message, Upload } from 'antd'
import { HOST_API_SERVER_5 } from '../../../../services'
import { InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload
function TableUploadFileOrdPO({
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setEditedRows,
  setGridData,
  gridData,
  numRows,
  setCols,
  cols,
  defaultCols,
  dataNaWare,
  canEdit,
  setDataSearch,
  dataSearch,
  setOpenHelp,
  openHelp,
  setOnSelectRow,
  uploadProps,
  dataSub,
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('ord_po_list_more_ch', [])
  })
  const [typeSearch, setTypeSearch] = useState('')
  const [keySearchText, setKeySearchText] = useState('')
  const [hoverRow, setHoverRow] = useState(null)

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

      if (columnKey === 'Filename') {
        const fileUrl = `${HOST_API_SERVER_5}/${value}`

        return {
          kind: GridCellKind.Uri,
          data: fileUrl,
          copyData: String(value),
          displayData: value,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
          onClick: () => {
            window.open(fileUrl, '_blank')
          },
        }
      }
      if (columnKey === 'Size') {
        // Chuyển đổi dung lượng từ bytes sang KB và MB
        const bytes = value
        let formattedValue = ''
        let displayValue = ''

        if (bytes < 1024) {
          formattedValue = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(bytes)
          displayValue = formattedValue + ' B'
        } else if (bytes < 1048576) {
          const kb = (bytes / 1024).toFixed(2)
          formattedValue = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(kb)
          displayValue = formattedValue + ' KB'
        } else {
          const mb = (bytes / 1048576).toFixed(2)
          formattedValue = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(mb)
          displayValue = formattedValue + ' MB'
        }

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: formattedValue === '0' ? '' : String(value),
          displayData: formattedValue === '0' ? '' : displayValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }

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
    [gridData, cols, dataNaWare],
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

  const [lastClickedCell, setLastClickedCell] = useState(null)

  const onCellEdited = useCallback(
    async (cell, newValue) => {
      console.log('newValue', newValue)
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

      if (key === 'IdSeq') {
        return
      }
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
      saveToLocalStorageSheet('ord_po_list_more_ch', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('ord_po_list_more_c', uniqueCols)
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
        saveToLocalStorageSheet('ord_po_list_more_c', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('ord_po_list_more_c')
    localStorage.removeItem('ord_po_list_more_ch')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('ord_po_list_more_c', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'ord_po_list_more_c',
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
        saveToLocalStorageSheet('ord_po_list_more_c', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('ord_po_list_more_ch', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('ord_po_list_more_c', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('ord_po_list_more_ch', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full h-full overflow-auto flex flex-col">
      <div className="flex-1  flex items-center justify-center">
        <div className="w-full h-full flex flex-col border-b">
          <Dragger
            {...uploadProps}
            style={{ borderRadius: '0', border: 'none' }}
            className={`w-full cursor-${dataSub.length > 0 ? 'pointer' : 'not-allowed'}`}
            //disabled={dataSub.length === 0}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo tệp vào khu vực này để tải lên
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ tải lên một file một lần tải.
            </p>
          </Dragger>
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
            rowSelect="multi"
            gridSelection={selection}
            onGridSelectionChange={setSelection}
            getCellsForSelection={true}
            freezeColumns={1}
            getRowThemeOverride={(i) =>
              i === hoverRow
                ? {
                    bgCell: '#f7f7f7',
                    bgCellMedium: '#f0f0f0',
                  }
                : i % 2 === 0
                  ? undefined
                  : {
                      bgCell: '#FBFBFB',
                    }
            }
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
                    handleSort={handleSort}
                    cols={cols}
                    renderLayer={renderLayer}
                    setShowSearch={setShowSearch}
                    setShowMenu={setShowMenu}
                    layerProps={layerProps}
                    handleReset={handleReset}
                    showDrawer={showDrawer}
                    data={gridData}
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
          <ModalHelpRootMenu
            openHelp={openHelp}
            setOpenHelp={setOpenHelp}
            setKeySearchText={setKeySearchText}
            keySearchText={keySearchText}
            setOnSelectRow={setOnSelectRow}
            setTypeSearch={setTypeSearch}
            typeSearch={typeSearch}
            dataSearch={dataSearch}
            setDataSearch={setDataSearch}
          />
        </div>
      </div>
    </div>
  )
}

export default TableUploadFileOrdPO
