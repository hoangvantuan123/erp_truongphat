import { useState, useEffect } from 'react'
import { ConfigProvider, Descriptions, Input, DatePicker, AutoComplete, Radio } from 'antd'
import { useTranslation } from 'react-i18next'
const { TextArea } = Input;
import DropdownCust from '../../sheet/query/dropdownCust';
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';
dayjs.locale('vi')
export default function TemNVLUsedQuery({
    helpData01,
    setSearchText,
    searchText,
    setDataSearch,


    setFormDate,
    formDate,
    toDate,
    setToDate,

    LotNo,
    setLotNo,
    ItemName,
    setItemName,
    ItemNo,
    setItemNo,


    helpData02,
    setDataSearch3,
    setSearchText3,
    searchText3,
    setItemText3,
    setDataSheetSearch3,
    helpData03,
    setBagType,
    QrCode,
    setQrCode,
    setDisplayValue2,
    displayValue2,
    QrCodeNew,
    setQrCodeNew

}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible3, setDropdownVisible3] = useState(false)
    const langCode = localStorage.getItem('language')

    const [displayValue, setDisplayValue] = useState('All');
    const handleSelect = (val) => {
        if (val === '') {
            setBagType('')
            setDisplayValue('All'); // hiển thị "All"
            return;
        }

        const selected = helpData03.find(o => o.id === val);
        if (selected) {
            setBagType(selected.id);
            setDisplayValue(selected.description);
        }
    };
    useEffect(() => {
        if (helpData01 && helpData01.length > 0) {
            setSearchText(helpData01[0].OriginalName || '');
            setDataSearch(helpData01[0]);
        } else {
            setSearchText('');
            setDataSearch(null);
        }
    }, [helpData01]);
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
        <div className=" w-full">
            <ConfigProvider locale={getAntdLocale()}>
                <div className=" w-full">
                    <Descriptions
                        size="small"
                        bordered
                        style={{ borderRadius: 0 }}
                        column={2}
                    >
                        <Descriptions.Item style={{ padding: 0, width: 200 }} label={<span className="uppercase text-[9px]  text-red-500   p-2 font-bold">NGày sản xuất (*) </span>}>
                            <div className='flex w-[400px] items-center '>

                                <DatePicker
                                    size="small"
                                    variant="borderless"
                                    className="w-[200px] rounded-none  p-1 "
                                    placeholder="Chọn ngày"
                                    value={formDate}
                                    onChange={handleFormDate}
                                />

                                ~

                                <DatePicker
                                    size="small"
                                    variant="borderless"
                                    className="w-[200px] rounded-none  p-1 "
                                    placeholder="Chọn ngày"
                                    value={toDate}
                                    onChange={handleToDate}
                                />
                            </div>
                        </Descriptions.Item>


                        <Descriptions.Item

                            label={<span className="uppercase  p-2 text-[9px]  font-bold">Nhà cung cấp</span>}

                            style={{ padding: 0 }}
                        >
                            <div className="relative">
                                <Input
                                    placeholder=""
                                    value={searchText3}
                                    onFocus={() => setDropdownVisible3(true)}
                                    variant="borderless"
                                    className="w-full p-1 bg-[#ebf1ff] border-t cursor-pointer rounded-none"
                                />
                                {dropdownVisible3 && (
                                    <DropdownCust
                                        helpData={helpData02}
                                        setSearchText={setSearchText3}
                                        setItemText={setItemText3}
                                        setDataSearch={setDataSearch3}
                                        setDropdownVisible={setDropdownVisible3}
                                        dropdownVisible={dropdownVisible3}
                                        searchText={searchText3}
                                        setDataSheetSearch={setDataSheetSearch3}

                                    />
                                )}

                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="uppercase  p-2 text-[9px]  font-bold">Lot No</span>}
                            style={{ padding: 0 }}
                        >
                            <div className="relative">
                                <Input
                                    maxLength={350}
                                    size="small"

                                    value={LotNo}
                                    onChange={(e => setLotNo(e.target.value))}
                                    variant="borderless"
                                    className="w-full rounded-none  p-1 "
                                />


                            </div>
                        </Descriptions.Item>


                        <Descriptions.Item
                            label={<span className="uppercase  p-2 text-[9px]  font-bold">Tên sản phẩm</span>}

                            style={{ padding: 0 }}
                        >
                            <div className="relative">
                                <Input
                                    maxLength={350}
                                    size="small"
                                    variant="borderless"
                                    className="w-full rounded-none  p-1 "


                                    value={ItemName}
                                    onChange={(e => setItemName(e.target.value))}
                                />


                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="uppercase  p-2 text-[9px]  font-bold">Mã sản phẩm</span>}
                            style={{ padding: 0 }}
                        >
                            <div className="relative">
                                <Input
                                    maxLength={350}
                                    size="small"
                                    variant="borderless"
                                    className="w-full rounded-none  p-1 "


                                    value={ItemNo}
                                    onChange={(e => setItemNo(e.target.value))}
                                />


                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="uppercase  p-2 text-[9px]  font-bold">Loại bao in</span>}
                            style={{ padding: 0 }}
                        >
                            <div className="relative">
                                <AutoComplete
                                    options={[
                                        { value: '', label: 'All' },
                                        ...helpData03.map(opt => ({
                                            value: opt.id,
                                            label: opt.description
                                        }))
                                    ]}
                                    value={displayValue}
                                    onSelect={handleSelect}
                                    popupMatchSelectWidth={500}
                                    variant="borderless"
                                    className="w-full p-1  cursor-pointer rounded-none"
                                />
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="uppercase  p-2 text-[9px]  font-bold">QR Code cũ</span>}
                            style={{ padding: 0 }}
                        >
                            <div className="relative">
                                <Input
                                    maxLength={350}
                                    size="small"
                                    variant="borderless"
                                    className="w-full rounded-none  p-1 "


                                    value={QrCode}
                                    onChange={(e => setQrCode(e.target.value))}
                                />


                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="uppercase  p-2 text-[9px]  font-bold">QR Code mới</span>}
                            style={{ padding: 0 }}
                        >
                            <div className="relative">
                                <Input
                                    maxLength={350}
                                    size="small"
                                    variant="borderless"
                                    className="w-full rounded-none  p-1 "


                                    value={QrCodeNew}
                                    onChange={(e => setQrCodeNew(e.target.value))}
                                />


                            </div>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={<span className="uppercase  p-2 text-[9px]  font-bold text-red-500 ">Kiểu in (*)</span>}
                            style={{ padding: 0 }}
                        >
                            <Radio.Group

                                value={displayValue2}
                                onChange={(e) => setDisplayValue2(e.target.value)}
                                className="w-full rounded-none p-1"
                            >
                                <Radio value="1">Tem Label</Radio>
                                <Radio value="2">Tem A4</Radio>
                            </Radio.Group>
                        </Descriptions.Item>

                    </Descriptions>
                </div>
            </ConfigProvider>
        </div>
    )
}
