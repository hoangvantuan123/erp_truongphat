import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { CompactSelection } from '@glideapps/glide-data-grid'

const SearchButton = ({ onClick }) => (
  <Button onClick={onClick}>Show Search</Button>
)

function TableStockOUtFiFoA({ data, setInputItemNo, inputItemNo }) {
  const [gridData, setGridData] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const ref = (useRef < data) | (null > null)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [clickedRowDataList, setClickedRowDataList] = useState([])
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [highlightRegions, setHighlightRegions] = useState([])
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [hoverRow, setHoverRow] = useState(undefined)

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])
  const columns = useMemo(
    () => [
      { title: 'ItemNo' },
      { title: 'RemainQty' },
      { title: 'OutQty' },
      { title: 'Qty1' },
      { title: 'ItemName' },
      { title: 'Spec' },
      { title: 'UnitName' },
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
        ItemNo = '',
        RemainQty = '',
        OutQty = '',
        Qty1 = '',
        ItemName = '',
        Spec = '',
        UnitName = '',
      } = person

      const safeString = (value) => (value != null ? String(value) : '')

      const columnMap = {
        0: { kind: GridCellKind.Text, data: safeString(ItemNo) },
        1: { kind: GridCellKind.Text, data: safeString(RemainQty) },
        2: { kind: GridCellKind.Text, data: safeString(OutQty) },
        3: { kind: GridCellKind.Text, data: safeString(Qty1) },
        4: { kind: GridCellKind.Text, data: safeString(ItemName) },
        5: { kind: GridCellKind.Text, data: safeString(Spec) },
        6: { kind: GridCellKind.Text, data: safeString(UnitName) },
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
    console.log('cell', cell)
    setLastActivated(cell)
  }, [])

  useEffect(() => {
    setGridData(data)
  }, [data])

  const onCellClicked = (cell, event) => {
    let rowIndex

    if (cell[0] !== -1) {
      console.log('Ignoring click on cell, cell[0] is neither -1 nor 1')
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClicked(true)
    } else {
      rowIndex = cell[0]
      setIsMinusClicked(false)
    }

    if (
      lastClickedCell &&
      lastClickedCell[0] === cell[0] &&
      lastClickedCell[1] === cell[1]
    ) {
      console.log('Click again on the same cell, deactivating.')
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    if (rowIndex >= 0 && rowIndex < gridData.length) {
      const rowData = gridData[rowIndex]
      setClickedRowData(rowData)
      setLastClickedCell(cell)
    } else {
      console.log('Invalid row index:', rowIndex)
    }
  }

  const onGridSelectionChange = (newSelection) => {
    console.log('Selection aborted', newSelection)
  }

  const findRowByItemNo = useCallback(
    (itemNo) => gridData.findIndex((row) => row.ItemNo === itemNo),
    [gridData],
  )

  const highlightRowByItemNo = useCallback(
    (itemNo) => {
      const rowIndex = findRowByItemNo(itemNo)
      if (rowIndex !== null && rowIndex >= 0) {
        const highlightRegionB = {
          color: '#ff00ff33',
          range: { x: 0, y: rowIndex, width: columns.length, height: 1 },
        }
        setHighlightRegions([highlightRegionB])
      }
    },
    [findRowByItemNo, columns.length],
  )

  useEffect(() => {
    highlightRowByItemNo(inputItemNo)
  }, [inputItemNo])
  return (
    <div className="w-full h-full border-t border-b overflow-hidden scroll-container ">
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
        freezeColumns={1}
        headerHeight={30}
        rowHeight={28}
        onGridSelectionChange={setSelection}
        getRowThemeOverride={(rowIndex) => {
          if (rowIndex === hoverRow) {
            return {
              bgCell: '#f7f7f7',
              bgCellMedium: '#f0f0f0',
            }
          }
          return undefined
        }}
      />
    </div>
  )
}

export default TableStockOUtFiFoA
