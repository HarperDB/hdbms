import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Button, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import useInterval from 'use-interval';

import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';

import DashboardChart from './DashboardChart';
import PlaceholderChart from './PlaceholderChart';
import getCharts from '../../../functions/api/lms/getCharts';
import removeChart from '../../../functions/api/lms/removeChart';
import registrationInfo from '../../../functions/api/instance/registrationInfo';
import config from '../../../config';
import Loader from '../../shared/Loader';

const DashboardIndex = () => {
  const { customer_id, compute_stack_id } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const instanceAuth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const charts = useStoreState(instanceState, (s) => s.charts);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshCharts = useCallback(async () => {
    if (auth && customer_id && compute_stack_id) {
      await getCharts({ auth, customer_id, compute_stack_id });
      setLoading(false);
    }
  }, [auth, customer_id, compute_stack_id, setLoading]);

  const refreshRegistration = useCallback(() => {
    if (instanceAuth && url) {
      registrationInfo({ auth: instanceAuth, url });
    }
  }, [instanceAuth, url]);

  useEffect(() => {
    setLoading(true);
    refreshCharts();
  }, [auth, customer_id, compute_stack_id, refreshCharts]);

  useEffect(() => {
    refreshRegistration();
  }, [auth, refreshRegistration, url]);

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
    <div id="charts">
      <Card className="mb-4">
        <CardBody className="text-center">
          To add charts to the dashboard, execute a
          <Button id="goToQueryPage" onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/query`)} size="sm" color="purple" className="px-2 mx-2">
            <i className="fa fa-search text-small mr-2 " /> query
          </Button>
          Then click &quot;create chart&quot;
        </CardBody>
      </Card>
      <Row>
        {loading ? (
          <Loader header="loading charts" spinner />
        ) : charts?.length ? (
          charts.map((chart) => <DashboardChart key={chart.id} chart={chart} removeChart={handleRemoveChart} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} />)
        ) : (
          <Col lg="6" xs="12" className="mb-3">
            <Card className="dashboard-chart">
              <CardBody className="text-nowrap position-relative">
                <PlaceholderChart />
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DashboardIndex;
