export const validateRequiredFields = (data, requiredFields) => {
    const errors = [];

    data.forEach((row, index) => {
        requiredFields.forEach(({
            key,
            label
        }) => {
            if (!row[key] || row[key].toString().trim() === '') {
                errors.push({
                    row: index + 1,
                    field: key,
                    message: `${label} không được để trống (dòng ${index + 1})`,
                });
            }
        });
    });

    return errors;
};