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
import DropdownUser from '../../sheet/query/dropdownUsers'
import DropdownDept from '../../sheet/query/dropdownDept'
const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'


export default function PdmmOutQueryDetailListQuery({
  fromDate,
  setFromDate,
  setToDate,
  toDate,

  bizUnit,
  dataBizUnit,
  setBizUnit,

  typeName,
  dataTypeName,
  setTypeName,

  stockType,
  dataStockType,
  setStockType,

  status,
  dataStatus,
  setStatus,

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

  itemName,
  setItemName,
  itemNo,
  setItemNo,
  setDataDeptName,
  setDataSearch, setDataSearch2,
  setDataSheetSearch,
  setDataSheetSearch2,
  setItemText, setItemText2,

  searchText, searchText2,
  setSearchText, setSearchText2,
  setDataUserName,
  controllers
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
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)
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
    if (userName) {
      setUserNameSearch(userName)
      setUserNameSearchSh(userName)
    }
  }, [userName])

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

 



  const handleFromDate = (date) => {
    setFromDate(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
  const handleChangeBizUnit = (value) => {
    setBizUnit(value)
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
              label={<span className="uppercase text-[10px]">{t('783')}</span>}
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
              label={<span className="uppercase text-[10px]">{t('647')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
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
                  width: 150,
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
                  width: 150,
                }}
              //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>



          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('748')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText}
                onFocus={() => setDropdownVisible(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible && (
                <DropdownDept
                  helpData={dataDeptName}
                  setSearchText={setSearchText}
                  setItemText={setItemText}
                  setDataSearch={setDataSearch}
                  setDataSheetSearch={setDataSheetSearch}
                  setDropdownVisible={setDropdownVisible}
                  dropdownVisible={dropdownVisible}
                  searchText={searchText}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1794')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText2}
                onFocus={() => setDropdownVisible2(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible2 && (
                <DropdownUser
                  helpData={dataUserName}
                  setHelpData05={setDataUserName}
                  setSearchText={setSearchText2}
                  setSearchText1={setSearchText}
                  setItemText={setItemText2}
                  setItemText1={setItemText}
                  setDataSearch={setDataSearch2}
                  setDataSearchDept={setDataSearch}
                  setDataSheetSearch={setDataSheetSearch2}
                  setDropdownVisible={setDropdownVisible2}
                  dropdownVisible={dropdownVisible2}
                  searchText={searchText2}
                  controllers={controllers}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </div>
  )
}
