
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  Checkbox,
} from 'antd'

import { useTranslation } from 'react-i18next'

export default function TransMatDetailsMoreQuery({
  
  typeProductData,
  setTypeProduct,

  lotNo,
  setLotNo,
  setIsTrans,

}) {
  const { t } =  useTranslation();

  const onChangeTypeProduct = (value) => {

    setTypeProduct(value)
  }

  const onChangeCheckBox = (value) => {

    if(value.target.checked == true){
      setIsTrans(1);
    }else{
      setIsTrans(0);
    }
    
  }
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-3 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3259')}</span>}
              className="mb-0"
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 250,
                }}
                onChange={onChangeTypeProduct}
                options={[
                  { label: 'All', value: '0' },
                  ...(typeProductData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('25431')}</span>}
              className="mb-0"
            >
              <Input
                placeholder=""
                value={lotNo}
                onChange={(e) => setLotNo(e.target.value)}
                size="middle"
                style={{
                  width: 250,
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('')}</span>}
              className="mb-0"
            >
              <Checkbox onChange={onChangeCheckBox}>{t('Truy vấn chuyển vật liệu')}</Checkbox>
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </div>
  )
}
