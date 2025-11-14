import { CompactSelection } from '@glideapps/glide-data-grid'
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Checkbox,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPossition from '../../table/codeHelp/codeHelpPossition'

export default function InfoEmpListQuery({
  UMEmpTypeNameData,
  EntRetTypeNameData,
  SMIsForSeqData,
  SMIsOrdNameData,
  dataUser,
  dataDept,
  dataPos,

  UMEmpTypeName,
  setUMEmpTypeName,

  SMIsOrdName,
  setSMIsOrdName,

  EntRetTypeName,
  setEntRetTypeName,

  SMIsForSeq,
  setSMIsForSeq,
  SMIsForName,
  setSMIsForName,

  BaseDate,
  setBaseDate,

  IsLowDept,
  setIsLowDept,

  IsPhotoView,
  setIsPhotoView,

  EmpName,
  setEmpName,
  EmpSeq,
  setEmpSeq,
  setUserId,

  PosSeq,
  setPosSeq,
  setUMEmpType,
  setSMIsOrd,
  setEntRetType,
  DeptSeq,
  setDeptSeq,

  DeptName,
  setDeptName,

  PosName,
  setPosName,
}) {
  const { t } = useTranslation()

  const gridRef = useRef(null)
  const dropdownRef = useRef(null)
  const [selectionEmpName, setSelectionEmpName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionPos, setSelectionPos] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [EmpSearchSh, setEmpSearchSh] = useState('')
  const [DeptSearchSh, setDeptSearchSh] = useState('')
  const [PosSearchSh, setPosSearchSh] = useState('')
  const [modalVisibleEmpName, setModalVisibleEmpName] = useState(false)
  const [modalVisibleDept, setModalVisibleDept] = useState(false)
  const [modalVisiblePos, setModalVisiblePos] = useState(false)

  const onChangeUMEmpTypeName = (value) => {
    if (value === null || value === undefined) {
      setUMEmpTypeName('')
      setUMEmpType('')
    } else {
      const itemSelect = UMEmpTypeNameData.find((item) => item.Value === value)

      if (itemSelect) {
        setUMEmpTypeName(itemSelect.MinorName)
        setUMEmpType(itemSelect.Value)
      }
    }
  }

  const onChangeSMIsOrdName = (value) => {
    if (value === null || value === undefined) {
      setSMIsOrdName('')
      setSMIsOrd('')
    } else {
      const itemSelect = SMIsOrdNameData.find((item) => item.Value === value)

      if (itemSelect) {
        setSMIsOrdName(itemSelect.MinorName)
        setSMIsOrd(itemSelect.Value)
      }
    }
  }

  const onChangeEntRetTypeName = (value) => {
    if (value === null || value === undefined) {
      setEntRetTypeName('')
      setEntRetType('')
    } else {
      const itemSelect = EntRetTypeNameData.find(
        (item) => item.Value === value,
      )

      if (itemSelect) {
        setEntRetTypeName(itemSelect.MinorName)
        setEntRetType(itemSelect.Value)
      }
    }
  }

  const onChangeSMIsForSeq = (value) => {
    if (value === null || value === undefined) {
      setSMIsForSeq('')
    } else {
      const itemSelect = SMIsForSeqData.find((item) => item.Value === value)

      if (itemSelect) {
        setSMIsForSeq(itemSelect.Value)
        setSMIsForName(itemSelect.MinorName)
      }
    }
  }

  const onChangeIsLowDept = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsLowDept(data)
  }

  const onChangeIsPhotoView = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsPhotoView(data)
  }

  const handleBaseDate = (date) => {
    setBaseDate(date)
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleEmpName(false)
      setModalVisibleDept(false)
      setModalVisiblePos(false)
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
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('136')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={BaseDate}
                  onChange={handleBaseDate}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1479')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={UMEmpTypeName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeUMEmpTypeName}
                allowClear
                options={[
                  ...(UMEmpTypeNameData?.map((item) => ({
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
                <span className="uppercase text-[10px]">{t('13626')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={SMIsOrdName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeSMIsOrdName}
                allowClear
                options={[
                  ...(SMIsOrdNameData?.map((item) => ({
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
                <span className="uppercase text-[10px]">{t('17028')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={EntRetTypeName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeEntRetTypeName}
                allowClear
                options={[
                  ...(EntRetTypeNameData?.map((item) => ({
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
                <span className="uppercase text-[10px]">{t('12632')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={SMIsForName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeSMIsForSeq}
                allowClear
                options={[
                  ...(SMIsForSeqData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('4')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[310px]"
                size="middle"
                value={EmpName}
                onFocus={() => setModalVisibleEmpName(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleEmpName && (
                <CodeHelpPeople
                  data={dataUser}
                  nameCodeHelp={t('4')}
                  modalVisiblePeople={modalVisibleEmpName}
                  setModalVisiblePeople={setModalVisibleEmpName}
                  peopleSearchSh={EmpSearchSh}
                  dropdownRef={dropdownRef}
                  setPeopleSearchSh={setEmpSearchSh}
                  selectionPeople={selectionEmpName}
                  setSelectionPeople={setSelectionEmpName}
                  gridRef={gridRef}
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
              label={<span className="uppercase text-[9px]">{t('5')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[310px]"
                size="middle"
                value={DeptName}
                onFocus={() => setModalVisibleDept(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleDept && (
                <CodeHelpDepartment
                  data={dataDept}
                  nameCodeHelp={t('5')}
                  modalVisibleDept={modalVisibleDept}
                  setModalVisibleDept={setModalVisibleDept}
                  dropdownRef={dropdownRef}
                  deptSearchSh={DeptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  gridRef={gridRef}
                  deptName={DeptName}
                  setDeptName={setDeptName}
                  deptSeq={DeptSeq}
                  setDeptSeq={setDeptSeq}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('373')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[310px]"
                size="middle"
                value={PosName}
                onFocus={() => setModalVisiblePos(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisiblePos && (
                <CodeHelpPossition
                  data={dataPos}
                  nameCodeHelp={t('373')}
                  modalVisible={modalVisiblePos}
                  setModalVisible={setModalVisiblePos}
                  dropdownRef={dropdownRef}
                  searchSh={PosSearchSh}
                  setSearchSh={setPosSearchSh}
                  selection={selectionPos}
                  setSelection={setSelectionPos}
                  gridRef={gridRef}

                  possitionName={PosName}
                  setPossitionName={setPosName}
                  setPossitionSeq={setPosSeq}
                  possitionSeq={PosSeq}
                />
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox
                checked={IsLowDept === '1'}
                onChange={onChangeIsLowDept}
              >
                {t('763')}
              </Checkbox>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox
                checked={IsPhotoView === '1'}
                onChange={onChangeIsPhotoView}
              >
                {t('14623')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
