import { useState } from 'react'
import { ConfigProvider, Form, Row, Col, Space, DatePicker, Select, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
import DropdownCustVer2 from '../../../sheet/query/dropDownCust2'
import DropdownProject from '../../../sheet/query/dropDownProject'
import DropdownDept from '../../../sheet/query/dropdownDept'
dayjs.locale('vi')

export default function MnfcostasQuery({
    formData,
    setFormData,
    toDate,
    setToDate,
    helpData02,
    helpData01,
    setAccUnit,
    helpData03,
    setSMQryUnitSeq,
    setUMCustClass,


    setDataSearch,
    setDataSheetSearch,
    setSearchText,
    searchText,
    setItemText,
    helpData04,

    setDataSearch1,
    setItemText1,
    setSearchText1,
    helpData05,
    setDataSheetSearch1,
    searchText1,
    helpData06,
    setDataSearch2,
    setItemText2,
    setSearchText2,
    setDataSheetSearch2,
    searchText2




}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [dropdownVisible3, setDropdownVisible3] = useState(false)

    const { t } = useTranslation()
    const langCode = localStorage.getItem('language')
    const getAntdLocale = () => {
        switch (langCode) {
            case '6':
                dayjs.locale('vi')
                return viVN
            case '1':
                dayjs.locale('ko')
                return koKR
            default:
                dayjs.locale('vi')
                return viVN
        }
    }


    return (
        <ConfigProvider locale={getAntdLocale()}>
            <div className="flex flex-col gap-2 p-2">
                <Form variant="filled">
                    {/* Dòng 1 */}
                    <Row gutter={[16, 8]}>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('1')}</span>}
                                name="unit"
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 180 }}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData01?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    onChange={(value) => setAccUnit(value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('63')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <DatePicker
                                        picker="month"
                                        format="YYYY-MM"
                                        defaultValue={formData}
                                        onChange={(value) => setFormData(value)}
                                    />
                                    <DatePicker
                                        picker="month"
                                        format="YYYY-MM"
                                        value={toDate}
                                        onChange={(value) => setToDate(value)}
                                    />
                                </Space>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('353')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder=""
                                    className="w-[250px]"
                                    size="middle"
                                    value={searchText1}
                                    onFocus={() => setDropdownVisible2(true)}
                                    style={{ backgroundColor: '#e8f0ff' }}
                                />
                                {dropdownVisible2 && (
                                    <DropdownProject
                                        helpData={helpData05}
                                        setSearchText={setSearchText1}
                                        setItemText={setItemText1}
                                        setDataSearch={setDataSearch1}
                                        setDataSheetSearch={setDataSheetSearch1}
                                        setDropdownVisible={setDropdownVisible2}
                                        dropdownVisible={dropdownVisible2}
                                        searchText={searchText1}
                                    />
                                )}
                            </Form.Item>
                        </Col>


                    </Row>

                    {/* Dòng 2 */}
                    <Row gutter={[16, 8]} className="mt-2">

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('645')}</span>}
                                name="UMCustClass"
                                initialValue={helpData02?.[0]?.Value}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData02?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    onChange={(value) => setUMCustClass(value)}

                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('565')}</span>}
                                name="SMQryUnitSeq"
                                initialValue={helpData03?.[0]?.FormatSeq}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData03?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    onChange={(value) => setSMQryUnitSeq(value)}

                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('6')}</span>}
                                style={{ marginBottom: 0 }}
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
                                    <DropdownCustVer2
                                        helpData={helpData04}
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
                                label={<span className="uppercase text-[10px]">{t('5')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder=""
                                    className="w-[250px]"
                                    size="middle"
                                    value={searchText2}
                                    onFocus={() => setDropdownVisible3(true)}
                                    style={{ backgroundColor: '#e8f0ff' }}
                                />
                                {dropdownVisible3 && (
                                    <DropdownDept
                                        helpData={helpData06}
                                        setSearchText={setSearchText2}
                                        setItemText={setItemText2}
                                        setDataSearch={setDataSearch2}
                                        setDataSheetSearch={setDataSheetSearch2}
                                        setDropdownVisible={setDropdownVisible3}
                                        dropdownVisible={dropdownVisible3}
                                        searchText={searchText2}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </ConfigProvider>
    )
}
