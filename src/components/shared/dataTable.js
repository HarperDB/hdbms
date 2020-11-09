import React, { useEffect, useState } from 'react';
import { useFilters, useTable, usePagination } from 'react-table';
import { Input } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import DataTableHeader from './dataTableHeader';
import DataTablePaginationManual from './dataTablePaginationManual';
import DataTablePaginationAuto from './dataTablePaginationAuto';
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
  currentPage,
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
  const { headerGroups, page, rows, prepareRow, state, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize } = useTable(
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
      initialState: { pageIndex: currentPage, pageSize },
    },
    useFilters,
    usePagination
  );
  const [isLoading, setIsLoading] = useState(true);

  const iterable = manual ? rows : page;

  useEffect(() => {
    if (state.filters) {
      onFilteredChange(state.filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  useEffect(() => {
    setIsLoading(!data.length);
    setTimeout(() => setIsLoading(loading), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data]);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <div className="react-table-scroller">
        <DataTableHeader headerGroups={headerGroups} onSortedChange={onSortedChange} sorted={sorted} showFilter={showFilter} />
        {iterable?.length ? (
          iterable.map((row) => <DataTableRow key={row.id} row={row} prepareRow={prepareRow} onRowClick={onRowClick} />)
        ) : isLoading ? (
          <div className="centered text-center">
            <i className="fa fa-spinner fa-spin" />
          </div>
        ) : (
          <div className="centered text-center">
            <i className="fa fa-exclamation-triangle text-danger" />
            <div className="mt-2 text-darkgrey">no records</div>
          </div>
        )}
      </div>
      {manual ? (
        <DataTablePaginationManual page={currentPage} pageSize={pageSize} totalPages={totalPages} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
      ) : (
        <DataTablePaginationAuto
          previousPage={previousPage}
          pageSize={pageSize}
          canPreviousPage={canPreviousPage}
          pageIndex={state.pageIndex}
          pageOptions={pageOptions}
          gotoPage={gotoPage}
          setPageSize={setPageSize}
          pageCount={pageCount}
          nextPage={nextPage}
          canNextPage={canNextPage}
        />
      )}
    </ErrorBoundary>
  );
};

export default DataTable;
