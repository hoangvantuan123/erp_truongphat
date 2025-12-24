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

function Equip1Table({
  dataRootInfo,
  form,
}) {

  const { t } = useTranslation()

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
          variant="underlined"
          style={{ width: '100%' }}
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


  const onChangeCavity = (e) => {
    form.setFieldsValue({ Cavity: e.target.value })
  }

  const onChangeMoldCount = (e) => {
    form.setFieldsValue({ MoldCount: e.target.value  })
  }

  const onChangeDesignShot = (e) => {
    form.setFieldsValue({ DesignShot: e.target.value  })
  }

  const onChangeInitialShot = (e) => {
    form.setFieldsValue({ InitialShot: e.target.value  })
  }

  const onChangeOrderCustName = (e) => {
    form.setFieldsValue({ OrderCustName: e.target.value  })
  }

  const onChangeCustShareRate = (e) => {
    form.setFieldsValue({ CustShareRate: e.target.value  })
  }

  const onChangeWorkShot = (e) => {
    form.setFieldsValue({ WorkShot: e.target.value  })
  }

  const onChangeProdSrtDate = (e) => {
    form.setFieldsValue({ ProdSrtDate: e.target.value  })
  }

  const onChangeTotalShot = (e) => {
    form.setFieldsValue({ TotalShot: e.target.value  })
  }

  const onChangeDisuseDate = (e) => {
    form.setFieldsValue({ DisuseDate: e.target.value  })
  }

  const onChangeModifyShot = (e) => {
    form.setFieldsValue({ ModifyShot: e.target.value  })
  }

  const onChangeDisuseCustName = (e) => {
    form.setFieldsValue({ DisuseCustName: e.target.value  })
  }

  const onChangeDisuseModifyDate = (e) => {
    form.setFieldsValue({ ModifyDate: e.target.value  })
  }

  return (
    <div className="p-2 mb-72">
      <Form form={form}  layout="vertical">
        <Row gutter={[8, 4]} justify="space-around" align="middle">
          <Col span={36}>
            <Row gutter={[8, 4]}>
              {renderField(
                'Cavity',
                '29873',
                dataRootInfo?.Cavity || '',
                onChangeCavity,
              )}
              {renderField(
                'MoldCount',
                '12391',
                dataRootInfo?.MoldCount || '',
                onChangeMoldCount,
              )}
              {renderField(
                'DesignShot',
                '6555',
                dataRootInfo?.DesignShot || '',
                onChangeDesignShot,
              )}
              {renderField(
                'OrderCustName',
                '15966',
                dataRootInfo?.OrderCustName || '',
                onChangeOrderCustName,
              )}
              {renderField(
                'InitialShot',
                '9360',
                dataRootInfo?.InitialShot || '',
                onChangeInitialShot,
              )}
              {renderField(
                'CustShareRate',
                '11701',
                dataRootInfo?.PosName || '',
                onChangeCustShareRate,
              )}
              {renderField(
                'WorkShot',
                '8289',
                dataRootInfo?.WorkShot || '',
                onChangeWorkShot,
              )}
              {renderFieldDateTime(
                'ProdSrtDate',
                '15663',
                dataRootInfo?.ProdSrtDate || '',
                onChangeProdSrtDate,
              )}
              {renderField(
                'TotalShot',
                '4737',
                dataRootInfo?.TotalShot || '',
                onChangeTotalShot,
              )}
              {renderFieldDateTime(
                'DisuseDate',
                '18748',
                dataRootInfo?.DisuseDate || '',
                onChangeDisuseDate,
              )}

              {renderField(
                'ModifyShot',
                '15348',
                dataRootInfo?.ModifyShot || '',
                onChangeModifyShot,
              )}
              {renderField(
                'DisuseCustName',
                '16546',
                dataRootInfo?.DisuseCustName || '',
                onChangeDisuseCustName,
              )}
              {renderFieldDateTime(
                'ModifyDate',
                '15349',
                dataRootInfo?.ModifyDate || '',
                onChangeDisuseModifyDate,
              )}
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Equip1Table
