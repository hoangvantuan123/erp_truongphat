import { useState, useCallback, useEffect, useRef } from 'react'
import { Form, Input, Row, Col, DatePicker, Descriptions, AutoComplete, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';

export default function DailyAtt08BQuery({
    helpData01,
    setHelpData01,
    YyMm,
    setYyMm,
    PuSeq,
    setPuSeq,
}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [displayValue, setDisplayValue] = useState('All');
    const langCode = localStorage.getItem('language')
    const handleSelect = (val) => {
        if (val === '') {
            setPuSeq('');
            setDisplayValue('All'); // hiển thị "All"
            return;
        }

        const selected = helpData01.find(o => o.PuSeq === val);
        if (selected) {
            setPuSeq(selected.PuSeq);
            setDisplayValue(selected.PuName);
        }
    };
    const handleFormDate = (e) => {
        setYyMm(e)
    }
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
            <div className=" w-full container border-r">
                <Descriptions
                    size="small"
                    bordered
                    style={{ borderRadius: 0 }}
                    column={2}
                >


                    <Descriptions.Item span={1} style={{ padding: 0, width: 350 }} label={<span className="uppercase text-[9px]  p-2  font-bold">NHÓM LƯƠNG</span>}>
                        <AutoComplete
                            options={[
                                { value: '', label: 'All' },
                                ...helpData01.map(opt => ({
                                    value: opt.PuSeq,
                                    label: opt.PuName
                                }))
                            ]}
                            value={displayValue}
                            onSelect={handleSelect}
                            variant="borderless"

                            className="w-full p-1   cursor-pointer bg-[#ebf1ffa6] rounded-none"
                        />
                    </Descriptions.Item>

                    <Descriptions.Item span={1} style={{ padding: 0, width: 350 }} label={<span
                        className="uppercase text-[9px]  p-2  font-bold"
                    >
                        Ngày tháng tiêu chuẩn bắt đầu nghỉ phép
                    </span>
                    }>

                        <DatePicker
                            picker="month"
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none p-1"
                            placeholder="Chọn năm - tháng"
                            value={YyMm}
                            onChange={handleFormDate}
                        />

                    </Descriptions.Item>

                </Descriptions>
            </div>
        </ConfigProvider>
    )
}
