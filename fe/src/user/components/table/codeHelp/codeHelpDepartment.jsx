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
function CodeHelpDepartment({
  data,
  nameCodeHelp,
  modalVisibleDept,
  setModalVisibleDept,
  dropdownRef,
  deptSearchSh,
  setDeptSearchSh,
  selectionDept,
  setSelectionDept,
  gridRef,

  deptName,
  setDeptName,
  deptSeq,
  setDeptSeq,
}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [deptSearch, setDeptSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const defaultDeptCols = [
    {
      title: t('Bộ phận'),
      id: 'BeDeptName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Ngày bắt đầu'),
      id: 'BeBegDate',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Ngày kết thúc'),
      id: 'BeEndDate',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Ghi chú'),
      id: 'DeptRemark',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
  ]
  const [colsDept, setColsDept] = useState(defaultDeptCols)
  const [filteredDeptData, setFilteredDeptData] = useState([])
  const onDeptFill = useOnFill(filteredDeptData, colsDept)

  useEffect(() => {
    setFilteredDeptData(data)
  }, [data])

  const onColumnDeptResize = useCallback(
    (column, newSize) => {
      const index = colsDept.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsDept]
        newCols.splice(index, 1, newCol)
        setColsDept(newCols)
      }
    },
    [colsDept],
  )

  const getDeptData = useCallback(
    ([col, row]) => {
      const person = filteredDeptData[row] || {}
      const column = colsDept[col]
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
    [filteredDeptData, colsDept],
  )

  const handleDeptSearch = (e) => {
    const value = e.target.value
    setDeptSearchSh(value)
    if (value.trim() === '' || value === null) {
      setDeptSearch('')
      setDeptSeq(0)
      setDeptName('')
      setFilteredDeptData(data)
    } else {
      const filteredDeptData = data.filter((item) =>
        item.BeDeptName.toLowerCase().includes(value.toLowerCase()),
      )
      if (filteredDeptData.length === 0) {
        if (debounceTimer) {
          clearTimeout(debounceTimer)
        }
        debounceTimer = setTimeout(() => {
          setIsLoading(true)
          fetchCodeHelpDataSearch(value)
        }, DEBOUNCE_DELAY)
      }
      setFilteredDeptData(filteredDeptData)
    }
    setModalVisibleDept(true)
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
      setFilteredDeptData(data.data || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
      setFilteredDeptData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (deptName) {
      setDeptSearch(deptName)
      setDeptSearchSh(deptName)
    }
  }, [deptName])

  const handleDeptCellClick = ([col, row]) => {
    const dataClick = deptSearchSh.trim() === '' ? data : filteredDeptData
    if (dataClick[row]) {
      const selectedDeptName = dataClick[row].BeDeptName
      setDeptName(selectedDeptName)
      setDeptSeq(dataClick[row].BeDeptSeq)
      setDeptSearch(selectedDeptName)
      setDeptSearchSh(selectedDeptName)
      setModalVisibleDept(false)
    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && filteredDeptData.length > 0) {
      const selectedDept = filteredDeptData[0]

      setDeptName(selectedDept?.BeDeptName)
      setDeptSeq(selectedDept?.BeDeptSeq)
      setDeptSearch(selectedDept?.BeDeptName)
      setDeptSearchSh(selectedDept?.BeDeptName)
      setModalVisibleDept(false)
    }
    if (e.key === 'Escape') {
      setModalVisibleDept(false)
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
          onClick={() => setModalVisibleDept(false)}
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
            value={deptSearchSh}
            onChange={handleDeptSearch}
            onKeyDown={onKeyDown}
            onFocus={() => setModalVisibleDept(true)}
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
        onFill={onDeptFill}
        className="cursor-pointer rounded-md"
        rows={filteredDeptData.length}
        columns={colsDept}
        gridSelection={selectionDept}
        onGridSelectionChange={setSelectionDept}
        getCellsForSelection={true}
        getCellContent={getDeptData}
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
        onCellClicked={handleDeptCellClick}
        freezeColumns="0"
        onColumnResize={onColumnDeptResize}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  )
}

export default CodeHelpDepartment
