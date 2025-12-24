import { useState, useCallback, useEffect, useRef } from 'react'
import { Form, Input, Row, AutoComplete, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import DropdownDeptV2 from '../../../sheet/query/dropdownDeptV2'
import DropdownUser from '../../../sheet/query/dropdownUsers'

export default function DailyAtt06Query({
    toDate,
    setToDate,
    setFormDate,
    formDate,
    IsCheck,
    setIsCheck,

    helpData01,
    setDataSearch,
    setSearchText,
    searchText,
    setItemText,

    setDataSearch2,
    setSearchText2,
    searchText2,
    setItemText2,

    helpData02,
    helpData03,
    UMEmpType,
    setUMEmpType,
    WkItemSeq,
    setWkItemSeq,
    helpData04,
    setHelpData04,


    setSearchText1,
    setItemText1,
    setDataSearch1,
    setDataSheetSearch2,

}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const handleFormDate = (e) => {
        setFormDate(e)
    }
    const handleToDate = (e) => {
        setToDate(e)
    }



    const [displayValue, setDisplayValue] = useState('');
    const [displayValue2, setDisplayValue2] = useState('');
    const handleSelect = (val) => {
        if (val === '') {
            setWkItemSeq('');
            setDisplayValue('All'); // hiển thị "All"
            return;
        }

        const selected = helpData02.find(o => o.WkItemSeq === val);
        if (selected) {
            setWkItemSeq(selected.WkItemSeq);
            setDisplayValue(selected.WkItemName);
        }
    };
    const handleSelect2 = (val) => {
        if (val === '') {
            setUMEmpType('');
            setDisplayValue2('All'); // hiển thị "All"
            return;
        }

        const selected = helpData03.find(o => o.Value === val);
        if (selected) {
            setUMEmpType(selected.Value);
            setDisplayValue2(selected.MinorName);
        }
    };

    return (

        <div className=" container border-r">
            <Descriptions
                size="small"
                bordered
                style={{ borderRadius: 0 }}
                column={4}
            >
                <Descriptions.Item span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-2 font-bold text-red-500">Khoảng thời gian (*)</span>}>

                    <div className='flex items-center'>
                        <DatePicker
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                            placeholder="Chọn ngày"
                            value={formDate}
                            onChange={handleFormDate}
                        /> ~
                        <DatePicker
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                            placeholder="Chọn ngày"
                            value={toDate}
                            onChange={handleToDate}
                        />
                    </div>
                </Descriptions.Item>

                <Descriptions.Item span={2} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Hạng mục OT</span>}>
                    <AutoComplete
                        options={[
                            { value: '', label: 'All' },
                            ...helpData02.map(opt => ({
                                value: opt.WkItemSeq,
                                label: opt.WkItemName
                            }))
                        ]}
                        value={displayValue}
                        onSelect={handleSelect}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6]  cursor-pointer rounded-none"
                    />
                </Descriptions.Item>
                <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold text-red-500">Bộ phận (*)</span>}>
                    <Input
                        placeholder=""
                        value={searchText}
                        onFocus={() => setDropdownVisible(true)}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6] border-t cursor-pointer rounded-none"
                    />
                    {dropdownVisible && (
                        <DropdownDeptV2
                            helpData={helpData01}
                            setSearchText={setSearchText}
                            setItemText={setItemText}
                            setDataSearch={setDataSearch}
                            setDropdownVisible={setDropdownVisible}
                            dropdownVisible={dropdownVisible}
                            searchText={searchText}

                        />
                    )}
                </Descriptions.Item>

                <Descriptions.Item span={2} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Nhân viên</span>}>
                    <Input
                        size="small"
                        className="w-full p-1 bg-[#ebf1ffa6] border-t cursor-pointer rounded-none"
                        variant="borderless"

                        value={searchText2}
                        onFocus={() => setDropdownVisible2(true)}


                    />


                    {dropdownVisible2 && (
                        <DropdownUser
                            helpData={helpData04}
                            setHelpData05={setHelpData04}
                            setSearchText={setSearchText2}
                            setSearchText1={setSearchText1}
                            setItemText={setItemText2}
                            setItemText1={setItemText1}
                            setDataSearch={setDataSearch2}
                            setDataSearchDept={setDataSearch1}
                            setDataSheetSearch={setDataSheetSearch2}
                            setDropdownVisible={setDropdownVisible2}
                            dropdownVisible={dropdownVisible2}
                            searchText={searchText2}
                        />
                    )}
                </Descriptions.Item>
                <Descriptions.Item
                    label={
                        <span className="uppercase p-2 text-[9px] font-bold">
                            Bao gồm chi tiêt
                        </span>
                    }
                    style={{ padding: 0 }}
                >
                    <Checkbox
                        className="p-1"
                        checked={IsCheck === 1}
                        onChange={(e) => setIsCheck(e.target.checked ? 1 : 0)}
                    />
                </Descriptions.Item>




                <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Phân loại nhân viên</span>}>
                    <AutoComplete
                        options={[
                            { value: '', label: 'All' },
                            ...helpData03.map(opt => ({
                                value: opt.Value,
                                label: opt.MinorName
                            }))
                        ]}
                        value={displayValue2}
                        onSelect={handleSelect2}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6]  cursor-pointer rounded-none"
                    />
                </Descriptions.Item>





            </Descriptions>
        </div>
    )
}
