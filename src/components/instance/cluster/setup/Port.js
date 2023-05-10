import React, { useState } from 'react';
import { Button, Input, Card, CardBody, Row, Col } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import instanceState from '../../../../functions/state/instanceState';

import setConfiguration from '../../../../functions/api/instance/setConfiguration';
import configureCluster from '../../../../functions/api/instance/configureCluster';


function Port({ clusterStatus, refreshStatus }) {

  const { compute_stack_id } = useParams();

  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const clusterEngine = useStoreState(instanceState, (s) => (parseFloat(s.registration?.version) >= 4 ? 'nats' : 'socketcluster'), [compute_stack_id]);

  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const [defaultClusterValue, setDefaultClusterValue] = useState(clusterStatus?.config_cluster_port || 12345);

  // if config has a port value, use that, otherwise ask for it and save it.
  useAsyncEffect(async () => {
    if (formState.submitted) {
      let result;
      if (clusterEngine === 'nats') {
        result = await setConfiguration({
          auth,
          url,
          clustering_port: formData.port,
        });
      } else {
        result = await configureCluster({
          auth,
          url,
          CLUSTERING_USER: clusterStatus.config_cluster_user,
          CLUSTERING_PORT: formData.port,
        });
      }
      if (result.error) {
        setFormState({ error: result.message });
      } else {
        await refreshStatus();
        setDefaultClusterValue(formData.port);
        setFormState({});
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  return clusterStatus?.config_cluster_port ? (
    <Row>
      <Col xs="12">
        <hr className="my-3" />
      </Col>
      <Col xs="10" className="text">
        Cluster Port: {clusterStatus?.config_cluster_port}
      </Col>
      <Col xs="2" className="text text-end">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr className="my-3" />
      <div className="text-nowrap mb-3">Set Clustering Port</div>
      <Input
        id="clusterPort"
        onChange={(e) => setFormData({ port: e.target.value })}
        className={`mb-1 ${formState.error && !formData.port ? 'error' : ''}`}
        type="text"
        title="cluster port"
        placeholder="cluster port number"
        defaultValue={defaultClusterValue}
      />
      <Button
        block
        color="success"
        disabled={formState.submitted}
        onClick={() => setFormState({ submitted: true })}>
        {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : 'Set Clustering Port'}
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
}

export default Port;
