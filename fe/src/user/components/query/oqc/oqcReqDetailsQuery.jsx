import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select, InputNumber, message } from 'antd'
import { CompactSelection } from '@glideapps/glide-data-grid'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import { useTranslation } from 'react-i18next'
export default function OqcReqDetailQuery({
  dataMaster,
  dataSMQcType,

  dataSMAQLStrict,
  dataSMAQLLevelName,
  dataAQLAcValue,
  dataSMTestMethodName,
  dataSMSamplingStdName,

  setSMQcType,
  BLNo,
  setBLNo,

  setEmpSeq,
  setEmpName,
  setUserId,

  dataUser,

  QCNo,
  setQCNo,

  SMTestMethodName,
  setSMTestMethodName,
  SMSamplingStd,
  setSMSamplingStd,

  SMSamplingStdName,
  setSMSamplingStdName,

  SMAQLLevel,
  setSMAQLLevel,

  SMAQLLevelName,
  setSMAQLLevelName,

  AQLPoint,
  setAQLPoint,

  SMAQLStrict,
  setSMAQLStrict,

  SMAQLStrictName,
  setSMAQLStrictName,
  AQLAcValue,
  setAQLAcValue,
  AQLReValue,
  setAQLReValue,
  AcBadRatio,
  setAcBadRatio,
  ReqQty,
  setReqQty,
  ReqSampleQty,
  setReqSampleQty,
  WorkDate,
  setWorkDate,
  SelectDate,
  setSelectDate,
  TestStartDate,
  setTestStartDate,
  TestEndDate,
  setTestEndDate,
  TestDocNo,
  setTestDocNo,
  RealSampleQty,
  setRealSampleQty,
  setLotNo,
  setSerialNoFr,
  setSerialNoTo,
  DelvNo,
  setDelvNo,

  SampleNo,
  setSampleNo,
  BadSampleQty,
  setBadSampleQty,
  BadSampleRate,
  SMTestResult,
  setSMTestResult,
  SMTestResultName,
  setSMTestResultName,
  PassedQty,
  setPassedQty,
  RejectQty,
  setRejectQty,
  DisposeQty,
  setDisposeQty,
  ReqInQty,
  setReqInQty,
  TestUsedTime,
  setTestUsedTime,
  Remark,
  setRemark,
  SMRejectTransType,
  EmpSeq,
  DeptSeq,
  EmpName,
  Memo1,
  setMemo1,
  Memo2,
  setMemo2,
  FileSeq,
  IsReCfm,
  setIsReCfm,
  QCSeq,
  setLoading,
}) {

  const gridPeopleRef = useRef(null)
  const { t } = useTranslation()

  const [modalVisiblePeople, setModalVisiblePeople] = useState(false)
  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const dropdownRefP = useRef()

  const onChangeTestStartDate = (date) => {
    setTestStartDate(date)
  }

  const onChangeTestEndDate = (date) => {
    setTestEndDate(date)
  }

  const onChangeSMTestResultName = useCallback(
    (data) => {
      const itemSelect = dataSMQcType.find((item) => item.Value === data)
      if (itemSelect) {
        setSMTestResult(itemSelect.Value)
        setSMTestResultName(itemSelect.MinorName)

        if (itemSelect.Value === 6035003) {
          setPassedQty(ReqQty)
          setReqInQty(ReqQty)
          setAcBadRatio(0)
          setRejectQty(0)
        } else if (itemSelect.Value === 6035004) {
          setPassedQty(0)
          setReqInQty(0)
          setAcBadRatio(100)
          setRejectQty(ReqQty)
        }
      }
    },
    [dataSMQcType, dataMaster],
  )

  const onChangeRejectQty = useCallback(
    (data) => {
      if (SMTestResult === 6035006) {
        if (data > ReqQty || data < 0) {
          message.error('Số lượng lỗi không lớn hơn/nhỏ hơn số lượng kiểm tra')
          setRejectQty(0)
        } else {
          const passedQty = ReqQty - data
          setPassedQty(passedQty)
          setReqInQty(passedQty)
          setRejectQty(data)
          setAcBadRatio((passedQty / ReqQty) * 100)
        }
      }
    },

    [PassedQty, RejectQty, SMTestResult],
  )

  const onChangePassedQty = useCallback(
    (data) => {
      if (SMTestResult === 6035006) {
        if (data > ReqQty || data < 0 ) {
          message.error('Số lượng đạt không lớn hơn/nhỏ hơn số lượng kiểm tra')
          setPassedQty(0)
        } else {
          const rejectQty = ReqQty - data
          setPassedQty(data)
          setRejectQty(rejectQty)
          setReqInQty(data)
          setAcBadRatio((rejectQty / ReqQty) * 100)
        }
      }
    },

    [PassedQty, RejectQty, SMTestResult, ReqInQty],
  )

  const onChangeDisposeQty = useCallback(
    (data) => {
      if (RejectQty < data || data < 0) {
        message.error('Số lượng hủy không lớn hơn/nhỏ hơn số lượng lỗi')
        setDisposeQty(0)
      } else {
        setDisposeQty(data)
      }
    },

    [PassedQty, RejectQty, SMTestResult, ReqInQty],
  )

  const onChangeRealSampleQty = (e) => {
    if(e < 0){
      message.error('Giá trị không thể nhỏ hơn 0')
      setRealSampleQty(0)
    }else{
      setRealSampleQty(e)
    }
  }

  const onChangeSMAQLStrict = 
    (data) => {
      const itemSelect = dataSMAQLStrict.find((item) => item.Value === data)
      if (itemSelect) {
        setSMAQLStrict(itemSelect.Value)
        setSMAQLStrictName(itemSelect.MinorName) 
    }
  }

  const onChangeSMAQLLevelName = 
    (data) => {
      const itemSelect = dataSMAQLLevelName.find((item) => item.Value === data)
      if (itemSelect) {
        setSMAQLLevel(itemSelect.Value)
        setSMAQLLevelName(itemSelect.MinorName) 
    }
  }
  const onChangeAQLAcValue = 
    (data) => {
      const itemSelect = dataAQLAcValue.find((item) => item.Value === data)
      if (itemSelect) {
        setAQLAcValue(itemSelect.MinorName) 
    }
  }

  const onChangeSMTestMethodName = 
    (data) => {
      const itemSelect = dataSMTestMethodName.find((item) => item.Value === data)
      if (itemSelect) {
        setSMTestMethodName(itemSelect.MinorName) 
    }
  }

  const onChangeSMSamplingStdName = (data) => {
    const itemSelect = dataSMSamplingStdName.find((item) => item.Value === data)
    if (itemSelect) {
      setSMSamplingStd(itemSelect.MinorName)
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
                  <span className="uppercase text-[9px]">{t('1377')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={dataMaster?.DelvNo}
                  onChange={(e) => {
                    setDelvNo(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('744')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[315px]"
                  size="middle"
                  value={dataMaster?.DeptName}
                  onChange={(e) => {
                    setQCNo(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={<span className="uppercase text-[10px]">{t('218')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <DatePicker
                  size="middle"
                  value={WorkDate}
                />
              </Form.Item>
            </Col>

            

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
                  value={dataMaster?.ItemName}
                  onChange={(e) => {
                    setQCNo(e.target.value)
                  }}
                  disabled="fasle"
                />
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
                  value={dataMaster?.ItemNo}
                  onChange={(e) => {
                    setQCNo(e.target.value)
                  }}
                  disabled="fasle"
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
                  value={dataMaster?.Spec}
                  onChange={(e) => {
                    setQCNo(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('31839')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={dataMaster?.SerialNoFr}
                  onChange={(e) => {
                    setSerialNoFr(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('31840')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={dataMaster?.SerialNoTo}
                  onChange={(e) => {
                    setSerialNoTo(e.target.value)
                  }}
                  disabled="fasle"
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
                  value={dataMaster?.LOTNo}
                  onChange={(e) => {
                    setLotNo(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="flex p-2 mt-1 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white">
        <Form layout="vertical">
          <Row className="gap-4 flex items-center">
            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('2219')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <InputNumber
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={ReqQty}
                  onChange={(e) => {
                    setReqQty(e)
                  }}
                  disabled="fasle"
                  formatter={(value) =>
                    value != null
                      ? new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        }).format(Number(value))
                      : ""
                  }
                  parser={(value) => value?.replace(/,/g, "")}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('2627')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={QCNo}
                  onChange={(e) => {
                    setQCNo(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('475')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  placeholder=""
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMTestMethodName}
                  onChange={onChangeSMTestMethodName}
                  disabled="fasle"
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
                  <span className="uppercase text-[9px]">
                    {t('1520')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  placeholder=""
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMSamplingStdName}
                  onChange={onChangeSMSamplingStdName}
                  disabled="fasle"
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
                label={
                  <span className="uppercase text-[10px]">{t('6415')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <DatePicker
                  size="middle"
                  value={SelectDate}
                  onChange={setSelectDate}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('2220')}</span>
                }
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
                    nameCodeHelp={t('2220')}
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
                  />
                )}
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('2200')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  placeholder=""
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMAQLLevelName}
                  onChange={onChangeSMAQLLevelName}
                  disabled="fasle"
                  options={[
                    (dataSMAQLLevelName?.map((item) => ({
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
                  <span className="uppercase text-[10px]">
                    {t('2192')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <DatePicker
                  size="middle"
                  value={TestStartDate}
                  onChange={onChangeTestStartDate}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('2926')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <InputNumber
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={ReqSampleQty}
                  onChange={(e) => {
                    setReqSampleQty(e)
                  }}
                  disabled="fasle"
                  formatter={(value) =>
                    value != null
                      ? new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        }).format(Number(value))
                      : ""
                  }
                  parser={(value) => value?.replace(/,/g, "")}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('13933')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  placeholder=""
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={SMAQLStrictName}
                  onChange={onChangeSMAQLStrict}
                  disabled="fasle"
                  options={[
                    ...(dataSMAQLStrict?.map((item) => ({
                      label: item?.MinorName,
                      value: item?.Value,
                    })) || []),
                  ]}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('29615')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Select
                  placeholder=""
                  size="middle"
                  style={{
                    width: 150,
                  }}
                  value={AQLAcValue}
                  onChange={onChangeAQLAcValue}
                  disabled="fasle"
                  options={[
                    ...(dataAQLAcValue?.map((item) => ({
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
                  <span className="uppercase text-[10px]">
                    {t('2199')}
                  </span>
                }
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
                label={
                  <span className="uppercase text-[9px]">
                    {t('6995')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={TestDocNo}
                  onChange={(e) => {
                    setTestDocNo(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('18638')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={IsReCfm}
                  onChange={(e) => {
                    setIsReCfm(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('29792')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={AQLReValue}
                  onChange={(e) => {
                    setAQLReValue(e.target.value)
                  }}
                  disabled="fasle"
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('15562')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <InputNumber
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={RealSampleQty}
                  onChange={onChangeRealSampleQty}
                  formatter={(value) =>
                    value != null
                      ? new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        }).format(Number(value))
                      : ""
                  }
                  parser={(value) => value?.replace(/,/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="flex p-2 mt-1 gap-4 group [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white">
        <Form layout="vertical">
          <Row className="gap-4 flex items-center">
            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('6411')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <InputNumber
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={BadSampleQty}
                  onChange={(e) => {
                    setBadSampleQty(e)
                  }}
                  formatter={(value) =>
                    value != null
                      ? new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        }).format(Number(value))
                      : ""
                  }
                  parser={(value) => value?.replace(/,/g, "")}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('2193')}</span>
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
                  value={SMTestResultName}
                  onChange={onChangeSMTestResultName}
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
                label={
                  <span className="uppercase text-[9px]">
                    {t('8017')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <InputNumber
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={ReqInQty}
                  onChange={(e) => {
                    setReqInQty(e)
                  }}
                  disabled="true"
                  formatter={(value) =>
                    value != null
                      ? new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        }).format(Number(value))
                      : ""
                  }
                  parser={(value) => value?.replace(/,/g, "")}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('2203')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <InputNumber
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={DisposeQty}
                  onChange={onChangeDisposeQty}
                  formatter={(value) =>
                    value != null
                      ? new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        }).format(Number(value))
                      : ""
                  }
                  parser={(value) => value?.replace(/,/g, "")}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('2201')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={TestUsedTime}
                  onChange={(e) => {
                    setTestUsedTime(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('10537')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <InputNumber
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={PassedQty}
                  onChange={onChangePassedQty}
                  formatter={(value) =>
                    value != null
                      ? new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        }).format(Number(value))
                      : ""
                  }
                  parser={(value) => value?.replace(/,/g, "")}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">
                    {t('6024')}
                  </span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <InputNumber
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={RejectQty}
                  onChange={onChangeRejectQty}
                  formatter={(value) =>
                    value != null
                      ? new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        }).format(Number(value))
                      : ""
                  }
                  parser={(value) => value?.replace(/,/g, "")}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('14400')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={AcBadRatio}
                  disabled
                  onChange={(e) => {
                    setAcBadRatio(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={
                  <span className="uppercase text-[9px]">{t('14422')}</span>
                }
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={Remark}
                  onChange={(e) => {
                    setRemark(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('19799')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={Memo1}
                  onChange={(e) => {
                    setMemo1(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('19800')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={Memo2}
                  onChange={(e) => {
                    setMemo2(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item
                label={<span className="uppercase text-[9px]">{t('14831')}</span>}
                style={{ marginBottom: 0 }}
                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                wrapperCol={{ style: { padding: 0 } }}
              >
                <Input
                  placeholder=""
                  className="w-[150px]"
                  size="middle"
                  value={SampleNo}
                  onChange={(e) => {
                    setSampleNo(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  )
}
