import React, { useState } from 'react';
import { Card, CardBody, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';

import useLMS from '../stores/lmsData';
import queryLMS from '../util/queryLMS';
import defaultFormData from '../util/defaultFormData';
import defaultLMSData from '../util/defaultLMSData';

export default () => {
  const [lmsData, setLMSData] = useLMS(defaultLMSData);
  const [formData, updateForm] = useState(defaultFormData);
  const history = useHistory();

  useAsyncEffect(async () => {
    if (formData.submitted) {
      const instances = await queryLMS({
        endpoint: 'getInstances',
        method: 'GET',
        auth: lmsData.auth,
      });
      if (instances.error) {
        updateForm({ ...formData, error: instances.error, submitted: false });
        setLMSData(defaultLMSData);
      } else {
        setLMSData({ auth: { user: formData.user, pass: formData.pass }, instances });
        history.push('/instances');
      }
    }
  }, [formData]);

  useAsyncEffect(() => {
    if (lmsData.auth.user && lmsData.auth.pass && !formData.submitted) {
      updateForm({ user: lmsData.auth.user, pass: lmsData.auth.pass, submitted: true, error: false });
    }
  }, [lmsData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <Card className="mb-3 mt-2 dark">
        <CardBody>
          <Input
            onChange={(e) => updateForm({ ...formData, user: e.target.value })}
            className="mb-2 text-center"
            type="text"
            name="LMS_USER"
            title="Username"
            placeholder="Username"
          />
          <Input
            onChange={(e) => updateForm({ ...formData, pass: e.target.value })}
            className="mb-4 text-center"
            type="password"
            name="LMS_PASS"
            title="Password"
            placeholder="Password"
          />
          <Button
            onClick={() => updateForm({ ...formData, submitted: true })}
            title="Log Into My Account"
            block
            color="black"
          >
            Log Into My Account
          </Button>
        </CardBody>
      </Card>
      <div id="login-error" className="text-small text-white text-center">
        {formData.error}&nbsp;
      </div>
    </div>
  );
};
