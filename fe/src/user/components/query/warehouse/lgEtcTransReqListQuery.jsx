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

export default function LGEtcTransReqListQuery({
  fromDate,
  setFromDate,
  setToDate,
  toDate,

  bizUnit,
  dataBizUnit,
  setBizUnit,

  bizUnitTrans,
  dataBizUnitTrans,
  setBizUnitTrans,

  typeName,
  dataTypeName,
  setTypeName,

  status,
  dataStatus,
  setStatus,

  whNameIn,
  setWHNameIn,
  setWHSeqIn,
  dataWarehouseIn,

  whNameOut,
  setWHNameOut,
  setWHSeqOut,
  dataWarehouseOut,

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
}) {
  const gridRef = useRef(null)
  const [warehouseOutSearch, setWarehouseOutSearch] = useState('')
  const [warehouseOutSearchSh, setWarehouseOutSearchSh] = useState('')

  const [warehouseInSearch, setWarehouseInSearch] = useState('')
  const [warehouseInSearchSh, setWarehouseInSearchSh] = useState('')

  const [userNameSearch, setUserNameSearch] = useState('')
  const [userNameSearchSh, setUserNameSearchSh] = useState('')

  const [custNameSearch, setCustNameSearch] = useState('')
  const [custNameSearchSh, setCustNameSearchSh] = useState('')

  const [deptNameSearch, setDeptNameSearch] = useState('')
  const [deptNameSearchSh, setDeptNameSearchSh] = useState('')

  const [filteredWarehouseOutData, setFilteredWarehouseOutData] = useState([])
  const [filteredWarehouseInData, setFilteredWarehouseInData] = useState([])
  const [filteredDeptNameData, setFilteredDeptNameData] = useState([])
  const [filteredUserNameData, setFilteredUserNameData] = useState([])
  const [filteredCustNameData, setFilteredCustNameData] = useState([])

  const [hoverRow, setHoverRow] = useState(null)

  const [dropdownWarehouseOutVisible, setDropdownWarehouseOutVisible] =
    useState(false)
  const [dropdownWarehouseInVisible, setDropdownWarehouseInVisible] =
    useState(false)
  const [dropdownDeptNameVisible, setDropdownDeptNameVisible] = useState(false)
  const [dropdownUserNameVisible, setDropdownUserNameVisible] = useState(false)
  const [dropdownCustNameVisible, setDropdownCustNameVisible] = useState(false)

  const dropdownRef = useRef(null)

  const [selectionWarehouseOut, setSelectionWarehouseOut] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionWarehouseIn, setSelectionWarehouseIn] = useState({
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
  const [colsWarehouseOut, setColsWarehouseOut] = useState(defaultWarehouseCols)
  const onWarehouseOutFill = useOnFill(
    filteredWarehouseOutData,
    colsWarehouseOut,
  )
  const [colsWarehouseIn, setColsWarehouseIn] = useState(defaultWarehouseCols)
  const onWarehouseInFill = useOnFill(filteredWarehouseInData, colsWarehouseIn)

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
    setFilteredWarehouseOutData(dataWarehouseOut)
    setFilteredWarehouseInData(dataWarehouseIn)
    setFilteredDeptNameData(dataDeptName)
    setFilteredUserNameData(dataUserName)
    setFilteredCustNameData(dataCustName)
  }, [dataWarehouseOut, dataDeptName, dataUserName, dataCustName])

  useEffect(() => {
    if (userName) {
      setUserNameSearch(userName)
      setUserNameSearchSh(userName)
    }
    if (deptName) {
      setDeptNameSearch(deptName)
      setDeptNameSearchSh(deptName)
    }
    if (whNameOut) {
      setWarehouseOutSearch(whNameOut)
      setWarehouseOutSearchSh(whNameOut)
    }
    if (whNameIn) {
      setWarehouseInSearch(whNameIn)
      setWarehouseInSearchSh(whNameIn)
    }
    if (custName) {
      setCustNameSearch(custName)
      setCustNameSearchSh(custName)
    }
  }, [userName, deptName, whNameOut, whNameIn, custName])

  const handleWarehouseOutSearch = (e) => {
    const value = e.target.value
    setWarehouseOutSearchSh(value)
    if (value.trim() === '' || value === null) {
      setWarehouseOutSearch('')
      setWHNameOut('')
      setWHSeqOut('0')
      setFilteredWarehouseOutData(dataWarehouseOut)
    } else {
      const filteredWarehouseOutData = dataWarehouseOut.filter(
        (item) => item.WHName.toLowerCase().includes(value.toLowerCase()),
        //item.WHSeq.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredWarehouseOutData(filteredWarehouseOutData)
    }
    setDropdownWarehouseOutVisible(true)
  }

  const handleWarehouseInSearch = (e) => {
    const value = e.target.value
    setWarehouseInSearchSh(value)
    if (value.trim() === '' || value === null) {
      setWarehouseInSearch('')
      setWHNameIn('')
      setWHSeqIn('0')
      setFilteredWarehouseInData(dataWarehouseIn)
    } else {
      const filteredWarehouseInData = dataWarehouseIn.filter(
        (item) => item.WHName.toLowerCase().includes(value.toLowerCase()),
        //item.WHSeq.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredWarehouseInData(filteredWarehouseInData)
    }
    setDropdownWarehouseInVisible(true)
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

  const handleWarehouseOutCellClick = ([col, row]) => {
    console.log(warehouseOutSearchSh)
    const data =
      warehouseOutSearchSh.trim() === ''
        ? dataWarehouseOut
        : filteredWarehouseOutData
    if (data[row]) {
      const selectedWarehouseOut = data[row].WHName
      setWHNameOut(data[row].WHName)
      setWHSeqOut(data[row].WHSeq)
      setWarehouseOutSearch(selectedWarehouseOut)
      setWarehouseOutSearchSh(selectedWarehouseOut)
      setDropdownWarehouseOutVisible(false)
    }
  }

  const handleWarehouseInCellClick = ([col, row]) => {
    const data =
      warehouseInSearchSh.trim() === ''
        ? dataWarehouseIn
        : filteredWarehouseInData
    if (data[row]) {
      const selectedWarehouseIn = data[row].WHName
      setWHNameIn(data[row].WHName)
      setWHSeqIn(data[row].WHSeq)
      setWarehouseInSearch(selectedWarehouseIn)
      setWarehouseInSearchSh(selectedWarehouseIn)
      setDropdownWarehouseInVisible(false)
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
      setDropdownWarehouseOutVisible(false)
      setDropdownWarehouseInVisible(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getWarehouseDataOut = useCallback(
    ([col, row]) => {
      const person = filteredWarehouseOutData[row] || {}
      const column = colsWarehouseOut[col]
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
    [filteredWarehouseOutData, colsWarehouseOut],
  )

  const getWarehouseDataIn = useCallback(
    ([col, row]) => {
      const person = filteredWarehouseInData[row] || {}
      const column = colsWarehouseIn[col]
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
    [filteredWarehouseInData, colsWarehouseIn],
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

  const onColumnWarehouseOutResize = useCallback(
    (column, newSize) => {
      const index = colsWarehouseOut.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsWarehouseOut]
        newCols.splice(index, 1, newCol)
        setColsWarehouseOut(newCols)
      }
    },
    [colsWarehouseOut],
  )

  const onColumnWarehouseInResize = useCallback(
    (column, newSize) => {
      const index = colsWarehouseIn.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...colsWarehouseIn]
        newCols.splice(index, 1, newCol)
        setColsWarehouseIn(newCols)
      }
    },
    [colsWarehouseIn],
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
  const handletoDate = (date) => {
    setToDate(date)
  }
  const handleChangeBizUnit = (value) => {
    setBizUnit(value)
  }
  const handleChangeBizUnitTrans = (value) => {
    setBizUnitTrans(value)
  }
  const handleChangeStatus = (value) => {
    setStatus(value)
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
        <Row className="gap-4 flex items-center mb-4">
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
                value={toDate}
                onChange={handletoDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">
                  {t('Bộ phận kinh doanh (Kho nhập)')}
                </span>
              }
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
                  value={warehouseInSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownWarehouseInVisible(true)}
                  style={{ width: 190, backgroundColor: '#e8f0ff' }}
                />
                {dropdownWarehouseInVisible && (
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
                        onClick={() => setDropdownWarehouseInVisible(false)}
                      />
                    </div>
                    <div className="p-2 border-b border-t">
                      <div className="w-full flex gap-2">
                        <SearchOutlined className="opacity-80 size-5" />
                        <input
                          value={warehouseInSearchSh}
                          onChange={(e) => handleWarehouseInSearch(e)}
                          onFocus={() => setDropdownWarehouseInVisible(true)}
                          onKeyDown={(e) => {
                            if (
                              e.key === 'Enter' &&
                              filteredWarehouseInData.length > 0
                            ) {
                              setWHNameIn(filteredWarehouseInData[0].WHName)
                              setWHSeqIn(filteredWarehouseInData[0].WHSeq)
                              setWarehouseInSearch(
                                filteredWarehouseInData[0].WHName,
                              )
                              setWarehouseInSearchSh(
                                filteredWarehouseInData[0].WHName,
                              )
                              setDropdownWarehouseInVisible(false)
                            }
                            if (e.key === 'Escape') {
                              setDropdownWarehouseInVisible(false)
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
                      onFill={onWarehouseInFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredWarehouseInData.length}
                      columns={colsWarehouseIn}
                      gridSelection={selectionWarehouseIn}
                      onGridSelectionChange={setSelectionWarehouseIn}
                      getCellsForSelection={true}
                      getCellContent={getWarehouseDataIn}
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
                      onCellClicked={handleWarehouseInCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnWarehouseInResize}
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
                  { value: 80, label: 'Hàng hóa thành phẩm' },
                  { value: 82, label: 'Nguyên vật liệu' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('369')}</span>}
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
                placeholder="Chọn trạng thái"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={status === '0' ? undefined : status}
                onChange={handleChangeStatus}
                options={dataStatus?.map((item) => ({
                  label: item?.MinorName,
                  value: item?.MinorSeq,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="gap-4 flex items-center ">
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
                  style={{ backgroundColor: '#e8f0ff', width: 315 }}
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
                <span className="uppercase text-[10px]">
                  {t('Bộ phận kinh doanh (Kho xuất)')}
                </span>
              }
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
                value={bizUnitTrans === '0' ? undefined : bizUnitTrans}
                onChange={handleChangeBizUnitTrans}
                options={dataBizUnitTrans?.map((item) => ({
                  label: item?.BizUnitName,
                  value: item?.BizUnit,
                }))}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Kho xuất kho</span>}
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
                  value={warehouseOutSearch}
                  //onChange={handleSearch}
                  onFocus={() => setDropdownWarehouseOutVisible(true)}
                  style={{ width: 190, backgroundColor: '#e8f0ff' }}
                />
                {dropdownWarehouseOutVisible && (
                  <div
                    ref={dropdownRef}
                    className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                  >
                    <div className="flex items-center justify-between p-1">
                      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                        <TableOutlined />
                        Kho xuất kho
                      </h2>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setDropdownWarehouseOutVisible(false)}
                      />
                    </div>
                    <div className="p-2 border-b border-t">
                      <div className="w-full flex gap-2">
                        <SearchOutlined className="opacity-80 size-5" />
                        <input
                          value={warehouseOutSearchSh}
                          onChange={(e) => handleWarehouseOutSearch(e)}
                          onFocus={() => setDropdownWarehouseOutVisible(true)}
                          onKeyDown={(e) => {
                            if (
                              e.key === 'Enter' &&
                              filteredWarehouseOutData.length > 0
                            ) {
                              setWHNameOut(filteredWarehouseOutData[0].WHName)
                              setWHSeqOut(filteredWarehouseOutData[0].WHSeq)
                              setWarehouseOutSearch(
                                filteredWarehouseOutData[0].WHName,
                              )
                              setWarehouseOutSearchSh(
                                filteredWarehouseOutData[0].WHName,
                              )
                              setDropdownWarehouseOutVisible(false)
                            }
                            if (e.key === 'Escape') {
                              setDropdownWarehouseOutVisible(false)
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
                      onFill={onWarehouseOutFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredWarehouseOutData.length}
                      columns={colsWarehouseOut}
                      gridSelection={selectionWarehouseOut}
                      onGridSelectionChange={setSelectionWarehouseOut}
                      getCellsForSelection={true}
                      getCellContent={getWarehouseDataOut}
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
                      onCellClicked={handleWarehouseOutCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnWarehouseOutResize}
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

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">Bộ phận</span>}
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
                        Bộ phận
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
        </Row>
      </Form>
    </div>
  )
}
