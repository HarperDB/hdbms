import React from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import configureCluster from '../../../api/instance/configureCluster';
import instanceState from '../../../state/stores/instanceState';

export default ({ port, setTryRefresh }) => {
  const { auth, url, instance_name, cluster_user } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    instance_name: s.instance_name,
    cluster_user: s.network?.cluster_user,
  }));

  return (
    <Row className="config-row">
      <Col>
        <Button
          color="success"
          block
          onClick={() => { configureCluster({ instance_name, cluster_user, port, auth, url }); setTryRefresh(true); }}
        >
          Enable Instance Clustering
        </Button>
      </Col>
    </Row>
  );
};
