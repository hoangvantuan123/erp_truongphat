import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select, DatePicker, Space } from 'antd'
import DropdownDept from '../../sheet/query/dropdownDept'
import { useTranslation } from 'react-i18next'
import DropdownWC from '../../sheet/query/dropdownWC'
import dayjs from 'dayjs';
export default function PdsfcWorkReportQuery({
  helpData01,
  setDataSearch,
  setDataSheetSearch,
  setItemText,
  searchText,
  setSearchText,
  helpData04,
  setFormData,
  formData,
  setFactUnit,
  setSearchText2,
  searchText2,
  setItemText2,
  setDataSearch2,
  setDataSheetSearch2,
  helpData07,
  dataSeq,
  FactUnit,
  setGridData

}) {

  const { t } = useTranslation()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)

  const handleChangeFactUnit = (value) => {
    setFactUnit(value)
  }

  const handleFormDate = (date) => {
    setFormData(date);

    if (dataSeq) {
      const selectedDateStr = date?.format('YYYYMMDD');
      const originalDateStr = dataSeq?.WorkDate;

      if (selectedDateStr !== originalDateStr) {
        setGridData((prev) =>
          prev.map((item) => {
            if (item.Status === null || item.Status === '') {
              return { ...item, Status: 'U' };
            }
            return item;
          })
        );
      }
    }
  };



  useEffect(() => {
    if (dataSeq?.FactUnit && helpData04?.length > 0) {
      setFactUnit(dataSeq.FactUnit);
    }
    if (dataSeq?.WorkDate) {
      const parsed = dayjs(dataSeq?.WorkDate, 'YYYYMMDD');
      setFormData(parsed);
    }
    if (dataSeq?.DeptName) {
      setSearchText(dataSeq?.DeptName);
      setDataSheetSearch([dataSeq])
    }
    if (dataSeq?.WorkCenterName) {
      setSearchText2(dataSeq?.WorkCenterName);
      setDataSheetSearch2([dataSeq])
    }
  }, [dataSeq, helpData04]);
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
                disabled={Object.keys(dataSeq || {}).length > 0}

                onChange={setFactUnit}
                options={[
                  { label: 'All', value: '0' },
                  ...(helpData04?.map((item) => ({
                    label: item?.FactUnitName,
                    value: item?.FactUnit,
                  })) || []),
                ]}
              />

            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[10px]">{t('218')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Space>
                <DatePicker


                  size="middle"
                  value={formData}
                  onChange={handleFormDate}
                  format="YYYY-MM-DD"
                />

              </Space>
            </Form.Item>
          </Col>


          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('744')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                value={searchText}
                disabled={Object.keys(dataSeq || {}).length > 0}
                onFocus={() => setDropdownVisible(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible && (
                <DropdownDept
                  helpData={helpData01}
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
              label={<span className="uppercase text-[9px]">{t('Work Center')} </span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[250px]"
                size="middle"
                disabled={Object.keys(dataSeq || {}).length > 0}
                value={searchText2}
                onFocus={() => setDropdownVisible2(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {dropdownVisible2 && (
                <DropdownWC
                  helpData={helpData07}
                  setSearchText={setSearchText2}
                  setItemText={setItemText2}
                  setDataSearch={setDataSearch2}
                  setDataSheetSearch={setDataSheetSearch2}
                  setDropdownVisible={setDropdownVisible2}
                  dropdownVisible={dropdownVisible2}
                  searchText={searchText2}
                />
              )}
            </Form.Item>
          </Col>




        </Row>

      </Form>
    </div >
  )
}
