import { useState } from 'react'
import { ConfigProvider, Form, Row, Col, Space, DatePicker, Select, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
dayjs.locale('vi')

export default function FinQueryCmQuery({
    formData,
    setFormData,
    toDate,
    setToDate,
    PrevFrAccYM,
    PrevToAccYM,
    setPrevFrAccYM,
    setPrevToAccYM,
    helpData02,
    helpData01,
    setFormatSeq,
    setDisplayLevels,
    setAccUnit,
    setIsDisplayZero
}) {
    const { t } = useTranslation()
    const langCode = localStorage.getItem('language')
    const getAntdLocale = () => {
        switch (langCode) {
            case '6':
                dayjs.locale('vi')
                return viVN
            case '1':
                dayjs.locale('ko')
                return koKR
            default:
                dayjs.locale('vi')
                return viVN
        }
    }
    const displayLevelOptions = [
        { label: `${t('18772')} 1`, value: 1 },
        { label: `${t('18772')} 2`, value: 2 },
        { label: `${t('18772')} 3`, value: 3 },
        { label: `${t('18772')} 4`, value: 4 },
    ];


    return (
        <ConfigProvider locale={getAntdLocale()}>
            <div className="flex flex-col gap-2 p-2">
                <Form variant="filled">
                    {/* Dòng 1 */}
                    <Row gutter={[16, 8]}>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('1')}</span>}
                                name="unit"
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 180 }}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData01?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    popupMatchSelectWidth={false}
                                    onChange={(value) => setAccUnit(value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('12823')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <DatePicker
                                        picker="month"
                                        format="YYYY-MM"
                                        defaultValue={formData}
                                        onChange={(value) => setFormData(value)}
                                    />
                                    <DatePicker
                                        picker="month"
                                        format="YYYY-MM"
                                        value={toDate}
                                        onChange={(value) => setToDate(value)}
                                    />
                                </Space>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="showDetail" initialValue={true} style={{ marginBottom: 0 }}>
                                <Checkbox
                                    defaultChecked
                                    onChange={(e) => setIsDisplayZero(e.target.checked ? 1 : 0)}
                                >
                                    {t('19391')}
                                </Checkbox>
                            </Form.Item>
                        </Col>

                    </Row>

                    {/* Dòng 2 */}
                    <Row gutter={[16, 8]} className="mt-2">
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('17120')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <DatePicker
                                        picker="month"
                                        format="YYYY-MM"
                                        value={PrevFrAccYM}
                                        onChange={(value) => setPrevFrAccYM(value)}
                                    />
                                    <DatePicker
                                        picker="month"
                                        format="YYYY-MM"
                                        value={PrevToAccYM}
                                        onChange={(date) => setPrevToAccYM(date)}
                                    />
                                </Space>
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('17008')}</span>}
                                name="reportTemplate"
                                initialValue={helpData02?.[0]?.FormatSeq}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 350 }}
                                    options={[
                                        ...(helpData02?.map((item) => ({
                                            label: item?.FormatName,
                                            value: item?.FormatSeq,
                                        })) || []),
                                    ]}
                                    popupMatchSelectWidth={false}
                                    onChange={(value) => setFormatSeq(value)}

                                />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('18772')}</span>}
                                name="displayLevels"
                                initialValue={[4]}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 200 }}
                                    options={[
                                        ...(displayLevelOptions?.map((item) => ({
                                            label: item?.label,
                                            value: item?.value,
                                        })) || []),
                                    ]}
                                    popupMatchSelectWidth={false}
                                    onChange={(value) => setDisplayLevels(value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </ConfigProvider>
    )
}
