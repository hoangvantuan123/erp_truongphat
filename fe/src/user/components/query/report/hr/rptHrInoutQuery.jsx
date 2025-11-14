import { useState, useEffect } from 'react'
import { ConfigProvider, Form, Row, Col, Space, DatePicker, Select, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
dayjs.locale('vi')

export default function RptHrInoutQuery({
    formData,
    setFormData,


}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)

    const [isManualInput, setIsManualInput] = useState(false);

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
    return (
        <ConfigProvider locale={getAntdLocale()}>
            <div className="flex flex-col gap-2 p-2">
                <Form variant="filled">
                    <Row gutter={[16, 8]}>


                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('62')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <DatePicker
                                        picker="year"
                                        format="YYYY"
                                        defaultValue={formData}
                                        onChange={(value) => setFormData(value)}
                                    />

                                </Space>
                            </Form.Item>
                        </Col>



                    </Row>

                </Form>
            </div>
        </ConfigProvider>
    )
}
