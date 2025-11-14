import { useState, useRef, useEffect } from 'react'
import { Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import { useTranslation } from 'react-i18next'
export default function IqcPurchaseCheckStatusQuery({
  dataBizUnit,
  dataSMQcType,
  dataCustomer,
  setBizUnit,
  QCDateFrom,
  setQCDateFrom,
  QCDateTo,
  setQCDateTo,
  QcNo,
  setQcNo,
  setSMQcType,
  CustSeq,
  setCustSeq,
  ItemName,
  setItemName,
  ItemNo,
  setItemNo,
  CustName,
  setCustName,
}) {
  const gridRef = useRef(null)
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const [selectionCust, setSelectionCust] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [custSearchSh, setCustSearchSh] = useState('')
  const [modalVisibleCust, setModalVisibleCust] = useState(false)

  const onChangeQCDateFrom = (date) => {
    setQCDateFrom(date)
  }
  const onChangeQCDateTo = (date) => {
    setQCDateTo(date)
  }

  const onChangeBizUnit = (value) => {
    if (value === null || value === undefined) {
      setBizUnit('')
    } else {
      const itemSelect = dataBizUnit.find((item) => item.BizUnit === value)

      if (itemSelect) {
        setBizUnit(itemSelect.BizUnit)
      }
    }
  }

  const onChangeSMQcType = (value) => {
    if (value === null || value === undefined) {
      setSMQcType('')
    } else {
      const itemSelect = dataSMQcType.find((item) => item.Value === value)
      if (itemSelect) {
        setSMQcType(itemSelect.Value)
      } else {
        setSMQcType('')
      }
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleCust(false)
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
                <span className="uppercase text-[9px]">{t('6128')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeBizUnit}
                placeholder={t('6128')}
                allowClear
                showSearch
                options={[
                  ...(dataBizUnit?.map((item) => ({
                    label: item?.BizUnitName,
                    value: item?.BizUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('120')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={QCDateFrom}
                onChange={onChangeQCDateFrom}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('120')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={QCDateTo}
                onChange={onChangeQCDateTo}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('534')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[310px]"
                size="middle"
                value={CustName}
                onFocus={() => setModalVisibleCust(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleCust && (
                <CodeHelpCust
                  data={dataCustomer}
                  nameCodeHelp={t('534')}
                  modalVisibleCust={modalVisibleCust}
                  setModalVisibleCust={setModalVisibleCust}
                  custSearchSh={custSearchSh}
                  setCustSearchSh={setCustSearchSh}
                  selectionCust={selectionCust}
                  setSelectionCust={setSelectionCust}
                  gridRef={gridRef}
                  CustName={CustName}
                  setCustName={setCustName}
                  CustSeq={CustSeq}
                  setCustSeq={setCustSeq}
                  dropdownRef ={dropdownRef}

                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2034')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ItemName}
                onChange={(e) => {
                  setItemName(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2035')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ItemNo}
                onChange={(e) => {
                  setItemNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2627')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={QcNo}
                onChange={(e) => {
                  setQcNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">{t('474')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeSMQcType}
                allowClear
                showSearch
                placeholder={t('474')}
                options={[
                  ...(dataSMQcType?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </div>
  )
}
