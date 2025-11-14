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
import { Save, Scissors } from 'lucide-react';
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { CellsEmpNameV2 } from '../../sheet/cells/cellsEmpNamev2'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { CellUMWorkCenterEmpType } from '../../sheet/cells/cellsUMWorkCenterEmpType'
import moment from 'moment'
function Tablepdsf512({
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
  helpData08,
  setHelpData08,
  handleSave4,
  handleDeleteDataSheet4,
  setHelpData13,
  helpData13
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const controllers = useRef({})
  const lastFetchedData = useRef(new Map())
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('pdsfc_work_report_512_ah', [])
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
  const columnNames = ['UMWorkCenterEmpName', 'EmpName'];
  const grayColumns = [];

  const highlightRegions = columnNames.map((columnName) => ({
    color: grayColumns.includes(columnName) ? '#f0f0f0' : '#e8f0ff',
    range: {
      x: reorderColumns(cols).indexOf(columnName),
      y: 0,
      width: 1,
      height: numRows - 1,
    },
  }));
  const getData = useCallback(
    ([col, row]) => {
      const lastRowIndex = numRows - 1;
      const helpDataMap = new Map(helpData13.map(item => [item.Value, item.MinorName]));

      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''
      /* IsStop */

      const cellConfig = {
        EmpName: {
          kind: 'cells-emp-name-v2',
          allowedValues: helpData08,
          setCacheData: setHelpData08,
        },
        UMWorkCenterEmpName: {
          kind: 'cells-UMWorkCenterEmpType',
          allowedValues: helpData13,
          setCacheData: setHelpData13,
        },

      }

      if (cellConfig[columnKey] && row !== lastRowIndex) {
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
      if (row === lastRowIndex) {
        const numericColumns = [
          "ProdQty",
          "OKQty",
          "BadQty",
          "ReOrderQty",
          "StdUnitProdQty",
          "StdUnitOKQty",
          "StdUnitBadQty",
          "StdUnitReOrderQty",

        ];

        if (numericColumns.includes(columnKey)) {
          const total = gridData.reduce((sum, item) => sum + (Number(item[columnKey]) || 0), 0);
          const formattedTotal = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
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

      if (columnKey === 'WorkOrderDate' || columnKey === "WorkDate") {
        let displayValue = ''
        let dataValue = value

        if (value && typeof value === 'string' && value.trim() !== '') {
          let momentObj = null

          if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            momentObj = moment(value, "YYYY-MM-DD", true);
          } else if (/^\d{8}$/.test(value)) {
            momentObj = moment(value, "YYYYMMDD", true);
          } else if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
            momentObj = moment(value, "YYYY/MM/DD", true);
          }

          if (momentObj && momentObj.isValid()) {
            displayValue = momentObj.format("YYYY-MM-DD");
            dataValue = momentObj.format("YYYYMMDD");
          } else {
            displayValue = "";
            dataValue = "";
          }
        }

        return {
          kind: GridCellKind.Text,
          data: dataValue,
          copyData: String(dataValue || ""),
          displayData: displayValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        };
      }

      if (columnKey === 'IsGoodIn' || columnKey === "IsLastProc" || columnKey === "IsMatInput") {
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
      if (columnKey === "WorkStartTime" || columnKey === "WorkEndTime") {
        const isEmptyValue = value === null || value === undefined || value === "";

        let formattedValue = isEmptyValue
          ? ""
          : value.toString().padStart(4, '0');

        if (!isEmptyValue) {
          formattedValue = formattedValue.slice(0, 2) + ":" + formattedValue.slice(2, 4);
        }

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: isEmptyValue ? "" : String(value),
          displayData: isEmptyValue ? "" : `${formattedValue}`,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
          contentAlign: "center",
        };
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
    [gridData, cols, helpData13, helpData08],
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
  const callGetCodeHelpNow2 = async (key) => {
    if (!key || key === 'N/A') return null
    key = key.replace(/\s+/g, '');
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
    controllers.current.callGetCodeHelpNow2 = controller

    try {
      const result = await GetCodeHelp(10009, key, '', '', '', '', '', 1, 0, '', 0, 0, 0, controller.signal);

      const data = result.data || []
      setHelpData08((prev) => {
        const existingItemSeqs = new Set(prev.map((item) => item.EmpSeq))
        const newData = data.filter(
          (item) => !existingItemSeqs.has(item.EmpSeq),
        )
        return [...prev, ...newData]
      })
      lastFetchedData.current.set(key, data)
      return data
    } catch (error) {
      return []
    } finally {
      togglePageInteraction(false)
      setIsLoading(false)
      fetchingKeys.current.delete(key)
      controllers.current.callGetCodeHelpNow2 = null
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
        newValue.kind !== GridCellKind.Boolean &&
        newValue.kind !== GridCellKind.Number
      ) {
        return
      }

      const indexes = reorderColumns(cols)
      const [col, row] = cell
      const key = indexes[col]
      const lastRowIndex = gridData.length - 1

      if (row === lastRowIndex) {
        return
      }

      if (key === 'EmpName' && newValue.kind === GridCellKind.Custom) {
        let selectedName

        if (newValue.data instanceof Promise) {
          selectedName = await newValue.data
          selectedName = selectedName[0]
        } else {
          selectedName = newValue?.data[0]
        }
        const checkCopyData = newValue.copyData

        if (!selectedName) {
          selectedName = await callGetCodeHelpNow2(checkCopyData)
          selectedName = selectedName ? selectedName[0] : null
        }

        setGridData((prev) => {
          const newData = [...prev]
          const product = newData[row] || {}

          if (selectedName) {
            product[cols[col].id] = selectedName?.EmpName || ''
            product['EmpSeq'] = selectedName?.EmpSeq || ''

          } else {
            product[cols[col].id] = ''
            product['EmpSeq'] = ''
          }

          product['IdxNo'] = row + 1
          product['Status'] = product['Status'] === 'A' ? 'A' : 'U'

          if (row !== lastRowIndex) {
            newData[row] = product
          }

          return newData
        })
        return
      }

      if (key === 'UMWorkCenterEmpName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = helpData13.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['UMWorkCenterEmpType'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['UMWorkCenterEmpType'] = ''
            }
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
        updatedData[row]['IdxNo'] = row + 1

        return updatedData
      })
    },
    [canEdit, cols, gridData, helpData13],
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
      saveToLocalStorageSheet('pdsfc_work_report_512_ah', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('pdsfc_work_report_a', uniqueCols)
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
        saveToLocalStorageSheet('pdsfc_work_report_a', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('pdsfc_work_report_a')
    localStorage.removeItem('pdsfc_work_report_512_ah')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('pdsfc_work_report_a', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'pdsfc_work_report_a',
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
        saveToLocalStorageSheet('pdsfc_work_report_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('pdsfc_work_report_512_ah', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('pdsfc_work_report_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('pdsfc_work_report_512_ah', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full  h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col bg-white  overflow-x-hidden overflow-hidden ">
        <div className="flex items-center gap-3 p-2">
          <button onClick={handleSave4} className="flex items-center gap-1 px-2 py-1 text-emerald-600 text-xs hover:bg-emerald-50 rounded">
            <Save size={14} />
            {t('55168')}
          </button>
          <button onClick={handleDeleteDataSheet4} className="flex items-center gap-1 px-2 py-1 text-rose-600 text-xs hover:bg-rose-50 rounded">
            <Scissors size={14} />
            {t('55208')}
          </button>

        </div>
        <h2 className="text-[10px] border-t  border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          SHEET DATA {t('512')}
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
          rowSelect="multi"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          width="100%"
          height="100%"
          headerHeight={30}
          freezeTrailingRows={1}
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
          isDraggable={false}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onItemHovered={onItemHovered}
          highlightRegions={highlightRegions}
          onCellEdited={onCellEdited}
          customRenderers={[CellsEmpNameV2, CellUMWorkCenterEmpType]}
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
        <Drawer title={t('850000017')} onClose={onClose} open={open}>
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

export default Tablepdsf512
