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

export default function ImpDeliveryQuery({
  fromDate,
  setFromDate,
  bizUnitName,
  typeSName,

  whName,
  setWhName,
  setWhSeq,
  dataWarehouse,

  custName,
  userName,
  deptName,
  currName,
  exRate,
  delvNo,
  remark,
  setRemark,
}) {
  const { t } = useTranslation()
  const handleFromDate = (date) => {
    setFromDate(date)
  }
  const gridRef = useRef(null)
  const [warehouseSearch, setWarehouseSearch] = useState('')
  const [warehouseSearchSh, setWarehouseSearchSh] = useState('')
  const [filteredWarehouseData, setFilteredWarehouseData] = useState([])
  const [hoverRow, setHoverRow] = useState(null)

  const [dropdownWarehouseVisible, setDropdownWarehouseVisible] =
    useState(false)
  const dropdownRef = useRef(null)

  const [selectionWarehouse, setSelectionWarehouse] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
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

  useEffect(() => {
    setFilteredWarehouseData(dataWarehouse)
  }, [dataWarehouse])

  useEffect(() => {
    if (whName) {
      setWarehouseSearch(whName)
      setWarehouseSearchSh(whName)
    }
  }, [whName])
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
  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
              <Input
                value={bizUnitName}
                //onChange={(e) => setInOutNo(e.target.value)}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
                  width: 190,
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">
                  Phân loại sản phẩm
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={typeSName}
                //onChange={(e) => setInOutNo(e.target.value)}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
                  width: 190,
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('360')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={userName}
                //onChange={(e) => setInOutNo(e.target.value)}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
                  width: 190,
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('6157')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={deptName}
                //onChange={(e) => setInOutNo(e.target.value)}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
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
                  {t('Số nhập kho (tự động)')}
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={delvNo}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
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
              label={<span className="uppercase text-[9px]">Kho nhập kho</span>}
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
                        Kho nhập kho
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
              <Input
                placeholder=""
                size="middle"
                value={custName}
                //nChange={(e) => setCustName(e.target.value)}
                style={{ backgroundColor: '#C0C0C0', width: 400 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('363')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={currName}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
                  width: 90,
                }}
                //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('364')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={exRate}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
                  width: 90,
                }}
                //className=" text-sm p-2"
              />
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
                  width: 400,
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
