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
const { TextArea } = Input
const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

export default function PurDelvInQuery({
  fromDate,
  setFromDate,
  bizUnitName,
  smImpTypeName,

  whName,
  custName,
  userName,
  deptName,
  currName,
  exRate,
  delvInNo,
  remark,
  setRemark,
}) {
  const { t } = useTranslation()
  const handleFromDate = (date) => {
    setFromDate(date)
  }
  const gridRef = useRef(null)

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
              label={
                <span className="uppercase text-[10px]">
                  Phân loại mua hàng
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={smImpTypeName}
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

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">
                  {t('Số nhập kho (tự động)')}
                </span>
              }
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={delvInNo}
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
              label={<span className="uppercase text-[10px]">Kho</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={whName}
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
                style={{ backgroundColor: '#C0C0C0', width: 400 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('363')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={currName}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
                  width: 85,
                }}
                //className=" text-sm p-2"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('364')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={exRate}
                size="middle"
                style={{
                  backgroundColor: '#C0C0C0',
                  width: 85,
                }}
                //className=" text-sm p-2"
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
                  width: 400,
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
