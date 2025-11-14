import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker, Space } from 'antd'
import { useTranslation } from 'react-i18next'
export default function PdsfcWorkReportSeqQuery({
  dataSeq,
  checkPageA

}) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1985')}</span>}
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
                  value={checkPageA ? '' : dataSeq?.WorkOrderNo}
                  style={{ backgroundColor: '#e8f0ff' }}
                />

              </Space>
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1524')}</span>}
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
                  value={checkPageA ? '' : dataSeq?.ProdPlanNo}
                  style={{ backgroundColor: '#e8f0ff' }}
                />

              </Space>
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('510')}</span>}
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
                  value={checkPageA ? '' : dataSeq?.ProcName}
                  style={{ backgroundColor: '#e8f0ff' }}
                />

              </Space>
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('10000860')}</span>}
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
                  value={checkPageA ? '' : dataSeq?.AssyItemNo}
                  style={{ backgroundColor: '#e8f0ff' }}
                />

              </Space>
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2102')}</span>}
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
                  value={checkPageA ? '' : dataSeq?.AssyItemName}
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
