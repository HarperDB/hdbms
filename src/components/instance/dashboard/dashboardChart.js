import React, { useState } from 'react';
import { Col, Card, CardBody, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import Chart from 'react-apexcharts';
import useAsyncEffect from 'use-async-effect';

import useInterval from 'use-interval';
import instanceState from '../../../state/instanceState';
import appState from '../../../state/appState';

import sql from '../../../api/instance/sql';
import chartOptions from '../../../methods/instance/chartOptions';
import isNumeric from '../../../methods/util/isNumeric';
import config from '../../../config';

export default ({ chart: { query, name, id, type, labelAttribute, seriesAttributes }, removeChart }) => {
  const { compute_stack_id, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const is_local = useStoreState(instanceState, (s) => s.is_local, [compute_stack_id]);
  const theme = useStoreState(appState, (s) => s.theme);
  const [chartData, setChartData] = useState(false);
  const [loading, setLoading] = useState(false);
  const options = chartData && !chartData.error && chartOptions({ title: name, type, labels: chartData.map((d) => d[labelAttribute]), theme });
  const series =
    !chartData || chartData.error
      ? []
      : type === 'single value'
      ? chartData[0][seriesAttributes[0]]
      : ['donut', 'pie'].includes(type)
      ? chartData.map((d) => d[seriesAttributes[0]])
      : seriesAttributes.map((s) => ({ name: s, data: chartData.map((d) => d[s]) }));
  let controller;

  const getChartData = async () => {
    if (auth) {
      setLoading(true);
      if (controller) controller.abort();
      controller = new AbortController();
      const newChartData = await sql({ sql: query, auth, url, is_local, compute_stack_id, customer_id, signal: controller.signal });

      if (!newChartData.error && newChartData.length) {
        const columns = Object.keys(newChartData[0]);
        const necessaryColumns = type === 'single value' ? seriesAttributes : [labelAttribute, ...seriesAttributes];
        if (!necessaryColumns.every((v) => columns.includes(v))) {
          setChartData({ error: true, message: 'You do not have permission to access some of the data required to render this chart.' });
        } else {
          setChartData(newChartData);
        }
      } else {
        setChartData(newChartData);
      }
      setLoading(false);
    }
  };

  useAsyncEffect(
    () => getChartData(),
    () => controller && controller.abort(),
    []
  );

  useInterval(getChartData, config.refresh_content_interval);

  const handleRemoveChart = (chartId) => {
    setLoading(true);
    removeChart(chartId);
  };

  return (
    chartData &&
    !chartData.error && (
      <Col lg="6" xs="12" className="mb-3" key={name}>
        <Card className="dashboard-chart">
          <CardBody className="text-nowrap position-relative">
            <Button disabled={loading} title="Remove this chart" className="chart-remove" color="link" onClick={() => handleRemoveChart(id)}>
              <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-times'} text-darkgrey`} />
            </Button>
            {chartData && type === 'single value' ? (
              <div className="dashboard single-value-chart">
                <div className="title">{name}</div>
                <h1>{isNumeric(series) ? series.toFixed(2) : series}</h1>
              </div>
            ) : chartData ? (
              <Chart options={options} series={series} type={type} height={220} />
            ) : null}
          </CardBody>
        </Card>
      </Col>
    )
  );
};
