import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { useTranslation } from 'react-i18next'
const { TextArea } = Input
const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
dayjs.locale('vi')
export default function PdmmOutQueryDetailListSeqQuery({
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
  gridData,
  materialData
}) {
  const { t } = useTranslation()
  const handleFromDate = (date) => {
    setFromDate(date)
  }

  const [date] = useState(dayjs())
  const formatDateWithWeekday = (date) => {
    const dayOfWeek = date.format('dddd')
    const capitalizedDay =
      dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
    return `${capitalizedDay}, ${date.format('DD/MM/YYYY')}`
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
        <Row className="gap-4 flex items-center ">
          {/* Hàng 1 */}
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('200')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input value={formatDateWithWeekday(date)} readOnly />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('22882')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={gridData[0]?.FactUnitName ?? ''}
                style={{ backgroundColor: '#F5F5F5 ', width: 190 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">Work Center</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={gridData[0]?.WorkCenterName ?? ''}
                style={{ backgroundColor: '#F5F5F5 ', width: 190 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('584')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={gridData[0]?.InWHName ?? ''}
                style={{ backgroundColor: '#F5F5F5 ', width: 190 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('626')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={gridData[0]?.OutWHName ?? ''}
                style={{ backgroundColor: '#F5F5F5 ', width: 190 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row className="gap-4 flex items-center">
          {/* Hàng 2 */}
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
                style={{ backgroundColor: '#F5F5F5 ', width: 190 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('5')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <Input
                value={deptName}
                style={{ backgroundColor: '#F5F5F5 ', width: 190 }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('8211')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={materialData[0]?.MatOutNo ?? ''}
                style={{ backgroundColor: '#F5F5F5 ', width: 190 }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('362')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <TextArea
                placeholder={t('362')}
                autoSize={{ minRows: 2, maxRows: 2 }}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </div>
  )
}
