import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'

function CodeHelpItemNames({
  data,
  nameCodeHelp,
  setModalVisibleItemName,
  dropdownRefP,
  ItemNameSearchSh,
  setItemNameSearchSh,
  selectionItemName,
  setSelectionItemName,
  gridRef,

  ItemName,
  setItemName,
  setItemSeq,
  setItemNo,
  setAssetName,
  setAssetSeq,
  setSpec,

  setQAssetName,
  setQAssetSeq,
  setQItemName,
  setQItemNo,
  setQSpec,
}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [custSearch, setCustSearch] = useState('')

  const defaultCols = [
    {
      title: t('Tên sản phẩm'),
      id: 'ItemName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Mã tên sản phẩm'),
      id: 'ItemSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Số tên sản phẩm'),
      id: 'ItemNo',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Quy cách'),
      id: 'Spec',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Tên tài sản'),
      id: 'AssetName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Đơn vị'),
      id: 'UnitName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
  ]

  const [cols, setCols] = useState(defaultCols)
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

  const handleItemNameSearch = (e) => {
    const value = e.target.value
    setItemNameSearchSh(value)
    setItemName(value)
    if (value.trim() === '' || value === null) {
      setItemNameSearchSh('')
      setItemName('')
      setFilteredData(data)
    } else {
      const filteredData = data.filter((item) =>
        item.ItemName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filteredData)
    }
    setModalVisibleItemName(true)
  }

  useEffect(() => {
    if (ItemName) {
      setCustSearch(ItemName)
      setItemNameSearchSh(ItemName)
    }
  }, [ItemName])

  const handleItemNameCellClick = ([col, row]) => {
    const dataClick = ItemNameSearchSh.trim() === '' ? data : filteredData

    if (dataClick[row]) {
      const selectedValue = dataClick[row].ItemNo
      const selectedName = dataClick[row].ItemName
      const selectedSeq = dataClick[row].ItemSeq
      setItemNo(selectedValue)
      setItemName(selectedName)
      setItemSeq(selectedSeq)
      setCustSearch(selectedName)
      setItemNameSearchSh(selectedName)
      
      setQItemName(selectedName)
      setQAssetName(dataClick[row].AssetName)
      setQAssetSeq(dataClick[row].AssetSeq)
      setAssetName(dataClick[row].AssetName)
      setAssetSeq(dataClick[row].AssetSeq)
      setSpec(dataClick[row].Spec)
      setQItemNo(selectedValue)
      setQSpec(dataClick[row].Spec)
      setModalVisibleItemName(false)
    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  return (
    <div
      ref={dropdownRefP}
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
          onClick={() => setModalVisibleItemName(false)}
        />
      </div>
      <div className="p-2 border-b border-t">
        <div className="w-full flex gap-2">
          <SearchOutlined className="opacity-80 size-5" />
          <input
            value={ItemNameSearchSh}
            onChange={handleItemNameSearch}
            onFocus={() => setModalVisibleItemName(true)}
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
        gridSelection={selectionItemName}
        onGridSelectionChange={setSelectionItemName}
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
        onCellClicked={handleItemNameCellClick}
        freezeColumns="0"
        onColumnResize={onColumnCustResize}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  )
}

export default CodeHelpItemNames
