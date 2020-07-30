import React, { useState } from 'react';
import { Col, Input, Row, Button, Card, CardBody } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import useNewInstance from '../../../state/newInstance';
import ContentContainer from '../../shared/contentContainer';
import RadioCheckbox from '../../shared/radioCheckbox';
import registrationInfo from '../../../api/instance/registrationInfo';
import isAlphaUnderscoreHyphen from '../../../methods/util/isAlphaUnderscoreHyphen';
import isAlphaNumericHyphen from '../../../methods/util/isAlphaNumericHyphen';
import userInfo from '../../../api/instance/userInfo';

export default () => {
  const history = useHistory();
  const { customer_id } = useParams();
  const instanceNames = useStoreState(appState, (s) => s.instances.map((i) => i.instance_name));
  const instanceURLs = useStoreState(appState, (s) => s.instances.map((i) => i.url));
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
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
      } else if (!instance_name) {
        setFormState({ error: 'instance name is required' });
      } else if (instanceURLs.includes(url)) {
        setFormState({ error: `An instance at "${url}" already exists` });
      } else if (!isAlphaNumericHyphen(instance_name)) {
        setFormState({ error: 'instance names must have only letters, numbers, and hyphen' });
      } else if (instance_name.length > 16) {
        setFormState({ error: 'instance names are limited to 16 characters' });
      } else if (user && !isAlphaUnderscoreHyphen(user)) {
        setFormState({ error: 'usernames must have only letters, underscores, and hyphens' });
      } else if (instance_name.length && user.length && pass.length && host.length && port.length) {
        try {
          const currentUser = await userInfo({ auth: { user, pass }, url, is_local: true, customer_id });

          if (currentUser.error && currentUser.message === 'Login failed') {
            setFormState({ error: 'The provided credentials cannot log into that instance.' });
          } else if (currentUser.error && currentUser.type === 'catch') {
            setFormState({
              error: is_ssl ? "You may need to accept the instance's self-signed cert" : "Can't reach non-SSL instance. Enable SSL?",
              url: is_ssl ? url : 'https://harperdbhelp.zendesk.com/hc/en-us/articles/115000831074-SSL-with-HarperDB',
            });
          } else {
            const instanceData = {
              instance_name: instance_name.replace(/-+$/, ''),
              user,
              pass,
              host,
              port,
              is_ssl,
            };
            if (currentUser.role.permission.super_user) {
              instanceData.super = true;
              const registrationResponse = await registrationInfo({ auth: { user, pass }, url, is_local: true, customer_id });

              if (registrationResponse.ram_allocation) {
                instanceData.registered = registrationResponse.registered;
                instanceData.ram_allocation = registrationResponse.ram_allocation;
              }
            }
            setNewInstance({ ...newInstance, ...instanceData });
            setTimeout(() => history.push(`/o/${customer_id}/instances/new/details_local`), 0);
          }
        } catch (e) {
          setFormState({ error: 'We found no HarperDB at that url/port. Is it running?' });
        }
      } else {
        setFormState({ error: 'All fields must be filled out.' });
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) setFormState({});
  }, [formData]);

  return (
    <>
      <Card>
        <CardBody>
          <ContentContainer header="Instance Name" subheader="letters, numbers, and hyphens only. 16 char max.">
            <Row>
              <Col sm="4" className="pt-2 text-nowrap text-grey">
                Example: &quot;local-1&quot;
              </Col>
              <Col sm="8">
                <Input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instance_name: e.target.value
                        .replace(/^0+/, '')
                        .replace(/^-+/, '')
                        .replace(/[^a-zA-Z0-9\d-]+/gi, '')
                        .substring(0, 15)
                        .toLowerCase(),
                    })
                  }
                  type="text"
                  title="instance_name"
                  value={formData.instance_name}
                />
              </Col>
            </Row>
          </ContentContainer>
          <ContentContainer header="Instance Credentials" subheader="From Installation.  250 char max.">
            <Row>
              <Col sm="4" className="pt-2 text-grey">
                Username
              </Col>
              <Col sm="8">
                <Input onChange={(e) => setFormData({ ...formData, user: e.target.value.substring(0, 249) })} type="text" title="username" value={formData.user} />
              </Col>
            </Row>
            <hr className="my-2 d-none d-sm-block" />
            <Row>
              <Col sm="4" className="pt-2 text-grey">
                Password
              </Col>
              <Col sm="8">
                <Input onChange={(e) => setFormData({ ...formData, pass: e.target.value.substring(0, 249) })} type="password" title="password" value={formData.pass} />
              </Col>
            </Row>
          </ContentContainer>
          <ContentContainer header="Instance Details">
            <Row>
              <Col sm="4" className="pt-2 text-grey">
                Host
              </Col>
              <Col sm="8">
                <Input onChange={(e) => setFormData({ ...formData, host: e.target.value })} type="text" title="host" value={formData.host || ''} />
              </Col>
            </Row>
            <hr className="my-2 d-none d-sm-block" />
            <Row>
              <Col sm="4" className="pt-2 text-grey">
                Port
              </Col>
              <Col sm="8">
                <Input onChange={(e) => setFormData({ ...formData, port: e.target.value })} type="number" title="port" value={formData.port || ''} />
              </Col>
            </Row>
            <hr className="my-2 d-none d-sm-block" />
            <Row>
              <Col xs="4" className="pt-2 text-grey">
                SSL
              </Col>
              <Col xs="8" className="pt-1">
                <RadioCheckbox
                  tabIndex="0"
                  type="checkbox"
                  onChange={(value) => setFormData({ ...formData, is_ssl: value || false })}
                  options={{ label: '', value: true }}
                  value={formData.is_ssl || false}
                  defaultValue={formData.is_ssl ? { label: '', value: true } : undefined}
                />
              </Col>
            </Row>
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button onClick={() => history.push(`/o/${customer_id}/instances/new/type`)} title="Back to Instance Type" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left mr-2" />
            Instance Type
          </Button>
        </Col>
        <Col sm="6">
          <Button onClick={() => setFormState({ submitted: true })} title="Instance Details" block className="mt-3" color="purple">
            Instance Details
            <i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>
            {formState.error}
            &nbsp;
            {formState.url && (
              <a href={formState.url} target="_blank" rel="noopener noreferrer">
                <i className="ml-3 fa fa-lg fa-external-link-square text-purple" />
              </a>
            )}
          </CardBody>
        </Card>
      )}
    </>
  );
};
