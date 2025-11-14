import { Input, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

export default function TabRoleUserGroup({ userInfo, setUserInfo }) {
  const { t } = useTranslation()

  return (
    <>
      <div className="font-medium text-xs mb-2 uppercase">NHÓM NGƯỜI DÙNG</div>
      <div className="mb-2">
        <label>{t('Tên nhóm')}</label>
        <Input
          value={userInfo?.groupName}
          onChange={(e) =>
            setUserInfo({ ...userInfo, groupName: e.target.value })
          }
          placeholder={t('Nhập tên nhóm')}
          className="w-full"
        />
      </div>
      <div>
        <label>{t('Ghi chú')}</label>
        <Input.TextArea
          value={userInfo?.note}
          onChange={(e) => setUserInfo({ ...userInfo, note: e.target.value })}
          placeholder={t('Ghi chú')}
          rows={4}
        />
      </div>
    </>
  )
}
