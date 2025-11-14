import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import { useTranslation } from 'react-i18next'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import ModalHelpRootMenu from '../../modal/system/modalHelpRootMenu'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { CellsBizUnit } from '../../sheet/cells/cellsBizUnit'
import { CellsFactUnit } from '../../sheet/cells/cellsFactUnit'
import { CellsMinorName } from '../../sheet/cells/cellsNaKindWare'
import { CellsMngDeptName } from '../../sheet/cells/cellsWHKindName'
import { CellsCommissionCustName } from '../../sheet/cells/cellsCommissionCust'
import { CellsUMRegion } from '../../sheet/cells/cellsUMRegion'
import { CellsScope } from '../../sheet/cells/cellsScope'

function TableWarehousRegistration({
  dataUnit,
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
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  dataNaWare,
  dataMngDeptName,
  canEdit,
  dataCommissionCust,
  dataUMRegion,
  dataScopeName,
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [isCell, setIsCell] = useState(null)

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('H_ERP_COLS_PAGE_WARE_REGI', [])
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
  const columnNames = [
    'BizUnitName',
    'FactUnitName',
    'WHKindName',
    'MngDeptName',
    'CommissionCustName',
    'RegionName',
    'ScopeName',
  ]
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
      const boundingBox = document.body.getBoundingClientRect()

      const cellConfig = {
        BizUnitName: {
          kind: 'biz-unit-cell',
          allowedValues: dataUnit,
        },
        FactUnitName: {
          kind: 'fact-unit-cell',
          allowedValues: dataUnit,
        },
        WHKindName: {
          kind: 'na-kind-ware-cell',
          allowedValues: dataNaWare,
        },
        MngDeptName: {
          kind: 'mng-dept-name-cell',
          allowedValues: dataMngDeptName,
        },
        CommissionCustName: {
          kind: 'commission-cust-name-cell',
          allowedValues: dataCommissionCust,
        },
        RegionName: {
          kind: 'region-name-cell',
          allowedValues: dataUMRegion,
        },
        ScopeName: {
          kind: 'scope-name-cell',
          allowedValues: dataScopeName,
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

      if (columnKey === 'SortSeq') {
        return {
          kind: GridCellKind.Number,
          data: value,
          displayData: String(value),
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
          visible: true,
        }
      }

      if (
        columnKey === 'IsNotMinusCheck' ||
        columnKey === 'IsWHEmp' ||
        columnKey === 'IsWHItem' ||
        columnKey === 'IsNotUse'
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
    [
      gridData,
      cols,
      dataUnit,
      dataNaWare,
      dataMngDeptName,
      dataCommissionCust,
      dataUMRegion,
      dataScopeName,
    ],
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
      if (event.key === 'Backspace') {
        const [col, row] = event.location

        setGridData((prev) => {
          const newData = [...prev]
          if (newData[row]) {
            const column = cols[col - 1]
            if (!column.readonly) {
              const key = column.id
              newData[row][key] = ''
              if (key === 'BizUnitName') {
                newData[row]['BizUnit'] = ''
              }
              if (key === 'FactUnitName') {
                newData[row]['FactUnit'] = ''
              }
              if (key === 'WHKindName') {
                newData[row]['SMWHKind'] = ''
              }

              const currentStatus = newData[row]['Status'] || ''
              newData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'
            }
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

      if (key === 'BizUnitName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataUnit.find(
                (item) => item.BizUnitName === checkCopyData,
              )
            }

            if (selectedName) {
              product[cols[col].id] = selectedName.BizUnitName
              product['BizUnit'] = selectedName.BizUnit
            } else {
              product[cols[col].id] = ''
              product['BizUnit'] = ''
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
      if (key === 'FactUnitName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataUnit.find(
                (item) => item.FactUnitName === checkCopyData,
              )
            }

            if (selectedName) {
              product[cols[col].id] = selectedName.FactUnitName
              product['FactUnit'] = selectedName.FactUnit
            } else {
              product[cols[col].id] = ''
              product['FactUnit'] = ''
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
      if (key === 'WHKindName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataNaWare.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMWHKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMWHKind'] = ''
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

      if (key === 'MngDeptName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]

            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataMngDeptName.find(
                (item) => item.BeDeptName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.BeDeptName
              product['MngDeptSeq'] = selectedName.BeDeptSeq
            } else {
              product[cols[col].id] = ''
              product['MngDeptSeq'] = ''
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
      if (key === 'CommissionCustName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (newValue.copyData !== '') {
              selectedName = dataCommissionCust.find(
                (item) => item.CustName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.CustName
              product['CommissionCustSeq'] = selectedName.CustSeq
            } else {
              product[cols[col].id] = ''
              product['CommissionCustSeq'] = ''
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
      if (key === 'RegionName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataUMRegion.find(
                (item) => item.MinorName === checkCopyData,
              )
            }

            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['UMRegion'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['UMRegion'] = ''
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
      if (key === 'ScopeName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataScopeName.find(
                (item) => item.MinorName === checkCopyData,
              )
            }

            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['UMScope'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['UMScope'] = ''
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

      if (
        key === 'FactUnit' ||
        key === 'SMWHKind' ||
        key === 'BizUnit' ||
        key === 'MngDeptSeq' ||
        key === 'CommissionCustSeq' ||
        key === 'UMRegion' ||
        key === 'UMScope' ||
        key === 'MngDeptSeq'
      ) {
        return
      }
      // Xử lý các trường hợp khác
      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''
        updatedData[row][key] = newValue.data
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
    [
      canEdit,
      cols,
      gridData,
      dataUnit,
      dataNaWare,
      dataMngDeptName,
      dataCommissionCust,
      dataUMRegion,
      dataScopeName,
    ],
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

      return [...sortedData, ...rowsWithStatusA]
    })
    setShowMenu(null)
  }
  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
      saveToLocalStorageSheet('H_ERP_COLS_PAGE_WARE_REGI', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_WARE_REGI', uniqueCols)
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_WARE_REGI', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_PAGE_WARE_REGI')
    localStorage.removeItem('H_ERP_COLS_PAGE_WARE_REGI')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_WARE_REGI', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_WARE_REGI',
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_WARE_REGI', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_WARE_REGI', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_WARE_REGI', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_WARE_REGI', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center ">
      <div className="w-full h-full flex flex-col  bg-white overflow-hidden ">
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
          freezeColumns={1}
          rowHeight={27}
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
          overscrollX={0}
          smoothScrollY={true}
          smoothScrollX={true}
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
          customRenderers={[
            CellsBizUnit,
            CellsFactUnit,
            CellsMinorName,
            CellsMngDeptName,
            CellsCommissionCustName,
            CellsUMRegion,
            CellsScope,
          ]}
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
                  handleRestSheet={handleRestSheet}
                  data={gridData}
                  handleRowAppend={handleRowAppend}
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

export default TableWarehousRegistration
