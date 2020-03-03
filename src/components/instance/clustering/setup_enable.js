import React, { useState } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import configureCluster from '../../../api/instance/configureCluster';

export default ({ port, username, instanceId, auth, refreshInstance }) => {
  const [submitted, setSubmitted] = useState(false);

  useAsyncEffect(async () => {
    if (submitted) await configureCluster({ port, username, instanceId, auth, refreshInstance });
  }, [submitted]);

  return (
    <Row className="config-row">
      <Col>
        <Button
          color="success"
          block
          onClick={() => setSubmitted(true)}
          disabled={submitted}
        >
          Enable Instance Clustering
        </Button>
      </Col>
    </Row>
  );
};
