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
import DropdownUser from '../../../sheet/query/dropdownUsers'
export default function Recruit01Query({
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
    setToDate,
    helpData09

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
                            label={<span className="uppercase text-[10px]">{t('Khoảng thời gian tuyển dụng')}</span>}
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
                            label={<span className="uppercase text-[9px]">{t('Người phỏng vấn / Đăng ký')} </span>}
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
                                    helpData={helpData09}
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


                </Row>
            </Form>
        </div>
    )
}
