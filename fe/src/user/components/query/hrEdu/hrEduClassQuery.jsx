import { Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import CodeHelpCombo from '../../table/codeHelp/codeHelpCombo'
import { useState } from 'react'
import CodeHelpEduClass from '../../table/codeHelp/codeHelpEduClass'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function HrEduClassQuery({
  HighClassData,
  setHighClassData,
  MidClassData,
  setMidClassData,

  UMEduHighClassName,
  setUMEduHighClassName,
  setUMEduHighClass,

  UMEduMidClassName,
  setUMEduMidClassName,
  setUMEduMidClass,

  UMEduClassName,
  setUMEduClassName,
  setUMEduClass,


}) {
  const { t } = useTranslation()

  const [dropdownVisibleHighClass, setDropdownVisibleHighClass] = useState(false)
  const [dropdownVisibleMidClass, setDropdownVisibleMidClass] = useState(false)


  const onChangeEduClassName = (e) => {
    setUMEduClassName(e.target.value)
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
                    <span className="uppercase text-[9px]">{t('19023')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[300px]"
                    size="middle"
                    value={UMEduHighClassName}
                    onFocus={() => setDropdownVisibleHighClass(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisibleHighClass && (
                    <CodeHelpCombo
                      helpData={HighClassData}
                      setHelpData={setHighClassData}
                      
                      minorName={UMEduHighClassName}
                      setMinorName={setUMEduHighClassName}
                      setValue={setUMEduHighClass}
                      setDropdownVisible={setDropdownVisibleHighClass}
                      dropdownVisible={dropdownVisibleHighClass}
                      nameCodeHelp={'19023'}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1089')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[300px]"
                    size="middle"
                    value={UMEduMidClassName}
                    onFocus={() => setDropdownVisibleMidClass(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisibleMidClass && (
                    <CodeHelpCombo
                      helpData={MidClassData}
                      setHelpData={setMidClassData}
                      
                      minorName={UMEduMidClassName}
                      setMinorName={setUMEduMidClassName}
                      setValue={setUMEduMidClass}
                      setDropdownVisible={setDropdownVisibleMidClass}
                      dropdownVisible={dropdownVisibleMidClass}
                      nameCodeHelp={'1089'}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1111')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[300px]"
                    size="middle"
                    value={UMEduClassName}
                    onChange={onChangeEduClassName}
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
