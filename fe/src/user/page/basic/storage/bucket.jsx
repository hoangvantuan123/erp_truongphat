import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../../components/icons'
import { Input, Space, Table, Typography, message, Flex, Splitter, Button, Modal, Upload } from 'antd'
const { Title, Text } = Typography
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import TableBucket from '../../../components/table/basic/tableBucket'
import BucketAction from '../../../components/actions/basic/bucketAction'
import { getQBucket } from '../../../../features/upload/getQ'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import { v4 as uuidv4 } from 'uuid';
import { uploadFilesPhoto } from '../../../../features/upload/postPhoto';
import { PostDFiles } from '../../../../features/upload/postD'
import { deleteDataSheet } from '../../../../utils/deleteUtils'
const { Dragger } = Upload;
import TopLoadingBar from 'react-top-loading-bar';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });



export default function BucketStorage({
    permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete, controllers,
    cancelAllRequests
}) {
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
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'buckets-basic-regis-a',
            defaultCols.filter((col) => col.visible),
        ),
    )
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const beforeUpload = (file) => {

        const isValidSize = file.size / 1024 / 1024 < 5;
        if (!isValidSize) {
            message.error(t('870000024'));
            return false;
        }
        setFileList([...fileList, file]);
        return false;
    };
    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error(t('870000025'));
            return;
        }

        const formData = new FormData();
        const generatedFormCode = uuidv4();
        fileList.forEach((file) => {
            formData.append('files', file.originFileObj);
        });
        formData.append('formCode', generatedFormCode);

        setUploading(true);

        const result = await uploadFilesPhoto(formData);

        if (result.success) {
            message.success(t('870000026'));
            setIsModalOpen(false);
            setFileList([]);
            const fetchedData = result.data.data || []
            setGridData((prevData) => {
                const combinedData = [...prevData, ...fetchedData];
                return updateIndexNo(combinedData);
            });
            setNumRows((prevNumRows) => prevNumRows + fetchedData.length);
        } else {
            message.error(result.message || t('870000027'));
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
    const fetchData = useCallback(async () => {
        if (!isAPISuccess) return

        setLoading(true)
        setIsAPISuccess(false)
        let hideLoadingMessage
        if (controllers.current.fetchData) {
            controllers.current.fetchData.abort();
            controllers.current.fetchData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchData = controller;
        try {


            const response = await getQBucket(signal)
            const fetchedData = response.data.data || []

            const updatedData = updateIndexNo(fetchedData);
            setGridData(updatedData)
            setNumRows(fetchedData.length)
        } catch (error) {
            setGridData([])
            setNumRows(0)
        } finally {
            setLoading(false)
            setIsAPISuccess(true)
            controllers.current.fetchData = null;
        }
    }, [])
    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])
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
            message.error(t('870000002'));
            return;
        }


        const handleDelete = deleteDataSheet(
            getSelectedRows,
            PostDFiles,
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
                message.success(t('870000001'));
            }
        }).finally(() => {
            message.destroy();
        });
    }, [
        canDelete,
        editedRows,
        getSelectedRows,
        PostDFiles,
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
                <title>HPM - {t('850000051')}</title>
            </Helmet>
            <div className="bg-slate-50 p-3 h-screen overflow-hidden">
                <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
                        <div className="flex items-center justify-between">
                            <Title level={4} className="mt-2 uppercase opacity-85 ">
                                {t('850000051')}
                            </Title>
                            <BucketAction fetchData={fetchData} showModal={showModal} handleDelete={handleDelete} />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                                    <FilterOutlined />
                                    {t("850000014")}
                                </h2>
                                <span className="relative size-5 shrink-0">
                                    <ArrowIcon />
                                </span>
                            </summary>
                            <div className="flex p-2 gap-4">

                            </div>
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
                        <TableBucket
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


            <Modal title="Basic Modal" width="80%"
                maskClosable={false} height="80%" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered

                closable={false}>
                <div className='h-[700px] overflow-auto'>
                    <div className="h-[200px]">

                        <Dragger

                            listType="picture"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}

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

                </div>
            </Modal>
        </>
    )
}
