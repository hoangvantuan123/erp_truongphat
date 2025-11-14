import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { TableOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import useOnFill from '../../hooks/sheet/onFillHook'
import debounce from 'lodash/debounce';
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
export default function DaMaterialListQuery({
  setFormData,
  setToDate,
  formData,
  toDate,
  set10012,
  key10012,
  setKey10012,
  setKey10010,
  key10010,
  set10010,
  setKeyItemNo,
  keyItemNo,
  setKeyItemName,
  keyItemName,
  setKeySpec,
  keySpec,
  setKeyDeptSeq,
  set10009,
  setKeyEmpSeq,
  set2004,
  set2005,
  set2006,
  setUMItemClassS,
  setUMItemClassM,
  setUMItemClassL
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const gridRef10009 = useRef(null)
  const [searchText, setSearchText] = useState('')
  const [deptText, setDeptText] = useState('')
  const [empText, setEmpText] = useState('')
  const [searchText10009, setSearchText10009] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [filteredData10009, setFilteredData10009] = useState([])
  const [hoverRow, setHoverRow] = useState(null)
  const [hoverRow10009, setHoverRow10009] = useState(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible10009, setDropdownVisible10009] = useState(false)
  const dropdownRef10009 = useRef(null)
  const dropdownRef = useRef(null)

  const [numRows, setNumRows] = useState(0)
  const [numRows10009, setNumRows10009] = useState(0)

  const [selection10009, setSelection10009] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const defaultCols = [
    {
      title: t('19647'),
      id: 'BeDeptName',
      kind: 'Text',
      readonly: true,
      width: 300,
    },
    {
      title: t('850000121'),
      id: 'DeptRemark',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
  ]
  const defaultCols10009 = [
    {
      title: 'EmpName',
      id: 'EmpName',
      kind: 'Text',
      readonly: true,
      width: 300,
    },
    {
      title: 'EmpSeq',
      id: 'EmpSeq',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
    {
      title: 'EmpID',
      id: 'EmpID',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
    {
      title: 'DeptName',
      id: 'DeptName',
      kind: 'Text',
      readonly: true,
      width: 250,
    },
    {
      title: 'DeptSeq',
      id: 'DeptSeq',
      kind: 'Text',
      readonly: true,
      width: 250,
    }
  ]
  const [cols, setCols] = useState(defaultCols)
  const [cols10009, setCols10009] = useState(defaultCols10009)
  const onFill = useOnFill(filteredData, cols)
  const onFill10009 = useOnFill(filteredData10009, cols10009)

  useEffect(() => {
    if (set10010) {
      setFilteredData(set10010);
      setNumRows(set10010.length);
    } else {
      setFilteredData([]);
      setNumRows(0);
    }
  }, [set10010]);

  useEffect(() => {
    if (set10009) {
      setFilteredData10009(set10009);
      setNumRows10009(set10009.length);
    } else {
      setFilteredData10009([]);
      setNumRows10009(0);
    }
  }, [set10009]);

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchText(value)
    setDropdownVisible(true)

    setTimeout(() => {
      if (value.trim() === '' || value === null) {
        setDeptText('')
        setFilteredData(set10010)
        setNumRows(set10010.length)
        setKeyDeptSeq('')
      } else {
        const filtered = set10010.filter(
          (item) =>
            item.BeDeptName.toLowerCase().includes(value.toLowerCase()) ||
            item.DeptRemark.toLowerCase().includes(value.toLowerCase()),
        )
        setFilteredData(filtered)
        setNumRows(filtered.length)
      }
    }, 500)
  }
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch10009 = useCallback(
    debounce((value) => {
      if (value.trim() === '' || value === null) {
        setEmpText('');
        setFilteredData10009(set10009);
        setNumRows10009(set10009.length);
        setKeyEmpSeq('');
      } else {
        const filtered = set10009.filter((item) => {
          const empName = item?.EmpName?.toLowerCase() || '';
          const empSeq = item?.EmpSeq ? String(item.EmpSeq).toLowerCase() : '';
          return (
            empName.includes(value.toLowerCase()) ||
            empSeq.includes(value.toLowerCase())
          );
        });
        if (filtered.length > 0) {
          setFilteredData10009(filtered);
          setNumRows10009(filtered.length);
        } else {
          callGetCodeHelp(value);
        }
      }
    }, 300),
    [set10009]
  );

  const callGetCodeHelp = async (key) => {
    try {
      const result = await GetCodeHelp(10009, key, '', '', '', '', '', 1, 0, '', 0, 0, 0);
      if (result && result.data) {
        setFilteredData10009(result.data);
        setNumRows10009(result.data.length);
      }
    } catch (error) {
      setFilteredData10009([]);
      setNumRows10009(0);
    }
  };

  const handleCellClick = ([col, row]) => {
    const data = searchText.trim() === '' ? set10010 : filteredData
    if (data[row]) {
      const selectedLanguage = data[row].BeDeptName
      setSearchText(selectedLanguage)
      setDeptText(selectedLanguage)
      setDropdownVisible(false)
      setKeyDeptSeq(data[row].BeDeptSeq)
    }
  }
  const handleCellClick10009 = ([col, row]) => {
    const trimmedSearchText = searchText10009?.trim() || '';
    const data = trimmedSearchText === '' ? set10009 : filteredData10009;

    if (data[row]) {
      const selectedLanguage = data[row]?.EmpName || '';
      setSearchText10009(selectedLanguage);
      setDropdownVisible10009(false);
      setEmpText(selectedLanguage);
      setKeyEmpSeq(data[row]?.EmpSeq || '');
      setDeptText(data[row]?.DeptName || '');
      setKeyDeptSeq(data[row]?.DeptSeq || '');
    }
  };

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const onItemHovered10009 = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow10009(args.kind !== 'cell' ? undefined : row)
  }, [])
  const getData = useCallback(
    ([col, row]) => {
      const person = filteredData[row] || {}
      const column = cols[col]
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
    [filteredData, cols],
  )

  const getData10009 = useCallback(
    ([col, row]) => {
      const person = filteredData10009[row] || {}
      const column = cols10009[col]
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
    [filteredData10009, cols10009],
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
  const onColumnResize10009 = useCallback(
    (column, newSize) => {
      const index = cols10009.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...cols]
        newCols.splice(index, 1, newCol)
        setCols10009(newCols)
      }
    },
    [cols10009],
  )
  const handleFormDate = (date) => {
    setFormData(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
  const handleChange10012 = (value) => {
    setKey10012(value)
  }

  const handleChange2004 = (value) => {
    setUMItemClassS(value)
  }
  const handleChange2005 = (value) => {
    setUMItemClassM(value)
  }
  const handleChange2006 = (value) => {
    setUMItemClassL(value)
  }
  const handleOpenHelpSheet10010 = () => {
    setDropdownVisible(true)

  }
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">


          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2119')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                defaultValue="All"
                size="middle"
                style={{
                  width: 320,
                }}
                onChange={handleChange10012}
                options={[
                  { label: 'All', value: '0' },
                  ...(set10012?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2115')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >

              <Select
                defaultValue="All"
                size="middle"
                style={{
                  width: 320,
                }}
                onChange={handleChange2006}
                options={[
                  { label: 'All', value: '0' },
                  ...(set2006?.map((item) => ({
                    label: item?.Value,
                    value: item?.UMItemClass,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('3262')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                defaultValue="All"
                size="middle"
                style={{
                  width: 320,
                }}
                onChange={handleChange2005}
                options={[
                  { label: 'All', value: '0' },
                  ...(set2005?.map((item) => ({
                    label: item?.Value,
                    value: item?.UMItemClass,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('592')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                defaultValue="All"
                size="middle"
                style={{
                  width: 320,
                }}
                onChange={handleChange2004}
                options={[
                  { label: 'All', value: '0' },
                  ...(set2004?.map((item) => ({
                    label: item?.Value,
                    value: item?.UMItemClass,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('5')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" className='w-[300px]' size="middle" value={deptText} onFocus={handleOpenHelpSheet10010} style={{ backgroundColor: '#e8f0ff' }} />
              {dropdownVisible && (
                <div
                  ref={dropdownRef}
                  className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                >
                  <div className="flex items-center justify-between p-1">
                    <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                      <TableOutlined />
                      {t('850000124')}
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
                    rows={numRows}
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
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('521')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" className='w-[300px]' size="middle" value={empText} onFocus={() => { setDropdownVisible10009(true) }} style={{ backgroundColor: '#e8f0ff' }} />
              {dropdownVisible10009 && (
                <div
                  ref={dropdownRef10009}
                  className="  fixed z-50 w-auto bg-white border border-gray-300 rounded-lg top-[25vh] left-[50%] transform -translate-x-1/2"
                >
                  <div className="flex items-center justify-between p-1">
                    <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                      <TableOutlined />
                      {t('850000125')}
                    </h2>

                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => setDropdownVisible10009(false)}
                    />
                  </div>
                  <div className="p-2 border-b border-t">
                    <div className="w-full flex gap-2">
                      <SearchOutlined className="opacity-80 size-5" />
                      <input
                        value={searchText10009}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchText10009(value);
                          handleSearch10009(value);
                        }}
                        onFocus={() => setDropdownVisible10009(true)}
                        highlight={true}
                        autoFocus={true}
                        className="h-full w-full border-none focus:outline-none hover:border-none bg-inherit"
                      />
                    </div>
                  </div>
                  <DataEditor
                    ref={gridRef10009}
                    width={950}
                    height={500}
                    onFill={onFill10009}
                    className="cursor-pointer rounded-md"
                    rows={numRows10009}
                    columns={cols10009}
                    gridSelection={selection10009}
                    onGridSelectionChange={setSelection10009}
                    getCellsForSelection={true}
                    getCellContent={getData10009}
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
                    onItemHovered={onItemHovered10009}
                    onCellClicked={handleCellClick10009}
                    freezeColumns="0"
                    onColumnResize={onColumnResize10009}
                    rowMarkers={('checkbox-visible', 'both')}
                    rowSelect="single"
                  />
                </div>
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1786')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" className='w-[300px]' size="middle" value={keyItemName} onChange={(e) => { setKeyItemName(e.target.value) }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2091')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" className='w-[300px]' size="middle" value={keyItemNo} onChange={(e) => setKeyItemNo(e.target.value)} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('551')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" className='w-[300px]' size="middle" value={keySpec} onChange={(e) => setKeySpec(e.target.value)} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('850000122')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={formData}
                onChange={handleFormDate}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('850000123')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={toDate}
                onChange={handletoDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
