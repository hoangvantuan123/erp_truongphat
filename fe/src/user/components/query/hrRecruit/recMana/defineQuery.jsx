
import { Button, Form, Input, Row, Col, Select, Popover } from 'antd'

export default function DefineQuery({
    dataType
}) {
    return (
        <div className="flex items-center gap-2">
            <Form >
                <Row className="gap-4 flex items-center">
                    <Col>
                        <Form.Item
                            label={
                                <span className="uppercase text-[9px]">Định nghĩa</span>
                            }
                            style={{ marginBottom: 0 }}
                            labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                            rules={[{ required: true, message: '' }]}
                            wrapperCol={{ style: { padding: 0 } }}
                            className="w-[350px]"
                        >
                            <Input type="text" value={dataType[0]?.DefineName} readOnly />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </div>
    )
}