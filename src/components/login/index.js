import React, { useState } from 'react';
import { Card, CardBody, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';

import useLMS from '../../state/stores/lmsAuth';

import defaultAuthFormData from '../../state/defaults/defaultAuthFormData';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';

import getUser from '../../api/lms/getUser';
import useApp from '../../state/stores/appData';
import defaultAppData from '../../state/defaults/defaultAppData';
import isEmail from '../../util/isEmail';

export default () => {
  const [lmsAuth, setLMSAuth] = useLMS(defaultLMSAuth);
  const [appData, setAppData] = useApp(defaultAppData);
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState(defaultAuthFormData);
  const history = useHistory();

  const handleKeydown = (e) => { if (e.keyCode === 13) setFormState({ submitted: true }); };

  useAsyncEffect(async () => {
    const { user, pass } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!isEmail(user)) {
        setFormState({ error: 'invalid email supplied', submitted: false });
      } else if (!user || !pass) {
        setFormState({ error: 'all fields are required', submitted: false });
      } else {
        const response = await getUser({ auth: { user, pass }, payload: { email: user } });
        if (response.result === false) {
          setFormState({ error: response.message, submitted: false });
          setLMSAuth(defaultLMSAuth);
        } else {
          setLMSAuth({ user, pass });
          setFormState({ error: false, submitted: false });
          setAppData({ ...appData, user: response });
          history.push('/instances');
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    const { user, pass } = lmsAuth;
    const { submitted } = formData;
    if (user && pass && !submitted) {
      updateForm({ user, pass, submitted: true, error: false });
    }
  }, [lmsAuth]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <Card className="mb-3 mt-2">
        <CardBody>
          <Input
            onChange={(e) => updateForm({ ...formData, user: e.target.value })}
            onKeyDown={handleKeydown}
            className="mb-2 text-center"
            type="text"
            title="email"
            placeholder="email address"
          />
          <Input
            onChange={(e) => updateForm({ ...formData, pass: e.target.value })}
            onKeyDown={handleKeydown}
            className="mb-4 text-center"
            type="password"
            title="password"
            placeholder="password"
          />
          <Button
            onClick={() => setFormState({ submitted: true })}
            title="Log Into My Account"
            block
            color="purple"
          >
            Log In
          </Button>
        </CardBody>
      </Card>
      <div id="login-error" className="text-small text-white text-center">
        {formState.error}&nbsp;
      </div>
    </div>
  );
};
