import { Form, Input, Row, Col, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function HrEduLecturerInsiteQuery({
  DeptData,
  setDeptData,
  deptSearchSh,
  setDeptSearchSh,
  selectionDept,
  setSelectionDept,
  deptName,
  setDeptName,
  deptSeq,
  setDeptSeq,
  resetTable,
  gridDeptRef,

  dataUser,
  dropdownRefP,
  empName,
  setEmpName,
  handleOnChangeEmpName,
  peopleSearchSh,
  setPeopleSearchSh,
  selectionPeople,
  setSelectionPeople,
  empSeq,
  setEmpSeq,
  userId,
  setUserId,
  gridPeopleRef,

  payTypeData,
  setPayTypeData,

  PayTypeName,
  setPayTypeName,
  setPayType,
}) {
  const { t } = useTranslation()
  const [dropdownVisibleDept, setDropdownVisibleDept] = useState(false)
  const [dropdownVisibleEmp, setDropdownVisibleEmp] = useState(false)
  const [selectEmp, setSelectEmp] = useState(null)


  const onChangePayType = (value) => {
    if (value === null || value === undefined) {
      setPayTypeName('')
      setPayType('')
    } else {
      const itemSelect = payTypeData.find((item) => item.Value === value)

      if (itemSelect) {
        setPayType(itemSelect.Value)
      }
    }
  }


  return (
    <div className="flex gap-4 border-b">
      <Row
        gutter={16}
        style={{ width: '100%', marginBottom: '5px', margin: '5px' }}
      >
        <Col flex="auto">
          <Form variant="filled" layout="vertical">
            <Row gutter={[16, 8]}>
              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1313')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Select
                    id="typeSelect"
                    value={PayTypeName}
                    size="middle"
                    style={{ width: 200 }}
                    onChange={onChangePayType}
                    allowClear
                    options={[
                      ...(payTypeData?.map((item) => ({
                        label: item?.MinorName,
                        value: item?.Value,
                      })) || []),
                    ]}
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
                    className="w-[200px]"
                    size="middle"
                    value={deptName}
                    onFocus={() => setDropdownVisibleDept(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />

                  {dropdownVisibleDept && (
                    <CodeHelpDepartment
                      data={DeptData}
                      nameCodeHelp={t('5')}
                      modalVisibleDept={dropdownVisibleDept}
                      setModalVisibleDept={setDropdownVisibleDept}
                      dropdownRef={null}
                      deptSearchSh={deptSearchSh}
                      setDeptSearchSh={setDeptSearchSh}
                      selectionDept={selectionDept}
                      setSelectionDept={setSelectionDept}
                      gridRef={gridDeptRef}
                      deptName={deptName}
                      setDeptName={setDeptName}
                      deptSeq={deptSeq}
                      setDeptSeq={setDeptSeq}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={<span className="uppercase text-[9px]">{t('4')}</span>}
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[200px]"
                    size="middle"
                    value={empName}
                    onFocus={() => setDropdownVisibleEmp(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisibleEmp && (
                    <CodeHelpPeople
                      data={dataUser}
                      nameCodeHelp={t('4')}
                      modalVisiblePeople={dropdownVisibleEmp}
                      setModalVisiblePeople={setDropdownVisibleEmp}
                      dropdownRef={null}
                      peopleSearchSh={peopleSearchSh}
                      setPeopleSearchSh={setPeopleSearchSh}
                      selectionPeople={selectionPeople}
                      setSelectionPeople={setSelectionPeople}
                      gridRef={gridDeptRef}
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
                    className="w-[200px]"
                    size="middle"
                    value={userId}
                    disabled
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
