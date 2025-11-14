import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { notification, message, Splitter } from 'antd'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { HandleError } from '../default/handleError'
import { debounce } from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import TemNVLNewAction from '../../components/actions/mngTemNvl/temNVLNewAction'
import TemNVLNewTable from '../../components/table/mngTemNvl/temNVLNewTable'
import TemNVLNewLogFileTable from '../../components/table/mngTemNvl/temNVLNewLogFIleTable'
import { Helmet } from 'react-helmet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { HOST_API_SERVER_18 } from '../../../services'
import { ItemAllH } from '../../../features/codeHelp/ItemAllH'
import { CustAllH } from '../../../features/codeHelp/CustAllH'
import { ItemPrintA } from '../../../features/upload/itemPrint/ItemPrintA'
import { ItemPrintU } from '../../../features/upload/itemPrint/ItemPrintU'
import { ItemPrintD } from '../../../features/upload/itemPrint/ItemPrintD'
import { filterValidRows } from '../../../utils/filterUorA'
import { HOST_API_SERVER_19 } from '../../../services'
import { ItemPrintQ } from '../../../features/upload/itemPrint/ItemPrintQ'
import { ItemPrintQRTaggingPrint } from '../../../features/print/item/ItemPrintQRTaggingPrint'
import dayjs from 'dayjs'
export default function TemNVLNew({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Tên sản phẩm'), id: 'ItemName', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Mã sản phẩm'), id: 'ItemNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Đơn vị'), id: 'UnitName', kind: 'Text', readonly: false, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Quy cách'), id: 'Spec', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Nhà cung cấp'), id: 'CustName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Loại bao in'), id: 'BagTypeName', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('LotNo'), id: 'LotNo', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Số lượng'), id: 'Qty', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Số bao'), id: 'ReelNo', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Màu sắc'), id: 'Color', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Ngày sản xuất'), id: 'ProduDate', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Ngày nhập kho'), id: 'StockInDate', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Pallet'), id: 'Pallet', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Vị trí'), id: 'Location', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ghi chú'), id: 'Remark', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Grade'), id: 'Memo01', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('P/O No'), id: 'Memo02', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Memo03'), id: 'Memo03', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('QR Code'), id: 'QrCodeOld', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('LotNoFull'), id: 'LotNoFull', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    ], [t]);
    const defaultColsB = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: true }, icon: GridColumnIcon.HeaderLookup },
        { title: t('File in'), id: 'fileNameWithoutExt', kind: 'Text', readonly: false, width: 500, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
    ], [t]);


    const typeOptions = [
        { id: 'fullBag', type: 'fullBag', description: 'Bao đủ' },
        { id: 'partialBag', type: 'partialBag', description: 'Bao lẻ' }
    ];

    const [gridData, setGridData] = useState([])
    const [gridDataB, setGridDataB] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionB, setSelectionB] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearchB, setShowSearchB] = useState(false)
    const [numRows, setNumRows] = useState(0)
    const [numRowsB, setNumRowsB] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [keyItem1, setKeyItem1] = useState('')
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [keyItem4, setKeyItem4] = useState('')
    const [keyItem5, setKeyItem5] = useState('')

    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([{ id: 'fullBag', type: 'fullBag', description: 'Bao đủ' },
    { id: 'partialBag', type: 'partialBag', description: 'Bao lẻ' }])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchText, setSearchText] = useState('')
    const [dataSearch, setDataSearch] = useState([])
    const [StatusAssetM, setStatusAssetM] = useState('')
    const [AssetCode, setAssetCode] = useState('')
    const [AssetName, setAssetName] = useState('')
    const [uuid, setUUID] = useState(null)
    const [searchText2, setSearchText2] = useState('')
    const [dataSearch2, setDataSearch2] = useState([])
    const [addedRows, setAddedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [searchText3, setSearchText3] = useState('')
    const [dataSearch3, setDataSearch3] = useState([])
    const [itemText3, setItemText3] = useState(null)
    const [LotNo, setLotNo] = useState('')
    const [ItemName, setItemName] = useState('')
    const [ItemNo, setItemNo] = useState('')
    const [formDate, setFormDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs())
    const [bagType, setBagType] = useState('')
    const [QrCode, setQrCode] = useState('')
    const [displayValue2, setDisplayValue2] = useState('1');
    const formatDate = (date) => date.format('YYYYMMDD')
    const [dataSheetSearch3, setDataSheetSearch3] = useState([])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'as_03_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [colsB, setColsB] = useState(() =>
        loadFromLocalStorageSheet(
            'as_03_b_a',
            defaultColsB.filter((col) => col.visible)
        )
    )

    useEffect(() => {
        cancelAllRequests()
        notification.destroy();
        message.destroy();
    }, [])

    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    useEffect(() => {
        const emptyData = generateEmptyData(100, defaultCols)
        const updatedData = updateIndexNo(emptyData)
        setGridData(updatedData)
        setNumRows(updatedData.length)
    }, [defaultCols])
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

    useEffect(() => {
        let storedUUID = sessionStorage.getItem('print_from_asset_uuid');
        if (!storedUUID) {
            storedUUID = uuidv4();
            sessionStorage.setItem('print_from_asset_uuid', storedUUID);
        }
        setUUID(storedUUID);
    }, []);

    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )
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

    const handleSearchData = useCallback(async () => {

        if (!formDate) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng chọn thời gian trước khi tìm kiếm!',
                },
            ]);
            return;
        }
        if (!toDate) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng chọn thời gian trước khi tìm kiếm!',
                },
            ]);
            return;
        }
        const searchParams = {
            KeyItem1: formDate ? formatDate(formDate) : '',
            KeyItem2: toDate ? formatDate(toDate) : '',
            KeyItem3: ItemName || '',
            KeyItem4: ItemNo || '',
            KeyItem6: LotNo || '',
            KeyItem5: dataSearch3 ? dataSearch3?.CustSeq : '',
            KeyItem7: bagType || '',
            KeyItem8: 'U',
            KeyItem9: QrCode || ''

        }
        fetchGenericData({
            controllerKey: 'ItemPrintQ',
            postFunction: ItemPrintQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [formDate, toDate, ItemName, ItemNo, LotNo, dataSearch3, bagType, QrCode]);



    const fetchCodeHelpData = useCallback(async () => {
        increaseFetchCount();

        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        loadingBarRef.current?.continuousStart();

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.fetchCodeHelpData = controller;


        try {
            const [res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11] = await Promise.allSettled([
                ItemAllH([[{ KeyItem1: '' }]], signal),
                CustAllH([[{ KeyItem1: '' }]], signal),
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);


        } finally {
            decreaseFetchCount();
            controllers.current.fetchCodeHelpData = null;
        }
    }, []);
    const debouncedFetchCodeHelpData = useMemo(
        () => debounce(fetchCodeHelpData, 100),
        [fetchCodeHelpData],
    )
    useEffect(() => {
        debouncedFetchCodeHelpData()
        return () => {
            debouncedFetchCodeHelpData.cancel()
        }
    }, [debouncedFetchCodeHelpData])
    const getSelectedRowsA = () => {
        return selection.rows.items.flatMap(([start, end]) =>
            gridData.slice(start, end)
        );
    };
    const getSelectedRowsB = () => {
        return selectionB.rows.items.flatMap(([start, end]) =>
            gridDataB.slice(start, end)
        );
    };
    const HandOpenFile = useCallback(async () => {
        try {
            const selectedRows = getSelectedRowsB();

            if (!selectedRows || selectedRows.length === 0) {
                return HandleError([{ success: false, message: 'Chưa chọn file nào!' }]);
            }

            const pdfUrls = selectedRows.map(row => {
                const cleanedPath = row.relativePath.replace(/^.*storage_erp[\\/]/, "");
                return `${HOST_API_SERVER_19}/secure-file-item/${cleanedPath}`;
            });


            const isElectron = !!window?.electron?.openPDFWindow;

            if (isElectron) {
                // Mở từng file trong electron window
                for (const url of pdfUrls) {
                    window.electron.openPDFWindow(url);
                }
            } else {
                // Web: mở tab mới cho từng file
                for (const url of pdfUrls) {
                    window.open(url, "_blank");
                }
            }
        } catch (error) {
            HandleError([{ success: false, message: t(error?.message) }]);
        }
    }, [selectionB, gridDataB]);





    const openAndPrintPdf = async (url) => {
        try {
            const response = await fetch(url, { credentials: "include" });
            if (!response.ok) throw new Error(`Fetch thất bại: ${response.status}`);

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            // Tạo iframe để hiển thị PDF
            const iframe = document.createElement("iframe");
            iframe.style.width = "100%";
            iframe.style.height = "100vh";
            iframe.src = blobUrl;
            document.body.appendChild(iframe);

            // Khi PDF load xong thì gọi print()
            iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();


            };


        } catch (err) {
            HandleError([
                {
                    success: false,
                    message: `Lỗi khi mở file ${url}: ${err.message || "Không xác định"}`,
                },
            ]);
        }
    };


    const HandPrintFile = useCallback(async () => {
        try {
            const selectedRows = getSelectedRowsB();

            if (!selectedRows || selectedRows.length === 0) {
                return HandleError([{ success: false, message: "Chưa chọn file nào!" }]);
            }

            // Lấy danh sách URL in
            const pdfUrls = selectedRows.map((row) => {
                const cleanedPath = row.relativePath.replace(/^.*storage_erp[\\/]/, "");
                return `${HOST_API_SERVER_19}/secure-file-item/${cleanedPath}`;
            });

            // Gọi hàm in 1 lần với danh sách URL
            await openAndPrintPdf(pdfUrls);
        } catch (error) {
            HandleError([{ success: false, message: t(error?.message) }]);
        }
    }, [selectionB, gridDataB]);
    const dateFormat = (dateString) => {
        if (!dateString) return "";
        if (/^\d{8}$/.test(dateString)) {
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            return `${day}/${month}/${year}`;
        }
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        return date.toLocaleDateString("vi-VN");
    };
    const HandCreateTemFile = useCallback(async (e) => {
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {


            const selectedRows = getSelectedRowsA();

            const rowsWithStatusP = selectedRows
                .filter((row) => !row.Status || row.Status === '' || row.Status === 'P')
                .map((row) => ({
                    CodeQR: row.QrCodeOld,
                    IdSeq: row.IdSeq,
                    MaNVL: row.ItemNo,
                    Grade: row.Memo01,
                    Color: row.Color,
                    NCC: row.CustNo,
                    QtyBox: row.Qty,
                    PONo: row.Memo02,
                    BagBoxNo: row.ReelNo,
                    LotNo: row.LotNo,
                    ItemSeq: row.ItemSeq,
                    TenNVL: row.ItemName,
                    UnitName: row.UnitName,
                    NgayNhap: row.ProduDate ? dateFormat(row.ProduDate) : '',
                    TemType: 'O'
                }));

            if (rowsWithStatusP.length === 0) {
                HandleError([
                    {
                        success: false,
                        message: 'Kiểm tra lại mã in đã chọn!',
                    },
                ]);
                return;
            }

            const typeData = {
                PrintSeq: uuid,
                UserId: userFrom?.UserSeq || null,
                TypeFile: displayValue2 || 1
            };

            const response = await ItemPrintQRTaggingPrint(rowsWithStatusP, typeData);
            if (response?.success) {
                const merged = response?.data?.mergedFile;
                const hide = message.loading('Đang mở file, vui lòng chờ...', 0);

                if (merged) {
                    setGridDataB((prev) => {
                        const updated = [...prev, { ...merged }];
                        setNumRowsB(updated.length);
                        return updated;
                    });


                    if (merged.relativePath) {
                        const cleanedPath = merged.relativePath.replace(/^.*storage_erp[\\/]/, "");
                        const url = `${HOST_API_SERVER_19}/secure-file-item/${cleanedPath}`;

                        await openAndPrintPdf(url);

                        hide();


                    }
                }
            } else {
                HandleError([
                    {
                        success: false,
                        message: t(response?.message) || 'Đã xảy ra lỗi khi tạo file!',
                    },
                ]);
            }
        } catch (error) {
            HandleError([
                {
                    success: false,
                    message: t(error?.message) || 'Đã xảy ra lỗi trong quá trình tạo file!',
                },
            ]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [dataSearch, uuid, userFrom, t, selection, gridData, displayValue2]);



    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;

        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
            CreatedBy: userFrom?.UserSeq,
            UpdatedBy: userFrom?.UserSeq,
            StatusItem: 'U'
        }));
        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
            UpdatedBy: userFrom?.UserSeq,
            StatusItem: 'U'
        }));


        const requiredFields = [
            { key: 'ItemSeq', label: ' Thiết bị' },
            { key: 'CustSeq', label: 'Khách hàng' },
            { key: 'StockInDate', label: 'Ngày nhập kho' },
            { key: 'ProduDate', label: 'Ngày sản xuất' },
            { key: 'LotNo', label: 'Lot No' },
            { key: 'Qty', label: 'Số lượng' },
            { key: 'ReelNo', label: 'Số bao' },
            { key: 'BagType', label: 'Loại bao in' },
        ];
        const validateRequiredFields = (data, fields) =>
            data.flatMap((row, i) =>
                fields
                    .filter(({ key }) => !row[key]?.toString().trim())
                    .map(({ key, label }) => ({
                        row: i + 1,
                        field: key,
                        message: `Cột ${label} không được để trống (hàng ${i + 1})`,
                    }))
            );
        const errors = [
            ...validateRequiredFields(resulA, requiredFields),
            ...validateRequiredFields(resulU, requiredFields),
        ];

        if (errors.length > 0) {
            HandleError([
                {
                    success: false,
                    message: [
                        errors[0].message,
                        ...(errors.length > 1 ? [`...và còn ${errors.length - 1} lỗi khác.`] : []),
                    ],
                },
            ]);
            return;
        }
        if (resulA.length === 0 && resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(ItemPrintA(resulA));

            if (resulU.length > 0) apiCalls.push(ItemPrintU(resulU));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);

            if (!isSuccess) {
                HandleError(results);
                return;
            }
            const [addMenuRaw, uMenuRaw] =
                resulA.length && resulU.length
                    ? results
                    : resulA.length
                        ? [results[0], []]
                        : [[], results[0]];

            const addMenuData = addMenuRaw?.data || [];
            const uMenuData = uMenuRaw?.data || [];

            setGridData(prev => {
                const updated = prev.map(item => {
                    const found = [...addMenuData, ...uMenuData].find(x => x?.IdxNo === item?.IdxNo);
                    return found ? {
                        ...item, Status: '', IdSeq: found.IdSeq,
                        QrCodeOld: found.QrCodeOld,
                        LotNoFull: found.LotNoFull,
                        QtyOld: found.QtyOld,

                    } : item;
                });
                return updateIndexNo(updated);
            });

        } catch (error) {
            HandleError([
                {
                    success: false,
                    message: error.message || 'Đã xảy ra lỗi khi xóa!',
                },
            ]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData, canCreate, userFrom]);


    const handleDeleteDataSheet = useCallback(
        (e) => {
            if (canDelete === false) return;

            togglePageInteraction(true);
            loadingBarRef.current?.continuousStart();

            const selectedRows = getSelectedRowsA();

            const rowsWithStatusD = selectedRows
                .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === 'E')
                .map((row) => {
                    row.Status = 'D';
                    return { IdSeq: row.IdSeq, IdxNo: row.IdxNo };
                });

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');

            const finish = () => {
                loadingBarRef.current?.complete();
                togglePageInteraction(false);
            };

            if (rowsWithStatusD.length > 0) {
                ItemPrintD(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.IdSeq);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdSeq));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                        } else {
                            setGridData(prev => {
                                const updated = prev.map(item => {
                                    const isSelected = rowsWithStatusD.some(row => row.IdSeq === item.IdSeq);
                                    return isSelected ? { ...item, Status: 'E' } : item;
                                });
                                return updated;
                            });
                            HandleError([
                                {
                                    success: false,
                                    message: response.message || 'Đã xảy ra lỗi khi xóa!',
                                },
                            ]);
                        }
                    })
                    .catch((error) => {
                        HandleError([
                            {
                                success: false,
                                message: error.message || 'Đã xảy ra lỗi khi xóa!',
                            },
                        ]);
                    })
                    .finally(() => {
                        finish();
                    });
            } else {

                if (rowsWithStatusA.length > 0) {
                    const idsWithStatusA = rowsWithStatusA.map((row) => row.Id);
                    const remainingRows = gridData.filter((row) => !idsWithStatusA.includes(row.Id));
                    setGridData(updateIndexNo(remainingRows));
                    setNumRows(remainingRows.length);
                    resetTable();
                }
                finish();
            }
        },
        [gridData, selection]
    );
    return (
        <>
            <Helmet>
                <title>TMT</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg">
                        <div className="flex items-center justify-between bg-white p-1">
                            <TemNVLNewAction
                                handleSearchData={handleSearchData}
                                HandCreateTemFile={HandCreateTemFile}

                                handleSaveData={handleSaveData}
                                handleDeleteData={handleDeleteDataSheet}
                            />
                        </div>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <Splitter

                        >
                            <Splitter.Panel defaultSize="80%" min="50%">
                                <TemNVLNewTable
                                    setSelection={setSelection}
                                    selection={selection}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}
                                    numRows={numRows}
                                    setGridData={setGridData}
                                    gridData={gridData}
                                    setNumRows={setNumRows}
                                    setCols={setCols}
                                    cols={cols}
                                    canCreate={canCreate}
                                    defaultCols={defaultCols}
                                    canEdit={canEdit}
                                    setDrawerOpen={setDrawerOpen}
                                    helpData01={helpData01}
                                    setSearchText={setSearchText}
                                    searchText={searchText}
                                    setDataSearch={setDataSearch}

                                    helpData02={helpData02}
                                    setSearchText2={setSearchText2}
                                    searchText2={searchText2}
                                    setDataSearch2={setDataSearch2}
                                    helpData03={helpData03}
                                    StatusAssetM={StatusAssetM}
                                    setStatusAssetM={setStatusAssetM}
                                    setAssetName={setAssetName}
                                    setAssetCode={setAssetCode}
                                    AssetCode={AssetCode}
                                    AssetName={AssetName}

                                    handleRowAppend={handleRowAppend}
                                    setHelpData01={setHelpData01}
                                    setHelpData02={setHelpData02}
                                    setHelpData03={setHelpData03}



                                    setSearchText3={setSearchText3}
                                    searchText3={searchText3}
                                    setDataSearch3={setDataSearch3}
                                    setItemText3={setItemText3}


                                    formDate={formDate}
                                    setFormDate={setFormDate}
                                    toDate={toDate}
                                    setToDate={setToDate}

                                    LotNo={LotNo}
                                    setLotNo={setLotNo}
                                    ItemName={ItemName}
                                    setItemName={setItemName}
                                    ItemNo={ItemNo}
                                    setItemNo={setItemNo}
                                    setBagType={setBagType}
                                    setDataSheetSearch3={setDataSheetSearch3}
                                    setQrCode={setQrCode}
                                    QrCode={QrCode}
                                    displayValue2={displayValue2}
                                    setDisplayValue2={setDisplayValue2}
                                />
                            </Splitter.Panel>
                            <Splitter.Panel defaultSize="20%" min="20%">
                                <TemNVLNewLogFileTable
                                    setSelection={setSelectionB}
                                    selection={selectionB}
                                    showSearch={showSearchB}
                                    setShowSearch={setShowSearchB}
                                    numRows={numRowsB}
                                    setGridData={setGridDataB}
                                    gridData={gridDataB}
                                    setNumRows={setNumRowsB}
                                    setCols={setColsB}
                                    cols={colsB}
                                    canCreate={canCreate}
                                    defaultCols={defaultColsB}
                                    canEdit={canEdit}

                                    HandOpenFile={HandOpenFile}
                                    HandPrintFile={HandPrintFile}
                                />
                            </Splitter.Panel>
                        </Splitter>

                    </div>
                </div>
            </div>

        </>
    )
}
