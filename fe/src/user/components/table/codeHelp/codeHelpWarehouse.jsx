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

function TableCodeHelpWarehouse({
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
      { title: t('783') },
      { title: t('21742') },
      { title: t('2') },
      { title: t('3') },
      { title: t('777') },
      { title: t('3151') },
      { title: t('3164') },
      { title: t('3237') },
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
        WHName = '',
        WHSeq = '',
        BizUnitName = '',
        FactUnitName = '',
        WHKindName = '',
        BizUnit = '',
        FactUnit = '',
        SMWHKind = '',
      } = person

      const safeString = (value) => (value != null ? String(value) : '')

      const columnMap = {
        0: { kind: GridCellKind.Text, data: safeString(WHName) },
        1: { kind: GridCellKind.Text, data: safeString(WHSeq) },
        2: { kind: GridCellKind.Text, data: safeString(BizUnitName) },
        3: { kind: GridCellKind.Text, data: safeString(FactUnitName) },
        4: { kind: GridCellKind.Text, data: safeString(WHKindName) },
        5: { kind: GridCellKind.Text, data: safeString(BizUnit) },
        6: { kind: GridCellKind.Text, data: safeString(FactUnit) },
        7: { kind: GridCellKind.Text, data: safeString(SMWHKind) },
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

export default TableCodeHelpWarehouse
