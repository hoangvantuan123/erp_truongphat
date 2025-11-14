import { useState, useEffect, useRef } from 'react';
import { Button, Col, Form, Image, Select, Input, Row, Upload, Checkbox, DatePicker, message, InputNumber, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import {
    PenOff,
    LockKeyhole,

} from 'lucide-react';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PostUHrEmpOne } from '../../../../features/hr/hrEmpOne/postUHrEmpOne';
import { PostAvatar } from '../../../../features/upload/postAvatar';
import { HrFileD } from '../../../../features/hr/hrFile/HrFileD';
import { HOST_API_SERVER_14 } from '../../../../services';


function Emp0Table({
    dataSearch, dataRootInfo, form, dataSheetSearch, setModal2Open, setErrorData,
    helpData27,
    helpData28,
    helpData29,
    helpData30,
    helpData31,
    helpData32,
    helpData33,
    helpData34,
    helpData35,
    gridAvatar,
    setGridAvatar

}) {
    const uploadRef = useRef();
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [type26, setType26] = useState(null);
    const [type27, setType27] = useState(null);
    const [type28, setType28] = useState(null);
    const [type29, setType29] = useState(null);
    const [type30, setType30] = useState(null);
    const [type31, setType31] = useState(null);
    const [type32, setType32] = useState(null);
    const [type33, setType33] = useState(null);
    const [type34, setType34] = useState(null);
    const [type35, setType35] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);


    const { t } = useTranslation();

    useEffect(() => {
        if (dataSearch) {
            const getValidDate = (value) => {
                const date = dayjs(value);
                return date.isValid() ? date : null;
            };

            form.setFieldsValue({
                ...dataSearch,
                BirthDate: getValidDate(dataSearch.BirthDate),
                MarriageDate: getValidDate(dataSearch.MarriageDate),
                HandiAppdate: getValidDate(dataSearch.HandiAppdate),
                IsDisabled: dataSearch.IsDisabled === "1",
                IsForeigner: dataSearch.IsForeigner === "1",
                IsMarriage: dataSearch.IsMarriage === "1",
                IsVeteranEmp: dataSearch.IsVeteranEmp === "1",
                IsJobEmp: dataSearch.IsJobEmp === "1",
            });

            const rawPath = gridAvatar[0]?.Path;
            if (rawPath) {
                const relativePath = rawPath.replace('/ERP_CLOUD/user_files/', '');
                setPreviewImage(`${HOST_API_SERVER_14}/${relativePath}`);
            } else {
                setPreviewImage('');
            }
        }
    }, [dataSearch, form, gridAvatar]);


    const handleUpload = async () => {
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('Type', 'AVATAR');
        formData.append('IdSeqAvatar', gridAvatar[0]?.IdSeq || null);

        setLoading(true);
        const result = await PostAvatar(formData, dataSheetSearch[0]?.EmpSeq,);
        setLoading(false);

        if (result.success) {
            message.success('Tải ảnh thành công!');
            setGridAvatar(result.data)
        } else {
            message.error(result.message || 'Tải ảnh thất bại!');
        }
    };
    const handleDeleteImage = async () => {
        if (!file && !previewImage) return;
        setLoading2(true);

        try {
            const idSeq = gridAvatar[0]?.IdSeq;
            if (idSeq) {
                const res = await HrFileD([{ IdSeq: idSeq }]);
                setFile(null);
                setPreviewImage(null);
                message.success('Xóa thành công!');
                if (!res?.success) throw new Error(res?.message || "Xóa ảnh thất bại");
            } else {

                setFile(null);
                setPreviewImage(null);
            }
        } catch {
            console.log('none')
        } finally {
            setLoading2(false);
        }
    };



    const onFinish = async (values) => {
        const processedValues = [{
            ...values,
            BirthDate: values.BirthDate ? values.BirthDate.format('YYYYMMDD') : null,
            MarriageDate: values.MarriageDate ? values.MarriageDate.format('YYYYMMDD') : null,
            HandiAppdate: values.HandiAppdate ? values.HandiAppdate.format('YYYYMMDD') : null,
            EmpSeq: dataSheetSearch[0]?.EmpSeq,
            IdxNo: 1,
            SMBloodType: type27,
            SMBirthType: type28,
            UMNationSeq: type29,
            SMSexSeq: type30,
            UMReligionSeq: type31,
            UMEmployType: type32,
            UMHandiType: type33,
            UMHandiGrd: type34,
            UMRelSeq: type35,
        }];

        const result = await PostUHrEmpOne(processedValues);
        handleUpload()
        if (!result?.success) {
            const errorItems = result?.errors || [];
            setModal2Open(true);
            setErrorData(errorItems);
            return;
        }

    };


    const renderField = (name, label, icon) => (
        <Col span={8} key={name}>
            <Form.Item
                name={name}
                label={
                    <span className="uppercase text-[11px] flex items-center gap-1">
                        {icon}
                        {t(label)}
                    </span>
                }
                style={{ marginBottom: 8 }}
            >
                <Input placeholder={t('(Không có dữ liệu)')} variant="underlined" className=' font-medium' />
            </Form.Item>
        </Col>
    );
    const renderFieldReadOnly = (name, label, value, icon) => (
        <Col span={8} key={name}>
            <Form.Item
                label={
                    <span className="uppercase text-[11px] flex items-center gap-1">
                        {icon}
                        {t(label)}
                    </span>
                }
                style={{ marginBottom: 8 }}
            >
                <Input
                    value={value || ''}
                    placeholder={t('(Không có dữ liệu)')}
                    readOnly
                    className=' font-medium'
                    variant="underlined"
                />
                <LockKeyhole size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </Form.Item>
        </Col>
    );


    const renderFieldCheckbox = (name, label, icon) => (
        <Col span={8} key={name}>
            <Form.Item
                name={name}
                valuePropName="checked"
                label={
                    <span className="uppercase text-[11px] flex items-center gap-1">
                        {icon}
                        {t(label)}
                    </span>
                }
                style={{ marginBottom: 8 }}
            >
                <Checkbox />
            </Form.Item>
        </Col>
    );


    const renderFieldDateTime = (name, label, icon) => (
        <Col span={8} key={name}>
            <Form.Item
                name={name}
                label={
                    <span className="uppercase text-[11px] flex items-center gap-1">
                        {icon}
                        {t(label)}
                    </span>
                }
                style={{ marginBottom: 8 }}
            >
                <DatePicker
                    format="YYYY-MM-DD"
                    placeholder={t('(Không có dữ liệu)')}
                    style={{ width: '100%' }}
                    variant="underlined"
                />
            </Form.Item>
        </Col>
    );
    const renderFieldNumber = (name, label, icon) => (
        <Col span={8} key={name}>
            <Form.Item
                name={name}
                label={
                    <span className="uppercase text-[11px] flex items-center gap-1">
                        {icon}
                        {t(label)}
                    </span>
                }
                style={{ marginBottom: 8 }}
            >
                <InputNumber
                    variant="underlined"
                    style={{ width: '100%' }}
                    placeholder={t('(Không có dữ liệu)')}
                    controls={false}
                    formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/,/g, '')}
                    step={0.01}
                />
            </Form.Item>
        </Col>
    );

    const handleChangeType = (setter) => (value) => {
        setter(value);
    };

    const renderFieldSelect = (name, label, helpData, handleChangeType) => (
        <Col span={8} key={name}>
            <Form.Item
                name={name}
                label={
                    <span className="uppercase text-[11px] flex items-center gap-1">
                        {t(label)}
                    </span>
                }
                style={{ marginBottom: 8 }}
            >
                <Select
                    showSearch
                    defaultValue=""
                    size="middle"
                    style={{
                        width: 250,
                    }}
                    variant="underlined"
                    onChange={handleChangeType}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        { label: '', value: '' },
                        ...(helpData?.map((item) => ({
                            label: item?.MinorName,
                            value: item?.Value,
                        })) || []),
                    ]}
                />
            </Form.Item>
        </Col>
    );
    const handleImageChange = (file) => {
        setFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(file);

        return false;
    };


    return (
        <div className="p-2  mb-36 ">
            <h2 className="text-[14px] font-medium uppercase my-2">{t('Thông tin cơ bản')}</h2>
            <Row gutter={[16, 8]}>
                <Col span={6}>
                    <Form.Item label={<span className="uppercase text-[9px]">{t('Ảnh đại diện')}</span>}>
                        <div
                            style={{
                                width: 200,
                                height: 170,
                                border: '1px solid #d9d9d9',
                                borderRadius: 8,
                                overflow: 'hidden',
                                backgroundColor: '#fafafa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt="Avatar"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    preview={true}
                                />
                            ) : (
                                <Upload accept="image/*" showUploadList={false} beforeUpload={handleImageChange}>
                                    <Button disabled={dataSheetSearch.length === 0} type="text" block icon={<PlusOutlined />}>{t('Chọn ảnh')}</Button>
                                </Upload>
                            )}
                        </div>
                        <div className='mt-3 gap-2 flex items-center'>
                            <Tooltip title="Cập nhật">
                                <Button shape="circle" loading={loading} onClick={handleUpload}
                                    disabled={!file} icon={<UploadOutlined />} />
                            </Tooltip>
                            <Upload accept="image/*" showUploadList={false} beforeUpload={handleImageChange}>
                                <Tooltip title="Thêm ảnh">
                                    <Button disabled={dataSheetSearch.length === 0}
                                        shape="circle" icon={<PlusOutlined />} />
                                </Tooltip>
                            </Upload>
                            <Tooltip title="Xóa ảnh">
                                <Button shape="circle" loading={loading2} onClick={handleDeleteImage}
                                    icon={<DeleteOutlined />} />
                            </Tooltip>
                        </div>
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <Row gutter={[16, 8]}>
                        {renderFieldReadOnly('EmpEngName', 'Tên tiếng Anh', dataRootInfo?.EmpEngName || '')}
                        {renderFieldReadOnly('EmpChnName', 'Ngày sinh', dataRootInfo?.EmpChnName || '')}
                        {renderFieldReadOnly('ResidID', 'CCCD/CMT', dataRootInfo?.ResidID || '')}
                        {renderFieldReadOnly('DeptName', 'Bộ phận', dataRootInfo?.DeptName || '')}
                        {renderFieldReadOnly('WKDeptName', 'Bộ phận làm việc', dataRootInfo?.WKDeptName || '')}
                        {renderFieldReadOnly('PosName', 'Vị trí', dataRootInfo?.PosName || '')}
                        {renderFieldReadOnly('UMJpName', 'Chức vị', dataRootInfo?.UMJpName || '')}
                        {renderFieldReadOnly('UMJdName', 'Team', dataRootInfo?.UMJdName || '')}
                    </Row>

                </Col>
            </Row>

            <Row gutter={[16, 8]}>
                {renderFieldReadOnly('UMPgName', 'Cấp bậc', dataRootInfo?.UMPgName || '')}
                {renderFieldReadOnly('Ps', 'Tiền lương', dataRootInfo?.Ps || '')}
                {renderFieldReadOnly('UMJoName', 'Part', dataRootInfo?.UMJoName || '')}
                {renderFieldReadOnly('PosName', 'Section', dataRootInfo?.PosName || '')}
                {renderFieldReadOnly('PtName', 'Hình thái lương', dataRootInfo?.PtName || '')}
                {renderFieldReadOnly('UMWsName', 'Trạng thái làm việc', dataRootInfo?.UMWsName || '')}
                {renderFieldReadOnly('PuName', 'Nhóm lương', dataRootInfo?.PuName || '')}
            </Row>


            <h2 className="text-[14px] font-medium uppercase my-2">{t('Thông tin cá nhân')}</h2>

            <Form form={form} onFinish={onFinish} >
                {/* Nhóm 1: Thông tin cơ bản */}
                <h3 className="text-sm  mb-2 italic opacity-80">1.{t('Thông tin cơ bản')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderFieldNumber('Height', 'Chiều cao')}
                    {renderFieldNumber('Weight', 'Cân nặng')}
                    {renderFieldNumber('EyeLt', 'Thị lực (trái)')}
                    {renderFieldNumber('EyeRt', 'Thị lực (phải)')}
                    {renderFieldSelect('SMBloodTypeName', 'Nhóm máu', helpData27, handleChangeType(setType27))}
                </Row>

                {/* Nhóm 2: Thông tin cá nhân đặc điểm */}
                <h3 className="text-sm  mb-2 italic opacity-80">2.{t('Đặc điểm cá nhân')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderFieldCheckbox('IsDisabled', 'Người khuyết tật')}
                    {renderFieldCheckbox('IsForeigner', 'Người nước ngoài')}
                    {renderFieldSelect('SMBirthTypeName', 'Dương/Âm', helpData28, handleChangeType(setType28))}
                </Row>

                {/* Nhóm 3: Thông tin ngày tháng */}
                <h3 className="text-sm  mb-2 italic opacity-80">3.{t('Ngày tháng')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderFieldDateTime('BirthDate', 'Ngày sinh')}
                    {renderFieldDateTime('MarriageDate', 'Ngày cưới')}
                    {renderFieldDateTime('HandiAppdate', 'Ngày đăng ký khuyết tật')}
                </Row>

                {/* Nhóm 4: Thông tin quốc tịch, giới tính, tôn giáo */}
                <h3 className="text-sm  mb-2 italic opacity-80">4.{t('Quốc tịch & Giới tính')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderFieldSelect('UMNationName', 'Quốc tịch', helpData29, handleChangeType(setType29))}
                    {renderFieldSelect('SMSexSeqName', 'Giới tính', helpData30, handleChangeType(setType30))}
                    {renderFieldSelect('UMReligionName', 'Tôn giáo', helpData31, handleChangeType(setType31))}
                </Row>

                {/* Nhóm 5: Thông tin liên hệ */}
                <h3 className="text-sm  mb-2 italic opacity-80">5.{t('Thông tin liên hệ')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderField('Phone', 'Số điện thoại')}
                    {renderField('Cellphone', 'Điện thoại di động')}
                    {renderField('Extension', 'Mã nội bộ')}
                    {renderField('Email', 'Thư điện tử')}
                </Row>

                {/* Nhóm 6: Công việc & mong muốn */}
                <h3 className="text-sm  mb-2 italic opacity-80">6.{t('Công việc & Mong muốn')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderFieldSelect('UMEmployTypeName', 'Hình thái tuyển dụng', helpData32, handleChangeType(setType32))}
                    {renderField('WishTask1', 'Công việc mong muốn 1')}
                    {renderField('WishTask2', 'Công việc mong muốn 2')}
                </Row>

                {/* Nhóm 7: Người tiến cử & ghi chú */}
                <h3 className="text-sm  mb-2 italic opacity-80">7.{t('Người tiến cử & Ghi chú')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderField('Recommender', 'Người tiến cử')}
                    {renderField('RcmmndrCom', 'Công ty người tiến cử')}
                    {renderField('RcmmndrRank', 'Chức vụ người tiến cử')}
                    {renderField('Remark', 'Ghi chú')}
                </Row>

                {/* Nhóm 8: Thông tin khuyết tật */}
                <h3 className="text-sm  mb-2 italic opacity-80">8.{t('Khuyết tật')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderFieldSelect('UMHandiTypeName', 'Loại hình khuyết tật', helpData33, handleChangeType(setType33))}
                    {renderFieldSelect('UMHandiGrdName', 'Cấp độ khuyết tật', helpData34, handleChangeType(setType34))}
                </Row>

                {/* Nhóm 9: Các đối tượng đặc biệt */}
                <h3 className="text-sm  mb-2 italic opacity-80">9.{t('Đối tượng đặc biệt')}</h3>
                <Row gutter={[16, 8]} className="mb-4">
                    {renderFieldCheckbox('IsMarriage', 'Kết hôn')}
                    {renderFieldCheckbox('IsVeteranEmp', 'Cựu chiến binh')}
                    {renderField('VeteranNo', 'Mã CCB')}
                    {renderFieldSelect('UMRelName', 'Quan hệ với người có công', helpData35, handleChangeType(setType35))}
                    {renderFieldCheckbox('IsJobEmp', 'Đối tượng hỗ trợ tìm việc')}
                </Row>


            </Form>

        </div>
    );
}

export default Emp0Table;
