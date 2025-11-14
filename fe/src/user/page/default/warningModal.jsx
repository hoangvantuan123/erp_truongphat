import { useMemo } from "react";
import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const WarningModal = ({
    setIsModalVisible,
    isModalVisible,
    handleOnConfirm,
    handleOnDiscard
}) => {
  
    const handleOk = () => {
        handleOnConfirm();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDiscard = () => {
       
        handleOnDiscard()
    };





    return (
        <Modal
            centered
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            footer={false}
        >
            <div className="flex flex-col items-center justify-center">
                <div className="p-3 rounded-lg mb-4 bg-orange-50">
                    <ExclamationCircleOutlined style={{ fontSize: '44px', color: '#faad14' }} />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                    Warning
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    Nội dung đã được thay đổi, Bạn có muốn lưu không?
                </p>
                <div className="flex w-full gap-4">
                    <Button
                        key="discard"
                        size="large"
                        onClick={handleDiscard}
                        className="border-none w-full"
                        color="default" variant="filled"
                    >
                        Cancel
                    </Button>
                    <Button
                        key="confirm"
                        className="w-full"
                        size="large"
                        style={{ backgroundColor: '#faad14', borderColor: '#faad14', color: '#fff' }}
                        onClick={handleOk}
                    >
                        Confirm
                    </Button>

                </div>
            </div>
        </Modal>
    );
};

export default WarningModal;