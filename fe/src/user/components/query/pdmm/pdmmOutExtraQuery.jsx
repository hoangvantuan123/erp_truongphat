import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker } from 'antd'
import DropdownDept from '../../sheet/query/dropdownDept'
import DropdownUser from '../../sheet/query/dropdownUsers'
import DropdownWC from '../../sheet/query/dropdownWC'
const { TextArea } = Input;
import { useTranslation } from 'react-i18next'
export default function PdmmOutExtraQuery({

  setDataSearch, setDataSearch2, helpData03,

  setDataSheetSearch,
  setDataSheetSearch2,
  setItemText, setItemText2,

  searchText, searchText2,
  setSearchText, setSearchText2,
  controllers,

  helpData05,
  helpData06,
  setFormData,
  setToDate,
  toDate,
  formData,

  setFactUnit,
  setProdReqNo,

  setReqType,

  setProdType,

  setSubRemark,
  subRemark,
  helpData07, helpData08,
  FactUnit,
  setHelpData05,
  OutReqSeq,
  setOutReqSeq,
  setHelpData07,
  setSearchText3,
  searchText3,
  itemText3,
  setItemText3,
  dataSearch3,
  setDataSearch3,
  setDataSheetSearch3, gridData
}) {
  const { t } = useTranslation()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)
  const [dropdownVisible3, setDropdownVisible3] = useState(false)

  const handleFormDate = (date) => {
    setToDate(date)
  }
  const handleSubRemark = (e) => {
    setSubRemark(e.target.value)
  }
  useEffect(() => {
    if (helpData06?.length > 0) {
      setFactUnit(helpData06[0]?.FactUnit);
    }
    if (helpData07?.length > 0) {
      setProdType(helpData07[0]?.Value);
    }
    if (helpData08?.length > 0) {
      setReqType(helpData08[0]?.Value);
    }
  }, [helpData06]);
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-2 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >

              <Select
                id="typeSelect"
                value={FactUnit}
                size="middle"
                style={{ width: 150 }}
                onChange={setFactUnit}
                options={helpData06?.map(item => ({
                  label: item?.FactUnitName,
                  value: item?.FactUnit,
                })) || []}
                placeholder={t('850000151')}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('200')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >

              <Input
                value={toDate ? toDate.format('DD/MM/YYYY') : ''}
                readOnly

              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item

              label={
                <span className="uppercase text-[10px]">
                  {t('647')}
                </span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px] bg-slate-50"
                readOnly
                size="middle"
                value={OutReqSeq}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item

              label={<span className="uppercase text-[9px]">{t('1794')}  <span className="text-red-500 ml-1">*</span></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText2}
                onFocus={() => setDropdownVisible2(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              <DropdownUser
                helpData={helpData05}
                setHelpData05={setHelpData05}
                setSearchText={setSearchText2}
                setSearchText1={setSearchText}
                setItemText={setItemText2}
                setItemText1={setItemText}
                setDataSearch={setDataSearch2}
                setDataSearchDept={setDataSearch}
                setDataSheetSearch={setDataSheetSearch2}
                setDropdownVisible={setDropdownVisible2}
                dropdownVisible={dropdownVisible2}
                searchText={searchText2}
                controllers={controllers}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              rules={[{ required: true, message: '' }]}
              label={<span className="uppercase text-[9px]">{t('748')}   <span className="text-red-500 ml-1">*</span></span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText}
                onFocus={() => setDropdownVisible(true)}
                style={{ backgroundColor: '#e8f0ff' }}
                required
                readOnly
              />
              {/*  {dropdownVisible && (
                <DropdownDept
                  helpData={helpData03}
                  setSearchText={setSearchText}
                  setItemText={setItemText}
                  setDataSearch={setDataSearch}
                  setDataSheetSearch={setDataSheetSearch}
                  setDropdownVisible={setDropdownVisible}
                  dropdownVisible={dropdownVisible}
                  searchText={searchText}
                />
              )} */}
            </Form.Item>
          </Col>

        </Row>
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item

              label={<span className="uppercase text-[9px]">{t('Work Center')}  <span className="text-red-500 ml-1">*</span> </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText3}
                onFocus={() => setDropdownVisible3(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible3 && (
                <DropdownWC
                  helpData={helpData07}
                  setHelpData05={setHelpData07}
                  setSearchText={setSearchText3}
                  setItemText={setItemText3}
                  setDataSearch={setDataSearch3}
                  setDataSheetSearch={setDataSheetSearch3}
                  setDropdownVisible={setDropdownVisible3}
                  dropdownVisible={dropdownVisible3}
                  searchText={searchText3}
                  controllers={controllers}
                />
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('584')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px] bg-slate-50"
                readOnly
                size="middle"
                value={dataSearch3?.ProdInWhName}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('626')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px] bg-slate-50"
                readOnly
                size="middle"
                value={dataSearch3?.MatOutWhName}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('362')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}

            >
              <div
                style={{
                  width: 350,
                }}
              />
              <TextArea
                placeholder={t('362')}
                autoSize={{
                  minRows: 1,
                  maxRows: 1
                }}
                value={subRemark}
                onChange={(e) => handleSubRemark(e)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div >
  )
}
