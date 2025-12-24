import TableAdditionalMaterial from '../../table/basic/tableAdditionalMaterial';
import TableUploadFileMaterial from '../../table/basic/tableUploadFileMaterial';
import { Input, Button, Row, Col, Menu, Form, Upload, message } from 'antd'
import { useState, useEffect, useCallback } from 'react'
import { UploadOutlined } from '@ant-design/icons';
const menuStyle = { borderInlineEnd: 'none' }
import { allowedTypes } from '../../../../utils/allowedTypes';
import { updateIndexNo } from '../../sheet/js/updateIndexNo';
import { useTranslation } from 'react-i18next'
import TableUploadImageMaterial from '../../table/basic/tableUploadImageMaterial';
const TabViewDeMaterSeq = ({
    dataType,
    setSelection,
    selection,
    setShowSearch,
    showSearch,
    setEditedRows,
    setGridData,
    gridData,
    setNumRows,
    numRows,
    handleRowAppend,
    setCols,
    cols,
    defaultCols,
    dataNaWare,
    handleRestSheet,
    canEdit,
    setAddedRows,
    addedRows,
    canCreate,
    dataSub,
    setSelectionC,
    selectionC,
    setAddedRowsC,
    addedRowsC,
    numRowsC,
    setGridDataC,
    gridDataC,
    setNumRowsC,
    setColsC,
    colsC,
    defaultColsC,
    setFileList,
    fileList,
    setImageList,
    imageList,
    setSelectionD,
    selectionD,
    numRowsD,
    setGridDataD,
    gridDataD,
    setNumRowsD,
    setColsD,
    colsD,
    defaultColsD,
    handleUploadFiles,
    fetchDataDSeq,
    setSelectedImages,
    selectedImages
}) => {
    const { t } = useTranslation()
    const [current, setCurrent] = useState('0')

    const handleMenuClick = (e) => {
        setCurrent(e.key)
    }

    const uploadProps = {
        fileList,
        onChange: (info) => {
            const { file, fileList } = info;
            const customizedFileList = fileList.map((file, index) => ({
                OriginalName: file.response?.filename || file.name,
                Size: file.size,
                Status: "A"
            }));

            setGridDataC(prevData => {
                const filteredOldData = prevData.filter(item => item.Status !== "A");

                const mergedData = [...filteredOldData, ...customizedFileList];
                const updatedData = updateIndexNo(mergedData);

                setNumRowsC(updatedData.length);
                return updatedData;
            });

            setFileList(fileList);
        },
        beforeUpload: (file) => {
            const isAllowedType = allowedTypes.includes(file.type);
            const isSizeValid = file.size / 1024 / 1024 < 10;
            if (!isAllowedType) {
                message.error(t('850000036'));
                return Upload.LIST_IGNORE; 
            }

            if (!isSizeValid) {
                message.error(t('850000037'));
                return Upload.LIST_IGNORE; 
            }

            return false; 
        },
        showUploadList: false,
    };

    const uploadPropsImages = {
        imageList,
        onChange: (info) => {
            const { file, fileList } = info;
            const latestFileList = fileList.slice(-1);
            handleUploadFiles(latestFileList, 'img', fetchDataDSeq);
        },
        beforeUpload: (file) => {
            const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
            const isSizeValid = file.size / 1024 / 1024 < 10;
            if (!isImage) {
                message.error(t('850000038'));
                return Upload.LIST_IGNORE; 
            }

            if (!isSizeValid) {
                message.error(t('850000039'));
                return Upload.LIST_IGNORE; 
            }

            return false; 
        },
        showUploadList: false,
        accept: 'image/*',
    };

    const items = [
        {
            key: '0',
            label: t('850000040'),
            children: (
                <div className=' w-full h-screen '>
                    <TableAdditionalMaterial
                        setSelection={setSelection}
                        selection={selection}
                        showSearch={showSearch}
                        setShowSearch={setShowSearch}
                        setAddedRows={setAddedRows}
                        addedRows={addedRows}
                        setEditedRows={setEditedRows}
                        numRows={numRows}
                        setGridData={setGridData}
                        gridData={gridData}
                        setNumRows={setNumRows}
                        setCols={setCols}
                        handleRowAppend={handleRowAppend}
                        cols={cols}
                        defaultCols={defaultCols}
                        canEdit={canEdit}
                    />
                </div>
            ),
        },
        {
            key: '1',
            label: t('850000041'),
            children: (
                <div className=' w-full h-screen '>
                    <TableUploadImageMaterial
                        setSelection={setSelectionD}
                        selection={selectionD}
                        numRows={numRowsD}
                        setGridData={setGridDataD}
                        gridData={gridDataD}
                        setNumRows={setNumRowsD}
                        setCols={setColsD}
                        cols={colsD}
                        defaultCols={defaultColsD}
                        canEdit={canEdit}
                        uploadPropsImages={uploadPropsImages}
                        setFileList={setImageList}
                        fileList={imageList}
                        setSelectedImages={setSelectedImages}
                        selectedImages={selectedImages}
                        dataSub={dataSub}
                    />
                </div>

            ),
        },
        {
            key: '2',
            label: t('850000042'),
            children: (
                <TableUploadFileMaterial
                    uploadProps={uploadProps}
                    setSelection={setSelectionC}
                    selection={selectionC}
                    setAddedRows={setAddedRowsC}
                    addedRows={addedRowsC}
                    numRows={numRowsC}
                    setGridData={setGridDataC}
                    gridData={gridDataC}
                    setNumRows={setNumRowsC}
                    setCols={setColsC}
                    cols={colsC}
                    defaultCols={defaultColsC}
                    canEdit={canEdit}
                    dataSub={dataSub}

                />
            ),
        },
    ];

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center pb-[30px]">
            <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-x-hidden overflow-hidden">
                <div className="h-20 w-full bg-white p-2">
                    <Form className="h-full flex flex-col">
                        <Row className="gap-4 flex items-center h-full">
                            <Col className="w-[30%] h-full">
                                <Form.Item
                                    label={
                                        <span className="uppercase text-[9px]">
                                          {t('850000043')}
                                        </span>
                                    }
                                    className="mb-0"
                                    style={{ marginBottom: 0 }}
                                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                    wrapperCol={{ style: { padding: 0 } }}
                                >
                                    <Input placeholder="" size="middle" readOnly className="h-full" value={dataSub[0]?.ItemName} />
                                </Form.Item>
                            </Col>


                        </Row>
                    </Form>
                </div>
                <div className="h-full w-full flex border-t">
                    <Menu
                        onClick={handleMenuClick}
                        selectedKeys={[current]}
                        mode="vertical"
                        style={menuStyle}
                    >
                        {items.map((item) => (
                            <Menu.Item key={item.key} icon={item.icon}>
                                <span className="text-xs">{item.label}</span>
                            </Menu.Item>
                        ))}
                    </Menu>

                    <div className="flex-1 border-l overflow-hidden">
                        {items.find((item) => item.key === current)?.children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabViewDeMaterSeq;
