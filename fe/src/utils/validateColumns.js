export const validateCheckColumns = (rows, columns, requiredColumns) => {
  if (!Array.isArray(rows) || !Array.isArray(columns) || !Array.isArray(requiredColumns)) {
    console.error("🚨 Lỗi: Một trong các tham số không phải mảng!", {
      rows,
      columns,
      requiredColumns
    });
    return "Lỗi dữ liệu đầu vào không hợp lệ!";
  }

  const missingColumns = [];

  // Duyệt qua tất cả các hàng và kiểm tra từng cột
  for (let row of rows) {
    for (let column of columns) {
      if (requiredColumns.includes(column)) {
        // Kiểm tra nếu row[column] không tồn tại hoặc là chuỗi rỗng
        if (row[column] === undefined || row[column] === null || (typeof row[column] === 'string' && row[column].trim() === '')) {
          missingColumns.push(column);
        }
      }
    }
  }

  // Nếu có cột thiếu, trả về danh sách cột thiếu
  if (missingColumns.length > 0) {
    return `Cột ${[...new Set(missingColumns)].join(', ')} không được để trống hoặc null!`;
  }

  return true; // Nếu không có cột thiếu
};


export const validateColumns = (rows, columns) => {
  for (let row of rows) {
    for (let column of columns) {
      if (!row[column]) {
        return false;
      }
    }
  }
  return true;
}




export const validateColumnsTrans = (rows, columns, requiredColumns) => {
  const missingColumns = [];

  const requiredColumnKeys = Object.values(requiredColumns);

  for (let row of rows) {
    for (let column of columns) {
      if (requiredColumnKeys.includes(column)) {
        const value = row[column];
        if (
          (typeof value === "string" && value.trim() === "") ||
          (typeof value === "number" && isNaN(value)) ||
          value == null
        ) {
          missingColumns.push(column);
        }
      }
    }
  }

  if (missingColumns.length > 0) {
    // Chuyển từ tên cột database về tiếng Việt để hiển thị lỗi
    const translatedColumns = [...new Set(missingColumns)].map(
      (col) => Object.keys(requiredColumns).find((key) => requiredColumns[key] === col) || col
    );
    return `Cột ${translatedColumns.join(", ")} không được để trống!`;
  }

  return true;
};