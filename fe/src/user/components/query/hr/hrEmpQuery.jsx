import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Space, DatePicker, Select } from 'antd'
import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor
} from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import DropdownUser from '../../sheet/query/dropdownUsers'
export default function HrEmpsQuery({
    helpData01,
    helpData02,
    searchText,
    setSearchText,
    setSearchText1,
    searchText1,
    setItemText,
    itemText,
    setDataSearch,
    dataSearch,
    setDataSearch1,
    dataSearch1,
    setDataSheetSearch,
    dataSheetSearch,
    setItemText1,
    setHelpData02,
    UMEmpType, setUMEmpType,
    formData,
    setFormData,
    toDate,
    setToDate


}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const { t } = useTranslation()

    const handleChangeUMEmpType = (value) => {
        setUMEmpType(value)
    }
    const handleFormDate = (date) => {
        setFormData(date)
    }
    const handletoDate = (date) => {
        setToDate(date)
    }
    return (
        <div className="flex items-center gap-2">
            <Form layout="vertical" variant='filled'>
                <Row className="gap-4 flex items-center ">
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[10px]">{t('215')}</span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Space>
                                <DatePicker
                                    size="middle"
                                    format="YYYY-MM-DD"
                                    value={formData}
                                    onChange={handleFormDate}
                                />
                                <DatePicker
                                    size="middle"
                                    format="YYYY-MM-DD"
                                    value={toDate}
                                    onChange={handletoDate}
                                />
                            </Space>
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[10px]">{t('1479')}</span>}
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
                                onChange={handleChangeUMEmpType}
                                options={[
                                    { label: 'All', value: '' },
                                    ...(helpData01?.map((item) => ({
                                        label: item?.MinorName,
                                        value: item?.Value,
                                    })) || []),
                                ]}
                            />
                        </Form.Item>
                    </Col>


                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('4')} </span>}
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
                                <DropdownUser
                                    helpData={helpData02}
                                    setHelpData05={setHelpData02}
                                    setSearchText={setSearchText}
                                    setSearchText1={setSearchText1}
                                    setItemText={setItemText}
                                    setItemText1={setItemText1}
                                    setDataSearch={setDataSearch}
                                    setDataSearchDept={setDataSearch1}
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
                            label={<span className="uppercase text-[9px]">{t('1452')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Input
                                placeholder=""
                                className="w-[250px]"
                                size="middle"
                                value={dataSearch?.EmpID}
                                readOnly
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
