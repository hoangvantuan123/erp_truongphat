
  export const trackDBInitialization = () => {
    const request = indexedDB.open('languageDatabase');
    
    request.onsuccess = (event) => {
      console.group('Language Database Initialization');
      console.log('Thời điểm tạo:', new Date().toISOString());
      console.log('Version:', event.target.result.version);
      console.trace('Stack trace khởi tạo:');
      console.groupEnd();
    };
  
    request.onerror = (event) => {
      console.error('Lỗi khi mở DB:', event.target.error);
    };
  };