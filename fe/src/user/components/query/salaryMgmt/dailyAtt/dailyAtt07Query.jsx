import { useState, useCallback, useEffect, useRef } from 'react'
import { Form, Input, AutoComplete, Col, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import DropdownDeptV2 from '../../../sheet/query/dropdownDeptV2'
import DropdownUser from '../../../sheet/query/dropdownUsers'
import DropdownWkItem from '../../../sheet/query/dropdownWkItem'
export default function DailyAtt07Query({
    setFormDate,
    formDate,

    helpData01,
    helpData02, helpData03, helpData04,
    helpData05, helpData06,
    setHelpData01,
    setDataSearch,
    setSearchText,
    searchText,
    setItemText,



    setDataSearch2,
    setSearchText2,
    searchText2,
    setItemText2,


    setSearchText1,
    setItemText1,
    setDataSearch1,
    setDataSheetSearch2,



    setDataSearch3,
    setSearchText3,
    searchText3,
    setItemText3,
    PtSeq,
    setPtSeq,
    PuSeq,
    setPuSeq,
    dataSearch2

}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [dropdownVisible3, setDropdownVisible3] = useState(false)

    const [displayValue, setDisplayValue] = useState(helpData05[0]?.PuName || '');
    const [displayValue2, setDisplayValue2] = useState(helpData06[0]?.PtName || '');
    const handleSelect = (val) => {
        if (val === '') {
            setPuSeq('');           // lưu chuỗi rỗng
            setDisplayValue('All'); // hiển thị "All"
            return;
        }

        const selected = helpData05.find(o => o.PuSeq === val);
        if (selected) {
            setPuSeq(selected.PuSeq);
            setDisplayValue(selected.PuName);
        }
    };
    const handleSelect2 = (val) => {
        if (val === '') {
            setPtSeq('');           // lưu chuỗi rỗng
            setDisplayValue2('All'); // hiển thị "All"
            return;
        }

        const selected = helpData06.find(o => o.PtSeq === val);
        if (selected) {
            setPtSeq(selected.PtSeq);
            setDisplayValue2(selected.PtName);
        }
    };

    const handleFormDate = (e) => {
        setFormDate(e)
    }
    return (

        <div className=" container border-r">
            <Descriptions
                size="small"
                bordered
                style={{ borderRadius: 0 }}
                column={3}
            >
                <Descriptions.Item span={0.25} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  text-red-500    p-2 font-bold">Ngày (*)</span>}>

                    <DatePicker
                        size="small"
                        variant="borderless"
                        className="w-full rounded-none  p-1 "
                        placeholder="Chọn ngày"
                        value={formDate}
                        onChange={handleFormDate}
                    />
                </Descriptions.Item>

                <Descriptions.Item span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">NHÓM LƯƠNG</span>}>
                    <AutoComplete
                        options={[
                            { value: '', label: 'All' },
                            ...helpData05.map(opt => ({
                                value: opt.PuSeq,
                                label: opt.PuName
                            }))
                        ]}
                        value={displayValue}
                        onSelect={handleSelect}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6]  cursor-pointer rounded-none"
                    />
                </Descriptions.Item>

                <Descriptions.Item span={2} style={{ padding: 0, width: 120 }} label={<span className="uppercase text-[9px]  p-2  font-bold">HÌNH THÁI LƯƠNG</span>}>
                    <AutoComplete
                        options={[
                            { value: '', label: 'All' },
                            ...helpData06.map(opt => ({
                                value: opt.PtSeq,
                                label: opt.PtName
                            }))
                        ]}
                        value={displayValue2}
                        onSelect={handleSelect2}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6]  cursor-pointer rounded-none"
                    />
                </Descriptions.Item>
                <Descriptions.Item span={1.5} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">MỤC CHẤM CÔNG</span>}>
                    <Input
                        placeholder=""
                        value={searchText3}
                        onFocus={() => setDropdownVisible3(true)}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6] border-t cursor-pointer rounded-none"
                    />
                    {dropdownVisible3 && (
                        <DropdownWkItem
                            helpData={helpData04}
                            setSearchText={setSearchText3}
                            setItemText={setItemText3}
                            setDataSearch={setDataSearch3}
                            setDropdownVisible={setDropdownVisible3}
                            dropdownVisible={dropdownVisible3}
                            searchText={searchText3}

                        />
                    )}
                </Descriptions.Item>
                <Descriptions.Item span={1.5} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Thuộc Bộ phận</span>}>
                    <Input
                        placeholder=""
                        value={searchText}
                        onFocus={() => setDropdownVisible(true)}
                        variant="borderless"
                        className="w-full p-1 bg-[#ebf1ffa6] border-t cursor-pointer rounded-none"
                    />
                    {dropdownVisible && (
                        <DropdownDeptV2
                            helpData={helpData03}
                            setSearchText={setSearchText}
                            setItemText={setItemText}
                            setDataSearch={setDataSearch}
                            setDropdownVisible={setDropdownVisible}
                            dropdownVisible={dropdownVisible}
                            searchText={searchText}

                        />
                    )}
                </Descriptions.Item>



                <Descriptions.Item span={1.5} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">HỌ TÊN NHÂN VIÊN</span>}>
                    <Input
                        size="small"
                        className="w-full p-1 bg-[#ebf1ffa6] border-t cursor-pointer rounded-none"
                        variant="borderless"

                        value={searchText2}
                        onFocus={() => setDropdownVisible2(true)}


                    />


                    {dropdownVisible2 && (
                        <DropdownUser
                            helpData={helpData01}
                            setHelpData05={setHelpData01}
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


                <Descriptions.Item span={1.5} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">MÃ NHÂN VIÊN</span>}>
                    <Input
                        size="small"
                        className="w-full rounded-none  p-1 bg-slate-100 "
                        maxLength={350}
                        variant="borderless"
                        readOnly
                        value={dataSearch2 ? dataSearch2.EmpName : ''}

                    />

                </Descriptions.Item>




            </Descriptions>
        </div>
    )
}
