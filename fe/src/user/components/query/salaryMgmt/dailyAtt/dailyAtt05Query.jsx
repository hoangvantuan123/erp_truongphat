import { useState, useCallback, useEffect, useRef } from 'react'
import { Form, Input, Row, AutoComplete, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'

export default function DailyAtt05Query({
    setSMHolidayType,
    helpData01,
    fromDate,
    setFromDate,
    HolidayName,
    setHolidayName,
    IsCommon,
    setIsCommon
}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)

    const [displayValue, setDisplayValue] = useState(helpData01[0]?.MinorName || '');
    const handleSelect = (val) => {
        if (val === '') {
            setSMHolidayType('');           // lưu chuỗi rỗng
            setDisplayValue('All'); // hiển thị "All"
            return;
        }

        const selected = helpData01.find(o => o.Value === val);
        if (selected) {
            setSMHolidayType(selected.Value);
            setDisplayValue(selected.MinorName);
        }
    };

    const handleFromDate = (date) => {
        setFromDate(date)
    }
    return (

        <div className=" container border-r">
            <Descriptions
                size="small"
                bordered
                style={{ borderRadius: 0 }}
                column={3}
            >
                <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-2 font-bold text-red-600">Ngày (*)</span>}>

                    <DatePicker

                        size="small"
                        variant="borderless"
                        className="w-full rounded-none p-1"

                        value={fromDate}
                        onChange={handleFromDate}
                    />
                </Descriptions.Item>

                <Descriptions.Item span={2} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Hình thái lương</span>}>
                    <AutoComplete
                        options={[
                            { value: '', label: 'All' },
                            ...helpData01.map(opt => ({
                                value: opt.Value,
                                label: opt.MinorName
                            }))
                        ]}
                        value={displayValue}
                        onSelect={handleSelect}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6]  cursor-pointer rounded-none"
                    />
                </Descriptions.Item>
                <Descriptions.Item span={2} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Nhóm lương </span>}>
                    <AutoComplete
                        options={[
                            { value: '', label: 'All' },
                            ...helpData01.map(opt => ({
                                value: opt.Value,
                                label: opt.MinorName
                            }))
                        ]}
                        value={displayValue}
                        onSelect={handleSelect}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6]  cursor-pointer rounded-none"
                    />
                </Descriptions.Item>



            </Descriptions>
        </div>
    )
}
