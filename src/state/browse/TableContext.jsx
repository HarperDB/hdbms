import { createContext, useState, useEffect } from "react";

const defaultTableState = {
    tableData: [],
    dataTableColumns: [],
    filtered: [],
    sorted: [],
    page: 0,
    pageSize: 20,
    autoRefresh: false,
    showFilter: false,
    newEntityAttributes: false,
    hashAttribute: false,
  };

const TableStateContext = createContext(defaultTableState);
// const useTableState = () => useContext(TableStateContext);

const TableStateProvider = (props) => {
  const [tableContextState, setTableContextState] = useState(() => {
    // Check if there is a saved state in session storage
    const savedState = sessionStorage.getItem('tableContextState');
    return savedState ? JSON.parse(savedState) : defaultTableState;
  });

  useEffect(() => {
    // Save the state to session storage whenever tableContextState gets updated in the app
    sessionStorage.setItem('tableContextState', JSON.stringify(tableContextState));
  }, [tableContextState]);

  const value = [tableContextState, setTableContextState];
  return <TableStateContext.Provider value={value} {...props} />
}

export { TableStateProvider, TableStateContext };
