import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../../components/icons'
import { Input, Space, Row, Typography, message, Col, Drawer, Button, Form, Upload, Select } from 'antd'
const { Title, Text } = Typography
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import BucketAction from '../../../components/actions/basic/bucketAction'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import { v4 as uuidv4 } from 'uuid';
import { uploadFilesTemp } from '../../../../features/upload/postFileTemp'
import { getHelpDefine } from '../../../../features/help/getDefine'
import { getHelpDefineItem } from '../../../../features/help/getDefineItem'
import { getQFileTemp } from '../../../../features/upload/getQFileTemp'
const { Dragger } = Upload;
import { debounce } from 'lodash'
import TableFileTemp from '../../../components/table/basic/tableFileTemp'
import { PostDFilesTemp } from '../../../../features/upload/postDFileTemp'
import { deleteDataSheet } from '../../../../utils/deleteUtils'
import TopLoadingBar from 'react-top-loading-bar';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });



export default function InvoiceTemp({
    permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete, controllers,
    cancelAllRequests
}) {
    const loadingBarRef = useRef(null);
    const { t } = useTranslation()
    const defaultCols = useMemo(
        () => [
            {
                title: '',
                id: 'Status',
                kind: 'Text',
                readonly: true,
                width: 50,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderLookup,
            },
            {
                title: 'IdSeq',
                id: 'IdSeq',
                kind: 'Text',
                readonly: true,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderRowID,
            },
            {
                title: 'FormCode',
                id: 'FormCode',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderRowID,
            },
            {
                title: 'Field',
                id: 'FieldName',
                kind: 'Text',
                readonly: false,
                width: 100,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: 'Filename',
                id: 'Filename',
                kind: 'Uri',
                readonly: true,
                width: 500,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderUri,
            },
            {
                title: 'OriginalName',
                id: 'OriginalName',
                kind: 'Text',
                readonly: true,
                width: 400,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: 'MimeType',
                id: 'MimeType',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
            },
            {
                title: 'Size',
                id: 'Size',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderNumber,
            },
            {
                title: 'UserId',
                id: 'UserId',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderEmail,
            },
            {
                title: 'UserName',
                id: 'UserName',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderEmail,
            },


        ],
        [t],
    )

    const [gridData, setGridData] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [showSearch, setShowSearch] = useState(false)
    const [addedRows, setAddedRows] = useState([])

    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [clickCount, setClickCount] = useState(false)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [loading, setLoading] = useState(false)
    const [isAPISuccess, setIsAPISuccess] = useState(true)

    const [dataHelp01, setDataHelp01] = useState([])
    const [dataHelp02, setDataHelp02] = useState([])
    const [filteredDataHelp02, setFilteredDataHelp02] = useState([]);
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'invoice_template_regis_a',
            defaultCols.filter((col) => col.visible),
        ),
    )
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const [fileName, setFileName] = useState('');
    const [language, setLanguage] = useState('')
    const [defineSeq, setDefineSeq] = useState(null)
    const [defineItemSeq, setDefineItemSeq] = useState(null)
    const [uploading, setUploading] = useState(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    useEffect(() => {
        cancelAllRequests()
    }, [])
    const beforeUpload = (file) => {
        const fileNameWithoutExt = file.name.replace(/\.docx$/, '');
        setFileName(fileNameWithoutExt);
        const isDocx = file.name.endsWith('.docx');
        const isValidSize = file.size / 1024 / 1024 < 20;

        if (!isDocx) {
            message.error('Chỉ được upload file .docx!');
            return false;
        }

        if (!isValidSize) {
            message.error('Dung lượng file phải dưới 5MB!');
            return false;
        }

        if (fileList.length >= 1) {
            return false;
        }

        setFileList([file]);
        return false;
    };
    const fetchCodeHelpData = useCallback(async () => {
        setLoading(true);
        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData.current = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchCodeHelpData = controller;

        try {
            const [
                dataHelp01,
                dataHelp02,
            ] = await Promise.all([
                getHelpDefine(signal),
                getHelpDefineItem(signal),

            ]);

            setDataHelp01(dataHelp01?.data?.data || []);
            setDataHelp02(dataHelp02?.data?.data || []);

        } catch (error) {
            setDataHelp01([])
            setDataHelp02([])

        } finally {
            setLoading(false);
            controllers.current.fetchCodeHelpData.current = null;
        }
    }, []);
    const debouncedFetchCodeHelpData = useMemo(
        () => debounce(fetchCodeHelpData, 200),
        [fetchCodeHelpData],
    )
    useEffect(() => {
        debouncedFetchCodeHelpData()
        return () => {
            debouncedFetchCodeHelpData.cancel()
        }

    }, [debouncedFetchCodeHelpData])

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error('Please select files to upload.');
            return;
        }

        const formData = new FormData();
        const generatedFormCode = uuidv4();
        fileList.forEach((file) => {
            formData.append('files', file.originFileObj);
        });
        formData.append('formCode', generatedFormCode);
        formData.append('fileNameCust', fileName);
        formData.append('language', language);
        formData.append('defineSeq', defineSeq);
        formData.append('defineItemSeq', defineItemSeq);


        setUploading(true);

        const result = await uploadFilesTemp(formData);

        if (result.success) {
            message.success('Upload successfully.');
            setIsModalOpen(false);
            setFileList([]);
            const fetchedData = result.data.data || []
            setGridData((prevData) => {
                const combinedData = [...prevData, ...fetchedData];
                return updateIndexNo(combinedData);
            });
            setNumRows((prevNumRows) => prevNumRows + fetchedData.length);
        } else {
            message.error(result.message || 'Upload failed.');
            setIsModalOpen(true);
        }

        setUploading(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {

        handleUpload()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])
    const fetchData = useCallback(async () => {
        if (!isAPISuccess) return

        setLoading(true)
        setIsAPISuccess(false)
        if (controllers.current.fetchData) {
            controllers.current.fetchData.abort();
            controllers.current.fetchData.current = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchData = controller;

        try {
            const response = await getQFileTemp(signal)
            const fetchedData = response.data.data || []

            const updatedData = updateIndexNo(fetchedData);
            setGridData(updatedData)
            setNumRows(fetchedData.length)
        } catch (error) {
            setGridData([])
            setNumRows(0)
        } finally {
            setLoading(false)
            controllers.current.fetchData.current = null;
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
        }
    }, [])
    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        if (dataHelp01?.length > 0) {
            const firstValue = dataHelp01[0]?.IdSeq;
            setDefineSeq(firstValue);
            handleChangeHelp01(firstValue);
        }
    }, [dataHelp01, dataHelp02]);

    const handleChangeHelp01 = (value) => {
        setDefineSeq(value);
        const filtered = dataHelp02.filter((item) => item.DefineSeq === value);
        setFilteredDataHelp02(filtered);

        setDefineItemSeq(filtered.length > 0 ? filtered[0].IdSeq : null);
    };

    const handleChangeHelp02 = (value) => {
        setDefineItemSeq(value);
    };

    const getSelectedRows = () => {
        const selectedRows = selection.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData[i]) {
                    rows.push(gridData[i])
                }
            }
        })

        return rows
    }

    const handleDelete = useCallback(() => {
        if (canDelete === false) {
            message.error('Bạn không có quyền xóa dữ liệu');
            return;
        }

        message.loading('Đang xóa dữ liệu...', 0);

        const handleDelete = deleteDataSheet(
            getSelectedRows,
            PostDFilesTemp,
            gridData,
            setGridData,
            setNumRows,
            resetTable,
            editedRows,
            setEditedRows,
            "IdSeq"
        );

        Promise.all([handleDelete]).then((results) => {
            const hasError = results.some((result) => !result.success);

            if (hasError) {
                const errorMessages = results.filter((result) => !result.success).map((result) => result.message);
                message.error(errorMessages.join(', '));
            } else {
                message.success('Xóa dữ liệu thành công');
            }
        }).finally(() => {
            message.destroy();
        });
    }, [
        canDelete,
        editedRows,
        getSelectedRows,
        PostDFilesTemp,
        setGridData,
        setNumRows,
        resetTable,
        setEditedRows,
        selection,
        gridData
    ]);
    return (
        <>
            <Helmet>
                <title>HPM - {t('850000055')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 p-3 h-screen overflow-hidden">
                <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
                        <div className="flex items-center justify-between">
                            <Title level={4} className="mt-2 uppercase opacity-85 ">
                                {t('850000055')}
                            </Title>
                            <BucketAction fetchData={fetchData} showModal={showModal} handleDelete={handleDelete} />
                        </div>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
                        <TableFileTemp
                            setSelection={setSelection}
                            selection={selection}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            setAddedRows={setAddedRows}
                            addedRows={addedRows}
                            setEditedRows={setEditedRows}
                            editedRows={editedRows}
                            setNumRowsToAdd={setNumRowsToAdd}
                            clickCount={clickCount}
                            numRowsToAdd={numRowsToAdd}
                            numRows={numRows}
                            onSelectRow={onSelectRow}
                            openHelp={openHelp}
                            setOpenHelp={setOpenHelp}
                            setOnSelectRow={setOnSelectRow}
                            setIsCellSelected={setIsCellSelected}
                            isCellSelected={isCellSelected}
                            setGridData={setGridData}
                            gridData={gridData}
                            setNumRows={setNumRows}
                            setCols={setCols}
                            cols={cols}
                            defaultCols={defaultCols}
                            canCreate={canCreate}
                            canEdit={canEdit}
                        />
                    </div>
                </div>
            </div>


            <Drawer title={t('850000056')} width="40%"
                open={isModalOpen} onClose={handleCancel}
                extra={
                    <Space>
                        <Button onClick={handleCancel}>{t('850000057')}</Button>
                        <Button type="primary" htmlType="submit" onClick={handleOk}>
                            {t('850000058')}
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" >
                    <Row gutter={16}>
                        <Col span={18}>
                            <Form.Item label={t('850000060')} rules={[{ required: true, message: t('850000059') }]}>
                                <Input size="middle" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t('850000061')}
                                rules={[{ required: true, message: t('850000062') }]}
                            >
                                <Select value={language || 'vi'} onChange={(value) => setLanguage(value)}>
                                    <Select.Option value="en">English</Select.Option>
                                    <Select.Option value="vi">Tiếng Việt</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={t('850000063')} rules={[{ required: true, message: t('850000064') }]}>
                                <Select
                                    defaultValue={dataHelp01?.[0]?.IdSeq}
                                    size="middle"
                                    onChange={handleChangeHelp01}
                                    options={dataHelp01?.map((item) => ({
                                        label: item?.DefineName,
                                        value: item?.IdSeq,
                                    })) || []}
                                />

                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t('850000066')} rules={[{ required: true, message: t('850000065') }]}>
                                <Select
                                    value={defineItemSeq}
                                    size="middle"
                                    onChange={handleChangeHelp02}
                                    options={filteredDataHelp02?.map((item) => ({
                                        label: item?.DefineItemName,
                                        value: item?.IdSeq,
                                    })) || []}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="h-[200px]">
                        <Dragger
                            accept=".docx"
                            listType="picture"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            onRemove={(file) => {
                                const index = fileList.indexOf(file);
                                const newFileList = fileList.slice();
                                newFileList.splice(index, 1);
                                setFileList(newFileList);
                            }}

                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{t('850000052')}</p>
                            <p className="ant-upload-hint">
                                {t('850000053')}
                            </p>
                        </Dragger >
                    </div>

                </Form>
            </Drawer>
        </>
    )
}
