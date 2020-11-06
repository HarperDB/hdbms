import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import { useHistory, useParams } from 'react-router';

import commaNumbers from '../../../functions/util/commaNumbers';

const DatatableHeader = ({ totalRecords, loading, refresh, autoRefresh, toggleAutoRefresh, toggleFilter }) => {
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
        <Button id="refresh" color="link" tabIndex="0" title={`Refresh table ${table}`} className="mr-2" onClick={refresh}>
          <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
        </Button>
        <Button id="toggleAutoRefresh" color="link" tabIndex="0" title="Turn on Auto-Refresh" onClick={toggleAutoRefresh}>
          <span className="mr-2">auto</span>
          <i className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} />
        </Button>
        <span className="mx-3 text">|</span>
        <Button id="toggleSearch" color="link" tabIndex="0" title={`Filter table ${table}`} className="mr-3" onClick={toggleFilter}>
          <i className="fa fa-search" />
        </Button>
        <Button
          id="addRecord"
          color="link"
          tabIndex="0"
          title={`Add new record to table ${table}`}
          className="mr-3"
          onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}/add`)}
        >
          <i className="fa fa-plus" />
        </Button>
        <Button
          id="bulkUpload"
          color="link"
          tabIndex="0"
          className="mr-2"
          title={`Bulk Upload CSV to ${table}`}
          onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}/csv`)}
        >
          <i className="fa fa-file-text-o" />
        </Button>
      </Col>
    </Row>
  );
};

export default DatatableHeader;
