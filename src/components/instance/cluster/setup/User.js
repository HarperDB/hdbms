import React, { useState } from 'react';
import { Row, Col, Button, Input, Card, CardBody } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';

import isAlphaUnderscore from '../../../../functions/util/isAlphaUnderscore';
import setConfiguration from '../../../../functions/api/instance/setConfiguration';
import addUser from '../../../../functions/api/instance/addUser';
import configureCluster from '../../../../functions/api/instance/configureCluster';

function User({ refreshStatus, clusterStatus }) {
  const { compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const useRoleId = useStoreState(instanceState, (s) => parseFloat(s.registration?.version) < 3);
  const clusterEngine = useStoreState(instanceState, (s) => (parseFloat(s.registration?.version) >= 4 ? 'nats' : 'socketcluster'), [compute_stack_id]);

  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { username, password } = formData;
      if (!username || !password) {
        setFormState({ error: 'All fields are required' });
      } else if (!isAlphaUnderscore(username)) {
        setFormState({ error: 'usernames must have only letters and underscores' });
      } else {
        const response = await addUser({ username, password, role: useRoleId ? clusterStatus?.cluster_role.id : clusterStatus?.cluster_role.role, auth, url });
        if (!response.error) {
          if (clusterEngine === 'nats') {
            await setConfiguration({
              auth,
              url,
              clustering_user: username,
            });
          } else {
            await configureCluster({
              auth,
              url,
              CLUSTERING_USER: username,
              NODE_NAME: clusterStatus.node_name,
            });
          }
          refreshStatus();
        } else {
          setFormState({ error: response.message });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  return clusterStatus?.cluster_user ? (
    <Row>
      <Col xs="12">
        <hr className="my-3" />
      </Col>
      <Col xs="10">Cluster User: {clusterStatus?.cluster_user.username}</Col>
      <Col xs="2" className="text-end">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr className="my-3" />
      <div className="text-nowrap mb-3">Create Cluster User</div>
      <Input
        id="username"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        className={`mb-1 ${formState.error && !formData.username ? 'error' : ''}`}
        type="text"
        title="username"
        placeholder="username"
      />
      <Input
        id="password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className={`mb-3 ${formState.error && !formData.password ? 'error' : ''}`}
        type="password"
        title="password"
        placeholder="password"
      />
      <Button color="success" disabled={formState.submitted} block onClick={() => setFormState({ submitted: true })}>
        {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : 'Create Cluster User'}
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
}

export default User;
