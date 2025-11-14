import { Button, Form, Input, Row, Col, Select, DatePicker, Space } from 'antd'
import { useTranslation } from 'react-i18next'

export default function HrDaDeptQuery({
  SMDeptTypeData,
  SMDeptType,
  setSMDeptType,

  IsUseData,
  IsUse,
  setIsUse,

  QBegDate,
  setQBegDate,
  QEndDate,
  setQEndDate,

  DeptName,
  setDeptName,
}) {
  const { t } = useTranslation()

  const onChangeSMDeptType = (value) => {
    if (value === null || value === undefined) {
      setSMDeptType('')
    } else {
      const itemSelect = SMDeptTypeData.find((item) => item.Value === value)

      if (itemSelect) {
        setSMDeptType(itemSelect.Value)
      }
    }
  }

  const onChangeIsUseData = (value) => {
    if (value === null || value === undefined) {
      setIsUse('')
    } else {
      const itemSelect = IsUseData.find((item) => item.Value === value)

      if (itemSelect) {
        setIsUse(itemSelect.Value)
      }
    }
  }

  const handleBegDate = (date) => {
    setQBegDate(date)

    // if (dataSeq) {
    //   const selectedDateStr = date?.format('YYYYMMDD')
    //   const originalDateStr = dataSeq?.WorkDate

    //   if (selectedDateStr !== originalDateStr) {
    //     setGridData((prev) =>
    //       prev.map((item) => {
    //         if (item.Status === null || item.Status === '') {
    //           return { ...item, Status: 'U' }
    //         }
    //         return item
    //       }),
    //     )
    //   }
    // }
  }

  const handleEndDate = (date) => {
    setQEndDate(date)

    // if (dataSeq) {
    //   const selectedDateStr = date?.format('YYYYMMDD')
    //   const originalDateStr = dataSeq?.WorkDate

    //   if (selectedDateStr !== originalDateStr) {
    //     setGridData((prev) =>
    //       prev.map((item) => {
    //         if (item.Status === null || item.Status === '') {
    //           return { ...item, Status: 'U' }
    //         }
    //         return item
    //       }),
    //     )
    //   }
    // }
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('641')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={QBegDate}
                  onChange={handleBegDate}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('641')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={QEndDate}
                  onChange={handleEndDate}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('25434')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={SMDeptType}
                size="middle"
                style={{ width: 250 }}
                onChange={onChangeSMDeptType}
                allowClear
                options={[
                  ...(SMDeptTypeData?.map((item) => ({
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
                <span className="uppercase text-[10px]">{t('100000709')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={IsUse}
                size="middle"
                style={{ width: 250 }}
                allowClear
                onChange={onChangeIsUseData}
                options={[
                  ...(IsUseData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
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
