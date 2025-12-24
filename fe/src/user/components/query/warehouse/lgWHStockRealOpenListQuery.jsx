import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import useOnFill from '../../hooks/sheet/onFillHook'
import moment from 'moment'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useTranslation } from 'react-i18next'

export default function LGWHStockRealOpenListQuery({
  fromDate,
  setFromDate,
  setToDate,
  toDate,

  bizUnit,
  dataBizUnit,
  setBizUnit,

  typeName,
  setTypeName,

  whName,
  setWhName,
  setWhSeq,
  dataWarehouse,

  userName,
  setUserName,
  setUserSeq,
  dataUserName,
  stkMngNo,
  setStkMngNo,
}) {
  const gridRef = useRef(null)
  const [warehouseSearch, setWarehouseSearch] = useState('')
  const [warehouseSearchSh, setWarehouseSearchSh] = useState('')

  const [userNameSearch, setUserNameSearch] = useState('')
  const [userNameSearchSh, setUserNameSearchSh] = useState('')

  const [filteredWarehouseData, setFilteredWarehouseData] = useState([])
  const [filteredUserNameData, setFilteredUserNameData] = useState([])

  const [hoverRow, setHoverRow] = useState(null)

  const [dropdownWarehouseVisible, setDropdownWarehouseVisible] =
    useState(false)

  const [dropdownUserNameVisible, setDropdownUserNameVisible] = useState(false)
  const dropdownRef = useRef(null)

  const [selectionWarehouse, setSelectionWarehouse] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionUserName, setSelectionUserName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const { t } = useTranslation()

  const defaultWarehouseCols = [
    {
      title: t('783'),
      id: 'WHName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('21742'),
      id: 'WHSeq',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('2'),
      id: 'BizUnitName',
      kind: 'Text',
      readonly: true,
      width: 100,
    },
  ]
  const [colsWarehouse, setColsWarehouse] = useState(defaultWarehouseCols)
  const onWarehouseFill = useOnFill(filteredWarehouseData, colsWarehouse)

  const defaultUserNameCols = [
    {
      title: t('Mã UserSeq'),
      id: 'UserSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Mã nhân viên'),
      id: 'UserId',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Tên nhân viên'),
      id: 'UserName',
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
      title: t('Mã Bộ phận'),
      id: 'DeptSeq',
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

  const [colsUserName, setColsUserName] = useState(defaultUserNameCols)
  const onUserNameFill = useOnFill(filteredUserNameData, colsUserName)

  useEffect(() => {
    setFilteredWarehouseData(dataWarehouse)
    setFilteredUserNameData(dataUserName)
  }, [dataWarehouse, dataUserName])

  useEffect(() => {
    if (userName) {
      setUserNameSearch(userName)
      setUserNameSearchSh(userName)
    }
    if (whName) {
      setWarehouseSearch(whName)
      setWarehouseSearchSh(whName)
    }
  }, [userName, whName])

  const handleWarehouseSearch = (e) => {
    const value = e.target.value
    setWarehouseSearchSh(value)
    if (value.trim() === '' || value === null) {
      setWarehouseSearch('')
      setWhName('')
      setWhSeq('0')
      setFilteredWarehouseData(dataWarehouse)
    } else {
      const filteredWarehouseData = dataWarehouse.filter(
        (item) => item.WHName.toLowerCase().includes(value.toLowerCase()),
        //item.WHSeq.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredWarehouseData(filteredWarehouseData)
    }
    setDropdownWarehouseVisible(true)
  }

  const handleUserNameSearch = (e) => {
    const value = e.target.value
    setUserNameSearchSh(value)
    if (value.trim() === '' || value === null) {
      setUserNameSearch('')
      setUserName('')
      setUserSeq('0')
      setFilteredUserNameData(dataUserName)
    } else {
      const filtered = dataUserName.filter(
        (item) =>
          item.UserId.toLowerCase().includes(value.toLowerCase()) ||
          item.UserName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredUserNameData(filtered)
    }
    setDropdownUserNameVisible(true)
  }

  const handleWarehouseCellClick = ([col, row]) => {
    const data =
      warehouseSearchSh.trim() === '' ? dataWarehouse : filteredWarehouseData
    if (data[row]) {
      const selectedWarehouse = data[row].WHName
      setWhName(data[row].WHName)
      setWhSeq(data[row].WHSeq)
      setWarehouseSearch(selectedWarehouse)
      setWarehouseSearchSh(selectedWarehouse)
      setDropdownWarehouseVisible(false)
    }
  }

  const handleUserNameCellClick = ([col, row]) => {
    const data =
      userNameSearchSh.trim() === '' ? dataUserName : filteredUserNameData
    if (data[row]) {
      const selectedUserName = data[row].UserName
      setUserName(data[row].UserName)
      setUserSeq(data[row].EmpSeq)
      setDeptName(data[row].DeptName)
      setDeptSeq(data[row].DeptSeq)
      setUserNameSearch(selectedUserName)
      setUserNameSearchSh(selectedUserName)
      setDeptNameSearch(data[row].DeptName)
      setDeptNameSearchSh(data[row].DeptName)
      setDropdownUserNameVisible(false)
    }
  }
  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const filterOption = (input, option) => {
    const label = option.label.toString().toLowerCase()
    const value = option.value.toString().toLowerCase()
    return (
      label.includes(input.toLowerCase()) || value.includes(input.toLowerCase())
    )
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownUserNameVisible(false)
      setDropdownWarehouseVisible(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getWarehouseData = useCallback(
    ([col, row]) => {
      const person = filteredWarehouseData[row] || {}
      const column = colsWarehouse[col]
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
    [filteredWarehouseData, colsWarehouse],
  )
  const getUserNameData = useCallback(
    ([col, row]) => {
      const person = filteredUserNameData[row] || {}
      const column = colsUserName[col]
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
    [filteredUserNameData, colsUserName],
  )

  const onColumnWarehouseResize = useCallback(
    (column, newSize) => {
      const index = colsWarehouse.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsWarehouse]
        newCols.splice(index, 1, newCol)
        setColsWarehouse(newCols)
      }
    },
    [colsWarehouse],
  )

  const onColumnUserNameResize = useCallback(
    (column, newSize) => {
      const index = colsUserName.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsUserName]
        newCols.splice(index, 1, newCol)
        setColsUserName(newCols)
      }
    },
    [colsUserName],
  )
  const handleFromDate = (date) => {
    setFromDate(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
  const handleChangeBizUnit = (value) => {
    setBizUnit(value)
  }
  const handleChangeTypeName = (value) => {
    setTypeName(value)
  }

  return (
    <div className="flex items-center gap-2">
      <Form
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
      >
        <Row className="gap-4 flex items-center mb-4 ">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('28782')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                //className="w-full text-sm p-2"
                value={fromDate}
                onChange={handleFromDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('100001449')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              className="mb-2"
            >
              <DatePicker
                //className="w-full text-sm p-2"
                value={toDate}
                onChange={handletoDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 190,
                }}
                allowClear
                showSearch
                placeholder="Chọn bộ phân kinh doanh"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={bizUnit === '0' ? undefined : bizUnit}
                onChange={handleChangeBizUnit}
                options={dataBizUnit?.map((item) => ({
                  label: item?.BizUnitName,
                  value: item?.BizUnit,
                }))}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">Kho</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <div className="relative">
                <Input
                  placeholder=""
                  size="middle"
                  value={warehouseSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownWarehouseVisible(true)}
                  style={{ backgroundColor: '#e8f0ff', width: 190 }}
                />
                {dropdownWarehouseVisible && (
                  <div
                    ref={dropdownRef}
                    className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                  >
                    <div className="flex items-center justify-between p-1">
                      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                        <TableOutlined />
                        Kho
                      </h2>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setDropdownWarehouseVisible(false)}
                      />
                    </div>
                    <div className="p-2 border-b border-t">
                      <div className="w-full flex gap-2">
                        <SearchOutlined className="opacity-80 size-5" />
                        <input
                          value={warehouseSearchSh}
                          onChange={(e) => handleWarehouseSearch(e)}
                          onFocus={() => setDropdownWarehouseVisible(true)}
                          onKeyDown={(e) => {
                            if (
                              e.key === 'Enter' &&
                              filteredWarehouseData.length > 0
                            ) {
                              setWhName(filteredWarehouseData[0].WHName)
                              setWhSeq(filteredWarehouseData[0].WHSeq)
                              setWarehouseSearch(
                                filteredWarehouseData[0].WHName,
                              )
                              setWarehouseSearchSh(
                                filteredWarehouseData[0].WHName,
                              )
                              setDropdownWarehouseVisible(false)
                            }
                            if (e.key === 'Escape') {
                              setDropdownWarehouseVisible(false)
                            }
                          }}
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
                      onFill={onWarehouseFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredWarehouseData.length}
                      columns={colsWarehouse}
                      gridSelection={selectionWarehouse}
                      onGridSelectionChange={setSelectionWarehouse}
                      getCellsForSelection={true}
                      getCellContent={getWarehouseData}
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
                      onCellClicked={handleWarehouseCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnWarehouseResize}
                      rowMarkers={('checkbox-visible', 'both')}
                      rowSelect="single"
                    />
                  </div>
                )}
              </div>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">
                  {t('Số kiểm tra')}
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={stkMngNo}
                onChange={(e) => setStkMngNo(e.target.value)}
                size="middle"
                style={{
                  width: 190,
                }}
                //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">
                  {t('Phân loại kiểm kê')}
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 190,
                }}
                allowClear
                showSearch
                placeholder="Chọn phân loại kiểm kê"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={typeName === '0' ? undefined : typeName}
                onChange={handleChangeTypeName}
                options={[
                  { value: '10', label: 'Kiểm kê theo số lượng tổng' },
                  { value: '11', label: 'Kiểm kê bao gồm lô hàng' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('994')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <div className="relative">
                <Input
                  placeholder=""
                  size="middle"
                  value={userNameSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownUserNameVisible(true)}
                  style={{ backgroundColor: '#e8f0ff', width: 190 }}
                />
                {dropdownUserNameVisible && (
                  <div
                    ref={dropdownRef}
                    className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                  >
                    <div className="flex items-center justify-between p-1">
                      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                        <TableOutlined />
                        {t('994')}
                      </h2>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setDropdownUserNameVisible(false)}
                      />
                    </div>
                    <div className="p-2 border-b border-t">
                      <div className="w-full flex gap-2">
                        <SearchOutlined className="opacity-80 size-5" />
                        <input
                          value={userNameSearchSh}
                          onChange={handleUserNameSearch}
                          onFocus={() => setDropdownUserNameVisible(true)}
                          onKeyDown={(e) => {
                            if (
                              e.key === 'Enter' &&
                              filteredUserNameData.length > 0
                            ) {
                              setUserName(filteredUserNameData[0].UserName)
                              setUserSeq(filteredUserNameData[0].EmpSeq)
                              setUserNameSearch(
                                filteredUserNameData[0].UserName,
                              )
                              setUserNameSearchSh(
                                filteredUserNameData[0].UserName,
                              )

                              setDropdownUserNameVisible(false)
                            }
                            if (e.key === 'Escape') {
                              setDropdownUserNameVisible(false)
                            }
                          }}
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
                      onFill={onUserNameFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredUserNameData.length}
                      columns={colsUserName}
                      gridSelection={selectionUserName}
                      onGridSelectionChange={setSelectionUserName}
                      getCellsForSelection={true}
                      getCellContent={getUserNameData}
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
                      onCellClicked={handleUserNameCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnUserNameResize}
                      rowMarkers={('checkbox-visible', 'both')}
                      rowSelect="single"
                    />
                  </div>
                )}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
