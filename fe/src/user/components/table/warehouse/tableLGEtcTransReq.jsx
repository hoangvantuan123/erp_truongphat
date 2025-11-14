import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheetNew from '../../sheet/jsx/layoutStatusMenuNew'
import { Drawer, Checkbox, message, DatePicker } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { CellsItemName } from '../../sheet/cells/cellsItemName'
import { CellsEtcInType } from '../../sheet/cells/cellsEtcInType'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import moment from 'moment'

function TableLGEtcTransReq({
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setAddedRows,
  setEditedRows,
  onCellClicked,
  numRowsToAdd,
  onSelectRow,
  setOnSelectRow,
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
  handleRestSheet,
  canEdit,
  dataItemName,
  dataStockType,
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [isCell, setIsCell] = useState(null)

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('H_ERP_COLS_PAGE_ETC_TRANS_REQ', [])
  })
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
  const [dataSearch, setDataSearch] = useState([])

  const highlightRegions = [
    {
      color: '#e8f0ff',
      range: {
        x: reorderColumns(cols).indexOf('ItemName'),
        y: 0,
        width: 1,
        height: numRows,
      },
    },
    {
      color: '#e8f0ff',
      range: {
        x: reorderColumns(cols).indexOf('InOutReqDetailKindName'),
        y: 0,
        width: 1,
        height: numRows,
      },
    },
    ...gridData
      .filter((row) => row.InventorySeq === 1)
      .map((row) => ({
        color: '#52c41a', // Màu vàng
        range: {
          x: reorderColumns(cols).indexOf('InventoryRemark'),
          y: gridData.indexOf(row),
          width: 1,
          height: 1,
        },
      })),
    ...gridData
      .filter((row) => row.InventorySeq === 2)
      .map((row) => ({
        color: '#FEAE00', // Màu vàng
        range: {
          x: reorderColumns(cols).indexOf('InventoryRemark'),
          y: gridData.indexOf(row),
          width: 1,
          height: 1,
        },
      })),
    ...gridData
      .filter((row) => row.InventorySeq === 3)
      .map((row) => ({
        color: '#ff0000', // Màu vàng
        range: {
          x: reorderColumns(cols).indexOf('InventoryRemark'),
          y: gridData.indexOf(row),
          width: 1,
          height: 1,
        },
      })),
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

      const cellConfig = {
        InOutReqDetailKindName: {
          kind: 'etc-in-type-cell',
          allowedValues: dataStockType,
        },
      }

      if (cellConfig[columnKey]) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: String(value),
          data: {
            kind: cellConfig[columnKey].kind,
            allowedValues: cellConfig[columnKey].allowedValues,
            value: value,
            boundingBox: boundingBox,
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'ItemName') {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: value,
          data: {
            kind: 'item-name-cell',
            allowedValues: dataItemName,
            value: String(value),
            boundingBox: boundingBox,
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'Qty' || columnKey === 'Price' || columnKey === 'Amt') {
        const formattedValue = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 5,
          maximumFractionDigits: 5,
        }).format(value)
        const itemName = person['ItemName'] // Lấy giá trị của ô 'ItemName'
        return {
          kind: GridCellKind.Number,
          data: value,
          copyData:
            formattedValue === '0.00000'
              ? itemName
                ? '0.00000'
                : ''
              : String(value),
          displayData:
            formattedValue === '0.00000'
              ? itemName
                ? '0.00000'
                : ''
              : formattedValue,
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
      }
    },
    [gridData, cols, dataItemName, dataStockType],
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

      if (key === 'ItemName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            const selectedName = newValue.data[0]

            if (selectedName) {
              product[cols[col].id] = selectedName.ItemName
              product['ItemNo'] = selectedName.ItemNo
              product['Spec'] = selectedName.Spec
              product['UnitName'] = selectedName.UnitName
              product['ItemSeq'] = selectedName.ItemSeq
              product['UnitSeq'] = selectedName.UnitSeq
            } else {
              product[cols[col].id] = ''
              product['ItemNo'] = ''
              product['Spec'] = ''
              product['UnitName'] = ''
              product['ItemSeq'] = ''
              product['UnitSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }
      if (key === 'InOutReqDetailKindName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataStockType.find(
                (item) => item.MinorName === checkCopyData,
              )
            }

            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['InOutReqDetailKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['InOutReqDetailKind'] = ''
            }

            const currentStatus = product['Status'] || ''
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'
            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )
            return newData
          })
          return
        }
      }

      if (
        key === 'ItemNo' ||
        key === 'Spec' ||
        key === 'UnitName' ||
        key === 'ItemSeq' ||
        key === 'BizUnit'
      ) {
        return
      }

      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''
        updatedData[row][key] = newValue.data

        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'
        updatedData[row]['Amt'] =
          updatedData[row]['Qty'] * updatedData[row]['Price']
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
    [canEdit, cols],
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
      saveToLocalStorageSheet('H_ERP_COLS_PAGE_ETC_TRANS_REQ', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_TRANS_REQ', uniqueCols)
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_TRANS_REQ', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_PAGE_ETC_TRANS_REQ')
    localStorage.removeItem('H_ERP_COLS_PAGE_ETC_TRANS_REQ')
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_TRANS_REQ', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_ETC_TRANS_REQ',
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_TRANS_REQ', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_ETC_TRANS_REQ', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_ETC_TRANS_REQ', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_ETC_TRANS_REQ', newHidden)
        return newHidden
      })
    }
  }

  const visibleColumns = cols.filter((col) => !hiddenColumns.includes(col.id))
  const visibleLotMasterHeaders = visibleColumns.map((col) => ({
    id: col.id,
    title: col.title,
  }))

  const formattedData = gridData.map((item) => {
    const newItem = {}
    visibleLotMasterHeaders.forEach((header) => {
      // Lặp qua mảng header
      if (item[header.id] !== undefined) {
        if (header.id === 'Status') {
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
          rowSelect="multi"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          overscrollY={0}
          overscrollX={0}
          smoothScrollX={true}
          smoothScrollY={true}
          trailingRowOptions={{
            hint: ' ',
            sticky: true,
            tint: true,
          }}
          freezeColumns={1}
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
          onItemHovered={onItemHovered}
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          onRowAppended={() => handleRowAppend(1)}
          onCellEdited={onCellEdited}
          onCellClicked={onCellClicked}
          highlightRegions={highlightRegions}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          customRenderers={[CellsItemName, CellsEtcInType]}
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
                  //data={gridData}
                  data={formattedData}
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
                  fileName="EtcTransReq"
                  customHeaders={visibleLotMasterHeaders}
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

export default TableLGEtcTransReq
