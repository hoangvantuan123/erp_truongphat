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

export default function LGStockClosingQuery({ inOutYY, setInOutYY }) {
  const { t } = useTranslation()
  const handleFromYear = (date) => {
    setInOutYY(date)
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
              label={
                <span className="uppercase text-[10px]">{t('Năm xử lý')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              required
            >
              <DatePicker
                value={inOutYY}
                onChange={handleFromYear}
                format="YYYY"
                picker="year"
              />
            </Form.Item>
          </Col>
          <Col>
            <span
              style={{
                fontStyle: 'italic',
                display: 'block',
                textAlign: 'center',
              }}
            >
              Cần xử lý tổng hợp tồn kho trước khi tính toán giá thành
            </span>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
