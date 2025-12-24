import { useEffect, useState } from 'react'
import { Form, Input, Row, Col, Select, Checkbox } from 'antd'

import { useTranslation } from 'react-i18next'
import DropdownUMToolKindName from '../../sheet/query/dropdownUMToolKindName'

import DropdownEmp from '../../sheet/query/dropdownEmp'
import DropdownAsset from '../../sheet/query/dropdownAsset'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import { CompactSelection } from '@glideapps/glide-data-grid'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function HrEduPerRstQuery({
  EmpData,
  setEmpData,
  dataUser,
  dropdownRefP,
  setSelectEmp,
  selectEmp,
  empName,
  setEmpName,
  handleOnChangeEmpName,
  empSeq,
  setEmpSeq,
  userId,
  setUserId,
  gridPeopleRef,

  DeptName,
  setDeptName,
  DeptSeq,
  setDeptSeq,

  PosName,
  setPosName,
  PosSeq,
  setPosSeq,
  
  UMJpName,
  setUMJpName,
  UMJpSeq,
  setUMJpSeq,
}) {

  const [dropdownVisibleEmp, setDropdownVisibleEmp] = useState(false)
  const { t } = useTranslation()
  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const onChangePosName = (e) => {
    setToolNo(e.target.value)
  }

  const onChangUMJpName = (e) => {
    setSpec(e.target.value)
  }



  
  return (
    <div className="flex gap-4 mt-2">
      <Row gutter={16} style={{ width: '100%' }}>
        <Col flex="auto">
          <Form variant="filled" layout="vertical">
            <Row gutter={[16, 8]}>
              <Col>
                <Form.Item
                  label={<span className="uppercase text-[9px]">{t('4')}</span>}
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[300px]"
                    size="middle"
                    value={empName}
                    onFocus={() => setDropdownVisibleEmp(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisibleEmp && (
                    <CodeHelpPeople
                      data={EmpData}
                      nameCodeHelp={t('4')}
                      modalVisiblePeople={dropdownVisibleEmp}
                      setModalVisiblePeople={setDropdownVisibleEmp}
                      peopleSearchSh={peopleSearchSh}
                      setPeopleSearchSh={setPeopleSearchSh}
                      selectionPeople={selectionPeople}
                      setSelectionPeople={setSelectionPeople}
                      empName={empName}
                      setEmpName={setEmpName}
                      userId={userId}
                      setUserId={setUserId}
                      setEmpSeq={setEmpSeq}
                      empSeq={empSeq}
                      setSelectEmp={setSelectEmp}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1452')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[300px]"
                    size="middle"
                    value={userId}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={<span className="uppercase text-[9px]">{t('5')}</span>}
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[250px]"
                    size="middle"
                    value={DeptName}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('373')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[250px]"
                    size="middle"
                    value={PosName}
                    onChange={onChangePosName}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('642')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[250px]"
                    size="middle"
                    value={UMJpName}
                    onChange={onChangUMJpName}
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
