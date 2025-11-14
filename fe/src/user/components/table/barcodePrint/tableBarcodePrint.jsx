import '../../../../static/css/customTabe.css'
import {
  CompactSelection,
  DataEditor,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
function TableBarcodePrint({
  data,
  setGridData,
  gridData,
  setSelectRow,
  onCellClicked,
}) {
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const columns = useMemo(
    () => [
      { title: 'PLANT' },
      { title: 'TRAN_CODE' },
      { title: 'TRAN_SEQ' },
      { title: 'TRAN_TYPE' },
      { title: 'VENDOR' },
      { title: 'ITEMCD' },
      { title: 'LOTNO' },
      { title: 'QTY' },
      { title: 'DATECODE' },
      { title: 'REELNO' },
      { title: 'DATETIME' },
      { title: 'LOT_ID' },
      { title: 'USER_ID' },
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
        PLANT = '',
        TRAN_CODE = '',
        TRAN_SEQ = '',
        TRAN_TYPE = '',
        VENDOR = '',
        ITEMCD = '',
        LOTNO = '',
        QTY = '',
        DATECODE = '',
        REELNO = '',
        DATETIME = '',
        LOT_ID = '',
        USER_ID = '',
      } = dataGrid

      const safeString = (value) => (value != null ? String(value) : '')

      const columnMap = {
        0: { kind: GridCellKind.Text, data: safeString(PLANT) },
        1: { kind: GridCellKind.Text, data: safeString(TRAN_CODE) },
        2: { kind: GridCellKind.Text, data: safeString(TRAN_SEQ) },
        3: { kind: GridCellKind.Text, data: safeString(TRAN_TYPE) },
        4: { kind: GridCellKind.Text, data: safeString(VENDOR) },
        5: { kind: GridCellKind.Text, data: safeString(ITEMCD) },
        6: { kind: GridCellKind.Text, data: safeString(LOTNO) },
        7: { kind: GridCellKind.Text, data: safeString(QTY) },
        8: { kind: GridCellKind.Text, data: safeString(DATECODE) },
        9: { kind: GridCellKind.Text, data: safeString(REELNO) },
        10: { kind: GridCellKind.Text, data: safeString(DATETIME) },
        11: { kind: GridCellKind.Text, data: safeString(LOT_ID) },
        12: { kind: GridCellKind.Text, data: safeString(USER_ID) },
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
    setSelectRow(selection)
  }, [data, setSelectRow, selection])

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

export default TableBarcodePrint
