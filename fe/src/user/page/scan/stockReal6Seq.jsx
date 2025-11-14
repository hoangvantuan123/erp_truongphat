import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, notification, message, Splitter } from 'antd'
import {
    useNavigate, useParams, createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { HandleError } from '../default/handleError'
import { debounce } from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import TemNVLNewLogFileTable from '../../components/table/mngTemNvl/temNVLNewLogFIleTable'
import { Helmet } from 'react-helmet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import dayjs from 'dayjs'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import StockReal6Table from '../../components/table/scan/StockReal6Table'
import { StockRealOpenQ } from '../../../features/warehouse/StockRealOpen/StockRealOpenQ'
import { SLGWHStockRealOpenQ } from '../../../features/warehouse/StockRealOpen/SLGWHStockRealOpenQ'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { EmpSPH } from '../../../features/codeHelp/EmpSPH'
import { GetMasterQuery } from '../../../features/warehouse/lgWHStockRealOpenResult/getMasterQuery'
import StockReal6SeqAction from '../../components/actions/scan/stockReal6SeqAction'
import StockReal6SeqQuery from '../../components/query/scan/StockReal6SeqQuery'
import StockReal6SeqTable from '../../components/table/scan/StockReal6SeqTable'
export default function StockReal6Seq({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { seq } = useParams()
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 60, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('LotNo'), id: 'LotNo', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('2091'), id: 'ItemNo', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Số lượng'), id: 'Qty', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('2090'), id: 'ItemName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('551'), id: 'Spec', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('602'), id: 'UnitName', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Mã quét'), id: 'Barcode', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
    ], [t]);


    const secretKey = 'KEY_PATH'
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
    const [addedRows, setAddedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [searchText3, setSearchText3] = useState('')
    const [dataSearch3, setDataSearch3] = useState([])
    const [itemText3, setItemText3] = useState(null)
    const [LotNo, setLotNo] = useState('')
    const [StkMngNo, setStkMngNo] = useState('')

    const [ItemName, setItemName] = useState('')
    const [ItemNo, setItemNo] = useState('')
    const [formDate, setFormDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs())
    const [bagType, setBagType] = useState('')
    const [QrCode, setQrCode] = useState('')
    const [QrCodeNew, setQrCodeNew] = useState('')
    const [displayValue2, setDisplayValue2] = useState('1');
    const [BizUnit, setBizUnit] = useState('')
    const [typeName, setTypeName] = useState('0')
    const [IsChangedMst, setIsChangedMst] = useState('0')
    const formatDate = (date) => date.format('YYYYMMDD')
    const [dataSheetSearch3, setDataSheetSearch3] = useState([])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'tem_nvl_used_a',
            defaultCols.filter((col) => col.visible)
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
    const decodeBase64Url = (base64Url) => {
        try {
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const padding =
                base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
            return base64 + padding
        } catch (error) {
            throw new Error('Invalid Base64 URL')
        }
    }

    const decryptData = (encryptedToken) => {
        try {
            const base64Data = decodeBase64Url(encryptedToken)
            const bytes = CryptoJS.AES.decrypt(base64Data, secretKey)
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
            return JSON.parse(decryptedData)
        } catch (error) {
            return null
        }
    }
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
        const searchParams = [
            {
                IsChangedMst: IsChangedMst || 0,
                BizUnit: BizUnit || '',
                StkDate: formDate ? formatDate(formDate) : '',
                StkDateTo: toDate ? formatDate(toDate) : '',
                WHSeq: dataSearch2 ? dataSearch2?.WHSeq : '',
                StkMngNo: StkMngNo || '',
                EmpSeq: dataSearch3 ? dataSearch3?.EmpSeq : '',
            },
        ]


    }, [formDate, toDate, dataSearch3, dataSearch2, StkMngNo]);



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
    const getSelectedRowsB = () => {
        return selectionB.rows.items.flatMap(([start, end]) =>
            gridDataB.slice(start, end)
        );
    };
    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
                (row) => row !== undefined,
            ),
        )
    }



    useEffect(() => {
        if (!seq) return;

        const decrypted = decryptData(seq);
        console.log('decrypted', decrypted)
        if (!decrypted?.[0].StkMngSeq) {
            return;
        }
        const searchParams = [{
            StkMngSeq: decrypted?.[0].StkMngSeq,
        }]
        fetchGenericData({
            controllerKey: 'SLGWHStockRealOpenQ',
            postFunction: SLGWHStockRealOpenQ,
            searchParams,
            defaultCols: null,
            useEmptyData: false,
            afterFetch: (fetchedData) => {
                setHelpData01(fetchedData);
            },
        });

    }, [seq]);

    return (
        <>
            <Helmet>
                <title>TMT</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="h-screen flex flex-col overflow-hidden">
                <div className="flex flex-col h-full">


                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg">
                        <div className="flex items-center justify-between bg-white p-2">
                            <StockReal6SeqAction handleSearchData={handleSearchData} />
                        </div>


                        <div className='flex items-center px-2 p-1 uppercase  text-blue-800 justify-between border-t text-[13px]  border-b   font-medium'>
                            <span>Thông tin yêu cầu</span>
                        </div>
                        <StockReal6SeqQuery
                            formDate={formDate}
                            setFormDate={setFormDate}
                            toDate={toDate}
                            setToDate={setToDate}
                            helpData01={helpData01}
                            helpData02={helpData02}
                            helpData03={helpData03}
                            setHelpData03={setHelpData03}
                            setBizUnit={setBizUnit}
                            BizUnit={BizUnit}


                            searchText2={searchText2}
                            setSearchText2={setSearchText2}
                            dataSearch2={dataSearch2}
                            setDataSearch2={setDataSearch2}


                            searchText3={searchText3}
                            setSearchText3={setSearchText3}
                            dataSearch3={dataSearch3}
                            setDataSearch3={setDataSearch3}

                            StkMngNo={StkMngNo}
                            setStkMngNo={setStkMngNo}
                            IsChangedMst={IsChangedMst}
                            setIsChangedMst={setIsChangedMst}
                        />
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <StockReal6SeqTable
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
