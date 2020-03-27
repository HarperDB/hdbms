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
  const [lastUpdate, setLastUpdate] = useState(false);
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  useAsyncEffect(async () => {
    if (auth && url) {
      const { file } = await readLog({ auth, url });
      setLogs(file);
    }
  }, [lastUpdate, auth, url]);

  useInterval(() => setLastUpdate(Date.now()), config.instance_refresh_rate);

  return (
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
  );
};
