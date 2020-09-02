import React, { useEffect } from 'react';
import { Col, Row, Card, CardBody, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import useInterval from 'use-interval';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';

import commaNumbers from '../../../methods/util/commaNumbers';
import DashboardChart from './dashboardChart';
import getCharts from '../../../api/lms/getCharts';
import removeChart from '../../../api/lms/removeChart';
import config from '../../../config';

export default () => {
  const { customer_id, compute_stack_id } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const charts = useStoreState(instanceState, (s) => s.charts);
  const registration = useStoreState(instanceState, (s) => s.registration);
  const dashboardStats = useStoreState(instanceState, (s) => s.dashboardStats);

  const refreshCharts = () => {
    if (auth && customer_id && compute_stack_id) {
      getCharts({ auth, customer_id, compute_stack_id });
    }
  };

  useEffect(refreshCharts, [auth, customer_id, compute_stack_id]);

  useInterval(refreshCharts, config.refresh_content_interval);

  const handleRemoveChart = async (id) => {
    const response = await removeChart({ auth, customer_id, compute_stack_id, id });
    if (response.error) {
      alert.error(response.message);
    } else {
      alert.success(response.message);
      getCharts({ auth, customer_id, compute_stack_id });
    }
  };

  return (
    <Row id="dashboard">
      <Col lg="2" sm="4" xs="6" className="mb-3">
        <Card>
          <CardBody className="text-nowrap text-truncate">
            <h5>{commaNumbers(dashboardStats?.schemas.toString() || '...')}</h5>
            schemas
          </CardBody>
        </Card>
      </Col>
      <Col lg="2" sm="4" xs="6" className="mb-3">
        <Card>
          <CardBody className="text-nowrap text-truncate">
            <h5>{commaNumbers(dashboardStats?.tables.toString() || '...')}</h5>
            tables
          </CardBody>
        </Card>
      </Col>
      <Col lg="2" sm="4" xs="6" className="mb-3">
        <Card>
          <CardBody className="text-nowrap text-truncate">
            <h5>{commaNumbers(dashboardStats?.records.toString() || '...')}</h5>
            total records
          </CardBody>
        </Card>
      </Col>
      <Col lg="2" sm="4" xs="6" className="mb-3">
        <Card>
          <CardBody className="text-nowrap text-truncate">
            <h5>
              {registration?.ram_allocation / 1024 || '...'}
              <span className="text-small">GB</span>
            </h5>
            licensed ram
          </CardBody>
        </Card>
      </Col>
      <Col lg="2" sm="4" xs="6" className="mb-3">
        <Card>
          <CardBody className="text-nowrap text-truncate">
            <h5>{registration?.license_expiration_date || '...'}</h5>
            license exp
          </CardBody>
        </Card>
      </Col>
      <Col lg="2" sm="4" xs="6" className="mb-3">
        <Card>
          <CardBody className="text-nowrap text-truncate">
            <h5>{registration?.version || '...'}</h5>
            hdb version
          </CardBody>
        </Card>
      </Col>
      <Col xs="12">
        <hr className="mt-0 mb-3" />
        <div className="text-center text-bold instructions">
          To add charts to the dashboard, execute a{' '}
          <Button onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/query`)} size="sm" color="purple" className="py-1 px-2 mr-2">
            <i className="fa fa-search text-small mr-2 " /> query
          </Button>
          Then click &quot;create chart&quot;
        </div>
        <hr className="my-3" />
      </Col>
      {charts && charts.map((chart) => <DashboardChart key={chart.id} chart={chart} removeChart={handleRemoveChart} />)}
    </Row>
  );
};
