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
export default function RecManage01Query({
    formData,
    setFormData,
    toDate,
    setToDate,
    setKeyItem3,
    setKeyItem2,
    keyItem3,
    keyItem2

}) {
    const { t } = useTranslation()
    const handleFormDate = (date) => {
        setFormData(date)
    }
    const handletoDate = (date) => {
        setToDate(date)
    }
    return (
        <div className="flex items-center gap-2 p-1">
            <Form layout="vertical" variant='filled'>
                <Row className="gap-4 flex items-center ">
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[10px]">{t('Khoảng thời gian')}</span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 0, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Space>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    value={formData}
                                    onChange={handleFormDate}
                                />
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    value={toDate}
                                    onChange={handletoDate}
                                />
                            </Space>
                        </Form.Item>
                    </Col>





                </Row>
            </Form>
        </div>
    )
}
