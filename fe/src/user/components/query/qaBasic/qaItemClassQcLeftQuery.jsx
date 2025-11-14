import {  useEffect, useRef } from 'react'
import {  Form,  Row, Col,  Select } from 'antd'
import { useTranslation } from 'react-i18next'

export default function QaItemClassQcLeftQuery({
  dataAssetName,
  dataClassTypeName,
  setAssetTypeName,
  setAssetType,
  setClassTypeName,
  setClassType,
}) {
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const onChangeAssetName = (value) => {
    if (value === null || value === undefined) {
      setAssetTypeName('')
      setAssetType(0)
    } else {
      const itemSelect = dataAssetName.find((item) => item.Value === value)

      if (itemSelect) {
        setAssetTypeName(itemSelect.MinorName)
        setAssetType(itemSelect.Value)
      }
    }
  }

  const onChangeClassTypeName = (value) => {
    if (value === null || value === undefined) {
      setClassTypeName('')
      setClassType('')
    } else {
      const itemSelect = dataClassTypeName.find((item) => item.Value === value)

      if (itemSelect) {
        setClassTypeName(itemSelect.MinorName)
        setClassType(itemSelect.Value)
      }
    }
  }

  return (
    <div className="flex p-2 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1953')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeAssetName}
                showSearch
                allowClear
                placeholder={t('1953')}
                options={[
                  ...(dataAssetName?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('715')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeClassTypeName}
                showSearch
                allowClear
                placeholder={t('715')}
                options={[
                  ...(dataClassTypeName?.map((item) => ({
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
