export const filterAndSelectColumns = (
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


export const filterAndSelectColumnsRow = (
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
          if (col !== 'IdRow' && col !== 'Status' && col !== 'IdxNo') {
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


export const filterAndSelectColumnsNoStatus = (
  editedRows,
  columnsToSelect,
) => {
  const filteredRows = editedRows
    .map((row) => {
      const selectedRow = {}
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


export const filterValidRows  = (editedRows, status) => {
  const filteredRows = editedRows
    .filter((row) => row.Status === status)
    .map((row) => {
      const selectedRow = {};
      let isValidRow = false;

      Object.keys(row).forEach((col) => {
        if (col !== 'Id' && col !== 'Status' && col !== 'IdxNo') {
          const value = row[col];

          if (value !== '' && value != null) {
            isValidRow = true;
          }
        }
        selectedRow[col] = row[col]; 
      });

      return isValidRow ? selectedRow : null;
    })
    .filter((row) => row !== null); 

  return filteredRows;
};