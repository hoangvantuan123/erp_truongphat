import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select } from 'antd'
import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { CompactSelection } from '@glideapps/glide-data-grid'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useTranslation } from 'react-i18next'
export default function WarehousRegistrationQuery({
  setBizUnit,
  dataUnit,
  setDataNaWare,
  dataNaWare,
  setSearchBizUnit,
  setSearchFactUnit,
  setSearchNaWare,
  dataMngDeptName,
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [searchText, setSearchText] = useState('')
  const [deptText, setDeptText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [hoverRow, setHoverRow] = useState(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const defaultCols = [
    {
      title: 'BeDeptName',
      id: 'BeDeptName',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: 'DeptRemark',
      id: 'DeptRemark',
      kind: 'Text',
      readonly: true,
      width: 200,
    },
    {
      title: 'BeBegDate',
      id: 'BeBegDate',
      kind: 'Text',
      readonly: true,
      width: 100,
    },
    {
      title: 'BeEndDate',
      id: 'BeEndDate',
      kind: 'Text',
      readonly: true,
      width: 100,
    },
  ]
  const [cols, setCols] = useState(defaultCols)
  const onFill = useOnFill(filteredData, cols)

  useEffect(() => {
    setFilteredData(dataMngDeptName)
  }, [dataMngDeptName])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchText(value)
    if (value.trim() === '' || value === null) {
      setDeptText('')
      setFilteredData(dataMngDeptName)
    } else {
      const filtered = dataMngDeptName.filter(
        (item) =>
          item.BeDeptName.toLowerCase().includes(value.toLowerCase()) ||
          item.DeptRemark.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filtered)
    }
    setDropdownVisible(true)
  }

  const handleCellClick = ([col, row]) => {
    const data = searchText.trim() === '' ? dataMngDeptName : filteredData
    if (data[row]) {
      const selectedLanguage = data[row].BeDeptName
      setSearchText(selectedLanguage)
      setDeptText(selectedLanguage)
      setDropdownVisible(false)
    }
  }
  const handleChangeBizUnit = (value) => {
    setSearchBizUnit(value)
  }

  const handleChangeFactUnit = (value) => {
    setSearchFactUnit(value)
  }

  const handleChangeNaWare = (value) => {
    setSearchNaWare(value)
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
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getData = useCallback(
    ([col, row]) => {
      const person = filteredData[row] || {}
      const column = cols[col]
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
    [filteredData, cols],
  )
  const onColumnResize = useCallback(
    (column, newSize) => {
      const index = cols.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...cols]
        newCols.splice(index, 1, newCol)
        setCols(newCols)
      }
    },
    [cols],
  )

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">{t('2')}</span>
              }
              className="mb-0"
            >
              <Select
                id="bizUnitSelect"
                defaultValue="All"
                size="middle"
                showSearch
                style={{ width: 190 }}
                onChange={handleChangeBizUnit}
                filterOption={filterOption}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataUnit?.map((item) => ({
                    label: item?.BizUnitName,
                    value: item?.BizUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t(3)}</span>}
              className="mb-0"
            >
              <Select
                id="factUnitSelect"
                defaultValue="All"
                size="middle"
                showSearch
                style={{ width: 190 }}
                onChange={handleChangeFactUnit}
                filterOption={filterOption}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataUnit?.map((item) => ({
                    label: item?.FactUnitName,
                    value: item?.FactUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">
                  {t('777')}
                </span>
              }
              className="mb-0"
            >
              <Select
                id="naWareSelect"
                defaultValue="All"
                size="middle"
                showSearch
                style={{ width: 270 }}
                onChange={handleChangeNaWare}
                filterOption={filterOption}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataNaWare.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          {/*  <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">Bộ phận quản lý</span>
              }
              className="mb-0"
            >
              <div className="relative">
                <Input
                  placeholder=""
                  size="middle"
                  value={deptText}
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
                        Bộ phận quản lý
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
                          value={searchText}
                          onChange={handleSearch}
                          onFocus={() => setDropdownVisible(true)}
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
                      onFill={onFill}
                      className="cursor-pointer rounded-md"
                      rows={filteredData.length}
                      columns={cols}
                      gridSelection={selection}
                      onGridSelectionChange={setSelection}
                      getCellsForSelection={true}
                      getCellContent={getData}
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
                      onCellClicked={handleCellClick}
                      freezeColumns="0"
                      onColumnResize={onColumnResize}
                      rowMarkers={('checkbox-visible', 'both')}
                      rowSelect="single"
                    />
                  </div>
                )}
              </div>
            </Form.Item>
          </Col> */}
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('850000126')}</span>}
              className="mb-0"
            >
              <Input placeholder="" size="middle" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
