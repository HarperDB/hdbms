import React from 'react';
import { Row, Col, Input, Button } from 'reactstrap';

// Our table component
const DataTablePagination = ({ previousPage, canPreviousPage, pageIndex, gotoPage, setPageSize, pageCount, nextPage, canNextPage }) => (
  <Row className="pagination">
    <Col xs="12" sm="2" className="previous">
      <Button className="mb-2" color="purple" block onClick={previousPage} disabled={!canPreviousPage}>
        <i className="fa fa-chevron-left" />
      </Button>
    </Col>
    <Col xs="12" sm="4" className="paginator">
      <i className="fa fa-book mr-2" />
      <Input className="mb-2" type="number" value={pageIndex + 1 || 1} min={1} max={pageCount} onChange={(e) => gotoPage(e.target.value ? Number(e.target.value) - 1 : 0)} />
      <div className="page-count">&nbsp;/&nbsp;{pageCount}</div>
    </Col>
    <Col xs="12" sm="4" className="page-size">
      <Input
        className="mb-2"
        type="select"
        onChange={(e) => {
          gotoPage(0);
          setTimeout(() => setPageSize(e.target.value), 1000);
        }}
      >
        {[20, 50, 100, 250].map((pageSizeValue) => (
          <option key={pageSizeValue} value={pageSizeValue}>
            {pageSizeValue} rows
          </option>
        ))}
      </Input>
    </Col>
    <Col xs="12" sm="2" className="next">
      <Button className="mb-2 pull-right" block color="purple" onClick={nextPage} disabled={!canNextPage}>
        <i className="fa fa-chevron-right" />
      </Button>
    </Col>
  </Row>
);

export default DataTablePagination;