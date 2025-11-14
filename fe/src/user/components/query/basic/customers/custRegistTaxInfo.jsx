import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select } from 'antd'
export default function CustRegistTaxInfo({
  dataMasterInfo,

  BizAdd,
  setBizAdd,

  LawRegNo,
  setLawRegNo,

  BizNo,
  setBizNo,

  SMBizPerName,
  setSMBizPerName,

  TelNo,
  setTelNo,

  BizType,
  setBizType,

  Owner,
  setOwner,
}) {

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setLawRegNo(dataMasterInfo?.LawRegNo)
    setBizAdd(dataMasterInfo?.BizAddr)
    setBizNo(dataMasterInfo?.BizNo)
    setTelNo(dataMasterInfo?.TelNo)
    setBizType(dataMasterInfo?.BizType)
    setOwner(dataMasterInfo?.Owner)

    
  }, [dataMasterInfo])

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">Mã số kinh doanh</span>
              }
              className="mb-0"
            >
              <Input
                placeholder=""
                size="middle"
                value={BizNo}
                onChange={(e) => setBizNo(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Số pháp nhân</span>}
              className="mb-0"
            >
              <Input
                placeholder=""
                size="middle"
                value={LawRegNo}
                onChange={(e) => setLawRegNo(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">
                  Họ tên người đại diện
                </span>
              }
              className="mb-0"
            >
              <Input
                placeholder=""
                size="middle"
                value={Owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">Số điện thoại</span>
              }
              className="mb-0"
            >
              <Input
                placeholder=""
                size="middle"
                value={TelNo}
                onChange={(e) => setTelNo(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">
                  Tình trạng kinh doanh
                </span>
              }
              className="mb-0"
            >
              <Input 
                placeholder="" 
                size="middle" 
                value={BizType}
                onChange={(e) => setBizType(e.target.value)}
                />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">
                  Địa chỉ doanh nghiệp đóng thuế
                </span>
              }
              className="mb-0"
              style={{width:390}}

            >
              <Input
                placeholder=""
                allowClear
                className="w-full"
                value={BizAdd}
                onChange={(e) => setBizAdd(e.target.value)}
              />
            </Form.Item>
          </Col>

        </Row>

        <Row className="gap-4 flex items-center">
        

        </Row>
      </Form>
      
    </div>
  )
}
