import React from 'react';
import { Col, Row } from '@nio/ui-kit';

import commaNumbers from '../../../methods/util/commaNumbers';
import tableState from '../../../state/tableState';

export default ({ totalRecords, loading, autoRefresh, showFilter, filtered, setLastUpdate }) => (
  <Row className="floating-card-header">
    <Col>
      {commaNumbers(totalRecords)} record
      {totalRecords !== 1 ? 's' : ''}
    </Col>
    <Col className="text-md-right">
      <i title="Refresh Results" className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} onClick={() => setLastUpdate(Date.now())} />
      <span className="mr-2">auto</span>
      <i
        title="Turn on Auto-Refresh"
        className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`}
        onClick={() =>
          tableState.update((s) => {
            s.autoRefresh = !autoRefresh;
          })
        }
      />
      <span className="mx-3 text">|</span>
      <i
        title="Filter Results"
        className="fa fa-search mr-3"
        onClick={() =>
          tableState.update((s) => {
            s.filtered = showFilter ? [] : filtered;
            s.page = 0;
            s.showFilter = !showFilter;
          })
        }
      />
    </Col>
  </Row>
);
