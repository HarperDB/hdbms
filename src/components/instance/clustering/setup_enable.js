import React, { useState } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';
import useInterval from 'use-interval';

import configureCluster from '../../../api/instance/configureCluster';

export default ({ port, username, instanceName, auth, refreshInstance, url }) => {
  const [submitted, setSubmitted] = useState(false);
  const [tryRefresh, setTryRefresh] = useState(false);
  const alert = useAlert();

  useAsyncEffect(async () => {
    if (submitted) {
      const response = await configureCluster({ port, username, instanceName, auth, refreshInstance, url });
      if (response.error) {
        alert.error(response.message);
        setSubmitted(false);
      } else {
        setTryRefresh(true);
      }
    }
  }, [submitted]);

  useInterval(() => {
    if (tryRefresh) {
      refreshInstance(Date.now());
    }
  }, 5000);

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
