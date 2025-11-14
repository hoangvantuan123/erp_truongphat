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
import { CellsWorkOrderNo } from '../../sheet/cells/cellsWorkOrderNo'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { CellsEmpNameV2 } from '../../sheet/cells/cellsEmpNamev2'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import moment from 'moment'
function TablepdsfcWorkReport({
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
  helpData12
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
  const fetchingKeys = useRef(new Set())
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('pdsfc_work_report_ah', [])
  })
  const [isLoading, setIsLoading] = useState(false)
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
  const columnNames = ['WorkCenterName', 'WorkOrderNo', 'GoodItemName', 'GoodItemNo', 'GoodItemSpec', 'ProcRevName', 'ItemBomRevName', 'ProcName', 'AssyItemName',

    'AssyItemNo',
    'AssyItemSpec',
    'ProdUnitName',
    'OrderQty',
    'EmpName',

    'StdUnitProdQty',
    'StdUnitOKQty',
    'StdUnitBadQty',
    'WorkType',
    'ToSeq',
    'IsProcQC',
    'IsLastProc',
    'FromQty',
    'ProdPlanNo',
    'IsMatInPut'
  ];
  const grayColumns = [
    'WorkCenterName',
    'GoodItemName',
    'GoodItemNo',
    'GoodItemSpec',
    'ProcRevName',
    'ItemBomRevName',
    'ProcName',
    'AssyItemName',

    'AssyItemNo',
    'AssyItemSpec',
    'ProdUnitName',
    'OrderQty',

    'StdUnitProdQty',
    'StdUnitOKQty',
    'StdUnitBadQty',
    'WorkType',
    'ToSeq',
    'IsProcQC',
    'IsLastProc',
    'FromQty',
    'ProdPlanNo',
    'IsMatInPut'


  ];

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
      const helpDataMap = new Map(helpData12.map(item => [item.Value, item.MinorName]));

      const lastRowIndex = numRows - 1;

      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''


      /* WorkType */
      if (columnKey === "WorkType" && row !== lastRowIndex && value) {
        const displayName = helpDataMap.get(value) || "";
        return {
          kind: GridCellKind.Text,
          data: displayName,
          displayData: displayName,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        };
      }
      const cellConfig = {
        WorkOrderNo: {
          kind: 'cells-work-order-no',
          allowedValues: helpData09,
          setCacheData: setHelpData09,
        },
        EmpName: {
          kind: 'cells-emp-name-v2',
          allowedValues: helpData08,
          setCacheData: setHelpData08,
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
      if (columnKey === "OrderQty"
        || columnKey === "ProdQty"
        || columnKey === "OKQty"
        || columnKey === "BadQty"
        || columnKey === "WorkCondition4"
        || columnKey === "WorkCondition5"
        || columnKey === "WorkCondition6"
        || columnKey === "WorkCondition7"
        || columnKey === "StdUnitProdQty"
        || columnKey === "StdUnitOKQty"
        || columnKey === "StdUnitBadQty"
        || columnKey === "FromQty"

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
      if (columnKey === 'IsProcQC' || columnKey === "IsLastProc" || columnKey === "IsMatInPut") {
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
    [gridData, cols, helpData08, helpData09, helpData12],
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
    controllers.current.callGetCodeHelpNow = controller

    try {
      const result = await GetCodeHelp(
        60011, key, "", "1015", "", "", "1", 1, 50, "IsComplete = ''0''", 2, 1, 1, controller.signal, 28155
      );

      const data = result.data || []
      setHelpData09((prev) => {
        const existingItemSeqs = new Set(prev.map((item) => item.WorkOrderSeq))
        const newData = data.filter(
          (item) => !existingItemSeqs.has(item.WorkOrderSeq),
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
        message.warning('Bạn không có quyền chỉnh sửa dữ liệu')
        return
      }

      const lastRowIndex = gridData.length - 1
      const [col, row] = cell

      if (row === lastRowIndex) {
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
      const key = indexes[col]
      const keysToProcess = [
        'WorkCenterName',
        'GoodItemName',
        'GoodItemNo',
        'GoodItemSpec',
        'ProcRevName',
        'ItemBomRevName',
        'ProcName',
        'AssyItemName',
        'AssyItemNo',
        'AssyItemSpec',
        'ProdUnitName',
        'OrderQty',
        'StdUnitProdQty',
        'StdUnitOKQty',
        'StdUnitBadQty',
        'WorkType',
        'ToSeq',
        'IsProcQC',
        'IsLastProc',
        'FromQty',
        'ProdPlanNo',
        'IsMatInPut'
      ]

      if (keysToProcess.includes(key)) {
        return
      }

      if (key === 'WorkOrderNo' && newValue.kind === GridCellKind.Custom) {
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
          const product = newData[row] || {}

          if (selectedName) {
            product[cols[col].id] = selectedName?.WorkOrderNo || ''
            product['WorkCenterName'] = selectedName?.WorkCenterName || ''
            product['GoodItemName'] = selectedName?.GoodItemName || ''
            product['GoodItemNo'] = selectedName?.GoodItemNo || ''
            product['GoodItemSpec'] = selectedName?.GoodItemSpec || ''
            product['ProcRevName'] = selectedName?.ProcRevName || ''
            product['ItemBomRevName'] = selectedName?.ItemBomRevName || ''
            product['ProcName'] = selectedName?.ProcName || ''
            product['AssyItemName'] = selectedName?.AssyItemName || ''
            product['AssyItemNo'] = selectedName?.AssyItemNo || ''
            product['AssyItemSpec'] = selectedName?.AssyItemSpec || ''
            product['ProdUnitName'] = selectedName?.ProdUnitName || ''
            product['OrderQty'] = selectedName?.OrderQty || ''
            product['StdUnitProdQty'] = selectedName?.StdUnitProdQty || ''
            product['StdUnitOKQty'] = selectedName?.StdUnitOKQty || ''
            product['StdUnitBadQty'] = selectedName?.StdUnitBadQty || ''
            product['WorkType'] = selectedName?.WorkType || ''
            product['ToSeq'] = selectedName?.ToSeq || ''
            product['IsProcQC'] = selectedName?.IsProcQC || ''
            product['IsLastProc'] = selectedName?.IsLastProc || ''
            product['FromQty'] = selectedName?.FromQty || ''
            product['ProdPlanNo'] = selectedName?.ProdPlanNo || ''
            product['IsMatInPut'] = selectedName?.IsMatInPut || ''


            product['WorkOrderSeq'] = selectedName?.WorkOrderSeq || ''
            product['WorkCenterSeq'] = selectedName?.WorkCenterSeq || ''
            product['GoodItemSeq'] = selectedName?.GoodItemSeq || ''
            product['AssyItemSeq'] = selectedName?.AssyItemSeq || ''
            product['ProcSeq'] = selectedName?.ProcSeq || ''
            product['ProdUnitSeq'] = selectedName?.ProdUnitSeq || ''
            product['WorkOrderSerl'] = selectedName?.WorkOrderSerl || ''
            product['WorkDate'] = selectedName?.WorkDate || ''
            product['ProcRev'] = selectedName?.ProcRev || ''
          } else {
            product[cols[col].id] = ''
            product['WorkCenterName'] = ''
            product['GoodItemName'] = ''
            product['GoodItemNo'] = ''
            product['GoodItemSpec'] = ''
            product['ProcRevName'] = ''
            product['ItemBomRevName'] = ''
            product['ProcName'] = ''
            product['AssyItemName'] = ''
            product['AssyItemNo'] = ''
            product['AssyItemSpec'] = ''
            product['ProdUnitName'] = ''
            product['OrderQty'] = ''
            product['StdUnitProdQty'] = ''
            product['StdUnitOKQty'] = ''
            product['StdUnitBadQty'] = ''
            product['WorkType'] = ''
            product['ToSeq'] = ''
            product['IsProcQC'] = ''
            product['IsLastProc'] = ''
            product['FromQty'] = ''
            product['ProdPlanNo'] = ''
            product['IsMatInPut'] = ''
            product['WorkOrderSeq'] = ''
            product['WorkCenterSeq'] = ''
            product['GoodItemSeq'] = ''
            product['AssyItemSeq'] = ''
            product['ProcSeq'] = ''
            product['ProdUnitSeq'] = ''
            product['WorkOrderSerl'] = ''
            product['WorkDate'] = ''
            product['ProcRev'] = ''
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

          } else {
            product[cols[col].id] = ''

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

      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''
        updatedData[row][key] = newValue.data
        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'
        updatedData[row]['IdxNo'] = row + 1

        if (row !== lastRowIndex) {
          return updatedData
        }

        return prevData
      })
    },
    [canEdit, cols, gridData],
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
      saveToLocalStorageSheet('pdsfc_work_report_ah', newHidden)
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
    localStorage.removeItem('pdsfc_work_report_ah')
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
        saveToLocalStorageSheet('pdsfc_work_report_ah', newHidden)
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
        saveToLocalStorageSheet('pdsfc_work_report_ah', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full  h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col bg-white  overflow-x-hidden overflow-hidden ">
        <h2 className="text-[10px]  border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          SHEET DATA  {t('60391')}
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
          rowSelect="single"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          width="100%"
          height="100%"
          headerHeight={30}
          rowHeight={27}
          freezeTrailingRows={1}
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
          customRenderers={[CellsWorkOrderNo, CellsEmpNameV2]}
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

export default TablepdsfcWorkReport
