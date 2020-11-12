import React, { useEffect } from 'react';

import DataTable from '../../../shared/dataTable';

const ManageDatatable = ({
  columns,
  data,
  page,
  pageSize,
  totalPages,
  showFilter,
  sorted,
  loading,
  onFilteredChange,
  onSortedChange,
  onPageChange,
  onPageSizeChange,
  refreshNetwork,
}) => {
  // useEffect(() => refreshNetwork('datatable'), [refreshNetwork]);

  return (
    <DataTable
      columns={columns}
      data={data}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
      showFilter={showFilter}
      sorted={sorted}
      loading={loading}
      onFilteredChange={onFilteredChange}
      onSortedChange={onSortedChange}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
};

export default ManageDatatable;
