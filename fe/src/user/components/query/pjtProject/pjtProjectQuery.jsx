import { CompactSelection } from '@glideapps/glide-data-grid'
import { Checkbox, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CodeHelpCurrency from '../../table/codeHelp/codeHelpCurrency'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import { set } from 'lodash'

export default function PjtProjectQuery({
  dataBizUnit,
  dataCustomer,
  dataPjtType,
  dataSMSalesRecognize,
  dataSMSalesReceipt,
  dataSMExpKindName,
  dataCurrency,
  dataInoutType,

  PJTTypeName,
  setPJTTypeName,
  setPjtType,
  setIsUse,

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
  setChargeEmp,

  empSeq,
  setEmpSeq,
  userId,
  setUserId,

  ContractFrDate,
  setContractFrDate,
  ContractToDate,
  setContractToDate,

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

  SMSalesRecognizeName,
  setSMSalesRecognizeName,
  setSMSalesRecognize,

  SMSalesReceiptName,
  setSMSalesReceipt,

  WBSResrcLevel,
  setWBSResrcLevel,

  InOutTypeName,
  setInOutType,

  SMExpKindName,
  setSMExpKindName,
  setSMExpKind,

  CurrName,
  setCurrName,
  setCurrSeq,

  CurrRate,
  setCurrRate,

  RegDate,
  setRegDate,
  ContractDate,
  setContractDate,

  BizUnitName,
  setBizUnitName,
  setBizUnit,

  Remark,
  setRemark,
  CfmCode,
  setCfmCode,
  ProcDate,
  setProcDate,
  handleConfirmProject

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

  const [dropdownVisibleCurr, setDropdownVisibleCurr] = useState(false)
  const [selectionCurr, setSelectionCurr] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [currSearchSh, setCurrSearchSh] = useState('')

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
      setPjtType('')
    } else {
      const itemSelect = dataPjtType?.find((item) => item.PJTTypeSeq === value)

      if (itemSelect) {
        setPjtType(itemSelect.PJTTypeSeq)
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

  const handleContractFrDate = (date) => {
    setContractFrDate(date)
  }

  const handleRegDate = (date) => {
    setRegDate(date)
  }

  const onChangeBizUnit = (value) => {
    if (value === null || value === undefined) {
      setBizUnit('')
      setBizUnitName('')
    } else {
      const itemSelect = dataBizUnit.find((item) => item.BizUnit === value)

      if (itemSelect) {
        setBizUnitName(itemSelect.BizUnitName)
        setBizUnit(itemSelect.BizUnit)
      }
    }
  }

  const onChangeSMSalesRecognizeName = (value) => {
    if (value === null || value === undefined) {
      setSMSalesRecognize('')
    } else {
      const itemSelect = dataSMSalesRecognize.find(
        (item) => item.Value === value,
      )

      if (itemSelect) {
        setSMSalesRecognize(itemSelect.Value)
      }
    }
  }

  const onChangeSMSalesReceiptName = (value) => {
    if (value === null || value === undefined) {
      setSMSalesReceipt('')
    } else {
      const itemSelect = dataSMSalesReceipt.find(
        (item) => item.Value === value,
      )

      if (itemSelect) {
        setSMSalesReceipt(itemSelect.Value)
      }
    }
  }

  const onChangeSMExpKindName = (value) => {
    if (value === null || value === undefined) {
      setSMExpKindName('')
      setSMExpKind('')
    } else {
      const itemSelect = dataInoutType.find(
        (item) => item.Value === value,
      )

      if (itemSelect) {
        setSMExpKindName(itemSelect.MinorName)
        setSMExpKind(itemSelect.Value)
      }
    }
  }

  const handleContractDate = (date) => {
    setContractDate(date)
  }

    const handleProcDate = (date) => {
    setProcDate(date)
  }

  const handleContractToDate = (date) => {
    setContractToDate(date)
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisibleCurr(false)
      setDropdownVisibleEmp(false)
      setDropdownVisibleDept(false)
      setModalVisibleCust(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

    const onChangeCfmCode = (e) => {
    const value = e.target.checked ? 1 : 0
    setCfmCode(value)
    handleConfirmProject()
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
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
                  ...(dataPjtType?.map((item) => ({
                    label: item?.PJTTypeName,
                    value: item?.PJTTypeSeq,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

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
                disabled
                onChange={(e) => {
                  setResultStdUnitName(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

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
                value={BizUnitName}
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
              label={<span className="uppercase text-[10px]">{t('Tiêu chuẩn ghi nhận DT')}</span>}
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
                value={SMSalesRecognizeName}
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
                value={SMSalesReceiptName}
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
                  peopleSearchSh={peopleSearchSh}
                  setPeopleSearchSh={setPeopleSearchSh}
                  selectionPeople={selectionPeople}
                  setSelectionPeople={setSelectionPeople}
                  gridRef={gridDeptRef}
                  empName={ChargeEmpName}
                  setEmpName={setChargeEmpName}
                  userId={userId}
                  setUserId={setUserId}
                  setEmpSeq={setChargeEmp}
                  empSeq={empSeq}
                  setSelectEmp={setSelectEmp}
                  dropdownRef={dropdownRef}
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
                  ...(dataInoutType?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('363')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={CurrName}
                onFocus={() => setDropdownVisibleCurr(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />

              {dropdownVisibleCurr && (
                <CodeHelpCurrency
                  data={dataCurrency}
                  nameCodeHelp={t('363')}
                  modalVisible={dropdownVisibleCurr}
                  setModalVisible={setDropdownVisibleCurr}
                  dropdownRef={dropdownRef}
                  searchSh={currSearchSh}
                  setSearchSh={setCurrSearchSh}
                  selection={selectionCurr}
                  setSelection={setSelectionCurr}
                  currName={CurrName}
                  setCurrName={setCurrName}
                  setCurrSeq={setCurrSeq}
                  setRateBuy={setCurrRate}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('364')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={CurrRate}
                onChange={(e) => {
                  setCurrRate(e.target.value)
                }}
              />
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
                  value={RegDate}
                  onChange={handleRegDate}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('127')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={ContractDate}
                  onChange={handleContractDate}
                />
              </Space>
            </Form.Item>
            
          </Col>
          

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('427')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={ProcDate}
                  onChange={handleProcDate}
                  disabled
                />
              </Space>
            </Form.Item>
            
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox checked={CfmCode === 1} onChange={onChangeCfmCode}>
                {t('607')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
