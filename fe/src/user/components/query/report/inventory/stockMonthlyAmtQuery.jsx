import { useState, useEffect } from 'react'
import {
    ConfigProvider, Form, Row, Col, Space, DatePicker, Select, Input,
    Checkbox
} from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
import DropdownItem from '../../../sheet/query/dropDownItem'

dayjs.locale('vi')

export default function StockMonthlyAmtQuery({
    formData,
    setFormData,
    toDate,
    setToDate,
    helpData02,
    helpData01,
    setAccUnit,
    helpData03,
    setAssetSeq,
    setAssetGroupSeq,


    setDataSearch,
    setDataSheetSearch,
    setSearchText,
    searchText,
    setItemText,
    helpData04,

    setSMAdjustKindSeq,
    helpData05,
    setItemNo,
    ItemNo,
    dataSheetSearch,
    setAppPriceKind,
    setIsAssetType,
    setIsDiff


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

    const handleItemNoChange = (e) => {
        setIsManualInput(true);
        setItemNo(e.target.value);
    };
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
                                    onChange={(value) => setAccUnit(value)}
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
                                label={<span className="uppercase text-[10px]">{t('1786')}</span>}
                                style={{ marginBottom: 0 }}
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
                                    <DropdownItem
                                        helpData={helpData04}
                                        setSearchText={setSearchText}
                                        setItemText={setItemText}
                                        setDataSearch={setDataSearch}
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
                                label={<span className="uppercase text-[10px]">{t('2091')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder=""
                                    className="w-[250px]"
                                    size="middle"
                                    value={ItemNo}
                                    onChange={handleItemNoChange}
                                />
                            </Form.Item>
                        </Col>


                    </Row>

                    {/* Dòng 2 */}
                    <Row gutter={[16, 8]} className="mt-2">

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('16990')}</span>}
                                name="UMCustClass"
                                initialValue={helpData02?.[0]?.Value}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData02?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    onChange={(value) => setAssetGroupSeq(value)}

                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('1994')}</span>}
                                name="ProfitDivSeq"
                                initialValue={helpData03?.[0]?.FormatSeq}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 220 }}
                                    popupMatchSelectWidth={false}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData03?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    onChange={(value) => setAssetSeq(value)}

                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('8488')}</span>}
                                style={{ marginBottom: 0 }}
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
                                    onChange={(value) => setAppPriceKind(value)}

                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="showDetail" initialValue={true} style={{ marginBottom: 0 }}>
                                <Checkbox
                                    onChange={(e) => setIsAssetType(e.target.checked ? 1 : 0)}
                                >
                                    {t('22282')}
                                </Checkbox>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="showDetail" initialValue={true} style={{ marginBottom: 0 }}>
                                <Checkbox
                                    onChange={(e) => setIsDiff(e.target.checked ? 1 : 0)}
                                >
                                    {t('48481')}
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </ConfigProvider>
    )
}
