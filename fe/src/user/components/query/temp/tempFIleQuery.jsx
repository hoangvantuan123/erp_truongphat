
import { Button, Form, Input, Row, Col, Descriptions, Popover } from 'antd'

export default function TempFileQuery({
    dataType
}) {
    return (
        <div className=" w-full">
            <Descriptions
                size="small"
                bordered
                style={{ borderRadius: 0 }}
                column={4}
            >
                <Descriptions.Item  span={1} style={{ padding: 0 }} label={<span className="uppercase text-[9px]     p-2 font-bold">NHÓM FILE</span>}>
                    <Input
                        value={dataType[0]?.GroupsName} readOnly
                        size="small"
                        bordered={false}
                        className="w-full rounded-none  p-1 "
                    />
                </Descriptions.Item>



            </Descriptions>
        </div>
    )
}