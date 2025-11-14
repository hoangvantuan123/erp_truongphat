import { useTranslation } from 'react-i18next'
import { Button, Form, Input, Row, Col } from 'antd'
import { useState } from 'react'
import {
    Tag,
    BadgeDollarSign,
    Building2,
    Layers,
    ListOrdered,
    UserCheck,
} from "lucide-react";

export default function HrEmplnSeq2Query({ dataSearch }) {
    const { t } = useTranslation()

    const itemStyle = { marginBottom: 8 }
    const DisplayText = ({ value }) => (
        <span className={value ? "text-black" : "text-gray-400"}>
            {value || '—'}
        </span>
    );
    return (


        <div className="flex gap-4 p-2 h-full flex-col">
            <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase" >
                Thông tin cơ bản
            </h2>
            <Form layout="vertical" variant="filled" style={{ width: '100%' }}>
                <Form.Item
                    label={
                        <span className="uppercase text-[10px] flex items-center gap-1">
                            <Tag size={14} className="text-gray-500" />
                            {t('Cấp bậc')}
                        </span>
                    }
                    style={{ marginBottom: 0 }}
                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                    wrapperCol={{ style: { padding: 0 } }}
                >
                    <DisplayText value={dataSearch?.Level} Icon={Tag} />
                </Form.Item>

                <Form.Item
                    label={
                        <span className="uppercase text-[10px] flex items-center gap-1">
                            <BadgeDollarSign size={14} className="text-gray-500" />
                            {t('Tiền lương')}
                        </span>
                    }
                    style={{ marginBottom: 0 }}
                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                    wrapperCol={{ style: { padding: 0 } }}
                >
                    <DisplayText value={dataSearch?.SalaryStep} Icon={BadgeDollarSign} />
                </Form.Item>

                <Form.Item
                    label={
                        <span className="uppercase text-[10px] flex items-center gap-1">
                            <Building2 size={14} className="text-gray-500" />
                            {t('Part')}
                        </span>
                    }
                    style={{ marginBottom: 0 }}
                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                    wrapperCol={{ style: { padding: 0 } }}
                >
                    <DisplayText value={dataSearch?.Part} Icon={Building2} />
                </Form.Item>

                <Form.Item
                    label={
                        <span className="uppercase text-[10px] flex items-center gap-1">
                            <Layers size={14} className="text-gray-500" />
                            {t('Section')}
                        </span>
                    }
                    style={{ marginBottom: 0 }}
                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                    wrapperCol={{ style: { padding: 0 } }}
                >
                    <DisplayText value={dataSearch?.Section} Icon={Layers} />
                </Form.Item>

                <Form.Item
                    label={
                        <span className="uppercase text-[10px] flex items-center gap-1">
                            <ListOrdered size={14} className="text-gray-500" />
                            {t('Hình thái lương')}
                        </span>
                    }
                    style={{ marginBottom: 0 }}
                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                    wrapperCol={{ style: { padding: 0 } }}
                >
                    <DisplayText value={dataSearch?.SalaryType} Icon={ListOrdered} />
                </Form.Item>

                <Form.Item
                    label={
                        <span className="uppercase text-[10px] flex items-center gap-1">
                            <UserCheck size={14} className="text-gray-500" />
                            {t('Trạng thái làm việc')}
                        </span>
                    }
                    style={{ marginBottom: 0 }}
                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                    wrapperCol={{ style: { padding: 0 } }}
                >
                    <DisplayText value={dataSearch?.WorkStatus} Icon={UserCheck} />
                </Form.Item>

                <Form.Item
                    label={
                        <span className="uppercase text-[10px] flex items-center gap-1">
                            <BadgeDollarSign size={14} className="text-gray-500" />
                            {t('Nhóm lương')}
                        </span>
                    }
                    style={{ marginBottom: 0 }}
                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                    wrapperCol={{ style: { padding: 0 } }}
                >
                    <DisplayText value={dataSearch?.SalaryGroup} Icon={BadgeDollarSign} />
                </Form.Item>
            </Form>

        </div>


    )
}
