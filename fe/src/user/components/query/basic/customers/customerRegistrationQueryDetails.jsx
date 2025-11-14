import { useState, useEffect, useRef } from 'react'
import { Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'
export default function CustomerRegistrationQueryDetails({
  dataMasterInfo,
  custName,
  setCustName,

  fullName,
  setFullName,

  custNo,
  setCustNo,

  custSeq,
  setCustSeq,

  UMCountryName,
  setUmCountryName,
  setUmCountry,


  smCustStatusName,
  setSmCustStatusName,
  setCustStatus,

  dataSMDomForName,
  SMDomForName,
  setSMDomForName,
  setSMDomFor,

  dataCustStatus,
  dataUMCoutry,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)
  const [ModalVisibleCountry, setModalVisibleCountry] = useState(false)

  useEffect(() => {
    setFullName(dataMasterInfo?.FullName)
    setCustName(dataMasterInfo?.CustName)
    setSmCustStatusName(dataMasterInfo?.SMCustStatusName)
    setCustStatus(dataMasterInfo?.SMCustStatus)
    setCustNo(dataMasterInfo?.CustNo)
    setCustSeq(dataMasterInfo?.CustSeq)
    setUmCountryName(dataMasterInfo?.UMCountryName)
    setSMDomForName(dataMasterInfo?.SMDomForName)
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

  const onChangeCustStatus = (e) => {
    const selectedItem = dataCustStatus?.find((item) => item?.Value === e)
    if (selectedItem) {
      setSmCustStatusName(selectedItem.MinorName)
      setCustStatus(selectedItem.Value)
    }
  }

  const onChangeSMDomForName = (e) => {
    const selectedItem = dataSMDomForName?.find((item) => item?.Value === e)
    if (selectedItem) {
      setSMDomForName(selectedItem.MinorName)
      setSMDomFor(selectedItem.Value)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Thương hiệu</span>}
              className="mb-0"
            >
              <Input
                placeholder=""
                size="middle"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">Tên khách hàng</span>
              }
              className="mb-0"
            >
              <Input
                placeholder=""
                size="middle"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">
                  Trạng thái khách hàng
                </span>
              }
              className="mb-0"
            >
              <Select
                id="bizUnitSelect"
                size="middle"
                showSearch
                style={{ width: 190 }}
                onChange={onChangeCustStatus}
                value={smCustStatusName}
                options={[
                  ...(dataCustStatus?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">Mã số khách hàng</span>
              }
              className="mb-0"
            >
              <Input
                placeholder=""
                size="middle"
                value={custNo}
                onChange={(e) => setCustNo(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Trong nước</span>}
              className="mb-0"
            >
              <Select
                id="bizUnitSelect"
                size="middle"
                showSearch
                style={{ width: 190 }}
                onChange={onChangeSMDomForName}
                value={SMDomForName}
                options={[
                  ...(dataSMDomForName?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">Mã khách hàng</span>
              }
              className="mb-0"
            >
              <Input
                placeholder=""
                size="middle"
                value={custSeq}
                onChange={(e) => setCustSeq(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Quốc gia</span>}
              className="mb-0"
            >
              <Input
                value={UMCountryName}
                onChange={(e) => setUmCountryName(e.target.value)}
                onFocus={() => setModalVisibleCountry(true)}
                size="middle"
              />
              
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
