import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { useTranslation } from 'react-i18next'
const { TextArea } = Input
const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

export default function LGEtcOutQuery({
  fromDate,
  setFromDate,
  bizUnitName,
  bizUnitNameTrans,
  typeSName,
  whNameIn,
  whNameOut,
  custName,
  userName,
  deptName,
  inOutNo,
  remark,
  setRemark,
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
                <span className="uppercase text-[10px]">Kho nhập kho</span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                size="middle"
                value={whNameIn}
                //onChange={(e) => setWhName(e.target.value)}
                style={{ backgroundColor: '#C0C0C0', width: 190 }}
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
        </Row>
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">
                  {t('Số di chuyển kho (tự động)')}
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={inOutNo}
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
                  {t('Bộ phận kinh doanh (Kho xuất)')}
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={bizUnitNameTrans}
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
                <span className="uppercase text-[10px]">Kho xuất kho</span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                size="middle"
                value={whNameOut}
                //onChange={(e) => setWhName(e.target.value)}
                style={{ backgroundColor: '#C0C0C0', width: 190 }}
              />
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
                style={{ backgroundColor: '#C0C0C0', width: 390 }}
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
                  width: 190,
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
