import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import { useLayer } from 'react-laag'
import {
  loadFromLocalStorageSheet,
  saveToLocalStorageSheet,
} from '../../../../localStorage/sheet/sheet'
import { Checkbox, Drawer } from 'antd'
import ModalHelpRootMenu from '../../modal/system/modalHelpRootMenu'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { CellsItemName } from '../../sheet/cells/cellsItemName'
import { CellsSpec } from '../../sheet/cells/cellsSpec'
import { CellsUnitName } from '../../sheet/cells/cellsUnitName'
import { GetStdQtyBy } from '../../../../features/transReqMat/getTransReqMatDetails'
import { AsyncDropdownCellTransReqType } from '../../sheet/cells/AsyncDropdownCellTransReqType'
function TableCreateTransReqMat({
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
  setIsCellSelected,
  setOpenHelp,
  openHelp,
  clickCount,
  setGridData,
  gridData,
  handleRestSheet,
  setNumRows,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,

  dataItemName,
  dataInOutDetailType,
  dataUnitEA,
}) {
  const gridRef = useRef(null)
  const ref = (useRef < data) | (null > null)

  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [hiddenColumns, setHiddenColumns] = useState(
    loadFromLocalStorageSheet('H_ERP_COLS_PAGE_CREATE_TRANS_REQ', []),
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
        x: reorderColumns(cols).indexOf('InOutReqDetailKind'),
        y: 0,
        width: 1,
        height: numRows,
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

      if (columnKey === 'ItemName') {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: value,
          data: {
            kind: 'item-name-cell',
            allowedValues: dataItemName,
            value: value,
            boundingBox: boundingBox,
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'InOutReqDetailKind') {
        const filteredData = dataInOutDetailType.find((item) => {
          if (item.Value === value) {
            return item
          }
        })

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: value,
          data: {
            kind: 'async-dropdown-trans-req-type-cell',
            allowedValues: dataInOutDetailType,
            value: filteredData?.MinorName,
            boundingBox: boundingBox,
          },
          displayData: String(filteredData?.MinorName),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }
      return {
        kind: GridCellKind.Text,
        data: value,
        displayData: String(value),
        readonly: false,
        copyData: String(value),
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
      }
    },
    [gridData, cols, dataItemName, dataInOutDetailType, dataUnitEA],
  )

  const onCellClicked = useCallback(
    (cell, event) => {
      const indexes = reorderColumns(cols)
      const [col, row] = event.location
    },
    [cols, gridData],
  )

  const onKeyUp = useCallback(
    (event) => {
      const indexes = reorderColumns(cols)
      const [col, row] = event.location
      const itemNameIndex = indexes.indexOf('ItemName') + 1
      const itemNo = indexes.indexOf('ItemNo') + 1

      const handleCellSelection = (type, rowData, key) => {
        setIsCellSelected(true)
        setTypeSearch(type)
        setKeySearchText(rowData?.[key])
      }

      const resetSelection = () => {
        setTypeSearch(null)
        setKeySearchText(null)
        setIsCellSelected(false)
      }

      if (col === itemNameIndex || col === itemNo) {
        if (row >= 0 && row < gridData.length) {
          const rowData = gridData[row]
          if (col === itemNameIndex) {
            handleCellSelection('ItemName', rowData, 'ItemName')
          } else if (col === itemNo) {
            handleCellSelection('ItemNo', rowData, 'ItemNo')
          }
        } else {
          resetSelection()
        }
      } else {
        resetSelection()
      }
    },
    [cols, gridData],
  )

  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (
        newValue.kind !== GridCellKind.Text &&
        newValue.kind !== GridCellKind.Custom
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

            const selectedItemName = newValue.data[0]
            const checkCopyData = newValue.copyData
            const selectedItem = dataItemName.find(
              (item) => item.ItemName === selectedItemName.ItemName,
            )
            if (selectedItem) {
              product[cols[col].id] = selectedItemName.ItemName
              product['ItemNo'] = selectedItem.ItemNo
              product['UnitName'] = selectedItem.UnitName
              product['Spec'] = selectedItem.Spec
              product['ItemSeq'] = selectedItem.ItemSeq

              GetStdQtyBy(selectedItem.ItemSeq).then((dataStdQty) => {
                product['STDUnitName'] = dataStdQty.data[0]?.StdUnitName
                product['STDQty'] = dataStdQty.data[0]?.StdQty || 0
                product['STDUnitSeq'] = dataStdQty.data[0]?.StdUnitSeq || 0
                product['UnitSeq'] = dataStdQty.data[0]?.UnitSeq || 0
              })
            } else {
              product[cols[col].id] = ''
              product['ItemNo'] = ''
            }

            console.log('product', product)
            const currentStatus = product?.Status || ''
            console.log('currentStatus', currentStatus)
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'
            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )
            return newData
          })
          return
        }
      }

      if (key === 'InOutReqDetailKind') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            const selectedInOutReqKindName = newValue.data.value
            const selectedItem = dataInOutDetailType.find(
              (item) => item.MinorName === selectedInOutReqKindName,
            )
            if (selectedItem) {
              product[cols[col].id] = selectedInOutReqKindName
              product['InOutReqDetailKind'] = selectedItem.Value
              product['InOutReqDetailKindName'] = selectedItem.MinorName
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

      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''
        if (
          newValue.kind === GridCellKind.Text ||
          newValue.kind === GridCellKind.Custom ||
          newValue.kind === GridCellKind.Boolean
        ) {
          updatedData[row][key] =
            newValue.copyData === '' && newValue.displayData === ''
              ? newValue.data
              : newValue.copyData === newValue.displayData
                ? newValue.data
                : newValue.displayData
        }
        if (newValue.kind === GridCellKind.Number) {
          const parseFormattedNumber = (formattedValue) => {
            return parseFloat(String(formattedValue).replace(/,/g, ''))
          }

          updatedData[row][key] =
            newValue.copyData === '' && newValue.displayData === ''
              ? parseFormattedNumber(newValue.data)
              : newValue.copyData === newValue.displayData
                ? parseFormattedNumber(newValue.data)
                : parseFormattedNumber(newValue.displayData)
        }
        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'

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
            return updatedEditedRows
          }
        })

        return updatedData
      })
    },
    [cols, gridData, dataItemName, dataUnitEA, dataInOutDetailType],
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
      const sortedData = [...prevData].sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1
        return 0
      })
      return sortedData
    })
    setShowMenu(null)
  }

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_PAGE_CREATE_TRANS_REQ')
    localStorage.removeItem('H_ERP_COLS_PAGE_CREATE_TRANS_REQ')
    setShowMenu(null)
  }

  const handleHideColumn = (colIndex) => {
    console.log('colIndex', colIndex)
    const columnId = cols[colIndex]?.id
    if (cols.length > 1) {
      updateHiddenColumns([columnId])
      setCols((prevCols) => {
        const newCols = prevCols.filter((_, idx) => idx !== colIndex)
        const uniqueCols = newCols.filter(
          (col, index, self) =>
            index === self.findIndex((c) => c.id === col.id),
        )
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_CREATE_TRANS_REQ', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_CREATE_TRANS_REQ',
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

  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
      saveToLocalStorageSheet('H_ERP_COLS_PAGE_CREATE_TRANS_REQ', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_CREATE_TRANS_REQ', uniqueCols)
      return uniqueCols
    })
  }

  const handleCheckboxChange = (columnId, isChecked) => {
    if (isChecked) {
      const restoredColumn = defaultCols.find((col) => col.id === columnId)
      setCols((prevCols) => {
        const newCols = [...prevCols, restoredColumn]
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_CREATE_TRANS_REQ', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_CREATE_TRANS_REQ', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_CREATE_TRANS_REQ', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_CREATE_TRANS_REQ', newHidden)
        return newHidden
      })
    }
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_CREATE_TRANS_REQ', updatedCols)
      return updatedCols
    })
  }, [])

  const onClose = () => {
    setOpen(false)
  }

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
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
          trailingRowOptions={{
            hint: ' ',
            sticky: true,
            tint: true,
          }}
          freezeColumns="0"
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
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          isDraggable={false}
          onRowAppended={() => handleRowAppend(1)}
          smoothScrollY={true}
          smoothScrollX={true}
          onCellEdited={onCellEdited}
          onCellClicked={onCellClicked}
          highlightRegions={highlightRegions}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onItemHovered={onItemHovered}
          customRenderers={[
            AsyncDropdownCellTransReqType,
            CellsItemName,
            CellsSpec,
            CellsUnitName,
          ]}
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
                  handleRestSheet={handleRestSheet}
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
  )
}

export default TableCreateTransReqMat
