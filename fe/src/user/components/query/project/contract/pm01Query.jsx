import { useState, useEffect } from 'react'
import { ConfigProvider, Form, Input, Col, Space, DatePicker, Descriptions, AutoComplete } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import DropdownCust from '../../../sheet/query/dropdownCust'
import DropdownDeptV2 from '../../../sheet/query/dropdownDeptV2'
import DropdownUser from '../../../sheet/query/dropdownUsers'
const { TextArea } = Input;
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
dayjs.locale('vi')
export default function PM01Query({
    setFormDate,
    formDate,
    toDate,
    setToDate,
    helpData01,
    helpData02,
    helpData03,
    helpData04,
    helpData05,
    BizUnit,
    setBizUnit,
    setUMSupplyContType,
    SupplyContName,
    setSupplyContName,
    SupplyContNo,
    setSupplyContNo,


    setDataSearch3,
    setSearchText3,
    searchText3,
    setItemText3,
    setDataSheetSearch3,


    setDataSearch2,
    setSearchText2,
    searchText2,
    setItemText2,
    setDataSheetSearch2,


    setDataSearch,
    setSearchText,
    searchText,
    setItemText,
    setDataSheetSearch,
    setHelpData05,
    setSearchText1,
    setItemText1,
    setDataSearch1,
    RegDate,
    setRegDate,
    Remark,
    setRemark,
    setDisplayValue,
    displayValue


}) {
    const { t } = useTranslation()
    const langCode = localStorage.getItem('language')

    const [displayValue2, setDisplayValue2] = useState('All');
    const [dropdownVisible3, setDropdownVisible3] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const getBizUnitName = (bizUnit) => {
        const found = helpData01.find(o => o.BizUnit === bizUnit);
        return found ? found.BizUnitName : '';
    };

    useEffect(() => {
        if (!BizUnit) {
            return;
        }

     
        if (displayValue && displayValue.trim() !== '') {
            return;
        }

        const name = getBizUnitName(BizUnit);
        if (name) {
            setDisplayValue(name);
        }
    }, [BizUnit, helpData01]);


    const handleSelect = (val) => {
        if (val === '') {
            setDisplayValue('');
            setBizUnit('')
            return;
        }

        const selected = helpData01.find(o => o.BizUnit === val);
        if (selected) {
            setBizUnit(selected.BizUnit)
            setDisplayValue(selected.BizUnitName);
        }
    };
    const handleSelect2 = (val) => {
        if (val === '') {
            setUMSupplyContType('')
            setDisplayValue2(''); // hiển thị "All"
            return;
        }

        const selected = helpData02.find(o => o.Value === val);
        if (selected) {
            setUMSupplyContType(selected.Value)
            setDisplayValue2(selected.MinorName);
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
    return (
        <ConfigProvider locale={getAntdLocale()}>
            <div className=" container border-r">



                <Descriptions
                    size="small"
                    bordered
                    style={{ borderRadius: 0 }}
                    column={3}
                >
                    <Descriptions.Item span={2} style={{ padding: 0 }} label={<span className="uppercase text-[9px] text-red-500     p-1 font-bold">Tên hợp đồng (*)</span>}>
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                            value={SupplyContName}
                            onChange={(e) => setSupplyContName(e.target.value)}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-1 font-bold">Số hợp đồng</span>}>
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            readOnly
                            className="w-full rounded-none  p-1 "
                            value={SupplyContNo}
                        />
                    </Descriptions.Item>




                    <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase  p-1 text-[9px]  font-bold text-red-500 ">Bộ phận kinh doanh (*)</span>}>
                        <AutoComplete
                            options={[
                                ...helpData01.map(opt => ({
                                    value: opt.BizUnit,
                                    label: opt.BizUnitName
                                }))
                            ]}
                            value={displayValue}
                            onSelect={handleSelect}
                            variant="borderless"
                            className=" w-full rounded-none bg-[#ebf1ff] "
                        />


                    </Descriptions.Item>



                    <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]    text-red-500  p-1 font-bold">Khách hàng (*)</span>}>
                        <Input
                            placeholder=""
                            value={searchText3}
                            onFocus={() => setDropdownVisible3(true)}
                            variant="borderless"
                            className="w-full bg-[#ebf1ff] border-t cursor-pointer rounded-none"
                        />
                        {dropdownVisible3 && (
                            <DropdownCust
                                helpData={helpData03}
                                setSearchText={setSearchText3}
                                setItemText={setItemText3}
                                setDataSearch={setDataSearch3}
                                setDropdownVisible={setDropdownVisible3}
                                dropdownVisible={dropdownVisible3}
                                searchText={searchText3}
                                setDataSheetSearch={setDataSheetSearch3}

                            />
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-1 font-bold text-red-500">Bộ phận phụ trách (*)</span>}>
                        <Input
                            placeholder=""
                            value={searchText2}
                            onFocus={() => setDropdownVisible2(true)}
                            variant="borderless"
                            className="w-full bg-[#ebf1ff] border-t cursor-pointer rounded-none"
                        />
                        {dropdownVisible2 && (
                            <DropdownDeptV2
                                helpData={helpData04}
                                setSearchText={setSearchText2}
                                setItemText={setItemText2}
                                setDataSearch={setDataSearch2}
                                setDropdownVisible={setDropdownVisible2}
                                dropdownVisible={dropdownVisible2}
                                searchText={searchText2}
                                setDataSheetSearch={setDataSheetSearch2}

                            />
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-1 font-bold text-red-500">Người phụ trách (*)</span>}>
                        <Input
                            placeholder=""
                            value={searchText}
                            onFocus={() => setDropdownVisible(true)}
                            variant="borderless"
                            className="w-full bg-[#ebf1ff] border-t cursor-pointer rounded-none"
                        />
                        {dropdownVisible && (
                            <DropdownUser
                                helpData={helpData05}
                                setHelpData05={setHelpData05}
                                setSearchText={setSearchText}
                                setSearchText1={setSearchText1}
                                setItemText={setItemText}
                                setItemText1={setItemText1}
                                setDataSearch={setDataSearch}
                                setDataSearchDept={setDataSearch1}
                                setDataSheetSearch={setDataSheetSearch}
                                setDropdownVisible={setDropdownVisible}
                                dropdownVisible={dropdownVisible}
                                searchText={searchText}

                            />
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase   p-1 text-[9px]  font-bold  ">Thời hạn hợp đồng</span>}>
                        <div className='flex items-center'>

                            <DatePicker
                                size="small"
                                variant="borderless"
                                className="w-full rounded-none  p-1 "
                                placeholder="Chọn ngày"
                                value={formDate}
                                onChange={(value) => setFormDate(value)}
                            />
                            ~
                            <DatePicker
                                size="small"
                                variant="borderless"
                                className="w-full rounded-none  p-1 "
                                placeholder="Chọn ngày"
                                value={toDate}
                                onChange={(value) => setToDate(value)}
                            />
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase   p-1 text-[9px]  font-bold  text-red-500 ">Ngày ký hợp đồng (*)</span>}>
                        <div className='flex items-center'>

                            <DatePicker
                                size="small"
                                variant="borderless"
                                className="w-full rounded-none  p-1 "
                                placeholder="Chọn ngày"
                                value={RegDate}
                                onChange={(value) => setRegDate(value)}
                            />

                        </div>
                    </Descriptions.Item>


                    <Descriptions.Item span={4} style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-1 font-bold">Ghi chú</span>}>
                        <TextArea
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                            maxLength={1200}
                            rows={2}
                            style={{
                                width: '100%',
                                resize: 'none',
                                backgroundColor: 'transparent',
                                padding: 2,
                            }}
                            value={Remark}
                            onChange={(e) => setRemark(e.target.value)}



                        />
                    </Descriptions.Item>


                </Descriptions>
            </div>
        </ConfigProvider>
    )
}
