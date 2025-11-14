import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Checkbox,
} from 'antd'
import { useTranslation } from 'react-i18next'

export default function OrgDeptQuery({
  orgTypeData,

  orgType,
  setOrgType,
  orgTypeName,
  setOrgTypeName,

  BaseDate,
  setBaseDate,

  IsDisDate,
  setIsDisDate,

}) {
  const { t } = useTranslation()

  const onChangeOrgType = (value) => {
    if (value === null || value === undefined) {
      setOrgType('')
      setOrgTypeName('')
    } else {
      const itemSelect = orgTypeData.find((item) => item.OrgType === value)

      if (itemSelect) {
        setOrgType(itemSelect.OrgType)
        setOrgTypeName(itemSelect.OrgTypeName)
      }
    }
  }

  const onChangeIsDisDate = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsDisDate(data)
  }

  const handleBaseDate = (date) => {
    setBaseDate(date)
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('599')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={orgType}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeOrgType}
                allowClear
                options={[
                  ...(orgTypeData?.map((item) => ({
                    label: item?.OrgTypeName,
                    value: item?.OrgType,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('20843')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={BaseDate}
                  onChange={handleBaseDate}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]"></span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox
                checked={IsDisDate === '1'}
                onChange={onChangeIsDisDate}
              >
                {t('14315')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
