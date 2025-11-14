import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker } from 'antd'
import DropdownDept from '../../sheet/query/dropdownDept'
import DropdownUser from '../../sheet/query/dropdownUsers'
const { TextArea } = Input;
import { useTranslation } from 'react-i18next'
export default function QueryPdmpsProdReq({
  helpData01, setDataSearch, setDataSearch2, helpData03, dataSearch, helpData02, setDataSheetSearch, setDataSheetSearch2, setItemText, setItemText2, itemText, itemText2, searchText, searchText2, setSearchText, setSearchText2,
  setMinorValue,
  controllers,
  helpData04,
  helpData05,
  helpData06,
  setFormData,
  setToDate,
  formData,
  toDate,
  setFactUnit,
  setProdReqNo,
  ProdReqNo,
  setReqType,
  ReqType,
  setProdType,
  ProdType,
  setSubRemark,
  subRemark,
  helpData07, helpData08,
  FactUnit,
  setHelpData05
}) {
  const { t } = useTranslation()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)

  const handleChangeFactUnit = (value) => {
    setFactUnit(value)
  }

  const handleChangeProdReqNo = (value) => {
    setProdReqNo(value)
  }
  const handleChangeProdType = (value) => {
    setProdType(value)
  }
  const handleChangeReqType = (value) => {
    setReqType(value)
  }
  const handleFormDate = (date) => {
    setFormData(date)
  }
  const handletoDate = (date) => {
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
        <Row className="gap-4 flex items-center ">
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
                style={{ width: 250 }}
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
              label={<span className="uppercase text-[10px]">{t('850000152')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={formData}
                onChange={handleFormDate}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1547')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input placeholder="" size="middle" readOnly value={ProdReqNo} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('748')} </span>}
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
              />
              {dropdownVisible && (
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
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1794')} </span>}
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
              {dropdownVisible2 && (
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
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1544')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >


              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 250,
                }}
                value={ProdType}
                onChange={setProdType}
                options={[
                  { label: 'All', value: '' },
                  ...(helpData07?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('14882')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                id="typeSelect"
                defaultValue="All"
                size="middle"
                style={{
                  width: 250,
                }}
                value={ReqType}
                onChange={setReqType}
                options={[
                  { label: 'All', value: '' },
                  ...(helpData08?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('850000153')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}

            >
              <div
                style={{
                  width: 450,
                }}
              />
              <TextArea
                placeholder={t('850000153')}
                autoSize={{
                  minRows: 3,
                  maxRows: 3
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
