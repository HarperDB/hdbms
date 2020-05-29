import React, { useState } from 'react';
import { Button, Input, CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';
import { useLocation, useParams } from 'react-router-dom';

import alterUser from '../../../api/instance/alterUser';
import instanceState from '../../../state/instanceState';

export default () => {
  const { username } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const alert = useAlert();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  const updatePassword = async () => {
    const { password } = formData;

    if (!password) {
      setFormState({ error: 'password is required' });
    } else {
      const response = await alterUser({ auth, url, username, password });

      if (response.message.indexOf('updated') !== -1) {
        alert.success('password updated');
        instanceState.update((s) => {
          s.lastUpdate = Date.now();
        });
        setTimeout(() => history.push(pathname.replace(`/${username}`, '')), 0);
      } else {
        setFormState({ error: response.message });
      }
    }
  };

  return (
    <>
      <Input
        type="text"
        className="mb-2 text-center"
        name="password"
        placeholder="enter new password"
        value={formData.password || ''}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button block color="purple" onClick={updatePassword}>
        Update Password
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};
