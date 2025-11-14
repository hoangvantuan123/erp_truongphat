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
import { Cells18084 } from '../../sheet/cells/cells18084'
import { Cells19999 } from '../../sheet/cells/cells19999'
import { Cells18084V2 } from '../../sheet/cells/cells18084V2'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { debounce } from 'lodash'
function TableRegiBOM({
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
  helpData02,
  helpData03,
  dataRootSeq,
  dataSheetSearch,
  setHelpData02,
  setHelpData03,
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const controllers = useRef({})
  const [isLoading, setIsLoading] = useState(false)
  const lastFetchedData = useRef(new Map())
  const fetchingKeys = useRef(new Set())
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('regi_bom_ah', [])
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

  const columnNames = ['SubItemNo', 'Location']
  const highlightRegions = columnNames.map((columnName) => ({
    color: '#e8f0ff',
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
        SubItemNo: {
          kind: 'cell-18084-v2',
          allowedValues: helpData02,
          setCacheData: setHelpData02,
        },
        Location: {
          kind: 'cell-19999',
          allowedValues: helpData03,
          setCacheData: setHelpData03,
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
            setCacheData: cellConfig[columnKey].setCacheData,
            value: value,
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (
        columnKey === 'NeedQtyNumerator' ||
        columnKey === 'NeedQtyDenominator' ||
        columnKey === 'InLossRate' ||
        columnKey === 'OutLossRate'
      ) {
        const formattedValue = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 5,
          maximumFractionDigits: 5,
        }).format(value)

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: formattedValue === '0.00000' ? '0.00000' : String(value),
          displayData:
            formattedValue === '0.00000' ? '0.00000' : formattedValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'HaveChild') {
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
          readonly: true, // Add this line to make the cell non-editable
        }
      }
      if (columnKey === 'FrApplyDate' || columnKey === 'ToApplyDate') {
        const parseDate = (dateString) => {
          const year = dateString.substring(0, 4)
          const month = dateString.substring(4, 6)
          const day = dateString.substring(6, 8)
          return new Date(`${year}-${month}-${day}`)
        }

        const dateValue = parseDate(value)
        const isValidDate = !isNaN(dateValue.getTime())
        const formattedValue = isValidDate
          ? `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, '0')}-${String(dateValue.getDate()).padStart(2, '0')}`
          : ''

        return {
          kind: GridCellKind.Text,
          data: value,
          copyData: String(value),
          displayData: formattedValue,
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
    [gridData, cols, helpData02, helpData03],
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

  const callGetCodeHelpNow = async (key) => {
    if (!key || key === 'N/A') return null

    if (lastFetchedData.current.has(key)) {
      return lastFetchedData.current.get(key)
    }

    while (fetchingKeys.current.has(key)) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    if (lastFetchedData.current.has(key)) {
      return lastFetchedData.current.get(key)
    }

    fetchingKeys.current.add(key)

    setIsLoading(true)
    const controller = new AbortController()
    controllers.current.callGetCodeHelpNow = controller

    try {
      const result = await GetCodeHelp(
        18084,
        key,
        '1',
        '1',
        '',
        '',
        '1',
        1,
        0,
        '',
        0,
        0,
        0,
        controller.signal,
      )

      const data = result.data || []
      setHelpData02((prev) => {
        const existingItemSeqs = new Set(prev.map((item) => item.ItemSeq))
        const newData = data.filter(
          (item) => !existingItemSeqs.has(item.ItemSeq),
        )
        return [...prev, ...newData]
      })
      lastFetchedData.current.set(key, data)
      return data
    } catch (error) {
      return []
    } finally {
      setIsLoading(false)
      fetchingKeys.current.delete(key)
      controllers.current.callGetCodeHelpNow = null
    }
  }
  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (canEdit === false) {
        message.warning('Bạn không có quyền chỉnh sửa dữ liệu')
        return
      }
      if (dataRootSeq === null) {
        message.warning('Chưa có mã hạng mục sản phẩm!')
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

      if (key === 'SubItemNo' && newValue.kind === GridCellKind.Custom) {
        let selectedName

        if (newValue.data instanceof Promise) {
          selectedName = await newValue.data
          selectedName = selectedName[0]
        } else {
          selectedName = newValue?.data[0]
        }
        const checkCopyData = newValue.copyData

        if (!selectedName) {
          selectedName = await callGetCodeHelpNow(checkCopyData)
          selectedName = selectedName ? selectedName[0] : null
        }

        setGridData((prev) => {
          const newData = [...prev]
          const product = newData[row]

          if (selectedName) {
            product[cols[col].id] = selectedName.ItemNo
            product['Spec'] = selectedName.Spec
            product['SubItemBomRevName'] = selectedName.ItemName
            product['UnitName'] = selectedName.UnitName
            product['SubItemSeq'] = selectedName.ItemSeq
            product['ItemSeq'] = dataRootSeq?.ItemSeq
            product['GoodSeq'] = dataRootSeq?.ItemSeq
            product['NeedQtyNumerator'] = 1
            product['NeedQtyDenominator'] = 1
            product['SubUnitSeq'] = selectedName.UnitSeq
            product['UnitSeq'] = selectedName.UnitSeq
            product['InLossRate'] = '0.00000'
            product['OutLossRate'] = '0.00000'
            product['ItemBomRev'] = '00'
            product['SubItemBomRev'] = '00'
            product['SubItemName'] = selectedName.ItemClassName
          } else {
            product[cols[col].id] = ''
            product['Spec'] = ''
            product['SubItemBomRevName'] = ''
            product['UnitName'] = ''
            product['SubItemSeq'] = ''
            product['NeedQtyNumerator'] = ''
            product['NeedQtyDenominator'] = ''
            product['InLossRate'] = ''
            product['OutLossRate'] = ''
            product['ItemBomRev'] = ''
            product['ItemSeq'] = ''
            product['SubUnitSeq'] = ''
            product['UnitSeq'] = ''
            product['GoodSeq'] = ''
            product['ItemBomRev'] = ''
            product['SubItemBomRev'] = ''
            product['SubItemName'] = ''
          }

          product['IdxNo'] = row + 1
          product['Status'] = product['Status'] === 'A' ? 'A' : 'U'
          return newData
        })
        return
      }

      if (key === 'Location') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = helpData03.find(
                (item) => item.MinorName === checkCopyData,
              )
            }

            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['Remark10'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['Remark10'] = ''
            }

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
      if (key === 'Serl' || key === 'SubItemSeq') {
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
    [canEdit, cols, gridData, helpData02, helpData03, dataRootSeq],
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
      saveToLocalStorageSheet('regi_bom_ah', newHidden)
      return newHidden
    })
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('regi_bom_a', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet('regi_bom_a', []).map(
      (col) => col.id,
    )
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
        saveToLocalStorageSheet('regi_bom_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('regi_bom_ah', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('regi_bom_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('regi_bom_ah', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col  overflow-x-hidden overflow-hidden ">
        <h2 className="text-xs border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          SHEET DATAđấ
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
          trailingRowOptions={{
            hint: ' ',
            sticky: true,
            tint: true,
          }}
          rowHeight={27}
          freezeColumns={1}
          getRowThemeOverride={(rowIndex) => {
            if (rowIndex === hoverRow) {
              return {
                bgCell: '#f7f7f7',
                bgCellMedium: '#f0f0f0',
              }
            }
            return undefined
          }}
          overscrollY={0}
          overscrollX={50}
          smoothScrollX={true}
          smoothScrollY={true}
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          onRowAppended={() => handleRowAppend(1)}
          isDraggable={false}
          onCellEdited={onCellEdited}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onItemHovered={onItemHovered}
          highlightRegions={highlightRegions}
          customRenderers={[Cells18084V2, Cells19999]}
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
export default TableRegiBOM
