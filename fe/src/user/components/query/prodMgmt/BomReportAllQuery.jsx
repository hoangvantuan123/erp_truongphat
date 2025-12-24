import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker } from 'antd'
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
import Dropdown18074 from '../../sheet/query/dropdown18074'
import { useTranslation } from 'react-i18next'

export default function BomReportAllQuery({
  helpData01, setDataSearch, setHelpData01, dataSearch, helpData02, setDataSheetSearch, setItemText, itemText, searchText, setSearchText,
  setMinorValue,
  controllers,

  setFormDate,
  formDate,
  toDate,
  setToDate,
}) {
  const gridRef = useRef(null)
  const { t } = useTranslation()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)



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




  const handleChange = (value) => {
    setMinorValue(value)
  }
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">

          {/*  <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('Thời gian đăng ký')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <div className='flex items-center'>

                <DatePicker
                  size="small"
                  defaultValue={formDate}
                  onChange={(value) => setFormDate(value)}
                  className="w-full p-1 "
                  placeholder="Chọn ngày"

                />
                ~
                <DatePicker
                  size="small"
                  defaultValue={toDate}
                  onChange={(value) => setToDate(value)}
                  className="w-full   p-1 "
                  placeholder="Chọn ngày"

                />
              </div>
            </Form.Item>
          </Col> */}
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px] text-red-500">{t('1786')} *</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={itemText}
                onFocus={() => setDropdownVisible(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible && (
                <Dropdown18074
                  helpData={helpData01}
                  setSearchText={setSearchText}
                  setItemText={setItemText}
                  setDataSearch={setDataSearch}
                  setDataSheetSearch={setDataSheetSearch}
                  setDropdownVisible={setDropdownVisible}
                  dropdownVisible={dropdownVisible}
                  searchText={searchText}
                  controllers={controllers}
                  setHelpData01={setHelpData01}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2091')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" readOnly value={dataSearch?.ItemNo} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3226')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" readOnly value={dataSearch?.Spec} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2119')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 250,
                }}
                onChange={handleChange}
                options={[
                  { label: 'All', value: '' },
                  ...(helpData02?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
