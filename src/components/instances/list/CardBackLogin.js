import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import useInstanceAuth from '../../../functions/state/instanceAuths';
import handleCloudInstanceUsernameChange from '../../../functions/instances/handleCloudInstanceUsernameChange';
import userInfo from '../../../functions/api/instance/userInfo';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import CardInstanceUpdateRole from './CardInstanceUpdateRole';

function CardBackLogin({ compute_stack_id, url, is_ssl, setFlipState, flipState, instance_id, is_local, wavelength_zone_id }) {
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { user, pass } = formData;
      if (!user || !pass) {
        setFormState({ error: 'All fields are required' });
      } else {
        const result = await userInfo({ auth: { user, pass }, url });

        if (is_ssl && result.error && result.type === 'catch') {
          setFormState({ error: 'Login failed. Click to verify status?', url });
        } else if (result.error && wavelength_zone_id && result.type === 'catch') {
          setFormState({ error: "Can't reach Wavelength instance. On Verizon?", url: false });
        } else if (result.error && result.type === 'catch') {
          setFormState({ error: "Can't reach non-SSL instance. Enable SSL?", url: 'https://harperdb.io/developers/documentation/security/configuration/' });
        } else if (((result.error && result.message === 'Login failed') || result.error === 'Login failed') && !is_local) {
          const handleCloudInstanceUsernameChangeResult = await handleCloudInstanceUsernameChange({ instance_id, instanceAuth: { user, pass }, url });

          if (handleCloudInstanceUsernameChangeResult) {
            setInstanceAuths({ ...instanceAuths, [compute_stack_id]: { user: formData.user, pass: formData.pass, super: true } });
            setTimeout(() => setFlipState(false), 100);
          } else {
            setFormState({ error: 'Login failed. Using instance credentials?', url: 'https://harperdb.io/docs/harperdb-studio/instances/#instance-login' });
          }
        } else if ((result.error && result.message === 'Login failed') || result.error === 'Login failed') {
          setFormState({ error: 'Login failed. Using instance credentials?', url: 'https://harperdb.io/docs/harperdb-studio/instances/#instance-login' });
        } else if (result.error) {
          setFormState({ error: result.message || result.error });
        } else {
          setInstanceAuths({
            ...instanceAuths,
            [compute_stack_id]: { user: formData.user, pass: formData.pass, super: result.role.permission.super_user, structure: result.role.permission.structure_user },
          });
          setTimeout(() => setFlipState(false), 100);
        }
      }
    }
  }, [formState]);

  const keyDown = (e) => {
    if (e.code === 'Enter') {
      setFormState({ submitted: true });
    }
  };

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Card className="instance">
        {flipState && ( // don't render the forms unless the card is flipped, as the autocomplete icon shows through
          <CardBody>
            {formState.error && formState.error.indexOf('This instance was recently') !== -1 ? (
              <CardInstanceUpdateRole formState={formState} setFormData={setFormData} setFormState={setFormState} />
            ) : (
              <>
                <Input
                  id="username"
                  onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  className="text-center mb-1"
                  type="text"
                  title="instance user"
                  placeholder="instance user"
                  disabled={formState.submitted}
                  onKeyDown={keyDown}
                />
                <Input
                  id="password"
                  onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                  className="text-center mb-2"
                  type="password"
                  title="instance password"
                  placeholder="instance password"
                  disabled={formState.submitted}
                  onKeyDown={keyDown}
                />
                <Row className="g-0">
                  <Col xs="6" className="pe-1">
                    <Button
                      onClick={() => {
                        setFormData({});
                        setFormState({});
                        setFlipState(false);
                      }}
                      title="Cancel"
                      block
                      color="grey"
                      disabled={formState.submitted}
                    >
                      Cancel
                    </Button>
                  </Col>
                  <Col xs="6" className="ps-1">
                    <Button onClick={() => setFormState({ submitted: true })} title="Log Into Instance" block color="success" disabled={formState.submitted}>
                      {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Log In</span>}
                    </Button>
                  </Col>
                </Row>
                {formState.error && (
                  <a href={formState.url || null} target="_blank" rel="noopener noreferrer" className="text-bold text-center text-small text-danger d-block mt-2 text-nowrap">
                    {formState.error}
                    {formState.url && <i className="ms-2 fa fa-lg fa-external-link-square text-purple" />}
                  </a>
                )}
              </>
            )}
          </CardBody>
        )}
      </Card>
    </ErrorBoundary>
  );
}

export default CardBackLogin;
