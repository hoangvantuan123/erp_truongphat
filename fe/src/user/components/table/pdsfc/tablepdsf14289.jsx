import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message, Input, Select } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { Save, RotateCcw, Trash2 } from 'lucide-react';
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import DropdownWarehouse from '../../sheet/query/dropdownWarehouse'
import DropdownUser from '../../sheet/query/dropdownUsers'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import { CellsItemNameV01 } from '../../sheet/cells/cellsItemNameV01'
import { CellInOutDetailKindName } from '../../sheet/cells/cellsInOutDetailKindName'
import moment from 'moment'
function Tablepdsf14289({
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
  helpData04,
  gridData7,

  searchText3,
  dataWarehouse,
  setDataWarehouse,
  setSearchText3,
  setItemText3,
  setDataSearch3,
  setDataSheetSearch3,


  helpData08,
  setHelpData04,
  setSearchText4,
  setSearchText5,
  setItemText4,
  setItemText5,
  setDataSearch4,
  setDataSearch5,
  setDataSheetSearch4,
  searchText4,
  setHelpData10,
  helpData10,
  handleSave5,
  helpData11,
  setHelpData11,

  setBizUnit,
  handleSave5D,
  BizUnit,
  handleDeleteDataSheet5Item
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)
  const controllers = useRef({})
  const [isLoading, setIsLoading] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('pdsfc_work_report_14289_ah', [])
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
  const columnNames = ['ItemName', 'ItemNo', 'Spec', 'UnitName', 'STDUnitName', 'STDQty', 'InOutDetailKindName'];
  const grayColumns = ['ItemNo', 'Spec', 'UnitName', 'STDUnitName', 'STDQty'];

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

      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''
      /* IsStop */

      const cellConfig = {
        ItemName: {
          kind: 'item-name-cell-v01',
          allowedValues: helpData10,
          setCacheData: setHelpData10,
        },
        InOutDetailKindName: {
          kind: 'cell-in-out-detail-kind-name',
          allowedValues: helpData11,
          setCacheData: setHelpData11,
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
      if (columnKey === "Qty"
      ) {
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
          contentAlign: "right",
        };
      }

      if (columnKey === "Amt"
        || columnKey === "Price"
      ) {
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
          contentAlign: "right",
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
    [gridData, cols, helpData10, helpData11],
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
      const lastRowIndex = gridData.length - 1

      if (row === lastRowIndex) {
        return
      }


      if (key === "ItemName" && newValue.kind === GridCellKind.Custom) {
        let selectedName;

        if (newValue.data instanceof Promise) {
          selectedName = await newValue.data;
          selectedName = selectedName[0];
        } else {
          selectedName = newValue?.data[0];
        }
        const checkCopyData = newValue.copyData;

        if (!selectedName) {
          selectedName = await callGetCodeHelpNow(checkCopyData);
          selectedName = selectedName ? selectedName[0] : null;
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
          } else {
            product[cols[col].id] = "";
            product["ItemSeq"] = "";
            product["ItemNo"] = "";
            product["Spec"] = "";
            product["UnitName"] = "";
            product["UnitSeq"] = "";
          }

          product["IdxNo"] = row + 1;
          product["Status"] = product["Status"] === "A" ? "A" : "U";

          if (row !== lastRowIndex) {
            newData[row] = product
          }
          return newData;
        });
        return;
      }
      if (key === 'InOutDetailKindName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = helpData11.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['InOutDetailKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['InOutDetailKind'] = ''
            }
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            return newData
          })
          return
        }
      }
      if (key === 'Qty') {
        setGridData((prevData) => {
          const newData = [...prevData];
          const product = newData[row];

          const qty = parseFloat(newValue.data);
          const price = parseFloat(product["Price"]);

          product["Qty"] = newValue.data;

          if (!isNaN(qty) && !isNaN(price)) {
            product["Amt"] = Math.round(qty * price * 1000) / 1000;
          }

          product['IdxNo'] = row + 1;
          const currentStatus = product['Status'] || 'U';
          product['Status'] = currentStatus === 'A' ? 'A' : 'U';

          return newData;
        });
        return;
      }

      if (key === 'Price') {
        setGridData((prevData) => {
          const newData = [...prevData];
          const product = newData[row];

          const price = parseFloat(newValue.data);
          const qty = parseFloat(product["Qty"]);
          const amt = parseFloat(product["Amt"]);

          product["Price"] = newValue.data;

          if (!isNaN(price) && !isNaN(qty)) {
            product["Amt"] = Math.round(price * qty * 1000) / 1000;
          } else if (!isNaN(amt) && !isNaN(price)) {
            product["Qty"] = Math.round(amt / price * 1000) / 1000;
          }

          product['IdxNo'] = row + 1;
          const currentStatus = product['Status'] || 'U';
          product['Status'] = currentStatus === 'A' ? 'A' : 'U';

          return newData;
        });
        return;
      }

      if (key === 'Amt') {
        setGridData((prevData) => {
          const newData = [...prevData];
          const product = newData[row];

          const amt = parseFloat(newValue.data);
          const qty = parseFloat(product["Qty"]);
          const price = parseFloat(product["Price"]);

          product["Amt"] = newValue.data;

          if (!isNaN(amt) && !isNaN(qty)) {
            product["Price"] = Math.round(amt / qty * 1000) / 1000;
          } else if (!isNaN(amt) && !isNaN(price)) {
            product["Qty"] = Math.round(amt / price * 1000) / 1000;
          }

          product['IdxNo'] = row + 1;
          const currentStatus = product['Status'] || 'U';
          product['Status'] = currentStatus === 'A' ? 'A' : 'U';

          return newData;
        });
        return;
      }


      const keysToProcess = [
        'ItemNo', 'Spec', 'UnitName', 'STDUnitName', 'STDQty', 'Value'
      ]

      if (keysToProcess.includes(key)) {
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
    [canEdit, cols, gridData, helpData11, helpData10],
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
      saveToLocalStorageSheet('pdsfc_work_report_14289_ah', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('pdsfc_work_report_14289_a', uniqueCols)
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
        saveToLocalStorageSheet('pdsfc_work_report_14289_a', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('pdsfc_work_report_14289_a')
    localStorage.removeItem('pdsfc_work_report_14289_ah')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('pdsfc_work_report_14289_a', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'pdsfc_work_report_14289_a',
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
        saveToLocalStorageSheet('pdsfc_work_report_14289_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('pdsfc_work_report_14289_ah', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('pdsfc_work_report_14289_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('pdsfc_work_report_14289_ah', newHidden)
        return newHidden
      })
    }
  }
  useEffect(() => {
    if (gridData7?.BizUnit && helpData04?.length > 0) {
      setBizUnit(gridData7.BizUnit);
    }
  }, [gridData7, helpData04]);
  return (
    <div className="w-full  h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col bg-white  overflow-x-hidden overflow-hidden ">
        <div className="text-[10px] border-b uppercase">
          <div className="flex items-center gap-3 p-2">
            <button onClick={handleSave5} className="flex items-center gap-1 px-2 py-1 text-emerald-600 text-xs hover:bg-emerald-50 rounded">
              <Save size={14} />
              {t('17413')}
            </button>
            <button onClick={handleSave5D} className="flex items-center gap-1 px-2 py-1 text-indigo-600 text-xs hover:bg-indigo-50 rounded">
              <RotateCcw size={14} />
              {t('14294')}
            </button>
            <button onClick={handleDeleteDataSheet5Item} className="flex items-center gap-1 px-2 py-1 text-rose-600 text-xs hover:bg-rose-50 rounded">
              <Trash2 size={14} />
              {t('18831')}
            </button>
          </div>

          <div className="flex items-center border-t  p-2 gap-2">
            <div className="flex flex-col">
              <label htmlFor="typeSelect" className="text-[9px] font-normal text-gray-600">
                {t('2')}:
              </label>
              <Select
                id="typeSelect"
                size="middle"
                style={{
                  width: 150,
                }}
                value={BizUnit}
                onChange={setBizUnit}
                options={
                  helpData04?.map((item) => ({
                    label: item?.BizUnitName,
                    value: item?.BizUnit,
                  })) || []
                }
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="input-field" className="text-[9px]  text-gray-600">
                {t('360')}:
              </label>
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText4}
                onFocus={() => setDropdownVisible(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              <DropdownUser
                helpData={helpData08}
                setHelpData05={setHelpData04}
                setSearchText={setSearchText4}
                setSearchText1={setSearchText5}
                setItemText={setItemText4}
                setItemText1={setItemText5}
                setDataSearch={setDataSearch4}
                setDataSearchDept={setDataSearch5}
                setDataSheetSearch={setDataSheetSearch4}
                setDropdownVisible={setDropdownVisible}
                dropdownVisible={dropdownVisible}
                searchText={searchText4}
                controllers={controllers}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="input-field" className="text-[9px]  text-gray-600">
                {t('Kho nhập kho')}:
              </label>
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText3}
                onFocus={() => setDropdownVisible2(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible2 && (
                <DropdownWarehouse
                  helpData={dataWarehouse}
                  setHelpData05={setDataWarehouse}
                  setSearchText={setSearchText3}
                  setItemText={setItemText3}
                  setDataSearch={setDataSearch3}
                  setDataSheetSearch={setDataSheetSearch3}
                  setDropdownVisible={setDropdownVisible2}
                  dropdownVisible={dropdownVisible2}
                  searchText={searchText3}
                  controllers={controllers}
                />
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="input-field" className="text-[9px]  text-gray-600">
                {t('Số nhập kho')}:
              </label>
              <Input
                id="input-field"
                className="max-w-xs"
                value={gridData7?.InOutNo}
                readOnly
              />
            </div>
          </div>
        </div>
        <h2 className="text-[10px]  border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          SHEET DATA  {t('14289')}
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
          onCellEdited={onCellEdited}
          customRenderers={[
            CellsItemNameV01,
            CellInOutDetailKindName
          ]}
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

export default Tablepdsf14289
