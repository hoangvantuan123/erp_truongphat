import { Button, Dropdown, Menu, message, Input, Space, Form, Modal } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    DeleteOutlined,
    FileSearchOutlined,
    UploadOutlined,
    FileAddOutlined,
    DeleteRowOutlined,
    PrinterOutlined
} from '@ant-design/icons'
import { HandleError } from '../../../../page/default/handleError'
import { useTranslation } from 'react-i18next'
export default function PM01Action({
    handleSaveData,
    triggerFileInput,
    handleDeleteDataSheet,
    handleSearchData,
    CreateNew,
    handleDeleteDataSheetMater,
    SupplyContSeq,
    SupplyContNo
}) {
    const showConfirmAdd = () => {
        Modal.confirm({
            title: t('Tạo mới yêu cầu'),
            content: (
                <div>
                    <p>{t('Bạn sắp tạo mới thông tin đăng ký hợp đồng.')}</p>
                    <p className="text-red-500">
                        {t('Lưu ý: Dữ liệu hiện tại (nếu chưa được lưu) sẽ bị mất.')}
                    </p>
                    <p>{t('Bạn có chắc chắn muốn tiếp tục không?')}</p>
                </div>
            ),
            centered: true,
            okText: t('Tạo mới'),
            cancelText: t('Hủy'),
            onOk: () => {
                CreateNew()
            },
        })
    }

    const { t } = useTranslation()
    const showConfirmDelete = () => {


        if (!SupplyContSeq) {

            HandleError([{
                success: false,
                message: 'Hợp đồng chưa được tạo, vui lòng kiểm tra lại.'
            }]);
            return;
        }
        Modal.confirm({
            title: t('Xóa đơn yêu cầu'),
            content: (
                <div>
                    <p>
                        {t('Bạn sắp xóa vĩnh viễn Số ')}
                        <span className="text-red-500 font-bold">
                            #{SupplyContNo}
                        </span>
                        {t(' hợp đồng này khỏi hệ thống.')}
                    </p>

                    <p className="text-red-500">
                        {t('Hành động này không thể hoàn tác.')}
                    </p>

                    <p>{t('Vui lòng xác nhận trước khi tiếp tục.')}</p>
                </div>

            ),
            centered: true,
            okText: t('Xóa ngay'),
            cancelText: t('Hủy'),
            okButtonProps: { danger: true },
            onOk: () => {
                handleDeleteDataSheetMater()
            },
        })
    }

    return (
        <div className="flex items-center gap-1">

            <Button icon={<FileAddOutlined />} onClick={showConfirmAdd} size="middle" className="uppercase">
                {t('Mới')}
            </Button>
            <Button icon={<SearchOutlined />} onClick={handleSearchData} size="middle" className="uppercase">
                {t('Truy vấn')}
            </Button>
            <Button icon={<SaveOutlined />} onClick={handleSaveData} size="middle" className="uppercase">
                {t('Lưu')}
            </Button>
            <Button icon={<DeleteRowOutlined />} onClick={handleDeleteDataSheet} size="middle" className="uppercase">
                {t('Xóa Sheet')}
            </Button>
            <Button icon={<DeleteOutlined />} onClick={showConfirmDelete} size="middle" className="uppercase">
                {t('Xóa hợp đồng')}
            </Button>

         
            <Button icon={<PrinterOutlined />} size="middle" className="uppercase">
                {t('In hợp đồng')}
            </Button>



        </div>
    )
}
