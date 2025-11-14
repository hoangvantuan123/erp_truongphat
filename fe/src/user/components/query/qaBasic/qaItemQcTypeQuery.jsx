import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import CodeHelpItemClassLName from '../../table/codeHelp/codeHelpItemClassLName'
import CodeHelpItemClassMName from '../../table/codeHelp/codeHelpItemClassMName'
import CodeHelpItemClassSName from '../../table/codeHelp/codeHelpItemClassSName'
import Checkbox from 'antd/es/checkbox/Checkbox'
export default function QaItemQcTypeQuery({
  dataAssetName,
  dataItemClassLName,
  dataItemClassMName,
  dataItemClassSName,
  dataTestItemType,
  setAssetName,
  setAssetSeq,
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
  DateFr,
  setDateFr,
  DateTo,
  setDateTo,
  ItemName,
  setItemName,
  ItemNo,
  setItemNo,
  Spec,
  setSpec,
  setTestItemType,

  ItemCheck,
  setItemCheck,
}) {
  const gridRef = useRef(null)
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

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

  const onChangeDateFr = (date) => {
    setDateFr(date)
  }
  const onChangeDateTo = (date) => {
    setDateTo(date)
  }

  const onChangeAssetName = (value) => {
    if (value === null || value === undefined) {
      setAssetName('')
    } else {
      const itemSelect = dataAssetName.find((item) => item.Value === value)

      if (itemSelect) {
        setAssetName(itemSelect.MinorName)
        setAssetSeq(itemSelect.Value)
      }
    }
  }

  const onChangeTestItemType = (data) => {
    if (data === null || data === undefined) {
      setTestItemType('')
    } else {
      const itemSelect = dataTestItemType.find((item) => item.Value === data)
      if (itemSelect) {
        setTestItemType(itemSelect.Value)
      }
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const onChangeItemCheck = (data) => {
    if (data === null || data === undefined) {
      setItemCheck(false)
    } else {
      setItemCheck(data.target.checked)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('3259')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeAssetName}
                showSearch
                allowClear
                placeholder={t('3259')}
                options={[
                  ...(dataAssetName?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
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
                  gridRef={gridRef}
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
                  gridRef={gridRef}
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
                  gridRef={gridRef}
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
              label={
                <span className="uppercase text-[10px]">{t('21774')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={DateFr}
                onChange={onChangeDateFr}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('21774')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={DateTo}
                onChange={onChangeDateTo}
              />
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
              label={<span className="uppercase text-[9px]">{t('11743')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 150,
                }}
                onChange={onChangeTestItemType}
                showSearch
                allowClear
                placeholder={t('11743')}
                options={[
                  ...(dataTestItemType?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox
                className="w-[150px]"
                checked={ItemCheck}
                onChange={onChangeItemCheck}
              >
                {t('13139')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
