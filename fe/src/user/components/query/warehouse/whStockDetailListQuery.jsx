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

export default function WhStockDetailListQuery({
  formData,
  setFormData,
  setToDate,
  toDate,
  dataFactUnit,
  factUnit,
  setFactUnit,
  factUnitName,
  setFactUnitName,
  dataBizUnit,
  bizUnit,
  setBizUnit,
  bizUnitName,
  setBizUnitName,
  handleSearchWH,
  handleSearchItemName,
  whInOutName,
  setWHInOutName,
  whName,
  setWhName,
  setWhSeq,
  itemName,
  setItemName,
  setItemSeq,
  itemNo,
  setItemNo,
  itemSpec,
  setItemSpec,
  lotNo,
  setLotNo,
  setDataWarehouse,
  dataWarehouse,
  setDataItemName,
  dataItemName,
  resetTable,
  resetTable2,
}) {
  const gridRef = useRef(null)
  const [warehouseSearch, setWarehouseSearch] = useState('')
  const [warehouseSearchSh, setWarehouseSearchSh] = useState('')
  const [itemNameSearch, setItemNameSearch] = useState('')
  const [itemNameSearchSh, setItemNameSearchSh] = useState('')
  const [filteredWarehouseData, setFilteredWarehouseData] = useState([])
  const [filteredItemNameData, setFilteredItemNameData] = useState([])
  const [hoverRow, setHoverRow] = useState(null)
  const [dropdownWarehouseVisible, setDropdownWarehouseVisible] =
    useState(false)
  const [dropdownItemNameVisible, setDropdownItemNameVisible] = useState(false)
  const dropdownRef = useRef(null)
  const [selectionWarehouse, setSelectionWarehouse] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionItemName, setSelectionItemName] = useState({
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
  ]
  const [colsItemName, setColsItemName] = useState(defaultItemNameCols)
  const onItemNameFill = useOnFill(filteredItemNameData, colsItemName)

  useEffect(() => {
    setFilteredWarehouseData(dataWarehouse)
    setFilteredItemNameData(dataItemName)
  }, [dataWarehouse, dataItemName])

  useEffect(() => {
    if (whName) {
      setWarehouseSearch(whName)
      setWarehouseSearchSh(whName)
    }
    if (itemName) {
      setItemNameSearch(itemName)
      setItemNameSearchSh(itemName)
    }
  }, [whName, itemName])

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

  const handleItemNameSearch = (e) => {
    const value = e.target.value
    setItemNameSearchSh(value)
    if (value.trim() === '' || value === null) {
      setItemNameSearch('')
      setItemSeq('0')
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

  const getItemNameData = useCallback(
    ([col, row]) => {
      const person = filteredItemNameData[row] || {}
      const column = colsItemName[col]
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
    [filteredItemNameData, colsItemName],
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
        setColsItemMClass(newCols)
      }
    },
    [colsItemName],
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
  const handleChangeInOutType = (value) => {
    setWHInOutName(value)
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
              required
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
              required
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
              required
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
                  style={{ backgroundColor: '#e8f0ff' }}
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
                          onChange={handleWarehouseSearch}
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
              label={<span className="uppercase text-[10px]">{t('2271')}</span>}
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
                value={whInOutName === '0' ? undefined : whInOutName}
                onChange={handleChangeInOutType}
                options={[
                  { value: 1, label: 'Nhập Kho' },
                  { value: 2, label: 'Xuất Kho' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Tên sản phẩm</span>}
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
