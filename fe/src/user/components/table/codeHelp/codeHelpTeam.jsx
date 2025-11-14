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
} from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'

const DEBOUNCE_DELAY = 500
let debounceTimer = null
function CodeHelpTeam({
  data,
  nameCodeHelp,
  modalVisible,
  setModalVisible,
  dropdownRef,
  searchSh,
  setSearchSh,
  selection,
  setSelection,
  gridRef,

  UMJdName,
  setUMJdName,
  setUMJdSeq,
  UMJdSeq,
}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const defaultCols = [
    {
      title: t('373'),
      id: 'MinorName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('373'),
      id: 'Value',
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

  const getPossitionData = useCallback(
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
    setSearchSh(value)
    if (value.trim() === '' || value === null) {
      setSearch('')
      setUMJdName('')
      setUMJdSeq(0)
      setFilteredData(data)
    } else {
      console.log('data', data)
      const filteredData = data.filter(
        (item) =>
          item.MinorName.toLowerCase().includes(value.toLowerCase()) ||
          item.Value === value,
      )
      if (filteredData.length === 0) {
        if (debounceTimer) {
          clearTimeout(debounceTimer)
        }
        debounceTimer = setTimeout(() => {
          setIsLoading(true)
          fetchCodeHelpDataUserSearch(value)
        }, DEBOUNCE_DELAY)
      }
      setFilteredData(filteredData)  
    }
    setModalVisible(true)
  }

  useEffect(() => {
    if (UMJdName) {
      setSearch(UMJdName)
      setSearchSh(UMJdName)
    }
  }, [UMJdName])

  const handleCellClick = ([col, row]) => {
    const dataClick = searchSh.trim() === '' ? data : filteredData
    if (dataClick[row]) {
      const selectedUserName = dataClick[row].MinorName

      setUMJdName(selectedUserName)
      setUMJdSeq(dataClick[row].Value)
      setSearch(selectedUserName)
      setSearchSh(selectedUserName)
      setModalVisible(false)
    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const fetchCodeHelpDataUserSearch = useCallback(async (keyword) => {
    try {
      const [data] = await Promise.all([
        GetCodeHelpVer2(
          19999,
          keyword,
          '3053',
          '',
          '',
          '',
          '1',
          '',
          1,
          '',
          0,
          0,
          0,
        ),
      ])
      setFilteredData(data.data || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
      setFilteredData([])
    }finally {
      setIsLoading(false)
    }

  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchCodeHelpDataUserSearch()
    }
    if (e.key === 'Enter' && filteredData.length > 0) {
      const selectedUser = filteredData[0]

      setUMJdName(selectedUser?.MinorName)
      setUMJdSeq(selectedUser?.Value)
      setSearch(selectedUser?.MinorName)
      setSearchSh(selectedUser?.MinorName)
      setModalVisible(false)
    }
    if (e.key === 'Escape') {
      setModalVisible(false)
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
          {isLoading ? (
            <LoadingOutlined className="animate-spin" />
          ) : (
            <SearchOutlined />
          )}
          <input
            value={searchSh}
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
        gridSelection={selection}
        onGridSelectionChange={setSelection}
        getCellsForSelection={true}
        getCellContent={getPossitionData}
        getRowThemeOverride={(rowIndex) => {
          if (rowIndex === hoverRow) {
            return {
              bgCell: '#f7f7f7',
              bgCellMedium: '#f0f0f0',
            }
          }
          return undefined
        }}
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

export default CodeHelpTeam
