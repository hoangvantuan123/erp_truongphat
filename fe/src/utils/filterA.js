export const filterAndSelectColumnsA = (
  editedRows,
  columnsToSelect,
  status,
) => {
  const filteredRows = editedRows
    .filter((row) => row.Status === status)
    .map((row) => {
      const selectedRow = {}
      let isValidRow = false

      columnsToSelect.forEach((col) => {
        if (row.hasOwnProperty(col)) {
          const value = row[col]

          if (value !== '' && value != null  && col !== 'Id' && col !== 'Status'  && col !== 'IdxNo') {
            isValidRow = true
          }

          if (isValidRow) {
            selectedRow[col] = value
          }
        }
      })

      return isValidRow ? selectedRow : null
    })
    .filter((row) => row !== null)

  return filteredRows
}