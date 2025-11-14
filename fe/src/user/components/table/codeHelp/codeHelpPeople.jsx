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
import { set } from 'lodash'

const DEBOUNCE_DELAY = 500
let debounceTimer = null

function CodeHelpPeople({
  data,
  nameCodeHelp,
  modalVisiblePeople,
  setModalVisiblePeople,
  dropdownRef,
  peopleSearchSh,
  setPeopleSearchSh,
  selectionPeople,
  setSelectionPeople,
  gridRef,

  empName,
  setEmpName,
  userId,
  setUserId,
  setEmpSeq,
  empSeq,
}) {
  const ref = (useRef < data) | (null > null)
  const { t } = useTranslation()
  const [hoverRow, setHoverRow] = useState(null)
  const [PeopleSearch, setPeopleSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const defaultPeopleCols = [
    {
      title: t('Mã UserSeq'),
      id: 'EmpSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Mã nhân viên'),
      id: 'EmpID',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Tên nhân viên'),
      id: 'EmpName',
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
      title: t('Chức vụ'),
      id: 'UMJpName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
  ]
  const [colsPeople, setColsPeople] = useState(defaultPeopleCols)
  const [filteredPeopleData, setFilteredPeopleData] = useState([])
  const onPeopleFill = useOnFill(filteredPeopleData, colsPeople)

  useEffect(() => {
    setFilteredPeopleData(data)
  }, [data])

  const onColumnPeopleResize = useCallback(
    (column, newSize) => {
      const index = colsPeople.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsPeople]
        newCols.splice(index, 1, newCol)
        setColsPeople(newCols)
      }
    },
    [colsPeople],
  )

  const getPeopleData = useCallback(
    ([col, row]) => {
      const person = filteredPeopleData[row] || {}
      const column = colsPeople[col]
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
    [filteredPeopleData, colsPeople],
  )

  const handlePeopleSearch = useCallback(
    (e) => {
      const value = e.target.value
      setPeopleSearchSh(value)
      if (value.trim() === '' || value === null) {
        setPeopleSearch('')
        setEmpName('')
        setEmpSeq(0)
        setUserId('')
        setFilteredPeopleData(data)
      } else {
        const filteredPeopleData = data.filter(
          (item) =>
            item.EmpID.toLowerCase().includes(value.toLowerCase()) ||
            item.EmpName.toLowerCase().includes(value.toLowerCase()),
        )

        if (filteredPeopleData.length === 0) {
          if (debounceTimer) {
            clearTimeout(debounceTimer)
          }
          debounceTimer = setTimeout(() => {
            setIsLoading(true)
            fetchCodeHelpDataUserSearch(value)
          }, DEBOUNCE_DELAY)
        }

        setFilteredPeopleData(filteredPeopleData)
      }
      setModalVisiblePeople(true)
    },
    [peopleSearchSh],
  )

  const fetchCodeHelpDataUserSearch = useCallback(async (peopleSearchSh) => {
    try {
      const [dataUser] = await Promise.all([
        GetCodeHelpVer2(
          10009,
          peopleSearchSh,
          '',
          '',
          '',
          '',
          '1',
          '',
          50,
          'TypeSeq = 3031001',
          0,
          0,
          0,
        ),
      ])
      setFilteredPeopleData(
        dataUser.data?.filter((item) => item.TypeSeq === 3031001) || [],
      )
    } catch (error) {
      console.error('Error fetching user data:', error)
      setFilteredPeopleData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (empName) {
      setPeopleSearch(empName)
      setPeopleSearchSh(empName)
    }
  }, [empName])

  const handlePeopleCellClick = ([col, row]) => {
    const dataClick = peopleSearchSh.trim() === '' ? data : filteredPeopleData
    if (dataClick[row]) {
      const selectedUserName = dataClick[row].EmpName

      setEmpName(selectedUserName)
      setEmpSeq(dataClick[row].EmpSeq)
      setUserId(dataClick[row].EmpID)
      setPeopleSearch(selectedUserName)
      setPeopleSearchSh(selectedUserName)
      setModalVisiblePeople(false)
    }
  }

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchCodeHelpDataUserSearch()
    }
    if (e.key === 'Enter' && filteredPeopleData.length > 0) {
      const selectedUser = filteredPeopleData[0]

      setEmpName(selectedUser?.EmpName)
      setEmpSeq(selectedUser?.EmpSeq)
      setUserId(selectedUser?.EmpID)
      setPeopleSearch(selectedUser?.EmpName)
      setPeopleSearchSh(selectedUser?.EmpName)
      setModalVisiblePeople(false)
    }
    if (e.key === 'Escape') {
      setModalVisiblePeople(false)
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
          onClick={() => setModalVisiblePeople(false)}
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
            value={peopleSearchSh}
            onChange={handlePeopleSearch}
            onFocus={() => setModalVisiblePeople(true)}
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
        onFill={onPeopleFill}
        className="cursor-pointer rounded-md"
        rows={filteredPeopleData.length}
        columns={colsPeople}
        gridSelection={selectionPeople}
        onGridSelectionChange={setSelectionPeople}
        getCellsForSelection={true}
        getCellContent={getPeopleData}
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
        onCellClicked={handlePeopleCellClick}
        freezeColumns="0"
        onColumnResize={onColumnPeopleResize}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  )
}

export default CodeHelpPeople
