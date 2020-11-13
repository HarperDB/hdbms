import React, { useState, useEffect } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import useInterval from 'use-interval';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../functions/state/instanceState';
import config from '../../../config';

import readLog from '../../../functions/api/instance/readLog';
import LogRow from './LogsRow';
import logMessagesToIgnore from '../../../functions/instance/logMessagesToIgnore';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';

let controller;

const Logs = () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const logs = useStoreState(instanceState, (s) => s.logs);
  const logsError = useStoreState(instanceState, (s) => s.logsError);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const filteredLogs = logs && logs.filter((l) => showDetail || !logMessagesToIgnore.some((i) => l.message.indexOf(i) !== -1));
  const [lastUpdate, setLastUpdate] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      controller = new AbortController();
      await readLog({ auth, url, signal: controller.signal, currentLogCount: logs?.length || 0 });
      if (isMounted) setLoading(false);
    };

    if (auth) fetchData();

    return () => {
      controller?.abort();
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, lastUpdate]);

  useInterval(() => auth && autoRefresh && setLastUpdate(Date.now()), config.refresh_content_interval);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
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
        <CardBody className="item-list">
          <Row>
            <Col xs="3">
              <b>status</b>
            </Col>
            <Col xs="3">
              <b>date</b>
            </Col>
            {!loading && logsError ? (
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
          <div className="item-scroller">
            {loading && !filteredLogs && !autoRefresh ? (
              <div className="pt-5 text-center">
                <i className="fa fa-spinner fa-spin text-lightgrey" />
              </div>
            ) : filteredLogs?.length ? (
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
