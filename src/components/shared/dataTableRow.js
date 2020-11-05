import React from 'react';
import { Row, Col } from 'reactstrap';

const DataTableRow = ({ prepareRow, row, onRowClick = false }) => {
  prepareRow(row);

  return (
    <Row onClick={() => onRowClick && onRowClick(row.original)} noGutters>
      {row.cells.map((cell) => (
        <Col key={`${cell.row.id}-${cell.column.id}`} className={['publish', 'subscribe'].includes(cell.column.id) ? 'action' : ''}>
          {cell.render('Cell')}
        </Col>
      ))}
    </Row>
  );
};

export default DataTableRow;
