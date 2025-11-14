import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Select } from 'antd'
import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import useOnFill from '../../hooks/sheet/onFillHook'
import moment from 'moment'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useTranslation } from 'react-i18next'
import DropdownUser from '../../sheet/query/dropdownUsers'
import DropdownDept from '../../sheet/query/dropdownDept'
import DropdownWC from '../../sheet/query/dropdownWC'
import DropdownWarehouse from '../../sheet/query/dropdownWarehouse'
const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'


export default function SpdmmOutProcItemListQuery({
  fromDate,
  setFromDate,
  setToDate,
  toDate,

  bizUnit,
  dataBizUnit,
  setBizUnit,
  dataUserName,
  dataDeptName,
  itemName,
  setItemName,
  itemNo,
  setItemNo,
  setDataSearch, setDataSearch2,
  setDataSheetSearch,
  setDataSheetSearch2,
  setItemText, setItemText2,

  searchText, searchText2,
  setSearchText, setSearchText2,
  setDataUserName,
  controllers,
  setMatOutNo,
  MatOutNo,
  setLotNo,
  LotNo,

  setSearchText3,
  searchText3,
  setItemText3,
  dataSearch3,
  setDataSearch3,
  setDataSheetSearch3,


  setSearchText4,
  searchText4,
  setItemText4,
  setDataSearch4,
  setDataSheetSearch4,


  setSearchText5,
  searchText5,
  setItemText5,
  setDataSearch5,
  setDataSheetSearch5,

  helpData07,
  setHelpData07,
  dataWarehouse,
  setDataWarehouse
}) {

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)
  const [dropdownVisible3, setDropdownVisible3] = useState(false)
  const [dropdownVisible4, setDropdownVisible4] = useState(false)
  const [dropdownVisible5, setDropdownVisible5] = useState(false)

  const { t } = useTranslation()




  const handleFromDate = (date) => {
    setFromDate(date)
  }
  const handletoDate = (date) => {
    setToDate(date)
  }
  const handleChangeBizUnit = (value) => {
    setBizUnit(value)
  }


  return (
    <div className="flex items-center gap-2">
      <Form
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
      >
        <Row className="gap-4 flex items-center mb-4 ">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('28782')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <DatePicker
                value={fromDate}
                onChange={handleFromDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('100001449')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              className="mb-2"
            >
              <DatePicker
                value={toDate}
                onChange={handletoDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('3')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Select
                size="middle"
                style={{
                  width: 190,
                }}
                allowClear
                showSearch
                placeholder="Chọn nơi sản xuất"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={bizUnit === '0' ? undefined : bizUnit}
                onChange={handleChangeBizUnit}
                options={dataBizUnit?.map((item) => ({
                  label: item?.BizUnitName,
                  value: item?.BizUnit,
                }))}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('1224')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={MatOutNo}
                onChange={(e) => setMatOutNo(e.target.value)}
                size="middle"
                style={{
                  width: 190,
                }}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2170')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                size="middle"
                style={{
                  width: 150,
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('2091')}</span>}
              className="mb-2"
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                value={itemNo}
                onChange={(e) => setItemNo(e.target.value)}
                size="middle"
                style={{
                  width: 150,
                }}
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
                  helpData={dataDeptName}
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
                  helpData={dataUserName}
                  setHelpData05={setDataUserName}
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
              label={<span className="uppercase text-[9px]">{t('Work Center')} </span>}
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
              label={<span className="uppercase text-[9px]">{t('626')} </span>}
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
                <DropdownWarehouse
                  helpData={dataWarehouse}
                  setHelpData05={setDataWarehouse}
                  setSearchText={setSearchText4}
                  setItemText={setItemText4}
                  setDataSearch={setDataSearch4}
                  setDataSheetSearch={setDataSheetSearch4}
                  setDropdownVisible={setDropdownVisible4}
                  dropdownVisible={dropdownVisible4}
                  searchText={searchText4}
                  controllers={controllers}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('584')} </span>}
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
                <DropdownWarehouse
                  helpData={dataWarehouse}
                  setHelpData05={setDataWarehouse}
                  setSearchText={setSearchText5}
                  setItemText={setItemText5}
                  setDataSearch={setDataSearch5}
                  setDataSheetSearch={setDataSheetSearch5}
                  setDropdownVisible={setDropdownVisible5}
                  dropdownVisible={dropdownVisible5}
                  searchText={searchText5}
                  controllers={controllers}
                />
              )}
            </Form.Item>
          </Col>

        </Row>

      </Form>
    </div>
  )
}
