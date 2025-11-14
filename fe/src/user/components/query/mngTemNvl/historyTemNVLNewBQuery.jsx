import { useState } from 'react'
import { Descriptions, Input } from 'antd'
import { useTranslation } from 'react-i18next'
const { TextArea } = Input;

export default function HistoryTemNVLNewBQuery({

}) {
    const { t } = useTranslation()

    return (
        <div className=" w-full">

            <Descriptions
                size="small"
                bordered
                style={{ borderRadius: 0 }}
                column={4}
            >


            
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


            </Descriptions>
        </div>
    )
}
