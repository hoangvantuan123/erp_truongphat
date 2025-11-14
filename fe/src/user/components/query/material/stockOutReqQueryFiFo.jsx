import { useState } from 'react'
import { Form, Input, Row, Col, Checkbox } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
dayjs.locale('vi')
import debounce from 'lodash.debounce'

export default function StockOutRequestQueryFiFo({
  filteredData,
  handleCheckBarcode,
  inputBarCode,
  setInputBarCode,
  setCheckValueIsStop,
}) {
  
  const [date] = useState(dayjs())
  const [checkBoxIsStop, setCheckBoxIsStop] = useState(filteredData?.IsStop)
  const formatDateWithWeekday = (date) => {
    const dayOfWeek = date.format('dddd')
    const capitalizedDay =
      dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
    return `${capitalizedDay}, ${date.format('DD/MM/YYYY')}`
  }
  const handleChange = (e) => {
    setInputBarCode(e.target.value)
  }
  const handleEnter = () => {
    if (inputBarCode) {
      handleCheckBarcode(inputBarCode)
    }
  }

  const onChange = (e) => {
    setCheckBoxIsStop(e.target.checked)
    const value = e.target.checked ? 1 : 0
    setCheckValueIsStop(value)
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
        {' '}
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
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">Barcode</span>}
              tooltip="Dùng để nhập mã vạch"
              className="mb-0"
            >
              <Input
                value={inputBarCode}
                onChange={handleChange}
                onPressEnter={handleEnter}
                placeholder="Barcode"
                size="small"
                className="text-sm p-2  w-80"
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">Trạng thái Y/N</span>
              }
              className="mb-0"
            >
              {filteredData?.IsStop === true ? (
                <>
                  <Checkbox onChange={onChange}>
                    <span className="uppercase">Đơn hàng hoàn thành</span>
                  </Checkbox>
                </>
              ) : (
                <>
                  {' '}
                  <Checkbox onChange={onChange}>
                    {checkBoxIsStop ? (
                      <span className=" uppercase">Đơn hàng hoàn thành</span>
                    ) : (
                      <span className="uppercase">
                        Đơn hàng chưa hoàn thành
                      </span>
                    )}
                  </Checkbox>
                </>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
