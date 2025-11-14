import { Form, Row, Col, Input } from 'antd'
import { useTranslation } from 'react-i18next'

export default function QaCustQcTitleRightQuery({
  CustName,
  SMQCTypeName,
}) {
  const { t } = useTranslation()

  return (
    <div className="flex p-2 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('713')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder={t('713')}
                className="w-[150px]"
                size="middle"
                value={CustName}
                style={{ backgroundColor: '#e8f0ff' }}
                disabled
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('474')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={SMQCTypeName}
                style={{ backgroundColor: '#e8f0ff' }}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
