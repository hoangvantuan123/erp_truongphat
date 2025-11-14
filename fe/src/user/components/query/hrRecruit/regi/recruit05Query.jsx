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
export default function Recruit05Query({
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
                            label={<span className="uppercase text-[9px]">{t('Mã nhân viên')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Input
                                placeholder=""
                                className="w-[250px]"
                                size="middle"
                                value={keyItem2}
                                onChange={(e) => setKeyItem2(e.target.value)}
                            />


                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('Họ tên')} </span>}
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            wrapperCol={{ style: { padding: 0 } }}
                        >
                            <Input
                                placeholder=""
                                className="w-[250px]"
                                size="middle"
                                value={keyItem3}
                                onChange={(e) => setKeyItem3(e.target.value)}
                            />


                        </Form.Item>
                    </Col>


                </Row>
            </Form>
        </div>
    )
}
