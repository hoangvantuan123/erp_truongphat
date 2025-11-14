import { useState, useCallback, useEffect, useRef } from 'react'
import {Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'
export default function CustRegistBankInfo({

  dataBankInfo,

  BankNumber,
  setBankNumber,

  BankName,
  setBankName,

  BankAccName,
  setBankAccName,

  BankPhoneNumber,
  setBankPhoneNumber,

  AbbrName,
  setAbbrName,

  SpBankPhone,
  setSpBankPhone,

}) {

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setBankNumber(dataBankInfo[0]?.MngValName)
    setBankAccName(dataBankInfo[1]?.MngValName)
    setBankName(dataBankInfo[2]?.MngValName)
    setAbbrName(dataBankInfo[3]?.MngValName)
    setBankPhoneNumber(dataBankInfo[4]?.MngValName)
    setSpBankPhone(dataBankInfo[5]?.MngValName)
  }, [dataBankInfo])

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
              label={<span className="uppercase text-[9px]">Số tài khoản ngân hàng</span>}
              className="mb-0"
              style={{width: 180}}
            >
              <Input 
                placeholder="" 
                size="middle" 
                value={BankNumber}
                onChange={(e)=> setBankNumber(e.target.value)} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Tên chủ số tài khoản</span>}
              className="mb-0"
              style={{width: 180}}
            >
              <Input 
                placeholder="" 
                size="middle"
                value={BankAccName}
                onChange={(e) => setBankAccName(e.target.value)} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{dataBankInfo[2]?.MngName}</span>}
              className="mb-0"
            >
              <Input 
                placeholder="" 
                size="middle"
                value={BankName}
                onChange={(e) => setBankName(e.target.value)} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Tên viết tắt NCC</span>}
              className="mb-0"
              style={{width: 190}}
            >
              <Input 
                placeholder="" 
                size="middle" 
                value={AbbrName}
                onChange={(e) => setAbbrName(e.target.value)}
                />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">{dataBankInfo[4]?.MngName}</span>
              }
              className="mb-0"
            >
              <Input 
                placeholder="" 
                size="middle" 
                value={BankPhoneNumber}
                onChange={(e) => setBankPhoneNumber(e.target.value)}
                />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">Số điện thoại phụ trách bán hàng</span>
              }
              className="mb-0"
            >
              <Input 
                placeholder="" 
                size="middle" 
                value={SpBankPhone}
                onChange={(e) => setSpBankPhone(e.target.value)}
                />
            </Form.Item>
          </Col>
          
        </Row>
      </Form>
    </div>
  )
}
