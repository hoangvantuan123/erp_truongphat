import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'

function CodeHelpOrdName({
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

  ordName,
  setOrdName,
  setOrdSeq,
  ordSeq,
}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [search, setSearch] = useState('')

  const defaultCols = [
    {
      title: t('13623'),
      id: 'OrdName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {

      title: t('373'),
      id: 'OrdSeq',
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
      setOrdName('')
      setOrdSeq(0)
      setFilteredData(data)
    } else {
      const filteredData = data.filter(
        (item) =>
          item.OrdName.toLowerCase().includes(value.toLowerCase()) ||
          item.OrdSeq.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filteredData)
    }
    setModalVisible(true)
  }

  useEffect(() => {
    if (ordName) {
      setSearch(ordName)
      setSearchSh(ordName)
    }
  }, [ordName])

  const handleCellClick = ([col, row]) => {
    const dataClick = searchSh.trim() === '' ? data : filteredData
    if (dataClick[row]) {
      const selectedUserName = dataClick[row].OrdName

      setOrdName(selectedUserName)
      setOrdSeq(dataClick[row].OrdSeq)
      setSearch(selectedUserName)
      setSearchSh(selectedUserName)
      setModalVisible(false)
    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const fetchCodeHelpDataUserSearch = useCallback(async () => {
    try {
      const [data] = await Promise.all([
        GetCodeHelpVer2(20009, searchSh, '', '', '', '', '1', '', 1,'', 0, 0, 0),
      ])
      setFilteredData(
        data.data || [],
      )
    } catch (error) {}
  }, [searchSh])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      
      fetchCodeHelpDataUserSearch()
    }
    if (e.key === 'Enter' && filteredData.length > 0) {
      const selectedUser = filteredData[0]

      setOrdName(selectedUser?.MinorName)
      setOrdSeq(selectedUser?.Value)
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
          <SearchOutlined className="opacity-80 size-5" />
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

export default CodeHelpOrdName
