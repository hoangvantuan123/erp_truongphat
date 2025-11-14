import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'

function CodeHelpItemClassLName({
  data,
  defaultCols,
  nameCodeHelp,
  modalVisibleItemClassName,
  setModalVisibleItemClassName,
  dropdownRef,
  ItemClassNameSearchSh,
  setItemClassNameSearchSh,
  selectionItemClassName,
  setSelectionItemClassName,
  gridRef,

  ItemClassName,
  setItemClassName,
  ItemLClassName,
  setItemLClassName,
}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [custSearch, setCustSearch] = useState('')

  const defaultColsItemClassLName = [
    {
      title: t('Mã Phân loại lớn hạng mục sản phẩm'),
      id: 'UMItemClass',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Phân loại lớn hạng mục sản phẩm'),
      id: 'ItemClassLName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
  ]

  const [cols, setCols] = useState(defaultColsItemClassLName)
  const [filteredData, setFilteredData] = useState([])
  const onCustFill = useOnFill(filteredData, cols)

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const onColumnCustResize = useCallback(
    (column, newSize) => {
      const index = colsCust.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsCust]
        newCols.splice(index, 1, newCol)
        setCols(newCols)
      }
    },
    [cols],
  )

  const getData = useCallback(
    ([col, row]) => {
      const person = filteredData[row] || {}
      const column = cols[col]
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
    [filteredData, cols],
  )

  const handleItemClassNameSearch = (e) => {
    const value = e.target.value
    setItemClassNameSearchSh(value)
    setItemLClassName(value)
    if (value.trim() === '' || value === null) {
      setItemClassNameSearchSh('')
      setItemClassName('')
      setFilteredData(data)
    } else {
      const filteredData = data.filter((item) =>
        item.ItemClassLName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filteredData)
    }
    setModalVisibleItemClassName(true)
  }

  useEffect(() => {
    if (ItemLClassName) {
      setCustSearch(ItemLClassName)
      setItemClassNameSearchSh(ItemLClassName)
    }
  }, [ItemLClassName])

  const handleItemClassNameCellClick = ([col, row]) => {
    const dataClick = ItemClassNameSearchSh.trim() === '' ? data : filteredData

    if (dataClick[row]) {
      const selectedValue = dataClick[row].UMItemClass
      const selectedName = dataClick[row].ItemClassLName
      setItemClassName(selectedValue)
      setItemLClassName(selectedName)
      setCustSearch(selectedName)
      setItemClassNameSearchSh(selectedName)
      setModalVisibleItemClassName(false)
    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  return (
    <div
      ref={dropdownRef}
      className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
    >
      <div className="flex items-center justify-between p-1">
        <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          {nameCodeHelp}
        </h2>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setModalVisibleItemClassName(false)}
        />
      </div>
      <div className="p-2 border-b border-t">
        <div className="w-full flex gap-2">
          <SearchOutlined className="opacity-80 size-5" />
          <input
            value={ItemClassNameSearchSh}
            onChange={handleItemClassNameSearch}
            onFocus={() => setModalVisibleItemClassName(true)}
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
        onFill={onCustFill}
        className="cursor-pointer rounded-md"
        rows={filteredData.length}
        columns={cols}
        gridSelection={selectionItemClassName}
        onGridSelectionChange={setSelectionItemClassName}
        getCellsForSelection={true}
        getCellContent={getData}
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
        onCellClicked={handleItemClassNameCellClick}
        freezeColumns="0"
        onColumnResize={onColumnCustResize}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  )
}

export default CodeHelpItemClassLName
