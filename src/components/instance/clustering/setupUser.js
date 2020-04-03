import React, { useState } from 'react';
import { Row, Col, Button, Input, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import createClusterUser from '../../../api/instance/createClusterUser';
import instanceState from '../../../state/stores/instanceState';

export default () => {
  const { auth, url, cluster_role, cluster_user } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    cluster_role: s.network?.cluster_role,
    cluster_user: s.network?.cluster_user,
  }));

  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { username, password } = formData;
      if (!username || !password) {
        setFormState({
          error: 'All fields are required',
        });
      } else if (!username.match(/^[a-zA-Z_]+$/)) {
        setFormState({
          error: 'usernames must have only letters and underscores',
        });
        setTimeout(() => setFormState({}), 2000);
      } else {
        const response = await createClusterUser({
          username,
          password,
          role: cluster_role,
          auth,
          url,
        });
        if (response) {
          setFormState({
            error: response.message,
          });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  return cluster_user ? (
    <Row>
      <Col xs="12">
        <hr />
      </Col>
      <Col xs="10">Cluster User</Col>
      <Col xs="2" className="text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr />
      <div className="text-nowrap mb-3">Cluster User</div>
      <Input
        onChange={(e) =>
          updateForm({
            ...formData,
            username: e.target.value,
          })
        }
        className={`mb-1 ${formState.error && !formData.username ? 'error' : ''}`}
        type="text"
        title="username"
        placeholder="username"
      />
      <Input
        onChange={(e) =>
          updateForm({
            ...formData,
            password: e.target.value,
          })
        }
        className={`mb-3 ${formState.error && !formData.password ? 'error' : ''}`}
        type="password"
        title="password"
        placeholder="password"
      />
      <Button
        color="success"
        block
        onClick={() =>
          setFormState({
            submitted: true,
          })
        }
      >
        Create Cluster User
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};
