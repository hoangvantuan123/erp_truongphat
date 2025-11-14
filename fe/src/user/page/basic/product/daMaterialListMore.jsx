import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../../components/icons'
import { Input, Typography, Row, Col, message, Splitter } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import useKeydownHandler from '../../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../../components/hooks/sheet/useDynamicFilter'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpCombo } from '../../../../features/codeHelp/getCodeHelpCombo'
import ErrorListModal from '../../default/errorListModal'
import ModalSheetDelete from '../../../components/modal/default/deleteSheet'
import { getQMore } from '../../../../features/basic/daMaterialList/getQMore'
import { GetItemListBaseQuery } from '../../../../features/basic/daMaterialList/get'

import DaMaterialListMoreQuery from '../../../components/query/basic/daMaterialListMoreQuery'
import TableDaMaterialListMore from '../../../components/table/basic/tableDaMaterialListMore'
import TabViewDeMaterSeq from '../../../components/view/basic/tabViewDeMaterSeq'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import { filterAndSelectColumns } from '../../../../utils/filterUorA'
import { PostAMoreItem } from '../../../../features/basic/daMaterialList/postAMore'
import { PostUMoreItem } from '../../../../features/basic/daMaterialList/postUMore'
import { PostDMoreItem } from '../../../../features/basic/daMaterialList/postDMore'
import DaMaterialListMoreAction from '../../../components/actions/basic/product/daMaterialListMoreAction'
import { uploadFilesItems } from '../../../../features/upload/postFileItems'
import { getQFileSeq } from '../../../../features/basic/daMaterialList/getQFileSeq'
import { deleteDataSheet } from '../../../../utils/deleteUtils'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { PostDFilesItems } from '../../../../features/upload/postDFileItems'
import { SDAItemListQ } from '../../../../features/basic/daMaterialList/SDAItemListQ'
import TopLoadingBar from 'react-top-loading-bar';
export default function DaMaterialListMore({
    permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete, controllers,
    cancelAllRequests
}) {
    const { t } = useTranslation()
    const formatDate = (date) => date.format('YYYYMMDD')
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const defaultCols = useMemo(
        () => [
            { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
            { title: t('1786'), id: 'ItemName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
            { title: t('2091'), id: 'ItemNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
            { title: t('551'), id: 'Spec', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        ],
        [t],
    )
    const defaultColsB = useMemo(
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
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },


            {
                title: 'P/N',
                id: 'P_N',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: 'RefDES',
                id: 'RefDES',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: t('5309'),
                id: 'Maker',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: t('10053296'),
                id: 'MfrPartNumber',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: t('646'),
                id: 'Description',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: 'Col01',
                id: 'Col01',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: 'Col02',
                id: 'Col02',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: 'Col03',
                id: 'Col03',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: 'Col04',
                id: 'Col04',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: 'Col05',
                id: 'Col05',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },
            {
                title: 'Col06',
                id: 'Col06',
                kind: 'Text',
                readonly: false,
                width: 200,
                hasMenu: true,
                visible: false,
                icon: GridColumnIcon.HeaderString,
                trailingRowOptions: {
                    disabled: true,
                },
            },

        ],
        [t],
    )


    const defaultColsC = useMemo(
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
                title: 'File',
                id: 'OriginalName',
                kind: 'Uri',
                readonly: true,
                width: 500,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderUri,
            },
            {
                title: 'FileSeq',
                id: 'Filename',
                kind: 'Text',
                readonly: true,
                width: 500,
                hasMenu: true,
                visible: false,
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

        ],
        [t],
    )
    const defaultColsD = useMemo(
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
                title: 'File',
                id: 'OriginalName',
                kind: 'Uri',
                readonly: true,
                width: 500,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderUri,
            },
            {
                title: 'FileSeq',
                id: 'Filename',
                kind: 'Uri',
                readonly: true,
                width: 500,
                hasMenu: true,
                visible: true,
                icon: GridColumnIcon.HeaderUri,
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

        ],
        [t],
    )
    const [loading, setLoading] = useState(false)
    const [menus, setMenus] = useState([])
    const [gridData, setGridData] = useState([])
    const [gridDataB, setGridDataB] = useState([])
    const [gridDataC, setGridDataC] = useState([]);
    const [gridDataD, setGridDataD] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [selectionB, setSelectionB] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [selectionC, setSelectionC] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [selectionD, setSelectionD] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [showSearch, setShowSearch] = useState(false)
    const [lastClickedCell, setLastClickedCell] = useState(null)
    const [addedRows, setAddedRows] = useState([])
    const [addedRowsB, setAddedRowsB] = useState([])
    const [addedRowsC, setAddedRowsC] = useState([])

    const [editedRows, setEditedRows] = useState([])
    const [editedRowsB, setEditedRowsB] = useState([])
    const [editedRowsC, setEditedRowsC] = useState([])
    const [editedRowsD, setEditedRowsD] = useState([])
    const [clickedRowData, setClickedRowData] = useState(null)
    const [isMinusClicked, setIsMinusClicked] = useState(false)
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRowsToAddB, setNumRowsToAddB] = useState(null)
    const [numRowsToAddD, setNumRowsToAddD] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRowsB, setNumRowsB] = useState(0)
    const [numRowsC, setNumRowsC] = useState(0)
    const [numRowsD, setNumRowsD] = useState(0)
    const [clickCount, setClickCount] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [isCellSelectedB, setIsCellSelectedB] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [dataCommissionCust, setDataCommissionCust] = useState([])
    const [dataUnit, setDataUnit] = useState([])
    const [dataNaWare, setDataNaWare] = useState([])
    const [dataMngDeptName, setDataMngDeptName] = useState([])
    const [dataUMRegion, setDataUMRegion] = useState([])
    const [dataScopeName, setDataScopeName] = useState([])
    const [dataError, setDataError] = useState([])
    const [isDeleting, setIsDeleting] = useState(false)
    const [dataSub, setDataSub] = useState([])
    const [selectedImages, setSelectedImages] = useState([]);
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'da_material_list_more_a',
            defaultCols.filter((col) => col.visible),
        ),
    )
    const [colsB, setColsB] = useState(() =>
        loadFromLocalStorageSheet(
            'da_material_list_more_b',
            defaultColsB.filter((col) => col.visible),
        ),
    )
    const [colsC, setColsC] = useState(() =>
        loadFromLocalStorageSheet(
            'da_material_list_more_c',
            defaultColsC.filter((col) => col.visible),
        ),
    )
    const [colsD, setColsD] = useState(() =>
        loadFromLocalStorageSheet(
            'da_material_list_more_d',
            defaultColsD.filter((col) => col.visible),
        ),
    )

    const [isAPISuccess, setIsAPISuccess] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [set10012, setSet10012] = useState(null); // Phân loại danh mục hàng
    const [set6004, setSet6004] = useState(null);   // Phương thức kế toán lượng tiêu thụ
    const [set6005, setSet6005] = useState(null);   // Phân loại xuất nhập
    const [set6006, setSet6006] = useState(null);   // Phân loại loại hình sản xuất
    const [set6007, setSet6007] = useState(null);   // Thông số kỹ thuật sản xuất
    const [set8047, setSet8047] = useState(null);   // Phân loại thời gian giao hàng
    const [set8048, setSet8048] = useState(null);   // Phân loại yêu cầu mua hàng sản xuất
    const [set2002, setSet2002] = useState(null);   // Tầm quan trọng
    const [set8007, setSet8007] = useState(null);   // Hình thức mua hàng
    const [set8004, setSet8004] = useState(null);   // Phân loại hạn sử dụng (Thứ 2 và Chủ nhật)
    const [set2001, setSet2001] = useState(null);   // Hiện trạng hạn mục sản phẩm
    const [set2003, setSet2003] = useState(null);   // Phân loại thuế
    const [set8028, setSet8028] = useState(null);   // % 0 10 % chủng loại giá trị gia tăng
    const [set10007, setSet10007] = useState(null); // Dữ liệu cho mã 10007
    const [set10014, setSet10014] = useState(null); // Dữ liệu cho mã 10014
    const [set10010, setSet10010] = useState(null); // Dữ liệu cho mã 10010
    const [set10009, setSet10009] = useState(null); // Dữ liệu cho mã 10009
    const [set17001, setSet17001] = useState(null); // Dữ liệu cho mã 17001

    const [set2004, setSet2004] = useState(null); // Dữ liệu cho mã 2004
    const [set2005, setSet2005] = useState(null); // Dữ liệu cho mã 2005
    const [set2006, setSet2006] = useState(null); // Dữ liệu cho mã 2006

    /* Q */
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())
    const [key10012, setKey10012] = useState('')
    const [key10010, setKey10010] = useState('')
    const [keyItemName, setKeyItemName] = useState('')
    const [keyItemNo, setKeyItemNo] = useState('')
    const [keySpec, setKeySpec] = useState('')
    const [keyDeptSeq, setKeyDeptSeq] = useState('')
    const [keyEmpSeq, setKeyEmpSeq] = useState('')

    const [UMItemClassS, setUMItemClassS] = useState('')
    const [UMItemClassL, setUMItemClassL] = useState('')
    const [UMItemClassM, setUMItemClassM] = useState('')
    const [dataType, setDataType] = useState([])
    const [uploading, setUploading] = useState(false);

    const fieldsToTrack = [
    ]
    const { filterValidEntries, findLastEntry, findMissingIds } =
        useDynamicFilter(gridData, fieldsToTrack)
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }
    const resetTableB = () => {
        setSelectionB({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }
    const resetTableC = () => {
        setSelectionC({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }
    const resetTableD = () => {
        setSelectionD({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
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
    const fetchData = useCallback(async () => {


        const searchParams = [
            {
                AssetSeq: key10012,
                UMItemClassL: UMItemClassL,
                UMItemClassM: UMItemClassM,
                UMItemClassS: UMItemClassS,
                DeptSeq: keyDeptSeq,
                EmpSeq: keyEmpSeq,
                ItemName: keyItemName,
                ItemNo: keyItemNo,
                Spec: keySpec,
                FromDate: formData ? formatDate(formData) : '',
                ToDate: toDate ? formatDate(toDate) : '',
            },
        ]

        fetchGenericData({
            controllerKey: 'SDAItemListQ',
            postFunction: SDAItemListQ,
            searchParams,
            defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [formData, toDate, key10012, keyItemName, keyItemNo, keySpec, keyDeptSeq, keyEmpSeq, UMItemClassS, UMItemClassM, UMItemClassL])
    const fetchDataSeq = useCallback(async (ItemNoSeq) => {
        setLoading(true)
        if (controllers.current.fetchDataSeq) {
            controllers.current.fetchDataSeq.abort();
            controllers.current.fetchDataSeq = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchDataSeq = controller;
        try {
            const response = await getQMore(ItemNoSeq, signal)

            if (response.success) {
                const fetchedData = response.data.data || []
                const emptyData = generateEmptyData(50, defaultColsB)
                const combinedData = [...fetchedData, ...emptyData];
                const updatedData = updateIndexNo(combinedData);
                setGridDataB(updatedData)
                setNumRowsB(fetchedData.length + emptyData.length)
                resetTableB()

            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
            const emptyData = generateEmptyData(50, defaultColsB)
            const updatedEmptyData = updateIndexNo(emptyData);
            setGridDataB(updatedEmptyData)
            setNumRowsB(emptyData.length)
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            controllers.current.fetchDataSeq = null;
            setLoading(false)
        }
    }, [])
    const fetchDataCSeq = useCallback(async (ItemNoSeq, FormCode) => {
        setLoading(true)
        if (controllers.current.fetchDataCSeq) {
            controllers.current.fetchDataCSeq.abort();
            controllers.current.fetchDataCSeq = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;
        const TableName = '_DA_MATERIAL_LIST_MORE'
        controllers.current.fetchDataCSeq = controller;
        try {

            const response = await getQFileSeq(ItemNoSeq, FormCode, TableName, signal)

            if (response.success) {
                const fetchedData = response.data.data || []
                setGridDataC(fetchedData)
                setNumRowsC(fetchedData.length)

            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
            setGridDataC([])
            setNumRowsC(0)
        } finally {
            setLoading(false)
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            controllers.current.fetchDataCSeq = null;
        }
    }, [])
    const fetchDataDSeq = useCallback(async (ItemNoSeq, FormCode) => {
        setLoading(true)
        if (controllers.current.fetchDataDSeq) {
            controllers.current.fetchDataDSeq.abort();
            controllers.current.fetchDataDSeq = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;
        const TableName = '_DA_MATERIAL_LIST_MORE'
        controllers.current.fetchDataDSeq = controller;
        try {

            const response = await getQFileSeq(ItemNoSeq, FormCode, TableName, signal)

            if (response.success) {
                const fetchedData = response.data.data || []
                setGridDataD(fetchedData)
                setNumRowsD(fetchedData.length)

            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
            setGridDataD([])
            setNumRowsD(0)
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            controllers.current.fetchDataDSeq = null;
            setLoading(false)
        }
    }, [])

    const getSelectedRowsDataA = () => {
        const selectedRows = selection.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
        );
    };
    useEffect(() => {
        const data = getSelectedRowsDataA();
        if (data && data.length > 0) {
            if (data[0].ItemSeq !== "") {
                setDataType(data)
                fetchDataSeq(data[0]?.ItemSeq)
                fetchDataCSeq(data[0]?.ItemSeq, 'file')
                fetchDataDSeq(data[0]?.ItemSeq, 'img')
                setDataSub(data)
                setFileList([])
            } else {
                setDataType([])
                setGridDataB([])
                setGridDataC([])
                setGridDataD([])
                setNumRowsB(0)
                setNumRowsC(0)
                setNumRowsD(0)
                setDataSub([])
                setFileList([])
            }

        } else {
            setDataType([])
            setGridDataB([])
            setGridDataC([])
            setGridDataD([])
            setNumRowsB(0)
            setNumRowsC(0)
            setNumRowsD(0)
            setDataSub([])
            setFileList([])
        }
    }, [selection.rows.items, gridData]);

    const fetchCodeHelpData = useCallback(async () => {
        setLoading(true);
        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchCodeHelpData = controller;
        try {
            const [
                data10012, data6004, data6005, data6006, data6007,
                data8047, data8048, data2002, data8007, data8004,
                data2001, data2003, data8028, data10007, data10014, data10010, data10009, data17001, data2004, data2005, data2006
            ] = await Promise.all([


            ]);



        } catch (error) {

        } finally {
            controllers.current.fetchCodeHelpData = null;
            setLoading(false);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
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
    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                message.warning('Bạn không có quyền thêm dữ liệu')
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
    )
    const handleRowAppendB = useCallback(
        (numRowsToAddB) => {
            if (canCreate === false) {
                message.warning('Bạn không có quyền thêm dữ liệu')
                return
            }
            if (dataSub.length === 0) {
                message.warning('Vui lòng chọn vật phẩm trước khi thêm dữ liệu')
                return
            }
            onRowAppended(colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB)
        },
        [colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB, dataSub],
    )

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault()
                setShowSearch(true)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    /* HOOKS KEY */
    useKeydownHandler(isCellSelected, setOpenHelp)
    const handleUploadFiles = async (fileList, formCode, fetchDataSeq) => {
        if (fileList.length === 0) {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            return false;
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files', file.originFileObj);
        });
        formData.append('itemNoSeq', dataSub[0]?.ItemSeq);
        formData.append('formCode', formCode);
        formData.append('tableName', "_DA_MATERIAL_LIST_MORE");

        setUploading(true);

        const result = await uploadFilesItems(formData);

        if (result.data.success) {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            setIsModalOpen(false);
            if (formCode === 'file') {
                setFileList([]);
            } else {
                setImageList([]);

                const newImages = result.data.data || [];
                setGridDataD((prevData) => {
                    const updatedData = [...prevData, ...newImages];

                    setNumRowsD(updatedData.length);

                    return updatedData;
                });
            }
            if (typeof fetchDataSeq === 'function' && formCode !== 'img') {
                fetchDataSeq(dataSub[0]?.ItemSeq, formCode);
            } else {
                setFileList([]);
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
            }
            setUploading(false);
            return true;
        } else {
            message.error(result.message || 'Upload failed.');
            setIsModalOpen(true);
            setUploading(false);
            return false;
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
        }
    };

    const handleUpload = async () => {
        return handleUploadFiles(fileList, 'file', fetchDataCSeq);
    };


    const handleSaveA = useCallback(async () => {
        if (canCreate === false) {
            return false;
        }

        const columnsU = ['IdSeq', 'P_N', 'RefDES', 'Maker', 'MfrPartNumber', 'Description', 'ItemNoSeq', 'IdxNo', 'Col01', 'Col02', 'Col03', 'Col04', 'Col05', 'Col06'];
        const columnsA = ['P_N', 'RefDES', 'Maker', 'MfrPartNumber', 'Description', 'ItemNoSeq', 'IdxNo', 'Col01', 'Col02', 'Col03', 'Col04', 'Col05', 'Col06'];

        const resulU = filterAndSelectColumns(gridDataB, columnsU, 'U');
        const resulA = filterAndSelectColumns(gridDataB, columnsA, 'A');
        const finalResultA = resulA?.map(item => ({
            ...item,
            ItemNoSeq: dataSub[0]?.ItemSeq,
        })) || [];
        const finalResultU = resulU?.map(item => ({
            ...item,
            ItemNoSeq: dataSub[0]?.ItemSeq,
        })) || [];
        if (resulA.length === 0 && resulU.length === 0) {
            return true;
        }

        setIsSent(true);
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        try {
            const promises = [];
            if (finalResultA.length > 0) {
                promises.push(PostAMoreItem(finalResultA));
            }
            if (finalResultU.length > 0) {
                promises.push(PostUMoreItem(finalResultU));
            }

            const results = await Promise.all(promises);
            const isSuccess = results.every(result => result.success);
            const updateGridData = (newData) => {
                setGridDataB((prevGridData) => {
                    const updatedGridData = prevGridData.map(item => {
                        const matchingData = newData.find(data => data.IdxNo === item.IdxNo);

                        if (matchingData) {
                            return matchingData;
                        }
                        return item;
                    });

                    const updatedData = updateIndexNo(updatedGridData);
                    return updatedData;
                });
            };
            if (isSuccess) {
                const newData = results.flatMap(result => result.data.data || []);
                updateGridData(newData);
                setEditedRows([]);
                setAddedRows([]);
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
            }

            return isSuccess;
        } catch (error) {
            return false;
        } finally {
            setIsLoading(false);
            setIsSent(false);
        }
    }, [gridDataB, dataSub]);

    const handleSaveAll = async () => {
        setIsLoading(true);

        try {
            const saveA = await handleSaveA();
            if (saveA) {
                const saveB = await handleUpload();
                if (!saveB) {
                    console.log('Upload failed');
                }
            } else {
                console.log('Save A failed');
            }
        } catch (error) {
            console.log('Error saving', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteDataSheet = useCallback(
        (e) => {

        },
        [canDelete, gridData, selection, editedRows, isDeleting],
    )
    const getSelectedRowsB = () => {
        const selectedRows = selectionB.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridDataB[i]) {
                    rows.push(gridDataB[i])
                }
            }
        })

        return rows
    }
    const getSelectedRowsC = () => {
        const selectedRows = selectionC.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridDataC[i]) {
                    rows.push(gridDataC[i])
                }
            }
        })

        return rows
    }

    const handleDelete = useCallback(() => {
        if (canDelete === false) {
            message.warning('Bạn không có quyền xóa dữ liệu');
            return;
        }

        // Lấy danh sách các hàng đã chọn
        const selectedRowsA = getSelectedRowsB();
        const selectedRowsB = getSelectedRowsC();
        const deletePromises = [];

        // Hàm xử lý xóa dữ liệu chung
        const handleDeleteData = (
            getSelectedRows,
            postFunction,
            gridData,
            setGridData,
            setNumRows,
            resetTable,
            editedRows,
            setEditedRows,
            tableName
        ) => {
            return deleteDataSheet(
                getSelectedRows,
                postFunction,
                gridData,
                setGridData,
                setNumRows,
                resetTable,
                editedRows,
                setEditedRows,
                "IdSeq"
            ).then(result => ({
                table: tableName,
                ...result,
            }));
        };

        // Xóa dữ liệu ở bảng A
        if (selectedRowsA.length > 0) {
            deletePromises.push(handleDeleteData(
                getSelectedRowsB,
                PostDMoreItem,
                gridDataB,
                setGridDataB,
                setNumRowsB,
                resetTableB,
                editedRowsB,
                setEditedRowsB,
                'A'
            ));
        }

        // Xóa dữ liệu ở bảng B
        if (selectedRowsB.length > 0) {
            deletePromises.push(handleDeleteData(
                getSelectedRowsC,
                PostDFilesItems,
                gridDataC,
                setGridDataC,
                setNumRowsC,
                resetTableC,
                editedRowsC,
                setEditedRowsC,
                'B'
            ));
        }

        if (selectedImages.length > 0) {
            const handleDeleteImages = PostDFilesItems(selectedImages)
                .then(result => {
                    if (result.success) {
                        const updatedGridDataD = gridDataD.filter(item => !selectedImages.includes(item.IdSeq));

                        setGridDataD(updatedGridDataD);
                        setSelectedImages([])
                    }

                    return {
                        table: 'C',
                        ...result,
                    };
                });

            deletePromises.push(handleDeleteImages);
        }

        if (deletePromises.length === 0) {
            message.warning('Không có dữ liệu nào được chọn để xóa!');
            return;
        }

        // Thực hiện xóa tất cả và xử lý kết quả
        Promise.all(deletePromises).then((results) => {
            const hasError = results.some((result) => !result.success);

            if (hasError) {
                const errorMessages = results
                    .filter((result) => !result.success)
                    .map((result) => `${result.table}: ${result.message}`);
                message.error(errorMessages);
            } else {
                message.success('Xóa dữ liệu thành công!');
            }
        });
    }, [
        canDelete,
        editedRowsB,
        getSelectedRowsB,
        PostDMoreItem,
        setGridDataB,
        setNumRowsB,
        resetTableB,
        setEditedRowsB,
        gridDataB,
        getSelectedRowsC,
        PostDFilesItems,
        gridDataC,
        setGridDataC,
        setNumRowsC,
        resetTableC,
        editedRowsC,
        setEditedRowsC,
        selectedImages
    ]);

    return (
        <>
            <Helmet>
                <title> {t('Đăng ký danh mục hàng chi tiết')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full ">
                        <div className="flex items-end justify-end bg-white p-1">
                            <DaMaterialListMoreAction
                                handleSearchData={fetchData}
                                handleSaveData={handleSaveAll}
                                handleDeleteDataSheet={handleDelete}
                            />
                        </div>
                        <div className="group  bg-white">

                            <summary className="flex cursor-pointer border-t p-1 items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                                    <FilterOutlined />
                                    Điều kiện truy vấn
                                </h2>
                            </summary>
                            <div className="flex p-1">
                                <DaMaterialListMoreQuery
                                    formData={formData}
                                    setFormData={setFormData}
                                    setToDate={setToDate}
                                    toDate={toDate}
                                    set10012={set10012}
                                    key10012={key10012}
                                    setKey10012={setKey10012}
                                    setKey10010={setKey10010}
                                    key10010={key10010}
                                    set10010={set10010}
                                    setKeyDeptSeq={setKeyDeptSeq}

                                    setKeyItemNo={setKeyItemNo}
                                    keyItemNo={keyItemNo}
                                    setKeyItemName={setKeyItemName}
                                    keyItemName={keyItemName}
                                    setKeySpec={setKeySpec}
                                    keySpec={keySpec}
                                    set10009={set10009}
                                    setKeyEmpSeq={setKeyEmpSeq}
                                    set2004={set2004}
                                    set2005={set2005}
                                    set2006={set2006}
                                    setUMItemClassS={setUMItemClassS}
                                    setUMItemClassM={setUMItemClassM}
                                    setUMItemClassL={setUMItemClassL}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 w-full  h-screen   overflow-auto">
                        <Splitter

                        >
                            <Splitter.Panel defaultSize="35%" min="20%">
                                <TableDaMaterialListMore
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
                                    handleRowAppend={handleRowAppend}
                                    cols={cols}
                                    defaultCols={defaultCols}
                                    dataUnit={dataUnit}
                                    dataNaWare={dataNaWare}
                                    dataMngDeptName={dataMngDeptName}
                                    canCreate={canCreate}
                                    canEdit={canEdit}
                                    dataCommissionCust={dataCommissionCust}
                                    dataUMRegion={dataUMRegion}
                                    dataScopeName={dataScopeName}

                                />
                            </Splitter.Panel>
                            <Splitter.Panel defaultSize="65%" min="40%">


                                <TabViewDeMaterSeq
                                    dataType={dataType}
                                    setSelection={setSelectionB}
                                    selection={selectionB}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}
                                    setAddedRows={setAddedRowsB}
                                    addedRows={addedRowsB}
                                    setEditedRows={setEditedRowsB}
                                    editedRows={editedRowsB}
                                    setNumRowsToAdd={setNumRowsToAddB}
                                    numRowsToAdd={numRowsToAddB}
                                    numRows={numRowsB}
                                    setGridData={setGridDataB}
                                    gridData={gridDataB}
                                    setNumRows={setNumRowsB}
                                    setCols={setColsB}
                                    handleRowAppend={handleRowAppendB}
                                    cols={colsB}
                                    canCreate={canCreate}
                                    defaultCols={defaultColsB}
                                    canEdit={canEdit}
                                    dataSub={dataSub}

                                    handleUploadFiles={handleUploadFiles}
                                    fetchDataDSeq={fetchDataDSeq}
                                    setSelectionC={setSelectionC}
                                    selectionC={selectionC}
                                    setAddedRowsC={setAddedRowsC}
                                    addedRowsC={addedRowsC}
                                    numRowsC={numRowsC}
                                    setGridDataC={setGridDataC}
                                    gridDataC={gridDataC}
                                    setNumRowsC={setNumRowsC}
                                    setColsC={setColsC}
                                    colsC={colsC}
                                    defaultColsC={defaultColsC}
                                    setSelectedImages={setSelectedImages}
                                    selectedImages={selectedImages}

                                    setSelectionD={setSelectionD}
                                    selectionD={selectionD}
                                    numRowsD={numRowsD}
                                    setGridDataD={setGridDataD}
                                    gridDataD={gridDataD}
                                    setNumRowsD={setNumRowsD}
                                    setColsD={setColsD}
                                    colsD={colsD}
                                    defaultColsD={defaultColsD}

                                    setFileList={setFileList}
                                    fileList={fileList}

                                    setImageList={setImageList}
                                    imageList={imageList}

                                />
                            </Splitter.Panel>
                        </Splitter>

                    </div>
                </div>
            </div>
            <ErrorListModal
                dataError={dataError}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
            />
            <ModalSheetDelete
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                confirm={handleDeleteDataSheet}
            />
        </>
    )
}