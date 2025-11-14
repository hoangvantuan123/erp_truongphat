import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useTranslation } from 'react-i18next'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { CellsItemNameV01 } from '../../sheet/cells/cellsItemNameV01'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { Cells17001 } from '../../sheet/cells/cells17001'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { Cells10010 } from '../../sheet/cells/cells10010'
import { CellsItemNameV3 } from '../../sheet/cells/cellsItemNameV3'
import { CellsFactUnit } from '../../sheet/cells/cellsFactUnit'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { PostSPDMPSProdPlanConfirm } from '../../../../features/pdmmPlan/postSPDMPSProdPlanConfirm'
import moment from 'moment'
import { debounce } from 'lodash'
function TablePdmpsProdPlan({
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
  helpData01,
  helpData02,
  helpData03,
  setAddedRows,
  setHelpData01,
  helpData06,
  setHelpData06
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const controllers = useRef({})
  const [isLoading, setIsLoading] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('pdmps_prod_plan_ah', [])
  })
  const loadingBarRef = useRef(null);
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

  const [keybindings, setKeybindings] = useState({
    downFill: true,
    rightFill: true,
    selectColumn: false,
  })
  const columnNames = ['ItemName', 'ProdDeptName', 'WorkCond7', 'CfmDate', 'AssetName', 'CfmEmpName', 'ProdPlanNo', 'FactUnitName'];
  const grayColumns = ['WorkCond7', 'CfmDate', 'CfmEmpName', 'ProdPlanNo', 'AssetName'];

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
      let value = person[columnKey] || ''
      const cellConfig = {
        ItemName: {
          kind: 'cell-item-name-v3',
          allowedValues: helpData01,
          setCacheData: setHelpData01,
        },
        CustName: {
          kind: 'cell-17001',
          allowedValues: helpData02,
          setCacheData: setHelpData01,
        },
        ProdDeptName: {
          kind: 'cell-10010',
          allowedValues: helpData03,
          setCacheData: setHelpData01,
        },
        FactUnitName: {
          kind: 'fact-unit-cell',
          allowedValues: helpData06,
          setCacheData: setHelpData06,
        },
      }
      if (cellConfig[columnKey]) {
        let copyData = value ? String(value) : ''

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData,
          data: {
            kind: cellConfig[columnKey].kind,
            allowedValues: cellConfig[columnKey].allowedValues,
            setCacheData: cellConfig[columnKey].setCacheData,
            value: value || '',
          },
          displayData: String(value || ''),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }
      if (columnKey === 'IsSaved') {
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
          readonly: column?.readonly || false,
        }
      }
      if (columnKey === 'ProdPlanEndDate' || columnKey === "ProdPlanDate") {
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

      if (columnKey === "ProdPlanQty") {
        const isEmptyValue = value === null || value === undefined || value === "";

        const formattedValue = isEmptyValue
          ? ""
          : new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }).format(value);

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: isEmptyValue ? "" : String(value),
          displayData: formattedValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
          contentAlign: "right"
        };
      }

      if (columnKey === "WorkCond7") {
        const isEmptyValue = value === null || value === undefined || value === "";

        const formattedValue = isEmptyValue
          ? ""
          : new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: isEmptyValue ? "" : String(value),
          displayData: formattedValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
          contentAlign: "right"
        };
      }

      return {
        kind: GridCellKind.Text,
        data: value,
        copyData: String(value || ""),
        displayData: String(value || ""),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
        isEditing: true,
      };
    },
    [gridData, cols, helpData01, helpData02, helpData03]
  );

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

  const lastFetchedData = useRef(new Map());
  const fetchingKeys = useRef(new Set());

  

  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (canEdit === false) {
        message.warning(t('850000035'))
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

      if (key === "ItemName" && newValue.kind === GridCellKind.Custom) {
        let selectedName = newValue.data[0]
        const checkCopyData = newValue.copyData

        if (!selectedName) {
          selectedName = helpData01.find(item => item.ItemName === checkCopyData)
        }

        setGridData((prev) => {
          const newData = [...prev];
          const product = newData[row];

          if (selectedName) {
            product[cols[col].id] = selectedName.ItemName;
            product["ItemSeq"] = selectedName.ItemSeq;
            product["ItemNo"] = selectedName.ItemNo;
            product["Spec"] = selectedName.Spec;
            product["UnitName"] = selectedName.UnitName;
            product["UnitSeq"] = selectedName.UnitSeq;
            product["BOMRevName"] = selectedName.BOMRevName;
            product["BOMRev"] = selectedName.BOMRev;
            product["ProcRevName"] = selectedName.ProcRevName;
            product["ProcRev"] = selectedName.ProcRev;

          } else {
            product[cols[col].id] = "";
            product["ItemSeq"] = "";
            product["ItemNo"] = "";
            product["Spec"] = "";
            product["UnitName"] = "";
            product["UnitSeq"] = "";
            product["BOMRevName"] = "";
            product["BOMRev"] = "";
            product["ProcRevName"] = "";
            product["ProcRev"] = "";
          }

          product["IdxNo"] = row + 1;
          product["Status"] = product["Status"] === "A" ? "A" : "U";
          return newData;
        });
        return;
      }



      if (key === 'ProdDeptName' && newValue.kind === GridCellKind.Custom) {
        let selectedName = newValue.data[0]
        const checkCopyData = newValue.copyData

        if (!selectedName) {
          selectedName = helpData03.find(item => item.BeDeptName === checkCopyData)
        }

        setGridData((prev) => {
          const newData = [...prev]
          const product = newData[row]

          if (selectedName) {
            product[cols[col].id] = selectedName.BeDeptName
            product['ProdDeptSeq'] = selectedName.BeDeptSeq
          } else {
            product[cols[col].id] = ''
            product['PlanDeptSeq'] = ''
          }

          product['IdxNo'] = row + 1
          product['Status'] = product['Status'] === 'A' ? 'A' : 'U'
          return newData
        })
        return
      }
      if (key === 'FactUnitName' && newValue.kind === GridCellKind.Custom) {
        let selectedName = newValue.data[0]
        const checkCopyData = newValue.copyData

        if (!selectedName) {
          selectedName = helpData06.find(item => item.FactUnitName === checkCopyData)
        }

        setGridData((prev) => {
          const newData = [...prev]
          const product = newData[row]

          if (selectedName) {
            product[cols[col].id] = selectedName.FactUnitName
            product['FactUnit'] = selectedName.FactUnit
          } else {
            product[cols[col].id] = ''
            product['FactUnit'] = ''
          }

          product['IdxNo'] = row + 1
          product['Status'] = product['Status'] === 'A' ? 'A' : 'U'
          return newData
        })
        return
      }

      if (
        key === 'ItemNo' ||
        key === 'Spec' ||
        key === 'ItemSeq' ||
        key === 'ItemSeqOld' ||
        key === 'CustSeq' ||
        key === 'PlanDeptSeq' ||
        key === 'UnitName' ||
        key === 'UnitSeq'
      ) {
        return
      }

      if (key === 'IsSaved' && newValue.kind === GridCellKind.Boolean) {
        const currentRowData = gridData[row];
        const prodPlanSeq = currentRowData?.ProdPlanSeq;

        if (!prodPlanSeq) {
          message.warning("Vui lòng lưu dữ liệu trước khi cập nhật trạng thái.");
          return;
        }

        const cfmCode = newValue.data ? 1 : 0;


        const check = [{
          ProdPlanSeq: prodPlanSeq,
          CfmCode: cfmCode,
        }];
        loadingBarRef.current?.continuousStart();
        togglePageInteraction(true);
        PostSPDMPSProdPlanConfirm(check)
          .then((res) => {
            setGridData((prev) => {
              const newData = [...prev];
              const product = newData[row];

              product[key] = newValue.data;
              product['Status'] = res?.success === false ? 'E' : '';
              product['IdxNo'] = row + 1;

              return newData;
            });

            if (res?.success === false) {
              message.error("API trả về lỗi khi cập nhật trạng thái.");
              loadingBarRef.current?.complete();
              togglePageInteraction(false);
              return;
            }
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
            message.success("Cập nhật trạng thái thành công!");
          })
          .catch((error) => {
            setGridData((prev) => {
              const newData = [...prev];
              const product = newData[row];
              loadingBarRef.current?.complete();
              togglePageInteraction(false);
              product[key] = newValue.data;
              product['Status'] = 'E';
              product['IdxNo'] = row + 1;

              return newData;
            });

            message.error("Cập nhật trạng thái thất bại!");
          });

        return;
      }




      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        updatedData[row][key] = newValue.data
        updatedData[row]['Status'] = updatedData[row]['Status'] === 'A' ? 'A' : 'U'
        updatedData[row]['IdxNo'] = row + 1
        return updatedData
      })
    },
    [canEdit, cols, gridData, helpData01, helpData02, helpData03, helpData06],
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
      const rowsWithStatusA = prevData.filter(row => row.Status === 'A');
      const rowsWithoutStatusA = prevData.filter(row => row.Status !== 'A');

      const sortedData = rowsWithoutStatusA.sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1;
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      const updatedData = updateIndexNo([...sortedData, ...rowsWithStatusA]);

      return updatedData;
    });

    setShowMenu(null);
  };

  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
      saveToLocalStorageSheet('pdmps_prod_plan_ah', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('pdmps_prod_plan_a', uniqueCols)
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
        saveToLocalStorageSheet('pdmps_prod_plan_a', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }


  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('pdmps_prod_plan_a')
    localStorage.removeItem('pdmps_prod_plan_ah')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('pdmps_prod_plan_a', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'pdmps_prod_plan_a',
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
        saveToLocalStorageSheet('pdmps_prod_plan_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('pdmps_prod_plan_ah', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('pdmps_prod_plan_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('pdmps_prod_plan_ah', newHidden)
        return newHidden
      })
    }
  }


  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full h-full flex flex-col  bg-white border-t overflow-hidden ">
        <h2 className="text-[10px] border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          DATA SHEET
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
          height={window.innerHeight}
          headerHeight={30}
          freezeTrailingRows={0}
          rowHeight={25}
          rowSelect="multi"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          freezeColumns={1}
          trailingRowOptions={{
            hint: ' ',
            sticky: true,
            tint: true,
          }}
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
          highlightRegions={highlightRegions}
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          isDraggable={false}
          onRowAppended={() => handleRowAppend(1)}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onCellEdited={onCellEdited}
          onItemHovered={onItemHovered}
          customRenderers={[
            CellsItemNameV3,
            Cells17001,
            Cells10010,
            CellsFactUnit
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

export default TablePdmpsProdPlan
