import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'
export default function CustRegistBasicInfo({

  dataMasterInfo,
  dataCustAddInfo,

  UMChannelName,
  setUMChannelName,
  setUMChannel,

  setSMBizPerName,

  EngCustName,
  setEngCustName,
  
  Email,
  setEmail,

  TelNo,
  setTelNo,

  Fax,
  setFax,

  Tel2,
  setTel2,

  dataUMChannel,

  dataBizPername,
  SMBizPers,
  setSMBizPers,

  SMBizPersName,
  setSMBizPersName, 

  setSMDomFor,
}) {

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)
  
  useEffect(() => {

    setUMChannelName(dataCustAddInfo?.UMChannelName)
    setUMChannel(dataCustAddInfo?.UMChannel)
    setSMBizPerName(dataCustAddInfo?.SMBizPerName)
    setEngCustName(dataCustAddInfo?.EngCustName)
    setEmail(dataCustAddInfo?.Email)
    setTelNo(dataMasterInfo?.TelNo)
    setFax(dataCustAddInfo?.FAX)
    setTel2(dataCustAddInfo?.Tel2)
    setSMBizPersName(dataMasterInfo?.SMBizPersName)
    setSMBizPers(dataMasterInfo?.SMBizPers)
    setSMDomFor(dataMasterInfo?.SMDomFor)

  }, [dataCustAddInfo, dataMasterInfo, dataBizPername])

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

  const onChangeUmChanel = (e) => {
    const selectedItem = dataUMChannel?.find((item) => item?.Value === e)
    if (selectedItem) {
      setUMChannelName(selectedItem.MinorName)
      setUMChannel(selectedItem.Value)
    }
  }

  const onChangeSMBizPerName = (e) => {
    const selectedItem = dataBizPername?.find((item) => item?.Value === e)
    if (selectedItem) {
      setSMBizPersName(selectedItem.MinorName)
      setSMBizPers(selectedItem.Value)
    }
  }


  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Cơ cấu phân phối</span>}
              className="mb-0"
            >
              <Select
                id="bizUnitSelect"
                size="middle"
                showSearch
                style={{ width: 190 }}
                onChange={onChangeUmChanel}
                value={UMChannelName}
                options={[
                  ...(dataUMChannel?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
 
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Pháp nhân/Cá nhân</span>}
              className="mb-0"
            >
              <Select
                id="bizUnitSelect"
                size="middle"
                showSearch
                style={{ width: 190 }}
                onChange={onChangeSMBizPerName}
                value={SMBizPersName}
                options={[
                  ...(dataBizPername?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Tên công ty bằng tiếng anh</span>}
              className="mb-0"
            >
              <Input 
                placeholder="" 
                size="middle"
                value={EngCustName}
                onChange={(e) => setEngCustName(e.target.value)} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Thư điện tử</span>}
              className="mb-0"
            >
              <Input 
                placeholder="" 
                size="middle" 
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
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
                <span className="uppercase text-[9px]">Số fax</span>
              }
              className="mb-0"
            >
              <Input 
                placeholder="" 
                size="middle" 
                value={Fax}
                onChange={(e) => setFax(e.target.value)}
                />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">Số điện thoại 2</span>
              }
              className="mb-0"
            >
              <Input 
                placeholder="" 
                size="middle" 
                value={Tel2}
                onChange={(e) => setTel2(e.target.value)}
                />
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </div>
  )
}
