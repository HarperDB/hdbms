/* eslint-disable max-lines */
import React, { useState } from 'react';
import { Col, Input, Row, Button, Card, CardBody } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import appState from '../../../functions/state/appState';
import useNewInstance from '../../../functions/state/newInstance';
import ContentContainer from '../../shared/ContentContainer';
import RadioCheckbox from '../../shared/RadioCheckbox';
import registrationInfo from '../../../functions/api/instance/registrationInfo';
import isAlphaUnderscoreHyphen from '../../../functions/util/isAlphaUnderscoreHyphen';
import isAlphaNumericHyphen from '../../../functions/util/isAlphaNumericHyphen';
import userInfo from '../../../functions/api/instance/userInfo';
function MetaLocal() {
  const navigate = useNavigate();
  const {
    customerId
  } = useParams();
  const instanceNames = useStoreState(appState, s => s.instances.map(i => i.instanceName));
  const instanceURLs = useStoreState(appState, s => s.instances.map(i => i.url));
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    instanceName: newInstance.instanceName || '',
    user: newInstance.user || '',
    pass: newInstance.pass || '',
    host: newInstance.host || '',
    port: newInstance.port || '',
    isSsl: newInstance.isSsl || false
  });
  useAsyncEffect(async () => {
    const {
      submitted
    } = formState;
    const {
      instanceName,
      user,
      pass,
      host,
      port,
      isSsl
    } = formData;
    if (submitted) {
      const url = `${isSsl ? 'https://' : 'http://'}${host}:${port}`;
      if (instanceNames.includes(instanceName)) {
        setFormState({
          error: `An instance named "${instanceName}" already exists`
        });
      } else if (!instanceName) {
        setFormState({
          error: 'instance name is required'
        });
      } else if (instanceURLs.includes(url)) {
        setFormState({
          error: `An instance at "${url}" already exists`
        });
      } else if (!isAlphaNumericHyphen(instanceName)) {
        setFormState({
          error: 'instance names must have only letters, numbers, and hyphen'
        });
      } else if (instanceName.length > 16) {
        setFormState({
          error: 'instance names are limited to 16 characters'
        });
      } else if (user && !isAlphaUnderscoreHyphen(user)) {
        setFormState({
          error: 'usernames must have only letters, underscores, and hyphens'
        });
      } else if (instanceName.length && user.length && pass.length && host.length && port.length) {
        try {
          const currentUser = await userInfo({
            auth: {
              user,
              pass
            },
            url,
            isLocal: true,
            customerId
          });
          if (currentUser.error && currentUser.message === 'Login failed') {
            setFormState({
              error: 'The provided credentials cannot log into that instance.'
            });
          } else if (currentUser.error && currentUser.type === 'catch') {
            setFormState({
              error: isSsl ? "You may need to accept the instance's self-signed cert" : "Can't reach non-SSL instance. Enable SSL?",
              url: isSsl ? url : 'https://harperdb.io/developers/documentation/security/configuration/'
            });
          } else {
            const instanceData = {
              instanceName: instanceName.replace(/-+$/, ''),
              user,
              pass,
              host,
              port,
              isSsl
            };
            if (currentUser.role.permission.superUser) {
              instanceData.super = true;
              const registrationResponse = await registrationInfo({
                auth: {
                  user,
                  pass
                },
                url,
                isLocal: true,
                customerId
              });
              if (registrationResponse.ramAllocation) {
                instanceData.registered = registrationResponse.registered;
                instanceData.ramAllocation = registrationResponse.ramAllocation;
              }
            }
            setNewInstance({
              ...newInstance,
              ...instanceData
            });
            setTimeout(() => navigate(`/o/${customerId}/instances/new/details_local`), 0);
          }
        } catch (e) {
          setFormState({
            error: 'We found no HarperDB at that url/port. Is it running?'
          });
        }
      } else {
        setFormState({
          error: 'All fields must be filled out.'
        });
      }
    }
  }, [formState]);
  useAsyncEffect(() => {
    if (!formState.submitted) setFormState({});
  }, [formData]);
  return <>
      <Card>
        <CardBody>
          <ContentContainer header="Instance Name" subheader="letters, numbers, and hyphens only. 16 char max.">
            <Row>
              <Col sm="4" className="pt-2 text-nowrap text-grey">
                Example: &quot;local-1&quot;
              </Col>
              <Col sm="8">
                <Input id="instance_name" onChange={e => setFormData({
                ...formData,
                instanceName: e.target.value.replace(/^0+/, '').replace(/^-+/, '').replace(/[^a-z\d-]+/gi, '').substring(0, 15).toLowerCase()
              })} type="text" title="instance_name" value={formData.instanceName} />
              </Col>
            </Row>
          </ContentContainer>
          <ContentContainer header="Instance Credentials" subheader="From Installation.  250 char max.">
            <Row>
              <Col sm="4" className="pt-2 text-grey">
                Username
              </Col>
              <Col sm="8">
                <Input id="username" onChange={e => setFormData({
                ...formData,
                user: e.target.value.substring(0, 249)
              })} type="text" title="username" value={formData.user} />
              </Col>
            </Row>
            <hr className="my-2 d-none d-sm-block" />
            <Row>
              <Col sm="4" className="pt-2 text-grey">
                Password
              </Col>
              <Col sm="8">
                <Input id="password" onChange={e => setFormData({
                ...formData,
                pass: e.target.value.substring(0, 249)
              })} type="password" title="password" value={formData.pass} />
              </Col>
            </Row>
          </ContentContainer>
          <ContentContainer header="Instance Details">
            <Row>
              <Col sm="4" className="pt-2 text-grey">
                Host
              </Col>
              <Col sm="8">
                <Input id="host" onChange={e => setFormData({
                ...formData,
                host: e.target.value
              })} type="text" title="host" value={formData.host || ''} />
              </Col>
            </Row>
            <hr className="my-2 d-none d-sm-block" />
            <Row>
              <Col sm="4" className="pt-2 text-grey">
                Port
              </Col>
              <Col sm="8">
                <Input id="port" onChange={e => setFormData({
                ...formData,
                port: e.target.value
              })} type="number" title="port" value={formData.port || ''} />
              </Col>
            </Row>
            <hr className="my-2 d-none d-sm-block" />
            <Row>
              <Col xs="4" className="pt-2 text-grey">
                SSL
              </Col>
              <Col xs="8" className="pt-1">
                <RadioCheckbox id="is_ssl" tabIndex="0" type="checkbox" onChange={value => setFormData({
                ...formData,
                isSsl: value || false
              })} options={{
                label: '',
                value: true
              }} value={formData.isSsl || false} defaultValue={formData.isSsl ? {
                label: '',
                value: true
              } : undefined} />
              </Col>
            </Row>
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button id="instanceType" onClick={() => navigate(`/o/${customerId}/instances/new/type`)} title="Back to Instance Type" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left me-2" />
            Instance Type
          </Button>
        </Col>
        <Col sm="6">
          <Button id="instanceDetails" onClick={() => setFormState({
          submitted: true
        })} title="Instance Details" block className="mt-3" color="purple">
            Instance Details
            <i className="fa fa-chevron-circle-right ms-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && <Card className="mt-3 error">
          <CardBody>
            {formState.error}
            &nbsp;
            {formState.url && <a href={formState.url} target="_blank" rel="noopener noreferrer">
                <i className="ms-3 fa fa-lg fa-external-link-square text-purple" />
              </a>}
          </CardBody>
        </Card>}
    </>;
}
export default MetaLocal;