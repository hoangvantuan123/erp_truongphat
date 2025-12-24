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

export default function WhAgingLotStockListQuery({
  formData,
  setFormData,
  setToDate,
  toDate,
  dataFactUnit,
  factUnit,
  setFactUnit,
  dataBizUnit,
  bizUnit,
  setBizUnit,
  handleSearchWH,
  handleSearchItemClass,
  datawhKindName,
  whKindName,
  setWHKindName,
  dataitemTypeName,
  itemTypeName,
  setItemTypeName,
  whName,
  setWhName,
  setWhSeq,
  itemMClassName,
  setItemMClassName,
  setItemMClassSeq,
  itemName,
  setItemName,
  itemNo,
  setItemNo,
  lotNo,
  setLotNo,
  setDataWarehouse,
  dataWarehouse,
  setDataItemMClass,
  dataItemMClass,
  setItemSpec,
  resetTable,
  resetTable2,
}) {
  const gridRef = useRef(null)
  const [warehouseSearch, setWarehouseSearch] = useState('')
  const [warehouseSearchSh, setWarehouseSearchSh] = useState('')
  const [itemMClassSearch, setItemMClassSearch] = useState('')
  const [itemMClassSearchSh, setItemMClassSearchSh] = useState('')
  const [filteredWarehouseData, setFilteredWarehouseData] = useState([])
  const [filteredItemMClassData, setFilteredItemMClassData] = useState([])
  const [hoverRow, setHoverRow] = useState(null)
  const [dropdownWarehouseVisible, setDropdownWarehouseVisible] =
    useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)
  const [selectionWarehouse, setSelectionWarehouse] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionItemMClass, setSelectionItemMClass] = useState({
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

  const defaultItemMClassCols = [
    {
      title: t('Mã Phân loại trung bình'),
      id: 'UMItemClass',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Phân loại trung bình'),
      id: 'ItemClassMName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: t('Phân loại lớn'),
      id: 'ItemClassLName',
      kind: 'Text',
      readonly: true,
      width: 100,
    },
  ]
  const [colsItemMClass, setColsItemMClass] = useState(defaultItemMClassCols)
  const onItemMClassFill = useOnFill(filteredItemMClassData, colsItemMClass)

  useEffect(() => {
    setFilteredWarehouseData(dataWarehouse)
    setFilteredItemMClassData(dataItemMClass)
  }, [dataWarehouse, dataItemMClass])

  const handleWarehouseSearch = (e) => {
    const value = e.target.value
    setWarehouseSearchSh(value)
    if (value.trim() === '' || value === null) {
      setWarehouseSearch('')
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

  const handleItemMClassSearch = (e) => {
    const value = e.target.value
    setItemMClassSearchSh(value)
    if (value.trim() === '' || value === null) {
      setItemMClassSearch('')
      setItemMClassSeq('0')
      setFilteredItemMClassData(dataItemMClass)
    } else {
      const filtered = dataItemMClass.filter(
        (item) =>
          item.ItemClassMName.toLowerCase().includes(value.toLowerCase()),
        //item.WHSeq.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredItemMClassData(filtered)
    }
    setDropdownVisible(true)
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

  const handleItemMClassCellClick = ([col, row]) => {
    const data =
      itemMClassSearchSh.trim() === '' ? dataItemMClass : filteredItemMClassData
    if (data[row]) {
      const selectedItemMClass = data[row].ItemClassMName
      setItemMClassName(data[row].ItemClassMName)
      setItemMClassSeq(data[row].UMItemClass)
      setItemMClassSearch(selectedItemMClass)
      setItemMClassSearchSh(selectedItemMClass)
      setDropdownVisible(false)
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
      setDropdownVisible(false)
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

  const getItemMClassData = useCallback(
    ([col, row]) => {
      const person = filteredItemMClassData[row] || {}
      const column = colsItemMClass[col]
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
    [filteredItemMClassData, colsItemMClass],
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

  const onColumnItemMClassResize = useCallback(
    (column, newSize) => {
      const index = colsItemMClass.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsItemMClass]
        newCols.splice(index, 1, newCol)
        setColsItemMClass(newCols)
      }
    },
    [colsItemMClass],
  )

  const handleFormDate = (date) => {
    setFormData(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
  const handleChangeFactUnit = (value) => {
    setFactUnit(value)
  }
  const handleChangeBizUnit = (value) => {
    setBizUnit(value)
  }
  const handleChangeWHKind = (value) => {
    setWHKindName(value)
  }
  const handleChangeItemType = (value) => {
    setItemTypeName(value)
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
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                //className="w-full text-sm p-2"
                value={formData}
                onChange={handleFormDate}
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
              label={<span className="uppercase text-[10px]">{t('3')}</span>}
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
                placeholder="Chọn nơi sản xuất"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={factUnit === '0' ? undefined : factUnit}
                onChange={handleChangeFactUnit}
                options={dataFactUnit?.map((item) => ({
                  label: item?.FactUnitName,
                  value: item?.FactUnit,
                }))}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('784')}</span>}
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
                placeholder="Chọn Phân loại kho"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={whKindName === '0' ? undefined : whKindName}
                onChange={handleChangeWHKind}
                options={datawhKindName?.map((item) => ({
                  label: item?.MinorName,
                  value: item?.Value,
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
                <span className="uppercase text-[9px]">
                  Phân loại trung bình
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
                  value={itemMClassSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownVisible(true)}
                  style={{ backgroundColor: '#e8f0ff' }}
                />
                {dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                  >
                    <div className="flex items-center justify-between p-1">
                      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                        <TableOutlined />
                        Phân loại trung bình
                      </h2>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setDropdownVisible(false)}
                      />
                    </div>
                    <div className="p-2 border-b border-t">
                      <div className="w-full flex gap-2">
                        <SearchOutlined className="opacity-80 size-5" />
                        <input
                          value={itemMClassSearchSh}
                          onChange={handleItemMClassSearch}
                          onFocus={() => setDropdownVisible(true)}
                          onKeyDown={(e) => {
                            if (
                              e.key === 'Enter' &&
                              filteredItemMClassData.length > 0
                            ) {
                              setItemMClassName(
                                filteredItemMClassData[0].ItemClassMName,
                              )
                              setItemMClassSeq(
                                filteredItemMClassData[0].UMItemClass,
                              )
                              setItemMClassSearch(
                                filteredItemMClassData[0].ItemClassMName,
                              )
                              setItemMClassSearchSh(
                                filteredItemMClassData[0].ItemClassMName,
                              )
                              setDropdownVisible(false)
                            }
                            if (e.key === 'Escape') {
                              setDropdownVisible(false)
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
                      onFill={onItemMClassFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredItemMClassData.length}
                      columns={colsItemMClass}
                      gridSelection={selectionItemMClass}
                      onGridSelectionChange={setSelectionItemMClass}
                      getCellsForSelection={true}
                      getCellContent={getItemMClassData}
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
                      onCellClicked={handleItemMClassCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnItemMClassResize}
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
              label={<span className="uppercase text-[10px]">{t('2090')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                size="middle"
                style={{
                  width: 315,
                }}
                //className=" text-sm p-2"
              />
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
                onChange={(e) => setItemNo(e.target.value)}
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
                <span className="uppercase text-[10px]">{t('25431')}</span>
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
                  width: 190,
                }}
                //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3259')}</span>}
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
                placeholder="Chọn phân loại danh mục hàng"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={itemTypeName === '0' ? undefined : itemTypeName}
                onChange={handleChangeItemType}
                options={dataitemTypeName?.map((item) => ({
                  label: item?.MinorName,
                  value: item?.Value,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
