import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { notification, message, Splitter, Tabs } from 'antd'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import { filterValidRows } from '../../../../utils/filterUorA'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { HandleError } from '../../default/handleError'
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import CustomerRegistActionDetails from '../../../components/actions/basic/customers/customerRegistActionDetails'
import CustomerRegistrationQuery from '../../../components/query/basic/customers/customerRegistrationQuery'
import TableCustomerRegistration from '../../../components/table/basic/customers/tableCustomerRegistration'

import { SDACustQ } from '../../../../features/basic/customer/SDACustQ'
import { SDACustAUD } from '../../../../features/basic/customer/SDACustAUD'
import { SDACustD } from '../../../../features/basic/customer/SDACustD'
import { SDACustEmpInfoAUD } from '../../../../features/basic/customer/SDACustEmpInfoAUD'
import TableCustomerRegistrationB from '../../../components/table/basic/customers/tableCustomerRegistrationB'
import { SDACustEmpInfoQ } from '../../../../features/basic/customer/SDACustEmpInfoQ'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import TableCustomerRegistrationA from '../../../components/table/basic/customers/tableCustomerRegistrationA'
export default function CustomersRegistrationDetails({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
  cancelAllRequests }) {
  const langCode = localStorage.getItem('language') || '6';
  const userFrom = JSON.parse(localStorage.getItem('userInfo'))
  const loadingBarRef = useRef(null);
  const activeFetchCountRef = useRef(0);
  const { t } = useTranslation()
  const defaultCols = useMemo(() => [
    { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
    { title: t('Thương hiệu'), id: 'FullName', kind: 'Text', readonly: false, width: 230, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
    { title: t('Tên khách hàng'), id: 'CustName', kind: 'Text', readonly: false, width: 230, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
    { title: t('Mã số khách hàng'), id: 'CustNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Mã số kinh doanh'), id: 'BizNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
    { title: t('Số pháp nhân'), id: 'LawRegNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Địa chỉ doanh nghiệp đóng thuế'), id: 'BizAddr', kind: 'Text', readonly: false, width: 230, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Người đại diện'), id: 'Owner', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Số CCCD'), id: 'PersonId', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('SĐT'), id: 'TelNo', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Tình trạng kinh doanh'), id: 'BizType', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },

  ], [t]);
  const defaultColsB = useMemo(() => [
    { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
    { title: t('Tên người phụ trách'), id: 'EmpName', kind: 'Text', readonly: false, width: 230, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
    { title: t('Chức vị'), id: 'JpName', kind: 'Text', readonly: false, width: 230, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
    { title: t('Bộ phận'), id: 'DeptName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Số điện thoại'), id: 'TELNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
    { title: t('Điện thoại di động'), id: 'MobileNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Số fax'), id: 'FAX', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Thư điện tử'), id: 'EMail', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Ghi chú'), id: 'Remark', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Phân loại người phụ trách'), id: 'UMJobRollKindName', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    { title: t('Phụ trách đại diện'), id: 'IsStd', kind: 'Text', readonly: false, width: 170, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },

  ], [t]);
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
  const [addedRows, setAddedRows] = useState([])
  const [addedRowsB, setAddedRowsB] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [editedRowsB, setEditedRowsB] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRowsToAddB, setNumRowsToAddB] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [numRowsB, setNumRowsB] = useState(0)
  const [openHelp, setOpenHelp] = useState(false)
  const [keyItem1, setKeyItem1] = useState('')
  const [keyItem2, setKeyItem2] = useState('')
  const [keyItem3, setKeyItem3] = useState('')
  const [keyItem4, setKeyItem4] = useState('')
  const [keyItem5, setKeyItem5] = useState('')
  const [activeTab, setActiveTab] = useState("1");

  const [searchText, setSearchText] = useState('')
  const [dataSearch, setDataSearch] = useState([])

  const [searchText2, setSearchText2] = useState('')
  const [dataSearch2, setDataSearch2] = useState([])


  const [itemText3, setItemText3] = useState(null)
  const [searchText3, setSearchText3] = useState('')
  const [dataSearch3, setDataSearch3] = useState([])



  const [itemText4, setItemText4] = useState(null)
  const [searchText4, setSearchText4] = useState('')
  const [dataSearch4, setDataSearch4] = useState([])


  const [itemText5, setItemText5] = useState(null)
  const [searchText5, setSearchText5] = useState('')
  const [dataSearch5, setDataSearch5] = useState([])

  const [whName, setWHName] = useState('')
  const [helpData01, setHelpData01] = useState([])
  const [helpData02, setHelpData02] = useState([])
  const [helpData03, setHelpData03] = useState([])
  const [helpData04, setHelpData04] = useState([])
  const [helpData05, setHelpData05] = useState([])
  const [helpData06, setHelpData06] = useState([])
  const [helpData07, setHelpData07] = useState([])
  const [helpData08, setHelpData08] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formDate, setFormDate] = useState(dayjs().startOf('month'));
  const [toDate, setToDate] = useState(dayjs())


  const [searchText1, setSearchText1] = useState('')
  const [dataSearch1, setDataSearch1] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemNo, setItemNo] = useState('')
  const [spec, setSpec] = useState('')
  const [CustName, setCustName] = useState('')
  const [CustNo, setCustNo] = useState('')
  const [BizNo, setBizNo] = useState('')
  const [Owner, setOwner] = useState('')
  const [CustSeq, setCustSeq] = useState(null)
  const [dataSheetSearch2, setDataSheetSearch2] = useState([])
  const formatDate = (date) => date.format('YYYYMMDD')
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'page_customrer_reg_a_a',
      defaultCols.filter((col) => col.visible)
    )
  )
  const [colsB, setColsB] = useState(() =>
    loadFromLocalStorageSheet(
      'page_customrer_reg_b_a',
      defaultColsB.filter((col) => col.visible)
    )
  )

  const [PuSeq, setPuSeq] = useState('')
  const [PtSeq, setPtSeq] = useState('')
  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty()
    })
  }
  const resetTableB = () => {
    setSelectionB({
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

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
  )
  const handleRowAppendB = useCallback(
    (numRowsToAddB) => {
      if (canCreate === false) {
        return
      }
      if (!CustSeq) {
        return
      }
      onRowAppended(colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB)
    },
    [colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB, CustSeq]
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
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
    }
  };

  const handleSearchData = useCallback(async () => {
    const searchParams = [
      {
        CustName: CustName || '',
        CustNo: CustNo || '',
        BizNo: BizNo || '',
        MinorBizNo: '',
        SMCustStatus: '',
        UMCustKind: '',
        Owner: Owner || '',
        ChannelSeq: '',
        Email: '',
        PersonId2: '',
      },
    ];

    fetchGenericData({
      controllerKey: 'SDACustQ',
      postFunction: SDACustQ,
      searchParams,
      defaultCols,
      useEmptyData: false,
      afterFetch: (data) => {
        setGridData(data);
        setNumRows(data.length);
      },
    });

    // Chỉ gọi hàm thứ 2 khi CustSeq có giá trị
    if (CustSeq !== null && CustSeq !== undefined) {
      const searchParams2 = [{ CustSeq: CustSeq }];

      fetchGenericData({
        controllerKey: 'SDACustEmpInfoQ',
        postFunction: SDACustEmpInfoQ,
        searchParams: searchParams2,
        defaultCols: defaultColsB,
        useEmptyData: true,
        afterFetch: (data) => {
          setGridDataB(data);
          setNumRowsB(data.length);
        },
      });
    }
  }, [CustName, CustNo, BizNo, Owner, CustSeq]);



  const handleSaveData = useCallback(async () => {
    if (!canCreate) return true;

    const resulA = filterValidRows(gridDataB, 'A').map(item => ({
      ...item,
      WorkingTag: 'A',
      CustSeq: CustSeq


    }));
    const resulU = filterValidRows(gridDataB, 'U').map(item => ({
      ...item,
      WorkingTag: 'U',
      CustSeq: CustSeq

    }));


    const requiredFields = [
      { key: 'EmpName', label: t('Người đại diện') },

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
      if (resulA.length > 0) apiCalls.push(SDACustEmpInfoAUD(resulA));

      if (resulU.length > 0) apiCalls.push(SDACustEmpInfoAUD(resulU));

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

      setGridDataB(prev => {
        const updated = prev.map(item => {
          const found = [...addMenuData, ...uMenuData].find(x => x?.IDX_NO === item?.IdxNo);
          console.log('found', found)
          return found ? {
            ...item, Status: '', CustSeq: found.CustSeq, EmpSerl: found.EmpSerl
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
  }, [gridDataB, canCreate, CustSeq]);

  const handleDeleteDataSheet = useCallback(
    (e) => {
      if (canDelete === false) return;

      togglePageInteraction(true);
      loadingBarRef.current?.continuousStart();

      const selectedRows = getSelectedRowsB();

      const rowsWithStatusD = selectedRows
        .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === 'E')
        .map((row) => ({
          ...row,
          Status: 'D',
          WorkingTag: 'D',
          CustSeq: CustSeq
        }));


      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');

      const finish = () => {
        loadingBarRef.current?.complete();
        togglePageInteraction(false);
      };

      if (rowsWithStatusD.length > 0) {
        SDACustEmpInfoAUD(rowsWithStatusD)
          .then((response) => {
            if (response.success) {
              const deletedIds = rowsWithStatusD.map((item) => item.IdxNo);
              const updatedData = gridDataB.filter((row) => !deletedIds.includes(row.IdxNo));
              setGridDataB(updateIndexNo(updatedData));
              setNumRowsB(updatedData.length);
              resetTableB();
            } else {
              setGridDataB(prev => {
                const updated = prev.map(item => {
                  const isSelected = rowsWithStatusD.some(row => row.IdxNo === item.IdxNo);
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
          const remainingRows = gridDataB.filter((row) => !idsWithStatusA.includes(row.Id));
          setGridDataB(updateIndexNo(remainingRows));
          setNumRowsB(remainingRows.length);
          resetTableB();
        }
        finish();
      }
    },
    [gridDataB, selectionB, editedRows,CustSeq]
  );
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
        GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '8024', '', '', '', signal),
      ]);
      setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);



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


  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-1  text-blue-700 ml-2">
          Địa chỉ thông tin người phụ trách
        </span>
      ),
      children: (
        <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-auto">
          <TableCustomerRegistrationB
            setSelection={setSelectionB}
            selection={selectionB}
            showSearch={showSearchB}
            setShowSearch={setShowSearchB}
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
            helpData01={helpData01}
            setHelpData01={setHelpData01}
          />
        </div>
      ),
    },

  ]; const getSelectedRowsA = () => {
    return selection.rows.items.flatMap(([start, end]) =>
      gridData.slice(start, end)
    );
  };
  useEffect(() => {
    const data = getSelectedRowsA();

    if (!data || data.length === 0) return;

    const seq = data[0]?.CustSeq;
    if (seq == null || seq === '') return;
    const searchParams = [{
      CustSeq: data[0]?.CustSeq,
    }]
    setCustSeq(seq)
    setCustName(data[0]?.CustName || '')
    setCustNo(data[0]?.CustNo || '')
    setBizNo(data[0]?.BizNo || '')
    setOwner(data[0]?.Owner || '')
    fetchGenericData({
      controllerKey: 'SDACustEmpInfoQ',
      postFunction: SDACustEmpInfoQ,
      searchParams,
      defaultCols: defaultColsB,
      useEmptyData: true,
      afterFetch: (data) => {
        setGridDataB(data);
        setNumRowsB(data.length);
      },
    });
  }, [selection.rows.items]);
  return (
    <>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg">
            <div className="flex items-end justify-end bg-white p-1">
              <CustomerRegistActionDetails
                handleSearchData={handleSearchData}
                handleSaveData={handleSaveData}
                handleDeleteDataSheet={handleDeleteDataSheet}
              />
            </div>
            <details
              className="group [&_summary::-webkit-details-marker]:hidden border-t   bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between p-1 gap-1.5 border-b text-gray-900" onClick={(e) => e.preventDefault()}>
                <h2 className="text-[9px] font-medium flex items-center   uppercase text-blue-500">
                  {t('850000014')}
                </h2>
              </summary>


              <CustomerRegistrationQuery
                CustName={CustName}
                setCustName={setCustName}
                CustNo={CustNo}
                setCustNo={setCustNo}
                BizNo={BizNo}
                setBizNo={setBizNo}
                Owner={Owner}
                setOwner={setOwner}


              />
            </details>

          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">

            <Splitter
              layout="vertical"
            >
              <Splitter.Panel defaultSize="40%" min="20%">
                <TableCustomerRegistrationA
                  setSelection={setSelection}
                  selection={selection}
                  showSearch={showSearch}
                  setShowSearch={setShowSearch}
                  numRows={numRows}
                  setGridData={setGridData}
                  gridData={gridData}
                  setNumRows={setNumRows}
                  setCols={setCols}
                  handleRowAppend={handleRowAppend}
                  cols={cols}
                  canCreate={canCreate}
                  defaultCols={defaultCols}
                  canEdit={canEdit}

                />
              </Splitter.Panel>
              <Splitter.Panel defaultSize="60%" min="20%">


                <div className=" w-full h-full">
                  <Tabs defaultActiveKey="1"

                    size="small"
                    items={items}
                    className="h-full "
                    onChange={(key) => setActiveTab(key)}
                  />
                </div>
              </Splitter.Panel>
            </Splitter>


          </div>
        </div>
      </div>

    </>
  )
}
