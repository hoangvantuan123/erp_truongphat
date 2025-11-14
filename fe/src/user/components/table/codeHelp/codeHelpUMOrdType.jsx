import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'

function CodeHelpUMOrdType({
  data,
  nameCodeHelp,
  modalVisible,
  setModalVisible,
  UMOrdTypeSearchSh,
  setUMOrdTypeSearchSh,
  selectionUMOrdType,
  setSelectionUMOrdType,
  gridRef,
  UMOrdTypeName,
  setUMOrdTypeName,
  UMOrdTypeSeq,
  setUMOrdTypeSeq,
  dropdownRef,

}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [UMOrdTypeSearch, setUMOrdTypeSearch] = useState('')

  const defaultCols = [
    {
      title: t('5516'),
      id: 'Value',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('992'),
      id: 'MinorName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    

  ]
  const [cols, setCols] = useState(defaultCols)
  const [filteredData, setFilteredData] = useState([])
  const onFill = useOnFill(filteredData, cols)

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


  const handleSearch = (e) => {
    const value = e.target.value
    setUMOrdTypeSearchSh(value)
    if (value.trim() === '' || value === null) {
      setUMOrdTypeSearch('')
      setUMOrdTypeSeq(0)
      setUMOrdTypeName('')
      setFilteredData(data)

    } else {
      const filteredData = data.filter(
        (item) => item.CustName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filteredData)
    }
    setModalVisible(true)
 
  }

  useEffect(() => {
    if (UMOrdTypeName) {
      setUMOrdTypeSearch(UMOrdTypeName)
      setUMOrdTypeSearchSh(UMOrdTypeName)
    }

  }, [UMOrdTypeName])

  const handleCellClick = ([col, row]) => {

    const dataClick =
      UMOrdTypeSearchSh.trim() === '' ? data : filteredData

    if (dataClick[row]) {
      const selectedName = dataClick[row].MinorName
      setUMOrdTypeName(selectedName)
      setUMOrdTypeSeq(dataClick[row].Value)
      setUMOrdTypeSearch(selectedName)
      setUMOrdTypeSearchSh(selectedName)
      setModalVisible(false)

    }
  }

  const onKeyDown =(e) => {
    if (
      e.key === 'Enter' &&
      filteredData.length > 0
    ) {
      const selectedCustName = filteredData[0]
      setCustName(selectedCustName?.CustName)
      setCustSeq(selectedCustName?.CustSeq)
      setUMOrdTypeSearch(selectedCustName?.CustName)
      setUMOrdTypeSearchSh(selectedCustName?.CustName)
      setModalVisible(false)
    }
    if (e.key === 'Escape') {
      setModalVisible(false)
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
              onClick={() => setModalVisible(false)}
            />
          </div>
          <div className="p-2 border-b border-t">
            <div className="w-full flex gap-2">
              <SearchOutlined className="opacity-80 size-5" />
              <input
                value={UMOrdTypeSearchSh}
                onChange={handleSearch}
                onFocus={() => setModalVisible(true)}
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
            onFill={onFill}
            className="cursor-pointer rounded-md"
            rows={filteredData.length}
            columns={cols}
            gridSelection={selectionUMOrdType}
            onGridSelectionChange={setSelectionUMOrdType}
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
            onCellClicked={handleCellClick}
            freezeColumns="0"
            onColumnResize={onColumnCustResize}
            rowMarkers={('checkbox-visible', 'both')}
            rowSelect="single"
          />
        </div>

  )
}

export default CodeHelpUMOrdType;
