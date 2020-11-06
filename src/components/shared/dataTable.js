import React, { useEffect, useState } from 'react';
import { useFilters, useTable, usePagination } from 'react-table';
import { Input } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import DataTableHeader from './dataTableHeader';
import DataTablePagination from './dataTablePagination';
import DataTableRow from './dataTableRow';
import isImage from '../../functions/util/isImage';
import addError from '../../functions/api/lms/addError';
import ErrorFallback from './errorFallback';

const TextViewer = ({ value }) => <div className="text-renderer">{value}</div>;

const ImageViewer = ({ src }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  return (
    <div className="image-renderer" onMouseEnter={() => setPreviewOpen(true)} onMouseLeave={() => setPreviewOpen(false)}>
      <i className="fa fa-image" />
      {previewOpen && previewError ? (
        <div className="preview-image no-image">
          <i className="fa fa-ban text-danger" />
          <div className="mt-2">image failed to load</div>
        </div>
      ) : previewOpen ? (
        <img onError={setPreviewError} alt={src} src={src} className="preview-image" />
      ) : null}
    </div>
  );
};

const handlCellValues = (value) => {
  const dataType = Object.prototype.toString.call(value);

  switch (dataType) {
    case '[object Array]':
    case '[object Object]':
      return <TextViewer value={JSON.stringify(value)} />;
    case '[object Boolean]':
      return <TextViewer value={value ? 'true' : 'false'} />;
    case '[object String]':
      return isImage(value) ? <ImageViewer src={value} /> : <TextViewer value={value} />;
    default:
      return <TextViewer value={value} />;
  }
};

const defaultColumnFilter = ({ column }) => (
  <Input
    type="text"
    value={column.filterValue || ''}
    onChange={(e) => {
      column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
    }}
  />
);

const defaultColumn = {
  Filter: defaultColumnFilter,
  Cell: ({ value }) => handlCellValues(value),
};

// Our table component
const DataTable = ({
  columns,
  data,
  page,
  pageSize,
  totalPages,
  onFilteredChange,
  onSortedChange,
  onPageChange,
  onPageSizeChange,
  showFilter,
  onRowClick,
  sorted,
  loading,
  manual = false,
}) => {
  const { headerGroups, rows, prepareRow, state } = useTable(
    {
      columns,
      data,
      defaultColumn,
      onFilteredChange,
      onSortedChange,
      onPageChange,
      onPageSizeChange,
      onRowClick,
      manualPagination: manual,
      manualFilters: manual,
    },
    useFilters,
    usePagination
  );

  useEffect(() => {
    if (state.filters) {
      onFilteredChange(state.filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <div className="react-table-scroller">
        <div className="react-table">
          <DataTableHeader headerGroups={headerGroups} onSortedChange={onSortedChange} sorted={sorted} showFilter={showFilter} />
          <div className="rows">
            {rows?.length ? (
              rows.map((row) => <DataTableRow key={row.id} row={row} prepareRow={prepareRow} onRowClick={onRowClick} />)
            ) : loading ? (
              <div className="loader">
                <i className="fa fa-spinner fa-spin" />
              </div>
            ) : (
              <div className="no-results">
                <i className="fa fa-ban text-danger" />
                <div className="mt-2">no results</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <DataTablePagination page={page} pageSize={pageSize} totalPages={totalPages} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    </ErrorBoundary>
  );
};

export default DataTable;
