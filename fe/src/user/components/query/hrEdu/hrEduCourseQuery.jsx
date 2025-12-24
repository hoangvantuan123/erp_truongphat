import { Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import CodeHelpCombo from '../../table/codeHelp/codeHelpCombo'
import { useState } from 'react'
import { CompactSelection } from '@glideapps/glide-data-grid'
import CodeHelpEduClass from '../../table/codeHelp/codeHelpEduClass'
import CodeHelpEduType from '../../table/codeHelp/codeHelpEduType'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function HrEduCourseQuery({
  HighClassData,
  setHighClassData,
  MidClassData,
  setMidClassData,
  ClassData,
  setClassData,
  EduGrpData,
  EduTypeData,
  setEduTypeData,

  EduGrpType,
  setEduGrpType,

  UMEduHighClassName,
  setUMEduHighClassName,
  setUMEduHighClass,

  UMEduMidClassName,
  setUMEduMidClassName,
  setUMEduMidClass,

  UMEduClassName,
  setUMEduClassName,
  setUMEduClass,

  eduTypeName,
  setEduTypeName,
  setEduTypeSeq,

  EduCourseName,
  setEduCourseName,

}) {
  const { t } = useTranslation()

  const [dropdownVisibleHighClass, setDropdownVisibleHighClass] = useState(false)
  const [dropdownVisibleMidClass, setDropdownVisibleMidClass] = useState(false)
  const [dropdownVisibleClass, setDropdownVisibleClass] = useState(false)
  const [dropdownVisibleEduType, setDropdownVisibleEduType] = useState(false)

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

  const onChangeEduCourseName = (e) => {
    setEduCourseName(e.target.value)
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
                    className="w-[200px]"
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
                    className="w-[200px]"
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
                    <span className="uppercase text-[9px]">{t('1087')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[200px]"
                    size="middle"
                    value={UMEduClassName}
                    onFocus={() => setDropdownVisibleClass(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisibleClass && (
                    <CodeHelpEduClass
                      helpData={ClassData}
                      setHelpData={setClassData}
                      
                      minorName={UMEduClassName}
                      setMinorName={setUMEduClassName}
                      setValue={setUMEduClass}
                      setDropdownVisible={setDropdownVisibleClass}
                      dropdownVisible={dropdownVisibleClass}
                      nameCodeHelp={'1087'}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1090')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[200px]"
                    size="middle"
                    value={eduTypeName}
                    onFocus={() => setDropdownVisibleEduType(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisibleEduType && (
                    <CodeHelpEduType
                      helpData={EduTypeData}
                      setHelpData={setEduTypeData}
                      
                      minorName={eduTypeName}
                      setMinorName={setEduTypeName}
                      setValue={setEduTypeSeq}
                      setDropdownVisible={setDropdownVisibleEduType}
                      dropdownVisible={dropdownVisibleEduType}
                      nameCodeHelp={'1090'}
                    />
                  )}
                </Form.Item>
              </Col>

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
                    style={{ width: 200 }}
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
                    <span className="uppercase text-[9px]">{t('1111')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[200px]"
                    size="middle"
                    value={EduCourseName}
                    onChange={onChangeEduCourseName}
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
