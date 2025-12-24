import { useState } from 'react'
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  Checkbox,
} from 'antd'

import { useTranslation } from 'react-i18next'
import DropdownUMToolKindName from '../../sheet/query/dropdownUMToolKindName'

import DropdownEmp from '../../sheet/query/dropdownEmp'
import DropdownAsset from '../../sheet/query/dropdownAsset'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function PdEquipQuery({
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

  AsstNo,
  setAsstNo,

  Remark,
  setRemark,
  IsMold,
  setIsMold,

}) {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)
  const [dropdownVisibleAsst, setDropdownVisibleAsst] = useState(false)
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const { t } = useTranslation()

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

  const onChangeInstallArea = (e) => {
    setInstallArea(e.target.value)
  }

  const onChangeMoveEmpName = (e) => {
    setMoveEmpName(e.target.value)
  }

  const onChangeDeptName = (e) => {
    setDeptName(e.target.value)
  }

  const onChangeAsstNo = (e) => {
    setAsstNo(e.target.value)
  }

  const onChangeRemark = (e) => {
    setRemark(e.target.value)
  }

  const onChangeIsMold = (e) => {
    if (e === null || e === undefined) {
      setIsMold(false)
    } else {
      setIsMold(e.target.checked)
    }
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
                    value={SMStatusName}
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
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={UmToolKindName}
                    onFocus={() => setDropdownVisible2(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisible2 && (
                    <DropdownUMToolKindName
                      helpData={UmToolKindData}
                      setHelpData05={setUmToolKindData}
                      UmToolKindName={UmToolKindName}
                      setUmToolKindName={setUmToolKindName}
                      setUmToolKind={setUmToolKind}
                      setDropdownVisible={setDropdownVisible2}
                      dropdownVisible={dropdownVisible2}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1582')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={InstallArea}
                    onChange={onChangeInstallArea}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('48782')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={MoveEmpName}
                    onChange={onChangeMoveEmpName}
                    disabled
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
                    onChange={onChangeDeptName}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1954')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={AsstName}
                    onFocus={() => setDropdownVisibleAsst(true)}
                    style={{ backgroundColor: '#e8f0ff' }}
                  />
                  {dropdownVisibleAsst && (
                    <DropdownAsset
                      helpData={AssetData}
                      setHelpData05={setAssetData}
                      AsstName={AsstName}
                      setAsstName={setAsstName}
                      setAsstSeq={setAsstSeq}
                      AsstNo={AsstNo}
                      setAsstNo={setAsstNo}
                      setDropdownVisible={setDropdownVisibleAsst}
                      dropdownVisible={dropdownVisibleAsst}
                      
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('1955')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[150px]"
                    size="middle"
                    value={AsstNo}
                    onChange={onChangeAsstNo}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label={
                    <span className="uppercase text-[9px]">{t('362')}</span>
                  }
                  style={{ marginBottom: 0 }}
                  labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                  wrapperCol={{ style: { padding: 0 } }}
                >
                  <Input
                    placeholder=""
                    className="w-[320px]"
                    size="middle"
                    value={Remark}
                    onChange={onChangeRemark}
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
                  <Checkbox checked={IsMold} onChange={onChangeIsMold}>
                    {t('675')}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
