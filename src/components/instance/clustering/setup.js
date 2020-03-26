import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import useInterval from 'use-interval';

import config from '../../../../config';
import instanceState from '../../../state/stores/instanceState';

import Role from './setupRole';
import User from './setupUser';
import Port from './setupPort';
import Enable from './setupEnable';
import Loader from '../../shared/loader';

export default ({ network }) => {
  const [port, setPort] = useState(12345);
  const [tryRefresh, setTryRefresh] = useState(false);

  useInterval(() => {
    if (tryRefresh) {
      instanceState.update((s) => { s.lastUpdate = Date.now(); });
    }
  }, config.instance_refresh_rate);

  return tryRefresh ? (
    <Loader message="configuring clustering" />
  ) : (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="text-white mb-2 floating-card-header">clustering</span>
        <Card className="my-3 text-small">
          <CardBody>
            HarperDB allows you to replicate data between one or more instances. We call this feature &quot;clustering&quot;.
            <hr />
            This instance does not yet have clustering enabled. To enable clustering, follow the steps outlined at right.
            <hr />
            <span className="text-danger">The Cluster User and Password must be the same between all instances in a HarperDB cluster.</span>
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <span className="text-white mb-2 floating-card-header">follow the steps below to enable clustering for this instance.</span>
        <Card className="my-3">
          <CardBody className="py-0">
            <Role />
            {network?.cluster_role && (
              <User />
            )}
            {network?.cluster_user && (
              <Port port={port} setPort={setPort} />
            )}
            {port && (
              <Enable port={port} setTryRefresh={setTryRefresh} />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
