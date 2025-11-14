import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
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
import { CellsSMDeptType } from '../../sheet/cells/cellsSMDeptType'
import { CellsTaxName } from '../../sheet/cells/cellsTaxName'
import { CellsAccUnitName } from '../../sheet/cells/cellsAccUnitName'
import { CellsBizUnit } from '../../sheet/cells/cellsBizUnit'
import { CellsSlipUnitName } from '../../sheet/cells/cellsSlipUnit'
import { CellsFactUnit } from '../../sheet/cells/cellsFactUnit'
import { CellsUMCostType } from '../../sheet/cells/cellsUmCostType'
import dayjs from 'dayjs'
function TableDaDept({
  SMDeptTypeData,
  TaxNameData,
  AccUnitNameData,
  BizUnitNameData,
  SlipUnitNameData,
  FactUnitNameData,
  UMCostTypeData,
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
  setHelpData09,
  helpData09,
  helpData08,
  setHelpData08,
  FactUnit,
  helpData12,
  onCellClickedDaDept,
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const formatDate = (date) => (date ? date.format('YYYYMMDD') : '')
  const dateFormat = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '')

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('DA_DEPT_LIST_H', [])
  })
  const [hoverRow, setHoverRow] = useState(undefined)

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location;
    const lastRowIndex = numRows - 1;

    if (row === lastRowIndex) {
      setHoverRow(undefined);
    } else {
      setHoverRow(args.kind !== 'cell' ? undefined : row);
    }
  }, [numRows]);

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
  const columnNames = [
    'SMDeptTypeName',
    'TaxName',
    'AccUnitName',
    'BizUnitName',
    'SlipUnitName',
    'FactUnitName',
    'UMCostTypeName',
  ]
  const grayColumns = [

  ]

  const highlightRegions = columnNames.map((columnName) => ({
    color: grayColumns.includes(columnName) ? '#f0f0f0' : '#e8f0ff',
    range: {
      x: reorderColumns(cols).indexOf(columnName),
      y: 0,
      width: 1,
      height: numRows,
    },
  }));
  const getData = useCallback(
    ([col, row]) => {

      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''

      const cellConfig = {
        SMDeptTypeName: {
          kind: 'cells-sm-dept-type',
          allowedValues: SMDeptTypeData,
          setCacheData: setHelpData09,
        },
        TaxName: {
          kind: 'cells-tax-name',
          allowedValues: TaxNameData,
          setCacheData: setHelpData08,
        },
        UMCostTypeName: {
          kind: 'cells-um-cost-type',
          allowedValues: UMCostTypeData,
          setCacheData: setHelpData08,
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

      if (columnKey === 'AccUnitName') {
        const value = person['AccUnit'] || ''
        const accUnit = AccUnitNameData.find(
          (item) => item.Value === value,
        ) || { MinorName: '', Value: 0 }

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: String(accUnit.MinorName),
          data: {
            kind: 'cells-acc-unit-name',
            allowedValues: AccUnitNameData,
            value: accUnit.MinorName,
          },
          displayData: String(accUnit.MinorName),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'BizUnitName') {
        const value = person['BizUnit'] || ''
        const accUnit = BizUnitNameData.find(
          (item) => item.BizUnit === value,
        ) || { BizUnit: '', Value: 0 }

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: String(accUnit.BizUnitName),
          data: {
            kind: 'biz-unit-cell',
            allowedValues: BizUnitNameData,
            value: accUnit.BizUnitName,
          },
          displayData: String(accUnit.BizUnitName),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'SlipUnitName') {
        const value = person['SlipUnit'] || ''
        const slipUnit = SlipUnitNameData.find(
          (item) => item.Value === value,
        ) || { MinorName: '', Value: 0 }

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: String(slipUnit.MinorName),
          data: {
            kind: 'cells-slip-unit-name',
            allowedValues: SlipUnitNameData,
            value: slipUnit.MinorName,
          },
          displayData: String(slipUnit.MinorName),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'FactUnitName') {
        const value = person['FactUnit'] || ''
        const factUnit = FactUnitNameData.find(
          (item) => item.FactUnit === value,
        ) || { FactUnitName: '', FactUnit: 0 }

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: String(factUnit.FactUnitName),
          data: {
            kind: 'fact-unit-cell',
            allowedValues: FactUnitNameData,
            value: factUnit.FactUnitName,
          },
          displayData: String(factUnit.FactUnitName),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'BegDate' ) {
        let date = value.trim() === '' ? formatDate(value) : value
        return {
          kind: GridCellKind.Text,
          data: date,
          copyData: String(date),
          displayData: dateFormat(date) || '',
          readonly: false,
          allowOverlay: true,
          hasMenu: false,
        }
      }

      if (columnKey === 'EndDate') {
        let date = value.trim() === '' ? formatDate(value) : value
        
        return {
          kind: GridCellKind.Text,
          data: date,
          copyData: String(date),
          displayData: dateFormat(date) || '',
          readonly: false,
          allowOverlay: true,
          hasMenu: false,
        }
      }

      if (columnKey === 'IsUse') {
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
          readonly: true,
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
    [gridData, cols, defaultCols, helpData08, helpData09, helpData12,],
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


      const indexes = reorderColumns(cols)
      const [col, row] = cell
      const key = indexes[col]

      if (
        newValue.kind !== GridCellKind.Text &&
        newValue.kind !== GridCellKind.Custom &&
        newValue.kind !== GridCellKind.Boolean &&
        newValue.kind !== GridCellKind.Number
      ) {
        return
      }



      if (key === 'SMDeptTypeName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = SMDeptTypeData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMDeptTypeName'] = selectedName.MinorName
              product['SMDeptType'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMDeptTypeName'] = ''
              product['SMDeptType'] = ''
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

      if (key === 'TaxName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = TaxNameData.find(
                (item) => item.TaxNoAlias === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.TaxNoAlias
              product['TaxName'] = selectedName.TaxNoAlias
              product['TaxUnit'] = selectedName.TaxUnit
            } else {
              product[cols[col].id] = ''
              product['TaxName'] = ''
              product['TaxUnit'] = ''
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

      if (key === 'AccUnitName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = AccUnitNameData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['AccUnitName'] = selectedName.MinorName
              product['AccUnit'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['AccUnitName'] = ''
              product['AccUnit'] = ''
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

      if (key === 'SlipUnitName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = SlipUnitNameData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SlipUnitName'] = selectedName.MinorName
              product['SlipUnit'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SlipUnitName'] = ''
              product['SlipUnit'] = ''
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

      if (key === 'BizUnitName' && newValue.kind === GridCellKind.Custom) {
        setGridData((prev) => {
          const newData = [...prev]
          const product = newData[row]
          let selectedName = newValue.data[0]
          const checkCopyData = newValue.copyData
          if (!selectedName) {
            selectedName = BizUnitNameData.find(
              (item) => item.BizUnitName === checkCopyData,
            )
          }
          if (selectedName) {
            product[cols[col].id] = selectedName.BizUnitName
            product['BizUnitName'] = selectedName.BizUnitName
            product['BizUnit'] = selectedName.BizUnit
          } else {
            product[cols[col].id] = ''
            product['BizUnitName'] = ''
            product['BizUnit'] = ''
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

      if (key === 'FactUnitName' && newValue.kind === GridCellKind.Custom) {
        setGridData((prev) => {
          const newData = [...prev]
          const product = newData[row]
          let selectedName = newValue.data[0]
          const checkCopyData = newValue.copyData
          if (!selectedName) {
            selectedName = FactUnitNameData.find(
              (item) => item.FactUnitName === checkCopyData,
            )
          }
          if (selectedName) {
            product[cols[col].id] = selectedName.FactUnitName
            product['FactUnitName'] = selectedName.FactUnitName
            product['FactUnit'] = selectedName.FactUnit
          } else {
            product[cols[col].id] = ''
            product['FactUnitName'] = ''
            product['FactUnit'] = ''
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

      if (key === 'UMCostTypeName' && newValue.kind === GridCellKind.Custom) {
        setGridData((prev) => {
          const newData = [...prev]
          const product = newData[row]
          let selectedName = newValue.data[0]
          const checkCopyData = newValue.copyData
          if (!selectedName) {
            selectedName = UMCostTypeData.find(
              (item) => item.MinorName === checkCopyData,
            )
          }
          if (selectedName) {
            product[cols[col].id] = selectedName.MinorName
            product['UMCostTypeName'] = selectedName.MinorName
            product['UMCostType'] = selectedName.Value
          } else {
            product[cols[col].id] = ''
            product['UMCostTypeName'] = ''
            product['UMCostType'] = ''
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

 
      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''

        updatedData[row][key] = newValue.data
        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'
        updatedData[row]['IdxNo'] = row + 1

        return updatedData
      })
    },
    [canEdit, cols, gridData, defaultCols],
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
      saveToLocalStorageSheet('DA_DEPT_LIST_H', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('DA_DEPT_LIST', uniqueCols)
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
        saveToLocalStorageSheet('DA_DEPT_LIST', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('DA_DEPT_LIST')
    localStorage.removeItem('DA_DEPT_LIST_H')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('DA_DEPT_LIST', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'DA_DEPT_LIST',
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
        saveToLocalStorageSheet('DA_DEPT_LIST', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('DA_DEPT_LIST_H', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('DA_DEPT_LIST', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('DA_DEPT_LIST_H', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full  h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col bg-white  overflow-x-hidden overflow-hidden ">
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
          rowSelect="multi"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          width="100%"
          height="100%"
          headerHeight={30}
          rowHeight={27}
          freezeTrailingRows={1}  
          onRowAppended={() => handleRowAppend(1)}
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
          overscrollX={0}
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
          highlightRegions={highlightRegions}
          onCellEdited={onCellEdited}
          onCellClicked={onCellClickedDaDept}
          customRenderers={[
            CellsAccUnitName,
            CellsTaxName,
            CellsSMDeptType,
            CellsBizUnit,
            CellsSlipUnitName,
            CellsFactUnit,
            CellsUMCostType,
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

export default TableDaDept
