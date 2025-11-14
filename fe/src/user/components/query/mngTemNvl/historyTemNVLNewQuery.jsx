import { useState } from 'react'
import { Descriptions, Input, Select, DatePicker } from 'antd'
import { useTranslation } from 'react-i18next'
const { TextArea } = Input;

export default function HistoryTemNVLNewQuery({
    setFormDate,
    formDate,
    toDate,
    setToDate,
    QrCode,
    setQrCode,
    ItemName,
    setItemName,
    ItemNo,
    setItemNo,
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
    return (
        <div className=" container  border-r bg-white">
            <Descriptions
                size="small"
                bordered
                style={{ borderRadius: 0 }}
                column={2}
            >
                <Descriptions.Item style={{ padding: 0, width: 200 }} label={<span className="uppercase text-[9px]  text-red-500   p-2 font-bold">NGày tạo (*) </span>}>
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
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">Tên sản phẩm</span>}

                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
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
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                            value={ItemNo}
                            onChange={(e => setItemNo(e.target.value))}
                        />


                    </div>
                </Descriptions.Item>
                <Descriptions.Item
                    label={<span className="uppercase p-2 text-[9px] font-bold">QR Code</span>}
                    style={{ padding: 0 }}
                >
                    <Input
                        maxLength={350}
                        size="small"
                        variant="borderless"
                        className="w-full rounded-none  p-1 "

                        value={QrCode}
                        onChange={(e => setQrCode(e.target.value))}
                    />

                </Descriptions.Item>



            </Descriptions>

        </div>
    )
}
