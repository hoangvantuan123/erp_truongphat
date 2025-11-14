import { useState, useEffect, useRef } from 'react'
import { Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import CodeHelpWorkCenter from '../../table/codeHelp/codeHelpWorkCenter'
import CodeHelpItemClassLName from '../../table/codeHelp/codeHelpItemClassLName'
import CodeHelpItemClassMName from '../../table/codeHelp/codeHelpItemClassMName'
import CodeHelpItemClassSName from '../../table/codeHelp/codeHelpItemClassSName'
export default function QcFinalBadQtyResultListQuery({
  dataWorkCenter,
  dataBizUnit,
  dataProgStatusName,

  dataItemClassLName,
  dataItemClassMName,
  dataItemClassSName,

  ItemLClass,
  setItemLClass,
  ItemLClassName,
  setItemLClassName,
  ItemMClass,
  setItemMClass,
  ItemMClassName,
  setItemMClassName,
  ItemSClass,
  setItemSClass,
  ItemSClassName,
  setItemSClassName,

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

  setProgStatus,
  setProgStatusName,

  WorkCenterName,
  setWorkCenterName,
  WorkCenter,
  setWorkCenter,

  WorkOrderNo,
  setWorkOrderNo,

  LotNo,
  setLotNo,

  DeptName,
  setDeptName,

}) {
  const { t } = useTranslation()
  const dropdownRef = useRef()

  const [modalVisibleWorkCenter, setModalVisibleWorkCenter] = useState(false)
  const [WorkCenterSearchSh, setWorkCenterSearchSh] = useState('')
  const [selectionWorkCenter, setSelectionWorkCenter] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionItemLClassName, setSelectionItemLClassName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionItemMClassName, setSelectionItemMClassName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionItemClassName, setSelectionItemClassName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [ItemClassLNameSearchSh, setItemClassLNameSearchSh] = useState('')
  const [ItemClassMNameSearchSh, setItemClassMNameSearchSh] = useState('')
  const [ItemClassSNameSearchSh, setItemClassSNameSearchSh] = useState('')

  const [modalVisibleItemLClassName, setModalVisibleItemLClassName] =
    useState(false)
  const [modalVisibleItemMClassName, setModalVisibleItemMClassName] =
    useState(false)
  const [modalVisibleItemSClassName, setModalVisibleItemSClassName] =
    useState(false)

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

  const onChangeProgStatusName = (data) => {
    if (data === null || data === undefined) {
      setProgStatusName('')
      setProgStatus(0)
    } else {
      const itemSelect = dataProgStatusName.find((item) => item.Value === data)
      if (itemSelect) {
        setProgStatusName(itemSelect.MinorName)
        setProgStatus(itemSelect.Value)
      }
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {

      setModalVisibleWorkCenter(false)
      setModalVisibleItemLClassName(false)
      setModalVisibleItemMClassName(false)
      setModalVisibleItemSClassName(false)
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
              label={<span className="uppercase text-[9px]">{t('369')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeProgStatusName}
                allowClear
                showSearch
                placeholder={t('474')}
                options={[
                  ...(dataProgStatusName?.map((item) => ({
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
              label={<span className="uppercase text-[9px]">{t('2115')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ItemLClassName}
                onFocus={() => setModalVisibleItemLClassName(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleItemLClassName && (
                <CodeHelpItemClassLName
                  data={dataItemClassLName}
                  nameCodeHelp={t('2115')}
                  modalVisibleItemClassName={modalVisibleItemLClassName}
                  setModalVisibleItemClassName={setModalVisibleItemLClassName}
                  ItemClassNameSearchSh={ItemClassLNameSearchSh}
                  setItemClassNameSearchSh={setItemClassLNameSearchSh}
                  selectionItemClassName={selectionItemLClassName}
                  setSelectionItemClassName={setSelectionItemLClassName}
                  ItemClassName={ItemLClass}
                  setItemClassName={setItemLClass}
                  ItemLClassName={ItemLClassName}
                  setItemLClassName={setItemLClassName}
                  dropdownRef={dropdownRef}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('3262')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ItemMClassName}
                onFocus={() => setModalVisibleItemMClassName(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleItemMClassName && (
                <CodeHelpItemClassMName
                  data={dataItemClassMName}
                  nameCodeHelp={t('3262')}
                  modalVisibleItemClassName={modalVisibleItemMClassName}
                  setModalVisibleItemClassName={setModalVisibleItemMClassName}
                  ItemClassMNameSearchSh={ItemClassMNameSearchSh}
                  setItemClassMNameSearchSh={setItemClassMNameSearchSh}
                  selectionItemClassName={selectionItemMClassName}
                  setSelectionItemClassName={setSelectionItemMClassName}
                  ItemClassName={ItemMClass}
                  setItemClassName={setItemMClass}
                  setItemMClassName={setItemMClassName}
                  ItemMClassName={ItemMClassName}
                  dropdownRef={dropdownRef}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('592')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={ItemSClassName}
                onFocus={() => setModalVisibleItemSClassName(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleItemSClassName && (
                <CodeHelpItemClassSName
                  data={dataItemClassSName}
                  nameCodeHelp={t('592')}
                  modalVisibleItemClassName={modalVisibleItemSClassName}
                  setModalVisibleItemClassName={setModalVisibleItemSClassName}
                  ItemClassSNameSearchSh={ItemClassSNameSearchSh}
                  setItemClassSNameSearchSh={setItemClassSNameSearchSh}
                  selectionItemClassName={selectionItemClassName}
                  setSelectionItemClassName={setSelectionItemClassName}
                  ItemClassName={ItemSClass}
                  setItemClassName={setItemSClass}
                  ItemSClassName= {ItemSClassName}
                  setItemSClassName = {setItemSClassName}
                  dropdownRef={dropdownRef}
                />
              )}
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

          
        </Row>
      </Form>
    </div>
  )
}
