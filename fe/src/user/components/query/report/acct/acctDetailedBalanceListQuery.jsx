import { useState, useEffect } from 'react'
import { ConfigProvider, Form, Row, Col, Space, DatePicker, Select, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
import Dropdown40001 from '../../../sheet/query/dropDown40001'
import Dropdown40002 from '../../../sheet/query/dropDown40002'
import Dropdown10005 from '../../../sheet/query/dropDown10005'
dayjs.locale('vi')

export default function AcctDetailedBalanceListQuery({
    formData,
    setFormData,
    toDate,
    setToDate,
    helpData01,
    setBizUnit,

    AccUnit,
    setAccUnit,


    helpData02,
    setDataSearch,
    setSearchText,
    searchText,
    setItemText,

    helpData03,
    setDataSearch2,
    setSearchText2,
    searchText2,
    setItemText2,


    helpData04,
    setDataSearch3,
    setSearchText3,
    searchText3,
    setItemText3,
    dataSearch3,

    helpData05,
    setDataSearch4,
    setSearchText4,
    searchText4,
    setItemText4,
    dataSearch4,
    dataSearch2,
    UMCostType,
    setUMCostType
}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [dropdownVisible3, setDropdownVisible3] = useState(false)
    const [dropdownVisible4, setDropdownVisible4] = useState(false)

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
        if (!dataSearch2 || typeof dataSearch2 !== 'object') return;
        const {
            AccNoTo = '',
            AccNameTo = '',
            AccNoFr = '',
            AccNameFr = '',
            AccSeqFr = '',
            AccSeqTo = '',
        } = dataSearch2;

        setSearchText3(AccNameFr);
        setSearchText4(AccNameTo);



        setDataSearch3({
            AccNo: AccNoFr,
            AccName: AccNameFr,
            AccSeq: AccSeqFr,
        });

        setDataSearch4({
            AccNo: AccNoTo,
            AccName: AccNameTo,
            AccSeq: AccSeqTo,

        });
    }, [dataSearch2]);

    return (
        <ConfigProvider locale={getAntdLocale()}>
            <div className="flex flex-col gap-2 p-2">
                <Form variant="filled">
                    <Row gutter={[16, 8]}>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('1')}</span>}
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
                                    value={AccUnit}
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
                                        defaultValue={formData}
                                        onChange={(value) => setFormData(value)}
                                    />
                                    ~
                                    <DatePicker
                                        value={toDate}
                                        onChange={(value) => setToDate(value)}
                                    />
                                </Space>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('363')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder=""
                                    value={searchText}
                                    onFocus={() => setDropdownVisible(true)}
                                    style={{ backgroundColor: '#e8f0ff' }}
                                />
                                {dropdownVisible && (
                                    <Dropdown10005
                                        helpData={helpData02}
                                        setSearchText={setSearchText}
                                        setItemText={setItemText}
                                        setDataSearch={setDataSearch}
                                        setDropdownVisible={setDropdownVisible}
                                        dropdownVisible={dropdownVisible}
                                        searchText={searchText}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 8]} className="mt-2">


                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('8')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <Input
                                        placeholder=""
                                        value={searchText3}
                                        onFocus={() => setDropdownVisible3(true)}
                                        style={{ backgroundColor: '#e8f0ff' }}
                                    />
                                    {dropdownVisible3 && (
                                        <Dropdown40002
                                            helpData={helpData03}
                                            setSearchText={setSearchText3}
                                            setItemText={setItemText3}
                                            setDataSearch={setDataSearch3}
                                            setDropdownVisible={setDropdownVisible3}
                                            dropdownVisible={dropdownVisible3}
                                            searchText={searchText3}
                                        />
                                    )}
                                    <Input
                                        readOnly
                                        style={{ width: '100px' }}
                                        value={dataSearch3?.AccNo ? dataSearch3?.AccNo : ''}
                                    />
                                </Space>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('652')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    style={{ width: 180 }}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData04?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    value={UMCostType}
                                    onChange={(value) => setUMCostType(value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('603')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder=""
                                    value={searchText4}
                                    onFocus={() => setDropdownVisible4(true)}
                                    style={{ backgroundColor: '#e8f0ff' }}
                                />
                                {dropdownVisible4 && (
                                    <Dropdown40001
                                        helpData={helpData05}
                                        setSearchText={setSearchText4}
                                        setItemText={setItemText4}
                                        setDataSearch={setDataSearch4}
                                        setDropdownVisible={setDropdownVisible4}
                                        dropdownVisible={dropdownVisible4}
                                        searchText={searchText4}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </ConfigProvider>
    )
}
