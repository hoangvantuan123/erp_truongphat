import { Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function HrEduTypeQuery({
  EduGrpData,

  EduGrpType,
  setEduGrpType,
  EduGrpName,
  setEduGrpName,

}) {

  const { t } = useTranslation()
  const onChangeEduGrpType = (value) => {
    if (value === null || value === undefined) {
      setEduGrpType('')
    } else {
      const itemSelect = EduGrpData.find((item) => item.Value === value)

      if (itemSelect) {
        setEduGrpType(itemSelect.Value)
      }
    }
  }

  const onChangeEduGrpName = (e) => {
    setEduGrpName(e.target.value)
  }

  return (
    <div className="flex gap-4 mt-2">
      <Row gutter={16} style={{ width: '100%' }}>
        <Col flex="auto">
          <Form variant="filled" layout="vertical">
            <Row gutter={[16, 8]}>
              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1087')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Select
                    id="typeSelect"
                    value={EduGrpType}
                    size="middle"
                    style={{ width: 300 }}
                    onChange={onChangeEduGrpType}
                    allowClear
                    options={[
                      ...(EduGrpData?.map((item) => ({
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
                    <span className="uppercase text-[9px]">{t('1091')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[300px]"
                    size="middle"
                    value={EduGrpName}
                    onChange={onChangeEduGrpName}
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
