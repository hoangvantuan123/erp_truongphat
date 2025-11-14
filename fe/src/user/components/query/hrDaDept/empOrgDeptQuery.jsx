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

export default function EmpOrgDeptQuery({
  orgTypeData,

  orgType,
  setOrgType,
  orgTypeName,
  setOrgTypeName,

  DeptName,
  setDeptName,

  BaseDate,
  setBaseDate,

  isOut,
  setIsOut,

  isRetire,
  setIsRetire,

  isNotOne,
  setIsNotOne,

  isWkDept,
  setIsWkDept,

  IsLowDept,
  setIsLowDept,
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

  const onChangeIsOut = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsOut(data)
  }

  const onChangeIsRetire = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsRetire(data)
  }

  const onChangeIsNotOne = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsNotOne(data)
  }

  const onChangeIsWkDept = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsWkDept(data)
  }

  const onChangeIsLowDept = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsLowDept(data)
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
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox checked={isOut === '1'} onChange={onChangeIsOut}>
                {t('11234')}
              </Checkbox>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox checked={isWkDept === '1'} onChange={onChangeIsWkDept}>
                {t('32022')}
              </Checkbox>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox checked={isRetire === '1'} onChange={onChangeIsRetire}>
                {t('18507')}
              </Checkbox>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox checked={isNotOne === '1'} onChange={onChangeIsNotOne}>
                {t('27296')}
              </Checkbox>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('5')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={DeptName}
                size="middle"
                style={{ width: 150 }}
                onChange={(e) => setDeptName(e.target.value)}
                allowClear
                disabled
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox checked={IsLowDept === '1'} onChange={onChangeIsLowDept}>
                {t('763')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
