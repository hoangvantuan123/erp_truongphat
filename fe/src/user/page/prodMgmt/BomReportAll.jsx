import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, notification, message } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { SPDBOMReportAllQ } from '../../../features/bom/SPDBOMReportAllQ'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar';
import BomReportAllAction from '../../components/actions/prodMgmt/BomReportAllAction'
import BomReportAllQuery from '../../components/query/prodMgmt/BomReportAllQuery'
import TableBomReportAll from '../../components/table/prodMgmt/tableBomReportAll'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { HandleError } from '../default/handleError'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
export default function BomReportAll({ permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests }) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const navigate = useNavigate()
  const activeFetchCountRef = useRef(0);
  const loadingBarRef = useRef(null);
  const defaultCols = useMemo(() => [
    { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderLookup },
    { title: t('2034'), id: 'ItemName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('2035'), id: 'ItemNo', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('36833'), id: 'BOMLevel', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('2170'), id: 'MatItemName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('2169'), id: 'MatItemNo', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('1969'), id: 'MatSpec', kind: 'Number', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('3244'), id: 'UnitName', kind: 'Number', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('18988'), id: 'MatItemBomRev', kind: 'Number', readonly: true, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderBoolean, trailingRowOptions: { disabled: true } },
    { title: t('1994'), id: 'AssetName', kind: 'Number', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('9374'), id: 'Qty', kind: 'Number', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('2359'), id: 'Amt', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('290'), id: 'Price', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
    { title: t('48526'), id: 'Remark1', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, icon: GridColumnIcon.HeaderString, trailingRowOptions: { disabled: true } },
  ], [t]);

  const [loadingA, setLoadingA] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [editedRows, setEditedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [UMQueryType, setUMQueryType] = useState(null)
  const [ItemSeq, setItemSeq] = useState(null)
  const [AssetSeq, setAssetSeq] = useState(null)
  const [gridData, setGridData] = useState([])
  const [numRows, setNumRows] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [itemText, setItemText] = useState('')
  const [dataSearch, setDataSearch] = useState(null)
  const [helpData01, setHelpData01] = useState([])
  const [helpData02, setHelpData02] = useState([])
  const [dataSheetSearch, setDataSheetSearch] = useState([])
  const [minorValue, setMinorValue] = useState('')
  const [formDate, setFormDate] = useState(dayjs().startOf('month'));
  const [toDate, setToDate] = useState(dayjs())
  const formatDate = (date) => date.format('YYYYMMDD')
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'report_all_bom_a',
      defaultCols.filter((col) => col.visible)
    )
  )
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  })
  useEffect(() => {
    cancelAllRequests();
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

    if (!dataSearch || !dataSearch.ItemSeq) {
      HandleError([
        {
          success: false,
          message: 'Vui lòng chọn sản phẩm trước khi tìm kiếm!',
        },
      ]);
      return;
    }
    const searchParams = [
      {
        UMQueryType: 999996001,
        ItemSeq: dataSearch?.ItemSeq,
        DateFr: formDate ? formatDate(formDate) : '',
        DateTo: toDate ? formatDate(toDate) : '',
        ItemNo: dataSearch?.ItemNo,
        AssetSeq: minorValue
      },
    ];


    fetchGenericData({
      controllerKey: 'SPDBOMReportAllQ',
      postFunction: SPDBOMReportAllQ,
      searchParams,
      defaultCols,
      useEmptyData: false,
      afterFetch: (data) => {
        setGridData(data);
        setNumRows(data.length);
      },
    });
  }, [
    dataSearch,
    minorValue,
    formDate,
    toDate

  ]);
  const fetchCodeHelpData = useCallback(async () => {
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
    setLoading(true)
    try {
      const [
        help01,
        help02,
      ] = await Promise.all([
        GetCodeHelp(18074, '', '', '', '', '', '', 1, 250, '', 0, 0, 0, signal),
        GetCodeHelpCombo(
          '',
          6,
          10012,
          1,
          '%',
          '',
          '',
          '',
          'A.SMAssetGrp IN (6008002,6008004)',
          signal
        )
      ])
      setHelpData01(help01?.data || [])
      setHelpData02(help02?.data || [])
    } catch (error) {
      setHelpData01([])
      setHelpData02([])
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchCodeHelpData = null;
      setLoading(false)
    }
  }, [])

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
        <title>ITM - {t('850000024')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex p-2 items-end justify-end">

              <BomReportAllAction
                handleSearchData={handleSearchData}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border  bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                  <FilterOutlined />
                  {t('850000014')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <BomReportAllQuery
                  helpData01={helpData01}
                  helpData02={helpData02}
                  setItemText={setItemText}
                  itemText={itemText}
                  setSearchText={setSearchText}
                  searchText={searchText}
                  setDataSearch={setDataSearch}
                  dataSearch={dataSearch}
                  setDataSheetSearch={setDataSheetSearch}
                  dataSheetSearch={dataSheetSearch}
                  setMinorValue={setMinorValue}
                  controllers={controllers}
                  setHelpData01={setHelpData01}


                  setFormDate={setFormDate}
                  formDate={formDate}
                  toDate={toDate}
                  setToDate={setToDate}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 overflow-auto relative">
            <TableBomReportAll
              setSelection={setSelection}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              selection={selection}
              canEdit={canEdit}
              cols={cols}
              setCols={setCols}
              setGridData={setGridData}
              gridData={gridData}
              defaultCols={defaultCols}
              setNumRows={setNumRows}
              numRows={numRows}

            />
          </div>
        </div>
      </div>
    </>
  )
}