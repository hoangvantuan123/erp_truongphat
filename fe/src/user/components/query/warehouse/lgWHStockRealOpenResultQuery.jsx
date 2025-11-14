import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { useTranslation } from 'react-i18next'
const { TextArea } = Input
const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

export default function LGWHStockRealOpenResultQuery({
  fromDate,
  setFromDate,
  bizUnitName,
  typeSName,
  whName,
  userName,
  stkMngNo,
  remark,
}) {
  const { t } = useTranslation()
  const handleFromDate = (date) => {
    setFromDate(date)
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
              label={<span className="uppercase text-[10px]">{t('200')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <DatePicker
                //className="w-full text-sm p-2"
                size="middle"
                style={{
                  width: 190,
                }}
                value={fromDate}
                onChange={handleFromDate}
                format="YYYY-MM-DD"
                disabled
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
              label={<span className="uppercase text-[10px]">Kho kiểm kê</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                placeholder=""
                size="middle"
                value={whName}
                //onChange={(e) => setWhName(e.target.value)}
                style={{ backgroundColor: '#C0C0C0', width: 190 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">
                  {t('Phân loại kiểm kê')}
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
                  {t('Số kiểm tra')}
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={stkMngNo}
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
                <span className="uppercase text-[10px]">{t('Ghi chú')}</span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={remark}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
                  width: 190,
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
