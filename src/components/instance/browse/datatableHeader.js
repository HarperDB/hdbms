import React from 'react';
import { Col, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';

import commaNumbers from '../../../methods/util/commaNumbers';
import instanceState from '../../../state/instanceState';

export default ({ totalRecords, loading, autoRefresh, toggleAutoRefresh, toggleFilter }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table } = useParams();

  return (
    <Row className="floating-card-header">
      <Col>
        {schema}
        &nbsp;
        {table && `> ${table} > `}
        {commaNumbers(totalRecords)} record
        {totalRecords !== 1 ? 's' : ''}
      </Col>
      <Col xs="12" className="d-inline-flex d-md-none mb-2" />
      <Col className="text-md-right">
        <i
          title={`Refresh table ${table}`}
          className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`}
          onClick={() =>
            instanceState.update((s) => {
              s.lastUpdate = Date.now();
            })
          }
        />
        <span className="mr-2">auto</span>
        <i title="Turn on Auto-Refresh" className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} onClick={toggleAutoRefresh} />
        <span className="mx-3 text">|</span>
        <i title={`Filter table ${table}`} className="fa fa-search mr-3" onClick={toggleFilter} />
        <i title={`Add new record to table ${table}`} className="fa fa-plus mr-3" onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/add`)} />
        <i title={`Bulk Upload CSV to ${table}`} className="fa fa-file-text-o" onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/csv`)} />
      </Col>
    </Row>
  );
};
