import React from 'react';
import { Col, Row } from 'reactstrap';

import commaNumbers from '../../../methods/util/commaNumbers';

export default ({ totalRecords, loading, autoRefresh, setAutoRefresh, showFilter, filtered, setLastUpdate, toggleFilter }) => (
  <Row className="floating-card-header">
    <Col>
      {commaNumbers(totalRecords)} record
      {totalRecords !== 1 ? 's' : ''}
    </Col>
    <Col className="text-md-right">
      <i title="Refresh Results" className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} onClick={() => setLastUpdate(Date.now())} />
      <span className="mr-2">auto</span>
      <i title="Turn on Auto-Refresh" className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} onClick={() => setAutoRefresh(!autoRefresh)} />
      <span className="mx-3 text">|</span>
      <i title="Filter Results" className="fa fa-search mr-3" onClick={() => toggleFilter({ filtered: showFilter ? [] : filtered, page: 0, showFilter: !showFilter })} />
    </Col>
  </Row>
);
