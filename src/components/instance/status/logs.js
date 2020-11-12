import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import instanceState from '../../../functions/state/instanceState';
import config from '../../../config';

import readLog from '../../../functions/api/instance/readLog';
import LogRow from './logsRow';
import logMessagesToIgnore from '../../../functions/instance/logMessagesToIgnore';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../functions/api/lms/addError';

let controller;

const Logs = () => {
  const { customer_id, compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const logs = useStoreState(instanceState, (s) => s.logs);
  const logsError = useStoreState(instanceState, (s) => s.logsError);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [mounted, setMounted] = useState(false);
  const filteredLogs = logs && logs.filter((l) => showDetail || !logMessagesToIgnore.some((i) => l.message.indexOf(i) !== -1));

  useAsyncEffect(
    async () => {
      if (mounted) {
        setLoading(true);
        controller = new AbortController();
        await readLog({ auth, signal: controller.signal, url, currentLogCount: logs?.length || 0, is_local, compute_stack_id, customer_id });
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

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Row className="floating-card-header">
        <Col>logs</Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right">
          <Button color="link" title="Update Logs" className="mr-2" onClick={() => setLastUpdate(Date.now())}>
            <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
          </Button>
          <Button color="link" title="Turn on autofresh" onClick={() => setAutoRefresh(!autoRefresh)}>
            <span className="mr-2">auto</span>
            <i className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} />
          </Button>
          <span className="mx-3 text">|</span>
          <Button color="link" title="view detailed logs" onClick={() => setShowDetail(!showDetail)}>
            <span className="mr-2">detailed</span>
            <i className={`fa fa-lg fa-toggle-${showDetail ? 'on' : 'off'}`} />
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
            {logsError ? (
              <Col xs="6" className="text-right text-danger">
                <b>log fetch error: {new Date().toLocaleTimeString().toLowerCase()}</b>
              </Col>
            ) : (
              <Col xs="6">
                <b>time</b>
              </Col>
            )}
          </Row>
          <hr className="mt-1 mb-0" />
          <div className="log-scroller">
            {loading && !filteredLogs && !autoRefresh ? (
              <div className="pt-5 text-center">
                <i className="fa fa-spinner fa-spin text-lightgrey" />
              </div>
            ) : filteredLogs.length ? (
              filteredLogs.map((l, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <LogRow key={i} {...l} />
              ))
            ) : logs && !logs.length ? (
              <div className="pt-5 text-center">no logs found</div>
            ) : (
              <div className="pt-5 text-center">no logs found in this view</div>
            )}
          </div>
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};

export default Logs;