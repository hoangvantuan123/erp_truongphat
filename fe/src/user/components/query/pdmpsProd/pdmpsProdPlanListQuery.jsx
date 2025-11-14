import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker } from 'antd'
import DropdownDept from '../../sheet/query/dropdownDept'
import DropdownUser from '../../sheet/query/dropdownUsers'
import { useTranslation } from 'react-i18next'
export default function PdmpsProdPlanListQuery({
  helpData01,
  setDataSearch,
  setDataSheetSearch,
  setItemText,
  searchText,
  setSearchText,
  helpData04,
  setFormData,
  setToDate,
  formData,
  toDate,
  setFactUnit,
  ItemName,
  setItemName,
  ItemNo, setItemNo,
  Spec,
  setSpec,
  ProdPlanNo,
  setProdPlanNo
}) {
  const { t } = useTranslation()
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleChangeFactUnit = (value) => {
    setFactUnit(value)
  }
  const handleFormDate = (date) => {
    setFormData(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
  const handleChangeItemName = (value) => {
    setItemName(value.target.value)
  }
  const handleChangeSpec = (value) => {
    setSpec(value.target.value)
  }
  const handleChangeItemNo = (value) => {
    setItemNo(value.target.value)
  }
  const handleChangeProdPlanNo = (value) => {
    setProdPlanNo(value.target.value)
  }
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-2 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 0, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 250,
                }}
                onChange={handleChangeFactUnit}
                options={[
                  { label: 'All', value: '0' },
                  ...(helpData04?.map((item) => ({
                    label: item?.FactUnitName,
                    value: item?.FactUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('191')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 0, padding: 0 } }}
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
              label={<span className="uppercase text-[10px]">{t('232')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 0, padding: 0 } }}
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

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1524')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 0, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" value={ProdPlanNo} onChange={handleChangeProdPlanNo} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('748')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 0, padding: 0 } }}
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
                  helpData={helpData01}
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
              label={<span className="uppercase text-[10px]">{t('1786')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 0, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" onChange={handleChangeItemName} value={ItemName} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2091')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 0, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" onChange={handleChangeItemNo} value={ItemNo} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('551')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 0, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" onChange={handleChangeSpec} value={Spec} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div >
  )
}
