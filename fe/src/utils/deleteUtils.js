export const deleteDataSheet = async (
  getSelectedRowsFn,
  deleteItemsFn,
  data,
  setData,
  setNumRows,
  resetTable,
  editedRows,
  setEditedRows,
  idKey = 'Id'
) => {
  const selectedRows = getSelectedRowsFn();

  const idsWithStatusD = selectedRows
    .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D')
    .map((row) => {
      row.Status = 'D';
      return row[idKey];
    });

  const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');
  let deleteResult = { success: true, message: '' };

  if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
    return { success: false, message: 'Không có dữ liệu nào được chọn!' };
  }

  try {
    const deletePromises = [];

    if (idsWithStatusD.length > 0) {
      deletePromises.push(deleteItemsFn(idsWithStatusD));
    }

    if (rowsWithStatusA.length > 0) {
      deletePromises.push(Promise.resolve({ data: { success: true } })); // Giả lập thành công
    }

    const results = await Promise.all(deletePromises);

    // Kiểm tra kết quả từng thao tác
    const deleteUDSuccess = results[0]?.data?.success ?? true ;
    const deleteASuccess = results[1]?.data?.success ?? true;
    if (!deleteUDSuccess) {
      deleteResult = { success: false, message: results[0]?.data?.message || 'Xóa thất bại!' };
    }

    if (!deleteASuccess) {
      deleteResult = { success: false, message: results[1]?.data?.message || 'Xóa dữ liệu cục bộ thất bại!' };
    }

    if (deleteUDSuccess) {
      const idsWithStatusA = rowsWithStatusA.map((row) => row.Id);
      const remainingRows = data.filter(
        (row) => !idsWithStatusD.includes(row[idKey]) && !idsWithStatusA.includes(row.Id)
      );

      const remainingEditedRows = editedRows.filter(
        (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow.Id)
      );

      setEditedRows(remainingEditedRows);
      setData(remainingRows);
      setNumRows(remainingRows.length);
      resetTable();
    }

  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    deleteResult = { success: false, message: 'Có lỗi xảy ra khi xóa!' };
  }

  return deleteResult;
};

export const removeSelectedRows = async (
  getSelectedRowsFn,
  deleteItemsFn,
  data,
  setData,
  setNumRows,
  resetTable,
  idKey = 'Id'
) => {
  const selectedRows = getSelectedRowsFn();

  const idsWithStatusD = selectedRows
    .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'E')
    .map((row) => {
      row.Status = 'E';
      return row[idKey];
    });

  const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');
  let deleteResult = { success: true, message: '' };

  if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
    return { success: false, message: 'Không có dữ liệu nào được chọn!' };
  }

  try {
    const deletePromises = [];


    if (idsWithStatusD.length > 0) {
      deletePromises.push(deleteItemsFn(idsWithStatusD));
    }

    if (rowsWithStatusA.length > 0) {
      deletePromises.push(Promise.resolve({ data: { success: true } }));
    }

    const results = await Promise.all(deletePromises);
    const deleteUDSuccess = results[0]?.data?.success ?? true;
    const deleteASuccess = results[1]?.data?.success ?? true;
    if (!deleteUDSuccess) {
      deleteResult = { success: false, message: results[0]?.data?.message || 'Xóa thất bại!' };
    }

    if (!deleteASuccess) {
      deleteResult = { success: false, message: results[1]?.data?.message || 'Xóa dữ liệu cục bộ thất bại!' };
    }

    if (deleteUDSuccess) {
      const idsToRemove = new Set([
        ...idsWithStatusD,
        ...rowsWithStatusA.map((row) => row["IdRow"]),
      ]);

      const remainingRows = data.filter(
        (row) => !idsToRemove.has(row[idKey]) && !idsToRemove.has(row["IdRow"])
      );

      setData(remainingRows);
      setNumRows(remainingRows.length);
      resetTable();
    }

  } catch (error) {
    deleteResult = { success: false, message: 'Có lỗi xảy ra khi xóa!' };
  }

  return deleteResult;
};


export const removeStatusA = async (
  getSelectedRowsFn,
  data,
  setData,
  setNumRows,
  resetTable
) => {
  const selectedRows = getSelectedRowsFn();

  const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');

  if (rowsWithStatusA.length === 0) {
    return null;
  }

  try {
    const idsToRemove = new Set(rowsWithStatusA.map((row) => row["IdRow"]));

    const remainingRows = data.filter((row) => !idsToRemove.has(row["IdRow"]));

    setData(remainingRows);
    setNumRows(remainingRows.length);
    resetTable();

    return { success: true, message: 'Xóa dữ liệu có Status = A thành công!' };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi xóa dữ liệu!' };
  }
};

