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

import { Cells10012 } from '../../sheet/cells/cells10012'
import { Cells10007 } from '../../sheet/cells/cells10007'
import { Cells2001 } from '../../sheet/cells/cells2001'
import { Cells10010 } from '../../sheet/cells/cells10010'
import { Cells10014 } from '../../sheet/cells/cells10014'
import { Cells2003 } from '../../sheet/cells/cells2003'
import { Cells8028 } from '../../sheet/cells/cells8028'
import { Cells6004 } from '../../sheet/cells/cells6004'
import { Cells6005 } from '../../sheet/cells/cells6005'
import { Cells6006 } from '../../sheet/cells/cells6006'
import { Cells6007 } from '../../sheet/cells/cells6007'
import { Cells8047 } from '../../sheet/cells/cells8047'
import { Cells8048 } from '../../sheet/cells/cells8048'
import { Cells8007 } from '../../sheet/cells/cells8007'
import { Cells8004 } from '../../sheet/cells/cells8004'
import { Cells2002 } from '../../sheet/cells/cells2002'
import { Cells10009 } from '../../sheet/cells/cells10009'
import { Cells17001 } from '../../sheet/cells/cells17001'

function TableDaMaterialList({
  dataUnit,
  setSelection,
  selection,
  setShowSearch,
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
  set10012,
  set10007,
  set2001,
  set10010,
  set10014,
  set6005,
  set6006,
  set6007,
  set8047,
  set8048,
  set2002,
  set8007,
  set8004,
  set2003,
  set8028,
  set6004,
  set10009,
  set17001,
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [isCell, setIsCell] = useState(null)

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('H_ERP_COLS_PAGE_DA_MATER_LIST', [])
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
    'AssetName',
    'UnitName',
    'SMStatusName',
    'DeptName',
    'ItemClassSName',
    'VatKindName',
    'VatTypeName',
    'MrpKind',
    'OutKind',
    'ProdMethod',
    'ProdSpec',
    'PurKind',
    'PurProdType',
    'SMInOutKindName',
    'SMLimitTermKindName',
    'SMABCName',
    'EmpName',
    'PurCustName',
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
        AssetName: {
          kind: 'cell-10012',
          allowedValues: set10012,
        },
        UnitName: {
          kind: 'cell-10007',
          allowedValues: set10007,
        },
        SMStatusName: {
          kind: 'cell-2001',
          allowedValues: set2001,
        },
        DeptName: {
          kind: 'cell-10010',
          allowedValues: set10010,
        },
        ItemClassSName: {
          kind: 'cell-10014',
          allowedValues: set10014,
        },
        VatKindName: {
          kind: 'cell-2003',
          allowedValues: set2003,
        },
        VatTypeName: {
          kind: 'cell-8028',
          allowedValues: set8028,
        },
        MrpKind: {
          kind: 'cell-6004',
          allowedValues: set6004,
        },
        OutKind: {
          kind: 'cell-6005',
          allowedValues: set6005,
        },
        ProdMethod: {
          kind: 'cell-6006',
          allowedValues: set6006,
        },
        ProdSpec: {
          kind: 'cell-6007',
          allowedValues: set6007,
        },
        PurKind: {
          kind: 'cell-8047',
          allowedValues: set8047,
        },
        PurProdType: {
          kind: 'cell-8048',
          allowedValues: set8048,
        },
        SMInOutKindName: {
          kind: 'cell-8007',
          allowedValues: set8007,
        },
        SMLimitTermKindName: {
          kind: 'cell-8004',
          allowedValues: set8004,
        },
        SMABCName: {
          kind: 'cell-2002',
          allowedValues: set2002,
        },
        EmpName: {
          kind: 'cell-10009',
          allowedValues: set10009,
        },
        PurCustName: {
          kind: 'cell-17001',
          allowedValues: set17001,
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

      if (
        columnKey === 'IsOption' ||
        columnKey === 'IsSet' ||
        columnKey === 'IsVat' ||
        columnKey === 'IsRollUnit' ||
        columnKey === 'IsSerialMng' ||
        columnKey === 'IsQtyChange' ||
        columnKey === 'IsLotMng' ||
        columnKey === 'IsInQC' ||
        columnKey === 'IsOutQC' ||
        columnKey === 'IsLastQC' ||
        columnKey === 'IsPurVat'
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
      if (
        columnKey === 'MinQty' ||
        columnKey === 'OrderQty' ||
        columnKey === 'STDLoadConvQty'
      ) {
        const formattedValue = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }).format(value)

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: formattedValue === '0.0000' ? '' : String(value),
          displayData: formattedValue === '0.0000' ? '' : formattedValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }
      if (
        columnKey === 'Guaranty' ||
        columnKey === 'OutLoss' ||
        columnKey === 'InLoss' ||
        columnKey === 'LimitTerm' ||
        columnKey === 'DelvDay'
      ) {
        const formattedValue = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: formattedValue === '0' ? '' : String(value),
          displayData: formattedValue === '0' ? '' : formattedValue,
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
    [
      gridData,
      cols,
      set10012,
      set10007,
      set2001,
      set10010,
      set10014,
      set6004,
      set8028,
      set2003,
      set6005,
      set6006,
      set6007,
      set8047,
      set8048,
      set8004,
      set8007,
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

      if (key === 'AssetName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set10012.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['AssetSeq'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['AssetSeq'] = ''
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
      if (key === 'UnitName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set10007.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['UnitSeq'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
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
      if (key === 'SMStatusName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set2001.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMStatus'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMStatus'] = ''
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
      if (key === 'ItemClassSName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set10014.find(
                (item) => item.ItemClassName === checkCopyData,
              )
            }

            if (selectedName) {
              product[cols[col].id] = selectedName.ItemClassName
              product['ItemClassMName'] = selectedName.ItemClassMName
              product['ItemClassLName'] = selectedName.ItemClassLName
              product['UMItemClassS'] = selectedName.UMItemClass
            } else {
              product[cols[col].id] = ''
              product['ItemClassMName'] = ''
              product['ItemClassLName'] = ''
              product['UMItemClassS'] = ''
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
      if (key === 'VatKindName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set2003.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMVatKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMVatKind'] = ''
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
      if (key === 'VatTypeName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set8028.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMVatType'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMVatType'] = ''
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
      if (key === 'DeptName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set10010.find(
                (item) => item.BeDeptName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.BeDeptName
              product['DeptSeq'] = selectedName.BeDeptSeq
            } else {
              product[cols[col].id] = ''
              product['DeptSeq'] = ''
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
      if (key === 'EmpName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName

            if (newValue.data instanceof Promise) {
              newValue.data
                .then((resolvedData) => {
                  selectedName = resolvedData[0]

                  const checkCopyData = newValue.copyData
                  if (!selectedName) {
                    selectedName = set10009.find(
                      (item) => item.BeDeptName === checkCopyData,
                    )
                  }

                  if (selectedName) {
                    product[cols[col].id] = selectedName.EmpName
                    product['EmpSeq'] = selectedName.EmpSeq
                    product['DeptSeq'] = selectedName.DeptSeq
                    product['DeptName'] = selectedName.DeptName
                    product['EmpID'] = selectedName.EmpID
                  } else {
                    product[cols[col].id] = ''
                    product['EmpSeq'] = ''
                    product['DeptSeq'] = ''
                    product['DeptName'] = ''
                    product['EmpID'] = ''
                  }

                  product.isEdited = true
                  product['IdxNo'] = row + 1
                  const currentStatus = product['Status'] || 'U'
                  product['Status'] = currentStatus === 'A' ? 'A' : 'U'

                  setEditedRows((prevEditedRows) =>
                    updateEditedRows(
                      prevEditedRows,
                      row,
                      newData,
                      currentStatus,
                    ),
                  )

                  setGridData(newData)
                })
                .catch((error) => {
                  console.error('Error resolving Promise:', error)
                })
            } else {
              selectedName = newValue.data[0]

              const checkCopyData = newValue.copyData
              if (!selectedName) {
                selectedName = set10010.find(
                  (item) => item.BeDeptName === checkCopyData,
                )
              }

              if (selectedName) {
                product[cols[col].id] = selectedName.EmpName
                product['EmpSeq'] = selectedName.EmpSeq
                product['DeptSeq'] = selectedName.DeptSeq
                product['DeptName'] = selectedName.DeptName
                product['EmpID'] = selectedName.EmpID
              } else {
                product[cols[col].id] = ''
                product['EmpSeq'] = ''
                product['DeptSeq'] = ''
                product['DeptName'] = ''
                product['EmpID'] = ''
              }

              product.isEdited = true
              product['IdxNo'] = row + 1
              const currentStatus = product['Status'] || 'U'
              product['Status'] = currentStatus === 'A' ? 'A' : 'U'

              setEditedRows((prevEditedRows) =>
                updateEditedRows(prevEditedRows, row, newData, currentStatus),
              )

              // Cập nhật lại state sau khi xử lý xong
              setGridData(newData)
            }

            return newData
          })
          return
        }
      }

      if (key === 'OutLoss') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set8028.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
            } else {
              product[cols[col].id] = ''
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
      if (key === 'MrpKind') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set6004.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMMrpKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMMrpKind'] = ''
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
      if (key === 'OutKind') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set8007.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMOutKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMOutKind'] = ''
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
      if (key === 'ProdMethod') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set6006.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMProdMethod'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMProdMethod'] = ''
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
      if (key === 'ProdSpec') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set6007.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMProdSpec'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMProdSpec'] = ''
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

      if (key === 'PurKind') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set8047.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMPurKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMPurKind'] = ''
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
      if (key === 'PurProdType') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set8048.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMPurProdType'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMPurProdType'] = ''
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
      if (key === 'SMInOutKindName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set8007.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMInOutKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMInOutKind'] = ''
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
      if (key === 'SMLimitTermKindName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set8004.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMLimitTermKind'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMLimitTermKind'] = ''
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
      if (key === 'SMABCName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set2002.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.MinorName
              product['SMABC'] = selectedName.Value
            } else {
              product[cols[col].id] = ''
              product['SMABC'] = ''
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
      if (key === 'PurCustName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = set17001.find(
                (item) => item.CustName === checkCopyData,
              )
            }
            if (selectedName) {
              product[cols[col].id] = selectedName.CustName
              product['PurCustSeq'] = selectedName.CustSeq
            } else {
              product[cols[col].id] = ''
              product['PurCustSeq'] = ''
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
        key === 'AssetSeq' ||
        key === 'UnitSeq' ||
        key === 'SMStatus' ||
        key === 'ItemClassLName' ||
        key === 'ItemClassMName' ||
        key === 'SMVatKind' ||
        key === 'SMVatType' ||
        key === 'SMMrpKind' ||
        key === 'SMOutKind' ||
        key === 'SMProdMethod' ||
        key === 'SMPurKind' ||
        key === 'SMPurProdType' ||
        key === 'SMInOutKind' ||
        key === 'SMLimitTermKind' ||
        key === 'SMABC' ||
        key === 'DeptSeq' ||
        key === 'EmpSeq' ||
        key === 'EmpID' ||
        key === 'PurCustSeq'
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
      set10012,
      set2001,
      set10007,
      set10014,
      set2003,
      set8028,
      set6004,
      set8007,
      set6006,
      set6007,
      set8047,
      set8048,
      set8007,
      set8004,
      set2002,
      set10010,
      set10009,
      set17001,
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
      saveToLocalStorageSheet('H_ERP_COLS_PAGE_DA_MATER_LIST', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_DA_MATER_LIST', uniqueCols)
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_DA_MATER_LIST', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_PAGE_DA_MATER_LIST')
    localStorage.removeItem('H_ERP_COLS_PAGE_DA_MATER_LIST')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_DA_MATER_LIST', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_DA_MATER_LIST',
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
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_DA_MATER_LIST', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_DA_MATER_LIST', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_DA_MATER_LIST', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_DA_MATER_LIST', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
      <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
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
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          customRenderers={[
            Cells10012,
            Cells10007,
            Cells2001,
            Cells10010,
            Cells10014,
            Cells2003,
            Cells8028,
            Cells6004,
            Cells6005,
            Cells6006,
            Cells6007,
            Cells8047,
            Cells8048,
            Cells8007,
            Cells8004,
            Cells2002,
            Cells10009,
            Cells17001,
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

export default TableDaMaterialList
