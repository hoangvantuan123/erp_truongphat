import { useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import ModalHelpRootMenu from '../../modal/system/modalHelpRootMenu'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import dayjs from 'dayjs'
import { AsyncDropdownCellRenderer } from '../../sheet/cells/AsyncDropdownCellRenderer'
import LayoutStatusMenuSheetNew from '../../sheet/jsx/layoutStatusMenuNew'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { CellsUMQcTitleName } from '../../sheet/cells/cellsUMQcTitleName'
import { CellsInputTypeName } from '../../sheet/cells/cellsInputTypeName'
import { CellsSMAQLLevelName } from '../../sheet/cells/cellsSMAQLLevelName'

function TableQcItemClassQcRight({
  dataQcUmTitleName,
  dataInputTypeName,
  dataSMAQLLevelName,
  setSelection,
  selection,
  setShowSearch,
  onCellClicked,
  showSearch,
  setEditedRows,
  setOnSelectRow,
  setOpenHelp,
  openHelp,
  setGridData,
  gridData,
  handleRestSheet,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  canEdit,
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [isCell, setIsCell] = useState(null)
  const formatDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '')

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('H_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', [])
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

  const columnNames = [
    'UMQCTitleName',
    'UMQCTitleSeq',
    'InPutTypeName',
    'SMAQLLevelName',
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

  const [dataSearch, setDataSearch] = useState([])

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
        UMQCTitleName: {
          kind: 'mng-umqc-title-name-cell',
          allowedValues: dataQcUmTitleName,
        },
        
      }

      if (
        columnKey === 'IsProcQC' ||
        columnKey === 'IsFinalQC' ||
        columnKey === 'IsOutQC' ||
        columnKey === 'IsPurQC'
      ) {
        const booleanValue =
          value === 1 || value === '1'
            ? true
            : (() => {
                const isFalse = value === 0 || value === '0' || value === null;
                return isFalse ? false : Boolean(value);
              })()
        return {
          kind: GridCellKind.Boolean,
          data: booleanValue,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'UMQCTitleName') {
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
    [gridData, cols],
  )

  const onKeyUp = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        console.log('Enter pressed')
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

      if (key === 'UMQCTitleName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]

            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataQcUmTitleName.find(
                (item) => item.UMQCTitleName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.UMQCTitleName
              product['UMQCTitleName'] = selectedName.UMQCTitleName
              product['UMQCTitleSeq'] = selectedName.UMQCTitleSeq
            } else {
              product[cols[col].id] = ''
              product['UMQCTitleName'] = ''
              product['UMQCTitleSeq'] = ''
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

      if (key === 'IsProcQC') {
        if (newValue.kind === GridCellKind.Boolean) {
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
              product['IsProcQC'] = selectedName
            } else {
              product[cols[col].id] = false
              product['IsProcQC'] = false
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

      if (key === 'IsFinalQC') {
        if (newValue.kind === GridCellKind.Boolean) {
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
              product['IsFinalQC'] = selectedName
            } else {
              product[cols[col].id] = false
              product['IsFinalQC'] = false
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

      if (key === 'IsOutQC') {
        if (newValue.kind === GridCellKind.Boolean) {
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
              product['IsOutQC'] = selectedName
            } else {
              product[cols[col].id] = false
              product['IsOutQC'] = false
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

      if (key === 'IsPurQC') {
        if (newValue.kind === GridCellKind.Boolean) {
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
              product['IsPurQC'] = selectedName
            } else {
              product[cols[col].id] = false
              product['IsPurQC'] = false
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
    [canEdit, cols, gridData],
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
      const rowsWithStatusA = prevData.filter((row) => row.Status === 'A')
      const rowsWithoutStatusA = prevData.filter((row) => row.Status !== 'A')

      const sortedData = rowsWithoutStatusA.sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1
        return 0
      })

      const totalRow = prevData.find((row) => row.BizUnitName === 'TOTAL')
      if (totalRow) {
        sortedData.push(totalRow)
      }

      return [...sortedData, ...rowsWithStatusA]
    })
    setShowMenu(null)
  }
  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
      saveToLocalStorageSheet('H_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', uniqueCols)
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT')
    localStorage.removeItem('H_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', updatedCols)
      return updatedCols
    })
  }, [])

  const getRowThemeOverride = useCallback(
    (rowIndex) => {
      if (gridData[rowIndex]?.BizUnitName === 'TOTAL') {
        return {
          fontWeight: 'bold',
        }
      }
      return rowIndex % 2 === 0
        ? undefined
        : {
            bgCell: '#FBFBFB',
          }
    },
    [gridData],
  )

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT',
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_QA_ITEM_CLASS_QC_RIGHT', newHidden)
        return newHidden
      })
    }
  }

  const formattedData = gridData.map((item) => {
    const newItem = {}
    cols.forEach((header) => {
      if (item[header.id] !== undefined) {
        if (
          header.id === 'QCDate' ||
          header.id === 'BLDate' ||
          header.id === 'DelvDate' ||
          header.id === 'TestEndDate'
        ) {
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
    <div className="w-full gap-1 h-full flex items-center justify-center pb-2">
      <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">

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
          headerHeight={30}
          rowHeight={28}
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          freezeColumns={1}
          trailingRowOptions={{
            hint: ' ',
            sticky: true,
            tint: true,
          }}
          highlightRegions={highlightRegions}
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
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onItemHovered={onItemHovered}
          customRenderers={[
            AsyncDropdownCellRenderer,
            CellsUMQcTitleName,
            CellsInputTypeName,
            CellsSMAQLLevelName,
          ]}
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
                  fileName="QAItemClassSub"
                  customHeaders={cols}
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

export default TableQcItemClassQcRight
