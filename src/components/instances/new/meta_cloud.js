import React, { useState } from 'react';
import { Col, Input, Row, Button, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import useNewInstance from '../../../state/stores/newInstance';
import defaultNewInstanceData from '../../../state/defaults/defaultNewInstanceData';

export default () => {
  const history = useHistory();
  const [newInstance, setNewInstance] = useNewInstance(defaultNewInstanceData);
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({
    instance_name: newInstance.instance_name || '',
    user: newInstance.user || '',
    pass: newInstance.pass || '',
  });

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { instance_name, user, pass } = formData;
    if (submitted) {
      if ((instance_name.length && user.length && pass.length)) {
        setNewInstance({ ...newInstance, instance_name, user, pass, is_ssl: true });
        setTimeout(() => history.push('/instances/new/details_cloud'), 0);
      } else {
        setFormState({ submitted: false, error: 'All fields must be filled out.' });
      }
    }
  }, [formState]);

  return (
    <>
      <Card>
        <CardBody>
          <div className="fieldset-label">Instance Name</div>
          <div className="fieldset">
            <Row>
              <Col xs="4" className="pt-2 text-nowrap">
                example: &quot;HDB-1&quot;
              </Col>
              <Col xs="8">
                <Input
                  onChange={(e) => updateForm({ ...formData, instance_name: e.target.value, error: false })}
                  type="text"
                  title="instance_name"
                  value={formData.instance_name}
                />
              </Col>
            </Row>
          </div>

          <div className="fieldset-label">Admin Credentials</div>
          <div className="fieldset">
            <Row>
              <Col xs="4" className="pt-2">
                Username
              </Col>
              <Col xs="8">
                <Input
                  onChange={(e) => updateForm({ ...formData, user: e.target.value, error: false })}
                  type="text"
                  title="username"
                  value={formData.user}
                />
              </Col>
            </Row>
            <hr className="my-1" />
            <Row>
              <Col xs="4" className="pt-2">
                Password
              </Col>
              <Col xs="8">
                <Input
                  onChange={(e) => updateForm({ ...formData, pass: e.target.value, error: false })}
                  type="password"
                  title="password"
                  value={formData.pass}
                />
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button
            onClick={() => history.push('/instances/new/type')}
            title="Back to Instance Type"
            block
            className="mt-3"
            color="purple"
            outline
          >
            <i className="fa fa-chevron-circle-left mr-2" />Instance Type
          </Button>
        </Col>
        <Col sm="6">
          <Button
            onClick={() => setFormState({ submitted: true, error: false })}
            title="Instance Details"
            block
            className="mt-3"
            color="purple"
          >
            Instance Details<i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <div className="text-danger text-small text-center">
          <hr />
          {formState.error}
        </div>
      )}
    </>
  );
};
