import React, { useState } from 'react';
import { Row, Col, Button, Input, Card, CardBody } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';

import isAlphaUnderscore from '../../../../functions/util/isAlphaUnderscore';
import buildCustomAPI from '../../../../functions/instance/buildCustomAPI';
import createCustomAPIUser from '../../../../functions/instance/createCustomAPIUser';

const User = () => {
  const { compute_stack_id, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const custom_api_role = useStoreState(instanceState, (s) => s.custom_api?.custom_api_role);
  const custom_api_user = useStoreState(instanceState, (s) => s.custom_api?.custom_api_user);

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
        const response = await createCustomAPIUser({ username, password, role: custom_api_role, auth, url, is_local, compute_stack_id, customer_id });
        if (!response.error) {
          buildCustomAPI({ auth, url });
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

  return custom_api_user ? (
    <Row>
      <Col xs="12">
        <hr className="my-3" />
      </Col>
      <Col xs="10">Custom API User</Col>
      <Col xs="2" className="text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr className="my-3" />
      <div className="text-nowrap mb-3">Create Custom API User</div>
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
      <Button color="success" block onClick={() => setFormState({ submitted: true })}>
        Create Custom API User
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};

export default User;
