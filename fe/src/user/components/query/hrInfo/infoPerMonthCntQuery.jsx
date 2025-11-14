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

export default function InfoPerMonthCntQuery({
  GrpSortNameData,
  EntRetTypeNameData,

  GrpSortName1,
  setGrpSortName1,

  GrpSortName2,
  setGrpSortName2,

  EntRetTypeName,
  setEntRetTypeName,

  ym,
  setYm,

  chkOrg,
  setchkOrg,

}) {
  const { t } = useTranslation()

  const onChangeGrpSortName1 = (value) => {
    if (value === null || value === undefined) {
      setGrpSortName1('')
    } else {
      const itemSelect = GrpSortNameData.find((item) => item.Value === value)

      if (itemSelect) {
        setGrpSortName1(itemSelect.Value)
      }
    }
  }

  const onChangeGrpSortName2 = (value) => {
    if (value === null || value === undefined) {
      setGrpSortName2('')
    } else {
      const itemSelect = GrpSortNameData.find((item) => item.Value === value)

      if (itemSelect) {
        setGrpSortName2(itemSelect.Value)
      }
    }
  }

  const onChangeEntRetTypeName = (value) => {
    if (value === null || value === undefined) {
      setEntRetTypeName('')
    } else {
      const itemSelect = EntRetTypeNameData.find((item) => item.Value === value)

      if (itemSelect) {
        setEntRetTypeName(itemSelect.Value)
      }
    }
  }

  const onChangechkOrg = (value) => {
    const data = value.target.checked ? '1' : '0'
    setchkOrg(data)
  }

  const handleYm = (date) => {
    setYm(date)
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">

        <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('1354')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={ym}
                  onChange={handleYm}
                />
              </Space>
            </Form.Item>
          </Col>
          
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2942')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={GrpSortName1}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeGrpSortName1}
                allowClear
                options={[
                  ...(GrpSortNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2943')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={GrpSortName2}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeGrpSortName2}
                allowClear
                options={[
                  ...(GrpSortNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('48325')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={EntRetTypeName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeEntRetTypeName}
                allowClear
                options={[
                  ...(EntRetTypeNameData?.map((item) => ({
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
                <span className="uppercase text-[10px]"></span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox
                checked={chkOrg === '1'}
                onChange={onChangechkOrg}
              >
                {t('50384')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
