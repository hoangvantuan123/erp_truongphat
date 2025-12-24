import {
  Form,
  Input,
  Row,
  Col,
  Space,
  DatePicker,
  Checkbox,
  Select,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useEffect, useRef, useState } from 'react'
import CodeHelpDepartment from '../../table/codeHelp/codeHelpDepartment'
import CodeHelpPossition from '../../table/codeHelp/codeHelpPossition'
import CodeHelpOrdName from '../../table/codeHelp/codeHelpOrdName'
import CodeHelpPeople from '../../table/codeHelp/codeHelpPeople'
import CodeHelpTeam from '../../table/codeHelp/codeHelpTeam'
import CodeHelpPart from '../../table/codeHelp/codeHelpPart'

export default function HrAdmMultiOrdQuery({
  DeptData,
  PosData,
  OrdData,
  UMJpNameData,
  dataUser,
  UMPgNameData,
  UMJdNameData,
  UMJoNameData,
  PuNameData,
  PtNameData,
  UMWsNameData,
  EntRetTypeNameData,

  OrdName,
  setOrdName,
  ordSeq,
  setOrdSeq,

  EmpName,
  setEmpName,
  EmpSeq,
  setEmpSeq,
  ToOrdDate,
  setToOrdDate,
  DeptName,
  setDeptName,
  DeptSeq,
  setDeptSeq,
  PosName,
  setPosName,
  PosSeq,
  setPosSeq,

  UMWsName,
  setUMWsName,
  UMWsSeq,
  setUMWsSeq,

  PtName,
  setPtName,
  PtSeq,
  setPtSeq,
  PuName,
  setPuName,
  setPuSeq,
  UMPgName,
  setUMPgName,
  setUMPgSeq,
  UMJpName,
  setUMJpName,
  setUMJpSeq,
  EntRetTypeName,
  setEntRetTypeName,
  setEntRetTypeSeq,
  UMJoName,
  setUMJoName,
  UMJoSeq,
  setUMJoSeq,
  UMJdName,
  setUMJdName,
  UMJdSeq,
  setUMJdSeq,
  FrOrdDate,
  setFrOrdDate,
  EmpID,
  setEmpID,
  IsLast,
  setIsLast,
}) {
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const [modalVisibleDept, setModalVisibleDept] = useState(false)
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [DeptSearchSh, setDeptSearchSh] = useState('')

  const [modalVisiblePos, setModalVisiblePos] = useState(false)
  const [selectionPos, setSelectionPos] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [PosSearchSh, setPosSearchSh] = useState('')

  const [modalVisibleEmpName, setModalVisibleEmpName] = useState(false)
  const [selectionEmpName, setSelectionEmpName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [EmpSearchSh, setEmpSearchSh] = useState('')
  const [selectEmp, setSelectEmp] = useState(null)

  const [modalVisibleUMJdName, setModalVisibleUMJdName] = useState(false)
  const [selectionUMJdName, setSelectionUMJdName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [UMJdNameSearchSh, setUMJdNameSearchSh] = useState('')

  const [modalVisibleUMJoName, setModalVisibleUMJoName] = useState(false)
  const [selectionUMJoName, setSelectionUMJoName] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [UMJoNameSearchSh, setUMJoNameSearchSh] = useState('')

  const [modalVisibleOrd, setModalVisibleOrd] = useState(false)
  const [selectionOrd, setSelectionOrd] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [OrdSearchSh, setOrdSearchSh] = useState('')


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleDept(false)
      setModalVisiblePos(false)
      setModalVisibleEmpName(false)
      setModalVisibleUMJdName(false)
      setModalVisibleUMJoName(false)
      setModalVisibleOrd(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onChangeIsLast = (e) => {
    const value = e.target.checked ? 1 : 0
    setIsLast(value)
  }

  const onChangeUMJpName = (value) => {

    if (value === null || value === undefined) {
      setUMJpName('')
      setUMJpSeq('')
    } else {
      const itemSelect = UMJpNameData.find((item) => item.Value === value)

      if (itemSelect) {
        setUMJpSeq(itemSelect.Value)
        setUMJpName(itemSelect.MinorName)
      }
    }
  }

  const onChangePuName = (value) => {

    if (value === null || value === undefined) {
      setPuName('')
      setPuSeq('')
    } else {
      const itemSelect = PuNameData.find((item) => item.PuSeq === value)

      if (itemSelect) {
        setPuSeq(itemSelect.PuSeq)
        setPuName(itemSelect.PuName)
      }
    }
  }

  const onChangePtName = (e) => {

    if (e === null || e === undefined) {
      setPtName('')
      setPtSeq('')
    } else {
      const itemSelect = PtNameData.find((item) => item.PtSeq === e)

      if (itemSelect) {
        setPtSeq(itemSelect.PtSeq)
        setPtName(itemSelect.PtName)
      }
  }
}

  const onChangeUMPgName = (e) => {
    if (e === null || e === undefined) {
      setUMPgName('')
      setUMPgSeq('')
    } else {
      const itemSelect = UMPgNameData.find((item) => item.Value === e)

      if (itemSelect) {
        setUMPgSeq(itemSelect.Value)
        setUMPgName(itemSelect.MinorName)
      }
    }
  }

  const onChangeUMWsName = (e) => {
    if (e === null || e === undefined) {
      setUMWsName('')
      setUMWsSeq('')
    } else {
      const itemSelect = UMWsNameData.find((item) => item.Value === e)

      if (itemSelect) {
        setUMWsSeq(itemSelect.Value)
        setUMWsName(itemSelect.MinorName)
      }
    }
  }

  const onChangeEntRetTypeName = (e) => {
    if (e === null || e === undefined) {
      setEntRetTypeName('')
    } else {
      const itemSelect = EntRetTypeNameData.find((item) => item.Value === e)

      if (itemSelect) {
        setEntRetTypeName(itemSelect.MinorName)
        setEntRetTypeSeq(itemSelect.Value)
      }
  }
}

  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1352')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={ FrOrdDate }
                  onChange={(date) =>  setFrOrdDate(date)}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1352')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={ToOrdDate}
                  onChange={(date) => setToOrdDate(date)}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('367')}</span>}
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
                  data={DeptData}
                  nameCodeHelp={t('367')}
                  modalVisibleDept={modalVisibleDept}
                  setModalVisibleDept={setModalVisibleDept}
                  dropdownRef={dropdownRef}
                  deptSearchSh={DeptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
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
                className="w-[150px]"
                size="middle"
                value={PosName}
                onFocus={() => setModalVisiblePos(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisiblePos && (
                <CodeHelpPossition
                  data={PosData}
                  nameCodeHelp={t('373')}
                  modalVisible={modalVisiblePos}
                  setModalVisible={setModalVisiblePos}
                  dropdownRef={dropdownRef}
                  searchSh={PosSearchSh}
                  setSearchSh={setPosSearchSh}
                  selection={selectionPos}
                  setSelection={setSelectionPos}
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
              label={<span className="uppercase text-[9px]">{t('13623')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={OrdName}
                onFocus={() => setModalVisibleOrd(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleOrd && (
                <CodeHelpOrdName
                  data={OrdData}
                  nameCodeHelp={t('13623')}
                  modalVisible={modalVisibleOrd}
                  setModalVisible={setModalVisibleOrd}
                  dropdownRef={dropdownRef}
                  searchSh={OrdSearchSh}
                  setSearchSh={setOrdSearchSh}
                  selection={selectionOrd}
                  setSelection={setSelectionOrd}
                  ordName={OrdName}
                  setOrdName={setOrdName}
                  setOrdSeq={setOrdSeq}
                  ordSeq={ordSeq}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('642')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={UMJpName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeUMJpName}
                allowClear
                options={[
                  ...(UMJpNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                placeholder={t('642')}
                maxTagCount={'responsive'}
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
                className="w-[150px]"
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
                  empName={EmpName}
                  setEmpName={setEmpName}
                  empSeq={EmpSeq}
                  setEmpSeq={setEmpSeq}
                  setUserId={setEmpID}
                  setSelectEmp={setSelectEmp}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1452')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={EmpID}
                disabled
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('635')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={UMPgName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeUMPgName}
                allowClear
                options={[
                  ...(UMPgNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                placeholder={t('635')}
                maxTagCount={'responsive'}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1296')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={UMJdName}
                onFocus={() => setModalVisibleUMJdName(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleUMJdName && (
                <CodeHelpTeam
                  data={UMJdNameData}
                  nameCodeHelp={t('1296')}
                  modalVisible={modalVisibleUMJdName}
                  setModalVisible={setModalVisibleUMJdName}
                  dropdownRef={dropdownRef}
                  searchSh={UMJdNameSearchSh}
                  setSearchSh={setUMJdNameSearchSh}
                  selection={selectionUMJdName}
                  setSelection={setSelectionUMJdName}
                  UMJdName={UMJdName}
                  setUMJdName={setUMJdName}
                  setUMJdSeq={setUMJdSeq}
                  UMJdSeq={UMJdSeq}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1295')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={UMJoName}
                onFocus={() => setModalVisibleUMJoName(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleUMJoName && (
                <CodeHelpPart
                  data={UMJoNameData}
                  nameCodeHelp={t('1295')}
                  modalVisible={modalVisibleUMJoName}
                  setModalVisible={setModalVisibleUMJoName}
                  dropdownRef={dropdownRef}
                  searchSh={UMJoNameSearchSh}
                  setSearchSh={setUMJoNameSearchSh}
                  selection={selectionUMJoName}
                  setSelection={setSelectionUMJoName}
                  UMJoName={UMJoName}
                  setUMJoName={setUMJoName}
                  setUMJoSeq={setUMJoSeq}
                  UMJoSeq={UMJoSeq}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('622')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={PuName}
                size="middle"
                style={{ width: 150 }}
                allowClear
                onChange={onChangePuName}
                options={[
                  ...(PuNameData?.map((item) => ({
                    label: item?.PuName,
                    value: item?.PuSeq,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('583')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={PtName}
                size="middle"
                style={{ width: 150 }}
                allowClear
                onChange={onChangePtName}
                options={[
                  ...(PtNameData?.map((item) => ({
                    label: item?.PtName,
                    value: item?.PtSeq,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('553')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={UMWsName}
                size="middle"
                style={{ width: 150 }}
                allowClear
                onChange={onChangeUMWsName}
                options={[
                  ...(UMWsNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('917')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={EntRetTypeName}
                size="middle"
                style={{ width: 150 }}
                allowClear
                onChange={onChangeEntRetTypeName}
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
              label={<span className="uppercase text-[10px]"></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Checkbox checked={IsLast === 1} onChange={onChangeIsLast}>
                {t('18106')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
