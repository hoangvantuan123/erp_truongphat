import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker, Space } from 'antd'
import DropdownDept from '../../sheet/query/dropdownDept'
import DropdownUser from '../../sheet/query/dropdownUsers'
import { useTranslation } from 'react-i18next'
import DropdownWC from '../../sheet/query/dropdownWC'
export default function PdsfcWorkOrderListQuery({
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
  setProdPlanNo,
  setWorkOrderDate,
  workOrderDate,
  setWorkOrderDateTo,
  workOrderDateTo,
  setWorkOrderNo,
  WorkOrderNo,
  setSearchText2,
  searchText2,
  setItemText2,
  setDataSearch2,
  setDataSheetSearch2,
  helpData07

}) {
  const { t } = useTranslation()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)

  const handleChangeFactUnit = (value) => {
    setFactUnit(value)
  }
  const handleFormDate = (date) => {
    setFormData(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }


  const handleChangeWorkOrderDate = (date) => {
    setWorkOrderDate(date)
  }
  const handleChangeWorkOrderDateTo = (date) => {
    setWorkOrderDateTo(date)
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
  const handleChangeWorkOrderNo = (value) => {
    setWorkOrderNo(value.target.value)
  }
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3')}</span>}
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
              label={<span className="uppercase text-[10px]">{t('441')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={workOrderDate}
                  onChange={handleChangeWorkOrderDate}
                  format="YYYY-MM-DD"
                />
                <DatePicker
                  size="middle"
                  value={workOrderDateTo}
                  onChange={handleChangeWorkOrderDateTo}
                  format="YYYY-MM-DD"
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('218')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={formData}
                  onChange={handleFormDate}
                  format="YYYY-MM-DD"
                />
                <DatePicker
                  size="middle"
                  value={toDate}
                  onChange={handletoDate}
                  format="YYYY-MM-DD"
                />
              </Space>
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1985')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" value={WorkOrderNo} onChange={handleChangeWorkOrderNo} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1524')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" value={ProdPlanNo} onChange={handleChangeProdPlanNo} />
            </Form.Item>
          </Col>


        </Row>
        <Row className="gap-4 flex items-center ">

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('744')} </span>}
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
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" onChange={handleChangeItemName} value={ItemName} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2091')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" onChange={handleChangeItemNo} value={ItemNo} />
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('Work Center')} </span>}
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
                <DropdownWC
                  helpData={helpData07}
                  setSearchText={setSearchText2}
                  setItemText={setItemText2}
                  setDataSearch={setDataSearch2}
                  setDataSheetSearch={setDataSheetSearch2}
                  setDropdownVisible={setDropdownVisible2}
                  dropdownVisible={dropdownVisible2}
                  searchText={searchText2}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div >
  )
}
