export const handleSearch = async ({
    searchText,
    previousSearchText,
    setPreviousSearchText,
    setLoading1,
    setError1,
    searchResultsRef,
    SearchFunction,
    searchFields
  }) => {
    setPreviousSearchText(searchText);
  
    if (searchText !== previousSearchText) {
      setLoading1(true);
      try {
        const response = await SearchFunction(searchText, searchFields);
        if (response.success) {
          searchResultsRef.current = response.data.data;
        }
      } catch (error) {
        setError1(error.message || 'Đã xảy ra lỗi');
        searchResultsRef.current = [];
      } finally {
        setLoading1(false);
      }
    }
  };
  