import { Form, Input, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'

export default function DaDeptQuery({ DeptName, setDeptName }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('5')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={DeptName}
                onChange={(e) => {
                  setDeptName(e.target.value)
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
