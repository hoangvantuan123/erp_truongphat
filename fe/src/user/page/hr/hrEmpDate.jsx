import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { filterValidRows } from '../../../utils/filterUorA'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import dayjs from 'dayjs'
import { PostUHrEmpOne } from '../../../features/hr/hrEmpOne/postUHrEmpOne'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { PostQHrEmpOne } from '../../../features/hr/hrEmpOne/postQHrEmpOne'
import ErrorListModal from '../default/errorListModal'
import HrEmpDateActions from '../../components/actions/hr/hrEmpDate'
import HrEmpDateQuery from '../../components/query/hr/hrEmpDateQuery'
import HrEmpDateTable from '../../components/table/hr/hrEmpDateTable'
import { HrEmpDateQ } from '../../../features/hr/hrEmpDate/HrEmpDateQ'
import { HandleError } from '../default/handleError'
export default function HrEmpDate({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        {
            title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },

        {
            title: t('1452'), id: 'EmpID', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('4'), id: 'EmpName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            },
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('17028'), id: 'EntRetTypeName', kind: 'Text', readonly: false, width: 220, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Số CMND/CCCD', id: 'ResidID', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('1479'), id: 'UMEmpTypeName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('215'), id: 'EntDate', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('4735'), id: 'Height', kind: 'Number', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('13446'), id: 'Weight', kind: 'Number', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('6935'), id: 'EyeLt', kind: 'Number', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('6934'), id: 'EyeRt', kind: 'Number', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('10629'), id: 'SMBloodTypeName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('19160'), id: 'SMBloodType', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('16968'), id: 'IsDisabled', kind: 'Boolean', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('16003'), id: 'IsForeigner', kind: 'Boolean', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('7142'), id: 'SMBirthTypeName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('15662'), id: 'SMBirthType', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('386'), id: 'BirthDate', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('543'), id: 'UMNationName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('1585'), id: 'SMSexSeqName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('6586'), id: 'SMSexSeq', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('488'), id: 'IsMarriage', kind: 'Boolean', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('124'), id: 'MarriageDate', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('1335'), id: 'UMReligionName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('1214'), id: 'Hobby', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('1151'), id: 'Speciality', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: t('79'), id: 'Phone', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Điện thoại di động', id: 'Cellphone', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Mã nội bộ', id: 'Extension', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Thư điện tử', id: 'Email', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Hình thái tuyển dụng', id: 'UMEmployTypeName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Công việc mong muốn 1', id: 'WishTask1', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Công việc mong muốn 2', id: 'WishTask2', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Người tiến cử', id: 'Recommender', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Công ty người tiến cử', id: 'RcmmndrCom', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Chức vụ người tiến cử', id: 'RcmmndrRank', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Ghi chú', id: 'Remark', kind: 'Text', readonly: false, width: 220, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Loại hình khuyết tật', id: 'UMHandiTypeName', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Cấp độ khuyết tật', id: 'UMHandiGrdName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Ngày đăng ký khuyết tật', id: 'HandiAppdate', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Cựu chiến binh', id: 'IsVeteranEmp', kind: 'Boolean', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Mã CCB', id: 'VeteranNo', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Quan hệ với người có công', id: 'UMRelName', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
        {
            title: 'Đối tượng hỗ trợ tìm việc', id: 'IsJobEmp', kind: 'Boolean', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: {
                disabled: true,
            }
        },
    ], []);

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
    const [clickCount, setClickCount] = useState(false)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [dataRootMenu, setDataRootMenu] = useState([])
    const [dataSubMenu, setDataSubMenu] = useState([])
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
    const [helpData11, setHelpData11] = useState([])
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
            'hr_emp_date_a',
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
            const emptyData = updateIndexNo(generateEmptyData(0, defaultCols));

            const data = response.success ? (response.data || []) : [];
            const mergedData = updateIndexNo([...data, ...emptyData]);

            await afterFetch(mergedData);
        } catch (error) {
            const emptyData = updateIndexNo(generateEmptyData(0, defaultCols));
            await afterFetch(emptyData);
        } finally {
            decreaseFetchCount();
            controllers.current[controllerKey] = null;
        }
    };

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

            const [help01, help02,
                help03, help04, help05, help06, help07, help08, help09, help10, help11
            ] = await Promise.all([
                GetCodeHelpCombo(
                    '',
                    6,
                    19999,
                    1,
                    '%',
                    '3059',
                    '1001',
                    '3053001,3053002',
                    '',
                    signal
                ),
                GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '3095',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '1009',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpVer2(19999, '', '1002', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '1010',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpVer2(19999, '', '3060', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo(
                    '',
                    6,
                    19999,
                    1,
                    '%',
                    '3061',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpCombo(
                    '',
                    6,
                    19999,
                    1,
                    '%',
                    '3064',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpCombo(
                    '',
                    6,
                    19999,
                    1,
                    '%',
                    '3065',
                    '',
                    '',
                    '',
                    signal
                ),


                GetCodeHelpVer2(19999, '', '3062', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
            ]);
            setHelpData01(help01.data)
            setHelpData02(help02.data)
            setHelpData03(help03.data)
            setHelpData04(help04.data)
            setHelpData05(help05.data)
            setHelpData06(help06.data)
            setHelpData07(help07.data)
            setHelpData08(help08.data)
            setHelpData09(help09.data)
            setHelpData10(help10.data)
            setHelpData11(help11.data)



        } catch {
            setHelpData01([])
            setHelpData02([])
            setHelpData03([])
            setHelpData04([])
            setHelpData05([])
            setHelpData06([])
            setHelpData07([])
            setHelpData08([])
            setHelpData09([])
            setHelpData10([])
            setHelpData11([])
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

    const handleSearchData = useCallback(async () => {
        const searchParams = {
            QBegDate: formData ? formatDate(formData) : '',
            QEndDate: toDate ? formatDate(toDate) : '',
            UMEmpType: UMEmpType,
            EmpSeq: dataSearch?.EmpSeq || '',
            DeptSeq: ''
        }
        fetchGenericData({
            controllerKey: 'HrEmpDateQ',
            postFunction: HrEmpDateQ,
            searchParams,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });


    }, [dataSearch, UMEmpType, formData, toDate])










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




    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;

        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
        }));

        if (resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }
        const requiredFields = [
            { key: 'EmpSeq', label: 'Nhân viên' },
        ];
        const validateRequiredFields = (data, fields) =>
            data.flatMap((row, i) =>
                fields
                    .filter(({ key }) => !row[key]?.toString().trim())
                    .map(({ key, label }) => ({
                        IDX_NO: i + 1,
                        field: key,
                        Name: label,
                        result: `${label} không được để trống`,
                    }))
            );
        const errors = [
            ...validateRequiredFields(resulU, requiredFields),
        ];

        if (errors.length > 0) {
            setModal2Open(true);
            setErrorData(errors);
            return;
        }
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const result = await PostUHrEmpOne(resulU);

            if (!result?.success) {
                const errorItems = result?.errors || [];
                setModal2Open(true);
                setErrorData(errorItems);
                return;
            }

            const UData = result?.data?.logs1 || [];

            setGridData(prev => {
                const updated = prev.map(item => {
                    const found = UData.find(x => x?.IDX_NO === item?.IdxNo);
                    return found ? { ...item, Status: '', EmpSeq: found.EmpSeq } : item;
                });
                return updateIndexNo(updated);
            });

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData, canCreate]);


    const handleRestSheet = useCallback(async () => {
        fetchData();
        setEditedRows([]);
        resetTable();
    }, [defaultCols, gridData]);



    return (
        <>
            <Helmet>
                <title>{t('10039279')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <HrEmpDateActions
                                fetchData={handleSearchData}

                                handleSaveData={handleSaveData}
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

                            <HrEmpDateQuery
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

                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg ">
                        <HrEmpDateTable
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
                            dataRootMenu={dataRootMenu}
                            dataSubMenu={dataSubMenu}
                            handleRestSheet={handleRestSheet}
                            setHelpData01={setHelpData01}
                            helpData01={helpData01}

                            helpData03={helpData03}
                            helpData04={helpData04}
                            helpData05={helpData05}
                            helpData06={helpData06}
                            helpData07={helpData07}
                            helpData08={helpData08}
                            helpData09={helpData09}
                            helpData10={helpData10}
                            helpData11={helpData11}
                            setHelpData03={setHelpData03}
                            setHelpData04={setHelpData04}
                            setHelpData05={setHelpData05}
                            setHelpData06={setHelpData06}
                            setHelpData07={setHelpData07}
                            setHelpData08={setHelpData08}
                            setHelpData09={setHelpData09}
                            setHelpData10={setHelpData10}
                            setHelpData11={setHelpData11}

                        />
                    </div>
                </div>
            </div>
            <ErrorListModal isModalVisible={modal2Open}
                setIsModalVisible={setModal2Open}
                dataError={errorData} />
        </>
    )
}
