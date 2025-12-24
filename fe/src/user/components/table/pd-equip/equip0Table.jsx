import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Button,
  Col,
  Form,
  Image,
  Select,
  Input,
  Row,
  Upload,
  Checkbox,
  DatePicker,
  message,
  InputNumber,
  Tooltip,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { PenOff, LockKeyhole } from 'lucide-react'
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { HrFileD } from '../../../../features/hr/hrFile/HrFileD'
import { HOST_API_SERVER_PUBIC } from '../../../../services'
import CodeHelpCust from '../codeHelp/codeHelpCust'
import { CompactSelection } from '@glideapps/glide-data-grid'
import DropdownFactData from '../../sheet/query/dropdownFactData'
import { PostImage } from '../../../../features/upload/postImage'

function Equip0Table({
  CustData,
  FactData,
  setFactData,
  dataSearch,
  dataRootInfo,
  form,
  dataSheetSearch,

  gridAvatar,
  setGridAvatar,

  CustSeq,
  setCustSeq,
  CustName,
  setCustName,
  setNationSeq,
  NationSeq,
  NationName,
  setNationName,
  ToolSeq,
}) {
  const uploadRef = useRef()
  const [file, setFile] = useState(null)
  const [img2, setImg2] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [previewImage2, setPreviewImage2] = useState(null)

  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [dropdownVisiblePUCustName, setDropdownVisiblePUCustName] =
    useState(false)

  const [dropdownVisibleNationName, setDropdownVisibleNationName] =
    useState(false)

  const { t } = useTranslation()

  const dropdownRef = useRef(null)

  const [selectionCust, setSelectionCust] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [custSearchSh, setCustSearchSh] = useState('')

  useEffect(() => {
    if (gridAvatar && gridAvatar.length > 0) {
      const rawPath1 = gridAvatar[0]?.Path
      const rawPath2 = gridAvatar[1]?.Path

      if (rawPath1) {
        const relativePath1 = rawPath1.replace('/ERP_CLOUD/asset_files/', '')
        setPreviewImage(`${HOST_API_SERVER_PUBIC}/viewer/${relativePath1}`)
      } else {
        setPreviewImage('')
      }

      if (rawPath2) {
        const relativePath2 = rawPath2.replace('/ERP_CLOUD/asset_files/', '')
        setPreviewImage2(`${HOST_API_SERVER_PUBIC}/viewer/${relativePath2}`)
      } else {
        setPreviewImage2('')
      }
    } else {
      setPreviewImage('')
      setPreviewImage2('')
    }
  }, [gridAvatar])

  useEffect(() => {
    form.setFieldsValue({
      ...dataSearch,

      PUCustName: CustName || '',
      NationName: NationName || '',
    })
  }, [form, CustName, NationName])

  const handleUploadImage = async () => {
    if (!file) {
      return
    }
    if (!ToolSeq) {
      return message.error('Vui lòng lưu thiết bị trước khi tải tệp lên!')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('Type', 'ASSET')
    formData.append('IdxNo', 1)
    formData.append('IdSeqAvatar', gridAvatar[0]?.IdSeq || null)

    setLoading(true)
    const result = await PostImage(formData, ToolSeq)
    setLoading(false)

    if (result.success) {
      message.success('Tải ảnh thành công!')
    } else {
      message.error(result.message || 'Tải ảnh thất bại!')
    }
  }

  const handleUploadImage2 = async () => {
    if (!img2) {
      return
    }
    if (!ToolSeq) {
      return message.error('Vui lòng lưu thiết bị trước khi tải tệp lên!')
    }

    const formData = new FormData()
    formData.append('file', img2)
    formData.append('Type', 'ASSET')
    formData.append('IdxNo', 2)
    formData.append('IdSeqAvatar', gridAvatar[1]?.IdSeq || null)

    setLoading(true)
    const result = await PostImage(formData, ToolSeq)
    setLoading(false)

    if (result.success) {
      message.success('Tải ảnh thành công!')
    } else {
      message.error(result.message || 'Tải ảnh thất bại!')
    }
  }
  const handleDeleteImage = async () => {
    if (!file && !previewImage) return
    setLoading2(true)

    try {
      const idSeq = gridAvatar[0]?.IdSeq
      if (idSeq) {
        const res = await HrFileD([{ IdSeq: idSeq }])
        setFile(null)
        setPreviewImage(null)
        message.success('Xóa thành công!')
        if (!res?.success) throw new Error(res?.message || 'Xóa ảnh thất bại')
      } else {
        setFile(null)
        setPreviewImage(null)
      }
    } catch {
      console.log('none')
    } finally {
      setLoading2(false)
    }
  }

  const handleDeleteImage2 = async () => {
    if (!img2 && !previewImage2) return
    setLoading2(true)

    try {
      const idSeq = gridAvatar[1]?.IdSeq
      if (idSeq) {
        const res = await HrFileD([{ IdSeq: idSeq }])
        setImg2(null)
        setPreviewImage2(null)
        message.success('Xóa thành công!')
        if (!res?.success) throw new Error(res?.message || 'Xóa ảnh thất bại')
      } else {
        setImg2(null)
        setPreviewImage2(null)
      }
    } catch {
      console.log('none')
    } finally {
      setLoading2(false)
    }
  }

  const renderField = (name, label, icon, onChange) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('(Không có dữ liệu)')}
          variant="filled"
          className=" font-medium"
          onChange={onChange}
        />
      </Form.Item>
    </Col>
  )

  const renderDropdownFieldPUCustName = (name, label, icon, CustName) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('')}
          variant="filled"
          className="font-medium"
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
  )

  const renderDropdownFieldNationName = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          placeholder={t('')}
          variant="filled"
          className=" font-medium"
          style={{ backgroundColor: '#e8f0ff' }}
          onFocus={() => setDropdownVisibleNationName(true)}
        />
        {dropdownVisibleNationName && (
          <DropdownFactData
            helpData={FactData}
            setHelpData05={setFactData}
            NationName={NationName}
            setNationName={setNationName}
            setNation={setNationSeq}
            setDropdownVisible={setDropdownVisibleNationName}
            dropdownVisible={dropdownVisibleNationName}
          />
        )}
      </Form.Item>
    </Col>
  )
  const renderFieldReadOnly = (name, label, value, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Input
          value={value || ''}
          placeholder={t('(Không có dữ liệu)')}
          readOnly
          className=" font-medium"
          variant="underlined"
        />
        <LockKeyhole
          size={13}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </Form.Item>
    </Col>
  )

  const renderFieldCheckbox = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        valuePropName="checked"
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Checkbox />
      </Form.Item>
    </Col>
  )

  const renderFieldDateTime = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <DatePicker
          format="YYYY-MM-DD"
          placeholder={t('(Không có dữ liệu)')}
          className=" font-medium"
          style={{ width: '100%' }}
          variant="filled"
        />
      </Form.Item>
    </Col>
  )
  const renderFieldNumber = (name, label, icon) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {icon}
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <InputNumber
          variant="filled"
          style={{ width: '100%' }}
          className="font-medium"
          placeholder={t('(Không có dữ liệu)')}
          controls={false}
          formatter={(value) =>
            value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value?.replace(/,/g, '')}
          step={0.01}
        />
      </Form.Item>
    </Col>
  )

  const handleChangeType = (setter) => (value) => {
    setter(value)
  }

  const renderFieldSelect = (name, label, helpData, handleChangeType) => (
    <Col span={8} key={name}>
      <Form.Item
        name={name}
        label={
          <span className="uppercase text-[11px] flex items-center gap-1">
            {t(label)}
          </span>
        }
        style={{ marginBottom: 8 }}
      >
        <Select
          showSearch
          defaultValue=""
          size="middle"
          style={{
            width: 250,
          }}
          variant="underlined"
          onChange={handleChangeType}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { label: '', value: '' },
            ...(helpData?.map((item) => ({
              label: item?.MinorName,
              value: item?.Value,
            })) || []),
          ]}
        />
      </Form.Item>
    </Col>
  )
  const handleImageChange = (file) => {
    setFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target.result)
    }
    reader.readAsDataURL(file)

    return false
  }

  const handleImageChange2 = (file) => {
    setImg2(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage2(e.target.result)
    }
    reader.readAsDataURL(file)

    return false
  }

  const onChangeSerialNo = (e) => {
    form.setFieldsValue({ SerialNo: e.target.value })
  }

  const onChangeBuyDate = (e) => {
    form.setFieldsValue({ BuyDate: e.target.value })
  }

  const onChangeBuyCost = (e) => {
    form.setFieldsValue({ BuyCost: e.target.value })
  }

  const onChangeCapacity = useCallback(
    (e) => {
      form.setFieldsValue({ Capacity: e.target.value })
    },
    [form],
  )

  const onChangeBuyCustTel = (e) => {
    form.setFieldsValue({ BuyCustTel: e.target.value })
  }

  const onChangeForms = (e) => {
    form.setFieldsValue({ Forms: e.target.value })
  }

  const onChangeUses = (e) => {
    form.setFieldsValue({ Uses: e.target.value })
  }

  const onChangeASTelNo = (e) => {
    form.setFieldsValue({ ASTelNo: e.target.value })
  }

  const onChangeManuCompnay = (e) => {
    form.setFieldsValue({ ManuCompnay: e.target.value })
  }

  return (
    <div className=" p-2 mb-72 ">
      <Form form={form}>
        <Row gutter={[16, 8]} justify="space-around" align="middle">
          <Col span={36}>
            <Row gutter={[16, 8]}>
              {renderDropdownFieldPUCustName(
                'PUCustName',
                '534',
                dataRootInfo?.PUCustName || '',
                CustName,
              )}
              {renderField(
                'SerialNo',
                '426',
                dataRootInfo?.SerialNo || '',
                onChangeSerialNo,
              )}
              {renderFieldDateTime(
                'BuyDate',
                '132',
                dataRootInfo?.BuyDate || '',
              )}
              {renderField(
                'Uses',
                '7715',
                dataRootInfo?.Uses || '',
                onChangeUses,
              )}
              {renderFieldNumber(
                'BuyCost',
                '669',
                dataRootInfo?.BuyCost || '',
                onChangeBuyCost,
              )}
              {renderField(
                'Forms',
                '800000207',
                dataRootInfo?.Forms || '',
                onChangeForms,
              )}
              {renderField(
                'BuyCustTel',
                '12255',
                dataRootInfo?.BuyCustTel || '',
                onChangeBuyCustTel,
              )}
              {renderField(
                'Capacity',
                '800000208',
                dataRootInfo?.Capacity || '',
                onChangeCapacity,
              )}
              {renderField(
                'ASTelNo',
                '13938',
                dataRootInfo?.ASTelNo || '',
                onChangeASTelNo,
              )}
              {renderDropdownFieldNationName(
                'NationName',
                '800000209',
                dataRootInfo?.NationName || '',
                NationName,
              )}
              {renderField(
                'ManuCompnay',
                '17384',
                dataRootInfo?.ManuCompnay || '',
                onChangeManuCompnay,
              )}
            </Row>
          </Col>
          <Col style={{ marginBottom: 8 }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('50324')}</span>}
            >
              <div
                style={{
                  width: 300,
                  height: 300,
                  border: '1px solid #d9d9d9',
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Avatar1"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    preview={true}
                  />
                ) : (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleImageChange}
                  >
                    <Button
                      disabled={dataSheetSearch.length === 0}
                      type="text"
                      icon={<PlusOutlined />}
                    >
                      {t('Chọn ảnh')}
                    </Button>
                  </Upload>
                )}
              </div>
              <div className="mt-2 gap-2 flex items-center">
                <Tooltip title="Cập nhật">
                  <Button
                    shape="circle"
                    loading={loading}
                    onClick={handleUploadImage}
                    disabled={!file}
                    icon={<UploadOutlined />}
                  />
                </Tooltip>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleImageChange}
                >
                  <Tooltip title="Thêm ảnh">
                    <Button
                      // disabled={dataSheetSearch.length === 0}
                      shape="circle"
                      icon={<PlusOutlined />}
                    />
                  </Tooltip>
                </Upload>
                <Tooltip title="Xóa ảnh">
                  <Button
                    shape="circle"
                    loading={loading2}
                    onClick={handleDeleteImage}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              </div>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('50325')}</span>}
            >
              <div
                style={{
                  width: 300,
                  height: 300,
                  border: '1px solid #d9d9d9',
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {previewImage2 ? (
                  <Image
                    src={previewImage2}
                    alt="Avatar2"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    preview={true}
                  />
                ) : (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleImageChange}
                  >
                    <Button
                      disabled={dataSheetSearch.length === 0}
                      type="text"
                      block
                      icon={<PlusOutlined />}
                    >
                      {t('Chọn ảnh')}
                    </Button>
                  </Upload>
                )}
              </div>
              <div className="mt-2 gap-2 flex items-center">
                <Tooltip title="Cập nhật">
                  <Button
                    shape="circle"
                    loading={loading}
                    onClick={handleUploadImage2}
                    disabled={!img2}
                    icon={<UploadOutlined />}
                  />
                </Tooltip>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleImageChange2}
                >
                  <Tooltip title="Thêm ảnh">
                    <Button
                      // disabled={dataSheetSearch.length === 0}
                      shape="circle"
                      icon={<PlusOutlined />}
                    />
                  </Tooltip>
                </Upload>
                <Tooltip title="Xóa ảnh">
                  <Button
                    shape="circle"
                    loading={loading2}
                    onClick={handleDeleteImage2}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Equip0Table
