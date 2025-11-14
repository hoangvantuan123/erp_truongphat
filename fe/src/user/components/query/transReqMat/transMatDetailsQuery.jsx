import { useState } from 'react'
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Segmented,
  Select,
} from 'antd'

import { useTranslation } from 'react-i18next'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import CodeHelpWarehouse from '../../table/codeHelp/codeHelpWareHouses'
import { INOUTREQTYPE } from '../../../../utils/sysConstants'

const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

export default function TransMatDetailsQuery({

  fromDate,
  setFromDate,
  setToDate,
  toDate,

  reqNo,
  setReqNo,

  nameProduct,
  setNameProduct,

  codeProduct,
  setCodeProduct,

  specProduct,
  setSpectProduct,

  typeTransData,
  setTypeTrans,

  bizUnit,
  setBizUnit,
  transBizUnit,
  setTransBizUnit,
  dataUnit,
  dataStatus,
  setStatus,

  setDeliveryNo,
  handleSearch1,
  resetTable,

  departData,
  deptSearchSh,
  setDeptSearchSh,
  selectionDept,
  setSelectionDept,
  deptName,
  setDeptName,
  setDeptSeq,
  gridDeptRef,

  dataUser,
  empName,
  setEmpName,
  setEmpSeq,
  setUserId,
  peopleSearchSh,
  setPeopleSearchSh,
  selectionPeople,
  setSelectionPeople,
  empSeq,

  dataWarehouse,
  warehouseSearchSh,
  setWarehouseSearchSh,
  selectionInWarehouse,
  setSelectionInWarehouse,
  gridRef,

  inWhName,
  dropdownRef,
  setInWhName,
  setInWhSeq,

  outWhName,
  setOutWhName,
  setOutWhSeq,

  inOutReqType,
  setInOutReqType,

}) {
  const { t } = useTranslation();
  const [modalVisibleInWh, setModalVisibleInWh] = useState(false)
  const [modalVisibleOutWh, setModalVisibleOutWh] = useState(false)
  const [modalVisiblePeople, setModalVisiblePeople] = useState(false)
  const [modalVisibleDept, setModalVisibleDept] = useState(false)

  const handleFromDate = (date) => {
    setFromDate(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
  const onChangeBizUnit = (value) => {
    setBizUnit(value)
  }

  const onChangeTranBizUnit = (value) => {
    setTransBizUnit(value)
  }

  const handleOnChangeDeptName = (e) => {
    setDeptName(e.target.value)
    setDeptSeq('')
    resetTable()
  }

  const onChangeDataStatus = (value) => {
    setStatus(value)
  }

  const onChangeTypeTrans = (value) => {
    setTypeTrans(value)
  }

  const onChangeInOutReqType = (value) => {
    setInOutReqType(value)
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-3 flex items-center ">

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('722')}</span>}
              className="mb-0"
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 160,
                }}
                onChange={onChangeBizUnit}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataUnit?.map((item) => ({
                    label: item?.AccUnitName,
                    value: item?.BizUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('718')}</span>}
              className="mb-0"
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 160,
                }}
                onChange={onChangeTranBizUnit}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataUnit?.map((item) => ({
                    label: item?.AccUnitName,
                    value: item?.BizUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('200')}</span>}
              className="mb-0"
            >
              <DatePicker
                value={fromDate}
                onChange={handleFromDate}
                size="middle"
                style={{
                  width: 120,
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('200')}</span>}
              className="mb-0"
            >
              <DatePicker
                value={toDate}
                onChange={handletoDate}
                format="YYYY-MM-DD"
                size="middle"
                style={{
                  width: 120,
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('647')}</span>}
              className="mb-0"
            >
              <Input
                placeholder=""
                value={reqNo}
                onChange={(e) => setReqNo(e.target.value)}
                size="middle"
                style={{
                  width: 130,
                }}
              />
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('366')}</span>
              }
              className="mb-0"
            >
              <Input
                className="bg-blue-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch1()
                  }
                }}
                value={deptName}
                onChange={handleOnChangeDeptName}
                size="middle"
                style={{
                  width: 130,
                }}
                onFocus={() => setModalVisibleDept(true)}
              />
              {
                modalVisibleDept && (
                  <CodeHelpDepartment
                    data={departData}
                    nameCodeHelp={'Bộ phận yêu cầu'}
                    modalVisibleDept={modalVisibleDept}
                    setModalVisibleDept={setModalVisibleDept}
                    // dropdownRefP = {dropdownRefP}
                    deptSearchSh={deptSearchSh}
                    setDeptSearchSh={setDeptSearchSh}
                    selectionDept={selectionDept}
                    setSelectionDept={setSelectionDept}
                    gridRef={gridDeptRef}

                    deptName={deptName}
                    setDeptName={setDeptName}
                    setDeptSeq={setDeptSeq}
                  />
                )

              }
            </Form.Item>
          </Col>

          <Col >
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('360')}</span>
              }
              className="mb-0"
            >
              <Input
                className="bg-blue-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                  }
                }}
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                size="middle"
                onFocus={() => setModalVisiblePeople(true)}
                style={{
                  width : 150,
                }}
              />
              {
                modalVisiblePeople && (
                  <CodeHelpPeople
                    data={dataUser}
                    nameCodeHelp={'Người phụ trách'}
                    modalVisiblePeople={modalVisiblePeople}
                    setModalVisiblePeople={setModalVisiblePeople}
                    peopleSearchSh={peopleSearchSh}
                    setPeopleSearchSh={setPeopleSearchSh}
                    selectionPeople={selectionPeople}
                    setSelectionPeople={setSelectionPeople}

                    empName={empName}
                    setEmpName={setEmpName}
                    empSeq={empSeq}
                    setEmpSeq={setEmpSeq}
                    setUserId={setUserId}
                  />
                )
              }
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('584')}</span>
              }
              className="mb-0"
            >
              <Input
                className="bg-blue-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                  }
                }}
                value={inWhName}
                onChange={(e) => setInWhName(e.target.value)}
                size="middle"
                onFocus={() => setModalVisibleInWh(true)}
                style={{
                  width : 150,
                }}
              />
              {
                modalVisibleInWh && (
                  <CodeHelpWarehouse
                    data={dataWarehouse}
                    modalVisibleWh={modalVisibleInWh}
                    setModalVisibleWh={setModalVisibleInWh}
                    dropdownRef={dropdownRef}
                    warehouseSearchSh={warehouseSearchSh}
                    setWarehouseSearchSh={setWarehouseSearchSh}
                    selectionWarehouse={selectionInWarehouse}
                    setSelectionWarehouse={setSelectionInWarehouse}
                    gridRef={gridRef}

                    whName={inWhName}
                    setWhName={setInWhName}
                    setWhSeq={setInWhSeq}
                  />
                )
              }
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('626')}</span>
              }
              className="mb-0"
            >
              <Input
                className="bg-blue-50"

                value={outWhName}
                onChange={(e) => setOutWhName(e.target.value)}
                onFocus={() => setModalVisibleOutWh(true)}
                size="middle"
                style={{
                  width : 150,
                }}
              />

              {
                modalVisibleOutWh && (
                  <CodeHelpWarehouse
                    data={dataWarehouse}
                    modalVisibleWh={modalVisibleOutWh}
                    setModalVisibleWh={setModalVisibleOutWh}
                    warehouseSearchSh={warehouseSearchSh}
                    setWarehouseSearchSh={setWarehouseSearchSh}
                    selectionWarehouse={selectionInWarehouse}
                    setSelectionWarehouse={setSelectionInWarehouse}
                    gridRef={gridRef}

                    whName={outWhName}
                    setWhName={setOutWhName}
                    setWhSeq={setOutWhSeq}
                  />
                )
              }
            </Form.Item>
          </Col>
        </Row>

        <Row className="gap-3 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('369')}</span>}
              className="mb-0 "
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 160,
                }}
                onChange={onChangeDataStatus}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataStatus?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.MinorSeq,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('30196')}</span>}
              className="mb-0"

            >
              <Input
                placeholder=""
                value={nameProduct}
                onChange={(e) => setNameProduct(e.target.value)}
                size="middle"
                style={{
                  width: 300,
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2091')}</span>}
              className="mb-0"
            >
              <Input
                placeholder=""
                value={codeProduct}
                onChange={(e) => setCodeProduct(e.target.value)}
                size="middle"
                style={{
                  width: 260,
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('55272')}</span>}
              className="mb-0"
            >
              <Input
                placeholder=""
                value={specProduct}
                onChange={(e) => setSpectProduct(e.target.value)}
                size="middle"
                style={{
                  width: 120,
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1868')}</span>}
              className="mb-0 "
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeTypeTrans}
                options={[
                  { label: 'All', value: '0' },
                  ...(typeTransData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
                      <Form.Item
                        label={<span className="uppercase text-[10px]">{t('Loại sản phẩm')}</span>}
                        className="mb-0"
                      >
                        <Select
                          id="typeSelect2"
                          size="medium"
                          style={{
                            width: 160,
                          }}
                          defaultValue={INOUTREQTYPE[0]}
                          onChange={onChangeInOutReqType}
                          options={[
                            ...(INOUTREQTYPE?.map((item) => ({
                              label: item?.label,
                              value: item?.value,
                            })) || []),
                          ]}
                        />
                      </Form.Item>
                    </Col>

        </Row>
      </Form>
    </div>
  )
}
