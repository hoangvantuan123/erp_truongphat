import { v4 as uuidv4 } from 'uuid'

export const generateRoleData = (rowCount, defaultCols) => {
  return Array.from(
    {
      length: rowCount
    },
    () =>
      defaultCols.reduce(
        (row, col) => ({
          ...row,
          [col.id]: col.id === 'Status' ? 'A' : ''
        }),
        {
          IdRow: uuidv4()
        }
      )
  )
}
