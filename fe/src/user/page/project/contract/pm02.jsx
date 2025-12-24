import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { notification, message, Splitter } from 'antd'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { HandleError } from '../../default/handleError'
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../../utils/decode-JWT'


import PM02Action from '../../../components/actions/project/contract/pm02Action'
import PM02Query from '../../../components/query/project/contract/pm02Query'
import PM02Table from '../../../components/table/project/contract/pm02Table'
import PM02BTable from '../../../components/table/project/contract/pm02BTable'
import PM02CTable from '../../../components/table/project/contract/pm02CTable'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import { EmpSPH } from '../../../../features/codeHelp/EmpSPH'
import { PayConditionQ } from '../../../../features/project/PayConditionQ'
import { SPJTSupplyContractListQ } from '../../../../features/project/SPJTSupplyContractListQ'
import { SPJTSupplyContractResQ } from '../../../../features/project/SPJTSupplyContractResQ'
export default function PM02Page({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const langCode = localStorage.getItem('language') || '6';
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Tên hợp đồng'), id: 'SupplyContName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số hợp đồng'), id: 'SupplyContNo', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Bộ phận kinh doanh'), id: 'BizUnitName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Khách hàng'), id: 'SupplyContCustName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Ngày bắt đầu ký hợp đồng'), id: 'SupplyContDateFr', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày kết thúc hợp đồng'), id: 'SupplyContDateTo', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày ký hợp đồng'), id: 'RegDate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số tiền'), id: 'AMT', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Bộ phận phụ trách'), id: 'SupplyContDeptName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Người phụ trách'), id: 'SupplyContEmpName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: 'right' },
    ], [t]);
    const defaultColsB = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Nguồn cung ứng'), id: 'ResrcName', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số lượng'), id: 'Qty', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Đơn giá'), id: 'Price', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Số tiền'), id: 'Amt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Đơn giá tiền nguyên tệ'), id: 'DomPrice', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số tiền nguyên tệ'), id: 'DomAmt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thuế giá trị gia tăng'), id: 'VATAmt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Tổng số tiền nguyên tệ'), id: 'SumAmt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày dự định giao hàng'), id: 'DelvDueDate', kind: 'Text', readonly: false, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Dự án'), id: 'PJTName', kind: 'Text', readonly: false, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: 'right' },
        { title: t('Ghi chú nguồn cung ứng'), id: 'Remark', kind: 'Text', readonly: false, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: 'right' },
    ], [t]);
    const defaultColsC = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Điều kiện thanh tóan'), id: 'UMPayCondName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Tỷ lệ thanh toán'), id: 'PayRate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số tiền thanh toán'), id: 'PayAmt', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Số tiền chi trả (nguyên tệ)'), id: 'DomPayAmt', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thanh toán thuế VAT'), id: 'PayVATAmt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Thuế giá trị gia tăng thanh toán bằng nguyên tệ'), id: 'DomPayVATAmt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Tổng số tiền thanh toán'), id: 'SumPayAmt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Tổng số tiền thanh toán (nguyên tệ)'), id: 'DomSumPayAmt', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Ngày thanh toán dự kiến'), id: 'PayPlanDate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày lặp lại'), id: 'PayRepeatDate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ghi chú'), id: 'PayCondRemark', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Trạng thái thanh toán'), id: 'PayCondStatus', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    ], [t]);
    const [gridData, setGridData] = useState([])
    const [gridDataB, setGridDataB] = useState([])
    const [gridDataC, setGridDataC] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionB, setSelectionB] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionC, setSelectionC] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearchB, setShowSearchB] = useState(false)
    const [showSearchC, setShowSearchC] = useState(false)
    const [addedRows, setAddedRows] = useState([])

    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRowsB, setNumRowsB] = useState(0)
    const [numRowsC, setNumRowsC] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [keyItem1, setKeyItem1] = useState('')
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [keyItem4, setKeyItem4] = useState('')
    const [keyItem5, setKeyItem5] = useState('')




    const [whName, setWHName] = useState('')
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])

    const [itemName, setItemName] = useState('')
    const [itemCode, setItemCode] = useState('')
    const [BizUnit, setBizUnit] = useState('')
    const [SupplyContName, setSupplyContName] = useState('')
    const [SupplyContNo, setSupplyContNo] = useState('')
    const [UMSupplyContType, setUMSupplyContType] = useState('')
    const [spec, setSpec] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [formDate, setFormDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs())
    const formatDate = (date) => date.format('YYYYMMDD')
    const [ReqNo, setReqNo] = useState('')
    const [TrackingNo, setTrackingNo] = useState('')
    const [InvoiceNo, setInvoiceNo] = useState('')
    const [LotNo, setLotNo] = useState('')
    const [SerialNo, setSerialNo] = useState('')

    const [searchText3, setSearchText3] = useState('')
    const [dataSearch3, setDataSearch3] = useState([])
    const [itemText3, setItemText3] = useState(null)
    const [dataSheetSearch3, setDataSheetSearch3] = useState([])


    const [searchText2, setSearchText2] = useState('')
    const [dataSearch2, setDataSearch2] = useState([])
    const [itemText2, setItemText2] = useState(null)
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])


    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState('')
    const [dataSearch, setDataSearch] = useState([])
    const [itemText, setItemText] = useState(null)
    const [itemText1, setItemText1] = useState(null)
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pm02_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [colsB, setColsB] = useState(() =>
        loadFromLocalStorageSheet(
            'pm02_b_a',
            defaultColsB.filter((col) => col.visible)
        )
    )
    const [colsC, setColsC] = useState(() =>
        loadFromLocalStorageSheet(
            'pm02_c_a',
            defaultColsC.filter((col) => col.visible)
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
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
        }
    };

    const handleSearchData = useCallback(async () => {
        if (!formDate || !toDate) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng chọn thời gian trước khi tìm kiếm!',
                },
            ]);
            return;
        }
        const searchParams = [{
            QryFrDate: formDate ? formatDate(formDate) : '',
            QryToDate: toDate ? formatDate(toDate) : '',
            BizUnit: BizUnit || '',
            SupplyContName: SupplyContName || '',
            SupplyContNo: SupplyContNo || '',
            SupplyContCustSeq: dataSearch3?.CustSeq || "",
            UMSupplyContType: '',
            SupplyContEmpSeq: dataSearch?.EmpSeq || "",
            SupplyContDeptSeq: dataSearch2?.BeDeptSeq || "",
            ResrcName: '',
            SMSupplyChkType: '',
            PJTSeq: '',
            PJTName: '',
        }]
        fetchGenericData({
            controllerKey: 'SPJTSupplyContractListQ',
            postFunction: SPJTSupplyContractListQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length + 1);
            },
        });

    }, [formDate, toDate, BizUnit, SupplyContName, SupplyContNo, dataSearch3, dataSearch, dataSearch2]);



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
                GetCodeHelpComboVer2('', langCode, 10003, 1, '%', '', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '7021', '1001', '1', '', signal),

                GetCodeHelpVer2(17041, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
            setHelpData04(res4.status === 'fulfilled' ? res4.value?.data || [] : []);
            setHelpData05(res5.status === 'fulfilled' ? res5.value?.data || [] : []);
        } finally {
            decreaseFetchCount();
            controllers.current.fetchCodeHelpData = null;
        }
    }, [langCode]);
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


    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
                (row) => row !== undefined,
            ),
        )
    }


    const nextPageScanStockIn = useCallback((filteredData, formDataDtl) => {
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();


    }, []);


    const getSelectedRowsA = () => {
        return selection.rows.items.flatMap(([start, end]) =>
            gridData.slice(start, end)
        );
    };
    useEffect(() => {
        const data = getSelectedRowsA();

        if (!data || data.length === 0) return;

        const seq = data[0]?.SupplyContSeq;
        if (seq == null || seq === '') return;

        const searchParams = [{
            SupplyContSeq: data[0]?.SupplyContSeq,
        }]

        const searchParams2 = {
            KeyItem1: data[0]?.SupplyContSeq,
            KeyItem2: 'HĐ',
        }
        fetchGenericData({
            controllerKey: 'SPJTSupplyContractResQ',
            postFunction: SPJTSupplyContractResQ,
            searchParams,
            defaultCols: defaultColsB,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridDataB(data);
                setNumRowsB(data.length + 1);
            },
        });
        fetchGenericData({
            controllerKey: 'PayConditionQ',
            postFunction: PayConditionQ,
            searchParams: searchParams2,
            defaultCols: defaultColsC,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridDataC(data);
                setNumRowsC(data.length + 1);
            },
        });
    }, [selection.rows.items]);

    const nextPage = useCallback(() => {
        const selected = getSelectedRowsData();
        if (!selected?.length) return;
        const filteredData = { SupplyContSeq: selected[0]?.SupplyContSeq, BizUnitName: selected[0]?.BizUnitName };

        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(filteredData),
            'KEY_PATH_ERP'
        ).toString();
        const encryptedToken = encodeBase64Url(encryptedData);
        const route = `/pm/project-mgmt/pm01/${encryptedToken}`;
        const isElectron = !!window?.electron?.openRoute;
        isElectron
            ? window.electron.openRoute(route)
            : window.open(route, '_blank');

        localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true));
    }, [gridData, userFrom, selection]);

    return (
        <>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg">
                        <div className="flex items-center  justify-end bg-white p-1">
                            <PM02Action
                                handleSearchData={handleSearchData}
                                nextPage={nextPage}
                            />
                        </div>

                        <details
                            className="group [&_summary::-webkit-details-marker]:hidden border-t   bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-1 gap-1.5 border-b text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[9px] font-medium flex items-center text-blue-800   uppercase">
                                    {t('Điều kiện truy vấn')}
                                </h2>
                            </summary>
                            <PM02Query
                                helpData01={helpData01}
                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}
                                helpData05={helpData05}
                                setHelpData05={setHelpData05}
                                BizUnit={BizUnit}
                                setBizUnit={setBizUnit}
                                setUMSupplyContType={setUMSupplyContType}
                                formDate={formDate}
                                setFormDate={setFormDate}
                                toDate={toDate}
                                setToDate={setToDate}
                                SupplyContNo={SupplyContNo}
                                setSupplyContNo={setSupplyContNo}
                                SupplyContName={SupplyContName}
                                setSupplyContName={setSupplyContName}



                                setSearchText3={setSearchText3}
                                searchText3={searchText3}
                                setDataSearch3={setDataSearch3}
                                setItemText3={setItemText3}
                                setDataSheetSearch3={setDataSheetSearch3}



                                setSearchText2={setSearchText2}
                                searchText2={searchText2}
                                setDataSearch2={setDataSearch2}
                                setItemText2={setItemText2}
                                setDataSheetSearch2={setDataSheetSearch2}


                                setSearchText={setSearchText}
                                searchText={searchText}
                                setDataSearch={setDataSearch}
                                setItemText={setItemText}
                                setDataSheetSearch={setDataSheetSearch}
                                setSearchText1={setSearchText1}
                                setItemText1={setItemText1}
                                setDataSearch1={setDataSearch1}

                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-auto">

                        <Splitter layout="vertical" className="w-full">
                            <Splitter.Panel defaultSize="55%" min="35%" className="w-full">
                                <PM02Table
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
                            </Splitter.Panel>

                            <Splitter.Panel defaultSize="45%" min="35%" className="w-full">
                                <Splitter className="w-full">
                                    <Splitter.Panel defaultSize="45%" min="35%" className="w-full">
                                        <PM02BTable
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




                                        />
                                    </Splitter.Panel>

                                    <Splitter.Panel defaultSize="55%" min="45%" className="w-full">
                                        <PM02CTable
                                            setSelection={setSelectionC}
                                            selection={selectionC}
                                            showSearch={showSearchC}
                                            setShowSearch={setShowSearchC}
                                            numRows={numRowsC}
                                            setGridData={setGridDataC}
                                            gridData={gridDataC}
                                            setNumRows={setNumRowsC}
                                            setCols={setColsC}
                                            cols={colsC}
                                            canCreate={canCreate}
                                            defaultCols={defaultColsC}
                                            canEdit={canEdit}
                                        />
                                    </Splitter.Panel>
                                </Splitter>
                            </Splitter.Panel>
                        </Splitter>

                    </div>
                </div>
            </div>

        </>
    )
}
