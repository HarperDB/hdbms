import React, { useState } from 'react';
import { Button, Input, CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';
import { useLocation, useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import alterUser from '../../../api/instance/alterUser';
import instanceState from '../../../state/instanceState';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default () => {
  const { customer_id, compute_stack_id, username } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const alert = useAlert();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);

  const updatePassword = async () => {
    const { password } = formData;

    if (!password) {
      setFormState({ error: 'password is required' });
    } else {
      const response = await alterUser({ auth, url, username, password, is_local, compute_stack_id, customer_id });

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
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
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
    </ErrorBoundary>
  );
};
