import { useState, useCallback, useEffect, useRef } from 'react'
import { ConfigProvider, AutoComplete, Input, Row, Col, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import DropdownDeptV2 from '../../../sheet/query/dropdownDeptV2'
import DropdownUser from '../../../sheet/query/dropdownUsers'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';

dayjs.locale('vi')
export default function DailyAtt08Query({
    setFormDate,
    formDate,

    PtSeq,
    setPtSeq,
    PuSeq,
    setPuSeq,
    helpData01,
    setHelpData01,
    helpData02,
    helpData03,
    helpData04,

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
    dataSearch2
}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const langCode = localStorage.getItem('language')

    const [displayValue, setDisplayValue] = useState(helpData01[0]?.PuName || '');
    const [displayValue2, setDisplayValue2] = useState(helpData02[0]?.PtName || '');
    const handleSelect = (val) => {
        if (val === '') {
            setPuSeq('');           // lưu chuỗi rỗng
            setDisplayValue('All'); // hiển thị "All"
            return;
        }

        const selected = helpData01.find(o => o.PuSeq === val);
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

        const selected = helpData02.find(o => o.PtSeq === val);
        if (selected) {
            setPtSeq(selected.PtSeq);
            setDisplayValue2(selected.PtName);
        }
    };
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
    const handleFormDate = (e) => {
        setFormDate(e)
    }

    return (
        <ConfigProvider locale={getAntdLocale()}>
            <div className=" container border-r">
                <Descriptions
                    size="small"
                    bordered
                    style={{ borderRadius: 0 }}
                    column={3}
                >
                    <Descriptions.Item span={1} style={{ padding: 0, width: 120 }} label={<span className="uppercase text-[9px]  text-red-500    p-2 font-bold">Năm tháng tiêu chuẩn (*)</span>}>

                        <DatePicker
                            size="small"
                            picker="month"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                            placeholder="Chọn ngày"
                            value={formDate}
                            onChange={handleFormDate}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item span={1} style={{ padding: 0, width: 120 }} label={<span className="uppercase text-[9px]  p-2  font-bold">NHÓM LƯƠNG</span>}>
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

                    <Descriptions.Item span={1} style={{ padding: 0, width: 120 }} label={<span className="uppercase  text-[9px]  p-2  font-bold">HÌNH THÁI LƯƠNG</span>}>
                        <AutoComplete
                            options={[
                                { value: '', label: 'All' },
                                ...helpData02.map(opt => ({
                                    value: opt.PtSeq,
                                    label: opt.PtName
                                }))
                            ]}
                            value={displayValue2}
                            onSelect={handleSelect2}
                            variant="borderless"
                            className="w-full p-1   bg-[#ebf1ffa6] cursor-pointer rounded-none"
                        />
                    </Descriptions.Item>

                    <Descriptions.Item span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Thuộc Bộ phận</span>}>
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



                    <Descriptions.Item span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">HỌ TÊN NHÂN VIÊN</span>}>
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


                    <Descriptions.Item span={1} style={{ padding: 0, width: 120 }} label={<span className="uppercase text-[9px]  p-2  font-bold">MÃ NHÂN VIÊN</span>}>
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
        </ConfigProvider>
    )
}
