import { useState, useRef, useEffect } from 'react'
import { Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import { useTranslation } from 'react-i18next'
import CodeHelpWarehouse from '../../table/codeHelp/codeHelpWareHouses'
export default function IqcOutsourceReqListQuery({
  dataBizUnit,
  dataSMQcType,
  dataCustomer,
  setFactUnit,
  setFactUnitName,
  QCDateFrom,
  setQCDateFrom,
  QCDateTo,
  setQCDateTo,
  DelvDateFr,
  setDelvDateFr,
  DelvDateTo,
  setDelvDateTo,
  DelvNo,
  setDelvNo,
  setSMQcType,
  LotNo,
  setLotNo,
  CustSeq,
  setCustSeq,
  setDeptSeq,
  EmpSeq,
  setEmpSeq,
  EmpName,
  setEmpName,
  setUserId,
  PONo,
  setPONo,
  Spec,
  setSpec,
  ItemName,
  setItemName,
  ItemNo,
  setItemNo,
  CustName,
  setCustName,
  dropdownRefP,
  departData,
  deptName,
  setDeptName,
  dataUser,
  WorkOrderNo,
  setWorkOrderNo,

  dataWHName,
  WHName,
  setWHName,
  WHSeq,
  setWHSeq,
}) {
  const gridRef = useRef(null)
  const gridDeptRef = useRef(null)
  const gridPeopleRef = useRef(null)
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const [selectionCust, setSelectionCust] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [custSearchSh, setCustSearchSh] = useState('')
  const [modalVisibleCust, setModalVisibleCust] = useState(false)

  const [deptSearchSh, setDeptSearchSh] = useState('')
  const [modalVisibleDept, setModalVisibleDept] = useState(false)
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [modalVisiblePeople, setModalVisiblePeople] = useState(false)
  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectEmp, setSelectEmp] = useState(null)

  const [selectionWh, setSelectionWh] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [whSearchSh, setWhSearchSh] = useState('')
  const [modalVisibleWh, setModalVisibleWh] = useState(false)

  const onChangeQCDateFrom = (date) => {
    setQCDateFrom(date)
  }
  const onChangeQCDateTo = (date) => {
    setQCDateTo(date)
  }

  const onChangeBizUnit = (value) => {
    if (value === null || value === undefined) {
      setFactUnit('')
      setFactUnitName('')
    } else {
      const itemSelect = dataBizUnit.find((item) => item.FactUnit === value)
      if (itemSelect) {
        setFactUnit(itemSelect.FactUnit)
        setFactUnitName(itemSelect.FactUnitName)
      }
    }
  }

  const onChangeDelvDateFr = (date) => {
    setDelvDateFr(date)
  }
  const onChangeDelvDateTo = (date) => {
    setDelvDateTo(date)
  }

  const onChangeSMQcType = (data) => {
    if (data === null || data === undefined) {
      setSMQcType('')
    } else {
      const itemSelect = dataSMQcType.find((item) => item.Value === data)
      if (itemSelect) {
        setSMQcType(itemSelect.Value)
      }
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleCust(false)
      setModalVisibleDept(false)
      setModalVisiblePeople(false)
      setModalVisibleWh(false)
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
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('3')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                allowClear
                showSearch
                placeholder={t('3')}
                onChange={onChangeBizUnit}
                options={[
                  ...(dataBizUnit?.map((item) => ({
                    label: item?.FactUnitName,
                    value: item?.FactUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('141')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={DelvDateFr}
                onChange={onChangeDelvDateFr}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('141')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={DelvDateTo}
                onChange={onChangeDelvDateTo}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('120')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={QCDateFrom}
                onChange={onChangeQCDateFrom}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('120')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={QCDateTo}
                onChange={onChangeQCDateTo}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('695')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={CustName}
                onFocus={() => setModalVisibleCust(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleCust && (
                <CodeHelpCust
                  data={dataCustomer}
                  nameCodeHelp={t('695')}
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
                  dropdownRef ={dropdownRef}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('474')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeSMQcType}
                allowClear
                showSearch
                placeholder={t('474')}
                options={[
                  ...(dataSMQcType?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('684')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={DelvNo}
                onChange={(e) => {
                  setDelvNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('740')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={deptName}
                onFocus={() => setModalVisibleDept(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleDept && (
                <CodeHelpDepartment
                  data={departData}
                  nameCodeHelp={t('740')}
                  modalVisibleDept={modalVisibleDept}
                  setModalVisibleDept={setModalVisibleDept}
                  deptSearchSh={deptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  gridRef={gridDeptRef}
                  deptName={deptName}
                  setDeptName={setDeptName}
                  setDeptSeq={setDeptSeq}
                  dropdownRef ={dropdownRef}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2339')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={EmpName}
                onFocus={() => setModalVisiblePeople(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisiblePeople && (
                <CodeHelpPeople
                  data={dataUser}
                  nameCodeHelp={t('2339')}
                  modalVisiblePeople={modalVisiblePeople}
                  setModalVisiblePeople={setModalVisiblePeople}
                  dropdownRefP={dropdownRefP}
                  peopleSearchSh={peopleSearchSh}
                  setPeopleSearchSh={setPeopleSearchSh}
                  selectionPeople={selectionPeople}
                  setSelectionPeople={setSelectionPeople}
                  gridRef={gridPeopleRef}
                  empName={EmpName}
                  setEmpName={setEmpName}
                  empSeq={EmpSeq}
                  setEmpSeq={setEmpSeq}
                  setUserId={setUserId}
                  dropdownRef ={dropdownRef}
                  setSelectEmp={setSelectEmp}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2337')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={WHName}
                onFocus={() => setModalVisibleWh(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleWh && (
                <CodeHelpWarehouse
                  data={dataWHName}
                  nameCodeHelp={t('2337')}
                  modalVisibleWh={modalVisibleWh}
                  setModalVisibleWh={setModalVisibleWh}
                  warehouseSearchSh={whSearchSh}
                  setWarehouseSearchSh={setWhSearchSh}
                  selectionInWarehouse={selectionWh}
                  setSelectionInWarehouse={setSelectionWh}
                  gridRef={gridRef}
                  whName={WHName}
                  setWhName={setWHName}
                  setWhSeq={setWHSeq}
                  dropdownRef ={dropdownRef}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2090')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ItemName}
                onChange={(e) => {
                  setItemName(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('2091')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ItemNo}
                onChange={(e) => {
                  setItemNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('551')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={Spec}
                onChange={(e) => {
                  setSpec(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('25431')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={LotNo}
                onChange={(e) => {
                  setLotNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1985')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={WorkOrderNo}
                onChange={(e) => {
                  setWorkOrderNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('16043')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={PONo}
                onChange={(e) => {
                  setPONo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
