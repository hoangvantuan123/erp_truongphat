import {
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const LayoutMenuSheet = ({
  showMenu,
  handleSort,
  handleHideColumn,
  cols,
  setShowSearch,
  setShowMenu,
}) => {
  if (showMenu === null) return null
  const { t } = useTranslation()
  return (
    <ul className="space-y-1">
      {/* Tìm kiếm */}
      <li>
        <a
          onClick={() => {
            setShowSearch(true)
            setShowMenu(null)
          }}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <SearchOutlined />
          <span className="text-[13px] font-medium"> {t('850000134')} </span>
        </a>
      </li>

      {/* Sắp xếp tăng dần */}
      <li>
        <a
          onClick={() => handleSort(cols[showMenu.col]?.id, 'asc')}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <SortAscendingOutlined />
          <span className="text-[13px] font-medium"> {t('850000135')} </span>
        </a>
      </li>

      {/* Sắp xếp giảm dần */}
      <li>
        <a
          onClick={() => handleSort(cols[showMenu.col]?.id, 'desc')}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <SortDescendingOutlined />
          <span className="text-[13px] font-medium"> {t('850000136')} </span>
        </a>
      </li>

      {/* Ẩn cột */}
      <li>
        <a
          onClick={() => handleHideColumn(showMenu.col)}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <EyeInvisibleOutlined />
          <span className="text-[13px] font-medium">{t('850000137')} </span>
        </a>
      </li>
    </ul>
  )
}

export default LayoutMenuSheet
