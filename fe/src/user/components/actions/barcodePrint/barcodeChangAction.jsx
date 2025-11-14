import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Card,
  Button,
  Modal,
  Input,
  DatePicker,
  Select,
  message,
  Form,
  Row,
} from 'antd'

import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import {
  checkConfirmBarcode,
  checkConfirmNewBarcode,
  confirmBarcode,
} from '../../../../features/barcode/barcodeChangeService'
import {
  BARCODE_ERR_MESSAGE,
  BARCODE_SUCCESS_MESSAGE,
} from '../../../../utils/constants'
import ModalWaiting from '../../modal/material/modalWaiting'
import { ArrowIcon } from '../../icons'
import {
  FilterOutlined,
  PrinterFilled,
  SearchOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function BarcodeChangeAction({
  fromDate,
  toDate,
  onFinish,
  handleEnter,
  btnOpenModal,
  isModalVisible,
  setIsModalVisible,
  setReload,

  modal2Open,
  setModal2Open,
  error,
  setError,

  formChange,
  onKeyDownChangeQty,
  barcodeRef,
  changeQtyRef,
  remarkRef,
  onChangeNewQty,
  oldQty,
  newQty,
  setRemark,
  setUserId,
  onDropDownChange,
  optionDevices,
  clickedRowData,
  handleOnchangeDevice,
}) {
  const [form] = Form.useForm()
  const [formPopup] = Form.useForm()
  const [data, setData] = useState([])
  const { t } = useTranslation()

  const [oldBarcode, setOldBarcode] = useState('')
  const [newBarcode, setNewBarcode] = useState('')
  const [cfBarcode, setCfBarcode] = useState('')
  const [dataConfirm, setDataConfirm] = useState({})
  const formatDate = useCallback((date) => date.format('YYYYMMDDHHmmss'), [])
  form.setFieldsValue({ toDate: toDate })
  form.setFieldsValue({ fromDate: fromDate })
  const oldBarcodeRef = useRef(null)
  const newBarcodeRef = useRef(null)
  const userIdModalRef = useRef(null)
  const userIDRef = useRef(null)

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const columns = useMemo(
    () => [
      { title: 'OLD BARCODE' },
      { title: 'NEW BARCODE' },
      { title: 'STATUS' },
    ],
    [],
  )
  const [cols, setCols] = useState(columns)
  const onColumnResize = useCallback(
    (column, newSize) => {
      const index = cols.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...cols]
        newCols.splice(index, 1, newCol)
        setCols(newCols)
      }
    },
    [cols],
  )

  const getData = useCallback(
    ([col, row]) => {
      const dataGrid = data[row] || {}
      const { oldBarcode = '', newBarcode = '', isconfirm = '' } = dataGrid

      const safeString = (value) => (value != null ? String(value) : '')

      const columnMap = {
        0: { kind: GridCellKind.Text, data: safeString(oldBarcode) },
        1: { kind: GridCellKind.Text, data: safeString(newBarcode) },
        2: { kind: GridCellKind.Text, data: safeString(isconfirm) },
      }

      if (columnMap.hasOwnProperty(col)) {
        const { kind, data } = columnMap[col]
        return { kind, data, displayData: data }
      }

      return { kind: GridCellKind.Text, data: '', displayData: '' }
    },
    [data],
  )

  const onKeyDownRemark = (e) => {
    if (e.key === 'Enter') {
      setRemark(e.target.value)
      userIDRef.current.focus()
    }
  }

  const onKeyDownUserId = (e) => {
    if (e.key === 'Enter') {
      setUserId(e.target.value)
    }
  }

  const onChangeUserId = (e) => {
    const userid = e.target.value
    setUserId(userid)
  }

  const onChangeRemark = (e) => {
    const remark = e.target.value
    setRemark(remark)
  }

  const handleKeyDownOldBarcode = async (e) => {
    if (e.key === 'Enter') {
      const oldBarcode = e.target.value

      if (!oldBarcode.includes('/')) {
        setModal2Open(true)
        setError(BARCODE_ERR_MESSAGE.INVALID_BARCODE_FORMAT)
        return
      }

      const parts = oldBarcode.split('/')
      if (parts.length != 5) {
        message.info(BARCODE_ERR_MESSAGE.INVALID_BARCODE_FORMAT)
        return
      }

      const dataConfirm = {
        oldBarcode,
        newBarcode,
        isconfirm: true,
      }

      try {
        setOldBarcode(oldBarcode)
        const result = await checkConfirmBarcode(dataConfirm)

        if (result.result[0] != null) {
          setNewBarcode(result.result[0].NewBarcodeID)
          message.info(BARCODE_SUCCESS_MESSAGE.CHECK_OLD_BARCODE_OK)
        } else {
          setError(BARCODE_ERR_MESSAGE.BARCODEID_NOT_EXISTS)
          setModal2Open(true)
          resetValueModal()
        }
      } catch (err) {
        console.log(err)
      }
      newBarcodeRef.current.focus()
    }
  }

  const onKeyDownNewBarcode = async (e) => {
    if (e.key === 'Enter') {
      const INewBarcode = e.target.value
      if (!INewBarcode.includes('/')) {
        message.warning(BARCODE_ERR_MESSAGE.INVALID_BARCODE_FORMAT)
        return
      }

      const parts = INewBarcode.split('/')
      if (parts.length != 5) {
        message.info(BARCODE_ERR_MESSAGE.INVALID_BARCODE_FORMAT)
        return
      }

      if (INewBarcode != newBarcode) {
        setError(BARCODE_ERR_MESSAGE.NEW_BARCODEID_NOT_EXISTS)
        formPopup.resetFields(['newBarcode'])
        setModal2Open(true)
        return
      }

      const dataConfirm = {
        oldBarcode,
        newBarcode,
        isconfirm: true,
      }

      try {
        const result = await checkConfirmNewBarcode(dataConfirm)

        if (result != null) {
          formPopup.setFieldsValue({ cfBarcode: result.data[0].NewBarcodeID })
          formPopup.setFieldsValue({ userid: result.data[0].UserID })
          formPopup.setFieldsValue({ status: 'OK' })
          // formPopup.setFieldsValue({ time: result.result[0].LastDateTime});

          const newRow = {
            oldBarcode: dataConfirm.oldBarcode,
            newBarcode: result.data[0].NewBarcodeID,
            isconfirm: 'OK',
          }

          const isDuplicate = data.some(
            (row) =>
              row.newBarcode === newRow.newBarcode &&
              row.oldBarcode === newRow.oldBarcode,
          )

          if (!isDuplicate) {
            setData([...data, newRow])
            userIdModalRef.current.focus()
          } else {
            message.info(BARCODE_ERR_MESSAGE.DUPLICATE_ROW)
          }
        } else {
          setError(BARCODE_ERR_MESSAGE.BARCODEID_NOT_EXISTS)
          setModal2Open(true)
          formPopup.resetFields(newBarcode)
          resetValueModal()
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleBtnConfirm = async () => {
    const body = data
    try {
      const result = await confirmBarcode(body)

      setIsModalVisible(false)

      if (result.status) {
        setModal2Open(true);
        setError(BARCODE_SUCCESS_MESSAGE.BARCODE_CONFIRM_SUCCESS);
        resetValueModal();
        setReload((pre) => pre + 1);
      } else {
        setError(BARCODE_ERR_MESSAGE.BARCODE_NOT_CONFIRM)
        setModal2Open(true)
        resetValueModal()
      }
    } catch (err) {
      message.error(err)
      resetValueModal()
      setError(err)
      setModal2Open(true)
      setIsModalVisible(false)
    }
  }

  const handleCancel = () => {
    resetValueModal()
    setIsModalVisible(false)
  }

  const resetValueModal = () => {
    setOldBarcode('')
    setNewBarcode('')
    setCfBarcode('')
    setUserId('')
    setData([])
    formPopup.resetFields()
  }

  useEffect(() => {
    formChange.resetFields()
  }, [formChange])

  return (
    <div className="mt-1">
      <Card className="mb-1 p-1 shadow-sm" size="small">
        <Card className="mb-1 p-1 shadow-sm" size="small">
          <Form
            layout={'inline'}
            form={form}
            initialValues={{
              layout: 'inline',
            }}
            style={{
              maxWidth: 'inline' ? 'none' : 600,
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="From Date" name="fromDate">
              <DatePicker size="small" />
            </Form.Item>

            <Form.Item label="To Date" name="toDate">
              <DatePicker size="small" />
            </Form.Item>

            <Form.Item label="Barcode" name="barcode">
              <Input placeholder="" size="small" className="w-96" />
            </Form.Item>
            <Form.Item label="Mat ID" name="matID">
              <Input placeholder="" size="small" className="w-28" />
            </Form.Item>
            <Form.Item label="Lot No" name="lotNo">
              <Input placeholder="" size="small" className="w-36" />
            </Form.Item>
            <Form.Item>
              <Button
                icon={<SearchOutlined />}
                type="primary"
                size="small"
                htmlType="submit"
              >
                SEARCH
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                icon={<PrinterFilled />}
                onClick={btnOpenModal}
                type="primary"
                size="small"
              >
                PRINT
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <details
          className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
          open
        >
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
            <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
              <FilterOutlined />
              {t('Thông tin chi tiết')}
            </h2>
            <span className="relative size-5 shrink-0">
              <ArrowIcon />
            </span>
          </summary>

          <Card className="mb-1 p-1 shadow-sm" size="small">
            <Form
              layout={'vertical'}
              form={formChange}
              style={{
                maxWidth: 'inline' ? 'none' : 600,
              }}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                {t('Thông tin thay đổi')}
              </h2>

              <Card className="m-0 p-0" bodyStyle={{ padding: 5 }}>
                <Row className="flex m-0 p-0 gap-3">
                  <Form.Item
                    label="Barcode"
                    name="oldBarcode"
                    rules={[
                      {
                        required: true,
                        message: BARCODE_ERR_MESSAGE.BARCODE_NOT_NULL,
                      },
                    ]}
                  >
                    <Input
                      placeholder=""
                      onKeyDown={handleEnter}
                      className="w-[300px]"
                      ref={barcodeRef}
                    />
                  </Form.Item>
                  <Form.Item label="Pre QTY" name="preQty">
                    <Input
                      placeholder=""
                      type="number"
                      min={0}
                      disabled={true}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Change QTY"
                    name="changeQty"
                    rules={[
                      {
                        required: true,
                        message: BARCODE_ERR_MESSAGE.QTY_NOT_NULL,
                      },
                    ]}
                  >
                    <Input
                      placeholder=""
                      type="number"
                      min={0}
                      onKeyDown={onKeyDownChangeQty}
                      ref={changeQtyRef}
                    />
                  </Form.Item>
                  <Form.Item label="QTY" name="qty">
                    <Input
                      placeholder=""
                      type="number"
                      min={0}
                      value={newQty}
                      disabled={true}
                      onChange={onChangeNewQty}
                    />
                  </Form.Item>

                  <Form.Item label="Remark" name="remark">
                    <Input
                      placeholder=""
                      onKeyDown={onKeyDownRemark}
                      onChange={onChangeRemark}
                      ref={remarkRef}
                    />
                  </Form.Item>
                  <Form.Item label=" User ID" name="userID">
                    <Input
                      placeholder=""
                      onKeyDown={onKeyDownUserId}
                      onChange={onChangeUserId}
                      ref={userIDRef}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Device Printer"
                    name="device"
                    className="w-52"
                  >
                    <Select
                      labelInValue
                      id="typeSelect"
                      defaultValue=""
                      allowClear
                      options={optionDevices}
                      onDropdownVisibleChange={onDropDownChange}
                      onChange={handleOnchangeDevice}
                    />
                  </Form.Item>
                </Row>
              </Card>

              <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase mt-3">
                {t('Cài đặt in tem')}
              </h2>
              <span className="relative size-5 shrink-0"></span>

              <Card className="m-0 p-0" bodyStyle={{ padding: 5 }}>
                <Row className="flex m-0 p-0 gap-3">
                  <Form.Item label="1D Position" layout={'inline'}>
                    <div className="flex gap-3">
                      <Form.Item name="barcodePosX" layout={'inline'}>
                        <Input placeholder="X" type="number" min={0} />
                      </Form.Item>
                      <Form.Item name="barcodePosY" layout={'inline'}>
                        <Input placeholder="Y" type="number" min={0} />
                      </Form.Item>
                    </div>
                  </Form.Item>

                  <Form.Item label="1D Size" layout={'inline'}>
                    <div className="flex gap-3">
                      <Form.Item name="barcodeSizeX" layout={'inline'}>
                        <Input placeholder="X" type="number" min={0} />
                      </Form.Item>

                      <Form.Item name="barcodeSizeY" layout={'inline'}>
                        <Input placeholder="Y" type="number" min={0} />
                      </Form.Item>
                    </div>
                  </Form.Item>

                  <Form.Item label="2D Position" layout={'inline'}>
                    <div className="flex gap-3">
                      <Form.Item name="qrcodePosX" layout={'inline'}>
                        <Input placeholder="X" type="number" min={0} />
                      </Form.Item>

                      <Form.Item name="qrcodePosY" layout={'inline'}>
                        <Input placeholder="Y" type="number" min={0} />
                      </Form.Item>
                    </div>
                  </Form.Item>

                  <Form.Item label="2D Size" layout={'inline'}>
                    <div className="flex gap-3">
                      <Form.Item name="qrcodeSizeX" layout={'inline'}>
                        <Input placeholder="X" type="number" min={0} />
                      </Form.Item>
                      <Form.Item name="qrcodeSizeY" layout={'inline'}>
                        <Input placeholder="Y" type="number" min={0} />
                      </Form.Item>
                    </div>
                  </Form.Item>
                </Row>
              </Card>
            </Form>
          </Card>
        </details>

        <Modal
          title="Print Label Confirmation"
          open={isModalVisible}
          onOk={handleBtnConfirm}
          maskClosable={false}
          closable={false}
          bodyStyle={{
            maxHeight: '500px',
            overflowY: 'auto',
          }}
          width={600}
        >
          <Form
            layout={'inline'}
            form={formPopup}
            initialValues={{
              layout: 'inline',
            }}
            style={{
              maxWidth: 'inline' ? 'none' : 600,
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="Barcode" name="oldBarcode" layout={'inline'}>
              <Input
                size="small"
                style={{ width: 350 }}
                onKeyDown={handleKeyDownOldBarcode}
              />
            </Form.Item>

            <Form.Item label="New Barcode" name="newBarcode" layout={'inline'}>
              <Input
                size="small"
                style={{ width: 320 }}
                ref={newBarcodeRef}
                onKeyDown={onKeyDownNewBarcode}
              />
            </Form.Item>

            <Form.Item
              label="Barcode Confirm"
              name="cfBarcode"
              layout={'inline'}
            >
              <Input size="small" style={{ width: 300 }} disabled={true} />
            </Form.Item>

            <Form.Item label="Time" name="time">
              <DatePicker size="small" />
            </Form.Item>

            <Form.Item label="User ID" name="userid">
              <Input size="small" style={{ width: 100 }} ref={userIdModalRef} />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Input size="small" style={{ width: 100 }} disabled={true} />
            </Form.Item>
          </Form>

          <div className="w-full gap-1  h-screen flex items-center justify-center pb-8">
            <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
              <DataEditor
                columns={cols}
                getCellContent={getData}
                rows={data.length}
                getCellsForSelection={true}
                width="100%"
                height="100%"
                rowMarkers={('checkbox-visible', 'both')}
                onColumnResize={onColumnResize}
                smoothScrollY={true}
                smoothScrollX={true}
                rowSelect="multi"
              />
            </div>
          </div>
        </Modal>
        <ModalWaiting
          modal2Open={modal2Open}
          setModal2Open={setModal2Open}
          error={error}
        />
      </Card>
    </div>
  )
}
