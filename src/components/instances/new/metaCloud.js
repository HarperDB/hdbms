import React, { useState } from 'react';
import { Col, Input, Row, Button, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import useNewInstance from '../../../state/stores/newInstance';
import ContentContainer from '../../shared/contentContainer';

export default ({ instanceNames }) => {
  const history = useHistory();
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({
    instance_name: newInstance.instance_name || '',
    user: newInstance.user || '',
    pass: newInstance.pass || '',
  });

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { instance_name, user, pass } = formData;
    if (submitted) {
      if (instanceNames.includes(instance_name)) {
        setFormState({ submitted: false, error: `An instance named "${instance_name}" already exists` });
      } else if ((instance_name.length && user.length && pass.length)) {
        setNewInstance({ ...newInstance, instance_name, user, pass, is_ssl: true });
        setTimeout(() => history.push('/instances/new/details_cloud'), 0);
      } else {
        setFormState({ error: 'All fields must be filled out.' });
      }
    }
  }, [formState]);

  return (
    <>
      <Card>
        <CardBody>

          <ContentContainer header="Instance Name">
            <Row className="mb-4">
              <Col xs="4" className="pt-2 text-nowrap">
                Example: &quot;cloud-1&quot;
              </Col>
              <Col xs="8">
                <Input
                  onChange={(e) => updateForm({ ...formData, instance_name: e.target.value.replace(/\W+/g, '-').toLowerCase() })}
                  type="text"
                  title="instance_name"
                  value={formData.instance_name}
                />
              </Col>
            </Row>
          </ContentContainer>

          <ContentContainer header="Admin Credentials">
            <Row>
              <Col xs="4" className="pt-2">
                Username
              </Col>
              <Col xs="8">
                <Input
                  onChange={(e) => updateForm({ ...formData, user: e.target.value })}
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
                  onChange={(e) => updateForm({ ...formData, pass: e.target.value })}
                  type="password"
                  title="password"
                  value={formData.pass}
                />
              </Col>
            </Row>
          </ContentContainer>

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
          >
            <i className="fa fa-chevron-circle-left mr-2" />Instance Type
          </Button>
        </Col>
        <Col sm="6">
          <Button
            onClick={() => setFormState({ submitted: true })}
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
        <Card className="mt-3 error">
          <CardBody className="text-danger text-small text-center">
            {formState.error}
          </CardBody>
        </Card>
      )}
    </>
  );
};
