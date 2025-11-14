export const togglePageInteraction = (isLoading) => {
    document.body.classList.toggle("page-loading", isLoading);
};





export const isPageLoading = (isLoading) => {
     document.body.classList.toggle("page-loading-false", isLoading);
};