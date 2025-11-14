import { useRef } from 'react'
import { Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'
export default function QaItemQcTitleQuery({

  dataAssetName,
  AssetName,
  setAssetName,
  setAssetSeq,
  ItemName,
  setItemName,
  ItemNo,
  setItemNo,
  Spec,
  setSpec,
}) {

  const gridPeopleRef = useRef(null)
  const { t } = useTranslation()
  const dropdownRefP = useRef()

  const onChangeAssetName = (value) => {
    if (value === null || value === undefined) {
      setAssetName('')
      setAssetSeq('')
    } else {
      const itemSelect = dataAssetName.find((item) => item.Value === value)

      if (itemSelect) {
        setAssetName(itemSelect.MinorName)
        setAssetSeq(itemSelect.Value)
      }
    }
  }

  return (
    <>
      <div className="flex p-2 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white">
        <Form layout="vertical">
          <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('3259')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                value={AssetName}
                onChange={onChangeAssetName}
                showSearch
                allowClear
                placeholder={t('3259')}
                options={[
                  ...(dataAssetName?.map((item) => ({
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
                  <span className="uppercase text-[9px]">
                    {t('2090')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={ItemName}
                  onChange={(e) => {
                    setItemName(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>
          

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('2091')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={ItemNo}
                  onChange={(e) => {
                    setItemNo(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('551')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={Spec}
                  onChange={(e) => {
                    setSpec(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

    </>
  )
}
