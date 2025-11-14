import { useState, useCallback, useEffect, useRef } from 'react'
import { ConfigProvider, AutoComplete, Input, Row, Col, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import DropdownDeptV2 from '../../../sheet/query/dropdownDeptV2'
import DropdownUser from '../../../sheet/query/dropdownUsers'
import Dropdown2006 from '../../../sheet/query/dropdown2006'
import Dropdown2005 from '../../../sheet/query/dropdown2005'
import Dropdown2004 from '../../../sheet/query/dropdown2004'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN';
import koKR from 'antd/lib/locale/ko_KR';

dayjs.locale('vi')
export default function DaMaterialListMoreQuery({
    setFormDate,
    formDate,
    toDate,
    setToDate,


    setSpec,
    spec,
    itemName,
    setItemName,
    itemNo,
    setItemNo,


}) {
    const { t } = useTranslation()
    const langCode = localStorage.getItem('language')



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
                    column={2}
                >
                    <Descriptions.Item span={2} style={{ padding: 0, }} label={<span className="uppercase text-[9px]  text-red-500    p-2 font-bold ">Ngày đăng ký</span>}>
                        <div className='flex items-center '>

                            <DatePicker
                                size="small"
                                variant="borderless"
                                className="w-full rounded-none  p-1 "
                                placeholder="Chọn ngày"
                                value={formDate}
                                onChange={handleFormDate}
                            />

                            ~

                            <DatePicker
                                size="small"
                                variant="borderless"
                                className="w-full rounded-none  p-1 "
                                placeholder="Chọn ngày"
                                value={toDate}
                                onChange={handleToDate}
                            />
                        </div>
                    </Descriptions.Item>


                    <Descriptions.Item span={2} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Tên sản phẩm</span>}>
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
