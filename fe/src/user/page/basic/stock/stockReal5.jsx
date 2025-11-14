import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button, Input, message, Card, Space, Drawer, Typography, Form, Spin, Row, Col, Divider } from 'antd';
import { QrcodeOutlined, CameraOutlined, KeyOutlined, LoadingOutlined, ArrowLeftOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { togglePageInteraction } from '../../../../utils/togglePageInteraction';
import { HandleError } from '../../default/handleError';
import { HandleSuccess } from '../../default/handleSuccess';
import { Helmet } from 'react-helmet'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo';
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData';
import { ItemPrintCheckQRQ } from '../../../../features/upload/itemPrint/ItemPrintCheckQRQ';
import QrScanner from 'qr-scanner';
import { ItemPrintCheckQRU } from '../../../../features/upload/itemPrint/ItemPrintCheckQRU';
import { useTranslation } from 'react-i18next'
import TopLoadingBar from 'react-top-loading-bar';
const { Title, Text } = Typography;

const SctokReal5Page = () => {
    const navigate = useNavigate();
    const controllers = useRef({}) 
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const [scanResult, setScanResult] = useState('');
    const [manualCode, setManualCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showDataForm, setShowDataForm] = useState(false);
    const [formData, setFormData] = useState(null);
    const [form] = Form.useForm();
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const [Dummy2, setDummy2] = useState('')
    const defaultCols = useMemo(() => [
    ], [t]);
    // Khởi tạo QR scanner
    useEffect(() => {
        return () => {
            if (qrScannerRef.current) {
                qrScannerRef.current.destroy();
            }
        };
    }, []);
    const increaseFetchCount = () => {
        activeFetchCountRef.current += 1;
    };

    const decreaseFetchCount = () => {
        activeFetchCountRef.current -= 1;
        if (activeFetchCountRef.current === 0) {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    };
    const fetchGenericData = async ({
        controllerKey,
        postFunction,
        searchParams,
        useEmptyData = true,
        defaultCols,
        afterFetch = () => { },
    }) => {
        increaseFetchCount();

        if (controllers.current[controllerKey]) {
            controllers.current[controllerKey].abort();
            await new Promise((resolve) => setTimeout(resolve, 10));
            return fetchGenericData({
                controllerKey,
                postFunction,
                searchParams,
                afterFetch,
                defaultCols,
                useEmptyData,
            });
        }

        const controller = new AbortController();
        controllers.current[controllerKey] = controller;
        const { signal } = controller;

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const response = await postFunction(searchParams, signal);
            if (!response.success) {
                HandleError([
                    {
                        success: false,
                        message: response.message || 'Đã xảy ra lỗi vui lòng thử lại!',
                    },
                ]);
            }
            const data = response.success ? (response.data || []) : [];

            let mergedData = updateIndexNo(data);

            if (useEmptyData) {
                const emptyData = updateIndexNo(generateEmptyData(100, defaultCols));
                mergedData = updateIndexNo([...data, ...emptyData]);
            }

            await afterFetch(mergedData);
        } catch (error) {
            let emptyData = [];

            if (useEmptyData) {
                emptyData = updateIndexNo(generateEmptyData(100, defaultCols));
            }

            await afterFetch(emptyData);
        } finally {
            decreaseFetchCount();
            controllers.current[controllerKey] = null;
        }
    };

    const resetResult = () => {
        setScanResult('');
        setShowDataForm(false);
        setFormData(null);
        form.resetFields();
    };


    const stopScanning = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
            qrScannerRef.current.destroy();
            qrScannerRef.current = null;
        }
        setIsScanning(false);
        setDrawerVisible(false);
        resetResult();
    };

    const handleScanSuccess = (result) => {
        setScanResult(result);

        stopScanning();

        const searchParams = {
            KeyItem1: result,

        }
        fetchGenericData({
            controllerKey: 'ItemPrintCheckQRQ',
            postFunction: ItemPrintCheckQRQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                if (
                    Array.isArray(data) &&
                    data.length > 0 &&
                    data[0]?.ItemSeq
                ) {

                    setFormData(data);
                    setShowDataForm(true);

                    setDummy2(data?.[0]?.Dummy2 || '')
                } else {
                    resetResult();
                }
            }

        });
    };
    const handleManualSubmit = () => {
        if (manualCode.trim()) {
            setScanResult(manualCode);

            setManualCode('');

            const searchParams = {
                KeyItem1: manualCode,

            }
            fetchGenericData({
                controllerKey: 'ItemPrintCheckQRQ',
                postFunction: ItemPrintCheckQRQ,
                searchParams,
                defaultCols: defaultCols,
                useEmptyData: false,
                afterFetch: (data) => {
                    if (
                        Array.isArray(data) &&
                        data.length > 0 &&
                        data[0]?.ItemSeq
                    ) {
                        setFormData(data);
                        setShowDataForm(true);
                        setDummy2(data?.[0]?.Dummy2 || '')
                    } else {
                        resetResult();
                    }
                }

            });
        } else {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng nhập mã QR',
                },
            ]);
        }
    };

    const startScanning = async () => {
        try {
            setIsScanning(true);
            setDrawerVisible(true);

            setTimeout(() => {
                if (videoRef.current) {
                    qrScannerRef.current = new QrScanner(
                        videoRef.current,
                        (result) => {
                            handleScanSuccess(result.data);
                        },
                        {
                            returnDetailedScanResult: true,

                            highlightScanRegion: false,
                            highlightCodeOutline: false,


                        }
                    );

                    qrScannerRef.current.start().catch(error => {
                        HandleError([
                            {
                                success: false,
                                message: 'Không thể truy cập camera. Vui lòng cấp quyền để truy cập ',
                            },
                        ]);
                        stopScanning();
                    });
                }
            }, 300);
        } catch (error) {
            stopScanning();
            resetResult();
        }
    };


    const handleBack = () => {
        if (showDataForm) {
            resetResult();
        } else {
            navigate(-1);
        }
    };


    const handleSaveData = useCallback(async () => {
        const resulU = {
            LotNo: formData?.[0]?.LotNo || '',
            ItemSeq: formData?.[0]?.ItemSeq || '',
            Dummy1: formData?.[0]?.Dummy1 || '',
            Dummy2: Dummy2 || '',
            UpdatedBy: userFrom?.UserSeq || '',
        };

        const requiredFields = [
            { key: 'LotNo', label: 'LotNo' },
            { key: 'ItemSeq', label: 'Sản phẩm' },
        ];

        const errors = requiredFields
            .filter(({ key }) => !resulU[key]?.toString().trim())
            .map(({ label }) => `Cột ${label} không được để trống`);

        if (errors.length > 0) {
            HandleError([
                {
                    success: false,
                    message: errors.join(', '),
                },
            ]);
            return;
        }

        // 👉 Không có dữ liệu hợp lệ
        if (!resulU.LotNo || !resulU.ItemSeq) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const result = await ItemPrintCheckQRU(resulU);

            if (!result?.success) {
                HandleError([result]);
                return;
            }
            resetResult()
            HandleSuccess([
                {
                    success: true,
                    message: ' Lô hàng đã được cập nhật thành công',
                },
            ]);
        } catch (error) {
            HandleError([
                {
                    success: false,
                    message: error.message || 'Đã xảy ra lỗi khi lưu!',
                },
            ]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [formData, userFrom]);

    const formatDateYYYYMMDD = (val) => {
        if (!val || val.length !== 8) return '';
        const year = val.slice(0, 4);
        const month = val.slice(4, 6);
        const day = val.slice(6, 8);
        return `${year}/${month}/${day}`;
    };

    const renderProductForm = () => (
        <div className="h-screen flex flex-col bg-white ">
            {/* Header */}


            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center p-1  border-b border-gray-200">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        className="mr-3 text-gray-600"
                    />

                </div>
                <Form
                    variant="underlined"
                    className="p-2"
                >

                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-4 bg-blue-600 mr-2"></div>
                            <Text strong className="text-gray-800 uppercase">Thông tin cơ bản</Text>
                        </div>
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item label="Lot No"  >
                                    <Input readOnly value={formData?.[0]?.LotNo || ''} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Tên sản phẩm"  >
                                    <Input readOnly value={formData?.[0]?.ItemName || ''} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item label="Mã sản phẩm"  >
                                    <Input readOnly value={formData?.[0]?.ItemNo || ''} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Quy cách"  >
                                    <Input readOnly value={formData?.[0]?.Spec || ''} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>


                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-4 bg-green-600 mr-2"></div>
                            <Text strong className="text-gray-800 uppercase ">Thông số kỹ thuật</Text>
                        </div>
                        <Row gutter={[16, 0]}>
                            <Col span={12}>
                                <Form.Item label="Đơn vị"  >
                                    <Input readOnly value={formData?.[0]?.UnitName || ''} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Màu sắc" >
                                    <Input readOnly value={formData?.[0]?.Dummy1 || ''} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item label="Số lượng" n >
                                    <Input type="number" value={formData?.[0]?.ItemPrintQty || ''} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={
                                    <>
                                        <span style={{ color: 'red' }}> Pallet (Giá trị được cập nhật)</span>
                                    </>
                                }  >
                                    <Input value={Dummy2}
                                        onChange={(e) => setDummy2(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>

                        </Row>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-4 bg-orange-600 mr-2"></div>
                            <Text strong className="text-gray-800 uppercase">Thông tin thời gian</Text>
                        </div>
                        <Row gutter={[16, 0]}>
                            <Col span={12}>
                                <Form.Item label="Ngày sản xuất">
                                    <Input
                                        readOnly
                                        value={
                                            formData?.[0]?.CreateDate
                                                ? formatDateYYYYMMDD(formData[0].CreateDate)
                                                : ''
                                        }
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Ngày hết hạn">
                                    <Input
                                        readOnly
                                        value={
                                            formData?.[0]?.ValiDate
                                                ? formatDateYYYYMMDD(formData[0].ValiDate)
                                                : ''
                                        }
                                    />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row gutter={[16, 0]}>
                            <Col span={12}>
                                <Form.Item label="Ngày nhập kho">
                                    <Input
                                        readOnly
                                        value={
                                            formData?.[0]?.RegDate
                                                ? formatDateYYYYMMDD(formData[0].RegDate)
                                                : ''
                                        }
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Số nhập kho"  >
                                    <Input readOnly value={formData?.[0]?.InNo || ''} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-4 bg-purple-600 mr-2"></div>
                            <Text strong className="text-gray-800 uppercase">Thông tin liên hệ</Text>
                        </div>
                        <Row gutter={[16, 0]}>
                            <Col span={12}>
                                <Form.Item label="Người đăng ký"  >
                                    <Input readOnly value={formData?.[0]?.RegUserName || ''} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Nhà cung cấp" >
                                    <Input readOnly value={formData?.[0]?.CustName || ''} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>


                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-4 bg-gray-600 mr-2"></div>
                            <Text strong className="text-gray-800 uppercase">Ghi chú</Text>
                        </div>
                        <Form.Item  >
                            <Input.TextArea
                                rows={3}
                                readOnly
                                value={formData?.[0]?.Remark || ''}

                                className="resize-none"
                            />
                        </Form.Item>
                    </div>
                </Form>

                <div className="p-2 bg-white border-t border-gray-200 mb-10">
                    <Button
                        icon={<SaveOutlined />}
                        onClick={handleSaveData}
                        className=" bg-blue-600 h-12  hover:bg-blue-600  text-white w-full border-0"

                    >
                        Cập nhật thông tin
                    </Button>
                </div>
            </div>


        </div>
    );

    const renderScannerInterface = () => (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header cố định */}
            <div className="flex items-center p-2 bg-white border-b border-gray-200">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    className="mr-3 text-gray-600"
                    size="large"
                />
                <div className="flex-1 text-center">
                    <Title level={4} className="mb-0 text-gray-800">Di chuyển lô hàng</Title>

                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-md mx-auto">
                    {scanResult && !showDataForm && (
                        <Card
                            className="mb-6 border-l-4 border-l-green-500 bg-white"
                            bodyStyle={{ padding: '16px' }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <Text strong className="text-green-700">Mã QR đã quét</Text>
                                </div>
                                <Button type="text" size="small" onClick={resetResult} className="text-gray-400">
                                    <CloseOutlined />
                                </Button>
                            </div>
                            <div className="p-3 bg-gray-50 rounded border">
                                <Text className="break-all text-gray-800 font-mono">
                                    {scanResult}
                                </Text>
                            </div>
                        </Card>
                    )}

                    <Card className="border border-gray-200 bg-white mb-6" bodyStyle={{ padding: '24px' }}>
                        <Space direction="vertical" className="w-full" size="large">
                            <Button
                                type="primary"
                                size="large"
                                icon={<CameraOutlined />}
                                onClick={startScanning}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 border-0 text-white font-semibold text-base"
                                loading={isLoading}
                            >
                                Quét QR Code
                            </Button>

                            <div className="text-center">
                                <div className="inline-block bg-gray-100 px-4 py-1 rounded-full">
                                    <Text className="text-gray-500 text-sm">hoặc</Text>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Input
                                    size="large"
                                    placeholder="Nhập mã QR thủ công..."
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    prefix={<KeyOutlined className="text-gray-400" />}
                                    onPressEnter={handleManualSubmit}
                                    className="h-12 text-base"
                                />
                                <Button
                                    type="default"
                                    size="large"
                                    onClick={handleManualSubmit}
                                    className="w-full h-12 border-gray-300 hover:border-blue-500 text-gray-700 font-medium"
                                    loading={isLoading}
                                >
                                    Xác nhận mã
                                </Button>
                            </div>
                        </Space>
                    </Card>

                    <Card className="border border-gray-200 bg-white" bodyStyle={{ padding: '20px' }}>
                        <div className="flex items-center mb-3">
                            <div className="w-1 h-4 bg-blue-600 mr-2"></div>
                            <Text strong className="text-gray-800 text-base">Hướng dẫn sử dụng</Text>
                        </div>
                        <Space direction="vertical" className="w-full" size="small">
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3"></div>
                                <Text className="text-gray-600">Nhấn "Quét QR Code" để sử dụng camera</Text>
                            </div>
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3"></div>
                                <Text className="text-gray-600">Hoặc nhập mã trực tiếp vào ô bên trên</Text>
                            </div>
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3"></div>
                                <Text className="text-gray-600">Đảm bảo cấp quyền truy cập camera</Text>
                            </div>
                            <div className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3"></div>
                                <Text className="text-gray-600">Thông tin sản phẩm sẽ tự động hiển thị</Text>
                            </div>
                        </Space>
                    </Card>
                </div>
            </div>
        </div>
    );





    return (
        <>
            <Helmet>
                <title>TMT</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="h-screen bg-gray-50">
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Spin size="large" tip="Đang tải dữ liệu..." />
                    </div>
                )}

                {showDataForm ? renderProductForm() : renderScannerInterface()}

                <Drawer
                    title={null}
                    placement="bottom"
                    closable={false}
                    onClose={stopScanning}
                    open={drawerVisible}
                    height="100vh"
                    styles={{
                        body: {
                            padding: 0,

                        },
                    }}
                    className="scanner-drawer"
                >
                    <div className="relative w-full h-full overflow-hidden">
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 backdrop-blur-sm z-20">
                            <Text className="text-lg font-semibold text-white">Quét QR Code</Text>
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={stopScanning}
                                className="text-white hover:bg-white/20"
                                size="large"
                            />
                        </div>

                        {/* Video toàn màn hình */}
                        <video
                            ref={videoRef}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            playsInline
                            autoPlay
                            muted
                        />


                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                            <div className="relative w-56 h-56 rounded-xl">

                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gray-200  rounded-tl-xl"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gray-200 rounded-tr-xl"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gray-200 rounded-bl-xl"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gray-200 rounded-br-xl"></div>
                            </div>
                        </div>

                        {/* Text hướng dẫn đè trên video */}
                        <div className="absolute bottom-16 left-0 right-0 text-center text-white z-30 px-6">
                            {isScanning ? (
                                <div className="flex items-center justify-center text-blue-400 mb-2">
                                    <LoadingOutlined className="mr-2" />
                                    <Text className="text-blue-400 font-medium text-base">
                                        Đang quét mã QR...
                                    </Text>
                                </div>
                            ) : (
                                <Text className="text-gray-300 block mb-2 text-base">Sẵn sàng quét</Text>
                            )}
                            <Text className="text-gray-400 text-sm block">
                                Đưa mã QR vào vùng quét để tự động nhận diện
                            </Text>
                        </div>

                        {/* Overlay mờ xung quanh vùng quét */}
                        <div className="absolute inset-0 z-10">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-transparent rounded-xl border-none box-content" style={{

                            }}></div>
                        </div>
                    </div>
                </Drawer>

            </div>
        </>
    );
};

export default SctokReal5Page;