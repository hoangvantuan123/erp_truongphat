import { useState } from 'react'
import { Button } from 'antd'
import { SaveOutlined, DeleteOutlined, ScissorOutlined } from '@ant-design/icons'

export default function RoleManagementActions({ handleDelete, handleSave, handleDeleteRoleGroup }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        key="save"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        variant="text"
        onClick={handleSave}
      >
        Save
      </Button>
      <Button
        icon={<DeleteOutlined />}
        size="middle"
        className="uppercase"
        variant="text"
        onClick={handleDeleteRoleGroup}
      >
        Xóa NHÓM
      </Button>
      <Button
        icon={<ScissorOutlined />}
        size="middle"
        className="uppercase"
        variant="text"
        onClick={handleDelete}
      >
        Xóa Sheet
      </Button>
    </div>
  )
}
