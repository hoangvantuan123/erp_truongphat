import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Input,
    Modal,
    Typography,
    Form,
    Select,
    Button,
    Card,
    Divider,
    Space,
    Switch,
    Checkbox,
    Drawer,
    Radio,
    message,
    InputNumber,
    Alert,
    Spin,
    Row,
    Col,
} from 'antd'

const { Title } = Typography
const { Option } = Select

export default function DrawerPrint({
    isOpenPrint,
    onClose,
    menus,
}) {
    const { t } = useTranslation()


    return (
        <Drawer
            title={<Title level={5}></Title>}
            open={isOpenPrint}
            closable={false}
            width={800}

        >

        </Drawer>
    )
}
