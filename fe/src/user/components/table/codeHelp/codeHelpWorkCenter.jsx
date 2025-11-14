import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { Button, Modal } from 'antd'
import '@glideapps/glide-data-grid/dist/index.css'
import { useTranslation } from 'react-i18next'

import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import useOnFill from '../../hooks/sheet/onFillHook'

function CodeHelpWorkCenter({
  data,
  nameCodeHelp,
  modalVisibleWorkCenter,
  setModalVisibleWorkCenter,
  dropdownRef,
  WorkCenterSearchSh,
  setWorkCenterSearchSh,
  selectionWorkCenter,
  setSelectionWorkCenter,
  gridRef,

  WorkCenterName,
  setWorkCenterName,
  WorkCenter,
  setWorkCenter,

}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [custSearch, setCustSearch] = useState('')

  const defaultWorkCenterCols = [
    {
      title: t('Mã số trung tâm làm việc'),
      id: 'WorkCenterSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Tên trung tâm hoạt động'),
      id: 'WorkCenterName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Mã phân loại trung tâm làm việc'),
      id: 'SMWorkCenterType',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Loại TT hoạt động'),
      id: 'SMWorkCenterTypeName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    
    {
      title: t('Khách hàng gia công ngoài'),
      id: 'CustName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Bộ phận'),
      id: 'DeptName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Nơi sản xuất'),
      id: 'FactUnitName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Điều kiện phụ trợ'),
      id: 'IsYn',
      kind: 'Text',
      readonly: true,
      width: 200,
    },

  ]
  const [colsWorkCenter, setColsWorkCenter] = useState(defaultWorkCenterCols)
  const [filteredWorkCenterData, setFilteredWorkCenterData] = useState([])
  const onCustFill = useOnFill(filteredWorkCenterData, colsWorkCenter)

  useEffect(() => {
    setFilteredWorkCenterData(data)
  }, [data])


  const onColumnCustResize = useCallback(
    (column, newSize) => {
      const index = colsWorkCenter.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsWorkCenter]
        newCols.splice(index, 1, newCol)
        setColsWorkCenter(newCols)
      }
    },
    [colsWorkCenter],
  )

  const getWorkCenterData = useCallback(
    ([col, row]) => {
      const person = filteredWorkCenterData[row] || {}
      const column = colsWorkCenter[col]
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
    [filteredWorkCenterData, colsWorkCenter],
  )


  const handleWorkCenterSearch = (e) => {
    const value = e.target.value
    setWorkCenterName(value)
    setWorkCenter(value)
    if (value.trim() === '' || value === null) {
      setWorkCenterName('')
      setWorkCenter(0)
      setFilteredWorkCenterData(data)

    } else {
      const filteredData = data.filter(
        (item) => item.WorkCenterName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredWorkCenterData(filteredData)
    }
    setModalVisibleWorkCenter(true)
 
  }

  useEffect(() => {
    if (WorkCenterName) {
      setWorkCenterName(WorkCenterName)
      setWorkCenterSearchSh(WorkCenterName)
    }

  }, [WorkCenterName])

  const handleWorkCenterCellClick = ([col, row]) => {

    const dataClick =
      WorkCenterSearchSh.trim() === '' ? data : filteredWorkCenterData

    if (dataClick[row]) {
      const selectedWorkCenter= dataClick[row].WorkCenterName
      setWorkCenterName(selectedWorkCenter)
      setWorkCenter(dataClick[row].WorkCenterSeq)
      setWorkCenterSearchSh(selectedWorkCenter)
      setModalVisibleWorkCenter(false)

    }
  }

  const onKeyDown =(e) => {
    if (
      e.key === 'Enter' &&
      filteredWorkCenterData.length > 0
    ) {
      const selected = filteredWorkCenterData[0]
      setWorkCenterName(selected.WorkCenterName)
      setWorkCenter(selected.WorkCenterSeq)
      setWorkCenterSearchSh(selected.WorkCenterName)
      setModalVisibleWorkCenter(false)
    }
    if (e.key === 'Escape') {
      setModalVisibleWorkCenter(false)
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
              onClick={() => setModalVisibleWorkCenter(false)}
            />
          </div>
          <div className="p-2 border-b border-t">
            <div className="w-full flex gap-2">
              <SearchOutlined className="opacity-80 size-5" />
              <input
                value={WorkCenterName}
                onChange={handleWorkCenterSearch}
                onFocus={() => setModalVisibleWorkCenter(true)}
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
            rows={filteredWorkCenterData.length}
            columns={colsWorkCenter}
            gridSelection={selectionWorkCenter}
            onGridSelectionChange={setSelectionWorkCenter}
            getCellsForSelection={true}
            getCellContent={getWorkCenterData}
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
            onCellClicked={handleWorkCenterCellClick}
            freezeColumns="0"
            onColumnResize={onColumnCustResize}
            rowMarkers={('checkbox-visible', 'both')}
            rowSelect="single"
          />
        </div>

  )
}

export default CodeHelpWorkCenter;
