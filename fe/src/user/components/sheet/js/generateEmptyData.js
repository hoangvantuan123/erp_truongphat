import {
    v4 as uuidv4
} from 'uuid';

export const generateEmptyData = (rowCount, defaultCols) => {
    return Array.from({
            length: rowCount
        }, (_, index) =>
        defaultCols.reduce(
            (row, col) => ({
                ...row,
                [col.id]: col.id === 'Status' ? 'A' : ''
            }), {
                Id: uuidv4()
               
            }
        )
    );
};