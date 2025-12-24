import { CompactSelection } from '@glideapps/glide-data-grid'
import { Col, DatePicker, Form, Input, Row, Select, Space } from 'antd'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'

export default function PjtProjectListQuery({
  dataBizUnit,
  dataCustomer,
  dataSMSalesRecognize,
  dataSMSalesReceipt,
  dataSMExpKindName,

  setBizUnit,
  PJTTypeNameData,
  PJTTypeName,
  setPJTTypeName,
  setPJTType,

  PlanFrDate,
  setPlanFrDate,
  PlanToDate,
  setPlanToDate,

  setSelectEmp,
  DeptData,

  ChargeDeptName,
  setChargeDeptName,
  ChargeDeptSeq,
  setChargeDeptSeq,
  gridDeptRef,

  dataUser,
  ChargeEmpName,
  setChargeEmpName,

  empSeq,
  setEmpSeq,
  userId,
  setUserId,

  PJTName,
  setPJTName,

  PJTNo,
  setPJTNo,

  ResultStdUnitName,
  setResultStdUnitName,

  CustSeq,
  setCustSeq,
  CustName,
  setCustName,

  setSMSalesRecognizeName,

  SMSalesReceiptName,
  setSMSalesReceiptName,
  SMSalesReceipt,

  WBSResrcLevel,
  setWBSResrcLevel,

  SMExpKindName,
  setSMExpKindName,

  QryFr,
  setQryFr,
  QryTo,
  setQryTo,
}) {
  const gridRef = useRef(null)
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const [dropdownVisibleDept, setDropdownVisibleDept] = useState(false)
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [deptSearchSh, setDeptSearchSh] = useState('')

  const [selectionCust, setSelectionCust] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [custSearchSh, setCustSearchSh] = useState('')
  const [modalVisibleCust, setModalVisibleCust] = useState(false)

  const [dropdownVisibleEmp, setDropdownVisibleEmp] = useState(false)

  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const onChangePJTTypeName = (value) => {
    if (value === null || value === undefined) {
      setPJTType('')
      setPJTTypeName('')
    } else {
      const itemSelect = PJTTypeNameData?.find((item) => item.PJTTypeSeq === value)

      if (itemSelect) {
        setPJTType(itemSelect.PJTTypeSeq)
        setPJTTypeName(itemSelect.PJTTypeName)
      }
    }
  }

  const handlePlanFrDate = (date) => {
    setPlanFrDate(date)
  }

  const handlePlanToDate = (date) => {
    setPlanToDate(date)
  }


  const handleQryFr = (date) => {
    setQryFr(date)
  }

  const onChangeBizUnit = (value) => {
    if (value === null || value === undefined) {
      setBizUnit('')
    } else {
      const itemSelect = dataBizUnit.find((item) => item.BizUnit === value)

      if (itemSelect) {
        setBizUnit(itemSelect.BizUnit)
      }
    }
  }

  const onChangeSMSalesRecognizeName = (value) => {
    if (value === null || value === undefined) {
      setSMSalesRecognizeName('')
    } else {
      const itemSelect = dataSMSalesRecognize.find(
        (item) => item.BizUnit === value,
      )

      if (itemSelect) {
        setSMSalesRecognizeName(itemSelect.BizUnit)
      }
    }
  }

  const onChangeSMSalesReceiptName = (value) => {
    if (value === null || value === undefined) {
      setSMSalesReceiptName('')
    } else {
      const itemSelect = dataSMSalesRecognize.find(
        (item) => item.BizUnit === value,
      )

      if (itemSelect) {
        setSMSalesReceiptName(itemSelect.BizUnit)
      }
    }
  }

  const onChangeSMExpKindName = (value) => {
    if (value === null || value === undefined) {
      setSMExpKindName('')
    } else {
      const itemSelect = dataSMExpKindName.find(
        (item) => item.MinorName === value,
      )

      if (itemSelect) {
        setSMExpKindName(itemSelect.MinorName)
      }
    }
  }

  const handleQryTo = (date) => {
    setQryTo(date)
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeBizUnit}
                allowClear
                showSearch
                placeholder={t('2')}
                options={[
                  ...(dataBizUnit?.map((item) => ({
                    label: item?.BizUnitName,
                    value: item?.BizUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('936')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={PlanFrDate}
                  onChange={handlePlanFrDate}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('936')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={PlanToDate}
                  onChange={handlePlanToDate}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('217')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={QryFr}
                  onChange={handleQryFr}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('217')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={QryTo}
                  onChange={handleQryTo}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('372')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={PJTTypeName}
                size="middle"
                style={{ width: 150 }}
                allowClear
                onChange={onChangePJTTypeName}
                options={[
                  ...(PJTTypeNameData?.map((item) => ({
                    label: item?.PJTTypeName,
                    value: item?.PJTTypeSeq,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('852')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={PJTName}
                onChange={(e) => {
                  setPJTName(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('371')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={PJTNo}
                onChange={(e) => {
                  setPJTNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>
          {/* 
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('490')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={ContractFrDate}
                  onChange={handleContractFrDate}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('490')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={ContractToDate}
                  onChange={handleContractToDate}
                />
              </Space>
            </Form.Item>
          </Col> */}

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('9987')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ResultStdUnitName}
                onChange={(e) => {
                  setResultStdUnitName(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('19795')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[310px]"
                size="middle"
                value={CustName}
                onFocus={() => setModalVisibleCust(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleCust && (
                <CodeHelpCust
                  data={dataCustomer}
                  nameCodeHelp={t('19795')}
                  modalVisibleCust={modalVisibleCust}
                  setModalVisibleCust={setModalVisibleCust}
                  custSearchSh={custSearchSh}
                  setCustSearchSh={setCustSearchSh}
                  selectionCust={selectionCust}
                  setSelectionCust={setSelectionCust}
                  gridRef={gridRef}
                  CustName={CustName}
                  setCustName={setCustName}
                  CustSeq={CustSeq}
                  setCustSeq={setCustSeq}
                  dropdownRef={dropdownRef}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1263')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ChargeEmpName}
                onFocus={() => setDropdownVisibleEmp(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisibleEmp && (
                <CodeHelpPeople
                  data={dataUser}
                  nameCodeHelp={t('1263')}
                  modalVisiblePeople={dropdownVisibleEmp}
                  setModalVisiblePeople={setDropdownVisibleEmp}
                  dropdownRef={null}
                  peopleSearchSh={peopleSearchSh}
                  setPeopleSearchSh={setPeopleSearchSh}
                  selectionPeople={selectionPeople}
                  setSelectionPeople={setSelectionPeople}
                  gridRef={gridDeptRef}
                  empName={ChargeEmpName}
                  setEmpName={setChargeEmpName}
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
              label={<span className="uppercase text-[10px]">{t('758')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ChargeDeptName}
                onFocus={() => setDropdownVisibleDept(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />

              {dropdownVisibleDept && (
                <CodeHelpDepartment
                  data={DeptData}
                  nameCodeHelp={t('758')}
                  modalVisibleDept={dropdownVisibleDept}
                  setModalVisibleDept={setDropdownVisibleDept}
                  dropdownRef={dropdownRef}
                  deptSearchSh={deptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  deptName={ChargeDeptName}
                  setDeptName={setChargeDeptName}
                  deptSeq={ChargeDeptSeq}
                  setDeptSeq={setChargeDeptSeq}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('949')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={SMExpKindName}
                size="middle"
                style={{ width: 150 }}
                allowClear
                onChange={onChangeSMExpKindName}
                options={[
                  ...(dataSMExpKindName?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1415')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeSMSalesRecognizeName}
                allowClear
                showSearch
                placeholder={t('1415')}
                options={[
                  ...(dataSMSalesRecognize?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('9313')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeSMSalesReceiptName}
                allowClear
                showSearch
                placeholder={t('9313')}
                options={[
                  ...(dataSMSalesReceipt?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('49427')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={WBSResrcLevel}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
