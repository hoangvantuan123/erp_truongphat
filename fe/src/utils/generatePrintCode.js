export const generatePrintCode = () => {
    const now = new Date();
    return `INV-${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now
            .getHours()
            .toString()
            .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
                .getSeconds()
                .toString()
                .padStart(2, "0")}${now.getMilliseconds().toString().padStart(3, "0")}`;
};