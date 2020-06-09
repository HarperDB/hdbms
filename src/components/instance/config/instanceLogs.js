import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../state/instanceState';
import config from '../../../../config';

import readLog from '../../../api/instance/readLog';
import LogRow from './instanceLogsRow';
import logMessagesToIgnore from '../../../methods/instance/logMessagesToIgnore';

export default () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const logs = useStoreState(instanceState, (s) => s.logs);
  const logsError = useStoreState(instanceState, (s) => s.logsError);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [mounted, setMounted] = useState(false);
  let controller;

  useAsyncEffect(
    async () => {
      if (mounted) {
        setLoading(true);
        controller = new AbortController();
        await readLog({ auth, signal: controller.signal, url, currentLogCount: logs?.length || 0 });
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
    if (autoRefresh) setLastUpdate(Date.now());
  }, config.instance_refresh_rate);

  return (
    <>
      <Row className="floating-card-header">
        <Col>instance logs</Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right">
          <i title="Update Logs" className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} onClick={() => setLastUpdate(Date.now())} />
          <span className="mr-2">auto</span>
          <i title="Turn on autofresh" className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} onClick={() => setAutoRefresh(!autoRefresh)} />
          <span className="mx-3 text">|</span>
          <span className="mr-2">detailed</span>
          <i title="Turn on detailed logs" className={`fa fa-lg fa-toggle-${showDetail ? 'on' : 'off'}`} onClick={() => setShowDetail(!showDetail)} />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="text-small">
          <Row>
            <Col xs="3">
              <b>time</b>
            </Col>
            <Col xs="3">
              <b>message</b>
            </Col>
            <Col xs="6" className="text-right text-danger">
              {logsError && <b>log fetch error: {new Date().toLocaleTimeString().toLowerCase()}</b>}
            </Col>
          </Row>
          <hr className="mt-1 mb-0" />
          <div className="log-scroller">
            {logs &&
              logs
                .filter((l) => showDetail || !logMessagesToIgnore.some((i) => l.message.indexOf(i) !== -1))
                .map((l, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <LogRow key={i} {...l} />
                ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
};
