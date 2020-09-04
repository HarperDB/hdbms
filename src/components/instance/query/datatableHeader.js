import React from 'react';
import { Button, Col, Row } from 'reactstrap';

import commaNumbers from '../../../methods/util/commaNumbers';

export default ({ totalRecords, loading, autoRefresh, setAutoRefresh, showFilter, filtered, setLastUpdate, toggleFilter, setShowChartModal }) => (
  <Row className="floating-card-header">
    <Col xs="12" md="3">
      {commaNumbers(totalRecords)} record
      {totalRecords !== 1 ? 's' : ''}
    </Col>
    <Col xs="12" md="9" className="text-md-right">
      {/*
      <br className="d-block d-md-none" />
      <Button id="createChart" color="link" title="Create Chart" onClick={() => setShowChartModal(true)}>
        <i className="fa fa-lg fa-chart-line" />
        <span className="ml-2">create chart</span>
      </Button>
      <span className="mx-3 text">|</span>
      */}
      <Button color="link" title="Refresh Results" className="mr-2" onClick={() => setLastUpdate(Date.now())}>
        <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
      </Button>
      <Button color="link" title="Turn on autofresh" onClick={() => setAutoRefresh(!autoRefresh)}>
        <span className="mr-2">auto</span>
        <i className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} />
      </Button>
      <span className="mx-3 text">|</span>
      <Button color="link" title="Filter Results" className="mr-2" onClick={() => toggleFilter({ filtered: showFilter ? [] : filtered, page: 0, showFilter: !showFilter })}>
        <i className="fa fa-search" />
      </Button>
    </Col>
  </Row>
);
