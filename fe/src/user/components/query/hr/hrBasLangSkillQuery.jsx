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
export default function HrBasLangSkillQuery({
    helpData01,
    helpData02,
    helpData03,
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
    QAddress, setQAddress,

    helpData04,
    setDataSheetSearch1,
    UMLanguageType,
    setUMLanguageType, 
    setUMAuthType, 
    helpData06

}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const { t } = useTranslation()

    const handleChangeUMLanguageType = (value) => {
        setUMLanguageType(value)
    }
    const handleChangeUMAuthType = (value) => {
        setUMAuthType(value)
    }
    return (
        <div className="flex items-center gap-2">
            <Form layout="vertical" variant='filled'>
                <Row className="gap-4 flex items-center ">
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
                                    helpData={helpData06}
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
                            label={<span className="uppercase text-[9px]">{t('Ngôn ngữ ')} </span>}
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
                                onChange={handleChangeUMLanguageType}
                                options={[
                                    { label: 'All', value: '' },
                                    ...(helpData03?.map((item) => ({
                                        label: item?.MinorName,
                                        value: item?.Value,
                                    })) || []),
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Loại chứng chỉ')} </span>}
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
                                onChange={handleChangeUMAuthType}
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
