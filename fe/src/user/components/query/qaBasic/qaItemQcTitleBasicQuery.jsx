import { useState, useRef } from 'react'
import {
  Form,
  Input,
  Row,
  Col,
  Select,
} from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import CodeHelpItemNames from '../../table/codeHelp/codeHelpItemNames'
import CodeHelpItemNo from '../../table/codeHelp/codeHelpItemNo'
export default function QaItemQcTitleBasicQuery({
  dataItemName,
  dataItemNo,
  dataSpec,
  dataSMQcKindName,
  dataSMTestMethodName,
  dataSMQcTitleLevelName,
  dataSMSamplingStdName,
  dataSMAQLStrictName,
  dataSMAQLLevelName,
  dataSMAQLPointName,

  setQAssetName,
  setQAssetSeq,
  setQItemName,
  setQItemNo,
  setQSpec,

  setItemSeq,
  ItemName,
  setItemName,
  ItemNo,
  setItemNo,
  AssetName,
  setAssetName,
  setAssetSeq,
  Spec,
  setSpec,
  SMQcKindName,
  setSMQcKindName,
  setSMQcKind,
  setSMTestMethod,
  SMTestMethodName,
  setSMTestMethodName,
  setSMAQLLevel,
  SMAQLLevelName,
  setSMAQLLevelName,
  setSMAQLStrict,
  SMAQLStrictName,
  setSMAQLStrictName,
  setSMSamplingStd,
  SMSamplingStdName,
  setSMSamplingStdName,
  setSMAQLPoint,
  SMAQLPointName,
  setSMAQLPointName,
  SMQcTitleLevelName,
  setSMQcTitleLevelName,
  setSMQcTitleLevel,
}) {
  const gridPeopleRef = useRef(null)
  const { t } = useTranslation()

  const [modalVisibleItemName, setModalVisibleItemName] = useState(false)
  const [ItemNameSearchSh, setItemNameSearchSh] = useState('')
  const [selectionItemName, setSelectionItemName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [modalVisibleItemNo, setModalVisibleItemNo] = useState(false)
  const [ItemNoSearchSh, setItemNoSearchSh] = useState('')
  const [selectionItemNo, setSelectionItemNo] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const dropdownRefP = useRef()

  const onChangeSMTestMethodName = (data) => {
    if (data === undefined || data === '') {
      setSMTestMethodName('')
      setSMTestMethod(0)
    } else {
      const itemSelect = dataSMTestMethodName.find(
        (item) => item.Value === data,
      )
      if (itemSelect) {
        setSMTestMethodName(itemSelect.MinorName)
        setSMTestMethod(itemSelect.Value)
      }
    }
  }

  const onChangeSMSamplingStdName = (data) => {
    if (data === undefined || data === '') {
      setSMSamplingStd('')
      setSMSamplingStdName('')
    } else {
      const itemSelect = dataSMSamplingStdName.find(
        (item) => item.Value === data,
      )
      if (itemSelect) {
        setSMSamplingStd(itemSelect.Value)
        setSMSamplingStdName(itemSelect.MinorName)
      }
    }
  }

  const onChangeSMQcTitleLevelName = (data) => {
    if (data === undefined || data === '') {
      setSMQcTitleLevelName('')
      setSMQcTitleLevel(0)
    } else {
      const itemSelect = dataSMQcTitleLevelName.find(
        (item) => item.Value === data,
      )
      if (itemSelect) {
        setSMQcTitleLevelName(itemSelect.MinorName)
        setSMQcTitleLevel(itemSelect.Value)
      }
    }
  }

  const onChangeSMAQLStrictName = (data) => {
    if (data === undefined || data === '') {
      setSMAQLStrictName('')
      setSMAQLStrict('')
    } else {
      const itemSelect = dataSMAQLStrictName.find((item) => item.Value === data)
      if (itemSelect) {
        setSMAQLStrict(itemSelect.Value)
        setSMAQLStrictName(itemSelect.MinorName)
      }
    }
  }

  const onChangeSMAQLLevelName = (data) => {
    if (data === undefined || data === '') {
      setSMAQLLevel('')
      setSMAQLLevelName('')
    } else {
      const itemSelect = dataSMAQLLevelName.find((item) => item.Value === data)
      if (itemSelect) {
        setSMAQLLevel(itemSelect.Value)
        setSMAQLLevelName(itemSelect.MinorName)
      }
    }
  }
  const onChangeSMAQLPointName = (data) => {
    if (data === undefined || data === '') {
      setSMAQLPoint('')
      setSMAQLPointName('')
    } else {
    const itemSelect = dataSMAQLPointName.find((item) => item.Value === data)
    if (itemSelect) {
      setSMAQLPoint(itemSelect.Value)
      setSMAQLPointName(itemSelect.MinorName)
    }
  }
  }

  const onChangeSMQcKindName = (data) => {
    if (data === undefined || data === '') {
      setSMQcKindName('')
      setSMQcKind(0)
    } else {
      const itemSelect = dataSMQcKindName.find((item) => item.Value === data)
      if (itemSelect) {
        setSMQcKindName(itemSelect.MinorName)
        setSMQcKind(itemSelect.Value)
      }
    }
  }

  return (
    <>
      <div className="flex p-2 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white">
        <Form layout="vertical">
          <Row className="gap-4 flex items-center">
            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('2090')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={ItemName}
                  onFocus={() => setModalVisibleItemName(true)}
                  style={{ backgroundColor: '#e8f0ff' }}
                />
                {modalVisibleItemName && (
                  <CodeHelpItemNames
                    data={dataItemName}
                    nameCodeHelp={t('2090')}
                    setModalVisibleItemName={setModalVisibleItemName}
                    dropdownRefP={dropdownRefP}
                    ItemNameSearchSh={ItemNameSearchSh}
                    setItemNameSearchSh={setItemNameSearchSh}
                    selectionItemName={selectionItemName}
                    setSelectionItemName={setSelectionItemName}
                    ItemName={ItemName}
                    setItemName={setItemName}
                    setItemSeq={setItemSeq}
                    setItemNo={setItemNo}
                    setAssetName={setAssetName}
                    setAssetSeq={setAssetSeq}
                    setSpec={setSpec}
                    setQAssetName={setQAssetName}
                    setQAssetSeq={setQAssetSeq}
                    setQItemName={setQItemName}
                    setQItemNo={setQItemNo}
                    setQSpec={setQSpec}
                  />
                )}
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('2091')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={ItemNo}
                  onFocus={() => setModalVisibleItemNo(true)}
                  style={{ backgroundColor: '#e8f0ff' }}
                />
                {modalVisibleItemNo && (
                  <CodeHelpItemNo
                    data={dataItemNo}
                    nameCodeHelp={t('2091')}
                    setModalVisibleItemNo={setModalVisibleItemNo}
                    dropdownRefP={dropdownRefP}
                    ItemNoSearchSh={ItemNoSearchSh}
                    setItemNoSearchSh={setItemNoSearchSh}
                    selectionItemNo={selectionItemNo}
                    setSelectionItemNo={setSelectionItemNo}
                    ItemNo={ItemNo}
                    setItemNo={setItemNo}
                    setItemName={setItemName}
                    setItemSeq={setItemSeq}
                    setAssetName={setAssetName}
                    setAssetSeq={setAssetSeq}
                    setSpec={setSpec}
                    setQAssetName={setQAssetName}
                    setQAssetSeq={setQAssetSeq}
                    setQItemName={setQItemName}
                    setQItemNo={setQItemNo}
                    setQSpec={setQSpec}
                  />
                )}
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('3259')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={AssetName}
                  onChange={(e) => {
                    setAssetName(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('324')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMQcKindName}
                  onChange={onChangeSMQcKindName}
                  showSearch
                  allowClear
                  placeholder={t('3259')}
                  options={[
                    ...(dataSMQcKindName?.map((item) => ({
                      label: item?.MinorName,
                      value: item?.Value,
                    })) || []),
                  ]}
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
          </Row>
        </Form>
      </div>
      <div className="flex p-2 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white">
        <Form layout="vertical">
          <Row className="gap-4 flex items-center">
            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('475')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMTestMethodName}
                  onChange={onChangeSMTestMethodName}
                  showSearch
                  allowClear
                  placeholder={t('475')}
                  options={[
                    ...(dataSMTestMethodName?.map((item) => ({
                      label: item?.MinorName,
                      value: item?.Value,
                    })) || []),
                  ]}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('2122')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMQcTitleLevelName}
                  onChange={onChangeSMQcTitleLevelName}
                  showSearch
                  allowClear
                  placeholder={t('2122')}
                  options={[
                    ...(dataSMQcTitleLevelName?.map((item) => ({
                      label: item?.MinorName,
                      value: item?.Value,
                    })) || []),
                  ]}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('1520')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMSamplingStdName}
                  onChange={onChangeSMSamplingStdName}
                  showSearch
                  allowClear
                  placeholder={t('1520')}
                  options={[
                    ...(dataSMSamplingStdName?.map((item) => ({
                      label: item?.MinorName,
                      value: item?.Value,
                    })) || []),
                  ]}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('807')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMAQLStrictName}
                  onChange={onChangeSMAQLStrictName}
                  showSearch
                  allowClear
                  placeholder={t('807')}
                  options={[
                    ...(dataSMAQLStrictName?.map((item) => ({
                      label: item?.MinorName,
                      value: item?.Value,
                    })) || []),
                  ]}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('13932')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMAQLLevelName}
                  onChange={onChangeSMAQLLevelName}
                  showSearch
                  allowClear
                  placeholder={t('13932')}
                  options={[
                    ...(dataSMAQLLevelName?.map((item) => ({
                      label: item?.MinorName,
                      value: item?.Value,
                    })) || []),
                  ]}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('29615')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMAQLPointName}
                  onChange={onChangeSMAQLPointName}
                  showSearch
                  allowClear
                  placeholder={t('29615')}
                  options={[
                    ...(dataSMAQLPointName?.map((item) => ({
                      label: item?.MinorName,
                      value: item?.Value,
                    })) || []),
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  )
}
