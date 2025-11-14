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
export default function HrBasTOrgJobQuery({
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
    setDataSheetSearch1,
    formData,
    setFormData,
    toDate,
    setToDate,
    JobName, setJobName

}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const { t } = useTranslation()
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
                            label={<span className="uppercase text-[10px]">{t('Khoảng thời gian')}</span>}
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
                            label={<span className="uppercase text-[9px]">{t('Section')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Input
                                placeholder=""
                                className="w-[350px]"
                                value={JobName}
                                onChange={(e) => setJobName(e.target.value)}
                                size="middle"
                            />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </div>
    )
}
