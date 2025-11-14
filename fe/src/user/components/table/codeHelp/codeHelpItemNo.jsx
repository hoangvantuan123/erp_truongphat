import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'

function CodeHelpItemNo({
  data,
  nameCodeHelp,
  setModalVisibleItemNo,
  dropdownRefP,
  ItemNoSearchSh,
  setItemNoSearchSh,
  selectionItemNo,
  setSelectionItemNo,
  gridRef,

  ItemNo,
  setItemNo,
  setItemName,
  setItemSeq,
  setAssetName,
  setAssetSeq,
  setSpec,

  setQAssetName,
  setQAssetSeq,
  setQItemName,
  setQItemNo,
  setQSpec,
  setQItemSeq,

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

  const handleItemNoSearch = (e) => {
    const value = e.target.value
    setItemNoSearchSh(value)
    setItemNo(value)
    if (value.trim() === '' || value === null) {
      setItemNoSearchSh('')
      setItemNo('')
      setFilteredData(data)
    } else {
      const filteredData = data.filter((item) =>
        item.ItemNo.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filteredData)
    }
    setModalVisibleItemNo(true)
  }

  useEffect(() => {
    if (ItemNo) {
      setCustSearch(ItemNo)
      setItemNoSearchSh(ItemNo)
    }
  }, [ItemNo])

  const handleItemNoCellClick = ([col, row]) => {
    const dataClick = ItemNoSearchSh.trim() === '' ? data : filteredData

    if (dataClick[row]) {
      const selectedValue = dataClick[row].ItemNo
      const selectedName = dataClick[row].ItemName
      const selectedSeq = dataClick[row].ItemSeq
      setItemNo(selectedValue)
      setItemName(selectedName)
      setItemSeq(selectedSeq)
      setCustSearch(selectedName)
      setItemNoSearchSh(selectedName)
      setSpec(dataClick[row].Spec)
      setAssetName(dataClick[row].AssetName)
      setAssetSeq(dataClick[row].AssetSeq)

      setQItemNo(selectedValue)
      setQItemName(selectedName)
      setQSpec(dataClick[row].Spec)
      setQAssetName(dataClick[row].AssetName)
      setQAssetSeq(dataClick[row].AssetSeq)
      setModalVisibleItemNo(false)
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
          onClick={() => setModalVisibleItemNo(false)}
        />
      </div>
      <div className="p-2 border-b border-t">
        <div className="w-full flex gap-2">
          <SearchOutlined className="opacity-80 size-5" />
          <input
            value={ItemNoSearchSh}
            onChange={handleItemNoSearch}
            onFocus={() => setModalVisibleItemNo(true)}
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
        gridSelection={selectionItemNo}
        onGridSelectionChange={setSelectionItemNo}
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
        onCellClicked={handleItemNoCellClick}
        freezeColumns="0"
        onColumnResize={onColumnCustResize}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  )
}

export default CodeHelpItemNo