import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, Layout } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetSysttemUsersList } from '../../../features/system/getRolesUsers'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { useNavigate } from 'react-router-dom'
import { UpdatePass2 } from '../../../features/admin/updatePass'
import UserManagementActions from '../../components/actions/system/userManagementActions'
import TableUserManagement from '../../components/table/system/tableUserManagement'
import UserManagementQuery from '../../components/query/system/userManagementQuery'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { filterAndSelectColumnsA } from '../../../utils/filterA'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { PostUpdateUsers } from '../../../features/system/postUpdateUsers'
import TopLoadingBar from 'react-top-loading-bar';
import { PostAUsers } from '../../../features/system/users/postAUsers'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { PostQHelpUsers } from '../../../features/system/users/postQUsers'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
const { Title, Text } = Typography



export default function UserManagement({ permissions, canCreate,
  canEdit,
  canDelete, isMobile, controllers,
  cancelAllRequests }) {
  const loadingBarRef = useRef(null);
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const defaultCols = useMemo(() => [
    {
      title: '#',
      id: 'Status',
      kind: 'Text',
      readonly: true,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup
    },
    {
      title: t('UserSeq'),
      id: 'UserSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: t('EmpSeq'),
      id: 'EmpSeq',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },

    {
      title: t('860000012'),
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
      title: t('860000011'),
      id: 'UserName',
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
      title: t('Mail'),
      id: 'PwdMailAdder',
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
      title: t('AccountScope'),
      id: 'AccountScope',
      kind: 'Text',
      readonly: false,
      width: 150,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
    {
      title: t('ForceOtpLogin'),
      id: 'ForceOtpLogin',
      kind: 'Text',
      readonly: false,
      width: 150,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderString,
      trailingRowOptions: {
        disabled: true,
      },
    },
  ], [t]);
  const navigate = useNavigate()
  const [test, setTest] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingUpdatePass, setLoadingUpadtePass] = useState(false)
  const [data, setData] = useState([])
  const [gridData, setGridData] = useState([])
  const [toDate, setToDate] = useState(dayjs())
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [keyPath, setKeyPath] = useState(null)
  const [checkedPath, setCheckedPath] = useState(false)
  const [searchTriggered, setSearchTriggered] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])
  const [editedRows, setEditedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  /* const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet('S_ERP_COLS_PAGE_USERS_MANAGE', defaultCols),
  ) */
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_USERS_MANAGE',
      defaultCols.filter((col) => col.visible)
    )
  )
  const [helpData01, setHelpData01] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty()
    })
  }
  const fetchSystemUsersData = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchSystemUsersData) {
      controllers.current.fetchSystemUsersData.abort();
      controllers.current.fetchSystemUsersData = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchSystemUsersData = controller;

    try {
      const response = await GetSysttemUsersList(userId, userName, signal)
      const fetchedData = updateIndexNo(response.data) || [];
      const emptyData = generateEmptyData(100, defaultCols)
      const updatedData = updateIndexNo([...fetchedData, ...emptyData])
      setGridData(updatedData);
      setNumRows(updatedData.length);
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    } catch (error) {
      setGridData([])
      setNumRows(0)
    } finally {
      controllers.current.fetchSystemUsersData = null;
      setLoading(false)
    }
  }, [userId, userName])

  const handleSearch = () => {
    setSearchTriggered(true)
    fetchSystemUsersData()
  }
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

    try {
      const search = {


      };
      const [
        help01,


      ] = await Promise.all([
        PostQHelpUsers(search, signal)

      ])

      setHelpData01(help01?.data || [])


    } catch (error) {
      setHelpData01([])


    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchCodeHelpData = null;

    }
  }, [])
  useEffect(() => {
    cancelAllRequests();
    message.destroy();
    fetchCodeHelpData()
    fetchSystemUsersData()
  }, [])

  const getSelectedRowIndices = () => {
    const selectedRows = selection.rows.items
    let indices = []

    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        indices.push(i)
      }
    })

    return indices
  }
  const handleUpdatePassUsers = async () => {
    if (!isAPISuccess) {
      return
    }
    setIsAPISuccess(false)
    setLoadingUpadtePass(true)
    const loadingMessage = message.loading('Updating passwords...', 0)
    try {
      const selectedRowIndices = getSelectedRowIndices()
      const selectedIds = selectedRowIndices.map((index) => gridData[index].UserId)
      await UpdatePass2(selectedIds)
      loadingMessage()
      message.success('Passwords updated successfully!')
    } catch (error) {
      loadingMessage()
      message.error('Failed to update passwords. Please try again.')
    } finally {
      setIsAPISuccess(true)
      setLoadingUpadtePass(false)
    }
  }



  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )

  const handleSaveData = useCallback(async () => {
    togglePageInteraction(true);
  
    if (canCreate === false) {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      message.warning('Bạn không có quyền thêm dữ liệu');
      return;
    }
  
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
  
    const columnsU = ['UserSeq', 'AccountScope', 'PwdMailAdder'];
    const columnsA = ['UserId', 'AccountScope', 'UserName', 'PwdMailAdder', 'UserSeq', 'EmpSeq'];
  
    const resulU = filterAndSelectColumns(gridData, columnsU, 'U');
    const resulA = filterAndSelectColumns(gridData, columnsA, 'A');
  
    // 🔍 Check trùng UserId toàn bộ gridData (không phân biệt hoa thường)
    const userIdCount = new Map();
    gridData.forEach(row => {
      const id = String(row.UserId || '').trim().toLowerCase();
      if (!id) return;
      userIdCount.set(id, (userIdCount.get(id) || 0) + 1);
    });
  
    const duplicatedIds = [...userIdCount.entries()]
      .filter(([_, count]) => count > 1)
      .map(([id]) => id);
  
    if (duplicatedIds.length > 0) {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      togglePageInteraction(false);
      message.warning(`Các UserId bị trùng (không phân biệt hoa thường): ${duplicatedIds.join(', ')}`);
      return;
    }
  
    if (resulA.length > 0 || resulU.length > 0) {
      try {
        const promises = [];
  
        if (resulA.length > 0) {
          promises.push(PostAUsers(resulA));
        }
  
        if (resulU.length > 0) {
          promises.push(PostUpdateUsers(resulU));
        }
  
        const results = await Promise.all(promises);
  
        const updateGridData = (newData) => {
          setGridData((prevGridData) => {
            const updatedGridData = prevGridData.map((item) => {
              const matchingData = newData.find(
                (data) => String(data.UserSeq) === String(item.UserSeq)
              );
  
              if (matchingData) {
                return {
                  ...item,
                  Status: '',
                  ForceOtpLogin: item.Status === 'A' ? true : item.ForceOtpLogin,
                  
                };
              }
  
              return item;
            });
  
            return updateIndexNo(updatedGridData);
          });
        };
  
        const newData = results.flatMap((result) => result.data || []);
  
        results.forEach((result) => {
          if (result.success) {
            updateGridData(newData);
            togglePageInteraction(false);
            message.success('Dữ liệu đã được lưu thành công!');
          } else {
            if (loadingBarRef.current) {
              loadingBarRef.current.complete();
            }
            togglePageInteraction(false);
            message.warning('Có lỗi xảy ra khi lưu dữ liệu');
          }
        });
  
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
  
        togglePageInteraction(false);
        setIsSent(false);
        resetTable();
      } catch (error) {
        setIsSent(false);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        togglePageInteraction(false);
        message.error('Có lỗi xảy ra khi lưu dữ liệu');
      }
    } else {
      setIsSent(false);
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      message.warning('Không có dữ liệu để lưu!');
    }
  }, [gridData]);
  

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

  useKeydownHandler(isCellSelected, setOpenHelp)
  const getSelectedRowsItem = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          gridData[i]['IdxNo'] = i + 1
          rows.push(gridData[i])
        }
      }
    })

    return rows
  }

  const handleDeleteDataSheet = useCallback(
    (e) => {
      togglePageInteraction(true)
      if (canDelete === false) {
        message.warning(t('870000018'))
        togglePageInteraction(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return
      }
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }


      const selectedRows = getSelectedRowsItem()

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')



      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        const remainingEditedRows = editedRows.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow?.Id),
        )
        togglePageInteraction(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        const updatedDataEditedRows = updateIndexNo(remainingEditedRows);
        const updatedRemainingRows = updateIndexNo(remainingRows);
        setEditedRows(updatedDataEditedRows)
        setGridData(updatedRemainingRows)
        setNumRows(remainingRows.length)
        resetTable()
      }
    },
    [
      canDelete,
      gridData,
      selection,
      editedRows,

    ],
  )

  return (
    <>
      <Helmet>
        <title>ITM - {t('850000021')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex p-2 items-end justify-end">

              <UserManagementActions
                handleSearch={handleSearch}
                handleUpdatePassUsers={handleUpdatePassUsers}
                data={data}
                isAPISuccess={isAPISuccess}
                handleSaveData={handleSaveData}
                handleDeleteDataSheet={handleDeleteDataSheet}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                  <FilterOutlined />
                  {t('Điều kiện truy vấn')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>

              <div className="flex p-2 gap-4">
                <UserManagementQuery
                  setUserId={setUserId}
                  userId={userId}
                  setUserName={setUserName}
                  userName={userName}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 border-t overflow-auto relative">
            <TableUserManagement
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
              helpData01={helpData01}
              setHelpData01={setHelpData01}
            />
          </div>
        </div>
      </div>
    </>
  )
}