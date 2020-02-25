import React, { useState } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import enableInstanceClustering from '../../../util/instance/enableInstanceClustering';

export default ({ port, username, instanceId, auth, refreshInstance }) => {
  const [submitted, setSubmitted] = useState(false);

  useAsyncEffect(async () => {
    if (submitted) {
      const result = await enableInstanceClustering({ port, username, instanceId, auth, refreshInstance });
      console.log(result);
    }
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
