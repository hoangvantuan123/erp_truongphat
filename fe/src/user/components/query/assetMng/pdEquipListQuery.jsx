import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Space,
  DatePicker,
  Select,
  Upload,
  Image,
  message,
  Checkbox,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
  CompactSelection,
} from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import DropdownUser from '../../sheet/query/dropdownUsers'
import DropdownUMToolKindName from '../../sheet/query/dropdownUMToolKindName'
import DropdownAsstName from '../../sheet/query/dropdownAsstName'
import enUS from 'antd/es/calendar/locale/en_US'
import DropdownEmp from '../../sheet/query/dropdownEmp'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function PdEquipListQuery({
  CustData,
  SMStatusData,
  setSMStatusData,
  UmToolKindData,
  setUmToolKindData,
  EmpData,
  setEmpData,
  AssetData,
  setAssetData,

  UmToolKind,
  setUmToolKind,
  UmToolKindName,
  setUmToolKindName,

  ToolName,
  setToolName,
  setToolSeq,

  ToolNo,
  setToolNo,
  Spec,
  setSpec,

  SMStatus,
  setSMStatus,
  SMStatusName,
  setSMStatusName,
  InstallArea,
  setInstallArea,

  MoveEmpName,
  setMoveEmpName,

  EmpName,
  setEmpName,
  EmpSeq,
  setEmpSeq,

  DeptName,
  setDeptName,
  DeptSeq,
  setDeptSeq,

  AsstName,
  setAsstName,
  setAsstSeq,

  AssetName,
  setAssetName,

  AssetNo,
  setAssetNo,
  IsMold,
  setIsMold,
  
  CustNo,
  setCustNo,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)
  const [dropdownVisibleAsst, setDropdownVisibleAsst] = useState(false)
  const [dropdownVisibleDept, setDropdownVisibleDept] = useState(false)
  const [dropdownVisiblePUCustName, setDropdownVisiblePUCustName] =
    useState(false)
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const { t } = useTranslation()

  const dropdownRef = useRef(null)

  const [selectionCust, setSelectionCust] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [custSearchSh, setCustSearchSh] = useState('')
  const [CustName, setCustName] = useState('')
  const [CustSeq, setCustSeq] = useState('')

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url?.substring(file.url.lastIndexOf('/') + 1),
    )
  }

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const onChangeToolName = (e) => {
    setToolName(e.target.value)
  }

  const onChangeToolNo = (e) => {
    setToolNo(e.target.value)
  }

  const onChangeSpec = (e) => {
    setSpec(e.target.value)
  }

  const onChangeSMStatus = (value) => {
    if (value === null || value === undefined) {
      setSMStatus('')
      setSMStatusName('')
    } else {
      const itemSelect = SMStatusData.find((item) => item.Value === value)

      if (itemSelect) {
        setSMStatus(itemSelect.Value)
        setSMStatusName(itemSelect.MinorName)
      }
    }
  }

  const onChangeToolKind = (value) => {
    if (value === null || value === undefined) {
      setUmToolKind('')
      setUmToolKindName('')
    } else {
      const itemSelect = UmToolKindData.find((item) => item.Value === value)

      if (itemSelect) {
        setUmToolKind(itemSelect.Value)
        setUmToolKindName(itemSelect.MinorName)
      }
    }
  }

  const onChangeInstallArea = (e) => {
    setInstallArea(e.target.value)
  }

  const onChangeMoveEmpName = (e) => {
    setMoveEmpName(e.target.value)
  }

  const onChangeDeptName = (e) => {
    setDeptName(e.target.value)
  }

  const onChangeAssetName = (e) => {
    setAssetName(e.target.value)
  }

  const onChangeAssetNo = (e) => {
    setAssetNo(e.target.value)
  }

  const onChangeIsMold = (e) => {
    setIsMold(e.target.checked)
  }

  return (
    <div className="flex gap-4 mt-2">
      <Row gutter={16} style={{ width: '100%' }}>
        <Col flex="auto">
          <Form variant="filled" layout="vertical">
            <Row gutter={[16, 8]}>
              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1576')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={ToolName}
                    onChange={onChangeToolName}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('654')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={ToolNo}
                    onChange={onChangeToolNo}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('551')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={Spec}
                    onChange={onChangeSpec}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1577')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Select
                    id="typeSelect"
                    value={SMStatus}
                    size="middle"
                    style={{ width: 150 }}
                    onChange={onChangeSMStatus}
                    allowClear
                    options={[
                      ...(SMStatusData?.map((item) => ({
                        label: item?.MinorName,
                        value: item?.Value,
                      })) || []),
                    ]}
                    placeholder={t('1577')}
                    maxTagCount={'responsive'}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1579')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Select
                    id="typeSelect"
                    value={UmToolKindName}
                    size="middle"
                    style={{ width: 150 }}
                    onChange={onChangeToolKind}
                    allowClear
                    options={[
                      ...(UmToolKindData?.map((item) => ({
                        label: item?.MinorName,
                        value: item?.Value,
                      })) || []),
                    ]}
                    placeholder={t('1577')}
                    maxTagCount={'responsive'}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('661')}</span>
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
                    onFocus={() => setDropdownVisible(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisible && (
                    <DropdownEmp
                      helpData={EmpData}
                      setHelpData05={setEmpData}
                      EmpName={EmpName}
                      setEmpName={setEmpName}
                      setEmpSeq={setEmpSeq}
                      setDeptName={setDeptName}
                      setDeptSeq={setDeptSeq}
                      setDropdownVisible={setDropdownVisible}
                      dropdownVisible={dropdownVisible}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('520')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={DeptName}
                    onFocus={() => setDropdownVisibleDept(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisibleDept && (
                    <DropdownAsstName
                      helpData={AssetData}
                      setHelpData05={setAssetData}
                      AsstName={AsstName}
                      setAsstName={setAsstName}
                      setAsstSeq={setAsstSeq}
                      AssetName={DeptName}
                      setAssetName={setDeptName}
                      setDropdownVisible={setDropdownVisibleDept}
                      dropdownVisible={dropdownVisibleDept}
                    />
                  )}
                </Form.Item>
              </Col>

              
              <Col>
                <Form.Item
      
                  label={
                    <span className="uppercase text-[9px]">{t('534')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={CustName}
                    style={{ backgroundColor: '#e8f0ff' }}
                    onFocus={() => setDropdownVisiblePUCustName(true)}
                  />
                  {dropdownVisiblePUCustName && (
                    <CodeHelpCust
                      data={CustData}
                      nameCodeHelp={t('695')}
                      modalVisibleCust={dropdownVisiblePUCustName}
                      setModalVisibleCust={setDropdownVisiblePUCustName}
                      custSearchSh={custSearchSh}
                      setCustSearchSh={setCustSearchSh}
                      selectionCust={selectionCust}
                      setSelectionCust={setSelectionCust}
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
                  label={
                    <span className="uppercase text-[9px]">{t('1528')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={AssetNo}
                    onChange={onChangeAssetNo}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('17377')}</span>
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
                    onChange={onChangeAssetName}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
