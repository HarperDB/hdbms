import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import config from '../../../../config';
import instanceState from '../../../state/stores/instanceState';

import Role from './setupRole';
import User from './setupUser';
import Port from './setupPort';
import Enable from './setupEnable';
import NodeName from './setupNodeName';
import Loader from '../../shared/loader';

export default () => {
  const { compute_stack_id } = useParams();
  const { cluster_role, cluster_user, name } = useStoreState(instanceState, (s) => s.network, [compute_stack_id]);
  const [nodeNameMatch, setNodeNameMatch] = useState(compute_stack_id === name);
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
            {cluster_role && <User />}
            {cluster_user && <Port port={port} setPort={setPort} />}
            {port && cluster_role && cluster_user && <NodeName nodeNameMatch={nodeNameMatch} setNodeNameMatch={setNodeNameMatch} />}
            {port && cluster_role && cluster_user && nodeNameMatch && <Enable port={port} setSubmitted={setSubmitted} submitted={submitted} />}
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <span className="text-white mb-2 floating-card-header">&nbsp;</span>
        {submitted ? (
          <Loader message="configuring clustering" />
        ) : (
          <Card className="my-3">
            <CardBody>
              This instance does not yet have clustering enabled. To enable clustering, complete the steps at left.
              <hr />
              <Row className="notification-holder">
                <Col>
                  <Card className="cluster-notifications">
                    <CardBody>
                      <b>Matching Cluster User Name and Password</b>
                      <br />
                      <br />
                      If you have other instances you want to cluster together with this one, make sure the cluster user has the same name and password as those other instances.
                    </CardBody>
                  </Card>
                </Col>
                {compute_stack_id !== name && (
                  <Col>
                    <Card className="cluster-notifications">
                      <CardBody>
                        <b>&quot;Cluster Node Name&quot; needs to be updated</b>
                        <br />
                        <br />
                        We need to generate and set this value in your config file. If this instance is already clustered with other instances, you will want to restore your
                        pub/sub settings after completing this process.
                      </CardBody>
                    </Card>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        )}
      </Col>
    </Row>
  );
};
