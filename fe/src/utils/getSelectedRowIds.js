const getSelectedRowIds = () => {
  const selectedRows = selection.rows.items
  let ids = []

  selectedRows.forEach((range) => {
    const start = range[0]
    const end = range[1] - 1

    for (let i = start; i <= end; i++) {
      ids.push(menus[i]?.Id)
    }
  })

  return ids.filter((id) => id !== undefined)
}
