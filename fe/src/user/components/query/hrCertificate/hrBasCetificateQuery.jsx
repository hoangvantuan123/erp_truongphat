import { Form, Input, Row, Col, DatePicker, Space, Select, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useEffect, useRef, useState } from 'react'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'

export default function HrBasCetificateQuery({
  DeptData,
  setDeptData,
  dataUser,
  SMCertiTypeData,

  FromDateQ,
  setFromDateQ,
  ToDateQ,
  setToDateQ,

  SMCertiType,
  setSMCertiType,
  SMCertiTypeName,
  setSMCertiTypeName,

  DeptName,
  setDeptName,
  DeptSeq,
  setDeptSeq,

  EmpName,
  setEmpName,
  EmpSeq,
  setEmpSeq,
  EmpID,
  setEmpID,

  IsPrt,
  setIsPrt,
  IsAgree,
  setIsAgree,

}) {
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const [selectionEmpName, setSelectionEmpName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [EmpSearchSh, setEmpSearchSh] = useState('')
  const [modalVisibleEmpName, setModalVisibleEmpName] = useState(false)

  const [modalVisibleDept, setModalVisibleDept] = useState(false)
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [DeptSearchSh, setDeptSearchSh] = useState('')

  const onChangeSMCertiTypeName = (value) => {
    if (value === null || value === undefined) {
      setSMCertiType('')
      setSMCertiTypeName('')
    } else {
      const itemSelect = SMCertiTypeData.find((item) => item.Value === value)

      if (itemSelect) {
        setSMCertiType(itemSelect.Value)
        setSMCertiTypeName(itemSelect.MinorName)
      }
    }
  }

  const onChangeIsPrt = (e) => {
    if (e.target.checked) {
      setIsPrt(1)
    } else {
      setIsPrt(0)
    }
  }
  
  const onChangeIsAgree = (e) => {
    if (e.target.checked) {
      setIsAgree(1)
    } else {
      setIsAgree(0)
    }
  }

  const onChangeEmpID = (e) => {
    if(EmpID !== '') {
      setEmpID(EmpID)
    }else {
      setEmpID('')
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleEmpName(false)
      setModalVisibleDept(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)

    }
  }, [])
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1321')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={SMCertiType}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeSMCertiTypeName}
                allowClear
                options={[
                  ...(SMCertiTypeData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                placeholder={t('1321')}
                maxTagCount={'responsive'}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('167')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={FromDateQ}
                  onChange={(date) => setFromDateQ(date)}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('167')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={ToDateQ}
                  onChange={(date) => setToDateQ(date)}
                />
              </Space>
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
                className="w-[150px]"
                size="middle"
                value={DeptName}
                onFocus={() => setModalVisibleDept(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleDept && (
                <CodeHelpDepartment
                  data={DeptData}
                  nameCodeHelp={t('5')}
                  modalVisibleDept={modalVisibleDept}
                  setModalVisibleDept={setModalVisibleDept}
                  dropdownRef={dropdownRef}
                  deptSearchSh={DeptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  deptName={DeptName}
                  setDeptName={setDeptName}
                  deptSeq={DeptSeq}
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
                className="w-[150px]"
                size="middle"
                value={EmpName}
                onFocus={() => setModalVisibleEmpName(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleEmpName && (
                <CodeHelpPeople
                  data={dataUser}
                  nameCodeHelp={t('4')}
                  modalVisiblePeople={modalVisibleEmpName}
                  setModalVisiblePeople={setModalVisibleEmpName}
                  peopleSearchSh={EmpSearchSh}
                  dropdownRef={dropdownRef}
                  setPeopleSearchSh={setEmpSearchSh}
                  selectionPeople={selectionEmpName}
                  setSelectionPeople={setSelectionEmpName}
                  empName={EmpName}
                  setEmpName={setEmpName}
                  empSeq={EmpSeq}
                  setEmpSeq={setEmpSeq}
                  setUserId={setEmpID}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1452')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={EmpID}
                onChange={onChangeEmpID}
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
              <Checkbox checked={IsPrt === 1} onChange={onChangeIsPrt}>
                {t('13706')}
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
              <Checkbox checked={IsAgree === 1} onChange={onChangeIsAgree}>
                {t('30641')}
              </Checkbox>
            </Form.Item>
          </Col>

       
        </Row>
      </Form>
    </div>
  )
}
