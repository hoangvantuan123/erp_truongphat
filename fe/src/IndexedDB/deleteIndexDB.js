import {
  openDB,
  deleteDB
} from 'idb'

export const deleteDatabase = async () => {
  try {
  } catch (error) {
    console.error('Lỗi khi xóa cơ sở dữ liệu:', error)
  }
}