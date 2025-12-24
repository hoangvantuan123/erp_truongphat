import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import {
  SearchOutlined,
  TableOutlined,
  CloseOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import { set } from 'lodash'

const DEBOUNCE_DELAY = 500
let debounceTimer = null
function CodeHelpCurrency({
  data,
  nameCodeHelp,
  modalVisible,
  setModalVisible,
  searchSh,
  setSearchSh,
  selection,
  setSelection,
  

  currName,
  setCurrName,
  currSeq,
  setCurrSeq,
  setRateBuy,
}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [currSearch, setCurrSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [numRows, setNumRows] = useState(0)
  const gridRef = useRef(null)
  const dropdownRef = useRef(null)
  const defaultCols = [
    {
      title: t('CurrSeq'),
      id: 'CurrSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('CurrName'),
      id: 'CurrName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('RateBuy'),
      id: 'RateBuy',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('RateSell'),
      id: 'RateSell',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
  ]
  const [cols, setCols] = useState(defaultCols)
  const [filteredData, setFilteredData] = useState([])
  const onDeptFill = useOnFill(filteredData, cols)

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const onColumnDeptResize = useCallback(
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

  const getCurrData = useCallback(
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

  const handlecurrSearch = (e) => {
    const value = e.target.value
    setSearchSh(value)
    if (value.trim() === '' || value === null) {
      setCurrSearch('')
      setCurrSeq(0)
      setCurrName('')
      setFilteredData(data)
    } else {
      const filteredData = data.filter((item) =>
        item.CurrName.toLowerCase().includes(value.toLowerCase()),
      )
      if (filteredData.length === 0) {
        if (debounceTimer) {
          clearTimeout(debounceTimer)
        }
        debounceTimer = setTimeout(() => {
          setIsLoading(true)
          fetchCodeHelpDataSearch(value)
        }, DEBOUNCE_DELAY)
      }
      setFilteredData(filteredData)
    }
    setModalVisible(true)
  }

  const fetchCodeHelpDataSearch = useCallback(async (keyword) => {
    try {
      const [data] = await Promise.all([
        GetCodeHelpVer2(
          10010,
          keyword,
          '',
          '',
          '',
          '',
          '1',
          '',
          1,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
      ])
      setFilteredData(data.data || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
      setFilteredData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currName) {
      setCurrSearch(currName)
      setSearchSh(currName)
    }
  }, [currName])

  const handleCurrCellClick = ([col, row]) => {
    const dataClick = searchSh.trim() === '' ? data : filteredData
    if (dataClick[row]) {
      const selectedDeptName = dataClick[row].CurrName
      setCurrName(selectedDeptName)
      setCurrSeq(dataClick[row].CurrSeq)
      setRateBuy(dataClick[row].RateBuy)
      setCurrSearch(selectedDeptName)
      setSearchSh(selectedDeptName)
      setModalVisible(false)
    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && filteredData.length > 0) {
      const selectedDept = filteredData[0]

      setCurrName(selectedDept?.CurrName)
      setCurrSeq(selectedDept?.CurrSeq)
      setCurrSearch(selectedDept?.CurrName)
      setSearchSh(selectedDept?.CurrName)
      setModalVisible(false)
    }
    if (e.key === 'Escape') {
      setModalVisible(false)
    }
  }

  useEffect(() => {
    if (modalVisible && dropdownRef.current) {
      const dropdown = dropdownRef.current
      dropdown.style.position = 'fixed'
      dropdown.style.top = '50%'
      dropdown.style.left = '50%'
      dropdown.style.transform = 'translate(-50%, -50%)'
      dropdown.style.zIndex = '1000'
    }
    const safeData = data || []
    setFilteredData(safeData)
    setNumRows(safeData.length)
  }, [modalVisible])

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
          <button
            onClick={() => {
              if (!isLoading) {
                fetchCodeHelpDataSearch(searchText)
              }
            }}
            className="opacity-80 size-5 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingOutlined className="animate-spin" />
            ) : (
              <SearchOutlined />
            )}
          </button>
          <input
            value={searchSh}
            onChange={handlecurrSearch}
            onKeyDown={onKeyDown}
            onFocus={() => setModalVisible(true)}
            highlight={true}
            autoFocus={true}
            className="h-full w-full border-none focus:outline-none hover:border-none bg-inherit"
          />
          {searchSh && (
            <DeleteOutlined
              className="absolute right-2 cursor-pointer opacity-50 hover:opacity-100"
              onClick={() => {
              setCurrName('')
              setSearchSh('')
              setCurrSeq(0)
              setFilteredData(data)
              setNumRows(data?.length)
              }}
            />
          )}
        </div>
      </div>
      <DataEditor
        ref={gridRef}
        width={950}
        height={500}
        onFill={onDeptFill}
        className="cursor-pointer rounded-md"
        rows={filteredData?.length}
        columns={cols}
        gridSelection={selection}
        onGridSelectionChange={setSelection}
        getCellsForSelection={true}
        getCellContent={getCurrData}
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
        onCellClicked={handleCurrCellClick}
        freezeColumns="0"
        onColumnResize={onColumnDeptResize}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  )
}

export default CodeHelpCurrency
