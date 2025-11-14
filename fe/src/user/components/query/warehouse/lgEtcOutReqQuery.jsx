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
const { TextArea } = Input
const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

export default function LGEtcOutReqQuery({
  fromDate,
  setFromDate,
  expDate,
  setExpDate,

  bizUnit,
  dataBizUnit,
  setBizUnit,
  setBizUnitName,
  typeName,
  dataTypeName,
  setTypeName,

  whName,
  setWhName,
  setWhSeq,
  dataWarehouse,

  custName,
  setCustName,
  setCustSeq,
  dataCustName,

  userName,
  setUserName,
  setUserSeq,
  dataUserName,

  deptName,
  setDeptName,
  setDeptSeq,
  dataDeptName,

  etcReqNo,
  setEtcReqNo,
  remark,
  setRemark,
  isReset,
  setIsReset,
}) {
  const gridRef = useRef(null)
  const [warehouseSearch, setWarehouseSearch] = useState('')
  const [warehouseSearchSh, setWarehouseSearchSh] = useState('')
  const [userNameSearch, setUserNameSearch] = useState('')
  const [userNameSearchSh, setUserNameSearchSh] = useState('')

  const [custNameSearch, setCustNameSearch] = useState('')
  const [custNameSearchSh, setCustNameSearchSh] = useState('')

  const [deptNameSearch, setDeptNameSearch] = useState('')
  const [deptNameSearchSh, setDeptNameSearchSh] = useState('')

  const [filteredWarehouseData, setFilteredWarehouseData] = useState([])
  const [filteredDeptNameData, setFilteredDeptNameData] = useState([])
  const [filteredUserNameData, setFilteredUserNameData] = useState([])
  const [filteredCustNameData, setFilteredCustNameData] = useState([])

  const [hoverRow, setHoverRow] = useState(null)

  const [dropdownWarehouseVisible, setDropdownWarehouseVisible] =
    useState(false)

  const [dropdownDeptNameVisible, setDropdownDeptNameVisible] = useState(false)
  const [dropdownUserNameVisible, setDropdownUserNameVisible] = useState(false)
  const [dropdownCustNameVisible, setDropdownCustNameVisible] = useState(false)

  const dropdownRef = useRef(null)

  const [selectionWarehouse, setSelectionWarehouse] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionDeptName, setSelectionDeptName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionUserName, setSelectionUserName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionCustName, setSelectionCustName] = useState({
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

  const defaultDeptNameCols = [
    {
      title: t('Mã bộ phận (Seq)'),
      id: 'BeDeptSeq',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Tên bộ phận'),
      id: 'BeDeptName',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
    {
      title: t('Ghi chú'),
      id: 'DeptRemark',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
  ]
  const [colsDeptName, setColsDeptName] = useState(defaultDeptNameCols)
  const onDeptNameFill = useOnFill(filteredDeptNameData, colsDeptName)

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

  const defaultCustNameCols = [
    {
      title: t('Mã Seq'),
      id: 'CustSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
    {
      title: t('Mã KH/NCC'),
      id: 'CustNo',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Tên KH/NCC'),
      id: 'CustName',
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
      title: t('Địa chỉ'),
      id: 'Address',
      kind: 'Text',
      readonly: true,
      width: 300,
    },
  ]
  const [colsCustName, setColsCustName] = useState(defaultCustNameCols)
  const onCustNameFill = useOnFill(filteredCustNameData, colsCustName)

  useEffect(() => {
    setFilteredWarehouseData(dataWarehouse)
    setFilteredDeptNameData(dataDeptName)
    setFilteredUserNameData(dataUserName)
    setFilteredCustNameData(dataCustName)
  }, [dataWarehouse, dataDeptName, dataUserName, dataCustName])

  useEffect(() => {
    if (isReset) {
      setUserNameSearch('')
      setUserNameSearchSh('')
      setWarehouseSearch('')
      setWarehouseSearchSh('')
      setBizUnit('0')
      setTypeName('0')
      setDeptNameSearch('')
      setDeptNameSearchSh('')
      setCustNameSearch('')
      setCustNameSearchSh('')
      setIsReset(false)
    }
  }, [isReset])

  useEffect(() => {
    if (userName) {
      setUserNameSearch(userName)
      setUserNameSearchSh(userName)
    }
    if (deptName) {
      setDeptNameSearch(deptName)
      setDeptNameSearchSh(deptName)
    }
    if (whName) {
      setWarehouseSearch(whName)
      setWarehouseSearchSh(whName)
    }
    if (custName) {
      setCustNameSearch(custName)
      setCustNameSearchSh(custName)
    }
  }, [userName, deptName, whName, custName])

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

  const handleDeptNameSearch = (e) => {
    const value = e.target.value
    setDeptNameSearchSh(value)
    if (value.trim() === '' || value === null) {
      setDeptNameSearch('')
      setDeptName('')
      setDeptSeq('0')
      setFilteredDeptNameData(dataDeptName)
    } else {
      const filtered = dataDeptName.filter((item) =>
        item.BeDeptName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredDeptNameData(filtered)
    }
    setDropdownDeptNameVisible(true)
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

  const handleCustNameSearch = (e) => {
    const value = e.target.value
    setCustNameSearchSh(value)
    if (value.trim() === '' || value === null) {
      setCustNameSearch('')
      setCustName('')
      setCustSeq('0')
      setFilteredCustNameData(dataCustName)
    } else {
      const filtered = dataCustName.filter(
        (item) =>
          item.CustNo.toLowerCase().includes(value.toLowerCase()) ||
          item.CustName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredCustNameData(filtered)
    }
    setDropdownCustNameVisible(true)
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

  const handleDeptNameCellClick = ([col, row]) => {
    const data =
      deptNameSearchSh.trim() === '' ? dataDeptName : filteredDeptNameData
    if (data[row]) {
      const selectedDeptName = data[row].BeDeptName
      setDeptName(data[row].BeDeptName)
      setDeptSeq(data[row].BeDeptSeq)
      setDeptNameSearch(selectedDeptName)
      setDeptNameSearchSh(selectedDeptName)
      setDropdownDeptNameVisible(false)
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

  const handleCustNameCellClick = ([col, row]) => {
    const data =
      custNameSearchSh.trim() === '' ? dataCustName : filteredCustNameData
    if (data[row]) {
      const selectedCustName = data[row].CustName
      setCustName(data[row].CustName)
      setCustSeq(data[row].CustSeq)
      setCustNameSearch(selectedCustName)
      setCustNameSearchSh(selectedCustName)
      setDropdownCustNameVisible(false)
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
      setDropdownDeptNameVisible(false)
      setDropdownUserNameVisible(false)
      setDropdownCustNameVisible(false)
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

  const getDeptNameData = useCallback(
    ([col, row]) => {
      const person = filteredDeptNameData[row] || {}
      const column = colsDeptName[col]
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
    [filteredDeptNameData, colsDeptName],
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

  const getCustNameData = useCallback(
    ([col, row]) => {
      const person = filteredCustNameData[row] || {}
      const column = colsCustName[col]
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
    [filteredCustNameData, colsCustName],
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

  const onColumnDeptNameResize = useCallback(
    (column, newSize) => {
      const index = colsDeptName.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsDeptName]
        newCols.splice(index, 1, newCol)
        setColsDeptMClass(newCols)
      }
    },
    [colsDeptName],
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

  const onColumnCustNameResize = useCallback(
    (column, newSize) => {
      const index = colsCustName.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsCustName]
        newCols.splice(index, 1, newCol)
        setColsCustName(newCols)
      }
    },
    [colsCustName],
  )

  const handleFromDate = (date) => {
    setFromDate(date)
  }
  const handleExpDate = (date) => {
    setExpDate(date)
  }
  const handleChangeBizUnit = (value, option) => {
    setBizUnit(value)
    setBizUnitName(option.label)
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
              label={<span className="uppercase text-[10px]">{t('200')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <DatePicker
                //className="w-full text-sm p-2"
                size="middle"
                style={{
                  width: 190,
                }}
                value={fromDate}
                onChange={handleFromDate}
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
              required
            >
              <Select
                //defaultValue=""
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
              label={
                <span className="uppercase text-[10px]">
                  {t('Phân loại sản phẩm')}
                </span>
              }
              required
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
                placeholder="Chọn phân loại sản phẩm"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={typeName === '0' ? undefined : typeName}
                onChange={handleChangeTypeName}
                options={[
                  { value: 30, label: 'Hàng hóa thành phẩm' },
                  { value: 31, label: 'Nguyên vật liệu' },
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
                  style={{ backgroundColor: '#e8f0ff', width: 180 }}
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

                              setDeptName(filteredUserNameData[0].DeptName)
                              setDeptSeq(filteredUserNameData[0].DeptSeq)
                              setDeptNameSearch(
                                filteredUserNameData[0].DeptName,
                              )
                              setDeptNameSearchSh(
                                filteredUserNameData[0].DeptName,
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

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">Bộ phận yêu cầu</span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <div className="relative">
                <Input
                  placeholder=""
                  size="middle"
                  value={deptNameSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownDeptNameVisible(true)}
                  style={{ backgroundColor: '#e8f0ff', width: 190 }}
                />
                {dropdownDeptNameVisible && (
                  <div
                    ref={dropdownRef}
                    className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                  >
                    <div className="flex items-center justify-between p-1">
                      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                        <TableOutlined />
                        Bộ phận yêu cầu
                      </h2>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setDropdownDeptNameVisible(false)}
                      />
                    </div>
                    <div className="p-2 border-b border-t">
                      <div className="w-full flex gap-2">
                        <SearchOutlined className="opacity-80 size-5" />
                        <input
                          value={deptNameSearchSh}
                          onChange={handleDeptNameSearch}
                          onFocus={() => setDropdownDeptNameVisible(true)}
                          onKeyDown={(e) => {
                            if (
                              e.key === 'Enter' &&
                              filteredDeptNameData.length > 0
                            ) {
                              setDeptName(filteredDeptNameData[0].BeDeptName)
                              setDeptSeq(filteredDeptNameData[0].BeDeptSeq)
                              setDeptNameSearch(
                                filteredDeptNameData[0].BeDeptName,
                              )
                              setDeptNameSearchSh(
                                filteredDeptNameData[0].BeDeptName,
                              )
                              setDropdownDeptNameVisible(false)
                            }
                            if (e.key === 'Escape') {
                              setDropdownDeptNameVisible(false)
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
                      onFill={onDeptNameFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredDeptNameData.length}
                      columns={colsDeptName}
                      gridSelection={selectionDeptName}
                      onGridSelectionChange={setSelectionDeptName}
                      getCellsForSelection={true}
                      getCellContent={getDeptNameData}
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
                      onCellClicked={handleDeptNameCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnDeptNameResize}
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
              label={<span className="uppercase text-[10px]">{t('647')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={etcReqNo}
                onChange={(e) => setEtcReqNo(e.target.value)}
                size="middle"
                style={{
                  width: 190,
                }}
                //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Kho</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <div className="relative">
                <Input
                  placeholder=""
                  size="middle"
                  value={warehouseSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownWarehouseVisible(true)}
                  style={{ width: 190, backgroundColor: '#e8f0ff' }}
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
                  Khách hàng/Nhà cung cấp
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <div className="relative">
                <Input
                  placeholder=""
                  size="middle"
                  value={custNameSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownCustNameVisible(true)}
                  style={{ backgroundColor: '#e8f0ff', width: 400 }}
                />
                {dropdownCustNameVisible && (
                  <div
                    ref={dropdownRef}
                    className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                  >
                    <div className="flex items-center justify-between p-1">
                      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                        <TableOutlined />
                        Khách hàng/Nhà cung cấp
                      </h2>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setDropdownCustNameVisible(false)}
                      />
                    </div>
                    <div className="p-2 border-b border-t">
                      <div className="w-full flex gap-2">
                        <SearchOutlined className="opacity-80 size-5" />
                        <input
                          value={custNameSearchSh}
                          onChange={handleCustNameSearch}
                          onFocus={() => setDropdownCustNameVisible(true)}
                          onKeyDown={(e) => {
                            if (
                              e.key === 'Enter' &&
                              filteredCustNameData.length > 0
                            ) {
                              setCustName(filteredCustNameData[0].CustName)
                              setCustSeq(filteredCustNameData[0].CustSeq)
                              setCustNameSearch(
                                filteredCustNameData[0].CustName,
                              )
                              setCustNameSearchSh(
                                filteredCustNameData[0].CustName,
                              )
                              setDropdownCustNameVisible(false)
                            }
                            if (e.key === 'Escape') {
                              setDropdownCustNameVisible(false)
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
                      onFill={onCustNameFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredCustNameData.length}
                      columns={colsCustName}
                      gridSelection={selectionCustName}
                      onGridSelectionChange={setSelectionCustName}
                      getCellsForSelection={true}
                      getCellContent={getCustNameData}
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
                      onCellClicked={handleCustNameCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnCustNameResize}
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
                <span className="uppercase text-[10px]">{t('Ghi chú')}</span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <TextArea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                size="middle"
                autoSize={{
                  minRows: 1,
                  maxRows: 2,
                }}
                style={{
                  width: 390,
                }}
                //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('644')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <DatePicker
                //className="w-full text-sm p-2"
                size="middle"
                style={{
                  width: 190,
                }}
                value={expDate}
                onChange={handleExpDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
