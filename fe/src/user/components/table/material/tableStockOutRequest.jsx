import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
const SearchButton = ({ onClick }) => (
  <Button onClick={onClick}>Show Search</Button>
)

function TableStockOutRequest({
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
  const { t } = useTranslation()
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const columns = useMemo(
    () => [
      { title: t('1326') },
      { title: t('607') },
      { title: t('60498') },
      { title: t('200') },
      { title: t('647') },
      { title: t('366') },
      { title: t('1794') },
      { title: t('600') },
      { title: t('1985') },
      { title: t('2102') },
      { title: t('2101') },
      { title: t('510') },
      { title: t('3244') },
      { title: t('2846') },
      { title: t('2170') },
      { title: t('2169') },
      { title: t('1969') },
      { title: t('602') },
      { title: t('4382') },
      { title: t('9542') },
      { title: t('13570') },
      { title: t('362') },
      { title: t('369') },
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
        IsStop = '',
        IsConfirm = '',
        FactUnitName = '',
        ReqDate = '',
        OutReqNo = '',
        DeptName = '',
        EmpName = '',
        UseTypeName = '',
        WorkOrderNo = '',
        AssyItemName = '',
        AssyItemNo = '',
        AssyItemSpec = '',
        AssyUnitName = '',
        ProcName = '',
        ItemName = '',
        ItemNo = '',
        ItemSpec = '',
        UnitName = '',
        Qty = '',
        ProgQty = '',
        IsReturn = '',
        Remark = '',
        ProgStatusName = '',
      } = person

      const safeString = (value) => (value != null ? String(value) : '')
      const safeBoolean = (value) => (value === '0' ? '✔' : '✘')

      const columnMap = {
        0: { kind: GridCellKind.Boolean, data: IsStop },
        1: { kind: GridCellKind.Boolean, data: IsConfirm },
        2: { kind: GridCellKind.Text, data: safeString(FactUnitName) },
        3: { kind: GridCellKind.Text, data: safeString(ReqDate) },
        4: { kind: GridCellKind.Text, data: safeString(OutReqNo) },
        5: { kind: GridCellKind.Text, data: safeString(DeptName) },
        6: { kind: GridCellKind.Text, data: safeString(EmpName) },
        7: { kind: GridCellKind.Text, data: safeString(UseTypeName) },
        8: { kind: GridCellKind.Text, data: safeString(WorkOrderNo) },
        9: { kind: GridCellKind.Text, data: safeString(AssyItemName) },
        10: { kind: GridCellKind.Text, data: safeString(AssyItemNo) },
        11: { kind: GridCellKind.Text, data: safeString(AssyItemSpec) },
        12: { kind: GridCellKind.Text, data: safeString(AssyUnitName) },
        13: { kind: GridCellKind.Text, data: safeString(ProcName) },
        14: { kind: GridCellKind.Text, data: safeString(ItemName) },
        15: { kind: GridCellKind.Text, data: safeString(ItemNo) },
        16: { kind: GridCellKind.Text, data: safeString(ItemSpec) },
        17: { kind: GridCellKind.Text, data: safeString(UnitName) },
        18: { kind: GridCellKind.Text, data: safeString(Qty) },
        19: { kind: GridCellKind.Text, data: safeString(ProgQty) },
        20: { kind: GridCellKind.Boolean, data: IsReturn },
        21: { kind: GridCellKind.Text, data: safeString(Remark) },
        22: { kind: GridCellKind.Text, data: safeString(ProgStatusName) },
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

export default TableStockOutRequest
