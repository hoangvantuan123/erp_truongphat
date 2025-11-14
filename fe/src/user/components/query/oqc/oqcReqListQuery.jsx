import { useState, useRef, useEffect } from 'react'
import { Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import { useTranslation } from 'react-i18next'
import CodeHelpWorkCenter from '../../table/codeHelp/codeHelpWorkCenter'
export default function OqcReqListQuery({
  dataBizUnit,
  dataSMQcType,
  dataIsGoodInNm,
  dataWorkTypeName,
  dataWorkCenter,
  dataCustomer,

  setFactUnit,
  setFactUnitName,

  WorkDate,
  setWorkDate,
  WorkDateTo,
  setWorkDateTo,

  TestEndDate,
  setTestEndDate,
  TestEndDateTo,
  setTestEndDateTo,

  QCDateFrom,
  setQCDateFrom,
  QCDateTo,
  setQCDateTo,

  DeptName,
  setDeptName,

  IsGoodInNm,
  setIsGoodInNm,

  IsGoodIn,
  setIsGoodIn,

  DelvNo,
  setDelvNo,
  SMQcTypeName,
  setSMQcTypeName,
  setSMQcType,
  LotNo,
  setLotNo,

  QcNo,
  setQcNo,

  WorkCenterName,
  setWorkCenterName,
  WorkCenter,
  setWorkCenter,

  WorkTypeName,
  setWorkTypeName,
  WorkType,
  setWorkType,

  CustSeq,
  setCustSeq,

  ItemName,
  setItemName,
  ItemNo,
  setItemNo,
  CustName,
  setCustName,
}) {
  const gridRef = useRef(null)
  const gridDeptRef = useRef(null)
  const dropdownRef = useRef(null)
  const gridPeopleRef = useRef(null)
  const { t } = useTranslation()

  const [selectionCust, setSelectionCust] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [custSearchSh, setCustSearchSh] = useState('')
  const [modalVisibleCust, setModalVisibleCust] = useState(false)

  const [modalVisibleWorkCenter, setModalVisibleWorkCenter] = useState(false)
  const [WorkCenterSearchSh, setWorkCenterSearchSh] = useState('')
  const [selectionWorkCenter, setSelectionWorkCenter] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const onChangeFactUnit = (value) => {
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

  const onChangeWorkDate = (date) => {
    setWorkDate(date)
  }
  const onChangeWorkDateTo = (date) => {
    setWorkDateTo(date)
  }

  const onChangeTestEndDate = (date) => {
    setTestEndDate(date)
  }
  const onChangeTestEndDateTo = (date) => {
    setTestEndDateTo(date)
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

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleWorkCenter(false)
      setModalVisibleCust(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  const onChangeIsGoodInNm = (data) => {
    if (data === null || data === undefined) {
      setIsGoodInNm('')
      setIsGoodIn('')
    } else {
      const itemSelect = dataIsGoodInNm.find((item) => item.Value === data)
      if (itemSelect) {
        setIsGoodInNm(itemSelect.MinorName)
        setIsGoodIn(itemSelect.Value)
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px] ">{t('3')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              rules={[{ required: true, message: "Please Select" }]}
              name="FactUnit"
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                allowClear
                showSearch
                placeholder={t('3')}
                onChange={onChangeFactUnit}
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
              label={<span className="uppercase text-[10px]">{t('218')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              rules={[{ required: true, message: "Please Select" }]}
            >
              <DatePicker
                size="middle"
                value={WorkDate}
                onChange={onChangeWorkDate}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('218')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              rules={[{ required: true, message: "Please Select" }]}
            >
              <DatePicker
                size="middle"
                value={WorkDateTo}
                onChange={onChangeWorkDateTo}
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
                value={TestEndDate}
                onChange={onChangeTestEndDate}
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
                value={TestEndDateTo}
                onChange={onChangeTestEndDateTo}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('744')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={DeptName}
                onChange={(e) => {
                  setDeptName(e.target.value)
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('6')}</span>}
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
                  dropdownRef={dropdownRef}
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
              label={<span className="uppercase text-[9px]">{t('1903')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeIsGoodInNm}
                allowClear
                showSearch
                placeholder={t('1903')}
                options={[
                  ...(dataIsGoodInNm?.map((item) => ({
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
                  gridRef={gridPeopleRef}
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
              label={<span className="uppercase text-[9px]">{t('1985')}</span>}
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
        </Row>
      </Form>
    </div>
  )
}
