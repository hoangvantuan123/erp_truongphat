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
import DropdownDept from '../../sheet/query/dropdownDept'
export default function HrBasUnionQuery({
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
    helpData03,
    helpData04,
    helpData05,
    setDataSheetSearch1,
    setFrBegDate,
    setToBegDate,
    setFrEndDate,
    setToEndDate,
    setUMUnionType,
    setUMUnionStatus



}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const { t } = useTranslation()
    const handleFrBegDate = (date) => {
        setFrBegDate(date)
    }
    const handlesetToBegDate = (date) => {
        setToBegDate(date)
    }
    const handleFrEndDate = (date) => {
        setFrEndDate(date)
    }
    const handlesetToEndDate = (date) => {
        setToEndDate(date)
    }
    const handleUMUnionType = (value) => {
        setUMUnionType(value)
    }
    const handleUMUnionStatus = (value) => {
        setUMUnionStatus(value)
    }
    return (
        <div className="flex items-center gap-2">
            <Form layout="vertical" variant='filled'>
                <Row className="gap-4 flex items-center ">
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Nhân viên')} </span>}
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
                            label={<span className="uppercase text-[9px]">{t('Mã nhân viên')} </span>}
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

                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Bộ phận')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
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
                                <DropdownDept
                                    helpData={helpData03}
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
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[10px]">{t('Gia nhập công đoàn')}</span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Space>
                                <DatePicker
                                    size="middle"
                                    format="YYYY-MM-DD"
                                    onChange={handleFrBegDate}
                                />
                                <DatePicker
                                    size="middle"
                                    format="YYYY-MM-DD"
                                    onChange={handlesetToBegDate}
                                />
                            </Space>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[10px]">{t('Rời khỏi công đoàn')}</span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Space>
                                <DatePicker
                                    size="middle"
                                    format="YYYY-MM-DD"
                                    onChange={handleFrEndDate}
                                />
                                <DatePicker
                                    size="middle"
                                    format="YYYY-MM-DD"
                                    onChange={handlesetToEndDate}
                                />
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="gap-4 flex items-center ">

                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Tình trạng gia nhập')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Select
                                id="typeSelect"
                                defaultValue="All"
                                size="middle"
                                style={{
                                    width: 350,
                                }}
                                onChange={handleUMUnionStatus}
                                options={[
                                    { label: 'All', value: '' },
                                    ...(helpData05?.map((item) => ({
                                        label: item?.MinorName,
                                        value: item?.Value,
                                    })) || []),
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Phân loại công đoàn')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Select
                                id="typeSelect"
                                defaultValue="All"
                                size="middle"
                                style={{
                                    width: 350,
                                }}
                                onChange={handleUMUnionType}
                                options={[
                                    { label: 'All', value: '' },
                                    ...(helpData04?.map((item) => ({
                                        label: item?.MinorName,
                                        value: item?.Value,
                                    })) || []),
                                ]}
                            />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </div>
    )
}
