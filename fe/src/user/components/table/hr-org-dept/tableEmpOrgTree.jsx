import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tree } from 'antd'


function TableEmpOrgTree({
  dataTree,
  setDataTree,
  checkedKeys,
  setCheckedKeys,
  selectNode,
  setSelectNode,
  onSelect,
  selectedKeys,
}) {
  const { t } = useTranslation()
  const [isEditTree, setIsEditTree] = useState(false)

  return (
    <div className="w-full  h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col bg-white  overflow-x-hidden overflow-hidden ">
        <div className="overflow-y-auto flex-1">
          <Tree
            checkable
            className="draggable-tree"
            showLine={true}
            showIcon={true}
            defaultExpandParent={['1']}
            onSelect={onSelect}
            treeData={dataTree}

            selectedKeys={selectedKeys}
            checkedKeys={checkedKeys}
            onCheck={setCheckedKeys}
          />
        </div>
      </div>
    </div>
  )
}

export default TableEmpOrgTree;
