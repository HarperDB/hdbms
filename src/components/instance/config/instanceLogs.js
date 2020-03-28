import React, { Fragment, useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../state/stores/instanceState';
import config from '../../../../config';

import readLog from '../../../api/instance/readLog';

export default () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  useAsyncEffect(async () => {
    if (auth && url) {
      setLoading(true);
      const { file } = await readLog({ auth, url });
      if (Array.isArray(file)) {
        setLogs(file);
      }
      setLoading(false);
    }
  }, [lastUpdate, auth, url]);

  useInterval(() => { if (autoRefresh) setLastUpdate(Date.now()); }, config.instance_refresh_rate);

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
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="text-small">
          <Row>
            <Col xs="3">
              <b>time</b>
            </Col>
            <Col xs="9">
              <b>message</b>
            </Col>
          </Row>
          <hr className="mt-1 mb-2" />
          <div className="log-scroller">
            {logs && logs.map((l, i) => (
              <Fragment key={i}>
                <Row>
                  <Col xl="3" lg="12" md="3" className={`text-${['error', 'fatal'].includes(l.level) ? 'danger' : 'grey'}`}>
                    {new Date(l.timestamp).toLocaleString()}
                  </Col>
                  <Col xl="9" lg="12" md="9">
                    {l.message}
                  </Col>
                </Row>
                <hr className="my-2" />
              </Fragment>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
};
