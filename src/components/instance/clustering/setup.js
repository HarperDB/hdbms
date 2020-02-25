import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';

import Role from './setup_role';
import User from './setup_user';
import Port from './setup_port';
import Enable from './setup_enable';

export default ({ auth, network, refreshInstance }) => {
  const [port, setPort] = useState(false);
  const { instance_id } = useParams();

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="text-white mb-2">clustering</span>
        <Card className="my-3">
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
        <span className="text-white mb-2">follow the steps below to enable clustering for this instance.</span>
        <Card className="my-3">
          <CardBody className="py-0">
            <Role
              clusterRole={network.cluster_role}
              auth={auth}
              refreshInstance={refreshInstance}
            />
            {network.cluster_role && (
              <User
                clusterUser={network.cluster_user}
                clusterRole={network.cluster_role}
                auth={auth}
                refreshInstance={refreshInstance}
              />
            )}
            {network.cluster_user && (
              <Port
                port={port}
                setPort={setPort}
              />
            )}
            {port && (
              <Enable
                port={port}
                username={network.cluster_user}
                instanceId={instance_id}
                auth={auth}
                refreshInstance={refreshInstance}
              />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
