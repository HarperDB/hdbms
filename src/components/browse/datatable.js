import React, { useState, useEffect, useContext } from 'react';
import { Loader } from '@nio/ui-kit';
import ReactTable from 'react-table';
import { withRouter } from 'react-router-dom';

import { HarperDBContext } from '../../providers/harperdb';
import queryTableData from '../../util/queryTableData';

export default withRouter(({ history, activeSchema, activeTable, showFiltering, onFilteredChange, filtered, pageSize, onPageSizeChange, page, onPageChange }) => {
  const { db, connection } = useContext(HarperDBContext);

  const [tableData, setTableData] = useState(false);
  const [pages, setTotalPages] = useState(-1);
  const [sorted, onSortedChange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = () => queryTableData(db, connection, activeSchema, activeTable, setLoading, setTotalPages, pageSize, page, setTableData, onSortedChange, setColumns, filtered, sorted);

    if (activeSchema && activeTable) {
      fetchData();
    } else {
      setTableData(false);
    }
  }, [activeTable, pageSize, page, sorted, filtered, db]);

  return db && tableData ? (
    <ReactTable
      manual
      loading={loading}
      data={tableData}
      columns={columns}
      filterable={showFiltering}
      filtered={filtered}
      pages={pages}
      page={page}
      sorted={sorted}
      defaultPageSize={pageSize}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      onPageChange={onPageChange}
      onSortedChange={onSortedChange}
      onFilteredChange={onFilteredChange}
      getTdProps={(state, rowInfo) => ({ onClick: () => history.push(`/browse/${activeSchema}/${activeTable}/edit/${rowInfo.original[db[activeSchema][activeTable].hash_attribute]}`) })}
    />
  ) : (
    <Loader />
  );
});
