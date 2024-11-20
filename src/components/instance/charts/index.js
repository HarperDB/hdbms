import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Button, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import useInterval from 'use-interval';
import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';
import DashboardChart from './DashboardChart';
import PlaceholderChart from './PlaceholderChart';
import getCharts from '../../../functions/api/lms/getCharts';
import removeChart from '../../../functions/api/lms/removeChart';
import config from '../../../config';
let controller;
function DashboardIndex() {
  const {
    customerId
  } = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const auth = useStoreState(appState, s => s.auth);
  const computeStackId = useStoreState(instanceState, s => s.computeStackId);
  const charts = useStoreState(instanceState, s => s.charts);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(true);
  const handleRemoveChart = useCallback(async id => {
    const response = await removeChart({
      auth,
      customerId,
      computeStackId,
      id
    });
    if (response.error) {
      alert.error(response.message);
    } else {
      alert.success(response.message);
      setLastUpdate(Date.now());
    }
  }, [alert, auth, computeStackId, customerId]);
  useEffect(() => {
    const fetchData = async () => {
      controller = new AbortController();
      await getCharts({
        auth,
        customerId,
        computeStackId,
        signal: controller.signal
      });
    };
    if (auth) fetchData();
    return () => controller?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, lastUpdate]);
  useInterval(() => auth && setLastUpdate(Date.now()), config.refreshContentInterval);
  return <div id="charts">
      <Card className="mb-4">
        <CardBody className="text-center">
          To add charts to the dashboard, execute a
          <Button id="goToQueryPage" onClick={() => navigate(`/o/${customerId}/i/${computeStackId}/query`)} size="sm" color="success" className="px-2 mx-2">
            <i className="fa fa-search text-small me-2 " /> query
          </Button>
          Then click &quot;create chart&quot;
        </CardBody>
      </Card>
      <Row>
        {charts?.length ? charts.map(chart => <DashboardChart key={chart.id} chart={chart} removeChart={handleRemoveChart} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} />) : <Col lg="6" xs="12" className="mb-3">
            <Card className="dashboard-chart">
              <CardBody className="text-nowrap position-relative">
                <PlaceholderChart />
              </CardBody>
            </Card>
          </Col>}
      </Row>
    </div>;
}
export default DashboardIndex;