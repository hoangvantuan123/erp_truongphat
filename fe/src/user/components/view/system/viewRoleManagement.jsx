import { useState, useEffect, useCallback } from 'react'
import { Menu, Button, Input, Table, Space, Checkbox, Layout, Tabs } from 'antd'
import {
  FolderOutlined,
  DeleteOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  KeyOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'

import TabRoleGroupMenuAccess from '../../tabs/system/tabRoleGroupMenuAccess'
import TabRoleMenuAccessPermiss from '../../tabs/system/tabRoleMenuPermiss'
import TabRoleListUser from '../../tabs/system/tabRoleListUser'
import TabRole from '../../tabs/system/tabRole'
const { Header, Content, Footer } = Layout
const menuStyle = { borderInlineEnd: 'none' }

function ViewRoleManagement({
  defaultColsA,
  defaultColsB,
  defaultColsC,
  defaultColsD,
  gridDataA,
  gridDataB,
  gridDataC,
  gridDataD,
  setGridDataA,
  setGridDataB,
  setGridDataC,
  setGridDataD,
  selectionA,
  setSelectionA,
  selectionB,
  setSelectionB,
  selectionC,
  setSelectionC,
  selectionD,
  setSelectionD,
  numRowsA,
  setNumRowsA,
  numRowsD,
  setNumRowsD,
  numRowsB,
  setNumRowsB,
  numRowsC,
  setNumRowsC,
  numRowsToAddA,
  setNumRowsToAddA,
  numRowsToAddB,
  setNumRowsToAddB,
  numRowsToAddC,
  setNumRowsToAddC,
  numRowsToAddD,
  setNumRowsToAddD,
  colsA,
  setColsA,
  colsB,
  setColsB,
  colsC,
  setColsC,
  colsD,
  setColsD,
  handleRowAppendD,
  handleRowAppendA,
  handleRowAppendB,
  handleRowAppendC,
  dataType,
  setDataHelp01,
  setDataHelp02,
  setDataHelp03,
  dataHelp01,
  dataHelp02,
  dataHelp03,

  showSearchA,
  setShowSearchA,
  showSearchB,
  setShowSearchB,
  showSearchC,
  setShowSearchC,
  showSearchD,
  setShowSearchD,

}) {
  const [current, setCurrent] = useState('2')

  const handleMenuClick = (e) => {
    setCurrent(e.key)
  }


  const items = [

    {
      key: '2',
      label: 'QUYỀN TRUY CẬP NHÓM',
      icon: <KeyOutlined />,
      children: (
        <TabRoleGroupMenuAccess
          setSelection={setSelectionA}
          selection={selectionA}
          setGridData={setGridDataA}
          gridData={gridDataA}
          numRows={numRowsA}
          setCols={setColsA}
          cols={colsA}
          handleRowAppend={handleRowAppendA}
          dataType={dataType}
          defaultCols={defaultColsA}
          setDataHelp01={setDataHelp01}
          dataHelp01={dataHelp01}
          showSearch={showSearchA}
          setShowSearch={setShowSearchA}
        />
      )
    },
    {
      key: '3',
      label: 'QUYỀN TRUY CẬP MENU',
      icon: <AppstoreAddOutlined />,
      children: (
        <TabRoleMenuAccessPermiss
          setDataHelp02={setDataHelp02}
          dataHelp02={dataHelp02}
          setSelection={setSelectionB}
          selection={selectionB}
          setGridData={setGridDataB}
          gridData={gridDataB}
          numRows={numRowsB}
          setCols={setColsB}
          cols={colsB}
          dataType={dataType}
          handleRowAppend={handleRowAppendB}
          defaultCols={defaultColsB}
          showSearch={showSearchB}
          setShowSearch={setShowSearchB}
        />
      )
    },
    {
      key: '4',
      label: 'DANH SÁCH NGƯỜI DÙNG',
      icon: <UnorderedListOutlined />,
      children: (
        <TabRoleListUser
          setDataHelp03={setDataHelp03}
          dataHelp03={dataHelp03}
          setSelection={setSelectionC}
          selection={selectionC}
          setGridData={setGridDataC}
          gridData={gridDataC}
          numRows={numRowsC}
          setCols={setColsC}
          dataType={dataType}
          handleRowAppend={handleRowAppendC}
          cols={colsC}
          defaultCols={defaultColsC}
          showSearch={showSearchC}
          setShowSearch={setShowSearchC}
        />
      )
    }
  ]

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-1/5 h-full flex flex-col bg-white overflow-hidden">
        <TabRole
          setSelection={setSelectionD}
          selection={selectionD}
          setGridData={setGridDataD}
          gridData={gridDataD}
          numRows={numRowsD}
          setCols={setColsD}
          cols={colsD}
          defaultCols={defaultColsD}
          handleRowAppend={handleRowAppendD}
          showSearch={showSearchD}
          setShowSearch={setShowSearchD}
        />
      </div>

      <div className="w-10/12 h-full flex flex-col bg-white overflow-hidden">
        <div className="flex h-full">
          <Menu
            onClick={handleMenuClick}
            selectedKeys={[current]}
            mode="vertical"
            style={menuStyle}
            className="h-full w-[300px] overflow-auto"
          >
            <div className="font-medium text-[10px] border-b text-gray-700 uppercase p-4">
              QUYỀN TRUY CẬP
            </div>
            {items.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <span className="text-xs">{item.label}</span>
              </Menu.Item>
            ))}
          </Menu>

          <div className="w-full h-full flex flex-col border-l bg-white overflow-hidden">
            <div className="flex-grow overflow-auto">
              {items.find((item) => item.key === current)?.children}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ViewRoleManagement
