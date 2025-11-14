import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'
export default function DefineQuery({
  dataType
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">{t('850000120')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              rules={[{ required: true, message: '' }]}
              wrapperCol={{ style: { padding: 0 } }}
              className="w-[350px]"
            >
              <Input type="text" value={dataType[0]?.DefineName} readOnly />
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </div>
  )
}
