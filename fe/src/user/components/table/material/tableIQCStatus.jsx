import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'

const SearchButton = ({ onClick }) => (
  <Button onClick={onClick}>Show Search</Button>
)

function TableIQCStatus({
  data,
  onCellClicked,
  gridData,
  setGridData,
  loading,
}) {
  const [showSearch, setShowSearch] = useState(false)
  const ref = (useRef < data) | (null > null)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [vals, setVals] = useState([false, false, false])
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const columns = useMemo(
    () => [
      { title: 'IsPass' },
      { title: 'IsNG' },
      { title: 'BLSeq' },
      { title: 'BLSerl' },
      { title: 'TestEndDate' },
      { title: 'QCNo' },
      { title: 'BLDate' },
      { title: 'BLNo' },
      { title: 'ItemName' },
      { title: 'ItemNo' },
      { title: 'Spec' },
      { title: 'ItemSeq' },
      { title: 'Qty' },
      { title: 'OKQty' },
      { title: 'RealSampleQty' },
      { title: 'SMTestResultName' },
      { title: 'Remark' },
      { title: 'Memo1' },
      { title: 'Memo2' },
      { title: 'WHName' },
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
      const person = gridData[row] || {}
      const {
        IsPass = '',
        IsNG = '',
        BLSeq = '',
        BLSerl = '',
        TestEndDate = '',
        QCNo = '',
        BLDate = '',
        BLNo = '',
        ItemName = '',
        ItemNo = '',
        Spec = '',
        ItemSeq = '',
        Qty = '',
        OKQty = '',
        RealSampleQty = '',
        SMTestResultName = '',
        Remark = '',
        Memo1 = '',
        Memo2 = '',
        WHName = '',
      } = person

      const safeString = (value) => (value != null ? String(value) : '')
      const safeBoolean = (value) => (value === '0' ? '✔' : '✘')

      const columnMap = {
        0: { kind: GridCellKind.Boolean, data: IsPass },
        1: { kind: GridCellKind.Boolean, data: IsNG },
        2: { kind: GridCellKind.Text, data: safeString(BLSeq) },
        3: { kind: GridCellKind.Text, data: safeString(BLSerl) },
        4: { kind: GridCellKind.Text, data: safeString(TestEndDate) },
        5: { kind: GridCellKind.Text, data: safeString(QCNo) },
        6: { kind: GridCellKind.Text, data: safeString(BLDate) },
        7: { kind: GridCellKind.Text, data: safeString(BLNo) },
        8: { kind: GridCellKind.Text, data: safeString(ItemName) },
        9: { kind: GridCellKind.Text, data: safeString(ItemNo) },
        10: { kind: GridCellKind.Text, data: safeString(Spec) },
        11: { kind: GridCellKind.Text, data: safeString(ItemSeq) },
        12: { kind: GridCellKind.Text, data: safeString(Qty) },
        13: { kind: GridCellKind.Text, data: safeString(OKQty) },
        14: { kind: GridCellKind.Text, data: safeString(RealSampleQty) },
        15: { kind: GridCellKind.Text, data: safeString(SMTestResultName) },
        16: { kind: GridCellKind.Text, data: safeString(Remark) },
        17: { kind: GridCellKind.Text, data: safeString(Memo1) },
        18: { kind: GridCellKind.Text, data: safeString(Memo2) },
        19: { kind: GridCellKind.Text, data: safeString(WHName) },
      }

      if (columnMap.hasOwnProperty(col)) {
        const { kind, data } = columnMap[col]
        return { kind, data, displayData: data }
      }

      return { kind: '', data: '', displayData: '' }
    },
    [gridData],
  )

  const [lastActivated, setLastActivated] = useState(undefined)

  const onCellActivated = useCallback((cell) => {
    console.log('cell', cell)
    setLastActivated(cell)
  }, [])

  useEffect(() => {
    setGridData(data)
  }, [data])

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center pb-8  overflow-hidden">
      <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
        <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          SHEET DATA
        </h2>
        <DataEditor
          columns={cols}
          getCellContent={getData}
          rows={gridData.length}
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
          rowSelect="single"
          onCellClicked={onCellClicked}
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getRowThemeOverride={(i) =>
            i % 2 === 0
              ? undefined
              : {
                  bgCell: '#FBFBFB',
                }
          }
        />
      </div>
    </div>
  )
}

export default TableIQCStatus
