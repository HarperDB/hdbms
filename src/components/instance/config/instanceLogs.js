import React, { Fragment, useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../state/stores/instanceState';
import config from '../../../../config';

import readLog from '../../../api/instance/readLog';
import LogRow from './instanceLogsRow';
import logMessagesToIgnore from '../../../util/instance/logMessagesToIgnore';

export default () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [noLogsReturned, setNoLogsReturned] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  useAsyncEffect(async () => {
    if (auth && url) {
      setLoading(true);
      const newLogs = await readLog({ auth, url });
      if (newLogs) {
        setLogs(newLogs);
        setNoLogsReturned(false);
      } else {
        setNoLogsReturned(true);
      }
      setLoading(false);
    }
  }, [lastUpdate, auth, url]);

  useInterval(() => {
    if (autoRefresh) setLastUpdate(Date.now());
  }, config.instance_refresh_rate);

  return (
    <>
      <Row>
        <Col className="text-nowrap text-left">
          <span className="text-white mb-2 floating-card-header">instance logs</span>
        </Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right text-white text-nowrap">
          <i title="Update Logs" className={`fa floating-card-header mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} onClick={() => setLastUpdate(Date.now())} />
          <span className="mr-2">auto</span>
          <i title="Turn on autofresh" className={`floating-card-header fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} onClick={() => setAutoRefresh(!autoRefresh)} />
          <span className="mx-3 text">|</span>
          <span className="mr-2">detailed</span>
          <i title="Turn on detailed logs" className={`floating-card-header fa fa-lg fa-toggle-${showDetail ? 'on' : 'off'}`} onClick={() => setShowDetail(!showDetail)} />
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
              {noLogsReturned && <b>log fetch error: {new Date().toLocaleTimeString().toLowerCase()}</b>}
            </Col>
          </Row>
          <hr className="mt-1 mb-0" />
          <div className="log-scroller">
            {logs
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
