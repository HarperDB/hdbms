import React from 'react';
import { Col, Row } from 'reactstrap';
import { useHistory, useParams } from 'react-router';

import commaNumbers from '../../../methods/util/commaNumbers';

export default ({ totalRecords, loading, refresh, autoRefresh, toggleAutoRefresh, toggleFilter }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table, customer_id } = useParams();

  return (
    <Row className="floating-card-header">
      <Col>
        {schema}
        &nbsp;
        {table && `> ${table} > `}
        {!autoRefresh && loading ? (
          <i className="fa fa-spinner fa-spin" />
        ) : (
          <span>
            {commaNumbers(totalRecords)} record
            {totalRecords !== 1 ? 's' : ''}
          </span>
        )}
      </Col>
      <Col xs="12" className="d-inline-flex d-md-none mb-2" />
      <Col className="text-md-right">
        <a href="#" tabIndex="0" title={`Refresh table ${table}`} className="mr-2" onClick={refresh}>
          <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
        </a>
        <span className="mr-2">auto</span>
        <a href="#" tabIndex="0" title="Turn on Auto-Refresh" onClick={toggleAutoRefresh}>
          <i className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} />
        </a>
        <span className="mx-3 text">|</span>
        <a href="#" tabIndex="0" title={`Filter table ${table}`} className="mr-3" onClick={toggleFilter}>
          <i className="fa fa-search" />
        </a>
        <a
          href="#"
          tabIndex="0"
          title={`Add new record to table ${table}`}
          className="mr-3"
          onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}/add`)}
        >
          <i className="fa fa-plus" />
        </a>
        <a href="#" tabIndex="0" title={`Bulk Upload CSV to ${table}`} onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}/csv`)}>
          <i className="fa fa-file-text-o" />
        </a>
      </Col>
    </Row>
  );
};
