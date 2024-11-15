import React from 'react';
import { Row, Col } from 'reactstrap';

// // loop through each column and add ' disableSortBy: true' if column Header string matches string from dynamicAttributesFromDataTable
// columns.forEach((column) => {
//   dynamicAttributesFromDataTable.forEach((dynamicAttribute) => {
//     if (column.Header === dynamicAttribute) {
//       column.enableSorting = false
//     }
//   })
// })
const DataTableHeader = ({ headerGroups, onSortedChange, sorted, showFilter, dynamicAttributesFromDataTable }) =>
  headerGroups.map((headerGroup) => {
    const { key, ...rest } = headerGroup.getHeaderGroupProps();
    return (
      <div key={key} {...rest}>
        <Row className="header g-0">
          {headerGroup.headers.map((column) => (
            <Col
              key={column.id}
              onClick={() => {
                console.log('dynamicAttributesFromDataTable', dynamicAttributesFromDataTable);
                console.log('column.id', column.id)
                if (!dynamicAttributesFromDataTable.includes(column.id)) {
                  onSortedChange([{ id: column.id, desc: sorted[0]?.id === column.id ? !sorted[0]?.desc : false }])
                }
              }}
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
    );
  });
export default DataTableHeader;
