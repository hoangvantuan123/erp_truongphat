import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Tree } from 'antd'


function TableOrgTree({
  dataTree,
  setDataTree,
  checkedKeys,
  setCheckedKeys,
  selectNode,
  setSelectNode,
}) {
  const { t } = useTranslation()
  const [isEditTree, setIsEditTree] = useState(false)

  const [selectedKeys, setSelectedKeys] = useState([])

  const onSelect = (selectedKeys, info) => {
    const selectedKey = info.node.key;
    setSelectNode(info.node)
    setCheckedKeys((prev) => {
      if (prev.includes(selectedKey)) {
        return prev.filter((key) => key !== selectedKey);
      } else {
        return [...prev, selectedKey];
      }
    });
  };


  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
  
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
  
    const updateLevels = (node, level) => {
      node.Level = level;
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => updateLevels(child, level + 1));
      }
    };
  
    const updateSort = (siblings) => {
      siblings.forEach((child, index) => {
        child.Sort = index + 1;
      });
    };
  
    const data = [...dataTree];
    let dragObj;
  
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
  
    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
  
        updateLevels(dragObj, (item.Level ?? 0) + 1);
        updateSort(item.children);
      });
    } else {
      let siblings = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        siblings = arr;
        i = index;
      });
  
      if (dropPosition === -1) {
        siblings.splice(i, 0, dragObj);
      } else {
        siblings.splice(i + 1, 0, dragObj);
      }
  
      const parentLevel = siblings[0]?.Level ?? 0;
      updateLevels(dragObj, parentLevel);
      updateSort(siblings);
    }
  
    setDataTree(data);
  };


  

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
            draggable
            onDrop={onDrop}
            selectedKeys={selectedKeys}
            checkedKeys={checkedKeys}
            onCheck={setCheckedKeys}
          />
        </div>
      </div>
    </div>
  )
}

export default TableOrgTree
