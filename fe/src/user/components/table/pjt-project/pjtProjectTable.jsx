import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import '@glideapps/glide-data-grid/dist/index.css'
import { Checkbox, Drawer } from 'antd'
import { useCallback, useRef, useState } from 'react'
import { useLayer } from 'react-laag'
import {
  loadFromLocalStorageSheet,
  saveToLocalStorageSheet,
} from '../../../../localStorage/sheet/sheet'
import useOnFill from '../../hooks/sheet/onFillHook'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'

import { useTranslation } from 'react-i18next'
import { CellsItemNameV01 } from '../../sheet/cells/cellsItemNameV01'
import { CellsSMCombo } from '../../sheet/cells/cellsSMCombo'

function PjtProjectTable({
  dataItem,
  setDataItem,
  dataSmInputType,
  setDataSmInputType,
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setGridData,
  gridData,
  numRows,
  setNumRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  handleRestSheet,
  canEdit,
  onCellClicked,
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [hoverRow, setHoverRow] = useState(null)
  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('edu_rst_cost_h', [])
  })
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

  const columnNames = ['ItemName', 'SMInputTypeName']
  const highlightRegions = columnNames.map((columnName) => ({
    color: '#E6F4FF',
    range: {
      x: reorderColumns(cols).indexOf(columnName),
      y: 0,
      width: 1,
      height: numRows,
    },
  }))
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

      const cellConfig = {
        SMInputTypeName: {
          kind: 'cells-sm-combo',
          allowedValues: dataSmInputType,
          setCacheData: setDataSmInputType,
        },
      }

      if (columnKey === 'ItemName') {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: value,
          data: {
            kind: 'item-name-cell-v01',
            value: String(value),
            allowedValues: dataItem,
            setCacheData: setDataItem,
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (
        columnKey === 'ISPJTSales'
      ) {
        const booleanValue =
          value === 1 || value === '1'
            ? true
            : value === 0 || value === '0'
              ? false
              : Boolean(value)
        return {
          kind: GridCellKind.Boolean,
          data: booleanValue,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (cellConfig[columnKey]) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: String(value),
          data: {
            kind: cellConfig[columnKey].kind,
            allowedValues: cellConfig[columnKey].allowedValues,
            setCacheData: cellConfig[columnKey].setCacheData,
            value: value,
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (
        columnKey === 'ItemQty' ||
        columnKey === 'ItemPrice' ||
        columnKey === 'ItemAmt' ||
        columnKey === 'ItemVatAmt' ||
        columnKey === 'SumItemAmt' ||
        columnKey === 'ItemDomPrice' ||
        columnKey === 'ItemDomAmt' ||
        columnKey === 'ItemDomVatAmt' ||
        columnKey === 'SumItemDomAmt' ||
        columnKey === 'SumItemDomAmt'
      ) {
        const isEmptyValue =
          value === null || value === undefined || value === ''

        const formattedValue = isEmptyValue
          ? ''
          : new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            }).format(value)

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: isEmptyValue ? '' : String(value),
          displayData: formattedValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
          contentAlign: 'right',
        }
      }
      return {
        kind: GridCellKind.Text,
        data: value,
        copyData: String(value || ''),
        displayData: String(value || ''),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
        isEditing: true,
      }
    },
    [gridData, cols, dataItem, dataSmInputType],
  )



  const onKeyUp = useCallback(
    (event) => {
      const indexes = reorderColumns(cols)
    },
    [cols, gridData],
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
      saveToLocalStorageSheet('edu_rst_cost_h', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('edu_rst_cost_a', uniqueCols)
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
        saveToLocalStorageSheet('edu_rst_cost_a', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('edu_rst_cost_a')
    localStorage.removeItem('edu_rst_cost_h')
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('edu_rst_cost_a', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'edu_rst_cost_a',
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
        saveToLocalStorageSheet('edu_rst_cost_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('edu_rst_cost_h', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('edu_rst_cost_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('edu_rst_cost_h', newHidden)
        return newHidden
      })
    }
  }
  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (canEdit === false) {
        return
      }

      if (
        newValue.kind !== GridCellKind.Text &&
        newValue.kind !== GridCellKind.Custom &&
        newValue.kind !== GridCellKind.Number
      ) {
        return
      }
      const indexes = reorderColumns(cols)
      const [col, row] = cell
      const key = indexes[col]

      if (key === 'SMInputTypeName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataSmInputType.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMInputTypeName'] = selectedName.MinorName
              product['SMInputType'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMInputTypeName'] = ''
              product['SMInputType'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            return newData
          })
          return
        }
      }

      if (key === 'ItemName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataItem.find(
                (item) => item.ItemName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.ItemName
              product['ItemName'] = selectedName.ItemName
              product['ItemSeq'] = selectedName.ItemSeq
              product['ItemNo'] = selectedName.ItemNo
              product['Spec'] = selectedName.Spec
              product['UnitName'] = selectedName.UnitName
              product['UnitSeq'] = selectedName.UnitSeq
            } else {
              product[cols[col].id] = ''
              product['ItemName'] = ''
              product['ItemSeq'] = ''
              product['ItemNo'] = ''
              product['Spec'] = ''
              product['UnitName'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            return newData
          })
          return
        }
      }

      if (key === 'ItemQty') {
        if (newValue.kind === GridCellKind.Number) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = checkCopyData
            }
            if (selectedName) {
              product[cols[col].id] = selectedName
              const itemAmt = parseFloat(selectedName * product['ItemPrice'])
              const itemVatAmt = parseFloat(itemAmt * 0.1)
              const sumItemAmt = parseFloat(itemAmt + itemVatAmt)

              product['ItemQty'] = selectedName
              product['ItemVatAmt'] = itemVatAmt
              product['ItemAmt'] = itemAmt
              product['SumItemAmt'] = sumItemAmt
              product['ItemDomVatAmt'] = itemVatAmt
              product['SumItemDomAmt'] = sumItemAmt
              product['ItemDomAmt'] = itemAmt

            } else {
              product[cols[col].id] = ''
              product['ItemName'] = ''
              product['ItemSeq'] = ''
              product['ItemNo'] = ''
              product['Spec'] = ''
              product['UnitName'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            return newData
          })
          return
        }
      }

      if (key === 'ItemPrice') {
        if (newValue.kind === GridCellKind.Number) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data
            
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = checkCopyData
            }
            if (selectedName) {
              const itemAtm = parseFloat(selectedName * product['ItemQty'])
              const itemVatAmt = parseFloat(itemAtm * 0.1)
              const sumItemAmt = parseFloat(itemAtm + itemVatAmt)
              product[cols[col].id] = selectedName
              product['ItemAmt'] = itemAtm
              product['ItemPrice'] = selectedName
              product['ItemVatAmt'] = itemVatAmt
              
              product['SumItemAmt'] = sumItemAmt
              product['ItemDomPrice'] = selectedName
              product['ItemDomAmt'] = itemAtm
              product['ItemDomVatAmt'] = itemVatAmt
              product['SumItemDomAmt'] = sumItemAmt

            } else {
              product[cols[col].id] = ''
              product['ItemName'] = ''
              product['ItemSeq'] = ''
              product['ItemNo'] = ''
              product['Spec'] = ''
              product['UnitName'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            return newData
          })
          return
        }
      }

      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''
        updatedData[row][key] = newValue.data
        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'

        return updatedData
      })
    },
    [cols, gridData],
  )

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
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
          freezeColumns={1}
          headerHeight={29}
          getRowThemeOverride={(rowIndex) => {
            if (rowIndex === hoverRow) {
              return {
                bgCell: '#f7f7f7',
                bgCellMedium: '#f0f0f0',
              }
            }
            return undefined
          }}
          onRowAppended={() => handleRowAppend(1)}
          onItemHovered={onItemHovered}
          overscrollY={0}
          overscrollX={0}
          freezeTrailingRows={0}
          rowHeight={25}
          smoothScrollY={true}
          smoothScrollX={true}
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          onCellClicked={onCellClicked}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onCellEdited={onCellEdited}
          customRenderers={[CellsSMCombo, CellsItemNameV01]}
          highlightRegions={highlightRegions}
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
                  handleRowAppend={handleRowAppend}
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
        <Drawer
          title={
            <span className="text-xs flex items-center justify-end">
              CÀI ĐẶT SHEET
            </span>
          }
          bodyStyle={{ padding: 15 }}
          onClose={onClose}
          open={open}
        >
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

export default PjtProjectTable
