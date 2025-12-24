import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import CodeHelpWorkCenter from '../../table/codeHelp/codeHelpWorkCenter'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
export default function OqcFinResultListQuery({
  departData,
  dataWorkTypeName,
  dataWorkCenter,
  dataBizUnit,
  dataSMQcType,
  dataUser,

  FactUnit,
  setFactUnit,
  QCDateFrom,
  setQCDateFrom,
  QCDateTo,
  setQCDateTo,
  QcNo,
  setQcNo,
  

  ItemName,
  setItemName,
  ItemNo,
  setItemNo,

  SMQcType,
  setSMQcType,
  SMQcTypeName,
  setSMQcTypeName,

  WorkCenterName,
  setWorkCenterName,
  WorkCenter,
  setWorkCenter,

  WorkTypeName,
  setWorkTypeName,
  WorkType,
  setWorkType,

  WorkOrderNo,
  setWorkOrderNo,
  ProcName,
  setProcName,

  EmpSeq,
  setEmpSeq,
  EmpName,
  setEmpName,
  setUserId,
  LotNo,
  setLotNo,
  DeptName,
  setDeptName,
  setDeptSeq,
}) {
  const { t } = useTranslation()
  const dropdownRef = useRef()

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

  const [modalVisibleWorkCenter, setModalVisibleWorkCenter] = useState(false)
  const [WorkCenterSearchSh, setWorkCenterSearchSh] = useState('')
  const [selectionWorkCenter, setSelectionWorkCenter] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const onChangeQCDateFrom = (date) => {
    setQCDateFrom(date)
  }
  const onChangeQCDateTo = (date) => {
    setQCDateTo(date)
  }

  const onChangeBizUnit = (value) => {
    if (value === null || value === undefined) {
      setFactUnit('')
    } else {
      const itemSelect = dataBizUnit.find((item) => item.BizUnit === value)

      if (itemSelect) {
        setFactUnit(itemSelect.BizUnit)
      }
    }
  }

  const onChangeSMQcType = (data) => {
    if (data === null || data === undefined) {
      setSMQcType('')
      setSMQcTypeName('')
    } else {
      const itemSelect = dataSMQcType.find((item) => item.Value === data)
      if (itemSelect) {
        setSMQcType(itemSelect.Value)
        setSMQcTypeName(itemSelect.MinorName)
      }
    }
  }

  const onChangeWorkTypeName = (data) => {
    if (data === null || data === undefined) {
      setWorkTypeName('')
      setWorkType(0)
    } else {
      const itemSelect = dataWorkTypeName.find((item) => item.Value === data)
      if (itemSelect) {
        setSMQcType(itemSelect.Value)
        setWorkTypeName(itemSelect.MinorName)
        setWorkType(itemSelect.Value)
      }
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleDept(false)
      setModalVisiblePeople(false)
      setModalVisibleWorkCenter(false)
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
                onChange={onChangeBizUnit}
                showSearch
                allowClear
                placeholder={t('3')}
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
              label={<span className="uppercase text-[9px]">{t('740')}</span>}
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
                  data={departData}
                  nameCodeHelp={t('740')}
                  modalVisibleDept={modalVisibleDept}
                  setModalVisibleDept={setModalVisibleDept}
                  deptSearchSh={deptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  deptName={DeptName}
                  setDeptName={setDeptName}
                  setDeptSeq={setDeptSeq}
                  dropdownRef={dropdownRef}
                />
              )}
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
              label={<span className="uppercase text-[9px]">{t('2034')}</span>}
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
              label={<span className="uppercase text-[9px]">{t('2035')}</span>}
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
              label={<span className="uppercase text-[9px]">{t('510')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ProcName}
                onChange={(e) => {
                  setProcName(e.target.value)
                }}
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
              label={<span className="uppercase text-[9px]">{t('1059')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={WorkCenterName}
                onFocus={() => setModalVisibleWorkCenter(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleWorkCenter && (
                <CodeHelpWorkCenter
                  data={dataWorkCenter}
                  nameCodeHelp={t('1059')}
                  modalVisibleWorkCenter={modalVisibleWorkCenter}
                  setModalVisibleWorkCenter={setModalVisibleWorkCenter}
                  dropdownRef={dropdownRef}
                  WorkCenterSearchSh={WorkCenterSearchSh}
                  setWorkCenterSearchSh={setWorkCenterSearchSh}
                  selectionWorkCenter={selectionWorkCenter}
                  setSelectionWorkCenter={setSelectionWorkCenter}
                  WorkCenterName={WorkCenterName}
                  setWorkCenterName={setWorkCenterName}
                  WorkCenter={WorkCenter}
                  setWorkCenter={setWorkCenter}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1981')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeWorkTypeName}
                allowClear
                showSearch
                placeholder={t('1981')}
                options={[
                  ...(dataWorkTypeName?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
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
                  peopleSearchSh={peopleSearchSh}
                  setPeopleSearchSh={setPeopleSearchSh}
                  selectionPeople={selectionPeople}
                  setSelectionPeople={setSelectionPeople}
                  empName={EmpName}
                  setEmpName={setEmpName}
                  empSeq={EmpSeq}
                  setEmpSeq={setEmpSeq}
                  setUserId={setUserId}
                  dropdownRef={dropdownRef}
                  setSelectEmp={setSelectEmp}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
