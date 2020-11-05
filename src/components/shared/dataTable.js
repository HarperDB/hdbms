import React, { useEffect } from 'react';
import { useFilters, useTable, usePagination, useSortBy } from 'react-table';
import { Row, Col, Input, Button } from 'reactstrap';

function DefaultColumnFilter({ column }) {
  return (
    <Input
      type="text"
      value={column.filterValue || ''}
      onChange={(e) => {
        column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    />
  );
}

const defaultColumn = {
  Filter: DefaultColumnFilter,
};

// Our table component
export default ({
  dataTableColumns,
  tableData,
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
  autoRefresh,
}) => {
  const { headerGroups, rows, prepareRow, state } = useTable(
    {
      columns: dataTableColumns,
      data: tableData,
      defaultColumn,
      manualPagination: true,
      manualFilters: true,
      manualSortBy: true,
      onFilteredChange,
      onSortedChange,
      onPageChange,
      onPageSizeChange,
      onRowClick,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (state.filters) {
      onFilteredChange(state.filters);
    }
  }, [state.filters]);

  return (
    <>
      <div className="react-table-scroller">
        <div className="react-table">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()}>
              <Row className="header" noGutters>
                {headerGroup.headers.map((column) => {
                  // console.log(column, column.getHeaderProps(column.getSortByToggleProps()));
                  return (
                    <Col
                      key={column.id}
                      onClick={() => onSortedChange([{ id: column.id, desc: sorted[0]?.id === column.id ? !sorted[0]?.desc : false }])}
                      className={`${sorted[0]?.id === column.id ? 'sorted' : ''} ${sorted[0]?.desc ? 'desc' : 'asc'} px-1`}
                    >
                      {column.render('Header')}
                    </Col>
                  );
                })}
              </Row>
              {showFilter && (
                <Row noGutters className="filter">
                  {headerGroup.headers.map((column) => (
                    <Col {...column.getHeaderProps()}>{column.render('Filter')}</Col>
                  ))}
                </Row>
              )}
            </div>
          ))}
          <div className="rows">
            {loading && !autoRefresh && !state.filters?.length ? (
              <div className="text-center py-5">
                <i className="fa fa-spinner fa-spin" />
              </div>
            ) : rows?.length ? (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <Row onClick={() => onRowClick(row.original)} noGutters {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Col className="px-1" {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </Col>
                    ))}
                  </Row>
                );
              })
            ) : (
              <div className="text-center py-5">no results!</div>
            )}
          </div>
        </div>
      </div>
      <Row className="mt-4">
        <Col xs="12" md="3">
          <Button color="purple" block onClick={() => onPageChange(page - 1)} disabled={page === 0}>
            <i className="fa fa-chevron-left" />
          </Button>
        </Col>
        <Col xs="12" md="3" className="paginator">
          <i className="fa fa-book mr-2" />
          <Input type="number" value={page + 1} min={1} max={totalPages} onChange={(e) => onPageChange(e.target.value - 1)} /> of {totalPages}
        </Col>
        <Col xs="12" md="3" className="page-size">
          <Input type="select" value={pageSize} onChange={(e) => onPageSizeChange(e.target.value)}>
            {[20, 50, 100, 250].map((pageSizeValue) => (
              <option key={pageSizeValue} value={pageSizeValue}>
                {pageSizeValue} rows
              </option>
            ))}
          </Input>
        </Col>
        <Col xs="12" md="3">
          <Button block color="purple" onClick={() => onPageChange(page + 1)} disabled={page + 1 === totalPages}>
            <i className="fa fa-chevron-right" />
          </Button>
        </Col>
      </Row>
    </>
  );
};
