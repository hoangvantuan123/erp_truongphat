import { useState, useRef, useEffect, useCallback } from 'react'
import { Button, Form, Input, Row, Col, Select } from 'antd'
import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import {
  SearchOutlined,
  TableOutlined,
  CloseOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useTranslation } from 'react-i18next'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
const DropdownEmp = ({
  helpData,
  setHelpData05,
  EmpName,
  setEmpName,
  setEmpSeq,
  setDeptName,
  setDeptSeq,

  setDropdownVisible,
  dropdownVisible,
}) => {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const dropdownRef = useRef(null)
  const [filteredData, setFilteredData] = useState([])
  const [hoverRow, setHoverRow] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const controllers = useRef({})
  const searchRef = useRef({ lastSearch: '', lastResult: [], history: [] })
  const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'))
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [numRows, setNumRows] = useState(0)
  useEffect(() => {
    if (dropdownVisible && dropdownRef.current) {
      const dropdown = dropdownRef.current
      dropdown.style.position = 'fixed'
      dropdown.style.top = '50%'
      dropdown.style.left = '50%'
      dropdown.style.transform = 'translate(-50%, -50%)'
      dropdown.style.zIndex = '1000'
    }
    const safeData = helpData || []
    setFilteredData(safeData)
    setNumRows(safeData.length)
  }, [dropdownVisible])
  const defaultCols = [
    {
      title: 'EmpName',
      id: 'EmpName',
      kind: 'Text',
      readonly: true,
      width: 300,
    },
    {
      title: 'EmpSeq',
      id: 'EmpSeq',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
    {
      title: 'EmpID',
      id: 'EmpID',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
    {
      title: 'DeptName',
      id: 'DeptName',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
    {
      title: 'DeptSeq',
      id: 'DeptSeq',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
  ]
  const [cols, setCols] = useState(defaultCols)
  const onFill = useOnFill(filteredData, cols)

  const debounce = (func, delay) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => func(...args), delay)
    }
  }

  const debounceCallGetCodeHelp = debounce(async (key) => {
    if (!key.trim()) return
    if (controllers.current.debounceCallGetCodeHelp) {
      controllers.current.debounceCallGetCodeHelp.abort()
      controllers.current.debounceCallGetCodeHelp = null
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    setIsLoading(true)

    const controller = new AbortController()
    const signal = controller.signal
    controllers.current.debounceCallGetCodeHelp = controller

    try {
      const result = await GetCodeHelpVer2(
        10009, key, '', '', '', '', '', 1, 0, '', 0, 0, 0, signal
      )
      if (result && result.data) {
        setHelpData05((prev) => {
          const safePrev = prev ?? []
          const existingItemSeqs = new Set(safePrev.map((item) => item.EmpSeq))
          const newData = result.data.filter(
            (item) => !existingItemSeqs.has(item.EmpSeq),
          )
          return [...safePrev, ...newData]
        })
        setFilteredData(result.data)
        setNumRows(result.data.length)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setFilteredData([])
        setNumRows(0)
      }
    } finally {
      controllers.current.debounceCallGetCodeHelp = null

      setTimeout(() => {
        if (!controllers.current.debounceCallGetCodeHelp) {
          setIsLoading(false)
        }
      }, 100)
    }
  }, 500)

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value
      const valueSearch = value.trim()
      setEmpName(value)

      const propertiesToSearch = ['Value', 'MinnorName']

      const normalizeText = (text) =>
        typeof text === 'string' || typeof text === 'number'
          ? text.toString().toLowerCase()
          : ''

      if (!valueSearch) {
        setFilteredData(helpData)
        setNumRows(helpData.length)
        searchRef.current.lastSearch = ''
        searchRef.current.lastResult = helpData
        setDataSearch([])
        setDataSheetSearch([])
      } else {
        const search = normalizeText(valueSearch)

        const lastFilteredData = searchRef.current.lastResult || []

        const newFiltered = lastFilteredData.filter((item) =>
          propertiesToSearch.some((attr) => {
            const fieldValue = normalizeText(item[attr])
            return fieldValue.includes(search)
          }),
        )

        const isNewSearch = search !== searchRef.current.lastSearch

        if (newFiltered.length > 0) {
          setFilteredData(newFiltered)
          setNumRows(newFiltered.length)
          searchRef.current.lastSearch = search
          searchRef.current.lastResult = newFiltered
        }

        if (isNewSearch && newFiltered.length === 0) {
          debounceCallGetCodeHelp(search)
          searchRef.current.lastSearch = search

          if (!searchRef.current.history.includes(search)) {
            searchRef.current.history = [...searchRef.current.history, search]
          }
        }
      }

      setDropdownVisible(true)
    },
    [helpData],
  )

  const handleCellClick = ([col, row]) => {
    const data = EmpName.trim() === '' ? helpData : filteredData
    if (data[row]) {
      const ItemName = data[row].EmpName

      setEmpName(ItemName)
      setEmpSeq(data[row].EmpSeq)
      setDeptName(data[row].DeptName)
      setDeptSeq(data[row].DeptSeq)

      setDropdownVisible(false)
    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getData = useCallback(
    ([col, row]) => {
      const person = filteredData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''

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

  if (!dropdownVisible) return null

  return (
    <div
      ref={dropdownRef}
      className="fixed  z-50 w-auto bg-white border border-gray-300 rounded-lg 
                    top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div className="flex items-center justify-between p-1">
        <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          {t('1579')}
        </h2>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setDropdownVisible(false)}
        />
      </div>
      <div className="p-2 border-b border-t">
        <div className="w-full flex gap-2">
          <button
            onClick={() => {
              if (!isLoading) {
                debounceCallGetCodeHelp(searchText)
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
            value={EmpName}
            onChange={handleSearch}
            onFocus={() => setDropdownVisible(true)}
            autoFocus={true}
            className="h-full w-full border-none focus:outline-none bg-inherit"
          />

          {EmpName && (
            <DeleteOutlined
              className="absolute right-2 cursor-pointer opacity-50 hover:opacity-100"
              onClick={() => {
                setEmpName('')
                setItemText('')
                setFilteredData(helpData)
                setDataSearch(null)
                setNumRows(helpData.length)
                setDataSearchDept(null)
                setDataSheetSearch([])
              }}
            />
          )}
        </div>
      </div>
      <DataEditor
        ref={gridRef}
        width={1200}
        height={500}
        onFill={onFill}
        className="cursor-pointer rounded-md"
        rows={numRows}
        columns={cols}
        gridSelection={selection}
        onGridSelectionChange={setSelection}
        getCellsForSelection={true}
        rowHeight={27}
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
        onColumnResize={onColumnResize}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  )
}

export default DropdownEmp
