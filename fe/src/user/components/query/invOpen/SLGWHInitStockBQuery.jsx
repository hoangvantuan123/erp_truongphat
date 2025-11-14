import { useState, useCallback, useEffect, useRef } from 'react'
import { ConfigProvider, AutoComplete, Input, Row, Col, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'

import DropdownWH from '../../sheet/query/dropdownWH'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';

dayjs.locale('vi')
export default function SLGWHInitStockBQuery({
    setFormDate,
    formDate,
    toDate,
    setToDate,


    helpData03,

    helpData06,


    setDataSearch4,
    setSearchText4,
    searchText4,
    setItemText4,

    setDataSearch5,
    setSearchText5,
    searchText5,
    setItemText5,
    setAssetSeq,
    helpData05,
    setHelpData09,
    helpData09,
    setBizUnit

}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [dropdownVisible3, setDropdownVisible3] = useState(false)
    const [dropdownVisible4, setDropdownVisible4] = useState(false)
    const [dropdownVisible5, setDropdownVisible5] = useState(false)
    const langCode = localStorage.getItem('language')
    const [displayValue, setDisplayValue] = useState(helpData05[0]?.BizUnitName || '');
    const handleSelect = (val) => {
        if (val === '') {
            setBizUnit(null)
            setDisplayValue('All'); // hiển thị "All"
            return;
        }

        const selected = helpData05.find(o => o.BizUnit === val);
        if (selected) {
            setBizUnit(selected.BizUnit);
            setDisplayValue(selected.BizUnitName);
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
    const handleToDate = (e) => {
        setToDate(e)
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

                    <Descriptions.Item style={{ padding: 0, width: 160 }} label={<span className="uppercase text-[9px]  text-red-500     p-2 font-bold ">Năm tháng tồn kho</span>}>
                        <div className='flex items-center '>

                            <DatePicker
                                size="small"
                                picker="month"
                                variant="borderless"
                                className="w-full rounded-none  p-1 "
                                placeholder="Chọn ngày"
                                value={formDate}
                                onChange={handleFormDate}
                            />


                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ padding: 0, width: 160 }} label={<span className="uppercase text-[9px]  p-2 text-red-500   font-bold ">Bộ phận kinh doanh</span>}>
                        <AutoComplete
                            options={[
                                ...helpData05.map(opt => ({
                                    value: opt.BizUnit,
                                    label: opt.BizUnitName
                                }))
                            ]}
                            value={displayValue}
                            onSelect={handleSelect}
                            popupMatchSelectWidth={500}
                            variant="borderless"
                            className="w-full p-1  cursor-pointer rounded-none"
                        />
                    </Descriptions.Item>


                    <Descriptions.Item style={{ padding: 0, width: 160 }} label={<span className="uppercase text-[9px]  text-red-500  p-2  font-bold ">Kho</span>}>
                        <Input
                            placeholder=""
                            value={searchText4}
                            onFocus={() => setDropdownVisible4(true)}
                            variant="borderless"
                            className="w-full p-1 bg-[#ebf1ffa6] border-t cursor-pointer rounded-none"
                        />
                        {dropdownVisible4 && (
                            <DropdownWH
                                helpData={helpData09}
                                setSearchText={setSearchText4}
                                setItemText={setItemText4}
                                setDataSearch={setDataSearch4}
                                setDropdownVisible={setDropdownVisible4}
                                dropdownVisible={dropdownVisible4}
                                searchText={searchText4}

                            />
                        )}

                    </Descriptions.Item>







                </Descriptions>
            </div>
        </ConfigProvider>
    )
}
