import { useState, useRef } from 'react'
import { Form, Input, Row, Col, Button, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
dayjs.locale('vi')
const { Title } = Typography
export default function MatWHStockInQuery({ filteredData }) {
  const [date] = useState(dayjs())

  const formatDateWithWeekday = (date) => {
    const dayOfWeek = date.format('dddd')
    const capitalizedDay =
      dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
    return `${capitalizedDay}, ${date.format('DD/MM/YYYY')}`
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">Date</span>}
              className="mb-0"
            >
              <Input
                value={formatDateWithWeekday(date)}
                size="small"
                className="text-sm p-2"
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
