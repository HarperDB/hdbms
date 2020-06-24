import React, { useState } from 'react';
import { Button, SelectDropdown, CardBody, Card } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useLocation, useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import alterUser from '../../../api/instance/alterUser';
import instanceState from '../../../state/instanceState';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default () => {
  const { customer_id, compute_stack_id, username } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const thisUser = useStoreState(instanceState, (s) => s.users && s.users.find((u) => u.username === username));

  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const alert = useAlert();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const roles = useStoreState(instanceState, (s) => s.roles);

  const updateRole = async () => {
    const { newRole } = formData;

    if (!newRole) {
      setFormState({ error: 'role is required' });
    } else if (thisUser.role.id === newRole) {
      setFormState({ error: 'user already has this role' });
    } else {
      const response = await alterUser({ auth, url, username, role: newRole });

      if (response.message.indexOf('updated') !== -1) {
        alert.success('user role updated');
        instanceState.update((s) => {
          s.lastUpdate = Date.now();
        });
        setTimeout(() => history.push(pathname.replace(`/${username}`, '')), 0);
      } else {
        setFormState({ error: response.message });
      }
    }
  };

  useAsyncEffect(() => setFormData({ ...formData, role: thisUser?.role?.id }), []);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <SelectDropdown
        className="react-select-container mb-2"
        classNamePrefix="react-select"
        onChange={({ value }) => setFormData({ ...formData, newRole: value })}
        options={roles && thisUser?.role?.id && roles.filter((r) => r.id !== thisUser.role.id).map((r) => ({ label: r.role, value: r.id }))}
        value={roles && thisUser?.role?.id && roles.find((r) => r.value === thisUser.role.id)}
        isSearchable={false}
        isClearable={false}
        isLoading={!roles}
        placeholder="select a role"
        styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
      />
      <Button block color="purple" onClick={updateRole}>
        Update Role
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </ErrorBoundary>
  );
};
