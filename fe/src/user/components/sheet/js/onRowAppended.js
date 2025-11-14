import { v4 as uuidv4 } from 'uuid';

export const onRowAppended = (
  cols,
  setGridData,
  setNumRows,
  setAddedRows,
  numRowsToAdd,
) => {
  if (numRowsToAdd <= 0) return;

  setGridData((prevData) => {
    const currentRowCount = prevData.length; // Đếm số dòng hiện tại

    const newRows = Array(numRowsToAdd).fill(null).map((_, index) => {
      const newRow = cols.reduce((acc, col) => ({
        ...acc,
        [col.id]: col.id === 'Status' ? 'A' : '',
      }), {});

      newRow.Id = uuidv4();
      newRow.IdxNo = currentRowCount + index + 1; // Gán số thứ tự

      return newRow;
    });

    setNumRows(currentRowCount + numRowsToAdd);
    setAddedRows(prevAddedRows => [...prevAddedRows, ...newRows]);

    return [...prevData, ...newRows]; // Trả về array mới để đảm bảo React cập nhật
  });
};




export const onRowAppendedRow = (cols, setGridData, setNumRows, setAddedRows, numRowsToAdd) => {
  if (numRowsToAdd <= 0) return

  const newRows = Array(numRowsToAdd)
    .fill(null)
    .map(() => {
      const newRow = cols.reduce(
        (acc, col) => ({
          ...acc,
          [col.id]: col.id === 'Status' ? 'A' : ''
        }),
        {}
      )

      newRow.IdRow = uuidv4()
      return newRow
    })

  setGridData((prevData) => [...prevData, ...newRows])
  setNumRows((prev) => prev + numRowsToAdd)
  setAddedRows((prevAddedRows) => [...prevAddedRows, ...newRows])
}
