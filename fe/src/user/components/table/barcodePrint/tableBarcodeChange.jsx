import '../../../../static/css/customTabe.css'
import {
  CompactSelection,
  DataEditor,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'

function TabelBarcodeChange({
  data,
  setGridData,
  gridData,
  setSelectRow,
  setClickedRowData,
}) {
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)

  const columns = useMemo(
    () => [
      { title: 'PLANT' },
      { title: 'TRAN_CODE' },
      { title: 'TRAN_SEQ' },
      { title: 'ITEM CODE' },
      { title: 'LOT NO' },
      { title: 'QTY' },
      { title: 'DATE CODE' },
      { title: 'REEL NO' },
      { title: 'BARCODE' },
      { title: 'NEW BARCODE' },
      { title: 'DATE TIME' },
      { title: 'STATUS' },
      { title: 'USER_ID' },
      { title: 'REMARK' },
    ],
    [],
  )
  const [cols, setCols] = useState(columns)
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

  const getData = useCallback(
    ([col, row]) => {
      const dataGrid = gridData[row] || {}
      const {
        Plant = '',
        Tran_code = '',
        BarcodeSeq = '',
        ItemNo = '',
        LotNo = '',
        NewQty = '',
        DateCode = '',
        ReelNo = '',
        BarcodeID = '',
        NewBarcodeID = '',
        LastDateTime = '',
        NewStatus = '',
        UserID = '',
        Remark = '',
      } = dataGrid

      const safeString = (value) => (value != null ? String(value) : '')

      const columnMap = {
        0: { kind: GridCellKind.Text, data: safeString(Plant) },
        1: { kind: GridCellKind.Text, data: safeString(Tran_code) },
        2: { kind: GridCellKind.Text, data: safeString(BarcodeSeq) },
        3: { kind: GridCellKind.Text, data: safeString(ItemNo) },
        4: { kind: GridCellKind.Text, data: safeString(LotNo) },
        5: { kind: GridCellKind.Text, data: safeString(NewQty) },
        6: { kind: GridCellKind.Text, data: safeString(DateCode) },
        7: { kind: GridCellKind.Text, data: safeString(ReelNo) },
        8: { kind: GridCellKind.Text, data: safeString(BarcodeID) },
        9: { kind: GridCellKind.Text, data: safeString(NewBarcodeID) },
        10: { kind: GridCellKind.Text, data: safeString(LastDateTime) },
        11: { kind: GridCellKind.Text, data: safeString(NewStatus) },
        12: { kind: GridCellKind.Text, data: safeString(UserID) },
        13: { kind: GridCellKind.Text, data: safeString(Remark) },
      }

      if (columnMap.hasOwnProperty(col)) {
        const { kind, data } = columnMap[col]
        return { kind, data, displayData: data }
      }

      return { kind: GridCellKind.Text, data: '', displayData: '' }
    },
    [gridData],
  )

  useEffect(() => {
    setGridData(data)
  }, [data])

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  setSelectRow(selection)

  const onCellClicked = (cell) => {
    const [colIndex, rowIndex] = cell

    if (colIndex !== -1 && rowIndex === undefined) {
      return
    }

    if (colIndex === -1) {
      setIsMinusClicked(true)
    } else {
      setIsMinusClicked(false)
    }

    if (
      lastClickedCell &&
      lastClickedCell[0] === colIndex &&
      lastClickedCell[1] === rowIndex
    ) {
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    setLastClickedCell(cell)

    if (rowIndex >= 0 && rowIndex < gridData.length) {
      const rowData = gridData[rowIndex]
      setClickedRowData(rowData)
    }
  }

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
      <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
        <DataEditor
          columns={cols}
          getCellContent={getData}
          rows={gridData.length}
          getCellsForSelection={true}
          width="100%"
          height="100%"
          rowMarkers={('checkbox-visible', 'both')}
          onColumnResize={onColumnResize}
          smoothScrollY={true}
          smoothScrollX={true}
          onCellClicked={onCellClicked}
          rowSelect="multi"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
        />
      </div>
    </div>
  )
}

export default TabelBarcodeChange
