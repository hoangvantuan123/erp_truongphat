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

import DropdownDept from '../../sheet/query/dropdownDept'
export default function HrBasOrgPosQuery({

    setQEndDate,
    setQBegDate,
    PosName, setPosName,
    helpData03
    ,
    UMPosLvlSeq, setUMPosLvlSeq


}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const { t } = useTranslation()
    const handleQBegDate = (date) => {
        setQBegDate(date)
    }
    const handlesetQEndDate = (date) => {
        setQEndDate(date)
    }
    return (
        <div className="flex items-center mt-3 gap-2">
            <Form variant='filled'>
                <Row className="gap-4 flex items-center ">
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Nhân viên')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        > <Space>
                                <DatePicker
                                    size="middle"
                                    format="YYYY-MM-DD"
                                    onChange={handleQBegDate}
                                />
                                <DatePicker
                                    size="middle"
                                    format="YYYY-MM-DD"
                                    onChange={handlesetQEndDate}
                                />
                            </Space>

                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Vị trí')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Input
                                placeholder=""
                                className="w-[250px]"
                                size="middle"
                                value={PosName}
                                onChange={(e) => setPosName(e.target.value)}
                            />


                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Cấp bậc')} </span>}
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
                                value={UMPosLvlSeq}
                                onChange={setUMPosLvlSeq}
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

            </Form>
        </div>
    )
}
