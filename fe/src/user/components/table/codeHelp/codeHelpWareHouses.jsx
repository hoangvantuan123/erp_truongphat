import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'

function CodeHelpWarehouse({
  data,
  modalVisibleWh,
  setModalVisibleWh,
  dropdownRef,
  warehouseSearchSh,
  setWarehouseSearchSh,
  selectionInWarehouse,
  setSelectionInWarehouse,
  gridRef,

  whName,
  setWhName,
  setWhSeq,

}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [warehouseSearch, setWarehouseSearch] = useState('')

  const defaultWarehouseCols = [
    {
      title: t('783'),
      id: 'WHName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('21742'),
      id: 'WHSeq',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('2'),
      id: 'BizUnitName',
      kind: 'Text',
      readonly: true,
      width: 100,
    },
  ]
  const [colsWarehouse, setColsWarehouse] = useState(defaultWarehouseCols)
  const [filteredWarehouseData, setFilteredWarehouseData] = useState([])
  const onWarehouseFill = useOnFill(filteredWarehouseData, colsWarehouse)

  useEffect(() => {
    setFilteredWarehouseData(data)
  }, [data])


  const onColumnWarehouseResize = useCallback(
    (column, newSize) => {
      const index = colsWarehouse.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsWarehouse]
        newCols.splice(index, 1, newCol)
        setColsWarehouse(newCols)
      }
    },
    [colsWarehouse],
  )

  const getWarehouseData = useCallback(
    ([col, row]) => {
      const person = filteredWarehouseData[row] || {}
      const column = colsWarehouse[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''
      const boundingBox = document.body.getBoundingClientRect()

      return {
        kind: GridCellKind.Text,
        data: value,
        displayData: String(value),
        readonly: column?.readonly || false,
        allowOverlay: true,
      }
    },
    [filteredWarehouseData, colsWarehouse],
  )


  const handleWarehouseSearch = (e) => {
    const value = e.target.value
    setWarehouseSearchSh(value)
    if (value.trim() === '' || value === null) {
      setWarehouseSearch('')
      setWhSeq('0')
      setWhName('')
      setFilteredWarehouseData(data)

    } else {
      const filteredWarehouseData = data.filter(
        (item) => item.WHName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredWarehouseData(filteredWarehouseData)
    }
    setModalVisibleWh(true)
 
  }

  useEffect(() => {
    if (whName) {
      setWarehouseSearch(whName)
      setWarehouseSearchSh(whName)
    }

  }, [whName])

  const handleWarehouseCellClick = ([col, row]) => {
    const dataClick =
      warehouseSearchSh.trim() === '' ? data : filteredWarehouseData
    if (dataClick[row]) {
      const selectedWarehouse = dataClick[row].WHName
      setWhName(dataClick[row].WHName)
      setWhSeq(dataClick[row].WHSeq)
      setWarehouseSearch(selectedWarehouse)
      setWarehouseSearchSh(selectedWarehouse)
      setModalVisibleWh(false)

    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const onKeyDown =(e) => {
    if (
      e.key === 'Enter' &&
      filteredWarehouseData.length > 0
    ) {
      const selectedWarehouse = filteredWarehouseData[0]

      setWhName(selectedWarehouse?.WHName)
      setWhSeq(selectedWarehouse?.WHSeq)
      setWarehouseSearch(selectedWarehouse?.WHName)
      setWarehouseSearchSh(selectedWarehouse?.WHName)
      setModalVisibleWh(false)
    }
    if (e.key === 'Escape') {
      setModalVisibleWh(false)
    }
  }

  return (
        <div
          ref={dropdownRef}
          className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
        >
          <div className="flex items-center justify-between p-1">
            <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
              <TableOutlined />
              Kho
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setModalVisibleWh(false)}
            />
          </div>
          <div className="p-2 border-b border-t">
            <div className="w-full flex gap-2">
              <SearchOutlined className="opacity-80 size-5" />
              <input
                value={warehouseSearchSh}
                onChange={handleWarehouseSearch}
                onFocus={() => setModalVisibleWh(true)}
                onKeyDown={onKeyDown}
                highlight={true}
                autoFocus={true}
                className="h-full w-full border-none focus:outline-none hover:border-none bg-inherit"
              />
            </div>
          </div>
          <DataEditor
            ref={gridRef}
            width={950}
            height={500}
            onFill={onWarehouseFill}
            className="cursor-pointer rounded-md"
            rows={filteredWarehouseData.length}
            columns={colsWarehouse}
            gridSelection={selectionInWarehouse}
            onGridSelectionChange={setSelectionInWarehouse}
            getCellsForSelection={true}
            getCellContent={getWarehouseData}
            getRowThemeOverride={(i) =>
              i === hoverRow
                ? {
                  bgCell: '#e8f0ff',
                  bgCellMedium: '#e8f0ff',
                }
                : i % 2 === 0
                  ? undefined
                  : {
                    bgCell: '#FBFBFB',
                  }
            }
            fillHandle={true}
            smoothScrollY={true}
            smoothScrollX={true}
            isDraggable={false}
            onItemHovered={onItemHovered}
            onCellClicked={handleWarehouseCellClick}
            freezeColumns="0"
            onColumnResize={onColumnWarehouseResize}
            rowMarkers={('checkbox-visible', 'both')}
            rowSelect="single"
          />
        </div>

  )
}

export default CodeHelpWarehouse;
