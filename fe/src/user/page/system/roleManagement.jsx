import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import RoleManagementActions from '../../components/actions/system/roleManagementActions'
import { GetAllResGroups } from '../../../features/system/getGroups'
import ViewRoleManagement from '../../components/view/system/viewRoleManagement'
import TopLoadingBar from 'react-top-loading-bar';
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppendedRow } from '../../components/sheet/js/onRowAppended'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { generateRoleData } from '../../components/sheet/js/generateRoleData'
import { getPaginatedRolesMenu } from '../../../features/system/getPaginatedRolesMenu'
import { getPaginatedRolesRootMenu } from '../../../features/system/getPaginatedRolesRootMenu'
import { getPaginatedRolesUsers } from '../../../features/system/getPaginatedRolesUsers'
import { getHelpRoleRootMenu } from '../../../features/help/getHelpRootMenu'
import { getHelpMenu } from '../../../features/help/getHelpMenu'
import { getHelpUsers } from '../../../features/help/getHelpUsers'
import { DeleteDRole } from '../../../features/system/deleteDRole'
import { showErrorNotifiD, showLoadingNotifiD, showSuccessNotifiD } from '../default/notifiDUtils'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { removeSelectedRows } from '../../../utils/deleteUtils'
import { removeStatusA } from '../../../utils/deleteUtils'
import { PostARoleGroups } from '../../../features/system/postARoleGroups'
import { PostURoleGroups } from '../../../features/system/postURoleGroups'
import { showErrorNotifiAorU, showWarningNotifiAorU } from '../default/notifiAorUUtils'
import { DeleteDRoleGroup } from '../../../features/system/deleteDRoleGroup'
import { filterAndSelectColumnsRow } from '../../../utils/filterUorA'
import { PostURoleGroupUsers } from '../../../features/system/postURoleGroupUsers'
import { PostARoleGroupUsers } from '../../../features/system/postARoleGroupUsers'
import { validateColumnsTrans } from '../../../utils/validateColumns'
import { RoleGroupA } from '../../../features/system/role/RoleGroupA'
import { RoleGroupU } from '../../../features/system/role/RoleGroupU'

export default function RoleManagement({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
  cancelAllRequests }) {
  const loadingBarRef = useRef(null);
  const { t } = useTranslation()
  const defaultColsA = useMemo(() => [
    {
      title: '',
      id: 'Status',
      kind: 'Text',
      readonly: true,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup
    },
    {
      title: 'Mã nhóm',
      id: 'GroupId',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Mã quyền',
      id: 'Id',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Mã nhóm menu',
      id: 'RootMenuId',
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
      title: 'Nhóm quyền',
      id: 'RootMenuLabel',
      kind: 'Text',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'View',
      id: 'View',
      kind: 'Boolean',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderBoolean,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Type',
      id: 'Type',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
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
      icon: GridColumnIcon.HeaderLookup
    },
    {
      title: 'Mã quyền',
      id: 'Id',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Mã menu',
      id: 'MenuId',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },

    {
      title: 'Kiểu Menu',
      id: 'MenuType',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Type',
      id: 'Type',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Menu',
      id: 'MenuLabel',
      kind: 'Text',
      readonly: false,
      width: 350,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'View',
      id: 'View',
      kind: 'Boolean',
      readonly: false,
      width: 120,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderBoolean,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Create',
      id: 'Create',
      kind: 'Boolean',
      readonly: false,
      width: 120,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderBoolean,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Edit',
      id: 'Edit',
      kind: 'Boolean',
      readonly: false,
      width: 120,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderBoolean,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Delete',
      id: 'Delete',
      kind: 'Boolean',
      readonly: false,
      width: 120,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderBoolean,
      trailingRowOptions: {
        disabled: true,
      },
    },

  ], [t]);
  const defaultColsC = useMemo(() => [
    {
      title: '',
      id: 'Status',
      kind: 'Text',
      readonly: true,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup
    },

    {
      title: 'Mã',
      id: 'Id',
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
      title: 'UserId',
      id: 'UserId',
      kind: 'Text',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'UserName',
      id: 'UserName',
      kind: 'Text',
      readonly: true,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: 'Type',
      id: 'Type',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },

  ], [t]);
  const defaultColsD = useMemo(() => [
    {
      title: '',
      id: 'Status',
      kind: 'Text',
      readonly: true,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup
    },
    {
      title: 'Mã',
      id: 'Id',
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
      title: 'Nhóm',
      id: 'Name',
      kind: 'Text',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    }

  ], [t]);
  const [gridDataA, setGridDataA] = useState([])
  const [gridDataB, setGridDataB] = useState([])
  const [gridDataC, setGridDataC] = useState([])
  const [gridDataD, setGridDataD] = useState([])
  const [showSearchA, setShowSearchA] = useState(false)
  const [showSearchB, setShowSearchB] = useState(false)
  const [showSearchC, setShowSearchC] = useState(false)
  const [showSearchD, setShowSearchD] = useState(false)



  console.log('gridDataC', gridDataA)
  console.log('gridDataB', gridDataB)
  console.log('gridDataC', gridDataC)
  console.log('gridDataD', gridDataD)
  const [selectionA, setSelectionA] = useState({
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
  const [selectionD, setSelectionD] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  })


  const [numRowsA, setNumRowsA] = useState(0)
  const [numRowsB, setNumRowsB] = useState(0)
  const [numRowsC, setNumRowsC] = useState(0)
  const [numRowsD, setNumRowsD] = useState(0)
  const [numRowsToAddA, setNumRowsToAddA] = useState(null)
  const [numRowsToAddB, setNumRowsToAddB] = useState(null)
  const [numRowsToAddC, setNumRowsToAddC] = useState(null)
  const [numRowsToAddD, setNumRowsToAddD] = useState(null)
  const [addedRowsA, setAddedRowsA] = useState([])
  const [addedRowsB, setAddedRowsB] = useState([])
  const [addedRowsC, setAddedRowsC] = useState([])
  const [addedRowsD, setAddedRowsD] = useState([])
  const [dataType, setDataType] = useState([])
  const [dataHelp01, setDataHelp01] = useState([])
  const [dataHelp02, setDataHelp02] = useState([])
  const [dataHelp03, setDataHelp03] = useState([])

  const [colsA, setColsA] = useState(() =>
    loadFromLocalStorageSheet(
      'role_group_access_a',
      defaultColsA.filter((col) => col.visible)
    )
  )
  const [colsB, setColsB] = useState(() =>
    loadFromLocalStorageSheet(
      'role_group_menu_a',
      defaultColsB.filter((col) => col.visible)
    )
  )
  const [colsC, setColsC] = useState(() =>
    loadFromLocalStorageSheet(
      'role_group_users_a',
      defaultColsC.filter((col) => col.visible)
    )
  )
  const [colsD, setColsD] = useState(() =>
    loadFromLocalStorageSheet(
      'role_group_a',
      defaultColsD.filter((col) => col.visible)
    )
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cancelAllRequests()
    notification.destroy();
    message.destroy();
  }, [])
  const fetchDataGroups = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchDataGroups) {
      controllers.current.fetchDataGroups.abort();
      controllers.current.fetchDataGroups = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const controller = new AbortController();
    const signal = controller.signal;
    controllers.current.fetchDataGroups = controller;
    try {
      const response = await GetAllResGroups(signal)
      const fetchedData = response.data.data || [];
      const emptyData = generateRoleData(100, defaultColsD);
      const combinedData = [...fetchedData, ...emptyData];
      const updatedData = updateIndexNo(combinedData);
      setGridDataD(updatedData);
      setNumRowsD(updatedData.length);
    } catch (error) {
      const emptyData = generateRoleData(100, defaultColsD);
      const updatedData = updateIndexNo(emptyData);
      setGridDataD(updatedData);
      setNumRowsD(updatedData.length);
    } finally {
      controllers.current.fetchDataGroups = null;
      setLoading(false)
    }
  }, [])

  const fetchData1 = useCallback(async (seq) => {
    setLoading(true)
    if (controllers.current.fetchData1) {
      controllers.current.fetchData1.abort();
      controllers.current.fetchData1 = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchData1 = controller;
    try {
      const response = await getPaginatedRolesRootMenu(seq, 1, 10000, signal)
      if (response.success) {
        const fetchedData = response.data || [];
        const emptyData = generateRoleData(100, defaultColsD);
        const combinedData = [...fetchedData, ...emptyData];
        const updatedData = updateIndexNo(combinedData);
        setGridDataA(updatedData);
        setNumRowsA(updatedData.length);
      }
    } catch (error) {
      const emptyData = generateRoleData(100, defaultColsD);
      const updatedData = updateIndexNo(emptyData);
      setGridDataA(updatedData);
      setNumRowsA(updatedData.length);
    } finally {
      controllers.current.fetchData1 = null;
      setLoading(false)
    }
  }, [])
  const fetchData2 = useCallback(async (seq) => {
    setLoading(true)
    if (controllers.current.fetchData2) {
      controllers.current.fetchData2.abort();
      controllers.current.fetchData2 = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchData2 = controller;
    try {
      const response = await getPaginatedRolesMenu(seq, 1, 10000, signal)
      if (response.success) {
        const fetchedData = response.data || [];
        const emptyData = generateRoleData(100, defaultColsD);
        const combinedData = [...fetchedData, ...emptyData];
        const updatedData = updateIndexNo(combinedData);
        setGridDataB(updatedData);
        setNumRowsB(updatedData.length);
      }
    } catch (error) {
      const emptyData = generateRoleData(100, defaultColsD);
      const updatedData = updateIndexNo(emptyData);
      setGridDataB(updatedData);
      setNumRowsB(updatedData.length);
    } finally {
      controllers.current.fetchData2 = null;
      setLoading(false)
    }
  }, [])
  const fetchData3 = useCallback(async (seq) => {
    setLoading(true)
    if (controllers.current.fetchData3) {
      controllers.current.fetchData3.abort();
      controllers.current.fetchData3 = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchData3 = controller;
    try {
      const response = await getPaginatedRolesUsers(seq, 1, 10000, signal)
      if (response.success) {
        const fetchedData = response.data || [];
        const emptyData = generateRoleData(100, defaultColsD);
        const combinedData = [...fetchedData, ...emptyData];
        const updatedData = updateIndexNo(combinedData);
        setGridDataC(updatedData);
        setNumRowsC(updatedData.length);
      }
    } catch (error) {
      const emptyData = generateRoleData(100, defaultColsD);
      const updatedData = updateIndexNo(emptyData);
      setGridDataC(updatedData);
      setNumRowsC(updatedData.length);
    } finally {
      controllers.current.fetchData3 = null;
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDataGroups()
  }, [])

  const handleRowAppendD = useCallback(
    (numRowsToAddD) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppendedRow(colsD, setGridDataD, setNumRowsD, setAddedRowsD, numRowsToAddD)
    },
    [colsD, setGridDataD, setNumRowsD, setAddedRowsD, numRowsToAddD]
  )

  const handleRowAppendA = useCallback(
    (numRowsToAddA) => {
      if (canCreate === false || canEdit === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      if (dataType.length === 0 && dataType[0].Id) {
        return;
      }
      onRowAppendedRow(colsA, setGridDataA, setNumRowsA, setAddedRowsA, numRowsToAddA)
    },
    [colsA, setGridDataA, setNumRowsA, setAddedRowsA, numRowsToAddA, dataType]
  )

  const handleRowAppendB = useCallback(
    (numRowsToAddB) => {
      if (canCreate === false || canEdit === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      if (dataType.length === 0 && dataType[0].Id) {
        return;
      }
      onRowAppendedRow(colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB)
    },
    [colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB, dataType]
  )

  const handleRowAppendC = useCallback(
    (numRowsToAddC) => {
      if (canCreate === false || canEdit === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      if (dataType.length === 0 && !dataType[0]?.Id) {
        return;
      }
      onRowAppendedRow(colsC, setGridDataC, setNumRowsC, setAddedRowsC, numRowsToAddC)
    },
    [colsC, setGridDataC, setNumRowsC, setAddedRowsC, numRowsToAddC, dataType]
  )



  const getSelectedRowsDataD = () => {
    const selectedRows = selectionD.rows.items;

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridDataD[start + i]).filter((row) => row !== undefined)
    );
  };


  useEffect(() => {
    const data = getSelectedRowsDataD();
    if (data && data.length > 0 && data[0].Id) {
      fetchData2(data[0].Id);
      fetchData1(data[0].Id);
      fetchData3(data[0].Id);
      setDataType(data);
    } else {
      setDataType([]);
    }
  }, [selectionD.rows.items]);


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
        dataHelp01,
        dataHelp02,
        dataHelp03

      ] = await Promise.all([
        getHelpRoleRootMenu(1, 1000, '', signal),
        getHelpMenu(1, 1000, '', signal),
        getHelpUsers(1, 1000, '', signal),

      ]);

      setDataHelp01(dataHelp01?.data?.data || []);
      setDataHelp02(dataHelp02?.data?.data || []);
      setDataHelp03(dataHelp03?.data?.data || []);


    } catch (error) {
      setDataHelp01([])
      setDataHelp02([])
      setDataHelp03([])

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

  const getSelectedRowsA = () =>
    selectionA.rows.items.flatMap(([start, end]) =>
      gridDataA.slice(start, end)
    );
  const getSelectedRowsB = () =>
    selectionB.rows.items.flatMap(([start, end]) =>
      gridDataB.slice(start, end)
    );
  const getSelectedRowsC = () =>
    selectionC.rows.items.flatMap(([start, end]) =>
      gridDataC.slice(start, end)
    );
  const getSelectedRowsD = () =>
    selectionD.rows.items.flatMap(([start, end]) =>
      gridDataD.slice(start, end)
    );

  const resetTableA = () => {
    setSelectionA({
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
  const resetTableC = () => {
    setSelectionC({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty()
    })
  }
  const resetTableD = () => {
    setSelectionD({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty()
    })
  }
  const handleDelete = useCallback(async () => {
    if (!canDelete) {
      showErrorNotifiD(['Bạn không có quyền xóa dữ liệu']);
      loadingBarRef.current?.complete();
      togglePageInteraction(false);
      return;
    }

    loadingBarRef.current?.continuousStart();
    togglePageInteraction(true);
    showLoadingNotifiD();

    try {
      const selectedA = getSelectedRowsA();
      const selectedB = getSelectedRowsB();
      const selectedC = getSelectedRowsC();
      const selectedD = getSelectedRowsD();

      const deleteTasks = [];
      if (selectedA.length) {
        deleteTasks.push(removeSelectedRows(getSelectedRowsA, DeleteDRole, gridDataA, setGridDataA, setNumRowsA, resetTableA, "Id"));
      }
      if (selectedB.length) {
        deleteTasks.push(removeSelectedRows(getSelectedRowsB, DeleteDRole, gridDataB, setGridDataB, setNumRowsB, resetTableB, "Id"));
      }
      if (selectedC.length) {
        deleteTasks.push(removeSelectedRows(getSelectedRowsC, DeleteDRole, gridDataC, setGridDataC, setNumRowsC, resetTableC, "Id"));
      }
      if (selectedD.length) {
        const resultD = await removeStatusA(getSelectedRowsD, gridDataD, setGridDataD, setNumRowsD, resetTableD);
        if (resultD) deleteTasks.push(resultD);
      }

      if (!deleteTasks.length) {
        showErrorNotifiD(["Không có dữ liệu nào được chọn!"]);
        return;
      }

      const results = await Promise.all(deleteTasks);

      const failedDeletes = results.filter((result) => !result.success);
      if (failedDeletes.length > 0) {
        showErrorNotifiD(failedDeletes.map((res) => res.message || "Xóa dữ liệu thất bại!"));
      } else {
        showSuccessNotifiD();
      }
    } catch (error) {
      showErrorNotifiD([`Lỗi hệ thống: ${error.message}`]);
    } finally {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
    }
  }, [
    canDelete,
    getSelectedRowsA, getSelectedRowsB, getSelectedRowsC, getSelectedRowsD,
    DeleteDRole,
    setGridDataA, setGridDataB, setGridDataC, setGridDataD,
    setNumRowsA, setNumRowsB, setNumRowsC, setNumRowsD,
    resetTableA, resetTableB, resetTableC, resetTableD,
    selectionA, selectionB, selectionC, selectionD,
    gridDataA, gridDataB, gridDataC, gridDataD
  ]);
  const handleDeleteRoleGroup = useCallback(async () => {
    if (!canDelete) {
      showErrorNotifiD(['Bạn không có quyền xóa dữ liệu']);
      return;
    }

    loadingBarRef.current?.continuousStart();
    togglePageInteraction(true);
    showLoadingNotifiD();

    try {
      const selectedD = getSelectedRowsD();
      if (!selectedD.length) {
        showErrorNotifiD(["Không có dữ liệu nào được chọn!"]);
        return;
      }

      const result = await removeSelectedRows(
        getSelectedRowsD,
        DeleteDRoleGroup,
        gridDataD,
        setGridDataD,
        setNumRowsD,
        resetTableD,
        "Id"
      );

      if (!result.success) {
        showErrorNotifiD([result.message || "Xóa dữ liệu thất bại!"]);
      } else {
        showSuccessNotifiD();
      }
    } catch (error) {
      showErrorNotifiD([`Lỗi hệ thống: ${error.message}`]);
    } finally {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
    }
  }, [canDelete, getSelectedRowsD, DeleteDRoleGroup, gridDataD, setGridDataD, setNumRowsD, resetTableD]);

  const handleSaveA = useCallback(async () => {
    if (!canCreate) {
      showErrorNotifiAorU(['Bạn không có quyền thêm dữ liệu']);
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      return false;
    }

    togglePageInteraction(true);
    loadingBarRef.current?.continuousStart();

    const columnsU = ['Id', 'GroupId', 'RootMenuId', 'View', 'Type', 'IdxNo'];
    const columnsA = ['GroupId', 'RootMenuId', 'View', 'Type', 'IdxNo'];
    const resulU = filterAndSelectColumnsRow(gridDataA, columnsU, 'U');
    const resulA = filterAndSelectColumnsRow(gridDataA, columnsA, 'A');


    const requiredColumns = {
      "Nhóm người dùng": "GroupId",
      "Mã root menu": "RootMenuId",
      "Loại": "Type",
    };
    const validationMessage = validateColumnsTrans([...resulU, ...resulA], [...columnsU, ...columnsA], requiredColumns);
    if (validationMessage !== true) {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      showWarningNotifiAorU([validationMessage]);
      return;
    }
    if (resulA.length === 0 && resulU.length === 0) {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      return true;
    }

    try {
      const promises = [];
      if (resulA.length > 0) promises.push(PostARoleGroupUsers(resulA));
      if (resulU.length > 0) promises.push(PostURoleGroupUsers(resulU));

      const results = await Promise.all(promises);
      const isSuccess = results.every(result => result.success);

      if (isSuccess) {
        const newData = results.flatMap(result => result.data?.data || []);
        setGridDataA(prevGridData => {
          const updatedGridData = prevGridData.map(item => {
            const matchingData = newData.find(data => data.IdxNo === item.IdxNo);
            return matchingData || item;
          });
          return updateIndexNo(updatedGridData);
        });
        resetTableA();
      }

      return isSuccess;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    } finally {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
    }
  }, [gridDataA, canCreate]);
  const handleSaveB = useCallback(async () => {
    if (!canCreate) {
      showErrorNotifiAorU(['Bạn không có quyền thêm dữ liệu']);
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      return false;
    }

    togglePageInteraction(true);
    loadingBarRef.current?.continuousStart();

    const columnsU = ['Id', 'GroupId', 'MenuId', 'View', , 'Create', 'Edit', 'Delete', 'Type', 'IdxNo'];
    const columnsA = ['GroupId', 'MenuId', 'View', 'Create', 'Edit', 'Delete', 'Type', 'IdxNo'];
    const resulU = filterAndSelectColumnsRow(gridDataB, columnsU, 'U');
    const resulA = filterAndSelectColumnsRow(gridDataB, columnsA, 'A');

    const requiredColumns = {
      "Nhóm người dùng": "GroupId",
      "Mã menu": "MenuId",
      "Loại": "Type",
    };
    const validationMessage = validateColumnsTrans([...resulU, ...resulA], [...columnsU, ...columnsA], requiredColumns);
    if (validationMessage !== true) {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      showWarningNotifiAorU([validationMessage]);
      return;
    }
    if (resulA.length === 0 && resulU.length === 0) {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      return true;
    }

    try {
      const promises = [];
      if (resulA.length > 0) promises.push(PostARoleGroupUsers(resulA));
      if (resulU.length > 0) promises.push(PostURoleGroupUsers(resulU));

      const results = await Promise.all(promises);
      const isSuccess = results.every(result => result.success);

      if (isSuccess) {
        const newData = results.flatMap(result => result.data?.data || []);
        setGridDataB(prevGridData => {
          const updatedGridData = prevGridData.map(item => {
            const matchingData = newData.find(data => data.IdxNo === item.IdxNo);
            return matchingData || item;
          });
          return updateIndexNo(updatedGridData);
        });
        resetTableB();
      }

      return isSuccess;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    } finally {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
    }
  }, [gridDataB, canCreate]);
  const handleSaveC = useCallback(async () => {
    if (!canCreate) {
      showErrorNotifiAorU(['Bạn không có quyền thêm dữ liệu']);
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      return false;
    }

    togglePageInteraction(true);
    loadingBarRef.current?.continuousStart();

    const columnsU = ['Id', 'GroupId', 'UserId', 'Type', 'IdxNo'];
    const columnsA = ['GroupId', 'UserId', 'Type', 'IdxNo'];
    const resulU = filterAndSelectColumnsRow(gridDataC, columnsU, 'U');
    const resulA = filterAndSelectColumnsRow(gridDataC, columnsA, 'A');

    const requiredColumns = {
      "Nhóm nhân viên": "UserId",
      "Mã nhóm": "GroupId",
      "Loại": "Type",
    };
    const validationMessage = validateColumnsTrans([...resulU, ...resulA], [...columnsU, ...columnsA], requiredColumns);
    if (validationMessage !== true) {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      showWarningNotifiAorU([validationMessage]);
      return;
    }
    if (resulA.length === 0 && resulU.length === 0) {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      return true;
    }

    try {
      const promises = [];
      if (resulA.length > 0) promises.push(PostARoleGroupUsers(resulA));
      if (resulU.length > 0) promises.push(PostURoleGroupUsers(resulU));

      const results = await Promise.all(promises);
      const isSuccess = results.every(result => result.success);

      if (isSuccess) {
        const newData = results.flatMap(result => result.data?.data || []);
        setGridDataC(prevGridData => {
          const updatedGridData = prevGridData.map(item => {
            const matchingData = newData.find(data => data.IdxNo === item.IdxNo);
            return matchingData || item;
          });
          return updateIndexNo(updatedGridData);
        });
        resetTableB();
      }

      return isSuccess;
    } catch (error) {
      return false;
    } finally {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
    }
  }, [gridDataC, canCreate]);


  const handleSaveD = useCallback(async () => {
    if (!canCreate) {
      showErrorNotifiAorU(['Bạn không có quyền thêm dữ liệu']);
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      return false;
    }

    togglePageInteraction(true);
    loadingBarRef.current?.continuousStart();

    const columnsU = ['Id', 'Name', 'IdxNo'];
    const columnsA = ['Name', 'IdxNo'];
    const resulU = filterAndSelectColumnsRow(gridDataD, columnsU, 'U');
    const resulA = filterAndSelectColumnsRow(gridDataD, columnsA, 'A');
    const requiredColumns = {
      "Nhóm người dùng": "Name",
    };
    const validationMessage = validateColumnsTrans([...resulU, ...resulA], [...columnsU, ...columnsA], requiredColumns);
    if (validationMessage !== true) {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      showWarningNotifiAorU([validationMessage]);
      return;
    }
    if (resulA.length === 0 && resulU.length === 0) {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
      return true;
    }

    try {
      const promises = [];
      if (resulA.length > 0) promises.push(RoleGroupA(resulA));
      if (resulU.length > 0) promises.push(RoleGroupU(resulU));

      const results = await Promise.all(promises);
      const isSuccess = results.every(result => result.success);

      if (isSuccess) {
        const newData = results.flatMap(result => result?.data || []);
        setGridDataD(prevGridData => {
          const updatedGridData = prevGridData.map(item => {
            const found = newData.find(data => data.IdxNo === item.IdxNo);
            return found ? { ...item, Status: '', IdxNo: found.IdxNo, Id: found.Id } : item;
          });
          return updateIndexNo(updatedGridData);
        });
        resetTableD();
      }

      return isSuccess;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    } finally {
      togglePageInteraction(false);
      loadingBarRef.current?.complete();
    }
  }, [gridDataD, canCreate]);

  const handleSave = async () => {
    await handleSaveA();
    await handleSaveB();
    await handleSaveC();
    await handleSaveD();


  };

  return (
    <>
      <Helmet>
        <title>ITM - {t('Role Management')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col  md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] m h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-end p-2 bg-white border-b">
              <RoleManagementActions
                handleDelete={handleDelete}
                handleSave={handleSave}
                handleDeleteRoleGroup={handleDeleteRoleGroup}
              />
            </div>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full   overflow-auto">
            <ViewRoleManagement
              loading={loading}
              controllers={controllers}
              dataType={dataType}

              defaultColsA={defaultColsA}
              defaultColsB={defaultColsB}
              defaultColsC={defaultColsC}
              defaultColsD={defaultColsD}
              gridDataA={gridDataA}
              gridDataB={gridDataB}
              gridDataC={gridDataC}
              gridDataD={gridDataD}
              setGridDataA={setGridDataA}
              setGridDataB={setGridDataB}
              setGridDataC={setGridDataC}
              setGridDataD={setGridDataD}
              selectionA={selectionA}
              selectionB={selectionB}
              selectionC={selectionC}
              selectionD={selectionD}
              setSelectionA={setSelectionA}
              setSelectionB={setSelectionB}
              setSelectionC={setSelectionC}
              setSelectionD={setSelectionD}
              numRowsA={numRowsA}
              numRowsB={numRowsB}
              numRowsC={numRowsC}
              numRowsD={numRowsD}

              setNumRowsA={setNumRowsA}
              setNumRowsB={setNumRowsB}
              setNumRowsC={setNumRowsC}
              setNumRowsD={setNumRowsD}
              numRowsToAddA={numRowsToAddA}
              numRowsToAddB={numRowsToAddB}
              numRowsToAddC={numRowsToAddC}
              numRowsToAddD={numRowsToAddD}
              setNumRowsToAddA={setNumRowsToAddA}
              setNumRowsToAddB={setNumRowsToAddB}
              setNumRowsToAddC={setNumRowsToAddC}
              setNumRowsToAddD={setNumRowsToAddD}
              colsA={colsA}
              colsB={colsB}
              colsC={colsC}
              colsD={colsD}
              setColsA={setColsA}
              setColsB={setColsB}
              setColsC={setColsC}
              setColsD={setColsD}
              handleRowAppendD={handleRowAppendD}
              handleRowAppendA={handleRowAppendA}
              handleRowAppendB={handleRowAppendB}
              handleRowAppendC={handleRowAppendC}


              setDataHelp01={setDataHelp01}
              setDataHelp02={setDataHelp02}
              setDataHelp03={setDataHelp03}
              dataHelp01={dataHelp01}
              dataHelp02={dataHelp02}
              dataHelp03={dataHelp03}


              showSearchA={showSearchA}
              setShowSearchA={setShowSearchA}

              showSearchB={showSearchB}
              setShowSearchB={setShowSearchB}
              showSearchC={showSearchC}
              setShowSearchC={setShowSearchC}
              showSearchD={showSearchD}
              setShowSearchD={setShowSearchD}
            />
          </div>
        </div>

      </div>
    </>
  )
}
