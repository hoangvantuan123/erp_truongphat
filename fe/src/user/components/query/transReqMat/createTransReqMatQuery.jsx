import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Segmented,
  Select,
  Checkbox,
} from 'antd'
import { useTranslation } from 'react-i18next'
import CodeHelpWarehouse from '../../table/codeHelp/codeHelpWareHouses';
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople';
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment';
import { INOUTREQTYPE } from '../../../../utils/sysConstants';

export default function CreateTransReqMatQuery({
  
  dateReq,
  setDateReq,
  reqNo,
  setReqNo,

  bizUnit,
  setBizUnit,
  bizUnitName,
  setBizUnitName,

  transBizUnit,
  setTransBizUnit,
  setTransBizUnitName,

  dataUnit,
  setStatus,

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
  dropdownRefP,
  empName,
  setEmpName,
  handleSearch2,
  handleOnChangeEmpName,
  peopleSearchSh,
  setPeopleSearchSh,
  selectionPeople,
  setSelectionPeople,
  empSeq,
  setEmpSeq,
  setUserId,
  gridPeopleRef,

  dataWarehouse,
  warehouseSearchSh,
  setWarehouseSearchSh,
  selectionInWarehouse,
  setSelectionInWarehouse,
  gridRef,
  dropdownRef,
  inWhName,
  setInWhName,
  setInWhSeq,
  handleSearchInWh,
  
  outWhName,
  setOutWhName,
  handleSearchOutWh,
  setOutWhSeq,

  inOutReqType,
  setInOutReqType,
  
  remark,
  setRemark,
  isTrans,
  setIsTrans,

}) {
  const { t } =  useTranslation();
  const [modalVisibleInWh, setModalVisibleInWh] = useState(false)
  const [modalVisibleOutWh, setModalVisibleOutWh] = useState(false)
  const [modalVisiblePeople, setModalVisiblePeople] = useState(false)
  const [modalVisibleDept, setModalVisibleDept] = useState(false)
  const handleDateReq = (date) => {
    setDateReq(date)
  }

  const onChangeBizUnit = (value) => {
    setBizUnit(value)
    const bizUnitName = dataUnit?.find((item => item.BizUnit === value));
    setBizUnitName(bizUnitName?.AccUnitName)
  }

  const onChangeTranBizUnit = (value) => {
    setTransBizUnit(value)
    const transBizUnitName = dataUnit?.find((item => item.BizUnit === value));
    setTransBizUnitName(transBizUnitName?.AccUnitName);
  }

  const onChangeInOutReqType = (value) => {
    setInOutReqType(value)
  }

  const onChangeIsTrans = (e) => {
    const isCheck = e.target.checked;
    
    if (isCheck){
      setIsTrans('1');
    }else{
      setIsTrans('0');
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">

        <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('722')}</span>}
              className="mb-0"
            >
              <Select
                id="typeSelect1"
                size="medium"
                style={{
                  width: 180,
                }}
                value={bizUnit}
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
                size="middle"
                style={{
                  width: 180,
                }}
                onChange={onChangeTranBizUnit}
                value={transBizUnit}
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
                value={dateReq}
                onChange={handleDateReq}
                size="middle"
                style={{
                  width: 160,
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
                size="middle"
                onChange={(e) => setReqNo(e.target.value)}
                
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
                size="middle"
                className="bg-blue-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {

                  }
                }}
                value={deptName}
                onFocus={() => setModalVisibleDept(true)}
              />
              {
                modalVisibleDept && (
                  <CodeHelpDepartment 
                  data = {departData}
                  nameCodeHelp = {'Bộ phận yêu cầu'}
                  modalVisibleDept = {modalVisibleDept}
                  setModalVisibleDept = {setModalVisibleDept}
                  dropdownRefP = {dropdownRefP}
                  deptSearchSh = {deptSearchSh}
                  setDeptSearchSh ={setDeptSearchSh}
                  selectionDept = {selectionDept}
                  setSelectionDept ={setSelectionDept}
                  gridRef = {gridDeptRef}

                  deptName={deptName}
                  setDeptName={setDeptName}
                  setDeptSeq={setDeptSeq}
                  />
                )
                
              }
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('360')}</span>
              }
              className="mb-0"
            >
              <Input
                size="middle"
                className="bg-blue-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch2()
                  }
                }}
                value={empName}
                onFocus={() => setModalVisiblePeople(true)}
              />
              {
                modalVisiblePeople && (
                  <CodeHelpPeople 
                  data = {dataUser}
                  nameCodeHelp = {'Người phụ trách'}
                  modalVisiblePeople = {modalVisiblePeople}
                  setModalVisiblePeople = {setModalVisiblePeople}
                  dropdownRefP = {dropdownRefP}
                  peopleSearchSh = {peopleSearchSh}
                  setPeopleSearchSh ={setPeopleSearchSh}
                  selectionPeople = {selectionPeople}
                  setSelectionPeople ={setSelectionPeople}
                  gridRef = {gridPeopleRef}

                  empName ={empName}
                  setEmpName ={setEmpName}
                  empSeq={empSeq}
                  setEmpSeq={setEmpSeq}
                  setUserId={setUserId}
                  />
                )
              }
            </Form.Item>
          </Col>

          </Row>

          <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('584')}</span>
              }
              className="mb-0"
            >
              <Input
                size="middle"
                className="bg-blue-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchInWh()
                  }
                }}
                value={inWhName}
                onFocus={() => setModalVisibleInWh(true)}
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

                    whName = {inWhName}
                    setWhName = {setInWhName}
                    setWhSeq = {setInWhSeq}
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
                size="middle"
                className="bg-blue-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchOutWh()
                  }
                }}
                value={outWhName}
                onChange={(e) => setOutWhName(e.target.value)}
                onFocus={() => setModalVisibleOutWh(true)}
              />
              {
                modalVisibleOutWh && (
                  <CodeHelpWarehouse
                    data={dataWarehouse}
                    modalVisibleWh={modalVisibleOutWh}
                    setModalVisibleWh={setModalVisibleOutWh}
                    dropdownRef={dropdownRef}
                    warehouseSearchSh={warehouseSearchSh}
                    setWarehouseSearchSh={setWarehouseSearchSh}
                    selectionWarehouse={selectionInWarehouse}
                    setSelectionWarehouse={setSelectionInWarehouse}
                    gridRef={gridRef}

                    whName = {outWhName}
                    setWhName = {setOutWhName}
                    setWhSeq = {setOutWhSeq}
                  />
                )
              }
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
                
                value={inOutReqType}
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

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('31702')}</span>}
              className="mb-0"
            >
              <Input
                placeholder=""
                value={remark}
                size="middle"
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('')}</span>}
              className="mb-0"
            >
              <Checkbox
                checked={isTrans} 
                onChange={onChangeIsTrans}
              >
                {t('Có vận chuyển')}
              </Checkbox>
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </div>
  )
}
