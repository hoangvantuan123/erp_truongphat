import { useState } from 'react'
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Segmented,
  Select,
} from 'antd'
import moment from 'moment'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useTranslation } from 'react-i18next'
const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

export default function IqcStatusQuery({
  formData,
  setFormData,
  setBLNo,
  setToDate,
  toDate,
  blNo,
  bizUnit,
  setBizUnit,
  dataUnit,
  setItemNo,
  itemNo,
  setItemName,
  itemName,
}) {
  const handleFormDate = (date) => {
    setFormData(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
  const handleChange = (value) => {
    setBizUnit(value)
  }
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">From Date</span>}
              className="mb-0"
            >
              <DatePicker
                className="w-full text-sm p-2"
                value={formData}
                onChange={handleFormDate}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">To Date</span>}
              className="mb-0"
            >
              <DatePicker
                className="w-full text-sm p-2"
                value={toDate}
                onChange={handletoDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">BL No</span>}
              className="mb-0"
            >
              <Input
                placeholder="Input placeholder"
                value={blNo}
                size="small"
                onChange={(e) => setBLNo(e.target.value)}
                className=" text-sm p-2"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">Item No</span>}
              className="mb-0"
            >
              <Input
                placeholder="Input placeholder"
                value={itemNo}
                size="small"
                onChange={(e) => setItemNo(e.target.value)}
                className=" text-sm p-2"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">Item Name</span>}
              className="mb-0"
            >
              <Input
                placeholder="Input placeholder"
                value={itemName}
                size="small"
                onChange={(e) => setItemName(e.target.value)}
                className=" text-sm p-2"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">Acc Unit</span>}
              className="mb-0"
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="large"
                style={{
                  width: 190,
                }}
                //allowClear
                onChange={handleChange}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataUnit?.map((item) => ({
                    label: item?.AccUnitName,
                    value: item?.BizUnit,
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
