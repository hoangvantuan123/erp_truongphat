import { useEffect } from 'react'
import { Card, Button, Input, DatePicker, Select, Form } from 'antd'
import { SearchOutlined, PrinterOutlined } from '@ant-design/icons'

import { VENDOR_LIST } from '../../../../utils/sysConstants'

export default function BarcodePrintAction({
  fromDate,
  toDate,

  onFinish,
  onClickPrint,
}) {
  const [formSearch] = Form.useForm()

  useEffect(() => {
    formSearch.setFieldsValue({ fromDate: fromDate })
    formSearch.setFieldsValue({ toDate: toDate })
  }, [fromDate, toDate])

  return (
    <div className="mt-1">
      <Card className="mb-1 p-1 shadow-sm" size="small">
        <Form
          layout={'inline'}
          initialValues={{
            layout: 'inline',
          }}
          form={formSearch}
          onFinish={onFinish}
          style={{
            maxWidth: 'inline' ? 'none' : 600,
          }}
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        >
          <Form.Item label="From Date" name={'fromDate'}>
            <DatePicker size="small" />
          </Form.Item>

          <Form.Item label="To Date" name={'toDate'}>
            <DatePicker size="small" />
          </Form.Item>

          <Form.Item label="Vendor" name={'vendor'} size="small">
            <Select
              labelInValue
              allowClear
              initialValues="All"
              size="small"
              style={{
                width: 150,
              }}
              options={VENDOR_LIST?.map((item) => ({
                label: item?.label,
                value: item?.value,
              }))}
            />
          </Form.Item>

          <Form.Item label="Mat ID" name={'matID'} size="small">
            <Input placeholder="" size="small" />
          </Form.Item>

          <Form.Item label="Lot No" name={'lotNo'} size="small">
            <Input placeholder="" size="small" />
          </Form.Item>

          <Form.Item>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              size="small"
              htmlType="submit"
            >
              SEARCH
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              icon={<PrinterOutlined />}
              onClick={onClickPrint}
              type="primary"
              size="small"
            >
              PRINT
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
