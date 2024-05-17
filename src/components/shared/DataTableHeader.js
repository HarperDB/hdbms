import React from 'react';
import { Row, Col } from 'reactstrap';

const DataTableHeader = ({ headerGroups, onSortedChange, sorted, showFilter }) =>
  headerGroups.map((headerGroup) => (
    <div {...headerGroup.getHeaderGroupProps()}>
      <Row className="header g-0">
        {headerGroup.headers.map((column) => (
          <Col
            key={column.id}
            onClick={() => onSortedChange([{ id: column.id, desc: sorted[0]?.id === column.id ? !sorted[0]?.desc : false }])}
            className={`${sorted[0]?.id === column.id ? 'sorted' : ''} ${sorted[0]?.desc ? 'desc' : 'asc'} ${column.id.indexOf('hdb-narrow') !== -1 ? 'action' : ''} px-1`}
          >
            <div className="text-renderer">{column.render('Header')}</div>
          </Col>
        ))}
      </Row>
      {showFilter && (
        <Row className="filter g-0">
          {headerGroup.headers.map((column) => (
            <Col key={column.id} className={column.id.indexOf('hdb-narrow') !== -1 ? 'action' : ''}>
              {column.render('Filter')}
            </Col>
          ))}
        </Row>
      )}
    </div>
  ));

export default DataTableHeader;
