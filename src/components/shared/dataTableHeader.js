import React from 'react';
import { Row, Col } from 'reactstrap';

const DataTableHeader = ({ headerGroups, onSortedChange, sorted, showFilter }) =>
  headerGroups.map((headerGroup) => (
    <div {...headerGroup.getHeaderGroupProps()}>
      <Row className="header" noGutters>
        {headerGroup.headers.map((column) => (
          <Col
            key={column.id}
            onClick={() => onSortedChange([{ id: column.id, desc: sorted[0]?.id === column.id ? !sorted[0]?.desc : false }])}
            className={`${sorted[0]?.id === column.id ? 'sorted' : ''} ${sorted[0]?.desc ? 'desc' : 'asc'} ${['publish', 'subscribe'].includes(column.id) ? 'action' : ''} px-1`}
          >
            {column.render('Header')}
          </Col>
        ))}
      </Row>
      {showFilter && (
        <Row noGutters className="filter">
          {headerGroup.headers.map((column) => (
            <Col key={column.id} className={['publish', 'subscribe'].includes(column.id) ? 'action' : ''}>
              {column.render('Filter')}
            </Col>
          ))}
        </Row>
      )}
    </div>
  ));

export default DataTableHeader;
