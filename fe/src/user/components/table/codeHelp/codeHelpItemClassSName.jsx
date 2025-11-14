import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'

function CodeHelpItemClassSName({
  data,
  nameCodeHelp,
  modalVisibleItemClassName,
  setModalVisibleItemClassName,
  dropdownRef,
  ItemClassSNameSearchSh,
  setItemClassSNameSearchSh,
  selectionItemClassName,
  setSelectionItemClassName,
  gridRef,

  ItemClassName,
  setItemClassName,
  ItemSClassName, 
  setItemSClassName

}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [custSearch, setCustSearch] = useState('')

  const defaultColsItemClassName = [
      
      {
        title: t('Mã Phân loại lớn hạng mục sản phẩm'),
        id: 'ItemClassLSeq',
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
      {
        title: t('Mã Phân loại TB hạng mục sản phẩm'),
        id: 'ItemClassMSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
      },
      {
        title: t('Phân loại TB hạng mục sản phẩm'),
        id: 'ItemClassMName',
        kind: 'Text',
        readonly: true,
        width: 150,
      },
      {
        title: t('Mã Phân loại nhỏ hạng mục sản phẩm'),
        id: 'UMItemClass',
        kind: 'Text',
        readonly: true,
        width: 150,
      },
      {
        title: t('Phân loại nhỏ hạng mục sản phẩm'),
        id: 'ItemClassName',
        kind: 'Text',
        readonly: true,
        width: 150,
      },
    ]

  const [cols, setCols] = useState(defaultColsItemClassName)
  const [filteredData, setFilteredData] = useState([])
  const onCustFill = useOnFill(filteredData, cols)

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const onColumnCustResize = useCallback(
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
    setItemClassSNameSearchSh(value)
    setItemSClassName(value)
    if (value.trim() === '' || value === null) {
      setItemClassSNameSearchSh('')
      setItemClassName('')
      setItemSClassName('')
      setFilteredData(data)

    } else {
      const filteredData = data.filter(
        (item) => item.ItemClassName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filteredData)
    }
    setModalVisibleItemClassName(true)
 
  }

  useEffect(() => {
    if (ItemSClassName) {
      setCustSearch(ItemSClassName)
      setItemClassSNameSearchSh(ItemSClassName)
    }

  }, [ItemSClassName])

  const handleItemClassNameCellClick = ([col, row]) => {

    const dataClick =
      ItemClassSNameSearchSh.trim() === '' ? data : filteredData

    if (dataClick[row]) {
      const selectedName = dataClick[row].ItemClassName
      const selectedValue = dataClick[row].UMItemClass
      setItemClassName(selectedValue)
      setItemSClassName(selectedName)
      setCustSearch(selectedName)
      setItemClassSNameSearchSh(selectedName)
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
                value={ItemClassSNameSearchSh}
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

export default CodeHelpItemClassSName;
