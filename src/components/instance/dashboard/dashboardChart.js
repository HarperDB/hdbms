import React, { useState } from 'react';
import { Col, Card, CardBody, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import Chart from 'react-apexcharts';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../state/instanceState';
import sql from '../../../api/instance/sql';
import useDashboard from '../../../state/instanceDashboard';

let controller;

export default ({ chart: { query, name, id, type, labelAttribute, seriesAttributes } }) => {
  const { compute_stack_id, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const is_local = useStoreState(instanceState, (s) => s.is_local, [compute_stack_id]);
  const [chartData, setChartData] = useState(false);
  const [instanceDashboard, setInstanceDashboard] = useDashboard({});

  useAsyncEffect(
    async () => {
      if (auth) {
        if (controller) controller.abort();
        controller = new AbortController();
        const newChartData = await sql({ sql: query, auth, url, is_local, compute_stack_id, customer_id, signal: controller.signal });
        setChartData(newChartData);
      }
    },
    () => controller && controller.abort(),
    []
  );

  const removeChart = (chartId) => {
    const dashboardCharts = instanceDashboard[compute_stack_id];
    const newCharts = dashboardCharts.filter((c) => c.id !== chartId);
    setInstanceDashboard({ ...instanceDashboard, [compute_stack_id]: newCharts });
  };

  return (
    <Col lg="6" xs="12" className="mb-3" key={name}>
      <Card>
        <CardBody className="text-nowrap position-relative">
          <Button title="Remove this chart" className="chart-remove" color="link" onClick={() => removeChart(id)}>
            <i className="fa fa-times text-darkgrey" />
          </Button>
          {chartData ? (
            <Chart
              options={{
                chart: {
                  type,
                  fontFamily: 'proxima-soft',
                  parentHeightOffset: 0,
                  toolbar: { offsetX: -25, tools: { selection: false, pan: false, zoom: false, zoomin: false, zoomout: false, reset: false } },
                },
                title: { text: name },
                labels: chartData.map((d) => d[labelAttribute]),
                theme: { palette: 'palette10' },
                plotOptions: { pie: { offsetY: 10, expandOnClick: false } },
                legend: { offsetY: 15 },
              }}
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
