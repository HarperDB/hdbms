import React, { useState } from 'react';
import { Col, Card, CardBody, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import Chart from 'react-apexcharts';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../state/instanceState';
import appState from '../../../state/appState';

import sql from '../../../api/instance/sql';
import removeChart from '../../../api/lms/removeChart';
import chartOptions from '../../../methods/instance/chartOptions';

export default ({ chart: { query, name, id, type, labelAttribute, seriesAttributes } }) => {
  const { compute_stack_id, customer_id } = useParams();
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const is_local = useStoreState(instanceState, (s) => s.is_local, [compute_stack_id]);
  const [chartData, setChartData] = useState(false);
  const options = chartOptions({ type, labels: chartData.map((d) => d[labelAttribute]) });
  let controller;

  useAsyncEffect(
    async () => {
      if (auth) {
        if (controller) controller.abort();
        controller = new AbortController();
        const newChartData = await sql({ sql: query, auth, url, is_local, compute_stack_id, customer_id, signal: controller.signal });
        if (!newChartData.error && newChartData.length) {
          const columns = Object.keys(newChartData[0]);
          const necessaryColumns = [labelAttribute, ...seriesAttributes];
          if (!necessaryColumns.every((v) => columns.includes(v))) {
            setChartData({ error: true, message: 'You do not have permission to access some of the data required to render this chart.' });
          } else {
            setChartData(newChartData);
          }
        } else {
          setChartData(newChartData);
        }
      }
    },
    () => controller && controller.abort(),
    []
  );

  return (
    <Col lg="6" xs="12" className="mb-3" key={name}>
      <Card>
        <CardBody className="text-nowrap position-relative">
          <Button title="Remove this chart" className="chart-remove" color="link" onClick={() => removeChart({ auth: lmsAuth, customer_id, compute_stack_id, id })}>
            <i className="fa fa-times text-darkgrey" />
          </Button>
          {chartData.error ? (
            <div className="data-loader">
              <div className="text-danger my-3">{chartData.message}</div>
              Please contact an admin to resolve this issue.
            </div>
          ) : chartData ? (
            <Chart
              options={options}
              series={['donut', 'pie'].includes(type) ? chartData.map((d) => d[seriesAttributes[0]]) : seriesAttributes.map((s) => ({ name: s, data: chartData.map((d) => d[s]) }))}
              type={type}
              height={250}
            />
          ) : (
            <div className="data-loader">
              <i className="fa fa-spinner fa-spin" />
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};
