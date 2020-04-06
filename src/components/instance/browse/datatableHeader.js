import React from 'react';
import { Col, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';

import commaNumbers from '../../../util/commaNumbers';
import instanceState from '../../../state/stores/instanceState';
import tableState from '../../../state/stores/tableState';

export default ({ totalRecords, loading, autoRefresh, showFilter, filtered }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table } = useParams();

  return (
    <Row>
      <Col className="text-nowrap text-left">
        <span className="text-white floating-card-header">
          <span>
            {schema}
            &nbsp;
          </span>
          <span>{table && `> ${table} > `} </span>
          <span>
            {commaNumbers(totalRecords)} record
            {totalRecords !== 1 ? 's' : ''}
          </span>
        </span>
      </Col>
      <Col xs="12" className="d-inline-flex d-md-none mb-2" />
      <Col className="text-md-right text-white text-nowrap">
        <i
          title={`Refresh table ${table}`}
          className={`fa floating-card-header mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`}
          onClick={() =>
            instanceState.update((s) => {
              s.lastUpdate = Date.now();
            })
          }
        />
        <span className="mr-2">auto</span>
        <i
          title="Turn on autofresh"
          className={`floating-card-header fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`}
          onClick={() =>
            tableState.update((s) => {
              s.autoRefresh = !autoRefresh;
            })
          }
        />
        <span className="mx-3 text">|</span>
        <i
          title={`Filter table ${table}`}
          className="floating-card-header fa fa-search mr-3"
          onClick={() =>
            tableState.update((s) => {
              s.filtered = showFilter ? [] : filtered;
              s.page = 0;
              s.showFilter = !showFilter;
            })
          }
        />
        <i
          title={`Add new record to table ${table}`}
          className="floating-card-header fa fa-plus mr-3"
          onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/add`)}
        />
        <i
          title={`Bulk Upload CSV to ${table}`}
          className="floating-card-header fa fa-file-text-o"
          onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/csv`)}
        />
      </Col>
    </Row>
  );
};
