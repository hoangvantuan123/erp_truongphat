import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Space, Checkbox, Select } from 'antd'
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
export default function HrBasFamilyQuery({
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
    UMRelSeq,
    setUMRelSeq,
    IsChangedMst,
    IsSameRoof,
    IsPayAllow,
    IsMed,
    setIsChangedMst,
    setIsSameRoof,
    setIsPayAllow,
    setIsMed,
    helpData09,
    setDataSheetSearch1

}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const { t } = useTranslation()
    const onChangeIsChangedMst = e => {
        setIsChangedMst(e.target.checked)
    };
    const onChangeIsSameRoof = e => {
        setIsSameRoof(e.target.checked)
    };
    const onChangeIsPayAllow = e => {
        setIsPayAllow(e.target.checked)
    };
    const onChangeIsMed = e => {
        setIsMed(e.target.checked)
    };
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
                                    helpData={helpData09}
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
                            label={<span className="uppercase text-[10px]">{t('Quan hệ gia đình')}</span>}
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
                                value={UMRelSeq}
                                onChange={setUMRelSeq}
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
                </Row>
                <Row className="gap-4 flex items-center mt-3 ">
                    <Col>
                        <Checkbox onChange={onChangeIsChangedMst}>Sống chung</Checkbox>
                    </Col>
                    <Col>
                        <Checkbox onChange={onChangeIsSameRoof}>Có người phụ thuộc</Checkbox>
                    </Col>
                    <Col>
                        <Checkbox onChange={onChangeIsPayAllow}>Đối tượng nhận chu cấp gia đình</Checkbox>
                    </Col>
                    <Col>
                        <Checkbox onChange={onChangeIsMed}>Người phụ thuộc có bảo hiểm y tế hay không?</Checkbox>
                    </Col>

                </Row>
            </Form>
        </div>
    )
}
