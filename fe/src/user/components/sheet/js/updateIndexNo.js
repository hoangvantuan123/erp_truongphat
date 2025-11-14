export const updateIndexNo = (data) => {
    return data.map((row, index) => {
        return {
            ...row,
            IdxNo: index + 1
        };
    });
};