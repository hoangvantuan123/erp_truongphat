import { useState, useCallback, useEffect, useRef } from 'react'
import { Form, Input, Row, AutoComplete, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'

export default function DailyAtt04Query({
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
                <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-2 font-bold">Năm</span>}>

                    <DatePicker
                        picker="year"
                        size="small"
                        variant="borderless"
                        className="w-full rounded-none p-1"
                        placeholder="Chọn năm"
                        value={fromDate}
                        onChange={handleFromDate}
                    />
                </Descriptions.Item>

                <Descriptions.Item span={2} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Loại (Type) ngày nghỉ lễ</span>}>
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
                <Descriptions.Item span={2} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Tên ngày nghỉ lễ</span>}>
                    <Input
                        size="small"
                        className="w-full rounded-none  p-1 "
                        maxLength={350}
                        variant="borderless"
                        value={HolidayName}
                        onChange={(e) => setHolidayName(e.target.value)}


                    />
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <span className="uppercase p-2 text-[9px] font-bold">
                            Ngày nghỉ tiêu chuẩn
                        </span>
                    }
                    style={{ padding: 0 }}
                >
                    <Checkbox
                        className="p-1"
                        checked={IsCommon === 1}
                        onChange={(e) => setIsCommon(e.target.checked ? 1 : 0)}
                    />
                </Descriptions.Item>






            </Descriptions>
        </div>
    )
}
