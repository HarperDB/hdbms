import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import appState from '../../../functions/state/appState';
import config from '../../../config';

import AlarmsRow from './alarmsRow';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../functions/api/lms/addError';
import getAlarms from '../../../functions/api/lms/getAlarms';

let controller;

const Alarms = () => {
  const { customer_id, compute_stack_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);
  const alarms = useStoreState(appState, (s) => s.alarms?.filter((a) => a.compute_stack_id === compute_stack_id), [compute_stack_id]);
  const alarmsError = useStoreState(appState, (s) => s.alarmsError);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useAsyncEffect(
    async () => {
      if (auth && mounted) {
        setLoading(true);
        await getAlarms({ auth, customer_id, currentAlarmsLength: alarms?.length });
        setLoading(false);
      }
    },
    () => controller?.abort(),
    [lastUpdate, mounted]
  );

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    []
  );

  useInterval(() => {
    if (autoRefresh && mounted) setLastUpdate(Date.now());
  }, config.refresh_content_interval);

  console.log(alarms);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Row className="floating-card-header">
        <Col>alarms</Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right">
          <Button color="link" title="Update Jobs" className="mr-2" onClick={() => setLastUpdate(Date.now())}>
            <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
          </Button>
          <Button color="link" title="Turn on autofresh" onClick={() => setAutoRefresh(!autoRefresh)}>
            <span className="mr-2">auto</span>
            <i className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} />
          </Button>
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="text-small">
          <Row>
            <Col xs="3">
              <b>status</b>
            </Col>
            <Col xs="3">
              <b>date</b>
            </Col>
            {alarmsError ? (
              <Col xs="6" className="text-right text-danger">
                <b>alarms fetch error: {new Date().toLocaleTimeString().toLowerCase()}</b>
              </Col>
            ) : (
              <Col xs="6" />
            )}
          </Row>
          <hr className="mt-1 mb-0" />
          <div className="log-scroller">
            {loading && !alarms && !autoRefresh ? (
              <div className="pt-5 text-center">
                <i className="fa fa-spinner fa-spin text-lightgrey" />
              </div>
            ) : alarms.length ? (
              alarms.map((a) => <AlarmsRow key={a.id} {...a} />)
            ) : (
              <div className="pt-5 text-center">no alarms found</div>
            )}
          </div>
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};

export default Alarms;
