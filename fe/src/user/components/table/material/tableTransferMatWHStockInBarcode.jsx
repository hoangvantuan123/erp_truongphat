import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { CompactSelection } from '@glideapps/glide-data-grid'

const SearchButton = ({ onClick }) => (
  <Button onClick={onClick}>Show Search</Button>
)

function TableTransferMatWHStockInBarcode({ data }) {
  const [showSearch, setShowSearch] = useState(false)
  const ref = (useRef < data) | (null > null)
  const onSearchClose = useCallback(() => setShowSearch(false), [])

  const columns = useMemo(
    () => [
      { title: 'InOutDate' },
      { title: 'WaitWhName' },
      { title: 'WaitWhSeq' },
      { title: 'MatWhName' },
      { title: 'MatWhSeq' },
      { title: 'BizUnitName' },
      { title: 'BizUnit' },
      { title: 'ItemSeq' },
      { title: 'ItemNo' },
      { title: 'ItemName' },
      { title: 'Spec' },
      { title: 'UnitSeq' },
      { title: 'UnitName' },
      { title: 'Qty' },
      { title: 'LotNo' },
      { title: 'RegDate' },
      { title: 'EmpSeq' },
      { title: 'EmpName' },
      { title: 'DeptSeq' },
      { title: 'DeptName' },
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
      const person = data[row] || {}
      const {
        InOutDate = '',
        WaitWhName = '',
        WaitWhSeq = '',
        MatWhName = '',
        MatWhSeq = '',
        BizUnitName = '',
        BizUnit = '',
        ItemSeq = '',
        ItemNo = '',
        ItemName = '',
        Spec = '',
        UnitSeq = '',
        UnitName = '',
        Qty = '',
        LotNo = '',
        RegDate = '',
        EmpSeq = '',
        EmpName = '',
        DeptSeq = '',
        DeptName = '',
      } = person

      const safeString = (value) => (value != null ? String(value) : '')

      const columnMap = {
        0: { kind: GridCellKind.Text, data: safeString(InOutDate) },
        1: { kind: GridCellKind.Text, data: safeString(WaitWhName) },
        2: { kind: GridCellKind.Text, data: safeString(WaitWhSeq) },
        3: { kind: GridCellKind.Text, data: safeString(MatWhName) },
        4: { kind: GridCellKind.Text, data: safeString(MatWhSeq) },
        5: { kind: GridCellKind.Text, data: safeString(BizUnitName) },
        6: { kind: GridCellKind.Text, data: safeString(BizUnit) },
        7: { kind: GridCellKind.Text, data: safeString(ItemSeq) },
        8: { kind: GridCellKind.Text, data: safeString(ItemNo) },
        9: { kind: GridCellKind.Text, data: safeString(ItemName) },
        10: { kind: GridCellKind.Text, data: safeString(Spec) },
        11: { kind: GridCellKind.Text, data: safeString(UnitSeq) },
        12: { kind: GridCellKind.Text, data: safeString(UnitName) },
        13: { kind: GridCellKind.Text, data: safeString(Qty) },
        14: { kind: GridCellKind.Text, data: safeString(LotNo) },
        15: { kind: GridCellKind.Text, data: safeString(RegDate) },
        16: { kind: GridCellKind.Text, data: safeString(EmpSeq) },
        17: { kind: GridCellKind.Text, data: safeString(EmpName) },
        18: { kind: GridCellKind.Text, data: safeString(DeptSeq) },
        19: { kind: GridCellKind.Text, data: safeString(DeptName) },
      }

      if (columnMap.hasOwnProperty(col)) {
        const { kind, data } = columnMap[col]
        return { kind, data, displayData: data }
      }

      return { kind: GridCellKind.Text, data: '', displayData: '' }
    },
    [data],
  )

  const [lastActivated, setLastActivated] = useState(undefined)

  const onCellActivated = useCallback((cell) => {
    console.log('cell', cell)
    setLastActivated(cell)
  }, [])

  const onGridSelectionChange = (newSelection) => {
    console.log('Selection aborted', newSelection)
  }

  return (
    <div className="w-full h-full border-t border-b overflow-hidden scroll-container ">
      <DataEditor
        columns={cols}
        getCellContent={getData}
        rows={data.length}
        showSearch={showSearch}
        getCellsForSelection={true}
        onSearchClose={onSearchClose}
        width="100%"
        height="100%"
        rowMarkers={('checkbox-visible', 'both')}
        useRef={useRef}
        onColumnResize={onColumnResize}
        smoothScrollY={true}
        smoothScrollX={true}
        rowSelect="multi"
      />
    </div>
  )
}

export default TableTransferMatWHStockInBarcode
