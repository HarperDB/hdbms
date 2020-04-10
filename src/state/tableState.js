import { Store } from 'pullstate';

const tableState = new Store({
  filtered: [],
  sorted: [],
  page: 0,
  loading: true,
  tableData: [],
  totalPages: -1,
  totalRecords: 0,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  lastUpdate: false,
  currentTable: false,
  currentHash: false,
});

export default tableState;
