import { openDB } from 'idb'
export const getLanguageData = async (typeLanguage) => {
    try {
      const db = await openDB('languageDatabase', 1);
      const data = await db.get('languages', typeLanguage);
  
      // Trả về giá trị mặc định thay vì null nếu không có dữ liệu
      return data ? data.languageData : [];  // Trả về mảng rỗng nếu không có dữ liệu
    } catch (error) {
      console.error('Error loading language data:', error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  };
  