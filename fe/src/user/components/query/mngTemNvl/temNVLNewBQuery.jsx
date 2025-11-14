import { useState } from 'react'
import { Descriptions, Input } from 'antd'
import { useTranslation } from 'react-i18next'
const { TextArea } = Input;
import TempFileHelpQuery from '../../sheet/query/tempFileQuery';
export default function TemNVLNewBQuery({
    helpData01,
    setSearchText,
    searchText,
    setDataSearch,

}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)

    return (
        <div className=" w-full border-t">
            <Descriptions
                size="small"
                bordered
                style={{ borderRadius: 0 }}
                column={3}
            >
                <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-2 font-bold">Tên sản phẩm</span>}>
                    <Input
                        maxLength={250}
                        size="small"
                        variant="borderless"
                        className="w-full rounded-none  p-1 "
                    />
                </Descriptions.Item>

                <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold">Nhà cung cấp</span>}>
                    <Input
                        maxLength={250}
                        size="small"
                        variant="borderless"
                        className="w-full rounded-none  p-1 "
                    />
                </Descriptions.Item>

                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">Loại bao in</span>}

                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            size="small"
                            className="w-full p-1 bg-[#ebf1ff] border-t cursor-pointer rounded-none"
                            onFocus={() => setDropdownVisible(true)}
                            variant="borderless"
                            maxLength={300}
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
                        />


                    </div>
                </Descriptions.Item>


                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">Màu sắc</span>}

                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                        />


                    </div>
                </Descriptions.Item>
                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">Spec</span>}
                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                        />


                    </div>
                </Descriptions.Item>
                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">Số lượng</span>}
                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                        />


                    </div>
                </Descriptions.Item>

                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">LotNo</span>}
                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                        />


                    </div>
                </Descriptions.Item>
                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">Ngày nhập kho</span>}
                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                        />


                    </div>
                </Descriptions.Item>

                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">Ngày sản xuất</span>}
                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                        />


                    </div>
                </Descriptions.Item>

                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold">Số bao in</span>}
                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            className="w-full rounded-none  p-1 "
                        />


                    </div>
                </Descriptions.Item>


                <Descriptions.Item
                    label={<span className="uppercase  p-2 text-[9px]  font-bold text-red-400">FILE IN TEM NVL (*)</span>}
                    style={{ padding: 0 }}
                >
                    <div className="relative">
                        <Input
                            maxLength={250}
                            size="small"
                            variant="borderless"
                            onFocus={() => setDropdownVisible(true)}
                            value={searchText}
                            className="w-full p-1 bg-[#ebf1ff] border-t cursor-pointer rounded-none"
                        />
                        {dropdownVisible && (
                            <TempFileHelpQuery
                                helpData={helpData01}
                                setSearchText={setSearchText}
                                searchText={searchText}
                                setDataSearch={setDataSearch}
                                setDropdownVisible={setDropdownVisible}
                                dropdownVisible={dropdownVisible}
                            />
                        )}

                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
}
