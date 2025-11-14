import { useState, useEffect } from 'react'
import { ConfigProvider, Form, Row, Col, Space, DatePicker, Select, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
dayjs.locale('vi')

export default function RptSalesCatQuery({
    formData,
    setFormData,
    toDate,
    setToDate,
    helpData02,
    helpData01,
    setBizUnit,
    helpData03,
    setAssetSeq,
    setAssetGroupSeq,

    setSMAdjustKindSeq,
    helpData05,
    setItemNo,
    helpData04,
    dataSheetSearch,
    setSMOutSales, setSMSTDQueryType,
    setUMItemClass,
    setSMQryUnitSeq, setSMTermsKind,
    helpData06,
    setRanking,
    SMOutSales,
    SMSTDQueryType,
    UMItemClass,
    SMQryUnitSeq,
    SMTermsKind,
    Ranking


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

    useEffect(() => {
        if (!isManualInput && dataSheetSearch?.[0]?.ItemNo) {
            setItemNo(dataSheetSearch?.[0]?.ItemNo || '');
        }
    }, [dataSheetSearch, isManualInput]);

    useEffect(() => {
        if (helpData02 && helpData02.length > 0) {
            setSMOutSales(helpData02[0].Value);
        }
        if (helpData03 && helpData03.length > 0) {
            setSMSTDQueryType(helpData03[1].Value);
        }
        if (helpData04 && helpData04.length > 0) {
            setUMItemClass(helpData04[0].UMItemClass);
        }
        if (helpData05 && helpData05.length > 0) {
            setSMQryUnitSeq(helpData05[0].Value);
        }
        if (helpData06 && helpData06.length > 0) {
            setSMTermsKind(helpData06[0].Value);
        }
    }, [helpData02, helpData03, helpData04, helpData05, helpData06]);
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
                                            label: item?.BizUnitName,
                                            value: item?.BizUnit,
                                        })) || []),
                                    ]}
                                    onChange={(value) => setBizUnit(value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('63')}</span>}
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
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('15587')}</span>}
                                initialValue={helpData02?.[0]?.Value || ''}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        ...(helpData02?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    value={SMOutSales}
                                    onChange={(value) => setSMOutSales(value)}

                                />


                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('599')}</span>}
                                initialValue={helpData03?.[1]?.Value}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        ...(helpData03?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    value={SMSTDQueryType}
                                    onChange={(value) => setSMSTDQueryType(value)}

                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Dòng 2 */}
                    <Row gutter={[16, 8]} className="mt-2">
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('715')}</span>}
                                style={{ marginBottom: 0 }}
                                initialValue={helpData04?.[0]?.Value}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        ...(helpData04?.map((item) => ({
                                            label: item?.Value,
                                            value: item?.UMItemClass,
                                        })) || []),
                                    ]}
                                    value={UMItemClass}
                                    onChange={(value) => setUMItemClass(value)}

                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('565')}</span>}
                                style={{ marginBottom: 0 }}
                                initialValue={helpData05?.[0]?.Value}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        ...(helpData05?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    value={SMQryUnitSeq}
                                    onChange={(value) => setSMQryUnitSeq(value)}

                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('3004')}</span>}
                                style={{ marginBottom: 0 }}
                                initialValue={helpData06?.[0]?.Value}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        ...(helpData06?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    value={SMTermsKind}
                                    onChange={(value) => setSMTermsKind(value)}

                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('14738')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <InputNumber
                                    min={0}
                                    defaultValue={5}
                                    value={Ranking}
                                    onChange={(val) => setRanking(val)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </ConfigProvider>
    )
}
