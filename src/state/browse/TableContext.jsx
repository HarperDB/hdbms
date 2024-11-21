import { createContext, useState } from "react";

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
  const [tableContextState, setTableContextState] = useState(defaultTableState);
  const value = [tableContextState, setTableContextState];
  return <TableStateContext.Provider value={value} {...props} />
}

export { TableStateProvider, TableStateContext };
