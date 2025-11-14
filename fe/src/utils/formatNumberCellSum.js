export const formatNumberCellSum = (value) => {
    if (value === null || value === undefined) {
      return '' // Xử lý giá trị null hoặc undefined
    }
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 5, // Số chữ số thập phân tối thiểu
        maximumFractionDigits: 5, // Số chữ số thập phân tối đa
      }).format(value)
    } catch (error) {
      console.error('Lỗi định dạng số:', error)
      return String(value) // Trả về giá trị gốc nếu có lỗi
    }
  }