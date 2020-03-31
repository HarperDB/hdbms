import React, { useState } from 'react';
import { Col, Input, Row, Button, Card, CardBody, RadioCheckbox } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';

import useNewInstance from '../../../state/stores/newInstance';
import ContentContainer from '../../shared/contentContainer';
import queryInstance from '../../../api/queryInstance';

export default ({ instanceNames, instanceURLs }) => {
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
      const url = `${is_ssl ? 'https://' : 'http://'}${host}:${port}`;

      if (instanceNames.includes(instance_name)) {
        setFormState({ error: `An instance named "${instance_name}" already exists` });
      } else if (instanceURLs.includes(url)) {
        setFormState({ error: `An instance at "${url}" already exists` });
      } else if (!user.match(/^[a-zA-Z0-9-_]+$/)) {
        setFormState({ submitted: false, error: 'usernames must have only letters, numbers, and underscores' });
      } else if ((instance_name.length && user.length && pass.length && host.length && port.length)) {
        setNewInstance({ ...newInstance, instance_name, user, pass, host, port, is_ssl });

        try {
          const response = await queryInstance({ operation: 'describe_all' }, formData, url);
          if (response.error && response.message === 'Login failed') {
            setFormState({ error: 'The provided credentials cannot log into that instance.' });
          } else if (response.error && is_ssl) {
            setFormState({ error: 'You may need to accept the instance\'s self-signed cert', url });
          } else {
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
          <ContentContainer header="Instance Name" className="mb-4">
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
          </ContentContainer>

          <ContentContainer header="Create Instance Admin Credentials" className="mb-4">
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

          <ContentContainer header="Instance Details">
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
            &nbsp;
            {formState.url && (<a href={formState.url} target="_blank" rel="noopener noreferrer"><i className="fa fa-external-link-square" /></a>)}
          </CardBody>
        </Card>
      )}
    </>
  );
};
