import { Form, Input, Row, Col, DatePicker, Space, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useEffect, useRef, useState } from 'react'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'

export default function HrLaborContractQuery({
  dataUser,
  ContractKindData,

  FromDateQ,
  setFromDateQ,
  ToDateQ,
  setToDateQ,
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
}) {
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const [selectionEmpName, setSelectionEmpName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [EmpSearchSh, setEmpSearchSh] = useState('')
  const [modalVisibleEmpName, setModalVisibleEmpName] = useState(false)
  const [selectEmp, setSelectEmp] = useState(null)

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

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleEmpName(false)
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
              label={<span className="uppercase text-[10px]">{t('28782')}</span>}
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
              label={<span className="uppercase text-[10px]">{t('28783')}</span>}
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
                  setSelectEmp={setSelectEmp}

                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('1452')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={EmpID}
                onChange={(e) => {
                  setEmpID(e.target.value)
                }}
                disabled
              />
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
        </Row>
      </Form>
    </div>
  )
}
