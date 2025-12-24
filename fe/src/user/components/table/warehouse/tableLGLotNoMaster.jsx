import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheetNew from '../../sheet/jsx/layoutStatusMenuNew'
import { Drawer, Checkbox, message, DatePicker } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import ModalHelpRootMenu from '../../modal/system/modalHelpRootMenu'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { CellsItemName } from '../../sheet/cells/cellsItemName'
import { CellsCustName } from '../../sheet/cells/cellsCustName'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import moment from 'moment'
import { set } from 'lodash'

function TableLGLotNoMaster({
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setEditedRows,
  onCellClicked,
  setGridData,
  gridData,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  handleRestSheet,
  canEdit,
  dataItemName,
  dataCustName,
  setIsQuery,
  isQuery,
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('H_ERP_COLS_PAGE_LOT_MASTER', [])
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

  const highlightRegions = [
    {
      color: '#e8f0ff',
      range: {
        x: reorderColumns(cols).indexOf('ItemName'),
        y: 0,
        width: 1,
        height: numRows - 1,
      },
    },
    {
      color: '#e8f0ff',
      range: {
        x: reorderColumns(cols).indexOf('CustName'),
        y: 0,
        width: 1,
        height: numRows - 1,
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
      const lastRowIndex = numRows - 1;
      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''
      const boundingBox = document.body.getBoundingClientRect()
      if (row === lastRowIndex) {

        if (["Qty"].includes(columnKey)) {
          const total = gridData.reduce((sum, item) => sum + (Number(item[columnKey]) || 0), 0);
          const formattedTotal = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
          }).format(total);

          return {
            kind: GridCellKind.Number,
            data: total,
            copyData: String(total),
            displayData: formattedTotal,
            readonly: true,
            contentAlign: "right",
            themeOverride: {
              textDark: "#009CA6",
              bgIconHeader: "#009CA6",
              accentColor: "#009CA6",
              accentLight: "#009CA620",
              fgIconHeader: "#FFFFFF",
              baseFontStyle: "600 13px",
              bgCell: "#E6F6DD",
            }
          };
        }



        return {
          kind: GridCellKind.Text,
          data: "",
          displayData: "",
          readonly: true,
          themeOverride: {
            textDark: "#009CA6",
            bgIconHeader: "#009CA6",
            accentColor: "#009CA6",
            accentLight: "#009CA620",
            fgIconHeader: "#FFFFFF",
            baseFontStyle: "600 13px",
            bgCell: "#E6F6DD",
          }
        };
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

      if (columnKey === 'CustName') {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: value,
          data: {
            kind: 'cust-name-cell',
            allowedValues: dataCustName,
            value: String(value),
            boundingBox: boundingBox,
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (
        columnKey === 'CreateDate' ||
        columnKey === 'ValiDate' ||
        columnKey === 'RegDate'
      ) {
        let displayValue = ''
        let dataValue = value

        if (value) {
          if (typeof value === 'string' && value.trim() !== '') {
            try {
              let momentObj
              if (value.includes('-')) {
                momentObj = moment(value, 'YYYY-MM-DD')
                dataValue = momentObj.format('YYYYMMDD') // Loại bỏ dấu - để lưu vào data
                displayValue = momentObj.format('YYYY-MM-DD') // Giữ dấu - để hiển thị
                if (displayValue === 'Invalid date') {
                  displayValue = ''
                  dataValue = ''
                }
              } else {
                momentObj = moment(value, 'YYYYMMDD')
                displayValue = momentObj.format('YYYY-MM-DD')
                if (displayValue === 'Invalid date') {
                  displayValue = ''
                  dataValue = ''
                }
              }
            } catch (error) {
              displayValue = ''
              dataValue = ''
            }
          } else {
            displayValue = ''
            dataValue = '' // Hoặc giá trị mặc định khác nếu cần
          }
        }
        return {
          kind: GridCellKind.Text,
          data: dataValue, // Lưu giá trị đã bỏ dấu -
          copyData: String(dataValue), // Copy giá trị đã bỏ dấu -
          displayData: displayValue, // Hiển thị giá trị với dấu -
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'Qty') {
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
    [gridData, cols, dataItemName, dataCustName],
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

      if (
        key === 'ItemNo' ||
        key === 'Spec' ||
        key === 'UnitName' ||
        key === 'ItemSeq'
      ) {
        return
      }

      if (key === 'CustName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            const selectedName = newValue.data[0]

            if (selectedName) {
              product[cols[col].id] = selectedName.CustName
              product['CustSeq'] = selectedName.CustSeq
              product['SupplyCustSeq'] = selectedName.CustSeq
              product['SupplyName'] = selectedName.CustName
            } else {
              product[cols[col].id] = ''
              product['CustSeq'] = ''
              product['SupplyCustSeq'] = ''
              product['SupplyName'] = ''
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
      if (key === 'CustSeq') {
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
      saveToLocalStorageSheet('H_ERP_COLS_PAGE_LOT_MASTER', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_LOT_MASTER', uniqueCols)
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_LOT_MASTER', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_PAGE_LOT_MASTER')
    localStorage.removeItem('H_ERP_COLS_PAGE_LOT_MASTER')
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_LOT_MASTER', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_LOT_MASTER',
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_LOT_MASTER', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_LOT_MASTER', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_LOT_MASTER', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_LOT_MASTER', newHidden)
        return newHidden
      })
    }
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
  const visibleLotMasterHeaders = visibleColumns.map((col) => ({
    id: col.id,
    title: col.title,
  }))



  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="w-full h-full flex flex-col  overflow-hidden ">
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
          freezeTrailingRows={1}
          headerHeight={30}
          rowHeight={28}
          getRowThemeOverride={(rowIndex) => {
            if (rowIndex === hoverRow) {
              return {
                bgCell: '#f7f7f7',
                bgCellMedium: '#f0f0f0',
              }
            }
            return undefined
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
          customRenderers={[CellsItemName, CellsCustName]}
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
                  fileName="LotMater"
                  gridData={gridData}
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

export default TableLGLotNoMaster
