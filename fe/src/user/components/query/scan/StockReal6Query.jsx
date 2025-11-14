import { useState, useEffect } from 'react'
import { ConfigProvider, Descriptions, Input, DatePicker, AutoComplete, Radio } from 'antd'
import { useTranslation } from 'react-i18next'
const { TextArea } = Input;
import dayjs from 'dayjs'
import DropdownWH from '../../sheet/query/dropdownWH';
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
import DropdownWHAuto from '../../sheet/query/dropdownWHAuto';
import DropdownEmpAuto from '../../sheet/query/dropdownEmpAuto';

dayjs.locale('vi')

export default function StockReal6Query({
    setFormDate,
    formDate,
    toDate,
    setToDate,
    helpData01,
    helpData02,
    helpData03,
    BizUnit,
    setBizUnit,
    searchText2,
    setSearchText2,
    setDataSearch2,
    setDataSheetSearch2,
    searchText3,
    setSearchText3,
    setDataSearch3,
    setDataSheetSearch3,
    StkMngNo,
    setStkMngNo,
    setHelpData03,
    IsChangedMst,
    setIsChangedMst
}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [dropdownVisible3, setDropdownVisible3] = useState(false)
    const langCode = localStorage.getItem('language')
    const [displayValue, setDisplayValue] = useState('All');
    const [displayValue2, setDisplayValue2] = useState('All');

    const handleSelect = (val) => {
        if (val === '') {
            setBizUnit('')
            setDisplayValue('All');
            return;
        }

        const selected = helpData01.find(o => o.BizUnit === val);
        if (selected) {
            setBizUnit(selected.BizUnit)
            setDisplayValue(selected.BizUnitName);
        }
    };

    const handleSelect2 = (val) => {
        if (!val || val === '') {
            setIsChangedMst('0')
            setDisplayValue2('All');
            return;
        }

        // Xử lý cả trường hợp val là string và object
        const value = typeof val === 'string' ? val : val.value;
        const label = typeof val === 'string' ?
            (val === '10' ? 'Kiểm kê theo số lượng tổng' :
                val === '11' ? 'Kiểm kê bao gồm lô hàng' : 'All') :
            val.label;

        setIsChangedMst(value || '0');
        setDisplayValue2(label || 'All');
    };

    const handleFormDate = (e) => {
        setFormDate(e)
    }

    const handleToDate = (e) => {
        setToDate(e)
    }

    return (
        <div className="w-full">
            <ConfigProvider>
                <div className="w-full">
                    <Descriptions
                        size="small"
                        bordered
                        style={{ borderRadius: 0 }}
                        column={1}
                        labelStyle={{
                            backgroundColor: '#fafafa',
                            fontWeight: 600,
                            fontSize: '10px',
                            padding: '4px 8px'
                        }}
                        contentStyle={{
                            padding: 0,
                            backgroundColor: 'white'
                        }}
                    >
                        <Descriptions.Item
                            label={
                                <span className="uppercase text-red-500 font-bold">
                                    Ngày yêu cầu (*)
                                </span>
                            }
                        >
                            <div className='flex items-center gap-2 px-2 py-1'>
                                <DatePicker
                                    size="small"
                                    className="w-full"
                                    placeholder="Từ ngày"
                                    value={formDate}
                                    variant="borderless"
                                    onChange={handleFormDate}
                                    format="DD/MM/YYYY"
                                />
                                <span className="text-gray-400">~</span>
                                <DatePicker
                                    size="small"
                                    className="w-full"
                                    placeholder="Đến ngày"
                                    value={toDate}
                                    variant="borderless"
                                    onChange={handleToDate}
                                    format="DD/MM/YYYY"
                                />
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="uppercase font-bold">
                                    Bộ phận kinh doanh
                                </span>
                            }
                        >
                            <div className="px-2 py-1">
                                <AutoComplete
                                    options={[
                                        { value: '', label: 'All' },
                                        ...helpData01.map(opt => ({
                                            value: opt.BizUnit,
                                            label: opt.BizUnitName
                                        }))
                                    ]}
                                    variant="borderless"
                                    value={displayValue}
                                    onSelect={handleSelect}
                                    className="w-full"
                                    size="small"
                                    placeholder="Chọn bộ phận kinh doanh"
                                />
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="uppercase font-bold">
                                    Kho kiểm kê
                                </span>
                            }
                        >
                            <div className="relative px-2 py-1">
                                <Input
                                    placeholder="Chọn kho kiểm kê"
                                    value={searchText2}
                                    variant="borderless"
                                    onFocus={() => setDropdownVisible2(true)}
                                    className="w-full cursor-pointer "
                                    size="small"
                                />
                                {dropdownVisible2 && (
                                    <DropdownWHAuto
                                        helpData={helpData02}
                                        setSearchText={setSearchText2}
                                        setDataSearch={setDataSearch2}
                                        setDropdownVisible={setDropdownVisible2}
                                        dropdownVisible={dropdownVisible2}
                                        searchText={searchText2}
                                        setDataSheetSearch={setDataSheetSearch2}
                                    />
                                )}
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="uppercase font-bold">
                                    Số kiểm tra
                                </span>
                            }
                        >
                            <div className="px-2 py-1">
                                <Input
                                    maxLength={350}
                                    size="small"
                                    variant="borderless"
                                    className="w-full"
                                    value={StkMngNo}
                                    onChange={(e) => setStkMngNo(e.target.value)}
                                    placeholder="Nhập số kiểm tra"
                                />
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="uppercase font-bold">
                                    Phân loại kiểm tra
                                </span>
                            }
                        >
                            <div className="px-2 py-1">
                                <AutoComplete
                                    options={[
                                        { value: '', label: 'All' },
                                        { value: '10', label: 'Kiểm kê theo số lượng tổng' },
                                        { value: '11', label: 'Kiểm kê bao gồm lô hàng' },
                                    ]}
                                    variant="borderless"
                                    value={displayValue2}
                                    onSelect={handleSelect2}
                                    className="w-full"
                                    size="small"
                                    placeholder="Chọn phân loại kiểm tra"
                                />
                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span className="uppercase font-bold">
                                    Người phụ trách
                                </span>
                            }
                        >
                            <div className="relative px-2 py-1">
                                <Input
                                    placeholder="Chọn người phụ trách"
                                    value={searchText3}
                                    variant="borderless"
                                    onFocus={() => setDropdownVisible3(true)}
                                    className="w-full cursor-pointer "
                                    size="small"
                                />
                                {dropdownVisible3 && (
                                    <DropdownEmpAuto
                                        helpData={helpData03}
                                        setHelpData={setHelpData03}
                                        setSearchText={setSearchText3}
                                        setDataSearch={setDataSearch3}
                                        setDropdownVisible={setDropdownVisible3}
                                        dropdownVisible={dropdownVisible3}
                                        searchText={searchText3}
                                        setDataSheetSearch={setDataSheetSearch3}
                                    />
                                )}
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </ConfigProvider>
        </div>
    )
}