import { useState, useEffect } from 'react'
import { ConfigProvider, Form, Row, Col, Space, DatePicker, Select, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
import DropdownItem from '../../../sheet/query/dropDownItem'
import DropdownItemL from '../../../sheet/query/dropDownItemL'
import DropdownItemM from '../../../sheet/query/dropDownItemM'
import DropdownItemS from '../../../sheet/query/dropDownItemS'
dayjs.locale('vi')

export default function CogsByProdQuery({
    formData,
    setFormData,
    toDate,
    setToDate,
    helpData01,
    setAccUnit,
    AccUnit,
    AssetSeq,
    setAssetSeq,
    CostYY,
    setCostYY,
    helpData02,



    helpData03,
    setDataSearch,
    setDataSheetSearch,
    setSearchText,
    searchText,
    setItemText,

    setItemNo,
    ItemNo,
    dataSheetSearch,
    helpData04,
    ItemClassKind,
    setItemClassKind,

    helpData05,
    setDataSearch2,
    setSearchText2,
    searchText2,
    setItemText2,

    helpData06,
    setDataSearch3,
    setSearchText3,
    searchText3,
    setItemText3,

    helpData07,
    setDataSearch4,
    setSearchText4,
    searchText4,
    setItemText4,
    helpData08,
    AssetGroupSeq,
    setAssetGroupSeq, 
    WorkOrderNo, 
    setWorkOrderNo
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
                                    value={AccUnit}
                                    onChange={(value) => setAccUnit(value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('1805')}</span>}
                                style={{ marginBottom: 0 }}
                            >
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
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('18845')}</span>}
                                style={{ marginBottom: 0 }}
                            >

                                <Select
                                    style={{ width: 180 }}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData02?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    popupMatchSelectWidth={false}
                                    value={AssetSeq}
                                    onChange={(value) => setAssetSeq(value)}
                                />
                            </Form.Item>
                        </Col>
                      


                    </Row>
                    <Row gutter={[16, 8]} className='mt-2'>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('1786')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder=""
                                    value={searchText}
                                    onFocus={() => setDropdownVisible(true)}
                                    style={{ backgroundColor: '#e8f0ff' }}
                                />
                                {dropdownVisible && (
                                    <DropdownItem
                                        helpData={helpData03}
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
                                    value={ItemNo}
                                    /* dataSheetSearch */
                                    onChange={handleItemNoChange}
                                />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('10307')}</span>}
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
                                    popupMatchSelectWidth={false}
                                    value={ItemClassKind}
                                    onChange={(value) => setItemClassKind(value)}
                                />
                            </Form.Item>
                        </Col>

                        {/* Điều kiện hiển thị các input theo loại phân loại */}
                        {ItemClassKind === '2003' && (
                            <Col>
                                <Form.Item
                                    label={<span className="uppercase text-[10px]">{t('2115')}</span>}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input placeholder="" style={{ backgroundColor: '#e8f0ff' }} value={searchText2}
                                        onFocus={() => setDropdownVisible2(true)} />
                                    {dropdownVisible2 && (
                                        <DropdownItemL
                                            helpData={helpData05}
                                            setSearchText={setSearchText2}
                                            setItemText={setItemText2}
                                            setDataSearch={setDataSearch2}
                                            setDropdownVisible={setDropdownVisible2}
                                            dropdownVisible={dropdownVisible2}
                                            searchText={searchText2}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        )}

                        {ItemClassKind === '2002' && (
                            <Col>
                                <Form.Item
                                    label={<span className="uppercase text-[10px]">{t('3262')}</span>}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input placeholder="" style={{ backgroundColor: '#e8f0ff' }} value={searchText3}
                                        onFocus={() => setDropdownVisible3(true)} />
                                    {dropdownVisible3 && (
                                        <DropdownItemM
                                            helpData={helpData06}
                                            setSearchText={setSearchText3}
                                            setItemText={setItemText3}
                                            setDataSearch={setDataSearch3}
                                            setDropdownVisible={setDropdownVisible3}
                                            dropdownVisible={dropdownVisible3}
                                            searchText={searchText3}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        )}

                        {ItemClassKind === '2001' && (
                            <Col>
                                <Form.Item
                                    label={<span className="uppercase text-[10px]">{t('592')}</span>}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input placeholder="" style={{ backgroundColor: '#e8f0ff' }} value={searchText4}
                                        onFocus={() => setDropdownVisible4(true)} />
                                    {dropdownVisible4 && (
                                        <DropdownItemS
                                            helpData={helpData07}
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
                        )}



                    </Row>
                    <Row gutter={[16, 8]} className='mt-2'>
                    <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('20773')}</span>}
                                style={{ marginBottom: 0 }}
                            >

                                <Select
                                    style={{ width: 180 }}
                                    options={[
                                        { label: 'All', value: '' },
                                        ...(helpData08?.map((item) => ({
                                            label: item?.MinorName,
                                            value: item?.Value,
                                        })) || []),
                                    ]}
                                    value={AssetGroupSeq}
                                    onChange={(value) => setAssetGroupSeq(value)}
                                    popupMatchSelectWidth={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                label={<span className="uppercase text-[10px]">{t('1985')}</span>}
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder=""
                                    value={WorkOrderNo}
                                    onChange={(e) => setWorkOrderNo(e.target.value)}
                                />
                            </Form.Item>
                        </Col>


                    </Row>


                </Form>
            </div>
        </ConfigProvider>
    )
}
