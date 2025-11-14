import { CompactSelection } from '@glideapps/glide-data-grid'
import {
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
import CodeHelpMultiDepartment from '../../table/codeHelp/codeHelpMultiDepartment'

export default function InfoMultiEmpListQuery({
  DeptLevelData,
  JpNameData,
  PuNameData,
  PgNameData,
  UMSchCareerData,
  dataDept,

  DeptSeq,
  setDeptSeq,
  DeptName,
  setDeptName,

  EmpNameFr,
  setEmpNameFr,
  EmpNameTo,
  setEmpNameTo,

  EntDateFr,
  setEntDateFr,

  EntDateTo,
  setEntDateTo,

  RetDateTo,
  setRetDateTo,

  RetDateFr,
  setRetDateFr,

  DeptLevelName,
  setDeptLevelName,
  DeptLevelSeq,
  setDeptLevelSeq,

  IsRetire,
  setIsRetire,
  IsLowDept,
  setIsLowDept,
  setSelectDeptName,
  selectDeptName,

  selectPgName,
  setSelectPgName,
  selectPuName,
  setSelectPuName,
  selectUMSchCareer,
  setSelectUMSchCareer,
  selectJpName,
  setSelectJpName,

  
}) {
  const { t } = useTranslation()

  const gridRef = useRef(null)
  const dropdownRef = useRef(null)
  const [selectionUMSchCareerName, setSelectionUMSchCareerName] = useState({
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
  const [UMSchCareerSearchSh, setUMSchCareerSearchSh] = useState('')
  const [DeptSearchSh, setDeptSearchSh] = useState('')
  const [modalVisibleDept, setModalVisibleDept] = useState(false)
  const [modalVisiblePos, setModalVisiblePos] = useState(false)

  const onChangeDeptLevelName = (value) => {
    if (value === null || value === undefined) {
    setDeptLevelName('')
    setDeptLevelSeq('')
    } else {
      const itemSelect = DeptLevelData.find((item) => item.Value === value)

      if (itemSelect) {
        setDeptLevelName(itemSelect.MinorName)
        setDeptLevelSeq(itemSelect.Value)
      }
    }
  }

  const onChangePgName = (value) => {
    if (value === null || value === undefined) {
      setSelectPgName([])
    } else {
      setSelectPgName(value)
    }
  }

  const onChangeUMSchCareer = (value) => {
    if (value === null || value === undefined) {
      setSelectUMSchCareer([])
    } else {
      setSelectUMSchCareer(value)
    }
  }

  const onChangeJpName = (value) => {
    if (value === null || value === undefined) {
      setSelectJpName([])
    } else {
      setSelectJpName(value)
    }
  }

  const onChangePuName = (value) => {
    if (value === null || value === undefined) {
      setSelectPuName([])
    } else {
      setSelectPuName(value)
    }
  }

  const onChangeIsLowDept = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsLowDept(data)
  }

  const onChangeIsRetire = (value) => {
    const data = value.target.checked ? '1' : '0'
    setIsRetire(data)
  }

  const handleEntDateFr = (date) => {
    setEntDateFr(date)
  }

  const handleEntDateTo = (date) => {
    setEntDateTo(date)
  }

  const handleRetDateFr = (date) => {
    setRetDateFr(date)
  }

  const handleRetDateTo = (date) => {
    setRetDateTo(date)
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setModalVisibleUMSchCareerName(false)
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
              label={<span className="uppercase text-[9px]">{t('1584')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={EmpNameFr}
                onChange={(e) => setEmpNameFr(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={EmpNameTo}
                onChange={(e) => setEmpNameTo(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('215')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={EntDateFr}
                  onChange={handleEntDateFr}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('215')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={EntDateTo}
                  onChange={handleEntDateTo}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2383')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={RetDateFr}
                  onChange={handleRetDateFr}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2383')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={RetDateTo}
                  onChange={handleRetDateTo}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2978')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={DeptLevelName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeDeptLevelName}
                allowClear
                options={[
                  ...(DeptLevelData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('735')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={selectDeptName.map(item => item.BeDeptName).join(', ')}
                onFocus={() => setModalVisibleDept(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleDept && (
                <CodeHelpMultiDepartment
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
                  setSelectDeptName={setSelectDeptName}
                  selectDeptName={selectDeptName}
                />
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('17741')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={selectJpName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeJpName}
                allowClear
                options={[
                  ...(PgNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                mode="multiple"
                placeholder={t('17741')}
                maxTagCount={'responsive'}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('17749')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={selectPgName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangePgName}
                allowClear
                options={[
                  ...(JpNameData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                mode={'multiple'}
                placeholder={t('17749')}
                maxTagCount={'responsive'}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('19010')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={selectUMSchCareer}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangeUMSchCareer}
                allowClear
                options={[
                  ...(UMSchCareerData?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                mode="multiple"
                placeholder={t('19010')}
                maxTagCount={'responsive'}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('32021')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                value={selectPuName}
                size="middle"
                style={{ width: 150 }}
                onChange={onChangePuName}
                allowClear
                options={[
                  ...(PuNameData?.map((item) => ({
                    label: item?.PuName,
                    value: item?.PuSeq,
                  })) || []),
                ]}
                mode="multiple"
                placeholder={t('32021')}
                maxTagCount={'responsive'}
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
              <Checkbox checked={IsRetire === '1'} onChange={onChangeIsRetire}>
                {t('18507')}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
