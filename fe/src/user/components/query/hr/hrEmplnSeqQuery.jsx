import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Space, DatePicker, Select, Upload, Image, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor
} from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import DropdownUser from '../../sheet/query/dropdownUsers'
import DropdownDept from '../../sheet/query/dropdownDept'

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })

export default function HrEmplnSeqQuery({
    helpData01,
    helpData02,
    searchText,
    setSearchText,
    setSearchText1,
    searchText1,
    setItemText,
    setDataSearch,
    dataSearch,
    setDataSearch1,
    setDataSheetSearch,
    setItemText1,
    setHelpData02,
    setDataSheetSearch1,
    helpData08,
    CoNm, setCoNm
}) {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownVisible2, setDropdownVisible2] = useState(false)
    const [fileList, setFileList] = useState([])
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const { t } = useTranslation()

    const handleCancel = () => setPreviewVisible(false)

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf('/') + 1))
    }

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

    return (
        <div className="flex gap-4 mt-2">
            <Row gutter={16} style={{ width: '100%' }}>
                <Col flex="auto">
                    <Form  variant="filled">
                        <Row gutter={[16, 8]}>
                            <Col span={4}>
                                <Form.Item
                                    label={<span className="uppercase text-[9px]">{t('Nhân viên')}</span>}
                                    style={{ marginBottom: 0 }}
                                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                    wrapperCol={{ style: { padding: 0 } }}
                                >
                                    <Input
                                        placeholder=""
                                        className="w-full"
                                        size="middle"
                                        value={searchText}
                                        onFocus={() => setDropdownVisible(true)}
                                        style={{ backgroundColor: '#e8f0ff' }}
                                    />
                                    {dropdownVisible && (
                                        <DropdownUser
                                            helpData={helpData02}
                                            setHelpData05={setHelpData02}
                                            setSearchText={setSearchText}
                                            setSearchText1={setSearchText1}
                                            setItemText={setItemText}
                                            setItemText1={setItemText1}
                                            setDataSearch={setDataSearch}
                                            setDataSearchDept={setDataSearch1}
                                            setDataSheetSearch={setDataSheetSearch}
                                            setDropdownVisible={setDropdownVisible}
                                            dropdownVisible={dropdownVisible}
                                            searchText={searchText}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label={<span className="uppercase text-[9px]">{t('Mã nhân viên')}</span>} style={{ marginBottom: 0 }}
                                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                    wrapperCol={{ style: { padding: 0 } }}>
                                    <Input placeholder=""
                                        className="w-full"
                                        size="middle"
                                        value={dataSearch?.EmpID}
                                        readOnly />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>

                </Col>
            </Row>
        </div>

    )
}
