import {
  Form,
  Input,
  Row,
  Col,
  Space,
  DatePicker,
  Checkbox,
  Select,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useEffect, useRef, useState } from 'react'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'

export default function HrLaborContractPrintQuery({
  DeptData,
  ContractKindData,
  CertificateTypeData,

  dataUser,
  EmpTypeNameData,

  ContractKind,
  setContractKind,
  ContractKindName,
  setContractKindName,

  EmpName,
  setEmpName,
  EmpSeq,
  setEmpSeq,
  EmpID,
  setEmpID,

  BeginDate,
  setBeginDate,
  EndDate,
  setEndDate,

  DeptName,
  setDeptName,
  DeptSeq,
  setDeptSeq,

  EmpTypeName,
  setEmpTypeName,
  setEmpType,

  CertificateType,
  setCertificateType,
  CertificateTypeName,
  setCertificateTypeName,
}) {
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const [modalVisibleDept, setModalVisibleDept] = useState(false)
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [DeptSearchSh, setDeptSearchSh] = useState('')

  const [modalVisibleEmpName, setModalVisibleEmpName] = useState(false)
  const [selectionEmpName, setSelectionEmpName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [EmpSearchSh, setEmpSearchSh] = useState('')

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleDept(false)
      setModalVisibleEmpName(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onChangeEmpTypeName = (e) => {
    if (e === null || e === undefined) {
      setEmpTypeName('')
      setEmpType('')
    } else {
      const itemSelect = EmpTypeNameData.find((item) => item.Value === e)

      if (itemSelect) {
        setEmpType(itemSelect.Value)
        setEmpTypeName(itemSelect.MinorName)
      }
    }
  }

    const onChangeCertificateType = (e) => {
    if (e === null || e === undefined) {
      setCertificateTypeName('')
      setCertificateType('')
    } else {
      const itemSelect = CertificateTypeData.find((item) => item.value === e)

      if (itemSelect) {
        setCertificateType(itemSelect.value)
        setCertificateTypeName(itemSelect.label)
      }
    }
  }

  const onChangeContractKind = (value) => {
    if (value === null || value === undefined) {
      setContractKind('')
      setContractKindName('')
    } else {
      const itemSelect = ContractKindData.find((item) => item.Value === value)

      if (itemSelect) {
        setContractKind(itemSelect.Value)
        setContractKindName(itemSelect.MinorName)
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('712')}</span>}
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
                  nameCodeHelp={t('367')}
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
              label={<span className="uppercase text-[10px]">{t('501')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={ContractKind}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeContractKind}
                allowClear
                options={[
                  ...(ContractKindData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                placeholder={t('501')}
                maxTagCount={'responsive'}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('191')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={BeginDate}
                  onChange={(date) => setBeginDate(date)}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('232')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={EndDate}
                  onChange={(date) => setEndDate(date)}
                />
              </Space>
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
                disabled
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('100001446')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={EmpTypeName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeEmpTypeName}
                allowClear
                options={[
                  ...(EmpTypeNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                placeholder={t('635')}
                maxTagCount={'responsive'}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">
                  {t('Loại phiếu in')}
                </span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={CertificateTypeName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeCertificateType}
                allowClear
                options={CertificateTypeData || []}
                placeholder={t('800000197')}
                maxTagCount={'responsive'}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
