import { Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function HrEduLecturerOutsiteQuery({
  payTypeData,
  setPayTypeData,

  PayTypeName,
  setPayTypeName,
  setPayType,

  lecturerName,
  setLecturerName,
}) {
  const { t } = useTranslation()

  const onChangePayType = (value) => {
    if (value === null || value === undefined) {
      setPayType('')
      setPayTypeName('')
    } else {
      const itemSelect = payTypeData.find((item) => item.Value === value)

      if (itemSelect) {
        setPayType(itemSelect.Value)
        setPayTypeName(itemSelect.MinorName)
      }
    }
  }


  return (
    <div className="flex gap-4 border-b">
      <Row
        gutter={16}
        style={{ width: '100%', marginBottom: '5px', margin: '5px' }}
      >
        <Col flex="auto">
          <Form variant="filled" layout="vertical">
            <Row gutter={[16, 8]}>
              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1313')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Select
                    id="typeSelect"
                    value={PayTypeName}
                    size="middle"
                    style={{ width: 200 }}
                    onChange={onChangePayType}
                    allowClear
                    options={[
                      ...(payTypeData?.map((item) => ({
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
                    <span className="uppercase text-[9px]">{t('1775')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[200px]"
                    onChange={(e) => {
                      setLecturerName(e.target.value)
                    }}
                    size="middle"
                    value={lecturerName}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
