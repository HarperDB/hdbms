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
  const [submitted, setSubmitted] = useState(false);

  useInterval(() => {
    if (submitted) {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  }, config.instance_refresh_rate);

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="text-white mb-2 floating-card-header">enable clustering</span>
        <Card className="my-3">
          <CardBody>
            <Role />
            {network?.cluster_role && <User />}
            {network?.cluster_user && <Port port={port} setPort={setPort} />}
            {port && network?.cluster_role && network?.cluster_user && <Enable port={port} setSubmitted={setSubmitted} submitted={submitted} />}
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <span className="text-white mb-2 floating-card-header">&nbsp;</span>
        {submitted ? (
          <Loader message="configuring clustering" />
        ) : (
          <Card className="my-3 p-5">
            <CardBody>
              <div className="text-center">
                This instance does not yet have clustering enabled. To enable clustering, complete the steps at left.
                <hr />
                <span className="text-danger">
                  <b>Note:</b> The Cluster User and Password must be the same between all instances in a HarperDB cluster.
                </span>
              </div>
            </CardBody>
          </Card>
        )}
      </Col>
    </Row>
  );
};
