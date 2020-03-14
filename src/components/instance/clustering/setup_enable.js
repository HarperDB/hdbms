import React, { useState } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';
import useInterval from 'use-interval';
import { useStoreState } from 'pullstate';

import configureCluster from '../../../api/instance/configureCluster';
import instanceState from '../../../state/stores/instanceState';

export default ({ port }) => {
  const [submitted, setSubmitted] = useState(false);
  const [tryRefresh, setTryRefresh] = useState(false);
  const { auth, url, instance_name, cluster_user } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    instance_name: s.instance_name,
    cluster_role: s.network?.cluster_role,
    cluster_user: s.network?.cluster_user,
  }));

  useAsyncEffect(async () => {
    if (submitted) {
      configureCluster({ instance_name, cluster_user, port, auth, url });
      setTryRefresh(true);
    }
  }, [submitted]);

  useInterval(() => {
    if (tryRefresh) {
      instanceState.update((s) => { s.lastUpdate = Date.now(); });
    }
  }, 1000);

  return (
    <Row className="config-row">
      <Col>
        <Button
          color="success"
          block
          onClick={() => setSubmitted(true)}
          disabled={submitted}
        >
          {submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Enable Instance Clustering</span>}
        </Button>
      </Col>
    </Row>
  );
};
