import React, { useState } from 'react';
import { Col, Input, Row, Button, Card, CardBody, RadioCheckbox } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';

import useNewInstance from '../../../state/stores/newInstance';

import queryInstance from '../../../api/queryInstance';

export default ({ instanceNames }) => {
  const history = useHistory();
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({
    instance_name: newInstance.instance_name || '',
    user: newInstance.user || '',
    pass: newInstance.pass || '',
    host: newInstance.host || '',
    port: newInstance.port || '',
    is_ssl: newInstance.is_ssl || false,
  });

  useAsyncEffect(async () => {
    const { submitted } = formState;
    const { instance_name, user, pass, host, port, is_ssl } = formData;
    if (submitted) {
      if (instanceNames.includes(instance_name)) {
        setFormState({ error: `An instance named "${instance_name}" already exists` });
      } else if ((instance_name.length && user.length && pass.length && host.length && port.length)) {
        try {
          const url = `${is_ssl ? 'https://' : 'http://'}${host}:${port}`;
          const response = await queryInstance({ operation: 'describe_all' }, formData, url);
          if (response.error) {
            setFormState({ error: 'The provided credentials cannot log into that instance.' });
          } else {
            setNewInstance({ ...newInstance, instance_name, user, pass, host, port, is_ssl });
            setTimeout(() => history.push('/instances/new/details_local'), 0);
          }
        } catch (e) {
          setFormState({ error: 'We found no HarperDB at that url/port. Is it running?' });
        }
      } else {
        setFormState({ error: 'All fields must be filled out.' });
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
                Example: &quot;edge-1&quot;
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
          </div>

          <div className="fieldset-label">Admin Credentials</div>
          <div className="fieldset">
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
          </div>
          <div className="fieldset-label">Instance Details</div>
          <div className="fieldset">
            <Row>
              <Col xs="4" className="pt-2">
                Host
              </Col>
              <Col xs="8">
                <Input
                  onChange={(e) => updateForm({ ...formData, host: e.target.value })}
                  type="text"
                  title="host"
                  value={formData.host || ''}
                />
              </Col>
            </Row>
            <hr className="my-1" />
            <Row>
              <Col xs="4" className="pt-2">
                Port
              </Col>
              <Col xs="8">
                <Input
                  onChange={(e) => updateForm({ ...formData, port: e.target.value })}
                  type="number"
                  title="port"
                  value={formData.port || ''}
                />
              </Col>
            </Row>
            <hr className="my-1" />
            <Row className="mt-1">
              <Col xs="4" className="pt-2">
                SSL
              </Col>
              <Col xs="8" className="pt-1">
                <RadioCheckbox
                  type="checkbox"
                  onChange={(value) => updateForm({ ...formData, is_ssl: value || false })}
                  options={{ label: '', value: true }}
                  value={formData.is_ssl}
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
        <div className="text-danger text-small text-center">
          <hr />
          {formState.error}
        </div>
      )}
    </>
  );
};
