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
export default function CustomerRegistrationQuery({
    Owner,
    setOwner,

    CustName,
    setCustName,

    CustNo,
    setCustNo,

    BizNo,
    setBizNo



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


    return (
        <ConfigProvider locale={getAntdLocale()}>
            <div className=" container border-r">
                <Descriptions
                    size="small"
                    bordered
                    style={{ borderRadius: 0 }}
                    column={2}
                >





                    <Descriptions.Item span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Khách hàng</span>}>
                        <Input
                            size="small"
                            className="w-full rounded-none  p-1 "
                            maxLength={1000}
                            variant="borderless"
                            value={CustName}
                            onChange={(e) => setCustName(e.target.value)}

                        />

                    </Descriptions.Item>

                    <Descriptions.Item span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Mã số khách hàng</span>}>
                        <Input
                            size="small"
                            className="w-full rounded-none  p-1 "
                            maxLength={550}
                            variant="borderless"
                            value={CustNo}
                            onChange={(e) => setCustNo(e.target.value)}


                        />

                    </Descriptions.Item>

                    <Descriptions.Item span={1} style={{ padding: 0, }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Mã số kinh doanh </span>}>
                        <Input
                            size="small"
                            className="w-full rounded-none  p-1 "
                            maxLength={550}
                            variant="borderless"
                            value={BizNo}
                            onChange={(e) => setBizNo(e.target.value)}

                        />

                    </Descriptions.Item>
                    <Descriptions.Item span={1} style={{ padding: 0, }} label={<span className="uppercase text-[9px]  p-2  font-bold ">Người đại diện </span>}>
                        <Input
                            size="small"
                            className="w-full rounded-none  p-1 "
                            maxLength={550}
                            variant="borderless"
                            value={Owner}
                            onChange={(e) => setOwner(e.target.value)}

                        />

                    </Descriptions.Item>
                </Descriptions>
            </div>
        </ConfigProvider>
    )
}
