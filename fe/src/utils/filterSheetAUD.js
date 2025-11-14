export const filterAndSelectColumnsAUD = (
  gridData,
  columnsToSelect,
) => {
  const filteredRows = gridData
    .filter((row) => row.Status === 'A' || row.Status === 'U')
    .map((row) => {
      const selectedRow = {rowIndex: row.rowIndex}
      let isValidRow = false

      columnsToSelect.forEach((col) => {
        if (row.hasOwnProperty(col)) {
          const value = row[col]

          if (col !== 'Id' && col !== 'Status' && col !== 'IdxNo') {
            if (value !== '' && value != null) {
              isValidRow = true 
            }
          }

          selectedRow[col] = value
        }
      })

      return isValidRow ? selectedRow : null
    })
    .filter((row) => row !== null)

  return filteredRows
}