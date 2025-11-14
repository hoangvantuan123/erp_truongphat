import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker, Space } from 'antd'
import { useTranslation } from 'react-i18next'
export default function HrBasCareerSeqQuery({
  dataSeq,

}) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('Nhân viên')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <Input
                  placeholder=""
                  className="w-[250px]"
                  size="middle"
                  readOnly
                  value={dataSeq?.EmpName}
                  style={{ backgroundColor: '#e8f0ff' }}
                />

              </Space>
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('Mã nhân viên')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <Input
                  placeholder=""
                  className="w-[250px]"
                  size="middle"
                  readOnly
                  value={dataSeq?.EmpID}
                  style={{ backgroundColor: '#e8f0ff' }}
                />

              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('Công ty làm việc ')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <Input
                  placeholder=""
                  className="w-[250px]"
                  size="middle"
                  readOnly
                  value={dataSeq?.CoNm}
                  style={{ backgroundColor: '#e8f0ff' }}
                />

              </Space>
            </Form.Item>
          </Col>




        </Row>
      </Form>
    </div >
  )
}
