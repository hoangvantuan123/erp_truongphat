import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'

function CodeHelpCust({
  data,
  nameCodeHelp,
  modalVisibleCust,
  setModalVisibleCust,
  dropdownRef,
  custSearchSh,
  setCustSearchSh,
  selectionCust,
  setSelectionCust,
  gridRef,

  CustName,
  setCustName,
  CustSeq,
  setCustSeq,

}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [custSearch, setCustSearch] = useState('')

  const defaultCustCols = [
    {
      title: t('Mã khách hàng mua hàng'),
      id: 'CustSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Tên địa chỉ giao dịch mua hàng'),
      id: 'CustName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Số nơi giao dịch mua bán'),
      id: 'CustNo',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Mã số kinh doanh'),
      id: 'BizNo',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Thương hiệu'),
      id: 'FullName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Chữ viết tắt'),
      id: 'TrunName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },

  ]
  const [colsCust, setColsCust] = useState(defaultCustCols)
  const [filteredCustData, setFilteredCustData] = useState([])
  const onCustFill = useOnFill(filteredCustData, colsCust)

  useEffect(() => {
    setFilteredCustData(data)
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
        setColsCust(newCols)
      }
    },
    [colsCust],
  )

  const getCustData = useCallback(
    ([col, row]) => {
      const person = filteredCustData[row] || {}
      const column = colsCust[col]
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
    [filteredCustData, colsCust],
  )


  const handleCustSearch = (e) => {
    const value = e.target.value
    setCustSearchSh(value)
    if (value.trim() === '' || value === null) {
      setCustSearch('')
      setCustSeq(0)
      setCustName('')
      setFilteredCustData(data)

    } else {
      const filteredCustData = data.filter(
        (item) => item.CustName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredCustData(filteredCustData)
    }
    setModalVisibleCust(true)
 
  }

  useEffect(() => {
    if (CustName) {
      setCustSearch(CustName)
      setCustSearchSh(CustName)
    }

  }, [CustName])

  const handleCustCellClick = ([col, row]) => {

    const dataClick =
      custSearchSh.trim() === '' ? data : filteredCustData

    if (dataClick[row]) {
      const selectedCustName = dataClick[row].CustName
      setCustName(selectedCustName)
      setCustSeq(dataClick[row].CustSeq)
      setCustSearch(selectedCustName)
      setCustSearchSh(selectedCustName)
      setModalVisibleCust(false)

    }
  }

  const onKeyDown =(e) => {
    if (
      e.key === 'Enter' &&
      filteredCustData.length > 0
    ) {
      const selectedCustName = filteredCustData[0]
      setCustName(selectedCustName?.CustName)
      setCustSeq(selectedCustName?.CustSeq)
      setCustSearch(selectedCustName?.CustName)
      setCustSearchSh(selectedCustName?.CustName)
      setModalVisibleCust(false)
    }
    if (e.key === 'Escape') {
      setModalVisibleCust(false)
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
              onClick={() => setModalVisibleCust(false)}
            />
          </div>
          <div className="p-2 border-b border-t">
            <div className="w-full flex gap-2">
              <SearchOutlined className="opacity-80 size-5" />
              <input
                value={custSearchSh}
                onChange={handleCustSearch}
                onFocus={() => setModalVisibleCust(true)}
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
            onFill={onCustFill}
            className="cursor-pointer rounded-md"
            rows={filteredCustData.length}
            columns={colsCust}
            gridSelection={selectionCust}
            onGridSelectionChange={setSelectionCust}
            getCellsForSelection={true}
            getCellContent={getCustData}
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
            onCellClicked={handleCustCellClick}
            freezeColumns="0"
            onColumnResize={onColumnCustResize}
            rowMarkers={('checkbox-visible', 'both')}
            rowSelect="single"
          />
        </div>

  )
}

export default CodeHelpCust;
