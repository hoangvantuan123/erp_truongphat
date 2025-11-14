import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker, Space } from 'antd'
import DropdownDept from '../../sheet/query/dropdownDept'
import DropdownUser from '../../sheet/query/dropdownUsers'
import DropdownProcessType from '../../sheet/query/dropdownProcessType'
import DropdownCust from '../../sheet/query/dropdownCust'
const { TextArea } = Input;
import { useTranslation } from 'react-i18next'
export default function QueryPdmpsProdPlan({
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
  helpData07, helpData08,
  FactUnit,
  setHelpData05,
  setPrType,
  prType,
  categoryType,
  setCategoryType,
  setSearchText3,
  searchText3,
  setItemText3,
  setDataSheetSearch3,
  dataSheetSearch3,
  setDataSearch3,
  dataSearch3,
  ItemName,
  setItemName,
  ItemNo, 
  setItemNo,
  setSearchText4,
  searchText4,
  setItemText4,
  itemText4,
  setDataSheetSearch4,
  dataSheetSearch4,
  setDataSearch4,
  dataSearch4,

  setSearchText5,
  searchText5,
  setItemText5,
  itemText5,
  setDataSheetSearch5,
  dataSheetSearch5,
  setDataSearch5,
  dataSearch5,
  helpData09,
  setProdPlanNoQry,
  ProdPlanNoQry, 
  setSoNo, 
  SoNo
}) {


  const { t } = useTranslation()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)
  const [dropdownVisible3, setDropdownVisible3] = useState(false)
  const [dropdownVisible4, setDropdownVisible4] = useState(false)
  const [dropdownVisible5, setDropdownVisible5] = useState(false)
  /*   useEffect(() => {
      if (helpData06?.length > 0) {
        setFactUnit(helpData06[0]?.FactUnit);
      }
      if (helpData07?.length > 0) {
        setPrType(helpData07[0]?.Value);
      }
  
  
    }, [helpData06, helpData07]); */

  const handleFormDate = (date) => {
    setFormData(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
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
                /*  options={helpData06?.map(item => ({
                   label: item?.FactUnitName,
                   value: item?.FactUnit,
                 })) || []}
  */
                options={[
                  { label: 'All', value: '' },
                  ...(helpData06?.map((item) => ({
                    label: item?.FactUnitName,
                    value: item?.FactUnit,
                  })) || []),
                ]}
                placeholder={t('850000151')}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('26223')} </span>}
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
                <DropdownDept
                  helpData={helpData03}
                  setSearchText={setSearchText3}
                  setItemText={setItemText3}
                  setDataSearch={setDataSearch3}
                  setDataSheetSearch={setDataSheetSearch3}
                  setDropdownVisible={setDropdownVisible3}
                  dropdownVisible={dropdownVisible3}
                  searchText={searchText3}
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
                value={prType}
                size="middle"
                style={{ width: 250 }}
                onChange={setPrType}
                /*   options={helpData07?.map(item => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []}
   */

                options={[
                  { label: 'All', value: '' },
                  ...(helpData07?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                placeholder={t('850000151')}
              />
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3884')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker
                  size="middle"
                  value={formData}
                  onChange={handleFormDate}
                />
                <DatePicker
                  size="middle"
                  value={toDate}
                  onChange={handletoDate}
                  format="YYYY-MM-DD"
                />
              </Space>
            </Form.Item>
          </Col>









        </Row>
        <Row className="gap-4 flex items-center ">

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
              label={<span className="uppercase text-[10px]">{t('1524')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0, width: 282 } }}
            >
              <Input placeholder="" size="middle" onChange={(e) => setProdPlanNoQry(e.target.value)} value={ProdPlanNoQry} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2119')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >

              <Select
                id="typeSelect"
                value={categoryType}
                size="middle"
                style={{ width: 282 }}
                onChange={setCategoryType}
                /*   options={helpData04?.map(item => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []} */

                options={[
                  { label: 'All', value: '' },
                  ...(helpData04?.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
                placeholder={t('850000151')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('515')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText4}
                onFocus={() => setDropdownVisible4(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible4 && (
                <DropdownProcessType
                  helpData={helpData09}
                  setSearchText={setSearchText4}
                  setItemText={setItemText4}
                  setDataSearch={setDataSearch4}
                  setDataSheetSearch={setDataSheetSearch4}
                  setDropdownVisible={setDropdownVisible4}
                  dropdownVisible={dropdownVisible4}
                  searchText={searchText4}
                />
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('6')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText5}
                onFocus={() => setDropdownVisible5(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible5 && (
                <DropdownCust
                  helpData={helpData02}
                  setSearchText={setSearchText5}
                  setItemText={setItemText5}
                  setDataSearch={setDataSearch5}
                  setDataSheetSearch={setDataSheetSearch5}
                  setDropdownVisible={setDropdownVisible5}
                  dropdownVisible={dropdownVisible5}
                  searchText={searchText5}
                />
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1786')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0, width: 250 } }}
            >
              <Input placeholder="" size="middle" value={ItemName} onChange={(e) => setItemName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2091')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0, width: 250 } }}
            >
              <Input placeholder="" size="middle" value={ItemNo} onChange={(e) => setItemNo(e.target.value)} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('588')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0, width: 250 } }}
            >
              <Input placeholder="" size="middle"   value={SoNo} onChange={(e) => setSoNo(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div >
  )
}
