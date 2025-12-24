import { useState, useCallback, useEffect, useRef } from 'react'
import { Form, Input, Row, Col, DatePicker, Descriptions, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'

export default function DailyAtt07BQuery({
    setFormDate,
    formDate

}) {
    const { t } = useTranslation()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)

    return (

        <div className=" container border-r">
            <Descriptions
                size="small"
                bordered
                style={{ borderRadius: 0 }}
                column={3}
            >
                <Descriptions.Item style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-2 font-bold">MỤC CHẤM CÔNG</span>}>

                    <Input
                        size="small"
                        className="w-full rounded-none  p-1 "
                        maxLength={350}
                        variant="borderless"


                    />
                </Descriptions.Item>





            </Descriptions>
        </div>
    )
}
