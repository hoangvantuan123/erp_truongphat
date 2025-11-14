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
import { Helmet } from 'react-helmet'
import dayjs from 'dayjs'
import { RMLabelMergeDocx } from '../../../features/upload/print/RMLabelMergeDocx'
import { TempFileH } from '../../../features/codeHelp/TempFileH'
import { HOST_API_SERVER_18 } from '../../../services'
import HistoryTemNVLNewQuery from '../../components/query/mngTemNvl/HistoryTemNVLNewQuery'
import HistoryTemNVLNewAction from '../../components/actions/mngTemNvl/HistoryTemNVLNewAction'
import HistoryTemNVLNewTable from '../../components/table/mngTemNvl/historyTemNVLNewTable'
import HistoryTemNVLNewBQuery from '../../components/query/mngTemNvl/historyTemNVLNewBQuery'
import { ItemPrintQRTaggingPrintQ } from '../../../features/print/item/ItemPrintQRTaggingPrintQ'
import { FilePrintD } from '../../../features/upload/filePrint/FilePrintD'
import { HOST_API_SERVER_19 } from '../../../services'
export default function HistoryTemNVLNew({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: true }, icon: GridColumnIcon.HeaderLookup },
        { title: t('QR Code'), id: 'QrCode', kind: 'Text', readonly: false, width: 250, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Tên sản phẩm'), id: 'ItemName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Mã sản phẩm'), id: 'ItemNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Quy cách'), id: 'Spec', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Form In'), id: 'FileSeq', kind: 'Text', readonly: false, width: 270, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('File'), id: 'NameFile', kind: 'Text', readonly: false, width: 290, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Loại tem'), id: 'TemType', kind: 'Text', readonly: false, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Loại In'), id: 'TypePrint', kind: 'Text', readonly: false, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Người thực hiện'), id: 'CreateName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thời gian thực hiện'), id: 'CreatedAt', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    ], [t]);


    const [gridData, setGridData] = useState([

    ]
    )
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
    const [helpData03, setHelpData03] = useState([])
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
    const [QrCode, setQrCode] = useState('')
    const [ItemName, setItemName] = useState('')
    const [ItemNo, setItemNo] = useState('')
    const [formDate, setFormDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs())
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'history_tem_nvl_new_a',
            defaultCols.filter((col) => col.visible)
        )
    )


    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    useEffect(() => {
        cancelAllRequests()
        notification.destroy();
        message.destroy();
    }, [])

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
            KeyItem5: QrCode || '',
        };
        fetchGenericData({
            controllerKey: 'ItemPrintQRTaggingPrintQ',
            postFunction: ItemPrintQRTaggingPrintQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [dataSearch, formDate, toDate, ItemNo, QrCode, ItemName,]);



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
            ]);


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


    const printBlobViaNewWindow = (blobUrl) => {
        return new Promise((resolve, reject) => {
            const printWindow = window.open(blobUrl, '_blank');

            if (!printWindow) {
                return reject(new Error('Không mở được cửa sổ in (bị chặn popup).'));
            }

            const timeout = 10000;
            const interval = 100;
            let waited = 0;

            const timer = setInterval(() => {
                try {
                    if (printWindow.document.readyState === 'complete') {
                        clearInterval(timer);
                        printWindow.focus();
                        printWindow.print();
                        resolve();
                    }
                } catch (e) {
                }

                waited += interval;
                if (waited >= timeout) {
                    clearInterval(timer);
                    reject(new Error('Timeout khi chờ tài liệu tải xong để in.'));
                }
            }, interval);
        });
    };

    const printPdfFilesFromUrls = async (pdfUrls = []) => {
        for (const url of pdfUrls) {
            try {
                const response = await fetch(url, { credentials: 'include' });
                if (!response.ok) throw new Error(`Fetch thất bại: ${response.status}`);

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                try {
                    await printBlobViaNewWindow(blobUrl);
                } finally {
                    URL.revokeObjectURL(blobUrl);
                }
            } catch (err) {
                HandleError([
                    {
                        success: false,
                        message: `Lỗi khi in file ${url}: ${err.message || 'Không xác định'}`,
                    },
                ]);
            }
        }
    };





    const getSelectedRows = () => {
        return selection.rows.items.flatMap(([start, end]) =>
            gridData.slice(start, end)
        );
    };
    const HandOpenFile = useCallback(async () => {
        try {
            const selectedRows = getSelectedRows();

            if (!selectedRows || selectedRows.length === 0) {
                return HandleError([{ success: false, message: 'Chưa chọn file nào!' }]);
            }

            const pdfUrls = selectedRows
                .map(row => {
                    const pathPdf = row.PathFile;
                    if (!pathPdf) return null;
                    const cleanedPath = pathPdf.replace(/^.*storage_erp[\\/]/, "");
                    return `${HOST_API_SERVER_19}/secure-file-item/${cleanedPath}`;
                })
                .filter(Boolean); // loại bỏ các null

            if (pdfUrls.length === 0) {
                return HandleError([{ success: false, message: 'Không có file hợp lệ để mở!' }]);
            }

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
    }, [selection, gridData]);
    const HandDownloadFile = useCallback(async () => {
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();
        try {
            const selectedRows = getSelectedRows();

            if (!selectedRows || selectedRows.length === 0) {
                return HandleError([{ success: false, message: 'Chưa chọn file nào!' }]);
            }

            for (const row of selectedRows) {
                const pathFile = row.PathFile;
                if (!pathFile) continue;

                const fileName = pathFile.split("\\").pop() || "file.pdf";
                const cleanedPath = pathFile.replace(/^.*storage_erp[\\/]/, "");
                const url = `${HOST_API_SERVER_19}/secure-file-item/${cleanedPath}`;

                const response = await fetch(url, { method: 'GET' });
                if (!response.ok) continue;

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(blobUrl);
            }
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        } catch (error) {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
            HandleError([{ success: false, message: 'Đã xảy ra lỗi khi download!' }]);
        }
    }, [selection, gridData]);

    const openAndPrintPdf = async (url) => {
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();
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

            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        } catch (err) {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
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
            const selectedRows = getSelectedRows();

            if (!selectedRows || selectedRows.length === 0) {
                return HandleError([{ success: false, message: "Chưa chọn file nào!" }]);
            }

            // Lấy danh sách URL in
            const pdfUrls = selectedRows.map((row) => {
                const cleanedPath = row.PathFile.replace(/^.*storage_erp[\\/]/, "");
                return `${HOST_API_SERVER_19}/secure-file-item/${cleanedPath}`;
            });

            await openAndPrintPdf(pdfUrls);
        } catch (error) {
            HandleError([{ success: false, message: t(error?.message) }]);
        }
    }, [selection, gridData]);
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
                    return { IdSeq: row.IdSeq, IdxNo: row.IdxNo, FileSeq: row.FileSeq, PathFile: row.PathFile };
                });

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');

            const finish = () => {
                loadingBarRef.current?.complete();
                togglePageInteraction(false);
            };

            if (rowsWithStatusD.length > 0) {
                FilePrintD(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.FileSeq);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.FileSeq));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                        } else {
                            setGridData(prev => {
                                const updated = prev.map(item => {
                                    const isSelected = rowsWithStatusD.some(row => row.FileSeq === item.FileSeq);
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
            <div className="h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg">
                        <div className="flex items-center justify-between p-1">
                            <HistoryTemNVLNewAction
                                handleSearchData={handleSearchData}
                                HandOpenFile={HandOpenFile}
                                HandDownloadFile={HandDownloadFile}
                                HandPrintFile={HandPrintFile}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                            />
                        </div>
                        <div className='flex items-center px-2 p-1 justify-between border-t text-[13px]  border-b text-black  font-medium'>
                            <span>ĐIỀU KIỆN TRUY VẤN</span>
                        </div>
                        <HistoryTemNVLNewQuery
                            formDate={formDate}
                            setFormDate={setFormDate}
                            toDate={toDate}
                            setToDate={setToDate}
                            ItemName={ItemName}
                            setItemName={setItemName}
                            ItemNo={ItemNo}
                            setItemNo={setItemNo}

                            setQrCode={setQrCode}
                            QrCode={QrCode}
                        />


                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <HistoryTemNVLNewTable
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
                        />

                    </div>
                </div>
            </div>

        </>
    )
}
