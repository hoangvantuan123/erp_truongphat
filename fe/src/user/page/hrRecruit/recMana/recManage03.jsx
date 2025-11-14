import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { filterValidRows } from '../../../../utils/filterUorA'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import dayjs from 'dayjs'
import { HandleError } from '../../default/handleError'
import Recruit01Action from '../../../components/actions/hrRecruit/regi/recruit01Action'
import Recruit01Query from '../../../components/query/hrRecruit/regi/recruit01Query'
import Recruit01Table from '../../../components/table/hrRecruit/regi/recruit01Table'
import { HrEmpRecruitA } from '../../../../features/hr/hrEmpRecruit/HrEmpRecruitA'
import { HrEmpRecruitU } from '../../../../features/hr/hrEmpRecruit/HrEmpRecruitU'
import { HrEmpRecruitD } from '../../../../features/hr/hrEmpRecruit/HrEmpRecruitD'
import { HrEmpRecruitQ } from '../../../../features/hr/hrEmpRecruit/HrEmpRecruitQ'
import { CodeHelpItemH } from '../../../../features/codeHelp/codeHelpItemH'
import { EmpSPH } from '../../../../features/codeHelp/EmpSPH'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import TableRecManage03 from '../../../components/table/hrRecruit/recMana/recruit01Table'
import RecManage03Query from '../../../components/query/hrRecruit/recMana/recManage03Query'
import RecManage03Action from '../../../components/actions/hrRecruit/recMana/recManage03Action'
export default function RecManage03({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup
        },
        {
            title: 'Sync',
            id: 'StatusSync',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
        },
        {
            title: t('Mã nhân viên'),
            id: 'EmpID',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',

        },
        {
            title: t('3166'),
            id: 'EmpFamilyName',
            kind: 'Text',
            readonly: false,
            width: 90,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',

        },
        {
            title: t('3198'),
            id: 'EmpFirstName',
            kind: 'Text',
            readonly: false,
            width: 90,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',

        },
        {
            title: t('1584'),
            id: 'EmpName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },
        {
            title: t('Bằng cấp'),
            id: 'Degree',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },
        {
            title: t('Ngày sinh'),
            id: 'BirthDate',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',

        },
        {
            title: t('Check Tuổi'),
            id: 'CheckAge',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Giới tính'),
            id: 'SMSexName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('CMND/CCCD'),
            id: 'ResidID',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',

        },
        {
            title: t('Ngày cấp'),
            id: 'IssueDate',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Nơi cấp'),
            id: 'IssuePlace',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin cá nhân',
        },
        {
            title: t('Số điện thoại'),
            id: 'PhoneNumber',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Liên hệ',
        },
        {
            title: t('Email'),
            id: 'Email',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Liên hệ',
        },
        {
            title: t('Phân loại'),
            id: 'CategoryTypeName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Hình thái tuyển dụng / nhà thầu'),
            id: 'RecruitmentName',
            kind: 'Text',
            readonly: false,
            width: 210,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Người phỏng vấn / Đăng ký'),
            id: 'Interviewer',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Nhà máy'),
            id: 'FactName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Phòng ban'),
            id: 'Department',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Team'),
            id: 'Team',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Part'),
            id: 'PartName',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Line/Model'),
            id: 'LineModel',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Chức vụ'),
            id: 'JopPositionName',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',
        },
        {
            title: t('Ngày tuyển dụng'),
            id: 'InterviewDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin tuyển dụng',

        },
        // Quê quán
        {
            title: t('Quê - Đường'),
            id: 'PerAddrStreet',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Phường/Xã'),
            id: 'PerAddrWard',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Quận/Huyện'),
            id: 'PerAddrDistrict',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        {
            title: t('Quê - Tỉnh/TP'),
            id: 'PerAddrProvince',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (quê quán)',
        },
        // Chỗ ở hiện tại
        {
            title: t('Ở - Đường'),
            id: 'CurAddrStreet',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Phường/Xã'),
            id: 'CurAddrWard',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Quận/Huyện'),
            id: 'CurAddrDistrict',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Ở - Tỉnh/TP'),
            id: 'CurAddrProvince',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin địa chỉ (chỗ ở hiện tại)',
        },
        {
            title: t('Dân tộc'),
            id: 'Ethnic',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
        {
            title: t('Km đến Cty'),
            id: 'DistanceKm',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
        {
            title: t('Hạn HĐ'),
            id: 'ContractTerm',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Khác',
        },
    ], [t]);


    const [menus, setMenus] = useState([])
    const [gridData, setGridData] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [helpData09, setHelpData09] = useState([])
    const [helpData10, setHelpData10] = useState([])
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())

    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState([])
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [UMEmpType, setUMEmpType] = useState(null)
    const formatDate = (date) => date.format('YYYYMMDD')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'rec_manage_03_a',
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
            HandleError([{
                success: false,
                message: t(error?.message) || 'Đã xảy ra lỗi khi tải dữ liệu!'
            }]);
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
        const searchParams = {
            KeyItem1: formData ? formatDate(formData) : '',
            KeyItem2: toDate ? formatDate(toDate) : '',
            KeyItem4: '',

        }
        fetchGenericData({
            controllerKey: 'HrEmpRecruitQ',
            postFunction: HrEmpRecruitQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [formData, toDate])





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





    return (
        <>
            <Helmet>
                <title>{t('Truy vấn danh sách ứng viên')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <RecManage03Action
                                handleSearchData={handleSearchData}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t border-b bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase" >
                                    <FilterOutlined />
                                    {t('359')}
                                </h2>
                            </summary>
                            <RecManage03Query
                                helpData01={helpData01}
                                helpData02={helpData02}
                                searchText={searchText}
                                setSearchText={setSearchText}
                                setSearchText1={setSearchText1}
                                searchText1={searchText1}
                                setItemText={setItemText}
                                itemText={itemText}
                                setDataSearch={setDataSearch}
                                dataSearch={dataSearch}
                                setDataSearch1={setDataSearch1}
                                dataSearch1={dataSearch1}
                                setDataSheetSearch={setDataSheetSearch}
                                dataSheetSearch={dataSheetSearch}
                                setItemText1={setItemText1}
                                setHelpData02={setHelpData02}
                                UMEmpType={UMEmpType}
                                setUMEmpType={setUMEmpType}
                                formData={formData}
                                setFormData={setFormData}
                                toDate={toDate}
                                setToDate={setToDate}
                                helpData09={helpData09}



                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg ">
                        <TableRecManage03
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
                            defaultCols={defaultCols}
                            canEdit={canEdit}
                            canCreate={canCreate}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
