import { useState, useCallback } from 'react'
import {
    Button,
    Form,
    Input,
    Row,
    Col,
    DatePicker,
    Segmented,
    Select,
    InputNumber
} from 'antd'
import { useTranslation } from 'react-i18next'
export default function DictSysQuery({
    setWordSeq,
    wordSeq,
    wordText, setWordText,
}) {
    const { t } = useTranslation()
    return (
        <div className="flex items-center gap-2">
            <Form layout="vertical">
                <Row className="gap-4 flex items-center ">
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('850000128')}</span>}
                            className="mb-0 w-[250px]"
                        ><InputNumber
                                size="middle"
                                value={wordSeq}
                                onChange={setWordSeq}
                                min={0}
                                style={{ width: "100%" }}
                            />

                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={<span className="uppercase  text-[9px]">{t('850000129')}</span>}
                            className="mb-0 w-[400px]"
                        >
                            <Input
                                size="middle"
                                value={wordText}
                                onChange={(e) => setWordText(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
