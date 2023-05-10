import React, { useState } from 'react';
import { Row, Col, Button, Input, Card, CardBody } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';

import setConfiguration from '../../../../functions/api/instance/setConfiguration';
import configureCluster from '../../../../functions/api/instance/configureCluster';

function NodeName({ refreshStatus, clusterStatus }) {

  const { compute_stack_id } = useParams();

  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const clusterEngine = useStoreState(instanceState, (s) => (parseFloat(s.registration?.version) >= 4 ? 'nats' : 'socketcluster'), [compute_stack_id]);

  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ nodeName: compute_stack_id });

  useAsyncEffect(async () => {
    if (formState.submitted) {
      let result;
      if (clusterEngine === 'nats') {
        result = await setConfiguration({
          auth,
          url,
          clustering_nodeName: formData.nodeName,
        });
      } else {
        result = await configureCluster({
          auth,
          url,
          CLUSTERING_USER: clusterStatus.config_cluster_user,
          NODE_NAME: formData.nodeName,
        });
      }
      if (result.error) {
        setFormState({ error: result.message });
      } else {
        refreshStatus();
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  return clusterStatus?.node_name ? (
    <Row>
      <Col xs="12">
        <hr className="my-3" />
      </Col>
      <Col xs="10" className="text">
        Cluster Name: {clusterStatus?.node_name}
      </Col>
      <Col xs="2" className="text text-end">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr className="my-3" />
      <div className="text-nowrap mb-3">Set Cluster Name</div>
      {/* id="nodeName" causes react-dom to fail */}
      <Input
        id="clusterNodeName"
        onChange={(e) => setFormData({ nodeName: e.target.value })}
        className={`mb-1 ${formState.error && !formData.nodeName ? 'error' : ''}`}
        type="text"
        title="node name"
        placeholder="node name"
        defaultValue={compute_stack_id}
      />
      <Button color="success" disabled={formState.submitted} block onClick={() => setFormState({ submitted: true })}>
        {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : 'Set Clustering Node Name'}
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
}

export default NodeName;
