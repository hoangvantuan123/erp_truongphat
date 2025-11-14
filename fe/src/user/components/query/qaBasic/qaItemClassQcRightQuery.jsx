import { Form,  Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'

export default function QaItemClassQcRightQuery({
  dataSelectTitle

}) {
  const { t } = useTranslation()

  const onChangeSelectTitle = (value) => {
    if (value === null || value === undefined) {
      setAssetName('')
    } else {
      const itemSelect = dataAssetName.find((item) => item.Value === value)

      if (itemSelect) {
        setUMItemClassName(itemSelect.MinorName)
        setUMItemClassSeq(itemSelect.Value)
      }
    }
  }

  return (
    <div className="flex p-2 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('715')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeSelectTitle}
                showSearch
                allowClear
                placeholder={t('715')}
                value={dataSelectTitle[0]?.UMItemClassName}
                options={[
                  ...(dataSelectTitle?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                disabled={true}
              />
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </div>
  )
}
