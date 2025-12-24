import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import { useTranslation } from 'react-i18next'
export default function IqcCheckStatusQuery({
  dataBizUnit,
  dataSMQcType,
  dataCustomer,
  BizUnit,
  setBizUnit,
  BLDateFr,
  setBLDateFr,
  BLDateTo,
  setBLDateTo,
  QCDateFrom,
  setQCDateFrom,
  QCDateTo,
  setQCDateTo,
  DelvDateFr,
  setDelvDateFr,
  DelvDateTo,
  setDelvDateTo,
  QcNo,
  setQcNo,
  setSMQcType,
  BLRefNo,
  setBLRefNo,
  BLNo,
  setBLNo,
  CustSeq,
  setCustSeq,
  setDeptSeq,
  EmpSeq,
  setEmpSeq,
  EmpName,
  setEmpName,
  setUserId,

  ItemName,
  setItemName,
  ItemNo,
  setItemNo,

  setAssetSeq,

  CustName,
  setCustName,
  dropdownRefP,

  departData,
  deptName,
  setDeptName,

  dataUser,

  dataAsset,
  setAssetName,
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

  const onChangeBLDateFr = (date) => {
    setBLDateFr(date)
  }
  const onChangeBLDateTo = (date) => {
    setBLDateTo(date)
  }

  const onChangeQCDateFrom = (date) => {
    setQCDateFrom(date)
  }
  const onChangeQCDateTo = (date) => {
    setQCDateTo(date)
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
  

  const onChangeDelvDateFr = (date) => {
    setDelvDateFr(date)
  }
  const onChangeDelvDateTo = (date) => {
    setDelvDateTo(date)
  }

  const onChangeSMQcType = (value) => {
    if (value === null || value === undefined) {
      setSMQcType('')
    }
    const itemSelect = dataSMQcType.find((item) => item.Value === data)
    setSMQcType(itemSelect.Value)
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleCust(false)
      setModalVisibleDept(false)
      setModalVisiblePeople(false)
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
              label={<span className="uppercase text-[9px]">{t('6128')}</span>}
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
                placeholder={t('6128')}
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
              label={
                <span className="uppercase text-[10px]">{t('10865')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={BLDateFr}
                onChange={onChangeBLDateFr}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('10865')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={BLDateTo}
                onChange={onChangeBLDateTo}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('210')}</span>}
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
              label={<span className="uppercase text-[10px]">{t('210')}</span>}
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
              label={<span className="uppercase text-[9px]">{t('2627')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={QcNo}
                onChange={(e) => {
                  setQcNo(e.target.value)
                }}
              />
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
                placeholder={t('474')}
                allowClear
                showSearch
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
              label={<span className="uppercase text-[9px]">{t('31194')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={BLRefNo}
                onChange={(e) => {
                  setBLRefNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('10861')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={BLNo}
                onChange={(e) => {
                  setBLNo(e.target.value)
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('4226')}</span>}
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
                  nameCodeHelp={t('4226')}
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
              label={<span className="uppercase text-[9px]">{t('5')}</span>}
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
                  nameCodeHelp={'Bộ phận'}
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
              label={<span className="uppercase text-[9px]">{t('360')}</span>}
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
                  nameCodeHelp={t('360')}
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
        </Row>
      </Form>
    </div>
  )
}
