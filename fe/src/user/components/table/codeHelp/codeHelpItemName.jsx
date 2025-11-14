import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'

const SearchButton = ({ onClick }) => (
  <Button onClick={onClick}>Show Search</Button>
)

function TableCodeHelpItemName({
  data,
  onCellClicked,
  setSelection,
  selection,
}) {
  const [gridData, setGridData] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const ref = (useRef < data) | (null > null)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      { title: t('1055') },
      { title: t('1786') },
      { title: t('2091') },
      { title: t('551') },
      { title: t('1954') },
      { title: t('3122') },
      { title: t('3262') },
      { title: t('15151') },
      { title: t('602') },
      { title: t('3116') },
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
        ItemSeq = '',
        ItemName = '',
        ItemNo = '',
        Spec = '',
        AssetName = '',
        ItemClassLName = '',
        ItemClassMName = '',
        ItemClassName = '',
        UnitName = '',
        UnitSeq = '',
      } = person

      const safeString = (value) => (value != null ? String(value) : '')

      const columnMap = {
        0: { kind: GridCellKind.Text, data: safeString(ItemSeq) },
        1: { kind: GridCellKind.Text, data: safeString(ItemName) },
        2: { kind: GridCellKind.Text, data: safeString(ItemNo) },
        3: { kind: GridCellKind.Text, data: safeString(Spec) },
        4: { kind: GridCellKind.Text, data: safeString(AssetName) },
        5: { kind: GridCellKind.Text, data: safeString(ItemClassLName) },
        6: { kind: GridCellKind.Text, data: safeString(ItemClassMName) },
        7: { kind: GridCellKind.Text, data: safeString(ItemClassName) },
        8: { kind: GridCellKind.Text, data: safeString(UnitName) },
        9: { kind: GridCellKind.Text, data: safeString(UnitSeq) },
      }

      if (columnMap.hasOwnProperty(col)) {
        const { kind, data } = columnMap[col]
        return { kind, data, displayData: data }
      }

      return { kind: GridCellKind.Text, data: '', displayData: '' }
    },
    [gridData],
  )

  const [lastActivated, setLastActivated] = useState(undefined)

  const onCellActivated = useCallback((cell) => {
    setLastActivated(cell)
  }, [])

  useEffect(() => {
    setGridData(data)
  }, [data])

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center pb-8">
      <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
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
          onCellClicked={onCellClicked}
          rowSelect="single"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
        />
      </div>
    </div>
  )
}

export default TableCodeHelpItemName
