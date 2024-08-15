import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const SearchContext = createContext();
const SearchProvider = ({ children }) => {
  const [values, setValues] = useState({
    keyWord:"",
    results: []
  });

  return (
    <SearchContext.Provider value={[values, setValues]}>
      {children}
    </SearchContext.Provider>
  );
};

// custom hook
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };