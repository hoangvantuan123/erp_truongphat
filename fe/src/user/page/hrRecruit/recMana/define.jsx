import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import { Input, Typography, notification, Col, message, Form } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'


import DefineAction from '../../../components/actions/hrRecruit/recMana/otherDefineAction'
import DefineQuery from '../../../components/query/hrRecruit/recMana/defineQuery'
import TableDefine from '../../../components/table/hrRecruit/recMana/tableDefine'
import TableDefineItem from '../../../components/table/hrRecruit/recMana/tableDefineItem'

import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { HandleError } from '../../default/handleError'
import { filterValidRows } from '../../../../utils/filterUorA'
import { DefineItemA } from '../../../../features/hr/defineItem/DefineItemA'
import { DefineItemU } from '../../../../features/hr/defineItem/DefineItemU'
import { DefineItemD } from '../../../../features/hr/defineItem/DefineItemD'
import { DefineItemQ } from '../../../../features/hr/defineItem/DefineItemQ'
import { DefineA } from '../../../../features/hr/define/DefineA'
import { DefineU } from '../../../../features/hr/define/DefineU'
import { DefineD } from '../../../../features/hr/define/DefineD'
import { DefineQ } from '../../../../features/hr/define/DefineQ'
export default function OtherHrDefine({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests
}) {

  const { t } = useTranslation()
  const userFrom = JSON.parse(localStorage.getItem('userInfo'))
  const loadingBarRef = useRef(null);
  const activeFetchCountRef = useRef(0);
  const defaultColsA = useMemo(() => [
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
    },
    {
      title: 'Key',
      id: 'DefineKey',
      kind: 'Text',
      readonly: false,
      width: 100,
      hasMenu: true,
      visible: true,
      trailingRowOptions: {
        disabled: true,
      },
      themeOverride: {
        textHeader: '#DD1144',
        bgIconHeader: '#DD1144',
        fontFamily: '',
      },
    },
    {
      title: 'Định nghĩa',
      id: 'DefineName',
      kind: 'Custom',
      readonly: false,
      width: 300,
      hasMenu: true,
      visible: true,
      trailingRowOptions: {
        disabled: true,
      },
      themeOverride: {
        textHeader: '#DD1144',
        bgIconHeader: '#DD1144',
        fontFamily: '',
      },
    },

  ], [t]);

  const defaultColsB = useMemo(() => [
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
      trailingRowOptions: {
        disabled: false,
      },
    },

    {
      title: 'Thuộc tính',
      id: 'DefineItemName',
      kind: 'Text',
      readonly: false,
      width: 220,
      hasMenu: true,
      visible: true,
      trailingRowOptions: {
        disabled: true,
      },
      themeOverride: {
        textHeader: '#DD1144',
        bgIconHeader: '#DD1144',
        fontFamily: '',
      },
    },
    {
      title: 'Key',
      id: 'Value',
      kind: 'Text',
      readonly: false,
      width: 220,
      hasMenu: true,
      visible: true,
      trailingRowOptions: {
        disabled: true,
      },
   
    },

    {
      title: 'Trạng thái',
      id: 'IsActive',
      kind: 'Boolean',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      trailingRowOptions: {
        disabled: true,
      },
    }
  ], [t]);
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  })
  const [selectionItem, setSelectionItem] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  })
  const [showSearch, setShowSearch] = useState(false)
  const [showSearch1, setShowSearch1] = useState(false)

  const [addedRows, setAddedRows] = useState([])
  const [addedRowsItem, setAddedRowsItem] = useState([])
  const [dataType, setDataType] = useState([])

  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [numRowsItem, setNumRowsItem] = useState(0)

  const [isCellSelected, setIsCellSelected] = useState(false)


  const [gridData, setGridData] = useState([])
  const [gridDataItem, setGridDataItem] = useState([])
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'hr_define_a',
      defaultColsA.filter((col) => col.visible)
    )
  )

  const [colsItem, setColsItem] = useState(() =>
    loadFromLocalStorageSheet(
      'hr_define_item_a',
      defaultColsB.filter((col) => col.visible)
    )
  )
  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty()
    })
  }
  const resetTableItem = () => {
    setSelectionItem({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty()
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



  useEffect(() => {
    cancelAllRequests()
    notification.destroy();
    message.destroy();


    const searchParams = {
      KeyItem1: ''
    }
    fetchGenericData({
      controllerKey: 'DefineQ',
      postFunction: DefineQ,
      searchParams,
      useEmptyData: true,
      defaultCols: defaultColsA,
      afterFetch: (data) => {
        setGridData(data);
        setNumRows(data.length);
      },
    });

  }, [])

  const getSelectedRowsDataA = () => {
    const selectedRows = selection.rows.items;

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
    );
  };

  useEffect(() => {
    const data = getSelectedRowsDataA();

    if (!data || data.length === 0) return;

    const seq = data[0]?.IdSeq;
    if (seq == null || seq === '') return;

    setDataType(data)
    const searchParams = {
      KeyItem1: '',
      KeyItem2: data[0]?.IdSeq,
    }
    fetchGenericData({
      controllerKey: 'DefineItemQ',
      postFunction: DefineItemQ,
      searchParams,
      defaultCols: defaultColsB,
      useEmptyData: true,
      afterFetch: (data) => {
        setGridDataItem(data);
        setNumRowsItem(data.length);
      },
    });
  }, [selection.rows.items]);


  const getSelectedRowsA = () => {
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
    const selectedRows = selectionItem.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridDataItem[i]) {
          rows.push(gridDataItem[i])
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


  const handleRowAppendItem = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(colsItem, setGridDataItem, setNumRowsItem, setAddedRowsItem, numRowsToAdd)
    },
    [colsItem, setGridDataItem, setNumRows, setAddedRowsItem, numRowsToAdd]
  )


  const handleDeleteDataSheet = useCallback(
    (e) => {
      if (canDelete === false) {
        return;
      }

      const selectedRows = getSelectedRowsA();

      const rowsWithStatusD = selectedRows
        .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === "E")
        .map((row) => {
          row.Status = 'D';
          return { IdSeq: row.IdSeq };
        });

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');


      if (rowsWithStatusD.length > 0) {

        DefineD(rowsWithStatusD)
          .then((response) => {
            if (response.success) {
              const deletedIds = rowsWithStatusD.map((item) => item.IdSeq);
              const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdSeq));
              setGridData(updateIndexNo(updatedData));
              setNumRows(updatedData.length);
              resetTable();
            } else {
              HandleError([
                {
                  success: false,
                  message: t(response?.message) || 'Đã xảy ra lỗi khi xóa!',
                },
              ]);
              setGridData(prev => {
                const updated = prev.map(item => {
                  const isSelected = rowsWithStatusD.some(row => row.IdxNo === item.IdxNo);
                  return isSelected ? { ...item, Status: 'E' } : item;
                });
                return updated;
              });
            }
          })
          .catch((error) => {
            HandleError([
              {
                success: false,
                message: t(error?.message) || 'Đã xảy ra lỗi khi xóa!',
              },
            ]);
          });
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id);
        const remainingRows = gridData.filter((row) => !idsWithStatusA.includes(row.Id));
        setGridData(updateIndexNo(remainingRows));
        setNumRows(remainingRows.length);
        resetTable();
      }
    },
    [gridData, selection]
  );

  const handleDeleteDataSheetItem = useCallback(
    (e) => {
      if (canDelete === false) {
        return;
      }

      const selectedRows = getSelectedRowsB();

      const rowsWithStatusD = selectedRows
        .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === "E")
        .map((row) => {
          row.Status = 'D';
          return { IdSeq: row.IdSeq };
        });

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');


      if (rowsWithStatusD.length > 0) {

        DefineItemD(rowsWithStatusD)
          .then((response) => {
            if (response.success) {
              const deletedIds = rowsWithStatusD.map((item) => item.IdSeq);
              const updatedData = gridDataItem.filter((row) => !deletedIds.includes(row.IdSeq));
              setGridDataItem(updateIndexNo(updatedData));
              setNumRowsItem(updatedData.length);
              resetTableItem();
            } else {
              HandleError([
                {
                  success: false,
                  message: response?.message || 'Đã xảy ra lỗi khi xóa!',
                },
              ]);
              setGridDataItem(prev => {
                const updated = prev.map(item => {
                  const isSelected = rowsWithStatusD.some(row => row.IdxNo === item.IdxNo);
                  return isSelected ? { ...item, Status: 'E' } : item;
                });
                return updated;
              });
            }
          })
          .catch((error) => {
            HandleError([
              {
                success: false,
                message: error?.message || 'Đã xảy ra lỗi khi xóa!',
              },
            ]);
          });
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id);
        const remainingRows = gridDataItem.filter((row) => !idsWithStatusA.includes(row.Id));
        setGridDataItem(updateIndexNo(remainingRows));
        setNumRowsItem(remainingRows.length);
        resetTableItem();
      }
    },
    [gridDataItem, selectionItem]
  );


  const handleSaveData = useCallback(async () => {
    if (!canCreate) return true;

    const resulA = filterValidRows(gridData, 'A').map(item => ({
      ...item,
      CreatedBy: userFrom?.UserSeq,
    }));
    const resulU = filterValidRows(gridData, 'U').map(item => ({
      ...item,
      UpdatedBy: userFrom?.UserSeq,
    }));
    const requiredFields = [
      { key: 'DefineKey', label: 'Key nhóm' },
      { key: 'DefineName', label: 'Định nghĩa' },
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
      if (resulA.length > 0) apiCalls.push(DefineA(resulA));

      if (resulU.length > 0) apiCalls.push(DefineU(resulU));

      const results = await Promise.all(apiCalls);

      const isSuccess = results.every(result => result?.success);

      if (!isSuccess) {
        HandleError(results)
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
          return found ? { ...item, Status: '', IdSeq: found.IdSeq } : item;
        });
        return updateIndexNo(updated);
      });

    } catch (error) {
      HandleError([
        {
          success: false,
          message: t(error?.message) || 'Đã xảy ra lỗi khi xóa!',
        },
      ]);
    } finally {
      loadingBarRef.current?.complete();
      togglePageInteraction(false);
    }
  }, [gridData, canCreate, userFrom]);
  const handleSaveDataItem = useCallback(async () => {
    if (!canCreate) return true;

    const resulA = filterValidRows(gridDataItem, 'A').map(item => ({
      ...item,
      CreatedBy: userFrom?.UserSeq,
      DefineKey: dataType[0]?.DefineKey,
      DefineSeq: dataType[0]?.IdSeq,
    }));
    const resulU = filterValidRows(gridDataItem, 'U').map(item => ({
      ...item,
      UpdatedBy: userFrom?.UserSeq,
      DefineKey: dataType[0]?.DefineKey,
      DefineSeq: dataType[0]?.IdSeq,
    }));
    const requiredFields = [
      { key: 'DefineItemName', label: 'Thuộc tính' },
      { key: 'DefineSeq', label: 'Mã nhóm thuộc tính' },
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
      if (resulA.length > 0) apiCalls.push(DefineItemA(resulA));

      if (resulU.length > 0) apiCalls.push(DefineItemU(resulU));

      const results = await Promise.all(apiCalls);

      const isSuccess = results.every(result => result?.success);

      if (!isSuccess) {
        HandleError(results)
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

      setGridDataItem(prev => {
        const updated = prev.map(item => {
          const found = [...addMenuData, ...uMenuData].find(x => x?.IdxNo === item?.IdxNo);
          return found ? { ...item, Status: '', IdSeq: found.IdSeq } : item;
        });
        return updateIndexNo(updated);
      });

    } catch (error) {
      HandleError([
        {
          success: false,
          message: t(error?.message) || 'Đã xảy ra lỗi khi xóa!',
        },
      ]);
    } finally {
      loadingBarRef.current?.complete();
      togglePageInteraction(false);
    }
  }, [gridDataItem, canCreate, userFrom, dataType]);


  const handleSaveAll = async () => {
    handleSaveData();
    handleSaveDataItem();
  };



  const handleSearchData = useCallback(async () => {
    const keyItem2 = dataType[0]?.IdSeq;

    if (!keyItem2) return;

    const searchParams = {
      KeyItem1: '',
      KeyItem2: keyItem2,
    };

    fetchGenericData({
      controllerKey: 'DefineItemQ',
      postFunction: DefineItemQ,
      searchParams,
      defaultCols: defaultColsB,
      useEmptyData: true,
      afterFetch: (data) => {
        setGridDataItem(data);
        setNumRowsItem(data.length);
      },
    });
  }, [dataType]);
  return (
    <>
      <Helmet>
        <title>ITMV - {t('Đăng ký thuộc tính')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50  h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col  h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-end p-1 bg-white border-b">
              <DefineAction
                handleDeleteDataSheet={handleDeleteDataSheet}
                handleSaveData={handleSaveAll}
                handleSearchData={handleSearchData}
                handleDeleteDataSheetItem={handleDeleteDataSheetItem}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border-b  bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900" onClick={(e) => e.preventDefault()}>
                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  Điều kiện truy vấn
                </h2>
              </summary>
              <DefineQuery dataType={dataType} />
            </details>
          </div>
          <div className="col-start-1 flex col-end-5 row-start-2 w-full h-full">
            <Splitter className="w-full h-full">
              <SplitterPanel size={35} minSize={10}>
                <TableDefine
                  setSelection={setSelection}
                  selection={selection}
                  showSearch={showSearch}
                  setShowSearch={setShowSearch}

                  numRows={numRows}

                  isCellSelected={isCellSelected}
                  setGridData={setGridData}
                  gridData={gridData}
                  setNumRows={setNumRows}
                  setCols={setCols}
                  handleRowAppend={handleRowAppend}
                  cols={cols}
                  canCreate={canCreate}
                  defaultCols={defaultColsA}
                  canEdit={canEdit}
                />
              </SplitterPanel>
              <SplitterPanel size={65} minSize={20}>
                <TableDefineItem
                  setSelection={setSelectionItem}
                  selection={selectionItem}
                  showSearch={showSearch1}
                  setShowSearch={setShowSearch1}

                  numRows={numRowsItem}

                  setGridData={setGridDataItem}
                  gridData={gridDataItem}
                  setNumRows={setNumRowsItem}
                  setCols={setColsItem}
                  handleRowAppend={handleRowAppendItem}
                  cols={colsItem}
                  canCreate={canCreate}
                  defaultCols={defaultColsB}
                  canEdit={canEdit}
                  dataType={dataType}
                />
              </SplitterPanel>
            </Splitter>
          </div>
        </div>
      </div>
    </>
  )
}
