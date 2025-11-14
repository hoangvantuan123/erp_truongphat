import { useMemo } from 'react'
import { Table, Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const ErrorListModal = ({ dataError, setIsModalVisible, isModalVisible }) => {
  const columns = useMemo(
    () => [
      {
        title: 'Dòng bị lỗi',
        dataIndex: 'IDX_NO',
        key: 'IDX_NO',
      },
      {
        title: 'Thông tin lỗi',
        dataIndex: 'Name',
        key: 'Name',
      },
      {
        title: 'Thông báo lỗi',
        dataIndex: 'result',
        key: 'result',
      },
    ],
    [],
  )
  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: 'red', marginRight: 8 }} />
          Danh sách lỗi
        </span>
      }
      centered
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      footer={[
        <Button key="close" onClick={handleCancel}>
          Đóng
        </Button>,
      ]}
    >
      <Table
        bordered
        scroll={{ y: 300 }}
        dataSource={dataError?.map((error, index) => ({
          key: index,
          ...error,
        }))}
        columns={columns}
        pagination={false}
      />
    </Modal>
  )
}

export default ErrorListModal
