import { useEffect, useState } from 'react'
import {
  Card,
  Button,
  Modal,
  Space,
  Input,
  Typography,
  DatePicker,
  Select,
  Form,
  Row,
  Col,
} from 'antd'
import { FilterOutlined, RestFilled, SaveFilled } from '@ant-design/icons'

import LabelItem from './labeldesign'
import { VENDOR_LIST } from '../../../../utils/sysConstants'
import { useTranslation } from 'react-i18next'

export default function BarcodePrintQuery({
  formQuery,
  fromDate,
  toDate,

  onFinish,
  onClickPrint,
  isModalVisible,
  onClickCancel,

  optionDevices,
  onDropDownChange,
  handleOnchangeDevice,

  onChangeVendor,
  onClearVendorValue,
  onKeyDownPartNo,
  onKeyDownMatId,
  onKeyDownLotTotalCnt,
  onKeyDownLotNo,
  onKeyDownQty,
  onKeyDownDateCode,
  onKeyDownReelNo,
  onKeyDownUserId,
  onKeyDownRemark,
  onChangeRemark,
  onChangeUserId,
  onKeyDownBarcode,

  partNoRef,
  matIdRef,
  lotNoRef,
  qtyRef,
  dateCodeRef,
  reelNoRef,
  userIdRef,
  remarkRef,
  lotTotalCNTRef,
  barcodeRef,

  formPreview,
  onFinishPreview,
  sizeLabel,
  previewLabel,
  setPreviewLabel,
  label,
  onClickOk,
  onClickReset,
}) {
  const { t } = useTranslation()
  const [formSearch] = Form.useForm()

  const setFieldsQuery = () => {
    if (previewLabel) {
      formQuery.setFieldsValue({
        matID: previewLabel?.ITEMCD,
        lotNo: previewLabel?.LOTNO,
        qty: previewLabel?.QTY,
        dateCode: previewLabel?.DATECODE,
        userID: previewLabel?.USER_ID,
        reelNo: previewLabel?.REELNO,
      })

      formPreview.setFieldsValue({
        barcodePosX: sizeLabel.barCodePosX,
        barcodePosY: sizeLabel.barCodePosY,
        barcodeSizeX: sizeLabel.barCodeSizeX,
        barcodeSizeY: sizeLabel.barCodeSizeY,
        qrcodePosX: sizeLabel.QrPosX,
        qrcodePosY: sizeLabel.QrPosY,
        qrcodeSizeX: sizeLabel.QrSizeX,
        qrcodeSizeY: sizeLabel.QrSizeY,
      })
    }
    setPreviewLabel(null)
  }

  useEffect(() => {
    formSearch.setFieldsValue({ fromDate: fromDate })
    formSearch.setFieldsValue({ toDate: toDate })
    setFieldsQuery()
  }, [fromDate, toDate, setFieldsQuery])

  return (
    <div className="mt-1">
      <Card className="mb-1 p-1 shadow-sm" size="small">
        <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
          <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
            {t('Thông tin tem')}
          </h2>
        </summary>
        <Card>
          <Form
            layout="vertical"
            form={formQuery}
            style={{
              maxWidth: 'inline' ? 'none' : 600,
            }}
            autoComplete="off"
          >
            <Row className="flex m-0 p-0 gap-3">
              <Form.Item
                label="Vendor"
                name={'vendor'}
                size="small"
                className="w-36"
              >
                <Select
                  labelInValue
                  allowClear
                  id="vendorSelect"
                  initialValues="All"
                  onChange={onChangeVendor}
                  options={VENDOR_LIST?.map((item) => ({
                    label: item?.label,
                    value: item?.value,
                  }))}
                  onClear={onClearVendorValue}
                />
              </Form.Item>

              <Form.Item
                label={<span className="m-0 p-0 ">Barcode</span>}
                name={'barcode'}
                size="small"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownBarcode}
                  ref={barcodeRef}
                  className="w-[440px]"
                />
              </Form.Item>
            </Row>

            <Row className="gap-4 flex m-0 p-0 ">
              <Form.Item
                label={<span className="m-0 p-0 ">Part No</span>}
                name={'partNo'}
                size="small"
                className=" m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownPartNo}
                  ref={partNoRef}
                  className="w-36"
                />
              </Form.Item>

              <Form.Item
                label={<span className="m-0 p-0">Mat ID</span>}
                name={'matID'}
                size="small"
                className=" m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownMatId}
                  ref={matIdRef}
                  className="w-36"
                />
              </Form.Item>

              <Form.Item
                label="Lot Total CNT"
                name={'lotTotalCNT'}
                size="small"
                className="m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownLotTotalCnt}
                  ref={lotTotalCNTRef}
                  className="w-24"
                />
              </Form.Item>

              <Form.Item
                label="Lot No"
                name={'lotNo'}
                size="small"
                className=" m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownLotNo}
                  ref={lotNoRef}
                  className="w-40"
                />
              </Form.Item>

              <Form.Item
                label="Qty"
                name={'qty'}
                size="small"
                className=" m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownQty}
                  ref={qtyRef}
                  className="w-16"
                />
              </Form.Item>

              <Form.Item
                label="Date Code"
                name={'dateCode'}
                size="small"
                className=" m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownDateCode}
                  ref={dateCodeRef}
                  className="w-24"
                />
              </Form.Item>

              <Form.Item
                label="Reel NO"
                name={'reelNo'}
                size="small"
                className=" m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownReelNo}
                  ref={reelNoRef}
                  className="w-36"
                />
              </Form.Item>

              <Form.Item
                label="User ID"
                name={'userID'}
                size="small"
                className=" m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownUserId}
                  onChange={onChangeUserId}
                  ref={userIdRef}
                  className="w-28"
                />
              </Form.Item>

              <Form.Item
                label="Issue NO"
                name={'issueNo'}
                size="small"
                className=" m-0 p-0"
              >
                <Input placeholder="" className="w-20" />
              </Form.Item>

              <Form.Item
                label="Remark"
                name={'remark'}
                size="small"
                className=" m-0 p-0"
              >
                <Input
                  placeholder=""
                  onKeyDown={onKeyDownRemark}
                  onChange={onChangeRemark}
                  ref={remarkRef}
                  className="w-56"
                />
              </Form.Item>

              <Form.Item
                label="Device Printer"
                name="device"
                className=" m-0 p-0 w-32"
              >
                <Select
                  labelInValue
                  id="typeSelect"
                  initialValues=""
                  allowClear
                  options={optionDevices}
                  onDropdownVisibleChange={onDropDownChange}
                  onChange={handleOnchangeDevice}
                />
              </Form.Item>
            </Row>
          </Form>
        </Card>

        <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900 mt-3">
          <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
            {t('Cài đặt in tem')}
          </h2>
        </summary>
        <Card className="m-0 p-0 " bodyStyle={{ padding: 5 }}>
          <Form
            layout={'vertical'}
            form={formPreview}
            style={{
              maxWidth: 'inline' ? 'none' : 600,
            }}
            autoComplete="off"
            onFinish={onFinishPreview}
          >
            <Row className="flex m-0 p-0 gap-11 items-end">
              <Form.Item label="1D Position" layout={'inline'}>
                <div className="flex gap-3">
                  <Form.Item name="barcodePosX" className="w-36 m-0 p-0">
                    <Input placeholder="X" type="number" min={0} step={0.1} />
                  </Form.Item>
                  <Form.Item name="barcodePosY" className="w-36 m-0 p-0">
                    <Input placeholder="Y" type="number" min={0} step={0.1} />
                  </Form.Item>
                </div>
              </Form.Item>

              <Form.Item label="1D Size" layout={'inline'}>
                <div className="flex gap-3">
                  <Form.Item
                    name="barcodeSizeX"
                    className="w-36 m-0 p-0"
                    layout={'inline'}
                  >
                    <Input placeholder="X" type="number" min={0} step={0.1} />
                  </Form.Item>

                  <Form.Item
                    name="barcodeSizeY"
                    className="w-36 m-0 p-0"
                    layout={'inline'}
                  >
                    <Input placeholder="Y" type="number" min={0} step={0.1} />
                  </Form.Item>
                </div>
              </Form.Item>

              <Form.Item label="2D Position" layout={'inline'}>
                <div className="flex gap-3">
                  <Form.Item
                    name="qrcodePosX"
                    className="w-36 m-0 p-0"
                    layout={'inline'}
                  >
                    <Input placeholder="X" type="number" min={0} step={0.1} />
                  </Form.Item>

                  <Form.Item
                    name="qrcodePosY"
                    className="w-36 m-0 p-0"
                    layout={'inline'}
                  >
                    <Input placeholder="Y" type="number" min={0} step={0.1} />
                  </Form.Item>
                </div>
              </Form.Item>

              <Form.Item label="2D Size" layout={'inline'}>
                <div className="flex gap-3">
                  <Form.Item
                    name="qrcodeSizeX"
                    className="w-36 m-0 p-0"
                    layout={'inline'}
                  >
                    <Input placeholder="X" type="number" min={0} step={0.1} />
                  </Form.Item>
                  <Form.Item
                    name="qrcodeSizeY"
                    className="w-36 m-0 p-0"
                    layout={'inline'}
                  >
                    <Input placeholder="Y" type="number" min={0} step={0.1} />
                  </Form.Item>
                </div>
              </Form.Item>

              <Form.Item className="w-20">
                <Button
                  icon={<SaveFilled />}
                  className="uppercase"
                  htmlType="submit"
                >
                  Preview
                </Button>
              </Form.Item>
              <Form.Item className="w-20">
                <Button
                  icon={<RestFilled />}
                  className="uppercase"
                  onClick={onClickReset}
                >
                  Reset
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Card>
      </Card>

      <Modal
        title="Print Label Confirmation"
        open={isModalVisible}
        onOk={onClickOk}
        onCancel={onClickCancel}
        className="w-3"
      >
        <LabelItem label={label} dataSize={sizeLabel} />
      </Modal>
    </div>
  )
}
