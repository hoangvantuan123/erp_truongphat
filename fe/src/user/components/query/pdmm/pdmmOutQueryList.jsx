import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker } from 'antd'
import DropdownDept from '../../sheet/query/dropdownDept'
import DropdownUser from '../../sheet/query/dropdownUsers'
const { TextArea } = Input;
import { useTranslation } from 'react-i18next'
export default function PdmmOutQueryListQuery({

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
  formData,

  setFactUnit,
  setProdReqNo,

  setReqType,

  setProdType,
  toDate,
  setSubRemark,
  subRemark,
  helpData07, helpData08,
  FactUnit,
  setHelpData05,
  setOutReqNo,
  OutReqNo
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
    const allReady =
      helpData06?.length > 0 &&
      helpData07?.length > 0 &&
      helpData08?.length > 0;

    if (allReady) {
      setFactUnit(String(helpData06[0]?.FactUnit));
      setProdType(String(helpData07[0]?.Value));
      setReqType(String(helpData08[0]?.Value));
    }
  }, [helpData06, helpData07, helpData08]);

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
              label={<span className="uppercase text-[10px]">{t('232')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                size="middle"
                value={toDate}
                onChange={handletoDate}
                format="YYYY-MM-DD"
              />
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
          <Form.Item
            label={<span className="uppercase text-[10px]">{t('647')} </span>}
            style={{ marginBottom: 0 }}
            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
            wrapperCol={{ style: { padding: 0 } }}
          >
            <Input
              placeholder=""
              className="w-[250px] bg-slate-50"
              size="middle"
              value={OutReqNo}
              onChange={(e) => setOutReqNo(e.target.value)}
            />
          </Form.Item>


        </Row>
      </Form>
    </div >
  )
}
