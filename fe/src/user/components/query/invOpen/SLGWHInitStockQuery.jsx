import { useState, useCallback, useEffect, useRef } from 'react'
import { ConfigProvider, AutoComplete, Input, Row, Col, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import DropdownDeptV2 from '../../sheet/query/dropdownDeptV2'
import DropdownUser from '../../sheet/query/dropdownUsers'
import Dropdown2006 from '../../sheet/query/dropdown2006'
import Dropdown2005 from '../../sheet/query/dropdown2005'
import Dropdown2004 from '../../sheet/query/dropdown2004'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';

dayjs.locale('vi')
export default function SLGWHInitStockQuery({
    setFormDate,
    formDate,
    toDate,
    setToDate,

    PtSeq,
    setPtSeq,
    PuSeq,
    setPuSeq,
    helpData01,
    setHelpData01,
    helpData02,
    helpData03,
    helpData04,
    helpData05,
    helpData06,
    helpData07,
    helpData08,

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
    dataSearch2,


    setDataSearch3,
    setSearchText3,
    searchText3,
    setItemText3,


    setDataSearch4,
    setSearchText4,
    searchText4,
    setItemText4,



    setDataSearch5,
    setSearchText5,
    searchText5,
    setItemText5,

    setSpec,
    spec,
    itemName,
    setItemName,
    itemNo,
    setItemNo,
    AssetSeq,
    setAssetSeq

}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [dropdownVisible3, setDropdownVisible3] = useState(false)
    const [dropdownVisible4, setDropdownVisible4] = useState(false)
    const [dropdownVisible5, setDropdownVisible5] = useState(false)
    const langCode = localStorage.getItem('language')

    const [displayValue, setDisplayValue] = useState(helpData03[0]?.MinorName || '');
    const handleSelect = (val) => {
        if (val === '') {
            setAssetSeq('')
            setDisplayValue('All'); // hiển thị "All"
            return;
        }

        const selected = helpData03.find(o => o.Value === val);
        if (selected) {
            setAssetSeq(selected.Value);
            setDisplayValue(selected.MinorName);
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

                    <Descriptions.Item span={1.5} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Phân loại danh mục hàng</span>}>
                        <AutoComplete
                            options={[
                                { value: '', label: 'All' },
                                ...helpData03.map(opt => ({
                                    value: opt.Value,
                                    label: opt.MinorName
                                }))
                            ]}
                            value={displayValue}
                            onSelect={handleSelect}
                            popupMatchSelectWidth={500}
                            variant="borderless"
                            className="w-full p-1  cursor-pointer rounded-none"
                        />
                    </Descriptions.Item>


                    <Descriptions.Item span={1.5} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Phân loại nhỏ danh mục SP</span>}>
                        <Input
                            placeholder=""
                            value={searchText5}
                            onFocus={() => setDropdownVisible5(true)}
                            variant="borderless"
                            className="w-full p-1 bg-[#ebf1ffa6] border-t cursor-pointer rounded-none"
                        />
                        {dropdownVisible5 && (
                            <Dropdown2004
                                helpData={helpData06}
                                setSearchText={setSearchText5}
                                setItemText={setItemText5}
                                setDataSearch={setDataSearch5}
                                setDropdownVisible={setDropdownVisible5}
                                dropdownVisible={dropdownVisible5}
                                searchText={searchText5}

                            />
                        )}

                    </Descriptions.Item>







                    <Descriptions.Item span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Tên sản phẩm</span>}>
                        <Input
                            size="small"
                            className="w-full rounded-none  p-1 "
                            maxLength={550}
                            variant="borderless"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />

                    </Descriptions.Item>

                    <Descriptions.Item span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Mã sản phẩm</span>}>
                        <Input
                            size="small"
                            className="w-full rounded-none  p-1 "
                            maxLength={550}
                            variant="borderless"
                            value={itemNo}
                            onChange={(e) => setItemNo(e.target.value)}

                        />

                    </Descriptions.Item>

                    <Descriptions.Item span={1} style={{ padding: 0, }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Quy cách </span>}>
                        <Input
                            size="small"
                            className="w-full rounded-none  p-1 "
                            maxLength={550}
                            variant="borderless"
                            value={spec}
                            onChange={(e) => setSpec(e.target.value)}

                        />

                    </Descriptions.Item>
                </Descriptions>
            </div>
        </ConfigProvider>
    )
}
