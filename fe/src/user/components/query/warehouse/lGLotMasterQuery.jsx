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

const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

export default function LGLotMasterQuery({
  fromDate,
  setFromDate,
  setToDate,
  toDate,
  itemName,
  setItemName,
  setItemSeq,
  itemNo,
  setItemNo,
  itemSpec,
  setItemSpec,
  lotNo,
  setLotNo,
  userName,
  setUserName,
  setUserSeq,
  custName,
  setCustName,
  setCustSeq,
  dataItemName,
  dataUserName,
  dataCustName,
}) {
  const gridRef = useRef(null)
  const [itemNameSearch, setItemNameSearch] = useState('')
  const [itemNameSearchSh, setItemNameSearchSh] = useState('')
  const [userNameSearch, setUserNameSearch] = useState('')
  const [userNameSearchSh, setUserNameSearchSh] = useState('')
  const [custNameSearch, setCustNameSearch] = useState('')
  const [custNameSearchSh, setCustNameSearchSh] = useState('')

  const [filteredItemNameData, setFilteredItemNameData] = useState([])
  const [filteredUserNameData, setFilteredUserNameData] = useState([])
  const [filteredCustNameData, setFilteredCustNameData] = useState([])

  const [hoverRow, setHoverRow] = useState(null)
  const [dropdownItemNameVisible, setDropdownItemNameVisible] = useState(false)
  const [dropdownUserNameVisible, setDropdownUserNameVisible] = useState(false)
  const [dropdownCustNameVisible, setDropdownCustNameVisible] = useState(false)

  const dropdownRef = useRef(null)

  const [selectionItemName, setSelectionItemName] = useState({
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

  const defaultItemNameCols = [
    {
      title: t('Mã sản phẩm (Seq)'),
      id: 'ItemSeq',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Tên sản phẩm'),
      id: 'ItemName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Mã sản phẩm'),
      id: 'ItemNo',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Quy cách'),
      id: 'Spec',
      kind: 'Text',
      readonly: true,
      width: 300,
    },
    {
      title: t('Đơn vị tính'),
      id: 'UnitName',
      kind: 'Text',
      readonly: true,
      width: 150,
    },
  ]
  const [colsItemName, setColsItemName] = useState(defaultItemNameCols)
  const onItemNameFill = useOnFill(filteredItemNameData, colsItemName)

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
    setFilteredItemNameData(dataItemName)
    setFilteredUserNameData(dataUserName)
    setFilteredCustNameData(dataCustName)
  }, [dataItemName, dataUserName, dataCustName])

  useEffect(() => {
    if (itemName) {
      setItemNameSearch(itemName)
      setItemNameSearchSh(itemName)
    }
    if (userName) {
      setUserNameSearch(userName)
      setUserNameSearchSh(userName)
    }
    if (custName) {
      setCustNameSearch(custName)
      setCustNameSearchSh(custName)
    }
  }, [itemName, userName, custName])

  const handleItemNameSearch = (e) => {
    const value = e.target.value
    setItemNameSearchSh(value)
    if (value.trim() === '' || value === null) {
      setItemNameSearch('')
      setItemSeq('0')
      setItemNo('')
      setItemSpec('')
      setFilteredItemNameData(dataItemName)
    } else {
      const filtered = dataItemName.filter(
        (item) =>
          item.ItemNo.toLowerCase().includes(value.toLowerCase()) ||
          item.ItemName.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredItemNameData(filtered)
    }
    setDropdownItemNameVisible(true)
  }

  const handleUserNameSearch = (e) => {
    const value = e.target.value
    setUserNameSearchSh(value)
    if (value.trim() === '' || value === null) {
      setUserNameSearch('')
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

  const handleItemNameCellClick = ([col, row]) => {
    const data =
      itemNameSearchSh.trim() === '' ? dataItemName : filteredItemNameData
    if (data[row]) {
      const selectedItemName = data[row].ItemName
      setItemName(data[row].ItemName)
      setItemSeq(data[row].ItemSeq)
      setItemNo(data[row].ItemNo)
      setItemSpec(data[row].Spec)
      setItemNameSearch(selectedItemName)
      setItemNameSearchSh(selectedItemName)
      setDropdownItemNameVisible(false)
    }
  }

  const handleUserNameCellClick = ([col, row]) => {
    const data =
      userNameSearchSh.trim() === '' ? dataUserName : filteredUserNameData
    if (data[row]) {
      const selectedUserName = data[row].UserName
      setUserName(data[row].UserName)
      setUserSeq(data[row].UserSeq)
      setUserNameSearch(selectedUserName)
      setUserNameSearchSh(selectedUserName)
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
      setDropdownItemNameVisible(false)
      setDropdownUserNameVisible(false)
      setDropdownCustNameVisible(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getItemNameData = useCallback(
    ([col, row]) => {
      const person = filteredItemNameData[row] || {}
      const column = colsItemName[col]
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
    [filteredItemNameData, colsItemName],
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

  const onColumnItemNameResize = useCallback(
    (column, newSize) => {
      const index = colsItemName.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsItemName]
        newCols.splice(index, 1, newCol)
        setColsItemName(newCols)
      }
    },
    [colsItemName],
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
  const handletoDate = (date) => {
    setToDate(date)
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
                <span className="uppercase text-[10px]">
                  {t('Ngày nhập kho')}
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                //className="w-full text-sm p-2"
                size="middle"
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
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                //className="w-full text-sm p-2"
                size="middle"
                value={toDate}
                onChange={handletoDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">Người đăng ký</span>
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
                        Người đăng ký
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
                              setUserSeq(filteredUserNameData[0].UserSeq)
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
                  style={{ backgroundColor: '#e8f0ff', width: 384 }}
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
        </Row>
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">Tên sản phẩm</span>
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
                  value={itemNameSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownItemNameVisible(true)}
                  style={{ backgroundColor: '#e8f0ff', width: 315 }}
                />
                {dropdownItemNameVisible && (
                  <div
                    ref={dropdownRef}
                    className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                  >
                    <div className="flex items-center justify-between p-1">
                      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                        <TableOutlined />
                        Tên sản phẩm
                      </h2>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setDropdownItemNameVisible(false)}
                      />
                    </div>
                    <div className="p-2 border-b border-t">
                      <div className="w-full flex gap-2">
                        <SearchOutlined className="opacity-80 size-5" />
                        <input
                          value={itemNameSearchSh}
                          onChange={handleItemNameSearch}
                          onFocus={() => setDropdownItemNameVisible(true)}
                          onKeyDown={(e) => {
                            if (
                              e.key === 'Enter' &&
                              filteredItemNameData.length > 0
                            ) {
                              setItemName(filteredItemNameData[0].ItemName)
                              setItemSeq(filteredItemNameData[0].ItemSeq)
                              setItemNo(filteredItemNameData[0].ItemNo)
                              setItemSpec(filteredItemNameData[0].Spec)
                              setItemNameSearch(
                                filteredItemNameData[0].ItemName,
                              )
                              setItemNameSearchSh(
                                filteredItemNameData[0].ItemName,
                              )
                              setDropdownItemNameVisible(false)
                              textCellRenderer.F
                            }
                            if (e.key === 'Escape') {
                              setDropdownItemNameVisible(false)
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
                      onFill={onItemNameFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredItemNameData.length}
                      columns={colsItemName}
                      gridSelection={selectionItemName}
                      onGridSelectionChange={setSelectionItemName}
                      getCellsForSelection={true}
                      getCellContent={getItemNameData}
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
                      onCellClicked={handleItemNameCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnItemNameResize}
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
              label={<span className="uppercase text-[10px]">{t('2091')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={itemNo}
                //onChange={(e) => setItemNo(e.target.value)}
                size="middle"
                style={{
                  width: 190,
                  backgroundColor: '#d3d3d3',
                }}
              //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('551')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={itemSpec}
                //onChange={(e) => setItemSpec(e.target.value)}
                size="middle"
                style={{
                  width: 384,
                  backgroundColor: '#d3d3d3',
                }}
              //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('Lot No')}</span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={lotNo}
                onChange={(e) => setLotNo(e.target.value)}
                size="middle"
                style={{
                  width: 250,
                }}
              //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
